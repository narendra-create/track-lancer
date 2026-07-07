import { prisma } from "@/app/lib/prisma";
import { createBudgetInput } from "../validations/Budgetrequest";
import { getSession } from "../session";

export const raiseBudgetRequest = async (input: createBudgetInput) => {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", status: 401 };
    if (session.user.role.toLowerCase() !== "freelancer") return { success: false, error: "Forbidden", status: 403 };

    const freelancer = await prisma.freelancer.findUnique({
        where: { userId: session.user.id },
        select: { id: true }
    });
    if (!freelancer) return { success: false, error: "Profile Not found", status: 404 };

    const project = await prisma.project.findFirst({
        where: { id: input.projectId, freelancerId: freelancer.id },
        include: {
            milestones: {
                select: {
                    milestonecost: true
                }
            }
        }
    });
    if (!project) {
        return { success: false, error: "This project is not associated with your account", status: 403 };
    };

    if (project.status !== "ACTIVE" && project.status !== "STOPPED") {
        return { success: false, error: "Requests can only be created for active/stopped projects", status: 422 };
    };

    const totalUsed = project.milestones.reduce((sum, m) => sum + m.milestonecost, 0);
    const remainingCost = project.agreedCost - totalUsed;
    const newBudget = project.agreedCost + input.requestedAmount;

    if (input.requestedAmount < remainingCost) {
        return { success: false, error: "Use Your Remaining Budget First", status: 400 }
    };

    try {
        const createdRequest = await prisma.budgetRaiseRequest.create({
            data: {
                projectId: project.id,
                currentBudget: project.agreedCost,
                reason: input.reason,
                requestedBudget: newBudget,
                requestedById: freelancer.id,
                status: "PENDING"
            }
        });

        return { success: true, request: createdRequest, extra: `+${input.requestedAmount}`, status: 201 }
    }
    catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : "Server Error",
            status: 500
        };
    }
};

export const processRequest = async (budgetId: string, status: "APPROVED" | "REJECTED") => {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", status: 401 };
    if (session.user.role.toLowerCase() !== "client") return { success: false, error: "Forbidden", status: 403 };

    const clientprofile = await prisma.userprofile.findUnique({
        where: { userId: session.user.id },
        select: { id: true }
    });
    if (!clientprofile) return { success: false, error: "Request Not found", status: 404 };
    const request = await prisma.budgetRaiseRequest.findFirst({
        where: {
            id: budgetId,
            project: { clientId: clientprofile.id }
        },
        include: {
            project: true
        }
    })
    if (!request) {
        return { success: false, error: "This request is not associated with your account", status: 403 };
    };

    if (request.status !== "PENDING") {
        return {
            success: false,
            error: `Request is already ${request.status}`,
            status: 409,
        };
    }
    if (
        status === "APPROVED" &&
        request.project.status !== "ACTIVE" &&
        request.project.status !== "STOPPED"
    ) {
        return {
            success: false,
            error: "You can only approve requests from active or stopped projects.",
            status: 422,
        };
    }

    try {
        const updatedrequest = await prisma.$transaction(async (tx) => {
            const updatedRequest = await tx.budgetRaiseRequest.update({
                where: {
                    id: request.id
                },
                data: {
                    status: status
                }
            });
            if (status === "APPROVED") {
                await tx.project.update({
                    where: { id: request.projectId },
                    data: {
                        agreedCost: updatedRequest.requestedBudget
                    }
                });
            };
            return updatedRequest;
        });

        return { success: true, updatedrequest: updatedrequest, status: 200 };
    }
    catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : "Server Error",
            status: 500
        };
    }
};

export const getBudgetRequests = async () => {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", status: 401 };
    const role = session.user.role.toLowerCase();
    if (role !== "freelancer" && role !== "client") return { success: false, error: "Forbidden", status: 403 };

    let where;

    if (role === "client") {
        const profile = await prisma.userprofile.findUnique({
            where: {
                userId: session.user.id,
            },
            select: {
                id: true,
            },
        });

        if (!profile)
            return {
                success: false,
                error: "Profile not found",
                status: 404,
            };

        where = {
            project: {
                clientId: profile.id,
            },
        };
    } else {
        const profile = await prisma.freelancer.findUnique({
            where: {
                userId: session.user.id,
            },
            select: {
                id: true,
            },
        });

        if (!profile)
            return {
                success: false,
                error: "Profile not found",
                status: 404,
            };

        where = {
            requestedById: profile.id,
        };
    };

    const requests = await prisma.budgetRaiseRequest.findMany({
        where,
        include: {
            project: {
                select: {
                    id: true,
                    title: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return { success: true, requests: requests, status: 200 }
};

export const deleteBudgetRequest = async (budgetId: string) => {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", status: 401 };
    if (session.user.role.toLowerCase() !== "freelancer") return { success: false, error: "Forbidden", status: 403 };

    const freelancer = await prisma.freelancer.findUnique({
        where: { userId: session.user.id },
        select: { id: true }
    });
    if (!freelancer) return { success: false, error: "Profile Not found", status: 404 };

    const request = await prisma.budgetRaiseRequest.findFirst({
        where: { id: budgetId, requestedById: freelancer.id },
        select: {
            id: true,
            status: true
        }
    });
    if (!request) {
        return { success: false, error: "This budget request is not associated with your account.", status: 403 };
    };
    if (request.status !== "PENDING") {
        return { success: false, error: "Only pending requests can be deleted.", status: 409 }
    }

    try {
        const deleted = await prisma.budgetRaiseRequest.delete({
            where: { id: request.id }
        });
        return { success: true, deletedRequestId: deleted.id, status: 200 };
    }
    catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : "Server Error",
            status: 500
        };
    }
};

export const markReviewed = async (budgetId: string) => {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", status: 401 };
    if (session.user.role.toLowerCase() !== "client") return { success: false, error: "Forbidden", status: 403 };

    const clientprofile = await prisma.userprofile.findUnique({
        where: { userId: session.user.id },
        select: { id: true }
    });
    if (!clientprofile) return { success: false, error: "Request Not found", status: 404 };
    const request = await prisma.budgetRaiseRequest.findFirst({
        where: {
            id: budgetId,
            project: { clientId: clientprofile.id }
        }
    })
    if (!request) {
        return;
    };
    if (request.status !== "PENDING") {
        return;
    }
    if (request.reviewedAt) {
        return;
    }
    await prisma.budgetRaiseRequest.update({
        where: {
            id: budgetId
        },
        data: {
            reviewedAt: new Date(),
        },
    });
};

export const getProjectBudgetRequests = async (projectId: string) => {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", status: 401 };
    const role = session.user.role.toLowerCase();
    if (role !== "freelancer" && role !== "client") return { success: false, error: "Forbidden", status: 403 };

    const requests = await prisma.budgetRaiseRequest.findMany({
        where: { projectId: projectId },
        include: {
            project: {
                select: {
                    id: true,
                    title: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return { success: true, requests: requests, status: 200 }
};
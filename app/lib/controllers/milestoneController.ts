import { prisma } from "@/app/lib/prisma";
import { getSession } from "../session";
import type { createMilestoneInput, delayMilestoneInput } from "../validations/MilestoneValidation";
import { userrole } from "@/app/generated/prisma/enums";

export const createMilestone = async (input: createMilestoneInput) => {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", status: 401 };
    if (session.user.role.toLowerCase() !== "freelancer") return { success: false, error: "Forbidden", status: 403 };

    const freelancer = await prisma.freelancer.findUnique({
        where: { userId: session.user.id },
        select: { id: true }
    });
    if (!freelancer) return { success: false, error: "Profile Not found", status: 404 };

    const project = await prisma.project.findFirst({
        where: { id: input.projectId, freelancerId: freelancer.id, archivedByFreelancer: false },
        include: {
            milestones: true
        }
    });
    if (!project) {
        return { success: false, error: "This project is not associated with your account", status: 403 };
    };

    if (project.status !== "ACTIVE") {
        return { success: false, error: "Milestones can only be created for active projects", status: 422 };
    };

    const sumOfMilestones = project.milestones.reduce((sum, p) => sum + p.milestonecost, 0);
    if (sumOfMilestones >= project.agreedCost) {
        return { success: false, error: "Budget Reached - Make a budget raise request to continue", status: 400 }
    };
    const RemainingCost = project.agreedCost - sumOfMilestones;
    if (input.cost > RemainingCost) {
        return { success: false, error: `Remaining Cost is - ${RemainingCost}, Please enter an amount under it`, status: 400 }
    }
    const hasActiveMilestone = project.milestones.some(
        (m) => m.status === "IN_PROGRESS"
    );
    const last = await prisma.milestone.findFirst({
        where: {
            projectId: input.projectId
        },
        orderBy: {
            position: "desc"
        },
        select: {
            position: true
        }
    });

    const position = last ? last.position + 1 : 1;

    const status = hasActiveMilestone
        ? "NOT_STARTED"
        : "IN_PROGRESS";

    try {
        const createdMilestone = await prisma.milestone.create({
            data: {
                projectId: project.id,
                title: input.title,
                subtitle: input.subtitle ?? null,
                milestonecost: input.cost,
                description: input.description ?? null,
                status,
                delay: false,
                deadline: new Date(input.deadline),
                position: position
            }
        });

        return { success: true, milestone: createdMilestone, status: 201 };
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
        }
        console.error("From creatMilestone", error);
        return { success: false, error: "Server Error", status: 500 };
    }
};

export const getAllMilestones = async (projectId: string, profileId: string, role: userrole) => {
    if (!projectId) {
        return { success: false, error: "Provide projectId", status: 400 };
    };
    if (role !== "CLIENT" && role !== "FREELANCER") {
        return { success: false, error: "Invalid role", status: 400 }
    }
    try {
        const findproject = await prisma.project.findFirst({
            where: role === "FREELANCER"
                ? { id: projectId, freelancerId: profileId }
                : { id: projectId, clientId: profileId },
            select: {
                id: true,
                title: true,
                projectcode: true,
                agreedCost: true,
                createdAt: true,
                deadline: true,
                status: true,
                hasCancelRequest: true,
                cancellRequests: {
                    where: { isRejected: false },
                    take: 1,
                    orderBy: { createdAt: "desc" },
                    select: {
                        clientApproved: true,
                        freelancerApproved: true,
                    }
                },
                milestones: {
                    select: {
                        createdAt: true,
                        deadline: true,
                        delay: true,
                        delayreason: true,
                        description: true,
                        id: true,
                        milestonecost: true,
                        status: true,
                        subtitle: true,
                        title: true,
                        updatedAt: true
                    },
                    orderBy: {
                        position: "asc"
                    }
                },
                payments: {
                    select: {
                        paid_amount: true
                    }
                }
            }
        });
        if (!findproject) {
            return { success: false, error: "This project is not associated with your account" };
        };

        return { success: true, project: findproject, status: 200 };
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
        }
        console.error("From getAllmilestones", error);
        return { success: false, error: "Server Error", status: 500 };
    }
}

export const stopProject = async (projectId: string) => {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", status: 401 };
    if (session.user.role.toLowerCase() !== "client") return { success: false, error: "Forbidden", status: 403 };

    const client = await prisma.userprofile.findUnique({
        where: { userId: session.user.id },
        select: { id: true }
    });
    if (!client) return { success: false, error: "Profile Not found", status: 404 };

    const findproject = await prisma.project.findFirst({
        where: { id: projectId, clientId: client.id }
    });
    if (!findproject) {
        return { success: false, error: "You can only edit your projects", status: 403 }
    };
    if (findproject.status === "PENDING" || findproject.status === "COMPLETED" || findproject.status === "CANCELLED") {
        return { success: false, error: "Project is not Active", status: 400 }
    }

    try {
        await prisma.$transaction(async (tx) => {
            await tx.project.update({
                where: { id: projectId },
                data: {
                    status: "STOPPED",
                    stoppedAt: new Date()
                }
            })
            await tx.milestone.updateMany({
                where: { projectId: projectId, project: { clientId: client.id }, status: "NOT_STARTED" },
                data: {
                    status: "STOPPED"
                }
            })
        });

        return { success: true, status: 200 };
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
        };
        console.error("From stopProject", error);
        return { success: false, error: "Server Error", status: 500 }
    }
};

export const delayMilestone = async (input: delayMilestoneInput) => {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", status: 401 };
    if (session.user.role.toLowerCase() !== "freelancer") return { success: false, error: "Forbidden", status: 403 };

    const findFreelancer = await prisma.freelancer.findFirst({
        where: { userId: session.user.id },
        select: {
            id: true
        }
    });
    if (!findFreelancer) return { success: false, error: "Profile Not found", status: 404 };

    const findMilestone = await prisma.milestone.findFirst({
        where: { id: input.milestoneId, project: { freelancerId: findFreelancer.id, archivedByFreelancer: false } },
        include: { project: true }
    });

    if (findMilestone && findMilestone.project.status !== "ACTIVE") {
        return { success: false, error: "You cannot delay a milestone for a stopped or completed project", status: 400 };
    }

    if (!findMilestone) {
        return { success: false, error: "Your account is not linked with this milestone", status: 403 }
    };
    if (findMilestone.status !== "IN_PROGRESS") {
        return {
            success: false,
            error: "Only active milestones can be delayed.",
            status: 400
        }
    };
    if (input.newDeadline <= findMilestone.deadline) {
        return {
            success: false,
            error: "New deadline must be after the current deadline.",
            status: 400
        };
    }
    const lastDelay = await prisma.milestonedelay.findFirst({
        where: { milestoneId: input.milestoneId },
        orderBy: { createdAt: "desc" }
    });

    if (
        lastDelay &&
        Date.now() - lastDelay.createdAt.getTime() < 5 * 60 * 1000
    ) {
        return {
            success: false,
            error: "You can delay this milestone only once every 5 minutes.",
            status: 429
        };
    };

    if (input.newDeadline.getTime() === findMilestone.deadline.getTime()) {
        return {
            success: false,
            error: "Deadline is already set to this date.",
            status: 400
        };
    };

    try {
        const updated = await prisma.$transaction(async (tx) => {
            await tx.milestonedelay.create({
                data: {
                    newDeadline: input.newDeadline,
                    oldDeadline: findMilestone.deadline,
                    milestoneId: findMilestone.id
                }
            });
            return await tx.milestone.update({
                where: { id: input.milestoneId },
                data: {
                    delay: true,
                    delayreason: input.delayReason,
                    deadline: input.newDeadline
                }
            });
        });

        return { success: true, updatedMilestone: updated, status: 200 };
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
        };
        console.error("From delayProject", error);
        return { success: false, error: "Server Error", status: 500 }
    }
}

export const deleteMilestone = async (milestoneId: string, projectId: string) => {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", status: 401 };
    if (session.user.role.toLowerCase() !== "freelancer") return { success: false, error: "Forbidden", status: 403 };

    const findFreelancer = await prisma.freelancer.findFirst({
        where: { userId: session.user.id },
        select: {
            id: true
        }
    });
    if (!findFreelancer) return { success: false, error: "Profile Not found", status: 404 };

    const findproject = await prisma.project.findFirst({
        where: {
            id: projectId,
            freelancerId: findFreelancer.id
        }
    });
    if (!findproject) {
        return { success: false, error: "Project Doesn't exist", status: 404 }
    };
    if (findproject.status !== "ACTIVE") {
        return { success: false, error: "You can only delete milestones from Active projects", status: 400 }
    }

    try {
        await prisma.$transaction(async (tx) => {
            const milestone = await tx.milestone.findFirst({
                where: { id: milestoneId, projectId: findproject.id },
                select: {
                    status: true,
                    id: true,
                    position: true
                }
            });
            if (!milestone) {
                throw new Error("Milestone Not Found")
            };
            if (milestone.status === "COMPLETED") {
                throw new Error("You can't Delete Completed milestones")
            };
            let nextMilestone: Awaited<
                ReturnType<typeof tx.milestone.findFirst>
            > = null;

            if (milestone.status === "IN_PROGRESS") {
                nextMilestone = await tx.milestone.findFirst({
                    where: {
                        projectId: findproject.id,
                        status: "NOT_STARTED",
                        position: {
                            gt: milestone.position
                        }
                    },
                    orderBy: {
                        position: "asc"
                    }
                });
            }
            await tx.milestone.delete({
                where: {
                    id: milestone.id
                }
            });
            if (nextMilestone) {
                await tx.milestone.update({
                    where: { id: nextMilestone.id },
                    data: {
                        status: "IN_PROGRESS"
                    }
                });
            };

            await tx.milestone.updateMany({
                where: {
                    projectId,
                    position: {
                        gt: milestone.position,
                    },
                },
                data: {
                    position: {
                        decrement: 1,
                    },
                },
            });
        });

        return { success: true, deletedMilestoneId: milestoneId, status: 200 };
    }
    catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : "Server Error",
            status: 500
        };
    }
}

export const markMilestoneCompleted = async (milestoneId: string, projectId: string) => {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", status: 401 };
    if (session.user.role.toLowerCase() !== "freelancer") return { success: false, error: "Forbidden", status: 403 };

    const findFreelancer = await prisma.freelancer.findFirst({
        where: { userId: session.user.id },
        select: {
            id: true
        }
    });
    if (!findFreelancer) return { success: false, error: "Profile Not found", status: 404 };

    const findproject = await prisma.project.findFirst({
        where: {
            id: projectId,
            freelancerId: findFreelancer.id,
            archivedByFreelancer: false
        }
    });
    if (!findproject) {
        return { success: false, error: "Project Doesn't exist", status: 404 }
    };
    const foundmilestone = await prisma.milestone.findFirst({
        where: { id: milestoneId, projectId }
    });
    if (!foundmilestone) {
        return { success: false, error: "Milestone doesn't exist", status: 404 }
    };
    if (foundmilestone.status !== "IN_PROGRESS") {
        return {
            success: false,
            error: "Only active milestones can be completed.",
            status: 400,
        };
    };

    try {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);
        const completed = await prisma.$transaction(async (tx) => {
            const current = await tx.milestone.update({
                where: { id: foundmilestone.id },
                data: {
                    status: "COMPLETED"
                },
                select: {
                    id: true,
                    status: true
                }
            });

            const nextMilestone = await tx.milestone.findFirst({
                where: {
                    projectId,
                    status: "NOT_STARTED",
                },
                orderBy: {
                    position: "asc",
                },
            });

            if (nextMilestone) {
                await tx.milestone.update({
                    where: { id: nextMilestone.id },
                    data: { status: "IN_PROGRESS" },
                });
            }

            await tx.payment.upsert({
                where: { projectId: findproject.id },
                create: {
                    due_date: dueDate,
                    paid_amount: 0,
                    total_cost: foundmilestone.milestonecost,
                    payment_status: "DUE",
                    projectId: findproject.id
                },
                update: {
                    total_cost: {
                        increment: foundmilestone.milestonecost
                    },
                    payment_status: "DUE",
                    due_date: dueDate
                }
            });

            return {
                status: current.status,
                id: current.id
            }
        });

        return { success: true, milestone: completed, status: 200 }
    }
    catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : "Server Error",
            status: 500
        };
    }
}
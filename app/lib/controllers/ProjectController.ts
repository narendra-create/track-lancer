import { prisma } from "@/app/lib/prisma";
import type { userrole } from "@/app/generated/prisma/enums";
import { formatDate, generateCode } from "../utilitys";
import type { FreelancerPastProjectsResponse, ClientPastProjectsResponse, PastProjectPaymentStatus } from "@/types/pastprojects";
import type { newProjectInput } from "../validations/ProjectValidation";
import type { GetAllProjectsResponse, AllProjectStatus } from "@/types/allprojects";
import { getSession } from "../session";

export const getPastProjects = async (role: userrole, profileid: string, cursor?: string): Promise<FreelancerPastProjectsResponse | ClientPastProjectsResponse> => {
    if (!profileid) {
        return { success: false, error: "Invalid profile id", status: 400 }
    };
    if (role === "FREELANCER") {
        try {
            const result = await prisma.project.findMany({
                take: 10,
                ...(cursor && { cursor: { id: cursor }, skip: 1 }),
                where: { freelancerId: profileid, status: "COMPLETED" },
                select: {
                    id: true,
                    client: {
                        select: { user: { select: { name: true, email: true } } }
                    },
                    payments: { select: { paid_amount: true, payment_status: true, total_cost: true } },
                    title: true,
                    updatedAt: true,
                    createdAt: true
                },
                orderBy: { createdAt: "desc" }
            });
            const returnobject = result.map((project) => {
                const totalpaid = project.payments.reduce((sum, p) => sum + p.paid_amount, 0);
                const totalcost = project.payments.reduce((sum, p) => sum + p.total_cost, 0);
                const totaldue = totalcost - totalpaid;
                const paymentStatus: PastProjectPaymentStatus = project.payments.length === 0 ? "UNPAID" : totaldue === 0 ? "PAID" : "DUE"

                return {
                    id: project.id,
                    title: project.title,
                    paymentStatus: paymentStatus,
                    clientName: project.client?.user?.name ?? "Unknown",
                    clientEmail: project.client?.user?.email ?? "",
                    paidAmount: totalpaid,
                    completionDate: formatDate(project.updatedAt),
                    createdAt: formatDate(project.createdAt)
                };
            });
            const nextCursor = returnobject.length === 10 ? returnobject[returnobject.length - 1].id : null;
            return {
                success: true as const,
                projects: returnobject,
                nextCursor
            };
        } catch {
            return { success: false, error: "Failed to fetch past projects", status: 500 }
        }
    }
    else if (role === "CLIENT") {
        try {
            const result = await prisma.project.findMany({
                take: 10,
                ...(cursor && { cursor: { id: cursor }, skip: 1 }),
                where: { clientId: profileid, status: { in: ["COMPLETED", "CANCELLED"] } },
                select: {
                    id: true,
                    freelancer: { select: { user: { select: { name: true, email: true } } } },
                    payments: { select: { paid_amount: true, payment_status: true, total_cost: true } },
                    title: true,
                    updatedAt: true,
                    createdAt: true
                },
                orderBy: { createdAt: "desc" }
            });
            const returnobject = result.map((project) => {
                const totalpaid = project.payments.reduce((sum, p) => sum + p.paid_amount, 0);
                const totalcost = project.payments.reduce((sum, p) => sum + p.total_cost, 0);
                const totaldue = totalcost - totalpaid;
                const paymentStatus: PastProjectPaymentStatus = project.payments.length === 0 ? "UNPAID" : totaldue === 0 ? "PAID" : "DUE"

                return {
                    id: project.id,
                    title: project.title,
                    paymentStatus: paymentStatus,
                    freelancerName: project.freelancer?.user?.name ?? "Unknown",
                    freelancerEmail: project.freelancer?.user?.email ?? "",
                    paidAmount: totalpaid,
                    completionDate: formatDate(project.updatedAt),
                    createdAt: formatDate(project.createdAt)
                };
            });
            const nextCursor = returnobject.length === 10 ? returnobject[returnobject.length - 1].id : null;
            return {
                success: true as const,
                projects: returnobject,
                nextCursor
            };
        } catch {
            return { success: false, error: "Failed to fetch past projects", status: 500 }
        }
    }
    return { success: false, error: "Invalid role", status: 403 }
}

export const createNewProject = async (input: newProjectInput) => {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", status: 401 };
    if (session.user.role.toLowerCase() !== "freelancer") return { success: false, error: "Forbidden", status: 403 };

    const freelancer = await prisma.freelancer.findUnique({
        where: { userId: session.user.id },
        select: { id: true }
    });
    if (!freelancer) return { success: false, error: "Freelancer Not found", status: 404 };

    try {
        const generatedCode = generateCode(8);
        await prisma.project.create({
            data: {
                agreedCost: input.agreedcost,
                deadline: input.deadline,
                projectcode: generatedCode,
                status: "PENDING",
                title: input.title,
                description: input.description,
                freelancerId: freelancer.id
            }
        });
        return { success: true, status: 201, projectCode: generatedCode };
    }
    catch {
        return { success: false, error: "Failed to create project", status: 500 }
    }
};

export const acceptProject = async (projectCode: string) => {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", status: 401 };
    if (session.user.role.toLowerCase() !== "client") return { success: false, error: "Forbidden", status: 403 };

    const clientProfile = await prisma.userprofile.findFirst({
        where: { userId: session.user.id },
        select: {
            id: true,
            user: {
                select: { email: true }
            }
        }
    });
    if (!clientProfile) {
        return { success: false, error: "Client Account does not exist", status: 404 }
    };

    const findProject = await prisma.project.findUnique({
        where: { projectcode: projectCode }
    });
    if (!findProject) {
        return { success: false, error: "Invalid Project Code", status: 400 }
    };
    if (findProject.clientId) {
        return { success: false, error: "Project is already assigned", status: 403 }
    }

    try {
        const acceptedProject = await prisma.project.update({
            where: { projectcode: projectCode },
            data: {
                clientEmail: clientProfile.user.email,
                clientId: clientProfile.id,
                projectcode: null,
                status: "ACTIVE"
            },
            select: {
                id: true
            }
        });

        return { success: true, Project: acceptedProject, status: 200 };
    }
    catch (err: any) {
        if (err.error) {
            return { success: false, error: err.error, status: err.status }
        }
        console.log(err, "From acceptProject")
        return { success: false, error: "Server Error", status: 500 }
    }
}

export const getUnverifiedProjects = async (freelancerId: string) => {
    try {
        const foundFreelancer = await prisma.freelancer.findUnique({ where: { id: freelancerId } });
        if (!foundFreelancer) return { success: false, error: "Freelancer Not found", status: 404 };
        const foundProjects = await prisma.project.findMany({
            where: { freelancerId: freelancerId, status: "PENDING" },
            select: {
                id: true,
                title: true,
                description: true,
                deadline: true,
                createdAt: true,
                agreedCost: true
            }
        });
        return { success: true, status: 200, projects: foundProjects }
    }
    catch (err: any) {
        if (err.error) {
            return { success: false, error: err.error, status: err.status }
        }
        console.log(err, "From getUnverifiedProjects")
        return { success: false, error: "Server Error", status: 500 }
    }
};

export const deleteProject = async (freelancerid: string, projectId: string) => {
    try {
        const freelancerfound = await prisma.freelancer.findFirst({
            where: { id: freelancerid },
            select: { id: true }
        });
        const projectfound = await prisma.project.findUnique({
            where: { id: projectId, freelancerId: freelancerfound?.id },
            include: {
                _count: {
                    select: {
                        milestones: true,
                        payments: true
                    }
                }
            }
        });

        if (!projectfound) {
            return {
                success: false,
                error: "Project id/Freelancer id not valid or project not found",
                status: 404
            };
        }
        // 2. Check if it contains milestones or payments
        if (projectfound._count.milestones > 0 || projectfound._count.payments > 0) {
            return {
                success: false,
                error: "Cannot delete project. It already has milestones or payments.",
                status: 400
            };
        };

        //IF it passes all tests - Delete
        await prisma.project.delete({
            where: { id: projectfound.id }
        });

        return { success: true, status: 200 };
    }
    catch (err: any) {
        if (err.error) {
            return { success: false, error: err.error, status: err.status }
        }
        console.log(err, "From acceptProject")
        return { success: false, error: "Server Error", status: 500 }
    }
}

export const regenerateCode = async (freelancerId: string, projectId: string) => {
    try {
        const freelancerfound = await prisma.freelancer.findFirst({
            where: { id: freelancerId },
            select: { id: true }
        });
        const projectfound = await prisma.project.findUnique({
            where: { id: projectId, freelancerId: freelancerfound?.id, status: "PENDING" }
        });

        if (!projectfound) {
            return {
                success: false,
                error: "Project id/Freelancer id not valid or project not found",
                status: 404
            };
        };
        if (projectfound.clientId) {
            return { success: false, error: "Client already accepted the project", status: 409 }
        }
        const regeneratedCode = generateCode(8);
        await prisma.project.update({
            where: { id: projectId },
            data: {
                projectcode: regeneratedCode
            }
        })

        return { success: true, status: 201, projectcode: regeneratedCode };
    }
    catch (err: any) {
        if (err.error) {
            return { success: false, error: err.error, status: err.status }
        }
        console.log(err, "From Regen. code")
        return { success: false, error: "Server Error", status: 500 }
    }
}

export const getAllProjects = async (profileid: string, role: userrole, cursor?: string): Promise<GetAllProjectsResponse> => {
    if (!profileid) {
        return { success: false, error: "Invalid Profile id", status: 400 }
    }
    if (role === "FREELANCER") {
        const result = await prisma.project.findMany({
            take: 6,
            ...(cursor && { cursor: { id: cursor }, skip: 1 }),
            where: {
                freelancerId: profileid, status: {
                    notIn: ["PENDING", "COMPLETED"]
                }
            },
            select: {
                id: true,
                title: true,
                client: {
                    select: {
                        user: {
                            select: {
                                name: true,
                                image: true,
                            }
                        }
                    }
                },
                clientEmail: true,
                payments: {
                    select: {
                        due_date: true,
                        paid_amount: true,
                        total_cost: true,
                        payment_status: true
                    }
                },
                status: true,
                milestones: {
                    select: {
                        status: true,
                        deadline: true
                    },
                    orderBy: {
                        deadline: "desc"
                    }
                },
                createdAt: true
            }
        });

        const projects = result.map((project) => {
            const totalMilestones = project.milestones.length;
            const completedMilestones =
                project.milestones.filter(
                    milestone => milestone.status === "COMPLETED"
                ).length;

            const progress =
                totalMilestones === 0
                    ? 0
                    : Math.round(
                        (completedMilestones / totalMilestones) * 100
                    );

            const lastMilestone = project.milestones[0];
            const projectDeadline = lastMilestone?.deadline;

            //Payments
            const totalAmount = project.payments.reduce((sum, p) => sum + p.total_cost, 0);
            const received = project.payments.reduce((sum, p) => sum + p.paid_amount, 0);

            return {
                id: project.id,
                title: project.title,
                client: project.client ? {
                    user: {
                        name: project.client.user.name,
                        image: project.client.user.image
                    },
                    email: project.clientEmail
                } : {
                    user: {
                        name: "Unknown",
                        image: null
                    },
                    email: null
                },
                money: {
                    totalAmount,
                    received,
                    remaining: totalAmount - received
                },
                status: project.status as AllProjectStatus,
                stats: {
                    totalMilestones,
                    completedMilestones,
                    progress,
                    projectDeadline
                }

            }

        });
        const nextCursor = projects.length === 6 ? projects[projects.length - 1].id : null;

        return { success: true, projects: projects, nextCursor }
    }
    else if (role === "CLIENT") {
        const result = await prisma.project.findMany({
            take: 6,
            ...(cursor && { cursor: { id: cursor }, skip: 1 }),
            where: {
                clientId: profileid, status: {
                    notIn: ["PENDING", "COMPLETED"]
                }
            },
            select: {
                id: true,
                title: true,
                freelancer: {
                    select: {
                        user: {
                            select: {
                                name: true,
                                image: true,
                                email: true
                            }
                        }
                    }
                },
                payments: {
                    select: {
                        due_date: true,
                        paid_amount: true,
                        total_cost: true,
                        payment_status: true
                    }
                },
                status: true,
                milestones: {
                    select: {
                        status: true,
                        deadline: true
                    },
                    orderBy: {
                        deadline: "desc"
                    }
                },
                createdAt: true
            }
        });

        const projects = result.map((project) => {
            const totalMilestones = project.milestones.length;
            const completedMilestones =
                project.milestones.filter(
                    milestone => milestone.status === "COMPLETED"
                ).length;

            const progress =
                totalMilestones === 0
                    ? 0
                    : Math.round(
                        (completedMilestones / totalMilestones) * 100
                    );

            const lastMilestone = project.milestones[0];
            const projectDeadline = lastMilestone?.deadline;

            //Payments
            const totalAmount = project.payments.reduce((sum, p) => sum + p.total_cost, 0);
            const paid = project.payments.reduce((sum, p) => sum + p.paid_amount, 0);

            return {
                id: project.id,
                title: project.title,
                client: project.freelancer ? {
                    user: {
                        name: project.freelancer.user.name,
                        image: project.freelancer.user.image
                    },
                    email: project.freelancer.user.email
                } : {
                    user: {
                        name: "Unknown",
                        image: null
                    },
                    email: null
                },
                money: {
                    totalAmount,
                    received: paid,
                    remaining: totalAmount - paid
                },
                status: project.status as AllProjectStatus,
                stats: {
                    totalMilestones,
                    completedMilestones,
                    progress,
                    projectDeadline
                }

            }

        });
        const nextCursor = projects.length === 6 ? projects[projects.length - 1].id : null;

        return { success: true, projects: projects, nextCursor }
    }
    return { success: false, error: "Invalid role", status: 403 }
}

export const searchProject = async (projectCode: string) => {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", status: 401 };
    if (session.user.role.toLowerCase() !== "client") return { success: false, error: "Forbidden", status: 403 };
    const findProject = await prisma.project.findFirst({
        where: { projectcode: projectCode, status: "PENDING" },
        include: { freelancer: { select: { user: { select: { name: true, email: true } } } } }
    });
    if (!findProject) {
        return { success: false, error: "Invalid Project Code", status: 400 }
    };

    return { success: true, project: findProject, status: 200 }
}
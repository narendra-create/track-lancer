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
                where: { freelancerId: profileid, status: { in: ["COMPLETED", "CANCELLED"] }, archivedByFreelancer: false },
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
                where: { clientId: profileid, status: { in: ["COMPLETED", "CANCELLED"] }, archivedByClient: false },
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
                select: { email: true, id: true }
            }
        }
    });
    if (!clientProfile) {
        return { success: false, error: "Client Account does not exist", status: 404 }
    };

    const findProject = await prisma.project.findUnique({
        where: { projectcode: projectCode },
        include: {
            freelancer: {
                select: {
                    userId: true
                }
            }
        }
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
        try {
            await prisma.activity.createMany({
                data: [{
                    type: "REMINDER",
                    projectId: findProject.id,
                    userId: findProject.freelancer?.userId!,
                    highlightmessage: "Client Accepted Project",
                    dateTimeofMessage: new Date(),
                    message: `Client Accepted Project - ${findProject.title}`,
                },
                {
                    type: "REMINDER",
                    projectId: findProject.id,
                    userId: clientProfile.user.id!,
                    highlightmessage: "New Project",
                    dateTimeofMessage: new Date(),
                    message: `New Project Added - See it in all projects page or in dashboard`,
                }]
            })
        }
        catch (err) {
            console.log("Failed to create activity for AcceptProject", err);
        }

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
                    not: "PENDING"
                },
                archivedByFreelancer: false
            },
            select: {
                id: true,
                title: true,
                deadline: true,
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
                createdAt: true,
                hasCancelRequest: true,
                archivedByClient: true,
                archivedByFreelancer: true
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

            const projectDeadline = project.deadline;

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
                },
                hasCancelRequest: project.hasCancelRequest,
                archivedByFreelancer: project.archivedByFreelancer,
                archivedByClient: project.archivedByClient
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
                    not: "PENDING"
                },
                archivedByClient: false
            },
            select: {
                id: true,
                title: true,
                deadline: true,
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
                createdAt: true,
                hasCancelRequest: true,
                archivedByClient: true,
                archivedByFreelancer: true
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

            const projectDeadline = project.deadline;

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
                },
                hasCancelRequest: project.hasCancelRequest,
                archivedByFreelancer: project.archivedByFreelancer,
                archivedByClient: project.archivedByClient
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
        select: {
            id: true,
            title: true,
            agreedCost: true,
            deadline: true,
            description: true,
            freelancer: {
                select: {
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                }
            }
        }
    });
    if (!findProject) {
        return { success: false, error: "Invalid Project Code", status: 400 }
    };

    return { success: true, project: findProject, status: 200 }
}

export const markProjectCompleted = async (projectId: string) => {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", status: 401 };
    if (session.user.role.toLowerCase() !== "freelancer") return { success: false, error: "Forbidden", status: 403 };

    const freelancerProfile = await prisma.freelancer.findFirst({
        where: { userId: session.user.id },
        select: {
            id: true,
            user: {
                select: { email: true }
            }
        }
    });
    if (!freelancerProfile) {
        return { success: false, error: "freelancer Account does not exist", status: 404 }
    };

    const findProject = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
            client: {
                select: {
                    userId: true
                }
            },
            milestones: {
                select: {
                    id: true,
                    status: true
                }
            }
        }
    });
    if (!findProject) {
        return { success: false, error: "Project Not found", status: 404 }
    };
    if (!findProject.clientId) {
        return { success: false, error: "Project is Not started", status: 403 }
    };
    if (findProject.milestones.length <= 0) {
        return { success: false, error: "You can't mark a project as completed without creating any milestone" }
    };
    if (findProject.freelancerId !== freelancerProfile.id) {
        return { success: false, error: "You Can only mark your projects as completed", status: 403 }
    }
    const incompleteMilestones = await prisma.milestone.count({
        where: {
            projectId,
            status: {
                not: "COMPLETED",
            },
        },
    });

    if (incompleteMilestones > 0) {
        return {
            success: false,
            error: "Complete all milestones before marking the project as completed.",
            status: 400,
        };
    }

    try {
        const completedProject = await prisma.project.update({
            where: { id: findProject.id },
            data: {
                status: "COMPLETED"
            },
            select: {
                id: true
            }
        });

        try {
            await prisma.activity.create({
                data: {
                    type: "REMINDER",
                    projectId: findProject.id,
                    userId: findProject.client?.userId!,
                    highlightmessage: "Project Completed",
                    dateTimeofMessage: new Date(),
                    message: `Project - ${findProject.title} is completed, Settlement any dues via payment page`,
                }
            })
        }
        catch (err) {
            console.log("Failed to create activity for Mark project completed", err);
        }

        return { success: true, Project: completedProject, status: 200 };
    }
    catch (err: any) {
        if (err.error) {
            return { success: false, error: err.error, status: err.status }
        }
        console.log(err, "From acceptProject")
        return { success: false, error: "Server Error", status: 500 }
    }
}

export const raiseCancellRequest = async (projectId: string) => {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", status: 401 };
    const role = session.user.role.toLowerCase()
    if (role !== "freelancer" && role !== "client") return { success: false, error: "Forbidden", status: 403 };

    if (role === "client") {
        const findclient = await prisma.userprofile.findUnique({
            where: { userId: session.user.id }
        });
        if (!findclient) {
            return { success: false, error: "No client account found", status: 404 }
        };

        const findproject = await prisma.project.findFirst({
            where: { id: projectId, clientId: findclient.id, status: { in: ["ACTIVE", "STOPPED"] } },
            include: {
                freelancer: {
                    select: {
                        userId: true
                    }
                }
            }
        });

        if (!findproject) {
            return { success: false, error: "Project Not found", status: 404 }
        };
        if (!findproject.freelancerId) {
            return { success: false, error: "Project is not Assigned to freelancer" }
        }
        const findcancellRequest = await prisma.cancellRequest.findUnique({
            where: { projectId: findproject.id }
        });
        if (findcancellRequest?.clientApproved) {
            return { success: false, error: "I think you clicked Cancel Button two times", status: 409 }
        };

        try {
            if (findcancellRequest && findcancellRequest.freelancerApproved) {
                const updated = await prisma.$transaction(async (tx) => {
                    if (!findcancellRequest.isRejected) {
                        const updatedProject = await tx.project.update({
                            where: { id: findproject.id },
                            data: {
                                status: "CANCELLED",
                                hasCancelRequest: false
                            }
                        });
                        const updatedRequest = await tx.cancellRequest.update({
                            where: { id: findcancellRequest.id },
                            data: {
                                acceptedById: session.user.id,
                                clientApproved: true,
                                approvedAt: new Date()
                            }
                        });

                        return { updatedProject, updatedRequest }
                    }
                    else {
                        const updatedProject = await tx.project.update({
                            where: { id: findproject.id },
                            data: {
                                hasCancelRequest: true
                            }
                        });
                        const updatedRequest = await tx.cancellRequest.update({
                            where: { id: findcancellRequest.id },
                            data: {
                                raiesdByuserId: session.user.id,
                                clientId: findclient.id,
                                clientApproved: true,
                                freelancerId: findproject.freelancerId!,
                                freelancerApproved: false,
                                isRejected: false,
                                acceptedById: undefined,
                                rejectedById: undefined
                            }
                        });

                        return { updatedProject, updatedRequest }
                    }
                })
                return { success: true, updatedProject: updated.updatedProject, updatedRequest: updated.updatedRequest, status: 200 }
            }
            else {
                const raisedRequest = await prisma.$transaction(async (tx) => {
                    await tx.project.update({
                        where: { id: findproject.id },
                        data: {
                            hasCancelRequest: true,
                        }
                    });

                    if (findcancellRequest) {
                        return await tx.cancellRequest.update({
                            where: { id: findcancellRequest.id },
                            data: {
                                raiesdByuserId: session.user.id,
                                clientId: findclient.id,
                                clientApproved: true,
                                freelancerId: findproject.freelancerId!,
                                freelancerApproved: false,
                                isRejected: false,
                                acceptedById: null,
                                rejectedById: null
                            }
                        });
                    } else {
                        return await tx.cancellRequest.create({
                            data: {
                                projectId: findproject.id,
                                raiesdByuserId: session.user.id,
                                clientId: findclient.id,
                                clientApproved: true,
                                freelancerId: findproject.freelancerId!,
                                freelancerApproved: false
                            }
                        });
                    }
                });

                try {
                    await prisma.activity.create({
                        data: {
                            type: "WARNING",
                            projectId: findproject.id,
                            userId: findproject.freelancer?.userId!,
                            highlightmessage: "Client Raised cancel request",
                            dateTimeofMessage: new Date(),
                            message: `Your client wants to cancel the project - ${findproject.title}, see project milestone page to approve request`,
                        }
                    })
                }
                catch (err) {
                    console.log("Failed to create activity for Raise Cancel request", err);
                }

                return { success: true, request: raisedRequest, status: 200 }
            }
        }
        catch (err) {
            return {
                success: false,
                error: "Server Error",
                status: 500
            };
        }
    }
    else if (role === "freelancer") {
        const findfreelancer = await prisma.freelancer.findUnique({
            where: { userId: session.user.id }
        });
        if (!findfreelancer) {
            return { success: false, error: "No freelancer account found", status: 404 }
        };

        const findproject = await prisma.project.findFirst({
            where: { id: projectId, freelancerId: findfreelancer.id, status: { in: ["ACTIVE", "STOPPED"] } },
            include: {
                client: {
                    select: {
                        userId: true
                    }
                }
            }
        });

        if (!findproject) {
            return { success: false, error: "Project Not found", status: 404 }
        };
        if (!findproject.clientId) {
            return { success: false, error: "Project is not Assigned to client" }
        }
        const findcancellRequest = await prisma.cancellRequest.findUnique({
            where: { projectId: findproject.id }
        })
        if (findcancellRequest?.freelancerApproved) {
            return { success: false, error: "I think you clicked Cancel Button two times", status: 409 }
        }

        try {
            if (findcancellRequest && findcancellRequest.clientApproved) {
                const updated = await prisma.$transaction(async (tx) => {
                    if (!findcancellRequest.isRejected) {
                        const updatedProject = await tx.project.update({
                            where: { id: findproject.id },
                            data: {
                                status: "CANCELLED",
                                hasCancelRequest: false
                            }
                        });
                        const updatedRequest = await tx.cancellRequest.update({
                            where: { id: findcancellRequest.id },
                            data: {
                                acceptedById: session.user.id,
                                freelancerApproved: true,
                                approvedAt: new Date()
                            }
                        });

                        return { updatedProject, updatedRequest }
                    }
                    else {
                        const updatedProject = await tx.project.update({
                            where: { id: findproject.id },
                            data: {
                                hasCancelRequest: true
                            }
                        });
                        const updatedRequest = await tx.cancellRequest.update({
                            where: { id: findcancellRequest.id },
                            data: {
                                raiesdByuserId: session.user.id,
                                clientId: findproject.clientId!,
                                clientApproved: false,
                                freelancerId: findfreelancer.id,
                                freelancerApproved: true,
                                isRejected: false,
                                acceptedById: undefined,
                                rejectedById: undefined
                            }
                        });

                        return { updatedProject, updatedRequest }
                    }
                })

                return { success: true, updatedProject: updated.updatedProject, updatedRequest: updated.updatedRequest, status: 200 }
            }
            else {
                const raisedRequest = await prisma.$transaction(async (tx) => {
                    await tx.project.update({
                        where: { id: findproject.id },
                        data: {
                            hasCancelRequest: true,
                        }
                    });

                    if (findcancellRequest) {
                        return await tx.cancellRequest.update({
                            where: { id: findcancellRequest.id },
                            data: {
                                raiesdByuserId: session.user.id,
                                clientId: findproject.clientId!,
                                clientApproved: false,
                                freelancerId: findproject.freelancerId!,
                                freelancerApproved: true,
                                isRejected: false,
                                acceptedById: null,
                                rejectedById: null
                            }
                        });
                    } else {
                        await tx.cancellRequest.create({
                            data: {
                                projectId: findproject.id,
                                raiesdByuserId: session.user.id,
                                clientId: findproject.clientId!,
                                clientApproved: false,
                                freelancerId: findproject.freelancerId!,
                                freelancerApproved: true
                            }
                        });
                        try {
                            await prisma.activity.create({
                                data: {
                                    type: "WARNING",
                                    projectId: findproject.id,
                                    userId: findproject.client?.userId!,
                                    highlightmessage: "Freelancer Raised cancel request",
                                    dateTimeofMessage: new Date(),
                                    message: `Freelancer wants to cancel this project - ${findproject.title}, see project milestone page to approve request`,
                                }
                            })
                        }
                        catch (err) {
                            console.log("Failed to create activity for Raise Cancel request", err);
                        };
                        return;
                    }
                })

                return { success: true, request: raisedRequest, status: 200 }
            }
        }
        catch (err) {
            return {
                success: false,
                error: "Server Error",
                status: 500
            };
        }
    }

    return { success: false, error: "Invalid role", status: 403 }
}

export const processCancellRequest = async (projectId: string, type: "APPROVE" | "REJECT") => {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", status: 401 };
    const role = session.user.role.toLowerCase()
    if (role !== "freelancer" && role !== "client") return { success: false, error: "Forbidden", status: 403 };

    const findcancellRequest = await prisma.cancellRequest.findFirst({
        where: { projectId: projectId, isRejected: false }
    });

    if (!findcancellRequest) {
        return { success: false, error: "Request Not found", status: 404 }
    };

    if (role === "client") {
        const findclient = await prisma.userprofile.findUnique({
            where: { userId: session.user.id }
        });
        if (!findclient) {
            return { success: false, error: "No client account found", status: 404 }
        };
        if (findcancellRequest.clientApproved) {
            return { success: false, error: "This request is already approved", status: 409 }
        }
        if (findclient.id !== findcancellRequest.clientId) {
            return { success: false, error: "This request is not for you", status: 403 }
        };

        const findproject = await prisma.project.findFirst({
            where: { id: findcancellRequest.projectId, clientId: findclient.id, hasCancelRequest: true, status: { in: ["ACTIVE", "STOPPED"] } },
            include: {
                freelancer: {
                    select: {
                        userId: true
                    }
                }
            }
        });

        if (!findproject) {
            return { success: false, error: "Project Not found", status: 404 }
        };
        if (!findproject.freelancerId) {
            return { success: false, error: "Project is not Assigned to freelancer" }
        };
        if (findproject.status === "CANCELLED") {
            return { success: false, error: "This Project is already cancelled", status: 409 }
        }
        if (findproject.clientId !== findclient.id) {
            return { success: false, error: "This project is not Assigned to you", status: 403 }
        }

        try {
            const updated = await prisma.$transaction(async (tx) => {
                const updatedProject = await tx.project.update({
                    where: { id: findproject.id },
                    data: {
                        status: type === "APPROVE" ? "CANCELLED" : findproject.status,
                        hasCancelRequest: false
                    }
                });
                let updatedRequest;
                if (type === "APPROVE") {
                    updatedRequest = await tx.cancellRequest.update({
                        where: { id: findcancellRequest.id },
                        data: {
                            acceptedById: session.user.id,
                            clientApproved: true,
                            approvedAt: new Date()
                        }
                    });
                    try {
                        await prisma.activity.create({
                            data: {
                                type: "WARNING",
                                projectId: findproject.id,
                                userId: findproject.freelancer?.userId!,
                                highlightmessage: "Project Cancelled",
                                dateTimeofMessage: new Date(),
                                message: `Client approved cancel request for project - ${findproject.title}`,
                            }
                        })
                    }
                    catch (err) {
                        console.log("Failed to create activity for process Cancel request", err);
                    }
                } else {
                    updatedRequest = await tx.cancellRequest.update({
                        where: { id: findcancellRequest.id },
                        data: {
                            clientApproved: false,
                            freelancerApproved: false,
                            isRejected: true,
                            rejectedById: session.user.id
                        }
                    });

                    try {
                        await prisma.activity.create({
                            data: {
                                type: "REMINDER",
                                projectId: findproject.id,
                                userId: findproject.freelancer?.userId!,
                                highlightmessage: "Cancel Request Rejected",
                                dateTimeofMessage: new Date(),
                                message: `Client rejected cancel request for project - ${findproject.title}`,
                            }
                        })
                    }
                    catch (err) {
                        console.log("Failed to create activity for process Cancel request", err);
                    }
                }

                return { updatedProject, updatedRequest }
            })

            return { success: true, updatedProject: updated.updatedProject, updatedRequest: updated.updatedRequest, status: 200 }
        }
        catch (err) {
            return {
                success: false,
                error: "Server Error",
                status: 500
            };
        }
    }
    else {
        const findfreelancer = await prisma.freelancer.findUnique({
            where: { userId: session.user.id }
        });
        if (!findfreelancer) {
            return { success: false, error: "No client account found", status: 404 }
        };
        if (findcancellRequest.freelancerApproved) {
            return { success: false, error: "This request is already approved", status: 409 }
        }
        if (findfreelancer.id !== findcancellRequest.freelancerId) {
            return { success: false, error: "This request is not for you", status: 403 }
        };

        const findproject = await prisma.project.findFirst({
            where: { id: findcancellRequest.projectId, freelancerId: findfreelancer.id, hasCancelRequest: true, status: { in: ["ACTIVE", "STOPPED"] } },
            include: {
                client: {
                    select: {
                        userId: true
                    }
                }
            }
        });

        if (!findproject) {
            return { success: false, error: "Project Not found", status: 404 }
        };
        if (!findproject.clientId) {
            return { success: false, error: "Project is not Assigned to client" }
        };
        if (findproject.status === "CANCELLED") {
            return { success: false, error: "This Project is already cancelled", status: 409 }
        };

        if (findproject.freelancerId !== findfreelancer.id) {
            return { success: false, error: "This project is not Assigned to you", status: 403 }
        }

        try {
            const updated = await prisma.$transaction(async (tx) => {
                const updatedProject = await tx.project.update({
                    where: { id: findproject.id },
                    data: {
                        status: type === "APPROVE" ? "CANCELLED" : findproject.status,
                        hasCancelRequest: false
                    }
                });
                let updatedRequest;
                if (type === "APPROVE") {
                    updatedRequest = await tx.cancellRequest.update({
                        where: { id: findcancellRequest.id },
                        data: {
                            acceptedById: session.user.id,
                            freelancerApproved: true,
                            approvedAt: new Date()
                        }
                    });

                    try {
                        await prisma.activity.create({
                            data: {
                                type: "WARNING",
                                projectId: findproject.id,
                                userId: findproject.client?.userId!,
                                highlightmessage: "Project Cancelled",
                                dateTimeofMessage: new Date(),
                                message: `Freelancer approved cancel request for project - ${findproject.title}`,
                            }
                        })
                    }
                    catch (err) {
                        console.log("Failed to create activity for process Cancel request", err);
                    }
                }
                else {
                    updatedRequest = await tx.cancellRequest.update({
                        where: { id: findcancellRequest.id },
                        data: {
                            freelancerApproved: false,
                            clientApproved: false,
                            isRejected: true,
                            rejectedById: session.user.id
                        }
                    });

                    try {
                        await prisma.activity.create({
                            data: {
                                type: "REMINDER",
                                projectId: findproject.id,
                                userId: findproject.client?.userId!,
                                highlightmessage: "Cancel Request Rejected",
                                dateTimeofMessage: new Date(),
                                message: `Freelancer rejected cancel request for project - ${findproject.title}`,
                            }
                        })
                    }
                    catch (err) {
                        console.log("Failed to create activity for process Cancel request", err);
                    }
                }

                return { updatedProject, updatedRequest }
            })

            return { success: true, updatedProject: updated.updatedProject, updatedRequest: updated.updatedRequest, status: 200 }
        }
        catch (err) {
            return {
                success: false,
                error: "Server Error",
                status: 500
            };
        }
    }
};

export const processarchiveProject = async (projectId: string, action: "ARCHIVE" | "UNARCHIVE") => {
    if (!projectId) {
        return { success: false, error: "Invalid Profile id", status: 400 }
    };
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", status: 401 };
    const sessionrole = session.user.role.toLowerCase()
    if (sessionrole !== "freelancer" && sessionrole !== "client") return { success: false, error: "Forbidden", status: 403 };

    if (sessionrole === "freelancer") {
        const findfreelancer = await prisma.freelancer.findUnique({
            where: { userId: session.user.id }
        });
        if (!findfreelancer) {
            return { success: false, error: "no Freelancer Account found that is associated with this project", status: 404 }
        };
        const findProject = await prisma.project.findUnique({
            where: { id: projectId }
        });
        if (!findProject) {
            return { success: false, error: "Project Not Found", status: 404 }
        }
        if (findProject.freelancerId !== findfreelancer.id) {
            return { success: false, error: "this project is not associated with you", status: 404 }
        }
        if (findProject.archivedByFreelancer && action === "ARCHIVE") {
            return {
                success: false,
                error: "Project is already archived.",
                status: 409
            };
        }
        if (!findProject.archivedByFreelancer && action === "UNARCHIVE") {
            return {
                success: false,
                error: "This Project is Not archived.",
                status: 409
            };
        }
        if (findProject.status === "ACTIVE" || findProject.status === "STOPPED") {
            return { success: false, error: "You can't archive active/stopped projects", status: 422 }
        };
        try {
            const updated = await prisma.project.update({
                where: { id: findProject.id },
                data: {
                    archivedByFreelancer: action === "ARCHIVE" ? true : false
                }
            });

            return { success: true, updatedProject: updated, status: 200 }
        }
        catch (err) {
            return {
                success: false,
                error: "Server Error",
                status: 500
            };
        }
    }
    else if (sessionrole === "client") {
        const findClient = await prisma.userprofile.findUnique({
            where: { userId: session.user.id }
        });
        if (!findClient) {
            return { success: false, error: "no Client Account found that is associated with this project", status: 404 }
        };
        const findProject = await prisma.project.findUnique({
            where: { id: projectId }
        });
        if (!findProject) {
            return { success: false, error: "Project Not Found", status: 404 }
        }
        if (findProject.clientId !== findClient.id) {
            return { success: false, error: "this project is not associated with you", status: 409 }
        }
        if (findProject.archivedByClient && action === "ARCHIVE") {
            return {
                success: false,
                error: "Project is already archived.",
                status: 409
            };
        }
        if (!findProject.archivedByClient && action === "UNARCHIVE") {
            return {
                success: false,
                error: "This Project is Not archived.",
                status: 409
            };
        }
        if (findProject.status === "ACTIVE" || findProject.status === "STOPPED") {
            return { success: false, error: "You can't archive active/stopped projects", status: 422 }
        };
        try {
            const updated = await prisma.project.update({
                where: { id: findProject.id },
                data: {
                    archivedByClient: action === "ARCHIVE" ? true : false
                }
            });

            return { success: true, updatedProject: updated, status: 200 }
        }
        catch (err) {
            return {
                success: false,
                error: "Server Error",
                status: 500
            };
        }
    }
    return { success: false, error: "Invalid role", status: 403 }
};

export const getArchivedProjects = async (cursor?: string) => {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", status: 401 };
    const sessionrole = session.user.role.toLowerCase()
    if (sessionrole !== "freelancer" && sessionrole !== "client") return { success: false, error: "Forbidden", status: 403 };

    if (sessionrole === "freelancer") {
        const findfreelancer = await prisma.freelancer.findUnique({
            where: { userId: session.user.id }
        })
        const result = await prisma.project.findMany({
            take: 6,
            ...(cursor && { cursor: { id: cursor }, skip: 1 }),
            where: {
                freelancerId: findfreelancer?.id,
                archivedByFreelancer: true
            },
            select: {
                id: true,
                title: true,
                deadline: true,
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
                createdAt: true,
                hasCancelRequest: true,
                archivedByFreelancer: true,
                archivedByClient: true
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

            const projectDeadline = project.deadline;

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
                },
                hasCancelRequest: project.hasCancelRequest,
                archivedByClient: project.archivedByClient,
                archivedByFreelancer: project.archivedByFreelancer
            }

        });
        const nextCursor = projects.length === 6 ? projects[projects.length - 1].id : null;

        return { success: true, projects: projects, nextCursor }
    }
    else if (sessionrole === "client") {
        const findclient = await prisma.userprofile.findUnique({
            where: { userId: session.user.id }
        })
        const result = await prisma.project.findMany({
            take: 6,
            ...(cursor && { cursor: { id: cursor }, skip: 1 }),
            where: {
                clientId: findclient?.id,
                archivedByClient: true
            },
            select: {
                id: true,
                title: true,
                deadline: true,
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
                createdAt: true,
                hasCancelRequest: true,
                archivedByClient: true,
                archivedByFreelancer: true
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

            const projectDeadline = project.deadline;

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
                },
                hasCancelRequest: project.hasCancelRequest,
                archivedByClient: project.archivedByClient,
                archivedByFreelancer: project.archivedByFreelancer
            }

        });
        const nextCursor = projects.length === 6 ? projects[projects.length - 1].id : null;

        return { success: true, projects: projects, nextCursor }
    }
    return { success: false, error: "Invalid role", status: 403 }
};

export const resumeProject = async (projectId: string) => {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", status: 401 };
    if (session.user.role.toLowerCase() !== "client") return { success: false, error: "Forbidden", status: 403 };

    const client = await prisma.userprofile.findUnique({
        where: { userId: session.user.id },
        select: { id: true }
    });
    if (!client) return { success: false, error: "Profile Not found", status: 404 };

    const findproject = await prisma.project.findFirst({
        where: { id: projectId, clientId: client.id },
        include: {
            freelancer: {
                select: { userId: true }
            }
        }
    });
    if (!findproject) {
        return { success: false, error: "You can only edit your projects", status: 403 }
    };
    if (findproject.status !== "STOPPED") {
        return { success: false, error: `Your project is - ${findproject.status}, not stopped`, status: 400 }
    }
    try {
        await prisma.$transaction(async (tx) => {
            await tx.project.update({
                where: { id: projectId },
                data: {
                    status: "ACTIVE",
                    updatedAt: new Date()
                }
            })
            await tx.milestone.updateMany({
                where: { projectId: projectId, project: { clientId: client.id }, status: "STOPPED" },
                data: {
                    status: "NOT_STARTED"
                }
            });

            const existingActive = await tx.milestone.findFirst({
                where: {
                    projectId,
                    status: "IN_PROGRESS"
                }
            });

            if (!existingActive) {
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
            }

            return;
        });

        try {
            await prisma.activity.create({
                data: {
                    type: "REMINDER",
                    projectId: findproject.id,
                    userId: findproject.freelancer?.userId!,
                    highlightmessage: "Project Resumes",
                    dateTimeofMessage: new Date(),
                    message: `You can start working on ${findproject.title} again, Client Resumed it`,
                }
            })
        }
        catch (err) {
            console.log("Failed to create activity for resume project", err);
        }

        return { success: true, status: 200 };
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
        };
        console.error("From resumeProject", error);
        return { success: false, error: "Server Error", status: 500 }
    }
};
import { prisma } from "@/app/lib/prisma";
import type { userrole } from "@/app/generated/prisma/enums";
import { formatDate, generateCode } from "../utilitys";
import type { FreelancerPastProjectsResponse, ClientPastProjectsResponse, PastProjectPaymentStatus } from "@/types/pastprojects";
import type { newProjectInput } from "../validations/ProjectValidation";
import { requireRole } from "../require-role";

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
                where: { clientId: profileid, status: "COMPLETED" },
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
    const { error, status } = await requireRole("freelancer");
    if (error) {
        return { success: false, error: error, status: status }
    };
    const freelancerProfile = await prisma.freelancer.findUnique({
        where: { id: input.freelancerId }
    });
    if (!freelancerProfile) return { success: false, error: "Freelancer Not found", status: 404 };
    //creating project
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
                freelancerId: input.freelancerId
            }
        });
        return { success: true, status: 201, projectCode: generatedCode };
    }
    catch {
        return { success: false, error: "Failed to create project", status: 500 }
    }
}

export const acceptProject = async (clientEmail: string, projectCode: string) => {
    const clientProfile = await prisma.userprofile.findFirst({
        where: { user: { email: clientEmail } },
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
                projectcode: null
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
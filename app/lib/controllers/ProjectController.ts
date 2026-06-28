import { prisma } from "@/app/lib/prisma";
import type { userrole } from "@/app/generated/prisma/enums";
import { formatDate } from "../utilitys";
import type { FreelancerPastProjectsResponse, ClientPastProjectsResponse, PastProjectPaymentStatus } from "@/types/pastprojects";

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
                    updatedAt: true
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
                    completionDate: formatDate(project.updatedAt)
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
                    updatedAt: true
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
                    completionDate: formatDate(project.updatedAt)
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

export const createNewProject = async (profileid: string) => {

}
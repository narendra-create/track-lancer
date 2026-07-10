import { prisma } from "@/app/lib/prisma";

// getClientMoneyStats(clientProfileId: string)
//getClientUpcomingDeadlines(clientProfileId: string)
// ClientDashboardStats.ts
type successtype = {
    success: true,
    stats: {
        activeCount: number,
        totalPaid: number,
        pendingAmount: number,
        pendingDueCount: number,
        completedCount: number
    }
};
type errorType = {
    success: boolean
    error: string
    status: number
}

export type MoneyStatsType = errorType | successtype;

export const getDeadlines = async (clientId: string, cursor?: string) => {
    // export type ClientDeadlineItem = {
    //   id: string;             // Milestone ID
    //   projectTitle: string;   // The title of the project this milestone belongs to
    //   milestoneTitle: string; // The title of the milestone itself
    //   deadline: Date;         // Javascript Date object
    //   cost: number;           // The cost of this specific milestone
    // };
}

export const getClientMoneyStats = async (clientId: string): Promise<MoneyStatsType> => {
    if (!clientId) {
        return { success: false, error: "Invalid Client id", status: 400 }
    };
    const clientProfile = await prisma.userprofile.findUnique({
        where: { id: clientId },
        select: {
            id: true
        }
    });

    if (!clientProfile) return { success: false, error: "client Not found", status: 404 };

    const paymentsfound = await prisma.payment.aggregate({
        where: { project: { clientId: clientProfile.id } },
        _sum: {
            total_cost: true,
            paid_amount: true
        }
    });

    const lifetimeDue = Math.max(0,
        (paymentsfound._sum.total_cost ?? 0) - (paymentsfound._sum.paid_amount ?? 0)
    );

    const payments = await prisma.payment.findMany({
        where: {
            project: { clientId: clientProfile.id },
            payment_status: "PAID"
        },
        select: {
            paid_amount: true,
            createdAt: true
        }
    });

    const totalPaid = payments.reduce((sum, p) => sum + p.paid_amount, 0);

    const projectscount = await prisma.project.count({
        where: { clientId: clientProfile.id, status: { not: "COMPLETED" } }
    });
    const completedprojectscount = await prisma.project.count({
        where: { clientId: clientProfile.id, status: { equals: "COMPLETED" } }
    });

    //Pending payment count
    const pendingpaymentscount = await prisma.payment.count({
        where: {
            project: { clientId: clientProfile.id },
            payment_status: { not: "PAID" }
        }
    });

    return {
        success: true,
        stats: {
            activeCount: projectscount,
            totalPaid: totalPaid,
            pendingDueCount: pendingpaymentscount,
            pendingAmount: lifetimeDue,
            completedCount: completedprojectscount
        }
    }
}
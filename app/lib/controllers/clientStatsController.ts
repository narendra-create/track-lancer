import { prisma } from "@/app/lib/prisma";
import { getInitials } from "../utilitys";

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
};

export const getClientCurrentProjects = async (clientId: string, cursor?: string) => {
    if (!clientId) {
        return { success: false, error: "Invalid Client id", status: 400 }
    }
    const result = await prisma.project.findMany({
        take: 4,
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
        where: {
            clientId: clientId, status: {
                in: ["ACTIVE", "STOPPED"]
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
                        }
                    },
                    category: true
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
        const received = project.payments.reduce((sum, p) => sum + p.paid_amount, 0);
        return {
            id: project.id,
            title: project.title,
            freelancerName: project.freelancer?.user.name ?? "unknown",
            freelancerInitials: getInitials(project.freelancer?.user.name ?? "unknown"),
            freelancerCategory: project.freelancer?.category,
            money: {
                totalAmount,
                received,
                remaining: totalAmount - received
            },
            status: project.status,
            stats: {
                totalMilestones,
                completedMilestones,
                progress
            },
            deadline: projectDeadline
        }
    })
    const nextCursor = projects.length === 4 ? projects[projects.length - 1].id : null;

    return { success: true, projects: projects, nextCursor }
}
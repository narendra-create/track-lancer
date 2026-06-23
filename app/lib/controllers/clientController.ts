import { prisma } from "@/app/lib/prisma";


export const getClientStat = async (freelancerid: string) => {
    const result = await prisma.$queryRaw<
        { count: bigint }[]
    >`SELECT COUNT(DISTINCT "clientId") as count
       FROM "Project"
       WHERE "freelancerId" = ${freelancerid}`

    return Number(result[0].count)
}

export const getCurrentProjects = async (freelancerid: string, cursor?: string) => {
    const result = await prisma.project.findMany({
        take: 4,
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
        where: {
            freelancerId: freelancerid, status: {
                not: "COMPLETED"
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
                milestone => milestone.status === "approved"
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
            client: project.client,
            money: {
                totalAmount,
                received,
                remaining: totalAmount - received
            },
            status: project.status,
            stats: {
                totalMilestones,
                completedMilestones,
                progress,
                projectDeadline
            }

        }

    });
    const nextCursor = projects.length === 4 ? projects[projects.length - 1].id : null;
    
    return { success: true, projects: projects, nextCursor }
}
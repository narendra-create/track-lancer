"use server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentProjects, getClientStat, getMoneyStats, getRavnuechartStats } from "../controllers/clientController";
import { getSession } from "../session";
import type { DashboardStatsResponse } from "@/types/dashboard";

export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", status: 401 };
    if (session.user.role.toLowerCase() !== "freelancer") return { success: false, error: "Forbidden", status: 403 };

    const freelancer = await prisma.freelancer.findUnique({
        where: { userId: session.user.id },
        select: {
            id: true,
            category: true,
            user: { select: { name: true, image: true } }
        }
    });
    if (!freelancer) return { success: false, error: "Freelancer profile not found", status: 404 };

    try {
        const [clientCount, projectsResult, moneyresult, ravenuedata] = await Promise.all([
            getClientStat(freelancer.id),
            getCurrentProjects(freelancer.id),
            getMoneyStats(freelancer.id),
            getRavnuechartStats(freelancer.id)
        ]);

        return {
            success: true,
            data: {
                name: freelancer.user.name,
                image: freelancer.user.image,
                skill: freelancer.category,
                clientCount,
                moneyStats: {
                    activeprojects: moneyresult.stats?.activeprojects!,
                    currentmonthearning: moneyresult.stats?.currentmonthearning!,
                    due: moneyresult?.stats?.due!,
                    lifetimeearning: moneyresult?.stats?.lifetimeearning!,
                    trendpercentage: moneyresult?.stats?.trendpercentage!,
                    pendingcount: moneyresult?.stats?.pendingcount!
                },
                ravenuechartdata: {
                    monthly: ravenuedata.monthly!,
                    weekly: ravenuedata.weekly!
                },
                projects: projectsResult.success ? projectsResult.projects : [],
                nextCursor: projectsResult.success ? projectsResult.nextCursor : null,
            }
        }
    }
    catch (err) {
        console.error("Dashboard fetch failed:", err);
        return { success: false, error: "Failed to load dashboard", status: 500 };
    }
}
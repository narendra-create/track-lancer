"use server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentProjects } from "@/app/lib/controllers/clientController";
import { getSession } from "@/app/lib/session";
import type { DashboardStatsResponse } from "@/types/dashboard";
import type { ClientDashboardData } from "@/app/Features/Client/Client-dashboard";
import { getAllProjects } from "@/app/lib/controllers/ProjectController";
import { getClientCurrentProjects, getClientMoneyStats, getDeadlines } from "../controllers/clientStatsController";

export const getClientStats = async () => {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", status: 401 };
    if (session.user.role.toLowerCase() !== "client") return { success: false, error: "Forbidden", status: 403 };

    const clientProfile = await prisma.userprofile.findUnique({
        where: { userId: session.user.id },
        select: {
            id: true,
            user: { select: { name: true, image: true } }
        }
    });
    if (!clientProfile) return { success: false, error: "Freelancer profile not found", status: 404 };
    try {
        const [activeProjectsResult, moneyStatsResult, currentProjectsRestult, deadlinesResult] = await Promise.all([
            getAllProjects(clientProfile.id, "CLIENT"),
            getClientMoneyStats(clientProfile.id),
            getClientCurrentProjects(clientProfile.id),
            getDeadlines(clientProfile.id)
        ]);

        const returnObject: ClientDashboardData = {
            name: clientProfile.user.name,
            stats: moneyStatsResult.success ? {
                activeCount: (moneyStatsResult as any).stats.activeCount,
                totalPaid: (moneyStatsResult as any).stats.totalPaid,
                pendingAmount: (moneyStatsResult as any).stats.pendingAmount,
                pendingDueCount: (moneyStatsResult as any).stats.pendingDueCount,
                completedCount: (moneyStatsResult as any).stats.completedCount
            } : {
                activeCount: 0,
                totalPaid: 0,
                pendingAmount: 0,
                pendingDueCount: 0,
                completedCount: 0
            },
            activeProjects: currentProjectsRestult.success ? (currentProjectsRestult as any).projects.map((p: any) => ({
                id: p.id,
                title: p.title,
                projectcode: p.id.substring(0, 8),
                status: p.status,
                agreedCost: p.money?.totalAmount || 0,
                deadline: p.deadline ? new Date(p.deadline).toISOString() : new Date().toISOString(),
                freelancerName: p.freelancerName,
                freelancerInitials: p.freelancerInitials,
                freelancerCategory: p.freelancerCategory,
                paid: p.money?.received || 0,
                remaining: p.money?.remaining || 0,
                milestones: []
            })) : [],
            deadlines: deadlinesResult.success ? (deadlinesResult as any).milestones : [],
            activity: []
        };

        return { success: true, data: returnObject };
    }
    catch (err) {
        console.error("Dashboard fetch failed:", err);
        return { success: false, error: "Failed to load dashboard", status: 500 };
    }
}
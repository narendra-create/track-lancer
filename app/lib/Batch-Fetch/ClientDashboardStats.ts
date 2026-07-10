"use server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentProjects } from "@/app/lib/controllers/clientController";
import { getSession } from "@/app/lib/session";
import type { DashboardStatsResponse } from "@/types/dashboard";
import type { ClientDashboardData } from "@/app/Features/Client/Client-dashboard";
import { getAllProjects } from "@/app/lib/controllers/ProjectController";
import { getClientMoneyStats } from "../controllers/clientStatsController";

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
        const [activeProjectsResult, moneyStatsResult] = await Promise.all([
            getAllProjects(clientProfile.id, "CLIENT"),
            getClientMoneyStats(clientProfile.id)
        ]);

        //         export type ClientDashboardData = {
        //   name: string; // The client's name (e.g. "Narendra")
        //   stats: {
        //     activeCount: number;      // Total number of active projects this client has
        //     totalPaid: number;        // Total money paid by this client across all time
        //     pendingAmount: number;    // Total amount currently due to be paid
        //     pendingDueCount: number;  // Number of individual payments in "DUE" status
        //     completedCount: number;   // Total number of completed projects
        //   };
        //   activeProjects: ClientDashboardProject[]; // Array of active projects (max 4 for dashboard)
        //   deadlines: ClientDeadlineItem[];          // Array of upcoming milestones across all projects
        //   activity: ClientActivityItem[];           // Array of recent activities (you can pass [] for now)
        // };
    }
    catch (err) {
        console.error("Dashboard fetch failed:", err);
        return { success: false, error: "Failed to load dashboard", status: 500 };
    }
}
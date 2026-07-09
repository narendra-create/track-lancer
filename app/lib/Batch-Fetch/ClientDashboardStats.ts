"use server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentProjects } from "../controllers/clientController";
import { getSession } from "@/app/lib/session";
import type { DashboardStatsResponse } from "@/types/dashboard";
import type { ClientDashboardData } from "@/app/Features/Client/Client-dashboard";

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
        const [projectsResult] = await Promise.all([
            getCurrentProjects(),
        ]);
    }
    catch (err) {
        console.error("Dashboard fetch failed:", err);
        return { success: false, error: "Failed to load dashboard", status: 500 };
    }
}
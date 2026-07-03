"use server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentProjects } from "../controllers/clientController";
import { getSession } from "../session";

export const loadMoreProjects = async (nextcursor: string) => {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", status: 401 };
    if (session.user.role.toLowerCase() !== "freelancer") return { success: false, error: "Forbidden", status: 403 };

    const freelancer = await prisma.freelancer.findUnique({
        where: { userId: session.user.id },
        select: { id: true }
    });
    if (!freelancer) return { success: false, error: "Freelancer profile not found", status: 404 };

    try {
        const result = await getCurrentProjects(freelancer.id, nextcursor);
        if (!result.success) {
            return {
                success: false,
                error: result.error,
                status: result.status
            }
        };

        return {
            success: true,
            projects: result.projects,
            nextcursor: result.nextCursor
        }
    }
    catch (err) {
        console.error("More projects fetch failed:", err);
        return { success: false, error: "Failed to load projects", status: 500 };
    }
}
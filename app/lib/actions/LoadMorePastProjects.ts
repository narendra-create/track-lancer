"use server";
import { prisma } from "@/app/lib/prisma";
import { getPastProjects } from "../controllers/ProjectController";
import { getSession } from "../session";

export const loadMorePastProjects = async (nextcursor: string) => {
    const session = await getSession();
    if (!session) return { success: false as const, error: "Unauthorized", status: 401 };
    if (session.user.role.toLowerCase() !== "freelancer") return { success: false as const, error: "Forbidden", status: 403 };

    const freelancer = await prisma.freelancer.findUnique({
        where: { userId: session.user.id },
        select: { id: true }
    });
    if (!freelancer) return { success: false as const, error: "Freelancer profile not found", status: 404 };

    try {
        const result = await getPastProjects("FREELANCER", freelancer.id, nextcursor);
        if (!result.success) {
            return { success: false as const, error: result.error, status: result.status };
        }
        return {
            success: true as const,
            projects: result.projects,
            nextCursor: result.nextCursor
        };
    } catch (err) {
        console.error("Past projects load more failed:", err);
        return { success: false as const, error: "Failed to load past projects", status: 500 };
    }
}

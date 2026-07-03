"use server";
import { prisma } from "@/app/lib/prisma";
import { getSession } from "../session";
import { getCurrentProjects } from "../controllers/clientController";
import { getPastProjects } from "../controllers/ProjectController";

export type LoadMoreType = "currentProjects" | "pastProjects";

const resolveFreelancerContext = async () => {
    const session = await getSession();
    if (!session) return { success: false as const, error: "Unauthorized", status: 401 };
    if (session.user.role.toLowerCase() !== "freelancer") return { success: false as const, error: "Forbidden", status: 403 };

    const freelancer = await prisma.freelancer.findUnique({
        where: { userId: session.user.id },
        select: { id: true }
    });
    if (!freelancer) return { success: false as const, error: "Freelancer profile not found", status: 404 };
    return { success: true as const, freelancerId: freelancer.id };
};

export const loadMore = async (type: LoadMoreType, nextcursor: string) => {
    const ctx = await resolveFreelancerContext();
    if (!ctx.success) return { success: false as const, error: ctx.error, status: ctx.status };

    try {
        switch (type) {
            case "currentProjects": {
                const result = await getCurrentProjects(ctx.freelancerId, nextcursor);
                if (!result.success) return { success: false as const, error: result.error, status: result.status };
                return { success: true as const, projects: result.projects, nextCursor: result.nextCursor };
            }
            case "pastProjects": {
                const result = await getPastProjects("FREELANCER", ctx.freelancerId, nextcursor);
                if (!result.success) return { success: false as const, error: result.error, status: result.status };
                return { success: true as const, projects: result.projects, nextCursor: result.nextCursor };
            }
            default:
                return { success: false as const, error: "Unknown load more type", status: 400 };
        }
    } catch (err) {
        console.error(`loadMore [${type}] failed:`, err);
        return { success: false as const, error: "Failed to load more", status: 500 };
    }
};

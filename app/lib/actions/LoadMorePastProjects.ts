"use server";
import { getPastProjects } from "../controllers/ProjectController";
import { requireRole } from "../require-role";
import { getFreelancerProfile } from "../controllers/profileController";

export const loadMorePastProjects = async (nextcursor: string) => {
    const { session, error, status } = await requireRole("freelancer");
    if (!session && error) {
        return { success: false as const, error, status };
    }
    const { profile } = await getFreelancerProfile(session?.user.email!);
    const freelancerId = profile?.Freelancer?.id;
    if (!freelancerId) {
        return { success: false as const, error: "Freelancer profile not found", status: 404 };
    }
    try {
        const result = await getPastProjects("FREELANCER", freelancerId, nextcursor);
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

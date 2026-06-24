import { getFreelancerProfile } from "../controllers/profileController";
import { getCurrentProjects, getClientStat } from "../controllers/clientController";
//getclientstat for getting number of clients serving or served, getprofile for getting freelancer id
import { auth } from "@/auth";
import { requireRole } from "../require-role";

export const getDashboardStats = async () => {
    const { session, error, status } = await requireRole("freelancer");
    if (!session && error) {
        return {
            success: false,
            error: error,
            status: status
        }
    };

    const { profile } = await getFreelancerProfile(session?.user.email!);
    const freelancerId = profile?.Freelancer?.id;
    if (!freelancerId) {
        return { success: false, error: "Freelancer profile not found", status: 404 };
    };

    try {
        const [clientCount, projectsResult] = await Promise.all([
            getClientStat(freelancerId),
            getCurrentProjects(freelancerId)
        ]);

        return {
            success: true,
            data: {
                name: profile.name,
                image: profile.image,
                skill: profile.Freelancer?.category,
                clientCount,
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
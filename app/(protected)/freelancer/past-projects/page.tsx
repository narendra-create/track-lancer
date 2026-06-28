import { PastProjects } from "@/app/components/PastProjects";
import { getPastProjects } from "@/app/lib/controllers/ProjectController";
import { getFreelancerProfile } from "@/app/lib/controllers/profileController";
import { loadMorePastProjects } from "@/app/lib/actions/LoadMorePastProjects";
import { requireRole } from "@/app/lib/require-role";
import { redirect } from "next/navigation";
import type { FreelancerPastProject, ClientPastProject } from "@/types/pastprojects";

const PastProjectsPage = async () => {
  const { session, error } = await requireRole("freelancer");
  if (!session && error) redirect("/login");

  const { profile } = await getFreelancerProfile(session?.user.email!);
  if (!profile?.Freelancer?.id) redirect("/unauthorized");

  const pastprojects = await getPastProjects("FREELANCER", profile.Freelancer.id);

  if (!pastprojects.success) redirect("/unauthorized");

  const loadmore = async (nextcursor: string) => {
    "use server";
    const result = await loadMorePastProjects(nextcursor);
    if (!result.success) return { projects: [] as FreelancerPastProject[] | ClientPastProject[], nextCursor: null };
    return { projects: result.projects, nextCursor: result.nextCursor };
  };

  return (
    <div className="mx-4 lg:pl-7 lg:pt-10">
      <PastProjects
        role="FREELANCER"
        projects={pastprojects.projects}
        nextCursor={pastprojects.nextCursor}
        loadmore={loadmore}
      />
    </div>
  );
};

export default PastProjectsPage;

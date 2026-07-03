import { PastProjects } from "@/app/components/PastProjects";
import { getPastProjects } from "@/app/lib/controllers/ProjectController";
import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/lib/prisma";
import { loadMorePastProjects } from "@/app/lib/actions/LoadMorePastProjects";
import { redirect } from "next/navigation";
import type { FreelancerPastProject, ClientPastProject } from "@/types/pastprojects";

const PastProjectsPage = async () => {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role.toLowerCase() !== "freelancer") redirect("/unauthorized");

  const freelancer = await prisma.freelancer.findUnique({
    where: { userId: session.user.id },
    select: { id: true }
  });
  if (!freelancer) redirect("/unauthorized");

  const pastprojects = await getPastProjects("FREELANCER", freelancer.id);

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

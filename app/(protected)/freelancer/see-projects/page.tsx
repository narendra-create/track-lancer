import { FreelancerAllProjects } from "@/app/components/FreelancerAllProjects";
import { getFreelancerProfile } from "@/app/lib/controllers/profileController";
import { requireRole } from "@/app/lib/require-role";
import { redirect } from "next/navigation";
import type { AllProject, GetAllProjectsResponse } from "@/types/allprojects";
import {
  deleteProject,
  getAllProjects,
} from "@/app/lib/controllers/ProjectController";

const SeeProjectsPage = async () => {
  const { session, error } = await requireRole("freelancer");
  if (!session && error) redirect("/login");

  const { profile } = await getFreelancerProfile(session?.user.email!);
  if (!profile?.Freelancer?.id) redirect("/unauthorized");

  const projects = await getAllProjects(profile.Freelancer.id, "FREELANCER");

  if (!projects.success) redirect("/unauthorized");

  const loadmore = async (nextcursor: string) => {
    "use server";
    const { profile } = await getFreelancerProfile(session?.user.email!);
    if (!profile?.Freelancer?.id)
      return { success: false as const, error: "Unauthorized", status: 401 };
    return await getAllProjects(profile.Freelancer.id, "FREELANCER", nextcursor) as GetAllProjectsResponse;
  };

  const handleDelete = async (id: string) => {
    "use server";
    const result = await deleteProject(profile.Freelancer?.id!, id);
    if (!result.success) {
      return { success: false as const, error: result.error };
    }
    return { success: true as const };
  };

  return (
    <div className="mx-4 lg:pl-7 lg:pt-10">
      <FreelancerAllProjects
        handleDelete={handleDelete}
        initialProjects={projects.projects as AllProject[]}
        initialNextCursor={projects.nextCursor ?? null}
        loadMore={loadmore}
      />
    </div>
  );
};

export default SeeProjectsPage;

import { FreelancerAllProjects } from "@/app/components/freelancer/FreelancerAllProjects";
import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import type { AllProject, GetAllProjectsResponse } from "@/types/allprojects";
import {
  deleteProject,
  getAllProjects,
} from "@/app/lib/controllers/ProjectController";

const SeeProjectsPage = async () => {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role.toLowerCase() !== "freelancer") redirect("/unauthorized");

  const freelancer = await prisma.freelancer.findUnique({
    where: { userId: session.user.id },
    select: { id: true }
  });
  if (!freelancer) redirect("/unauthorized");

  const projects = await getAllProjects(freelancer.id, "FREELANCER");

  if (!projects.success) redirect("/unauthorized");

  const loadmore = async (nextcursor: string) => {
    "use server";
    const session = await getSession();
    if (!session || session.user.role.toLowerCase() !== "freelancer")
      return { success: false as const, error: "Unauthorized", status: 401 };
    const freelancer = await prisma.freelancer.findUnique({
      where: { userId: session.user.id },
      select: { id: true }
    });
    if (!freelancer) return { success: false as const, error: "Unauthorized", status: 401 };
    return await getAllProjects(freelancer.id, "FREELANCER", nextcursor) as GetAllProjectsResponse;
  };

  const handleDelete = async (id: string) => {
    "use server";
    const session = await getSession();
    if (!session) return { success: false as const, error: "Unauthorized" };
    const freelancer = await prisma.freelancer.findUnique({
      where: { userId: session.user.id },
      select: { id: true }
    });
    if (!freelancer) return { success: false as const, error: "Unauthorized" };
    const result = await deleteProject(freelancer.id, id);
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

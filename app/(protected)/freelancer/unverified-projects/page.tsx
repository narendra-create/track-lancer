import { PendingProjects } from "@/app/components/PendingProjects";
import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/lib/prisma";
import {
  getUnverifiedProjects,
  deleteProject,
  regenerateCode,
} from "@/app/lib/controllers/ProjectController";
import { formatDate } from "@/app/lib/utilitys";

const UnverifiedProjects = async () => {
  const session = await getSession();

  if (!session?.user?.email) {
    return <div className="p-4 text-red-500">Please login again</div>;
  }
  if (session.user.role.toLowerCase() !== "freelancer") {
    return <div className="p-4 text-red-500">Error in auth - Forbidden - 403</div>;
  }

  const freelancer = await prisma.freelancer.findUnique({
    where: { userId: session.user.id },
    select: { id: true }
  });
  if (!freelancer) {
    return <div className="p-4 text-red-500">Freelancer profile not found</div>;
  }

  const projectsRes = await getUnverifiedProjects(freelancer.id);

  if (!projectsRes.success) {
    return <div className="p-4 text-red-500">{projectsRes.error}</div>;
  }

  const formattedProjects = (projectsRes.projects || []).map(p => ({
    id: p.id,
    title: p.title,
    agreedcost: p.agreedCost,
    deadline: formatDate(p.deadline),
    description: p.description ?? undefined,
  }));

  const handleRegenerateCode = async (id: string) => {
    "use server";
    const session = await getSession();
    if (!session) return;
    const freelancer = await prisma.freelancer.findUnique({
      where: { userId: session.user.id },
      select: { id: true }
    });
    if (!freelancer) return;
    const result = await regenerateCode(freelancer.id, id);
    if (!result.success) {
      console.error(`${result.error} - ${result.status}`);
      return;
    }
    return { projectCode: result.projectcode };
  };

  const handleDelete = async (id: string) => {
    "use server";
    const session = await getSession();
    if (!session) return;
    const freelancer = await prisma.freelancer.findUnique({
      where: { userId: session.user.id },
      select: { id: true }
    });
    if (!freelancer) return;
    const result = await deleteProject(freelancer.id, id);
    if (!result.success) {
      console.error(`${result.error} - ${result.status}`);
      return;
    }
    return;
  };

  return (
    <main className="mx-4 lg:pl-7 lg:pt-10">
      <PendingProjects
        projects={formattedProjects}
        handleRegenerateCode={handleRegenerateCode}
        handleDelete={handleDelete}
      />
    </main>
  );
};

export default UnverifiedProjects;

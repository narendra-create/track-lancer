import { PendingProjects } from "@/app/components/PendingProjects";
import { requireRole } from "@/app/lib/require-role";
import {
  getUnverifiedProjects,
  deleteProject,
  regenerateCode,
} from "@/app/lib/controllers/ProjectController";
import { getFreelancerProfile } from "@/app/lib/controllers/profileController";
import { formatDate } from "@/app/lib/utilitys";

const UnverifiedProjects = async () => {
  const { session, error, status } = await requireRole("freelancer");
  
  if (error) {
    return <div className="p-4 text-red-500">Error in auth - {error} - {status}</div>;
  }
  
  if (!session?.user?.email) {
    return <div className="p-4 text-red-500">Please login again</div>;
  }
  
  const freelancer = await getFreelancerProfile(session.user.email);
  if (!freelancer.success || !freelancer.profile?.Freelancer?.id) {
    return <div className="p-4 text-red-500">Freelancer profile not found</div>;
  }

  const freelancerId = freelancer.profile.Freelancer.id;
  const projectsRes = await getUnverifiedProjects(freelancerId);
  
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
    const result = await regenerateCode(freelancerId, id);
    if (!result.success) {
      console.error(`${result.error} - ${result.status}`);
      return;
    }
    return { projectCode: result.projectcode };
  };

  const handleDelete = async (id: string) => {
    "use server";
    const result = await deleteProject(freelancerId, id);
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

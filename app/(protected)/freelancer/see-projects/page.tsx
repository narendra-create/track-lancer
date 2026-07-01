import { FreelancerAllProjects } from "@/app/components/FreelancerAllProjects";
import { getFreelancerProfile } from "@/app/lib/controllers/profileController";
import { requireRole } from "@/app/lib/require-role";
import { redirect } from "next/navigation";

const PastProjectsPage = async () => {
  const { session, error } = await requireRole("freelancer");
  if (!session && error) redirect("/login");

  const { profile } = await getFreelancerProfile(session?.user.email!);
  if (!profile?.Freelancer?.id) redirect("/unauthorized");

  //   const projects = getCurrentProjects(profile.Freelancer.id);

  //   if (!projects.success) redirect("/unauthorized");

  //   const loadmore = async (nextcursor: string) => {
  //     "use server";
  //     const { profile } = await getFreelancerProfile(session?.user.email!);
  //     if (!profile?.Freelancer?.id) redirect("/unauthorized");
  //     const result = await getCurrentProjects(profile.Freelancer?.id, nextcursor);
  //     if (!result.success)
  //       return {
  //         projects: [] as FreelancerPastProject[] | ClientPastProject[],
  //         nextCursor: null,
  //       };
  //     return { projects: result.projects, nextCursor: result.nextCursor };
  //   };

  return (
    <div className="mx-4 lg:pl-7 lg:pt-10">
      <FreelancerAllProjects />
    </div>
  );
};

export default PastProjectsPage;

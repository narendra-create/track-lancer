import React from "react";
import { requireRole } from "@/app/lib/require-role";
import { getFreelancerProfile } from "@/app/lib/controllers/profileController";
import { redirect } from "next/navigation";
import { FreelancerMilestones } from "@/app/components/FreelancerMilestones";
import { getAllMilestones } from "@/app/lib/controllers/milestoneController";

type Props = {
  params: Promise<{
    projectid: string;
  }>;
};

const Milestones = async ({ params }: Props) => {
  const { projectid } = await params;
  if (!projectid) {
    return redirect("/dashboard");
  }
  const { session, error } = await requireRole("freelancer");
  if (error) {
    return redirect("/unauthorized");
  }
  if (!session?.user) {
    return redirect("/login");
  }
  const freelancer = await getFreelancerProfile(session.user.email);

  const result = await getAllMilestones(
    projectid,
    freelancer.profile?.Freelancer?.id!,
    "FREELANCER",
  );

  if (!result.success) {
    return redirect("/freelancer/dashboard");
  }

  if (!result.project) {
    return redirect("/freelancer/dashboard");
  }

  return (
    <main>
      <FreelancerMilestones
        project={result.project}
        projectTitle={result.project.title}
        projectStatus={result.project.status}
        role="FREELANCER"
      />
    </main>
  );
};

export default Milestones;

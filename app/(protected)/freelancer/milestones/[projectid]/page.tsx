import React from "react";
import { requireRole } from "@/app/lib/require-role";
import { getFreelancerProfile } from "@/app/lib/controllers/profileController";
import { redirect } from "next/navigation";
import { FreelancerMilestones } from "@/app/components/FreelancerMilestones";

type Props = {
  params: Promise<{
    projectid: string;
  }>;
};

const Milestones = async ({ params }: Props) => {
  const { projectid } = await params;
  if (!projectid) {
    alert("Please Provide projectid");
    return redirect("/dashboard");
  }
  const { session, error, status } = await requireRole("freelancer");
  if (error) {
    return { error: `Error creating project - ${error} - ${status}` };
  }
  if (!session?.user) {
    return { error: "User is logged out" };
  }
  const freelancer = await getFreelancerProfile(session.user.email);

  const getMilestones = async (freelancerid: string, projectId: string) => {};

  return (
    <main>
      <FreelancerMilestones />
    </main>
  );
};

export default Milestones;

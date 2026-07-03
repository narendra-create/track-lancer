import React from "react";
import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/lib/prisma";
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
  const session = await getSession();
  if (!session) return redirect("/login");
  if (session.user.role.toLowerCase() !== "freelancer") return redirect("/unauthorized");

  const freelancer = await prisma.freelancer.findUnique({
    where: { userId: session.user.id },
    select: { id: true }
  });
  if (!freelancer) return redirect("/unauthorized");

  const result = await getAllMilestones(
    projectid,
    freelancer.id,
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

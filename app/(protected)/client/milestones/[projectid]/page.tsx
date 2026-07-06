import React from "react";
import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { FreelancerMilestones } from "@/app/components/freelancer/FreelancerMilestones";
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
  if (session.user.role.toLowerCase() !== "client") {
    return redirect("/unauthorized");
  }

  const client = await prisma.userprofile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!client) return redirect("/unauthorized");

  const result = await getAllMilestones(projectid, client.id, "CLIENT");

  if (!result.success) {
    return redirect("/client/dashboard");
  }

  if (!result.project) {
    return redirect("/client/dashboard");
  }

  return (
    <main>
      <FreelancerMilestones
        project={result.project}
        projectTitle={result.project.title}
        projectStatus={result.project.status}
        role="CLIENT"
      />
    </main>
  );
};

export default Milestones;

import React from "react";
import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { FreelancerMilestones } from "@/app/components/freelancer/FreelancerMilestones";
import {
  getAllMilestones,
  stopProject,
} from "@/app/lib/controllers/milestoneController";
import {
  raiseCancellRequest,
  processCancellRequest,
  resumeProject,
} from "@/app/lib/controllers/ProjectController";

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

  const handleCancelProject = async (projectId: string) => {
    "use server";
    const result = await raiseCancellRequest(projectId);
    if (!result.success) {
      return { error: result.error ?? "Failed to cancel project" };
    }
    revalidatePath(`/client/milestones/${projectId}`);
    return { updated: true };
  };

  const handleApprove = async (projectId: string) => {
    "use server";
    const result = await processCancellRequest(projectId, "APPROVE");
    if (!result.success) {
      return { error: result.error ?? "Failed to approve request" };
    }
    revalidatePath(`/client/milestones/${projectId}`);
    return { updated: true };
  };

  const handleReject = async (projectId: string) => {
    "use server";
    const result = await processCancellRequest(projectId, "REJECT");
    if (!result.success) {
      return { error: result.error ?? "Failed to reject request" };
    }
    revalidatePath(`/client/milestones/${projectId}`);
    return { updated: true };
  };

  const handleStopProject = async (projectId: string) => {
    "use server";
    const result = await stopProject(projectId);
    if (!result.success) {
      return { error: result.error ?? "Failed to stop project" };
    }
    revalidatePath(`/client/milestones/${projectId}`);
    return { updated: true };
  };

  const handleResumeProject = async (projectId: string) => {
    "use server";
    if (!projectId) return;
    const result = await resumeProject(projectId);
    if (!result.success) {
      return { success: false, error: `${result.error} - ${result.status}` };
    }
    return { success: true, status: 200 };
  };

  return (
    <main>
      <FreelancerMilestones
        onResumeProject={handleResumeProject}
        project={result.project}
        projectTitle={result.project.title}
        projectStatus={result.project.status}
        onCancelProject={handleCancelProject}
        onStopProject={handleStopProject}
        onApprove={handleApprove}
        onReject={handleReject}
        role="CLIENT"
      />
    </main>
  );
};

export default Milestones;

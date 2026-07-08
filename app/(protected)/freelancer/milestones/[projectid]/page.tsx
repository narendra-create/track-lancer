import React from "react";
import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { FreelancerMilestones } from "@/app/components/freelancer/FreelancerMilestones";
import {
  createMilestone,
  getAllMilestones,
  delayMilestone,
  deleteMilestone,
  markMilestoneCompleted,
} from "@/app/lib/controllers/milestoneController";
import {
  createMilestoneInput,
  createMilestoneSchema,
  delayMilestoneInput,
  delayMilestoneSchema,
} from "@/app/lib/validations/MilestoneValidation";
import {
  createBudgetRequestSchema,
  createBudgetInput,
} from "@/app/lib/validations/Budgetrequest";
import { raiseBudgetRequest } from "@/app/lib/controllers/BudgetController";

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
  if (session.user.role.toLowerCase() !== "freelancer")
    return redirect("/unauthorized");

  const freelancer = await prisma.freelancer.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!freelancer) return redirect("/unauthorized");

  const result = await getAllMilestones(projectid, freelancer.id, "FREELANCER");

  if (!result.success) {
    return redirect("/freelancer/dashboard");
  }

  if (!result.project) {
    return redirect("/freelancer/dashboard");
  }

  const handleCreate = async (data: createMilestoneInput) => {
    "use server";
    const parsed = createMilestoneSchema.parse(data);
    const result = await createMilestone(parsed);
    if (!result.success) {
      return { error: `${result.error} - ${result.status}` };
    }
    revalidatePath(`/freelancer/milestones/${projectid}`);
    return parsed;
  };

  const handleDelete = async (milestoneId: string, projectId: string) => {
    "use server";
    const result = await deleteMilestone(milestoneId, projectId);
    if (!result.success) {
      return { error: `${result.error} - ${result.status}` };
    }
    revalidatePath(`/freelancer/milestones/${projectId}`);
    return { deletedMilestone: result.deletedMilestoneId };
  };

  const handleDelayMilestone = async (
    data: delayMilestoneInput,
    projectId: string,
  ) => {
    "use server";
    const parsed = delayMilestoneSchema.parse(data);
    const result = await delayMilestone(parsed);
    if (!result.success) {
      return { error: `${result.error} - ${result.status}` };
    }
    revalidatePath(`/freelancer/milestones/${projectId}`);
    return { updated: result.updatedMilestone };
  };

  const handleBudgetRaiseRequest = async (
    data: createBudgetInput,
    projectId: string,
  ) => {
    "use server";
    const parsed = createBudgetRequestSchema.parse(data);
    const result = await raiseBudgetRequest(parsed);
    if (!result.success) {
      return { error: `${result.error} - ${result.status}` };
    }
    revalidatePath(`/freelancer/milestones/${projectId}`);
    return {
      generatedRequest: result.request,
    };
  };

  const handleComplete = async (milestoneId: string, projectId: string) => {
    "use server";
    const result = await markMilestoneCompleted(milestoneId, projectId);
    if (!result.success) {
      return { error: `${result.error} - ${result.status}` };
    }
    revalidatePath(`/freelancer/milestones/${projectId}`);
    return { updated: result.milestone };
  };

  return (
    <main>
      <FreelancerMilestones
        onBudgetRaiseRequest={handleBudgetRaiseRequest}
        onCreate={handleCreate}
        onDelete={handleDelete}
        onDelayMilestone={handleDelayMilestone}
        project={result.project}
        projectTitle={result.project.title}
        projectStatus={result.project.status}
        onCompleteMilestone={handleComplete}
        role="FREELANCER"
      />
    </main>
  );
};

export default Milestones;

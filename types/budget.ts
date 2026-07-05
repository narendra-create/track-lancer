import type { BudgetRequestStatus } from "@/app/generated/prisma/enums";

export type BudgetRequestItem = {
  id: string;
  projectId: string;
  project: {
    id: string;
    title: string;
  };
  requestedById: string;
  currentBudget: number;
  requestedBudget: number;
  reason: string | null;
  status: BudgetRequestStatus;
  createdAt: Date;
  updatedAt: Date;
  reviewedAt: Date | null;
};

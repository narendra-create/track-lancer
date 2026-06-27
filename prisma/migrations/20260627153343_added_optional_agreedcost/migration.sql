-- CreateEnum
CREATE TYPE "BudgetRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "agreedCost" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "BudgetRaiseRequest" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "currentBudget" INTEGER NOT NULL,
    "requestedBudget" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "BudgetRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "BudgetRaiseRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BudgetRaiseRequest_status_createdAt_reviewedAt_requestedByI_idx" ON "BudgetRaiseRequest"("status", "createdAt", "reviewedAt", "requestedById");

-- AddForeignKey
ALTER TABLE "BudgetRaiseRequest" ADD CONSTRAINT "BudgetRaiseRequest_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

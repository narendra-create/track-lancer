/*
  Warnings:

  - You are about to drop the column `freelancerid` on the `Milestone` table. All the data in the column will be lost.
  - You are about to drop the `FreelancerClient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FreelancerPaymentClient` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FreelancerClient" DROP CONSTRAINT "FreelancerClient_clientid_fkey";

-- DropForeignKey
ALTER TABLE "FreelancerClient" DROP CONSTRAINT "FreelancerClient_freelancerId_fkey";

-- DropForeignKey
ALTER TABLE "FreelancerPaymentClient" DROP CONSTRAINT "FreelancerPaymentClient_clientid_fkey";

-- DropForeignKey
ALTER TABLE "FreelancerPaymentClient" DROP CONSTRAINT "FreelancerPaymentClient_freelancerId_fkey";

-- DropForeignKey
ALTER TABLE "FreelancerPaymentClient" DROP CONSTRAINT "FreelancerPaymentClient_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "Milestone" DROP CONSTRAINT "Milestone_freelancerid_fkey";

-- AlterTable
ALTER TABLE "Milestone" DROP COLUMN "freelancerid",
ADD COLUMN     "projectId" TEXT;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "projectId" TEXT;

-- DropTable
DROP TABLE "FreelancerClient";

-- DropTable
DROP TABLE "FreelancerPaymentClient";

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "freelancerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Userprofile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "Freelancer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[projectId]` on the table `CancellRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CancellRequest_freelancerId_freelancerApproved_clientId_cli_idx";

-- CreateIndex
CREATE UNIQUE INDEX "CancellRequest_projectId_key" ON "CancellRequest"("projectId");

-- CreateIndex
CREATE INDEX "CancellRequest_freelancerId_freelancerApproved_clientId_cli_idx" ON "CancellRequest"("freelancerId", "freelancerApproved", "clientId", "clientApproved");

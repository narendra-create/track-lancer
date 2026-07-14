/*
  Warnings:

  - Added the required column `userId` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Activity_userId_createdAt_projectId_type_idx" ON "Activity"("userId", "createdAt", "projectId", "type");

-- CreateIndex
CREATE INDEX "Milestonedelay_createdAt_milestoneId_idx" ON "Milestonedelay"("createdAt", "milestoneId");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - The values [PENDING_PAYEMENT] on the enum `Milestonestatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Milestonestatus_new" AS ENUM ('PENDING_PAYMENT', 'COMPLETED', 'NOT_STARTED', 'IN_PROGRESS', 'STOPPED');
ALTER TABLE "Milestone" ALTER COLUMN "status" TYPE "Milestonestatus_new" USING ("status"::text::"Milestonestatus_new");
ALTER TYPE "Milestonestatus" RENAME TO "Milestonestatus_old";
ALTER TYPE "Milestonestatus_new" RENAME TO "Milestonestatus";
DROP TYPE "public"."Milestonestatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "BudgetRaiseRequest" ALTER COLUMN "reason" DROP NOT NULL;

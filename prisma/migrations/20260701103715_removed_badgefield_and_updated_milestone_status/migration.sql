/*
  Warnings:

  - The values [approved,pending_payment,not_started,stopped] on the enum `Milestonestatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `badge` on the `Milestone` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Milestonestatus_new" AS ENUM ('PENDING_PAYEMENT', 'COMPLETED', 'IN_PROGRESS', 'STOPPED');
ALTER TABLE "Milestone" ALTER COLUMN "status" TYPE "Milestonestatus_new" USING ("status"::text::"Milestonestatus_new");
ALTER TYPE "Milestonestatus" RENAME TO "Milestonestatus_old";
ALTER TYPE "Milestonestatus_new" RENAME TO "Milestonestatus";
DROP TYPE "public"."Milestonestatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Milestone" DROP COLUMN "badge";

/*
  Warnings:

  - The values [PENDING_VERIFICATION] on the enum `Paymentstatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('VERIFIED', 'PENDING_VERIFICATION', 'REJECTED');

-- AlterEnum
BEGIN;
CREATE TYPE "Paymentstatus_new" AS ENUM ('DUE', 'PAID');
ALTER TABLE "Payment" ALTER COLUMN "payment_status" TYPE "Paymentstatus_new" USING ("payment_status"::text::"Paymentstatus_new");
ALTER TYPE "Paymentstatus" RENAME TO "Paymentstatus_old";
ALTER TYPE "Paymentstatus_new" RENAME TO "Paymentstatus";
DROP TYPE "public"."Paymentstatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Paymentverification" ADD COLUMN     "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION';

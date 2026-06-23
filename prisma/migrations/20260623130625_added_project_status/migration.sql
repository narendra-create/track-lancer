/*
  Warnings:

  - Added the required column `status` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Projectstatus" AS ENUM ('COMPLETED', 'PENDING', 'STOPPED');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "status" "Projectstatus" NOT NULL;

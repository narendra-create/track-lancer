/*
  Warnings:

  - Added the required column `role` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "userrole" AS ENUM ('FREELANCER', 'CLIENT');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "userrole" NOT NULL;

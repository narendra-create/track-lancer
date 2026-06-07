-- CreateEnum
CREATE TYPE "Categorys" AS ENUM ('WEB_DEV', 'VIDEO_EDITOR', 'GRAPHIC_DESIGNER', 'WEB_DESIGNER', 'SEO');

-- CreateEnum
CREATE TYPE "Milestonestatus" AS ENUM ('approved', 'pending_payment', 'not_started', 'stopped');

-- CreateTable
CREATE TABLE "Freelancer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" "Categorys" NOT NULL,

    CONSTRAINT "Freelancer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FreelancerClient" (
    "id" TEXT NOT NULL,
    "freelancerId" TEXT,
    "clientid" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FreelancerClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Userprofile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Userprofile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "status" "Milestonestatus" NOT NULL,
    "badge" TEXT,
    "freelancerid" TEXT NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Freelancer_userId_key" ON "Freelancer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Userprofile_userId_key" ON "Userprofile"("userId");

-- AddForeignKey
ALTER TABLE "Freelancer" ADD CONSTRAINT "Freelancer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreelancerClient" ADD CONSTRAINT "FreelancerClient_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "Freelancer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreelancerClient" ADD CONSTRAINT "FreelancerClient_clientid_fkey" FOREIGN KEY ("clientid") REFERENCES "Userprofile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Userprofile" ADD CONSTRAINT "Userprofile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_freelancerid_fkey" FOREIGN KEY ("freelancerid") REFERENCES "Freelancer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

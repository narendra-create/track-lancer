-- CreateEnum
CREATE TYPE "Paymentstatus" AS ENUM ('DUE', 'PENDING_VERIFICATION', 'PAID');

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "total_cost" INTEGER NOT NULL,
    "paid_amount" INTEGER NOT NULL,
    "payment_status" "Paymentstatus" NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FreelancerPaymentClient" (
    "id" TEXT NOT NULL,
    "freelancerId" TEXT,
    "clientid" TEXT,
    "paymentId" TEXT NOT NULL,

    CONSTRAINT "FreelancerPaymentClient_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FreelancerPaymentClient" ADD CONSTRAINT "FreelancerPaymentClient_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "Freelancer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreelancerPaymentClient" ADD CONSTRAINT "FreelancerPaymentClient_clientid_fkey" FOREIGN KEY ("clientid") REFERENCES "Userprofile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreelancerPaymentClient" ADD CONSTRAINT "FreelancerPaymentClient_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

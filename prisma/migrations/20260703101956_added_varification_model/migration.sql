-- CreateTable
CREATE TABLE "Paymentverification" (
    "id" TEXT NOT NULL,
    "txn_number" TEXT NOT NULL,
    "paymentid" TEXT NOT NULL,
    "paid_amount" INTEGER NOT NULL,
    "imageurl" TEXT,
    "freelancerId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "Paymentverification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Paymentverification_txn_number_freelancerId_clientId_idx" ON "Paymentverification"("txn_number", "freelancerId", "clientId");

-- AddForeignKey
ALTER TABLE "Paymentverification" ADD CONSTRAINT "Paymentverification_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Userprofile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paymentverification" ADD CONSTRAINT "Paymentverification_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "Freelancer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paymentverification" ADD CONSTRAINT "Paymentverification_paymentid_fkey" FOREIGN KEY ("paymentid") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetRaiseRequest" ADD CONSTRAINT "BudgetRaiseRequest_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "Freelancer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

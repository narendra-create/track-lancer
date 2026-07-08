import { VerifyPaymentsList } from "@/app/components/VerifyPaymentsList";
import { DUMMY_VERIFICATIONS } from "@/app/components/seeds/VerifyPaymentsSeed";

const VerifyPaymentsPage = () => {
  return (
    <main className="mx-4 lg:pl-7 lg:pt-10">
      <VerifyPaymentsList
        initialVerifications={DUMMY_VERIFICATIONS}
        role="FREELANCER"
      />
    </main>
  );
};

export default VerifyPaymentsPage;

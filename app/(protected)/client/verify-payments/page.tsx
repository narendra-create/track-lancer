import { DUMMY_VERIFICATIONS } from "@/app/components/seeds/VerifyPaymentsSeed";
import { VerifyPaymentsList } from "@/app/components/VerifyPaymentsList";

const VerifyPaymentsPage = () => {
  return (
    <main className="mx-4 lg:pl-7 lg:pt-10">
      <VerifyPaymentsList
        initialVerifications={DUMMY_VERIFICATIONS}
        role="CLIENT"
      />
    </main>
  );
};

export default VerifyPaymentsPage;

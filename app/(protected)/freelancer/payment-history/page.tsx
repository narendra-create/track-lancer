import { ProjectPaymentHistory } from "@/app/components/ProjectPaymentHistory";
import type { PaymentHistory } from "@/types/payment";
import { DUMMY_PROJECTS } from "@/app/components/seeds/PaymentsSeed";
import { PaymentDetails } from "@/app/components/PaymentDetails";

const PaymentHistory = () => {
  return (
    <main>
      {/* <PaymentDetails role="CLIENT"/> */}
      <ProjectPaymentHistory projects={DUMMY_PROJECTS} role="CLIENT" />
    </main>
  );
};

export default PaymentHistory;

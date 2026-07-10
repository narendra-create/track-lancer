import { PayNowError } from "@/app/components/client/PayNowError";
import { PaymentDetails } from "@/app/components/PaymentDetails";
import { StateDisplay } from "@/app/components/StateDisplay";
import { PaymentDetailUiController } from "@/app/lib/controllers/PaymentDetailUiController";

type Props = {
  params: Promise<{
    paymentId: string;
  }>;
};

const PaymentDetailsPage = async ({ params }: Props) => {
  const { paymentId } = await params;
  if (!paymentId) {
    return <PayNowError code={404} backHref={"/freelancer/payment-history"} />;
  }

  const result = await PaymentDetailUiController(paymentId);

  if (!result.success) {
    return (
      <main className="p-4 lg:p-8">
        <StateDisplay
          type="error"
          title="Failed to Load History"
          message={
            result.error || "We couldn't retrieve your payment page right now."
          }
        />
      </main>
    );
  }

  if (result.status === 404) {
    return (
      <main className="p-4 lg:p-8">
        <StateDisplay
          type="empty"
          title="No Payment Found"
          message="You haven't made any payments yet. When you do, they will appear here."
        />
      </main>
    );
  }

  return (
    <main>
      <PaymentDetails role="FREELANCER" paymentdetail={result.details} />
    </main>
  );
};

export default PaymentDetailsPage;

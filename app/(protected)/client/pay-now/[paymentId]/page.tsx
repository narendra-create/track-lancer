import {
  intiiatePaymentSchema,
  intiiatePaymentInput,
} from "@/app/lib/validations/PaymentValidation";
import {
  getPaymentDetails,
  initiatePayment,
} from "@/app/lib/controllers/paymentController";
import { PayNowView } from "@/app/components/client/PayNowView";
import { PayNowError } from "@/app/components/client/PayNowError";
import { formatDate } from "@/app/lib/utilitys";

type Props = {
  params: Promise<{
    paymentId: string;
  }>;
};

const BACK_HREF = "/client/payment-history";

const PaymentPage = async ({ params }: Props) => {
  const { paymentId } = await params;

  if (!paymentId) {
    return <PayNowError code={404} backHref={BACK_HREF} />;
  }

  const detailresult = await getPaymentDetails(paymentId);

  if (!detailresult.success) {
    const code = detailresult.status as 401 | 403 | 404 | 409;
    return (
      <PayNowError
        code={code ?? "unknown"}
        message={detailresult.error}
        backHref={BACK_HREF}
      />
    );
  }

  if (!detailresult.details?.freelancer) {
    return (
      <PayNowError
        code={404}
        message="No freelancer is linked to this payment. Please contact support."
        backHref={BACK_HREF}
      />
    );
  }

  const handleVerify = async (paid_amount: number, txn_number: string) => {
    "use server";
    const payload: intiiatePaymentInput = {
      paid_amount,
      txn_number,
      paymentId: detailresult.details.id ?? paymentId,
    };
    const parsed = intiiatePaymentSchema.safeParse(payload);
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }
    const result = await initiatePayment(parsed.data);
    if (!result.success) {
      return {
        error: `- ${result.status}, cause - ${result.error} - Please submit again or contact freelancer`,
      };
    }
    return { verification: result.createdVerification };
  };

  return (
    <PayNowView
      projectTitle={detailresult.details.title}
      freelancerName={
        detailresult.details.freelancer.AccountHolderName ??
        detailresult.details.freelancer.user.name
      }
      upiId={detailresult.details.freelancer.upiId}
      amount={"custom"}
      dueDate={formatDate(detailresult.details.due_date)}
      status={detailresult.details.payment_status}
      backHref={BACK_HREF}
      onVerify={handleVerify}
    />
  );
};

export default PaymentPage;

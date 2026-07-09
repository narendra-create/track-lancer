import { VerifyPaymentsList } from "@/app/components/VerifyPaymentsList";
import { StateDisplay } from "@/app/components/StateDisplay";
import {
  markVerifiedPayment,
  markRejectPayment,
  getPaymentVerificationRequests,
} from "@/app/lib/controllers/paymentController";
import { revalidatePath } from "next/cache";

const VerifyPaymentsPage = async () => {
  const result = await getPaymentVerificationRequests();
  if (!result.success) {
    return (
      <main className="p-4 lg:p-8">
        <StateDisplay
          type="error"
          title="Failed to Load Requests"
          message={
            result.error ||
            "We couldn't retrieve your verification requests right now."
          }
        />
      </main>
    );
  }

  if (result.requests.length === 0) {
    return (
      <main className="p-4 lg:p-8">
        <StateDisplay
          type="empty"
          title="No Payment Verification Requests"
          message="You don't have any Verification Requests yet."
        />
      </main>
    );
  }

  const requests = result.requests;
  const nextCursor = result.nextCursor;

  const handleLoadMore = async (cursor: string) => {
    "use server";
    const result = await getPaymentVerificationRequests(cursor);
    if (!result.success) {
      return { error: result.error || "Failed to load more requests" };
    }
    return {
      requests: result.requests,
      nextCursor: result.nextCursor,
    };
  };

  const handleAccept = async (VerificationId: string) => {
    "use server";
    const result = await markVerifiedPayment(VerificationId);
    if (!result.success) {
      return { error: `${result.error} - ${result.status}` };
    }
    revalidatePath("/freelancer/verify-payments");
    return { updated: result.updated };
  };

  const handleReject = async (VerificationId: string) => {
    "use server";
    const result = await markRejectPayment(VerificationId);
    if (!result.success) {
      return { error: `${result.error} - ${result.status}` };
    }
    revalidatePath("/freelancer/verify-payments");
    return { updated: result.updated };
  };

  return (
    <main>
      <VerifyPaymentsList
        initialVerifications={requests}
        role="FREELANCER"
        onAccept={handleAccept}
        onReject={handleReject}
        cursor={nextCursor}
        onLoadMore={handleLoadMore}
      />
    </main>
  );
};

export default VerifyPaymentsPage;

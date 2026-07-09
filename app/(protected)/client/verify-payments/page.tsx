import { VerifyPaymentsList } from "@/app/components/VerifyPaymentsList";
import { StateDisplay } from "@/app/components/StateDisplay";
import { getPaymentVerificationRequests } from "@/app/lib/controllers/paymentController";

const VerifyPaymentsPage = async () => {
  const result = await getPaymentVerificationRequests();
  if (!result.success) {
    return (
      <main className="p-4 lg:p-8">
        <StateDisplay
          type="error"
          title="Failed to Load Requests"
          message={result.error || "We couldn't retrieve your verification requests right now."}
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
          message="You haven't submitted any Verification Requests yet."
        />
      </main>
    );
  }

  const handleLoadMore = async (cursor: string) => {
    "use server";
    const res = await getPaymentVerificationRequests(cursor);
    if (!res.success) {
      return { error: res.error || "Failed to load more requests" };
    }
    return { requests: res.requests, nextCursor: res.nextCursor };
  };

  return (
    <main className="mx-4 lg:pl-7 lg:pt-10">
      <VerifyPaymentsList
        initialVerifications={result.requests}
        role="CLIENT"
        cursor={result.nextCursor}
        onLoadMore={handleLoadMore}
      />
    </main>
  );
};

export default VerifyPaymentsPage;

import { BudgetRequestsList } from "@/app/components/BudgetRequestsList";
import type { BudgetRequestItem } from "@/types/budget";
import {
  getBudgetRequests,
  processRequest,
  markReviewed,
} from "@/app/lib/controllers/BudgetController";
import { ToastProvider } from "@/app/components/ToastProvider";

const BudgetRequestsPage = async () => {
  const result = await getBudgetRequests();

  if (!result.success || !result.requests) {
    return (
      <div className="p-8 text-center text-[var(--color-status-danger-text)] font-mono text-sm mt-10">
        Error loading requests: {result.error || "Unknown error"}
      </div>
    );
  }

  const requests = result.requests as BudgetRequestItem[];

  const handleApprove = async (id: string) => {
    "use server";
    const result = await processRequest(id, "APPROVED");
    if (!result.success) {
      return { error: `${result.error} - ${result.status}` };
    }
    return { acceptedProject: result.updatedrequest };
  };

  const handleReject = async (id: string) => {
    "use server";
    const result = await processRequest(id, "REJECTED");
    if (!result.success) {
      return { error: `${result.error} - ${result.status}` };
    }
    return { acceptedProject: result.updatedrequest };
  };

  const handleMark = async (id: string) => {
    "use server";
    await markReviewed(id);
    return;
  };

  return (
    <ToastProvider>
      <BudgetRequestsList
        budgetRequests={requests}
        role="CLIENT"
        markReviewed={handleMark}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </ToastProvider>
  );
};

export default BudgetRequestsPage;

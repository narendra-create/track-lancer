import { BudgetRequestsList } from "@/app/components/BudgetRequestsList";
import type { BudgetRequestItem } from "@/types/budget";
import { getBudgetRequests } from "@/app/lib/controllers/BudgetController";
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

  const handleDelete = async (id: string) => {
    "use server";
    console.log("delete", id);
  };

  const handleApprove = async (id: string) => {
    "use server";
    console.log("approve", id);
  };

  const handleReject = async (id: string) => {
    "use server";
    console.log("reject", id);
  };

  const handleMarkReviewed = async (id: string) => {
    "use server";
    console.log("markReviewed", id);
  };

  return (
    <ToastProvider>
      <BudgetRequestsList
        budgetRequests={requests}
        role="FREELANCER"
        onDelete={handleDelete}
        onApprove={handleApprove}
        onReject={handleReject}
        markReviewed={handleMarkReviewed}
      />
    </ToastProvider>
  );
};

export default BudgetRequestsPage;

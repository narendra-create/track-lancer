export interface VerifyPaymentType {
  id: string;
  txn_number: string;
  paid_amount: number;
  status: "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED";
  
  // Relations
  Payment?: {
    due_date: Date;
    project?: {
      title: string;
    } | null;
  } | null;

  // Present for Client view
  clientId?: string;
  freelancer?: {
    id: string;
    user: {
      name: string;
    };
  } | null;

  // Present for Freelancer view
  freelancerId?: string;
  client?: {
    id: string;
    user: {
      name: string;
    };
  } | null;
}

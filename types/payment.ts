export type UpiPaymentProps = {
  upiId: string;
  label?: string;
  amount: number | "custom";
  qrCodeUrl?: string;
  onVerify?: (txnId: string) => void;
};

import { Paymentstatus } from "@/app/generated/prisma/enums";

export interface PaymentHistory {
  id: string;
  projectId?: string | null;
  project?: {
    title: string;
    deadline?: Date | null;
  } | null;
  total_cost: number;
  paid_amount: number;
  payment_status: Paymentstatus;
  txn_number?: string | null;
  due_date: Date;
  createdAt: Date;
  completedAt?: Date | null;
}

export interface ProjectWithPayments {
  id: string;
  title: string;
  createdAt: Date;
  payments: PaymentHistory[];
}

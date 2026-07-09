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
  project?: {
    title: string;
    createdAt: Date;
  } | null;
  _count?: any;
  total_cost: number;
  paid_amount: number;
  payment_status: Paymentstatus;
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

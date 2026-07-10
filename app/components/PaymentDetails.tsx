"use client";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Check,
  Clock,
  Zap,
  CreditCard,
  CheckCircle,
  Receipt,
  User,
  Mail,
  FileText,
  Hash,
  Briefcase,
} from "lucide-react";
import { formatDate } from "@/app/lib/utilitys";
import { Paymentstatus } from "@/app/generated/prisma/enums";
import { PaymentDetailUiType } from "../lib/controllers/PaymentDetailUiController";

// Dummy data for demonstration
const DUMMY_PAYMENT = {
  id: "pay_123456",
  status: "DUE" as Paymentstatus, // Change to PAID to see different states
  total_cost: 50000,
  paid_amount: 0,
  due_amount: 50000,
  createdAt: new Date("2026-07-01T10:00:00Z"),
  project: {
    title: "E-Commerce Website Redesign",
    description:
      "Complete overhaul of the existing e-commerce platform using Next.js and Tailwind CSS. Includes new checkout flow and product pages. The goal is to improve conversion rates and overall performance.",
  },
  client: {
    name: "Acme Corp",
    email: "billing@acmecorp.com",
  },
  freelancer: {
    name: "John Doe",
    email: "john.doe@example.com",
  },
};

const STATUS_CONFIG: Record<
  Paymentstatus,
  {
    label: string;
    dotColor: string;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
  }
> = {
  PAID: {
    label: "PAID",
    dotColor: "bg-[var(--color-dash-green)]",
    badgeBg: "bg-[var(--color-status-paid-bg)]",
    badgeBorder: "border-[var(--color-status-paid-border)]",
    badgeText: "text-dash-green",
  },
  DUE: {
    label: "DUE",
    dotColor: "bg-[var(--color-dash-gold)]",
    badgeBg: "bg-[var(--color-status-pending-bg)]",
    badgeBorder: "border-[var(--color-status-pending-border)]",
    badgeText: "text-[var(--color-dash-gold)]",
  },
};

const STATUS_ICON: Record<Paymentstatus, React.ReactNode> = {
  PAID: <Check size={12} strokeWidth={2.5} />,
  DUE: <Clock size={12} strokeWidth={2.5} />,
};

interface PaymentDetailsProps {
  role: "CLIENT" | "FREELANCER";
  paymentdetail: PaymentDetailUiType;
}

export function PaymentDetails({ role, paymentdetail }: PaymentDetailsProps) {
  const router = useRouter();
  const payment = paymentdetail;

  const cfg = STATUS_CONFIG[payment.status];
  const isPaid = payment.status === "PAID";
  const isDue = payment.status === "DUE";

  return (
    <div className="w-full mt-5 lg:mt-20 max-w-4xl mx-auto pb-10">
      {/* Navigation Section */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[var(--color-dash-ink3)] hover:text-white transition-colors mb-8 group"
      >
        <ArrowLeft
          size={14}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="font-mono text-[10px] tracking-[1.5px] uppercase">
          Back to Payments
        </span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-sm border font-mono text-[11px] font-semibold tracking-[1.5px] uppercase ${cfg.badgeBg} ${cfg.badgeBorder} ${cfg.badgeText}`}
              >
                {STATUS_ICON[payment.status]}
                {cfg.label}
              </span>
              <span className="font-mono text-[11px] tracking-[1px] text-[var(--color-dash-ink4)]">
                ID: {payment.id}
              </span>
            </div>
            <h1 className="font-serif text-[28px] lg:text-[36px] text-white leading-tight mb-2">
              {payment.project.title}
            </h1>
            <div className="flex items-center gap-2 font-mono text-[11px] tracking-[1px] text-[var(--color-dash-ink3)]">
              <Clock size={12} />
              <span>
                Initiated on{" "}
                {formatDate(payment.createdAt, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          {/* Action Button Section */}
          <div className="shrink-0 mt-2 md:mt-0">
            {role === "CLIENT" && isDue && (
              <button className="flex items-center gap-2 px-6 py-3 bg-[rgba(200,169,110,0.15)] border border-[rgba(200,169,110,0.4)] rounded-md font-mono text-[12px] tracking-[1.5px] uppercase text-[var(--color-dash-gold)] hover:bg-[rgba(200,169,110,0.25)] transition-colors shadow-[0_0_20px_rgba(200,169,110,0.15)]">
                <CreditCard size={14} strokeWidth={2} />
                Pay Now
              </button>
            )}
          </div>
        </div>

        {/* Amount Summary Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[var(--color-dash-surface1)] border border-[var(--color-dash-border)] rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-[var(--color-dash-ink2)]">
              <Receipt size={48} />
            </div>
            <p className="font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)] mb-2">
              Total Cost
            </p>
            <p className="font-serif text-[24px] text-white tabular-nums">
              ₹{payment.total_cost.toLocaleString("en-IN")}
            </p>
          </div>

          <div
            className={`border rounded-xl p-6 relative overflow-hidden ${isPaid ? "bg-[rgba(16,185,129,0.03)] border-[rgba(16,185,129,0.2)]" : "bg-[var(--color-dash-surface1)] border-[var(--color-dash-border)]"}`}
          >
            <p className="font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)] mb-2">
              Paid Amount
            </p>
            <p
              className={`font-serif text-[24px] tabular-nums ${isPaid ? "text-dash-green" : "text-white"}`}
            >
              ₹{isPaid ? payment.paid_amount.toLocaleString("en-IN") : "0"}
            </p>
          </div>

          <div
            className={`border rounded-xl p-6 relative overflow-hidden ${isDue ? "bg-[rgba(200,169,110,0.03)] border-[rgba(200,169,110,0.2)]" : "bg-[var(--color-dash-surface1)] border-[var(--color-dash-border)]"}`}
          >
            <p className="font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)] mb-2">
              Due Amount
            </p>
            <p
              className={`font-serif text-[24px] tabular-nums ${isDue ? "text-[var(--color-dash-gold)]" : "text-white"}`}
            >
              ₹{isDue ? payment.due_amount.toLocaleString("en-IN") : "0"}
            </p>
          </div>
        </div>

        {/* Transaction Details removed because txn_number was removed from Payment */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* People Information Section */}
          <div className="space-y-6">
            <div className="bg-[var(--color-dash-surface1)] border border-[var(--color-dash-border)] rounded-xl p-6">
              <h3 className="font-serif text-[18px] text-white mb-5 flex items-center gap-2">
                <User size={16} className="text-[var(--color-dash-ink3)]" />
                Client Details
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-mono text-[9px] tracking-[1.5px] uppercase text-[var(--color-dash-ink4)] mb-1">
                    Name
                  </p>
                  <p className="font-sans text-[14px] text-white">
                    {payment.client.name}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[9px] tracking-[1.5px] uppercase text-[var(--color-dash-ink4)] mb-1">
                    Email
                  </p>
                  <div className="flex items-center gap-2 text-[var(--color-dash-ink2)]">
                    <Mail size={12} />
                    <span className="font-sans text-[13px]">
                      {payment.client.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[var(--color-dash-surface1)] border border-[var(--color-dash-border)] rounded-xl p-6">
              <h3 className="font-serif text-[18px] text-white mb-5 flex items-center gap-2">
                <User size={16} className="text-[var(--color-dash-ink3)]" />
                Freelancer Details
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-mono text-[9px] tracking-[1.5px] uppercase text-[var(--color-dash-ink4)] mb-1">
                    Name
                  </p>
                  <p className="font-sans text-[14px] text-white">
                    {payment.freelancer.name}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[9px] tracking-[1.5px] uppercase text-[var(--color-dash-ink4)] mb-1">
                    Email
                  </p>
                  <div className="flex items-center gap-2 text-[var(--color-dash-ink2)]">
                    <Mail size={12} />
                    <span className="font-sans text-[13px]">
                      {payment.freelancer.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Details Section */}
          <div className="bg-[var(--color-dash-surface1)] border border-[var(--color-dash-border)] rounded-xl p-6 h-full">
            <h3 className="font-serif text-[18px] text-white mb-5 flex items-center gap-2">
              <Briefcase size={16} className="text-[var(--color-dash-ink3)]" />
              Project Information
            </h3>
            <div className="space-y-5">
              <div>
                <p className="font-mono text-[9px] tracking-[1.5px] uppercase text-[var(--color-dash-ink4)] mb-1">
                  Project Title
                </p>
                <p className="font-sans text-[15px] text-white leading-relaxed">
                  {payment.project.title}
                </p>
              </div>

              {payment.project.description && (
                <div>
                  <p className="font-mono text-[9px] tracking-[1.5px] uppercase text-[var(--color-dash-ink4)] mb-2 flex items-center gap-1.5">
                    <FileText size={10} />
                    Description
                  </p>
                  <div className="p-4 bg-[var(--color-dash-surface2)] border border-[var(--color-dash-border-hover)] rounded-lg">
                    <p className="font-sans text-[13px] text-[var(--color-dash-ink2)] leading-relaxed">
                      {payment.project.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

"use client";
import { motion } from "motion/react";
import { Check, Clock, Zap, CreditCard, CheckCircle, ArrowUpRight } from "lucide-react";
import type { PaymentHistory } from "@/types/payment";
import { formatDate } from "@/app/lib/utilitys";
import Link from "next/link";
import { Paymentstatus } from "@/app/generated/prisma/enums";

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
  PENDING_VERIFICATION: {
    label: "VERIFICATION PENDING",
    dotColor: "bg-[var(--color-dash-amber)]",
    badgeBg: "bg-[var(--color-dash-amber-bg)]",
    badgeBorder: "border-[rgba(200,120,64,0.3)]",
    badgeText: "text-[var(--color-dash-amber)]",
  },
};

const STATUS_ICON: Record<Paymentstatus, React.ReactNode> = {
  PAID: <Check size={11} strokeWidth={2.5} />,
  DUE: <Clock size={11} strokeWidth={2.5} />,
  PENDING_VERIFICATION: <Zap size={11} strokeWidth={2.5} />,
};

interface PaymentHistoryCardProps {
  payment: PaymentHistory;
  index: number;
  role: "CLIENT" | "FREELANCER";
}

export function PaymentHistoryCard({ payment, index, role }: PaymentHistoryCardProps) {
  const cfg = STATUS_CONFIG[payment.payment_status];
  const isPaid = payment.payment_status === "PAID";
  const isDue = payment.payment_status === "DUE";
  const isPendingVerification = payment.payment_status === "PENDING_VERIFICATION";

  const handleCardClick = () => {
    // Placeholder for future action
    console.log("Card clicked:", payment.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05, ease: "easeOut" }}
      className="relative flex gap-0 w-full h-full"
    >
      {/* Card Content - Clickable */}
      <div
        onClick={handleCardClick}
        className={`relative flex-1 flex flex-col justify-between mb-6 border rounded-xl p-4 lg:p-6 transition-all duration-300 cursor-pointer group overflow-hidden ${
          isDue
            ? "bg-[rgba(200,169,110,0.02)] backdrop-blur-md border-[rgba(200,169,110,0.15)] hover:border-[rgba(200,169,110,0.4)] hover:shadow-[0_8px_32px_-8px_rgba(200,169,110,0.15)] hover:-translate-y-1"
            : isPendingVerification
              ? "bg-[rgba(200,120,64,0.03)] backdrop-blur-md border-[rgba(200,120,64,0.25)] hover:border-[rgba(200,120,64,0.55)] shadow-[0_4px_24px_rgba(200,120,64,0.08)] hover:shadow-[0_8px_32px_-8px_rgba(200,120,64,0.25)] hover:-translate-y-1"
              : "bg-[var(--color-dash-surface1)]/60 backdrop-blur-md border-[var(--color-dash-border)] hover:border-[var(--color-dash-border-hover)] hover:shadow-[0_8px_32px_-8px_rgba(16,185,129,0.1)] hover:-translate-y-1"
        }`}
      >
        {/* Subtle Top Gradient Highlight */}
        <div className={`absolute top-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r ${
          isDue ? "from-transparent via-[var(--color-dash-gold)] to-transparent" : 
          isPendingVerification ? "from-transparent via-[var(--color-dash-amber)] to-transparent" : 
          "from-transparent via-dash-green to-transparent"
        }`} />
        {/* Mobile & Large Screen Flex Layout */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 lg:gap-6 mb-4">
          
          {/* Left side: Project Info & Badges */}
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-[16px] lg:text-[24px] text-white leading-tight mb-2 truncate flex items-center gap-2">
              {payment.project?.title || "Unknown Project"}
              <ArrowUpRight size={18} className="shrink-0 opacity-100 lg:opacity-0 group-hover:opacity-100 lg:group-hover:translate-x-0.5 lg:group-hover:-translate-y-0.5 transition-all duration-300 text-[var(--color-dash-ink3)]" />
            </h3>
            <div className="flex flex-wrap items-center gap-2 lg:gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border font-mono text-[10px] lg:text-[12px] font-semibold tracking-[1.5px] uppercase ${cfg.badgeBg} ${cfg.badgeBorder} ${cfg.badgeText}`}
              >
                {STATUS_ICON[payment.payment_status]}
                {cfg.label}
              </span>
              
              {payment.txn_number && (
                <span className="font-mono text-[10px] lg:text-[12px] tracking-[1px] text-[var(--color-dash-ink2)] bg-[var(--color-dash-surface2)] px-2.5 py-1 rounded-sm border border-[var(--color-dash-border)]">
                  TXN: {payment.txn_number}
                </span>
              )}
            </div>
          </div>

          {/* Right side: Amounts */}
          <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4 lg:gap-2 shrink-0 border-t lg:border-t-0 border-[var(--color-dash-border)] pt-3 lg:pt-0">
            <div className="flex flex-col lg:items-end">
              <span className="text-[var(--color-dash-ink3)] uppercase text-[9px] lg:text-[10px] tracking-[1.5px] mb-0.5">Total Cost</span>
              <span className="font-serif text-[16px] lg:text-[18px] text-white">₹{payment.total_cost.toLocaleString('en-IN')}</span>
            </div>
            
            <div className="flex flex-col lg:items-end">
              <span className="text-[var(--color-dash-ink3)] uppercase text-[9px] lg:text-[10px] tracking-[1.5px] mb-0.5">Paid Amount</span>
              <span className="font-serif text-[16px] lg:text-[18px] text-[var(--color-dash-green)]">₹{payment.paid_amount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 lg:flex lg:flex-row lg:flex-wrap gap-x-4 lg:gap-x-8 gap-y-3 font-mono text-[10px] lg:text-[12px] tracking-[1px] mb-4">
          <div className="flex flex-col gap-1">
            <span className="text-[var(--color-dash-ink3)] uppercase text-[9px] lg:text-[10px] tracking-[1.5px]">Due Date</span>
            <span className="text-[var(--color-dash-ink2)]">
              {formatDate(payment.due_date, { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
          
          {payment.project?.deadline && (
            <div className="flex flex-col gap-1">
              <span className="text-[var(--color-dash-ink3)] uppercase text-[9px] lg:text-[10px] tracking-[1.5px]">Project Deadline</span>
              <span className="text-[var(--color-dash-ink2)]">
                {formatDate(payment.project.deadline, { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <span className="text-[var(--color-dash-ink3)] uppercase text-[9px] lg:text-[10px] tracking-[1.5px]">Initiated</span>
            <span className="text-[var(--color-dash-ink2)]">
              {formatDate(payment.createdAt, { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>

          {isPaid && payment.completedAt && (
            <div className="flex flex-col gap-1">
              <span className="text-[var(--color-dash-ink3)] uppercase text-[9px] lg:text-[10px] tracking-[1.5px]">Completed</span>
              <span className="text-[var(--color-dash-ink2)]">
                {formatDate(payment.completedAt, { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
          )}
        </div>

        {/* Actions Section */}
        {(isDue || isPendingVerification) && (
          <div 
            className={`mt-4 pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isDue ? "border-[rgba(200,169,110,0.15)]" : "border-[rgba(200,120,64,0.15)]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-mono text-[9px] lg:text-[11px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)]">
              {isDue 
                ? (role === "CLIENT" ? "Payment required" : "Awaiting payment") 
                : (role === "FREELANCER" ? "Verification required" : "Awaiting verification")}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              {/* View Project Button */}
              {payment.projectId && (
                <Link href={`/${role.toLowerCase()}/milestones/${payment.projectId}`} className="w-full sm:w-auto">
                  <button
                    className={`w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-transparent border rounded-md font-mono text-[11px] lg:text-[13px] tracking-[1.5px] uppercase transition-all duration-200 ${
                      isDue 
                        ? "border-[rgba(200,169,110,0.3)] text-[var(--color-dash-gold)] hover:bg-[rgba(200,169,110,0.1)] hover:border-[rgba(200,169,110,0.5)]" 
                        : "border-[rgba(200,120,64,0.3)] text-[var(--color-dash-amber)] hover:bg-[rgba(200,120,64,0.1)] hover:border-[rgba(200,120,64,0.5)]"
                    }`}
                  >
                    View Project
                  </button>
                </Link>
              )}

              {/* Primary Action Button */}
              {role === "CLIENT" && isDue && (
                <Link href={`/client/pay-now/${payment.id}`} className="w-full sm:w-auto">
                  <button
                    className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-[rgba(200,169,110,0.1)] border border-[rgba(200,169,110,0.3)] rounded-md font-mono text-[11px] lg:text-[13px] tracking-[1.5px] uppercase text-[var(--color-dash-gold)] hover:bg-[rgba(200,169,110,0.18)] hover:border-[rgba(200,169,110,0.5)] transition-all duration-200"
                  >
                    <CreditCard size={14} strokeWidth={2} />
                    Pay Now
                  </button>
                </Link>
              )}

              {role === "FREELANCER" && isPendingVerification && (
                <Link href={`/freelancer/verify-payment/${payment.id}`} className="w-full sm:w-auto">
                  <button
                    className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-[rgba(200,120,64,0.1)] border border-[rgba(200,120,64,0.3)] rounded-md font-mono text-[11px] lg:text-[13px] tracking-[1.5px] uppercase text-[var(--color-dash-amber)] hover:bg-[rgba(200,120,64,0.18)] hover:border-[rgba(200,120,64,0.5)] transition-all duration-200"
                  >
                    <CheckCircle size={14} strokeWidth={2} />
                    Verify Payment
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

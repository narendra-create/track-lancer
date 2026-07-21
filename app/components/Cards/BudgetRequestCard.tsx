"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Check, X, Trash2, CheckCircle, XCircle, TrendingUp, ArrowUpRight } from "lucide-react";
import type { BudgetRequestStatus } from "@/app/generated/prisma/enums";
import type { BudgetRequestItem } from "@/types/budget";
import { formatDate } from "@/app/lib/utilitys";

// STATUS CONFIG
const STATUS_CONFIG: Record<
  BudgetRequestStatus,
  {
    label: string;
    dotColor: string;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
    cardBorder: string;
    cardBg: string;
    cardHoverBorder: string;
    cardGlow: string;
  }
> = {
  PENDING: {
    label: "PENDING",
    dotColor: "bg-[var(--color-dash-gold)]",
    badgeBg: "bg-[var(--color-status-pending-bg)]",
    badgeBorder: "border-[var(--color-status-pending-border)]",
    badgeText: "text-[var(--color-dash-gold)]",
    cardBorder: "border-[rgba(200,169,110,0.22)]",
    cardBg: "bg-[rgba(200,169,110,0.03)]",
    cardHoverBorder: "hover:border-[rgba(200,169,110,0.38)]",
    cardGlow: "",
  },
  APPROVED: {
    label: "APPROVED",
    dotColor: "bg-[var(--color-dash-green)]",
    badgeBg: "bg-[var(--color-status-paid-bg)]",
    badgeBorder: "border-[var(--color-status-paid-border)]",
    badgeText: "text-[var(--color-dash-green)]",
    cardBorder: "border-[rgba(74,158,117,0.22)]",
    cardBg: "bg-[rgba(74,158,117,0.03)]",
    cardHoverBorder: "hover:border-[rgba(74,158,117,0.38)]",
    cardGlow: "",
  },
  REJECTED: {
    label: "REJECTED",
    dotColor: "bg-[var(--color-dash-red)]",
    badgeBg: "bg-[var(--color-status-danger-bg)]",
    badgeBorder: "border-[var(--color-status-danger-border)]",
    badgeText: "text-[var(--color-status-danger-text)]",
    cardBorder: "border-[rgba(192,96,96,0.22)]",
    cardBg: "bg-[rgba(192,96,96,0.03)]",
    cardHoverBorder: "hover:border-[rgba(192,96,96,0.38)]",
    cardGlow: "",
  },
};

const STATUS_ICON: Record<BudgetRequestStatus, React.ReactNode> = {
  PENDING: <Clock size={9} strokeWidth={2.5} />,
  APPROVED: <Check size={9} strokeWidth={2.5} />,
  REJECTED: <X size={9} strokeWidth={2.5} />,
};

// CURRENCY FORMATTER
function formatRupees(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// PROPS
interface BudgetRequestCardProps {
  request: BudgetRequestItem;
  index: number;
  role: "CLIENT" | "FREELANCER";
  onDelete?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  markReviewed?: (id: string) => void;
}

// DETAIL POPUP
function BudgetRequestDetailPopup({
  request,
  role,
  onClose,
  onDelete,
  onApprove,
  onReject,
  markReviewed,
}: {
  request: BudgetRequestItem;
  role: "CLIENT" | "FREELANCER";
  onClose: () => void;
  onDelete?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  markReviewed?: (id: string) => void;
}) {
  const cfg = STATUS_CONFIG[request.status];
  const delta = request.requestedBudget - request.currentBudget;
  const deltaPercent = ((delta / request.currentBudget) * 100).toFixed(1);

  // HANDLER — only client triggers markReviewed
  const handleOpen = () => {
    if (role === "CLIENT") {
      markReviewed?.(request.id);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        onAnimationStart={handleOpen}
        className="bg-[var(--color-dash-surface1)] border border-[var(--color-dash-border)] w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-dash-ink2/50 font-semibold lg:text-[11px] lg:text-[11px] hover:text-white transition-colors duration-200 z-10"
        >
          <X size={16} />
        </button>

        {/* POPUP HEADER */}
        <div className={`p-6 border-b ${cfg.cardBorder} ${cfg.cardBg}`}>
          <div className="flex items-start gap-3 pr-6">
            <div className="flex-1 min-w-0">
              <span
                className={`inline-flex items-center gap-1 px-2 py-[3px] border font-mono font-bold text-[9px] font-semibold tracking-[1.5px] uppercase mb-3 ${cfg.badgeBg} ${cfg.badgeBorder} ${cfg.badgeText}`}
              >
                {STATUS_ICON[request.status]}
                {cfg.label}
              </span>
              <h2 className="font-serif text-[20px] lg:text-[22px] text-white leading-snug">
                {request.project.title}
              </h2>
              <p className="font-mono text-[10px] tracking-[1px] text-dash-ink2/50 font-semibold lg:text-[11px] lg:text-[11px] mt-1 uppercase">
                Budget Increase Request
              </p>
            </div>
          </div>
        </div>

        {/* POPUP BODY */}
        <div className="p-6 flex flex-col gap-5">
          {/* REQUESTER INFO REMOVED AS IT'S NOT PROVIDED BY BACKEND */}

          <div className="border-t border-[var(--color-dash-border)]" />

          {/* BUDGET COMPARISON */}
          <div>
            <p className="font-mono text-[9px] tracking-[1.5px] uppercase text-dash-ink2/50 font-semibold lg:text-[11px] lg:text-[11px] mb-3">
              Budget Breakdown
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[var(--color-dash-surface2)] border border-[var(--color-dash-border)]">
                <p className="font-mono text-[9px] tracking-[1px] uppercase text-dash-ink2/50 font-semibold lg:text-[11px] lg:text-[11px] mb-1">
                  Current
                </p>
                <p className="font-serif text-[18px] lg:text-[25px] text-[var(--color-dash-ink2)]">
                  {formatRupees(request.currentBudget)}
                </p>
              </div>
              <div className={`p-3 border ${cfg.cardBg} ${cfg.cardBorder}`}>
                <p className="font-mono text-[9px] tracking-[1px] uppercase text-dash-ink2/50 font-semibold lg:text-[11px] lg:text-[11px] mb-1">
                  Requested
                </p>
                <p className={`font-serif text-[18px] lg:text-[25px] ${cfg.badgeText}`}>
                  {formatRupees(request.requestedBudget)}
                </p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1.5 px-3 py-2 bg-[var(--color-dash-surface2)] border border-[var(--color-dash-border)]">
              <TrendingUp size={10} strokeWidth={2} className="text-dash-ink2/50 font-semibold lg:text-[11px] lg:text-[11px]" />
              <span className="font-mono text-[10px] tracking-[1px] text-dash-ink2/50 font-semibold lg:text-[11px] lg:text-[11px]">
                INCREASE{" "}
                <span className="text-[var(--color-dash-ink2)] lg:text-[12px]">
                  {formatRupees(delta)} <b>(+{deltaPercent}%)</b>
                </span>
              </span>
            </div>
          </div>

          {/* REASON */}
          {request.reason && (
            <>
              <div className="border-t border-[var(--color-dash-border)]" />
              <div>
                <p className="font-mono text-[9px] tracking-[1.5px] uppercase text-dash-ink2/50 font-semibold lg:text-[11px] lg:text-[11px] mb-2">
                  Reason
                </p>
                <p className="font-sans text-[12px] text-[var(--color-dash-ink2)] leading-relaxed">
                  {request.reason}
                </p>
              </div>
            </>
          )}

          {/* TIMESTAMPS */}
          <div className="border-t border-[var(--color-dash-border)]" />
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <div>
              <p className="font-mono text-[9px] tracking-[1.5px] uppercase text-dash-ink2/50 font-semibold lg:text-[11px] lg:text-[11px] mb-0.5">
                Requested On
              </p>
              <p className="font-mono text-[11px] text-[var(--color-dash-ink2)]">
                {formatDate(request.createdAt, { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
            {request.reviewedAt && (
              <div>
                <p className="font-mono text-[9px] tracking-[1.5px] uppercase text-dash-ink2/50 font-semibold lg:text-[11px] lg:text-[11px] mb-0.5">
                  Reviewed On
                </p>
                <p className="font-mono text-[11px] text-[var(--color-dash-ink2)]">
                  {formatDate(request.reviewedAt, { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            )}
          </div>

          {/* POPUP ACTIONS */}
          <div className="border-t border-[var(--color-dash-border)] pt-4">
            {role === "FREELANCER" && (
              <button
                onClick={() => {
                  onDelete?.(request.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[var(--color-status-danger-bg)] border border-[var(--color-status-danger-border)] font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-status-danger-text)] hover:bg-[rgba(192,96,96,0.14)] hover:border-[rgba(192,96,96,0.4)] transition-all duration-200 w-full justify-center"
              >
                <Trash2 size={11} strokeWidth={2} />
                Delete Request
              </button>
            )}

            {role === "CLIENT" && request.status === "PENDING" && (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    onApprove?.(request.id);
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[var(--color-status-paid-bg)] border border-[var(--color-status-paid-border)] font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-green)] hover:bg-[rgba(74,158,117,0.14)] hover:border-[rgba(74,158,117,0.45)] transition-all duration-200"
                >
                  <CheckCircle size={11} strokeWidth={2} />
                  Approve
                </button>
                <button
                  onClick={() => {
                    onReject?.(request.id);
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[var(--color-status-danger-bg)] border border-[var(--color-status-danger-border)] font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-status-danger-text)] hover:bg-[rgba(192,96,96,0.14)] hover:border-[rgba(192,96,96,0.4)] transition-all duration-200"
                >
                  <XCircle size={11} strokeWidth={2} />
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// BUDGET REQUEST CARD
export function BudgetRequestCard({
  request,
  index,
  role,
  onDelete,
  onApprove,
  onReject,
  markReviewed,
}: BudgetRequestCardProps) {
  const [popupOpen, setPopupOpen] = useState(false);
  const cfg = STATUS_CONFIG[request.status];
  const extraStr = `+${formatRupees(request.requestedBudget - request.currentBudget)}`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: index * 0.05, ease: "easeOut" }}
        onClick={() => setPopupOpen(true)}
        className={`border p-5 lg:px-10 lg:py-7 rounded-xl cursor-pointer transition-all duration-200 group ${cfg.cardBorder} ${cfg.cardBg} ${cfg.cardHoverBorder}`}
      >
        {/* CARD TOP ROW */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <h3 className="font-serif text-[16px] lg:text-[22.5px] text-white leading-snug truncate">
                {request.project.title}
              </h3>
              <span
                className={`inline-flex items-center gap-1 px-2 py-[3px] border font-mono text-[9px] font-semibold tracking-[1.5px] uppercase shrink-0 ${cfg.badgeBg} ${cfg.badgeBorder} ${cfg.badgeText}`}
              >
                {STATUS_ICON[request.status]}
                {cfg.label}
              </span>
            </div>

            {/* PERSON INFO REMOVED */}
          </div>

          {/* BUDGET DELTA */}
          <div className="text-right shrink-0">
            <p className={`font-serif text-[17px] lg:text-[25px] tabular-nums ${cfg.badgeText}`}>
              {formatRupees(request.requestedBudget)}
            </p>
            <p className="font-mono text-[9px] lg:text-[12px] text-dash-ink2/60 font-bold tracking-[0.5px]">
              from {formatRupees(request.currentBudget)}
            </p>
            <p className={`font-mono text-[9px] lg:text-[12px] tracking-[0.5px] font-semibold mt-0.5 ${cfg.badgeText}`}>
              {extraStr}
            </p>
          </div>
        </div>

        {/* CARD BOTTOM ROW */}
        <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-[var(--color-dash-border)]">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[9px] tracking-[1px] uppercase text-dash-ink2/60 font-bold">
              REQUESTED{" "}
              <span className="text-[var(--color-dash-ink2)]">
                {formatDate(request.createdAt, { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </span>
            {request.reviewedAt && (
              <span className="font-mono text-[9px] tracking-[1px] uppercase text-dash-ink2/60 font-bold">
                REVIEWED{" "}
                <span className="text-[var(--color-dash-ink2)]">
                  {formatDate(request.reviewedAt, { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </span>
            )}
          </div>

          {/* CARD ACTIONS */}
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {/* VIEW INDICATOR */}
            <div className="mr-2 flex items-center text-dash-ink3/80 group-hover:text-[var(--color-dash-ink2)] transition-colors duration-200 pointer-events-none">
              <span className="font-mono text-[9px] lg:text-[11px] font-bold uppercase tracking-[1.5px] mr-1.5 hidden sm:inline">View details</span>
              <ArrowUpRight size={12} strokeWidth={2} />
            </div>

            {role === "FREELANCER" && (
              <button
                onClick={() => onDelete?.(request.id)}
                className="flex font-bold lg:text-[12px] rounded-md items-center gap-1 px-3 py-1.5 bg-[var(--color-status-danger-bg)] border border-[var(--color-status-danger-border)] font-mono text-[9px] tracking-[1.5px] uppercase text-[var(--color-status-danger-text)] hover:bg-[rgba(192,96,96,0.14)] hover:border-[rgba(192,96,96,0.4)] transition-all duration-200"
              >
                <Trash2 size={9} strokeWidth={2} />
                Delete
              </button>
            )}

            {role === "CLIENT" && request.status === "PENDING" && (
              <>
                <button
                  onClick={() => onApprove?.(request.id)}
                  className="flex font-bold lg:text-[12px] rounded-md  items-center gap-1 px-3 py-1.5 bg-[var(--color-status-paid-bg)] border border-[var(--color-status-paid-border)] font-mono text-[9px] tracking-[1.5px] uppercase text-[var(--color-dash-green)] hover:bg-[rgba(74,158,117,0.14)] hover:border-[rgba(74,158,117,0.45)] transition-all duration-200"
                >
                  <CheckCircle size={9} strokeWidth={2} />
                  Approve
                </button>
                <button
                  onClick={() => onReject?.(request.id)}
                  className="flex font-bold lg:text-[12px] rounded-md  items-center gap-1 px-3 py-1.5 bg-[var(--color-status-danger-bg)] border border-[var(--color-status-danger-border)] font-mono text-[9px] tracking-[1.5px] uppercase text-[var(--color-status-danger-text)] hover:bg-[rgba(192,96,96,0.14)] hover:border-[rgba(192,96,96,0.4)] transition-all duration-200"
                >
                  <XCircle size={9} strokeWidth={2} />
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* DETAIL POPUP */}
      <AnimatePresence>
        {popupOpen && (
          <BudgetRequestDetailPopup
            request={request}
            role={role}
            onClose={() => setPopupOpen(false)}
            onDelete={onDelete}
            onApprove={onApprove}
            onReject={onReject}
            markReviewed={markReviewed}
          />
        )}
      </AnimatePresence>
    </>
  );
}

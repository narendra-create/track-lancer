"use client";
import { motion } from "motion/react";
import { Check, Clock, Zap, CircleDot, Ban, CreditCard } from "lucide-react";
import type { MilestoneItem } from "@/types/milestones";
import type { Milestonestatus } from "@/app/generated/prisma/enums";
import { formatDate } from "@/app/lib/utilitys";

const STATUS_CONFIG: Record<
  Milestonestatus,
  {
    label: string;
    dotColor: string;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
  }
> = {
  COMPLETED: {
    label: "COMPLETED",
    dotColor: "bg-[var(--color-dash-green)]",
    badgeBg: "bg-[var(--color-status-paid-bg)]",
    badgeBorder: "border-[var(--color-status-paid-border)]",
    badgeText: "text-dash-green",
  },
  PENDING_PAYEMENT: {
    label: "PENDING PAYMENT",
    dotColor: "bg-[var(--color-dash-gold)]",
    badgeBg: "bg-[var(--color-status-pending-bg)]",
    badgeBorder: "border-[var(--color-status-pending-border)]",
    badgeText: "text-[var(--color-dash-gold)]",
  },
  IN_PROGRESS: {
    label: "IN PROGRESS",
    dotColor: "bg-[var(--color-dash-amber)]",
    badgeBg: "bg-[var(--color-dash-amber-bg)]",
    badgeBorder: "border-[rgba(200,120,64,0.3)]",
    badgeText: "text-[var(--color-dash-amber)]",
  },
  NOT_STARTED: {
    label: "NOT STARTED",
    dotColor: "bg-[var(--color-dash-border-hover)]",
    badgeBg: "bg-dash-surface3",
    badgeBorder: "border-border",
    badgeText: "text-dash-ink2",
  },
  STOPPED: {
    label: "STOPPED",
    dotColor: "bg-[var(--color-dash-red)]",
    badgeBg: "bg-[var(--color-status-danger-bg)]",
    badgeBorder: "border-[var(--color-status-danger-border)]",
    badgeText: "text-[var(--color-status-danger-text)]",
  },
};

const STATUS_ICON: Record<Milestonestatus, React.ReactNode> = {
  COMPLETED: <Check size={9} strokeWidth={2.5} />,
  PENDING_PAYEMENT: <Clock size={9} strokeWidth={2.5} />,
  IN_PROGRESS: <Zap size={9} strokeWidth={2.5} />,
  NOT_STARTED: <CircleDot size={9} strokeWidth={2.5} />,
  STOPPED: <Ban size={9} strokeWidth={2.5} />,
};

interface MilestoneCardProps {
  milestone: MilestoneItem;
  index: number;
  isLast?: boolean;
  role: "CLIENT" | "FREELANCER";
  onPay?: (milestoneId: string) => void;
}

export function MilestoneCard({
  milestone,
  index,
  isLast = false,
  role,
  onPay,
}: MilestoneCardProps) {
  const cfg = STATUS_CONFIG[milestone.status];
  const isLocked =
    milestone.status === "NOT_STARTED" || milestone.status === "STOPPED";
  const isInProgress = milestone.status === "IN_PROGRESS";
  const isPendingPayment = milestone.status === "PENDING_PAYEMENT";
  const isDone = milestone.status === "COMPLETED";
  const isLineComplete = isDone || isPendingPayment;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.055, ease: "easeOut" }}
      className="relative flex gap-0"
    >
      <div className="flex flex-col items-center mr-5 mt-[5px] shrink-0 w-[10px]">
        <div
          className={`w-[10px] h-[10px] rounded-full shrink-0 z-10 transition-all duration-300 ${
            isLocked
              ? "border-2 border-[var(--color-dash-border-hover)] bg-[var(--color-dash-surface2)]"
              : isInProgress
                ? `${cfg.dotColor} shadow-[0_0_8px_2px_var(--color-dash-amber)]`
                : cfg.dotColor
          }`}
        />
      </div>

      {!isLast && (
        <div
          className={`absolute w-px left-[5px] -translate-x-1/2 z-0 ${isLineComplete ? "bg-[var(--color-dash-green)]" : "bg-[var(--color-dash-border)]"}`}
          style={{ top: "15px", bottom: "-5px" }}
        />
      )}

      <div
        className={`flex-1 mb-4 border rounded-xl p-5 transition-all duration-200 group ${
          isInProgress
            ? "bg-[rgba(200,120,64,0.05)] border-[rgba(200,120,64,0.35)] hover:border-[rgba(200,120,64,0.55)] shadow-[0_0_24px_rgba(200,120,64,0.1)]"
            : isPendingPayment
              ? "bg-[rgba(200,169,110,0.03)] border-[rgba(200,169,110,0.18)] hover:border-[rgba(200,169,110,0.28)]"
              : isLocked
                ? "bg-[var(--color-dash-surface1)] border-[var(--color-dash-border)] opacity-55"
                : "bg-[var(--color-dash-surface1)] border-[var(--color-dash-border)] hover:border-[var(--color-dash-border-hover)]"
        }`}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-serif text-[15px] lg:text-[22px] text-white leading-snug">
                {milestone.title}
              </h3>
              {milestone.subtitle && (
                <span className="font-mono text-[9px] tracking-[1px] text-dash-ink2/90 font-semibold uppercase">
                  · {milestone.subtitle}
                </span>
              )}
            </div>
            <span
              className={`inline-flex lg:my-1.5 lg:py-2 items-center gap-1 px-2 py-[3px] rounded-sm border font-mono text-[9px] lg:text-[11px] font-semibold tracking-[1.5px] uppercase ${cfg.badgeBg} ${cfg.badgeBorder} ${cfg.badgeText}`}
            >
              {STATUS_ICON[milestone.status]}
              {cfg.label}
            </span>
          </div>
          <span
            className={`font-serif text-[16px] lg:text-[22px] shrink-0 tabular-nums ${isPendingPayment ? "text-[var(--color-dash-gold)]" : "text-[var(--color-dash-gold)]"}`}
          >
            ₹{milestone.milestonecost.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] tracking-[1px] text-dash-ink2/70 mb-3">
          <span>
            DEADLINE:{" "}
            <span className="text-[var(--color-dash-ink2)]">
              {formatDate(milestone.deadline, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </span>
          <span>
            CREATED:{" "}
            <span className="text-[var(--color-dash-ink2)]">
              {formatDate(milestone.createdAt, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </span>
          {milestone.delay && (
            <span className="text-[var(--color-dash-amber)]">⚑ DELAYED</span>
          )}
        </div>

        {milestone.description && (
          <p className="font-sans text-[12px] text-[var(--color-dash-ink3)] leading-relaxed">
            {milestone.description}
          </p>
        )}

        {milestone.delayreason && (
          <div className="mt-3 px-3 py-2 bg-[var(--color-dash-amber-bg)] border border-[rgba(200,120,64,0.2)] rounded-md">
            <p className="font-mono text-[9px] tracking-[1.5px] uppercase text-[var(--color-dash-amber)] mb-1">
              Delay Reason
            </p>
            <p className="font-sans text-[11px] text-[var(--color-dash-ink2)] leading-relaxed">
              {milestone.delayreason}
            </p>
          </div>
        )}

        {isPendingPayment && role === "CLIENT" && (
          <div className="mt-4 pt-4 border-t border-[rgba(200,169,110,0.15)] flex items-center justify-between gap-3">
            <p className="font-mono text-[9px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)]">
              Awaiting your payment
            </p>
            <button
              onClick={() => onPay?.(milestone.id)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[rgba(200,169,110,0.1)] border border-[rgba(200,169,110,0.3)] rounded-md font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-gold)] hover:bg-[rgba(200,169,110,0.18)] hover:border-[rgba(200,169,110,0.5)] transition-all duration-200"
            >
              <CreditCard size={11} strokeWidth={2} />
              Pay ₹{milestone.milestonecost.toLocaleString("en-IN")}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

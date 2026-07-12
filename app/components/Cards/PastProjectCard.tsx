import React from "react";
import { Archive } from "lucide-react";
import type { userrole } from "@/app/generated/prisma/enums";

// PROPS
export interface PastProjectCardProps {
  id: string;
  title: string;
  clientName?: string;
  clientEmail?: string;
  freelancerName?: string;
  freelancerEmail?: string;
  role: userrole | undefined | null;
  paymentStatus: "PAID" | "DUE" | "UNPAID";
  completionDate: string | Date;
  paidAmount: number | string;
  onArchive?: (id: string) => void;
}

// UI COMPONENT
export function PastProjectCard({
  id,
  title,
  clientName,
  freelancerName,
  role,
  paymentStatus,
  completionDate,
  paidAmount,
  clientEmail,
  freelancerEmail,
  onArchive,
}: PastProjectCardProps) {
  // DATE FORMATTING
  const formattedDate =
    typeof completionDate === "string"
      ? completionDate
      : new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(completionDate);

  // CURRENCY FORMATTING
  const formattedCost = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paidAmount as number);

  // CONDITIONAL ROLE INFO
  const nameToShow = role === "FREELANCER" ? clientName : freelancerName;

  return (
    // CARD CONTAINER
    <div className="border border-[var(--color-dash-border)] bg-transparent p-5 w-full transition-colors hover:border-[var(--color-dash-border-hover)]">
      {/* TOP ROW */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-[var(--color-dash-ink)] font-serif text-[18px] font-bold tracking-tight">
            {title}
          </h3>

          {/* STATUS BADGE */}
          <div
            className={`px-2 py-0.5 border font-mono text-[9px] tracking-[1.5px] uppercase flex items-center ${
              paymentStatus === "PAID"
                ? "bg-[var(--color-status-paid-bg)] border-[var(--color-status-paid-border)] text-[var(--color-status-paid-text)]"
                : paymentStatus === "DUE"
                  ? "bg-[var(--color-status-danger-bg)] border-[var(--color-status-danger-border)] text-[var(--color-status-danger-text)]"
                  : "bg-[var(--color-status-pending-bg)] border-[var(--color-status-pending-border)] text-[var(--color-status-pending)]"
            }`}
          >
            {paymentStatus === "PAID"
              ? "PAID IN FULL"
              : paymentStatus.replace("_", " ")}
          </div>
        </div>
      </div>

      {/* OPTIONAL ROLE SPECIFIC INFO */}
      {nameToShow && (
        <div className="mb-4 flex flex-col gap-1.5">
          <span className="text-[var(--color-dash-ink3)] font-mono text-[10px] tracking-[1px] uppercase">
            {role === "FREELANCER" ? "Client" : "Freelancer"}: {nameToShow}
          </span>
          {(role === "FREELANCER" ? clientEmail : freelancerEmail) && (
            <div className="flex items-center gap-1.5 w-fit px-2 py-0.5 border border-[var(--color-dash-border)] bg-[var(--color-dash-surface1)] group hover:border-[var(--color-dash-gold-dim)] transition-colors duration-200">
              <span className="text-[var(--color-dash-ink4)] group-hover:text-[var(--color-dash-gold-dim)] font-mono text-[9px] transition-colors duration-200">@</span>
              <span className="text-[var(--color-dash-ink3)] group-hover:text-[var(--color-dash-ink2)] font-mono text-[10px] tracking-wide truncate max-w-[180px] transition-colors duration-200">
                {role === "FREELANCER" ? clientEmail : freelancerEmail}
              </span>
            </div>
          )}
        </div>
      )}

      {/* BOTTOM ROW */}
      <div className="flex justify-between items-end mt-1">
        <span className="text-[var(--color-dash-ink3)] font-mono text-[10px] tracking-[1px] uppercase">
          COMPLETED {formattedDate}
        </span>
        <div className="flex items-center gap-3">
          {/* ARCHIVE BUTTON */}
          {onArchive && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onArchive(id);
              }}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[#2a3441] bg-[#1c232d] text-[#8b9ebb] hover:text-[#d1dff5] hover:bg-[#252f3e] hover:border-[#3a4759] transition-all duration-150"
              title="Archive Project"
            >
              <Archive size={12} />
              <span className="font-mono text-[9px] tracking-wide uppercase">Archive</span>
            </button>
          )}
          <span className="text-[var(--color-dash-gold)] font-mono text-[16px] tracking-wide">
            {formattedCost}
          </span>
        </div>
      </div>
    </div>
  );
}

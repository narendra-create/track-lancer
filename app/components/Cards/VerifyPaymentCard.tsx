"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle, Image as ImageIcon, ExternalLink, Calendar, User } from "lucide-react";
import type { VerifyPaymentType } from "@/types/verifypayments";
import { formatDate } from "@/app/lib/utilitys";

interface VerifyPaymentCardProps {
  verification: VerifyPaymentType;
  role: "CLIENT" | "FREELANCER";
  onVerify?: (id: string) => void;
}

export function VerifyPaymentCard({ verification, role, onVerify }: VerifyPaymentCardProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleVerifyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isConfirming) {
      onVerify?.(verification.id);
      setIsConfirming(false);
    } else {
      setIsConfirming(true);
      // Automatically reset confirmation after 3 seconds
      setTimeout(() => setIsConfirming(false), 3000);
    }
  };

  const opponentName = role === "FREELANCER" 
    ? verification.client?.user.name 
    : verification.freelancer?.user.name;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex-1 flex flex-col justify-between mb-6 border rounded-xl p-4 lg:p-6 transition-all duration-300 bg-[rgba(200,120,64,0.03)] backdrop-blur-md border-[rgba(200,120,64,0.25)] hover:border-[rgba(200,120,64,0.55)] shadow-[0_4px_24px_rgba(200,120,64,0.08)] hover:shadow-[0_8px_32px_-8px_rgba(200,120,64,0.25)]"
    >
      {/* Subtle Top Gradient Highlight */}
      <div className="absolute top-0 left-0 w-full h-[2px] opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-[var(--color-dash-amber)] to-transparent" />
      
      <div className="flex flex-col lg:flex-row justify-between gap-4 lg:gap-6 mb-4">
        {/* Left Side: Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] lg:text-[11px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)]">
              Project:
            </span>
            <span className="font-serif text-[14px] lg:text-[16px] text-white truncate">
              {verification.Payment?.project?.title || "Unknown Project"}
            </span>
          </div>
          
          <h3 className="font-serif text-[20px] lg:text-[24px] text-[var(--color-dash-amber)] leading-tight mb-3 flex items-center gap-2">
            {verification.txn_number}
          </h3>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 text-[var(--color-dash-ink2)] font-mono text-[11px]">
              <Calendar size={14} />
              <span>Due: {verification.Payment?.due_date ? formatDate(verification.Payment.due_date, { day: "numeric", month: "short", year: "numeric" }) : "N/A"}</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-[var(--color-dash-ink2)] font-mono text-[11px]">
              <User size={14} />
              <span>{role === "FREELANCER" ? "Client" : "Freelancer"}: {opponentName || "Unknown"}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Amounts & Proof */}
        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4 lg:gap-2 shrink-0 border-t lg:border-t-0 border-[var(--color-dash-border)] pt-3 lg:pt-0">
          <div className="flex flex-col lg:items-end">
            <span className="text-[var(--color-dash-ink3)] uppercase text-[9px] lg:text-[10px] tracking-[1.5px] mb-0.5">Paid Amount</span>
            <span className="font-serif text-[18px] lg:text-[22px] text-white">
              ₹{verification.paid_amount.toLocaleString("en-IN")}
            </span>
          </div>

          {verification.imageurl && (
            <a 
              href={verification.imageurl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--color-dash-border)] hover:border-[var(--color-dash-border-hover)] bg-[var(--color-dash-surface1)] text-[var(--color-dash-ink2)] hover:text-white transition-colors font-mono text-[10px] uppercase tracking-[1px] mt-2"
            >
              <ImageIcon size={12} />
              View Screenshot
              <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>

      {/* Actions */}
      {role === "FREELANCER" && (
        <div className="mt-4 pt-4 border-t border-[rgba(200,120,64,0.15)] flex justify-end">
          <button
            onClick={handleVerifyClick}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-md font-mono text-[11px] lg:text-[13px] tracking-[1.5px] uppercase transition-all duration-200 ${
              isConfirming 
                ? "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50" 
                : "bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.3)] text-[var(--color-dash-green)] hover:bg-[rgba(16,185,129,0.18)] hover:border-[rgba(16,185,129,0.5)]"
            }`}
          >
            {isConfirming ? (
              "Are you sure you verified this payment?"
            ) : (
              <>
                <CheckCircle size={14} strokeWidth={2} />
                Mark Paid
              </>
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
}

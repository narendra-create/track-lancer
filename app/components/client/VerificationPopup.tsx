"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, XCircle, X, Hash, IndianRupee } from "lucide-react";

type VerificationStatus = "submitted" | "not_submitted";

interface VerificationPopupProps {
  open: boolean;
  status: VerificationStatus;
  txnId: string;
  amount: number;
  onClose: () => void;
}

export function VerificationPopup({
  open,
  status,
  txnId,
  amount,
  onClose,
}: VerificationPopupProps) {
  const isSubmitted = status === "submitted";

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none px-4"
          >
            <div className="pointer-events-auto w-full max-w-sm bg-[var(--color-dash-bg)] border border-[var(--color-dash-border)] relative">
              <div
                className={`absolute top-0 left-0 right-0 h-[2px] ${isSubmitted ? "bg-[var(--color-dash-green)]" : "bg-[var(--color-dash-red)]"}`}
              />

              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-[var(--color-dash-ink3)] hover:text-[var(--color-dash-ink)] transition-colors"
              >
                <X size={15} />
              </button>

              <div className="p-7">
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className={`shrink-0 w-10 h-10 border flex items-center justify-center ${
                      isSubmitted
                        ? "border-[var(--color-status-paid-border)] bg-[var(--color-status-paid-bg)]"
                        : "border-[var(--color-status-danger-border)] bg-[var(--color-status-danger-bg)]"
                    }`}
                  >
                    {isSubmitted ? (
                      <CheckCircle
                        size={18}
                        className="text-[var(--color-dash-green)]"
                        strokeWidth={1.5}
                      />
                    ) : (
                      <XCircle
                        size={18}
                        className="text-[var(--color-dash-red)]"
                        strokeWidth={1.5}
                      />
                    )}
                  </div>

                  <div>
                    <p className="font-sans text-[11px] uppercase text-[var(--color-dash-ink3)] mb-1">
                      Verification Status
                    </p>
                    <h2 className="font-serif text-[22px] text-[var(--color-dash-ink)] leading-tight">
                      {isSubmitted ? "Request Submitted" : "Not Submitted"}
                    </h2>
                    <p className="font-sans text-[12px] text-[var(--color-dash-ink3)] mt-1 leading-relaxed">
                      {isSubmitted
                        ? "Your payment verification request has been received. We'll confirm once reviewed."
                        : "Your verification request could not be submitted. Please try again."}
                    </p>
                  </div>
                </div>

                <div className="border border-[var(--color-dash-border)] bg-[var(--color-dash-surface1)]">
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-dash-border)]">
                    <Hash size={12} className="text-[var(--color-dash-ink3)] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-[11px] text-[var(--color-dash-ink4)] mb-0.5">
                        Transaction ID / UTR
                      </p>
                      <p className="font-mono text-[12px] text-[var(--color-dash-ink)] truncate">
                        {txnId}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 px-4 py-3">
                    <IndianRupee size={12} className="text-[var(--color-dash-ink3)] shrink-0" />
                    <div>
                      <p className="font-sans text-[11px] text-[var(--color-dash-ink4)] mb-0.5">
                        Amount Paid
                      </p>
                      <p className="font-mono text-[15px] text-[var(--color-dash-gold)]">
                        ₹{amount.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="mt-5 w-full py-2.5 font-mono text-[11px] tracking-[2px] uppercase border border-[var(--color-dash-border)] text-[var(--color-dash-ink3)] hover:border-[var(--color-dash-border-hover)] hover:text-[var(--color-dash-ink)] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

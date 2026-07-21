"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, TrendingUp, IndianRupee, FileText } from "lucide-react";
import { useToast } from "@/app/components/ToastProvider";

// PROPS
interface RaiseBudgetFormProps {
  projectId: string;
  currentBudget: number;
  onClose: () => void;
  onSubmit?: (
    data: {
      projectId: string;
      requestedAmount: number;
      reason: string | undefined;
    },
    projectId: string,
  ) => Promise<any>;
}

export function RaiseBudgetForm({
  projectId,
  currentBudget,
  onClose,
  onSubmit,
}: RaiseBudgetFormProps) {
  const [extraAmount, setExtraAmount] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // DERIVED VALUES
  const parsedExtra = Number(extraAmount);
  const newTotal = currentBudget + parsedExtra;
  const percentIncrease =
    parsedExtra > 0 && currentBudget > 0
      ? ((parsedExtra / currentBudget) * 100).toFixed(1)
      : null;
  const isValid = parsedExtra > 0;

  // CURRENCY FORMATTER
  const formatRupees = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  // SUBMIT HANDLER
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValid) {
      setError("Please enter an amount greater than zero.");
      return;
    }

    setLoading(true);
    try {
      const data = {
        projectId,
        requestedAmount: parsedExtra,
        reason: reason.trim() || undefined,
      };
      if (!onSubmit) {
        setError("Access this page from freelancer account");
        return;
      }
      const result = await onSubmit(data, projectId);
      if (result?.error) {
        setError(result.error);
      } else {
        addToast({
          title: "Success",
          message: "Budget raise request submitted successfully.",
          type: "success",
        });
        onClose();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-sm p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-[var(--color-dash-surface1)] border rounded-lg  border-[var(--color-dash-border)] border-b-0 sm:border-b w-full sm:max-w-md max-h-[92vh] overflow-y-auto custom-scrollbar"
      >
        {/* HEADER */}
        <div className="flex items-start justify-between p-6 border-b border-[var(--color-dash-border)]">
          <div>
            <h2 className="font-serif text-[20px] lg:text-[23px] text-white leading-snug">
              Raise Budget
            </h2>
            <p className="font-mono text-[10px] tracking-[1.5px] uppercase text-dash-ink2/60 font-semibold lg:text-[11px] mt-1">
              Submit a budget increase request
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-dash-ink2/60 font-semibold lg:text-[11px] hover:text-white transition-colors duration-200 mt-0.5"
          >
            <X size={16} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          {/* CURRENT BUDGET — READ ONLY */}
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] tracking-[1.5px] uppercase text-dash-ink2/60 font-semibold lg:text-[11px]">
              Current Budget
            </label>
            <div className="flex rounded-md items-center gap-3 px-4 py-3 bg-[var(--color-dash-surface2)] border border-[var(--color-dash-border)] opacity-70 cursor-not-allowed">
              <IndianRupee
                size={13}
                strokeWidth={1.8}
                className="text-dash-ink2/60 font-semibold lg:text-[11px] shrink-0"
              />
              <span className="font-serif text-[16px] text-[var(--color-dash-ink2)] tabular-nums">
                {formatRupees(currentBudget)}
              </span>
              <span className="ml-auto font-mono text-[9px] tracking-[1.5px] uppercase text-dash-ink-3/40">
                Autofilled
              </span>
            </div>
          </div>

          {/* EXTRA AMOUNT */}
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-2">
              <label className="font-mono text-[10px] tracking-[1.5px] uppercase text-dash-ink2/60 font-semibold lg:text-[11px]">
                Extra Amount{" "}
                <span className="text-[var(--color-dash-red)]">*</span>
              </label>
              <span className="font-sans text-[9px] text-dash-ink-3/40 normal-case tracking-normal">
                How much extra do you need?
              </span>
            </div>
            <div
              className={`flex items-center gap-3 px-4 py-3 bg-[var(--color-dash-surface2)] border transition-colors duration-200 ${
                isValid
                  ? "border-[rgba(74,158,117,0.4)]"
                  : "border-[var(--color-dash-border)] focus-within:border-[var(--color-dash-border-hover)]"
              }`}
            >
              <IndianRupee
                size={13}
                strokeWidth={1.8}
                className={`shrink-0 transition-colors duration-200 ${
                  isValid
                    ? "text-[var(--color-dash-green)]"
                    : "text-dash-ink2/60 font-semibold lg:text-[11px]"
                }`}
              />
              <input
                type="number"
                min={1}
                step="1"
                placeholder="e.g. 5,000"
                value={extraAmount}
                onChange={(e) => {
                  setExtraAmount(e.target.value);
                  setError(null);
                }}
                required
                className="flex-1 bg-transparent font-serif text-[16px] text-white placeholder:text-dash-ink-3/40 placeholder:font-sans placeholder:text-[12px] rounded-md focus:outline-none tabular-nums min-w-0"
              />
            </div>

            {/* HINT */}
            <p className="font-sans text-[9px] tracking-[0.5px] text-dash-ink-3/40">
              Enter only the additional amount — not your new total.
            </p>

            {/* NEW TOTAL PREVIEW */}
            <AnimatePresence>
              {isValid && percentIncrease && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-2 px-3 py-2 bg-[rgba(74,158,117,0.06)] border border-[rgba(74,158,117,0.2)]">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp
                        size={10}
                        strokeWidth={2}
                        className="text-[var(--color-dash-green)] shrink-0"
                      />
                      <span className="font-mono text-[10px] tracking-[1px] text-dash-ink2/60 font-semibold lg:text-[11px]">
                        +{percentIncrease}% increase
                      </span>
                    </div>
                    <span className="font-mono text-[10px] tracking-[1px] text-dash-ink2/60 font-semibold lg:text-[11px]">
                      New total{" "}
                      <span className="text-[var(--color-dash-green)]">
                        {formatRupees(newTotal)}
                      </span>
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* REASON — OPTIONAL */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-mono text-[10px] tracking-[1.5px] uppercase text-dash-ink2/60 font-semibold lg:text-[11px]">
                Reason{" "}
                <span className="opacity-50 normal-case tracking-normal font-sans text-[10px]">
                  (optional)
                </span>
              </label>
              <span className="font-sans rounded-md text-[9px] text-dash-ink-3/40">
                {reason.length}/300
              </span>
            </div>
            <div className="relative">
              <FileText
                size={13}
                strokeWidth={1.8}
                className="absolute left-4 top-3.5 text-dash-ink2/60 font-semibold lg:text-[11px] pointer-events-none"
              />
              <textarea
                rows={4}
                maxLength={300}
                placeholder="Explain why you need a budget increase..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[var(--color-dash-surface2)] border border-[var(--color-dash-border)] focus:border-[var(--color-dash-border-hover)] font-sans text-[13px] text-white placeholder:text-dash-ink-3/40 focus:outline-none transition-colors duration-200 resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* ERROR */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="font-mono text-[10px] tracking-[1px] text-[var(--color-status-danger-text)] -mt-2"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-transparent border border-[var(--color-dash-border)] font-mono text-[10px] tracking-[1.5px] uppercase text-dash-ink2/60 font-semibold lg:text-[11px] hover:border-[var(--color-dash-border-hover)] hover:text-[var(--color-dash-ink2)] transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isValid}
              className="flex-1 py-3 bg-[var(--color-dash-amber-bg)] border border-[rgba(200,120,64,0.3)] font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-amber)] hover:bg-[rgba(200,120,64,0.15)] hover:border-[rgba(200,120,64,0.5)] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Request →"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { VerifyPaymentCard } from "./Cards/VerifyPaymentCard";
import type { VerifyPaymentType } from "@/types/verifypayments";
import { useToast } from "./ToastProvider";

interface VerifyPaymentsListProps {
  initialVerifications: VerifyPaymentType[];
  role: "CLIENT" | "FREELANCER";
  cursor?: string | null;
  onAccept?: (
    verificationPaymentId: string,
  ) => Promise<{ error?: string; updated?: any }>;
  onReject?: (
    verificationPaymentId: string,
  ) => Promise<{ error?: string; updated?: any }>;
  onLoadMore?: (cursor: string) => Promise<{
    error?: string;
    requests?: VerifyPaymentType[];
    nextCursor?: string | null;
  }>;
}

export function VerifyPaymentsList({
  initialVerifications,
  role,
  cursor,
  onLoadMore,
  onAccept,
  onReject,
}: VerifyPaymentsListProps) {
  const [verifications, setVerifications] = useState(initialVerifications);
  const [currentCursor, setCurrentCursor] = useState(cursor);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { addToast } = useToast();

  const hasMore = !!currentCursor;

  const handleLoadMoreClick = async () => {
    if (!onLoadMore || !currentCursor) return;
    setIsLoadingMore(true);
    const result = await onLoadMore(currentCursor);
    if (result.error) {
      addToast({
        message: result.error,
        title: "Got an error",
        type: "error",
      });
    } else if (result.requests) {
      setVerifications((prev) => [...prev, ...result.requests!]);
      setCurrentCursor(result.nextCursor);
    }
    setIsLoadingMore(false);
  };

  const handleVerify = async (id: string, action: "ACCEPT" | "REJECT") => {
    if (!onAccept || !onReject) return;
    if (action === "ACCEPT") {
      const result = await onAccept(id);
      if (result.error) {
        addToast({
          message: result.error,
          title: "Got an error",
          type: "error",
        });
      }
    } else {
      const result = await onReject(id);
      if (result.error) {
        addToast({
          message: result.error,
          title: "Got an error",
          type: "error",
        });
      }
    }
  };

  return (
    <div className="w-full py-4 lg:py-8 relative min-h-screen">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[500px] bg-[var(--color-dash-amber)] opacity-10 rounded-full blur-[120px]" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-transparent border border-[var(--color-dash-border)] rounded-md text-white font-mono text-[10px] lg:text-[12px] uppercase tracking-[1.5px] hover:bg-[var(--color-dash-surface2)] hover:border-[var(--color-dash-border-hover)] transition-all duration-200 flex items-center gap-2 w-fit"
        >
          <ArrowLeft size={13} />
          Back
        </button>
        <h1 className="font-serif text-[28px] lg:text-[36px] text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--color-dash-ink2)]">
          Payment Verifications
        </h1>
      </div>

      <div className="mb-12">
        <h2 className="font-serif text-[20px] lg:text-[24px] text-white mb-6 flex items-center gap-3">
          Needs Verification
          <span className="bg-[var(--color-dash-amber-bg)] text-[var(--color-dash-amber)] border border-[rgba(200,120,64,0.3)] font-mono text-[10px] px-2 py-0.5 rounded-sm tabular-nums">
            {initialVerifications.length}
          </span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {verifications.map((verification) => (
            <VerifyPaymentCard
              key={verification.id}
              verification={verification}
              role={role}
              onVerify={(id) => handleVerify(id, "ACCEPT")}
              onReject={(id) => handleVerify(id, "REJECT")}
            />
          ))}

          {verifications.length === 0 && (
            <div className="col-span-1 lg:col-span-2 text-center py-8 border border-dashed border-[var(--color-dash-border)] rounded-xl font-mono text-[11px] text-[var(--color-dash-ink3)]">
              No payments require verification right now.
            </div>
          )}
        </div>

        {hasMore && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleLoadMoreClick}
              disabled={isLoadingMore}
              className="px-6 py-2.5 border border-[var(--color-dash-border)] rounded-md font-mono text-[11px] lg:text-[13px] tracking-[1.5px] uppercase text-[var(--color-dash-ink2)] hover:text-white hover:border-[var(--color-dash-border-hover)] bg-[var(--color-dash-surface1)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

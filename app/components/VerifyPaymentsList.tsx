"use client";

import { useState } from "react";
import { VerifyPaymentCard } from "./Cards/VerifyPaymentCard";
import type { VerifyPaymentType } from "@/types/verifypayments";

interface VerifyPaymentsListProps {
  initialVerifications: VerifyPaymentType[];
  role: "CLIENT" | "FREELANCER";
}

export function VerifyPaymentsList({ initialVerifications, role }: VerifyPaymentsListProps) {
  const [displayCount, setDisplayCount] = useState(5);
  
  const visibleVerifications = initialVerifications.slice(0, displayCount);
  const hasMore = displayCount < initialVerifications.length;

  const handleVerify = (id: string) => {
    // In the future this should call an API to mark as paid
    console.log("Verified payment ID:", id);
  };

  return (
    <div className="w-full py-4 lg:py-8 relative min-h-screen">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[500px] bg-[var(--color-dash-amber)] opacity-10 rounded-full blur-[120px]" />
      </div>

      <h1 className="font-serif text-[28px] lg:text-[36px] mb-10 text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--color-dash-ink2)]">
        Payment Verifications
      </h1>

      <div className="mb-12">
        <h2 className="font-serif text-[20px] lg:text-[24px] text-white mb-6 flex items-center gap-3">
          Needs Verification
          <span className="bg-[var(--color-dash-amber-bg)] text-[var(--color-dash-amber)] border border-[rgba(200,120,64,0.3)] font-mono text-[10px] px-2 py-0.5 rounded-sm tabular-nums">
            {initialVerifications.length}
          </span>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {visibleVerifications.map((verification) => (
            <VerifyPaymentCard 
              key={verification.id} 
              verification={verification} 
              role={role} 
              onVerify={handleVerify}
            />
          ))}
          
          {visibleVerifications.length === 0 && (
            <div className="col-span-1 lg:col-span-2 text-center py-8 border border-dashed border-[var(--color-dash-border)] rounded-xl font-mono text-[11px] text-[var(--color-dash-ink3)]">
              No payments require verification right now.
            </div>
          )}
        </div>

        {hasMore && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setDisplayCount(prev => prev + 5)}
              className="px-6 py-2.5 border border-[var(--color-dash-border)] rounded-md font-mono text-[11px] lg:text-[13px] tracking-[1.5px] uppercase text-[var(--color-dash-ink2)] hover:text-white hover:border-[var(--color-dash-border-hover)] bg-[var(--color-dash-surface1)] transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

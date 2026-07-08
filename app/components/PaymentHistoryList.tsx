"use client";

import { useState } from "react";
import { PaymentHistoryCard } from "./Cards/PaymentHistoryCard";
import type { PaymentHistory } from "@/types/payment";
import { Paymentstatus } from "@/app/generated/prisma/enums";
import Link from "next/link";

interface PaymentHistoryListProps {
  initialPayments: PaymentHistory[];
  role: "CLIENT" | "FREELANCER";
}

export function PaymentHistoryList({ initialPayments, role }: PaymentHistoryListProps) {
  const [dueDisplayCount, setDueDisplayCount] = useState(5);
  const [paidDisplayCount, setPaidDisplayCount] = useState(5);
  
  // Sort all payments: newest created first
  const sortedPayments = [...initialPayments].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Split into Due, Pending Verification, and Paid
  const duePayments = sortedPayments.filter(
    (p) => p.payment_status === Paymentstatus.DUE
  );
  
  const visibleDue = duePayments.slice(0, dueDisplayCount);
  const visiblePaid = paidPayments.slice(0, paidDisplayCount);
  
  const hasMoreDue = dueDisplayCount < duePayments.length;
  const hasMorePaid = paidDisplayCount < paidPayments.length;

  return (
    <div className="w-full py-4 lg:py-8 relative min-h-screen">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[500px] bg-[var(--color-status-pending-bg)] opacity-30 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[40%] h-[600px] bg-[var(--color-status-paid-bg)] opacity-20 rounded-full blur-[120px]" />
      </div>

      <h1 className="font-serif text-[28px] lg:text-[36px] mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--color-dash-ink2)]">
        Payment History
      </h1>

      {/* Verification Banner */}
      <div className="mb-10 w-full rounded-xl overflow-hidden relative p-[1px] bg-gradient-to-r from-[rgba(200,120,64,0.5)] via-[rgba(200,120,64,0.1)] to-[rgba(200,120,64,0.5)] shadow-[0_0_30px_rgba(200,120,64,0.15)] group">
        <div className="bg-[var(--color-dash-surface1)] w-full h-full rounded-[10px] p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <h2 className="font-serif text-[20px] lg:text-[24px] text-white mb-2">Payment Verifications</h2>
            <p className="font-mono text-[11px] lg:text-[13px] text-[var(--color-dash-ink2)] tracking-[1px]">
              {role === "CLIENT" ? "Track your verification requests and statuses." : "Review and approve pending verification requests."}
            </p>
          </div>
          <Link href={`/${role.toLowerCase()}/verify-payments`} className="w-full md:w-auto shrink-0">
            <button className="w-full md:w-auto px-6 py-3 bg-[rgba(200,120,64,0.1)] border border-[rgba(200,120,64,0.4)] rounded-md font-mono text-[12px] lg:text-[13px] tracking-[1.5px] uppercase text-[var(--color-dash-amber)] hover:bg-[rgba(200,120,64,0.2)] hover:border-[rgba(200,120,64,0.6)] transition-all duration-300">
              See Verification Requests
            </button>
          </Link>
        </div>
      </div>

      {/* Due Payments Section */}
      <div className="mb-12">
        <h2 className="font-serif text-[20px] lg:text-[24px] text-white mb-6 flex items-center gap-3">
          Due Payments
          <span className="bg-[var(--color-status-pending-bg)] text-[var(--color-dash-gold)] border border-[var(--color-status-pending-border)] font-mono text-[10px] px-2 py-0.5 rounded-sm tabular-nums">
            {duePayments.length}
          </span>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {visibleDue.map((payment, index) => (
            <PaymentHistoryCard 
              key={payment.id} 
              payment={payment} 
              index={index} 
              role={role} 
            />
          ))}
          
          {visibleDue.length === 0 && (
            <div className="col-span-1 lg:col-span-2 text-center py-8 border border-dashed border-[var(--color-dash-border)] rounded-xl font-mono text-[11px] text-[var(--color-dash-ink3)]">
              No due payments at the moment.
            </div>
          )}
        </div>

        {hasMoreDue && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setDueDisplayCount(prev => prev + 5)}
              className="px-6 py-2.5 border border-[var(--color-dash-border)] rounded-md font-mono text-[11px] lg:text-[13px] tracking-[1.5px] uppercase text-[var(--color-dash-ink2)] hover:text-white hover:border-[var(--color-dash-border-hover)] bg-[var(--color-dash-surface1)] transition-colors"
            >
              Load More Due
            </button>
          </div>
        )}
      </div>

      {/* Removed Verification Pending Section */}

      {/* Paid Payments Section */}
      <div>
        <h2 className="font-serif text-[20px] lg:text-[24px] text-white mb-6 flex items-center gap-3">
          Paid Payments
          <span className="bg-[var(--color-status-paid-bg)] text-[var(--color-dash-green)] border border-[var(--color-status-paid-border)] font-mono text-[10px] px-2 py-0.5 rounded-sm tabular-nums">
            {paidPayments.length}
          </span>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {visiblePaid.map((payment, index) => (
            <PaymentHistoryCard 
              key={payment.id} 
              payment={payment} 
              index={index} 
              role={role} 
            />
          ))}
          
          {visiblePaid.length === 0 && (
            <div className="col-span-1 lg:col-span-2 text-center py-8 border border-dashed border-[var(--color-dash-border)] rounded-xl font-mono text-[11px] text-[var(--color-dash-ink3)]">
              No paid payments found.
            </div>
          )}
        </div>

        {hasMorePaid && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setPaidDisplayCount(prev => prev + 5)}
              className="px-6 py-2.5 border border-[var(--color-dash-border)] rounded-md font-mono text-[11px] lg:text-[13px] tracking-[1.5px] uppercase text-[var(--color-dash-ink2)] hover:text-white hover:border-[var(--color-dash-border-hover)] bg-[var(--color-dash-surface1)] transition-colors"
            >
              Load More Paid
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

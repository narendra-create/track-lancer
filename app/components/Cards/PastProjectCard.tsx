import React from 'react';

// PROPS
export interface PastProjectCardProps {
  id: string;
  title: string;
  clientName?: string;
  freelancerName?: string;
  role: 'client' | 'freelancer';
  paymentStatus: 'PAID' | 'DUE' | 'PENDING_VERIFICATION';
  completionDate: string | Date;
  cost: number;
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
  cost,
}: PastProjectCardProps) {
  // DATE FORMATTING
  const formattedDate = typeof completionDate === 'string'
    ? completionDate
    : new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(completionDate);

  // CURRENCY FORMATTING
  const formattedCost = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(cost);

  // CONDITIONAL ROLE INFO
  const nameToShow = role === 'freelancer' ? clientName : freelancerName;
  
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
              paymentStatus === 'PAID'
                ? 'bg-[var(--color-status-paid-bg)] border-[var(--color-status-paid-border)] text-[var(--color-status-paid-text)]'
                : paymentStatus === 'DUE'
                ? 'bg-[var(--color-status-danger-bg)] border-[var(--color-status-danger-border)] text-[var(--color-status-danger-text)]'
                : 'bg-[var(--color-status-pending-bg)] border-[var(--color-status-pending-border)] text-[var(--color-status-pending)]'
            }`}
          >
            {paymentStatus === 'PAID' ? 'PAID IN FULL' : paymentStatus.replace('_', ' ')}
          </div>
        </div>
      </div>

      {/* OPTIONAL ROLE SPECIFIC INFO */}
      {nameToShow && (
        <div className="mb-4">
          <span className="text-[var(--color-dash-ink3)] font-mono text-[10px] tracking-[1px] uppercase">
            {role === 'freelancer' ? 'Client' : 'Freelancer'}: {nameToShow}
          </span>
        </div>
      )}

      {/* BOTTOM ROW */}
      <div className="flex justify-between items-end mt-1">
        <span className="text-[var(--color-dash-ink3)] font-mono text-[10px] tracking-[1px] uppercase">
          COMPLETED {formattedDate}
        </span>
        <span className="text-[var(--color-dash-gold)] font-mono text-[16px] tracking-wide">
          {formattedCost}
        </span>
      </div>

    </div>
  );
}

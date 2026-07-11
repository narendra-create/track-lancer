"use client";

import { motion } from "motion/react";
import { AlertTriangle, Clock } from "lucide-react";

export type ClientDeadlineItem = {
  id: string;
  projectTitle: string;
  milestoneTitle: string;
  deadline: Date;
  cost: number;
};

function getDaysLeft(deadline: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const d = new Date(deadline);
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

type StatusKey = "OVERDUE" | "DUE_SOON" | "UPCOMING";

function getStatus(daysLeft: number): StatusKey {
  if (daysLeft < 0) return "OVERDUE";
  if (daysLeft <= 7) return "DUE_SOON";
  return "UPCOMING";
}

const STATUS_CONFIG: Record<
  StatusKey,
  { dot: string; badge: string; label: (d: number) => string }
> = {
  OVERDUE: {
    dot: "bg-dash-red",
    badge: "bg-dash-red-bg text-dash-red",
    label: (d) => `${Math.abs(d)}d overdue`,
  },
  DUE_SOON: {
    dot: "bg-dash-amber",
    badge: "bg-dash-amber-bg text-dash-amber",
    label: (d) => (d === 0 ? "Today" : `${d}d left`),
  },
  UPCOMING: {
    dot: "bg-[var(--color-dash-surface3)]",
    badge: "bg-[var(--color-dash-surface2)] text-dash-ink2/70",
    label: (d) => `${d}d left`,
  },
};

export default function ClientUpcomingDeadlines({
  items,
}: {
  items: ClientDeadlineItem[];
}) {
  const sorted = [...items].sort(
    (a, b) => a.deadline.getTime() - b.deadline.getTime(),
  );

  const overdueCount = sorted.filter((d) => getDaysLeft(d.deadline) < 0).length;

  return (
    <div className="overflow-hidden rounded-md border border-[#2c2c2c] bg-[#141414]">
      <div className="border-b border-[#2c2c2c] px-5 py-4 flex items-center justify-between">
        <div>
          <h3 className="font-serif text-[#e8e3d8] text-[16px] lg:text-[22px] font-semibold tracking-badge">
            Upcoming Deadlines
          </h3>
          <p className="font-mono text-[9px] lg:text-[11px] uppercase tracking-widest text-[#9c968f] font-medium">
            {sorted.length} milestones
          </p>
        </div>
        {overdueCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-dash-red-bg border border-[rgba(192,96,96,0.2)]">
            <AlertTriangle size={11} className="text-dash-red" />
            <span className="font-mono text-[9px] lg:text-[11px] text-dash-red tracking-[1px]">
              {overdueCount} overdue
            </span>
          </div>
        )}
      </div>

      <div className="max-h-[340px] lg:max-h-[420px] overflow-y-auto custom-scrollbar">
        {sorted.map((item, i) => {
          const daysLeft = getDaysLeft(item.deadline);
          const status = getStatus(daysLeft);
          const cfg = STATUS_CONFIG[status];
          const formatted = new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "short",
          }).format(item.deadline);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18, delay: i * 0.05 }}
              className="flex items-start gap-2 px-5 py-[11px] border-b border-[#2c2c2c] last:border-b-0"
            >
              <div className="flex flex-col items-center gap-1.25 pt-0.75">
                <div className={`w-[6px] h-[6px] rounded-full shrink-0 ${cfg.dot}`} />
                {i < sorted.length - 1 && (
                  <div className="w-px h-full min-h-[26px] bg-[#7c7c7c]" />
                )}
              </div>
              <div className="min-w-0 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3 lg:gap-20">
                  <div className="min-w-0">
                    <p className="text-[.78rem] pb-1.5 lg:text-[17px] font-medium text-[#c4bcb1] leading-snug truncate">
                      {item.milestoneTitle}
                    </p>
                    <p className="text-[.7rem] lg:text-[11px] text-[#89827a] font-semibold truncate">
                      {item.projectTitle}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 font-mono font-bold text-[8px] lg:text-[12px] tracking-[1px] px-2 py-0.5 rounded-[3px] ${cfg.badge}`}
                  >
                    {cfg.label(daysLeft)}
                  </span>
                </div>
                <div className="mt-[5px] flex items-center gap-1.5">
                  <Clock size={9} className="text-dash-red" />
                  <span className="font-mono text-[7px] lg:text-[12px] font-semibold tracking-[1px] text-dash-red">
                    {formatted}
                  </span>
                  <span className="font-mono text-[7px] lg:text-[9px] text-[#8d837a] font-bold">•</span>
                  <span className="font-mono text-[7px] font-semibold lg:text-[11px] tracking-[0.3px] text-[#c8a96e]/70">
                    ₹{item.cost.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

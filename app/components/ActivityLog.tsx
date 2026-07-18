"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  Clock,
  CreditCard,
  CheckCircle,
  Bell,
  AlertTriangle,
  Filter,
  Loader2,
  X,
} from "lucide-react";
import type { ActivityItem } from "@/types/activitys";

// ─── Dummy data removed (now using real server data) ──────────────────────────

// ─── Type config ──────────────────────────────────────────────────────────────

type FilterType = "ALL" | "DELAY" | "PAYMENT" | "MILESTONEDONE" | "REMINDER" | "WARNING";

const TYPE_CONFIG: Record<
  Exclude<FilterType, "ALL">,
  {
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
    iconLg: React.ReactNode;
    pill: string;
    pillText: string;
    iconBg: string;
    iconText: string;
    iconBorder: string;
    bar: string;
  }
> = {
  DELAY: {
    label: "Delays",
    shortLabel: "Delay",
    icon: <Clock size={18} strokeWidth={2.5} />,
    iconLg: <Clock size={15} strokeWidth={2} />,
    pill: "bg-orange-500/10 border-orange-500/20",
    pillText: "text-orange-400",
    iconBg: "bg-orange-500/10",
    iconText: "text-orange-400",
    iconBorder: "border-orange-500/20",
    bar: "bg-orange-400",
  },
  PAYMENT: {
    label: "Payments",
    shortLabel: "Payment",
    icon: <CreditCard size={18} strokeWidth={2.5} />,
    iconLg: <CreditCard size={15} strokeWidth={2} />,
    pill: "bg-emerald-500/10 border-emerald-500/20",
    pillText: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    iconText: "text-emerald-400",
    iconBorder: "border-emerald-500/20",
    bar: "bg-emerald-400",
  },
  MILESTONEDONE: {
    label: "Milestones",
    shortLabel: "Milestone",
    icon: <CheckCircle size={18} strokeWidth={2.5} />,
    iconLg: <CheckCircle size={15} strokeWidth={2} />,
    pill: "bg-blue-500/10 border-blue-500/20",
    pillText: "text-blue-400",
    iconBg: "bg-blue-500/10",
    iconText: "text-blue-400",
    iconBorder: "border-blue-500/20",
    bar: "bg-blue-400",
  },
  REMINDER: {
    label: "Reminders",
    shortLabel: "Reminder",
    icon: <Bell size={18} strokeWidth={2.5} />,
    iconLg: <Bell size={15} strokeWidth={2} />,
    pill: "bg-[var(--color-dash-gold-glow)] border-[rgba(200,169,110,0.2)]",
    pillText: "text-[var(--color-dash-gold)]",
    iconBg: "bg-[var(--color-dash-gold-glow)]",
    iconText: "text-[var(--color-dash-gold)]",
    iconBorder: "border-[rgba(200,169,110,0.15)]",
    bar: "bg-[var(--color-dash-gold)]",
  },
  WARNING: {
    label: "Warnings",
    shortLabel: "Warning",
    icon: <AlertTriangle size={18} strokeWidth={2.5} />,
    iconLg: <AlertTriangle size={15} strokeWidth={2} />,
    pill: "bg-[var(--color-dash-red-bg)] border-[var(--color-status-danger-border)]",
    pillText: "text-[var(--color-dash-red)]",
    iconBg: "bg-[var(--color-dash-red-bg)]",
    iconText: "text-[var(--color-dash-red)]",
    iconBorder: "border-[var(--color-status-danger-border)]",
    bar: "bg-[var(--color-dash-red)]",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatFullDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

function formatRelative(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: Exclude<FilterType, "ALL"> }) {
  const cfg = TYPE_CONFIG[type];
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm border font-mono text-[8px] lg:text-[9px] tracking-[1.2px] uppercase shrink-0 ${cfg.pill} ${cfg.pillText}`}
    >
      {cfg.icon}
      <span className="hidden lg:inline">{cfg.shortLabel}</span>
      <span className="lg:hidden">{cfg.shortLabel}</span>
    </span>
  );
}

function ActivityCard({ item, index }: { item: ActivityItem; index: number }) {
  const cfg = TYPE_CONFIG[item.type as Exclude<FilterType, "ALL">];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4, scale: 0.98 }}
      transition={{ duration: 0.2, delay: index * 0.025, type: "spring", stiffness: 240, damping: 24 }}
      className="group relative flex gap-3 lg:gap-4 rounded-xl border border-[var(--color-dash-border)] bg-[var(--color-dash-surface1)] p-3 lg:p-4 hover:border-[var(--color-dash-border-hover)] hover:bg-[var(--color-dash-surface2)] transition-all duration-200"
    >
      <div className={`absolute left-0 top-0 bottom-0 w-[2px] rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${cfg.bar}`} />

      {/* Icon */}
      <div
        className={`shrink-0 h-8 w-8 lg:h-10 lg:w-10 grid place-items-center rounded-full border transition-transform duration-200 group-hover:scale-105 ${cfg.iconBg} ${cfg.iconText} ${cfg.iconBorder}`}
      >
        {cfg.iconLg}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">

        {/* Top row: badge + project + time */}
        <div className="flex items-center gap-2 mb-1.5 justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <TypeBadge type={item.type as Exclude<FilterType, "ALL">} />
            {item.project?.title && (
              <span className="font-mono text-[9px] lg:text-[10px] tracking-[0.3px] text-dash-ink2/70 font-semibold truncate min-w-0">
                {item.project.title}
              </span>
            )}
          </div>
          <span className="shrink-0 font-mono text-[9px] lg:text-[10px] text-dash-ink2/70 font-semibold whitespace-nowrap ml-1">
            {formatRelative(item.dateTimeofMessage)}
          </span>
        </div>

        {/* Message */}
        <p className="font-sans text-[12px] lg:text-[14px] text-[var(--color-dash-ink)] leading-relaxed mb-1.5">
          <span className={`font-semibold font-serif mr-1 ${cfg.iconText}`}>
            {item.highlightmessage}:
          </span>
          <span className="text-[var(--color-dash-ink2)] group-hover:text-[var(--color-dash-ink)] transition-colors duration-200">
            {item.message}
          </span>
        </p>

        {/* Full timestamp */}
        <div className="flex items-center gap-1 font-mono text-[9px] lg:text-[10px] text-dash-ink2/70 font-semibold">
          <Clock size={9} />
          <span>{formatFullDate(item.dateTimeofMessage)}</span>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState({ active }: { active: FilterType }) {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="flex flex-col items-center justify-center py-16 lg:py-24 text-center"
    >
      <div className="relative mb-4 flex h-14 w-14 lg:h-16 lg:w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-[var(--color-dash-surface2)] to-[var(--color-dash-surface1)] border border-[var(--color-dash-border)]">
        <Activity size={22} className="text-[var(--color-dash-ink4)]" />
      </div>
      <h3 className="font-serif text-[15px] lg:text-[16px] text-[var(--color-dash-ink)] mb-1.5">
        No {active === "ALL" ? "activity" : TYPE_CONFIG[active as Exclude<FilterType, "ALL">].label.toLowerCase()} found
      </h3>
      <p className="font-sans text-[11px] lg:text-[12px] text-dash-ink2/70 font-semibold max-w-[180px] leading-relaxed">
        Activity from the last 7 days will appear here.
      </p>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const FILTERS: FilterType[] = ["ALL", "DELAY", "PAYMENT", "MILESTONEDONE", "REMINDER", "WARNING"];

export default function ActivityLog({
  items = [],
  initialNextCursor = null,
  loadMoreActivities,
}: {
  items?: ActivityItem[];
  initialNextCursor?: string | null;
  loadMoreActivities?: (cursor: string) => Promise<{ items: ActivityItem[]; nextCursor: string | null }>;
}) {
  const [active, setActive] = useState<FilterType>("ALL");
  const [displayed, setDisplayed] = useState<ActivityItem[]>(items);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = async () => {
    if (!loadMoreActivities || !nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    const result = await loadMoreActivities(nextCursor);
    setDisplayed((prev) => [...prev, ...result.items]);
    setNextCursor(result.nextCursor);
    setIsLoadingMore(false);
  };

  const counts = FILTERS.reduce<Record<FilterType, number>>(
    (acc, f) => {
      acc[f] = f === "ALL" ? displayed.length : displayed.filter((i) => i.type === f).length;
      return acc;
    },
    {} as Record<FilterType, number>,
  );

  const visible = active === "ALL" ? displayed : displayed.filter((i) => i.type === active);

  // ─── Header ────────────────────────────────────────────────────────────────
  return (
    <div className="w-full flex flex-col gap-5 lg:gap-6 px-6 py-3">

      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-[22px] lg:text-[30px] text-[var(--color-dash-ink)] leading-tight mb-0.5 lg:mb-1">
            Activity Log
          </h1>
          <p className="font-mono text-[9px] lg:text-[11px] tracking-[2px] uppercase text-[var(--color-dash-ink2)]">
            Last 7 days · {displayed.length} loaded
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 font-mono text-[9px] lg:text-[10px] tracking-[1.5px] uppercase text-dash-ink2/70 font-semibold mt-1.5 lg:mt-2 shrink-0">
          <Filter size={10} />
          Filter
        </span>
      </div>

      <div className="w-full h-px bg-[var(--color-dash-border)]" />

      {/* ─── Filter bar ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 lg:gap-2 overflow-x-auto scrollbar-hide pb-0.5">
        {FILTERS.map((f) => {
          const isAll = f === "ALL";
          const cfg = !isAll ? TYPE_CONFIG[f as Exclude<FilterType, "ALL">] : null;
          const isActive = active === f;
          const count = counts[f];

          return (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`shrink-0 flex font-semibold items-center gap-1 lg:gap-1.5 px-2.5 lg:px-6 py-2 rounded-lg border font-mono text-[9px] lg:text-[16px] tracking-[0.8px] lg:tracking-[1px] uppercase transition-all duration-150 ${
                isActive
                  ? isAll
                    ? "bg-[var(--color-dash-surface3)] border-[var(--color-dash-border-hover)] text-[var(--color-dash-ink)]"
                    : `${cfg!.pill} ${cfg!.pillText}`
                  : "bg-transparent border-[var(--color-dash-border)] text-[var(--color-dash-ink2)] hover:border-[var(--color-dash-border-hover)] hover:text-[var(--color-dash-ink)]"
              }`}
            >
              {!isAll && cfg!.icon}
              {isAll ? "All" : cfg!.label}
              {count > 0 && (
                <span
                  className={`rounded-sm px-1 py-px text-[8px] leading-none ${
                    isActive && !isAll ? cfg!.pillText : "text-dash-ink2/70 font-semibold"
                  }`}
                >
                  {count}
                </span>
              )}
              {isActive && active !== "ALL" && (
                <X
                  size={9}
                  className="opacity-60"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive("ALL");
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ─── Type breakdown strip ────────────────────────────────────────────── */}
      {/* Mobile: 2-col grid + scrollable row fallback via grid-cols-3 on sm */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
        {(
          Object.entries(TYPE_CONFIG) as [
            Exclude<FilterType, "ALL">,
            (typeof TYPE_CONFIG)[keyof typeof TYPE_CONFIG],
          ][]
        ).map(([type, cfg]) => {
          const count = counts[type];
          const pct = displayed.length > 0 ? Math.round((count / displayed.length) * 100) : 0;
          const isActive = active === type;

          return (
            <button
              key={type}
              onClick={() => setActive(type)}
              className={`flex flex-col gap-2 p-4 lg:px-5 lg:py-6 rounded-xl border transition-all duration-150 text-left ${
                isActive
                  ? `${cfg.pill} ${cfg.pillText}`
                  : "border-[var(--color-dash-border)] bg-[var(--color-dash-surface1)] hover:border-[var(--color-dash-border-hover)] hover:bg-[var(--color-dash-surface2)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={isActive ? cfg.iconText : "text-dash-ink2/70 text-md font-semibold"}>
                  {cfg.icon}
                </span>
                <span
                  className={`font-mono text-md lg:text-[24px] font-bold leading-none ${
                    isActive ? cfg.iconText : "text-[var(--color-dash-ink)]"
                  }`}
                >
                  {count}
                </span>
              </div>
              <div>
                <p
                  className={`font-mono text-[8px] lg:text-[16px] tracking-[0.8px] lg:tracking-[1px] uppercase mb-1.5 ${
                    isActive ? cfg.pillText : "text-dash-ink2/70 font-semibold"
                  }`}
                >
                  {cfg.label}
                </p>
                <div className="h-[2px] w-full rounded-full bg-[var(--color-dash-border)]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${cfg.bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ─── List ─────────────────────────────────────────────────────────────── */}
      <AnimatePresence mode="popLayout">
        {visible.length === 0 ? (
          <EmptyState key="empty" active={active} />
        ) : (
          <motion.div key={active} className="flex flex-col gap-2 lg:gap-3">
            <AnimatePresence mode="popLayout">
              {visible.map((item, i) => (
                <ActivityCard key={item.id} item={item} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Load more ───────────────────────────────────────────────────────── */}
      {loadMoreActivities && nextCursor && (
        <div className="flex justify-center pt-1">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="flex items-center gap-2 px-5 lg:px-6 py-2.5 bg-transparent border border-[var(--color-dash-border-hover)] rounded-md text-[var(--color-dash-ink2)] font-mono text-[10px] lg:text-[11px] uppercase tracking-[1.5px] hover:bg-[var(--color-dash-surface2)] hover:border-[var(--color-dash-ink3)] hover:text-[var(--color-dash-ink)] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoadingMore ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                Loading...
              </>
            ) : (
              "Load More →"
            )}
          </button>
        </div>
      )}

      {/* ─── Footer note ─────────────────────────────────────────────────────── */}
      {displayed.length > 0 && (
        <div className="flex items-center justify-center gap-2 pt-1 pb-4">
          <div className="flex-1 h-px bg-[var(--color-dash-border)]" />
          <span className="font-mono text-[8px] lg:text-[9px] tracking-[1.2px] lg:tracking-[1.5px] uppercase text-dash-ink2/70 font-semibold text-center px-2">
            Activities older than 7 days are removed automatically
          </span>
          <div className="flex-1 h-px bg-[var(--color-dash-border)]" />
        </div>
      )}
    </div>
  );
}

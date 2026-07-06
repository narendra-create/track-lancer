"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { AllProject, GetAllProjectsResponse, AllProjectStatus } from "@/types/allprojects";
import { SECTION_ORDER } from "@/types/allprojects";
import { useToast } from "../ToastProvider";

// ─── PROPS ────────────────────────────────────────────────────────────────────

interface ClientAllProjectsProps {
  initialProjects: AllProject[];
  initialNextCursor: string | null;
  loadMore: (cursor: string) => Promise<GetAllProjectsResponse>;
}

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, { dot: string; text: string; bg: string }> = {
  ACTIVE: {
    dot: "bg-[var(--color-dash-green)]",
    text: "text-[var(--color-dash-green)]",
    bg: "bg-[var(--color-dash-green-bg)]",
  },
  STOPPED: {
    dot: "bg-[var(--color-dash-amber)]",
    text: "text-[var(--color-dash-amber)]",
    bg: "bg-[var(--color-dash-amber-bg)]",
  },
  CANCELLED: {
    dot: "bg-[var(--color-dash-red)]",
    text: "text-[var(--color-dash-red)]",
    bg: "bg-[var(--color-dash-red-bg)]",
  },
};

const SECTION_ACCENT: Record<AllProjectStatus, string> = {
  ACTIVE: "bg-[var(--color-dash-green)]",
  STOPPED: "bg-[var(--color-dash-amber)]",
  CANCELLED: "bg-[var(--color-dash-red)]",
};

// ─── SKELETON CARD ────────────────────────────────────────────────────────────

function AllProjectCardSkeleton() {
  return (
    <div className="bg-[var(--color-dash-surface1)] border border-[var(--color-dash-border)] rounded-xl p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-[7px] h-[7px] rounded-full bg-[var(--color-dash-surface3)] animate-pulse shrink-0" />
            <div className="h-4 w-40 rounded bg-[var(--color-dash-surface3)] animate-pulse" />
          </div>
          <div className="h-3 w-28 rounded bg-[var(--color-dash-surface3)] animate-pulse" />
        </div>
        <div className="h-5 w-16 rounded-sm bg-[var(--color-dash-surface3)] animate-pulse shrink-0" />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="h-2.5 w-12 rounded bg-[var(--color-dash-surface3)] animate-pulse" />
            <div className="h-4 w-16 rounded bg-[var(--color-dash-surface3)] animate-pulse" />
          </div>
        ))}
      </div>

      <div className="mb-3">
        <div className="flex justify-between mb-1.5">
          <div className="h-2.5 w-24 rounded bg-[var(--color-dash-surface3)] animate-pulse" />
          <div className="h-2.5 w-8 rounded bg-[var(--color-dash-surface3)] animate-pulse" />
        </div>
        <div className="w-full h-[3px] rounded-full bg-[var(--color-dash-surface3)] animate-pulse" />
      </div>

      <div className="h-3 w-32 rounded bg-[var(--color-dash-surface3)] animate-pulse" />
    </div>
  );
}

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────

type ClientProjectCardType = AllProject & { freelancer?: { user: { name: string; image: string | null }; email: string | null } };

function ProjectCard({
  project,
  index,
}: {
  project: ClientProjectCardType;
  index: number;
}) {
  const router = useRouter();
  const style = STATUS_STYLE[project.status] ?? STATUS_STYLE.ACTIVE;
  const { totalMilestones, completedMilestones, progress, projectDeadline } = project.stats;

  const formattedDeadline = projectDeadline
    ? new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(
        new Date(projectDeadline),
      )
    : null;

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-no-nav]")) return;
    router.push(`/client/milestones/${project.id}`);
  };

  const personName = project.freelancer?.user?.name || project.client?.user?.name || "Unknown";
  const personEmail = project.freelancer?.email || project.client?.email || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.18, delay: index * 0.04 }}
      onClick={handleClick}
      className="group relative bg-[var(--color-dash-surface1)] border border-[var(--color-dash-border)] rounded-xl p-5 hover:border-[var(--color-dash-border-hover)] transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className={`w-[7px] h-[7px] rounded-full shrink-0 ${style.dot}`} />
            <h3 className="font-serif text-[15px] text-white leading-snug truncate">
              {project.title}
            </h3>
          </div>
          <p className="font-mono text-[10px] tracking-[1px] text-[var(--color-dash-ink3)] truncate">
            {personName}
            {personEmail && (
              <span className="text-[var(--color-dash-ink4)]"> · {personEmail}</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`font-mono text-[9px] tracking-[1.5px] uppercase px-2 py-[3px] rounded-sm ${style.bg} ${style.text}`}
          >
            {project.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <p className="font-mono text-[9px] tracking-[1.5px] uppercase text-[var(--color-dash-ink4)] mb-0.5">
            Value
          </p>
          <p className="font-serif text-[14px] text-[var(--color-dash-ink)]">
            ₹{project.money.totalAmount.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="font-mono text-[9px] tracking-[1.5px] uppercase text-[var(--color-dash-ink4)] mb-0.5">
            Paid
          </p>
          <p className="font-serif text-[14px] text-[var(--color-dash-green)]">
            ₹{project.money.received.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="font-mono text-[9px] tracking-[1.5px] uppercase text-[var(--color-dash-ink4)] mb-0.5">
            Remaining
          </p>
          <p className="font-serif text-[14px] text-[var(--color-dash-amber)]">
            ₹{project.money.remaining.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between items-center mb-1.5">
          <span className="font-mono text-[9px] tracking-[1px] uppercase text-[var(--color-dash-ink4)]">
            {completedMilestones}/{totalMilestones} milestones
          </span>
          <span className="font-mono text-[9px] text-[var(--color-dash-ink3)]">{progress}%</span>
        </div>
        <div className="w-full h-[3px] bg-[var(--color-dash-surface3)] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              project.status === "ACTIVE"
                ? "bg-[var(--color-dash-green)]"
                : project.status === "STOPPED"
                  ? "bg-[var(--color-dash-amber)]"
                  : "bg-[var(--color-dash-border-hover)]"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        {formattedDeadline ? (
          <span className="font-mono text-[10px] tracking-[0.5px] text-[var(--color-dash-ink4)]">
            Due: <span className="text-[var(--color-dash-ink3)]">{formattedDeadline}</span>
          </span>
        ) : (
          <span />
        )}
        <ChevronRight
          size={14}
          className="text-[var(--color-dash-ink4)] group-hover:text-[var(--color-dash-ink3)] group-hover:translate-x-0.5 transition-all duration-150"
        />
      </div>
    </motion.div>
  );
}

// ─── SECTION BLOCK ────────────────────────────────────────────────────────────

function SectionBlock({
  status,
  projects,
}: {
  status: AllProjectStatus;
  projects: AllProject[];
}) {
  if (projects.length === 0) return null;
  const label = status.charAt(0) + status.slice(1).toLowerCase();

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-5">
        <span className={`w-[6px] h-[6px] rounded-full shrink-0 ${SECTION_ACCENT[status]}`} />
        <h2 className="font-serif text-[18px] text-white">{label}</h2>
        <span className="font-mono text-[10px] tracking-[2px] text-[var(--color-dash-ink4)]">
          {projects.length}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export function ClientAllProjects({
  initialProjects,
  initialNextCursor,
  loadMore,
}: ClientAllProjectsProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [projects, setProjects] = useState<AllProject[]>(initialProjects);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
  const [loadingMore, setLoadingMore] = useState(false);

  const grouped = SECTION_ORDER.reduce<Record<string, AllProject[]>>((acc, status) => {
    acc[status] = projects.filter((p) => p.status === status);
    return acc;
  }, {});

  const onLoadMore = async () => {
    if (!nextCursor) return;
    setLoadingMore(true);
    const result = await loadMore(nextCursor);
    setLoadingMore(false);
    if (result.success) {
      setProjects((prev) => [...prev, ...result.projects]);
      setNextCursor(result.nextCursor);
    } else {
      addToast({ title: "Failed to load", message: result.error, type: "error" });
    }
  };

  const total = projects.length;

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[var(--color-dash-ink3)] hover:text-white transition-colors duration-200 mb-4 font-mono text-[11px] tracking-[1px] uppercase"
          >
            <ArrowLeft size={14} />
            Back
          </button>
          <h1 className="font-serif text-[26px] lg:text-[30px] text-white leading-tight mb-1">
            All Projects
          </h1>
          <p className="font-mono text-[10px] tracking-[2px] uppercase text-[var(--color-dash-ink3)]">
            {total} project{total !== 1 ? "s" : ""} total
          </p>
        </div>
      </div>

      <div className="w-full h-px bg-[var(--color-dash-border)] mb-8" />

      {total === 0 ? (
        <div className="text-center py-16 border border-[var(--color-dash-border)] rounded-xl bg-[var(--color-dash-surface1)]">
          <p className="font-mono text-[12px] tracking-[2px] uppercase text-[var(--color-dash-ink4)]">
            No projects found
          </p>
        </div>
      ) : (
        <>
          {SECTION_ORDER.map((status) => (
            <SectionBlock
              key={status}
              status={status}
              projects={grouped[status]}
            />
          ))}

          {nextCursor && (
            <div className="flex justify-center mt-2 mb-4">
              <button
                onClick={onLoadMore}
                disabled={loadingMore}
                className="group flex items-center gap-2 px-6 py-2.5 border border-[var(--color-dash-border)] bg-[var(--color-dash-surface1)] text-[var(--color-dash-ink3)] font-sans text-[13px] rounded-full transition-all duration-200 hover:border-[var(--color-dash-border-hover)] hover:text-[var(--color-dash-ink)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span
                  className={`transition-transform duration-200 ${
                    loadingMore ? "animate-spin" : "group-hover:translate-y-0.5"
                  }`}
                >
                  {loadingMore ? "◌" : "↓"}
                </span>
                {loadingMore ? "Loading..." : "Load more"}
              </button>
            </div>
          )}

          {loadingMore && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
              {[0, 1, 2].map((i) => (
                <AllProjectCardSkeleton key={i} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

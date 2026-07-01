"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type {
  AllProject,
  AllProjectsData,
  LoadMoreAllProjectsResponse,
} from "@/types/allprojects";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface FreelancerAllProjectsProps {
  initialData: AllProjectsData;
  loadMoreActive: (cursor: string) => Promise<LoadMoreAllProjectsResponse>;
  loadMoreStopped: (cursor: string) => Promise<LoadMoreAllProjectsResponse>;
  loadMoreCancelled: (cursor: string) => Promise<LoadMoreAllProjectsResponse>;
  handleDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
}

// ─── DUMMY DATA ───────────────────────────────────────────────────────────────

const DUMMY_DATA: AllProjectsData = {
  active: {
    projects: [
      {
        id: "a1",
        title: "Adhyatma Coaching Platform",
        clientName: "Rahul Mehta",
        clientEmail: "rahul@adhyatma.in",
        totalAmount: 45000,
        received: 20000,
        totalMilestones: 5,
        completedMilestones: 2,
        deadline: "15 Jan 2026",
        status: "ACTIVE",
        createdAt: "1 Nov 2025",
      },
      {
        id: "a2",
        title: "FitLife Mobile App",
        clientName: "Priya Sharma",
        clientEmail: "priya@fitlife.co",
        totalAmount: 60000,
        received: 30000,
        totalMilestones: 6,
        completedMilestones: 3,
        deadline: "20 Feb 2026",
        status: "ACTIVE",
        createdAt: "10 Oct 2025",
      },
      {
        id: "a3",
        title: "TechMart E-Commerce",
        clientName: "Suresh Kumar",
        clientEmail: "suresh@techmart.io",
        totalAmount: 80000,
        received: 40000,
        totalMilestones: 8,
        completedMilestones: 4,
        deadline: "5 Mar 2026",
        status: "ACTIVE",
        createdAt: "5 Sep 2025",
      },
    ],
    nextCursor: null,
  },
  stopped: {
    projects: [
      {
        id: "s1",
        title: "EduTech Portal",
        clientName: "Anita Verma",
        clientEmail: "anita@edutech.com",
        totalAmount: 35000,
        received: 15000,
        totalMilestones: 4,
        completedMilestones: 1,
        deadline: "10 Dec 2025",
        status: "STOPPED",
        createdAt: "1 Aug 2025",
      },
      {
        id: "s2",
        title: "LearnWave Dashboard",
        clientName: "Kiran Patel",
        clientEmail: "kiran@learnwave.in",
        totalAmount: 25000,
        received: 10000,
        totalMilestones: 3,
        completedMilestones: 1,
        deadline: "30 Nov 2025",
        status: "STOPPED",
        createdAt: "15 Jul 2025",
      },
    ],
    nextCursor: null,
  },
  cancelled: {
    projects: [
      {
        id: "c1",
        title: "HealthSync Wearable App",
        clientName: "Dev Nair",
        clientEmail: "dev@healthsync.io",
        totalAmount: 50000,
        received: 0,
        totalMilestones: 5,
        completedMilestones: 0,
        deadline: null,
        status: "CANCELLED",
        createdAt: "20 Jun 2025",
      },
      {
        id: "c2",
        title: "Retail POS System",
        clientName: "Meera Joshi",
        clientEmail: "meera@retailpos.com",
        totalAmount: 30000,
        received: 5000,
        totalMilestones: 4,
        completedMilestones: 0,
        deadline: null,
        status: "CANCELLED",
        createdAt: "1 Jun 2025",
      },
    ],
    nextCursor: null,
  },
};

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────

const STATUS_STYLE = {
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

// ─── DELETE CONFIRM MODAL ─────────────────────────────────────────────────────

function DeleteModal({
  onConfirm,
  onCancel,
  loading,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.16 }}
        className="bg-[var(--color-dash-surface1)] border border-[var(--color-dash-border)] rounded-xl p-7 max-w-sm w-full shadow-2xl relative"
      >
        <button
          onClick={onCancel}
          disabled={loading}
          className="absolute top-4 right-4 text-[var(--color-dash-ink3)] hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
        <div className="w-10 h-10 rounded-full bg-[var(--color-status-danger-bg)] border border-[var(--color-status-danger-border)] flex items-center justify-center mb-5">
          <AlertTriangle size={16} className="text-[var(--color-status-danger-text)]" />
        </div>
        <p className="font-serif text-[18px] text-white mb-1">Delete Project?</p>
        <p className="font-mono text-[10px] tracking-[1px] text-[var(--color-dash-ink3)] mb-6">
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-transparent border border-[var(--color-dash-border)] rounded-md text-white font-mono text-[11px] uppercase tracking-[1.5px] hover:bg-[var(--color-dash-surface2)] transition-all duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-[var(--color-status-danger-bg)] border border-[var(--color-status-danger-border)] rounded-md text-[var(--color-status-danger-text)] font-mono text-[11px] uppercase tracking-[1.5px] hover:bg-[rgba(192,96,96,0.15)] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  index,
  onDelete,
}: {
  project: AllProject;
  index: number;
  onDelete?: (id: string) => void;
}) {
  const router = useRouter();
  const style = STATUS_STYLE[project.status];
  const progress =
    project.totalMilestones > 0
      ? Math.round((project.completedMilestones / project.totalMilestones) * 100)
      : 0;
  const remaining = project.totalAmount - project.received;

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-no-nav]")) return;
    router.push(`/freelancer/milestones/${project.id}`);
  };

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
            {project.clientName}
            <span className="text-[var(--color-dash-ink4)]"> · {project.clientEmail}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`font-mono text-[9px] tracking-[1.5px] uppercase px-2 py-[3px] rounded-sm ${style.bg} ${style.text}`}
          >
            {project.status}
          </span>
          {project.status === "CANCELLED" && onDelete && (
            <button
              data-no-nav
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
              }}
              className="p-1.5 rounded-md border border-transparent text-[var(--color-dash-ink4)] hover:text-[var(--color-dash-red)] hover:border-[var(--color-status-danger-border)] hover:bg-[var(--color-status-danger-bg)] transition-all duration-150"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <p className="font-mono text-[9px] tracking-[1.5px] uppercase text-[var(--color-dash-ink4)] mb-0.5">
            Value
          </p>
          <p className="font-serif text-[14px] text-[var(--color-dash-ink)]">
            ₹{project.totalAmount.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="font-mono text-[9px] tracking-[1.5px] uppercase text-[var(--color-dash-ink4)] mb-0.5">
            Received
          </p>
          <p className="font-serif text-[14px] text-[var(--color-dash-green)]">
            ₹{project.received.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="font-mono text-[9px] tracking-[1.5px] uppercase text-[var(--color-dash-ink4)] mb-0.5">
            Remaining
          </p>
          <p className="font-serif text-[14px] text-[var(--color-dash-amber)]">
            ₹{remaining.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between items-center mb-1.5">
          <span className="font-mono text-[9px] tracking-[1px] uppercase text-[var(--color-dash-ink4)]">
            {project.completedMilestones}/{project.totalMilestones} milestones
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
        <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.5px] text-[var(--color-dash-ink4)]">
          {project.deadline && (
            <span>Due: <span className="text-[var(--color-dash-ink3)]">{project.deadline}</span></span>
          )}
          <span>Since: <span className="text-[var(--color-dash-ink3)]">{project.createdAt}</span></span>
        </div>
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
  title,
  accent,
  projects,
  nextCursor,
  onLoadMore,
  onDelete,
  loadingMore,
}: {
  title: string;
  accent: string;
  projects: AllProject[];
  nextCursor: string | null;
  onLoadMore: () => void;
  onDelete?: (id: string) => void;
  loadingMore: boolean;
}) {
  if (projects.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-5">
        <span className={`w-[6px] h-[6px] rounded-full shrink-0 ${accent}`} />
        <h2 className="font-serif text-[18px] text-white">{title}</h2>
        <span className="font-mono text-[10px] tracking-[2px] text-[var(--color-dash-ink4)]">
          {projects.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} onDelete={onDelete} />
          ))}
        </AnimatePresence>
      </div>

      {nextCursor && (
        <div className="flex justify-center mt-5">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="group flex items-center gap-2 px-6 py-2.5 border border-[var(--color-dash-border)] bg-[var(--color-dash-surface1)] text-[var(--color-dash-ink3)] font-sans text-[13px] rounded-full transition-all duration-200 hover:border-[var(--color-dash-border-hover)] hover:text-[var(--color-dash-ink)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className={`transition-transform duration-200 ${loadingMore ? "animate-spin" : "group-hover:translate-y-0.5"}`}>
              {loadingMore ? "◌" : "↓"}
            </span>
            {loadingMore ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export function FreelancerAllProjects({
  initialData = DUMMY_DATA,
  loadMoreActive,
  loadMoreStopped,
  loadMoreCancelled,
  handleDelete,
}: Partial<FreelancerAllProjectsProps> & { initialData?: AllProjectsData }) {
  const [active, setActive] = useState(initialData.active.projects);
  const [stopped, setStopped] = useState(initialData.stopped.projects);
  const [cancelled, setCancelled] = useState(initialData.cancelled.projects);

  const [activeCursor, setActiveCursor] = useState(initialData.active.nextCursor);
  const [stoppedCursor, setStoppedCursor] = useState(initialData.stopped.nextCursor);
  const [cancelledCursor, setCancelledCursor] = useState(initialData.cancelled.nextCursor);

  const [loadingActive, setLoadingActive] = useState(false);
  const [loadingStopped, setLoadingStopped] = useState(false);
  const [loadingCancelled, setLoadingCancelled] = useState(false);

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const onLoadMore = async (
    cursor: string,
    fetcher: ((c: string) => Promise<LoadMoreAllProjectsResponse>) | undefined,
    setter: React.Dispatch<React.SetStateAction<AllProject[]>>,
    setCursor: React.Dispatch<React.SetStateAction<string | null>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    if (!fetcher) return;
    setLoading(true);
    const result = await fetcher(cursor);
    setLoading(false);
    if (result.success) {
      setter((prev) => [...prev, ...result.projects]);
      setCursor(result.nextCursor);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId || !handleDelete) return;
    setDeleting(true);
    const result = await handleDelete(deleteTargetId);
    setDeleting(false);
    if (result.success) {
      setCancelled((prev) => prev.filter((p) => p.id !== deleteTargetId));
    }
    setDeleteTargetId(null);
  };

  const totalCount = active.length + stopped.length + cancelled.length;

  return (
    <div className="w-full">
      <AnimatePresence>
        {deleteTargetId && (
          <DeleteModal
            key="delete-modal"
            onConfirm={confirmDelete}
            onCancel={() => setDeleteTargetId(null)}
            loading={deleting}
          />
        )}
      </AnimatePresence>

      <div className="mb-8">
        <h1 className="font-serif text-[26px] lg:text-[30px] text-white leading-tight mb-1">
          All Projects
        </h1>
        <p className="font-mono text-[10px] tracking-[2px] uppercase text-[var(--color-dash-ink3)]">
          {totalCount} project{totalCount !== 1 ? "s" : ""} total
        </p>
      </div>

      <div className="w-full h-px bg-[var(--color-dash-border)] mb-8" />

      {totalCount === 0 ? (
        <div className="text-center py-16 border border-[var(--color-dash-border)] rounded-xl bg-[var(--color-dash-surface1)]">
          <p className="font-mono text-[12px] tracking-[2px] uppercase text-[var(--color-dash-ink4)]">
            No projects found
          </p>
        </div>
      ) : (
        <>
          <SectionBlock
            title="Active"
            accent="bg-[var(--color-dash-green)]"
            projects={active}
            nextCursor={activeCursor}
            loadingMore={loadingActive}
            onLoadMore={() =>
              activeCursor &&
              onLoadMore(activeCursor, loadMoreActive, setActive, setActiveCursor, setLoadingActive)
            }
          />

          <SectionBlock
            title="Stopped"
            accent="bg-[var(--color-dash-amber)]"
            projects={stopped}
            nextCursor={stoppedCursor}
            loadingMore={loadingStopped}
            onLoadMore={() =>
              stoppedCursor &&
              onLoadMore(stoppedCursor, loadMoreStopped, setStopped, setStoppedCursor, setLoadingStopped)
            }
          />

          <SectionBlock
            title="Cancelled"
            accent="bg-[var(--color-dash-red)]"
            projects={cancelled}
            nextCursor={cancelledCursor}
            loadingMore={loadingCancelled}
            onDelete={(id) => setDeleteTargetId(id)}
            onLoadMore={() =>
              cancelledCursor &&
              onLoadMore(cancelledCursor, loadMoreCancelled, setCancelled, setCancelledCursor, setLoadingCancelled)
            }
          />
        </>
      )}
    </div>
  );
}

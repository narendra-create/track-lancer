"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle, X, ChevronRight, Archive, ArchiveRestore } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type {
  AllProject,
  GetAllProjectsResponse,
  AllProjectStatus,
} from "@/types/allprojects";
import { SECTION_ORDER } from "@/types/allprojects";
import { useToast } from "@/app/components/ToastProvider";

// ─── PROPS ────────────────────────────────────────────────────────────────────

interface FreelancerAllProjectsProps {
  initialProjects: AllProject[];
  initialNextCursor: string | null;
  loadMore: (cursor: string) => Promise<GetAllProjectsResponse>;
  handleDelete: (
    id: string,
  ) => Promise<{ success: boolean; error?: string } | void>;
  onArchive?: (id: string) => Promise<any> | void;
  isArchivedPage?: boolean;
}

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, { dot: string; text: string; bg: string }> =
  {
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
    COMPLETED: {
      dot: "bg-[var(--color-dash-green)]",
      text: "text-[var(--color-dash-green)]",
      bg: "bg-[var(--color-dash-green-bg)]",
    },
  };

const SECTION_ACCENT: Record<AllProjectStatus, string> = {
  ACTIVE: "bg-[var(--color-dash-green)]",
  STOPPED: "bg-[var(--color-dash-amber)]",
  CANCELLED: "bg-[var(--color-dash-red)]",
  COMPLETED: "bg-[var(--color-dash-green)]",
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

// ─── DELETE MODAL ─────────────────────────────────────────────────────────────

function DeleteModal({
  onConfirm,
  onCancel,
  loading,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

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
          <AlertTriangle
            size={16}
            className="text-[var(--color-status-danger-text)]"
          />
        </div>
        <p className="font-serif text-[18px] text-white mb-1">
          Delete Project?
        </p>
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
  onArchive,
  onArchiveSuccess,
  isArchivedPage,
}: {
  project: AllProject;
  index: number;
  onDelete?: (id: string) => void;
  onArchive?: (id: string) => Promise<any> | void;
  onArchiveSuccess?: (id: string) => void;
  isArchivedPage?: boolean;
}) {
  const router = useRouter();
  const { addToast } = useToast();
  const [isArchiving, setIsArchiving] = useState(false);
  const style = STATUS_STYLE[project.status] ?? STATUS_STYLE.ACTIVE;
  const { totalMilestones, completedMilestones, progress, projectDeadline } =
    project.stats;

  const formattedDeadline = projectDeadline
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(projectDeadline))
    : null;

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-no-nav]")) return;
    if (isArchivedPage) {
      addToast({ title: "Warning", message: "You need to unarchive in order to view milestones", type: "warning" });
      return;
    }
    router.push(`/freelancer/milestones/${project.id}`);
  };

  const handleArchiveClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onArchive) return;
    setIsArchiving(true);
    try {
      const result = await onArchive(project.id);
      if (result && !result.success) {
        addToast({ title: "Error", message: result.error || "Failed to update project", type: "error" });
      } else if (onArchiveSuccess) {
        onArchiveSuccess(project.id);
      }
    } catch (err: any) {
      addToast({ title: "Error", message: err.message || "An unexpected error occurred", type: "error" });
    } finally {
      setIsArchiving(false);
    }
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
          <div className="flex items-center gap-2.5 lg:gap-3 mb-1.5">
            <span
              className={`w-[7px] h-[7px] rounded-full shrink-0 ${style.dot}`}
            />
            <h3 className="font-serif text-[15px] lg:text-[19px] text-white leading-snug truncate">
              {project.title}
            </h3>
          </div>

          <p className="font-serif py-1 text-[10px] lg:text-[12px] tracking-[1px] text-dash-ink2/80 font-semibold truncate">
            {project.client.user.name}
            {project.client.email && (
              <span className="text-dash-ink3/90">
                {" "}
                · {project.client.email}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {project.hasCancelRequest && (
            <span
              className="font-mono text-[9px] lg:text-[11px] font-bold tracking-[1px] uppercase px-2 py-0.75 rounded-md border border-[var(--color-dash-red)] text-[var(--color-dash-red)]"
              title="Cancel Request Pending"
            >
              Cancel Req
            </span>
          )}
          <span
            className={`font-mono text-[9px] lg:text-[11px] font-bold tracking-[1.5px] uppercase px-3 py-0.75 rounded-md ${style.bg} ${style.text}`}
          >
            {project.status}
          </span>

          {project.status === "CANCELLED" && onDelete && (
            <button
              data-no-nav=""
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
              }}
              className="p-1.5 rounded-md border border-transparent text-[var(--color-dash-ink4)] hover:text-[var(--color-dash-red)] hover:border-[var(--color-status-danger-border)] hover:bg-[var(--color-status-danger-bg)] transition-all duration-150"
            >
              <Trash2 size={13} />
            </button>
          )}
          {/* ARCHIVE BUTTON */}
          {onArchive && (
            <button
              data-no-nav=""
              onClick={handleArchiveClick}
              disabled={isArchiving}
              className="p-1.5 rounded-md border border-[#2a3441] bg-[#1c232d] text-[#8b9ebb] hover:text-[#d1dff5] hover:bg-[#252f3e] hover:border-[#3a4759] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[28px] min-h-[28px]"
              title={isArchivedPage ? "Unarchive Project" : "Archive Project"}
            >
              {isArchiving ? (
                <span className="w-3.5 h-3.5 border-2 border-[#8b9ebb] border-t-transparent rounded-full animate-spin" />
              ) : isArchivedPage ? (
                <ArchiveRestore size={13} />
              ) : (
                <Archive size={13} />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <p className="font-sans text-[9px] tracking-[1.5px] uppercase text-dash-ink2/70 font-semibold mb-0.5">
            Value
          </p>
          <p className="font-mono text-[14px] lg:text-[17px] font-semibold text-[var(--color-dash-ink)]">
            ₹{project.money.totalAmount.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="font-sans text-[9px] tracking-[1.5px] uppercase text-dash-ink2/70 font-semibold mb-0.5">
            Received
          </p>
          <p className="font-mono text-[14px] lg:text-[17px] font-semibold text-[var(--color-dash-green)]">
            ₹{project.money.received.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="font-sans text-[9px] tracking-[1.5px] uppercase text-dash-ink2/70 font-semibold mb-0.5">
            Remaining
          </p>
          <p className="font-mono text-[14px] lg:text-[17px] font-semibold text-[var(--color-dash-amber)]">
            ₹{project.money.remaining.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between items-center mb-1.5">
          <span className="font-mono text-[9px] lg:text-[11px] pt-3 tracking-[1px] uppercase text-dash-ink2/60 font-bold">
            {completedMilestones}/{totalMilestones} milestones
          </span>

          <span className="font-mono text-[9px] lg:text-[11px] text-dash-ink2/80 font-semibold">
            {progress}%
          </span>
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
          <span className="font-sans font-semibold text-[10px] lg:text-[12px] tracking-[0.5px] text-dash-red text-shadow-dash-red">
            Deadline:
            <span className="text-dash-ink2/70 font-mono pl-1">
              {formattedDeadline}
            </span>
          </span>
        ) : (
          <span />
        )}

        <ChevronRight
          size={15}
          className="text-dash-ink3 group-hover:text-dash-ink group-hover:translate-x-0.5 transition-all duration-150"
        />
      </div>
    </motion.div>
  );
}

// ─── SECTION BLOCK ────────────────────────────────────────────────────────────

function SectionBlock({
  status,
  projects,
  onDelete,
  onArchive,
  onArchiveSuccess,
  isArchivedPage,
}: {
  status: AllProjectStatus;
  projects: AllProject[];
  onDelete?: (id: string) => void;
  onArchive?: (id: string) => Promise<any> | void;
  onArchiveSuccess?: (id: string) => void;
  isArchivedPage?: boolean;
}) {
  if (projects.length === 0) return null;
  const label = status.charAt(0) + status.slice(1).toLowerCase();

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-5">
        <span
          className={`w-[6px] h-[6px] rounded-full shrink-0 ${SECTION_ACCENT[status]}`}
        />
        <h2 className="font-serif text-[18px] text-white">{label}</h2>
        <span className="font-mono text-[10px] tracking-[2px] text-[var(--color-dash-ink4)]">
          {projects.length}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} onDelete={onDelete} onArchive={onArchive} onArchiveSuccess={onArchiveSuccess} isArchivedPage={isArchivedPage} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export function FreelancerAllProjects({
  initialProjects,
  initialNextCursor,
  loadMore,
  handleDelete,
  onArchive,
  isArchivedPage,
}: FreelancerAllProjectsProps) {
  const { addToast } = useToast();
  const [projects, setProjects] = useState<AllProject[]>(initialProjects);
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialNextCursor,
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleArchiveSuccess = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const grouped = SECTION_ORDER.reduce<Record<string, AllProject[]>>(
    (acc, status) => {
      acc[status] = projects.filter((p) => p.status === status);
      return acc;
    },
    {},
  );

  const onLoadMore = async () => {
    if (!nextCursor) return;
    setLoadingMore(true);
    const result = await loadMore(nextCursor);
    setLoadingMore(false);
    if (result.success) {
      setProjects((prev) => [...prev, ...result.projects]);
      setNextCursor(result.nextCursor);
    } else {
      addToast({
        title: "Failed to load",
        message: result.error,
        type: "error",
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    const result = await handleDelete(deleteTargetId);
    setDeleting(false);
    if (!result) {
      setDeleteTargetId(null);
      return;
    }
    if (result.success) {
      setProjects((prev) => prev.filter((p) => p.id !== deleteTargetId));
      addToast({
        title: "Deleted",
        message: "Project removed successfully.",
        type: "success",
      });
    } else {
      addToast({
        title: "Delete failed",
        message: result.error ?? "Something went wrong.",
        type: "error",
      });
    }
    setDeleteTargetId(null);
  };

  const total = projects.length;

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
          {total} project{total !== 1 ? "s" : ""} total
        </p>
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
              onDelete={
                status === "CANCELLED"
                  ? (id) => setDeleteTargetId(id)
                  : undefined
              }
              onArchive={onArchive}
              onArchiveSuccess={handleArchiveSuccess}
              isArchivedPage={isArchivedPage}
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

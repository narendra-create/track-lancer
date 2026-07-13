"use client";

import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, AlertTriangle, ExternalLink } from "lucide-react";
import { useState } from "react";
import { AvatarInitials } from "@/app/components/Initials";
import { ClientProgressBar } from "@/app/components/Currentclientprogressbar";
import { redirect } from "next/navigation";
import Link from "next/link";

type ProjectStatus =
  | "ACTIVE"
  | "PENDING"
  | "STOPPED"
  | "CANCELLED"
  | "COMPLETED";

type MilestoneStatus = "COMPLETED" | "NOT_STARTED" | "IN_PROGRESS" | "STOPPED";

type Milestone = {
  id: string;
  title: string;
  milestonecost: number;
  status: MilestoneStatus;
  position: number;
};

export type ClientDashboardProject = {
  id: string;
  title: string;
  projectcode: string;
  status: ProjectStatus;
  agreedCost: number;
  deadline: string;
  freelancerName: string;
  freelancerInitials: string;
  freelancerCategory: string;
  paid: number;
  remaining: number;
  milestones: Milestone[];
};

const STATUS_STYLE: Record<
  ProjectStatus,
  { dot: string; text: string; bg: string }
> = {
  ACTIVE: {
    dot: "bg-dash-green",
    text: "text-dash-green",
    bg: "bg-dash-green-bg",
  },
  PENDING: {
    dot: "bg-dash-gold",
    text: "text-dash-gold",
    bg: "bg-dash-gold-glow2",
  },
  STOPPED: {
    dot: "bg-dash-amber",
    text: "text-dash-amber",
    bg: "bg-dash-amber-bg",
  },
  CANCELLED: {
    dot: "bg-dash-red",
    text: "text-dash-red",
    bg: "bg-dash-red-bg",
  },
  COMPLETED: {
    dot: "bg-dash-green",
    text: "text-dash-green",
    bg: "bg-dash-green-bg",
  },
};

const MILESTONE_DOT: Record<MilestoneStatus, string> = {
  COMPLETED: "bg-dash-green",
  IN_PROGRESS: "bg-dash-gold",
  NOT_STARTED: "bg-[var(--color-dash-surface3)]",
  STOPPED: "bg-dash-red",
};

function MilestoneRow({
  milestone,
  index,
}: {
  milestone: Milestone;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.16, delay: index * 0.04 }}
      className="flex items-center gap-3 py-[9px] border-b border-dash-border last:border-b-0"
    >
      <div
        className={`w-[6px] h-[6px] rounded-full shrink-0 ${MILESTONE_DOT[milestone.status]}`}
      />
      <span className="flex-1 font-sans text-[12px] lg:text-[14px] text-dash-ink2 truncate">
        {milestone.title}
      </span>
      <span className="font-mono text-[10px] lg:text-[12px] text-dash-ink3 shrink-0">
        ₹{milestone.milestonecost.toLocaleString("en-IN")}
      </span>
    </motion.div>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: ClientDashboardProject;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const style = STATUS_STYLE[project.status];
  const totalMilestones = project.milestones.length;
  const completedMilestones = project.milestones.filter(
    (m) => m.status === "COMPLETED",
  ).length;
  const progress =
    totalMilestones > 0
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : 0;

  const formattedDeadline = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(project.deadline));

  const isOverdue =
    project.status === "ACTIVE" && new Date(project.deadline) < new Date();
  const progressVariant =
    project.status === "STOPPED" ? "amber" : progress >= 50 ? "green" : "gold";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.06 }}
      className="bg-dash-surface1 border border-dash-border rounded-md overflow-hidden hover:border-brand-surface transition-all ease-in-out duration-200"
    >
      <div
        className="p-5 lg:p-4 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex justify-between mb-3 gap-2">
          <div className="flex gap-3 items-start min-w-0">
            <div className="mt-1 shrink-0">
              <AvatarInitials
                initials={project.freelancerInitials}
                variant="gold"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-[15px] lg:text-[19px] text-gray-300 text-shadow-2xs text-shadow-accent truncate">
                  {project.title}
                </h3>
                {isOverdue && (
                  <AlertTriangle size={13} className="text-dash-red shrink-0" />
                )}
              </div>
              <p className="font-serif py-1 text-[10px] lg:text-[12px] tracking-[1px] text-dash-ink2/80 font-semibold truncate">
                {project.freelancerName}
                <span className="text-dash-ink3/90">
                  {" "}
                  · {project.freelancerCategory.replace("_", " ")}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`font-mono text-[9px] lg:text-[11px] font-bold tracking-[1.5px] uppercase px-3 py-0.5 rounded-full flex items-center gap-1.5 ${style.bg} ${style.text}`}
            >
              <span className="text-lg font-bold">•</span>
              {project.status}
            </span>
            <ChevronRight
              size={14}
              className={`text-dash-ink4 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
            />
          </div>
        </div>

        <div className="flex justify-evenly my-3">
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-lg lg:text-xl text-accent font-serif">
              ₹{(project.agreedCost / 1000).toFixed(0)}K
            </h3>
            <p className="text-sm lg:text-[11px] text-ink-muted font-sans">
              BUDGET
            </p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-lg lg:text-xl text-dash-green font-serif">
              ₹{(project.paid / 1000).toFixed(0)}K
            </h3>
            <p className="text-sm lg:text-[11px] text-ink-muted font-sans">
              PAID
            </p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-lg lg:text-xl text-dash-amber font-serif">
              ₹{(project.remaining / 1000).toFixed(0)}K
            </h3>
            <p className="text-sm lg:text-[11px] text-ink-muted font-sans">
              DUE
            </p>
          </div>
        </div>

        <div className="mt-1.5">
          <ClientProgressBar
            dueDate={formattedDeadline}
            milestonesCompleted={completedMilestones}
            progress={progress}
            totalMilestones={totalMilestones}
            variant={progressVariant}
          />
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-dash-border px-5 pb-4">
              <div className="flex justify-between items-center pt-3 mb-1">
                <p className="font-mono text-[9px] lg:text-[11px] uppercase tracking-[2px] text-dash-ink4">
                  Milestones
                </p>
                <Link
                  href={`/client/milestones/${project.id}`}
                  className="text-[10px] text-dash-ink3 hover:text-white flex items-center gap-1.5 transition-colors group"
                >
                  Manage{" "}
                  <ExternalLink
                    size={10}
                    className="group-hover:text-dash-amber transition-colors"
                  />
                </Link>
              </div>
              {project.milestones
                .sort((a, b) => a.position - b.position)
                .slice(0, 3)
                .map((m, i) => (
                  <MilestoneRow key={m.id} milestone={m} index={i} />
                ))}
              {project.milestones.length > 3 && (
                <div className="mt-3 flex justify-center">
                  <Link
                    href={`/client/milestones/${project.id}`}
                    className="text-[10px] lg:text-[12px] font-mono uppercase tracking-[1px] text-dash-ink2 font-bold hover:text-white transition-colors duration-200 bg-dash-surface3 hover:bg-dash-surface1 px-4 py-1.5 rounded-md border border-dash-border"
                  >
                    View all {project.milestones.length} milestones
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ClientActiveProjects({
  projects: initialProjects,
  nextCursor: initialNextCursor,
  loadMore,
}: {
  projects: ClientDashboardProject[];
  nextCursor?: string | null;
  loadMore?: (cursor: string) => Promise<{ projects: ClientDashboardProject[], nextCursor: string | null }>;
}) {
  const [projects, setProjects] = useState<ClientDashboardProject[]>(initialProjects);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor || null);
  const [loading, setLoading] = useState(false);

  const handleLoadMore = async () => {
    if (!nextCursor || !loadMore) return;
    setLoading(true);
    try {
      const result = await loadMore(nextCursor);
      if (result) {
        setProjects((prev) => [...prev, ...result.projects]);
        setNextCursor(result.nextCursor);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full">
      <div className="flex justify-between pr-4 pl-2 mb-3 items-center">
        <h3 className="text-md lg:text-lg font-serif text-ink flex items-center">
          Active Projects
        </h3>
        <h4
          onClick={() => redirect("/client/all-projects")}
          className="text-ink text-[11px] lg:text-[13px] flex items-center cursor-pointer hover:text-dash-ink2 transition-colors"
        >
          View all →
        </h4>
      </div>
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
      {nextCursor && loadMore && (
        <div className="flex justify-center mt-4 mb-2">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="group flex items-center gap-2 px-6 py-2.5 border border-[var(--color-dash-border)] bg-[var(--color-dash-surface1)] text-[var(--color-dash-ink3)] font-sans text-[13px] rounded-full transition-all duration-200 hover:border-[var(--color-dash-border-hover)] hover:text-[var(--color-dash-ink)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span
              className={`transition-transform duration-200 ${
                loading ? "animate-spin" : "group-hover:translate-y-0.5"
              }`}
            >
              {loading ? "◌" : "↓"}
            </span>
            {loading ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  ArrowLeft,
  Flag,
  X,
  Check,
  Clock,
  Zap,
  CircleDot,
  Ban,
  TrendingUp,
  Calendar,
  DollarSign,
  OctagonX,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { MilestoneItem, ProjectWithMilestones } from "@/types/milestones";
import {
  Projectstatus,
  type Milestonestatus,
} from "@/app/generated/prisma/enums";
import type {
  createMilestoneInput,
  delayMilestoneInput,
} from "@/app/lib/validations/MilestoneValidation";
import { MilestoneCard } from "@/app/components/Cards/MilestoneCard";
import { formatDate } from "@/app/lib/utilitys";
import { AddMilestoneModal } from "@/app/components/freelancer/AddMilestoneModal";
import { useToast } from "@/app/components/ToastProvider";
import { RaiseBudgetForm } from "./RaiseBudgetForm";
import { createBudgetInput } from "../../lib/validations/Budgetrequest";

const STATUS_CONFIG: Record<
  Milestonestatus,
  {
    label: string;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
    dotColor: string;
  }
> = {
  COMPLETED: {
    label: "COMPLETED",
    dotColor: "bg-[var(--color-dash-green)]",
    badgeBg: "bg-[var(--color-status-paid-bg)]",
    badgeBorder: "border-[var(--color-status-paid-border)]",
    badgeText: "text-dash-green",
  },

  IN_PROGRESS: {
    label: "IN PROGRESS",
    dotColor: "bg-[var(--color-dash-amber)]",
    badgeBg: "bg-[var(--color-dash-amber-bg)]",
    badgeBorder: "border-[rgba(200,120,64,0.3)]",
    badgeText: "text-[var(--color-dash-amber)]",
  },
  NOT_STARTED: {
    label: "NOT STARTED",
    dotColor: "bg-[var(--color-dash-border-hover)]",
    badgeBg: "bg-dash-surface3",
    badgeBorder: "border-border",
    badgeText: "text-dash-ink2",
  },
  STOPPED: {
    label: "STOPPED",
    dotColor: "bg-[var(--color-dash-red)]",
    badgeBg: "bg-[var(--color-status-danger-bg)]",
    badgeBorder: "border-[var(--color-status-danger-border)]",
    badgeText: "text-[var(--color-status-danger-text)]",
  },
};

const STATUS_ICON: Record<Milestonestatus, React.ReactNode> = {
  COMPLETED: <Check size={9} strokeWidth={2.5} />,
  IN_PROGRESS: <Zap size={9} strokeWidth={2.5} />,
  NOT_STARTED: <CircleDot size={9} strokeWidth={2.5} />,
  STOPPED: <Ban size={9} strokeWidth={2.5} />,
};

function FlagDelayModal({
  milestoneId,
  onClose,
  handleDelay,
}: {
  milestoneId: string;
  onClose: () => void;
  handleDelay: (data: delayMilestoneInput) => Promise<any>;
}) {
  const [reason, setReason] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deadline) {
      addToast({
        title: "Error",
        message: "Please select a new deadline",
        type: "error",
      });
      return;
    }

    setLoading(true);
    const result = await handleDelay({
      milestoneId,
      delayReason: reason,
      newDeadline: new Date(deadline),
    });
    setLoading(false);

    if (result?.error) {
      addToast({ title: "Error", message: result.error, type: "error" });
    } else {
      addToast({
        title: "Success",
        message: "Delay flagged successfully",
        type: "success",
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.18 }}
        className="bg-[var(--color-dash-surface1)] border border-[var(--color-dash-border)] rounded-xl p-7 max-w-sm w-full shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--color-dash-ink3)] hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <div className="mb-6">
          <div className="w-10 h-10 rounded-full bg-[var(--color-dash-amber-bg)] border border-[rgba(200,120,64,0.25)] flex items-center justify-center mb-4">
            <Flag size={16} className="text-[var(--color-dash-amber)]" />
          </div>
          <h2 className="font-serif text-xl text-white mb-1">Flag a Delay</h2>
          <p className="font-mono text-[10px] tracking-[2px] uppercase text-[var(--color-dash-ink3)]">
            Notify the client
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)]">
              Reason for delay
            </label>
            <textarea
              rows={3}
              placeholder="Describe what caused the delay..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full bg-[var(--color-dash-surface2)] border border-[var(--color-dash-border)] rounded-md px-4 py-3 font-sans text-[13px] text-white placeholder:text-[var(--color-dash-ink4)] focus:outline-none focus:border-[var(--color-dash-amber)] duration-200 resize-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)]">
              New Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              className="w-full bg-[var(--color-dash-surface2)] border border-[var(--color-dash-border)] rounded-md px-4 py-3 font-sans text-[13px] text-white focus:outline-none focus:border-[var(--color-dash-amber)] duration-200"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[var(--color-dash-amber-bg)] border border-[rgba(200,120,64,0.3)] rounded-md text-[var(--color-dash-amber)] font-mono text-[11px] uppercase tracking-[1.5px] hover:bg-[rgba(200,120,64,0.15)] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Flagging..." : "Send Flag →"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function StopProjectModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleStop = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.18 }}
        className="bg-[var(--color-dash-surface1)] border border-[var(--color-dash-border)] rounded-xl p-7 max-w-sm w-full shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--color-dash-ink3)] hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <div className="mb-6">
          <div className="w-10 h-10 rounded-full bg-[var(--color-dash-red-bg)] border border-[rgba(192,96,96,0.25)] flex items-center justify-center mb-4">
            <OctagonX size={16} className="text-[var(--color-dash-red)]" />
          </div>
          <h2 className="font-serif text-xl text-white mb-1">Stop Project</h2>
          <p className="font-mono text-[10px] tracking-[2px] uppercase text-[var(--color-dash-ink3)]">
            This action cannot be undone
          </p>
        </div>

        <p className="font-sans text-[13px] text-[var(--color-dash-ink3)] leading-relaxed mb-6">
          Stopping the project will freeze all pending milestones. The
          freelancer will be notified immediately.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-transparent border border-[var(--color-dash-border)] rounded-md text-[var(--color-dash-ink3)] font-mono text-[11px] uppercase tracking-[1.5px] hover:bg-[var(--color-dash-surface2)] transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleStop}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-[var(--color-dash-red-bg)] border border-[rgba(192,96,96,0.3)] rounded-md text-[var(--color-dash-red)] font-mono text-[11px] uppercase tracking-[1.5px] hover:bg-[rgba(192,96,96,0.15)] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <OctagonX size={12} />
            {loading ? "Stopping..." : "Stop Project"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: string;
  color?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--color-dash-surface1)] border border-[var(--color-dash-border)] rounded-xl p-5 flex flex-col gap-3 hover:border-[var(--color-dash-border-hover)] transition-colors duration-200">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[9px] tracking-[2px] uppercase text-dash-ink2/60 font-semibold">
          {label}
        </p>
        <span className="text-dash-ink2">{icon}</span>
      </div>
      <p
        className={`font-serif text-[22px] ${color ?? "text-[var(--color-dash-ink)]"}`}
      >
        {value}
      </p>
    </div>
  );
}

interface FreelancerMilestonesProps {
  project: ProjectWithMilestones;
  projectTitle: string;
  projectStatus: string;
  role: "CLIENT" | "FREELANCER";
  onCreate?: (data: createMilestoneInput) => Promise<any>;
  onDelete?: (milestoneId: string, projectId: string) => Promise<any>;
  onCompleteMilestone?: (milestoneId: string, projectId: string) => Promise<any>;
  onDelayMilestone?: (
    data: delayMilestoneInput,
    projectId: string,
  ) => Promise<any>;
  onBudgetRaiseRequest?: (
    data: createBudgetInput,
    projectId: string,
  ) => Promise<any>;
}

export function FreelancerMilestones({
  project,
  projectTitle,
  projectStatus,
  onCreate,
  role,
  onDelete,
  onCompleteMilestone,
  onDelayMilestone,
  onBudgetRaiseRequest,
}: FreelancerMilestonesProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState<string | null>(null);
  const [showStopModal, setShowStopModal] = useState(false);
  const [showBudgetrequestModal, setshowBudgetrequestModal] = useState(false);
  const { addToast } = useToast();
  const router = useRouter();

  const totalEarned =
    project.payments?.reduce((acc, p) => acc + (p.paid_amount || 0), 0) ?? 0;

  const totalCost = project.agreedCost;
  const remaining = totalCost - totalEarned;

  const costUsed = project.milestones.reduce(
    (acc, m) => acc + (m.milestonecost || 0),
    0,
  );
  const costUsedPct =
    totalCost > 0 ? Math.round((costUsed / totalCost) * 100) : 0;

  const completedCount = project.milestones.filter(
    (m) => m.status === "COMPLETED",
  ).length;
  const inProgressCount = project.milestones.filter(
    (m) => m.status === "IN_PROGRESS",
  ).length;

  const notStartedCount = project.milestones.filter(
    (m) => m.status === "NOT_STARTED",
  ).length;
  const stoppedCount = project.milestones.filter(
    (m) => m.status === "STOPPED",
  ).length;

  const isOverdue = new Date(project.deadline).getTime() < Date.now();

  return (
    <div className="w-full min-h-screen bg-[var(--color-dash-bg)] px-4 py-6 lg:px-8 lg:py-8">
      <AnimatePresence>
        {showAddModal && (
          <AddMilestoneModal
            key="add"
            productId={project.id}
            remainingLimit={totalCost - costUsed}
            totalBudget={totalCost}
            onClose={() => setShowAddModal(false)}
            handleSubmit={async (data) => {
              if (!onCreate) return;
              const result = await onCreate(data);
              if (result?.error) {
                addToast({
                  title: "Error",
                  message: result.error,
                  type: "error",
                });
              } else {
                addToast({
                  title: "Success",
                  message: "Milestone added successfully",
                  type: "success",
                });
                setShowAddModal(false);
              }
            }}
          />
        )}
        {showFlagModal && onDelayMilestone && (
          <FlagDelayModal
            key="flag"
            milestoneId={showFlagModal}
            handleDelay={(data) => onDelayMilestone(data, project.id)}
            onClose={() => setShowFlagModal(null)}
          />
        )}
        {showStopModal && (
          <StopProjectModal
            key="stop"
            onClose={() => setShowStopModal(false)}
          />
        )}
        {showBudgetrequestModal && (
          <RaiseBudgetForm
            currentBudget={project.agreedCost}
            onClose={() => setshowBudgetrequestModal(false)}
            onSubmit={onBudgetRaiseRequest}
            projectId={project.id}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="font-serif text-[24px] lg:text-[30px] text-white leading-tight mb-1">
            {projectTitle}
          </h1>
          <p className="font-mono text-[10px] tracking-[2px] uppercase text-[var(--color-dash-ink3)]">
            STATUS: {projectStatus} · Since {formatDate(project.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 mt-1">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-transparent border border-[var(--color-dash-border)] rounded-md text-white font-mono text-[10px] lg:text-[16px] uppercase tracking-[1.5px] hover:bg-[var(--color-dash-surface2)] hover:border-[var(--color-dash-border-hover)] transition-all duration-200 flex items-center gap-2"
          >
            <ArrowLeft size={13} />
            Back
          </button>
          {role === "FREELANCER" && (
            <button
              onClick={() => {
                if (costUsed >= totalCost) {
                  addToast({
                    title: "Budget Reached",
                    message: "Cannot create milestone because the budget is full.",
                    type: "error",
                  });
                  return;
                }
                setShowAddModal(true);
              }}
              className={`px-4 py-2 lg:text-[16px] bg-transparent border border-[var(--color-dash-border-hover)] rounded-md text-white font-mono text-[10px] uppercase tracking-[1.5px] transition-all duration-200 flex items-center gap-2 ${
                costUsed >= totalCost 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:bg-[var(--color-dash-surface2)]"
              }`}
            >
              <Plus size={13} />
              Milestone
            </button>
          )}
        </div>
      </motion.div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* side-analytics */}
        <div className="flex flex-col pt-1.5 gap-6 xl:w-[340px] xl:shrink-0">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: 0.05 }}
            className="bg-[var(--color-dash-surface1)] border border-[var(--color-dash-border)] rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-[9px] font-bold lg:text-[14px] tracking-[2px] uppercase text-dash-ink">
                Cost Used
              </p>
              <span className="font-serif font-semibold text-[13px] lg:text-[16px] text-[var(--color-dash-green)]">
                {costUsedPct}%
              </span>
            </div>
            <div className="h-[6px] bg-[var(--color-dash-surface2)] rounded-full overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${costUsedPct}%` }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="h-full bg-[var(--color-dash-green)] rounded-full"
              />
            </div>
            <div className="flex justify-between font-mono text-[9px] lg:text-[10px] tracking-[1px] text-dash-ink2/90">
              <span>₹{costUsed.toLocaleString("en-IN")} used</span>
              <span>₹{totalCost.toLocaleString("en-IN")} total</span>
            </div>
            {costUsed >= totalCost && (
              <div className="mt-4 pt-4 border-t border-[var(--color-dash-border)] flex flex-col gap-3">
                <p className="font-sans text-[12px] text-[var(--color-dash-amber)] leading-relaxed">
                  {role === "FREELANCER"
                    ? "You used your cost - you need budget raise request to raise the cost."
                    : "budget limit riched - see budget raise requests"}
                </p>
                {role === "FREELANCER" ? (
                  <button
                    onClick={() => setshowBudgetrequestModal(true)}
                    className="w-full py-2 bg-[var(--color-dash-amber-bg)] border border-[rgba(200,120,64,0.3)] rounded-md text-[var(--color-dash-amber)] font-mono text-[10px] uppercase tracking-[1px] hover:bg-[rgba(200,120,64,0.15)] transition-all duration-200"
                  >
                    Raise Budget
                  </button>
                ) : (
                  <button onClick={() => router.push(`/${role.toLowerCase()}/Budget-requests?projectId=${project.id}`)} className="w-full py-2 bg-[var(--color-dash-amber-bg)] border border-[rgba(200,120,64,0.3)] rounded-md text-[var(--color-dash-amber)] font-mono text-[10px] uppercase tracking-[1px] hover:bg-[rgba(200,120,64,0.15)] transition-all duration-200">
                    See Budget Requests
                  </button>
                )}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: 0.08 }}
            className="grid grid-cols-2 gap-3"
          >
            <StatCard
              label="Project Value"
              value={`₹${project.agreedCost.toLocaleString("en-IN")}`}
              icon={<DollarSign size={14} />}
            />
            <StatCard
              label="Earned"
              value={`₹${totalEarned.toLocaleString("en-IN")}`}
              color="text-[var(--color-dash-green)]"
              icon={<TrendingUp size={14} />}
            />
            <StatCard
              label="Remaining"
              value={`₹${remaining.toLocaleString("en-IN")}`}
              icon={<DollarSign size={14} />}
            />
            <StatCard
              label="Deadline"
              value={formatDate(project.deadline, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              color={
                isOverdue
                  ? "text-[var(--color-dash-red)]"
                  : "text-[var(--color-dash-ink)]"
              }
              icon={<Calendar size={14} />}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: 0.11 }}
            className="bg-[var(--color-dash-surface1)] border border-[var(--color-dash-border)] rounded-xl p-5"
          >
            <p className="font-mono text-[9px] tracking-[2px] uppercase text-dash-ink2/90 font-semibold mb-4">
              Breakdown
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                {
                  status: "COMPLETED" as Milestonestatus,
                  count: completedCount,
                },
                {
                  status: "IN_PROGRESS" as Milestonestatus,
                  count: inProgressCount,
                },

                {
                  status: "NOT_STARTED" as Milestonestatus,
                  count: notStartedCount,
                },
                { status: "STOPPED" as Milestonestatus, count: stoppedCount },
              ].map(({ status, count }) => {
                const cfg = STATUS_CONFIG[status];
                return (
                  <div
                    key={status}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-[3px] rounded-sm border font-mono text-[9px] lg:text-[10px] font-bold tracking-[1.5px] uppercase ${cfg.badgeBg} ${cfg.badgeBorder} ${cfg.badgeText}`}
                      >
                        {STATUS_ICON[status]}
                        {cfg.label}
                      </span>
                    </div>
                    <span className="font-serif text-[14px] text-[var(--color-dash-ink2)]">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {role === "FREELANCER" ? (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: 0.14 }}
              onClick={() => {
                const inProgress = project.milestones.find(
                  (m) => m.status === "IN_PROGRESS",
                );
                if (inProgress) {
                  setShowFlagModal(inProgress.id);
                } else {
                  addToast({
                    title: "Error",
                    message: "No active milestone in progress to flag",
                    type: "error",
                  });
                }
              }}
              className="w-full h-[42px] px-5 bg-transparent border border-[var(--color-dash-border-hover)] rounded-xl text-white font-mono text-[10px] uppercase tracking-[1.5px] hover:bg-[var(--color-dash-amber-bg)] hover:border-[rgba(200,120,64,0.35)] hover:text-[var(--color-dash-amber)] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Flag size={12} />
              Flag a Delay
            </motion.button>
          ) : (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: 0.14 }}
              onClick={() => setShowStopModal(true)}
              className="w-full h-[42px] px-5 bg-transparent border border-[var(--color-dash-border-hover)] rounded-xl text-white font-mono text-[10px] uppercase tracking-[1.5px] hover:bg-[var(--color-dash-red-bg)] hover:border-[rgba(192,96,96,0.35)] hover:text-[var(--color-dash-red)] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <OctagonX size={12} />
              Stop Project
            </motion.button>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="flex-1 min-w-0"
        >
          <div className="flex items-center justify-between mb-5">
            <p className="font-mono font-bold text-[10px] lg:text-[13px] tracking-[2px] uppercase text-dash-ink2">
              Milestone Thread
            </p>
            <span className="font-mono text-[9px] lg:text-[11px] tracking-[1px] text-dash-ink2">
              {project.milestones.length} milestones
            </span>
          </div>
          <div className="w-full h-px bg-[var(--color-dash-border)] mb-6" />

          {project.milestones.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 rounded-full bg-[var(--color-dash-surface1)] border border-[var(--color-dash-border)] flex items-center justify-center">
                <Plus size={18} className="text-[var(--color-dash-ink4)]" />
              </div>
              <p className="font-mono text-[10px] font-bold tracking-[2px] uppercase text-dash-ink">
                No milestones yet
              </p>
            </div>
          ) : (
            <div>
              {project.milestones.map((milestone, idx) => (
                <MilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                  index={idx}
                  isLast={idx === project.milestones.length - 1}
                  role={role}
                  onDelete={
                    onDelete
                      ? async (milestoneId) => {
                          const result = await onDelete(
                            milestoneId,
                            project.id,
                          );
                          if (result?.error) {
                            addToast({
                              title: "Error",
                              message: result.error,
                              type: "error",
                            });
                          } else {
                            addToast({
                              title: "Success",
                              message: "Milestone deleted successfully",
                              type: "success",
                            });
                          }
                        }
                      : undefined
                  }
                  onComplete={
                    onCompleteMilestone
                      ? async (milestoneId) => {
                          const result = await onCompleteMilestone(
                            milestoneId,
                            project.id,
                          );
                          if (result?.error) {
                            addToast({
                              title: "Error",
                              message: result.error,
                              type: "error",
                            });
                          } else {
                            addToast({
                              title: "Success",
                              message: "Milestone marked as completed",
                              type: "success",
                            });
                          }
                        }
                      : undefined
                  }
                />
              ))}
              <div className="flex gap-0">
                <div className="flex flex-col items-center mr-5 shrink-0">
                  <div className="w-[10px] h-[10px] rounded-full border-2 border-[var(--color-dash-border)] bg-[var(--color-dash-surface2)]" />
                </div>
                <p className="font-mono text-[10px] tracking-[2px] uppercase text-[var(--color-dash-ink4)] pb-4 mt-[1px]">
                  End of thread
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
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
  Play,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { ProjectWithMilestones } from "@/types/milestones";
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
import { createBudgetInput } from "@/app/lib/validations/Budgetrequest";

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
  currentDeadline,
}: {
  milestoneId: string;
  onClose: () => void;
  handleDelay: (data: delayMilestoneInput) => Promise<any>;
  currentDeadline: Date | string;
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
  const baseDate = new Date(currentDeadline);
  baseDate.setDate(baseDate.getDate() + 1);
  baseDate.setMinutes(baseDate.getMinutes() - baseDate.getTimezoneOffset());
  const minDate = baseDate.toISOString().slice(0, 10);

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
              min={minDate}
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

function StopProjectModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => Promise<any>;
}) {
  const [loading, setLoading] = useState(false);

  const handleStop = async () => {
    setLoading(true);
    await onConfirm();
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

function CancelProjectModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    await onConfirm();
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
          <h2 className="font-serif text-xl text-white mb-1">Cancel Project</h2>
          <p className="font-mono text-[10px] tracking-[2px] uppercase text-[var(--color-dash-ink3)]">
            This action cannot be undone
          </p>
        </div>

        <p className="font-sans text-[13px] text-[var(--color-dash-ink3)] leading-relaxed mb-6">
          Canceling the project will permanently close it. You will not be able
          to add new milestones or request payments.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-transparent border border-[var(--color-dash-border)] rounded-md text-[var(--color-dash-ink3)] font-mono text-[11px] uppercase tracking-[1.5px] hover:bg-[var(--color-dash-surface2)] transition-all duration-200"
          >
            Go Back
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-[var(--color-dash-red-bg)] border border-[rgba(192,96,96,0.3)] rounded-md text-[var(--color-dash-red)] font-mono text-[11px] uppercase tracking-[1.5px] hover:bg-[rgba(192,96,96,0.15)] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <OctagonX size={12} />
            {loading ? "Canceling..." : "Cancel Project"}
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
  onCompleteMilestone?: (
    milestoneId: string,
    projectId: string,
  ) => Promise<any>;
  onDelayMilestone?: (
    data: delayMilestoneInput,
    projectId: string,
  ) => Promise<any>;
  onBudgetRaiseRequest?: (
    data: createBudgetInput,
    projectId: string,
  ) => Promise<any>;
  hasUpi?: boolean;
  updateUPI?: (data: {
    upiId: string;
    AccountHolderName: string;
  }) => Promise<{ success: boolean; error?: string }>;
  onComplete?: (projectId: string) => Promise<any>;
  onStopProject?: (projectId: string) => Promise<any>;
  onCancelProject?: (projectId: string) => Promise<any>;
  onApprove?: (projectId: string) => Promise<any>;
  onReject?: (projectId: string) => Promise<any>;
  onResumeProject?: (projectId: string) => Promise<any>;
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
  hasUpi,
  updateUPI,
  onComplete,
  onStopProject,
  onCancelProject,
  onApprove,
  onReject,
  onResumeProject,
}: FreelancerMilestonesProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState<string | null>(null);
  const [showStopModal, setShowStopModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showBudgetrequestModal, setshowBudgetrequestModal] = useState(false);
  const [showUpiBlockModal, setShowUpiBlockModal] = useState(false);
  const [pendingMilestoneId, setPendingMilestoneId] = useState<string | null>(
    null,
  );
  const [upiData, setUpiData] = useState({ upiId: "", AccountHolderName: "" });
  const [upiLoading, setUpiLoading] = useState(false);
  const [checkSuccess, setCheckSuccess] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isResuming, setIsResuming] = useState(false);

  useEffect(() => {
    if (
      showAddModal ||
      showFlagModal ||
      showStopModal ||
      showCancelModal ||
      showBudgetrequestModal ||
      showUpiBlockModal
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [
    showAddModal,
    showFlagModal,
    showStopModal,
    showCancelModal,
    showBudgetrequestModal,
    showUpiBlockModal,
  ]);


  const isValidUpi = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(
    upiData.upiId,
  );

  const { addToast } = useToast();
  const router = useRouter();

  const handleCheck = () => {
    if (!upiData.upiId || !upiData.AccountHolderName) {
      addToast({
        title: "Error",
        message: "Both UPI ID and Holder Name are required",
        type: "error",
      });
      return;
    }
    if (isValidUpi) {
      setCheckSuccess(true);
    } else {
      setCheckSuccess(false);
      addToast({
        title: "Error",
        message: "Invalid UPI ID format",
        type: "error",
      });
    }
  };

  const qrDataUrl = checkSuccess
    ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=${upiData.upiId}&pn=${upiData.AccountHolderName}`)}`
    : "";

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
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());

  const minDate = today.toISOString().slice(0, 10);

  return (
    <div className="w-full min-h-screen bg-[var(--color-dash-bg)] px-4 py-6 lg:px-8 lg:py-8">
      <AnimatePresence>
        {showAddModal && (
          <AddMilestoneModal
            projectDeadline={project.deadline}
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
        {showFlagModal &&
          onDelayMilestone &&
          (() => {
            const currentMilestone = project.milestones.find(
              (m) => m.id === showFlagModal,
            );
            return (
              <FlagDelayModal
                currentDeadline={currentMilestone?.deadline ?? minDate}
                key="flag"
                milestoneId={showFlagModal}
                handleDelay={(data) => onDelayMilestone(data, project.id)}
                onClose={() => setShowFlagModal(null)}
              />
            );
          })()}
        {showStopModal && (
          <StopProjectModal
            key="stop"
            onClose={() => setShowStopModal(false)}
            onConfirm={async () => {
              if (onStopProject) {
                const result = await onStopProject(project.id);
                if (result?.error) {
                  addToast({
                    title: "Error",
                    message: String(result.error),
                    type: "error",
                  });
                } else {
                  addToast({
                    title: "Success",
                    message: "Project stopped",
                    type: "success",
                  });
                  setShowStopModal(false);
                }
              }
            }}
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
        {showCancelModal && (
          <CancelProjectModal
            key="cancel"
            onClose={() => setShowCancelModal(false)}
            onConfirm={async () => {
              if (onCancelProject) {
                const result = await onCancelProject(project.id);
                if (result?.error) {
                  addToast({
                    title: "Error",
                    message: String(result.error),
                    type: "error",
                  });
                } else {
                  addToast({
                    title: "Success",
                    message: "Project cancelled",
                    type: "success",
                  });
                  setShowCancelModal(false);
                }
              }
            }}
          />
        )}
        {showUpiBlockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.18 }}
              className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => {
                  setShowUpiBlockModal(false);
                  setPendingMilestoneId(null);
                }}
                className="absolute top-4 right-4 text-[#7a7570] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                  <Check className="text-green-500" size={24} />
                </div>
                <h2 className="font-serif text-2xl text-white mb-2">
                  Almost Done!
                </h2>
                <p className="font-sans text-sm text-[#7a7570]">
                  Great job finishing the work! To generate the payment QR code
                  for the client, you must enter your UPI ID.
                </p>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (
                    !updateUPI ||
                    !pendingMilestoneId ||
                    !onCompleteMilestone ||
                    !isConfirmed
                  )
                    return;
                  setUpiLoading(true);
                  const result = await updateUPI(upiData);
                  setUpiLoading(false);

                  if (result.error) {
                    addToast({
                      title: "Error",
                      message: result.error,
                      type: "error",
                    });
                    return;
                  }

                  setShowUpiBlockModal(false);
                  try {
                    const completeResult = await onCompleteMilestone(
                      pendingMilestoneId,
                      project.id,
                    );
                    if (completeResult?.error) {
                      addToast({
                        title: "Error",
                        message: String(completeResult.error),
                        type: "error",
                      });
                    } else {
                      addToast({
                        title: "Success",
                        message: "Milestone marked as completed",
                        type: "success",
                      });
                    }
                  } catch (err: any) {
                    addToast({
                      title: "Error",
                      message: err?.message || "An unexpected error occurred",
                      type: "error",
                    });
                  }
                  setPendingMilestoneId(null);
                }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="AccountHolderName"
                    className="font-mono text-[10px] tracking-[1.5px] uppercase text-[#7a7570]"
                  >
                    Account Holder Name
                  </label>
                  <input
                    id="AccountHolderName"
                    type="text"
                    placeholder="John Doe"
                    value={upiData.AccountHolderName}
                    onChange={(e) => {
                      setUpiData({
                        ...upiData,
                        AccountHolderName: e.target.value,
                      });
                      setCheckSuccess(false);
                      setIsConfirmed(false);
                    }}
                    required
                    className="w-full bg-black/40 border border-[#2a2a2a] rounded-md px-4 py-3 font-sans text-[14px] text-white focus:outline-none focus:border-[#7a7570] duration-200"
                  />
                </div>

                <div className="flex flex-col gap-2 relative">
                  <label
                    htmlFor="upiId"
                    className="font-mono text-[10px] tracking-[1.5px] uppercase text-[#7a7570]"
                  >
                    UPI ID
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="upiId"
                      type="text"
                      placeholder="name@okbank"
                      value={upiData.upiId}
                      onChange={(e) => {
                        setUpiData({ ...upiData, upiId: e.target.value });
                        setCheckSuccess(false);
                        setIsConfirmed(false);
                      }}
                      required
                      className={`flex-1 min-w-0 bg-black/40 border ${upiData.upiId && !isValidUpi ? "border-red-500/50" : "border-[#2a2a2a]"} rounded-md px-4 py-3 font-sans text-[14px] text-white focus:outline-none focus:border-[#7a7570] duration-200`}
                    />
                    <button
                      type="button"
                      onClick={handleCheck}
                      className="px-4 py-2.5 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md text-white font-mono text-[10px] uppercase tracking-[1.5px] hover:bg-[#3a3a3a] transition-colors"
                    >
                      Check
                    </button>
                  </div>
                  {upiData.upiId && !isValidUpi && (
                    <span className="text-[10px] text-red-500 absolute -bottom-5 left-0">
                      Invalid UPI ID format
                    </span>
                  )}
                </div>

                {checkSuccess && (
                  <div className="mt-3 border border-[#2a2a2a] rounded-xl p-5 bg-[#1e1e1e] flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
                    <p className="font-serif text-[15px] text-white mb-3 text-center">
                      Confirm your UPI ID
                    </p>
                    <div className="bg-white p-2 rounded-lg mb-4">
                      <img
                        src={qrDataUrl}
                        alt="UPI QR Code"
                        className="w-[100px] h-[100px]"
                      />
                    </div>
                    <p className="text-center text-[#7a7570] font-sans text-[11px] mb-5 max-w-[240px]">
                      Scan this QR code with your UPI app to verify that it
                      shows your name correctly.
                    </p>

                    {!isConfirmed ? (
                      <button
                        type="button"
                        onClick={() => setIsConfirmed(true)}
                        className="px-5 py-2.5 bg-green-500/10 border border-green-500/30 rounded-md text-green-500 font-mono text-[10px] uppercase tracking-[1.5px] hover:bg-green-500/20 transition-all duration-200 flex items-center gap-2"
                      >
                        <Check size={14} />
                        Yes, it is correct
                      </button>
                    ) : (
                      <div className="px-5 py-2.5 bg-transparent border border-green-500/30 rounded-md text-green-500 font-mono text-[10px] uppercase tracking-[1.5px] flex items-center gap-2">
                        <Check size={14} />
                        Confirmed
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={
                      upiLoading ||
                      !isValidUpi ||
                      upiData.AccountHolderName.length <= 3 ||
                      !isConfirmed
                    }
                    className="w-full px-6 py-3 bg-brand-surface border border-transparent rounded-md text-ink font-mono text-[11px] uppercase tracking-[1.5px] hover:bg-brand-surface/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {upiLoading
                      ? "Saving..."
                      : "Save UPI ID & Complete Milestone"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
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
                if (
                  project.status === "COMPLETED" ||
                  project.status === "CANCELLED" ||
                  project.status === "STOPPED"
                ) {
                  addToast({
                    title: "Project Closed",
                    message:
                      "You cannot create milestones for a closed or stopped project.",
                    type: "error",
                  });
                  return;
                }
                if (costUsed >= totalCost) {
                  addToast({
                    title: "Budget Reached",
                    message:
                      "Cannot create milestone because the budget is full.",
                    type: "error",
                  });
                  return;
                }
                setShowAddModal(true);
              }}
              className={`px-4 py-2 lg:text-[16px] bg-transparent border border-[var(--color-dash-border-hover)] rounded-md text-white font-mono text-[10px] uppercase tracking-[1.5px] transition-all duration-200 flex items-center gap-2 ${
                project.status === "COMPLETED" ||
                project.status === "CANCELLED" ||
                project.status === "STOPPED" ||
                costUsed >= totalCost
                  ? "opacity-50 cursor-not-allowed text-[var(--color-dash-ink3)]"
                  : "hover:bg-[var(--color-dash-surface2)]"
              }`}
            >
              <Plus size={13} />
              Milestone
            </button>
          )}
        </div>
      </motion.div>

      {project.status === "STOPPED" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 lg:p-5 rounded-xl border border-[rgba(192,96,96,0.35)] bg-[var(--color-dash-red-bg)] flex items-start gap-4"
        >
          <div className="p-2.5 rounded-full bg-[rgba(192,96,96,0.15)] shrink-0 mt-0.5">
            <Ban size={22} className="text-[var(--color-dash-red)]" />
          </div>
          <div>
            <h3 className="font-serif text-[18px] lg:text-[22px] text-[var(--color-dash-red)] mb-1.5 leading-none">
              PROJECT IS STOPPED
            </h3>
            <p className="font-sans text-[13px] lg:text-[14px] text-[var(--color-dash-red)]/80 leading-relaxed">
              {role === "FREELANCER"
                ? "The client has stopped this project. You may complete your currently active milestone, but no new milestones can be added, and active ones cannot be delayed."
                : "You have stopped this project. Work is officially paused. The freelancer can complete their current milestone but cannot proceed further."}
            </p>
          </div>
        </motion.div>
      )}

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
                    onClick={() => {
                      if (
                        project.status === "COMPLETED" ||
                        project.status === "CANCELLED" ||
                        project.status === "STOPPED"
                      ) {
                        addToast({
                          title: "Project Closed",
                          message:
                            "You cannot raise budget for a closed or stopped project.",
                          type: "error",
                        });
                        return;
                      }
                      setshowBudgetrequestModal(true);
                    }}
                    className={`w-full py-2 border rounded-md font-mono text-[10px] uppercase tracking-[1px] transition-all duration-200 ${
                      project.status === "COMPLETED" ||
                      project.status === "CANCELLED" ||
                      project.status === "STOPPED"
                        ? "bg-[var(--color-dash-surface2)] border-[var(--color-dash-border)] text-[var(--color-dash-ink3)] opacity-50 cursor-not-allowed"
                        : "bg-[var(--color-dash-amber-bg)] border-[rgba(200,120,64,0.3)] text-[var(--color-dash-amber)] hover:bg-[rgba(200,120,64,0.15)]"
                    }`}
                  >
                    Raise Budget
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      router.push(
                        `/${role.toLowerCase()}/Budget-requests?projectId=${project.id}`,
                      )
                    }
                    className="w-full py-2 bg-[var(--color-dash-amber-bg)] border border-[rgba(200,120,64,0.3)] rounded-md text-[var(--color-dash-amber)] font-mono text-[10px] uppercase tracking-[1px] hover:bg-[rgba(200,120,64,0.15)] transition-all duration-200"
                  >
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
              label={role === "FREELANCER" ? "Earned" : "Paid"}
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

          {project.status === "COMPLETED" || project.status === "CANCELLED" ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: 0.14 }}
              className={`w-full h-[42px] px-5 border rounded-xl font-mono text-[11px] uppercase tracking-[1.5px] font-bold flex items-center justify-center text-center shadow-sm ${
                project.status === "COMPLETED"
                  ? "bg-[var(--color-dash-green)]/10 border-[var(--color-dash-green)]/30 text-[var(--color-dash-green)]"
                  : "bg-[var(--color-dash-red)]/10 border-[var(--color-dash-red)]/30 text-[var(--color-dash-red)]"
              }`}
            >
              Your project is - {project.status.toLowerCase()}
            </motion.div>
          ) : (
            <div className="flex flex-col gap-3">
              {project.hasCancelRequest &&
                ((role === "CLIENT" &&
                  project.cancellRequests?.[0]?.clientApproved) ||
                (role === "FREELANCER" &&
                  project.cancellRequests?.[0]?.freelancerApproved) ? (
                  <motion.button
                    disabled
                    className="w-full h-[42px] px-5 bg-transparent border border-[var(--color-dash-border)] rounded-xl text-[var(--color-dash-ink4)] font-mono text-[10px] uppercase tracking-[1.5px] flex items-center justify-center gap-2 cursor-not-allowed opacity-70"
                  >
                    <OctagonX size={12} />
                    Waiting for Approval
                  </motion.button>
                ) : (
                  <>
                    {onApprove && (
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22, delay: 0.13 }}
                        onClick={async () => {
                          const result = await onApprove(project.id);
                          if (result?.error) {
                            addToast({
                              title: "Error",
                              message: String(result.error),
                              type: "error",
                            });
                          } else {
                            addToast({
                              title: "Success",
                              message: "Cancel request approved",
                              type: "success",
                            });
                          }
                        }}
                        className="w-full h-[42px] px-5 bg-[var(--color-dash-amber-bg)] border border-[rgba(200,120,64,0.35)] rounded-xl text-[var(--color-dash-amber)] font-mono text-[10px] uppercase tracking-[1.5px] hover:bg-[rgba(200,120,64,0.15)] transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <Check size={12} />
                        Approve Cancel Request
                      </motion.button>
                    )}
                    {onReject && (
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22, delay: 0.14 }}
                        onClick={async () => {
                          const result = await onReject(project.id);
                          if (result?.error) {
                            addToast({
                              title: "Error",
                              message: String(result.error),
                              type: "error",
                            });
                          } else {
                            addToast({
                              title: "Success",
                              message: "Cancel request rejected",
                              type: "success",
                            });
                          }
                        }}
                        className="w-full h-[42px] px-5 bg-transparent border border-[var(--color-dash-border-hover)] rounded-xl text-white font-mono text-[10px] uppercase tracking-[1.5px] hover:bg-[var(--color-dash-red-bg)] hover:border-[rgba(192,96,96,0.35)] hover:text-[var(--color-dash-red)] transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <OctagonX size={12} />
                        Reject Cancel Request
                      </motion.button>
                    )}
                  </>
                ))}

              {role === "FREELANCER" ? (
                <>
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: 0.14 }}
                    onClick={() => {
                      if (project.status === "STOPPED") {
                        addToast({
                          title: "Project Stopped",
                          message:
                            "You cannot flag a delay for a stopped project.",
                          type: "error",
                        });
                        return;
                      }
                      const inProgress = project.milestones.find(
                        (m) => m.status === "IN_PROGRESS",
                      );
                      if (inProgress) setShowFlagModal(inProgress.id);
                      else
                        addToast({
                          title: "Error",
                          message: "No active milestone in progress to flag",
                          type: "error",
                        });
                    }}
                    className={`w-full h-[42px] px-5 bg-transparent border border-[var(--color-dash-border-hover)] rounded-xl text-white font-mono text-[10px] uppercase tracking-[1.5px] transition-all duration-200 flex items-center justify-center gap-2 ${
                      project.status === "STOPPED"
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-[var(--color-dash-amber-bg)] hover:border-[rgba(200,120,64,0.35)] hover:text-[var(--color-dash-amber)]"
                    }`}
                  >
                    <Flag size={12} />
                    Flag a Delay
                  </motion.button>

                  {project.status === "STOPPED" && (
                    <div className="w-full text-center mt-1 mb-1">
                      <span className="font-bold text-[var(--color-dash-red)] font-mono text-[10px] uppercase tracking-[1.5px]">
                        Project Stopped
                      </span>
                    </div>
                  )}
                  {onComplete && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22, delay: 0.15 }}
                      onClick={async () => {
                        if (project.status === "STOPPED") {
                          addToast({
                            title: "Project Stopped",
                            message:
                              "You cannot mark a stopped project as completed.",
                            type: "error",
                          });
                          return;
                        }
                        const allMilestonesDone = project.milestones.every(
                          (m) =>
                            m.status === "COMPLETED" || m.status === "STOPPED",
                        );
                        if (!allMilestonesDone) {
                          addToast({
                            title: "Action Not Allowed",
                            message:
                              "All milestones must be either completed or stopped before marking the project as completed.",
                            type: "error",
                          });
                          return;
                        }
                        const result = await onComplete(project.id);
                        if (result?.error)
                          addToast({
                            title: "Error",
                            message: String(result.error),
                            type: "error",
                          });
                        else
                          addToast({
                            title: "Success",
                            message: "Project marked as completed",
                            type: "success",
                          });
                      }}
                      className={`w-full h-[42px] px-5 border rounded-xl font-mono text-[10px] uppercase tracking-[1.5px] transition-all duration-200 flex items-center justify-center gap-2 ${
                        project.status === "STOPPED"
                          ? "bg-[var(--color-dash-green)]/10 border-[var(--color-dash-green)]/30 text-[var(--color-dash-green)]/50 opacity-50 cursor-not-allowed"
                          : "bg-[var(--color-dash-green)]/10 border-[var(--color-dash-green)]/30 text-[var(--color-dash-green)] hover:bg-[var(--color-dash-green)]/20"
                      }`}
                    >
                      <Check size={12} />
                      Project Completed
                    </motion.button>
                  )}
                </>
              ) : project.status === "STOPPED" ? (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: 0.14 }}
                  disabled={isResuming || !onResumeProject}
                  onClick={async () => {
                    if (!onResumeProject) return;
                    setIsResuming(true);
                    try {
                      const result = await onResumeProject(project.id);
                      if (result?.error) {
                        addToast({
                          title: "Error",
                          message: result.error,
                          type: "error",
                        });
                      } else {
                        addToast({
                          title: "Success",
                          message: "Project resumed successfully",
                          type: "success",
                        });
                      }
                    } catch (err: any) {
                      addToast({
                        title: "Error",
                        message: err.message || "An unexpected error occurred",
                        type: "error",
                      });
                    } finally {
                      setIsResuming(false);
                    }
                  }}
                  className="w-full h-[42px] px-5 border border-[var(--color-dash-amber)]/30 bg-[var(--color-dash-amber)]/10 text-[var(--color-dash-amber)] rounded-xl font-mono text-[10px] uppercase tracking-[1.5px] hover:bg-[var(--color-dash-amber)]/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResuming ? (
                    <span className="w-3.5 h-3.5 border-2 border-[var(--color-dash-amber)] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Play size={12} fill="currentColor" />
                  )}
                  {isResuming ? "Resuming..." : "Resume Project"}
                </motion.button>
              ) : (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: 0.14 }}
                  onClick={() => setShowStopModal(true)}
                  className="w-full h-[42px] px-5 border rounded-xl font-mono text-[10px] uppercase tracking-[1.5px] transition-all duration-200 flex items-center justify-center gap-2 bg-transparent border-[var(--color-dash-border-hover)] text-white hover:bg-[var(--color-dash-red-bg)] hover:border-[rgba(192,96,96,0.35)] hover:text-[var(--color-dash-red)]"
                >
                  <OctagonX size={12} />
                  Stop Project
                </motion.button>
              )}

              {!project.hasCancelRequest && onCancelProject && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: 0.16 }}
                  onClick={() => setShowCancelModal(true)}
                  className="w-full h-[42px] px-5 bg-transparent border border-[var(--color-dash-border-hover)] rounded-xl text-white font-mono text-[10px] uppercase tracking-[1.5px] hover:bg-[var(--color-dash-red-bg)] hover:border-[rgba(192,96,96,0.35)] hover:text-[var(--color-dash-red)] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <OctagonX size={12} />
                  Cancel Project
                </motion.button>
              )}
            </div>
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
                    onDelete && project.status !== "STOPPED"
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
                          if (hasUpi === false) {
                            setPendingMilestoneId(milestoneId);
                            setShowUpiBlockModal(true);
                            return;
                          }
                          try {
                            const result = await onCompleteMilestone(
                              milestoneId,
                              project.id,
                            );
                            if (result?.error) {
                              addToast({
                                title: "Error",
                                message: String(result.error),
                                type: "error",
                              });
                            } else {
                              addToast({
                                title: "Success",
                                message: "Milestone marked as completed",
                                type: "success",
                              });
                            }
                          } catch (err: any) {
                            addToast({
                              title: "Error",
                              message:
                                err?.message || "An unexpected error occurred",
                              type: "error",
                            });
                          }
                        }
                      : undefined
                  }
                />
              ))}
              <div className="flex gap-0">
                <div className="flex flex-col items-center mr-5 shrink-0">
                  <div className="w-3 mt-0.5 h-3.25 rounded-full border-2 border-[var(--color-dash-border)] bg-dash-ink2/80" />
                </div>
                <p className="font-mono text-[10px] lg:text-[13px] tracking-[2px] uppercase text-dash-ink2 font-bold pb-4 mt-[1px]">
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

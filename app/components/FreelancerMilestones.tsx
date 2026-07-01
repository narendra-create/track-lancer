"use client";
import { useState } from "react";
import { Plus, ArrowLeft, Flag, Check, Clock, Lock, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ─── TYPES ───────────────────────────────────────────────────────────────────

type MilestoneStatus = "PAID" | "PENDING" | "UPCOMING" | "STOPPED";

type Milestone = {
  id: string;
  title: string;
  amount: number;
  status: MilestoneStatus;
  dueDate: string;
  paidDate?: string;
  description: string;
};

type Project = {
  id: string;
  title: string;
  code: string;
  startDate: string;
  totalValue: number;
  received: number;
  milestones: Milestone[];
};

// ─── DUMMY DATA ───────────────────────────────────────────────────────────────

const DUMMY_PROJECT: Project = {
  id: "proj-001",
  title: "Adhyatma Coaching Platform",
  code: "ADH7F29K",
  startDate: "1 Nov 2025",
  totalValue: 45000,
  received: 20000,
  milestones: [
    {
      id: "ms-1",
      title: "Auth & Role System",
      amount: 8000,
      status: "PAID",
      dueDate: "10 Nov 2025",
      paidDate: "9 Nov 2025",
      description: "Auth.js v5, Google OAuth, JWT, invite codes",
    },
    {
      id: "ms-2",
      title: "Teacher & Student Dashboards",
      amount: 12000,
      status: "PAID",
      dueDate: "22 Nov 2025",
      paidDate: "21 Nov 2025",
      description: "Full dashboard UI, components, Tailwind layout",
    },
    {
      id: "ms-3",
      title: "Course & Enrollment Management",
      amount: 10000,
      status: "PENDING",
      dueDate: "5 Dec 2025",
      description: "Course CRUD, enrollment flows, progress tracking",
    },
    {
      id: "ms-4",
      title: "Live Session Integration",
      amount: 8000,
      status: "UPCOMING",
      dueDate: "20 Dec 2025",
      description: "Zoom/Meet embed, scheduling, reminders",
    },
    {
      id: "ms-5",
      title: "Payments & Certificates",
      amount: 7000,
      status: "UPCOMING",
      dueDate: "3 Jan 2026",
      description: "Razorpay integration, auto-cert generation on completion",
    },
  ],
};

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  MilestoneStatus,
  { label: string; dotColor: string; badgeBg: string; badgeBorder: string; badgeText: string }
> = {
  PAID: {
    label: "PAID",
    dotColor: "bg-[var(--color-dash-green)]",
    badgeBg: "bg-[var(--color-status-paid-bg)]",
    badgeBorder: "border-[var(--color-status-paid-border)]",
    badgeText: "text-[var(--color-status-paid-text)]",
  },
  PENDING: {
    label: "PENDING",
    dotColor: "bg-[var(--color-dash-amber)]",
    badgeBg: "bg-[var(--color-status-pending-bg)]",
    badgeBorder: "border-[var(--color-status-pending-border)]",
    badgeText: "text-[var(--color-dash-amber)]",
  },
  UPCOMING: {
    label: "UPCOMING",
    dotColor: "bg-[var(--color-dash-border-hover)]",
    badgeBg: "bg-[var(--color-status-upcoming-bg)]",
    badgeBorder: "border-[var(--color-status-upcoming-border)]",
    badgeText: "text-[var(--color-status-upcoming-text)]",
  },
  STOPPED: {
    label: "STOPPED",
    dotColor: "bg-[var(--color-dash-red)]",
    badgeBg: "bg-[var(--color-status-danger-bg)]",
    badgeBorder: "border-[var(--color-status-danger-border)]",
    badgeText: "text-[var(--color-status-danger-text)]",
  },
};

const STATUS_ICON: Record<MilestoneStatus, React.ReactNode> = {
  PAID: <Check size={10} strokeWidth={2.5} />,
  PENDING: <Clock size={10} strokeWidth={2.5} />,
  UPCOMING: <Lock size={9} strokeWidth={2.5} />,
  STOPPED: <AlertTriangle size={10} strokeWidth={2.5} />,
};

// ─── ADD MILESTONE MODAL ──────────────────────────────────────────────────────

function AddMilestoneModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ title: "", amount: "", dueDate: "", description: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
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
        className="bg-[var(--color-dash-surface1)] border border-[var(--color-dash-border)] rounded-xl p-7 max-w-md w-full shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--color-dash-ink3)] hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <h2 className="font-serif text-xl text-white mb-1">New Milestone</h2>
          <p className="font-mono text-[10px] tracking-[2px] uppercase text-[var(--color-dash-ink3)]">
            Add to thread
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)]">
              Milestone Title
            </label>
            <input
              name="title"
              type="text"
              placeholder="e.g. Payment Gateway Integration"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full bg-[var(--color-dash-surface2)] border border-[var(--color-dash-border)] rounded-md px-4 py-3 font-sans text-[13px] text-white placeholder:text-[var(--color-dash-ink4)] focus:outline-none focus:border-[var(--color-dash-ink3)] duration-200"
            />
          </div>

          {/* Amount + Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)]">
                Amount (₹)
              </label>
              <input
                name="amount"
                type="number"
                placeholder="0"
                value={form.amount}
                onChange={handleChange}
                required
                className="w-full bg-[var(--color-dash-surface2)] border border-[var(--color-dash-border)] rounded-md px-4 py-3 font-sans text-[13px] text-white placeholder:text-[var(--color-dash-ink4)] focus:outline-none focus:border-[var(--color-dash-ink3)] duration-200"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)]">
                Due Date
              </label>
              <input
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={handleChange}
                required
                className="w-full bg-[var(--color-dash-surface2)] border border-[var(--color-dash-border)] rounded-md px-4 py-3 font-sans text-[13px] text-white placeholder:text-[var(--color-dash-ink4)] focus:outline-none focus:border-[var(--color-dash-ink3)] duration-200 [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)]">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="What this milestone covers..."
              value={form.description}
              onChange={handleChange}
              className="w-full bg-[var(--color-dash-surface2)] border border-[var(--color-dash-border)] rounded-md px-4 py-3 font-sans text-[13px] text-white placeholder:text-[var(--color-dash-ink4)] focus:outline-none focus:border-[var(--color-dash-ink3)] duration-200 resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 px-6 py-3 bg-transparent border border-[var(--color-dash-border-hover)] rounded-md text-white font-mono text-[11px] uppercase tracking-[1.5px] hover:bg-[var(--color-dash-surface2)] hover:border-[var(--color-dash-ink3)] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add Milestone →"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ─── FLAG DELAY MODAL ─────────────────────────────────────────────────────────

function FlagDelayModal({ onClose }: { onClose: () => void }) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
              rows={4}
              placeholder="Describe what caused the delay..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full bg-[var(--color-dash-surface2)] border border-[var(--color-dash-border)] rounded-md px-4 py-3 font-sans text-[13px] text-white placeholder:text-[var(--color-dash-ink4)] focus:outline-none focus:border-[var(--color-dash-amber)] duration-200 resize-none"
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

// ─── MILESTONE CARD ───────────────────────────────────────────────────────────

function MilestoneCard({ milestone, index }: { milestone: Milestone; index: number }) {
  const cfg = STATUS_CONFIG[milestone.status];
  const isLocked = milestone.status === "UPCOMING";

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22, delay: index * 0.06 }}
      className="relative flex gap-0"
    >
      {/* Timeline dot + line */}
      <div className="flex flex-col items-center mr-5 mt-1 shrink-0">
        <div
          className={`w-[10px] h-[10px] rounded-full border-2 shrink-0 z-10 ${
            isLocked
              ? "border-[var(--color-dash-border-hover)] bg-[var(--color-dash-surface2)]"
              : `${cfg.dotColor} border-transparent`
          }`}
        />
        <div className="w-px flex-1 bg-[var(--color-dash-border)] mt-[6px]" />
      </div>

      {/* Card */}
      <div
        className={`flex-1 mb-4 bg-[var(--color-dash-surface1)] border border-[var(--color-dash-border)] rounded-xl p-5 hover:border-[var(--color-dash-border-hover)] transition-colors duration-200 ${
          isLocked ? "opacity-60" : ""
        }`}
      >
        {/* Card top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h3 className="font-serif text-[15px] text-white leading-snug mb-2">
              {milestone.title}
            </h3>
            {/* Status badge */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-[3px] rounded-sm border font-mono text-[9px] tracking-[1.5px] uppercase ${cfg.badgeBg} ${cfg.badgeBorder} ${cfg.badgeText}`}
            >
              {STATUS_ICON[milestone.status]}
              {cfg.label}
            </span>
          </div>
          <span className="font-serif text-[15px] text-[var(--color-dash-gold)] shrink-0">
            ₹{milestone.amount.toLocaleString()}
          </span>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] tracking-[1px] text-[var(--color-dash-ink3)] mb-3">
          <span>
            DUE:{" "}
            <span className="text-[var(--color-dash-ink2)]">{milestone.dueDate}</span>
          </span>
          {milestone.paidDate && (
            <span>
              PAID:{" "}
              <span className="text-[var(--color-status-paid-text)]">{milestone.paidDate}</span>
            </span>
          )}
        </div>

        {/* Description */}
        <p className="font-sans text-[12px] text-[var(--color-dash-ink3)] leading-relaxed">
          {milestone.description}
        </p>
      </div>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export function FreelancerMilestones() {
  const project = DUMMY_PROJECT;
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);

  const remaining = project.totalValue - project.received;
  const receivedPct = Math.round((project.received / project.totalValue) * 100);

  return (
    <div className="w-full max-w-3xl">
      <AnimatePresence>
        {showAddModal && (
          <AddMilestoneModal key="add" onClose={() => setShowAddModal(false)} />
        )}
        {showFlagModal && (
          <FlagDelayModal key="flag" onClose={() => setShowFlagModal(false)} />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-[26px] lg:text-[30px] text-white leading-tight mb-1">
            {project.title}
          </h1>
          <p className="font-mono text-[10px] tracking-[2px] uppercase text-[var(--color-dash-ink3)]">
            CODE: {project.code} · {project.startDate}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 mt-1">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-transparent border border-[var(--color-dash-border)] rounded-md text-white font-mono text-[10px] uppercase tracking-[1.5px] hover:bg-[var(--color-dash-surface2)] hover:border-[var(--color-dash-border-hover)] transition-all duration-200 flex items-center gap-2"
          >
            <ArrowLeft size={13} />
            Back
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-transparent border border-[var(--color-dash-border-hover)] rounded-md text-white font-mono text-[10px] uppercase tracking-[1.5px] hover:bg-[var(--color-dash-surface2)] transition-all duration-200 flex items-center gap-2"
          >
            <Plus size={13} />
            Milestone
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[var(--color-dash-surface1)] border border-[var(--color-dash-border)] rounded-xl p-4">
          <p className="font-mono text-[9px] tracking-[2px] uppercase text-[var(--color-dash-ink3)] mb-2">
            Project Value
          </p>
          <p className="font-serif text-[22px] text-[var(--color-dash-ink)]">
            ₹{project.totalValue.toLocaleString()}
          </p>
        </div>
        <div className="bg-[var(--color-dash-surface1)] border border-[var(--color-dash-border)] rounded-xl p-4">
          <p className="font-mono text-[9px] tracking-[2px] uppercase text-[var(--color-dash-ink3)] mb-2">
            Received
          </p>
          <p className="font-serif text-[22px] text-[var(--color-dash-green)]">
            ₹{project.received.toLocaleString()}
          </p>
        </div>
        <div className="bg-[var(--color-dash-surface1)] border border-[var(--color-dash-border)] rounded-xl p-4">
          <p className="font-mono text-[9px] tracking-[2px] uppercase text-[var(--color-dash-ink3)] mb-2">
            Remaining
          </p>
          <p className="font-serif text-[22px] text-[var(--color-dash-ink)]">
            ₹{remaining.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Progress Bar + Flag Delay Row */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 h-[38px] bg-[var(--color-dash-surface1)] border border-[var(--color-dash-border)] rounded-md overflow-hidden relative">
          <div
            className="h-full bg-[var(--color-dash-green-bg)] border-r border-[var(--color-status-paid-border)] transition-all duration-700"
            style={{ width: `${receivedPct}%` }}
          />
          <span className="absolute inset-0 flex items-center px-4 font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)]">
            {receivedPct}% received
          </span>
        </div>
        <button
          onClick={() => setShowFlagModal(true)}
          className="h-[38px] px-5 bg-transparent border border-[var(--color-dash-border-hover)] rounded-md text-white font-mono text-[10px] uppercase tracking-[1.5px] hover:bg-[var(--color-dash-amber-bg)] hover:border-[rgba(200,120,64,0.35)] hover:text-[var(--color-dash-amber)] transition-all duration-200 flex items-center gap-2 shrink-0"
        >
          <Flag size={12} />
          Flag Delay
        </button>
      </div>

      {/* Milestone Thread */}
      <div className="mb-3">
        <p className="font-mono text-[10px] tracking-[2px] uppercase text-[var(--color-dash-ink3)]">
          Milestone Thread
        </p>
      </div>
      <div className="w-full h-px bg-[var(--color-dash-border)] mb-6" />

      <div>
        {project.milestones.map((milestone, idx) => (
          <MilestoneCard key={milestone.id} milestone={milestone} index={idx} />
        ))}
        {/* Thread end cap */}
        <div className="flex gap-0">
          <div className="flex flex-col items-center mr-5 shrink-0">
            <div className="w-[10px] h-[10px] rounded-full border-2 border-[var(--color-dash-border)] bg-[var(--color-dash-surface2)]" />
          </div>
          <p className="font-mono text-[10px] tracking-[2px] uppercase text-[var(--color-dash-ink4)] pb-4 mt-[1px]">
            End of thread
          </p>
        </div>
      </div>
    </div>
  );
}

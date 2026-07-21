"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion } from "motion/react";
import type { createMilestoneInput } from "@/app/lib/validations/MilestoneValidation";

import { useToast } from "@/app/components/ToastProvider";

interface AddMilestoneModalProps {
  productId: string;
  remainingLimit: number;
  totalBudget: number;
  onClose: () => void;
  handleSubmit: (data: createMilestoneInput) => Promise<void>;
  projectDeadline: Date | string;
}

export function AddMilestoneModal({
  productId,
  remainingLimit,
  totalBudget,
  onClose,
  handleSubmit,
  projectDeadline,
}: AddMilestoneModalProps) {
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    cost: "",
    deadline: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const minDate = today.toISOString().slice(0, 10);

  const projectdeadlineCalculate = new Date(projectDeadline);
  projectdeadlineCalculate.setMinutes(
    projectdeadlineCalculate.getMinutes() -
      projectdeadlineCalculate.getTimezoneOffset(),
  );
  const maxDate = projectdeadlineCalculate.toISOString().slice(0, 10);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const costValue = Number(form.cost);
    if (costValue > remainingLimit) {
      addToast({
        title: "Limit Exceeded",
        message: `Stay in limit because you can use only ₹${remainingLimit.toLocaleString("en-IN")} now since budget is ₹${totalBudget.toLocaleString("en-IN")}. If you need more, you can create a raise budget request.`,
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      await handleSubmit({
        projectId: productId,
        title: form.title,
        subtitle: form.subtitle || undefined,
        cost: Number(form.cost),
        deadline: form.deadline,
        description: form.description || undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.18 }}
        className="bg-[var(--color-dash-surface1)] border border-[var(--color-dash-border)] rounded-xl p-7 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--color-dash-ink3)] hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header Section */}
        <div className="mb-6">
          <h2 className="font-serif text-xl text-white mb-1">New Milestone</h2>
          <p className="font-mono text-[10px] tracking-[2px] uppercase text-[var(--color-dash-ink3)]">
            Add to thread
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          {/* Title Input */}
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)]">
              Milestone Title{" "}
              <span className="text-[var(--color-dash-red)]">*</span>
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

          {/* Subtitle Input */}
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)]">
              Subtitle <span className="opacity-50">(optional)</span>
            </label>
            <input
              name="subtitle"
              type="text"
              placeholder="Short descriptor"
              value={form.subtitle}
              onChange={handleChange}
              className="w-full bg-[var(--color-dash-surface2)] border border-[var(--color-dash-border)] rounded-md px-4 py-3 font-sans text-[13px] text-white placeholder:text-[var(--color-dash-ink4)] focus:outline-none focus:border-[var(--color-dash-ink3)] duration-200"
            />
          </div>

          {/* Cost and Deadline Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)]">
                Cost (₹) <span className="text-[var(--color-dash-red)]">*</span>
              </label>
              <input
                name="cost"
                type="number"
                min="0"
                placeholder="0"
                value={form.cost}
                onChange={handleChange}
                required
                className="w-full bg-[var(--color-dash-surface2)] border border-[var(--color-dash-border)] rounded-md px-4 py-3 font-sans text-[13px] text-white placeholder:text-[var(--color-dash-ink4)] focus:outline-none focus:border-[var(--color-dash-ink3)] duration-200"
              />
              {Number(form.cost) > remainingLimit && (
                <p className="font-sans text-[11px] text-[var(--color-dash-red)] leading-relaxed mt-1">
                  Limit exceeded. You can only use ₹
                  {remainingLimit.toLocaleString("en-IN")} now since budget is ₹
                  {totalBudget.toLocaleString("en-IN")}. Create a raise budget
                  request for more.
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)]">
                Deadline <span className="text-[var(--color-dash-red)]">*</span>
              </label>
              <input
                name="deadline"
                type="date"
                min={minDate}
                max={maxDate}
                value={form.deadline}
                onChange={handleChange}
                required
                className="w-full bg-[var(--color-dash-surface2)] border border-[var(--color-dash-border)] rounded-md px-4 py-3 font-sans text-[13px] text-white placeholder:text-[var(--color-dash-ink4)] focus:outline-none focus:border-[var(--color-dash-ink3)] duration-200 [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Description Input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)]">
                Description <span className="opacity-50">(optional)</span>
              </label>
              <span className="font-mono text-[9px] text-[var(--color-dash-ink4)]">
                {form.description.length}/80
              </span>
            </div>
            <textarea
              name="description"
              rows={3}
              maxLength={80}
              placeholder="What this milestone covers..."
              value={form.description}
              onChange={handleChange}
              className="w-full bg-[var(--color-dash-surface2)] border border-[var(--color-dash-border)] rounded-md px-4 py-3 font-sans text-[13px] text-white placeholder:text-[var(--color-dash-ink4)] focus:outline-none focus:border-[var(--color-dash-ink3)] duration-200 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || Number(form.cost) > remainingLimit}
            className="mt-1 px-6 py-3 bg-transparent border border-[var(--color-dash-border-hover)] rounded-md text-white font-mono text-[11px] uppercase tracking-[1.5px] hover:bg-[var(--color-dash-surface2)] hover:border-[var(--color-dash-ink3)] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add Milestone →"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, FileX, ShieldX, Lock, Unlink } from "lucide-react";
import { fadeUp, staggerContainer } from "@/app/lib/animations";

type ErrorCode = 401 | 403 | 404 | 409 | "unknown";

interface PayNowErrorProps {
  code: ErrorCode;
  message?: string;
  backHref: string;
}

const ERROR_CONFIG: Record<
  ErrorCode,
  { icon: React.ElementType; title: string; desc: string; iconColor: string; borderColor: string; bgColor: string }
> = {
  404: {
    icon: FileX,
    title: "Payment Not Found",
    desc: "This payment ledger doesn't exist or may have been removed. Check your payments list for active records.",
    iconColor: "text-[var(--color-dash-ink3)]",
    borderColor: "border-[var(--color-dash-border)]",
    bgColor: "bg-[var(--color-dash-surface1)]",
  },
  401: {
    icon: Lock,
    title: "Session Expired",
    desc: "You are not signed in or your session has expired. Please log in again to continue.",
    iconColor: "text-[var(--color-dash-amber)]",
    borderColor: "border-[var(--color-status-stopped-border)]",
    bgColor: "bg-[var(--color-status-stopped-bg)]",
  },
  403: {
    icon: ShieldX,
    title: "Access Denied",
    desc: "This page is only accessible to client accounts. Make sure you are logged in with the correct account.",
    iconColor: "text-[var(--color-dash-red)]",
    borderColor: "border-[var(--color-status-danger-border)]",
    bgColor: "bg-[var(--color-status-danger-bg)]",
  },
  409: {
    icon: Unlink,
    title: "Not Your Payment",
    desc: "This payment ledger is not associated with your account. You can only view payments linked to your projects.",
    iconColor: "text-[var(--color-dash-red)]",
    borderColor: "border-[var(--color-status-danger-border)]",
    bgColor: "bg-[var(--color-status-danger-bg)]",
  },
  unknown: {
    icon: FileX,
    title: "Something Went Wrong",
    desc: "An unexpected error occurred while loading this payment. Please try again or contact support.",
    iconColor: "text-[var(--color-dash-ink3)]",
    borderColor: "border-[var(--color-dash-border)]",
    bgColor: "bg-[var(--color-dash-surface1)]",
  },
};

export function PayNowError({ code, message, backHref }: PayNowErrorProps) {
  const cfg = ERROR_CONFIG[code];
  const Icon = cfg.icon;

  return (
    <div className="min-h-screen w-full bg-[var(--color-dash-bg)] flex flex-col">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-8 w-full">
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-[var(--color-dash-ink3)] hover:text-[var(--color-dash-ink)] transition-colors mb-10 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-150" />
            <span className="font-sans text-[12px] uppercase">Back to Payments</span>
          </Link>
        </motion.div>

        <motion.div
          className="flex flex-col items-center justify-center py-24"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp} className={`border ${cfg.borderColor} ${cfg.bgColor} p-8 w-full max-w-md relative overflow-hidden`}>
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--color-dash-border)]" />

            <div className="flex flex-col items-center text-center gap-6">
              <div className={`w-16 h-16 border ${cfg.borderColor} ${cfg.bgColor} flex items-center justify-center`}>
                <Icon size={26} strokeWidth={1.5} className={cfg.iconColor} />
              </div>

              <div className="space-y-2">
                <p className="font-mono text-[11px] tracking-[2px] uppercase text-[var(--color-dash-ink4)]">
                  Error {code}
                </p>
                <h1 className="font-serif text-[26px] text-[var(--color-dash-ink)] leading-tight">
                  {cfg.title}
                </h1>
                <p className="font-sans text-[13px] text-[var(--color-dash-ink3)] leading-relaxed max-w-sm">
                  {message ?? cfg.desc}
                </p>
              </div>

              <div className="w-full pt-2 border-t border-[var(--color-dash-border)] flex flex-col sm:flex-row gap-3">
                <Link
                  href={backHref}
                  className="flex-1 flex items-center justify-center gap-2 py-3 font-mono text-[11px] tracking-[2px] uppercase border border-[var(--color-dash-border)] text-[var(--color-dash-ink3)] hover:border-[var(--color-dash-border-hover)] hover:text-[var(--color-dash-ink)] transition-colors"
                >
                  <ArrowLeft size={13} />
                  Go Back
                </Link>
                <Link
                  href="/client/dashboard"
                  className="flex-1 flex items-center justify-center py-3 font-mono text-[11px] tracking-[2px] uppercase bg-[rgba(200,169,110,0.1)] border border-[rgba(200,169,110,0.3)] text-[var(--color-dash-gold)] hover:bg-[rgba(200,169,110,0.18)] transition-colors"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

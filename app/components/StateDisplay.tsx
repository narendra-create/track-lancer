"use client";

import React from "react";
import { motion } from "motion/react";
import { AlertCircle, FileSearch, RefreshCcw } from "lucide-react";
import Link from "next/link";

interface StateDisplayProps {
  type?: "error" | "empty";
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
}

export function StateDisplay({
  type = "error",
  title,
  message,
  actionLabel,
  onAction,
  actionHref,
}: StateDisplayProps) {
  const isError = type === "error";

  const defaultTitle = isError ? "Something went wrong" : "No Data Found";
  const defaultMessage = isError
    ? "We encountered an error while processing your request. Please try again."
    : "There doesn't seem to be anything here right now.";
  const defaultAction = isError ? "Try Again" : "Refresh";

  const Icon = isError ? AlertCircle : FileSearch;
  
  // Theme colors based on state
  const cardBg = isError 
    ? "bg-[rgba(239,68,68,0.03)] border-[rgba(239,68,68,0.2)]" 
    : "bg-[rgba(200,120,64,0.03)] border-[rgba(200,120,64,0.25)]"; 
    
  const iconBoxBg = isError
    ? "bg-[rgba(239,68,68,0.1)] text-red-400 border-[rgba(239,68,68,0.2)]"
    : "bg-[rgba(200,120,64,0.1)] text-[var(--color-dash-amber)] border-[rgba(200,120,64,0.2)]";

  const titleColor = isError ? "text-red-400" : "text-[var(--color-dash-amber)]";

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (!actionHref) {
      window.location.reload();
    }
  };

  const buttonContent = (
    <>
      <RefreshCcw className="w-4 h-4" />
      {actionLabel || defaultAction}
    </>
  );

  const buttonClass =
    "inline-flex items-center justify-center gap-2 px-6 py-3 border border-[var(--color-dash-border)] rounded-md font-mono text-[11px] lg:text-[13px] tracking-[1.5px] uppercase text-[var(--color-dash-ink2)] hover:text-white hover:border-[var(--color-dash-border-hover)] bg-[var(--color-dash-surface1)] transition-all duration-300 shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(200,120,64,0.15)]";

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 lg:p-8 w-full relative">
      {/* Background glowing effects for premium feel */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 flex items-center justify-center">
        <div className={`w-[40%] h-[300px] rounded-full blur-[120px] opacity-20 ${isError ? 'bg-red-500' : 'bg-[var(--color-dash-amber)]'}`} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className={`flex flex-col items-center max-w-lg w-full backdrop-blur-md border rounded-2xl p-8 lg:p-12 text-center shadow-[0_8px_32px_-8px_rgba(0,0,0,0.3)] relative overflow-hidden ${cardBg}`}
      >
        {/* Subtle Top Gradient Highlight inside the card */}
        <div className={`absolute top-0 left-0 w-full h-[2px] opacity-100 bg-gradient-to-r from-transparent ${isError ? 'via-red-500' : 'via-[var(--color-dash-amber)]'} to-transparent`} />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
          className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 border ${iconBoxBg} shadow-inner`}
        >
          <Icon className="w-10 h-10" strokeWidth={1.5} />
        </motion.div>
        
        <h3 className={`font-serif text-[24px] lg:text-[28px] mb-3 leading-tight ${titleColor}`}>
          {title || defaultTitle}
        </h3>
        
        <p className="font-mono text-[12px] lg:text-[14px] text-[var(--color-dash-ink3)] mb-10 leading-relaxed max-w-[85%]">
          {message || defaultMessage}
        </p>

        {actionHref ? (
          <Link href={actionHref} className={buttonClass}>
            {buttonContent}
          </Link>
        ) : (
          <button onClick={handleAction} className={buttonClass}>
            {buttonContent}
          </button>
        )}
      </motion.div>
    </div>
  );
}

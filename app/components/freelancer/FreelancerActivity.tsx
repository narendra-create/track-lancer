"use client";
import { motion, AnimatePresence } from "motion/react";
import React from "react";
import {
  Activity,
  Clock,
  CreditCard,
  CheckCircle,
  Bell,
  AlertTriangle,
} from "lucide-react";
import useSWR from "swr";
import { useRef, useState, useEffect } from "react";
import type { ActivityItem } from "@/types/activitys";
import { formatRelativeTime } from "@/app/lib/utilitys";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const getActivityStyles = (type: string) => {
  switch (type) {
    case "DELAY":
      return {
        icon: <Clock size={15} strokeWidth={2.5} />,
        bg: "bg-orange-500/10",
        text: "text-orange-400",
        border: "border-orange-500/20",
        shadow: "shadow-[0_0_10px_rgba(249,115,22,0.1)]",
      };
    case "PAYMENT":
      return {
        icon: <CreditCard size={15} strokeWidth={2.5} />,
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        border: "border-emerald-500/20",
        shadow: "shadow-[0_0_10px_rgba(16,185,129,0.1)]",
      };
    case "MILESTONEDONE":
      return {
        icon: <CheckCircle size={15} strokeWidth={2.5} />,
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        border: "border-blue-500/20",
        shadow: "shadow-[0_0_10px_rgba(59,130,246,0.1)]",
      };
    case "REMINDER":
      return {
        icon: <Bell size={15} strokeWidth={2.5} />,
        bg: "bg-orange-500/5",
        text: "text-orange-400/80",
        border: "border-orange-500/10",
        shadow: "shadow-none",
      };
    case "WARNING":
      return {
        icon: <AlertTriangle size={15} strokeWidth={2.5} />,
        bg: "bg-red-500/10",
        text: "text-red-400",
        border: "border-red-500/20",
        shadow: "shadow-[0_0_10px_rgba(239,68,68,0.1)]",
      };
    default:
      return {
        icon: <Activity size={15} strokeWidth={2.5} />,
        bg: "bg-[#2a2a2a]",
        text: "text-[#a1a1aa]",
        border: "border-[#3f3f46]",
        shadow: "shadow-none",
      };
  }
};

export default function FreelancerActivity({
  items: initialItems,
}: {
  items: ActivityItem[];
}) {
  const { data } = useSWR("/api/activity", fetcher, {
    fallbackData: { data: initialItems },
    refreshInterval: 10000,
    revalidateOnFocus: true,
  });

  const notifications = data?.data || initialItems;

  return (
    <div className="overflow-hidden custom-scrollbar rounded-md border lg:max-h-120 border-[#2c2c2c] bg-[#141414] flex flex-col">
      <div className="border-b border-[#2c2c2c] px-5 py-4 flex items-center justify-between">
        <h2 className="font-serif text-[16px] lg:text-[20px] text-[#e8e3d8]">
          Activity
        </h2>
        {notifications.length > 0 && (
          <span className="rounded-full bg-[#1c1c1c] border border-[#2c2c2c] px-2.5 py-0.5 font-mono text-[9px] text-[#97918b]">
            {notifications.length} updates
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        <AnimatePresence mode="popLayout">
          {notifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex h-[250px] flex-col items-center justify-center text-center"
            >
              <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-[#333] shadow-lg">
                <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 transition-opacity hover:opacity-100" />
                <Activity size={24} className="text-[#666]" />
              </div>
              <h3 className="mb-2 font-serif text-[16px] text-[#e8e3d8] tracking-wide">
                No Activity Yet
              </h3>
              <p className="max-w-[220px] font-sans text-[12px] leading-relaxed text-[#888]">
                When your projects make progress or updates occur, they will
                beautifully appear here.
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-2.5 pb-4">
              {notifications.map((message: ActivityItem, i: any) => {
                const styles = getActivityStyles(message.type);
                return (
                  <motion.div
                    layout
                    key={message.id}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: i * 0.04,
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                    }}
                    className="group relative flex gap-3.5 rounded-xl border border-transparent bg-transparent p-3 transition-all duration-300 hover:bg-[#1a1a1a] hover:border-[#2c2c2c] hover:shadow-sm"
                  >
                    <div className="absolute left-0 top-1/2 h-0 w-[2px] -translate-y-1/2 rounded-r-md bg-white/10 transition-all duration-300 group-hover:h-3/4" />

                    <div
                      className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-300 group-hover:scale-110 ${styles.bg} ${styles.text} ${styles.border} ${styles.shadow}`}
                    >
                      {styles.icon}
                    </div>

                    <div className="min-w-0 flex-1 py-0.5">
                      <div className="text-[13px] leading-relaxed text-[#d4d4d4]">
                        <span
                          className={`font-semibold tracking-wide mr-1.5 transition-colors ${styles.text}`}
                        >
                          {message.highlightmessage}:
                        </span>
                        <span className="text-[#bab4ae] transition-colors group-hover:text-[#c4c4c4]">
                          {message.message}
                        </span>
                      </div>

                      <div className="mt-2 font-medium flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-wider text-[#878787]">
                        <span className="flex items-center gap-1 opacity-80 transition-opacity group-hover:opacity-100">
                          <Clock size={11} />
                          {formatRelativeTime(message.dateTimeofMessage)}
                        </span>

                        {message.project?.title && (
                          <>
                            <span className="h-1 w-1 rounded-full bg-[#333]" />
                            <span className="truncate max-w-[120px] opacity-80 transition-opacity group-hover:opacity-100">
                              {message.project.title}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

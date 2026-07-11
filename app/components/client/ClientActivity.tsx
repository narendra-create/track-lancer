"use client";

import { motion } from "motion/react";
import React from "react";
import { Activity } from "lucide-react";

export type ClientActivityItem = {
  id: number;
  icon: string;
  iconColorClass: string;
  text: React.ReactNode;
  time: string;
};

export default function ClientActivity({ items }: { items: ClientActivityItem[] }) {
  return (
    <div>
      <div className="mb-[12px] font-serif text-[.95rem] text-[#e8e3d8]">
        Activity
      </div>
        <div className="px-[16px] py-[18px] max-h-89 lg:max-h-130 overflow-y-auto custom-scrollbar lg:h-full">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1c1c1c] border border-[#2c2c2c]">
                <Activity size={20} className="text-[#97918b]" />
              </div>
              <h3 className="mb-1 font-serif text-[15px] text-[#e8e3d8]">
                No Activity Yet
              </h3>
              <p className="max-w-[200px] font-sans text-[11px] leading-relaxed text-[#97918b]">
                When your freelancers make progress or payments are processed, it will appear here.
              </p>
            </div>
          ) : (
            items.map((act, i) => (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.18, delay: i * 0.05 }}
                className="flex gap-[10px] border-b border-[#2c2c2c] py-[11px] last:border-b-0"
              >
                <div
                  className={`mt-[1px] grid h-[28px] w-[28px] shrink-0 place-items-center rounded-[4px] text-[.75rem] ${act.iconColorClass}`}
                >
                  {act.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[.78rem] leading-[1.4] text-[#97918b]">
                    {act.text}
                  </div>
                  <div className="mt-[3px] font-mono text-[7px] tracking-[1px] text-[#cdc3b8]">
                    {act.time}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
  );
}

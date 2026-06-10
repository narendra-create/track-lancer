"use client";
import { motion } from "motion/react";
import { fadeRight, staggerContainer } from "../lib/animations";
export type comparecard = {
  Yellowtitle: string;
  Maintitle1: string;
  Maintitle2: string;
  Features: string[];
};

export function Comparecard({
  item,
  viewPort,
}: {
  item: comparecard;
  viewPort: object;
}) {
  return (
    <div className="p-5 flex flex-col lg:w-180 bg-brand-bg">
      <h3 className="text-accent font-mono text-[9px] tracking-widest py-3">
        {item?.Yellowtitle}
      </h3>
      <h2 className="text-xl font-serif">{item?.Maintitle1}</h2>
      <h2 className="text-xl font-serif mb-2">{item?.Maintitle2}</h2>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewPort}
      >
        {item.Features &&
          item.Features.map((feature, i) => {
            return (
              <motion.p
                className="flex items-center gap-2 border-b-[0.2px] mb-2 py-2 text-[12px] text-ink-muted border-ink-muted/60"
                key={i}
                variants={fadeRight}
              >
                <span className="flex items-center leading-none text-[18px] mb-1.5 text-accent-dim">
                  ⇾
                </span>
                <span>{feature}</span>
              </motion.p>
            );
          })}
      </motion.div>
    </div>
  );
}

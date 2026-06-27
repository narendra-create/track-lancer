import React from "react";
import type { LucideIcon } from "lucide-react";

export type statcardprop = {
  icon: LucideIcon;
  trendtype: "SUCCESS" | "NEUTRAL" | "WARNING" | "MONEY";
  trendtext: string;
  statnumber: string;
  supporttext1: string;
  supporttext2?: string;
};

type cardprop = {
  prop: statcardprop;
};

const StatCardFreelancer = ({ prop }: cardprop) => {
  const trendcolors = {
    SUCCESS: {
      bg: "bg-dash-green-bg",
      text: "text-dash-green",
      iconbg: "bg-dash-green-bg",
    },
    MONEY: {
      bg: "bg-dash-green-bg",
      text: "text-dash-green",
      iconbg: "bg-dash-gold-glow2",
    },
    NEUTRAL: {
      bg: "bg-neutral-800",
      text: "text-dash-ink3",
      iconbg: "bg-dash-surface3",
    },
    WARNING: {
      bg: "bg-dash-red-bg",
      text: "text-dash-red",
      iconbg: "bg-dash-amber-bg",
    },
  };
  const Icon = prop.icon;

  return (
    <section className="hover:bg-dash-surface2 hover:border-t-dash-gold hover:border-t-2 transition-all ease-in-out duration-200 border border-t-2 bg-dash-surface1 border-dash-border rounded-lg w-full h-full flex flex-col gap-2 p-5">
      <div className="flex flex-row w-full justify-between items-center">
        <div
          className={`${trendcolors[prop.trendtype].iconbg} text-md flex items-center justify-center w-10 h-10 rounded-xl`}
        >
          <Icon />
        </div>
        <div
          className={`flex items-center justify-center ${trendcolors[prop.trendtype].bg} ${trendcolors[prop.trendtype].text} h-6 px-2 text-sm rounded-2xl`}
        >
          {prop.trendtext}
        </div>
      </div>
      <div className="font-serif text-dash-gold text-xl">{prop.statnumber}</div>
      <div className="text-ink-muted text-md">
        <span>{prop.supporttext1}</span>
        {prop.supporttext2 && <span>- {prop.supporttext2}</span>}
      </div>
    </section>
  );
};

export default StatCardFreelancer;

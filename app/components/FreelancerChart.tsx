"use client";
import { useState } from "react";

export type ChartDataPoint = {
  label: string;
  earned: number;
  paidOut: number;
  isCurrent?: boolean;
  key?: string;
};

export default function RavenueChart({
  monthlyData,
  weeklyData,
}: {
  monthlyData: ChartDataPoint[];
  weeklyData: ChartDataPoint[];
}) {
  const [view, setView] = useState<"Monthly" | "Weekly">("Monthly");

  const data = view === "Monthly" ? monthlyData : weeklyData;

  const maxVal =
    data && Math.max(...data.map((d) => Math.max(d.earned, d.paidOut)));

  const roundingFactor = view === "Monthly" ? 50000 : 10000;
  const chartMax = Math.ceil((maxVal * 1.1) / roundingFactor) * roundingFactor;

  const formatCurrency = (val: number) => {
    if (val >= 100000)
      return `₹${Number(val / 100000)
        .toString()
        .replace(/\.0$/, "")}L`;
    if (val >= 1000)
      return `₹${Number(val / 1000)
        .toString()
        .replace(/\.0$/, "")}K`;
    if (val === 0) return "0";
    return `₹${val}`;
  };

  const generatedTicks = [
    chartMax,
    chartMax * 0.75,
    chartMax * 0.5,
    chartMax * 0.25,
    0,
  ];

  return (
    <div className="bg-dash-surface1 border border-dash-border rounded-[6px] overflow-hidden">
      <div className="px-5 py-4 border-b border-dash-border flex items-center justify-between gap-3">
        <div>
          <div className="font-serif text-[15.2px] lg:text-[25px] text-dash-ink tracking-tight">
            Revenue Overview
          </div>
          <div className="font-mono text-[7.5px] lg:text-[14px] tracking-[1px] uppercase text-dash-ink3 mt-0.5">
            Earnings vs payouts — 2026
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView("Weekly")}
            className={`px-3 py-1.5 text-[11.5px] rounded-[4px] flex items-center gap-1.5 font-sans font-semibold transition-all duration-150 ${view === "Weekly" ? "bg-dash-gold text-[#0d0d0d]" : "bg-dash-surface2 border border-dash-border text-dash-ink3 hover:border-dash-border-hover hover:text-dash-ink2 hover:bg-dash-surface3"}`}
          >
            Weekly
          </button>
          <button
            onClick={() => setView("Monthly")}
            className={`px-3 py-1.5 text-[11.5px] rounded-[4px] flex items-center gap-1.5 font-sans font-semibold transition-all duration-150 ${view === "Monthly" ? "bg-dash-gold text-[#0d0d0d]" : "bg-dash-surface2 border border-dash-border text-dash-ink3 hover:border-dash-border-hover hover:text-dash-ink2 hover:bg-dash-surface3"}`}
          >
            Monthly
          </button>
        </div>
      </div>
      <div className="p-5">
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-[5px] text-[12px] lg:text-[14px] text-dash-ink3">
            <div className="w-[7px] h-[7px] lg:w-[14px] lg:h-[14px] rounded-[2px] bg-dash-gold"></div>{" "}
            Earned
          </div>
          <div className="flex items-center gap-[5px] text-[12px] lg:text-[14px] text-dash-ink3">
            <div className="w-[7px] h-[7px] lg:w-[14px] lg:h-[14px] rounded-[2px] bg-dash-gold-dim"></div>{" "}
            Paid Out
          </div>
        </div>

        <div className="flex w-full">
          <div className="flex flex-col justify-between h-[140px] mr-2 shrink-0">
            {generatedTicks &&
              generatedTicks.map((tick, i) => (
                <div
                  key={i}
                  className="font-mono text-[9px] lg:text-[13px] text-ink-dim text-right whitespace-nowrap leading-none translate-y-1/2 first:-translate-y-0 last:-translate-y-1"
                >
                  {formatCurrency(tick)}
                </div>
              ))}
          </div>

          <div
            className="flex items-end gap-2 flex-1 overflow-x-auto min-w-0 pb-1"
            style={{ scrollbarWidth: "none" }}
          >
            {data &&
              data.map((d, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center min-w-[32px] lg:min-w-0"
                >
                  <div className="flex gap-[3px] items-end w-full h-[140px]">
                    <div
                      className="flex-1 rounded-t-[3px] transition-all duration-150 cursor-pointer hover:brightness-125"
                      style={{
                        height: `${(d.earned / chartMax) * 100}%`,
                        background:
                          "linear-gradient(180deg, #c8a96e 0%, rgba(200,169,110,0.4) 100%)",
                        boxShadow: d.isCurrent
                          ? "0 0 12px rgba(200,169,110,0.3)"
                          : "none",
                      }}
                      title={`Earned: ₹${d.earned.toLocaleString()}`}
                    ></div>
                    <div
                      className="flex-1 rounded-t-[3px] transition-all duration-150 cursor-pointer hover:brightness-125"
                      style={{
                        height: `${(d.paidOut / chartMax) * 100}%`,
                        background:
                          "linear-gradient(180deg, #9c7d45 0%, rgba(156,125,69,0.3) 100%)",
                      }}
                      title={`Paid Out: ₹${d.paidOut.toLocaleString()}`}
                    ></div>
                  </div>
                  <div
                    className={`mt-1.5 font-mono text-[7px] lg:text-[10px] tracking-[1px] uppercase whitespace-nowrap ${d.isCurrent ? "text-dash-gold" : "text-dash-ink4 lg:text-ink-dim"}`}
                  >
                    {d.label} {d.isCurrent && "●"}
                  </div>
                  <div
                    className={`mt-1 text-center font-mono text-[7px] lg:text-[11px] whitespace-nowrap ${d.isCurrent ? "text-dash-gold" : "text-dash-ink4 lg:text-ink-dim"}`}
                  >
                    {formatCurrency(d.earned)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

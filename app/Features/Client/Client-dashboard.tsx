"use client";

import { motion } from "motion/react";
import { Briefcase, Hourglass, AlertCircle, CircleCheck } from "lucide-react";
import StatCardFreelancer from "@/app/components/Cards/StatCardFreelancer";
import type { statcardprop } from "@/app/components/Cards/StatCardFreelancer";
import {
  Primarydashboardbutton,
  Seconddashboardbutton,
} from "@/app/components/Buttons/Dashboardbuttons";
import { staggerContainer, scaleIn, fadeUp, fadeLeft } from "@/app/lib/animations";
import ClientActiveProjects from "@/app/components/client/ClientActiveProjects";
import type { ClientDashboardProject } from "@/app/components/client/ClientActiveProjects";
import ClientActivity from "@/app/components/client/ClientActivity";
import type { ClientActivityItem } from "@/app/components/client/ClientActivity";
import ClientUpcomingDeadlines from "@/app/components/client/ClientUpcomingDeadlines";
import type { ClientDeadlineItem } from "@/app/components/client/ClientUpcomingDeadlines";

export type ClientDashboardData = {
  name: string;
  activeProjects: ClientDashboardProject[];
  deadlines: ClientDeadlineItem[];
  activity: ClientActivityItem[];
  stats: {
    activeCount: number;
    totalPaid: number;
    pendingAmount: number;
    pendingDueCount: number;
    completedCount: number;
  };
};

type BudgetProject = {
  id: string;
  title: string;
  paid: number;
  total: number;
  status: "ACTIVE" | "PENDING" | "STOPPED";
};

const STATUS_BAR: Record<BudgetProject["status"], string> = {
  ACTIVE: "bg-[var(--color-dash-green)]",
  PENDING: "bg-[var(--color-dash-gold)]",
  STOPPED: "bg-[var(--color-dash-amber)]",
};

function BudgetSnapshot({ projects }: { projects: ClientDashboardProject[] }) {
  const budgetProjects: BudgetProject[] = projects.map((p) => ({
    id: p.id,
    title: p.title,
    paid: p.paid,
    total: p.agreedCost,
    status: (p.status === "ACTIVE" || p.status === "PENDING" || p.status === "STOPPED")
      ? p.status
      : "ACTIVE",
  }));

  const totalCommitted = budgetProjects.reduce((s, p) => s + p.total, 0);
  const totalPaid = budgetProjects.reduce((s, p) => s + p.paid, 0);
  const totalRemaining = totalCommitted - totalPaid;

  return (
    <div className="bg-dash-surface1 border border-dash-border rounded-lg p-5 lg:p-6">
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="font-mono text-[9px] lg:text-[11px] uppercase tracking-[2px] text-dash-ink3 mb-1">
            Budget Snapshot
          </p>
          <p className="font-serif text-[22px] lg:text-[30px] text-dash-gold">
            ₹{totalCommitted.toLocaleString("en-IN")}
          </p>
          <p className="font-mono text-[9px] lg:text-[11px] text-dash-ink3 mt-0.5">
            total committed across {budgetProjects.length} projects
          </p>
        </div>
        <div className="text-right">
          <div className="flex gap-6">
            <div>
              <p className="font-mono text-[9px] lg:text-[11px] uppercase tracking-[1.5px] text-dash-ink3 mb-0.5">
                Paid
              </p>
              <p className="font-mono text-[14px] lg:text-[18px] text-dash-green font-semibold">
                ₹{totalPaid.toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <p className="font-mono text-[9px] lg:text-[11px] uppercase tracking-[1.5px] text-dash-ink3 mb-0.5">
                Remaining
              </p>
              <p className="font-mono text-[14px] lg:text-[18px] text-dash-amber font-semibold">
                ₹{totalRemaining.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {budgetProjects.map((p, i) => {
          const pct = p.total > 0 ? Math.round((p.paid / p.total) * 100) : 0;
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.07 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-sans text-[11px] lg:text-[13px] text-dash-ink2 truncate max-w-[55%]">
                  {p.title}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] lg:text-[11px] text-dash-ink3">
                    ₹{p.paid.toLocaleString("en-IN")} / ₹{p.total.toLocaleString("en-IN")}
                  </span>
                  <span className="font-mono text-[9px] lg:text-[11px] text-dash-ink4">
                    {pct}%
                  </span>
                </div>
              </div>
              <div className="w-full h-[3px] bg-dash-surface3 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${STATUS_BAR[p.status]}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1 + 0.2, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning,";
  if (h < 17) return "Good afternoon,";
  return "Good evening,";
};

const ClientDashboard = ({ data }: { data: ClientDashboardData }) => {
  const viewPort = { once: true, amount: 0.2 };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });

  const stats: statcardprop[] = [
    {
      icon: Briefcase,
      statnumber: String(data.stats.activeCount),
      supporttext1: "Active Projects",
      trendtype: "SUCCESS",
      trendtext: "In progress",
    },
    {
      icon: Hourglass,
      statnumber: `₹${data.stats.totalPaid.toLocaleString("en-IN")}`,
      supporttext1: "Total Paid",
      supporttext2: "This year",
      trendtype: "MONEY",
      trendtext: "↑ 18%",
    },
    {
      icon: AlertCircle,
      statnumber: `₹${data.stats.pendingAmount.toLocaleString("en-IN")}`,
      supporttext1: "Pending Amount",
      trendtype: "WARNING",
      trendtext: `${data.stats.pendingDueCount} due`,
    },
    {
      icon: CircleCheck,
      statnumber: String(data.stats.completedCount),
      supporttext1: "Completed",
      trendtype: "NEUTRAL",
      trendtext: "All time",
    },
  ];

  return (
    <motion.main className="bg-brand-bg">
      <section className="mx-2 flex flex-col lg:flex-row gap-4 mb-6 lg:justify-between">
        <div className="mt-5 mx-2.5">
          <h4 className="hero-tag">CLIENT DASHBOARD</h4>
          <div className="flex flex-col gap-0.5">
            <h1 className="font-serif text-2xl text-ink">
              {getGreeting()} {data.name}
            </h1>
            <h1 className="font-sans text-[13px] text-ink-muted">
              {today} • {data.stats.activeCount} active projects
            </h1>
          </div>
        </div>
        <div className="flex lg:items-center lg:justify-center gap-3 max-w-68 lg:max-w-none ml-3">
          <Seconddashboardbutton href="/client/all-projects">
            All Projects
          </Seconddashboardbutton>
          <Primarydashboardbutton href="/client/accept-project">
           <b>+</b> New Project
          </Primarydashboardbutton>
        </div>
      </section>

      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="mx-2 my-2 lg:my-4 grid grid-cols-2 lg:grid-cols-4 gap-2"
      >
        {stats.map((item, i) => (
          <motion.div variants={scaleIn} key={i}>
            <StatCardFreelancer prop={item} />
          </motion.div>
        ))}
      </motion.section>

      <motion.section
        variants={staggerContainer}
        whileInView="show"
        initial="hidden"
        viewport={viewPort}
        className="mx-2 my-4"
      >
        <motion.div
          variants={fadeUp}
          whileInView="show"
          initial="hidden"
          viewport={viewPort}
        >
          <BudgetSnapshot projects={data.activeProjects} />
        </motion.div>
      </motion.section>

      <motion.section
        variants={staggerContainer}
        whileInView="show"
        initial="hidden"
        viewport={viewPort}
        className="flex flex-col lg:flex-row justify-center gap-3 mx-2 mt-2 mb-18"
      >
        <motion.div
          variants={fadeUp}
          whileInView="show"
          initial="hidden"
          viewport={viewPort}
          className="lg:w-[75%]"
        >
          <ClientActiveProjects projects={data.activeProjects} />
        </motion.div>

        <motion.div
          variants={fadeLeft}
          whileInView="show"
          initial="hidden"
          viewport={viewPort}
          className="lg:w-[25%] flex flex-col gap-4"
        >
          <ClientUpcomingDeadlines items={data.deadlines} />
          <ClientActivity items={data.activity} />
        </motion.div>
      </motion.section>
    </motion.main>
  );
};

export default ClientDashboard;

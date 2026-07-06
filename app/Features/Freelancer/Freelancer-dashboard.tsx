"use client";
import StatCardFreelancer from "@/app/components/Cards/StatCardFreelancer";
import { Folder, Hourglass, Users, Wallet } from "lucide-react";
import type { statcardprop } from "@/app/components/Cards/StatCardFreelancer";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import {
  Primarydashboardbutton,
  Seconddashboardbutton,
} from "@/app/components/Buttons/Dashboardbuttons";
import TodayTasks from "@/app/components/freelancer/FreelancerTodo";
import FreelancerActivity from "@/app/components/freelancer/FreelancerActivity";
import {
  CurrentClientcard,
  Dummycard,
} from "@/app/components/Cards/CurrentClientcard";
import {
  fadeLeft,
  fadeUp,
  scaleIn,
  staggerContainer,
} from "@/app/lib/animations";
import RavenueChart from "@/app/components/freelancer/FreelancerChart";
import { FreelancerDashboardData } from "@/types/dashboard";
import type { LoadMoreResult } from "@/types/dashboard";
import { useState } from "react";
import ProjectCardSkeleton from "@/app/components/Cards/ProjectCardSkeleton";

const FreelancerDashboard = ({
  data,
  loadmore,
}: {
  data: FreelancerDashboardData;
  loadmore: (
    nextcursor: string,
  ) => Promise<{ projects: LoadMoreResult; nextCursor: string | null }>;
}) => {
  const [Projects, setProjects] = useState<LoadMoreResult>(data.projects ?? []);
  const [cursor, setcursor] = useState(data.nextCursor);
  const [loading, setloading] = useState(false);

  const viewPort = {
    once: true,
    amount: 0.2,
  };

  const loadmoreclientfunction = async (nextcursor: string) => {
    setloading(true);
    try {
      const result = await loadmore(nextcursor);
      setProjects((prev) => [...prev, ...result.projects]);
      setcursor(result.nextCursor);
    } catch (err) {
      console.log(err);
      return;
    } finally {
      setloading(false);
    }
  };

  const stats: statcardprop[] = [
    {
      icon: Wallet,
      statnumber: `₹${data.moneyStats.currentmonthearning.toLocaleString("en-IN")}`,
      supporttext1: "Total Earnings",
      supporttext2: `- ${new Date().toLocaleString("en-US", { month: "long" })}`,
      trendtext: `${data.moneyStats.trendpercentage >= 0 ? "↑" : "↓"} ${Math.abs(data.moneyStats.trendpercentage)}%`,
      trendtype: "MONEY",
    },
    {
      icon: Users,
      statnumber: String(data.clientCount),
      supporttext1: "Clients Served",
      trendtype: "NEUTRAL",
      trendtext: "All time",
    },
    {
      icon: Hourglass,
      statnumber: `₹${data.moneyStats.due.toLocaleString("en-IN")}`,
      supporttext1: "Payment Remaining",
      trendtype: data.moneyStats.pendingcount > 0 ? "WARNING" : "SUCCESS",
      trendtext:
        data.moneyStats.pendingcount > 0
          ? `${data.moneyStats.pendingcount} Pending`
          : "All clear",
    },
    {
      icon: Folder,
      statnumber: String(data.moneyStats.activeprojects),
      supporttext1: "Active Projects",
      trendtype: "SUCCESS",
      trendtext: "In progress",
    },
  ];

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });

  return (
    <motion.main className="bg-brand-bg">
      <section className="mx-2 flex flex-col lg:flex-row gap-4 mb-6 lg:justify-between">
        <div className="mt-5 mx-2.5">
          <h4 className="hero-tag">FREELANCER DASHBOARD</h4>
          <div className="flex flex-col gap-0.5">
            <h1 className="font-serif text-2xl text-ink">
              Good Morning {data.name}
            </h1>
            <h1 className="font-sans text-[13px] text-ink-muted">
              `{today} • {data.projects?.length} Active projects`
            </h1>
          </div>
        </div>
        <div className="flex lg:items-center lg:justify-center gap-3 max-w-68 lg:max-w-none ml-3">
          <Seconddashboardbutton href="/freelancer/past-projects">
            Past projects
          </Seconddashboardbutton>
          <Primarydashboardbutton href="/freelancer/new-project">
            + Create New Project
          </Primarydashboardbutton>
        </div>
      </section>
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="mx-2 my-2 lg:my-4 grid grid-cols-2 lg:grid-cols-4 gap-2"
      >
        {stats &&
          stats.map((item, i) => {
            return (
              <motion.div variants={scaleIn} key={i}>
                <StatCardFreelancer prop={item} />
              </motion.div>
            );
          })}
      </motion.section>
      <motion.section
        variants={staggerContainer}
        whileInView="show"
        initial="hidden"
        viewport={viewPort}
        className="my-5 mx-2 flex flex-col lg:flex-row gap-2 pb-4"
      >
        <motion.div
          variants={fadeUp}
          whileInView="show"
          initial="hidden"
          viewport={viewPort}
          className="lg:w-[75%]"
        >
          <RavenueChart
            monthlyData={data.ravenuechartdata.monthly}
            weeklyData={data.ravenuechartdata.weekly}
          />
        </motion.div>
        <motion.div
          variants={fadeLeft}
          whileInView="show"
          initial="hidden"
          viewport={viewPort}
          className="lg:w-[25%] lg:h-89 overflow-y-auto custom-scrollbar"
        >
          <TodayTasks />
        </motion.div>
      </motion.section>
      <motion.section
        whileInView="show"
        viewport={viewPort}
        initial="hidden"
        variants={staggerContainer}
        className="flex flex-col lg:flex-row justify-center gap-3 mx-2 mt-2 mb-18"
      >
        <div className="lg:w-[75%]">
          <div className="flex justify-between pr-4 pl-2 mb-3 items-center">
            <h3 className="text-md lg:text-lg font-serif text-ink flex items-center">
              Active clients
            </h3>
            <h4 className="text-ink text-[11px] flex items-center">
              View all →
            </h4>
          </div>
          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
            {Projects &&
              Projects.map((project, i) => {
                return (
                  <Link
                    key={project.id}
                    href={`/freelancer/milestones/${project.id}`}
                    className="block"
                  >
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut",
                        delay: i * 0.07,
                      }}
                    >
                      <CurrentClientcard project={project} />
                    </motion.div>
                  </Link>
                );
              })}
            <div className="w-full h-48">
              <Dummycard />
            </div>
            <AnimatePresence>
              {loading &&
                [0, 1].map((i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, delay: i * 0.07 }}
                  >
                    <ProjectCardSkeleton />
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
          {cursor && !loading && (
            <motion.div
              variants={fadeUp}
              whileInView="show"
              initial="hidden"
              viewport={viewPort}
              className="col-span-2 flex justify-center mt-8 mb-1"
            >
              <button
                type="button"
                onClick={() => loadmoreclientfunction(cursor)}
                className="group flex items-center gap-2 px-6 py-2.5 rounded-full border border-dash-border bg-dash-surface1 text-ink-muted text-[13px] font-sans transition-all duration-200 hover:border-brand-surface hover:text-ink hover:bg-dash-surface1/60 active:scale-95"
              >
                <span className="transition-transform duration-200 group-hover:translate-y-0.5">
                  ↓
                </span>
                Load more projects
              </button>
            </motion.div>
          )}
        </div>
        <motion.div variants={fadeLeft} className="lg:w-[25%] mt-1">
          <FreelancerActivity />
        </motion.div>
      </motion.section>
    </motion.main>
  );
};

export default FreelancerDashboard;

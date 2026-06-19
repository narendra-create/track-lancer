"use client";
import StatCardFreelancer from "@/app/components/Cards/StatCardFreelancer";
import { Folder, Hourglass, Users, Wallet } from "lucide-react";
import type { statcardprop } from "@/app/components/Cards/StatCardFreelancer";
import { motion } from "motion/react";
import {
  Primarydashboardbutton,
  Seconddashboardbutton,
} from "@/app/components/Buttons/Dashboardbuttons";
import {
  fadeLeft,
  fadeRight,
  fadeUp,
  scaleIn,
  staggerContainer,
} from "@/app/lib/animations";
import RavenueChart from "@/app/components/FreelancerChart";
import type { ChartDataPoint } from "@/app/components/FreelancerChart";

const Dashboard = () => {
  const viewPort = {
    once: true,
    amount: 0.2,
  };
  const monthlyData: ChartDataPoint[] = [
    { label: "Jan", earned: 92000, paidOut: 60000 },
    { label: "Feb", earned: 110000, paidOut: 76000 },
    { label: "Mar", earned: 128000, paidOut: 90000 },
    { label: "Apr", earned: 144000, paidOut: 104000 },
    { label: "May", earned: 162000, paidOut: 116000 },
    { label: "Jun", earned: 184200, paidOut: 120000, isCurrent: true },
    { label: "Jul", earned: 150000, paidOut: 110000 },
    { label: "Aug", earned: 175000, paidOut: 130000 },
    { label: "Sep", earned: 190000, paidOut: 140000 },
    { label: "Oct", earned: 210000, paidOut: 150000 },
    { label: "Nov", earned: 230000, paidOut: 170000 },
    { label: "Dec", earned: 250000, paidOut: 180000 },
  ];

  const weeklyData: ChartDataPoint[] = [
    { label: "Week 1", earned: 45000, paidOut: 30000 },
    { label: "Week 2", earned: 52000, paidOut: 35000 },
    { label: "Week 3", earned: 48000, paidOut: 32000 },
    { label: "Week 4", earned: 60000, paidOut: 40000, isCurrent: true },
  ];

  const demostats: statcardprop[] = [
    {
      icon: Wallet,
      statnumber: "₹1,84,000",
      supporttext1: "Total Earnings",
      supporttext2: "- June",
      trendtext: "↑ 12.5%",
      trendtype: "MONEY",
    },
    {
      icon: Users,
      statnumber: "24",
      supporttext1: "Clients Served",
      trendtype: "NEUTRAL",
      trendtext: "All time",
    },
    {
      icon: Hourglass,
      statnumber: "₹68,000",
      supporttext1: "Payment Remaining",
      trendtype: "WARNING",
      trendtext: "2 Pending",
    },
    {
      icon: Folder,
      statnumber: "3",
      supporttext1: "Active Projects",
      trendtype: "SUCCESS",
      trendtext: "2 New",
    },
  ];
  return (
    <motion.main className="bg-brand-surface">
      <section className="mx-2 flex flex-col lg:flex-row gap-4 mb-6 lg:justify-between">
        <div className="mt-5 mx-2.5">
          <h4 className="hero-tag">FREELANCER DASHBOARD</h4>
          <div className="flex flex-col gap-0.5">
            <h1 className="font-serif text-2xl text-ink">Good Morning Dummy</h1>
            <h1 className="font-sans text-[13px] text-ink-muted">
              Friday, June 19 2026 • 3 Active projects
            </h1>
          </div>
        </div>
        <div className="flex lg:items-center lg:justify-center gap-3 max-w-68 lg:max-w-none ml-3">
          <Seconddashboardbutton href="/past-projects">
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
        className="mx-2 my-2 grid grid-cols-2 gap-2"
      >
        {demostats &&
          demostats.map((item, i) => {
            return (
              <motion.div variants={scaleIn} key={i}>
                <StatCardFreelancer prop={item} />
              </motion.div>
            );
          })}
      </motion.section>
      <motion.section
        variants={fadeUp}
        whileInView="show"
        initial="hidden"
        viewport={viewPort}
        className="my-5 mx-2"
      >
        <RavenueChart monthlyData={monthlyData} weeklyData={weeklyData} />
      </motion.section>
    </motion.main>
  );
};

export default Dashboard;

"use client";
import React from "react";
import StatCardFreelancer from "@/app/components/Cards/StatCardFreelancer";
import { Folder, Hourglass, Users, Wallet } from "lucide-react";
import type { statcardprop } from "@/app/components/Cards/StatCardFreelancer";

const Dashboard = () => {
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
    <main className="bg-brand-surface">
      <div className="mx-2 my-2 grid grid-cols-2 gap-2">
        {demostats &&
          demostats.map((item, i) => {
            return (
              <div key={i}>
                <StatCardFreelancer prop={item} />
              </div>
            );
          })}
      </div>
    </main>
  );
};

export default Dashboard;

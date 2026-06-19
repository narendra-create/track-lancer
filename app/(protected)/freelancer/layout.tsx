"use client";
import { FreelancerSidebar } from "@/app/components/freelancer-sidebar";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function Freelancerlayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full bg-dash-surface flex-col mt-5">
      <FreelancerSidebar activePath={pathname} />

      {/* Main Content Area (80% width on desktop, 20% left margin) */}
      <main className="flex-1 pb-[80px] lg:ml-[20%] lg:px-3 lg:w-[80%] lg:pb-0">
        {children}
      </main>
    </div>
  );
}

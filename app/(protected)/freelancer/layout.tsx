"use client";
import { FreelancerSidebar } from "@/app/components/freelancer-sidebar";
import { useState, ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function Freelancerlayout({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setisOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full bg-dash-surface flex-col">
      <FreelancerSidebar
        isOpen={isOpen}
        onClose={() => setisOpen(false)}
        activePath={pathname}
      />

      <main className="flex-1 pb-[80px] md:pb-0">{children}</main>
    </div>
  );
}

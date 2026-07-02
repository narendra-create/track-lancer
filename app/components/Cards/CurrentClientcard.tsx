import React from "react";
import { ClientProgressBar } from "../Currentclientprogressbar";
import { AvatarInitials } from "../Initials";
import type { DashboardProject } from "@/types/dashboard";
import { formatMoney, getInitials } from "@/app/lib/utilitys";
import { redirect } from "next/navigation";
import Link from "next/link";

export const CurrentClientcard = ({
  project,
}: {
  project: DashboardProject;
}) => {
  const initials = getInitials(project.client.user.name);
  const varient =
    project.status === "STOPPED"
      ? "amber"
      : project.stats.progress >= 50
        ? "green"
        : "gold";
  return (
    <section className="flex flex-col bg-dash-surface1 rounded-md border border-dash-border hover:border-brand-surface hover:bg-dash-surface1/20 transition-all ease-in-out duration-200 p-5 lg:p-4">
      <div className="flex justify-between">
        <div className="flex gap-3 items-top">
          <div className="mt-1">
            <AvatarInitials initials={initials} variant="gold" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-serif text-lg lg:text-md text-gray-300 text-shadow-2xs text-shadow-accent">
              {project.client.user.name}
            </h3>
            <p className="text-[11px] lg:text-[9px] font-sans text-ink-muted">
              {project.title.toUpperCase()}
            </p>
          </div>
        </div>
        <div
          className={`gap-1.5 font-sans font-semibold text-[12px] rounded-full flex items-center justify-center px-3 h-6 ${
            project.status === "ACTIVE"
              ? "bg-dash-green-bg text-dash-green/70"
              : project.status === "STOPPED"
                ? "bg-dash-amber-bg text-dash-amber/70"
                : project.status === "CANCELLED"
                  ? "bg-dash-red-bg text-dash-red/70"
                  : "bg-[var(--color-dash-surface3)] text-dash-ink3"
          }`}
        >
          <span className="font-bold text-lg">•</span>
          <span>{project.status.toUpperCase()}</span>
        </div>
      </div>
      <div className="flex justify-evenly my-3">
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-lg text-accent font-serif">
            ₹{formatMoney(project.money.totalAmount)}
          </h3>
          <p className="text-sm text-ink-muted font-sans">VALUE</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-lg text-dash-green font-serif">
            ₹{formatMoney(project.money.received)}
          </h3>
          <p className="text-sm text-ink-muted font-sans">RECEIVED</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-lg text-dash-amber font-serif">
            ₹{formatMoney(project.money.remaining)}
          </h3>
          <p className="text-sm text-ink-muted font-sans">REMAINING</p>
        </div>
      </div>
      <div className="mt-1.5 lg:mt-1.5">
        <ClientProgressBar
          dueDate={
            project.stats.projectDeadline
              ? project.stats.projectDeadline.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "_"
          }
          milestonesCompleted={project.stats.completedMilestones}
          progress={project.stats.progress}
          totalMilestones={project.stats.totalMilestones}
          variant={varient}
        />
      </div>
    </section>
  );
};

export const Dummycard = () => {
  return (
    <Link href={`/freelancer/new-project`}>
      <section
        onClick={() => redirect("/freelancer/new-project")}
        className="bg-dash-surface1 hover:bg-dash-surface1/30 transition-all ease-in-out duration-200 hover:text-dash-ink4 flex flex-col border border-dashed border-dash-border text-ink-muted/60 h-full w-full items-center justify-center rounded-md p-5"
      >
        <h3>+</h3>
        <h3>New Project</h3>
      </section>
    </Link>
  );
};

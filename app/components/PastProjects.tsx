import React from "react";
import { PastProjectCard, PastProjectCardProps } from "./Cards/PastProjectCard";

// PROPS
export interface PastProjectsProps {
  projects: Omit<PastProjectCardProps, "role">[];
  role: "client" | "freelancer";
}

// MAIN COMPONENT
export function PastProjects({ projects, role }: PastProjectsProps) {
  return (
    // CONTAINER
    <div className="w-full flex flex-col">
      {/* HEADER SECTION */}
      <div className="mb-6">
        <h1 className="text-[var(--color-dash-gold)] font-serif text-[28px] font-bold mb-1">
          Past Projects
        </h1>
        <p className="text-[var(--color-dash-ink3)] font-mono text-[10px] tracking-[2px] uppercase mb-4">
          COMPLETED
        </p>
        <div className="w-full h-[1px] bg-[var(--color-dash-border)]" />
      </div>

      {/* PROJECTS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 lg:px-4 px-2 gap-4 w-full">
        {projects && projects.length > 0 ? (
          projects.map((project) => (
            <PastProjectCard key={project.id} {...project} role={role} />
          ))
        ) : (
          <p className="text-[var(--color-dash-ink3)] font-mono text-sm">
            No past projects found.
          </p>
        )}
      </div>
    </div>
  );
}

"use client";
import React, { useState, useMemo } from "react";
import type {
  ClientPastProject,
  FreelancerPastProject,
} from "@/types/pastprojects";
import { PastProjectCard } from "./Cards/PastProjectCard";

// PROPS
export interface PastProjectsProps {
  projects: ClientPastProject[] | FreelancerPastProject[];
  role: "CLIENT" | "FREELANCER";
  nextCursor?: string | null;
  loadmore: (nextcursor: string) => Promise<{
    projects: ClientPastProject[] | FreelancerPastProject[];
    nextCursor: string | null;
  }>;
}

// MAIN COMPONENT
export function PastProjects({
  projects: initialProjects,
  role,
  nextCursor: initialCursor,
  loadmore,
}: PastProjectsProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [cursor, setCursor] = useState(initialCursor ?? null);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<string>("createdAt-desc");

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      if (sortBy === "createdAt-desc") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "createdAt-asc") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === "updatedAt-desc") {
        return new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime();
      }
      if (sortBy === "updatedAt-asc") {
        return new Date(a.completionDate).getTime() - new Date(b.completionDate).getTime();
      }
      if (sortBy === "money-desc") {
        return b.paidAmount - a.paidAmount;
      }
      if (sortBy === "money-asc") {
        return a.paidAmount - b.paidAmount;
      }
      return 0;
    });
  }, [projects, sortBy]);

  const handleLoadMore = async () => {
    if (!cursor) return;
    setLoading(true);
    try {
      const result = await loadmore(cursor);
      setProjects((prev) => [...prev, ...result.projects] as typeof projects);
      setCursor(result.nextCursor);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // CONTAINER
    <div className="w-full flex flex-col">
      {/* HEADER SECTION */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[var(--color-dash-gold)] font-serif text-[28px] font-bold mb-1">
            Past Projects
          </h1>
          <p className="text-[var(--color-dash-ink3)] font-mono text-[10px] tracking-[2px] uppercase mb-4">
            COMPLETED
          </p>
        </div>

        {/* FILTER UI SECTION */}
        <div className="mb-4 md:mb-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-dash-surface3 border border-dash-border text-ink-dim text-sm rounded-md px-3 py-2 outline-none focus:border-brand-surface transition-colors font-sans"
          >
            <option value="createdAt-desc">Newest Created</option>
            <option value="createdAt-asc">Oldest Created</option>
            <option value="updatedAt-desc">Most Recently Updated</option>
            <option value="updatedAt-asc">Least Recently Updated</option>
            <option value="money-desc">Highest Paid</option>
            <option value="money-asc">Lowest Paid</option>
          </select>
        </div>
      </div>
      <div className="w-full h-[1px] bg-[var(--color-dash-border)] mb-6" />

      {/* PROJECTS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 lg:px-4 px-2 gap-4 w-full">
        {sortedProjects && sortedProjects.length > 0 ? (
          sortedProjects.map((project) => (
            <PastProjectCard key={project.id} {...project} role={role} />
          ))
        ) : (
          <p className="text-[var(--color-dash-ink3)] font-mono text-sm">
            No past projects found.
          </p>
        )}
      </div>

      {/* LOAD MORE */}
      {cursor && !loading && (
        <div className="flex justify-center mt-8 mb-1">
          <button
            type="button"
            onClick={handleLoadMore}
            className="group flex items-center gap-2 px-6 py-2.5 rounded-full border border-dash-border bg-dash-surface1 text-ink-muted text-[13px] font-sans transition-all duration-200 hover:border-brand-surface hover:text-ink hover:bg-dash-surface1/60 active:scale-95"
          >
            <span className="transition-transform duration-200 group-hover:translate-y-0.5">↓</span>
            Load more projects
          </button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center mt-8">
          <span className="text-[var(--color-dash-ink3)] font-mono text-[12px] tracking-widest uppercase animate-pulse">
            Loading...
          </span>
        </div>
      )}
    </div>
  );
}

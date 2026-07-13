import ClientDashboard from "@/app/Features/Client/Client-dashboard";
import { DUMMY_CLIENT_DASHBOARD } from "@/app/components/seeds/ClientDashboardSeed";
import type { ClientDashboardData } from "@/app/Features/Client/Client-dashboard";
import { getClientStats } from "@/app/lib/Batch-Fetch/ClientDashboardStats";
import {
  getClientCurrentProjects,
  getDeadlines,
} from "@/app/lib/controllers/clientStatsController";
import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import { resumeProject } from "@/app/lib/controllers/ProjectController";

const Dashboard = async () => {
  const result = await getClientStats();
  if (!result.success) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="bg-[var(--color-dash-surface1)] border border-[var(--color-dash-red-border)] rounded-xl p-8 max-w-md w-full flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--color-dash-red-bg)] flex items-center justify-center mb-6">
            <span className="text-[var(--color-dash-red)] text-2xl">⚠️</span>
          </div>
          <h2 className="font-serif text-2xl text-white mb-2">
            Failed to Load Dashboard
          </h2>
          <p className="font-sans text-[13px] text-dash-ink2/80 mb-6">
            {result.error || "An unexpected error occurred."}
          </p>
          <a
            href="/"
            className="px-6 py-2.5 bg-transparent border border-[var(--color-dash-border-hover)] rounded-md text-white font-mono text-[11px] uppercase tracking-[1.5px] hover:bg-[var(--color-dash-surface2)] hover:border-[var(--color-dash-ink3)] transition-all duration-200"
          >
            Return Home
          </a>
        </div>
      </main>
    );
  }
  const data: ClientDashboardData = result.data!;

  const loadMoreProjects = async (cursor: string) => {
    "use server";
    const session = await getSession();
    if (!session || session.user.role.toLowerCase() !== "client")
      return { projects: [], nextCursor: null };
    const clientProfile = await prisma.userprofile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });
    if (!clientProfile) return { projects: [], nextCursor: null };

    const res = await getClientCurrentProjects(clientProfile.id, cursor);
    if (!res.success) return { projects: [], nextCursor: null };

    return {
      projects: (res as any).projects.map((p: any) => ({
        id: p.id,
        title: p.title,
        projectcode: p.id.substring(0, 8),
        status: p.status,
        agreedCost: p.money?.totalAmount || 0,
        deadline: p.deadline
          ? new Date(p.deadline).toISOString()
          : new Date().toISOString(),
        freelancerName: p.freelancerName,
        freelancerInitials: p.freelancerInitials,
        freelancerCategory: p.freelancerCategory,
        paid: p.money?.received || 0,
        remaining: p.money?.remaining || 0,
        milestones: p.milestones || [],
      })),
      nextCursor: res.nextCursor as string | null,
    };
  };

  const loadMoreDeadlines = async (cursor: string) => {
    "use server";
    const session = await getSession();
    if (!session || session.user.role.toLowerCase() !== "client")
      return { deadlines: [], nextCursor: null };
    const clientProfile = await prisma.userprofile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });
    if (!clientProfile) return { deadlines: [], nextCursor: null };

    const res = await getDeadlines(clientProfile.id, cursor);
    if (!res.success) return { deadlines: [], nextCursor: null };

    return {
      deadlines: (res as any).milestones,
      nextCursor: (res as any).nextCursor as string | null,
    };
  };

  return (
    <main>
      <ClientDashboard
        data={data}
        loadMoreProjects={loadMoreProjects}
        loadMoreDeadlines={loadMoreDeadlines}
      />
    </main>
  );
};

export default Dashboard;

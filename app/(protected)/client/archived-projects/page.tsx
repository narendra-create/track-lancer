import { getArchivedProjects, processarchiveProject } from "@/app/lib/controllers/ProjectController";
import { getSession } from "@/app/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ClientAllProjects } from "@/app/components/client/ClientAllProjects";
import type { GetAllProjectsResponse } from "@/types/allprojects";

export default async function ClientArchivedProjectsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role.toLowerCase() !== "client") redirect("/unauthorized");

  const result = await getArchivedProjects();
  if (!result.success) {
    return (
      <div className="mx-4 lg:pl-7 lg:pt-10">
        <div className="bg-[var(--color-dash-surface1)] border border-[var(--color-dash-border)] rounded-xl p-6">
          <p className="text-[var(--color-dash-red)]">{result.error}</p>
        </div>
      </div>
    );
  }

  const loadMore = async (cursor: string): Promise<GetAllProjectsResponse> => {
    "use server";
    return await getArchivedProjects(cursor) as GetAllProjectsResponse;
  };

  const handleUnarchive = async (id: string) => {
    "use server";
    const res = await processarchiveProject(id, "UNARCHIVE");
    if (res.success) {
      revalidatePath("/client/archived-projects");
    }
  };

  return (
    <div className="mx-4 lg:pl-7 lg:pt-10 pb-10">
      <ClientAllProjects
        initialProjects={result.projects as any}
        initialNextCursor={result.nextCursor as string | null}
        loadMore={loadMore}
        onArchive={handleUnarchive}
        isArchivedPage={true}
      />
    </div>
  );
}

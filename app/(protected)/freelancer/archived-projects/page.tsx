import { getArchivedProjects, processarchiveProject } from "@/app/lib/controllers/ProjectController";
import { getSession } from "@/app/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { FreelancerAllProjects } from "@/app/components/freelancer/FreelancerAllProjects";
import type { GetAllProjectsResponse } from "@/types/allprojects";

export default async function ArchivedProjectsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role.toLowerCase() !== "freelancer") redirect("/unauthorized");

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

  const handleDelete = async (id: string) => {
    "use server";
    return { success: false, error: "Cannot delete from archived projects" };
  };

  const handleUnarchive = async (id: string) => {
    "use server";
    const res = await processarchiveProject(id, "UNARCHIVE");
    if (res.success) {
      revalidatePath("/freelancer/archived-projects");
    }
  };

  return (
    <div className="mx-4 lg:pl-7 lg:pt-10 pb-10">
      <FreelancerAllProjects
        initialProjects={result.projects as any}
        initialNextCursor={result.nextCursor as string | null}
        loadMore={loadMore}
        handleDelete={handleDelete}
        onArchive={handleUnarchive}
        isArchivedPage={true}
      />
    </div>
  );
}

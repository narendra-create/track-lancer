import React from "react";
import { ClientAllProjects } from "@/app/components/client/ClientAllProjects";
import { getAllProjects } from "@/app/lib/controllers/ProjectController";
import { getSession } from "@/app/lib/session";
import { redirect } from "next/navigation";
import { getClientProfile } from "@/app/lib/controllers/profileController";
import type { GetAllProjectsResponse } from "@/types/allprojects";

const AllProjects = async () => {
  const session = await getSession();
  if (!session) return redirect("/login");
  if (session.user.role.toLowerCase() !== "client") {
    return redirect("/unauthorized");
  }
  const profile = await getClientProfile(session.user.email);
  if (!profile || !profile.profile || !profile.profile.userprofiles)
    return redirect("/unauthorized");
  const result: GetAllProjectsResponse = await getAllProjects(
    profile.profile.userprofiles.id,
    "CLIENT",
  );
  if (!result.success) {
    return { error: `${result.error} - ${result.status}` };
  }
  const projects = result.projects;
  const nextCursor = result.nextCursor;

  const loadmore = async (nextcursor: string) => {
    "use server";
    const session = await getSession();
    if (!session || session.user.role.toLowerCase() !== "client") {
      return { success: false as const, error: "Unauthorized", status: 401 };
    }

    const profile = await getClientProfile(session.user.email);
    if (!profile.profile || !profile.profile.userprofiles)
      return { success: false as const, error: "Unauthorized", status: 401 };
    return (await getAllProjects(
      profile.profile.userprofiles.id,
      "CLIENT",
      nextcursor,
    )) as GetAllProjectsResponse;
  };
  return (
    <main className="mx-4 lg:pl-7 lg:pt-10">
      <ClientAllProjects
        initialNextCursor={nextCursor ?? null}
        initialProjects={projects}
        loadMore={loadmore}
      />
    </main>
  );
};

export default AllProjects;

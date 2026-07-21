import { ClientSidebar } from "@/app/components/client/client-sidebar";
import { ReactNode } from "react";
import { getClientProfile } from "@/app/lib/controllers/profileController";
import { getInitials } from "@/app/lib/utilitys";
import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/lib/prisma";

export default async function Freelancerlayout({
  children,
}: {
  children: ReactNode;
}) {
  const loadprofiledetails = async () => {
    const session = await getSession();
    if (!session?.user) {
      redirect("/login");
    }
    const [result, activityCount] = await Promise.all([
      getClientProfile(session.user.email),
      await prisma.activity.count({
        where: { userId: session.user.id },
      }),
    ]);
    if (!result.profile) {
      console.log(result);
      redirect("/unauthorized");
    }

    return { profile: result.profile, activityCount };
  };
  const { profile: data, activityCount } = await loadprofiledetails();

  return (
    <div className="flex min-h-screen w-full bg-dash-surface flex-col pt-5">
      <ClientSidebar
        image={data.image ?? undefined}
        initials={getInitials(data.name)}
        name={data.name ?? "Unknown"}
        acitivityCount={activityCount}
        role="Client"
      />

      {/* Main Content Area (80% width on desktop, 20% left margin) */}
      <main className="flex-1 w-full overflow-x-hidden pb-[80px] lg:ml-[15%] lg:px-3 lg:w-[85%] lg:pb-0">
        {children}
      </main>
    </div>
  );
}

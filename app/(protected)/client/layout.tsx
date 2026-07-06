import { ClientSidebar } from "@/app/components/client/client-sidebar";
import { ReactNode } from "react";
import { getClientProfile } from "@/app/lib/controllers/profileController";
import { getInitials, formatCategory } from "@/app/lib/utilitys";
import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";

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
    const result = await getClientProfile(session.user.email);
    if (!result.profile) {
      console.log(result);
      redirect("/unauthorized");
    }

    return result.profile;
  };
  const data = await loadprofiledetails();

  return (
    <div className="flex min-h-screen w-full bg-dash-surface flex-col mt-5">
      <ClientSidebar
        image={data.image ?? undefined}
        initials={getInitials(data.name)}
        name={data.name ?? "Unknown"}
        role="Client"
      />

      {/* Main Content Area (80% width on desktop, 20% left margin) */}
      <main className="flex-1 pb-[80px] lg:ml-[15%] lg:px-3 lg:w-[85%] lg:pb-0">
        {children}
      </main>
    </div>
  );
}

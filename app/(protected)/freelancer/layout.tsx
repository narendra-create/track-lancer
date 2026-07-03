import { FreelancerSidebar } from "@/app/components/freelancer-sidebar";
import { ReactNode } from "react";
import { getFreelancerProfile } from "@/app/lib/controllers/profileController";
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
    const result = await getFreelancerProfile(session.user.email);
    if (!result.profile) {
      redirect("/unauthorized");
    }

    return result.profile;
  };
  const data = await loadprofiledetails();

  return (
    <div className="flex min-h-screen w-full bg-dash-surface flex-col mt-5">
      <FreelancerSidebar
        image={data.image ?? undefined}
        initials={getInitials(data.name)}
        name={data.name}
        skill={formatCategory(data.Freelancer?.category!)}
      />

      {/* Main Content Area (80% width on desktop, 20% left margin) */}
      <main className="flex-1 pb-[80px] lg:ml-[15%] lg:px-3 lg:w-[85%] lg:pb-0">
        {children}
      </main>
    </div>
  );
}

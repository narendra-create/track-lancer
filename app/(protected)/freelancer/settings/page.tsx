import { FreelancerSettings } from "@/app/components/FreelancerSettings";
import { getSession } from "@/app/lib/session";
import { redirect } from "next/navigation";

const SettingsPage = async () => {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role.toLowerCase() !== "freelancer") redirect("/unauthorized");

  return (
    <div className="mx-4 lg:pl-7 lg:pt-10">
      <FreelancerSettings />
    </div>
  );
};

export default SettingsPage;

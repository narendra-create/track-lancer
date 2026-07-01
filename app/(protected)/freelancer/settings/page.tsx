import { FreelancerSettings } from "@/app/components/FreelancerSettings";
import { requireRole } from "@/app/lib/require-role";
import { redirect } from "next/navigation";

const SettingsPage = async () => {
  const { session, error } = await requireRole("freelancer");
  if (!session && error) redirect("/login");

  return (
    <div className="mx-4 lg:pl-7 lg:pt-10">
      <FreelancerSettings />
    </div>
  );
};

export default SettingsPage;

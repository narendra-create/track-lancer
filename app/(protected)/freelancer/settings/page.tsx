import { FreelancerSettings } from "@/app/components/freelancer/FreelancerSettings";
import { getSession } from "@/app/lib/session";
import { redirect } from "next/navigation";
import { getProfileAction, updateUPIDetailsAction } from "@/app/lib/actions/ProfileActions";

const SettingsPage = async () => {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role.toLowerCase() !== "freelancer") redirect("/unauthorized");

  const profileResponse = await getProfileAction();
  
  return (
    <div className="mx-4 lg:pl-7 lg:pt-10">
      <FreelancerSettings initialData={profileResponse.data} onUpdateUPI={updateUPIDetailsAction} />
    </div>
  );
};

export default SettingsPage;

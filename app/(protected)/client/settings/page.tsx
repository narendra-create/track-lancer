import { ClientSettings } from "@/app/components/client/ClientSettings";
import { getProfileAction } from "@/app/lib/actions/ProfileActions";
import { getSession } from "@/app/lib/session";
import { redirect } from "next/navigation";
import { getDevices, revokeSession } from "@/app/lib/actions/sessionActions";
import { SessionResultArray } from "@/types/activeSessions";

const SettingsPage = async () => {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role.toLowerCase() !== "client") redirect("/unauthorized");
  const result = await getDevices();
  if (!result.success) {
    console.error(result.error, result.status);
  }
  const sessionsresult: SessionResultArray = result.data;
  const profileResponse = await getProfileAction();

  const handleRevoke = async (sessionId: string) => {
    "use server";
    const result = await revokeSession(sessionId);
    if (!result.success) {
      return { success: false, error: `${result.error} - ${result.status}` };
    }

    return { success: true };
  };

  return (
    <div className="mx-4 lg:pl-7 lg:py-10">
      <ClientSettings
        onRevoke={handleRevoke}
        sessionsData={sessionsresult}
        initialData={profileResponse.data}
      />
    </div>
  );
};

export default SettingsPage;

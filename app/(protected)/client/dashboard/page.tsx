import ClientDashboard from "@/app/Features/Client/Client-dashboard";
import { DUMMY_CLIENT_DASHBOARD } from "@/app/components/seeds/ClientDashboardSeed";
import type { ClientDashboardData } from "@/app/Features/Client/Client-dashboard";

const Dashboard = () => {
  const data: ClientDashboardData = DUMMY_CLIENT_DASHBOARD;
  return (
    <main>
      <ClientDashboard data={data} />
    </main>
  );
};

export default Dashboard;

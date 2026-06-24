import FreelancerDashboard from "@/app/Features/Freelancer/Freelancer-dashboard";
import type { ChartDataPoint } from "@/app/components/FreelancerChart";
import type { statcardprop } from "@/app/components/Cards/StatCardFreelancer";
import { Wallet, Users, Hourglass, Folder } from "lucide-react";
import { getDashboardStats } from "@/app/lib/Batch-Fetch/FreelancerDashboardStats";
import type { FreelancerDashboardData } from "@/types/dashboard";
import { getRavnuechartStats } from "@/app/lib/controllers/clientController";

const DashboardFreelancer = async () => {
  const result = await getDashboardStats();

  if (!result.success) {
    return <div>Something went wrong</div>;
  }

  return (
    <>
      <FreelancerDashboard data={result.data} />
    </>
  );
};

export default DashboardFreelancer;

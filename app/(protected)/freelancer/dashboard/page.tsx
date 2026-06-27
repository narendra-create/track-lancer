"use server";
import FreelancerDashboard from "@/app/Features/Freelancer/Freelancer-dashboard";
import { getDashboardStats } from "@/app/lib/Batch-Fetch/FreelancerDashboardStats";
import { loadMoreProjects } from "@/app/lib/actions/LoadMoreProjects";

const DashboardFreelancer = async () => {
  const result = await getDashboardStats();

  const loadmore = async (nextcursor: string) => {
    "use server";
    const result = await loadMoreProjects(nextcursor);
    if (!result.success) {
      console.log(result.error, result.status, "From loadmoreprojects");
      return { projects: [], nextCursor: null };
    }
    return { projects: result.projects ?? [], nextCursor: result.nextcursor ?? null };
  };

  if (!result.success) {
    return <div>Something went wrong</div>;
  }

  return (
    <>
      <FreelancerDashboard loadmore={loadmore} data={result.data} />
    </>
  );
};

export default DashboardFreelancer;

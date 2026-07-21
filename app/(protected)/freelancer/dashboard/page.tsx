import FreelancerDashboard from "@/app/Features/Freelancer/Freelancer-dashboard";
import { getDashboardStats } from "@/app/lib/Batch-Fetch/FreelancerDashboardStats";
import { loadMoreProjects } from "@/app/lib/actions/LoadMoreProjects";
import { getProfileAction } from "@/app/lib/actions/ProfileActions";
import { getActivitys } from "@/app/lib/controllers/activityController";
import { ActivityItem } from "@/types/activitys";

const DashboardFreelancer = async () => {
  // const result = await getDashboardStats();
  // const profileResponse = await getProfileAction();
  // const activityresult = await getActivitys();
  const [result, profileResponse, activityresult] = await Promise.all([
    getDashboardStats(),
    getProfileAction(),
    getActivitys(),
  ]);
  const hasUpi = !!(
    profileResponse.success &&
    profileResponse.data &&
    profileResponse.data.upiId
  );

  const notifications: ActivityItem[] = activityresult.success
    ? (activityresult.notifications ?? [])
    : [];

  const loadmore = async (nextcursor: string) => {
    "use server";
    const result = await loadMoreProjects(nextcursor);
    if (!result.success) {
      console.log(result.error, result.status, "From loadmoreprojects");
      return { projects: [], nextCursor: null };
    }
    return {
      projects: result.projects ?? [],
      nextCursor: result.nextcursor ?? null,
    };
  };

  if (!result.success) {
    return <div>Something went wrong</div>;
  }

  return (
    <>
      <FreelancerDashboard
        loadmore={loadmore}
        data={result.data!}
        hasUpi={hasUpi}
        notifications={notifications}
      />
    </>
  );
};

export default DashboardFreelancer;

import React from "react";
import ActivityLog from "@/app/components/ActivityLog";
import { getActivitys } from "@/app/lib/controllers/activityController";
import { loadMoreActivityAction } from "@/app/lib/actions/ActivityActions";
import type { ActivityItem } from "@/types/activitys";

const Activities = async () => {
  const result = await getActivitys();
  const initialActivities = (result.success ? (result.notifications ?? []) : []) as unknown as ActivityItem[];
  
  let initialNextCursor: string | null = null;
  if (initialActivities.length === 25) { 
    initialNextCursor = initialActivities[initialActivities.length - 1].createdAt.toISOString();
  }

  return (
    <div className="flex justify-center w-full pb-10">
      <ActivityLog 
        items={initialActivities} 
        initialNextCursor={initialNextCursor} 
        loadMoreActivities={loadMoreActivityAction} 
      />
    </div>
  );
};

export default Activities;
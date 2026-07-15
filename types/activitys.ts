import type { ActivityType } from "@/app/generated/prisma/enums";

export type ActivityItem = {
  id: string;
  type: ActivityType;
  message: string;
  highlightmessage: string;
  dateTimeofMessage: Date;
  projectId: string;
  project: {
    title: string;
  };
  createdAt: Date;
};

export type ActivityResponse = {
  success: boolean;
  activities?: ActivityItem[];
  error?: string;
  status?: number;
};

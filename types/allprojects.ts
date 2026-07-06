export type AllProjectStatus = "ACTIVE" | "STOPPED" | "CANCELLED";

export const SECTION_ORDER: AllProjectStatus[] = ["ACTIVE", "STOPPED", "CANCELLED"];

export type AllProjectClient = {
  user: {
    name: string;
    image: string | null;
  };
  email: string | null;
};

export type AllProjectMoney = {
  totalAmount: number;
  received: number;
  remaining: number;
};

export type AllProjectStats = {
  totalMilestones: number;
  completedMilestones: number;
  progress: number;
  projectDeadline: Date | undefined;
};

export type AllProject = {
  id: string;
  title: string;
  client: AllProjectClient;
  money: AllProjectMoney;
  status: AllProjectStatus;
  stats: AllProjectStats;
};

type GetAllProjectsSuccess = {
  success: true;
  projects: AllProject[];
  nextCursor: string | null;
};

type GetAllProjectsError = {
  success: false;
  error: string;
  status?: number;
};

export type GetAllProjectsResponse = GetAllProjectsSuccess | GetAllProjectsError;

export type AcceptProjectDetails = {
  projectId: string;
  title: string;
  agreedcost: string | number;
  deadline: string;
  description: string;
  freelancerName: string;
  freelancerEmail: string;
};

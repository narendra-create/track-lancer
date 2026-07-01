export type AllProjectStatus = "ACTIVE" | "STOPPED" | "CANCELLED";

export type AllProject = {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
  totalAmount: number;
  received: number;
  totalMilestones: number;
  completedMilestones: number;
  deadline: string | null;
  status: AllProjectStatus;
  createdAt: string;
};

export type AllProjectsSection = {
  projects: AllProject[];
  nextCursor: string | null;
};

export type AllProjectsData = {
  active: AllProjectsSection;
  stopped: AllProjectsSection;
  cancelled: AllProjectsSection;
};

export type LoadMoreAllProjectsResponse =
  | { success: true; projects: AllProject[]; nextCursor: string | null }
  | { success: false; error: string };

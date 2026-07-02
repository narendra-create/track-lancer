import type { Milestonestatus, Projectstatus } from "@/app/generated/prisma/enums";

export type MilestoneItem = {
    id: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    deadline: Date;
    delay: boolean | null;
    delayreason: string | null;
    createdAt: Date;
    updatedAt: Date;
    milestonecost: number;
    status: Milestonestatus;
};

export type ProjectWithMilestones = {
    id: string;
    title: string;
    projectcode: string | null;
    agreedCost: number;
    createdAt: Date;
    deadline: Date;
    status: Projectstatus;
    milestones: MilestoneItem[];
    payment: { paid_amount: number | null } | null;
};

export type GetAllMilestonesResponse =
    | {
        success: true;
        project: ProjectWithMilestones;
        status: 200;
    }
    | {
        success: false;
        error: string;
        status?: 400 | 500;
    };
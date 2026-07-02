import type { Milestonestatus } from "@/app/generated/prisma/enums";

export type Milestone = {
    id: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    deadline: string;
    delay: boolean | null;
    delayreason: string | null;
    createdAt: string;
    milestonecost: number;
    status: Milestonestatus;
};


export type GetAllMilestonesResponse =
    | {
        success: true;
        milestones: Milestone[];
        status: 200;
    }
    | {
        success: false;
        error: string;
        status: 400 | 500;
    };
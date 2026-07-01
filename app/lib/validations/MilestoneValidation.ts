import z, { string } from "zod";

export const createMilestoneSchema = z.object({
    projectId: string(),
    title: z.string(),
    subtitle: z.string().optional(),
    cost: z.number(),
    deadline: z.string(),
    description: z.string().max(80).optional()
});

export type createMilestoneInput = z.infer<typeof createMilestoneSchema>;
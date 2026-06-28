import z from "zod";

export const newProjectSchema = z.object({
    title: z.string().max(40).min(2, "Minimum 2 charactors"),
    agreedcost: z.number(),
    deadline: z.date(),
    description: z.string().optional(),
    freelancerId: z.string(),
});

export type newProjectInput = z.infer<typeof newProjectSchema>;
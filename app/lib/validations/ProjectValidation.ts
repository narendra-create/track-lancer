import z from "zod";

export const newProjectSchema = z.object({
    title: z.string().max(40).min(2, "Minimum 2 charactors"),
    agreedcost: z.number().positive("Amount must be positive").max(1000000000, "Amount exceeds maximum limit"),
    deadline: z.date(),
    description: z.string().optional(),
});

export type newProjectInput = z.infer<typeof newProjectSchema>;
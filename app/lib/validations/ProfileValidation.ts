import z from "zod";
import { Categorys } from "@/app/generated/prisma/enums";

export const updateProfileSchema = z.object({
    name: z.string().min(2, "Minimum 2 charactors"),
    category: z.nativeEnum(Categorys),
    phone: z.string().optional()
}).partial();

export type updateProfileInput = z.infer<typeof updateProfileSchema>;
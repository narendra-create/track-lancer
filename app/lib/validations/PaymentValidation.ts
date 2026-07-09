import z from "zod";

export const intiiatePaymentSchema = z.object({
    txn_number: z.string().min(4, "Too Short"),
    paymentId: z.string(),
    paid_amount: z.number(),
    freelancerId: z.string()
});

export type intiiatePaymentInput = z.infer<typeof intiiatePaymentSchema>;
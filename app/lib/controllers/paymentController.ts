import { prisma } from "@/app/lib/prisma";
import { getSession } from "@/app/lib/session";
import type { intiiatePaymentInput } from "../validations/PaymentValidation";

export const getPaymentHistory = async (cursor?: string) => {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", status: 401 };
    const role = session.user.role.toLowerCase();
    if (role === "client") {
        try {
            const findclient = await prisma.userprofile.findUnique({
                where: { userId: session.user.id }
            });
            if (!findclient) {
                return { success: false, error: "No client account found", status: 404 }
            };

            const getPayments = await prisma.payment.findMany({
                take: 6,
                ...(cursor && { cursor: { id: cursor }, skip: 1 }),
                where: {
                    project: { clientId: findclient.id }
                },
                select: {
                    project: {
                        select: {
                            title: true,
                            createdAt: true
                        }
                    },
                    id: true,
                    _count: true,
                    payment_status: true,
                    total_cost: true,
                    paid_amount: true,
                    due_date: true,
                    createdAt: true,
                    completedAt: true
                }
            });
            if (!getPayments) {
                return { sucess: false, error: "No payments", status: 404 }
            };
            const nextCursor = getPayments.length === 6 ? getPayments[getPayments.length - 1].id : null;
            return { success: true, payments: getPayments, nextCursor, status: 200 }
        }
        catch (err) {
            return {
                success: false,
                error: err instanceof Error ? err.message : "Server Error",
                status: 500
            };
        }
    }
    else if (role === "freelancer") {
        try {
            const freelancer = await prisma.freelancer.findUnique({
                where: { userId: session.user.id }
            });
            if (!freelancer) {
                return { success: false, error: "No freelancer account found", status: 404 }
            };

            const getPayments = await prisma.payment.findMany({
                take: 6,
                ...(cursor && { cursor: { id: cursor }, skip: 1 }),
                where: {
                    project: { freelancerId: freelancer.id }
                },
                select: {
                    project: {
                        select: {
                            title: true,
                            createdAt: true
                        }
                    },
                    id: true,
                    _count: true,
                    payment_status: true,
                    total_cost: true,
                    paid_amount: true,
                    due_date: true,
                    createdAt: true,
                    completedAt: true
                }
            });
            if (!getPayments) {
                return { sucess: false, error: "No payments", status: 404 }
            };
            const nextCursor = getPayments.length === 6 ? getPayments[getPayments.length - 1].id : null;
            return { success: true, payments: getPayments, nextCursor, status: 200 }
        }
        catch (err) {
            return {
                success: false,
                error: err instanceof Error ? err.message : "Server Error",
                status: 500
            };
        }
    }

    return { success: false, error: "Invalid role", status: 403 }
}

export const initiatePayment = async (input: intiiatePaymentInput) => {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", status: 401 };
    const role = session.user.role.toLowerCase();
    if (role !== "client") { return { success: false, error: "Invalid Role", status: 403 } };

    const findClient = await prisma.userprofile.findUnique({
        where: { userId: session.user.id }
    })
    if (!findClient) {
        return { success: false, error: "Payment not found", status: 404 }
    };

    const findpayment = await prisma.payment.findFirst({
        where: {
            id: input.paymentId,
            project: {
                clientId: findClient?.id
            },
            payment_status: "DUE"
        },
        select: {
            id: true,
            project: {
                select: {
                    freelancerId: true
                }
            },
            paid_amount: true,
            total_cost: true
        }
    });

    if (!findpayment) {
        return { success: false, error: "Payment Ledger Not found", status: 404 }
    };

    const findpaymentVerification = await prisma.paymentverification.findUnique({
        where: {
            txn_number: input.txn_number
        }
    });
    if (findpaymentVerification) {
        return { success: false, error: "Transaction already exists - Please continue that transaction", status: 409 }
    };
    const freelancerId = findpayment.project?.freelancerId;
    if (!freelancerId) {
        return {
            success: false,
            error: "This payment is not linked to a freelancer",
            status: 409
        };
    }
    const remainingAmount = findpayment.total_cost - findpayment.paid_amount;

    if (remainingAmount === 0) {
        return {
            success: false,
            error: "Payment is already fully paid or pending verification",
            status: 409
        };
    }
    if (remainingAmount > 0 && input.paid_amount > remainingAmount) {
        return { success: false, error: `Amount exceeds remaining due amount: ${remainingAmount}`, status: 400 }
    };

    try {
        const created = await prisma.paymentverification.create({
            data: {
                txn_number: input.txn_number,
                paid_amount: input.paid_amount,
                clientId: findClient.id,
                freelancerId: freelancerId,
                paymentid: input.paymentId,
                status: "PENDING_VERIFICATION"
            }
        });

        return { success: true, createdVerification: created, status: 201 }
    }
    catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : "Server Error",
            status: 500
        };
    }
}
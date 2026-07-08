import { prisma } from "@/app/lib/prisma";
import { getSession } from "@/app/lib/session";

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

export const initiatePayment = async (paymentId: string) => {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", status: 401 };
    const role = session.user.role.toLowerCase();
    if (role !== "client") { return { success: false, error: "Invalid Role", status: 403 } };

    const findpayment = await prisma.payment.findFirst({
        where: {
            id: paymentId,
            project: {
                client: {
                    userId: session.user.id
                }
            },
            payment_status: "DUE"
        }
    })
}
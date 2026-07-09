import { prisma } from "@/app/lib/prisma";
import { getSession } from "@/app/lib/session";
import type { intiiatePaymentInput } from "../validations/PaymentValidation";
import { ActionResponse } from "@/types/api";
import { PaymentHistory } from "@/types/payment";
import { VerifyPaymentType } from "@/types/verifypayments";

export const getPaymentHistory = async (cursor?: string): Promise<ActionResponse<{ payments: PaymentHistory[], nextCursor: string | null }>> => {
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
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
            if (getPayments.length === 0) {
                return {
                    success: true,
                    payments: [],
                    nextCursor: null,
                    status: 200
                };
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
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
            if (getPayments.length === 0) {
                return {
                    success: true,
                    payments: [],
                    nextCursor: null,
                    status: 200
                };
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

export const markVerifiedPayment = async (verificationPaymentId: string) => {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", status: 401 };
    const role = session.user.role.toLowerCase();
    if (role !== "freelancer") { return { success: false, error: "Invalid Role", status: 403 } };

    const findfreelancer = await prisma.freelancer.findUnique({
        where: { userId: session.user.id }
    })
    if (!findfreelancer) {
        return { success: false, error: "freelancer not found", status: 404 }
    };

    const findverification = await prisma.paymentverification.findUnique({
        where: {
            id: verificationPaymentId
        },
        include: {
            Payment: true
        }
    });
    if (!findverification) {
        return { success: false, error: "Verification Request not found", status: 404 }
    };
    if (findverification.status !== "PENDING_VERIFICATION") {
        return { success: false, error: "Verification Already processed", status: 409 }
    }
    if (findfreelancer.id !== findverification?.freelancerId) {
        return { success: false, error: "You are not Associated with this Project", status: 403 }
    }
    if (findverification.Payment.payment_status === "PAID") {
        return { success: false, error: "This project is Already Paid", status: 409 }
    };

    try {
        const accepted = await prisma.$transaction(async (tx) => {
            const payment = await tx.payment.findUnique({
                where: {
                    id: findverification.paymentid
                }
            })
            if (!payment) {
                throw new Error("Payment Not found.");
            }
            const remaining =
                payment.total_cost - payment.paid_amount;

            if (findverification.paid_amount > remaining) {
                throw new Error("Verification amount exceeds remaining balance.");
            }
            if (findfreelancer.id !== findverification.freelancerId) {
                throw new Error("This project does not belong to you")
            }

            const verificationUpdated = await tx.paymentverification.update({
                where: { id: findverification.id },
                data: {
                    status: "VERIFIED"
                }
            });

            await tx.payment.update({
                where: { id: findverification.paymentid },
                data: {
                    paid_amount: {
                        increment: findverification.paid_amount
                    }
                }
            });

            return { status: verificationUpdated.status, id: verificationUpdated.id }
        });

        return { success: true, updated: accepted, status: 200 }
    }
    catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : "Server Error",
            status: 500
        };
    }
}

export const markRejectPayment = async (verificationPaymentId: string) => {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized", status: 401 };
    const role = session.user.role.toLowerCase();
    if (role !== "freelancer") { return { success: false, error: "Invalid Role", status: 403 } };

    const findfreelancer = await prisma.freelancer.findUnique({
        where: { userId: session.user.id }
    })
    if (!findfreelancer) {
        return { success: false, error: "freelancer not found", status: 404 }
    };

    const findverification = await prisma.paymentverification.findUnique({
        where: {
            id: verificationPaymentId
        },
        include: {
            Payment: true
        }
    });
    if (!findverification) {
        return { success: false, error: "Verification Request not found", status: 404 }
    };
    if (findverification.status !== "PENDING_VERIFICATION") {
        return { success: false, error: "Verification Already processed", status: 409 }
    }
    if (findfreelancer.id !== findverification?.freelancerId) {
        return { success: false, error: "You are not Associated with this Project", status: 403 }
    }

    try {
        const rejected = await prisma.$transaction(async (tx) => {
            if (findfreelancer.id !== findverification.freelancerId) {
                throw new Error("This project does not belong to you")
            }

            const verificationUpdated = await tx.paymentverification.update({
                where: { id: findverification.id },
                data: {
                    status: "REJECTED"
                }
            });

            return { status: verificationUpdated.status, id: verificationUpdated.id }
        });

        return { success: true, updated: rejected, status: 200 }
    }
    catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : "Server Error",
            status: 500
        };
    }
}

export const getPaymentVerificationRequests = async (cursor?: string): Promise<ActionResponse<{ requests: VerifyPaymentType[], nextCursor: string | null }>> => {
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

            const getPaymentRequests = await prisma.paymentverification.findMany({
                take: 5,
                ...(cursor && { cursor: { id: cursor }, skip: 1 }),
                where: { clientId: findclient.id },
                select: {
                    Payment: {
                        select: {
                            project: {
                                select: {
                                    title: true,

                                }
                            },
                            due_date: true
                        }
                    },
                    txn_number: true,
                    id: true,
                    clientId: true,
                    freelancer: {
                        select: {
                            id: true,
                            user: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    },
                    paid_amount: true,
                    status: true,
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
            if (getPaymentRequests.length === 0) {
                return {
                    success: true,
                    requests: [],
                    nextCursor: null,
                    status: 200
                };
            };
            const nextCursor = getPaymentRequests.length === 5 ? getPaymentRequests[getPaymentRequests.length - 1].id : null;
            return { success: true, requests: getPaymentRequests, nextCursor, status: 200 }
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

            const getPaymentRequests = await prisma.paymentverification.findMany({
                take: 5,
                ...(cursor && { cursor: { id: cursor }, skip: 1 }),
                where: {
                    freelancerId: freelancer.id
                },
                select: {
                    Payment: {
                        select: {
                            project: {
                                select: {
                                    title: true,

                                }
                            },
                            due_date: true
                        }
                    },
                    txn_number: true,
                    id: true,
                    freelancerId: true,
                    client: {
                        select: {
                            id: true,
                            user: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    },
                    paid_amount: true,
                    status: true,
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
            if (getPaymentRequests.length === 0) {
                return {
                    success: true,
                    requests: [],
                    nextCursor: null,
                    status: 200
                };
            };
            const nextCursor = getPaymentRequests.length === 5 ? getPaymentRequests[getPaymentRequests.length - 1].id : null;
            return { success: true, requests: getPaymentRequests, nextCursor, status: 200 }
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
};
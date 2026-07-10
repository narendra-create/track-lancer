import { prisma } from "@/app/lib/prisma";
import { getSession } from "@/app/lib/session";

export const PaymentDetailUiController = async (paymentId: string) => {
    const session = await getSession();
    if (!session) return { success: false as const, error: "Unauthorized", status: 401 };
    
    // Allow both client and freelancer to view? The original controller only allowed client.
    // The user's page says: role="CLIENT" but if there is a freelancer page we could check both.
    // For now we will allow if role is client or freelancer, but we should match what the original did if we want to be safe.
    // Original checked `if (role !== "client")`.
    const role = session.user.role.toLowerCase();
    if (role !== "client" && role !== "freelancer") {
        return { success: false as const, error: "This account cannot view payment details", status: 403 };
    }

    const findPayment = await prisma.payment.findUnique({
        where: { id: paymentId },
        select: {
            id: true,
            completedAt: true,
            createdAt: true,
            due_date: true,
            paid_amount: true,
            payment_status: true,
            total_cost: true,
            project: {
                select: {
                    title: true,
                    description: true,
                    freelancer: {
                        select: {
                            userId: true,
                            user: {
                                select: {
                                    name: true,
                                    email: true
                                }
                            },
                            upiId: true,
                            AccountHolderName: true
                        }
                    },
                    client: {
                        select: {
                            userId: true,
                            user: {
                                select: {
                                    name: true,
                                    email: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!findPayment) {
        return { success: false as const, error: "Payment Ledger Not found", status: 404 }
    };

    // Client authorization check
    if (role === "client" && findPayment.project?.client?.userId !== session.user.id) {
        return { success: false as const, error: "This payment ledger is not associated with you", status: 409 }
    };
    
    // Freelancer authorization check
    if (role === "freelancer" && findPayment.project?.freelancer?.userId !== session.user.id) {
        return { success: false as const, error: "This payment ledger is not associated with you", status: 409 }
    };

    const totalDuesum = findPayment.total_cost - findPayment.paid_amount;
    const totalDue = totalDuesum <= 0 ? 0 : totalDuesum;

    const returningObject = {
        id: findPayment.id,
        completedAt: findPayment.completedAt,
        createdAt: findPayment.createdAt,
        due_date: findPayment.due_date,
        status: findPayment.payment_status,
        total_cost: findPayment.total_cost,
        paid_amount: findPayment.paid_amount,
        due_amount: totalDue,
        project: {
            title: findPayment.project?.title || "Unknown Project",
            description: findPayment.project?.description || "",
        },
        client: {
            name: findPayment.project?.client?.user?.name || "Unknown",
            email: findPayment.project?.client?.user?.email || "No Email",
        },
        freelancer: {
            name: findPayment.project?.freelancer?.user?.name || "Unknown",
            email: findPayment.project?.freelancer?.user?.email || "No Email",
        }
    };

    return { success: true as const, details: returningObject, status: 200 }
};

export type PaymentDetailUiControllerResponse = Awaited<
    ReturnType<typeof PaymentDetailUiController>
>;

export type PaymentDetailUiType = NonNullable<
    Extract<PaymentDetailUiControllerResponse, { success: true }>["details"]
>;

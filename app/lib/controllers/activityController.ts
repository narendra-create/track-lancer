import { prisma } from "@/app/lib/prisma";
import { getSession } from "@/app/lib/session";

const ACTIVITY_LIMIT = 25;

export const getActivitys = async (since?: string) => {
    const session = await getSession();
    if (!session?.user) return { success: false, error: "Unauthorized", status: 401 };
    const role = session.user.role.toLowerCase();
    if (role !== "client" && role !== "freelancer") { return { success: false, error: "Invalid Role", status: 403 } }

    const findUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            blockedNotificationTypes: true
        }
    });
    if (!findUser) {
        return {
            success: false, error: "Got an error", status: 400
        }
    };

    try {
        const Activitys = await prisma.activity.findMany({
            take: ACTIVITY_LIMIT,
            where: {
                userId: findUser.id,
                ...(since && { createdAt: { gt: new Date(since) } }),
                ...(findUser.blockedNotificationTypes.length > 0 && { type: { notIn: findUser.blockedNotificationTypes } })
            },
            select: {
                id: true,
                dateTimeofMessage: true,
                highlightmessage: true,
                message: true,
                type: true,
                projectId: true,
                userId: true,
                createdAt: true,
                project: {
                    select: {
                        title: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return { success: true, notifications: Activitys, status: 200 }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
        };
        console.error("From getActivity", error);
        return { success: false, error: "Server Error", status: 500 }
    }
};
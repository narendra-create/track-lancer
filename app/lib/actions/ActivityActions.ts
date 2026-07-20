"use server";

import { prisma } from "@/app/lib/prisma";
import { getSession } from "@/app/lib/session";
import type { ActivityItem } from "@/types/activitys";
import { headers } from "next/headers";
import { actionRateLimit } from "../rate-limit";

const ACTIVITY_LIMIT = 10; // Load 10 more at a time as requested

export const loadMoreActivityAction = async (cursor: string): Promise<{ items: ActivityItem[]; nextCursor: string | null }> => {
    const headerStore = await headers();
    const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    const { success } = await actionRateLimit.limit(ip);

    if (!success) {
        throw new Error("Rate limit exceeded. Try again later.");
    }
    const session = await getSession();
    if (!session?.user) return { items: [], nextCursor: null };

    const role = session.user.role.toLowerCase();
    if (role !== "client" && role !== "freelancer") return { items: [], nextCursor: null };

    const findUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            blockedNotificationTypes: true
        }
    });

    if (!findUser) return { items: [], nextCursor: null };

    try {
        const activities = await prisma.activity.findMany({
            take: ACTIVITY_LIMIT + 1, // Fetch one extra to check if there are more
            where: {
                userId: findUser.id,
                createdAt: { lt: new Date(cursor) }, // Fetch activities older than the cursor
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

        let nextCursor: string | null = null;
        if (activities.length > ACTIVITY_LIMIT) {
            const nextItem = activities.pop(); // Remove the extra item
            if (nextItem) {
                nextCursor = nextItem.createdAt.toISOString();
            }
        }

        return {
            items: activities as unknown as ActivityItem[],
            nextCursor
        };
    }
    catch (error) {
        console.error("From loadMoreActivityAction", error);
        return { items: [], nextCursor: null };
    }
};

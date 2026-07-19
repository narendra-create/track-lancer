import { prisma } from "@/app/lib/prisma";
import { getSession } from "@/app/lib/session";
import { UAParser } from 'ua-parser-js';
import { formatRelativeTime } from "../utilitys";

export const getDevices = async () => {
    const session = await getSession();
    if (!session?.user) {
        return { success: false, error: "Unauthorized", status: 401 }
    };

    const findSessions = await prisma.session.findMany({
        where: { userId: session.user.id }
    });

    const formattedSessions = findSessions.map((singlesession) => {
        const parser = new UAParser(singlesession.userAgent || "");
        const browser = parser.getBrowser().name || "Unknown Browser";
        const os = parser.getOS().name || "Unknown Os";

        const isCurrentSession = singlesession.id === session.session.id;

        return {
            id: singlesession.id,
            device: `${browser} • ${os}`,
            location: singlesession.ipAddress || "Unknown Location",
            current: isCurrentSession,
            time: isCurrentSession ? "Active Now" : formatRelativeTime(singlesession.updatedAt)
        }
    });

    return { success: true, data: formattedSessions, status: 200 }
};

export const revokeSession = async (sessionId: string) => {
    const session = await getSession();
    if (!session?.user) {
        return { success: false, error: "Unauthorized", status: 401 }
    };

    const findSession = await prisma.session.findUnique({
        where: { id: sessionId }
    });
    if (!findSession || findSession.userId !== session.user.id) {
        return { success: false, error: "Session Not Found", status: 404 }
    };

    try {
        await prisma.session.delete({
            where: {
                id: findSession.id
            }
        });

        return { success: true, status: 200 }
    }
    catch (err) {
        console.error("From revokeSession function -", err);
        return { success: false, error: "Server Error", status: 500 }
    }
}
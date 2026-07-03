import { getSession } from "./session";

export async function requireRole(...roles: string[]) {
    const session = await getSession();
    if (!session) return { error: "Unauthorized", status: 401 };
    const lowercaserole = roles.map((r) => r.toLowerCase());
    if (!lowercaserole.includes(session.user.role.toLowerCase() ?? "")) return { error: "Forbidden", status: 403 };
    return { session };
}
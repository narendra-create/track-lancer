import { NextRequest, NextResponse } from "next/server";
import { getCurrentProjects } from "@/app/lib/controllers/clientController";
import { requireRole } from "@/app/lib/require-role";

export async function GET(req: NextRequest) {
    try {
        const { error, status } = await requireRole("freelancer");
        if (error) {
            return NextResponse.json({ error: `At getcurrent project - ${error}` }, { status: status });
        };
        const body = await req.json();
        const result = await getCurrentProjects(body.freelancerId, body.cursor);
        if (!result.success) {
            return NextResponse.json({ error: `Database error ${result.error}` }, { status: result.status });
        };
        return NextResponse.json({ projects: result.projects }, { status: 200 });
    }
    catch (err) {
        console.error("Project Get failed:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
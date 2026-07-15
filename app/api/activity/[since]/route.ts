import { NextRequest, NextResponse } from "next/server";
import { getActivitys } from "@/app/lib/controllers/activityController";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const sinceTime = searchParams.get("since");
        const result = await getActivitys(sinceTime ?? undefined);
        if (!result.success) {
            return NextResponse.json({ error: `${result.error}` }, { status: result.status });
        };
        return NextResponse.json({ data: result.notifications }, { status: 200 })
    }
    catch (error) {
        console.error("Getting activity failed", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
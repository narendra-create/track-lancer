import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json()) as { email?: string };

    if (!email || typeof email !== "string") {
      return NextResponse.json({ success: false }, { status: 400 });
    }
    // Return a generic success to prevent email enumeration
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}

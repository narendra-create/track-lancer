import { addprofile } from "@/app/lib/controllers/profileController";
import type { Categorys } from "@/app/generated/prisma/enums";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/app/lib/session";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as { category?: Categorys | null };
    const role = session.user.role.toLowerCase();
    const result = await addprofile(
      session.user.id,
      role,
      body.category ?? undefined,
    );

    if (!result?.success) {
      return NextResponse.json({ error: "Invalid profile data" }, { status: 400 });
    }

    return NextResponse.json({ data: result.Profile }, { status: 201 });
  } catch (error) {
    console.error("Profile creation failed:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

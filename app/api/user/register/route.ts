import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, role } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ success: false }, { status: 400 });
    };
    const normalizedEmail = email.toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (user) {
      return NextResponse.json({ success: true });
    }

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const signUpRes = await fetch(`${origin}/api/auth/sign-up/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, role }),
    });

    if (!signUpRes.ok) {
      console.error("Sign up failed in proxy:", await signUpRes.text());
      return NextResponse.json({ success: true });
    }

    const otpRes = await fetch(`${origin}/api/auth/email-otp/send-verification-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, type: "email-verification" }),
    });

    if (!otpRes.ok) {
      console.error("OTP send failed in proxy:", await otpRes.text());
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Register proxy error:", error);
    return NextResponse.json({ success: true });
  }
}

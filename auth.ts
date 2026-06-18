import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { emailOTP } from "better-auth/plugins";
import { resendClient } from "./app/lib/resend-client";
import { getVerificationEmailHtml, getForgotPasswordEmailHtml } from "./app/lib/email-templates";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });
const fromEmail =
  process.env.RESEND_FROM_EMAIL ?? "Track-Lancer <onboarding@resend.dev>";

async function sendOtpEmail({
  email,
  otp,
  type,
}: {
  email: string;
  otp: string;
  type: "sign-in" | "email-verification" | "forget-password" | "change-email";
}) {
  const isPasswordReset = type === "forget-password";
  const { data, error } = await resendClient.emails.send({
    to: email,
    subject: isPasswordReset
      ? "Reset your password"
      : type === "sign-in"
        ? "Your sign-in code"
        : "Verify your email address",
    from: fromEmail,
    html: isPasswordReset
      ? getForgotPasswordEmailHtml(otp, "there")
      : getVerificationEmailHtml(otp, "there"),
  });

  if (error) {
    console.error(`Resend rejected ${type} email to ${email}:`, error);
    throw new Error("The verification email could not be sent.");
  }

  console.info(`Resend accepted ${type} email:`, data?.id);
}

export const auth = betterAuth({
  trustedOrigins: [
    "http://localhost:3000",
    ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS
      ?.split(",")
      .map(origin => origin.trim()) ?? [])
  ],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    autoSignInAfterVerification: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "CLIENT",
        input: true,
      },
    },
  },
  plugins: [
    emailOTP({
      sendVerificationOTP: sendOtpEmail,
      expiresIn: 10 * 60,
      allowedAttempts: 5,
      storeOTP: "hashed",
    }),
  ],
});

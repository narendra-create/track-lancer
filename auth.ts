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
  process.env.RESEND_FROM_EMAIL ?? "MileGlide <onboarding@resend.dev>";

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
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": {
        window: 10 * 60,
        max: 5,
      },
      "/sign-up/email": {
        window: 15 * 60,
        max: 3,
      },
      "/email-otp/send-verification-otp": {
        window: 10 * 60,
        max: 3,
      },
      "/email-otp/verify-email": {
        window: 10 * 60,
        max: 5,
      },
      "/email-otp/request-password-reset": {
        window: 30 * 60,
        max: 3,
      },
      "/email-otp/reset-password": {
        window: 10 * 60,
        max: 5,
      },
    },
  },
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

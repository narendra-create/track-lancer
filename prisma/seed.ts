import * as dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "../app/generated/prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

const prisma = new PrismaClient();

// Create an isolated Better-Auth instance specifically for seeding.
// By NOT including the emailOTP plugin here, we bypass the OTP email trigger entirely.
const seedAuth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Don't require verification for seed
  },
});

async function main() {
  const email = "websitet547@gmail.com";
  const password = "Websitetester07";
  const name = "Naman";

  console.log("Checking if user already exists...");
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log("Test user already exists. Seed completed.");
    return;
  }

  console.log("Creating test user via Better-Auth (Bypassing OTP)...");
  try {
    const headers = new Headers();
    // Using the isolated instance avoids sending emails while still securely hashing the password
    await seedAuth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        role: "FREELANCER",
      },
      headers,
    });

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      console.log("User created! Setting up Freelancer profile and verifying email...");
      
      // Auto-verify the seeded user's email so they can log in immediately
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true }
      });

      // Create the Freelancer profile
      await prisma.freelancer.create({
        data: {
          userId: user.id,
          category: "WEB_DEV",
        },
      });
      
      console.log(`Seed successful! Setup complete for: ${email}`);
    } else {
      console.error("Failed to find the newly created user in the database.");
    }
  } catch (error) {
    console.error("Error during seed:", error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

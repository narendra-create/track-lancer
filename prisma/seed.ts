import * as dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const seedAuth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
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
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function createUser(
  email: string,
  password: string,
  name: string,
  role: "FREELANCER" | "CLIENT"
) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`  ↳ User already exists: ${email}`);
    return existing;
  }

  await seedAuth.api.signUpEmail({
    body: { email, password, name, role },
    headers: new Headers(),
  });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error(`Failed to create user: ${email}`);

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true },
  });

  console.log(`  ↳ Created user: ${name} <${email}> [${role}]`);
  return user;
}

function daysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function monthsAgo(months: number, dayOfMonth = 15) {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  d.setDate(dayOfMonth);
  d.setHours(10, 0, 0, 0);
  return d;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🌱  Starting seed...\n");

  // ── Freelancer ──────────────────────────────────────────────────────────────
  console.log("👤  Creating freelancer...");
  const freelancerUser = await createUser(
    "websitet547@gmail.com",
    "Websitetester07",
    "Naman",
    "FREELANCER"
  );

  let freelancer = await prisma.freelancer.findUnique({
    where: { userId: freelancerUser.id },
  });
  if (!freelancer) {
    freelancer = await prisma.freelancer.create({
      data: { userId: freelancerUser.id, category: "WEB_DEV" },
    });
    console.log("  ↳ Freelancer profile created");
  } else {
    console.log("  ↳ Freelancer profile already exists");
  }

  // ── Clients ─────────────────────────────────────────────────────────────────
  console.log("\n👥  Creating clients...");

  const clientSeeds = [
    { email: "arjun.mehta.client@gmail.com",  name: "Arjun Mehta",  password: "Client123!" },
    { email: "priya.sharma.client@gmail.com", name: "Priya Sharma", password: "Client123!" },
    { email: "rohan.das.client@gmail.com",    name: "Rohan Das",    password: "Client123!" },
    { email: "sneha.nair.client@gmail.com",   name: "Sneha Nair",   password: "Client123!" },
    { email: "vikram.iyer.client@gmail.com",  name: "Vikram Iyer",  password: "Client123!" },
  ];

  const clientProfiles: { name: string; profileId: string }[] = [];

  for (const seed of clientSeeds) {
    const user = await createUser(seed.email, seed.password, seed.name, "CLIENT");

    let profile = await prisma.userprofile.findUnique({ where: { userId: user.id } });
    if (!profile) {
      profile = await prisma.userprofile.create({ data: { userId: user.id } });
      console.log(`  ↳ Userprofile created for ${seed.name}`);
    } else {
      console.log(`  ↳ Userprofile already exists for ${seed.name}`);
    }

    clientProfiles.push({ name: seed.name, profileId: profile.id });
  }

  // ── Projects, Milestones & Payments ─────────────────────────────────────────
  console.log("\n📁  Creating projects, milestones & payments...");

  type ProjectSeed = {
    title: string;
    clientIndex: number;
    status: "PENDING" | "COMPLETED" | "STOPPED";
    milestones: {
      title: string;
      subtitle?: string;
      description?: string;
      milestonecost: number;
      status: "approved" | "pending_payment" | "not_started" | "stopped";
      deadline: Date;
      delay?: boolean;
      delayreason?: string;
    }[];
    payments: {
      total_cost: number;
      paid_amount: number;
      payment_status: "DUE" | "PENDING_VERIFICATION" | "PAID";
      due_date: Date;
      createdAt: Date;
    }[];
  };

  const projectSeeds: ProjectSeed[] = [
    {
      title: "E-Commerce Platform",
      clientIndex: 0,
      status: "COMPLETED",
      milestones: [
        {
          title: "Design & Wireframes",
          subtitle: "UI/UX mockups",
          description: "Figma designs and clickable prototypes for all pages.",
          milestonecost: 15000,
          status: "approved",
          deadline: monthsAgo(5),
        },
        {
          title: "Frontend Development",
          subtitle: "React + Tailwind",
          description: "Responsive storefront built with Next.js.",
          milestonecost: 25000,
          status: "approved",
          deadline: monthsAgo(4),
        },
        {
          title: "Backend & Payments",
          subtitle: "Node + Razorpay",
          description: "REST API, user auth, and payment gateway integration.",
          milestonecost: 30000,
          status: "approved",
          deadline: monthsAgo(3),
        },
        {
          title: "Launch & Handoff",
          subtitle: "Deployment + docs",
          description: "Deployed to Vercel, handed over with full documentation.",
          milestonecost: 10000,
          status: "approved",
          deadline: monthsAgo(2),
        },
      ],
      payments: [
        {
          total_cost: 80000,
          paid_amount: 80000,
          payment_status: "PAID",
          due_date: monthsAgo(2),
          createdAt: monthsAgo(2, 20),
        },
      ],
    },
    {
      title: "Portfolio Website",
      clientIndex: 1,
      status: "PENDING",
      milestones: [
        {
          title: "Brand Discovery",
          subtitle: "Colour palette & fonts",
          description: "Understand brand personality and define visual language.",
          milestonecost: 5000,
          status: "approved",
          deadline: monthsAgo(2),
        },
        {
          title: "Design System",
          subtitle: "Components library",
          description: "Build reusable components in Figma.",
          milestonecost: 8000,
          status: "approved",
          deadline: monthsAgo(1),
        },
        {
          title: "Development",
          subtitle: "Next.js + Framer Motion",
          description: "Fully animated portfolio with case studies.",
          milestonecost: 12000,
          status: "pending_payment",
          deadline: daysFromNow(14),
        },
        {
          title: "SEO & Go-Live",
          subtitle: "Optimisation + deploy",
          description: "On-page SEO, sitemap, and final deployment.",
          milestonecost: 5000,
          status: "not_started",
          deadline: daysFromNow(30),
        },
      ],
      payments: [
        {
          total_cost: 30000,
          paid_amount: 13000,
          payment_status: "DUE",
          due_date: daysFromNow(10),
          createdAt: monthsAgo(1, 5),
        },
      ],
    },
    {
      title: "SaaS Dashboard",
      clientIndex: 2,
      status: "PENDING",
      milestones: [
        {
          title: "Requirements & Architecture",
          subtitle: "System design doc",
          milestonecost: 10000,
          status: "approved",
          deadline: monthsAgo(3),
        },
        {
          title: "Auth & User Management",
          subtitle: "Better-Auth integration",
          milestonecost: 15000,
          status: "approved",
          deadline: monthsAgo(2),
        },
        {
          title: "Analytics Module",
          subtitle: "Charts & KPIs",
          description: "Recharts-powered dashboard with real-time data.",
          milestonecost: 20000,
          status: "approved",
          deadline: monthsAgo(1),
        },
        {
          title: "Billing & Subscriptions",
          subtitle: "Stripe integration",
          milestonecost: 20000,
          status: "pending_payment",
          deadline: daysFromNow(21),
        },
        {
          title: "Testing & Launch",
          subtitle: "QA + deploy",
          milestonecost: 10000,
          status: "not_started",
          deadline: daysFromNow(45),
        },
      ],
      payments: [
        {
          total_cost: 75000,
          paid_amount: 45000,
          payment_status: "PENDING_VERIFICATION",
          due_date: daysFromNow(5),
          createdAt: monthsAgo(3, 10),
        },
      ],
    },
    {
      title: "Mobile App MVP",
      clientIndex: 3,
      status: "STOPPED",
      milestones: [
        {
          title: "App Concept & Flow",
          milestonecost: 8000,
          status: "approved",
          deadline: monthsAgo(6),
        },
        {
          title: "UI Screens",
          subtitle: "React Native",
          milestonecost: 18000,
          status: "stopped",
          deadline: monthsAgo(4),
          delay: true,
          delayreason: "Client requested scope change mid-development.",
        },
        {
          title: "API Integration",
          milestonecost: 22000,
          status: "not_started",
          deadline: monthsAgo(2),
        },
      ],
      payments: [
        {
          total_cost: 48000,
          paid_amount: 26000,
          payment_status: "DUE",
          due_date: monthsAgo(3),
          createdAt: monthsAgo(6, 20),
        },
      ],
    },
    {
      title: "Corporate Website Revamp",
      clientIndex: 4,
      status: "PENDING",
      milestones: [
        {
          title: "Discovery & Audit",
          subtitle: "Existing site analysis",
          milestonecost: 7000,
          status: "approved",
          deadline: monthsAgo(1),
        },
        {
          title: "New Design",
          subtitle: "Figma prototypes",
          milestonecost: 12000,
          status: "pending_payment",
          deadline: daysFromNow(7),
        },
        {
          title: "Development",
          subtitle: "Next.js static export",
          milestonecost: 18000,
          status: "not_started",
          deadline: daysFromNow(35),
        },
        {
          title: "Content Migration & SEO",
          milestonecost: 8000,
          status: "not_started",
          deadline: daysFromNow(50),
        },
      ],
      payments: [
        {
          total_cost: 45000,
          paid_amount: 7000,
          payment_status: "DUE",
          due_date: daysFromNow(30),
          createdAt: monthsAgo(1, 10),
        },
      ],
    },
    {
      title: "SEO Audit & Optimisation",
      clientIndex: 0,
      status: "PENDING",
      milestones: [
        {
          title: "Technical SEO Audit",
          milestonecost: 6000,
          status: "approved",
          deadline: monthsAgo(1),
        },
        {
          title: "On-Page Fixes",
          milestonecost: 8000,
          status: "pending_payment",
          deadline: daysFromNow(10),
        },
        {
          title: "Link Building",
          milestonecost: 10000,
          status: "not_started",
          deadline: daysFromNow(40),
        },
      ],
      payments: [
        {
          total_cost: 24000,
          paid_amount: 6000,
          payment_status: "DUE",
          due_date: daysFromNow(15),
          createdAt: monthsAgo(1, 18),
        },
      ],
    },
    {
      title: "Brand Identity Package",
      clientIndex: 1,
      status: "PENDING",
      milestones: [
        {
          title: "Logo Design",
          milestonecost: 5000,
          status: "approved",
          deadline: monthsAgo(2),
        },
        {
          title: "Brand Guidelines",
          milestonecost: 7000,
          status: "approved",
          deadline: monthsAgo(1),
        },
        {
          title: "Stationery & Collaterals",
          milestonecost: 8000,
          status: "not_started",
          deadline: daysFromNow(20),
        },
      ],
      payments: [
        {
          total_cost: 20000,
          paid_amount: 12000,
          payment_status: "DUE",
          due_date: daysFromNow(20),
          createdAt: monthsAgo(2, 8),
        },
      ],
    },
    {
      title: "Video Editing — Product Launch",
      clientIndex: 2,
      status: "PENDING",
      milestones: [
        {
          title: "Raw Footage Review",
          milestonecost: 3000,
          status: "approved",
          deadline: monthsAgo(1),
        },
        {
          title: "First Cut",
          milestonecost: 7000,
          status: "pending_payment",
          deadline: daysFromNow(5),
        },
        {
          title: "Final Delivery",
          milestonecost: 5000,
          status: "not_started",
          deadline: daysFromNow(15),
        },
      ],
      payments: [
        {
          total_cost: 15000,
          paid_amount: 3000,
          payment_status: "DUE",
          due_date: daysFromNow(12),
          createdAt: monthsAgo(1, 12),
        },
      ],
    },
    {
      title: "Landing Page — Product Hunt Launch",
      clientIndex: 3,
      status: "PENDING",
      milestones: [
        {
          title: "Copy & Layout",
          milestonecost: 4000,
          status: "approved",
          deadline: monthsAgo(1),
        },
        {
          title: "Dev + Animation",
          milestonecost: 9000,
          status: "not_started",
          deadline: daysFromNow(12),
        },
      ],
      payments: [
        {
          total_cost: 13000,
          paid_amount: 4000,
          payment_status: "DUE",
          due_date: daysFromNow(12),
          createdAt: monthsAgo(1, 22),
        },
      ],
    },
    {
      title: "Admin Panel — Internal Tool",
      clientIndex: 4,
      status: "PENDING",
      milestones: [
        {
          title: "Schema & API Design",
          milestonecost: 8000,
          status: "approved",
          deadline: monthsAgo(2),
        },
        {
          title: "CRUD Interfaces",
          milestonecost: 14000,
          status: "approved",
          deadline: monthsAgo(1),
        },
        {
          title: "Role-Based Auth",
          milestonecost: 10000,
          status: "pending_payment",
          deadline: daysFromNow(8),
        },
        {
          title: "Deployment & Docs",
          milestonecost: 8000,
          status: "not_started",
          deadline: daysFromNow(30),
        },
      ],
      payments: [
        {
          total_cost: 40000,
          paid_amount: 22000,
          payment_status: "PENDING_VERIFICATION",
          due_date: daysFromNow(8),
          createdAt: monthsAgo(2, 5),
        },
      ],
    },
  ];

  for (const seed of projectSeeds) {
    const { profileId } = clientProfiles[seed.clientIndex];

    const existing = await prisma.project.findFirst({
      where: {
        title: seed.title,
        clientId: profileId,
        freelancerId: freelancer.id,
      },
    });
    if (existing) {
      console.log(`  ↳ Project already exists: "${seed.title}"`);
      continue;
    }

    const project = await prisma.project.create({
      data: {
        title: seed.title,
        clientId: profileId,
        freelancerId: freelancer.id,
        status: seed.status,
      },
    });

    for (const m of seed.milestones) {
      await prisma.milestone.create({
        data: {
          projectId: project.id,
          title: m.title,
          subtitle: m.subtitle ?? null,
          description: m.description ?? null,
          milestonecost: m.milestonecost,
          status: m.status,
          deadline: m.deadline,
          delay: m.delay ?? false,
          delayreason: m.delayreason ?? null,
        },
      });
    }

    for (const p of seed.payments) {
      await prisma.payment.create({
        data: {
          projectId: project.id,
          total_cost: p.total_cost,
          paid_amount: p.paid_amount,
          payment_status: p.payment_status,
          due_date: p.due_date,
          createdAt: p.createdAt,
        },
      });
    }

    console.log(
      `  ↳ Created project: "${seed.title}" → ${clientProfiles[seed.clientIndex].name}`
    );
  }

  console.log("\n✅  Seed completed successfully!\n");
  console.log("─────────────────────────────────────────────────────");
  console.log("  Freelancer login");
  console.log("  Email   : websitet547@gmail.com");
  console.log("  Password: Websitetester07");
  console.log("─────────────────────────────────────────────────────");
  console.log("  Client logins (password: Client123!)");
  for (const s of clientSeeds) {
    console.log(`  ${s.name.padEnd(16)} ${s.email}`);
  }
  console.log("─────────────────────────────────────────────────────\n");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

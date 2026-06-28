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
  emailAndPassword: { enabled: true, requireEmailVerification: false },
  user: {
    additionalFields: {
      role: { type: "string", required: true, defaultValue: "CLIENT", input: true },
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
  await seedAuth.api.signUpEmail({
    body: { email, password, name, role },
    headers: new Headers(),
  });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error(`Failed to create user: ${email}`);
  await prisma.user.update({ where: { id: user.id }, data: { emailVerified: true } });
  console.log(`  ↳ Created: ${name} <${email}> [${role}]`);
  return user;
}

async function setProjectUpdatedAt(projectId: string, date: Date) {
  await prisma.$executeRaw`UPDATE "Project" SET "updatedAt" = ${date} WHERE id = ${projectId}`;
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

// ─── Types ────────────────────────────────────────────────────────────────────

type MilestoneSeed = {
  title: string;
  subtitle?: string;
  description?: string;
  milestonecost: number;
  status: "approved" | "pending_payment" | "not_started" | "stopped";
  deadline: Date;
  delay?: boolean;
  delayreason?: string;
};

type PaymentSeed = {
  total_cost: number;
  paid_amount: number;
  payment_status: "DUE" | "PENDING_VERIFICATION" | "PAID";
  due_date: Date;
  createdAt: Date;
};

type ProjectSeed = {
  title: string;
  clientIndex: number;
  status: "PENDING" | "COMPLETED" | "STOPPED";
  agreedCost: number;
  completedAt?: Date;
  milestones: MilestoneSeed[];
  payments: PaymentSeed[];
};

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🌱  Starting seed...\n");

  // ── Wipe ────────────────────────────────────────────────────────────────────
  console.log("🗑️   Wiping existing data...");
  await prisma.budgetRaiseRequest.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  console.log("  ↳ All tables cleared\n");

  // ── Freelancer ──────────────────────────────────────────────────────────────
  console.log("👤  Creating freelancer...");
  const freelancerUser = await createUser(
    "websitet547@gmail.com",
    "Websitetester07",
    "Naman",
    "FREELANCER"
  );
  const freelancer = await prisma.freelancer.create({
    data: { userId: freelancerUser.id, category: "WEB_DEV" },
  });
  console.log("  ↳ Freelancer profile created\n");

  // ── Clients ─────────────────────────────────────────────────────────────────
  console.log("👥  Creating clients...");
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
    const profile = await prisma.userprofile.create({ data: { userId: user.id } });
    clientProfiles.push({ name: seed.name, profileId: profile.id });
  }

  // ── Projects ─────────────────────────────────────────────────────────────────
  console.log("\n📁  Creating projects...");

  // ─── COMPLETED (11) ──────────────────────────────────────────────────────────

  const completedProjects: ProjectSeed[] = [
    {
      title: "E-Commerce Platform",
      clientIndex: 0,
      status: "COMPLETED",
      agreedCost: 80000,
      completedAt: monthsAgo(2, 20),
      milestones: [
        { title: "Design & Wireframes", subtitle: "UI/UX mockups", description: "Figma designs and clickable prototypes for all pages.", milestonecost: 15000, status: "approved", deadline: monthsAgo(5) },
        { title: "Frontend Development", subtitle: "Next.js + Tailwind", description: "Responsive storefront with cart and checkout flows.", milestonecost: 25000, status: "approved", deadline: monthsAgo(4) },
        { title: "Backend & Payments", subtitle: "Node + Razorpay", description: "REST API, auth, and payment gateway integration.", milestonecost: 30000, status: "approved", deadline: monthsAgo(3) },
        { title: "Launch & Handoff", subtitle: "Deploy + docs", description: "Deployed to Vercel, handed over with full documentation.", milestonecost: 10000, status: "approved", deadline: monthsAgo(2) },
      ],
      payments: [
        { total_cost: 30000, paid_amount: 30000, payment_status: "PAID", due_date: monthsAgo(4), createdAt: monthsAgo(5) },
        { total_cost: 50000, paid_amount: 50000, payment_status: "PAID", due_date: monthsAgo(2), createdAt: monthsAgo(2, 20) },
      ],
    },
    {
      title: "FinTech App Redesign",
      clientIndex: 1,
      status: "COMPLETED",
      agreedCost: 55000,
      completedAt: monthsAgo(3, 10),
      milestones: [
        { title: "UX Research & Audit", description: "Analysed existing app flows and identified friction points.", milestonecost: 10000, status: "approved", deadline: monthsAgo(6) },
        { title: "UI Design", subtitle: "Figma components", description: "Full design system and all app screens in Figma.", milestonecost: 20000, status: "approved", deadline: monthsAgo(5) },
        { title: "Dev Implementation", subtitle: "React Native", description: "Shipped redesigned app screens into the existing codebase.", milestonecost: 20000, status: "approved", deadline: monthsAgo(4) },
        { title: "QA & Handoff", milestonecost: 5000, status: "approved", deadline: monthsAgo(3) },
      ],
      payments: [
        { total_cost: 25000, paid_amount: 25000, payment_status: "PAID", due_date: monthsAgo(5), createdAt: monthsAgo(6) },
        { total_cost: 30000, paid_amount: 30000, payment_status: "PAID", due_date: monthsAgo(3), createdAt: monthsAgo(3, 10) },
      ],
    },
    {
      title: "SEO Campaign — D2C Brand",
      clientIndex: 2,
      status: "COMPLETED",
      agreedCost: 32000,
      completedAt: monthsAgo(1, 5),
      milestones: [
        { title: "Technical SEO Audit", description: "Full crawl, Core Web Vitals, and issue report.", milestonecost: 8000, status: "approved", deadline: monthsAgo(4) },
        { title: "On-Page Optimisation", description: "Meta tags, content structure, schema markup.", milestonecost: 12000, status: "approved", deadline: monthsAgo(3) },
        { title: "Reporting & Strategy", description: "GA4 setup, final report, and 6-month roadmap.", milestonecost: 12000, status: "approved", deadline: monthsAgo(1) },
      ],
      payments: [
        { total_cost: 32000, paid_amount: 20000, payment_status: "DUE", due_date: monthsAgo(1), createdAt: monthsAgo(4, 20) },
      ],
    },
    {
      title: "React Native Fitness App",
      clientIndex: 3,
      status: "COMPLETED",
      agreedCost: 90000,
      completedAt: monthsAgo(4, 8),
      milestones: [
        { title: "Architecture & Spec", description: "Tech stack decision, DB schema, and API design.", milestonecost: 15000, status: "approved", deadline: monthsAgo(9) },
        { title: "Core Screens", subtitle: "Onboarding + home + workout tracker", milestonecost: 35000, status: "approved", deadline: monthsAgo(7) },
        { title: "API Integration", description: "Wearables sync, push notifications, and user data.", milestonecost: 25000, status: "approved", deadline: monthsAgo(5) },
        { title: "App Store Release", description: "iOS & Android builds, App Store and Play Store listings.", milestonecost: 15000, status: "approved", deadline: monthsAgo(4) },
      ],
      payments: [
        { total_cost: 40000, paid_amount: 40000, payment_status: "PAID", due_date: monthsAgo(8), createdAt: monthsAgo(9) },
        { total_cost: 50000, paid_amount: 50000, payment_status: "PAID", due_date: monthsAgo(4), createdAt: monthsAgo(4, 8) },
      ],
    },
    {
      title: "WordPress to Next.js Migration",
      clientIndex: 4,
      status: "COMPLETED",
      agreedCost: 38000,
      completedAt: monthsAgo(1, 22),
      milestones: [
        { title: "Audit & Migration Plan", description: "Page inventory, content mapping, and redirect strategy.", milestonecost: 8000, status: "approved", deadline: monthsAgo(3) },
        { title: "Build & Migrate", subtitle: "Next.js + Contentlayer", description: "Rebuilt all pages in Next.js with CMS integration.", milestonecost: 20000, status: "approved", deadline: monthsAgo(2) },
        { title: "SEO & Deployment", description: "Verified redirects, sitemaps, and deployed to Vercel.", milestonecost: 10000, status: "approved", deadline: monthsAgo(1) },
      ],
      payments: [
        { total_cost: 38000, paid_amount: 28000, payment_status: "DUE", due_date: monthsAgo(1), createdAt: monthsAgo(3, 5) },
      ],
    },
    {
      title: "Fashion Video Ad Campaign",
      clientIndex: 0,
      status: "COMPLETED",
      agreedCost: 25000,
      completedAt: monthsAgo(6, 12),
      milestones: [
        { title: "Script & Storyboard", milestonecost: 5000, status: "approved", deadline: monthsAgo(8) },
        { title: "Shoot & Production", milestonecost: 12000, status: "approved", deadline: monthsAgo(7) },
        { title: "Editing & Delivery", subtitle: "3 formats: Reel, Story, YT", milestonecost: 8000, status: "approved", deadline: monthsAgo(6) },
      ],
      payments: [
        { total_cost: 25000, paid_amount: 25000, payment_status: "PAID", due_date: monthsAgo(6), createdAt: monthsAgo(6, 12) },
      ],
    },
    {
      title: "Logistics SaaS Admin Panel",
      clientIndex: 1,
      status: "COMPLETED",
      agreedCost: 60000,
      completedAt: monthsAgo(5, 3),
      milestones: [
        { title: "Architecture & DB Schema", milestonecost: 10000, status: "approved", deadline: monthsAgo(9) },
        { title: "CRUD Modules", description: "Shipments, drivers, and warehouse management interfaces.", milestonecost: 25000, status: "approved", deadline: monthsAgo(7) },
        { title: "Auth & Role Management", subtitle: "Admin / Manager / Driver roles", milestonecost: 15000, status: "approved", deadline: monthsAgo(6) },
        { title: "Deployment & Docs", milestonecost: 10000, status: "approved", deadline: monthsAgo(5) },
      ],
      payments: [
        { total_cost: 30000, paid_amount: 30000, payment_status: "PAID", due_date: monthsAgo(8), createdAt: monthsAgo(9) },
        { total_cost: 30000, paid_amount: 30000, payment_status: "PAID", due_date: monthsAgo(5), createdAt: monthsAgo(5, 3) },
      ],
    },
    {
      title: "Restaurant Website",
      clientIndex: 2,
      status: "COMPLETED",
      agreedCost: 22000,
      completedAt: monthsAgo(8, 18),
      milestones: [
        { title: "Design", subtitle: "Figma mockup", milestonecost: 7000, status: "approved", deadline: monthsAgo(10) },
        { title: "Development", subtitle: "Next.js + Sanity CMS", description: "Menu, gallery, reservations form, and blog.", milestonecost: 12000, status: "approved", deadline: monthsAgo(9) },
        { title: "Launch", milestonecost: 3000, status: "approved", deadline: monthsAgo(8) },
      ],
      payments: [
        { total_cost: 22000, paid_amount: 22000, payment_status: "PAID", due_date: monthsAgo(8), createdAt: monthsAgo(8, 18) },
      ],
    },
    {
      title: "EdTech Product Landing Page",
      clientIndex: 3,
      status: "COMPLETED",
      agreedCost: 18000,
      completedAt: monthsAgo(1, 28),
      milestones: [
        { title: "Copywriting", description: "Conversion-focused copy for hero, features, and pricing.", milestonecost: 4000, status: "approved", deadline: monthsAgo(3) },
        { title: "Design", milestonecost: 8000, status: "approved", deadline: monthsAgo(2) },
        { title: "Development & Animation", subtitle: "Framer Motion", milestonecost: 6000, status: "approved", deadline: monthsAgo(1) },
      ],
      payments: [
        { total_cost: 18000, paid_amount: 10000, payment_status: "DUE", due_date: daysFromNow(7), createdAt: monthsAgo(3, 2) },
      ],
    },
    {
      title: "Brand Identity — StartupX",
      clientIndex: 4,
      status: "COMPLETED",
      agreedCost: 45000,
      completedAt: monthsAgo(7, 6),
      milestones: [
        { title: "Brand Discovery", description: "Workshop to define positioning, values, and audience.", milestonecost: 8000, status: "approved", deadline: monthsAgo(10) },
        { title: "Logo Design", subtitle: "5 concepts → 1 chosen", milestonecost: 12000, status: "approved", deadline: monthsAgo(9) },
        { title: "Brand Guidelines", description: "Typography, colour, usage rules — full PDF.", milestonecost: 15000, status: "approved", deadline: monthsAgo(8) },
        { title: "Stationery & Collaterals", description: "Business cards, letterhead, email signature, social kit.", milestonecost: 10000, status: "approved", deadline: monthsAgo(7) },
      ],
      payments: [
        { total_cost: 20000, paid_amount: 20000, payment_status: "PAID", due_date: monthsAgo(9), createdAt: monthsAgo(10) },
        { total_cost: 25000, paid_amount: 25000, payment_status: "PAID", due_date: monthsAgo(7), createdAt: monthsAgo(7, 6) },
      ],
    },
    {
      title: "Productivity Chrome Extension",
      clientIndex: 0,
      status: "COMPLETED",
      agreedCost: 35000,
      completedAt: monthsAgo(10, 14),
      milestones: [
        { title: "Spec & Architecture", description: "Chrome API design, permissions model, and data flow.", milestonecost: 10000, status: "approved", deadline: monthsAgo(13) },
        { title: "Core Features", subtitle: "Tab manager + focus timer + notes", description: "Main extension popup and background service worker.", milestonecost: 18000, status: "approved", deadline: monthsAgo(11) },
        { title: "Polish & Chrome Store Publish", description: "Keyboard shortcuts, settings sync, and store listing.", milestonecost: 7000, status: "approved", deadline: monthsAgo(10) },
      ],
      payments: [
        { total_cost: 15000, paid_amount: 15000, payment_status: "PAID", due_date: monthsAgo(12), createdAt: monthsAgo(13) },
        { total_cost: 20000, paid_amount: 20000, payment_status: "PAID", due_date: monthsAgo(10), createdAt: monthsAgo(10, 14) },
      ],
    },
  ];

  // ─── ACTIVE (5) ───────────────────────────────────────────────────────────────

  const activeProjects: ProjectSeed[] = [
    {
      title: "Portfolio Website",
      clientIndex: 1,
      status: "PENDING",
      agreedCost: 30000,
      milestones: [
        { title: "Brand Discovery", subtitle: "Colour palette & fonts", description: "Define visual language and brand personality.", milestonecost: 5000, status: "approved", deadline: monthsAgo(2) },
        { title: "Design System", subtitle: "Components library", description: "Reusable Figma components.", milestonecost: 8000, status: "approved", deadline: monthsAgo(1) },
        { title: "Development", subtitle: "Next.js + Framer Motion", description: "Animated portfolio with case studies.", milestonecost: 12000, status: "pending_payment", deadline: daysFromNow(14) },
        { title: "SEO & Go-Live", subtitle: "Optimisation + deploy", description: "On-page SEO, sitemap, and final deployment.", milestonecost: 5000, status: "not_started", deadline: daysFromNow(30) },
      ],
      payments: [
        { total_cost: 30000, paid_amount: 13000, payment_status: "DUE", due_date: daysFromNow(10), createdAt: monthsAgo(1, 5) },
      ],
    },
    {
      title: "SaaS Analytics Dashboard",
      clientIndex: 2,
      status: "PENDING",
      agreedCost: 75000,
      milestones: [
        { title: "Requirements & Architecture", subtitle: "System design doc", milestonecost: 10000, status: "approved", deadline: monthsAgo(3) },
        { title: "Auth & User Management", subtitle: "Better-Auth integration", milestonecost: 15000, status: "approved", deadline: monthsAgo(2) },
        { title: "Analytics Module", subtitle: "Charts & KPIs", description: "Recharts-powered dashboard with real-time data.", milestonecost: 20000, status: "approved", deadline: monthsAgo(1) },
        { title: "Billing & Subscriptions", subtitle: "Stripe integration", milestonecost: 20000, status: "pending_payment", deadline: daysFromNow(21) },
        { title: "Testing & Launch", subtitle: "QA + deploy", milestonecost: 10000, status: "not_started", deadline: daysFromNow(45) },
      ],
      payments: [
        { total_cost: 75000, paid_amount: 45000, payment_status: "PENDING_VERIFICATION", due_date: daysFromNow(5), createdAt: monthsAgo(3, 10) },
      ],
    },
    {
      title: "Mobile App MVP",
      clientIndex: 3,
      status: "STOPPED",
      agreedCost: 48000,
      milestones: [
        { title: "App Concept & Flow", milestonecost: 8000, status: "approved", deadline: monthsAgo(6) },
        { title: "UI Screens", subtitle: "React Native", milestonecost: 18000, status: "stopped", deadline: monthsAgo(4), delay: true, delayreason: "Client requested scope change mid-development." },
        { title: "API Integration", milestonecost: 22000, status: "not_started", deadline: monthsAgo(2) },
      ],
      payments: [
        { total_cost: 48000, paid_amount: 26000, payment_status: "DUE", due_date: monthsAgo(3), createdAt: monthsAgo(6, 20) },
      ],
    },
    {
      title: "Corporate Website Revamp",
      clientIndex: 4,
      status: "PENDING",
      agreedCost: 45000,
      milestones: [
        { title: "Discovery & Audit", subtitle: "Existing site analysis", milestonecost: 7000, status: "approved", deadline: monthsAgo(1) },
        { title: "New Design", subtitle: "Figma prototypes", milestonecost: 12000, status: "pending_payment", deadline: daysFromNow(7) },
        { title: "Development", subtitle: "Next.js static export", milestonecost: 18000, status: "not_started", deadline: daysFromNow(35) },
        { title: "Content Migration & SEO", milestonecost: 8000, status: "not_started", deadline: daysFromNow(50) },
      ],
      payments: [
        { total_cost: 45000, paid_amount: 7000, payment_status: "DUE", due_date: daysFromNow(30), createdAt: monthsAgo(1, 10) },
      ],
    },
    {
      title: "Internal Admin Panel",
      clientIndex: 0,
      status: "PENDING",
      agreedCost: 40000,
      milestones: [
        { title: "Schema & API Design", milestonecost: 8000, status: "approved", deadline: monthsAgo(2) },
        { title: "CRUD Interfaces", milestonecost: 14000, status: "approved", deadline: monthsAgo(1) },
        { title: "Role-Based Auth", milestonecost: 10000, status: "pending_payment", deadline: daysFromNow(8) },
        { title: "Deployment & Docs", milestonecost: 8000, status: "not_started", deadline: daysFromNow(30) },
      ],
      payments: [
        { total_cost: 40000, paid_amount: 22000, payment_status: "PENDING_VERIFICATION", due_date: daysFromNow(8), createdAt: monthsAgo(2, 5) },
      ],
    },
  ];

  const allProjects = [...completedProjects, ...activeProjects];

  for (const seed of allProjects) {
    const { profileId } = clientProfiles[seed.clientIndex];

    const project = await prisma.project.create({
      data: {
        title: seed.title,
        clientId: profileId,
        freelancerId: freelancer.id,
        status: seed.status,
        agreedCost: seed.agreedCost,
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

    if (seed.completedAt) {
      await setProjectUpdatedAt(project.id, seed.completedAt);
    }

    console.log(`  ↳ [${seed.status}] "${seed.title}" → ${clientProfiles[seed.clientIndex].name}`);
  }

  // ── Budget Raise Requests ────────────────────────────────────────────────────
  console.log("\n💰  Creating budget raise requests...");

  const saasProject = await prisma.project.findFirst({ where: { title: "SaaS Analytics Dashboard" } });
  const adminProject = await prisma.project.findFirst({ where: { title: "Internal Admin Panel" } });

  if (saasProject) {
    await prisma.budgetRaiseRequest.create({
      data: {
        projectId: saasProject.id,
        requestedById: freelancer.id,
        currentBudget: 75000,
        requestedBudget: 90000,
        reason: "Client added real-time WebSocket requirement after scope was locked. Estimated 15–20 hours of extra work.",
        status: "PENDING",
        createdAt: monthsAgo(0, 3),
      },
    });
    console.log("  ↳ Budget raise request created for SaaS Analytics Dashboard");
  }

  if (adminProject) {
    await prisma.budgetRaiseRequest.create({
      data: {
        projectId: adminProject.id,
        requestedById: freelancer.id,
        currentBudget: 40000,
        requestedBudget: 52000,
        reason: "Role-based auth expanded to include SSO and 2FA which were not in the original spec.",
        status: "APPROVED",
        createdAt: monthsAgo(1, 8),
        reviewedAt: monthsAgo(1, 6),
      },
    });
    console.log("  ↳ Budget raise request created for Internal Admin Panel");
  }

  // ── Summary ──────────────────────────────────────────────────────────────────
  console.log("\n✅  Seed completed successfully!\n");
  console.log("─────────────────────────────────────────────────────");
  console.log("  Freelancer login");
  console.log("  Email   : websitet547@gmail.com");
  console.log("  Password: Websitetester07");
  console.log("─────────────────────────────────────────────────────");
  console.log("  Client logins  (password: Client123!)");
  for (const s of clientSeeds) {
    console.log(`  ${s.name.padEnd(16)} ${s.email}`);
  }
  console.log("─────────────────────────────────────────────────────");
  console.log(`  Projects: ${completedProjects.length} completed, ${activeProjects.length} active`);
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

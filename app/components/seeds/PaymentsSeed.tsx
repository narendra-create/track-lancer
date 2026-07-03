import { Paymentstatus } from "@/app/generated/prisma/enums";
import type { ProjectWithPayments } from "@/types/payment"; // adjust the path as needed

export const DUMMY_PROJECTS: ProjectWithPayments[] = [
  {
    id: "proj_001",
    title: "E-Commerce Platform Redesign",
    createdAt: new Date("2026-01-15T10:00:00Z"),
    payments: [
      {
        id: "pay_001_1",
        projectId: "proj_001",
        project: { title: "E-Commerce Platform Redesign" },
        total_cost: 50000,
        paid_amount: 50000,
        payment_status: Paymentstatus.PAID,
        due_date: new Date("2026-02-15T23:59:59Z"),
        createdAt: new Date("2026-02-01T10:00:00Z"),
        completedAt: new Date("2026-02-10T14:30:00Z")
      },
      {
        id: "pay_001_2",
        projectId: "proj_001",
        project: { title: "E-Commerce Platform Redesign" },
        total_cost: 30000,
        paid_amount: 0,
        payment_status: Paymentstatus.PENDING_VERIFICATION,
        due_date: new Date("2026-04-15T23:59:59Z"),
        createdAt: new Date("2026-04-01T10:00:00Z"),
        completedAt: null
      },
      {
        id: "pay_001_3",
        projectId: "proj_001",
        project: { title: "E-Commerce Platform Redesign" },
        total_cost: 20000,
        paid_amount: 0,
        payment_status: Paymentstatus.DUE,
        due_date: new Date("2026-06-15T23:59:59Z"),
        createdAt: new Date("2026-06-01T10:00:00Z"),
        completedAt: null
      }
    ]
  },
  {
    id: "proj_002",
    title: "Brand Identity & Logo",
    createdAt: new Date("2026-06-20T09:30:00Z"),
    payments: [
      {
        id: "pay_002_1",
        projectId: "proj_002",
        project: { title: "Brand Identity & Logo" },
        total_cost: 15000,
        paid_amount: 0,
        payment_status: Paymentstatus.DUE,
        due_date: new Date("2026-07-05T23:59:59Z"),
        createdAt: new Date("2026-06-20T10:00:00Z"),
        completedAt: null
      }
    ]
  },
  {
    id: "proj_003",
    title: "Mobile App Development Phase 1",
    createdAt: new Date("2025-11-01T08:00:00Z"),
    payments: [
      {
        id: "pay_003_1",
        projectId: "proj_003",
        project: { title: "Mobile App Development Phase 1" },
        total_cost: 45000,
        paid_amount: 45000,
        payment_status: Paymentstatus.PAID,
        due_date: new Date("2025-12-01T23:59:59Z"),
        createdAt: new Date("2025-11-15T10:00:00Z"),
        completedAt: new Date("2025-11-28T09:15:00Z")
      },
      {
        id: "pay_003_2",
        projectId: "proj_003",
        project: { title: "Mobile App Development Phase 1" },
        total_cost: 45000,
        paid_amount: 45000,
        payment_status: Paymentstatus.PAID,
        due_date: new Date("2026-01-15T23:59:59Z"),
        createdAt: new Date("2026-01-01T10:00:00Z"),
        completedAt: new Date("2026-01-10T16:20:00Z")
      }
    ]
  },
  {
    id: "proj_004",
    title: "SEO & Marketing Retainer",
    createdAt: new Date("2026-03-01T11:00:00Z"),
    payments: [
      {
        id: "pay_004_1",
        projectId: "proj_004",
        project: { title: "SEO & Marketing Retainer" },
        total_cost: 5000,
        paid_amount: 0,
        payment_status: Paymentstatus.PENDING_VERIFICATION,
        due_date: new Date("2026-04-01T23:59:59Z"),
        createdAt: new Date("2026-03-25T10:00:00Z"),
        completedAt: null
      },
      {
        id: "pay_004_2",
        projectId: "proj_004",
        project: { title: "SEO & Marketing Retainer" },
        total_cost: 5000,
        paid_amount: 0,
        payment_status: Paymentstatus.PENDING_VERIFICATION,
        due_date: new Date("2026-05-01T23:59:59Z"),
        createdAt: new Date("2026-04-25T10:00:00Z"),
        completedAt: null
      }
    ]
  },
  {
    id: "proj_005",
    title: "Custom CRM Dashboard",
    createdAt: new Date("2026-05-01T14:00:00Z"),
    payments: [
      {
        id: "pay_005_1",
        projectId: "proj_005",
        project: { title: "Custom CRM Dashboard" },
        total_cost: 80000,
        paid_amount: 80000,
        payment_status: Paymentstatus.PAID,
        due_date: new Date("2026-05-20T23:59:59Z"),
        createdAt: new Date("2026-05-05T10:00:00Z"),
        completedAt: new Date("2026-05-18T11:00:00Z")
      },
      {
        id: "pay_005_2",
        projectId: "proj_005",
        project: { title: "Custom CRM Dashboard" },
        total_cost: 40000,
        paid_amount: 0,
        payment_status: Paymentstatus.DUE,
        due_date: new Date("2026-06-30T23:59:59Z"),
        createdAt: new Date("2026-06-25T10:00:00Z"),
        completedAt: null
      }
    ]
  },
  {
    id: "proj_006",
    title: "Social Media Assets",
    createdAt: new Date("2026-07-02T09:00:00Z"),
    payments: []
  },
  {
    id: "proj_007",
    title: "Backend API Migration",
    createdAt: new Date("2025-08-10T10:00:00Z"),
    payments: [
      {
        id: "pay_007_1",
        projectId: "proj_007",
        project: { title: "Backend API Migration" },
        total_cost: 120000,
        paid_amount: 120000,
        payment_status: Paymentstatus.PAID,
        due_date: new Date("2025-09-10T23:59:59Z"),
        createdAt: new Date("2025-08-25T10:00:00Z"),
        completedAt: new Date("2025-09-08T15:30:00Z")
      },
      {
        id: "pay_007_2",
        projectId: "proj_007",
        project: { title: "Backend API Migration" },
        total_cost: 60000,
        paid_amount: 60000,
        payment_status: Paymentstatus.PAID,
        due_date: new Date("2025-11-10T23:59:59Z"),
        createdAt: new Date("2025-10-25T10:00:00Z"),
        completedAt: new Date("2025-11-05T12:00:00Z")
      },
      {
        id: "pay_007_3",
        projectId: "proj_007",
        project: { title: "Backend API Migration" },
        total_cost: 30000,
        paid_amount: 30000,
        payment_status: Paymentstatus.PAID,
        due_date: new Date("2026-01-10T23:59:59Z"),
        createdAt: new Date("2025-12-20T10:00:00Z"),
        completedAt: new Date("2026-01-08T09:45:00Z")
      }
    ]
  },
  {
    id: "proj_008",
    title: "Video Editing - Monthly Vlog",
    createdAt: new Date("2026-04-10T10:00:00Z"),
    payments: [
      {
        id: "pay_008_1",
        projectId: "proj_008",
        project: { title: "Video Editing - Monthly Vlog" },
        total_cost: 12000,
        paid_amount: 12000,
        payment_status: Paymentstatus.PAID,
        due_date: new Date("2026-05-10T23:59:59Z"),
        createdAt: new Date("2026-04-25T10:00:00Z"),
        completedAt: new Date("2026-05-02T13:10:00Z")
      },
      {
        id: "pay_008_2",
        projectId: "proj_008",
        project: { title: "Video Editing - Monthly Vlog" },
        total_cost: 12000,
        paid_amount: 0,
        payment_status: Paymentstatus.PENDING_VERIFICATION,
        due_date: new Date("2026-06-10T23:59:59Z"),
        createdAt: new Date("2026-05-25T10:00:00Z"),
        completedAt: null
      },
      {
        id: "pay_008_3",
        projectId: "proj_008",
        project: { title: "Video Editing - Monthly Vlog" },
        total_cost: 12000,
        paid_amount: 0,
        payment_status: Paymentstatus.DUE,
        due_date: new Date("2026-07-10T23:59:59Z"),
        createdAt: new Date("2026-06-25T10:00:00Z"),
        completedAt: null
      }
    ]
  },
  {
    id: "proj_009",
    title: "Copywriting - Landing Page",
    createdAt: new Date("2026-06-18T10:00:00Z"),
    payments: [
      {
        id: "pay_009_1",
        projectId: "proj_009",
        project: { title: "Copywriting - Landing Page" },
        total_cost: 8500,
        paid_amount: 0,
        payment_status: Paymentstatus.PENDING_VERIFICATION,
        due_date: new Date("2026-06-30T23:59:59Z"),
        createdAt: new Date("2026-06-22T10:00:00Z"),
        completedAt: null
      }
    ]
  },
  {
    id: "proj_010",
    title: "3D Animation Render",
    createdAt: new Date("2026-05-20T10:00:00Z"),
    payments: [
      {
        id: "pay_010_1",
        projectId: "proj_010",
        project: { title: "3D Animation Render" },
        total_cost: 25000,
        paid_amount: 0,
        payment_status: Paymentstatus.DUE,
        due_date: new Date("2026-06-20T23:59:59Z"),
        createdAt: new Date("2026-06-01T10:00:00Z"),
        completedAt: null
      },
      {
        id: "pay_010_2",
        projectId: "proj_010",
        project: { title: "3D Animation Render" },
        total_cost: 25000,
        paid_amount: 0,
        payment_status: Paymentstatus.DUE,
        due_date: new Date("2026-07-20T23:59:59Z"),
        createdAt: new Date("2026-06-01T10:00:00Z"),
        completedAt: null
      }
    ]
  }
];
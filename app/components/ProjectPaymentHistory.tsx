"use client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Plus } from "lucide-react";
import { PaymentHistoryCard } from "./card/PaymentHistoryCard";
import type { PaymentHistory } from "@/types/payment";
import { Paymentstatus } from "@/app/generated/prisma/enums";

import type { ProjectWithPayments } from "@/types/payment";

interface ProjectPaymentHistoryProps {
  role: "CLIENT" | "FREELANCER";
  projects: ProjectWithPayments[];
}

export function ProjectPaymentHistory({ role, projects }: ProjectPaymentHistoryProps) {
  const router = useRouter();

  // Sort projects by createdAt (latest on top)
  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="w-full max-w-5xl mx-auto pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[var(--color-dash-ink3)] hover:text-white transition-colors mb-4 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-[10px] tracking-[1.5px] uppercase">Back</span>
          </button>
          <h1 className="font-serif text-[26px] lg:text-[30px] text-white leading-tight mb-1">
            Payment History
          </h1>
          <p className="font-mono text-[10px] tracking-[2px] uppercase text-[var(--color-dash-ink3)]">
            {projects.length} Project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="w-full h-px bg-[var(--color-dash-border)] mb-10" />

      {/* Projects Section */}
      <div className="space-y-16">
        {sortedProjects.length === 0 && (
          <div className="text-center py-16 border border-[var(--color-dash-border)] rounded-xl bg-[var(--color-dash-surface1)]">
            <p className="font-mono text-[12px] tracking-[2px] uppercase text-[var(--color-dash-ink4)]">
              No projects found
            </p>
          </div>
        )}

        {sortedProjects.map((project) => {
          // Sort payments by createdAt (latest on top) within the project
          const sortedPayments = [...project.payments].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          // Group payments into sections
          const duePayments = sortedPayments.filter((p) => p.payment_status === "DUE");
          const pendingPayments = sortedPayments.filter((p) => p.payment_status === "PENDING_VERIFICATION");
          const completedPayments = sortedPayments.filter((p) => p.payment_status === "PAID");

          return (
            <div key={project.id} className="bg-[var(--color-dash-surface1)] border border-[var(--color-dash-border)] rounded-2xl p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[var(--color-dash-border)]">
                <div>
                  <h2 className="font-serif text-[20px] lg:text-[24px] text-white leading-snug mb-1">
                    {project.title}
                  </h2>
                  <p className="font-mono text-[10px] tracking-[1px] text-[var(--color-dash-ink4)]">
                    ID: {project.id}
                  </p>
                </div>
                {role === "FREELANCER" && (
                  <button
                    onClick={() => router.push(`/freelancer/payments/new/${project.id}`)}
                    className="shrink-0 flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-gray-200 transition-colors rounded-md font-mono text-[10px] uppercase tracking-[1.5px]"
                  >
                    <Plus size={14} />
                    New Payment
                  </button>
                )}
              </div>

              <div className="space-y-10">
                {/* Due Payments Section */}
                {duePayments.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <span className="w-[6px] h-[6px] rounded-full shrink-0 bg-[var(--color-dash-gold)]" />
                      <h3 className="font-serif text-[17px] text-white">Due Payments</h3>
                      <span className="font-mono text-[10px] tracking-[2px] text-[var(--color-dash-ink4)]">
                        {duePayments.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <AnimatePresence mode="popLayout">
                        {duePayments.map((payment, i) => (
                          <PaymentHistoryCard key={payment.id} payment={payment} index={i} role={role} />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* Pending Payments Section */}
                {pendingPayments.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <span className="w-[6px] h-[6px] rounded-full shrink-0 bg-[var(--color-dash-amber)]" />
                      <h3 className="font-serif text-[17px] text-white">Pending Payments</h3>
                      <span className="font-mono text-[10px] tracking-[2px] text-[var(--color-dash-ink4)]">
                        {pendingPayments.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <AnimatePresence mode="popLayout">
                        {pendingPayments.map((payment, i) => (
                          <PaymentHistoryCard key={payment.id} payment={payment} index={i} role={role} />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* Completed Payments Section */}
                {completedPayments.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <span className="w-[6px] h-[6px] rounded-full shrink-0 bg-[var(--color-dash-green)]" />
                      <h3 className="font-serif text-[17px] text-white">Completed Payments</h3>
                      <span className="font-mono text-[10px] tracking-[2px] text-[var(--color-dash-ink4)]">
                        {completedPayments.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <AnimatePresence mode="popLayout">
                        {completedPayments.map((payment, i) => (
                          <PaymentHistoryCard key={payment.id} payment={payment} index={i} role={role} />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {project.payments.length === 0 && (
                  <div className="text-center py-10 bg-[var(--color-dash-surface2)] rounded-xl border border-[var(--color-dash-border-hover)]">
                    <p className="font-mono text-[11px] tracking-[2px] uppercase text-[var(--color-dash-ink4)]">
                      No payments recorded for this project
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

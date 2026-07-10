"use client";

import { motion } from "motion/react";
import {
  ArrowLeft,
  Briefcase,
  CalendarClock,
  CircleDollarSign,
  Clock3,
  ShieldAlert,
  Smartphone,
  ScanLine,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { UPIPaymentQR } from "@/app/components/client/UPIPaymentQR";
import {
  fadeUp,
  fadeLeft,
  fadeRight,
  staggerContainer,
} from "@/app/lib/animations";

type PaymentStatus = "DUE" | "PAID";

export interface PayNowViewProps {
  projectTitle: string;
  freelancerName: string;
  upiId: string | null;
  amount: number | "custom";
  dueDate: string;
  status: PaymentStatus;
  backHref: string;
  onVerify: (paid_amount: number, txn_number: string) => void | Promise<unknown>;
}

const HOW_TO_PAY = [
  {
    step: "01",
    icon: ScanLine,
    title: "Scan the QR",
    desc: "Open any UPI app — GPay, PhonePe, Paytm — and scan the QR code.",
    iconColor: "text-[var(--color-dash-gold)]",
    stepColor: "text-[var(--color-dash-gold)]",
    borderColor: "border-l-[var(--color-dash-gold)]",
  },
  {
    step: "02",
    icon: Smartphone,
    title: "Complete Payment",
    desc: "Confirm the amount and your UPI PIN. Do not close the app until you see a success screen.",
    iconColor: "text-[var(--color-dash-green)]",
    stepColor: "text-[var(--color-dash-green)]",
    borderColor: "border-l-[var(--color-dash-green)]",
  },
  {
    step: "03",
    icon: CheckCircle2,
    title: "Submit UTR / Txn ID",
    desc: "Copy the 12-digit UTR or transaction reference from your UPI app and paste it in the field below the QR.",
    iconColor: "text-[var(--color-dash-amber)]",
    stepColor: "text-[var(--color-dash-amber)]",
    borderColor: "border-l-[var(--color-dash-amber)]",
  },
  {
    step: "04",
    icon: ShieldAlert,
    title: "Wait for Confirmation",
    desc: "Your freelancer will verify the transaction. You will see a status update on your payments page.",
    iconColor: "text-[var(--color-dash-ink2)]",
    stepColor: "text-[var(--color-dash-ink3)]",
    borderColor: "border-l-[var(--color-dash-border-hover)]",
  },
];

export function PayNowView({
  projectTitle,
  freelancerName,
  upiId,
  amount,
  dueDate,
  status,
  backHref,
  onVerify,
}: PayNowViewProps) {
  const isDue = status === "DUE";

  return (
    <div className="min-h-screen w-full bg-[var(--color-dash-bg)]">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-8">

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-[var(--color-dash-ink3)] hover:text-[var(--color-dash-ink)] transition-colors mb-10 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-150" />
            <span className="font-sans text-[12px] uppercase">Back to Payments</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-8 xl:gap-14 items-start">

          <motion.div
            className="space-y-6"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={fadeRight}>
              <p className="font-sans text-[11px] uppercase text-[var(--color-dash-ink3)] mb-3">
                Payment Due
              </p>
              <h1 className="font-serif text-[32px] lg:text-[42px] text-[var(--color-dash-ink)] leading-tight mb-2">
                {projectTitle}
              </h1>
              <p className="font-sans text-[13px] text-[var(--color-dash-ink3)]">
                Complete this payment to keep your project running smoothly.
              </p>
            </motion.div>

            <motion.div variants={fadeRight} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border border-[var(--color-dash-border)] border-l-2 border-l-[var(--color-dash-ink2)] bg-[var(--color-dash-surface1)] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase size={13} className="text-[var(--color-dash-ink2)]" strokeWidth={1.5} />
                  <p className="font-sans text-[11px] uppercase text-[var(--color-dash-ink3)]">Freelancer</p>
                </div>
                <p className="font-serif text-[20px] text-[var(--color-dash-ink)]">{freelancerName}</p>
                {upiId && (
                  <p className="font-mono text-[10px] text-[var(--color-dash-ink3)] mt-1 tracking-wide">{upiId}</p>
                )}
              </div>

              <div className="border border-[var(--color-dash-border)] border-l-2 border-l-[var(--color-dash-gold)] bg-[var(--color-dash-surface1)] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CircleDollarSign size={13} className="text-[var(--color-dash-gold)]" strokeWidth={1.5} />
                  <p className="font-sans text-[11px] uppercase text-[var(--color-dash-ink3)]">Amount Due</p>
                </div>
                {amount === "custom" ? (
                  <p className="font-serif text-[20px] text-[var(--color-dash-ink3)]">Enter amount below</p>
                ) : (
                  <p className="font-mono text-[28px] text-[var(--color-dash-gold)] tabular-nums leading-none">
                    ₹{amount.toLocaleString("en-IN")}
                  </p>
                )}
              </div>

              <div className="border border-[var(--color-dash-border)] border-l-2 border-l-[var(--color-dash-amber)] bg-[var(--color-dash-surface1)] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarClock size={13} className="text-[var(--color-dash-amber)]" strokeWidth={1.5} />
                  <p className="font-sans text-[11px] uppercase text-[var(--color-dash-ink3)]">Due Date</p>
                </div>
                <p className="font-serif text-[20px] text-[var(--color-dash-ink)]">{dueDate}</p>
              </div>

              <div className="border border-[var(--color-dash-border)] border-l-2 border-l-[var(--color-status-paid-text)] bg-[var(--color-dash-surface1)] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Clock3 size={13} className="text-[var(--color-dash-green)]" strokeWidth={1.5} />
                  <p className="font-sans text-[11px] uppercase text-[var(--color-dash-ink3)]">Status</p>
                </div>
                <span
                  className={`inline-flex items-center gap-2 font-mono text-[11px] tracking-[1.5px] uppercase font-semibold px-3 py-1 border ${
                    isDue
                      ? "bg-[var(--color-status-pending-bg)] border-[var(--color-status-pending-border)] text-[var(--color-dash-gold)]"
                      : "bg-[var(--color-status-paid-bg)] border-[var(--color-status-paid-border)] text-[var(--color-dash-green)]"
                  }`}
                >
                  <span className="text-base leading-none">•</span>
                  {status}
                </span>
              </div>
            </motion.div>

            <motion.div
              variants={fadeRight}
              className="border border-[var(--color-dash-border)] bg-[var(--color-dash-surface1)]"
            >
              <div className="px-5 py-4 border-b border-[var(--color-dash-border)]">
                <p className="font-sans text-[13px] text-[var(--color-dash-ink3)]">How to Pay</p>
              </div>
              <div className="divide-y divide-[var(--color-dash-border)]">
                {HOW_TO_PAY.map(({ step, icon: Icon, title, desc, iconColor, stepColor, borderColor }) => (
                  <div key={step} className={`flex items-start gap-4 px-5 py-4 border-l-2 ${borderColor}`}>
                    <div className="shrink-0 w-8 h-8 border border-[var(--color-dash-border)] bg-[var(--color-dash-surface2)] flex items-center justify-center mt-0.5">
                      <Icon size={14} strokeWidth={1.5} className={iconColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`font-mono text-[9px] tracking-[2px] ${stepColor}`}>{step}</span>
                        <p className="font-serif text-[15px] text-[var(--color-dash-ink)]">{title}</p>
                      </div>
                      <p className="font-sans text-[12px] text-[var(--color-dash-ink3)] leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={fadeRight}
              className="border border-[var(--color-status-stopped-border)] bg-[var(--color-status-stopped-bg)] px-5 py-4 flex items-start gap-3"
            >
              <ShieldAlert size={14} strokeWidth={1.5} className="text-[var(--color-dash-amber)] mt-0.5 shrink-0" />
              <p className="font-sans text-[12px] text-[var(--color-dash-ink3)] leading-relaxed">
                Never share your UPI PIN with anyone. Freelancer OS only collects your transaction reference for verification purposes.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeLeft}
            initial="hidden"
            animate="show"
            className="lg:sticky lg:top-8"
          >
            <UPIPaymentQR
              upiId={upiId}
              amount={amount}
              label={freelancerName}
              onVerify={onVerify}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

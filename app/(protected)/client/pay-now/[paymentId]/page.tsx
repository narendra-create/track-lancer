import {
  intiiatePaymentSchema,
  intiiatePaymentInput,
} from "@/app/lib/validations/PaymentValidation";
import { initiatePayment } from "@/app/lib/controllers/paymentController";
import { UPIPaymentQR } from "@/app/components/client/UPIPaymentQR";
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

const DUMMY_PAYMENT = {
  projectTitle: "E-Commerce Website Redesign",
  freelancerName: "Narendra Dubey",
  upiId: "yourUpi@yourbank",
  totalDue: 10000,
  dueDate: "30 Jul 2026",
  status: "DUE" as const,
};

const HOW_TO_PAY = [
  {
    step: "01",
    icon: ScanLine,
    title: "Scan the QR",
    desc: "Open any UPI app — GPay, PhonePe, Paytm — and scan the QR code shown.",
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

const PaymentPage = () => {
  const handleVerify = async (paid_amount: number, txn_number: string) => {
    "use server";
    const payload: intiiatePaymentInput = {
      paid_amount: paid_amount,
      txn_number: txn_number,
      paymentId: "nothing",
    };
    const parsed = intiiatePaymentSchema.safeParse(payload);
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }
    const result = await initiatePayment(parsed.data);
    if (!result.success) {
      return {
        error: `- ${result.status}, cause - ${result.error} - Please submit again or contact freelancer`,
      };
    }

    return { verification: result.createdVerification };
  };

  const isDue = DUMMY_PAYMENT.status === "DUE";

  return (
    <div className="min-h-screen w-full bg-[var(--color-dash-bg)]">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-8">
        <Link
          href="/client/payments"
          className="inline-flex items-center gap-2 text-[var(--color-dash-ink3)] hover:text-[var(--color-dash-ink)] transition-colors mb-10 group"
        >
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform duration-150"
          />
          <span className="font-mono text-[10px] tracking-[2px] uppercase">
            Back to Payments
          </span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-8 xl:gap-14 items-start">
          <div className="space-y-6">
            <div>
              <p className="font-sans text-[11px] uppercase text-[var(--color-dash-ink3)] mb-3">
                Payment Due
              </p>
              <h1 className="font-serif text-[32px] lg:text-[42px] text-[var(--color-dash-ink)] leading-tight mb-2">
                {DUMMY_PAYMENT.projectTitle}
              </h1>
              <p className="font-sans text-[13px] text-[var(--color-dash-ink3)]">
                Complete this payment to keep your project running smoothly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border rounded-r-lg border-[var(--color-dash-border)] border-l-2 border-l-[var(--color-dash-ink2)] bg-[var(--color-dash-surface1)] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase
                    size={13}
                    className="text-[var(--color-dash-ink2)]"
                    strokeWidth={1.5}
                  />
                  <p className="font-sans text-[12px] uppercase text-ink-dim/70 font-medium tracking-[0.6px]">
                    Freelancer
                  </p>
                </div>
                <p className="font-serif text-[20px] text-ink font-semibold tracking-badge">
                  {DUMMY_PAYMENT.freelancerName}
                </p>
                <p className="font-mono text-[10px] text-ink-dim/60 font-medium tracking-[0.6px] mt-1 tracking-wide">
                  {DUMMY_PAYMENT.upiId}
                </p>
              </div>

              <div className="border rounded-r-lg border-[var(--color-dash-border)] border-l-2 border-l-[var(--color-dash-gold)] bg-[var(--color-dash-surface1)] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CircleDollarSign
                    size={13}
                    className="text-[var(--color-dash-gold)]"
                    strokeWidth={1.5}
                  />
                  <p className="font-sans text-[11px] lg:text-[12px] lg:font-semibold uppercase text-ink-dim/70 font-medium tracking-[0.6px]">
                    Amount Due
                  </p>
                </div>
                <p className="font-mono text-[28px] text-[var(--color-dash-gold)] tabular-nums leading-none">
                  ₹{DUMMY_PAYMENT.totalDue.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="border rounded-r-lg border-[var(--color-dash-border)] border-l-2 border-l-[var(--color-dash-amber)] bg-[var(--color-dash-surface1)] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarClock
                    size={13}
                    className="text-[var(--color-dash-amber)]"
                    strokeWidth={1.5}
                  />
                  <p className="font-sans text-[11px] lg:text-[12px] lg:font-semibold uppercase text-ink-dim/70 font-medium tracking-[0.6px]">
                    Due Date
                  </p>
                </div>
                <p className="font-serif text-[20px] font-semibold tracking-badge text-[var(--color-dash-ink)]">
                  {DUMMY_PAYMENT.dueDate}
                </p>
              </div>

              <div className="border rounded-r-lg border-[var(--color-dash-border)] border-l-2 bg-[var(--color-dash-surface1)] p-5 border-l-[var(--color-status-paid-text)]">
                <div className="flex items-center gap-2 mb-3">
                  <Clock3
                    size={13}
                    className="text-[var(--color-dash-green)]"
                    strokeWidth={1.5}
                  />
                  <p className="font-sans text-[11px] lg:text-[12px] lg:font-semibold uppercase text-ink-dim/70 font-medium tracking-[0.6px]">
                    Status
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-2 font-mono rounded-lg text-[11px] lg:text-[12px] lg:font-semibold tracking-[1.5px] uppercase font-semibold px-3 py-1 border ${
                    isDue
                      ? "bg-[var(--color-status-pending-bg)] border-[var(--color-status-pending-border)] text-[var(--color-dash-gold)]"
                      : "bg-[var(--color-status-paid-bg)] border-[var(--color-status-paid-border)] text-[var(--color-dash-green)]"
                  }`}
                >
                  <span className="text-base leading-none">•</span>
                  {DUMMY_PAYMENT.status}
                </span>
              </div>
            </div>

            <div className="border rounded-lg border-[var(--color-dash-border)] bg-[var(--color-dash-surface1)]">
              <div className="px-5 py-4 border-b border-[var(--color-dash-border)]">
                <p className="font-sans text-[14px] text-dash-ink2 font-semibold lg:text-[16px]">
                  How to Pay
                </p>
              </div>
              <div className="divide-y divide-[var(--color-dash-border)]">
                {HOW_TO_PAY.map(
                  ({
                    step,
                    icon: Icon,
                    title,
                    desc,
                    iconColor,
                    stepColor,
                    borderColor,
                  }) => (
                    <div
                      key={step}
                      className={`flex items-start gap-4 px-5 py-4 border-l-2 ${borderColor}`}
                    >
                      <div className="shrink-0 w-8 h-8 lg:w-12 lg:h-12 border border-[var(--color-dash-border)] bg-dash-surface1 flex items-center justify-center mt-0.5">
                        <Icon
                          size={18}
                          strokeWidth={2}
                          className={iconColor}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span
                            className={`font-mono text-[13px] tracking-[2px] ${stepColor}`}
                          >
                            {step}
                          </span>
                          <p className="font-serif text-[17px] font-semibold tracking-[0.9px] text-[var(--color-dash-ink)]">
                            {title}
                          </p>
                        </div>
                        <p className="font-sans text-[13px] text-dash-ink2/58 leading-relaxed">
                          {desc}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="border rounded-lg border-[var(--color-status-stopped-border)] bg-[var(--color-status-stopped-bg)] px-5 py-4 flex items-start gap-3">
              <ShieldAlert
                size={17}
                strokeWidth={2}
                className="text-[var(--color-dash-amber)] mt-0.5 shrink-0"
              />
              <p className="font-sans text-[14px] text-ink-dim/70 font-bold leading-relaxed">
                Never share your UPI PIN with anyone. Freelancer OS only
                collects your transaction reference for verification purposes.
              </p>
            </div>
          </div>

          <div className="lg:sticky lg:top-8">
            <UPIPaymentQR
              amount={123456789}
              label={DUMMY_PAYMENT.freelancerName}
              onVerify={handleVerify}
              upiId={DUMMY_PAYMENT.upiId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

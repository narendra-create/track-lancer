"use client";

import { useState, useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, ScanLine, ShieldCheck } from "lucide-react";
import { VerificationPopup } from "@/app/components/client/VerificationPopup";

interface UPIPaymentQRProps {
  upiId: string | null;
  amount: number | "custom";
  label: string;
  onVerify: (
    paid_amount: number,
    txn_number: string,
  ) => void | Promise<unknown>;
}

export function UPIPaymentQR({
  upiId,
  amount,
  label,
  onVerify,
}: UPIPaymentQRProps) {
  const [customAmount, setCustomAmount] = useState<string>("");
  const [txnId, setTxnId] = useState<string>("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupStatus, setPopupStatus] = useState<"submitted" | "not_submitted">(
    "submitted",
  );
  const [lastVerified, setLastVerified] = useState<{
    txnId: string;
    amount: number;
  } | null>(null);

  const resolvedAmount = useMemo<number | null>(() => {
    if (amount !== "custom") return amount;
    const parsed = parseInt(customAmount, 10);
    return !isNaN(parsed) && parsed > 0 ? parsed : null;
  }, [amount, customAmount]);

  const upiLink = useMemo(() => {
    if (!resolvedAmount || !upiId) return null;
    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(label)}&am=${resolvedAmount}&cu=INR`;
  }, [resolvedAmount, upiId, label]);

  const isButtonEnabled = txnId.trim().length >= 6;

  async function handleVerify() {
    if (!resolvedAmount || !isButtonEnabled) return;
    try {
      await onVerify(resolvedAmount, txnId.trim());
      setLastVerified({ txnId: txnId.trim(), amount: resolvedAmount });
      setPopupStatus("submitted");
    } catch {
      setLastVerified({ txnId: txnId.trim(), amount: resolvedAmount ?? 0 });
      setPopupStatus("not_submitted");
    }
    setPopupOpen(true);
  }

  if (!upiId) {
    return (
      <div className="w-full max-w-[480px] mx-auto border border-[var(--color-dash-border)] bg-[var(--color-dash-bg)] overflow-hidden">
        <div className="h-[2px] w-full bg-[var(--color-dash-border)]" />
        <div className="flex items-center justify-between px-7 py-4 border-b border-[var(--color-dash-border)]">
          <div className="flex items-center gap-2.5">
            <ScanLine
              size={16}
              strokeWidth={1.5}
              className="text-dash-ink2/60 font-semibold"
            />
            <span className="font-sans text-[11px] tracking-[2px] uppercase text-dash-ink2/60 font-semibold">
              UPI Payment
            </span>
          </div>
        </div>
        <div className="px-7 py-12 flex flex-col items-center gap-5 text-center">
          <div className="w-14 h-14 border border-[var(--color-status-danger-border)] bg-[var(--color-status-danger-bg)] flex items-center justify-center">
            <AlertTriangle
              size={22}
              className="text-[var(--color-dash-red)]"
              strokeWidth={1.5}
            />
          </div>
          <div className="space-y-2">
            <p className="font-serif text-[22px] text-[var(--color-dash-ink)]">
              UPI Not Configured
            </p>
            <p className="font-sans text-[13px] text-dash-ink2/60 font-semibold leading-relaxed">
              {label} has not added a UPI ID yet.
              <br />
              Contact them to proceed with payment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full rounded-lg max-w-[480px] mx-auto border border-[var(--color-dash-border)] bg-[var(--color-dash-bg)] overflow-hidden"
      >
        <div className="h-[2px] w-110 mx-auto bg-[var(--color-dash-gold)]" />

        <div className="flex items-center justify-between px-7 py-4 border-b border-[var(--color-dash-border)]">
          <div className="flex items-center gap-2.5">
            <ScanLine
              size={16}
              strokeWidth={1.5}
              className="text-[var(--color-dash-gold)]"
            />
            <span className="font-sans text-[11px] tracking-[2px] uppercase text-[var(--color-dash-gold)]">
              UPI Payment
            </span>
          </div>
          <div className="flex items-center gap-1.5 border border-[var(--color-status-paid-border)] bg-[var(--color-status-paid-bg)] px-3 py-1">
            <ShieldCheck
              size={11}
              className="text-[var(--color-dash-green)]"
              strokeWidth={2}
            />
            <span className="font-mono text-[11px] lg:text-[14px] font-bold tracking-[2px] uppercase text-[var(--color-dash-green)]">
              Secure
            </span>
          </div>
        </div>

        <div className="px-7 pt-7 pb-3">
          {amount !== "custom" ? (
            <div>
              <p className="font-sans text-[12px] lg:text-[13px] uppercase text-dash-ink2/60 font-semibold mb-3">
                Amount To Pay
              </p>
              <p className="font-sans tracking-badge text-[28px] lg:text-[38px] font-medium leading-none tabular-nums text-[var(--color-dash-gold)]">
                ₹{amount.toLocaleString("en-IN")}
              </p>
              <div className="mt-4 h-px bg-[var(--color-dash-border)]" />
            </div>
          ) : (
            <div>
              <p className="font-sans text-[11px] uppercase text-dash-ink2/60 font-semibold mb-3">
                Enter Amount
              </p>
              <div className="flex items-end gap-2 pb-2 border-b-2 border-[var(--color-dash-border)] focus-within:border-[var(--color-dash-gold)] transition-colors duration-200">
                <span className="font-serif text-[38px] leading-none text-dash-ink2/60 font-semibold mb-0.5">
                  ₹
                </span>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="0"
                  className="flex-1 bg-transparent font-serif text-[48px] leading-none text-[var(--color-dash-gold)] outline-none placeholder:text-[var(--color-dash-ink4)] tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
          )}
        </div>

        <div className="px-7 py-6 flex flex-col items-center">
          <AnimatePresence mode="wait">
            {upiLink && resolvedAmount ? (
              <motion.div
                key="qr"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="w-full flex flex-col items-center"
              >
                <div className="relative p-5 bg-[#111111] border border-[var(--color-dash-gold)] shadow-[0_0_40px_rgba(200,169,110,0.1),inset_0_0_30px_rgba(200,169,110,0.03)]">
                  <div className="absolute -top-[3px] -left-[3px] w-6 h-6 border-t-[3px] border-l-[3px] border-[var(--color-dash-gold)]" />
                  <div className="absolute -top-[3px] -right-[3px] w-6 h-6 border-t-[3px] border-r-[3px] border-[var(--color-dash-gold)]" />
                  <div className="absolute -bottom-[3px] -left-[3px] w-6 h-6 border-b-[3px] border-l-[3px] border-[var(--color-dash-gold)]" />
                  <div className="absolute -bottom-[3px] -right-[3px] w-6 h-6 border-b-[3px] border-r-[3px] border-[var(--color-dash-gold)]" />
                  <QRCodeSVG
                    value={upiLink}
                    size={220}
                    bgColor="#111111"
                    fgColor="#c8a96e"
                    level="H"
                    className="block"
                  />
                </div>

                <div className="mt-5 text-center space-y-1">
                  <p className="font-serif font-semibold tracking-badge text-[20px] text-[var(--color-dash-ink)]">
                    Scan to Pay
                  </p>
                  <p className="font-mono text-[12.5px] font-semibold text-[var(--color-dash-ink2)] tracking-[0.5px]">
                    {upiId}
                  </p>
                  <p className="font-sans text-[12px] pt-1.5 text-dash-ink2/80 font-semibold uppercase tracking-wide">
                    Account Holder — {label}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="w-full border-2 border-dashed border-[var(--color-dash-border)] flex flex-col items-center justify-center gap-3 py-16"
              >
                <ScanLine
                  size={32}
                  strokeWidth={1}
                  className="text-[var(--color-dash-ink4)]"
                />
                <p className="font-sans text-[12px] text-[var(--color-dash-ink4)]">
                  Enter amount to generate QR
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mx-7 border-t border-[var(--color-dash-border)]" />

        <div className="px-7 pt-6 pb-7 space-y-4">
          <p className="font-sans text-[12px] uppercase text-dash-ink2/60 font-semibold">
            Payment Verification
          </p>

          <div className="space-y-1.5">
            <label className="font-sans text-[12px] lg:text-[14px] font-semibold text-[var(--color-dash-gold)] block">
              UPI Transaction ID (UTR)
            </label>
            <input
              type="text"
              value={txnId}
              onChange={(e) => setTxnId(e.target.value)}
              placeholder="e.g. 426812345678"
              className="w-full bg-[var(--color-dash-surface1)] border border-[var(--color-dash-border)] focus:border-[var(--color-dash-gold)] outline-none font-mono text-[14px] text-[var(--color-dash-ink)] placeholder:text-[var(--color-dash-ink4)] px-4 py-3.5 min-h-[48px] transition-colors duration-150"
            />
            <AnimatePresence>
              {txnId.length > 0 && txnId.trim().length < 6 && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="font-sans text-[11px] text-[var(--color-dash-red)]"
                >
                  Minimum 6 characters required
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleVerify}
            disabled={!isButtonEnabled || !resolvedAmount}
            className="w-full min-h-[52px] py-3.5 font-mono text-[12px] tracking-[3px] uppercase transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed enabled:cursor-pointer bg-[var(--color-dash-gold)] text-[#0d0d0d] font-medium hover:brightness-110 active:brightness-95 disabled:bg-[rgba(200,169,110,0.15)] disabled:text-[var(--color-dash-gold)] disabled:border disabled:border-[rgba(200,169,110,0.25)]"
          >
            I&apos;ve Paid — Verify
          </button>
        </div>

        <div className="px-7 py-3.5 border-t border-[var(--color-dash-border)] flex items-center justify-between">
          <span className="font-sans text-[11px] lg:text-[12px] text-dash-ink2/60">
            Powered by UPI
          </span>
          <span className="font-sans text-[11px] lg:text-[12px] text-dash-ink2/60">
            {label}
          </span>
        </div>
      </motion.div>

      <VerificationPopup
        open={popupOpen}
        status={popupStatus}
        txnId={lastVerified?.txnId ?? ""}
        amount={lastVerified?.amount ?? 0}
        onClose={() => setPopupOpen(false)}
      />
    </>
  );
}

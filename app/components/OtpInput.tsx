"use client";
import { useRef, useState, KeyboardEvent, ClipboardEvent } from "react";

// ─── types ────────────────────────────────────────────────────────────────────
interface OtpInputProps {
  onVerify: (otp: string) => void | Promise<void>;
  onResend: () => void;
}

// ─── component ────────────────────────────────────────────────────────────────
export function OtpInput({ onVerify, onResend }: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  // ─── box input ────────────────────────────────────────────────────────────
  function handleChange(idx: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = digit;
    setDigits(next);
    if (digit && idx < 5) refs.current[idx + 1]?.focus();
  }

  function handleKeyDown(idx: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...digits];
    pasted.split("").forEach((char, i) => {
      next[i] = char;
    });
    setDigits(next);
    refs.current[Math.min(pasted.length, 5)]?.focus();
  }

  // ─── actions ──────────────────────────────────────────────────────────────
  async function handleVerify() {
    const otp = digits.join("");
    if (otp.length < 6) return;
    setLoading(true);
    await onVerify(otp);
    setLoading(false);
  }

  function handleResend() {
    onResend();
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  }

  const filled = digits.every((d) => d !== "");

  return (
    <div className="flex flex-col gap-5">

      {/* 6-digit boxes */}
      <div className="flex gap-2.5 justify-center">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className={`
              w-11 h-12 bg-[#161616] border text-center
              font-mono text-[18px] focus:outline-none duration-150
              ${digit
                ? "border-[#c8a96e] text-accent"
                : "border-[#2a2a2a] focus:border-[#c8a96e] text-ink"
              }
            `}
          />
        ))}
      </div>

      {/* verify */}
      <button
        type="button"
        onClick={handleVerify}
        disabled={!filled || loading}
        className="w-full py-3 bg-accent text-black font-mono text-[11px] uppercase tracking-wider hover:bg-accent-dim duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Verifying…" : "Verify →"}
      </button>

      {/* resend */}
      <p className="font-sans text-[10px] text-ink-muted text-center">
        Didn&apos;t receive it?{" "}
        <button
          type="button"
          onClick={handleResend}
          className="text-accent hover:text-accent-dim duration-150"
        >
          {resent ? "Sent ✓" : "Resend code"}
        </button>
      </p>

    </div>
  );
}

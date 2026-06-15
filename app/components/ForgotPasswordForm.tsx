"use client";
import { useState, useRef, KeyboardEvent, ClipboardEvent } from "react";
import { authClient } from "@/app/lib/auth-client";

const STRENGTH_LABELS = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["#c06060", "#c87840", "#c8a96e", "#9acd87", "#4a9e75"];

function getStrength(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordForm() {
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwErrors, setPwErrors] = useState<{
    otp?: string;
    new?: string;
    confirm?: string;
  }>({});

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [resent, setResent] = useState(false);

  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const strength = newPassword.length > 0 ? getStrength(newPassword) : 0;
  const otpFilled = digits.every((d) => d !== "");

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setEmailError("Enter a valid email address.");
      return;
    }
    setLoading(true);
    setEmailError("");

    try {
      const { error } = await authClient.emailOtp.requestPasswordReset({
        email,
      });

      if (error) {
        setEmailError(
          error.message || "The reset code could not be sent. Please try again.",
        );
        return;
      }

      setStep("reset");
    } catch {
      setEmailError("The reset code could not be sent. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(idx: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = digit;
    setDigits(next);
    if (digit && idx < 5) refs.current[idx + 1]?.focus();
    if (pwErrors.otp) setPwErrors((prev) => ({ ...prev, otp: undefined }));
  }

  function handleOtpKeyDown(idx: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  }

  function handleOtpPaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const next = [...digits];
    pasted.split("").forEach((char, i) => {
      next[i] = char;
    });
    setDigits(next);
    refs.current[Math.min(pasted.length, 5)]?.focus();
    if (pwErrors.otp) setPwErrors((prev) => ({ ...prev, otp: undefined }));
  }

  async function handleResend() {
    setLoading(true);
    setPwErrors((previous) => ({ ...previous, otp: undefined }));
    try {
      const { error } = await authClient.emailOtp.requestPasswordReset({
        email,
      });

      if (error) {
        setPwErrors({
          otp: error.message || "The reset code could not be sent.",
        });
        return;
      }

      setResent(true);
      setTimeout(() => setResent(false), 3000);
    } catch {
      setPwErrors({ otp: "The reset code could not be sent." });
    } finally {
      setLoading(false);
    }
  }

  async function handleResetSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: { otp?: string; new?: string; confirm?: string } = {};

    if (!otpFilled) nextErrors.otp = "Please enter the 6-digit code.";
    if (newPassword.length < 8)
      nextErrors.new = "Password must be at least 8 characters.";
    if (confirmPw !== newPassword)
      nextErrors.confirm = "Passwords do not match.";

    setPwErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);

    const otp = digits.join("");

    const { error } = await authClient.emailOtp.resetPassword({
      email,
      otp,
      password: newPassword,
    });

    setLoading(false);

    if (error) {
      setPwErrors({ otp: error.message || "Verification failed" });
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8">
          <p className="font-mono text-[8px] tracking-[2.5px] uppercase text-accent mb-3">
            — All done
          </p>
          <h1 className="font-serif text-2xl lg:text-3xl text-ink">
            Password updated.
          </h1>
          <p className="font-sans text-sm text-ink-muted mt-1.5">
            You can now log in with your new password.
          </p>
        </div>
        <a
          href="/login"
          className="block w-full py-3 bg-accent text-black font-mono text-[11px] uppercase tracking-wider hover:bg-accent-dim duration-150 text-center"
        >
          Go to login →
        </a>
      </div>
    );
  }

  if (step === "email") {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8">
          <p className="font-mono text-[8px] tracking-[2.5px] uppercase text-accent mb-3">
            — Reset password
          </p>
          <h1 className="font-serif text-2xl lg:text-3xl text-ink">
            Forgot your password?
          </h1>
          <p className="font-sans text-sm text-ink-muted mt-1.5">
            Enter your email and we&apos;ll send you a reset code.
          </p>
        </div>

        <form
          onSubmit={handleEmailSubmit}
          noValidate
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reset-email"
              className="font-mono text-[9px] tracking-[1.8px] uppercase text-[#7a7570]"
            >
              Email address
            </label>
            <input
              id="reset-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              className={`
                w-full bg-[#161616] border px-4 py-2.5
                font-sans text-[13px] text-ink placeholder:text-[#3a3733]
                focus:outline-none duration-150
                ${
                  emailError
                    ? "border-[#c06060] focus:border-[#c06060]"
                    : "border-[#2a2a2a] focus:border-[#c8a96e]"
                }
              `}
            />
            {emailError && (
              <p className="font-sans text-[10px] text-[#c06060]">
                {emailError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full py-3 bg-accent text-black font-mono text-[11px] uppercase tracking-wider hover:bg-accent-dim duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending…" : "Send reset code →"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[#2a2a2a]" />
          <span className="font-mono text-[8px] tracking-wider uppercase text-[#3a3733]">
            or
          </span>
          <div className="flex-1 h-px bg-[#2a2a2a]" />
        </div>

        <p className="font-sans text-[11px] text-ink-muted text-center">
          Remembered it?{" "}
          <a
            href="/login"
            className="text-accent hover:text-accent-dim duration-150 font-medium"
          >
            Log in →
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8">
        <p className="font-mono text-[8px] tracking-[2.5px] uppercase text-accent mb-3">
          — Verify & Reset
        </p>
        <h1 className="font-serif text-2xl lg:text-3xl text-ink">
          Set a new password.
        </h1>
        <p className="font-sans text-sm text-ink-muted mt-1.5">
          If an account exists, a 6-digit code was sent to{" "}
          <span className="text-ink">{email}</span>.
        </p>
      </div>

      <form
        onSubmit={handleResetSubmit}
        noValidate
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[9px] tracking-[1.8px] uppercase text-[#7a7570] flex justify-between">
            <span>Verification Code</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="text-accent hover:text-accent-dim duration-150 tracking-wider"
            >
              {loading ? "Sending..." : resent ? "Sent ✓" : "Resend code"}
            </button>
          </label>
          <div className="grid w-full grid-cols-6 gap-1.5 sm:gap-2.5">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                onPaste={handleOtpPaste}
                className={`
                  h-12 min-w-0 w-full bg-[#161616] border text-center
                  font-mono text-[18px] focus:outline-none duration-150
                  ${
                    digit
                      ? "border-[#c8a96e] text-accent"
                      : pwErrors.otp
                        ? "border-[#c06060] text-ink"
                        : "border-[#2a2a2a] focus:border-[#c8a96e] text-ink"
                  }
                `}
              />
            ))}
          </div>
          {pwErrors.otp && (
            <p className="font-sans text-[10px] text-[#c06060] mt-1">
              {pwErrors.otp}
            </p>
          )}
        </div>

        <div className="h-px bg-[#2a2a2a] w-full" />

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="new-password"
              className="font-mono text-[9px] tracking-[1.8px] uppercase text-[#7a7570]"
            >
              New password
            </label>
            <input
              id="new-password"
              name="newPassword"
              type="password"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPwErrors((p) => ({ ...p, new: "" }));
              }}
              className={`
                w-full bg-[#161616] border px-4 py-2.5
                font-sans text-[13px] text-ink placeholder:text-[#3a3733]
                focus:outline-none duration-150
                ${
                  pwErrors.new
                    ? "border-[#c06060] focus:border-[#c06060]"
                    : "border-[#2a2a2a] focus:border-[#c8a96e]"
                }
              `}
            />

            {newPassword.length > 0 && (
              <div className="flex flex-col gap-1 mt-0.5">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 h-[2px] duration-300"
                      style={{
                        background:
                          i < strength
                            ? STRENGTH_COLORS[strength - 1]
                            : "#2a2a2a",
                      }}
                    />
                  ))}
                </div>
                <p
                  className="font-mono text-[9px] tracking-wide"
                  style={{ color: STRENGTH_COLORS[strength - 1] }}
                >
                  {STRENGTH_LABELS[strength - 1]}
                </p>
              </div>
            )}

            {pwErrors.new && (
              <p className="font-sans text-[10px] text-[#c06060]">
                {pwErrors.new}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirm-password"
              className="font-mono text-[9px] tracking-[1.8px] uppercase text-[#7a7570]"
            >
              Confirm password
            </label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              autoComplete="new-password"
              value={confirmPw}
              onChange={(e) => {
                setConfirmPw(e.target.value);
                setPwErrors((p) => ({ ...p, confirm: "" }));
              }}
              className={`
                w-full bg-[#161616] border px-4 py-2.5
                font-sans text-[13px] text-ink placeholder:text-[#3a3733]
                focus:outline-none duration-150
                ${
                  pwErrors.confirm
                    ? "border-[#c06060] focus:border-[#c06060]"
                    : "border-[#2a2a2a] focus:border-[#c8a96e]"
                }
              `}
            />
            {pwErrors.confirm && (
              <p className="font-sans text-[10px] text-[#c06060]">
                {pwErrors.confirm}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !otpFilled}
          className="mt-2 w-full py-3 bg-accent text-black font-mono text-[11px] uppercase tracking-wider hover:bg-accent-dim duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Updating…" : "Verify & Update Password →"}
        </button>

        <p className="font-sans text-[11px] text-ink-muted text-center mt-2">
          Wrong email?{" "}
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setDigits(Array(6).fill(""));
              setNewPassword("");
              setConfirmPw("");
              setPwErrors({});
            }}
            className="text-accent hover:text-accent-dim duration-150 font-medium"
          >
            Go back
          </button>
        </p>
      </form>
    </div>
  );
}

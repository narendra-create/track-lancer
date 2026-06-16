"use client";
import { useState } from "react";
import { OtpInput } from "./OtpInput";
import { authClient } from "@/app/lib/auth-client";

const CATEGORY_OPTIONS = [
  { value: "WEB_DEV", label: "Web Developer" },
  { value: "VIDEO_EDITOR", label: "Video Editor" },
  { value: "GRAPHIC_DESIGNER", label: "Graphic Designer" },
  { value: "WEB_DESIGNER", label: "Web Designer" },
  { value: "SEO", label: "SEO Specialist" },
] as const;

type Category = (typeof CATEGORY_OPTIONS)[number]["value"];

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

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<"freelancer" | "client" | "">("");
  const [category, setCategory] = useState<Category | "">("");
  const [agreed, setAgreed] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [termsError, setTermsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [step, setStep] = useState<"form" | "otp">("form");

  const strength = password.length > 0 ? getStrength(password) : 0;
  const emailTouched = email.length > 0;
  const emailValid = EMAIL_RE.test(email);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Name is required.";
    if (!emailValid) next.email = "Enter a valid email address.";
    if (password.length < 8)
      next.password = "Password must be at least 8 characters.";
    if (confirm !== password) next.confirm = "Passwords do not match.";
    if (!role) next.role = "Please select a role.";
    if (role === "freelancer" && !category)
      next.category = "Please select your specialty.";
    setErrors(next);

    if (!agreed) {
      setTermsError(true);
      return false;
    }
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors((previous) => ({ ...previous, form: "" }));

    try {
      if (!accountCreated) {
        // Check if email is already taken before attempting sign-up
        const checkRes = await fetch("/api/user/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const check = await checkRes.json() as { exists?: boolean; verified?: boolean; error?: string };

        if (check.error) {
          setErrors((previous) => ({ ...previous, form: "Could not verify email. Please try again." }));
          return;
        }

        // Already verified → send them to login
        if (check.exists && check.verified) {
          setErrors((previous) => ({
            ...previous,
            form: "An account with this email already exists. Please log in instead.",
          }));
          return;
        }

        // Exists but unverified → skip sign-up, just resend OTP
        if (check.exists && !check.verified) {
          setAccountCreated(true);
        } else {
          const { error } = await authClient.signUp.email({
            email,
            password,
            name,
            // @ts-expect-error Custom additional field configured in auth.ts.
            role: role.toUpperCase(),
          });

          if (error) {
            setErrors((previous) => ({
              ...previous,
              form: error.message || "Registration failed.",
            }));
            return;
          }

          setAccountCreated(true);
        }
      }

      const { error: otpError } =
        await authClient.emailOtp.sendVerificationOtp({
          email,
          type: "email-verification",
        });

      if (otpError) {
        setErrors((previous) => ({
          ...previous,
          form:
            "Your account was created, but the verification code could not be sent. Check that this is your Resend account email, then retry.",
        }));
        return;
      }

      setStep("otp");
    } catch {
      setErrors((previous) => ({
        ...previous,
        form: "The verification code could not be sent. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpVerify(otp: string) {
    const { error } = await authClient.emailOtp.verifyEmail({
      email,
      otp,
    });

    if (error) {
      return error.message || "The verification code is invalid or expired.";
    }

    const profileResponse = await fetch("/api/profile/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: role === "freelancer" ? category : null }),
    });

    if (!profileResponse.ok) {
      return "Your email was verified, but profile setup failed. Please retry.";
    }

    window.location.href = "/dashboard";
  }

  async function handleOtpResend() {
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    });

    return error
      ? error.message || "The verification code could not be sent."
      : undefined;
  }

  if (step === "otp") {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8">
          <p className="font-mono text-[8px] tracking-[2.5px] uppercase text-accent mb-3">
            — Verify your email
          </p>
          <h1 className="font-serif text-2xl lg:text-3xl text-ink">
            Check your inbox.
          </h1>
          <p className="font-sans text-sm text-ink-muted mt-1.5">
            We sent a 6-digit code to <span className="text-ink">{email}</span>.
          </p>
        </div>

        <OtpInput
          onVerify={handleOtpVerify}
          onResend={handleOtpResend}
        />

        <p className="font-sans text-[11px] text-ink-muted text-center mt-6">
          Wrong email?{" "}
          <button
            onClick={() => setStep("form")}
            className="text-accent hover:text-accent-dim duration-150 font-medium"
          >
            Go back
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8">
        <p className="font-mono text-[8px] tracking-[2.5px] uppercase text-accent mb-3">
          — Create account
        </p>
        <h1 className="font-serif text-2xl lg:text-3xl text-ink">
          Start tracking.
        </h1>
        <p className="font-sans text-sm text-ink-muted mt-1.5">
          Free forever. No credit card.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="name"
            className="font-mono text-[9px] tracking-[1.8px] uppercase text-[#7a7570]"
          >
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((p) => ({ ...p, name: "" }));
            }}
            className={`
              w-full bg-[#161616] border px-4 py-2.5
              font-sans text-[13px] text-ink placeholder:text-[#3a3733]
              focus:outline-none duration-150
              ${
                errors.name
                  ? "border-[#c06060] focus:border-[#c06060]"
                  : "border-[#2a2a2a] focus:border-[#c8a96e]"
              }
            `}
          />
          {errors.name && (
            <p className="font-sans text-[10px] text-[#c06060]">
              {errors.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="font-mono text-[9px] tracking-[1.8px] uppercase text-[#7a7570]"
          >
            Email address
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((p) => ({ ...p, email: "" }));
              }}
              className={`
                w-full bg-[#161616] border px-4 py-2.5 pr-8
                font-sans text-[13px] text-ink placeholder:text-[#3a3733]
                focus:outline-none duration-150
                ${
                  emailTouched && !emailValid
                    ? "border-[#c06060] focus:border-[#c06060]"
                    : emailTouched && emailValid
                      ? "border-[#4a9e75] focus:border-[#4a9e75]"
                      : "border-[#2a2a2a] focus:border-[#c8a96e]"
                }
              `}
            />
            {emailTouched && (
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] select-none"
                style={{ color: emailValid ? "#4a9e75" : "#c06060" }}
              >
                {emailValid ? "✓" : "✗"}
              </span>
            )}
          </div>
          {emailTouched && !emailValid && (
            <p className="font-sans text-[10px] text-[#c06060]">
              Enter a valid email address.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="font-mono text-[9px] tracking-[1.8px] uppercase text-[#7a7570]"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((p) => ({ ...p, password: "" }));
            }}
            className={`
              w-full bg-[#161616] border px-4 py-2.5
              font-sans text-[13px] text-ink placeholder:text-[#3a3733]
              focus:outline-none duration-150
              ${
                errors.password
                  ? "border-[#c06060] focus:border-[#c06060]"
                  : "border-[#2a2a2a] focus:border-[#c8a96e]"
              }
            `}
          />

          {password.length > 0 && (
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

          {errors.password && (
            <p className="font-sans text-[10px] text-[#c06060]">
              {errors.password}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="confirm"
            className="font-mono text-[9px] tracking-[1.8px] uppercase text-[#7a7570]"
          >
            Confirm password
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            placeholder="Repeat your password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              setErrors((p) => ({ ...p, confirm: "" }));
            }}
            className={`
              w-full bg-[#161616] border px-4 py-2.5
              font-sans text-[13px] text-ink placeholder:text-[#3a3733]
              focus:outline-none duration-150
              ${
                errors.confirm
                  ? "border-[#c06060] focus:border-[#c06060]"
                  : "border-[#2a2a2a] focus:border-[#c8a96e]"
              }
            `}
          />
          {errors.confirm && (
            <p className="font-sans text-[10px] text-[#c06060]">
              {errors.confirm}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="font-mono text-[9px] tracking-[1.8px] uppercase text-[#7a7570]">
            I am a
          </p>
          <div className="flex gap-3">
            {(["Freelancer", "Client"] as const).map((r) => (
              <label
                key={r}
                className={`
                  flex-1 flex items-center justify-center gap-2 border py-2.5
                  cursor-pointer duration-150 font-mono text-[10px] uppercase tracking-wider
                  ${
                    role === r.toLowerCase()
                      ? "border-[#c8a96e] text-accent"
                      : "border-[#2a2a2a] text-[#7a7570]"
                  }
                `}
              >
                <input
                  type="radio"
                  name="role"
                  value={r.toLowerCase()}
                  checked={role === r.toLowerCase()}
                  onChange={() => {
                    setRole(r.toLowerCase() as "freelancer" | "client");
                    setErrors((p) => ({ ...p, role: "" }));
                  }}
                  className="sr-only"
                />
                {r}
              </label>
            ))}
          </div>
          {errors.role && (
            <p className="font-sans text-[10px] text-[#c06060]">
              {errors.role}
            </p>
          )}
        </div>

        {role === "freelancer" && (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="category"
              className="font-mono text-[9px] tracking-[1.8px] uppercase text-[#7a7570]"
            >
              Your Specialty
            </label>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value as Category);
                  setErrors((p) => ({ ...p, category: "" }));
                }}
                className={`
                  w-full bg-[#161616] border px-4 py-2.5 appearance-none
                  font-sans text-[13px] focus:outline-none duration-150 cursor-pointer
                  ${category ? "text-ink" : "text-[#3a3733]"}
                  ${
                    errors.category
                      ? "border-[#c06060] focus:border-[#c06060]"
                      : "border-[#2a2a2a] focus:border-[#c8a96e]"
                  }
                `}
              >
                <option value="" disabled>
                  Select a specialty…
                </option>
                {CATEGORY_OPTIONS.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="text-ink bg-[#161616]"
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[9px] text-[#7a7570]">
                ▾
              </span>
            </div>
            {errors.category && (
              <p className="font-sans text-[10px] text-[#c06060]">
                {errors.category}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              id="agree"
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                if (e.target.checked) setTermsError(false);
              }}
              className="mt-0.5 shrink-0 cursor-pointer"
              style={{ accentColor: termsError ? "#c06060" : "#c8a96e" }}
            />
            <span
              className={`font-sans text-[11px] leading-snug duration-150 ${
                termsError ? "text-[#c06060]" : "text-ink-muted"
              }`}
            >
              I agree to the{" "}
              <a
                href="/terms"
                className="text-accent hover:text-accent-dim duration-150"
              >
                Terms of Use
              </a>{" "}
              and acknowledge the Privacy Policy.
            </span>
          </label>
          {termsError && (
            <p className="font-sans text-[10px] text-[#c06060] pl-6">
              You must agree to continue.
            </p>
          )}
        </div>

        {errors.form && (
          <p className="font-sans text-[11px] text-[#c06060] border border-[#5a2020] bg-[rgba(192,96,96,0.08)] px-4 py-2.5">
            {errors.form}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 w-full py-3 bg-accent text-black font-mono text-[11px] uppercase tracking-wider hover:bg-accent-dim duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? accountCreated
              ? "Sending code…"
              : "Creating account…"
            : accountCreated
              ? "Retry sending code →"
              : "Create account →"}
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
        Already have an account?{" "}
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

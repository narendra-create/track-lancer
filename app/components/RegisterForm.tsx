"use client";
import { useState } from "react";

// ─── Field definitions ──────────────────────────────────────────────────────────
const fields = [
  { id: "name",     label: "Full name",        type: "text",     placeholder: "Narendra Kumar",          autoComplete: "name" },
  { id: "email",    label: "Email address",    type: "email",    placeholder: "you@example.com",         autoComplete: "email" },
  { id: "password", label: "Password",         type: "password", placeholder: "Min. 8 characters",       autoComplete: "new-password" },
  { id: "confirm",  label: "Confirm password", type: "password", placeholder: "Repeat your password",    autoComplete: "new-password" },
] as const;

type FieldId = (typeof fields)[number]["id"];
type FormState = Record<FieldId, string>;

// ─── Component ──────────────────────────────────────────────────────────────────
export function RegisterForm() {
  const [form, setForm] = useState<FormState>({
    name:     "",
    email:    "",
    password: "",
    confirm:  "",
  });
  const [errors, setErrors]   = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(false);

  // ── Validation ────────────────────────────────────────────────────────────────
  function validate(): boolean {
    const next: Partial<FormState> = {};
    if (!form.name.trim())                                   next.name     = "Name is required.";
    if (!form.email.includes("@"))                           next.email    = "Enter a valid email address.";
    if (form.password.length < 8)                            next.password = "Password must be at least 8 characters.";
    if (form.confirm !== form.password)                      next.confirm  = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleChange(id: FieldId, value: string) {
    setForm((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: undefined }));
  }

  // ── Submit (wire your API route here) ─────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // TODO: call POST /api/auth/register
    setLoading(false);
  }

  return (
    <div className="w-full max-w-md mx-auto">

      {/* Header */}
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

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {fields.map(({ id, label, type, placeholder, autoComplete }) => (
          <div key={id} className="flex flex-col gap-1.5">
            <label
              htmlFor={id}
              className="font-mono text-[9px] tracking-[1.8px] uppercase text-[#7a7570]"
            >
              {label}
            </label>
            <input
              id={id}
              name={id}
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              value={form[id]}
              onChange={(e) => handleChange(id, e.target.value)}
              className={`
                w-full bg-[#161616] border px-4 py-2.5
                font-sans text-[13px] text-ink placeholder:text-[#3a3733]
                focus:outline-none duration-150
                ${errors[id]
                  ? "border-[#c06060] focus:border-[#c06060]"
                  : "border-[#2a2a2a] focus:border-[#c8a96e]"
                }
              `}
            />
            {errors[id] && (
              <p className="font-sans text-[10px] text-[#c06060]">{errors[id]}</p>
            )}
          </div>
        ))}

        {/* Role selector */}
        <div className="flex flex-col gap-1.5">
          <p className="font-mono text-[9px] tracking-[1.8px] uppercase text-[#7a7570]">
            I am a
          </p>
          <div className="flex gap-3">
            {(["Freelancer", "Client"] as const).map((role) => (
              <label
                key={role}
                className="flex-1 flex items-center justify-center gap-2 border border-[#2a2a2a] py-2.5 cursor-pointer duration-150 has-[:checked]:border-[#c8a96e] has-[:checked]:text-accent font-mono text-[10px] uppercase tracking-wider text-[#7a7570]"
              >
                <input
                  type="radio"
                  name="role"
                  value={role.toLowerCase()}
                  className="sr-only"
                />
                {role}
              </label>
            ))}
          </div>
        </div>

        {/* Terms agreement */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            id="agree"
            type="checkbox"
            required
            className="mt-0.5 accent-[#c8a96e] shrink-0 cursor-pointer"
          />
          <span className="font-sans text-[11px] text-ink-muted leading-snug">
            I agree to the{" "}
            <a href="/terms" className="text-accent hover:text-accent-dim duration-150">
              Terms of Use
            </a>{" "}
            and acknowledge the Privacy Policy.
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 w-full py-3 bg-accent text-black font-mono text-[11px] uppercase tracking-wider hover:bg-accent-dim duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating account…" : "Create account →"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-[#2a2a2a]" />
        <span className="font-mono text-[8px] tracking-wider uppercase text-[#3a3733]">or</span>
        <div className="flex-1 h-px bg-[#2a2a2a]" />
      </div>

      {/* Switch to login */}
      <p className="font-sans text-[11px] text-ink-muted text-center">
        Already have an account?{" "}
        <a href="/login" className="text-accent hover:text-accent-dim duration-150 font-medium">
          Log in →
        </a>
      </p>

    </div>
  );
}

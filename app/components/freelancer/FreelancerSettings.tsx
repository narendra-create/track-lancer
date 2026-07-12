"use client";
import { Categorys } from "@/app/generated/prisma/enums";
import { updateProfileAction } from "@/app/lib/actions/ProfileActions";
import { authClient } from "@/app/lib/auth-client";
import { formatCategory } from "@/app/lib/utilitys";
import {
  Bell,
  Camera,
  Check,
  CreditCard,
  ExternalLink,
  Shield,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "../ToastProvider";

type SettingsSection = "profile" | "notifications" | "security" | "payment";

export type ProfileData = {
  name: string;
  email: string;
  phone?: string;
  category?: string;
  upiId?: string;
  AccountHolderName?: string;
};

const SECTIONS = [
  { id: "profile" as const, label: "Profile", icon: User },
  { id: "notifications" as const, label: "Notifications", icon: Bell },
  { id: "security" as const, label: "Security", icon: Shield },
  { id: "payment" as const, label: "Payment Details", icon: CreditCard },
];

function SectionNav({
  active,
  onChange,
}: {
  active: SettingsSection;
  onChange: (s: SettingsSection) => void;
}) {
  return (
    <nav className="flex flex-row overflow-x-auto lg:overflow-visible lg:flex-col gap-2 lg:gap-1 pb-2 lg:pb-0 scrollbar-hide">
      {SECTIONS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-all duration-150 font-sans text-[13px] shrink-0 w-auto lg:w-full
            ${
              active === id
                ? "bg-[var(--color-dash-gold-glow)] border border-[rgba(200,169,110,0.2)] text-[var(--color-dash-gold)]"
                : "text-[var(--color-dash-ink3)] hover:bg-[var(--color-dash-surface2)] hover:text-[var(--color-dash-ink2)] border border-transparent"
            }`}
        >
          <Icon
            size={14}
            strokeWidth={1.6}
            className={active === id ? "text-[var(--color-dash-gold)]" : ""}
          />
          <span className="block whitespace-nowrap">{label}</span>
        </button>
      ))}

      <div className="hidden lg:block w-full h-px bg-[var(--color-dash-border)] my-2 shrink-0" />
      <div className="block lg:hidden w-px h-6 bg-[var(--color-dash-border)] my-auto mx-1 shrink-0" />

      <Link
        href="/freelancer/see-projects"
        className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[var(--color-dash-ink3)] hover:bg-[var(--color-dash-surface2)] hover:text-[var(--color-dash-ink2)] border border-transparent transition-all duration-150 font-sans text-[13px] shrink-0 w-auto lg:w-full"
      >
        <ExternalLink size={14} strokeWidth={1.6} />
        <span className="whitespace-nowrap">See Projects</span>
      </Link>
      <Link
        href="/freelancer/Budget-requests"
        className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[var(--color-dash-ink3)] hover:bg-[var(--color-dash-surface2)] hover:text-[var(--color-dash-ink2)] border border-transparent transition-all duration-150 font-sans text-[13px] shrink-0 w-auto lg:w-full"
      >
        <ExternalLink size={14} strokeWidth={1.6} />
        <span className="whitespace-nowrap">Budget Requests</span>
      </Link>
      <Link
        href="/freelancer/verify-payments"
        className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[var(--color-dash-ink3)] hover:bg-[var(--color-dash-surface2)] hover:text-[var(--color-dash-ink2)] border border-transparent transition-all duration-150 font-sans text-[13px] shrink-0 w-auto lg:w-full"
      >
        <ExternalLink size={14} strokeWidth={1.6} />
        <span className="whitespace-nowrap">Verify Payments</span>
      </Link>
      <Link
        href="/freelancer/payment-history"
        className="flex lg:hidden items-center gap-3 px-3 py-2.5 rounded-md text-[var(--color-dash-ink3)] hover:bg-[var(--color-dash-surface2)] hover:text-[var(--color-dash-ink2)] border border-transparent transition-all duration-150 font-sans text-[13px] shrink-0 w-auto lg:w-full"
      >
        <ExternalLink size={14} strokeWidth={1.6} />
        <span className="whitespace-nowrap">Payment History</span>
      </Link>
      <Link
        href="/freelancer/archived-projects"
        className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[var(--color-dash-ink3)] hover:bg-[var(--color-dash-surface2)] hover:text-[var(--color-dash-ink2)] border border-transparent transition-all duration-150 font-sans text-[13px] shrink-0 w-auto lg:w-full"
      >
        <ExternalLink size={14} strokeWidth={1.6} />
        <span className="whitespace-nowrap">Archived Projects</span>
      </Link>
    </nav>
  );
}

function SaveButton({ loading, saved }: { loading: boolean; saved: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="px-6 py-2.5 bg-transparent border border-[var(--color-dash-border-hover)] rounded-md text-white font-mono text-[11px] uppercase tracking-[1.5px] hover:bg-[var(--color-dash-surface2)] hover:border-[var(--color-dash-ink3)] transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {saved ? (
        <>
          <Check size={13} className="text-[var(--color-dash-green)]" />
          Saved
        </>
      ) : loading ? (
        "Saving..."
      ) : (
        "Save Changes →"
      )}
    </button>
  );
}

function ProfileSection({ initialData }: { initialData?: ProfileData }) {
  const { addToast } = useToast();
  const [form, setForm] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    bio: "Full-stack developer specializing in React, Next.js, and scalable backend systems.", // placeholder
    category: initialData?.category || Categorys.WEB_DEV,
    location: "Mumbai, India", // placeholder
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await updateProfileAction({
      name: form.name,
      phone: form.phone,
      category: form.category as Categorys,
    });
    setLoading(false);

    if (result.success) {
      setSaved(true);
      addToast({
        title: "Success",
        message: "Profile updated successfully!",
        type: "success",
      });
      setTimeout(() => setSaved(false), 3000);
    } else {
      addToast({
        title: "Error",
        message: result.error || "Failed to update profile",
        type: "error",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex items-center gap-5 pb-6 border-b border-[var(--color-dash-border)]">
        <div className="relative shrink-0">
          <div className="w-[72px] h-[72px] rounded-full bg-[linear-gradient(135deg,var(--color-dash-gold-dim),var(--color-dash-gold))] flex items-center justify-center font-sans text-[1.5rem] font-semibold text-[#0d0d0d]">
            ND
          </div>
          <button
            type="button"
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-[var(--color-dash-surface3)] border border-[var(--color-dash-border-hover)] rounded-full flex items-center justify-center hover:border-[var(--color-dash-ink3)] transition-colors"
          >
            <Camera size={11} className="text-[var(--color-dash-ink2)]" />
          </button>
        </div>
        <div>
          <p className="font-serif font-bold tracking-label text-[17px] text-white mb-0.5">
            {form.name}
          </p>
          <p className="font-mono font-bold text-[10px] lg:text-[12px] tracking-badge uppercase text-dash-ink2/60">
            {formatCategory(form.category)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-dash-ink2/80 font-bold lg:text-[12px] font-serif text-[10px] tracking-[1.5px] uppercase">
            Full Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full bg-[var(--color-dash-surface2)] border border-[var(--color-dash-border)] rounded-md px-4 py-3 font-sans text-[13px] text-white placeholder:text-[var(--color-dash-ink4)] focus:outline-none focus:border-[var(--color-dash-ink3)] duration-200"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-dash-ink2/80 font-bold lg:text-[12px] font-serif text-[10px] tracking-[1.5px] uppercase">
            Email
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            disabled
            onChange={handleChange}
            className="w-full bg-[var(--color-dash-surface2)] border border-[var(--color-dash-border)] rounded-md px-4 py-3 font-sans text-[13px] text-white/40 placeholder:text-[var(--color-dash-ink4)] focus:outline-none focus:border-[var(--color-dash-ink3)] duration-200"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-dash-ink2/80 font-bold lg:text-[12px] font-serif text-[10px] tracking-[1.5px] uppercase">
            Phone
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full bg-[var(--color-dash-surface2)] border border-[var(--color-dash-border)] rounded-md px-4 py-3 font-sans text-[13px] text-white placeholder:text-[var(--color-dash-ink4)] focus:outline-none focus:border-[var(--color-dash-ink3)] duration-200"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] tracking-[1.5px] uppercase text-dash-ink2/80 font-bold lg:text-[12px] font-serif">
            Skill Category
          </label>
          <div className="relative">
            <select
              name="category"
              value={form.category || ""}
              onChange={handleChange}
              className="w-full bg-[var(--color-dash-surface2)] border border-[var(--color-dash-border)] rounded-md px-4 py-3 font-sans text-[13px] text-white focus:outline-none focus:border-[var(--color-dash-ink3)] transition-all duration-200 appearance-none cursor-pointer"
            >
              <option
                value=""
                disabled
                className="bg-[#141414] text-dash-ink2/80 font-bold"
              >
                Select your main skill
              </option>

              {Object.values(Categorys).map((cat) => (
                <option
                  key={cat}
                  value={cat}
                  className="bg-[#141414] text-white py-2"
                >
                  {formatCategory(cat)}
                </option>
              ))}
            </select>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-dash-ink4)]">
              ▼
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <SaveButton loading={loading} saved={saved} />
      </div>
    </form>
  );
}

function NotificationsSection() {
  const [prefs, setPrefs] = useState({
    milestoneReceived: true,
    projectFlagged: true,
    clientMessage: false,
    weeklyDigest: true,
    deadlineReminder: true,
    marketingEmails: false,
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof typeof prefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const rows: { key: keyof typeof prefs; label: string; sub: string }[] = [
    {
      key: "milestoneReceived",
      label: "Milestone Payment",
      sub: "When a client pays a milestone",
    },
    {
      key: "projectFlagged",
      label: "Project Flagged",
      sub: "When a delay is flagged on your project",
    },
    {
      key: "clientMessage",
      label: "Client Messages",
      sub: "New messages from clients",
    },
    {
      key: "weeklyDigest",
      label: "Weekly Digest",
      sub: "Summary of your week every Monday",
    },
    {
      key: "deadlineReminder",
      label: "Deadline Reminders",
      sub: "48 hours before a milestone due date",
    },
    {
      key: "marketingEmails",
      label: "Product Updates",
      sub: "New features and announcements",
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col divide-y divide-[var(--color-dash-border)]">
        {rows.map(({ key, label, sub }) => (
          <div
            key={key}
            className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
          >
            <div>
              <p className="font-sans text-[13px] text-[var(--color-dash-ink)] mb-0.5">
                {label}
              </p>
              <p className="font-mono text-[10px] tracking-[0.5px] text-[var(--color-dash-ink3)]">
                {sub}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggle(key)}
              className={`relative shrink-0 w-[36px] h-[20px] rounded-sm transition-colors duration-200 flex items-center ${
                prefs[key]
                  ? "bg-[var(--color-dash-green-bg)] border border-[var(--color-status-paid-border)]"
                  : "bg-[var(--color-dash-surface3)] border border-[var(--color-dash-border-hover)]"
              }`}
            >
              <span
                className={`w-[14px] h-[14px] rounded-sm transition-all duration-200 mx-[2px] ${
                  prefs[key]
                    ? "translate-x-[16px] bg-[var(--color-dash-green)]"
                    : "translate-x-0 bg-[var(--color-dash-border-hover)]"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-2 border-t border-[var(--color-dash-border)]">
        <SaveButton loading={loading} saved={saved} />
      </div>
    </form>
  );
}

function SecuritySection() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const { addToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleChangepassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (form.next !== form.confirm) {
      addToast({
        title: "Passwords don't match",
        message: "Please enter the same password in both fields.",
        type: "warning",
      });
      return;
    }
    if (form.current === form.next) {
      addToast({
        title: "Choose a new password",
        message:
          "Your new password must be different from your current password.",
        type: "warning",
      });
      return;
    }
    setLoading(true);
    try {
      const { error } = await authClient.changePassword({
        currentPassword: form.current,
        newPassword: form.next,
        revokeOtherSessions: true,
      });

      if (error) {
        addToast({
          title: "Password change failed",
          message: `${error.message}`,
          type: "error",
        });
        return;
      }
      addToast({
        title: "Password changed",
        message: "Your password has been updated successfully.",
        type: "success",
      });
      setSaved(true);
      setForm({
        current: "",
        next: "",
        confirm: "",
      });

      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);

      addToast({
        title: "Something went wrong",
        message: "Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleChangepassword} className="flex flex-col gap-5">
        <div>
          <p className="font-serif text-[16px] text-white mb-1">
            Change Password
          </p>
          <p className="font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)]">
            Use a strong, unique password
          </p>
        </div>
        <div className="w-full h-px bg-[var(--color-dash-border)]" />

        <div className="flex flex-col gap-2">
          <label className="font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)]">
            Current Password
          </label>
          <input
            name="current"
            type="password"
            autoComplete="current-password"
            value={form.current}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full bg-[var(--color-dash-surface2)] border border-[var(--color-dash-border)] rounded-md px-4 py-3 font-sans text-[13px] text-white placeholder:text-[var(--color-dash-ink4)] focus:outline-none focus:border-[var(--color-dash-ink3)] duration-200"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)]">
              New Password
            </label>
            <input
              name="next"
              type="password"
              autoComplete="new-password"
              value={form.next}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-[var(--color-dash-surface2)] border border-[var(--color-dash-border)] rounded-md px-4 py-3 font-sans text-[13px] text-white placeholder:text-[var(--color-dash-ink4)] focus:outline-none focus:border-[var(--color-dash-ink3)] duration-200"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)]">
              Confirm Password
            </label>
            <input
              name="confirm"
              type="password"
              autoComplete="new-password"
              value={form.confirm}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-[var(--color-dash-surface2)] border border-[var(--color-dash-border)] rounded-md px-4 py-3 font-sans text-[13px] text-white placeholder:text-[var(--color-dash-ink4)] focus:outline-none focus:border-[var(--color-dash-ink3)] duration-200"
            />
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <SaveButton loading={loading} saved={saved} />
        </div>
      </form>

      <div className="border-t border-[var(--color-dash-border)] pt-8">
        <p className="font-serif text-[16px] text-white mb-1">
          Active Sessions
        </p>
        <p className="font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)] mb-5">
          Devices logged in to your account
        </p>
        {[
          {
            device: "Chrome · Windows 11",
            location: "Mumbai, India",
            current: true,
            time: "Active now",
          },
          {
            device: "Safari · iPhone 15",
            location: "Mumbai, India",
            current: false,
            time: "2 days ago",
          },
        ].map((session, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-3.5 border-b border-[var(--color-dash-border)] last:border-b-0"
          >
            <div>
              <p className="font-sans text-[13px] text-[var(--color-dash-ink)] mb-0.5">
                {session.device}
              </p>
              <p className="font-mono text-[10px] tracking-[0.5px] text-[var(--color-dash-ink3)]">
                {session.location} · {session.time}
              </p>
            </div>
            {session.current ? (
              <span className="font-mono text-[9px] tracking-[1.5px] uppercase px-2.5 py-1 rounded-sm bg-[var(--color-status-paid-bg)] border border-[var(--color-status-paid-border)] text-[var(--color-status-paid-text)]">
                This Device
              </span>
            ) : (
              <button
                type="button"
                className="font-mono text-[9px] tracking-[1.5px] uppercase px-2.5 py-1 rounded-sm bg-[var(--color-status-danger-bg)] border border-[var(--color-status-danger-border)] text-[var(--color-status-danger-text)] hover:bg-[rgba(192,96,96,0.15)] transition-colors"
              >
                Revoke
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentDetailsSection({
  initialData,
  onUpdateUPI,
}: {
  initialData?: ProfileData;
  onUpdateUPI: (data: {
    upiId: string;
    AccountHolderName: string;
  }) => Promise<{ success: boolean; error?: string }>;
}) {
  const { addToast } = useToast();
  const [form, setForm] = useState({
    upiId: initialData?.upiId || "",
    holderName: initialData?.AccountHolderName || "",
  });
  const [checkSuccess, setCheckSuccess] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setCheckSuccess(false);
    setIsConfirmed(false);
  };

  const handleCheck = () => {
    if (!form.upiId || !form.holderName) {
      addToast({
        title: "Error",
        message: "Both UPI ID and Holder Name are required",
        type: "error",
      });
      return;
    }
    const isValidSyntax = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(
      form.upiId,
    );
    if (isValidSyntax) {
      setCheckSuccess(true);
    } else {
      setCheckSuccess(false);
      addToast({
        title: "Error",
        message: "Invalid UPI ID format",
        type: "error",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkSuccess || !isConfirmed) return;

    setLoading(true);
    const result = await onUpdateUPI({
      upiId: form.upiId,
      AccountHolderName: form.holderName,
    });

    setLoading(false);
    if (result.success) {
      setSaved(true);
      addToast({
        title: "Success",
        message: "Payment details updated successfully!",
        type: "success",
      });
      setTimeout(() => setSaved(false), 3000);
    } else {
      addToast({
        title: "Error",
        message: result.error || "Failed to update payment details",
        type: "error",
      });
    }
  };

  // Using a free QR generation API to show how it will look
  const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=${form.upiId}&pn=${form.holderName}`)}`;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="font-serif text-[16px] text-white mb-1">
          UPI Payment Details
        </p>
        <p className="font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)]">
          Add your UPI ID to receive payments from clients
        </p>
      </div>
      <div className="w-full h-px bg-[var(--color-dash-border)]" />

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)]">
            Account Holder Name
          </label>
          <input
            name="holderName"
            value={form.holderName}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full bg-[var(--color-dash-surface2)] border border-[var(--color-dash-border)] rounded-md px-4 py-3 font-sans text-[13px] text-white placeholder:text-[var(--color-dash-ink4)] focus:outline-none focus:border-[var(--color-dash-ink3)] duration-200"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)]">
            UPI ID
          </label>
          <div className="flex gap-3">
            <input
              name="upiId"
              value={form.upiId}
              onChange={handleChange}
              placeholder="username@bankname"
              className="flex-1 bg-[var(--color-dash-surface2)] border border-[var(--color-dash-border)] rounded-md px-4 py-3 font-sans text-[13px] text-white placeholder:text-[var(--color-dash-ink4)] focus:outline-none focus:border-[var(--color-dash-ink3)] duration-200"
            />
            <button
              type="button"
              onClick={handleCheck}
              className="px-6 py-2.5 bg-[var(--color-dash-surface3)] border border-[var(--color-dash-border-hover)] rounded-md text-white font-mono text-[11px] uppercase tracking-[1.5px] hover:bg-[var(--color-dash-surface2)] hover:border-[var(--color-dash-ink3)] transition-all duration-200"
            >
              Check
            </button>
          </div>
        </div>
      </div>

      {checkSuccess && (
        <div className="mt-2 border border-[var(--color-dash-border)] rounded-xl p-6 bg-[var(--color-dash-surface2)] flex flex-col items-center">
          <p className="font-serif text-[16px] text-white mb-4 text-center">
            Confirm your UPI ID
          </p>
          <div className="bg-white p-3 rounded-lg mb-4">
            <img
              src={qrDataUrl}
              alt="UPI QR Code"
              className="w-[120px] h-[120px]"
            />
          </div>
          <p className="text-center text-[var(--color-dash-ink3)] font-sans text-[12px] mb-6 max-w-[280px]">
            Scan this QR code with your UPI app to verify that it shows your
            name correctly. (Do not pay, just verify the name).
          </p>

          {!isConfirmed ? (
            <button
              type="button"
              onClick={() => setIsConfirmed(true)}
              className="px-6 py-2.5 bg-[var(--color-dash-green-bg)] border border-[var(--color-status-paid-border)] rounded-md text-[var(--color-dash-green)] font-mono text-[11px] uppercase tracking-[1.5px] hover:bg-opacity-80 transition-all duration-200 flex items-center gap-2"
            >
              <Check size={14} />
              Yes, it is correct
            </button>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="w-full pt-4 border-t border-[var(--color-dash-border)] flex justify-end"
            >
              <SaveButton loading={loading} saved={saved} />
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export function FreelancerSettings({
  initialData,
  onUpdateUPI,
}: {
  initialData?: ProfileData;
  onUpdateUPI: (data: {
    upiId: string;
    AccountHolderName: string;
  }) => Promise<{ success: boolean; error?: string }>;
}) {
  const [active, setActive] = useState<SettingsSection>("profile");

  const SECTION_CONTENT: Record<SettingsSection, React.ReactNode> = {
    profile: <ProfileSection initialData={initialData} />,
    notifications: <NotificationsSection />,
    security: <SecuritySection />,
    payment: (
      <PaymentDetailsSection
        initialData={initialData}
        onUpdateUPI={onUpdateUPI}
      />
    ),
  };

  const activeLabel = SECTIONS.find((s) => s.id === active)?.label ?? "";

  return (
    <div className="w-full max-w-4xl">
      <div className="mb-8">
        <h1 className="font-serif text-[26px] lg:text-[30px] text-white leading-tight mb-1">
          Settings
        </h1>
        <p className="font-mono text-[10px] tracking-[2px] uppercase text-[var(--color-dash-ink3)]">
          Manage your account
        </p>
      </div>

      <div className="w-full h-px bg-[var(--color-dash-border)] mb-7" />

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="lg:w-[180px] shrink-0">
          <SectionNav active={active} onChange={setActive} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="bg-[var(--color-dash-surface1)] border border-[var(--color-dash-border)] rounded-xl p-6 lg:p-7">
            <div className="mb-6">
              <p className="font-serif text-[18px] text-white mb-1">
                {activeLabel}
              </p>
              <div className="w-8 h-px bg-[var(--color-dash-gold-dim)]" />
            </div>
            {SECTION_CONTENT[active]}
          </div>
        </div>
      </div>
    </div>
  );
}

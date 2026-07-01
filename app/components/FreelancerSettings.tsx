"use client";
import { useState } from "react";
import { User, Bell, Shield, Camera, Check, ExternalLink } from "lucide-react";
import Link from "next/link";

type SettingsSection = "profile" | "notifications" | "security";

const SECTIONS = [
  { id: "profile" as const, label: "Profile", icon: User },
  { id: "notifications" as const, label: "Notifications", icon: Bell },
  { id: "security" as const, label: "Security", icon: Shield },
];

function SectionNav({
  active,
  onChange,
}: {
  active: SettingsSection;
  onChange: (s: SettingsSection) => void;
}) {
  return (
    <nav className="flex flex-row lg:flex-col gap-1">
      {SECTIONS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-all duration-150 font-sans text-[13px] w-full
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
          <span className="hidden sm:block">{label}</span>
        </button>
      ))}

      <div className="hidden lg:block w-full h-px bg-[var(--color-dash-border)] my-2" />

      <Link
        href="/freelancer/see-projects"
        className="hidden lg:flex items-center gap-3 px-3 py-2.5 rounded-md text-[var(--color-dash-ink3)] hover:bg-[var(--color-dash-surface2)] hover:text-[var(--color-dash-ink2)] border border-transparent transition-all duration-150 font-sans text-[13px] w-full"
      >
        <ExternalLink size={14} strokeWidth={1.6} />
        <span>See Projects</span>
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

function ProfileSection() {
  const [form, setForm] = useState({
    name: "Narendra Dev",
    email: "narendra@example.com",
    phone: "+91 98765 43210",
    bio: "Full-stack developer specializing in React, Next.js, and scalable backend systems.",
    category: "Web Development",
    location: "Mumbai, India",
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
          <p className="font-serif text-[17px] text-white mb-0.5">{form.name}</p>
          <p className="font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)]">
            {form.category}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label className="font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)]">
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
          <label className="font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)]">
            Email
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-[var(--color-dash-surface2)] border border-[var(--color-dash-border)] rounded-md px-4 py-3 font-sans text-[13px] text-white placeholder:text-[var(--color-dash-ink4)] focus:outline-none focus:border-[var(--color-dash-ink3)] duration-200"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)]">
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
          <label className="font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)]">
            Location
          </label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full bg-[var(--color-dash-surface2)] border border-[var(--color-dash-border)] rounded-md px-4 py-3 font-sans text-[13px] text-white placeholder:text-[var(--color-dash-ink4)] focus:outline-none focus:border-[var(--color-dash-ink3)] duration-200"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)]">
          Bio
        </label>
        <textarea
          name="bio"
          rows={3}
          value={form.bio}
          onChange={handleChange}
          className="w-full bg-[var(--color-dash-surface2)] border border-[var(--color-dash-border)] rounded-md px-4 py-3 font-sans text-[13px] text-white placeholder:text-[var(--color-dash-ink4)] focus:outline-none focus:border-[var(--color-dash-ink3)] duration-200 resize-none"
        />
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
    { key: "milestoneReceived", label: "Milestone Payment", sub: "When a client pays a milestone" },
    { key: "projectFlagged", label: "Project Flagged", sub: "When a delay is flagged on your project" },
    { key: "clientMessage", label: "Client Messages", sub: "New messages from clients" },
    { key: "weeklyDigest", label: "Weekly Digest", sub: "Summary of your week every Monday" },
    { key: "deadlineReminder", label: "Deadline Reminders", sub: "48 hours before a milestone due date" },
    { key: "marketingEmails", label: "Product Updates", sub: "New features and announcements" },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col divide-y divide-[var(--color-dash-border)]">
        {rows.map(({ key, label, sub }) => (
          <div key={key} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
            <div>
              <p className="font-sans text-[13px] text-[var(--color-dash-ink)] mb-0.5">{label}</p>
              <p className="font-mono text-[10px] tracking-[0.5px] text-[var(--color-dash-ink3)]">{sub}</p>
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSaved(true);
    setForm({ current: "", next: "", confirm: "" });
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <p className="font-serif text-[16px] text-white mb-1">Change Password</p>
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
        <p className="font-serif text-[16px] text-white mb-1">Active Sessions</p>
        <p className="font-mono text-[10px] tracking-[1.5px] uppercase text-[var(--color-dash-ink3)] mb-5">
          Devices logged in to your account
        </p>
        {[
          { device: "Chrome · Windows 11", location: "Mumbai, India", current: true, time: "Active now" },
          { device: "Safari · iPhone 15", location: "Mumbai, India", current: false, time: "2 days ago" },
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

export function FreelancerSettings() {
  const [active, setActive] = useState<SettingsSection>("profile");

  const SECTION_CONTENT: Record<SettingsSection, React.ReactNode> = {
    profile: <ProfileSection />,
    notifications: <NotificationsSection />,
    security: <SecuritySection />,
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
              <p className="font-serif text-[18px] text-white mb-1">{activeLabel}</p>
              <div className="w-8 h-px bg-[var(--color-dash-gold-dim)]" />
            </div>
            {SECTION_CONTENT[active]}
          </div>
        </div>
      </div>
    </div>
  );
}

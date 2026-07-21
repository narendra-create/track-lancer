"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  History,
  MessageSquare,
  Settings,
  ClipboardClock,
  CreditCard,
} from "lucide-react";
import Image from "next/image";

interface SidebarProps {
  name?: string;
  skill?: string;
  image?: string;
  initials?: string;
}

export function FreelancerSidebar({
  name,
  skill,
  initials,
  image,
}: SidebarProps) {
  const activePath = usePathname();
  return (
    <>
      <aside
        className={`fixed z-100 lg:z-50 flex bg-dash-surface1 transition-transform duration-200 ease-dash-custom
        bottom-0 left-0 w-full flex-row border-t border-dash-border
        md:top-0 md:h-screen md:w-[15%] md:flex-col md:border-r md:border-t-0 md:translate-x-0`}
      >
        <div className="hidden md:flex relative items-center gap-2.5 border-b border-dash-border p-[22px_20px_18px]">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded bg-dash-gold-glow2 border border-[rgba(200,169,110,0.25)] font-serif text-[1rem] text-dash-gold">
            T {/* Logo here */}
          </div>
          <div className="font-serif text-[1.05rem] leading-none tracking-[0.2px] text-dash-gold">
            MileGlide
            <small className="mt-0.5 block font-mono text-[7px] font-normal uppercase tracking-[2px] text-dash-ink3">
              Freelancer Portal
            </small>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2.5 border-b border-dash-border p-[14px_20px]">
          <div className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,var(--color-dash-gold-dim),var(--color-dash-gold))] font-sans text-[0.75rem] font-semibold text-[#0d0d0d]">
            {image ? (
              <Image
                height={10}
                width={10}
                src={image ?? ""}
                alt="avtar"
              ></Image>
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0">
            <div className="text-[0.96rem] font-semibold text-dash-ink">
              {name}
            </div>
            <div className="mt-0.5 font-mono text-[7.5px] uppercase tracking-[1.5px] text-dash-ink2 flex items-center">
              <span className="mr-1 inline-block h-[5px] w-[5px] align-middle rounded-full bg-dash-green"></span>
              {skill}
            </div>
          </div>
        </div>

        <nav className="flex w-full flex-row items-center justify-between px-1 py-0 md:flex-1 md:flex-col md:items-stretch md:justify-start md:p-[12px_10px] overflow-x-auto overflow-y-hidden md:overflow-x-hidden md:overflow-y-auto">
          <div className="hidden md:block p-[8px_10px_5px] font-mono text-[10px] uppercase tracking-[2px] text-ink-dim">
            Menu
          </div>

          <NavLink
            href="/freelancer/dashboard"
            icon={LayoutDashboard}
            label="Overview"
            isActive={activePath === "/freelancer/dashboard"}
          />
          <NavLink
            href="/"
            icon={Home}
            label="Home"
            isActive={activePath === "/"}
          />
          <NavLink
            href="/freelancer/past-projects"
            icon={History}
            label="Past Projects"
            isActive={activePath === "/freelancer/past-projects"}
            hideOnMobile
          />
          <NavLink
            href="/freelancer/unverified-projects"
            icon={ClipboardClock}
            label="Unverified Projects"
            isActive={activePath === "/freelancer/unverified-projects"}
          />
          <NavLink
            href="/freelancer/payment-history"
            icon={CreditCard}
            label="Payments"
            isActive={activePath === "/freelancer/payment-history"}
            hideOnMobile
          />
          <NavLink
            href="/freelancer/activity"
            icon={MessageSquare}
            label="Activitys"
            badge={2}
            isActive={activePath === "/freelancer/activity"}
          />
          <NavLink
            href="/freelancer/settings"
            icon={Settings}
            label="Settings"
            isActive={activePath === "/freelancer/settings"}
          />
        </nav>
      </aside>
    </>
  );
}

function NavLink({
  href,
  icon: Icon,
  label,
  badge,
  isActive,
  hideOnMobile,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
  isActive: boolean;
  hideOnMobile?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`relative cursor-pointer transition-colors duration-150
        h-[75px] flex-col items-center justify-center gap-1 font-medium
        md:mb-0.5 md:h-auto md:flex-none md:flex-row md:justify-start md:gap-2.5 md:rounded md:p-[9px_10px] md:text-[0.82rem]
        ${hideOnMobile ? "hidden md:flex" : "flex flex-1 min-w-0"}
        ${
          isActive
            ? "text-dash-gold bg-dash-gold-glow/40 md:bg-dash-gold-glow"
            : "text-dash-ink3 hover:bg-dash-surface3 md:hover:text-dash-ink2"
        }`}
    >
      {isActive && (
        <>
          <span className="absolute left-1/2 top-0 h-[3px] w-[50%] -translate-x-1/2 rounded-[1.5px] bg-dash-gold md:hidden"></span>
          <span className="absolute left-0 top-[20%] hidden h-[60%] w-[2px] rounded-[1px] bg-dash-gold md:block"></span>
        </>
      )}

      <div className="relative flex items-center justify-center md:block md:w-auto">
        <span className="shrink-0 flex justify-center items-center h-[2rem] md:w-4 md:h-auto">
          <Icon className="w-[24px] h-[24px] md:w-[16px] md:h-[16px] stroke-[1.5]" />
        </span>
        {/* Mobile Badge */}
        {badge !== undefined && (
          <span className="absolute -right-3 -top-1 flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-dash-gold-glow2 px-1 font-mono text-[8px] text-dash-gold md:hidden">
            {badge}
          </span>
        )}
      </div>
      <span className="text-center text-[9px] leading-[1.2] px-1 md:px-0 md:text-[0.82rem] md:text-left whitespace-normal md:whitespace-nowrap">
        {label}
      </span>

      {/* Desktop Badge */}
      {badge !== undefined && (
        <span className="ml-auto hidden items-center justify-center rounded-[10px] border border-[rgba(200,169,110,0.2)] bg-dash-gold-glow2 px-1.5 py-0.5 font-mono text-[7px] text-dash-gold md:flex">
          {badge}
        </span>
      )}
    </Link>
  );
}

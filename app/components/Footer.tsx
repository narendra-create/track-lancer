import React from "react";
import Link from "next/link";

// Product links
const productLinks = [
  { label: "How it works", href: "#how" },
  { label: "Features", href: "#features" },
  { label: "Get started", href: "/register" },
];

// Company links
const companyLinks = [
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
  { label: "Privacy Policy", href: "#privacy-policy" },
  { label: "Terms of Use", href: "/terms" },
];

// Tech stack
const builtWith = [
  { label: "Next.js", href: "https://nextjs.org" },
  { label: "PostgreSQL", href: "https://postgresql.org" },
  { label: "Prisma ORM", href: "https://prisma.io" },
  { label: "Tailwind CSS", href: "https://tailwindcss.com" },
];

// Legal links
const legalLinks = [
  { label: "Privacy", href: "#privacy-policy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: "#contact" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-[60] bg-[#161616] border-t border-[#2a2a2a] px-5 md:px-10 lg:px-[40px] pt-9 pb-6">
      {/* Top grid — 4 cols desktop, 2 cols tablet, 1 col mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 lg:gap-[30px] mb-7 pb-7 border-b border-[#2a2a2a]">
        {/* Brand */}
        <div>
          <div className="font-serif text-[#c8a96e] text-[18px] mb-1.5">
            Track Lancer
          </div>
          <p className="font-sans text-[11px] text-[#7a7570] leading-[1.7]">
            A milestone tracker built for Indian freelancers. Simple, honest, on
            record.
          </p>
        </div>

        {/* Product */}
        <div>
          <div className="font-mono text-[8px] tracking-[2px] uppercase text-[#3a3733] mb-3">
            Product
          </div>
          <div className="flex flex-col gap-2">
            {productLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-sans text-[11px] text-[#7a7570] hover:text-[#c8a96e] duration-150 no-underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Company */}
        <div>
          <div className="font-mono text-[8px] tracking-[2px] uppercase text-[#3a3733] mb-3">
            Company
          </div>
          <div className="flex flex-col gap-2">
            {companyLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-sans text-[11px] text-[#7a7570] hover:text-[#c8a96e] duration-150 no-underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Built with */}
        <div>
          <div className="font-mono text-[8px] tracking-[2px] uppercase text-[#3a3733] mb-3">
            Built with
          </div>
          <div className="flex flex-col gap-2">
            {builtWith.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[11px] text-[#7a7570] hover:text-[#c8a96e] duration-150 no-underline"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2.5 md:gap-0">
        <div className="font-mono text-[8px] tracking-[1px] uppercase text-[#3a3733]">
          © {year} Track Lancer — Made in India
        </div>
        {/* Legal links */}
        <div className="flex gap-4">
          {legalLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-mono text-[8px] tracking-[1px] uppercase text-[#3a3733] hover:text-[#7a7570] duration-150 no-underline"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

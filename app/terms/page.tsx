"use client";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  fadeUp,
  fadeRight,
  scaleIn,
  staggerContainer,
} from "../lib/animations";

// ─── Page metadata ─────────────────────────────────────────────────────────────
const LAST_UPDATED = "June 2026";
const CONTACT_EMAIL = "namanworkplace@gmail.com";

// ─── Table of contents ─────────────────────────────────────────────────────────
const sections = [
  { id: "acceptance", label: "Acceptance of Terms" },
  { id: "service", label: "Description of Service" },
  { id: "accounts", label: "Accounts & Eligibility" },
  { id: "user-conduct", label: "User Conduct" },
  { id: "payments", label: "Payments & UPI" },
  { id: "data", label: "Data & Privacy" },
  { id: "ip", label: "Intellectual Property" },
  { id: "disclaimer", label: "Disclaimers" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "termination", label: "Termination" },
  { id: "changes", label: "Changes to Terms" },
  { id: "contact", label: "Contact" },
];

const viewPort = { once: true, amount: 0.15 };

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("acceptance");

  useEffect(() => {
    let mounted = true;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && mounted) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-30% 0px -60% 0px",
      },
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);

      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      mounted = false;
      observer.disconnect();
    };
  }, []);

  return (
    <main className="overflow-hidden">
      {/* ─── Hero ───────────────────────────────────────────────────────────── */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="px-4 lg:px-16 py-14 lg:py-20 border-b border-[#2a2a2a]"
      >
        <motion.div variants={fadeUp} className="hero-tag">
          Legal
        </motion.div>
        <motion.div
          variants={fadeUp}
          className="font-serif text-3xl lg:text-5xl font-bold flex flex-col gap-1"
        >
          <h1>Terms of Use.</h1>
        </motion.div>
        <motion.p
          variants={fadeUp}
          className="text-ink-muted font-sans text-sm lg:text-md mt-4 max-w-xl"
        >
          By using Track Lancer you agree to these terms. Read them — they are
          written in plain language, not legalese.
        </motion.p>
        <motion.p
          variants={scaleIn}
          className="font-mono text-[10px] tracking-[1.5px] uppercase text-[#3a3733] mt-6"
        >
          Last updated — {LAST_UPDATED}
        </motion.p>
      </motion.section>

      {/* ─── Body layout: TOC + content ─────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-start px-4 lg:px-16 py-10 lg:py-16 gap-10 lg:gap-20">
        {/* ─── Sticky table of contents (desktop) ─────────────────────────── */}
        <motion.aside
          variants={fadeRight}
          initial="hidden"
          animate="show"
          className="hidden lg:block lg:w-52 shrink-0 sticky top-[80px]"
        >
          <p className="font-mono text-[8px] tracking-[2px] uppercase text-[#3a3733] mb-4">
            Contents
          </p>
          <nav className="flex flex-col gap-2">
            {sections.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`font-sans text-[11px] hover:text-[#c8a96e] duration-150 no-underline leading-snug ${activeSection === s.id ? "text-accent-dim" : "text-[#7a7570]"}`}
              >
                {String(i + 1).padStart(2, "0")}. {s.label}
              </a>
            ))}
          </nav>
        </motion.aside>

        {/* ─── Sections ────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-14 flex-1 max-w-3xl">
          {/* 01 — Acceptance */}
          <TermsSection id="acceptance" number="01" title="Acceptance of Terms">
            <p>
              These Terms of Use ("Terms") govern your access to and use of
              Track Lancer (the "Service"), operated by Narendra ("we", "us",
              "our"). By creating an account, sharing a project code, or
              otherwise accessing the Service you confirm that you have read,
              understood, and agree to be bound by these Terms.
            </p>
            <p>If you do not agree, please do not use the Service.</p>
          </TermsSection>

          {/* 02 — Service */}
          <TermsSection id="service" number="02" title="Description of Service">
            <p>
              Track Lancer is a milestone-based project tracking tool built for
              Indian freelancers and their clients. It allows freelancers to
              create projects, define milestones, record UPI payment IDs, and
              share a unique 8-digit project code with clients — giving both
              parties a shared, transparent view of project progress and payment
              history.
            </p>
            <p>
              The Service does <strong className="text-ink">not</strong> process
              payments. It records UPI transaction IDs submitted manually for
              verification purposes only. All payments happen directly between
              the freelancer and client outside the platform.
            </p>
          </TermsSection>

          {/* 03 — Accounts */}
          <TermsSection
            id="accounts"
            number="03"
            title="Accounts & Eligibility"
          >
            <p>
              You must be at least 18 years old to register an account. By
              registering, you warrant that the information you provide is
              accurate and that you will keep it up to date.
            </p>
            <p>
              You are responsible for maintaining the confidentiality of your
              credentials. Any activity that occurs under your account is your
              responsibility. Notify us immediately at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-accent hover:text-accent-dim duration-150"
              >
                {CONTACT_EMAIL}
              </a>{" "}
              if you suspect unauthorised access.
            </p>
            <p>
              Clients accessing a project via an 8-digit code do not need an
              account. They are subject to these Terms for the duration of their
              session.
            </p>
          </TermsSection>

          {/* 04 — Conduct */}
          <TermsSection id="user-conduct" number="04" title="User Conduct">
            <p>You agree not to:</p>
            <ul>
              <li>Submit false or fraudulent transaction IDs.</li>
              <li>Use the Service to deceive, defraud, or harm other users.</li>
              <li>
                Attempt to reverse-engineer, scrape, or disrupt the platform.
              </li>
              <li>
                Share project codes with anyone outside the intended project
                relationship.
              </li>
              <li>
                Use the Service for any unlawful purpose under Indian law.
              </li>
            </ul>
            <p>
              We reserve the right to suspend or permanently remove any account
              we determine, in our sole discretion, to be in violation of these
              conduct rules.
            </p>
          </TermsSection>

          {/* 05 — Payments */}
          <TermsSection id="payments" number="05" title="Payments & UPI">
            <p>
              Track Lancer is free to use. We do not charge a subscription fee,
              take a commission, or add gateway fees. The Service is provided as
              a transparency and record-keeping tool only.
            </p>
            <p>
              All financial transactions referenced within the Service are UPI
              payments made directly between the freelancer and client. We are
              not a party to those transactions, do not hold funds, and are not
              liable for any payment disputes, failed transfers, or fraud
              occurring outside the platform.
            </p>
            <p>
              When a client submits a UPI transaction ID, it is stored as plain
              text solely so the freelancer can manually verify the payment.
              This record does not constitute proof of payment in any legal
              sense.
            </p>
          </TermsSection>

          {/* 06 — Data */}
          <TermsSection id="data" number="06" title="Data & Privacy">
            <p>
              We collect only what is necessary: your name, email address, and
              the project and milestone data you create. Passwords are hashed
              using bcrypt and never stored in plain text.
            </p>
            <p>
              We use Resend for transactional email (OTPs and notifications) and
              Vercel Analytics for aggregate usage insights. No advertising
              networks or social trackers are present on this platform.
            </p>
            <p>
              Data is stored in a PostgreSQL database hosted on Neon (EU
              region). By using the Service you consent to this storage.
            </p>
            <p>
              You may request full deletion of your account and all associated
              data at any time by emailing us. Deletion is processed within 7
              business days.
            </p>
            <p>
              For the full privacy breakdown, see the{" "}
              <Link
                href="/#privacy-policy"
                className="text-accent hover:text-accent-dim duration-150"
              >
                Privacy Policy
              </Link>{" "}
              section on the home page.
            </p>
          </TermsSection>

          {/* 07 — IP */}
          <TermsSection id="ip" number="07" title="Intellectual Property">
            <p>
              The Track Lancer codebase, design, copy, and brand elements are
              owned by Narendra and are protected under applicable intellectual
              property laws.
            </p>
            <p>
              The content you create within the Service (project titles,
              milestone descriptions, amounts, notes) remains yours. You grant
              us a limited licence to store and display that content solely to
              operate the Service for you.
            </p>
            <p>
              You may not reproduce, resell, or create derivative products from
              the Service without written permission.
            </p>
          </TermsSection>

          {/* 08 — Disclaimers */}
          <TermsSection id="disclaimer" number="08" title="Disclaimers">
            <p>
              The Service is provided "as is" and "as available" without
              warranty of any kind, express or implied. We do not guarantee
              uninterrupted, error-free availability.
            </p>
            <p>
              Track Lancer is a record-keeping tool. It does not provide legal,
              financial, or contractual advice. It does not constitute a legally
              binding contract between freelancers and clients — it is a
              transparency aid only.
            </p>
            <p>
              We are not responsible for disputes arising between freelancers
              and clients regarding work quality, deadlines, or payment
              obligations.
            </p>
          </TermsSection>

          {/* 09 — Liability */}
          <TermsSection
            id="liability"
            number="09"
            title="Limitation of Liability"
          >
            <p>
              To the fullest extent permitted by applicable law, Narendra shall
              not be liable for any indirect, incidental, special,
              consequential, or punitive damages arising out of your use of or
              inability to use the Service — including loss of data, loss of
              revenue, or payment disputes between users.
            </p>
            <p>
              Our total aggregate liability to you for any claim arising out of
              these Terms shall not exceed ₹500 (five hundred Indian rupees).
            </p>
          </TermsSection>

          {/* 10 — Termination */}
          <TermsSection id="termination" number="10" title="Termination">
            <p>
              You may stop using the Service at any time and request account
              deletion by contacting us. We may suspend or terminate your access
              without notice if you violate these Terms or if we decide to
              discontinue the Service.
            </p>
            <p>
              Upon termination, your data will be deleted from active databases
              within 7 business days. Archived backups may persist for up to 30
              days before being purged.
            </p>
          </TermsSection>

          {/* 11 — Changes */}
          <TermsSection id="changes" number="11" title="Changes to Terms">
            <p>
              We may update these Terms from time to time. When we do, we will
              update the "Last updated" date at the top of this page. Material
              changes will be communicated via email to registered users.
            </p>
            <p>
              Continued use of the Service after an update constitutes your
              acceptance of the revised Terms.
            </p>
          </TermsSection>

          {/* 12 — Contact */}
          <TermsSection id="contact" number="12" title="Contact">
            <p>
              Questions about these Terms? Reach out directly — there is a real
              person on the other end.
            </p>
            <div className="mt-4">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-block decoration-0 px-6 rounded-md transition-all ease-in-out duration-150 text-[11px] lg:text-[14px] text-black bg-accent py-2.5 border hover:bg-accent-dim font-bold border-accent"
              >
                Email us ↪
              </a>
            </div>
          </TermsSection>
        </div>
      </div>

      {/* ─── Footer CTA ─────────────────────────────────────────────────────── */}
      <motion.section
        variants={staggerContainer}
        whileInView="show"
        viewport={viewPort}
        initial="hidden"
        className="border-t border-[#2a2a2a] px-4 lg:px-16 py-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
      >
        <motion.div variants={fadeUp}>
          <p className="font-mono text-[8px] tracking-[2px] uppercase text-[#3a3733] mb-2">
            Done reading?
          </p>
          <p className="font-serif text-xl lg:text-2xl">Back to the product.</p>
        </motion.div>
        <motion.div variants={scaleIn} className="flex gap-3">
          <Link
            href="/"
            className="decoration-0 px-6 rounded-md transition-all ease-in-out duration-150 text-[11px] lg:text-[14px] text-accent py-2.5 border hover:bg-accent hover:text-black font-mono border-accent"
          >
            Home →
          </Link>
          <Link
            href="/#contact"
            className="decoration-0 px-6 rounded-md transition-all ease-in-out duration-150 text-[11px] lg:text-[14px] text-ink-muted py-2.5 border hover:text-ink font-mono border-[#2a2a2a] hover:border-[#3a3733]"
          >
            Contact
          </Link>
        </motion.div>
      </motion.section>
    </main>
  );
}

// ─── Reusable section block ─────────────────────────────────────────────────────
function TermsSection({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      id={id}
      variants={staggerContainer}
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      initial="hidden"
      className="scroll-mt-24"
    >
      <motion.h3
        variants={fadeRight}
        className="font-serif italic text-sm lg:text-md font-medium text-accent/94 mb-3"
      >
        {number} — {title}
      </motion.h3>
      <motion.div
        variants={staggerContainer}
        className="flex flex-col gap-4 font-sans text-[12px] lg:text-[15px] text-ink-muted leading-relaxed border-l-2 border-[#2a2a2a] pl-5 [&_ul]:list-none [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_li]:flex [&_li]:gap-2 [&_li]:before:content-['⇾'] [&_li]:before:text-accent-dim [&_li]:before:shrink-0"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

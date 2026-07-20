"use client";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  fadeUp,
  fadeRight,
  scaleIn,
  staggerContainer,
} from "@/app/lib/animations";

const LAST_UPDATED = "July 2026";
const CONTACT_EMAIL = "namanworkplace@gmail.com";

const sections = [
  { id: "information-collection", label: "Information We Collect" },
  { id: "data-usage", label: "How We Use Your Data" },
  { id: "data-storage", label: "Data Storage" },
  { id: "cookies", label: "Cookies & Sessions" },
  { id: "third-party", label: "Third-Party Services" },
  { id: "retention", label: "Data Retention" },
  { id: "your-rights", label: "Your Rights" },
  { id: "security", label: "Security" },
  { id: "children-privacy", label: "Children's Privacy" },
  { id: "changes", label: "Changes to This Policy" },
  { id: "contact", label: "Contact" },
];

const viewPort = { once: true, amount: 0.15 };

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("information-collection");

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
          <h1>Privacy Policy.</h1>
        </motion.div>
        <motion.p
          variants={fadeUp}
          className="text-ink-muted font-sans text-sm lg:text-md mt-4 max-w-xl"
        >
          How we collect, use, and protect your data. Written in plain language.
        </motion.p>
        <motion.p
          variants={scaleIn}
          className="font-mono text-[12px] font-bold tracking-[1.5px] uppercase text-[#b9aea2] mt-6"
        >
          Last updated — {LAST_UPDATED}
        </motion.p>
      </motion.section>

      <div className="flex flex-col lg:flex-row lg:items-start px-4 lg:px-16 py-10 lg:py-16 gap-10 lg:gap-20">
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

        <div className="flex flex-col gap-14 flex-1 max-w-3xl">
          <TermsSection id="information-collection" number="01" title="Information We Collect">
            <p>
              We collect only what is strictly necessary to run the service
              effectively:
            </p>
            <ul>
              <li>Personal details: Name, email address, phone number.</li>
              <li>
                Payment details: UPI ID and account holder name (we do not
                process payments, this is purely for record-keeping and
                verification).
              </li>
              <li>
                Project details: Project names, milestone data, descriptions,
                amounts, and notes.
              </li>
              <li>
                Session data: IP address and user agent used for authentication
                and security purposes.
              </li>
            </ul>
          </TermsSection>

          <TermsSection id="data-usage" number="02" title="How We Use Your Data">
            <p>
              Your data is used solely to operate your account and projects:
            </p>
            <ul>
              <li>Providing and managing authentication and secure access.</li>
              <li>Facilitating milestone and project tracking.</li>
              <li>
                Sending transactional email notifications (such as OTPs) via
                Resend.
              </li>
              <li>Managing secure user sessions.</li>
            </ul>
            <p>
              We do not sell, rent, or share your information with any third
              party for marketing purposes.
            </p>
          </TermsSection>

          <TermsSection id="data-storage" number="03" title="Data Storage">
            <p>
              All data is securely stored in a PostgreSQL database hosted on
              Neon, located in the Southeast-1 region. By using TrackLancer,
              you consent to this data storage arrangement.
            </p>
          </TermsSection>

          <TermsSection id="cookies" number="04" title="Cookies & Sessions">
            <p>
              We use essential session cookies only, managed via better-auth,
              strictly for keeping you logged in securely. We do not use any
              tracking cookies or third-party marketing cookies to follow your
              browsing activity across other websites.
            </p>
          </TermsSection>

          <TermsSection id="third-party" number="05" title="Third-Party Services">
            <p>
              To provide our services, we use limited, trusted third-party
              providers:
            </p>
            <ul>
              <li>
                <strong>Resend:</strong> For delivering transactional emails
                (OTPs, notifications).
              </li>
              <li>
                <strong>Neon:</strong> For PostgreSQL database hosting.
              </li>
              <li>
                <strong>Vercel Analytics:</strong> For aggregate service
                performance tracking.
              </li>
            </ul>
            <p>
              No advertising networks, social media trackers, or third-party
              marketing analytics are present on this platform.
            </p>
          </TermsSection>

          <TermsSection id="retention" number="06" title="Data Retention">
            <p>
              In accordance with data minimization principles, we automatically
              manage and purge data:
            </p>
            <ul>
              <li>
                Temporary user activities and logs are permanently deleted after
                7 days.
              </li>
              <li>
                Projects remaining in a pending or unclaimed status are
                considered abandoned and deleted after 30 days.
              </li>
              <li>
                Account data and active projects are retained as long as your
                account remains active, until a deletion request is made.
              </li>
            </ul>
          </TermsSection>

          <TermsSection id="your-rights" number="07" title="Your Rights">
            <p>You have full control over your personal data:</p>
            <ul>
              <li>Request an export of your personal data at any time.</li>
              <li>
                Update your profile information and account details directly
                through the dashboard.
              </li>
              <li>
                Request full deletion of your account and all associated data,
                which is processed within 7 business days.
              </li>
            </ul>
          </TermsSection>

          <TermsSection id="security" number="08" title="Security">
            <p>
              We employ industry-standard security measures to protect your
              data:
            </p>
            <ul>
              <li>
                All passwords are hashed using bcrypt and are never stored in
                plain text.
              </li>
              <li>
                One-Time Passwords (OTPs) are hashed and automatically expire
                after 10 minutes.
              </li>
              <li>Authentication is session-based.</li>
              <li>All communications occur over secure HTTPS connections.</li>
            </ul>
          </TermsSection>

          <TermsSection id="children-privacy" number="09" title="Children's Privacy">
            <p>
              TrackLancer is not intended for use by children. You must be at
              least 18 years of age to register an account and use our services.
              We do not knowingly collect personal data from anyone under 18.
            </p>
          </TermsSection>

          <TermsSection id="changes" number="10" title="Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. When we do,
              we will update the "Last updated" date at the top of this page.
              We encourage you to review this policy periodically. Continued
              use of the Service after an update constitutes your acceptance of
              the revised Privacy Policy.
            </p>
          </TermsSection>

          <TermsSection id="contact" number="11" title="Contact">
            <p>
              If you have any questions, concerns, or requests regarding this
              Privacy Policy or your data, please reach out to us directly.
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

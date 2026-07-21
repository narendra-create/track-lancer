import type { Metadata } from "next";
import { dmSans, dmSerif, ibmMono } from "./fonts";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastProvider } from "./components/ToastProvider";
import NextTopLoader from "nextjs-toploader";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "MileGlide | Freelance Milestone & UPI Payment Tracker",
  description:
    "Track freelance project milestones, share client dashboards, verify UPI payments, and manage project delays effortlessly.",

  openGraph: {
    title: "MileGlide | Freelance Milestone & UPI Tracker",
    description:
      "Track freelance projects, milestones, and client UPI payments in a clean dashboard built for India.",
    url:
      process.env.NEXT_PUBLIC_SITEURL ?? "https://mileglide.narendra-dubey.in",
    siteName: "MileGlide",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITEURL ?? "https://mileglide.narendra-dubey.in"}/og-image.webp`,
        width: 1200,
        height: 630,
        alt: "MileGlide freelancer milestone and UPI payment tracking dashboard",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "MileGlide | Freelance Milestone & UPI Tracker",
    description:
      "Track freelance projects, milestones, and client UPI payments in a clean dashboard built for India.",
    images: [
      `${process.env.NEXT_PUBLIC_SITEURL ?? "https://mileglide.narendra-dubey.in"}/og-image.webp`,
    ],
  },

  alternates: {
    canonical:
      process.env.NEXT_PUBLIC_SITEURL ?? "https://mileglide.narendra-dubey.in",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSerif.variable} ${ibmMono.variable} ${dmSans.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col">
        <NextTopLoader
          color="#c8a96e"
          showSpinner={false}
          speed={300}
          zIndex={1600}
        />
        <ToastProvider>
          <Navbar />
          {children}
          <Footer />
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { dmSans, dmSerif, ibmMono } from "./fonts";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastProvider } from "./components/ToastProvider";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "MileGlide — Milestone & Payment Tracker for Freelancers",
  description:
    "MileGlide helps freelancers and clients stay aligned with milestone-based project tracking, transparent progress updates, payment records, and budget control — from start to final delivery.",
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

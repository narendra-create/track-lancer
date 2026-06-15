import type { Metadata } from "next";
import { dmSans, dmSerif, ibmMono } from "./fonts";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "TrackLancer — Milestone & Payment Tracker for Freelancers",
  description:
    "Tracklancer helps freelancers and clients stay aligned with milestone-based project tracking, transparent progress updates, payment records, and budget control — from start to final delivery.",
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
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

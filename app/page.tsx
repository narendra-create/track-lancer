"use client";
import Image from "next/image";
import { HeroMockup } from "./components/Heromockup";
import { YellowButton } from "./components/Buttons/Yellowbutton";
import { Secondbutton } from "./components/Buttons/Secondbutton";
import { motion } from "motion/react";
import { Ticker } from "./components/tickeranimation";
import { Featurecard } from "./components/Featurecard";
import type { cardprop } from "./components/Featurecard";
import {
  fadeUp,
  fadeLeft,
  fadeRight,
  scaleIn,
  staggerContainer,
} from "./lib/animations";

export default function Home() {
  const features1: cardprop[] = [
    {
      title: "Create a project",
      body: "Set the title, total amount, and deadline, A unique 8-digit code is generated instantly.",
      isghost: true,
      ghostnumber: 1,
    },
    {
      title: "Share the code",
      body: "Send the code to your freelancer, They enter it to access your project milestone dashboard - no account setup required.",
      isghost: true,
      ghostnumber: 2,
    },
    {
      title: "See milestones",
      body: "Each milestone has a title, amount, and due date on the timeline.",
      isghost: true,
      ghostnumber: 3,
    },
    {
      title: "Pay & settle",
      body: "Pay via UPI, submit the transaction ID, Freelancer verifies and marks it approved.",
      isghost: true,
      ghostnumber: 4,
    },
  ];

  const viewPort = {
    once: true,
    amount: 0.2,
  };

  return (
    <main>
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="flex flex-col lg:flex-row mt-10 lg:mt-12 justify-between lg:pr-4"
      >
        <div className="px-4 mb-8 lg:pl-26 lg:mt-14">
          <motion.div
            variants={fadeUp}
            className="hero-tag text-accent-dim font-sans text-md lg:text-xl"
          >
            PROJECT MILESTONE TRACKING
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="flex flex-col font-serif text-3xl lg:text-6xl gap-0 justify-center font-bold"
          >
            <h1>Track Work.</h1>
            <h1 className="text-accent">
              <i>Get paid.</i>
            </h1>
            <h1>On record.</h1>
          </motion.div>
          <motion.p
            variants={fadeUp}
            className="text-ink-muted my-2 lg:my-3 max-w-133 text-md lg:text-lg font-sans"
          >
            A tool for freelancers and their clients. Every milestone logged,
            every payment verified, zero confusion about what's owed.
          </motion.p>
          <motion.div
            variants={scaleIn}
            className="mt-4 mb-4 flex flex-col lg:flex-row gap-1 lg:gap-3"
          >
            <YellowButton>START FREE →</YellowButton>
            <Secondbutton>SEE HOW IT WORKS</Secondbutton>
          </motion.div>
        </div>
        <motion.div variants={scaleIn} className="px-3 lg:w-3xl">
          <HeroMockup />
        </motion.div>
      </motion.section>
      <motion.section
        variants={staggerContainer}
        animate="show"
        initial="hidden"
        className="mt-7 lg:mt-14"
      >
        <Ticker />
      </motion.section>
      <motion.section
        variants={staggerContainer}
        animate="show"
        initial="hidden"
      >
        <motion.div
          variants={fadeUp}
          whileInView="show"
          viewport={viewPort}
          initial="hidden"
          className="mt-6 border-b border-ink-muted/70 mb-12 pb-12"
        >
          <div className="px-4 lg:px-16 py-5 lg:py-9">
            <h3 className="font-serif italic text-sm font-medium text-accent/94 text-shadow-accent">
              01 — How it works
            </h3>
            <div className="font-serif text-xl lg:text-2xl lg:flex lg:flex-col lg:gap-2 my-2">
              <h2>Simple for you.</h2>
              <h2>Clear for your client.</h2>
            </div>
            <p className="text-ink-muted text-[12px] lg:text-[18px] font-sans max-w-82 lg:max-w-176">
              No more chasing payments or explaining what's done. Everything is
              on record, visible to both sides.
            </p>
          </div>
          <motion.div
            variants={staggerContainer}
            whileInView="show"
            initial="hidden"
            viewport={viewPort}
            className="px-4 lg:px-16 flex flex-col lg:flex-row"
          >
            {features1.map((item, i) => {
              return (
                <motion.div variants={fadeUp} key={i}>
                  <Featurecard item={item} />
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </motion.section>
    </main>
  );
}

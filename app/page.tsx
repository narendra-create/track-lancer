"use client";
import Image from "next/image";
import { HeroMockup } from "./components/Heromockup";
import { YellowButton } from "./components/Buttons/Yellowbutton";
import { Secondbutton } from "./components/Buttons/Secondbutton";
import { motion } from "motion/react";
import { Ticker } from "./components/tickeranimation";
import {
  fadeUp,
  fadeLeft,
  fadeRight,
  scaleIn,
  staggerContainer,
} from "./lib/animations";

export default function Home() {
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
          <motion.div className="mt-4 mb-4 flex flex-col lg:flex-row gap-1 lg:gap-3">
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
    </main>
  );
}

"use client";
import React from "react";
import { useState } from "react";

const Navbar = () => {
  const [open, setopen] = useState(false);

  const links = ["How it works", "Features", "About", "Contact", "Privacy"];

  return (
    <>
      <nav
        className="
        sticky top-0 z-50
        h-[66px]
        px-5 md:px-10
        flex items-center justify-between
        bg-[#0f0f0f]/90
        backdrop-blur-md
        border-b border-[#2a2a2a]
      "
      >
        {/* Logo */}
        <div
          className="
          font-serif 
          text-[#c8a96e]
          text-lg lg:text-2xl
        "
        >
          Track Lancer
        </div>

        {/* Desktop Links */}
        <div
          className="
          hidden md:flex 
          items-center gap-7
        "
        >
          {links.map((item) => (
            <button
              key={item}
              className="
                font-mono text-[14px]
                uppercase tracking-[1.5px]
                text-[#e3dfda]
                hover:text-[#81817f]
                duration-150
              "
            >
              {item}
            </button>
          ))}
        </div>

        {/* Desktop CTA */}
        <button
          className="
          hidden md:block
          font-mono text-[13px]
          uppercase tracking-wider
          px-4 py-1.5
          border border-[#3d3d3d]
          hover:bg-[#e8e3d8]
          hover:text-black
          duration-150
        "
        >
          Get Started →
        </button>

        {/* Hamburger */}
        <button
          onClick={() => setopen((prev) => !prev)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[6px] cursor-pointer"
          aria-label="Toggle menu"
          type="button"
        >
          <span
            className={`block w-6 h-[2px] bg-[#e8e3d8] transition-all duration-300 origin-center ${open ? "translate-y-[8px] rotate-45" : ""}`}
          />
          <span
            className={`block w-6 h-[2px] bg-[#e8e3d8] transition-all duration-300 ${open ? "opacity-0 scale-x-0" : ""}`}
          />
          <span
            className={`block w-6 h-[2px] bg-[#e8e3d8] transition-all duration-300 origin-center ${open ? "-translate-y-[8px] -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={` fixed left-0 right-0 top-[66px] z-40 bg-[#0f0f0f]/95 backdrop-blur-xl border-b border-[#2a2a2a] px-5 py-4 flex flex-col transition-all duration-200

          ${
            open
              ? "opacity-100 translate-y-0"
              : "pointer-events-none opacity-0 -translate-y-5"
          }`}
      >
        {links.map((item) => (
          <button
            key={item}
            onClick={() => setopen(false)}
            className="text-left py-4 border-b border-[#2a2a2a] font-mono text-[10px] uppercase tracking-[1.5px] text-[#dbd6d1] hover:text-[#71706e]"
          >
            {item}
          </button>
        ))}

        <button
          className=" mt-4 py-3 border border-[#3d3d3d] font-mono
            text-[10px]
            uppercase
            tracking-wider
            text-[#e8e3d8]
          "
        >
          Get Started →
        </button>
      </div>
    </>
  );
};

export default Navbar;

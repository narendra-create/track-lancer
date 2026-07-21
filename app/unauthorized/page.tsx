"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function UnauthorizedPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* ── subtle animated grid noise on canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame: number;
    let t = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cols = Math.ceil(canvas.width / 80);
      const rows = Math.ceil(canvas.height / 80);

      for (let x = 0; x <= cols; x++) {
        for (let y = 0; y <= rows; y++) {
          const pulse = Math.sin(t * 0.008 + x * 0.4 + y * 0.3) * 0.5 + 0.5;
          ctx.strokeStyle = `rgba(200, 169, 110, ${pulse * 0.045})`;
          ctx.lineWidth = 0.5;

          // vertical
          ctx.beginPath();
          ctx.moveTo(x * 80, 0);
          ctx.lineTo(x * 80, canvas.height);
          ctx.stroke();

          // horizontal
          ctx.beginPath();
          ctx.moveTo(0, y * 80);
          ctx.lineTo(canvas.width, y * 80);
          ctx.stroke();
        }
      }

      t++;
      frame = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: "var(--font-sans, Arial, sans-serif)",
      }}
    >
      {/* animated grid canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* radial glow behind the card */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(200,169,110,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* card */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "64px 48px",
          border: "1px solid #2a2a2a",
          background: "rgba(22, 22, 22, 0.85)",
          backdropFilter: "blur(12px)",
          maxWidth: "480px",
          width: "90%",
        }}
      >
        {/* top label */}
        <p
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "8px",
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            color: "#c8a96e",
            marginBottom: "32px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "24px",
              height: "1px",
              background: "#c8a96e",
            }}
          />
          Access Denied
        </p>

        {/* large 403 */}
        <div style={{ position: "relative", marginBottom: "8px" }}>
          <span
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "clamp(80px, 15vw, 120px)",
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-4px",
              color: "transparent",
              WebkitTextStroke: "1px rgba(200,169,110,0.25)",
              userSelect: "none",
              display: "block",
            }}
          >
            403
          </span>
          {/* glint overlay */}
          <span
            style={{
              position: "absolute",
              inset: 0,
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "clamp(80px, 15vw, 120px)",
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-4px",
              color: "transparent",
              background:
                "linear-gradient(135deg, #c8a96e 0%, transparent 45%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              userSelect: "none",
            }}
          >
            403
          </span>
        </div>

        {/* divider */}
        <div
          style={{
            width: "40px",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, #c8a96e, transparent)",
            margin: "24px auto",
          }}
        />

        {/* heading */}
        <h1
          style={{
            fontFamily: "var(--font-serif, Georgia, serif)",
            fontSize: "clamp(22px, 4vw, 28px)",
            fontWeight: 400,
            color: "#e8e3d8",
            margin: "0 0 12px",
            letterSpacing: "-0.5px",
          }}
        >
          You don&apos;t belong here.
        </h1>

        {/* sub text */}
        <p
          style={{
            fontFamily: "var(--font-sans, Arial, sans-serif)",
            fontSize: "13px",
            color: "#7a7570",
            lineHeight: 1.7,
            margin: "0 0 40px",
            maxWidth: "340px",
          }}
        >
          This area is restricted to a different role. You&apos;re either on
          the wrong path or you snuck in somewhere you shouldn&apos;t be.
        </p>

        {/* action buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            width: "100%",
          }}
        >
          <Link
            href="/dashboard"
            style={{
              display: "block",
              width: "100%",
              padding: "12px 24px",
              background: "#c8a96e",
              color: "#0f0f0f",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "10px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              textDecoration: "none",
              textAlign: "center",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#9c7d45")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "#c8a96e")
            }
          >
            Go to Dashboard →
          </Link>

          <Link
            href="/"
            style={{
              display: "block",
              width: "100%",
              padding: "12px 24px",
              background: "transparent",
              color: "#7a7570",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "10px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              textDecoration: "none",
              textAlign: "center",
              border: "1px solid #2a2a2a",
              transition: "border-color 0.15s ease, color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#3d3d3d";
              e.currentTarget.style.color = "#c4bcb1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#2a2a2a";
              e.currentTarget.style.color = "#7a7570";
            }}
          >
            Back to Home
          </Link>
        </div>

        {/* footer note */}
        <p
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "9px",
            letterSpacing: "1px",
            color: "#3a3733",
            marginTop: "40px",
            textTransform: "uppercase",
          }}
        >
          MileGlide · Error 403
        </p>
      </div>

      {/* corner accents */}
      {[
        { top: 24, left: 24 },
        { top: 24, right: 24 },
        { bottom: 24, left: 24 },
        { bottom: 24, right: 24 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...pos,
            width: "20px",
            height: "20px",
            borderTop: i < 2 ? "1px solid #2a2a2a" : undefined,
            borderBottom: i >= 2 ? "1px solid #2a2a2a" : undefined,
            borderLeft: i % 2 === 0 ? "1px solid #2a2a2a" : undefined,
            borderRight: i % 2 !== 0 ? "1px solid #2a2a2a" : undefined,
            zIndex: 1,
          }}
        />
      ))}
    </main>
  );
}

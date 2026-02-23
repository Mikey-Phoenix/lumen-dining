import { useEffect, useState } from "react";

export default function PageLoader({ onComplete }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => onComplete?.(), 600);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-700 ${fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      style={{ backgroundColor: "#1F1F22", fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      {/* Outer glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "420px",
          height: "420px",
          background: "radial-gradient(circle, rgba(128,0,32,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Spinning ring + center text */}
      <div className="relative flex items-center justify-center">

        {/* Outer slow spinning decorative ring */}
        <svg
          className="absolute animate-spin"
          style={{ animationDuration: "6s", animationDirection: "reverse" }}
          width="320"
          height="320"
          viewBox="0 0 320 320"
        >
          <circle
            cx="160"
            cy="160"
            r="150"
            fill="none"
            stroke="#4A4A4F"
            strokeWidth="1"
            strokeDasharray="4 12"
            strokeLinecap="round"
          />
        </svg>

        {/* Main spinning arc */}
        <svg
          className="absolute animate-spin"
          style={{ animationDuration: "1.6s" }}
          width="280"
          height="280"
          viewBox="0 0 280 280"
        >
          {/* Track */}
          <circle
            cx="140"
            cy="140"
            r="128"
            fill="none"
            stroke="#2a2a2d"
            strokeWidth="4"
          />
          {/* Arc */}
          <circle
            cx="140"
            cy="140"
            r="128"
            fill="none"
            stroke="#800020"
            strokeWidth="4"
            strokeDasharray="120 685"
            strokeLinecap="round"
          />
        </svg>

        {/* Inner static ring */}
        <svg
          className="absolute"
          width="220"
          height="220"
          viewBox="0 0 220 220"
        >
          <circle
            cx="110"
            cy="110"
            r="100"
            fill="none"
            stroke="#4A4A4F"
            strokeWidth="0.8"
            opacity="0.4"
          />
        </svg>

        {/* Center text */}
        <div className="text-center" style={{ width: "160px" }}>
          <p
            className="m-0 font-light"
            style={{
              color: "#F5F5F0",
              fontSize: "clamp(22px, 3vw, 38px)",
              letterSpacing: "clamp(8px, 1.5vw, 16px)",
            }}
          >
            LUMEN
          </p>
          <div
            className="mx-auto my-2"
            style={{
              height: "1px",
              background: "linear-gradient(to right, transparent, #800020, transparent)",
            }}
          />
          <p
            className="m-0 font-light"
            style={{
              color: "#800020",
              fontSize: "clamp(9px, 1vw, 13px)",
              letterSpacing: "clamp(5px, 1vw, 10px)",
            }}
          >
            DINING
          </p>
        </div>

      </div>

      {/* Bottom tagline */}
      <p
        className="absolute bottom-10 uppercase m-0"
        style={{
          color: "#4A4A4F",
          fontSize: "clamp(9px, 1vw, 11px)",
          letterSpacing: "clamp(3px, 0.8vw, 6px)",
        }}
      >
        Fine Dining Experience
      </p>

    </div>
  );
}
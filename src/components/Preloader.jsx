import { useEffect, useState } from "react";

export default function PageLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => onComplete?.(), 700);
          }, 400);
          return 100;
        }
        const increment = prev < 60 ? 3 : prev < 85 ? 1.5 : 0.7;
        return Math.min(prev + increment, 100);
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 ${fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      style={{ backgroundColor: "#1F1F22", fontFamily: "Georgia, 'Times New Roman', serif" }}
    >

      {/* Ambient glow */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(128,0,32,0.12) 0%, transparent 70%)" }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-60"
        style={{ background: "linear-gradient(to right, transparent, #800020, transparent)" }}
      />

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] opacity-60"
        style={{ background: "linear-gradient(to right, transparent, #800020, transparent)" }}
      />

      {/* SVG Logo mark */}
      <div className="mb-8 animate-pulse">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80">
          <defs>
            <radialGradient id="plateGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#4A4A4F" />
              <stop offset="100%" stopColor="#1F1F22" />
            </radialGradient>
            <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#800020" />
              <stop offset="100%" stopColor="#ff6b6b" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Plate */}
          <circle cx="50" cy="55" r="38" fill="url(#plateGlow)" />
          <circle cx="50" cy="55" r="38" fill="none" stroke="#800020" strokeWidth="1.2" opacity="0.5" />
          <circle cx="50" cy="55" r="29" fill="none" stroke="#800020" strokeWidth="0.6" opacity="0.25" />

          {/* Fork */}
          <g transform="translate(28, 32)">
            <rect x="3" y="0" width="2.5" height="20" rx="1.2" fill="#800020" opacity="0.85" />
            <rect x="0.5" y="-11" width="1.5" height="11" rx="0.75" fill="#800020" opacity="0.85" />
            <rect x="3" y="-11" width="1.5" height="11" rx="0.75" fill="#800020" opacity="0.85" />
            <rect x="5.5" y="-11" width="1.5" height="11" rx="0.75" fill="#800020" opacity="0.85" />
            <path d="M0.5 0 Q3.5 3.5 7 0" fill="none" stroke="#800020" strokeWidth="1" opacity="0.85" />
          </g>

          {/* Knife */}
          <g transform="translate(63, 21)">
            <rect x="2.5" y="0" width="2.5" height="20" rx="1.2" fill="#800020" opacity="0.85" />
            <path d="M2.5 -11 Q8 -5 5 0 L2.5 0 Z" fill="#800020" opacity="0.85" />
          </g>

          {/* Flame */}
          <path
            d="M50,38 C54,43 58,49 54,55 C52,59 48,59 46,55 C42,49 46,43 50,38 Z"
            fill="url(#flameGrad)"
            opacity="0.95"
          />
          <path
            d="M50,44 C52,47 54,50 52,53 C51,55 49,55 48,53 C46,50 48,47 50,44 Z"
            fill="#ff9999"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Restaurant name */}
      <div className="text-center mb-12">
        <h1
          className="text-3xl font-light tracking-[12px] m-0 mb-1.5"
          style={{ color: "#F5F5F0", animation: "fadeSlideUp 0.8s ease forwards" }}
        >
          LUMEN
        </h1>
        <p
          className="text-[11px] font-light tracking-[8px] m-0"
          style={{ color: "#800020", animation: "fadeSlideUp 0.8s ease 0.15s forwards" }}
        >
          DINING
        </p>
      </div>

      {/* Progress bar track */}
      <div
        className="w-56 h-px rounded-sm overflow-hidden mb-3.5"
        style={{ backgroundColor: "#4A4A4F" }}
      >
        <div
          className="h-full rounded-sm transition-[width] duration-100 ease-linear"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(to right, #800020, #cc2244)",
            boxShadow: "0 0 8px rgba(128,0,32,0.7)",
          }}
        />
      </div>

      {/* Percentage */}
      <p
        className="text-[11px] tracking-[4px] m-0"
        style={{ color: "#4A4A4F" }}
      >
        {Math.round(progress)}%
      </p>

      {/* Tagline */}
      <p
        className="absolute bottom-8 text-[10px] tracking-[3px] uppercase m-0"
        style={{ color: "#4A4A4F" }}
      >
        Fine Dining Experience
      </p>

      {/* Keyframes — only needed for fadeSlideUp since Tailwind doesn't have it */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
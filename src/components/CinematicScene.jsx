import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";

/**
 * CinematicScene — fixed full-viewport cinematic backdrop.
 *
 * Layered for depth:
 *   1. Theme-aware base color
 *   2. Optional <video> (loads /cinematic.mp4 if user provides one)
 *   3. Three drifting aurora gradients
 *   4. Six floating blurred glow orbs
 *   5. Slowly rotating conic light beam
 *   6. CSS-positioned twinkling stars (dark theme only)
 *   7. Slow scanline sweep
 *   8. Film-grain noise overlay
 *   9. Strong dark vignette
 *
 * Drop any cinematic .mp4 at /public/cinematic.mp4 and it will fade in.
 */
const VIDEO_SRC = "/cinematic.mp4";
const NUM_STARS = 110;

const Star = ({ x, y, size, delay, dur }) => (
  <div
    className="absolute rounded-full bg-white"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: `${size}px`,
      height: `${size}px`,
      animation: `twinkle ${dur}s ease-in-out ${delay}s infinite`,
      boxShadow: "0 0 6px rgba(255,255,255,0.85)",
      willChange: "opacity",
    }}
  />
);

import PropTypes from "prop-types";
Star.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  delay: PropTypes.number.isRequired,
  dur: PropTypes.number.isRequired,
};

const CinematicScene = () => {
  const { theme } = useTheme();
  const videoRef = useRef(null);
  const [videoOK, setVideoOK] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const ok = () => setVideoOK(true);
    const bad = () => setVideoOK(false);
    v.addEventListener("loadeddata", ok);
    v.addEventListener("error", bad);
    return () => {
      v.removeEventListener("loadeddata", ok);
      v.removeEventListener("error", bad);
    };
  }, []);

  const [stars] = useState(() =>
    Array.from({ length: NUM_STARS }, (_, i) => ({
      id: `star-${i}-${Math.random().toString(36).slice(2, 8)}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.8 + 0.4,
      delay: Math.random() * 5,
      dur: Math.random() * 3 + 2.5,
    }))
  );

  const orbs = useMemo(
    () => [
      { id: "orb-a", l: 8,  t: 12, s: 28, c: "rgba(232,168,56,0.18)", d: 22, a: "orbDrift1" },
      { id: "orb-b", l: 65, t: 18, s: 36, c: "rgba(180,130,255,0.12)", d: 28, a: "orbDrift2" },
      { id: "orb-c", l: 25, t: 60, s: 32, c: "rgba(255,180,80,0.14)",  d: 24, a: "orbDrift3" },
      { id: "orb-d", l: 78, t: 70, s: 30, c: "rgba(232,168,56,0.12)",  d: 26, a: "orbDrift1" },
      { id: "orb-e", l: 45, t: 35, s: 40, c: "rgba(100,80,200,0.10)",  d: 32, a: "orbDrift2" },
      { id: "orb-f", l: 12, t: 85, s: 26, c: "rgba(255,200,100,0.14)", d: 20, a: "orbDrift3" },
    ],
    []
  );

  const isDark = theme === "dark";

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* 1. Base color */}
      <div
        className="absolute inset-0 transition-colors duration-1000"
        style={{ background: isDark ? "#020208" : "#f5efe2" }}
      />

      {/* 2. Optional cinematic video — drop /public/cinematic.mp4 */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: videoOK ? (isDark ? 0.42 : 0.20) : 0,
          filter: isDark
            ? "saturate(0.85) brightness(0.55) hue-rotate(-12deg)"
            : "saturate(1.15) brightness(1.04)",
          transition: "opacity 1.4s ease",
        }}
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      {/* 3. Drifting aurora gradients */}
      <div
        className="absolute"
        style={{
          inset: "-20%",
          background: isDark
            ? "radial-gradient(ellipse 55% 50% at 30% 35%, rgba(232,168,56,0.20), transparent 65%)"
            : "radial-gradient(ellipse 55% 50% at 30% 35%, rgba(232,168,56,0.32), transparent 65%)",
          animation: "aurora1 26s ease-in-out infinite",
          willChange: "transform",
        }}
      />
      <div
        className="absolute"
        style={{
          inset: "-20%",
          background: isDark
            ? "radial-gradient(ellipse 45% 60% at 72% 62%, rgba(140,90,220,0.18), transparent 65%)"
            : "radial-gradient(ellipse 45% 60% at 72% 62%, rgba(184,134,11,0.22), transparent 65%)",
          animation: "aurora2 32s ease-in-out infinite",
          willChange: "transform",
        }}
      />
      <div
        className="absolute"
        style={{
          inset: "-20%",
          background: isDark
            ? "radial-gradient(ellipse 40% 70% at 50% 85%, rgba(60,100,200,0.16), transparent 65%)"
            : "radial-gradient(ellipse 40% 70% at 50% 85%, rgba(255,200,100,0.20), transparent 65%)",
          animation: "aurora3 24s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* 4. Floating glow orbs */}
      {orbs.map((o, i) => (
        <div
          key={o.id}
          className="absolute rounded-full"
          style={{
            left: `${o.l}%`,
            top: `${o.t}%`,
            width: `${o.s}vmax`,
            height: `${o.s}vmax`,
            background: `radial-gradient(circle, ${o.c}, transparent 65%)`,
            filter: "blur(50px)",
            animation: `${o.a} ${o.d}s ease-in-out infinite`,
            animationDelay: `${i * -2.7}s`,
            opacity: isDark ? 0.9 : 0.55,
            willChange: "transform",
          }}
        />
      ))}

      {/* 5. Slowly rotating conic light beam */}
      <div
        className="absolute"
        style={{
          inset: "-50%",
          mixBlendMode: isDark ? "screen" : "multiply",
          opacity: isDark ? 0.7 : 0.3,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "conic-gradient(from 0deg at 50% 50%, transparent 0%, rgba(232,168,56,0.10) 10%, transparent 25%, transparent 60%, rgba(140,90,220,0.08) 75%, transparent 90%)"
              : "conic-gradient(from 0deg at 50% 50%, transparent 0%, rgba(232,168,56,0.14) 10%, transparent 25%, transparent 60%, rgba(255,200,100,0.10) 75%, transparent 90%)",
            animation: "spinSlow 80s linear infinite",
            willChange: "transform",
          }}
        />
      </div>

      {/* 6. Stars (dark theme) */}
      {isDark && (
        <div className="absolute inset-0">
          {stars.map((s) => (
            <Star
              key={s.id}
              x={s.x}
              y={s.y}
              size={s.size}
              delay={s.delay}
              dur={s.dur}
            />
          ))}
        </div>
      )}

      {/* 7. Scanline sweep — wide soft band traveling down */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          height: "40vh",
          background: isDark
            ? "linear-gradient(180deg, transparent 0%, rgba(232,168,56,0.05) 35%, rgba(232,168,56,0.09) 50%, rgba(232,168,56,0.05) 65%, transparent 100%)"
            : "linear-gradient(180deg, transparent 0%, rgba(232,168,56,0.06) 35%, rgba(232,168,56,0.10) 50%, rgba(232,168,56,0.06) 65%, transparent 100%)",
          animation: "scanSweep 14s linear infinite",
          willChange: "transform",
        }}
      />

      {/* 8. Film grain noise */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")',
          opacity: isDark ? 0.045 : 0.028,
          animation: "grainShift 0.45s steps(3) infinite",
        }}
      />

      {/* 9. Strong dark vignette */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.55) 78%, rgba(0,0,0,0.92) 100%)",
          opacity: isDark ? 1 : 0.32,
        }}
      />

      {/* Top edge wash for nav legibility */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "140px",
          background: isDark
            ? "linear-gradient(180deg, rgba(0,0,0,0.65), transparent)"
            : "linear-gradient(180deg, rgba(245,239,226,0.65), transparent)",
        }}
      />
    </div>
  );
};

export default CinematicScene;

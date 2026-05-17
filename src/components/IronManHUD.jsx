import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import PropTypes from "prop-types";
import profileImg from "../assets/me.png";

/**
 * IronManHUD — HUD overlay sitting on top of the HelmetScene canvas.
 *
 * Provides the "Iron Man targeting computer" feel:
 *  - 4 corner targeting brackets that pulse and rotate slightly
 *  - A "TARGET :: YKM-01" card (top-right) with user's photo thumbnail +
 *    live telemetry numbers — this is the identity anchor
 *  - A rotating concentric scan arc around the helmet
 *  - A bottom HUD strip with scroll progress + status text
 *
 * All HTML so it's crisp and reads as overlay tech.
 */

const PROGRESS_STEPS = ["BOOT", "SCAN", "TRACK", "ANALYZE", "LOCK", "RENDER"];

const gold = (a) => `rgba(232,168,56,${a})`;
const cream = (a) => `rgba(255,240,210,${a})`;
const SCAN_GREEN = "#36ff8c";
const PULSE_SOFT = "pulse-soft 1.4s ease-in-out infinite";
const MONO_LABEL_STYLE = { color: gold(0.7) };
const MONO_VALUE_STYLE = { color: cream(0.95) };

const TickingNumber = ({ digits = 4, base = 1000, speed = 90 }) => {
  const [n, setN] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      setN(() => Math.floor(Math.random() * Math.pow(10, digits)));
    }, speed);
    return () => clearInterval(id);
  }, [digits, speed]);
  return (
    <span className="font-mono tabular-nums">
      {String(n).padStart(digits, "0")}
    </span>
  );
};
TickingNumber.propTypes = {
  digits: PropTypes.number,
  base: PropTypes.number,
  speed: PropTypes.number,
};

const IronManHUD = () => {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { damping: 30, stiffness: 100 });
  const progressPercent = useTransform(smooth, (v) =>
    `${Math.round(v * 100)}`.padStart(3, "0")
  );
  const stepIndex = useTransform(smooth, (v) =>
    Math.min(PROGRESS_STEPS.length - 1, Math.floor(v * PROGRESS_STEPS.length))
  );

  const [step, setStep] = useState(PROGRESS_STEPS[0]);
  const [pct, setPct] = useState("000");

  useEffect(() => {
    const a = stepIndex.on("change", (i) => setStep(PROGRESS_STEPS[i]));
    const b = progressPercent.on("change", (p) => setPct(p));
    return () => {
      a();
      b();
    };
  }, [stepIndex, progressPercent]);

  return (
    <div className="fixed inset-0 z-[6] pointer-events-none hidden md:block">
      {/* ───── 4 Corner targeting brackets ───── */}
      {[
        { c: "top-6 left-6", b: "border-t-2 border-l-2" },
        { c: "top-6 right-6", b: "border-t-2 border-r-2" },
        { c: "bottom-6 left-6", b: "border-b-2 border-l-2" },
        { c: "bottom-6 right-6", b: "border-b-2 border-r-2" },
      ].map((corner) => (
        <motion.div
          key={corner.c}
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className={`absolute ${corner.c} ${corner.b}`}
          style={{
            width: "44px",
            height: "44px",
            borderColor: gold(0.85),
            borderRadius: "4px",
            filter: `drop-shadow(0 0 8px ${gold(0.5)})`,
          }}
        />
      ))}

      {/* ───── Centre crosshair (rotating concentric arcs) ───── */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: "min(60vw, 540px)", aspectRatio: "1 / 1" }}
      >
        {/* outer rotating arc */}
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 w-full h-full"
          style={{ animation: "spinSlow 32s linear infinite" }}
        >
          <circle
            cx="100"
            cy="100"
            r="95"
            fill="none"
            stroke={gold(0.35)}
            strokeWidth="0.3"
            strokeDasharray="2 6"
          />
          <path
            d="M 100 5 A 95 95 0 0 1 195 100"
            fill="none"
            stroke={gold(0.55)}
            strokeWidth="0.6"
          />
          <path
            d="M 5 100 A 95 95 0 0 1 100 5"
            fill="none"
            stroke={gold(0.30)}
            strokeWidth="0.4"
          />
          {/* tick marks every 30deg */}
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const x1 = 100 + Math.cos(a) * 92;
            const y1 = 100 + Math.sin(a) * 92;
            const x2 = 100 + Math.cos(a) * 96;
            const y2 = 100 + Math.sin(a) * 96;
            return (
              <line
                key={`tick-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={gold(0.6)}
                strokeWidth="0.5"
              />
            );
          })}
        </svg>

        {/* inner counter-rotating arc */}
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 w-full h-full"
          style={{
            animation: "spinReverse 24s linear infinite",
            transform: "scale(0.78)",
          }}
        >
          <circle
            cx="100"
            cy="100"
            r="95"
            fill="none"
            stroke={gold(0.20)}
            strokeWidth="0.25"
            strokeDasharray="1 4"
          />
          <path
            d="M 195 100 A 95 95 0 0 1 100 195"
            fill="none"
            stroke={gold(0.45)}
            strokeWidth="0.4"
          />
        </svg>
      </div>

      {/* ───── TARGET :: YKM-01 identification card (top-right) ───── */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute top-20 right-6 lg:right-10"
        style={{ width: "248px" }}
      >
        <div
          className="rounded-lg backdrop-blur-md border overflow-hidden"
          style={{
            background: "rgba(20, 14, 4, 0.55)",
            borderColor: gold(0.45),
            boxShadow:
              `0 0 30px ${gold(0.15)}, inset 0 0 20px ${gold(0.06)}`,
          }}
        >
          {/* Header bar */}
          <div
            className="flex items-center justify-between px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.25em]"
            style={{
              background: gold(0.18),
              color: gold(0.95),
              borderBottom: `1px solid ${gold(0.35)}`,
            }}
          >
            <span>TARGET :: YKM-01</span>
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: SCAN_GREEN,
                boxShadow: `0 0 8px ${SCAN_GREEN}`,
                animation: PULSE_SOFT,
              }}
            />
          </div>

          {/* Body — photo + telemetry */}
          <div className="flex gap-3 p-3">
            <div
              className="relative shrink-0"
              style={{
                width: "60px",
                height: "75px",
                borderRadius: "4px",
                overflow: "hidden",
                border: `1px solid ${gold(0.5)}`,
              }}
            >
              <img
                src={profileImg}
                alt=""
                className="w-full h-full object-cover"
                style={{ filter: "saturate(1.2) contrast(1.05)" }}
                draggable="false"
              />
              {/* scanline on thumbnail */}
              <div
                className="absolute inset-x-0 h-px"
                style={{
                  top: "50%",
                  background: gold(0.9),
                  boxShadow: `0 0 6px ${gold(0.8)}`,
                  animation: "photoScan 2.6s linear infinite",
                }}
              />
            </div>

            <div className="flex-1 text-[10px] font-mono leading-relaxed">
              <div className="flex justify-between">
                <span style={MONO_LABEL_STYLE}>ID</span>
                <span style={MONO_VALUE_STYLE}>
                  YKM-01
                </span>
              </div>
              <div className="flex justify-between">
                <span style={MONO_LABEL_STYLE}>ROLE</span>
                <span style={MONO_VALUE_STYLE}>SEC.OPS</span>
              </div>
              <div className="flex justify-between">
                <span style={MONO_LABEL_STYLE}>LOC</span>
                <span style={MONO_VALUE_STYLE}>PUN-IND</span>
              </div>
              <div className="flex justify-between">
                <span style={MONO_LABEL_STYLE}>PWR</span>
                <span style={MONO_VALUE_STYLE}>
                  <TickingNumber digits={3} speed={140} />
                </span>
              </div>
              <div className="flex justify-between">
                <span style={MONO_LABEL_STYLE}>FREQ</span>
                <span style={MONO_VALUE_STYLE}>
                  <TickingNumber digits={4} speed={80} />
                </span>
              </div>
              <div className="flex justify-between">
                <span style={MONO_LABEL_STYLE}>SIG</span>
                <span style={{ color: SCAN_GREEN }}>LOCKED</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ───── Bottom HUD strip ───── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.7 }}
        className="absolute bottom-6 left-6 right-6 flex items-center justify-between gap-6 font-mono text-[10px] uppercase tracking-[0.25em]"
        style={{ color: gold(0.85) }}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: gold(1),
              boxShadow: `0 0 8px ${gold(0.9)}`,
              animation: "pulse-soft 1.2s ease-in-out infinite",
            }}
          />
          <span>SYS :: ONLINE</span>
          <span style={{ color: gold(0.45) }}>|</span>
          <span>SEQ :: {step}</span>
          <span style={{ color: gold(0.45) }}>|</span>
          <span>
            PROG ::{" "}
            <span style={{ color: cream(1) }}>{pct}%</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span>BUFFER :: <TickingNumber digits={5} speed={110} /></span>
          <span style={{ color: gold(0.45) }}>|</span>
          <span>
            LAT ::{" "}
            <span style={{ color: SCAN_GREEN }}>
              <TickingNumber digits={2} speed={200} />
              MS
            </span>
          </span>
        </div>
      </motion.div>

      {/* ───── Left side — vertical telemetry strip ───── */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.6, duration: 0.7 }}
        className="absolute top-1/2 -translate-y-1/2 left-6 font-mono text-[9px] uppercase tracking-[0.4em]"
        style={{
          writingMode: "vertical-rl",
          color: gold(0.55),
        }}
      >
        STARK INDUSTRIES // CYBER OPS // ENGAGE
      </motion.div>
    </div>
  );
};

export default IronManHUD;

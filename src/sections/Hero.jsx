import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ChevronRight, Shield, Cpu, Zap } from "lucide-react";
import PropTypes from "prop-types";
import { personalInfo } from "../data/portfolioData";
import profileImg from "../assets/me.png";

/* Live clock — shows visitor's local time */
const LiveClock = () => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono text-[11px] tabular-nums" style={{ color: "var(--text-m)" }}>
      {time}
    </span>
  );
};

const TypeWriter = ({ words }) => {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[idx];
    const speed = deleting ? 28 : 60;
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(word.slice(0, text.length + 1));
        if (text.length === word.length) setTimeout(() => setDeleting(true), 2400);
      } else {
        setText(word.slice(0, text.length - 1));
        if (text.length === 0) {
          setDeleting(false);
          setIdx((p) => (p + 1) % words.length);
        }
      }
    }, speed);
    return () => clearTimeout(timeout);
  }, [text, deleting, idx, words]);

  return (
    <span className="relative">
      {text}
      <span
        className="inline-block w-[3px] h-[0.85em] ml-1 align-middle"
        style={{
          background: "var(--accent)",
          animation: "pulse-soft 1s ease-in-out infinite",
          boxShadow: "0 0 12px rgba(232,168,56,0.7)",
        }}
      />
    </span>
  );
};
TypeWriter.propTypes = { words: PropTypes.arrayOf(PropTypes.string).isRequired };

/* Cinema title — letter-by-letter reveal.
   Static string → character position is the stable identity. */
const CinemaTitle = ({ text }) => {
  /* eslint-disable react/no-array-index-key */
  return (
    <span className="cinema-title-wrap">
      {Array.from(text).map((ch, i) => (
        <motion.span
          key={`${i}-${ch}`}
          initial={{ opacity: 0, y: 60, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: 0.4 + i * 0.045,
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            display: "inline-block",
            whiteSpace: "pre",
            willChange: "transform, opacity",
          }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
  /* eslint-enable react/no-array-index-key */
};
CinemaTitle.propTypes = { text: PropTypes.string.isRequired };

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      className="section-page relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ padding: 0, background: "transparent" }}
    >
      <motion.div style={{ y, opacity }} className="h-full">
        <div className="container-wide relative z-10 py-20 lg:py-0">
          <div className="flex flex-col items-center lg:items-start gap-10 lg:gap-0">
            {/* Left content column — limited width to leave space for FloatingPortrait */}
            <div className="flex-1 w-full lg:max-w-[58%] text-center lg:text-left pt-6 lg:pt-0">
              {/* Status Indicator */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center gap-6 px-4 py-2 rounded-full border border-[var(--border)] backdrop-blur-md mb-10"
                style={{ background: "var(--glass)" }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500 rounded-full blur-sm opacity-50 animate-pulse" />
                    <div className="relative w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-[var(--accent)]">
                    System Neutral · Live
                  </span>
                </div>
                <div className="w-px h-3 bg-[var(--border-h)]" />
                <LiveClock />
              </motion.div>

              {/* Cinema-style subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-mono text-[11px] md:text-xs uppercase tracking-[0.5em] mb-6"
                style={{ color: "var(--accent)" }}
              >
                <span style={{ opacity: 0.6 }}>—</span>{" "}
                Cybersecurity Engineer · Penetration Tester
              </motion.div>

              {/* HUGE Cinema title — letter-by-letter reveal */}
              <h1 className="cinema-heading mb-4">
                <CinemaTitle text="YOKESH" />
                <br />
                <span className="cinema-heading-accent">
                  <CinemaTitle text="KUMAR M." />
                </span>
              </h1>

              {/* Underline bar */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 1.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="origin-left mb-8"
                style={{
                  width: "140px",
                  height: "3px",
                  background:
                    "linear-gradient(90deg, var(--accent), transparent)",
                  boxShadow: "0 0 18px rgba(232,168,56,0.55)",
                }}
              />

              {/* Role typewriter */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.8 }}
                className="text-2xl md:text-3xl lg:text-4xl font-serif italic text-[var(--text-m)] min-h-[1.5em] mb-8"
              >
                &gt; <TypeWriter words={personalInfo.roles} />
              </motion.div>

              {/* Bio */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.9, duration: 0.8 }}
                className="text-base md:text-lg lg:text-xl leading-relaxed text-[var(--text-s)] mb-10 max-w-xl mx-auto lg:mx-0 font-light"
              >
                {personalInfo.bio}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.1, duration: 0.8 }}
                className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8"
              >
                <a href="#contact" className="btn-main !py-4 !px-8 text-sm group">
                  Initiate Connection
                  <ChevronRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </a>
                <a href="#projects" className="btn-outline !py-4 !px-8 text-sm group">
                  Review Portfolio
                  <Zap
                    size={16}
                    className="ml-2 group-hover:scale-110 transition-transform text-[var(--accent)]"
                  />
                </a>
              </motion.div>

              {/* Credential pills (replaces floating photo badges) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.35, duration: 0.8 }}
                className="flex flex-wrap gap-3 justify-center lg:justify-start"
              >
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] backdrop-blur-md"
                  style={{ background: "var(--glass)" }}>
                  <Shield size={13} className="text-[var(--accent)]" />
                  <div className="text-left">
                    <p className="text-[8px] font-mono uppercase tracking-widest leading-none" style={{ color: "var(--text-m)" }}>
                      Clearance
                    </p>
                    <p className="text-[11px] font-bold leading-tight mt-0.5" style={{ color: "var(--accent)" }}>
                      B.Tech CSE @ LPU
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] backdrop-blur-md"
                  style={{ background: "var(--glass)" }}>
                  <Cpu size={13} className="text-[var(--text-s)]" />
                  <div className="text-left">
                    <p className="text-[8px] font-mono uppercase tracking-widest leading-none" style={{ color: "var(--text-m)" }}>
                      Active Core
                    </p>
                    <p className="text-[11px] font-bold leading-tight mt-0.5" style={{ color: "var(--text)" }}>
                      Sec-Ops Engineer
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Mobile-only inline photo (FloatingPortrait is hidden below md) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="lg:hidden relative mt-6"
              style={{ width: "260px", aspectRatio: "3 / 4" }}
            >
              {/* halo */}
              <div
                className="absolute pointer-events-none"
                style={{
                  inset: "-20%",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(232,168,56,0.35) 0%, transparent 65%)",
                  filter: "blur(30px)",
                }}
              />
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl border border-[var(--accent)]/40">
                <img
                  src={profileImg}
                  alt={personalInfo.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-[var(--accent)] to-transparent opacity-50" />
          <span
            className="text-[10px] font-mono tracking-[0.5em] uppercase"
            style={{
              color: "var(--accent)",
              animation: "pulse-soft 2s ease-in-out infinite",
            }}
          >
            Scroll · Begin Sequence
          </span>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ArrowDown size={18} className="text-[var(--accent)] opacity-70" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

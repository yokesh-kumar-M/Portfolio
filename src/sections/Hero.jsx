import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ChevronRight, Shield, Cpu, Zap } from "lucide-react";
import Atropos from "atropos/react";
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
        if (text.length === word.length)
          setTimeout(() => setDeleting(true), 2400);
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
        className="inline-block w-[2px] h-[0.85em] ml-1 align-middle"
        style={{
          background: "var(--accent)",
          animation: "pulse-soft 1s ease-in-out infinite",
        }}
      />
    </span>
  );
};

TypeWriter.propTypes = {
  words: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <section
      ref={ref}
      id="hero"
      className="section-page relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ padding: 0, background: "transparent" }}
    >
      <motion.div style={{ y, opacity, scale }} className="h-full">
        <div className="container-wide relative z-10 py-20 lg:py-0">
          <div className="flex flex-col items-center lg:items-start lg:flex-row lg:justify-between gap-16 lg:gap-24">

            {/* Left Content */}
            <div className="flex-1 max-w-2xl text-center lg:text-left pt-10 lg:pt-0">
              {/* Status Indicator */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center gap-6 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--bg-alt)]/50 backdrop-blur-md mb-12"
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500 rounded-full blur-sm opacity-50 animate-pulse" />
                    <div className="relative w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-[var(--accent)]">
                    System Neutral
                  </span>
                </div>
                <div className="w-px h-3 bg-[var(--border-h)]" />
                <LiveClock />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 1 }}
                className="heading-hero mb-8"
              >
                <span className="block text-2xl md:text-3xl font-mono text-[var(--text-s)] mb-2 tracking-tight">
                  Security Specialist & Engineer.
                </span>
                <span className="text-[var(--text)]">Hello, I&apos;m </span>
                <span className="relative inline-block text-[var(--accent)] group">
                  Yokesh Kumar M
                  {/* Subtle Underline Animation */}
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="absolute bottom-4 left-0 h-1 bg-[var(--accent)]/30 rounded-full"
                  />
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-2xl md:text-4xl font-serif font-bold text-[var(--text-m)] min-h-[1.5em] mb-12"
              >
                <TypeWriter words={personalInfo.roles} />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-lg md:text-xl leading-relaxed text-[var(--text-s)] mb-12 max-w-xl mx-auto lg:mx-0 font-light"
              >
                {personalInfo.bio}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-wrap gap-5 justify-center lg:justify-start"
              >
                <a href="#contact" className="btn-main !py-4 !px-8 text-sm group">
                  Initiate Connection
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="#projects" className="btn-outline !py-4 !px-8 text-sm group">
                  Review Portfolio
                  <Zap size={16} className="ml-2 group-hover:scale-110 transition-transform text-[var(--accent)]" />
                </a>
              </motion.div>
            </div>

            {/* Right Side: Visual Portait */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 1.2 }}
              className="relative lg:mt-0"
            >
              <Atropos
                className="atropos-hero"
                highlight
                shadow
                rotateTouch
              >
                <div className="relative group p-2 rounded-[3rem] border border-white/5 bg-[var(--bg-card)]/30 backdrop-blur-sm">
                  {/* Portrait Background Detail */}
                  <div className="absolute inset-4 rounded-[2.5rem] bg-[var(--accent)] opacity-5 blur-2xl group-hover:opacity-10 transition-opacity" />

                  <img
                    src={profileImg}
                    alt={personalInfo.name}
                    className="relative w-[280px] h-[340px] md:w-[380px] md:h-[460px] object-cover rounded-[2.5rem] img-fade-bottom shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
                    data-atropos-offset="-1"
                  />

                  {/* Floating Badges */}
                  <div className="absolute -bottom-6 -right-6 md:-right-10 flex flex-col gap-3" data-atropos-offset="5">
                    <div className="bg-[var(--bg)] border border-[var(--border)] p-4 rounded-2xl shadow-lg backdrop-blur-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[var(--accent-light)] flex items-center justify-center">
                          <Shield size={16} className="text-[var(--accent)]" />
                        </div>
                        <div>
                          <p className="text-[9px] font-mono text-[var(--text-m)] uppercase tracking-widest leading-none mb-1">Clearance</p>
                          <p className="text-xs font-bold text-[var(--accent)]">B.Tech CSE @ LPU</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[var(--bg)] border border-[var(--border)] p-4 rounded-2xl shadow-lg backdrop-blur-xl translate-x-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[var(--bg-alt)] flex items-center justify-center">
                          <Cpu size={16} className="text-[var(--text-m)]" />
                        </div>
                        <div>
                          <p className="text-[9px] font-mono text-[var(--text-m)] uppercase tracking-widest leading-none mb-1">Active Core</p>
                          <p className="text-xs font-bold text-[var(--text)]">Sec-Ops Engineer</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Atropos>
            </motion.div>
          </div>
        </div>

        {/* Scroll Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <div className="w-[1px] h-20 bg-gradient-to-b from-[var(--accent)] to-transparent opacity-20" />
          <span className="text-[9px] font-mono tracking-[0.5em] uppercase text-[var(--accent)] animate-pulse">
            Terminal Scroll
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown size={18} className="text-[var(--accent)] opacity-50" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

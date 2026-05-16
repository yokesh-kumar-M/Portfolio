import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { about } from "../data/portfolioData";

const Counter = ({ value, suffix = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  const num = parseFloat(value) || 0;

  useEffect(() => {
    if (!inView) return;
    let cur = 0;
    const step = num / 35;
    const t = setInterval(() => {
      cur += step;
      if (cur >= num) { setCount(num); clearInterval(t); }
      else setCount(cur);
    }, 30);
    return () => clearInterval(t);
  }, [inView, num]);

  const display = String(value).includes(".")
    ? count.toFixed(2)
    : Math.round(count);
  return <span ref={ref}>{display}{suffix}</span>;
};

Counter.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  suffix: PropTypes.string,
};

const fade = (d = 0) => ({
  initial: { opacity: 0, y: 35 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, delay: d, ease: [0.16, 1, 0.3, 1] },
});

const About = () => {
  return (
    <section id="about" className="section-page relative overflow-hidden" style={{ background: "transparent" }}>
      {/* Subtle backdrop blur to keep text readable against stars */}
      <div className="absolute inset-0 z-0 backdrop-blur-[2px] opacity-20 pointer-events-none" />

      <div className="container-wide">
        {/* ─── Header ─── */}
        <motion.div {...fade()} className="mb-6">
          <span className="label-overline">About</span>
        </motion.div>
        <motion.h2
          {...fade(0.05)}
          className="heading-section mb-16"
          style={{ color: "var(--text)" }}
        >
          The person behind
          <br />
          the <span style={{ color: "var(--accent)" }}>security.</span>
        </motion.h2>

        {/* ─── Bio ─── */}
        <motion.p
          {...fade(0.1)}
          className="text-xl md:text-2xl leading-[1.9] mb-14 md:mb-16 max-w-3xl"
          style={{ color: "var(--text-s)" }}
        >
          {about.summary}
        </motion.p>

        {/* ─── Stats ─── */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-10 pb-20"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          {about.highlights.map((stat, i) => (
            <motion.div key={stat.label} {...fade(0.15 + i * 0.07)}>
              <div
                className="text-3xl md:text-5xl font-serif font-bold mb-2 md:mb-3"
                style={{ color: "var(--accent)" }}
              >
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm font-bold mb-1" style={{ color: "var(--text)" }}>
                {stat.label}
              </div>
              <div className="text-xs" style={{ color: "var(--text-m)" }}>
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;

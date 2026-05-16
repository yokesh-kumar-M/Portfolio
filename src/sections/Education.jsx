import { motion } from "framer-motion";
import { about, achievements } from "../data/portfolioData";
import { Calendar, MapPin } from "lucide-react";

const fade = (d = 0) => ({
  initial: { opacity: 0, y: 35 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, delay: d, ease: [0.16, 1, 0.3, 1] },
});

const Education = () => {
  return (
    <section id="education" className="section-page relative overflow-hidden" style={{ background: "transparent" }}>
      <div className="absolute inset-0 z-0 backdrop-blur-[1px] opacity-10 pointer-events-none" />

      <div className="container-wide">
        {/* ─── Header ─── */}
        <motion.div {...fade()} className="mb-6">
          <span className="label-overline">Background</span>
        </motion.div>
        <motion.h2
          {...fade(0.05)}
          className="heading-section mb-16"
          style={{ color: "var(--text)" }}
        >
          Education & <span style={{ color: "var(--accent)" }}>milestones.</span>
        </motion.h2>

        {/* ─── Education entries — pure text, numbered ─── */}
        <div className="mb-20">
          {about.education.map((edu, i) => (
            <motion.div
              key={edu.degree}
              {...fade(0.1 + i * 0.1)}
              className="grid grid-cols-1 lg:grid-cols-[140px_1fr] gap-6 lg:gap-10 pb-12 mb-12"
              style={{
                borderBottom:
                  i < about.education.length - 1
                    ? "1px solid var(--border)"
                    : "none",
              }}
            >
              {/* Left — period */}
              <div>
                <span
                  className="text-xs font-mono font-bold flex items-center gap-2"
                  style={{ color: "var(--accent)" }}
                >
                  <Calendar size={12} />
                  {edu.period}
                </span>
              </div>

              {/* Right — content */}
              <div>
                <div
                  className="inline-block text-xs font-mono font-bold px-3 py-1 rounded-full mb-6"
                  style={{
                    background: "var(--accent-light)",
                    color: "var(--accent)",
                  }}
                >
                  {edu.score}
                </div>

                <h3
                  className="text-2xl md:text-3xl font-serif font-bold mb-4"
                  style={{ color: "var(--text)" }}
                >
                  {edu.degree}
                </h3>

                <p
                  className="text-base mb-3"
                  style={{ color: "var(--text-s)" }}
                >
                  {edu.institution}
                </p>

                <span
                  className="flex items-center gap-1.5 text-sm"
                  style={{ color: "var(--text-m)" }}
                >
                  <MapPin size={13} />
                  {edu.location}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ─── Achievements — large typography, no cards ─── */}
        <motion.div {...fade(0.1)} className="mb-6">
          <span className="label-overline">Achievements</span>
        </motion.div>
        <motion.h3
          {...fade(0.12)}
          className="heading-sub mb-12"
          style={{ color: "var(--text)" }}
        >
          Milestones worth mentioning.
        </motion.h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          {achievements.map((ach, i) => (
            <motion.div key={ach.title} {...fade(0.15 + i * 0.1)}>
              {/* Giant stat */}
              <div
                className="text-3xl md:text-6xl font-serif font-bold mb-3 md:mb-4 leading-none"
                style={{ color: "var(--accent)" }}
              >
                {ach.stat}
              </div>

              <h4
                className="text-lg font-bold mb-3"
                style={{ color: "var(--text)" }}
              >
                {ach.title}
              </h4>

              <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: "var(--text-s)" }}
              >
                {ach.description}
              </p>

              <span
                className="text-[11px] font-mono font-bold"
                style={{ color: "var(--text-m)" }}
              >
                {ach.date}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;

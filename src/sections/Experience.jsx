import { motion } from "framer-motion";
import { experience, getIconByTech } from "../data/portfolioData";
import { Calendar, ArrowRight, Briefcase } from "lucide-react";

const fade = (d = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, delay: d, ease: [0.16, 1, 0.3, 1] },
});

const Experience = () => {
  return (
    <section id="experience" className="section-page relative overflow-hidden" style={{ background: "transparent" }}>
      <div className="absolute inset-0 z-0 backdrop-blur-[1px] opacity-10 pointer-events-none" />

      <div className="container-wide">
        <motion.div {...fade()} className="mb-6">
          <span className="label-overline">Experience</span>
        </motion.div>
        <motion.h2
          {...fade(0.05)}
          className="heading-section mb-14"
          style={{ color: "var(--text)" }}
        >
          The <span style={{ color: "var(--accent)" }}>journey.</span>
        </motion.h2>

        {/* Experience blocks — full width, numbered, stacked */}
        <div className="space-y-0">
          {experience.map((exp, i) => (
            <motion.div
              key={`${exp.title}-${exp.org}`}
              {...fade(i * 0.1)}
              className="group"
            >
              {/* Main row */}
              <div
                className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 lg:gap-12 py-10 md:py-14 transition-all duration-500"
                style={{
                  borderBottom:
                    i < experience.length - 1
                      ? "1px solid var(--border)"
                      : "none",
                }}
              >
                {/* Left — Meta column */}
                <div className="flex flex-col gap-4">
                  {/* Big number */}
                  <span
                    className="text-4xl md:text-6xl font-serif font-bold leading-none transition-colors duration-500"
                    style={{ color: "var(--border-h)" }}
                  >
                    0{i + 1}
                  </span>

                  {/* Period */}
                  <div className="flex items-center gap-2">
                    <Calendar size={13} style={{ color: "var(--accent)" }} />
                    <span
                      className="text-xs font-mono font-bold"
                      style={{ color: "var(--accent)" }}
                    >
                      {exp.period}
                    </span>
                  </div>

                  {/* Type tag */}
                  <span
                    className="inline-flex items-center gap-1.5 w-fit text-[10px] font-mono font-bold px-3 py-1.5 rounded-full"
                    style={{
                      background: "var(--accent-light)",
                      color: "var(--accent)",
                    }}
                  >
                    <Briefcase size={11} />
                    {exp.type}
                  </span>
                </div>

                {/* Right — Content */}
                <div>
                  <h3
                    className="text-2xl md:text-3xl font-serif font-bold mb-3 transition-colors duration-400"
                    style={{ color: "var(--text)" }}
                  >
                    {exp.title}
                  </h3>
                  <p
                    className="text-base mb-8"
                    style={{ color: "var(--text-s)" }}
                  >
                    {exp.org}
                  </p>

                  {/* Points */}
                  <ul className="space-y-4 mb-10">
                    {exp.points.map((point, j) => (
                      <motion.li
                        key={point}
                        initial={{ opacity: 0, x: -15 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.5,
                          delay: 0.2 + j * 0.08,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="flex gap-4 group/point"
                      >
                        <ArrowRight
                          size={16}
                          className="mt-[3px] shrink-0 transition-all duration-300 group-hover/point:translate-x-1"
                          style={{ color: "var(--accent)" }}
                        />
                        <span
                          className="text-[15px] leading-[1.85]"
                          style={{ color: "var(--text-s)" }}
                        >
                          {point}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2.5">
                    {exp.tech.map((t) => {
                      const iconUrl = getIconByTech(t);
                      return (
                        <span key={t} className="pill flex items-center gap-2">
                          {iconUrl && <img src={iconUrl} alt={t} className="w-3.5 h-3.5 object-contain" />}
                          {t}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;

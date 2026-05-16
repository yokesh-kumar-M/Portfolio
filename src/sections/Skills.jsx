import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import PropTypes from "prop-types";
import { skills } from "../data/portfolioData";

const fade = (d = 0) => ({
  initial: { opacity: 0, y: 35 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, delay: d, ease: [0.16, 1, 0.3, 1] },
});

/* Animated horizontal bar */
const SkillBar = ({ level }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div
      ref={ref}
      className="w-full h-1.5 rounded-full overflow-hidden"
      style={{ background: "var(--border)" }}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ background: "var(--accent)" }}
        initial={{ width: 0 }}
        animate={inView ? { width: `${level}%` } : { width: 0 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
};

SkillBar.propTypes = {
  level: PropTypes.number.isRequired,
};

/* Single skill item — wide row layout */
const SkillRow = ({ skill, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group flex items-center gap-5 py-4 transition-all duration-400 hover:translate-x-2"
    >
      {/* Icon */}
      <div
        className="rounded-lg flex items-center justify-center shrink-0 transition-all duration-400 group-hover:scale-110 group-hover:rotate-[-4deg]"
        style={{
          width: "36px", height: "36px",
          background: "var(--accent-light)",
          border: "1px solid var(--border)",
        }}
      >
        {skill.icon ? (
          <img
            src={skill.icon}
            alt={skill.name}
            className="object-contain"
            style={{ width: "16px", height: "16px" }}
            onError={(e) => {
              e.target.style.display = "none";
              if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <span
          className="text-[10px] font-bold items-center justify-center"
          style={{
            color: "var(--accent)",
            display: skill.icon ? "none" : "flex",
          }}
        >
          {skill.name.slice(0, 3).toUpperCase()}
        </span>
      </div>

      {/* Name + Bar + Percentage */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-sm font-semibold transition-colors duration-300 group-hover:text-[var(--accent)]"
            style={{ color: "var(--text)" }}
          >
            {skill.name}
          </span>
          <span className="text-xs font-mono" style={{ color: "var(--text-m)" }}>
            {skill.level}%
          </span>
        </div>
        <SkillBar level={skill.level} />
      </div>
    </motion.div>
  );
};

SkillRow.propTypes = {
  skill: PropTypes.shape({
    name: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired,
    icon: PropTypes.string,
  }).isRequired,
  delay: PropTypes.number,
};

const Skills = () => {
  return (
    <section id="skills" className="section-page relative overflow-hidden" style={{ background: "transparent" }}>
      <div className="absolute inset-0 z-0 backdrop-blur-[1px] opacity-10 pointer-events-none" />

      <div className="container-wide">
        {/* Header */}
        <motion.div {...fade()} className="mb-6">
          <span className="label-overline">Skills & Toolkit</span>
        </motion.div>
        <motion.h2
          {...fade(0.05)}
          className="heading-section mb-8"
          style={{ color: "var(--text)" }}
        >
          Tools I <span style={{ color: "var(--accent)" }}>work with.</span>
        </motion.h2>
        <motion.p
          {...fade(0.1)}
          className="text-lg mb-14 max-w-2xl"
          style={{ color: "var(--text-m)" }}
        >
          From offensive security arsenals to cloud platforms and development
          frameworks — here is everything in my toolkit.
        </motion.p>

        {/* All categories displayed — responsive multi-column */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-14">
          {skills.map((cat, catIdx) => (
            <motion.div key={cat.category} {...fade(0.1 + catIdx * 0.08)}>
              {/* Category heading */}
              <div className="flex items-center gap-3 mb-8 pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: "var(--accent)" }}
                />
                <h3
                  className="text-lg font-bold tracking-tight"
                  style={{ color: "var(--text)" }}
                >
                  {cat.category}
                </h3>
                <span className="text-xs font-mono ml-auto" style={{ color: "var(--text-m)" }}>
                  {cat.items.length} tools
                </span>
              </div>

              {/* Skill rows */}
              <div>
                {cat.items.map((skill, i) => (
                  <SkillRow
                    key={skill.name}
                    skill={skill}
                    delay={i * 0.05}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;

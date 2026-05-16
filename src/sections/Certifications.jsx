import { motion } from "framer-motion";
import { useState } from "react";
import PropTypes from "prop-types";
import Atropos from "atropos/react";
import { CheckCircle, Calendar, ShieldCheck, Award } from "lucide-react";
import { certifications } from "../data/portfolioData";

const fade = (d = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, delay: d, ease: [0.16, 1, 0.3, 1] },
});

const CertEntry = ({ cert, index, isSmall = false }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      {...fade(0.1 + index * 0.1)}
      className="group relative"
    >
      <Atropos
        className="atropos-card"
        highlight
        rotateTouch
        shadow={false}
      >
        <div
          className="relative p-8 md:p-10 rounded-2xl overflow-hidden glass transition-all duration-700 hover:shadow-glow border border-white/5"
          style={{ background: "var(--bg-card)" }}
        >
          {/* Subtle Glow Backdrop */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[80px] opacity-10" style={{ background: "var(--accent)" }} />

          <div className={`grid grid-cols-1 ${isSmall ? "" : "lg:grid-cols-[140px_1fr]"} gap-8`}>
            {/* Logo */}
            <div className="flex justify-center lg:justify-start" data-atropos-offset="5">
              <div
                className="w-32 h-32 rounded-xl flex items-center justify-center bg-white p-3 shadow-2xl relative group-hover:scale-105 transition-transform duration-500"
                style={{ border: "1px solid var(--accent-light)" }}
              >
                {!imgError ? (
                  <img src={cert.badge} alt={cert.org} className="w-full h-full object-contain" onError={() => setImgError(true)} />
                ) : (
                  <ShieldCheck size={48} className="text-gray-300" />
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center lg:text-left" data-atropos-offset="2">
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                <span className="text-[10px] font-mono font-bold tracking-[0.2em] px-3 py-1 rounded bg-[var(--accent-light)] text-[var(--accent)] uppercase">
                  {cert.org}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-m)]">
                  <Calendar size={12} />
                  {cert.year}
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-[var(--text)] leading-tight">
                {cert.name}
              </h3>

              <p className="text-sm md:text-[15px] leading-relaxed mb-6 text-[var(--text-s)] max-w-2xl">
                {cert.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {cert.topics.slice(0, 6).map((topic) => (
                  <div key={topic} className="flex items-center gap-3">
                    <CheckCircle size={14} className="text-[var(--accent)] shrink-0" />
                    <span className="text-sm text-[var(--text-s)]">{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Atropos>
    </motion.div>
  );
};

CertEntry.propTypes = {
  cert: PropTypes.shape({
    name: PropTypes.string.isRequired,
    org: PropTypes.string.isRequired,
    badge: PropTypes.string,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string,
    topics: PropTypes.arrayOf(PropTypes.string),
    featured: PropTypes.bool,
  }).isRequired,
  index: PropTypes.number.isRequired,
  isSmall: PropTypes.bool,
};

const Certifications = () => {
  const featured = certifications.filter(c => c.featured);
  const others = certifications.filter(c => !c.featured);

  return (
    <section id="certifications" className="section-page relative py-20 lg:py-32" style={{ background: "transparent" }}>
      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <motion.div {...fade()} className="mb-6">
              <span className="label-overline">Credentials</span>
            </motion.div>
            <motion.h2 {...fade(0.05)} className="heading-section text-[var(--text)]">
              Verified <span className="text-[var(--accent)]">Cybersecurity Excellence.</span>
            </motion.h2>
          </div>
          <motion.div {...fade(0.25)} className="hidden md:block">
            <Award size={48} className="opacity-10 text-[var(--accent)]" />
          </motion.div>
        </div>

        <div className="space-y-16">
          {featured.map((cert, i) => (
            <CertEntry key={cert.name} cert={cert} index={i} />
          ))}

          {others.length > 0 && (
            <div className="pt-20">
              <h4 className="label-overline mb-12 opacity-50">Additional Accreditations</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {others.map((cert, i) => (
                  <CertEntry key={cert.name} cert={cert} index={featured.length + i} isSmall />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Certifications;

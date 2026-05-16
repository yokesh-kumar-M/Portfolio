import { motion } from "framer-motion";
import PropTypes from "prop-types";

/*
 * Infinite scrolling marquee — CSS-driven for performance.
 */

const Marquee = ({ words, reverse = false, speed = 30 }) => {
  // duplicate for seamless loop — tag each copy to avoid key collisions
  const items = [
    ...words.map((w) => ({ word: w, copy: "a" })),
    ...words.map((w) => ({ word: w, copy: "b" })),
  ];

  return (
    <div
      className="overflow-hidden py-8 select-none relative"
      style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
    >
      <motion.div
        className="marquee-track"
        animate={{ x: reverse ? [0, "-50%"] : ["-50%", 0] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {items.map(({ word, copy }) => (
          <span key={`${copy}-${word}`} className="flex items-center gap-8 shrink-0">
            <span
              className="text-2xl md:text-3xl font-serif font-bold tracking-tight"
              style={{ color: "var(--text-m)", opacity: 0.4 }}
            >
              {word}
            </span>
            <span
              className="text-lg"
              style={{ color: "var(--accent)", opacity: 0.3 }}
            >
              ✦
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

Marquee.propTypes = {
  words: PropTypes.arrayOf(PropTypes.string).isRequired,
  reverse: PropTypes.bool,
  speed: PropTypes.number,
};

export default Marquee;

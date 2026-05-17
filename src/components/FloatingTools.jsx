import { useMemo } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import PropTypes from "prop-types";

const TOOL_ICONS = [
  "/symbols/burpsuite.png",
  "/symbols/metasploit.png",
  "/symbols/nmap.png",
  "/symbols/wireshark.png",
  "/symbols/nessus.png",
  "/symbols/splunk.png",
  "/symbols/python.png",
  "/symbols/javascript.png",
  "/symbols/docker.png",
  "/symbols/linux.png",
  "/symbols/owasp.png",
  "/symbols/mitre_attck.png",
];

const SCROLL_KEYS = [0, 0.10, 0.22, 0.32, 0.43, 0.55, 0.67, 0.78, 0.88, 1];

// ─── Formations — return {x, y, scale, opacity} for tool[idx] at this section ───

const orbit = (idx, total, cx, cy, rx, ry, phase = 0) => {
  const a = (idx / total) * Math.PI * 2 + phase;
  return {
    x: cx + Math.cos(a) * rx,
    y: cy + Math.sin(a) * ry,
    scale: 1,
    opacity: 0.95,
  };
};

const grid = (idx, cols, ox, oy, gx, gy, scale = 0.7, opacity = 0.85) => {
  const col = idx % cols;
  const row = Math.floor(idx / cols);
  return {
    x: ox + col * gx,
    y: oy + row * gy,
    scale,
    opacity,
  };
};

const timeline = (idx, total, x, y0, y1, scale = 0.55, opacity = 0.85) => ({
  x,
  y: y0 + (idx / Math.max(total - 1, 1)) * (y1 - y0),
  scale,
  opacity,
});

const fan = (idx, total, cx, cy, r, angle0, angle1, scale = 0.7) => {
  const a = angle0 + (idx / Math.max(total - 1, 1)) * (angle1 - angle0);
  return {
    x: cx + Math.cos(a) * r,
    y: cy + Math.sin(a) * r,
    scale,
    opacity: 0.9,
  };
};

const clusters = (idx) => {
  const group = idx % 4;
  const sub = Math.floor(idx / 4);
  const gx = group % 2 === 0 ? -25 : 25;
  const gy = group < 2 ? -10 : 10;
  return {
    x: gx + (sub - 1) * 3,
    y: gy + (sub - 1) * 3,
    scale: 0.7,
    opacity: 0.9,
  };
};

const scatter = (idx, total, rOuter) => {
  const a = (idx / total) * Math.PI * 2;
  return {
    x: Math.cos(a) * rOuter,
    y: Math.sin(a) * rOuter * 0.7,
    scale: 0.4,
    opacity: 0.25,
  };
};

function buildPath(idx, total) {
  return [
    orbit(idx, total, 22, 0, 18, 18, 0),                          // Hero — orbit right around photo
    grid(idx, 3, -38, -12, 6, 7, 0.65, 0.85),                     // About — 3-col grid left
    timeline(idx, total, -38, -25, 25, 0.55, 0.85),               // Education — vertical timeline left
    fan(idx, total, 30, 0, 16, -Math.PI / 3, Math.PI / 3, 0.65),  // Services — fan from right
    clusters(idx),                                                 // Cert — 4 clusters
    grid(idx, 4, 12, -12, 6, 8, 0.7, 0.95),                       // Skills — 4×3 grid right
    timeline(idx, total, 35, -25, 25, 0.55, 0.85),                // Experience — vertical timeline right
    orbit(idx, total, 0, 0, 30, 22, idx * 0.3),                   // Projects — carousel orbit centre
    scatter(idx, total, 42),                                       // Contact — scatter outward
    scatter(idx, total, 55),                                       // End — keep scattering
  ];
}

const FloatingTool = ({ src, idx, total, smooth }) => {
  const path = useMemo(() => buildPath(idx, total), [idx, total]);
  const x = useTransform(smooth, SCROLL_KEYS, path.map((p) => `${p.x}vw`));
  const y = useTransform(smooth, SCROLL_KEYS, path.map((p) => `${p.y}vh`));
  const scale = useTransform(smooth, SCROLL_KEYS, path.map((p) => p.scale));
  const opacity = useTransform(smooth, SCROLL_KEYS, path.map((p) => p.opacity));

  return (
    <motion.div
      className="fixed top-1/2 left-1/2 z-[4] pointer-events-none"
      style={{
        x,
        y,
        scale,
        opacity,
        willChange: "transform, opacity",
        marginLeft: "-30px",
        marginTop: "-30px",
      }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 3 + (idx % 5) * 0.4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: idx * 0.13,
        }}
        className="relative"
        style={{ width: "60px", height: "60px" }}
      >
        {/* Glow halo behind icon */}
        <div
          className="absolute -inset-2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(232,168,56,0.35), transparent 65%)",
            filter: "blur(8px)",
          }}
        />
        <img
          src={src}
          alt=""
          className="relative w-full h-full object-contain"
          style={{
            filter:
              "drop-shadow(0 0 10px rgba(232,168,56,0.55)) drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
          }}
          draggable="false"
        />
      </motion.div>
    </motion.div>
  );
};

FloatingTool.propTypes = {
  src: PropTypes.string.isRequired,
  idx: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  smooth: PropTypes.object.isRequired,
};

const FloatingTools = () => {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { damping: 28, stiffness: 80, mass: 0.5 });

  return (
    <div
      className="fixed inset-0 z-[4] pointer-events-none hidden md:block"
      aria-hidden="true"
    >
      {TOOL_ICONS.map((src, i) => (
        <FloatingTool
          key={src}
          src={src}
          idx={i}
          total={TOOL_ICONS.length}
          smooth={smooth}
        />
      ))}
    </div>
  );
};

export default FloatingTools;

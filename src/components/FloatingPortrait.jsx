import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import profileImg from "../assets/me.png";

/**
 * FloatingPortrait — a fixed, viewport-centered photo of the user that
 * physically TRAVELS through the page as you scroll. Stays at the edges
 * during content-heavy sections so text remains readable, then returns
 * large and centered for the Contact "finale".
 *
 * Scroll path (x in vw, y in vh, scale):
 *   Hero        →  +22, 0,   1.00   (right side, hero focus)
 *   About       →  -28, 6,   0.55   (peek left-bottom)
 *   Education   →  +28, 8,   0.50   (peek right-bottom)
 *   Services    →  -28,-6,   0.55   (peek left-top)
 *   Cert        →  +30, 6,   0.55   (peek right-bottom)
 *   Skills      →  -32,-8,   0.48   (peek left-top)
 *   Experience  →  +32, 8,   0.50   (peek right-bottom)
 *   Projects    →  -32, 0,   0.55   (peek left)
 *   Contact     →   0,  0,   1.15   (centre, finale)
 */
const SCROLL_KEYS = [0,     0.10,  0.22,    0.32,   0.43,    0.55,   0.67,    0.78,   0.88,    1     ];
const X_VW        = ["22vw","22vw","-28vw", "28vw", "-28vw", "30vw", "-32vw", "32vw", "-32vw", "0vw" ];
const Y_VH        = ["0vh", "0vh", "6vh",   "8vh",  "-6vh",  "6vh",  "-8vh",  "8vh",  "0vh",   "0vh" ];
const SCALE       = [1,      1,     0.55,    0.50,   0.55,    0.55,   0.48,    0.50,   0.55,    1.15 ];
const ROTATE      = [0,      0,    -4,       4,     -4,       4,     -3,       3,      0,       0    ];
const OPACITY     = [1,      1,     0.85,    0.85,   0.85,    0.85,   0.82,    0.85,   0.92,    1    ];

const FloatingPortrait = () => {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { damping: 26, stiffness: 90, mass: 0.4 });

  const x = useTransform(smooth, SCROLL_KEYS, X_VW);
  const y = useTransform(smooth, SCROLL_KEYS, Y_VH);
  const scale = useTransform(smooth, SCROLL_KEYS, SCALE);
  const rotate = useTransform(smooth, SCROLL_KEYS, ROTATE);
  const opacity = useTransform(smooth, SCROLL_KEYS, OPACITY);

  return (
    <div
      className="fixed top-1/2 left-1/2 z-[5] pointer-events-none"
      style={{ transform: "translate(-50%, -50%)" }}
      aria-hidden="true"
    >
      <motion.div style={{ x, y, scale, rotate, opacity, willChange: "transform" }}>
        <div
          className="relative"
          style={{
            width: "clamp(300px, 32vw, 460px)",
            aspectRatio: "3 / 4",
          }}
        >
          {/* 1. Outer pulsing halo */}
          <div
            className="absolute pointer-events-none"
            style={{
              inset: "-25%",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(232,168,56,0.45) 0%, rgba(232,168,56,0.15) 35%, transparent 65%)",
              filter: "blur(42px)",
              animation: "halo 5s ease-in-out infinite",
            }}
          />

          {/* 2. Rotating conic-gradient ring (mask shows only the padding band) */}
          <div
            className="absolute pointer-events-none"
            style={{
              inset: "-12px",
              borderRadius: "2.6rem",
              background:
                "conic-gradient(from 0deg, transparent 0deg, rgba(232,168,56,0.95) 50deg, transparent 110deg, transparent 230deg, rgba(232,168,56,0.65) 290deg, transparent 360deg)",
              padding: "4px",
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              maskComposite: "exclude",
              animation: "rotateBorder 7s linear infinite",
              willChange: "transform",
              filter: "drop-shadow(0 0 14px rgba(232,168,56,0.55))",
            }}
          />

          {/* 3. Static thin ring for crisp definition */}
          <div
            className="absolute pointer-events-none"
            style={{
              inset: "-3px",
              borderRadius: "2.35rem",
              border: "1px solid rgba(232,168,56,0.35)",
            }}
          />

          {/* 4. Photo */}
          <div className="absolute inset-0 rounded-[2.3rem] overflow-hidden shadow-2xl">
            <img
              src={profileImg}
              alt=""
              draggable="false"
              className="w-full h-full object-cover select-none"
              style={{ filter: "contrast(1.08) saturate(1.12)" }}
            />

            {/* Scanline traveling vertically over photo */}
            <div
              className="absolute left-0 right-0 pointer-events-none"
              style={{
                height: "4px",
                background:
                  "linear-gradient(90deg, transparent, rgba(232,168,56,0.9), transparent)",
                boxShadow:
                  "0 0 22px rgba(232,168,56,0.85), 0 0 60px rgba(232,168,56,0.45)",
                animation: "photoScan 3.6s linear infinite",
                willChange: "transform",
              }}
            />

            {/* Holographic shimmer */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, transparent 30%, rgba(232,168,56,0.18) 50%, transparent 70%)",
                mixBlendMode: "overlay",
                animation: "shimmer 6s ease-in-out infinite",
              }}
            />

            {/* Bottom-edge darkening for legibility */}
            <div
              className="absolute inset-x-0 bottom-0 pointer-events-none"
              style={{
                height: "30%",
                background:
                  "linear-gradient(180deg, transparent, rgba(0,0,0,0.45))",
              }}
            />
          </div>

          {/* 5. Corner HUD brackets */}
          {[
            { key: "tl", pos: "top-1 left-1", b: "border-t-2 border-l-2" },
            { key: "tr", pos: "top-1 right-1", b: "border-t-2 border-r-2" },
            { key: "bl", pos: "bottom-1 left-1", b: "border-b-2 border-l-2" },
            { key: "br", pos: "bottom-1 right-1", b: "border-b-2 border-r-2" },
          ].map((c) => (
            <div
              key={c.key}
              className={`absolute ${c.pos} ${c.b}`}
              style={{
                width: "26px",
                height: "26px",
                borderColor: "rgba(232,168,56,0.95)",
                borderRadius: "4px",
                filter: "drop-shadow(0 0 6px rgba(232,168,56,0.6))",
              }}
            />
          ))}

          {/* 6. Floating side label (cinema HUD) */}
          <div
            className="absolute font-mono uppercase pointer-events-none"
            style={{
              top: "50%",
              right: "-22px",
              transform: "translateY(-50%) rotate(90deg) translateX(50%)",
              transformOrigin: "right center",
              color: "rgba(232,168,56,0.75)",
              fontSize: "9px",
              letterSpacing: "0.5em",
              whiteSpace: "nowrap",
              textShadow: "0 0 8px rgba(232,168,56,0.6)",
            }}
          >
            ID :: YKM-01 · STATUS NOMINAL
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FloatingPortrait;

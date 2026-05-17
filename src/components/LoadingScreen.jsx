import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const ACCENT_GOLD = "#E8A838";

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef(null);
  const progressRef = useRef(0);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const numStars = window.innerWidth < 768 ? 400 : 800;
    const stars = [];
    const centerX = w / 2;
    const centerY = h / 2;
    let speed = 0.5;
    let hyperDrive = false;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * w - centerX,
        y: Math.random() * h - centerY,
        z: Math.random() * w,
        pz: Math.random() * w
      });
    }

    let animationFrameId;

    const draw = () => {
      const currentProgress = progressRef.current;
      ctx.fillStyle = "rgba(2, 2, 5, 0.3)";
      ctx.fillRect(0, 0, w, h);

      if (currentProgress > 80 && !hyperDrive) {
        hyperDrive = true;
      }

      const targetSpeed = hyperDrive ? 40 : 2 + (currentProgress * 0.15);
      speed += (targetSpeed - speed) * 0.05;

      stars.forEach(star => {
        star.z -= speed;

        if (star.z <= 0) {
          star.x = Math.random() * w - centerX;
          star.y = Math.random() * h - centerY;
          star.z = w;
          star.pz = w;
        }

        const k = 128.0 / star.z;
        const px = star.x * k + centerX;
        const py = star.y * k + centerY;

        const pk = 128.0 / star.pz;
        const ppx = star.x * pk + centerX;
        const ppy = star.y * pk + centerY;

        star.pz = star.z;

        ctx.beginPath();
        ctx.moveTo(ppx, ppy);
        ctx.lineTo(px, py);

        const brightness = Math.min(1, 1 - (star.z / w));
        ctx.strokeStyle = `rgba(255, 255, 255, ${brightness})`;
        ctx.lineWidth = hyperDrive ? (1 - star.z / w) * 4 : (1 - star.z / w) * 2;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Simulate realistic loading progress
    const duration = 2500; // 2.5 seconds total
    const interval = 30; // ms
    const increment = 100 / (duration / interval);

    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(t);
          // Wait for hyperdrive effect to visually complete
          setTimeout(onComplete, 800);
          return 100;
        }
        // Accelerate progress slightly towards the end
        return p + increment * (p > 70 ? 1.5 : 1);
      });
    }, interval);

    return () => clearInterval(t);
  }, [onComplete]);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#020205" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Atmospheric overlays to enhance the space feel */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(232,168,56,0.02)] to-transparent pointer-events-none" />
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <motion.div
            animate={progress >= 80 ? { scale: [1, 1.1, 1], filter: "blur(2px)" } : {}}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              System Initialization
            </h1>
          </motion.div>
          <p className="text-xs mt-3 font-mono uppercase tracking-[0.3em]" style={{ color: ACCENT_GOLD }}>
            Establishing Secure Connection
          </p>
        </motion.div>

        <div className="w-64 max-w-[80vw]">
          <div
            className="h-[1px] w-full bg-[rgba(255,255,255,0.1)] overflow-hidden relative"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              className="h-full absolute left-0 top-0 shadow-[0_0_10px_#E8A838]"
              style={{ background: ACCENT_GOLD }}
            />
          </div>
          <div className="flex justify-between mt-3 px-1">
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
              {progress >= 80 ? "Hyperspace Jump" : "Boot Sequence"}
            </span>
            <span className="text-[10px] font-mono" style={{ color: ACCENT_GOLD }}>
              {Math.min(100, Math.round(progress))}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

LoadingScreen.propTypes = {
  onComplete: PropTypes.func.isRequired,
};

export default LoadingScreen;

import { useState, useEffect, useRef } from "react";
import Lenis from "lenis";
import PropTypes from "prop-types";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Github, Linkedin, Mail, Heart, ArrowUp } from "lucide-react";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import CinematicScene from "./components/CinematicScene";
import HelmetScene from "./components/HelmetScene";
import IronManHUD from "./components/IronManHUD";
import LoadingScreen from "./components/LoadingScreen";
import Marquee from "./components/Marquee";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Education from "./sections/Education";
import Services from "./sections/Services";
import Certifications from "./sections/Certifications";
import Skills from "./sections/Skills";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";
import { personalInfo, marqueeWords } from "./data/portfolioData";

const ScrollBar = () => {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left"
      style={{ scaleX: scrollYProgress, background: "var(--accent)" }}
    />
  );
};


const ScrollReveal = ({ children }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [40, 0, 0, -40]);

  return (
    <motion.div ref={ref} style={{ opacity, scale, y }}>
      {children}
    </motion.div>
  );
};

ScrollReveal.propTypes = {
  children: PropTypes.node.isRequired,
};

const AppContent = () => {
  const [loading, setLoading] = useState(true);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: isMobile ? 1.5 : 1,
    });
    const loop = (time) => {
      lenis.raf(time);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      lenis.destroy();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      className="min-h-screen transition-colors duration-700 bg-transparent"
    >
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <ScrollBar />
          <CinematicScene />
          <HelmetScene />
          <IronManHUD />
          <Navbar />

          <main className="relative z-10 w-full overflow-hidden">
            <Hero />

            {/* Marquee — kinetic section break */}
            <Marquee words={marqueeWords} speed={35} />

            <ScrollReveal><About /></ScrollReveal>
            <div className="divider" />
            <ScrollReveal><Education /></ScrollReveal>
            <div className="divider" />
            <ScrollReveal><Services /></ScrollReveal>
            <div className="divider" />
            <ScrollReveal><Certifications /></ScrollReveal>

            {/* Reverse marquee */}
            <Marquee words={marqueeWords} reverse speed={40} />

            <ScrollReveal><Skills /></ScrollReveal>
            <div className="divider" />
            <ScrollReveal><Experience /></ScrollReveal>
            <div className="divider" />
            <ScrollReveal><Projects /></ScrollReveal>
            <div className="divider" />
            <ScrollReveal><Contact /></ScrollReveal>

            {/* Footer */}
            <footer
              className="py-14 relative z-10"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <div className="container-wide">
                <div className="flex flex-col md:flex-row items-center justify-between gap-5 md:gap-8">
                  <div className="flex items-center gap-3">
                    <img
                      src="/yokesh_logo.jpg"
                      alt="YK"
                      className="rounded-md object-contain"
                      style={{ width: "22px", height: "22px" }}
                    />
                    <div>
                      <span
                        className="font-serif font-bold text-sm block"
                        style={{ color: "var(--text)" }}
                      >
                        {personalInfo.name}
                      </span>
                      <span className="text-[11px]" style={{ color: "var(--text-m)" }}>
                        Cybersecurity Engineer
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {[
                      { Icon: Github, href: personalInfo.github, label: "GitHub" },
                      { Icon: Linkedin, href: personalInfo.linkedin, label: "LinkedIn" },
                      { Icon: Mail, href: `mailto:${personalInfo.email}`, label: "Email" },
                    ].map(({ Icon, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-all duration-300 hover:scale-125 hover:-translate-y-0.5"
                        style={{ color: "var(--text-m)" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "var(--accent)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "var(--text-m)")
                        }
                      >
                        <Icon size={18} />
                      </a>
                    ))}
                  </div>

                  <div
                    className="flex items-center gap-1.5 text-[11px]"
                    style={{ color: "var(--text-m)" }}
                  >
                    Built with
                    <Heart size={11} style={{ color: "var(--accent)" }} />
                    by {personalInfo.name} · {new Date().getFullYear()}
                  </div>
                </div>
              </div>
            </footer>
          </main>

          {/* Scroll to top */}
          <AnimatePresence>
            {showTop && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110"
                style={{
                  background: "var(--accent)",
                  color: "#fff",
                  boxShadow: "0 6px 20px rgba(184,134,11,0.25)",
                }}
                aria-label="Scroll to top"
              >
                <ArrowUp size={16} />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

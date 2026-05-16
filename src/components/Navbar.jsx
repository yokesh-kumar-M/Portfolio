import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download, Sun, Moon } from "lucide-react";
import { navLinks, personalInfo } from "../data/portfolioData";
import { useTheme } from "../context/ThemeContext";
import useScrollSpy from "../hooks/useScrollSpy";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const sectionIds = navLinks.map((l) => l.href.replace("#", ""));
  const active = useScrollSpy(sectionIds, 150);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: scrolled ? "var(--glass)" : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(1.3)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(1.3)" : "none",
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="container-wide">
          <div className="relative flex items-center justify-between" style={{ height: "56px" }}>
            {/* ── Left: Logo ── */}
            <a href="#hero" className="flex items-center gap-2 group">
              <img
                src="/yokesh_logo.jpg"
                alt="YK"
                style={{ width: "28px", height: "28px" }}
                className="rounded-lg object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <span
                className="hidden sm:block text-[13px] font-serif font-bold transition-colors duration-300"
                style={{ color: "var(--text)" }}
              >
                Yokesh Kumar M
              </span>
            </a>

            {/* ── Centre: Frosted capsule ── */}
            <nav
              className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-0.5 rounded-full"
              style={{
                padding: "4px 6px",
                background: "var(--glass)",
                backdropFilter: "blur(20px) saturate(1.3)",
                WebkitBackdropFilter: "blur(20px) saturate(1.3)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {navLinks.map((link) => {
                const id = link.href.replace("#", "");
                const isActive = active === id;
                return (
                  <a key={link.label} href={link.href} className="relative">
                    {isActive && (
                      <motion.div
                        layoutId="navPill"
                        className="absolute inset-0 rounded-full"
                        style={{ background: "var(--accent)" }}
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      />
                    )}
                    <span
                      className="relative z-10 block rounded-full text-[12px] font-semibold transition-colors duration-200"
                      style={{
                        padding: "5px 12px",
                        color: isActive ? "#fff" : "var(--text-m)",
                      }}
                      onMouseEnter={(e) => { if (!isActive) e.target.style.color = "var(--text)"; }}
                      onMouseLeave={(e) => { if (!isActive) e.target.style.color = "var(--text-m)"; }}
                    >
                      {link.label}
                    </span>
                  </a>
                );
              })}
            </nav>

            {/* ── Right: Actions ── */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggle}
                className="flex items-center justify-center cursor-pointer rounded-full transition-all duration-300 hover:scale-110"
                style={{
                  width: "32px", height: "32px",
                  background: "var(--accent-light)",
                  border: "1px solid var(--border)",
                  color: "var(--accent)",
                }}
                aria-label="Toggle theme"
              >
                <motion.div
                  key={theme}
                  initial={{ y: theme === "dark" ? 8 : -8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
                </motion.div>
              </button>

              <a
                href={personalInfo.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-bold rounded-full transition-all duration-300 hover:scale-105"
                style={{
                  padding: "7px 16px",
                  background: "var(--accent)",
                  color: "#fff",
                  boxShadow: "0 2px 12px rgba(184,134,11,0.2)",
                }}
              >
                <Download size={11} />
                Resume
              </a>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="lg:hidden flex items-center justify-center cursor-pointer rounded-full"
                style={{
                  width: "32px", height: "32px",
                  background: "var(--accent-light)",
                  border: "1px solid var(--border)",
                  color: "var(--text-s)",
                }}
                aria-label="Open menu"
              >
                <Menu size={15} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile fullscreen ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex flex-col lg:hidden"
            style={{ background: "var(--bg)" }}
          >
            <div className="flex items-center justify-between px-6 shrink-0" style={{ height: "56px" }}>
              <span className="font-serif font-bold text-sm" style={{ color: "var(--text)" }}>
                Yokesh Kumar M
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center cursor-pointer"
                style={{ width: "32px", height: "32px", color: "var(--text-m)" }}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center px-10 gap-1">
              {navLinks.map((link, i) => {
                const isActive = active === link.href.replace("#", "");
                return (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                    className="flex items-center gap-5 py-3"
                  >
                    <span className="w-8 text-right text-[11px] font-mono" style={{ color: "var(--text-m)" }}>
                      0{i + 1}
                    </span>
                    <span
                      className="text-2xl font-serif font-bold"
                      style={{ color: isActive ? "var(--accent)" : "var(--text-s)" }}
                    >
                      {link.label}
                    </span>
                  </motion.a>
                );
              })}
            </nav>

            <div className="px-10 pb-10">
              <a
                href={personalInfo.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-main w-full justify-center !text-[13px]"
              >
                <Download size={14} />
                <span>Download Resume</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

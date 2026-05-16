import { motion } from "framer-motion";
import { projects, getIconByTech } from "../data/portfolioData";
import { Github, ExternalLink, ArrowUpRight } from "lucide-react";
import Atropos from 'atropos/react';

const fade = (d = 0) => ({
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.9, delay: d, ease: [0.16, 1, 0.3, 1] },
});

const Projects = () => {
  return (
    <section id="projects" className="section-page relative py-20 lg:py-40" style={{ background: "transparent" }}>
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

      <div className="container-wide">
        <div className="flex flex-col mb-20 lg:mb-32">
          <motion.div {...fade()} className="mb-6">
            <span className="label-overline">Selected Works</span>
          </motion.div>
          <motion.h2
            {...fade(0.05)}
            className="heading-section max-w-3xl"
            style={{ color: "var(--text)" }}
          >
            Engineering <span className="text-[var(--accent)]">secure</span> digital architectures.
          </motion.h2>
        </div>

        <div className="space-y-32 lg:space-y-56">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              {...fade(i * 0.1)}
              className="group relative"
            >
              <div
                className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  } gap-12 lg:gap-24 items-center`}
              >
                {/* Project image with Atropos */}
                <div className="w-full lg:w-[55%] relative">
                  <Atropos
                    className="atropos-project"
                    highlight
                    shadow
                    rotateTouch
                  >
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        data-atropos-offset="-2"
                      />
                      {/* Cyber Scanner Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--accent)] to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none"
                        style={{ height: '2px', top: '0', animation: 'scan 3s linear infinite' }} />

                      <div className="absolute inset-0 bg-[var(--bg)]/10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="absolute bottom-6 left-6 flex gap-2" data-atropos-offset="5">
                        <span className="bg-black/80 backdrop-blur-md text-white text-[10px] font-mono px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">
                          Deployed
                        </span>
                      </div>
                    </div>
                  </Atropos>

                  {/* Decorative number */}
                  <span className={`absolute -top-12 ${i % 2 === 0 ? "-left-6" : "-right-6"} text-8xl font-serif font-black opacity-[0.03] select-none text-[var(--text)]`}>
                    0{i + 1}
                  </span>
                </div>

                {/* Content */}
                <div className="w-full lg:w-[45%]">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-px bg-[var(--accent)]" />
                    <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[var(--accent)]">
                      {project.subtitle}
                    </span>
                  </div>

                  <h3
                    className="text-3xl md:text-5xl font-serif font-bold mb-8 text-[var(--text)] leading-tight"
                  >
                    {project.title}
                  </h3>

                  <p
                    className="text-base md:text-lg leading-[1.8] mb-10 text-[var(--text-s)] font-light"
                  >
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-3 mb-12">
                    {project.tech.map((t) => {
                      const iconUrl = getIconByTech(t);
                      return (
                        <span key={t} className="px-4 py-2 rounded-lg bg-[var(--bg-alt)] border border-[var(--border)] text-xs font-mono flex items-center gap-2.5 text-[var(--text-s)] hover:border-[var(--accent)] transition-colors duration-300">
                          {iconUrl && <img src={iconUrl} alt={t} className="w-4 h-4 object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" />}
                          {t}
                        </span>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline !rounded-full group/btn"
                    >
                      <Github size={18} className="group-hover/btn:rotate-12 transition-transform" />
                      <span>Code Repository</span>
                    </a>
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-main !rounded-full group/btn"
                      >
                        <ExternalLink size={18} />
                        <span>Live Preview</span>
                        <ArrowUpRight size={14} className="opacity-50 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                      </a>
                    )}
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

export default Projects;

import { motion } from "framer-motion";
import { personalInfo } from "../data/portfolioData";
import { Mail, Github, Linkedin, Phone, MapPin, ArrowUpRight, Download } from "lucide-react";

const socials = [
  { icon: Github, href: personalInfo.github, label: "GitHub", handle: "@yokesh-kumar-M" },
  { icon: Linkedin, href: personalInfo.linkedin, label: "LinkedIn", handle: "yokeshkumarm" },
  { icon: Mail, href: `mailto:${personalInfo.email}`, label: "Email", handle: personalInfo.email },
  { icon: Phone, href: `tel:${personalInfo.phone}`, label: "Phone", handle: personalInfo.phone },
];

const fade = (d = 0) => ({
  initial: { opacity: 0, y: 35 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, delay: d, ease: [0.16, 1, 0.3, 1] },
});

const Contact = () => {
  return (
    <section id="contact" className="section-page relative overflow-hidden" style={{ background: "transparent" }}>
      <div className="absolute inset-0 z-0 backdrop-blur-[1px] opacity-10 pointer-events-none" />

      <div className="container-wide">
        <motion.div {...fade()} className="mb-6">
          <span className="label-overline">Contact</span>
        </motion.div>
        <motion.h2
          {...fade(0.05)}
          className="heading-section mb-6"
          style={{ color: "var(--text)" }}
        >
          Let&apos;s work <span style={{ color: "var(--accent)" }}>together.</span>
        </motion.h2>
        <motion.p
          {...fade(0.1)}
          className="text-lg mb-14 max-w-xl"
          style={{ color: "var(--text-m)" }}
        >
          Open to cybersecurity roles, penetration testing engagements, security consulting, or a friendly conversation about technology.
        </motion.p>

        {/* Two columns */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          {/* Left — CTA */}
          <motion.div {...fade(0.15)}>
            <div className="flex items-center gap-3 mb-6" style={{ color: "var(--text-m)" }}>
              <MapPin size={16} style={{ color: "var(--accent)" }} />
              <span className="text-sm">{personalInfo.location}</span>
            </div>

            <p
              className="text-base leading-[1.9] mb-10 max-w-md"
              style={{ color: "var(--text-s)" }}
            >
              I&apos;d love to hear about your project or opportunity. Drop me a message and let&apos;s discuss how we can make it happen.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
              <a href={`mailto:${personalInfo.email}`} className="btn-main">
                <Mail size={16} />
                <span>Send Email</span>
              </a>
              <a
                href={personalInfo.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <Download size={16} />
                Download CV
              </a>
            </div>
          </motion.div>

          {/* Right — Social links, no heavy cards */}
          <div className="space-y-0">
            {socials.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target={s.label !== "Email" && s.label !== "Phone" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  {...fade(0.2 + i * 0.06)}
                  className="flex items-center justify-between py-6 group transition-all duration-400 hover:translate-x-3"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <div className="flex items-center gap-5">
                    <Icon
                      size={20}
                      className="transition-colors duration-300"
                      style={{ color: "var(--text-m)" }}
                    />
                    <div>
                      <span
                        className="text-base font-bold block transition-colors duration-300 group-hover:text-[var(--accent)]"
                        style={{ color: "var(--text)" }}
                      >
                        {s.label}
                      </span>
                      <span className="text-xs font-mono" style={{ color: "var(--text-m)" }}>
                        {s.handle}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight
                    size={18}
                    className="transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                    style={{ color: "var(--text-m)" }}
                  />
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

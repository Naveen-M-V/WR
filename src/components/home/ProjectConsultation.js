import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, DollarSign, ArrowRight } from "lucide-react";

const consultationServices = [
  {
    title: "Commercial Funding & Capital Provision",
    description: "Expert financial solutions for your renewable energy projects with competitive rates and flexible terms.",
    icon: DollarSign,
    accentHex: "#10b981",
    accentRgb: "16,185,129",
    link: "/contact-us?tab=planning",
  },
  {
    title: "Planning & Infrastructure Consultation",
    description: "Strategic planning and infrastructure development services for sustainable energy projects.",
    icon: Building2,
    accentHex: "#06b6d4",
    accentRgb: "6,182,212",
    link: "/contact-us?tab=planning",
  },
];

const ProjectConsultation = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section
      className="relative py-14 md:py-16 overflow-hidden"
      style={{ background: "#040e1e" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>

      {/* ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 left-1/4 w-[600px] h-[500px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(ellipse, #10b981, transparent 65%)" }}
        />
        <div
          className="absolute -bottom-40 right-1/4 w-[500px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(ellipse, #06b6d4, transparent 65%)" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* ── LEFT: text ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:col-span-5"
          >
            {/* heading */}
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                marginBottom: "1.25rem",
              }}
            >
              Does your project require planning or infrastructure consultation or{" "}
              <span style={{
                background: "linear-gradient(90deg, #10b981, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                capital provision?
              </span>
            </h2>

            {/* description */}
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(13px, 1.4vw, 15px)",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.8,
              fontWeight: 300,
              marginBottom: "2.5rem",
            }}>
              Project Financing & Funding. Find the right advisor, consultant, or investor to bring your renewable project to life.
            </p>

            {/* CTA */}
            <motion.a
              href="/contact-us?tab=planning"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300"
              style={{
                background: "#10b981",
                color: "#ffffff",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 0 24px rgba(16,185,129,0.3)",
              }}
              whileHover={{ scale: 1.04, boxShadow: "0 0 36px rgba(16,185,129,0.5)" }}
              whileTap={{ scale: 0.97 }}
            >
              Find your Partner
              <ArrowRight size={14} />
            </motion.a>
          </motion.div>

          {/* ── RIGHT: cards ── */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {consultationServices.map((service, index) => {
              const Icon = service.icon;
              const hovered = hoveredCard === index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div
                    className="relative overflow-hidden rounded-2xl border transition-all duration-500 flex flex-col"
                    style={{
                      borderColor: hovered ? `rgba(${service.accentRgb},0.4)` : "rgba(255,255,255,0.07)",
                      background: hovered
                        ? `linear-gradient(145deg, rgba(${service.accentRgb},0.09) 0%, rgba(4,14,30,0.98) 100%)`
                        : "rgba(255,255,255,0.025)",
                      boxShadow: hovered
                        ? `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(${service.accentRgb},0.2)`
                        : "0 4px 20px rgba(0,0,0,0.3)",
                    }}
                  >
                    {/* top accent bar */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${service.accentHex}, transparent)`,
                        opacity: hovered ? 1 : 0.2,
                      }}
                    />

                    {/* ambient glow */}
                    <div
                      className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl pointer-events-none transition-opacity duration-700"
                      style={{
                        background: `radial-gradient(circle, rgba(${service.accentRgb},0.25), transparent 70%)`,
                        opacity: hovered ? 1 : 0,
                      }}
                    />

                    <div className="relative p-6 flex flex-col flex-1">
                      {/* icon */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 transition-all duration-300"
                        style={{
                          background: `rgba(${service.accentRgb},0.1)`,
                          border: `1px solid rgba(${service.accentRgb},0.3)`,
                          boxShadow: hovered ? `0 0 16px rgba(${service.accentRgb},0.3)` : "none",
                        }}
                      >
                        <Icon size={18} style={{ color: service.accentHex }} />
                      </div>

                      {/* title */}
                      <h3
                        className="mb-3 font-bold text-white leading-snug"
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "clamp(1rem, 1.3vw, 1.1rem)",
                        }}
                      >
                        {service.title}
                      </h3>

                      {/* description */}
                      <p
                        className="mb-6 flex-1"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "12.5px",
                          color: "rgba(255,255,255,0.5)",
                          lineHeight: 1.7,
                          fontWeight: 300,
                        }}
                      >
                        {service.description}
                      </p>

                      {/* CTA link */}
                      <Link to={service.link}>
                        <div
                          className="inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-200"
                          style={{ color: service.accentHex, fontFamily: "'DM Sans', sans-serif", fontSize: "13px" }}
                        >
                          More Details
                          <ArrowRight size={13} />
                        </div>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProjectConsultation;
import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ACCENT_COLORS = [
  { hex: "#10b981", rgb: "16,185,129"  },
  { hex: "#06b6d4", rgb: "6,182,212"   },
  { hex: "#f59e0b", rgb: "245,158,11"  },
  { hex: "#ec4899", rgb: "236,72,153"  },
  { hex: "#8b5cf6", rgb: "139,92,246"  },
  { hex: "#14b8a6", rgb: "20,184,166"  },
  { hex: "#10b981", rgb: "16,185,129"  },
  { hex: "#6366f1", rgb: "99,102,241"  },
];

const experts = [
  {
    name: "Helen Charteris",
    company: "Major Energy",
    position: "Head of Global Power and Energy",
    description: "With over 35 Years in recruitment and executive search, Helen is a respected expert in senior level hiring across the Energy, Utilities, and Power sectors. Known for her strategic insight and inclusive approach, she has partnered with start ups, SMEs and global organisations to deliver impactful leadership appointments. A long time advocate for women in engineering, Helen is closely aligned with the womens engineering society, and serves as a special adviser for the CIGRE UK Womens network. Her proven track record, sector expertise and dedication to equity make her a trusted adviser and valued partner in talent strategy. Helen specialises in C-suite and global leadership placements and is a recipient of the Gillian Skinner Award for her contribution to engineering recruitment.",
    image: "/expertpannel/Major Energy.png",
    linkedin: "https://www.linkedin.com/in/helencharteris/",
    contactText: "Contact Helen at: helen@major-energy.com",
  },
  {
    name: "Dr Euan McTurk",
    company: "Plug Life Consulting",
    position: "Battery Electrochemist & EV Specialist",
    description: "Dr Euan McTurk is a consultant Battery Electrochemist with peerless knowledge of lithium-ion cell behaviour. He has devoted years to advancing next-generation cell system optimisation and management. He is the creator of Plug Life Television, a YouTube channel explaining complex battery and EV topics in simple terms. Dr Euan is also co-founder of Charge Saint, a cost-effective solution addressing blocked or broken EV infrastructure across the UK. Based in Edinburgh, he is regarded as one of the most knowledgeable experts in battery behaviour and EV technology.",
    image: "/expertpannel/2.png",
    linkedin: "https://www.linkedin.com/in/euanmcturk",
    contactText: "Contact Dr Euan at: consulting@pluglifetelevision.co.uk",
  },
  {
    name: "Ciaron King",
    company: "Digren Energy Management",
    position: "CEO – Digren Energy Management",
    description: "Ciaron King is CEO of Digren Energy Management, a leading London- and Dublin-based consultancy with exceptional expertise in energy monitoring, markets, and management. Ciaron and his team provide analysis and advice across energy procurement, storage, auditing, voltage optimisation, and real-time energy data intelligence. Working across sectors such as construction, retail, hospitality, healthcare, and agriculture, Digren Energy helps organisations reduce carbon emissions, transition to Solar PV, deploy EV charging projects, and progress toward net zero.",
    image: "/expertpannel/1.png",
    linkedin: "https://www.linkedin.com/in/ciaronking/",
    contactText: "Contact Ciaron at: ctking@digrenenergy.ie",
  },
  {
    name: "Chris Russell",
    company: "Sustainable Energy Finance",
    position: "Renewable Energy Funding Specialist",
    description: "Chris is a results driven professional with twelve years experience in Green Energy Asset and Project Finance. A vastly experienced professional who specialises in deal structuring and capital deployment for Challenger banks, Private equity funds and investors. Consultancy includes PE funds in the PPA market, specialising in the delivery of tailored solutions that drive revenue and optimise ROI. A collaborative team player with strong commercial and technical expertise in Renewable Energy.",
    image: "/expertpannel/4.png",
    linkedin: "https://www.linkedin.com/in/sustainableenergyfinance",
    contactText: "Contact Chris at: chris@sustainableenergyfinance.co.uk",
  },
  {
    name: "John Kennedy",
    company: "Kennedy Carbon",
    position: "Managing Director",
    description: "John is an experienced Director / Manager, Specialising in Net Zero Carbon, Energy Management and Sustainability complemented with significant Operational, Budgetary & HSE delivery at Group Level including 20+ years in Sustainability & Carbon management in Concrete / Precast, Transport, Farming & Food & Drink Sector UK & EU.",
    image: "/expertpannel/9.png",
    linkedin: "https://www.linkedin.com/in/john-kennedy-143761125/",
    contactText: "Contact John at: info@kennedycarbon.com",
  },
];

const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" style={{ color: "#0a66c2" }}>
    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
  </svg>
);

const ExpertCard = ({ expert, index }) => {
  const [hovered, setHovered] = useState(false);
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="h-full"
    >
      <div
        className="relative overflow-hidden rounded-2xl border flex flex-col h-full transition-all duration-500"
        style={{
          borderColor: hovered ? `rgba(${accent.rgb},0.4)` : "rgba(255,255,255,0.07)",
          background: hovered
            ? `linear-gradient(135deg, rgba(${accent.rgb},0.09) 0%, rgba(4,14,30,0.98) 100%)`
            : "rgba(255,255,255,0.025)",
          boxShadow: hovered
            ? `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(${accent.rgb},0.2)`
            : "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {/* top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-500 z-10"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent.hex}, transparent)`,
            opacity: hovered ? 1 : 0.2,
          }}
        />

        {/* ── PHOTO / LOGO ── */}
        <div className="flex-shrink-0 flex items-center justify-center px-6 pt-8 pb-4">
          <div
            className="transition-all duration-300"
            style={{
              width: "160px",
              height: "160px",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.5)",
              border: `2px solid ${hovered ? `rgba(${accent.rgb},0.5)` : "rgba(255,255,255,0.15)"}`,
              boxShadow: hovered ? `0 0 28px rgba(${accent.rgb},0.25), 0 8px 32px rgba(0,0,0,0.4)` : "0 4px 20px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px",
              overflow: "hidden",
            }}
          >
            <img
              src={expert.image}
              alt={expert.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "center",
              }}
            />
          </div>
        </div>

        {/* ── CARD BODY ── */}
        <div className="px-5 pb-5 flex flex-col flex-1">

          {/* name + company */}
          <div className="mb-4 text-center">
            <h3
              className="font-bold text-white leading-snug"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.05rem, 1.4vw, 1.15rem)", marginBottom: "3px" }}
            >
              {expert.name}
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11.5px", color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>
              {expert.company}
            </p>
          </div>

          {/* position pill */}
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border mb-4 self-start"
            style={{
              borderColor: `rgba(${accent.rgb},0.35)`,
              background: `rgba(${accent.rgb},0.08)`,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "9.5px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: accent.hex,
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent.hex }} />
            {expert.position}
          </div>

          {/* accent rule */}
          <div
            className="mb-4 h-px transition-all duration-500"
            style={{
              background: `linear-gradient(90deg, ${accent.hex}, transparent)`,
              width: hovered ? "52px" : "24px",
            }}
          />

          {/* description */}
          <p
            className="flex-1 mb-4"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12.5px",
              color: "rgba(255,255,255,0.52)",
              lineHeight: 1.75,
              fontWeight: 300,
            }}
          >
            {expert.description}
          </p>

          {/* contact */}
          {expert.contactText && (
            <p className="mb-5" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11.5px", color: accent.hex, fontWeight: 400, opacity: 0.8 }}>
              {expert.contactText}
            </p>
          )}

          {/* linkedin */}
          <div className="flex justify-end mt-auto">
            <a
              href={expert.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-200"
              style={{
                borderColor: "rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)",
              }}
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `rgba(${accent.rgb},0.55)`; e.currentTarget.style.background = `rgba(${accent.rgb},0.14)`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
            >
              <LinkedInIcon />
            </a>
          </div>
        </div>

        {/* ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-700"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, rgba(${accent.rgb},0.1), transparent 60%)`,
            opacity: hovered ? 1 : 0,
          }}
        />
      </div>
    </motion.div>
  );
};

const ExpertPanel = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
  <section id="our-expert-pannel" className="relative pb-20" style={{ background: "#040e1e" }}>

    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');
      .hero-text-mask { background: linear-gradient(175deg, #ffffff 0%, rgba(255,255,255,0.62) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    `}</style>

    {/* ── PARALLAX HERO ── */}
    <div ref={heroRef} className="relative w-full overflow-hidden" style={{ height: "clamp(480px, 80vh, 750px)" }}>
      <motion.div className="absolute inset-0" style={{ y: heroY, willChange: "transform" }}>
        <img
          src="/Expert Circle.jpeg"
          alt="Expert Circle"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(1.08) saturate(1.2)" }}
        />
      </motion.div>
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(4,14,30,0.25) 0%, rgba(4,14,30,0.55) 60%, #040e1e 100%)" }} />
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(to right, rgba(4,14,30,0.65) 0%, rgba(4,14,30,0.1) 60%, transparent 100%)" }} />

      <motion.div
        className="absolute inset-0 flex flex-col justify-end pb-16 px-8 md:px-16 lg:px-24 pt-32"
        style={{ opacity: heroOpacity, maxWidth: "65%" }}
      >
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.7 }}
          className="flex items-center gap-3 mb-6">
          <div className="h-px w-10" style={{ background: "#10b981" }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.22em", color: "#10b981", textTransform: "uppercase", fontWeight: 500 }}>
            Industry Leaders
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="hero-text-mask mb-5"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 4vw, 4.5rem)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.02em" }}>
          Our Expert<br />Circle
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14px, 1.8vw, 18px)", color: "rgba(255,255,255,0.5)", maxWidth: "500px", lineHeight: 1.75, fontWeight: 300 }}>
          Highly respected industry professionals and thought leaders bringing real-world experience and forward-thinking insights to the platform.
        </motion.p>
      </motion.div>

      {/* scroll indicator */}
      <motion.div className="absolute bottom-8 right-8 md:right-16 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Scroll</span>
        <motion.div className="w-px h-10 origin-top"
          style={{ background: "linear-gradient(to bottom, rgba(16,185,129,0.6), transparent)" }}
          animate={{ scaleY: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
      </motion.div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10 pt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
        {experts.map((expert, index) => (
          <ExpertCard key={index} expert={expert} index={index} />
        ))}
      </div>
    </div>
  </section>
  );
};

export default ExpertPanel;
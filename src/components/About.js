import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Eye, Target, Sparkles, ArrowRight, MapPin } from 'lucide-react';
import Navbar from './navcontent/navbar';
import ScrollingBanner from './home/ScrollingBanner';
import MeetOurTeam from './meetourteam';
import ExpertPanel from './ExpertPanel';
import BlogsSection from './BlogsSection';

const aboutCards = [
  {
    title: "Our Vision",
    description: "To deliver a leading digital hub that offers project leaders, industry professionals and sustainability officers a reputable source to access relevant content across the sector.",
    image: "/About/vission.jpeg",
    iconType: "eye",
  },
  {
    title: "Our Technical Mission",
    description: "To create a dynamic, user-friendly, scalable, and secure website, underpinned by the core pillars of Reliability, Security, Compliance, GDPR, Data protection, and secure integrations. Offering continuous improvement, regular updates, own account portals, feedback loops, and enhancements and market leading client engagement portals.",
    image: "/About/mission.jpeg",
    iconType: "target",
  },
  {
    title: "Our Platform",
    description: "To offer discerning marketing heads a highly visible digital industry trade exhibition platform, open 24/7, 365 days a year without the demanding constraints of cost, geography or limit on time.",
    image: "/About/platform.jpeg",
    iconType: "sparkles",
  },
  {
    title: "Our Model",
    description: "An always open industry \"trade show\" - where companies can self-elevate their brand, showcase new market entries, innovation, highlight completed projects and case studies, awards, certifications, company profiles, blogs, videos, images, and contact details.",
    image: "/About/model.jpeg",
    iconType: "arrow",
  },
  {
    title: "Our Approach",
    description: "Which Renewables is always open. We encourage clients to engage, network and liaise with peers and access our open webinars, podcasts, blogs, and in-house panel groups.",
    image: "/About/approach.jpeg",
    iconType: "mappin",
  }
];

/* ─────────────────────────────────────────────────────────────
   ABOUT CARD - HORIZONTAL RECTANGLE
───────────────────────────────────────────────────────────── */
const AboutCard = ({ card, index }) => {
  const [hovered, setHovered] = useState(false);
  
  const getIcon = (iconType) => {
    switch (iconType) {
      case 'eye': return <Eye size={20} />;
      case 'target': return <Target size={20} />;
      case 'sparkles': return <Sparkles size={20} />;
      case 'arrow': return <ArrowRight size={20} />;
      case 'mappin': return <MapPin size={20} />;
      default: return <Eye size={20} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="cursor-default"
    >
      <div
        className="relative overflow-hidden rounded-2xl border transition-all duration-500 flex flex-row h-full"
        style={{
          borderColor: hovered ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.07)",
          background: hovered
            ? "linear-gradient(135deg, rgba(16,185,129,0.07) 0%, rgba(4,14,30,0.98) 100%)"
            : "rgba(255,255,255,0.025)",
          boxShadow: hovered
            ? "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(16,185,129,0.2)"
            : "0 4px 20px rgba(0,0,0,0.3)",
          minHeight: "200px",
        }}
      >
        {/* top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] z-10 transition-opacity duration-500"
          style={{
            background: "linear-gradient(90deg, transparent, #10b981, transparent)",
            opacity: hovered ? 1 : 0.2,
          }}
        />

        {/* image - left side */}
        <div className="relative overflow-hidden flex-shrink-0" style={{ width: "35%", minHeight: "200px" }}>
          <motion.img
            src={card.image}
            alt={card.title}
            className="absolute inset-0 w-full h-full object-cover"
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(90deg, rgba(4,14,30,0) 0%, rgba(4,14,30,0.7) 100%)" }} />
        </div>

        {/* content - right side */}
        <div className="flex-1 flex flex-col px-6 md:px-8 py-5 justify-center">
          {/* title */}
          <h3
            className="font-bold text-white leading-snug mb-3 transition-colors duration-300"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.1rem, 1.5vw, 1.3rem)", color: hovered ? "#10b981" : "#ffffff" }}
          >
            {card.title}
          </h3>

          {/* accent rule */}
          <div
            className="mb-3 h-px transition-all duration-500"
            style={{
              background: "linear-gradient(90deg, #10b981, transparent)",
              width: hovered ? "52px" : "24px",
            }}
          />

          {/* description */}
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            {card.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const About = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <div className="min-h-screen text-white overflow-hidden" style={{ background: "#040e1e" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');
        .hero-text-mask { background: linear-gradient(175deg, #ffffff 0%, rgba(255,255,255,0.62) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        ::placeholder { color: rgba(255,255,255,0.25) !important; }
      `}</style>

      {/* blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #10b981, transparent 70%)" }} />
        <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)" }} />
      </div>

      <ScrollingBanner />
      <Navbar />

      {/* ── HERO ── */}
      <div ref={heroRef} className="relative w-full overflow-hidden" style={{ height: "clamp(480px, 80vh, 750px)" }}>
        <motion.div className="absolute inset-0" style={{ y: heroY, willChange: "transform" }}>
          <img src="/About/about.jpeg" alt="About Us"
            className="w-full h-full object-cover" style={{ filter: "brightness(1.08) saturate(1.2)" }} />
        </motion.div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(4,14,30,0.25) 0%, rgba(4,14,30,0.55) 60%, #040e1e 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(4,14,30,0.65) 0%, rgba(4,14,30,0.1) 60%, transparent 100%)" }} />

        <motion.div
          className="absolute inset-0 flex flex-col justify-end pb-16 px-8 md:px-16 lg:px-24 pt-32"
          style={{ opacity: heroOpacity, maxWidth: "65%" }}
        >
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.7 }}
            className="flex items-center gap-3 mb-6">
            <div className="h-px w-10" style={{ background: "#10b981" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.22em", color: "#10b981", textTransform: "uppercase", fontWeight: 500 }}>About Us</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hero-text-mask mb-5"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 4vw, 4.5rem)", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.02em", overflow: "visible" }}>
            Welcome to Which Renewables
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14px, 1.8vw, 18px)", color: "rgba(255,255,255,0.5)", maxWidth: "480px", lineHeight: 1.75, fontWeight: 300 }}>
            Your trusted digital hub for renewable energy professionals across the UK & Ireland
          </motion.p>
        </motion.div>

        <motion.div className="absolute bottom-8 right-8 md:right-16 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Scroll</span>
          <motion.div className="w-px h-10 origin-top"
            style={{ background: "linear-gradient(to bottom, rgba(16,185,129,0.6), transparent)" }}
            animate={{ scaleY: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        </motion.div>
      </div>

      {/* ── ABOUT CARDS ── */}
      <section id="about-which-renewables" className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-10" style={{ background: "#10b981" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.22em", color: "#10b981", textTransform: "uppercase", fontWeight: 600 }}>Our Foundation</span>
          </div>
          <h2 className="font-bold text-white"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", lineHeight: 1.2, marginBottom: "12px" }}>
            What We Stand For
          </h2>
          <div className="h-px w-12" style={{ background: "linear-gradient(90deg, #10b981, transparent)" }} />
        </motion.div>

        <div className="space-y-6">
          {aboutCards.map((card, index) => (
            <AboutCard key={index} card={card} index={index} />
          ))}
        </div>
      </section>

      {/* Meet Our Team Section */}
      {/* <MeetOurTeam /> */}
      
      {/* Expert Panel Section */}
      {/* <ExpertPanel /> */}

      {/* Blogs Section */}
      {/* <BlogsSection /> */}
    </div>
  );
};

export default About;
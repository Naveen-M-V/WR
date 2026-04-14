import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MeetOurTeam from './meetourteam';
import ScrollingBanner from './home/ScrollingBanner'; 

const MeetOurTeamPage = () => {
  const heroRef = useRef(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen selection:bg-emerald-500/30" style={{ background: "#040e1e", color: "#ffffff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;700&display=swap');
        .hero-text-mask {
          background: linear-gradient(175deg, #ffffff 0%, rgba(255,255,255,0.6) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* --- HERO SECTION --- */}
      <motion.div
        ref={heroRef}
        className="relative w-full overflow-hidden"
        style={{ height: "clamp(420px, 70vh, 750px)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/About/team.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(1.08) saturate(1.2)",
          }}
        />

        {/* overlays */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(4,14,30,0.25) 0%, rgba(4,14,30,0.55) 60%, #040e1e 100%)" }} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(4,14,30,0.6) 0%, rgba(4,14,30,0.1) 60%, transparent 100%)" }} />

        <motion.div
          className="absolute inset-0 flex flex-col justify-end pb-16 px-8 md:px-16 lg:px-24 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-px w-10" style={{ background: "#10b981" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.22em", color: "#10b981", textTransform: "uppercase", fontWeight: 500 }}>
              The Human Element
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hero-text-mask mb-5"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.8rem, 4vw, 5.5rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em" }}
          >
            Meet Our Team
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14px, 1.8vw, 17px)", color: "rgba(255,255,255,0.5)", maxWidth: "520px", lineHeight: 1.75, fontWeight: 300 }}
          >
            Delivering the industry leading Digital Information platform for Green Sector professionals.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            onClick={() => document.getElementById("team")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-8 self-start inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300"
            style={{ background: "#10b981", color: "white", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 0 24px rgba(16,185,129,0.35)" }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 36px rgba(16,185,129,0.5)" }}
            whileTap={{ scale: 0.97 }}
          >
            Meet The Team
            <ArrowRight size={14} />
          </motion.button>
        </motion.div>

        {/* scroll hint */}
        <motion.div
          className="absolute bottom-8 right-8 md:right-16 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Scroll</span>
          <motion.div
            className="w-px h-10 origin-top"
            style={{ background: "linear-gradient(to bottom, rgba(16,185,129,0.6), transparent)" }}
            animate={{ scaleY: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      {/* --- BANNER INTEGRATION --- */}
      <div className="relative z-30 shadow-2xl">
        <ScrollingBanner />
      </div>

      {/* --- TEAM GRID SECTION --- */}
      <section id="team" className="relative py-24 md:py-32 overflow-hidden">
        {/* Background Textures */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Decorative ambient light */}
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <MeetOurTeam />
        </div>
      </section>

      {/* Simple elegant footer border */}
      <div className="h-2 w-full bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
    </div>
  );
};

export default MeetOurTeamPage;
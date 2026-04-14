import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ExpertPanel from './ExpertPanel';
import ScrollingBanner from './home/ScrollingBanner';

const ExpertPanelPage = () => {
  const heroRef = useRef(null);
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

      <ScrollingBanner />

      
        
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(4,14,30,0.25) 0%, rgba(4,14,30,0.55) 60%, #040e1e 100%)" }} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(4,14,30,0.6) 0%, rgba(4,14,30,0.1) 60%, transparent 100%)" }} />

        

       

      {/* --- EXPERT PANEL SECTION --- */}
      <section id="experts" className="relative pt-24 pb-20">
        <ExpertPanel />
      </section>

      {/* Simple elegant footer border */}
      <div className="h-2 w-full bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
    </div>
  );
};

export default ExpertPanelPage;
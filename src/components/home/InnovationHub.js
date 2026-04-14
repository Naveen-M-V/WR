import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Leaf, Globe, Battery, Cpu, Wind } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getContent } from "../../utils/contentAPI";

/* ─────────────────────────────────────────────────────────────
   EXPANDING CARD
───────────────────────────────────────────────────────────── */

const limitWords = (text, maxWords) => {
  if (!text) return "";
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
};

const ShowcaseCard = ({ card, isHovered, isMobile, onHover, onLeave, onClick }) => {
  const Icon = card.icon;

  return (
    <motion.div
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="relative rounded-2xl overflow-hidden cursor-pointer flex-shrink-0"
      style={{ height: "clamp(300px, 42vh, 420px)" }}
      animate={{
        width: isMobile ? 260 : isHovered ? 440 : 200,
        y: isHovered ? -8 : 0,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 28 }}
    >
      {/* background image */}
      <motion.img
        src={card.image}
        alt={card.title}
        className="absolute inset-0 w-full h-full object-cover"
        animate={{ scale: isHovered ? 1.08 : 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />

      {/* base overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(4,14,30,0.95) 0%, rgba(4,14,30,0.4) 55%, rgba(4,14,30,0.15) 100%)" }}
      />

      {/* accent top border — glows on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)`,
          opacity: isHovered ? 1 : 0.3,
        }}
      />

      {/* ambient glow on hover */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, rgba(${card.accentRgb},0.22), transparent 65%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* tag pill — top left */}
      <div
        className="absolute top-4 left-4 px-2.5 py-1 rounded-full border"
        style={{
          borderColor: `rgba(255,255,255,0.16)`,
          background: `rgba(75,85,99,0.88)`,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "9.5px",
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#f3f4f6",
        }}
      >
        {card.tag}
      </div>

      {/* icon — top right */}
      <div
        className="absolute top-4 right-4 w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300"
        style={{
          borderColor: "rgba(255,255,255,0.14)",
          background: "rgba(17,24,39,0.82)",
          boxShadow: isHovered ? "0 0 16px rgba(0,0,0,0.35)" : "none",
        }}
      >
        <Icon size={15} style={{ color: card.accent }} />
      </div>

      {/* content — bottom */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-10"
        style={{ background: "linear-gradient(to top, rgba(4,14,30,0.98) 60%, transparent)" }}
      >
        <h3
          className="mb-2 font-bold leading-tight text-white"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1rem, 1.4vw, 1.2rem)" }}
        >
          {limitWords(card.title, 5)}
        </h3>

        {/* accent rule */}
        <div
          className="mb-3 h-px transition-all duration-500"
          style={{
            background: `linear-gradient(90deg, ${card.accent}, transparent)`,
            width: isHovered ? "56px" : "24px",
          }}
        />

        <motion.p
          animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? "auto" : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12.5px",
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.65,
            fontWeight: 300,
            overflow: "hidden",
            marginBottom: isHovered ? "14px" : "0",
          }}
        >
          {limitWords(card.subtitle, 15)}
        </motion.p>

        <motion.div
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 8 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="inline-flex items-center gap-1.5 text-xs font-medium"
          style={{ color: card.accent, fontFamily: "'DM Sans', sans-serif" }}
        >
          View Innovation
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SECTION
───────────────────────────────────────────────────────────── */
export default function RenovationShowcaseHub() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawData = await getContent("innovations");
        if (rawData && rawData.length > 0) {
          const accentColors = [
            { accent: "#f59e0b", accentRgb: "245,158,11" },
            { accent: "#06b6d4", accentRgb: "6,182,212" },
            { accent: "#8b5cf6", accentRgb: "139,92,246" },
            { accent: "#10b981", accentRgb: "16,185,129" },
            { accent: "#84cc16", accentRgb: "132,204,22" },
            { accent: "#ec4899", accentRgb: "236,72,153" },
          ];
          const mapped = rawData.map((item, i) => {
            const colors = accentColors[i % accentColors.length];
            return {
              id: item.id || `innovation-${i}`,
              title: item.name || item.title || "Untitled",
              subtitle: item.description || "No description available.",
              image: item.image || "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80",
              icon: item.type === "product" ? Battery : item.type === "service" ? Zap : Globe,
              tag: item.type || "Innovation",
              accent: colors.accent,
              accentRgb: colors.accentRgb,
              companySlug: item.companySlug || item.companyId || item.slug || "",
              company: item.company || item.companyName || "",
            };
          });
          setCards(mapped);
        }
      } catch (err) {
        // keep empty state
      }
    };
    fetchData();
  }, []);

  const handleCardClick = (card) => {
    const slug = card.companySlug || card.company?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-") || card.id;
    navigate(`/company/${slug}?tab=innovation`);
  };

  return (
    <section
      className="relative overflow-hidden py-14 md:py-16"
      style={{ background: "#040e1e" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-60 left-1/4 w-[700px] h-[500px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(ellipse, #10b981, transparent 65%)" }}
        />
        <div
          className="absolute -bottom-40 right-1/4 w-[500px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(ellipse, #06b6d4, transparent 65%)" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            {/* eyebrow */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10" style={{ background: "#10b981" }} />
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px",
                  letterSpacing: "0.22em",
                  color: "#10b981",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                Featured Innovations
              </span>
            </div>

            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4.5vw, 3.6rem)",
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
              }}
            >
              Innovation
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #10b981, #06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Showcase
              </span>
            </h2>
          </div>

          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(13px, 1.4vw, 15px)",
              color: "rgba(255,255,255,0.4)",
              lineHeight: 1.8,
              fontWeight: 300,
              maxWidth: "400px",
            }}
          >
            The renewable energy sector is ever evolving. This platform gives designers and companies the opportunity to showcase the latest innovations shaping a greener future.
          </p>
        </motion.div>

        {/* ── CARD STRIP ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 px-4 sm:px-0 -mx-4 sm:mx-0"
          style={{ cursor: "default" }}
        >
          {cards.slice(0, 6).map((card, i) => (
            <ShowcaseCard
              key={card.id}
              card={card}
              isHovered={hoveredIndex === i}
              isMobile={isMobile}
              onHover={() => setHoveredIndex(i)}
              onLeave={() => setHoveredIndex(null)}
              onClick={() => handleCardClick(card)}
            />
          ))}
        </motion.div>

        {/* ── VIEW ALL CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex justify-center"
        >
          <motion.button
            onClick={() => navigate("/showcase-hub/innovation-hub")}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border text-sm font-medium transition-all duration-300"
            style={{
              borderColor: "rgba(16,185,129,0.3)",
              color: "#10b981",
              background: "rgba(16,185,129,0.06)",
              fontFamily: "'DM Sans', sans-serif",
            }}
            whileHover={{ scale: 1.04, background: "rgba(16,185,129,0.14)", borderColor: "#10b981" }}
            whileTap={{ scale: 0.97 }}
          >
            View All Innovations
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
}
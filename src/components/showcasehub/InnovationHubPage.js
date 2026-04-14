import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Sparkles, Globe, Building2, Package, Newspaper,
  ChevronDown, CheckCircle, TrendingUp, Award, ArrowRight, Zap,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import ScrollingBanner from "../home/ScrollingBanner";

const CATEGORY_INFO = {
  "renewable-energy":   { name: "Renewable Energy",              accent: "#10b981", rgb: "16,185,129" },
  "sustainable":        { name: "Sustainable",                   accent: "#06b6d4", rgb: "6,182,212" },
  "environmental":      { name: "Environmental",                 accent: "#3b82f6", rgb: "59,130,246" },
  "energy-management":  { name: "Energy Management & Efficiency", accent: "#f59e0b", rgb: "245,158,11" },
  "ahead-of-curve":     { name: "Get Ahead Of The Curve",        accent: "#8b5cf6", rgb: "139,92,246" },
  "hot-off-press":      { name: "Hot Off The Press",             accent: "#ef4444", rgb: "239,68,68" },
};

const TYPE_ICON  = { product: Package, service: Building2, news: Newspaper };
const TYPE_ACCENT = { product: "#06b6d4", service: "#8b5cf6", news: "#f59e0b" };

/* ─────────────────────────────────────────────────────────────
   INNOVATION CARD
───────────────────────────────────────────────────────────── */
const InnovationCard = ({ innovation, index, onExplore }) => {
  const [hovered, setHovered] = useState(false);

  const catInfo = innovation.category
    ? (CATEGORY_INFO[innovation.category] || { name: innovation.category, accent: "#10b981", rgb: "16,185,129" })
    : { name: "Innovation", accent: "#10b981", rgb: "16,185,129" };

  const TypeIcon = TYPE_ICON[innovation.type] || Sparkles;

  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative overflow-hidden rounded-2xl border transition-all duration-500"
        style={{
          borderColor: hovered ? `rgba(${catInfo.rgb},0.4)` : "rgba(255,255,255,0.07)",
          background: hovered
            ? `linear-gradient(135deg, rgba(${catInfo.rgb},0.08) 0%, rgba(4,14,30,0.98) 100%)`
            : "rgba(255,255,255,0.025)",
          boxShadow: hovered
            ? `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(${catInfo.rgb},0.2)`
            : "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {/* top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-500 z-10"
          style={{
            background: `linear-gradient(90deg, transparent, ${catInfo.accent}, transparent)`,
            opacity: hovered ? 1 : 0.2,
          }}
        />

        <div className="flex flex-col md:flex-row">

          {/* ── IMAGE ── */}
          {innovation.image && (
            <div
              className="relative overflow-hidden flex-shrink-0"
              style={{ width: "clamp(180px, 28%, 300px)", minHeight: "200px" }}
            >
              <motion.img
                src={innovation.image}
                alt={innovation.name || "Innovation"}
                className="absolute inset-0 w-full h-full object-cover"
                animate={{ scale: hovered ? 1.06 : 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(90deg, rgba(4,14,30,0) 40%, rgba(4,14,30,0.88) 100%)" }}
              />

              {/* type badge */}
              <div
                className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
                style={{
                  borderColor: `rgba(${catInfo.rgb},0.4)`,
                  background: `rgba(${catInfo.rgb},0.12)`,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "9.5px",
                  fontWeight: 600,
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  color: catInfo.accent,
                }}
              >
                <TypeIcon size={9} />
                {innovation.type || "Innovation"}
              </div>

              {/* category badge */}
              <div
                className="absolute bottom-4 left-4 px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(4,14,30,0.7)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "9.5px",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {catInfo.name}
              </div>
            </div>
          )}

          {/* ── CONTENT ── */}
          <div className="flex-1 flex flex-col px-6 md:px-8 py-6">

            {/* company + logo */}
            <div className="flex items-start justify-between gap-4 mb-3">
              {innovation.companyName && (
                <div className="flex items-center gap-2">
                  <Building2 size={11} style={{ color: catInfo.accent }} />
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "11px",
                    color: catInfo.accent,
                    fontWeight: 500,
                    opacity: 0.85,
                    letterSpacing: "0.05em",
                  }}>
                    {innovation.companyName}
                  </span>
                </div>
              )}
              {innovation.companyLogo && (
                <img
                  src={innovation.companyLogo}
                  alt={innovation.companyName}
                  className="w-10 h-10 rounded-xl object-contain flex-shrink-0 border"
                  style={{ background: "rgba(255,255,255,0.94)", borderColor: "rgba(255,255,255,0.12)", padding: "2px" }}
                />
              )}
            </div>

            {/* title */}
            <h3
              className="mb-3 font-bold text-white leading-snug"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1rem, 1.5vw, 1.25rem)" }}
            >
              {innovation.name || "Unnamed Innovation"}
            </h3>

            {/* accent rule */}
            <div
              className="mb-3 h-px transition-all duration-500"
              style={{
                background: `linear-gradient(90deg, ${catInfo.accent}, transparent)`,
                width: hovered ? "52px" : "24px",
              }}
            />

            {/* description */}
            {innovation.description && (
              <p
                className="mb-4 line-clamp-2"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.52)",
                  lineHeight: 1.7,
                  fontWeight: 300,
                }}
              >
                {innovation.description}
              </p>
            )}

            {/* feature pills */}
            {innovation.keyFeatures?.some(f => f) && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {innovation.keyFeatures.filter(f => f).slice(0, 4).map((f, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
                    style={{
                      borderColor: `rgba(${catInfo.rgb},0.2)`,
                      background: `rgba(${catInfo.rgb},0.05)`,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "10px",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    <CheckCircle size={9} style={{ color: catInfo.accent }} />
                    {f}
                  </span>
                ))}
              </div>
            )}

            {/* products & services pills */}
            {innovation.productsServices?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {innovation.productsServices.slice(0, 4).map((ps, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full border"
                    style={{
                      borderColor: "rgba(6,182,212,0.3)",
                      background: "rgba(6,182,212,0.08)",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "9px",
                      color: "#06b6d4",
                    }}
                  >
                    {ps}
                  </span>
                ))}
              </div>
            )}

            <div className="flex-1" />

            {/* action row */}
            <div
              className="flex items-center justify-between gap-3 pt-4 flex-wrap"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
            >
              <button
                onClick={() => onExplore(innovation)}
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-200"
                style={{ color: catInfo.accent, fontFamily: "'DM Sans', sans-serif", fontSize: "13px" }}
              >
                Explore More
                <ArrowRight size={13} />
              </button>

              {innovation.link && (
                <a
                  href={innovation.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-200"
                  style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", fontSize: "12px" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#ffffff"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
                >
                  <Globe size={12} />
                  Visit Website
                  <ArrowRight size={11} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

/* ─────────────────────────────────────────────────────────────
   INNOVATION MODAL
───────────────────────────────────────────────────────────── */
const InnovationModal = ({ innovation, onClose }) => {
  if (!innovation) return null;

  const catInfo = innovation.category
    ? (CATEGORY_INFO[innovation.category] || { name: innovation.category, accent: "#10b981", rgb: "16,185,129" })
    : { name: "Innovation", accent: "#10b981", rgb: "16,185,129" };

  const TypeIcon = TYPE_ICON[innovation.type] || Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(4,14,30,0.88)", backdropFilter: "blur(14px)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-2xl border overflow-hidden modal-scroll"
        style={{
          maxHeight: "85vh",
          overflowY: "auto",
          background: "rgba(4,14,30,0.97)",
          borderColor: `rgba(${catInfo.rgb},0.25)`,
          boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(${catInfo.rgb},0.15), inset 0 1px 0 rgba(255,255,255,0.07)`,
          scrollbarWidth: "thin",
          scrollbarColor: `rgba(${catInfo.rgb},0.4) rgba(255,255,255,0.02)`,
          "--modal-accent": `rgba(${catInfo.rgb},0.4)`,
          "--modal-accent-hover": `rgba(${catInfo.rgb},0.65)`,
        }}
      >
        {/* top accent bar */}
        <div className="h-[2px] flex-shrink-0"
          style={{ background: `linear-gradient(90deg, transparent, ${catInfo.accent}, transparent)` }} />

        {/* close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200"
          style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = `rgba(${catInfo.rgb},0.5)`; e.currentTarget.style.color = catInfo.accent; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
        >
          <ChevronDown size={14} style={{ transform: "rotate(45deg)" }} />
        </button>

        <div className="p-8">
          {/* header */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {innovation.image && (
              <div className="flex-shrink-0 w-full md:w-48 h-40 md:h-48 rounded-xl overflow-hidden border"
                style={{ borderColor: `rgba(${catInfo.rgb},0.2)` }}>
                <img src={innovation.image} alt={innovation.name} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex-1">
              {/* badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
                  style={{ borderColor: `rgba(${catInfo.rgb},0.4)`, background: `rgba(${catInfo.rgb},0.1)`, fontFamily: "'DM Sans', sans-serif", fontSize: "9.5px", fontWeight: 600, letterSpacing: "0.13em", textTransform: "uppercase", color: catInfo.accent }}
                >
                  <TypeIcon size={9} />
                  {innovation.type || "Innovation"}
                </div>
                {innovation.status && (
                  <div
                    className="px-2.5 py-1 rounded-full border"
                    style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", fontFamily: "'DM Sans', sans-serif", fontSize: "9.5px", color: "rgba(255,255,255,0.5)" }}
                  >
                    {innovation.status}
                  </div>
                )}
              </div>

              {/* name */}
              <h2
                className="font-bold text-white leading-tight mb-2"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)" }}
              >
                {innovation.name || "Unnamed Innovation"}
              </h2>

              {/* company */}
              {innovation.companyName && (
                <p className="mb-3" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: catInfo.accent, fontWeight: 500 }}>
                  {innovation.companyName}
                </p>
              )}

              {/* rule */}
              <div className="mb-4 h-px w-12" style={{ background: `linear-gradient(90deg, ${catInfo.accent}, transparent)` }} />

              {/* description */}
              {innovation.description && (
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, fontWeight: 300 }}>
                  {innovation.description}
                </p>
              )}
            </div>
          </div>

          {/* details grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* key info */}
            <div className="rounded-xl p-5 border"
              style={{ borderColor: `rgba(${catInfo.rgb},0.2)`, background: `rgba(${catInfo.rgb},0.05)` }}>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={13} style={{ color: catInfo.accent }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: catInfo.accent, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Key Information
                </span>
              </div>
              {[
                { label: "Type", value: innovation.type },
                { label: "Status", value: innovation.status },
                { label: "Category", value: catInfo.name },
              ].map(({ label, value }) => value ? (
                <div key={label} className="flex justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{label}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.7)", fontWeight: 500, textTransform: "capitalize" }}>{value}</span>
                </div>
              ) : null)}
            </div>

            {/* products & services */}
            {innovation.productsServices?.length > 0 && (
              <div className="rounded-xl p-5 border"
                style={{ borderColor: "rgba(6,182,212,0.2)", background: "rgba(6,182,212,0.05)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={13} style={{ color: "#06b6d4" }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#06b6d4", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    Products & Services
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {innovation.productsServices.map((ps, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full text-xs"
                      style={{ fontFamily: "'DM Sans', sans-serif", background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.3)", color: "#06b6d4" }}>
                      {ps}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* all features */}
            {innovation.keyFeatures?.filter(f => f).length > 0 && (
              <div className="rounded-xl p-5 border"
                style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <Award size={13} style={{ color: "rgba(255,255,255,0.4)" }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    All Features
                  </span>
                </div>
                <ul className="space-y-2">
                  {innovation.keyFeatures.filter(f => f).map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span style={{ color: catInfo.accent, marginTop: "5px", flexShrink: 0, fontSize: "6px" }}>●</span>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: "rgba(255,255,255,0.55)", lineHeight: 1.65, fontWeight: 300 }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* visit website */}
          {innovation.link && (
            <div className="mt-6 flex justify-end">
              <a
                href={innovation.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-300"
                style={{ borderColor: `rgba(${catInfo.rgb},0.35)`, background: `rgba(${catInfo.rgb},0.08)`, color: catInfo.accent, fontFamily: "'DM Sans', sans-serif" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = `rgba(${catInfo.rgb},0.18)`; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = `rgba(${catInfo.rgb},0.08)`; }}
              >
                <Globe size={13} />
                Visit Website
                <ArrowRight size={12} />
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */
const InnovationHubPage = () => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [innovations, setInnovations] = useState([]);
  const [selectedInnovation, setSelectedInnovation] = useState(null);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  useEffect(() => {
    const load = async () => {
      try {
        const { getContent } = await import("../../utils/contentAPI");
        const data = await getContent("innovations");
        if (Array.isArray(data)) setInnovations(data);
      } catch (error) {
        console.error("Error loading innovations:", error);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category");
    if (cat) {
      setSelectedCategory(cat);
      setTimeout(() => {
        document.getElementById(`category-${cat}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [location.search]);

  const availableCategories = ["all", ...Array.from(new Set(innovations.map(i => i.category).filter(Boolean)))];

  const filtered = innovations.filter(i => selectedCategory === "all" || i.category === selectedCategory);

  return (
    <div className="min-h-screen text-white overflow-hidden" style={{ background: "#040e1e" }}>

      <ScrollingBanner />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');
        .hero-text-mask {
          background: linear-gradient(175deg, #ffffff 0%, rgba(255,255,255,0.62) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .modal-scroll::-webkit-scrollbar { width: 5px; }
        .modal-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 99px; }
        .modal-scroll::-webkit-scrollbar-thumb { background: var(--modal-accent, rgba(16,185,129,0.4)); border-radius: 99px; }
        .modal-scroll::-webkit-scrollbar-thumb:hover { background: var(--modal-accent-hover, rgba(16,185,129,0.65)); }
      `}</style>

      {/* ambient blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #10b981, transparent 70%)" }} />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)" }} />
      </div>

      {/* ── HERO ── */}
      <div ref={heroRef} className="relative w-full overflow-hidden" style={{ height: "clamp(360px, 65vh, 620px)" }}>
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <img
            src="/show/hub.jpeg"
            alt="Innovation Hub"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(1.08) saturate(1.2)" }}
          />
        </motion.div>
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(4,14,30,0.25) 0%, rgba(4,14,30,0.55) 60%, #040e1e 100%)" }} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(4,14,30,0.65) 0%, rgba(4,14,30,0.1) 60%, transparent 100%)" }} />

        <motion.div
          className="absolute inset-0 flex flex-col justify-end pb-16 px-8 md:px-16 lg:px-24 w-full"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-px w-10" style={{ background: "#10b981" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.22em", color: "#10b981", textTransform: "uppercase", fontWeight: 500 }}>
              Showcase Hub
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hero-text-mask mb-5"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 4vw, 5rem)", fontWeight: 700, lineHeight: 1.06, letterSpacing: "-0.02em" }}
          >
            Innovation Hub
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14px, 1.8vw, 18px)", color: "rgba(255,255,255,0.5)", maxWidth: "500px", lineHeight: 1.75, fontWeight: 300 }}
          >
            Discover. Inspire. Transform.
          </motion.p>
        </motion.div>

        <motion.div
          className="absolute bottom-8 right-8 md:right-16 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
        >
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Scroll</span>
          <motion.div className="w-px h-10 origin-top"
            style={{ background: "linear-gradient(to bottom, rgba(16,185,129,0.6), transparent)" }}
            animate={{ scaleY: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        </motion.div>
      </div>

      {/* ── INTRO ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pt-20 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-2xl border border-white/[0.07] p-8 md:p-10"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.4), transparent)" }} />
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14px, 1.5vw, 16px)", color: "rgba(255,255,255,0.6)", lineHeight: 1.85, fontWeight: 300 }}>
            <span style={{ color: "#10b981", fontWeight: 500 }}>This section showcases</span> new products and technology — innovators, solution providers and industry change-makers who have accelerated the future of renewable energy. This Innovation Hub highlights breakthrough technologies, forward-thinking concepts, and transformative projects shaping the next era of sustainability.
          </p>
        </motion.div>
      </div>

      {/* ── STICKY FILTER BAR ── */}
      <div
        className="sticky top-[88px] z-40 border-b"
        style={{ background: "rgba(4,14,30,0.9)", backdropFilter: "blur(24px)", borderColor: "rgba(255,255,255,0.07)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-3 flex items-center gap-2 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}>
          {availableCategories.map((cat) => {
            const info = cat === "all"
              ? { name: "All Innovations", accent: "#10b981", rgb: "16,185,129" }
              : (CATEGORY_INFO[cat] || { name: cat, accent: "#10b981", rgb: "16,185,129" });
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="flex-shrink-0 px-4 py-2 rounded-full border text-xs font-medium transition-all duration-300"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  borderColor: active ? `rgba(${info.rgb},0.5)` : "rgba(255,255,255,0.08)",
                  background: active ? `rgba(${info.rgb},0.12)` : "transparent",
                  color: active ? info.accent : "rgba(255,255,255,0.45)",
                  letterSpacing: "0.04em",
                  boxShadow: active ? `0 0 16px rgba(${info.rgb},0.15)` : "none",
                }}
              >
                {info.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── GRID ── */}
      <section id="innovation-hub-section" className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-12 pb-24">

        <div className="flex items-center gap-4 mb-8">
          <div className="h-px w-8" style={{ background: "rgba(255,255,255,0.1)" }} />
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(14px, 1.8vw, 18px)", color: "rgba(255,255,255,0.28)", fontStyle: "italic", whiteSpace: "nowrap" }}>
            {selectedCategory === "all"
              ? `${filtered.length} innovation${filtered.length !== 1 ? "s" : ""}`
              : `${CATEGORY_INFO[selectedCategory]?.name || selectedCategory} — ${filtered.length} entr${filtered.length !== 1 ? "ies" : "y"}`}
          </p>
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.1)" }} />
        </div>

        {filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map((innovation, idx) => (
              <InnovationCard
                key={innovation.id}
                innovation={innovation}
                index={idx}
                onExplore={setSelectedInnovation}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 rounded-2xl border"
            style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <Sparkles size={20} style={{ color: "#10b981" }} />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "#ffffff", marginBottom: "8px" }}>
              No Innovations Yet
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
              Innovations added through the admin panel will appear here.
            </p>
          </motion.div>
        )}
      </section>
      <AnimatePresence>
        {selectedInnovation && (
          <InnovationModal
            innovation={selectedInnovation}
            onClose={() => setSelectedInnovation(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default InnovationHubPage;
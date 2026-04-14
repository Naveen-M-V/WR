import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import ScrollingBanner from "../home/ScrollingBanner";
import {
  Trophy, Calendar, Search, Sparkles, Star, Award,
  Medal, Eye, Filter, ChevronDown, X,
} from "lucide-react";
import { API_HOST } from "../../config";

const CATEGORY_ICONS = [Star, Trophy, Award, Sparkles, Eye, Medal];
const ACCENT_COLORS = [
  { hex: "#f59e0b", rgb: "245,158,11"  },
  { hex: "#10b981", rgb: "16,185,129"  },
  { hex: "#06b6d4", rgb: "6,182,212"   },
  { hex: "#8b5cf6", rgb: "139,92,246"  },
  { hex: "#ec4899", rgb: "236,72,153"  },
  { hex: "#3b82f6", rgb: "59,130,246"  },
];

/* ─────────────────────────────────────────────────────────────
   IMAGE HELPER — resolve image paths from API
───────────────────────────────────────────────────────────── */
const resolveImages = (award) => {
  // ── DEBUG: log the raw award object so you can see all fields ──
  console.log("[HallOfFame] award data:", JSON.stringify(award, null, 2));

  // Collect every possible image field the API might use
  const candidates = [
    award.personImage,
    award.image,
    award.logo,
    award.photo,
    ...(Array.isArray(award.eventImages) ? award.eventImages : []),
    ...(Array.isArray(award.images)      ? award.images      : []),
    ...(Array.isArray(award.photos)      ? award.photos      : []),
  ].filter(Boolean);

  console.log("[HallOfFame] raw image candidates:", candidates);

  if (candidates.length === 0) return ["/about.jpg"];

  const resolved = candidates.map((img) => {
    if (typeof img !== "string") return null;
    const trimmed = img.trim();
    if (!trimmed) return null;
    // Already a full URL
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
    // Prepend API host, avoid double slashes
    const separator = trimmed.startsWith("/") ? "" : "/";
    return `${API_HOST}${separator}${trimmed}`;
  }).filter(Boolean);

  console.log("[HallOfFame] resolved image URLs:", resolved);

  return resolved.length > 0 ? resolved : ["/about.jpg"];
};

const AwardModal = ({ award, onClose, accent }) => {
  if (!award) return null;
  const images = resolveImages(award);
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
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-2xl border overflow-hidden"
        style={{
          maxHeight: "85vh", overflowY: "auto",
          background: "rgba(4,14,30,0.97)",
          borderColor: `rgba(${accent.rgb},0.25)`,
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
          scrollbarWidth: "thin",
          scrollbarColor: `rgba(${accent.rgb},0.4) rgba(255,255,255,0.02)`,
        }}
      >
        <div className="h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${accent.hex}, transparent)` }} />

        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200"
          style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = `rgba(${accent.rgb},0.5)`; e.currentTarget.style.color = accent.hex; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
        >
          <X size={14} />
        </button>

        {/* image carousel */}
        {images.length > 0 && (
          <div className="relative overflow-hidden" style={{ height: "280px" }}>
            <img src={images[0]} alt={award.companyName || award.personName} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(4,14,30,0.95) 100%)" }} />
            
            {/* award badge */}
            <div
              className="absolute bottom-4 left-6 px-3 py-1.5 rounded-full border"
              style={{ borderColor: `rgba(${accent.rgb},0.4)`, background: `rgba(${accent.rgb},0.12)`, fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.13em", textTransform: "uppercase", color: accent.hex }}
            >
              Hall of Fame / Industry Hero
            </div>

            {/* year badge */}
            {award.awardYear && (
              <div
                className="absolute bottom-4 right-6 px-3 py-1.5 rounded-full border"
                style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.7)" }}
              >
                <Calendar size={12} className="inline mr-1.5" style={{ color: accent.hex }} />
                {award.awardYear}
              </div>
            )}
          </div>
        )}

        <div className="p-8">
          {/* company/person names */}
          <div className="mb-4">
            <h2 className="font-bold text-white leading-tight"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)" }}>
              {award.companyName || award.personName || "Award Recipient"}
            </h2>
            {award.personName && award.companyName && (
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: accent.hex, fontWeight: 500, marginTop: "4px" }}>
                {award.personName}
              </p>
            )}
          </div>

          {/* award title */}
          <div className="mb-5">
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>
              Award Title
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", color: accent.hex, fontWeight: 500 }}>
              {award.awardTitle || "WR Distinction Award"}
            </p>
          </div>

          {/* accent divider */}
          <div className="mb-5 h-px w-16" style={{ background: `linear-gradient(90deg, ${accent.hex}, transparent)` }} />

          {/* full description */}
          <div className="mb-4">
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
              Award Description
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "rgba(255,255,255,0.7)", lineHeight: 1.8, fontWeight: 300 }}>
              {award.awardDescription || "Recognised for outstanding leadership, innovation, and impact across the clean energy and sustainability space, driving transformative change in the industry."}
            </p>
          </div>

          {/* additional images */}
          {images.length > 1 && (
            <div className="mt-6">
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
                Gallery
              </p>
              <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "thin", scrollbarColor: `rgba(${accent.rgb},0.4) rgba(255,255,255,0.02)` }}>
                {images.slice(1).map((img, i) => (
                  <img key={i} src={img} alt={`Gallery ${i + 1}`} className="h-24 w-36 object-cover rounded-lg border"
                    style={{ borderColor: `rgba(${accent.rgb},0.2)`, flexShrink: 0 }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   AWARD CARD
───────────────────────────────────────────────────────────── */
const AwardCard = ({ award, index, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];
  const Icon = CATEGORY_ICONS[index % CATEGORY_ICONS.length];
  const images = resolveImages(award);
  const imgSrc = imgError ? "/about.jpg" : images[0];

  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="cursor-pointer"
    >
      <div
        className="relative overflow-hidden rounded-2xl border transition-all duration-500 flex flex-col md:flex-row"
        style={{
          borderColor: hovered ? `rgba(${accent.rgb},0.4)` : "rgba(255,255,255,0.07)",
          background: hovered
            ? `linear-gradient(135deg, rgba(${accent.rgb},0.08) 0%, rgba(4,14,30,0.98) 100%)`
            : "rgba(255,255,255,0.025)",
          boxShadow: hovered
            ? `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(${accent.rgb},0.2)`
            : "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {/* top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] z-10 transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent.hex}, transparent)`,
            opacity: hovered ? 1 : 0.25,
          }}
        />

        {/* ── IMAGE PANEL ── */}
        <div
          className="relative overflow-hidden flex-shrink-0"
          style={{ width: "clamp(140px, 22%, 220px)", minHeight: "160px" }}
        >
          <img
            src={imgSrc}
            alt={`${award.personName || award.companyName}`}
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setImgError(true)}
          />

          <div className="absolute inset-0"
            style={{ background: "linear-gradient(90deg, rgba(4,14,30,0) 40%, rgba(4,14,30,0.85) 100%)" }} />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(4,14,30,0.7) 0%, transparent 50%)" }} />

          {/* category icon */}
          <div
            className="absolute top-3 left-3 w-7 h-7 rounded-xl flex items-center justify-center border"
            style={{
              borderColor: `rgba(${accent.rgb},0.4)`,
              background: `rgba(${accent.rgb},0.12)`,
            }}
          >
            <Icon size={12} style={{ color: accent.hex }} />
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="flex-1 flex flex-col px-6 md:px-8 py-5">

          {/* company + year */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h3
                className="font-bold text-white leading-snug"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1rem, 1.5vw, 1.15rem)" }}
              >
                {award.companyName || award.personName || "Award Recipient"}
              </h3>
              {award.personName && award.companyName && (
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: accent.hex, fontWeight: 500, marginTop: "3px" }}>
                  {award.personName}
                </p>
              )}
            </div>

            {award.awardYear && (
              <div
                className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
                style={{
                  borderColor: "rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "10.5px",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                <Calendar size={10} style={{ color: accent.hex }} />
                {award.awardYear}
              </div>
            )}
          </div>

          {/* award title */}
          <div className="mb-3">
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9.5px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "3px" }}>
              Hall of Fame / Industry Hero
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: accent.hex, fontWeight: 500 }}>
              {award.awardTitle || "WR Distinction Award"}
            </p>
          </div>

          {/* accent rule */}
          <div
            className="mb-3 h-px transition-all duration-500"
            style={{
              background: `linear-gradient(90deg, ${accent.hex}, transparent)`,
              width: hovered ? "52px" : "24px",
            }}
          />

          {/* description */}
          <p
            className="line-clamp-3 flex-1"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12.5px",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            {award.awardDescription || "Recognised for outstanding leadership, innovation, and impact across the clean energy and sustainability space, driving transformative change in the industry."}
          </p>

          {/* view details button */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium"
            style={{ color: accent.hex, fontFamily: "'DM Sans', sans-serif" }}
          >
            <Eye size={12} />
            View Details
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.div>
        </div>

        {/* ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-700"
          style={{
            background: `radial-gradient(ellipse at 20% 50%, rgba(${accent.rgb},0.09), transparent 60%)`,
            opacity: hovered ? 1 : 0,
          }}
        />
      </div>
    </motion.article>
  );
};

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */
const HallOfFamePage = () => {
  const [selectedYear, setSelectedYear] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedAward, setSelectedAward] = useState(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { getContent } = await import("../../utils/contentAPI");
        const data = await getContent("hallOfFame");
        if (Array.isArray(data)) setAwards(data);
      } catch (error) {
        console.error("Error loading awards:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const uniqueYears = ["all", ...Array.from(new Set(awards.map((a) => a.awardYear).filter(Boolean))).sort((a, b) => b - a)];

  const filtered = awards.filter((award) => {
    const matchYear = selectedYear === "all" || award.awardYear === selectedYear;
    const q = searchTerm.toLowerCase();
    const matchSearch = !searchTerm ||
      award.personName?.toLowerCase().includes(q) ||
      award.companyName?.toLowerCase().includes(q) ||
      award.awardDescription?.toLowerCase().includes(q) ||
      award.awardTitle?.toLowerCase().includes(q);
    return matchYear && matchSearch;
  });

  const hasFilters = searchTerm || selectedYear !== "all";

  return (
    <div className="min-h-screen text-white overflow-hidden" style={{ background: "#040e1e" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');
        .hero-text-mask {
          background: linear-gradient(175deg, #ffffff 0%, rgba(255,255,255,0.62) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        ::placeholder { color: rgba(255,255,255,0.25) !important; }
      `}</style>

      {/* ambient blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #f59e0b, transparent 70%)" }} />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #10b981, transparent 70%)" }} />
      </div>

      <ScrollingBanner />

      {/* ── HERO ── */}
      <div ref={heroRef} className="relative w-full overflow-hidden" style={{ height: "clamp(480px, 80vh, 750px)" }}>
        <motion.div className="absolute inset-0" style={{ y: heroY, willChange: "transform" }}>
          <img src="/new/hall.jpeg" alt="Hall of Fame"
            className="w-full h-full object-cover" style={{ filter: "brightness(1.08) saturate(1.2)" }} />
        </motion.div>
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(4,14,30,0.25) 0%, rgba(4,14,30,0.55) 60%, #040e1e 100%)" }} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(4,14,30,0.65) 0%, rgba(4,14,30,0.1) 60%, transparent 100%)" }} />

        <motion.div
          className="absolute inset-0 flex flex-col justify-end pb-16 px-8 md:px-16 lg:px-24 pt-32 w-full"
          style={{ opacity: heroOpacity, maxWidth: "65%" }}
        >
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.7 }}
            className="flex items-center gap-3 mb-6">
            <div className="h-px w-10" style={{ background: "#f59e0b" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.22em", color: "#f59e0b", textTransform: "uppercase", fontWeight: 500 }}>
              Industry Heroes
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hero-text-mask mb-5"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 4vw, 4.5rem)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.02em" }}>
            Hall of Fame
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14px, 1.8vw, 18px)", color: "rgba(255,255,255,0.5)", maxWidth: "480px", lineHeight: 1.75, fontWeight: 300 }}>
            Celebrating excellence and outstanding contributions to renewable energy and sustainability.
          </motion.p>
        </motion.div>

        <motion.div className="absolute bottom-8 right-8 md:right-16 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Scroll</span>
          <motion.div className="w-px h-10 origin-top"
            style={{ background: "linear-gradient(to bottom, rgba(245,158,11,0.6), transparent)" }}
            animate={{ scaleY: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        </motion.div>
      </div>

      {/* ── FILTERS ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl border p-6"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.35), transparent)" }} />

          <div className="flex gap-3 mb-0">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
              <input
                type="text"
                placeholder="Search by name, company, or award…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%", paddingLeft: "36px", paddingRight: "16px",
                  paddingTop: "11px", paddingBottom: "11px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: "12px", color: "#ffffff",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 300, outline: "none",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(245,158,11,0.45)"; e.currentTarget.style.background = "rgba(245,158,11,0.04)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 rounded-xl border transition-all duration-200"
              style={{
                borderColor: showFilters ? "rgba(245,158,11,0.45)" : "rgba(255,255,255,0.09)",
                background: showFilters ? "rgba(245,158,11,0.08)" : "rgba(255,255,255,0.03)",
                color: showFilters ? "#f59e0b" : "rgba(255,255,255,0.5)",
                fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 500,
              }}
            >
              <Calendar size={13} />
              Year
              <ChevronDown size={12} style={{ transform: showFilters ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 pt-4 pb-3 border-b mb-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  {uniqueYears.map((y) => (
                    <button key={y} onClick={() => setSelectedYear(y)}
                      className="px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 capitalize"
                      style={{
                        borderColor: selectedYear === y ? "rgba(245,158,11,0.5)" : "rgba(255,255,255,0.08)",
                        background: selectedYear === y ? "rgba(245,158,11,0.1)" : "transparent",
                        color: selectedYear === y ? "#f59e0b" : "rgba(255,255,255,0.45)",
                        fontFamily: "'DM Sans', sans-serif",
                      }}>
                      {y === "all" ? "All Years" : y}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`flex items-center justify-between ${showFilters ? "" : "mt-3"}`}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
              Showing <span style={{ color: "#f59e0b", fontWeight: 500 }}>{filtered.length}</span> honoree{filtered.length !== 1 ? "s" : ""}
            </p>
            {hasFilters && (
              <button onClick={() => { setSearchTerm(""); setSelectedYear("all"); }}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11.5px", color: "rgba(255,255,255,0.3)", cursor: "pointer" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#ffffff"}
                onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}>
                Clear all
              </button>
            )}
          </div>
        </motion.div>
      </div>

    {/* ── AWARDS LIST ── */}
    <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-24 space-y-4">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{ borderColor: "rgba(255,255,255,0.1)", borderTopColor: "#f59e0b" }} />
        </div>
      ) : filtered.length > 0 ? (
        filtered.map((award, index) => (
          <AwardCard key={award.id || index} award={award} index={index} onClick={() => setSelectedAward(award)} />
        ))
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 rounded-2xl border"
          style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
            <Trophy size={20} style={{ color: "#f59e0b" }} />
          </div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "#ffffff", marginBottom: "8px" }}>
            No honorees found
          </h3>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
            Try adjusting your search or filter criteria.
          </p>
        </motion.div>
      )}
    </div>

    {/* ── MODAL ── */}
    <AnimatePresence>
      {selectedAward && (
        <AwardModal
          award={selectedAward}
          onClose={() => setSelectedAward(null)}
          accent={ACCENT_COLORS[(awards.indexOf(selectedAward)) % ACCENT_COLORS.length]}
        />
      )}
    </AnimatePresence>
  </div>
);

};

export default HallOfFamePage;
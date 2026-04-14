import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Newspaper, User, ArrowRight, Search, ChevronDown,
  X, Calendar, ExternalLink, Filter, Check,
} from "lucide-react";
import ScrollingBanner from "../home/ScrollingBanner";
import { getContent } from "../../utils/contentAPI";

const KNOWN_SOURCES = [
  "Energy Digital", "RE NEWS", "Transportation", "Sustainable Building",
  "Solar Energy", "Feed Spot", "Electric Drives", "Solar Media Limited",
  "Energy Global", "Rec Energy", "EV Powered", "Sustainability Online",
  "Construction News", "ABB News", "Clean Technica",
];

const normalize = (v) => (v || "").toString().trim().toLowerCase();

const ACCENT_PAIRS = [
  { hex: "#10b981", rgb: "16,185,129" },
  { hex: "#06b6d4", rgb: "6,182,212"  },
  { hex: "#8b5cf6", rgb: "139,92,246" },
  { hex: "#f59e0b", rgb: "245,158,11" },
  { hex: "#ec4899", rgb: "236,72,153" },
  { hex: "#3b82f6", rgb: "59,130,246" },
];

/* ─────────────────────────────────────────────────────────────
   NEWS CARD
───────────────────────────────────────────────────────────── */
const NewsCard = ({ story, index, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const accent = ACCENT_PAIRS[index % ACCENT_PAIRS.length];

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (index % 6) * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="cursor-pointer flex flex-col"
    >
      <div
        className="relative overflow-hidden rounded-2xl border flex flex-col flex-1 transition-all duration-500"
        style={{
          borderColor: hovered ? `rgba(${accent.rgb},0.4)` : "rgba(255,255,255,0.07)",
          background: "rgba(4,14,30,0.97)",
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
            opacity: hovered ? 1 : 0.2,
          }}
        />

        {/* image */}
        <div className="relative overflow-hidden flex-shrink-0" style={{ height: "180px" }}>
          <motion.img
            src={story.image}
            alt={story.title}
            className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(4,14,30,0.9) 100%)" }} />

          {/* category badge */}
          <div
            className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
            style={{
              borderColor: `rgba(${accent.rgb},0.4)`,
              background: `rgba(${accent.rgb},0.12)`,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "9.5px",
              fontWeight: 600,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: accent.hex,
            }}
          >
            <Newspaper size={9} />
            {story.category}
          </div>

          {story.featured && (
            <div
              className="absolute top-3 right-3 px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.4)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "9px",
                color: "#ef4444",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Featured
            </div>
          )}
        </div>

        {/* content */}
        <div className="flex flex-col flex-1 px-5 py-4">
          {/* source + date */}
          <div className="flex items-center justify-between mb-2">
            {story.source && (
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10.5px", color: accent.hex, fontWeight: 500, opacity: 0.85 }}>
                {story.source}
              </p>
            )}
            {story.date && (
              <div className="flex items-center gap-1" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10.5px", color: "rgba(255,255,255,0.3)" }}>
                <Calendar size={10} />
                {story.date}
              </div>
            )}
          </div>

          {/* title */}
          <h3
            className="font-bold text-white leading-snug mb-3"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.9rem, 1.1vw, 1rem)" }}
          >
            {story.title}
          </h3>

          {/* accent rule */}
          <div
            className="mb-3 h-px transition-all duration-500"
            style={{
              background: `linear-gradient(90deg, ${accent.hex}, transparent)`,
              width: hovered ? "44px" : "18px",
            }}
          />

          {/* excerpt */}
          <p
            className="line-clamp-2 flex-1 mb-4"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              color: "rgba(255,255,255,0.48)",
              lineHeight: 1.65,
              fontWeight: 300,
            }}
          >
            {story.excerpt}
          </p>

          {/* read more */}
          <div
            className="inline-flex items-center gap-1 text-xs font-medium transition-all duration-200"
            style={{ color: accent.hex, fontFamily: "'DM Sans', sans-serif" }}
          >
            Read More <ArrowRight size={11} />
          </div>
        </div>

        {/* ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-700"
          style={{
            background: `radial-gradient(ellipse at 50% 100%, rgba(${accent.rgb},0.09), transparent 60%)`,
            opacity: hovered ? 1 : 0,
          }}
        />
      </div>
    </motion.article>
  );
};

/* ─────────────────────────────────────────────────────────────
   NEWS MODAL
───────────────────────────────────────────────────────────── */
const NewsModal = ({ story, onClose }) => {
  if (!story) return null;

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
          maxHeight: "88vh",
          overflowY: "auto",
          background: "rgba(4,14,30,0.97)",
          borderColor: "rgba(16,185,129,0.25)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(16,185,129,0.4) rgba(255,255,255,0.02)",
        }}
      >
        <div className="h-[2px]"
          style={{ background: "linear-gradient(90deg, transparent, #10b981, transparent)" }} />

        {/* close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200"
          style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)"; e.currentTarget.style.color = "#10b981"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
        >
          <X size={14} />
        </button>

        {/* hero image */}
        <div className="relative overflow-hidden" style={{ height: "240px" }}>
          <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(4,14,30,0.95) 100%)" }} />

          <div
            className="absolute bottom-4 left-6 flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
            style={{ borderColor: "rgba(16,185,129,0.4)", background: "rgba(16,185,129,0.12)", fontFamily: "'DM Sans', sans-serif", fontSize: "9.5px", fontWeight: 600, letterSpacing: "0.13em", textTransform: "uppercase", color: "#10b981" }}
          >
            <Newspaper size={9} />
            {story.category}
          </div>
        </div>

        <div className="p-8">
          {/* meta */}
          <div className="flex flex-wrap items-center gap-5 mb-4">
            {story.author && (
              <div className="flex items-center gap-1.5" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                <User size={11} style={{ color: "#10b981" }} />
                {story.author}
              </div>
            )}
            {story.date && (
              <div className="flex items-center gap-1.5" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                <Calendar size={11} style={{ color: "#10b981" }} />
                {story.date}
              </div>
            )}
            {story.source && (
              <div className="flex items-center gap-1.5" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#10b981", fontWeight: 500 }}>
                <Newspaper size={11} />
                {story.source}
              </div>
            )}
          </div>

          {/* title */}
          <h2
            className="font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)" }}
          >
            {story.title}
          </h2>

          <div className="mb-5 h-px w-12"
            style={{ background: "linear-gradient(90deg, #10b981, transparent)" }} />

          {/* content */}
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontWeight: 300, whiteSpace: "pre-wrap" }}>
            {story.content || story.excerpt}
          </p>

          {/* external link */}
          {story.link && (
            <div className="mt-7">
              <a
                href={story.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border text-sm font-medium transition-all duration-300"
                style={{ borderColor: "rgba(16,185,129,0.35)", background: "rgba(16,185,129,0.08)", color: "#10b981", fontFamily: "'DM Sans', sans-serif", textDecoration: "none" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(16,185,129,0.18)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(16,185,129,0.08)"}
              >
                Read Full Article
                <ExternalLink size={13} />
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
export default function TodaysIndustryNews() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [showSourceFilter, setShowSourceFilter] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [newsStories, setNewsStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);

  const sourceFilterRef = useRef(null);
  const monthDropdownRef = useRef(null);

  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sourceFilterRef.current && !sourceFilterRef.current.contains(event.target)) {
        setShowSourceFilter(false);
      }
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target)) {
        setIsMonthDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const toggleMonth = (m) => setSelectedMonths(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

  const heroRef = useRef(null);
  const filterBarRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (mounted) setLoading(true);
      try {
        const data = await getContent("news");
        const mapped = Array.isArray(data) ? data.map(item => ({
          id: item.id || `${item.title}-${item.date}`,
          title: item.title || "News",
          category: item.category || "General",
          excerpt: item.content ? `${item.content.substring(0, 200)}…` : "News content available.",
          content: item.content || "",
          image: item.image || "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80",
          author: item.author || "Admin",
          date: item.date || new Date().toLocaleDateString(),
          featured: false,
          source: (item.source || item.category || "Admin News").toString().trim(),
          link: item.link || "",
        })) : [];
        if (mounted) setNewsStories(mapped);
      } catch (e) {
        if (mounted) setNewsStories([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") { setSelectedStory(null); setShowSourceFilter(false); setIsMonthDropdownOpen(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (filterBarRef.current && !filterBarRef.current.contains(event.target)) {
        setShowSourceFilter(false);
        setIsMonthDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, []);

  const filtered = newsStories.filter((story) => {
    const q = normalize(searchTerm);
    const matchSearch = !q || normalize(story.title).includes(q) || normalize(story.category).includes(q) || normalize(story.source).includes(q) || normalize(story.excerpt).includes(q);
    const matchSource = !selectedSource || normalize(story.source) === normalize(selectedSource);
    const matchMonth = selectedMonths.length === 0 || (story.date && selectedMonths.some(m => {
      const d = new Date(story.date);
      return d.toLocaleString('en-US', { month: 'long' }) === m;
    }));
    return matchSearch && matchSource && matchMonth;
  });

  const featured = filtered.filter(s => s.featured);
  const regular = filtered.filter(s => !s.featured);
  const hasFilters = searchTerm || selectedSource || selectedMonths.length > 0;

  return (
    <div className="min-h-screen text-white overflow-hidden" style={{ background: "#040e1e" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');
        .hero-text-mask { background: linear-gradient(175deg, #ffffff 0%, rgba(255,255,255,0.62) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        ::placeholder { color: rgba(255,255,255,0.25) !important; }
        .source-scroll::-webkit-scrollbar { width: 4px; }
        .source-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .source-scroll::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.4); border-radius: 99px; }
      `}</style>

      {/* ambient blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #10b981, transparent 70%)" }} />
        <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)" }} />
      </div>

      <ScrollingBanner />

      {/* ── HERO ── */}
      <div ref={heroRef} className="relative w-full overflow-hidden" style={{ height: "clamp(480px, 80vh, 750px)" }}>
        <motion.div className="absolute inset-0" style={{ y: heroY, willChange: "transform" }}>
          <img src="/news/industrial.jpeg" alt="Industry News"
            className="w-full h-full object-cover" style={{ filter: "brightness(1.08) saturate(1.2)" }} />
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
              News Hub
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hero-text-mask mb-5"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 4vw, 4.5rem)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.02em" }}>
            Today's Industry<br />News Stories
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14px, 1.8vw, 18px)", color: "rgba(255,255,255,0.5)", maxWidth: "500px", lineHeight: 1.75, fontWeight: 300 }}>
            Stay updated with breaking news & industry insights from across the renewable energy and sustainability sectors.
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

      {/* ── INTRO ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-4">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(13px, 1.4vw, 15px)", color: "rgba(255,255,255,0.4)", lineHeight: 1.85, fontWeight: 300, textAlign: "center", maxWidth: "720px", margin: "0 auto" }}
        >
          We collaborate with government and regional bodies, NGOs, reputable media outlets, and independent industry content sources to provide your daily one-stop hub for quality industry-specific content in the UK & Ireland.
        </motion.p>
      </div>

      {/* ── FILTER BAR ── */}
      <div className="relative z-50 max-w-7xl mx-auto px-6 md:px-12 pt-8 pb-6">
        <motion.div
          ref={filterBarRef}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl border p-5"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.35), transparent)" }} />

          <div className="flex gap-3 mb-0">
            {/* search */}
            <div className="relative flex-1">
              <Search size={13} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
              <input
                type="text"
                placeholder="Search stories, categories, or sources…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  paddingLeft: "36px",
                  paddingRight: searchTerm ? "36px" : "16px",
                  paddingTop: "11px", paddingBottom: "11px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: "12px", color: "#ffffff",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 300, outline: "none",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.45)"; e.currentTarget.style.background = "rgba(16,185,129,0.04)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(255,255,255,0.4)" }}>
                  <X size={13} />
                </button>
              )}
            </div>

            {/* source filter toggle */}
            <div ref={sourceFilterRef} className="relative" style={{ zIndex: 9999 }}>
              <button
                onClick={() => setShowSourceFilter(!showSourceFilter)}
                className="flex items-center gap-2 px-4 h-full rounded-xl border transition-all duration-200"
                style={{
                  borderColor: showSourceFilter || selectedSource ? "rgba(16,185,129,0.45)" : "rgba(255,255,255,0.09)",
                  background: showSourceFilter || selectedSource ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.03)",
                  color: showSourceFilter || selectedSource ? "#10b981" : "rgba(255,255,255,0.5)",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 500,
                }}
              >
                <Newspaper size={13} />
                Source
                <ChevronDown size={12} style={{ transform: showSourceFilter ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
              </button>

              {/* source dropdown */}
              <AnimatePresence>
                {showSourceFilter && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-[calc(100%+8px)] w-56 rounded-xl border overflow-hidden source-scroll"
                    style={{
                      background: "rgba(4,12,30,0.97)",
                      backdropFilter: "blur(32px)",
                      borderColor: "rgba(255,255,255,0.1)",
                      boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                      maxHeight: "280px",
                      overflowY: "auto",
                      zIndex: 9999,
                    }}
                  >
                    {["", ...KNOWN_SOURCES].map((src) => {
                      const active = selectedSource === src;
                      return (
                        <button
                          key={src || "all"}
                          onClick={() => { setSelectedSource(src); setShowSourceFilter(false); }}
                          className="w-full text-left px-4 py-2.5 border-b transition-all duration-150"
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "12.5px",
                            color: active ? "#10b981" : "rgba(255,255,255,0.6)",
                            borderColor: "rgba(255,255,255,0.05)",
                            background: active ? "rgba(16,185,129,0.08)" : "transparent",
                          }}
                          onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; }}}
                          onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}}
                        >
                          {src || "All Sources"}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* month filter toggle */}
            <div ref={monthDropdownRef} className="relative" style={{ zIndex: 9999 }}>
              <button
                onClick={() => { setIsMonthDropdownOpen(!isMonthDropdownOpen); setShowSourceFilter(false); }}
                className="flex items-center gap-2 px-4 h-full rounded-xl border transition-all duration-200"
                style={{
                  borderColor: isMonthDropdownOpen || selectedMonths.length > 0 ? "rgba(6,182,212,0.45)" : "rgba(255,255,255,0.09)",
                  background: isMonthDropdownOpen || selectedMonths.length > 0 ? "rgba(6,182,212,0.08)" : "rgba(255,255,255,0.03)",
                  color: isMonthDropdownOpen || selectedMonths.length > 0 ? "#06b6d4" : "rgba(255,255,255,0.5)",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 500,
                }}
              >
                <Calendar size={13} />
                Month{selectedMonths.length > 0 ? ` (${selectedMonths.length})` : ""}
                <ChevronDown size={12} style={{ transform: isMonthDropdownOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
              </button>

              <AnimatePresence>
                {isMonthDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-[calc(100%+8px)] w-48 rounded-xl border source-scroll"
                    style={{
                      background: "rgba(4,12,30,0.97)",
                      backdropFilter: "blur(32px)",
                      borderColor: "rgba(255,255,255,0.1)",
                      boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                      maxHeight: "280px",
                      overflowY: "auto",
                      zIndex: 9999,
                    }}
                  >
                    {MONTHS.map((m) => {
                      const active = selectedMonths.includes(m);
                      return (
                        <button
                          key={m}
                          onClick={() => toggleMonth(m)}
                          className="w-full text-left px-4 py-2.5 border-b transition-all duration-150 flex items-center justify-between"
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "12.5px",
                            color: active ? "#06b6d4" : "rgba(255,255,255,0.6)",
                            borderColor: "rgba(255,255,255,0.05)",
                            background: active ? "rgba(6,182,212,0.08)" : "transparent",
                          }}
                          onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; }}}
                          onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = active ? "rgba(6,182,212,0.08)" : "transparent"; e.currentTarget.style.color = active ? "#06b6d4" : "rgba(255,255,255,0.6)"; }}}
                        >
                          {m}
                          {active && <Check size={11} style={{ color: "#06b6d4", flexShrink: 0 }} />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* active filter pills */}
          <AnimatePresence>
            {hasFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2 mt-3 overflow-hidden"
              >
                {searchTerm && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
                    style={{ borderColor: "rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.07)", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#10b981" }}>
                    <Search size={10} />
                    {searchTerm}
                    <button onClick={() => setSearchTerm("")}><X size={10} /></button>
                  </div>
                )}
                {selectedSource && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
                    style={{ borderColor: "rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.07)", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#10b981" }}>
                    <Newspaper size={10} />
                    {selectedSource}
                    <button onClick={() => setSelectedSource("")}><X size={10} /></button>
                  </div>
                )}
                {selectedMonths.map((m) => (
                  <div key={m} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
                    style={{ borderColor: "rgba(6,182,212,0.3)", background: "rgba(6,182,212,0.07)", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#06b6d4" }}>
                    <Calendar size={10} />
                    {m}
                    <button onClick={() => toggleMonth(m)}><X size={10} /></button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-3">
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11.5px", color: "rgba(255,255,255,0.3)" }}>
              {loading ? "Loading…" : <><span style={{ color: "#10b981", fontWeight: 500 }}>{filtered.length}</span> stor{filtered.length !== 1 ? "ies" : "y"} found</>}
            </p>
            {hasFilters && (
              <button onClick={() => { setSearchTerm(""); setSelectedSource(""); setSelectedMonths([]); }}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.3)", cursor: "pointer" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
                onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}>
                Clear all
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── GRID ── */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 pb-24">

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border animate-pulse"
                style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", height: "320px" }} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <>
            {featured.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px w-8" style={{ background: "rgba(255,255,255,0.1)" }} />
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>Featured</p>
                  <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.1)" }} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featured.map((story, i) => (
                    <NewsCard key={story.id} story={story} index={i} onClick={() => setSelectedStory(story)} />
                  ))}
                </div>
              </div>
            )}

            {regular.length > 0 && (
              <>
                {featured.length > 0 && (
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-px w-8" style={{ background: "rgba(255,255,255,0.1)" }} />
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>Latest News</p>
                    <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.1)" }} />
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regular.map((story, i) => (
                    <NewsCard key={story.id} story={story} index={i} onClick={() => setSelectedStory(story)} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 rounded-2xl border"
            style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <Newspaper size={20} style={{ color: "#10b981" }} />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "#ffffff", marginBottom: "8px" }}>
              No stories found
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
              Try adjusting your search or source filter.
            </p>
          </motion.div>
        )}
      </div>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {selectedStory && (
          <NewsModal story={selectedStory} onClose={() => setSelectedStory(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
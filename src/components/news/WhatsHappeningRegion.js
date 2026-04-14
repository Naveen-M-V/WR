import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ScrollingBanner from "../home/ScrollingBanner";
import {
  MapPin, ChevronDown, Check, X, Search,
  ArrowRight, ExternalLink, Calendar, Filter, Building2,
} from "lucide-react";

const REGIONS = {
  "United Kingdom & Ireland": ["England", "Scotland", "Wales", "Northern Ireland", "Republic Of Ireland"],
  "UK and NI": ["England", "Scotland", "Wales", "Northern Ireland"],
  "UK Mainland Only": ["England", "Scotland", "Wales"],
  "Scotland": ["Highlands & islands", "Grampian", "Central", "Strathclyde", "Lothian", "Borders", "Dumfries & Galloway"],
  "England": ["Cornwall", "Devon", "Somerset", "Avon", "Wiltshire", "Hampshire", "West Sussex", "Surrey", "Berkshire", "East Sussex", "Kent", "Essex", "Hertfordshire", "Buckinghamshire", "Suffolk", "Norfolk", "Cambridgeshire", "Northamptonshire", "Warwickshire", "Oxfordshire", "Shropshire", "East Riding of Yorkshire", "Leicestershire", "West Midlands", "Glouchestershire", "Hereford & Worcester", "Staffordshire", "Lincolnshire", "Nottinghamshire", "Derbyshire", "Cheshire", "South Yorkshire", "Greater Manchester", "Merseyside", "Humberside", "West Yorkshire", "Lancashire", "North Yorkshire", "Cleveland", "Durham", "Cumbria", "Tyne & Wear", "Northumberland", "Central London", "North London", "West London", "South London", "East London"],
  "Wales": ["Clywd", "Gywwedd", "Powys", "Dyfed", "Cardiff", "Glamorgan"],
  "Ireland": ["All Of Ireland", "Northern Ireland Only", "Republic Of Ireland Only", "Greater Dublin", "Southern Counties", "Midland Counties", "West & North west", "Border Counties"],
};

const fmt = (dateStr) => {
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch { return dateStr || ""; }
};

/* ─────────────────────────────────────────────────────────────
   EVENT CARD
───────────────────────────────────────────────────────────── */
const EventCard = ({ event, index, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="cursor-pointer"
    >
      <div
        className="relative overflow-hidden rounded-2xl border transition-all duration-500 flex flex-col sm:flex-row"
        style={{
          borderColor: hovered ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.07)",
          background: hovered
            ? "linear-gradient(135deg, rgba(16,185,129,0.07) 0%, rgba(4,14,30,0.98) 100%)"
            : "rgba(255,255,255,0.025)",
          boxShadow: hovered
            ? "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(16,185,129,0.2)"
            : "0 4px 20px rgba(0,0,0,0.3)",
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

        {/* image */}
        <div className="relative overflow-hidden flex-shrink-0" style={{ width: "clamp(140px, 22%, 220px)", minHeight: "160px" }}>
          <motion.img
            src={event.image}
            alt={event.headline}
            className="absolute inset-0 w-full h-full object-cover"
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(90deg, rgba(4,14,30,0) 40%, rgba(4,14,30,0.85) 100%)" }} />

          {/* region badge */}
          <div
            className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full border"
            style={{
              borderColor: "rgba(16,185,129,0.4)",
              background: "rgba(16,185,129,0.12)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "9.5px",
              fontWeight: 600,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: "#10b981",
            }}
          >
            {event.subregion || event.mainRegion || "Regional"}
          </div>
        </div>

        {/* content */}
        <div className="flex-1 flex flex-col px-6 md:px-8 py-5">
          {/* meta */}
          <div className="flex flex-wrap items-center gap-4 mb-3">
            {event.provider && (
              <div className="flex items-center gap-1.5"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10.5px", color: "#10b981", fontWeight: 500 }}>
                <MapPin size={0} />
                {event.provider}
              </div>
            )}
            {event.venue && (
              <div className="flex items-center gap-1.5"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10.5px", color: "rgba(255,255,255,0.45)" }}>
                <Building2 size={10} style={{ color: "#06b6d4" }} />
                {event.venue}
              </div>
            )}
            {event.date && (
              <div className="flex items-center gap-1.5"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10.5px", color: "rgba(255,255,255,0.35)" }}>
                <Calendar size={10} />
                {fmt(event.date)}
              </div>
            )}
          </div>

          {/* title */}
          <h3
            className="font-bold text-white leading-snug mb-3"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1rem, 1.5vw, 1.15rem)" }}
          >
            {event.headline}
          </h3>

          {/* accent rule */}
          <div
            className="mb-3 h-px transition-all duration-500"
            style={{
              background: "linear-gradient(90deg, #10b981, transparent)",
              width: hovered ? "52px" : "24px",
            }}
          />

          {/* excerpt */}
          <p
            className="line-clamp-2 flex-1"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12.5px",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            {event.excerpt}
          </p>

          {/* read more */}
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium transition-all duration-200"
            style={{ color: "#10b981", fontFamily: "'DM Sans', sans-serif" }}>
            View Details <ArrowRight size={12} />
          </div>
        </div>
      </div>
    </motion.article>
  );
};

/* ─────────────────────────────────────────────────────────────
   EVENT MODAL
───────────────────────────────────────────────────────────── */
const EventModal = ({ event, onClose }) => {
  if (!event) return null;
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
        className="relative w-full max-w-2xl rounded-2xl border overflow-hidden"
        style={{
          maxHeight: "85vh", overflowY: "auto",
          background: "rgba(4,14,30,0.97)",
          borderColor: "rgba(16,185,129,0.25)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(16,185,129,0.4) rgba(255,255,255,0.02)",
        }}
      >
        <div className="h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #10b981, transparent)" }} />

        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200"
          style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)"; e.currentTarget.style.color = "#10b981"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
        >
          <X size={14} />
        </button>

        {/* image */}
        <div className="relative overflow-hidden" style={{ height: "220px" }}>
          <img src={event.image} alt={event.headline} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(4,14,30,0.95) 100%)" }} />
          <div
            className="absolute bottom-4 left-6 px-2.5 py-1 rounded-full border"
            style={{ borderColor: "rgba(16,185,129,0.4)", background: "rgba(16,185,129,0.12)", fontFamily: "'DM Sans', sans-serif", fontSize: "9.5px", fontWeight: 600, letterSpacing: "0.13em", textTransform: "uppercase", color: "#10b981" }}
          >
            {event.subregion || event.mainRegion || "Regional"}
          </div>
        </div>

        <div className="p-8">
          {/* meta */}
          <div className="flex flex-wrap gap-4 mb-4">
            {event.provider && (
              <div className="flex items-center gap-1.5" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#10b981", fontWeight: 500 }}>
                <MapPin size={11} /> {event.provider}
              </div>
            )}
            {event.venue && (
              <div className="flex items-center gap-1.5" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
                <Building2 size={11} style={{ color: "#06b6d4" }} /> {event.venue}
              </div>
            )}
            {event.date && (
              <div className="flex items-center gap-1.5" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                <Calendar size={11} style={{ color: "#10b981" }} /> {fmt(event.date)}
              </div>
            )}
          </div>

          <h2 className="font-bold text-white leading-tight mb-3"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.2rem, 2.5vw, 1.7rem)" }}>
            {event.headline}
          </h2>

          <div className="mb-5 h-px w-12" style={{ background: "linear-gradient(90deg, #10b981, transparent)" }} />

          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontWeight: 300, marginBottom: "12px" }}>
            {event.excerpt}
          </p>
          {event.description && (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.75, fontWeight: 300, whiteSpace: "pre-line" }}>
              {event.description}
            </p>
          )}

          {event.link && (
            <div className="mt-7">
              <a href={event.link} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border text-sm font-medium transition-all duration-300"
                style={{ borderColor: "rgba(16,185,129,0.35)", background: "rgba(16,185,129,0.08)", color: "#10b981", fontFamily: "'DM Sans', sans-serif", textDecoration: "none" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(16,185,129,0.18)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(16,185,129,0.08)"}
              >
                Visit Official Page <ExternalLink size={13} />
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SUBREGION MODAL
───────────────────────────────────────────────────────────── */
const SubregionModal = ({ region, selected, onToggle, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    style={{ background: "rgba(4,14,30,0.88)", backdropFilter: "blur(12px)" }}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 16 }}
      transition={{ duration: 0.25 }}
      onClick={(e) => e.stopPropagation()}
      className="relative w-full max-w-2xl rounded-2xl border overflow-hidden flex flex-col"
      style={{ maxHeight: "85vh", background: "rgba(4,14,30,0.97)", borderColor: "rgba(255,255,255,0.1)", boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)" }}
    >
      <div className="h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #10b981, transparent)" }} />

      {/* header */}
      <div className="flex items-start justify-between px-6 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#10b981", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, marginBottom: "4px" }}>
            Select Subregions
          </p>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "#ffffff" }}>
            {region}
          </h3>
        </div>
        <button onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200"
          style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)"; e.currentTarget.style.color = "#10b981"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
        >
          <X size={14} />
        </button>
      </div>

      {/* grid */}
      <div className="flex-1 overflow-y-auto p-6"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(16,185,129,0.4) rgba(255,255,255,0.02)" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[region, ...(REGIONS[region] || [])].map((sub, i) => {
            const sel = selected.includes(sub);
            const label = i === 0 ? `All of ${region}` : sub;
            return (
              <button key={sub} onClick={() => onToggle(sub)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl border text-left transition-all duration-200"
                style={{
                  borderColor: sel ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.08)",
                  background: sel ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.025)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  color: sel ? "#10b981" : "rgba(255,255,255,0.6)",
                }}>
                <span className="break-words">{label}</span>
                {sel && <Check size={13} className="flex-shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* footer */}
      <div className="px-6 py-4 border-t flex justify-end" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <motion.button onClick={onClose}
          className="px-6 py-2.5 rounded-full text-sm font-semibold"
          style={{ background: "#10b981", color: "#ffffff", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 0 20px rgba(16,185,129,0.3)" }}
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          Done
        </motion.button>
      </div>
    </motion.div>
  </motion.div>
);

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */
export default function WhatsHappeningRegion() {
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [showSubregionModal, setShowSubregionModal] = useState(false);
  const [activeMainRegion, setActiveMainRegion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [adminEvents, setAdminEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const heroRef = useRef(null);
  const filterBarRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  useEffect(() => {
    const load = async () => {
      try {
        const { getContent } = await import("../../utils/contentAPI");
        const data = await getContent("regional");
        if (Array.isArray(data) && data.length > 0) setAdminEvents(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") { setSelectedEvent(null); setShowSubregionModal(false); setIsRegionDropdownOpen(false); setIsMonthDropdownOpen(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (filterBarRef.current && !filterBarRef.current.contains(event.target)) {
        setShowSubregionModal(false);
        setIsRegionDropdownOpen(false);
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

  const toggleRegion = (r) => setSelectedRegions(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);

  const toggleMonth = (m) => setSelectedMonths(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const filtered = adminEvents.filter((event) => {
    const q = searchTerm.toLowerCase();
    const matchSearch = !q || event.headline?.toLowerCase().includes(q) || event.excerpt?.toLowerCase().includes(q);
    const matchRegion = selectedRegions.length === 0 || selectedRegions.some(r =>
      event.subregion?.toLowerCase() === r.toLowerCase() || event.mainRegion?.toLowerCase() === r.toLowerCase()
    );
    const matchMonth = selectedMonths.length === 0 || (event.date && selectedMonths.some(m => {
      const eventMonth = new Date(event.date).toLocaleString('en-US', { month: 'long' });
      return eventMonth === m;
    }));
    return matchSearch && matchRegion && matchMonth;
  });

  const hasFilters = searchTerm || selectedRegions.length > 0 || selectedMonths.length > 0;

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

      {/* ── HERO ── */}
      <div ref={heroRef} className="relative w-full overflow-hidden" style={{ height: "clamp(480px, 80vh, 750px)" }}>
        <motion.div className="absolute inset-0" style={{ y: heroY, willChange: "transform" }}>
          <img src="/new/region.jpeg" alt="Regional News"
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
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.22em", color: "#10b981", textTransform: "uppercase", fontWeight: 500 }}>Regional Hub</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hero-text-mask mb-5"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 4vw, 4.5rem)", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.02em", overflow: "visible" }}>
            What's Happening<br />in Your Region?
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14px, 1.8vw, 18px)", color: "rgba(255,255,255,0.5)", maxWidth: "480px", lineHeight: 1.75, fontWeight: 300 }}>
            Stay updated with trade events, awards, legislation, and projects in your area.
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

      {/* ── FILTER BAR ── */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-6" style={{ zIndex: 20 }}>
        <motion.div
          ref={filterBarRef}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl border p-5"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)", overflow: "visible" }}
        >
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.35), transparent)" }} />

          <div className="flex gap-3">
            {/* search */}
            <div className="relative flex-1">
              <Search size={13} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
              <input type="text" placeholder="Search events, headlines…" value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%", paddingLeft: "36px", paddingRight: searchTerm ? "36px" : "16px",
                  paddingTop: "11px", paddingBottom: "11px",
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: "12px", color: "#ffffff",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 300, outline: "none",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.45)"; e.currentTarget.style.background = "rgba(16,185,129,0.04)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(255,255,255,0.4)" }}>
                  <X size={13} />
                </button>
              )}
            </div>

            {/* region filter */}
            <div className="relative" style={{ zIndex: isRegionDropdownOpen ? 60 : 10 }}>
              <button
                onClick={() => { setIsRegionDropdownOpen(!isRegionDropdownOpen); setIsMonthDropdownOpen(false); }}
                className="flex items-center gap-2 px-4 h-full rounded-xl border transition-all duration-200"
                style={{
                  borderColor: isRegionDropdownOpen || selectedRegions.length ? "rgba(16,185,129,0.45)" : "rgba(255,255,255,0.09)",
                  background: isRegionDropdownOpen || selectedRegions.length ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.03)",
                  color: isRegionDropdownOpen || selectedRegions.length ? "#10b981" : "rgba(255,255,255,0.5)",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 500,
                }}
              >
                <MapPin size={13} />
                {selectedRegions.length ? `${selectedRegions.length} region${selectedRegions.length > 1 ? "s" : ""}` : "Region"}
                <ChevronDown size={12} style={{ transform: isRegionDropdownOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
              </button>

              <AnimatePresence>
                {isRegionDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-[calc(100%+8px)] w-[320px] sm:w-[380px] md:w-[420px] rounded-xl border overflow-y-auto z-60"
                    style={{
                      background: "rgba(4,12,30,0.97)", backdropFilter: "blur(32px)",
                      borderColor: "rgba(255,255,255,0.1)", boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                      maxHeight: "320px",
                      scrollbarWidth: "thin", scrollbarColor: "rgba(16,185,129,0.4) rgba(255,255,255,0.02)",
                    }}
                  >
                    {Object.keys(REGIONS).map((region) => (
                      <button key={region}
                        onClick={() => { setActiveMainRegion(region); setShowSubregionModal(true); setIsRegionDropdownOpen(false); }}
                        className="w-full text-left px-5 py-3.5 border-b transition-all duration-150 flex items-center justify-between group"
                        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13.5px", color: "rgba(255,255,255,0.75)", borderColor: "rgba(255,255,255,0.05)", background: "transparent" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
                      >
                        {region}
                        <ArrowRight size={11} style={{ color: "#10b981", opacity: 0 }} className="group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* month filter */}
            <div className="relative" style={{ zIndex: isMonthDropdownOpen ? 60 : 10 }}>
              <button
                onClick={() => { setIsMonthDropdownOpen(!isMonthDropdownOpen); setIsRegionDropdownOpen(false); }}
                className="flex items-center gap-2 px-4 h-full rounded-xl border transition-all duration-200"
                style={{
                  borderColor: isMonthDropdownOpen || selectedMonths.length ? "rgba(6,182,212,0.45)" : "rgba(255,255,255,0.09)",
                  background: isMonthDropdownOpen || selectedMonths.length ? "rgba(6,182,212,0.08)" : "rgba(255,255,255,0.03)",
                  color: isMonthDropdownOpen || selectedMonths.length ? "#06b6d4" : "rgba(255,255,255,0.5)",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 500,
                }}
              >
                <Calendar size={13} />
                {selectedMonths.length ? `${selectedMonths.length} month${selectedMonths.length > 1 ? "s" : ""}` : "Month"}
                <ChevronDown size={12} style={{ transform: isMonthDropdownOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
              </button>

              <AnimatePresence>
                {isMonthDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-[calc(100%+8px)] w-[200px] rounded-xl border overflow-y-auto z-60"
                    style={{
                      background: "rgba(4,12,30,0.97)", backdropFilter: "blur(32px)",
                      borderColor: "rgba(255,255,255,0.1)", boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                      maxHeight: "320px",
                      scrollbarWidth: "thin", scrollbarColor: "rgba(6,182,212,0.4) rgba(255,255,255,0.02)",
                    }}
                  >
                    {MONTHS.map((month) => (
                      <button key={month}
                        onClick={() => toggleMonth(month)}
                        className="w-full text-left px-5 py-3.5 border-b transition-all duration-150 flex items-center justify-between group"
                        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13.5px", color: "rgba(255,255,255,0.75)", borderColor: "rgba(255,255,255,0.05)", background: "transparent" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
                      >
                        {month}
                        {selectedMonths.includes(month) && <Check size={13} style={{ color: "#06b6d4" }} />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* active region pills */}
          <AnimatePresence>
            {(selectedRegions.length > 0 || selectedMonths.length > 0) && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2 mt-3 overflow-hidden">
                {selectedRegions.map((r) => (
                  <div key={r} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
                    style={{ borderColor: "rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.07)", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#10b981" }}>
                    {r}
                    <button onClick={() => toggleRegion(r)}><X size={10} /></button>
                  </div>
                ))}
                {selectedMonths.map((m) => (
                  <div key={m} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
                    style={{ borderColor: "rgba(6,182,212,0.3)", background: "rgba(6,182,212,0.07)", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#06b6d4" }}>
                    {m}
                    <button onClick={() => toggleMonth(m)}><X size={10} /></button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-3">
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11.5px", color: "rgba(255,255,255,0.3)" }}>
              {loading ? "Loading…" : <><span style={{ color: "#10b981", fontWeight: 500 }}>{filtered.length}</span> event{filtered.length !== 1 ? "s" : ""} found</>}
            </p>
            {hasFilters && (
              <button onClick={() => { setSearchTerm(""); setSelectedRegions([]); setSelectedMonths([]); }}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.3)", cursor: "pointer" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
                onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}>
                Clear all
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── EVENTS LIST ── */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 pb-24 space-y-4" style={{ zIndex: 1 }}>
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl border animate-pulse"
              style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", height: "160px" }} />
          ))
        ) : filtered.length > 0 ? (
          filtered.map((event, i) => (
            <EventCard key={event.id || i} event={event} index={i} onClick={() => setSelectedEvent(event)} />
          ))
        ) : (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 rounded-2xl border"
            style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <MapPin size={20} style={{ color: "#10b981" }} />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "#ffffff", marginBottom: "8px" }}>
              No events found
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
              Try adjusting your filters or search terms.
            </p>
          </motion.div>
        )}
      </div>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {showSubregionModal && activeMainRegion && (
          <SubregionModal
            region={activeMainRegion}
            selected={selectedRegions}
            onToggle={toggleRegion}
            onClose={() => setShowSubregionModal(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      </AnimatePresence>
    </div>
  );
}

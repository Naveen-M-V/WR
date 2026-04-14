import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import ScrollingBanner from "../home/ScrollingBanner";
import { Calendar, X, CalendarDays, MapPin, ExternalLink, Search, ChevronDown, Filter, ArrowRight, Check } from "lucide-react";
import { getContent } from "../../utils/contentAPI";

const MONTHS = [
  { value: "All", label: "All" },
  { value: "0", label: "January" }, { value: "1", label: "February" }, { value: "2", label: "March" },
  { value: "3", label: "April" }, { value: "4", label: "May" }, { value: "5", label: "June" },
  { value: "6", label: "July" }, { value: "7", label: "August" }, { value: "8", label: "September" },
  { value: "9", label: "October" }, { value: "10", label: "November" }, { value: "11", label: "December" },
];

const STATUSES = ["All", "Scheduled", "Started", "Finished"];

const STATUS_STYLE = {
  Finished:  { hex: "#9ca3af", rgb: "156,163,175" },
  Started:   { hex: "#f59e0b", rgb: "245,158,11"  },
  Scheduled: { hex: "#10b981", rgb: "16,185,129"  },
};

const getMonthIndex = (dates) => {
  if (!dates) return null;
  const dateArray = Array.isArray(dates) ? dates : [dates];
  if (dateArray.length === 0 || !dateArray[0]) return null;
  const parsed = new Date(dateArray[0]);
  if (!isNaN(parsed.getTime())) return parsed.getMonth();
  const m = dateArray[0].match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (m) { const mo = Number(m[2]); if (mo >= 1 && mo <= 12) return mo - 1; }
  return null;
};

const formatDates = (dates) => {
  const dateArray = Array.isArray(dates) ? dates : [dates];
  if (dateArray.length === 0 || !dateArray[0]) return "TBA";
  const formattedDates = dateArray.map(date => {
    const parsed = new Date(date);
    if (!isNaN(parsed.getTime())) return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const m = date.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
    if (m) return `${MONTHS[Number(m[2])].label} ${m[3]}`;
    return date;
  });
  return formattedDates.join(", ");
};

/* ─────────────────────────────────────────────────────────────
   EVENT CARD
───────────────────────────────────────────────────────────── */
const EventCard = ({ event, index, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const st = STATUS_STYLE[event.status] || STATUS_STYLE.Scheduled;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (index % 6) * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="text-left flex flex-col h-full w-full"
    >
      <div
        className="relative overflow-hidden rounded-2xl border flex flex-col flex-1 transition-all duration-500"
        style={{
          borderColor: hovered ? `rgba(${st.rgb},0.4)` : "rgba(255,255,255,0.07)",
          background: hovered
            ? `linear-gradient(145deg, rgba(${st.rgb},0.08) 0%, rgba(4,14,30,0.98) 100%)`
            : "rgba(255,255,255,0.025)",
          boxShadow: hovered
            ? `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(${st.rgb},0.2)`
            : "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {/* top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] z-10 transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${st.hex}, transparent)`,
            opacity: hovered ? 1 : 0.2,
          }}
        />

        <div className="flex flex-col flex-1 p-6">
          {/* badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className="px-2.5 py-1 rounded-full border"
              style={{
                borderColor: `rgba(${st.rgb},0.4)`,
                background: `rgba(${st.rgb},0.1)`,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: st.hex,
              }}
            >
              {event.status || "Scheduled"}
            </span>
            {event.category && (
              <span
                className="px-2.5 py-1 rounded-full border"
                style={{
                  borderColor: "rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.04)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "9px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                {event.category}
              </span>
            )}
          </div>

          {/* name */}
          <h3
            className="font-bold text-white leading-snug mb-3"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)" }}
          >
            {event.name || "Untitled Event"}
          </h3>

          {/* accent rule */}
          <div
            className="mb-3 h-px transition-all duration-500"
            style={{
              background: `linear-gradient(90deg, ${st.hex}, transparent)`,
              width: hovered ? "44px" : "18px",
            }}
          />

          {/* meta */}
          <div className="space-y-1.5 mb-4">
            <div className="flex items-center gap-2" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.45)", fontWeight: 300 }}>
              <CalendarDays size={11} style={{ color: st.hex }} />
              {formatDates(event.dates)}
            </div>
            <div className="flex items-center gap-2" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.45)", fontWeight: 300 }}>
              <MapPin size={11} style={{ color: st.hex }} />
              {event.location || "TBA"}
            </div>
          </div>

          {/* about */}
          <p
            className="line-clamp-3 flex-1"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.65,
              fontWeight: 300,
            }}
          >
            {event.about}
          </p>

          {/* cta */}
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium"
            style={{ color: st.hex, fontFamily: "'DM Sans', sans-serif" }}>
            View Details <ArrowRight size={11} />
          </div>
        </div>

        {/* ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-700"
          style={{
            background: `radial-gradient(ellipse at 50% 100%, rgba(${st.rgb},0.09), transparent 60%)`,
            opacity: hovered ? 1 : 0,
          }}
        />
      </div>
    </motion.button>
  );
};

/* ─────────────────────────────────────────────────────────────
   EVENT MODAL
───────────────────────────────────────────────────────────── */
const EventModal = ({ event, onClose }) => {
  if (!event) return null;
  const st = STATUS_STYLE[event.status] || STATUS_STYLE.Scheduled;

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
          borderColor: `rgba(${st.rgb},0.25)`,
          boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(${st.rgb},0.15), inset 0 1px 0 rgba(255,255,255,0.07)`,
          scrollbarWidth: "thin",
          scrollbarColor: `rgba(${st.rgb},0.4) rgba(255,255,255,0.02)`,
        }}
      >
        <div className="h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, ${st.hex}, transparent)` }} />

        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200"
          style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = `rgba(${st.rgb},0.5)`; e.currentTarget.style.color = st.hex; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
        >
          <X size={14} />
        </button>

        <div className="p-8">
          {/* badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="px-2.5 py-1 rounded-full border"
              style={{
                borderColor: `rgba(${st.rgb},0.4)`,
                background: `rgba(${st.rgb},0.1)`,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: st.hex,
              }}
            >
              {event.status || "Scheduled"}
            </span>
            {event.category && (
              <span className="px-2.5 py-1 rounded-full border"
                style={{
                  borderColor: "rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.04)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "9px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                {event.category}
              </span>
            )}
          </div>

          <h2 className="font-bold text-white leading-tight mb-3"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)" }}>
            {event.name}
          </h2>

          <div className="mb-5 h-px w-12" style={{ background: `linear-gradient(90deg, ${st.hex}, transparent)` }} />

          {/* meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 p-4 rounded-xl border"
            style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-center gap-2">
              <CalendarDays size={13} style={{ color: st.hex }} />
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9.5px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px" }}>Date</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{formatDates(event.dates)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={13} style={{ color: st.hex }} />
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9.5px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px" }}>Location</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{event.location || "TBA"}</p>
              </div>
            </div>
          </div>

          {/* about */}
          {event.about && (
            <>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: `rgba(${st.rgb},0.8)`, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px" }}>
                About
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13.5px", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontWeight: 300, whiteSpace: "pre-line" }}>
                {event.about}
              </p>
            </>
          )}

          {/* website */}
          {event.website && event.website !== "#" && (
            <div className="mt-7">
              <a href={event.website} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border text-sm font-medium transition-all duration-300"
                style={{ borderColor: `rgba(${st.rgb},0.35)`, background: `rgba(${st.rgb},0.08)`, color: st.hex, fontFamily: "'DM Sans', sans-serif", textDecoration: "none" }}
                onMouseEnter={(e) => e.currentTarget.style.background = `rgba(${st.rgb},0.18)`}
                onMouseLeave={(e) => e.currentTarget.style.background = `rgba(${st.rgb},0.08)`}
              >
                Visit Official Website <ExternalLink size={13} />
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
export default function TradeShowsEvents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [tradeShowsData, setTradeShowsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const heroRef = useRef(null);
  const filterBarRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        if (mounted) setLoading(true);
        const events = await getContent("events");
        const mapped = Array.isArray(events) ? events.map(ev => ({
          id: ev.id || `${ev.name}-${ev.dates}`,
          dates: Array.isArray(ev.dates) ? ev.dates : (ev.dates ? [ev.dates] : []),
          name: ev.name || "",
          category: ev.category || "",
          location: ev.location || "",
          about: ev.about || "",
          status: ev.status || "Scheduled",
          website: ev.website || "#",
        })) : [];
        if (mounted) setTradeShowsData(mapped);
      } catch { if (mounted) setTradeShowsData([]); }
      finally { if (mounted) setLoading(false); }
    };
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setSelectedEvent(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (filterBarRef.current && !filterBarRef.current.contains(event.target)) {
        setShowStatusDropdown(false);
        setShowMonthDropdown(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, []);

  const categoryOptions = useMemo(() => {
    const set = new Set();
    tradeShowsData.forEach(ev => { const c = String(ev?.category || "").trim(); if (c) set.add(c); });
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [tradeShowsData]);

  const filtered = tradeShowsData.filter((event) => {
    const q = searchTerm.toLowerCase();
    const matchSearch = !q || event.name?.toLowerCase().includes(q) || event.about?.toLowerCase().includes(q) || event.location?.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || event.status === statusFilter;
    const matchMonth = selectedMonths.length === 0 || selectedMonths.some(m => getMonthIndex(event.dates) === Number(m));
    const matchCat = categoryFilter === "All" || String(event.category).trim() === categoryFilter;
    return matchSearch && matchStatus && matchMonth && matchCat;
  });

  const hasFilters = searchTerm || statusFilter !== "All" || selectedMonths.length > 0 || categoryFilter !== "All";

  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  const toggleMonth = (month) => {
    if (selectedMonths.includes(month)) {
      setSelectedMonths(selectedMonths.filter(m => m !== month));
    } else {
      setSelectedMonths([...selectedMonths, month]);
    }
  };

  return (
    <div className="min-h-screen text-white overflow-hidden" style={{ background: "#040e1e" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');
        .hero-text-mask { background: linear-gradient(175deg, #ffffff 0%, rgba(255,255,255,0.62) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        ::placeholder { color: rgba(255,255,255,0.25) !important; }
        select option { background: #040e1e; }
        .source-scroll { scrollbar-width: thin; scrollbar-color: rgba(16,185,129,0.4) rgba(255,255,255,0.02); }
        .source-scroll::-webkit-scrollbar { width: 5px; }
        .source-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .source-scroll::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.4); border-radius: 99px; }
        .source-scroll::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.65); }
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
          <img src="/new/trade.jpeg" alt="Trade Shows & Events"
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
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.22em", color: "#10b981", textTransform: "uppercase", fontWeight: 500 }}>Events Hub</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hero-text-mask mb-5"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 4vw, 4.5rem)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.02em" }}>
            Trade Shows,<br />Awards & Events
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14px, 1.8vw, 18px)", color: "rgba(255,255,255,0.5)", maxWidth: "460px", lineHeight: 1.75, fontWeight: 300 }}>
            Discover upcoming industry events. To add an event, email admin@whichrenewables.com.
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
      <div className="relative z-50 max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-6">
        <motion.div
          ref={filterBarRef}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-50 rounded-2xl border p-5"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.35), transparent)" }} />

          {/* search + filter dropdowns */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
              <input type="text" placeholder="Search events by name or location…" value={searchTerm}
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
                <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Status dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center gap-2 px-4 h-full rounded-xl border transition-all duration-200"
                style={{
                  borderColor: statusFilter !== "All" ? "rgba(16,185,129,0.45)" : "rgba(255,255,255,0.09)",
                  background: statusFilter !== "All" ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.03)",
                  color: statusFilter !== "All" ? "#10b981" : "rgba(255,255,255,0.6)",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 500,
                }}
              >
                <Filter size={13} />
                {statusFilter === "All" ? "Status" : statusFilter}
                <ChevronDown size={12} style={{ transform: showStatusDropdown ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
              </button>
              <AnimatePresence>
                {showStatusDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-[calc(100%+8px)] w-40 rounded-xl border overflow-hidden source-scroll"
                    style={{
                      background: "rgba(4,12,30,0.97)",
                      backdropFilter: "blur(32px)",
                      borderColor: "rgba(255,255,255,0.1)",
                      boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                      maxHeight: "280px",
                      overflowY: "auto",
                      zIndex: 100,
                    }}
                  >
                    {STATUSES.map((s) => {
                      const active = statusFilter === s;
                      const accent = s === "All" ? { hex: "#10b981", rgb: "16,185,129" } : (STATUS_STYLE[s] || STATUS_STYLE.Scheduled);
                      return (
                        <button
                          key={s}
                          onClick={() => { setStatusFilter(s); setShowStatusDropdown(false); }}
                          className="w-full text-left px-4 py-2.5 border-b transition-all duration-150 flex items-center justify-between"
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "12.5px",
                            color: active ? accent.hex : "rgba(255,255,255,0.6)",
                            borderColor: "rgba(255,255,255,0.05)",
                            background: active ? `rgba(${accent.rgb},0.08)` : "transparent",
                          }}
                          onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; }}}
                          onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}}
                        >
                          {s}
                          {active && <Check size={12} style={{ color: accent.hex }} />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Month dropdown */}
            <div className="relative">
              <button
                onClick={() => { setShowMonthDropdown(!showMonthDropdown); setShowStatusDropdown(false); }}
                className="flex items-center gap-2 px-4 h-full rounded-xl border transition-all duration-200"
                style={{
                  borderColor: selectedMonths.length > 0 ? "rgba(6,182,212,0.45)" : "rgba(255,255,255,0.09)",
                  background: selectedMonths.length > 0 ? "rgba(6,182,212,0.08)" : "rgba(255,255,255,0.03)",
                  color: selectedMonths.length > 0 ? "#06b6d4" : "rgba(255,255,255,0.6)",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 500,
                }}
              >
                <Calendar size={13} />
                {selectedMonths.length === 0 ? "Month" : `${selectedMonths.length} month${selectedMonths.length > 1 ? "s" : ""}`}
                <ChevronDown size={12} style={{ transform: showMonthDropdown ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
              </button>
              <AnimatePresence>
                {showMonthDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-[calc(100%+8px)] w-48 rounded-xl border overflow-hidden source-scroll"
                    style={{
                      background: "rgba(4,12,30,0.97)",
                      backdropFilter: "blur(32px)",
                      borderColor: "rgba(255,255,255,0.1)",
                      boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                      maxHeight: "320px",
                      overflowY: "auto",
                      zIndex: 100,
                    }}
                  >
                    {MONTHS.filter(m => m.value !== "All").map(({ value, label }) => {
                      const active = selectedMonths.includes(value);
                      return (
                        <button
                          key={value}
                          onClick={() => toggleMonth(value)}
                          className="w-full text-left px-4 py-2.5 border-b transition-all duration-150 flex items-center justify-between"
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "12.5px",
                            color: active ? "#06b6d4" : "rgba(255,255,255,0.6)",
                            borderColor: "rgba(255,255,255,0.05)",
                            background: active ? "rgba(6,182,212,0.08)" : "transparent",
                          }}
                          onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; }}}
                          onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}}
                        >
                          {label}
                          {active && <Check size={12} style={{ color: "#06b6d4" }} />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* count + clear */}
          <div className="flex items-center justify-between mt-4">
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11.5px", color: "rgba(255,255,255,0.3)" }}>
              {loading ? "Loading…" : <><span style={{ color: "#10b981", fontWeight: 500 }}>{filtered.length}</span> event{filtered.length !== 1 ? "s" : ""} found</>}
            </p>
            {hasFilters && (
              <button onClick={() => { setSearchTerm(""); setStatusFilter("All"); setSelectedMonths([]); setCategoryFilter("All"); }}
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
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-24">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border animate-pulse"
                style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", height: "260px" }} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} onClick={() => setSelectedEvent(event)} />
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 rounded-2xl border"
            style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <CalendarDays size={20} style={{ color: "#10b981" }} />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "#ffffff", marginBottom: "8px" }}>
              No events found
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
              Try adjusting your search or filter criteria.
            </p>
          </motion.div>
        )}
      </div>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      </AnimatePresence>
    </div>
  );
}
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ScrollingBanner from "../home/ScrollingBanner";
import {
  MapPin, Calendar, DollarSign, Building2, ArrowRight,
  Search, Filter, TrendingUp, Eye, FileText, X, ChevronDown, Zap,
} from "lucide-react";
import { getContent } from "../../utils/contentAPI";

/* ─────────────────────────────────────────────────────────────
   CASE STUDY CARD
───────────────────────────────────────────────────────────── */
const CaseStudyCard = ({ study, index, onView, onNavigate }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative overflow-hidden rounded-2xl border transition-all duration-500 flex flex-col md:flex-row"
        style={{
          borderColor: hovered ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.07)",
          background: hovered
            ? "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(4,14,30,0.98) 100%)"
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
        <div
          className="relative overflow-hidden flex-shrink-0"
          style={{ width: "clamp(160px, 26%, 260px)", minHeight: "180px" }}
        >
          <motion.img
            src={study.image}
            alt={study.title}
            className="absolute inset-0 w-full h-full object-cover"
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(90deg, rgba(4,14,30,0) 40%, rgba(4,14,30,0.88) 100%)" }}
          />

          {/* sector badge */}
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full border"
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
            {study.sector}
          </div>
        </div>

        {/* content */}
        <div className="flex-1 flex flex-col px-6 md:px-8 py-5">

          {/* company */}
          <button
            onClick={() => onNavigate(study.company)}
            className="inline-flex items-center gap-1.5 self-start mb-2 transition-all duration-200"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "10.5px",
              color: "#10b981",
              fontWeight: 500,
              letterSpacing: "0.05em",
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            <Building2 size={10} />
            {study.company}
          </button>

          {/* title */}
          <h3
            className="font-bold text-white leading-snug mb-3"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1rem, 1.5vw, 1.2rem)" }}
          >
            {study.title}
          </h3>

          {/* accent rule */}
          <div
            className="mb-3 h-px transition-all duration-500"
            style={{
              background: "linear-gradient(90deg, #10b981, transparent)",
              width: hovered ? "52px" : "24px",
            }}
          />

          {/* meta row */}
          <div className="flex flex-wrap gap-4 mb-4">
            {[
              { icon: MapPin,      label: "Location",   value: study.location,   color: "#06b6d4" },
              { icon: DollarSign,  label: "Value",      value: study.value,      color: "#10b981" },
              { icon: Calendar,    label: "Completion", value: study.completion, color: "#f59e0b" },
              { icon: TrendingUp,  label: "Type",       value: study.type,       color: "#8b5cf6" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon size={11} style={{ color }} />
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11.5px", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* overview */}
          <p
            className="line-clamp-2 mb-5 flex-1"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12.5px",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            {study.overview}
          </p>

          {/* products & services pills */}
          {study.productsServices?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {study.productsServices.slice(0, 4).map((ps, i) => (
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

          {/* actions */}
          <div
            className="flex items-center gap-4 pt-4 flex-wrap"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <button
              onClick={() => onView(study)}
              className="inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-200"
              style={{ color: "#10b981", fontFamily: "'DM Sans', sans-serif", fontSize: "13px" }}
            >
              View Details
              <ArrowRight size={13} />
            </button>

            <button
              onClick={() => onNavigate(study.company)}
              className="inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-200"
              style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif", fontSize: "12px" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#ffffff"}
              onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
            >
              <Eye size={12} />
              Full Profile
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

/* ─────────────────────────────────────────────────────────────
   CASE STUDY MODAL
───────────────────────────────────────────────────────────── */
const CaseStudyModal = ({ study, onClose, onNavigate }) => {
  if (!study) return null;

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
        className="relative w-full max-w-3xl rounded-2xl border overflow-hidden"
        style={{
          maxHeight: "85vh",
          overflowY: "auto",
          background: "rgba(4,14,30,0.97)",
          borderColor: "rgba(16,185,129,0.25)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(16,185,129,0.15), inset 0 1px 0 rgba(255,255,255,0.07)",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(16,185,129,0.4) rgba(255,255,255,0.02)",
        }}
      >
        <style>{`
          .case-modal::-webkit-scrollbar { width: 5px; }
          .case-modal::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 99px; }
          .case-modal::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.4); border-radius: 99px; }
          .case-modal::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.65); }
        `}</style>

        <div className="h-[2px]"
          style={{ background: "linear-gradient(90deg, transparent, #10b981, transparent)" }} />

        <div className="p-8">
          {/* header */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div
              className="flex-shrink-0 w-full md:w-48 h-40 md:h-48 rounded-xl overflow-hidden border"
              style={{ borderColor: "rgba(16,185,129,0.2)" }}
            >
              <img src={study.image} alt={study.title} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1">
              {/* sector + company */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div
                  className="px-2.5 py-1 rounded-full border"
                  style={{ borderColor: "rgba(16,185,129,0.4)", background: "rgba(16,185,129,0.1)", fontFamily: "'DM Sans', sans-serif", fontSize: "9.5px", fontWeight: 600, letterSpacing: "0.13em", textTransform: "uppercase", color: "#10b981" }}
                >
                  {study.sector}
                </div>
                <button
                  onClick={() => { onClose(); onNavigate(study.company); }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full border transition-all duration-200"
                  style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.5)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#10b981"; e.currentTarget.style.borderColor = "rgba(16,185,129,0.3)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                >
                  <Building2 size={9} />
                  {study.company}
                </button>
              </div>

              <h2
                className="font-bold text-white leading-tight mb-2"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.2rem, 2.5vw, 1.7rem)" }}
              >
                {study.title}
              </h2>

              <div className="mb-4 h-px w-12"
                style={{ background: "linear-gradient(90deg, #10b981, transparent)" }} />

              {/* meta */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: MapPin,     label: "Location",   value: study.location,   color: "#06b6d4" },
                  { icon: DollarSign, label: "Value",      value: study.value,      color: "#10b981" },
                  { icon: Calendar,   label: "Completion", value: study.completion, color: "#f59e0b" },
                  { icon: TrendingUp, label: "Type",       value: study.type,       color: "#8b5cf6" },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon size={12} style={{ color, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</p>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* details grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* overview */}
            <div
              className="rounded-xl p-5 border"
              style={{ borderColor: "rgba(16,185,129,0.2)", background: "rgba(16,185,129,0.05)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <FileText size={13} style={{ color: "#10b981" }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#10b981", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Project Overview
                </span>
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, fontWeight: 300 }}>
                {study.scopeOfWork}
              </p>
            </div>

            {/* key features */}
            <div
              className="rounded-xl p-5 border"
              style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={13} style={{ color: "rgba(255,255,255,0.4)" }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Key Features
                </span>
              </div>
              <ul className="space-y-2">
                {study.keyFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span style={{ color: "#10b981", marginTop: "5px", flexShrink: 0, fontSize: "6px" }}>●</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: "rgba(255,255,255,0.55)", lineHeight: 1.65, fontWeight: 300 }}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* products & services */}
          {study.productsServices?.length > 0 && (
            <div className="rounded-xl p-5 border" style={{ borderColor: "rgba(6,182,212,0.2)", background: "rgba(6,182,212,0.05)" }}>
              <div className="flex items-center gap-2 mb-3">
                <Zap size={13} style={{ color: "#06b6d4" }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#06b6d4", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Products & Services
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {study.productsServices.map((ps, i) => (
                  <span key={i} className="px-2 py-1 rounded-full text-xs" style={{ fontFamily: "'DM Sans', sans-serif", background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.3)", color: "#06b6d4" }}>
                    {ps}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Challenges, Solution, Outcome */}
          {(study.challenges || study.solution || study.outcome) && (
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              {study.challenges && (
                <div className="rounded-xl p-5 border" style={{ borderColor: "rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span style={{ color: "#ef4444", fontSize: "12px" }}>⚠</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#ef4444", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                      Challenges
                    </span>
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, fontWeight: 300 }}>
                    {study.challenges}
                  </p>
                </div>
              )}
              {study.solution && (
                <div className="rounded-xl p-5 border" style={{ borderColor: "rgba(59,130,246,0.2)", background: "rgba(59,130,246,0.05)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span style={{ color: "#3b82f6", fontSize: "12px" }}>💡</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#3b82f6", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                      Solution
                    </span>
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, fontWeight: 300 }}>
                    {study.solution}
                  </p>
                </div>
              )}
              {study.outcome && (
                <div className="rounded-xl p-5 border" style={{ borderColor: "rgba(16,185,129,0.2)", background: "rgba(16,185,129,0.05)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span style={{ color: "#10b981", fontSize: "12px" }}>✓</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#10b981", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                      Outcome
                    </span>
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, fontWeight: 300 }}>
                    {study.outcome}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* full profile CTA */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => { onClose(); onNavigate(study.company); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-300"
              style={{ borderColor: "rgba(16,185,129,0.35)", background: "rgba(16,185,129,0.08)", color: "#10b981", fontFamily: "'DM Sans', sans-serif" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(16,185,129,0.18)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(16,185,129,0.08)"}
            >
              <Eye size={13} />
              Full Company Profile
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */
const IndustryCaseStudies = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("All");
  const [selectedSector, setSelectedSector] = useState("All");
  const [adminCaseStudies, setAdminCaseStudies] = useState([]);
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  useEffect(() => {
    const loadCaseStudies = async () => {
      try {
        const data = await getContent("case-studies");
        if (!Array.isArray(data) || data.length === 0) return;
        const transformed = data.map((study, index) => ({
          id: index + 1000,
          title: study.title,
          company: study.company,
          sector: study.sector,
          location: study.location,
          type: `${study.sector} Project`,
          value: study.year ? `Completed ${study.year}` : "Recent Project",
          completion: study.year || "Recent",
          image: study.images?.[0] || "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80",
          overview: study.overview || study.description,
          scopeOfWork: study.overview || study.description,
          keyFeatures: study.keyFeatures?.filter(Boolean)?.length > 0 ? study.keyFeatures.filter(Boolean) : [
            "Case study submitted by company",
            `Sector: ${study.sector}`,
            `Location: ${study.location}`,
          ],
          productsServices: study.productsServices || [],
          challenges: study.challenges || "",
          solution: study.solution || "",
          outcome: study.outcome || "",
          gallery: study.images?.filter(Boolean) || [],
        }));
        setAdminCaseStudies(transformed);
      } catch (error) {
        console.error("[IndustryCaseStudies] Error:", error);
      }
    };
    loadCaseStudies();
  }, []);

  const uniqueCompanies = ["All", ...Array.from(new Set(adminCaseStudies.map(s => s.company)))];
  const uniqueSectors   = ["All", ...Array.from(new Set(adminCaseStudies.map(s => s.sector)))];

  const filtered = adminCaseStudies.filter((study) => {
    const q = searchTerm.toLowerCase();
    const matchSearch = !searchTerm || study.title.toLowerCase().includes(q) || study.company.toLowerCase().includes(q);
    const matchCompany = selectedCompany === "All" || study.company === selectedCompany;
    const matchSector  = selectedSector  === "All" || study.sector  === selectedSector;
    return matchSearch && matchCompany && matchSector;
  });

  const handleCompanyNavigation = (company) => {
    const slug = String(company || "").toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
    navigate(`/company/${slug}?tab=caseStudies`);
  };

  const hasFilters = searchTerm || selectedCompany !== "All" || selectedSector !== "All";

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
          style={{ background: "radial-gradient(circle, #10b981, transparent 70%)" }} />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)" }} />
      </div>

      <ScrollingBanner />

      {/* ── HERO ── */}
      <div ref={heroRef} className="relative w-full overflow-hidden" style={{ height: "clamp(480px, 80vh, 750px)" }}>
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <img
            src="/new/case.jpeg"
            alt="Industry Case Studies"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(1.08) saturate(1.2)" }}
          />
        </motion.div>
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(4,14,30,0.25) 0%, rgba(4,14,30,0.55) 60%, #040e1e 100%)" }} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(4,14,30,0.65) 0%, rgba(4,14,30,0.1) 60%, transparent 100%)" }} />

        <motion.div
          className="absolute inset-0 flex flex-col justify-end pb-16 px-8 md:px-16 lg:px-24 max-w-6xl pt-32"
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
            Industry<br />Case Studies
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14px, 1.8vw, 18px)", color: "rgba(255,255,255,0.5)", maxWidth: "520px", lineHeight: 1.75, fontWeight: 300 }}
          >
            Explore, evaluate, compare and contrast verifiable case studies from across the sustainability and renewable sector.
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
            style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.35), transparent)" }} />

          {/* search row */}
          <div className="flex gap-3 mb-5">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
              <input
                type="text"
                placeholder="Search by title or company…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  paddingLeft: "36px",
                  paddingRight: "16px",
                  paddingTop: "11px",
                  paddingBottom: "11px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: "12px",
                  color: "#ffffff",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  fontWeight: 300,
                  outline: "none",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.45)"; e.currentTarget.style.background = "rgba(16,185,129,0.04)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 rounded-xl border transition-all duration-200"
              style={{
                borderColor: showFilters ? "rgba(16,185,129,0.45)" : "rgba(255,255,255,0.09)",
                background: showFilters ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.03)",
                color: showFilters ? "#10b981" : "rgba(255,255,255,0.5)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              <Filter size={13} />
              Filters
              <ChevronDown size={12} style={{ transform: showFilters ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
            </button>
          </div>

          {/* expandable filter rows */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 pt-2 pb-4 border-b mb-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  {/* company filter */}
                  <div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
                      Company
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {uniqueCompanies.map((c) => (
                        <button
                          key={c}
                          onClick={() => setSelectedCompany(c)}
                          className="px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200"
                          style={{
                            borderColor: selectedCompany === c ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.08)",
                            background: selectedCompany === c ? "rgba(16,185,129,0.1)" : "transparent",
                            color: selectedCompany === c ? "#10b981" : "rgba(255,255,255,0.45)",
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* sector filter */}
                  <div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
                      Sector
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {uniqueSectors.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSector(s)}
                          className="px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200"
                          style={{
                            borderColor: selectedSector === s ? "rgba(6,182,212,0.5)" : "rgba(255,255,255,0.08)",
                            background: selectedSector === s ? "rgba(6,182,212,0.1)" : "transparent",
                            color: selectedSector === s ? "#06b6d4" : "rgba(255,255,255,0.45)",
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* count + clear */}
          <div className="flex items-center justify-between">
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
              Showing{" "}
              <span style={{ color: "#10b981", fontWeight: 500 }}>{filtered.length}</span>{" "}
              case stud{filtered.length !== 1 ? "ies" : "y"}
            </p>
            {hasFilters && (
              <button
                onClick={() => { setSearchTerm(""); setSelectedCompany("All"); setSelectedSector("All"); }}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11.5px", color: "rgba(255,255,255,0.3)", cursor: "pointer" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#ffffff"}
                onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}
              >
                Clear all
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── CASE STUDIES LIST ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-24 space-y-4">
        {filtered.length > 0 ? (
          filtered.map((study, index) => (
            <CaseStudyCard
              key={study.id}
              study={study}
              index={index}
              onView={setSelectedStudy}
              onNavigate={handleCompanyNavigation}
            />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 rounded-2xl border"
            style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <FileText size={20} style={{ color: "#10b981" }} />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "#ffffff", marginBottom: "8px" }}>
              No case studies found
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
              Try adjusting your search or filter criteria.
            </p>
          </motion.div>
        )}
      </div>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {selectedStudy && (
          <CaseStudyModal
            study={selectedStudy}
            onClose={() => setSelectedStudy(null)}
            onNavigate={handleCompanyNavigation}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default IndustryCaseStudies;
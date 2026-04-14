import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ScrollingBanner from "../home/ScrollingBanner";
import {
  MapPin, Calendar, DollarSign, Zap, X, Eye, ArrowRight,
  ChevronLeft, ChevronRight, Briefcase, Award, Search,
  Filter, Building2, ChevronDown, CheckCircle,
} from "lucide-react";
import { getContent } from "../../utils/contentAPI";

/* ─────────────────────────────────────────────────────────────
   PROJECT CARD
───────────────────────────────────────────────────────────── */
const ProjectCard = ({ project, index, onView, onNavigate }) => {
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
        className="relative overflow-hidden rounded-2xl border transition-all duration-500 flex flex-col lg:flex-row"
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
          style={{ width: "clamp(200px, 30%, 340px)", minHeight: "200px" }}
        >
          <motion.img
            src={project.image}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover"
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(90deg, rgba(4,14,30,0) 40%, rgba(4,14,30,0.9) 100%)" }}
          />

          {/* sector badge */}
          <div
            className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
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
            <Zap size={9} />
            {project.sector || "Project"}
          </div>

          {/* gallery count */}
          <div
            className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full"
            style={{
              background: "rgba(4,14,30,0.7)",
              border: "1px solid rgba(255,255,255,0.1)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "10px",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            <Eye size={10} />
            {project.gallery.length}
          </div>
        </div>

        {/* content */}
        <div className="flex-1 flex flex-col px-6 md:px-8 py-5">

          {/* company */}
          <div className="flex items-center gap-1.5 mb-2">
            <Building2 size={10} style={{ color: "#10b981" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10.5px", color: "#10b981", fontWeight: 500, opacity: 0.85 }}>
              {project.company}
            </span>
          </div>

          {/* title */}
          <h3
            className="font-bold text-white leading-snug mb-3"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1rem, 1.5vw, 1.2rem)" }}
          >
            {project.title}
          </h3>

          {/* accent rule */}
          <div
            className="mb-3 h-px transition-all duration-500"
            style={{
              background: "linear-gradient(90deg, #10b981, transparent)",
              width: hovered ? "52px" : "24px",
            }}
          />

          {/* meta */}
          <div className="flex flex-wrap gap-4 mb-4">
            {[
              { icon: MapPin,     value: project.location,   color: "#06b6d4" },
              { icon: DollarSign, value: project.value,      color: "#10b981" },
              { icon: Calendar,   value: project.completion, color: "#f59e0b" },
            ].map(({ icon: Icon, value, color }) => value && (
              <div key={color} className="flex items-center gap-1.5">
                <Icon size={11} style={{ color }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.55)", fontWeight: 300 }}>{value}</span>
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
            {project.overview || "A successfully completed renewable energy project demonstrating innovation and sustainability."}
          </p>

          {/* feature pills */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.keyFeatures.slice(0, 3).map((f, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full border"
                style={{
                  borderColor: "rgba(16,185,129,0.2)",
                  background: "rgba(16,185,129,0.05)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                {f.length > 38 ? f.substring(0, 38) + "…" : f}
              </span>
            ))}
          </div>

          {/* products & services pills */}
          {project.productsServices?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {project.productsServices.slice(0, 4).map((ps, i) => (
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
              onClick={() => onView(project)}
              className="inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-200"
              style={{ color: "#10b981", fontFamily: "'DM Sans', sans-serif", fontSize: "13px" }}
            >
              View Details
              <ArrowRight size={13} />
            </button>

            <button
              onClick={() => onNavigate(project.company)}
              className="inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-200"
              style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif", fontSize: "12px" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#ffffff"}
              onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
            >
              <Eye size={12} />
              Company Profile
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

/* ─────────────────────────────────────────────────────────────
   PROJECT MODAL
───────────────────────────────────────────────────────────── */
const ProjectModal = ({ project, onClose, onNavigate }) => {
  const [galleryIdx, setGalleryIdx] = useState(0);
  if (!project) return null;

  const prev = () => setGalleryIdx((p) => (p - 1 + project.gallery.length) % project.gallery.length);
  const next = () => setGalleryIdx((p) => (p + 1) % project.gallery.length);

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
        className="relative w-full max-w-5xl rounded-2xl border overflow-hidden flex flex-col"
        style={{
          maxHeight: "88vh",
          background: "rgba(4,14,30,0.97)",
          borderColor: "rgba(16,185,129,0.25)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(16,185,129,0.15), inset 0 1px 0 rgba(255,255,255,0.07)",
        }}
      >
        <div className="h-[2px] flex-shrink-0"
          style={{ background: "linear-gradient(90deg, transparent, #10b981, transparent)" }} />

        {/* header */}
        <div
          className="flex items-start justify-between px-7 py-5 flex-shrink-0 border-b"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#10b981", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, marginBottom: "4px" }}>
              {project.sector}
            </p>
            <h3
              className="font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.1rem, 2vw, 1.5rem)", lineHeight: 1.2 }}
            >
              {project.title}
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11.5px", color: "#10b981", fontWeight: 500, marginTop: "3px" }}>
              {project.company}
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 mt-1"
            style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)"; e.currentTarget.style.color = "#10b981"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
          >
            <X size={14} />
          </button>
        </div>

        {/* scrollable body */}
        <div
          className="flex-1 overflow-y-auto p-7"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(16,185,129,0.4) rgba(255,255,255,0.02)",
          }}
        >
          <style>{`
            .proj-modal::-webkit-scrollbar { width: 5px; }
            .proj-modal::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 99px; }
            .proj-modal::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.4); border-radius: 99px; }
            .proj-modal::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.65); }
          `}</style>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">

            {/* left: gallery + stats */}
            <div className="space-y-4">
              {/* main image */}
              <div className="relative rounded-xl overflow-hidden aspect-video border" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={galleryIdx}
                    src={project.gallery[galleryIdx]}
                    alt={`Image ${galleryIdx + 1}`}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {project.gallery.length > 1 && (
                  <>
                    <button
                      onClick={prev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200"
                      style={{ background: "rgba(4,14,30,0.7)", borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }}
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      onClick={next}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200"
                      style={{ background: "rgba(4,14,30,0.7)", borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }}
                    >
                      <ChevronRight size={14} />
                    </button>
                  </>
                )}

                {/* counter */}
                <div
                  className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(4,14,30,0.75)", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.5)" }}
                >
                  {galleryIdx + 1} / {project.gallery.length}
                </div>
              </div>

              {/* thumbnails */}
              {project.gallery.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                  {project.gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setGalleryIdx(i)}
                      className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border transition-all duration-200"
                      style={{
                        borderColor: i === galleryIdx ? "#10b981" : "rgba(255,255,255,0.1)",
                        boxShadow: i === galleryIdx ? "0 0 12px rgba(16,185,129,0.35)" : "none",
                      }}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* stats */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Project Value", value: project.value, color: "#10b981" },
                  { label: "Completion",    value: project.completion, color: "#06b6d4" },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    className="rounded-xl p-4 border text-center"
                    style={{ borderColor: `rgba(${color === "#10b981" ? "16,185,129" : "6,182,212"},0.2)`, background: `rgba(${color === "#10b981" ? "16,185,129" : "6,182,212"},0.05)` }}
                  >
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>{label}</p>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* right: details */}
            <div className="space-y-4">
              {/* location */}
              <div className="rounded-xl p-4 border" style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={12} style={{ color: "#06b6d4" }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Location</span>
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.65)", fontWeight: 300 }}>{project.location}</p>
              </div>

              {/* overview */}
              <div className="rounded-xl p-4 border" style={{ borderColor: "rgba(16,185,129,0.2)", background: "rgba(16,185,129,0.05)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={12} style={{ color: "#10b981" }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#10b981", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Overview</span>
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, fontWeight: 300 }}>{project.overview}</p>
              </div>

              {/* key features */}
              <div className="rounded-xl p-4 border" style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Award size={12} style={{ color: "rgba(255,255,255,0.4)" }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Key Features</span>
                </div>
                <ul className="space-y-2">
                  {project.keyFeatures.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span style={{ color: "#10b981", marginTop: "5px", flexShrink: 0, fontSize: "6px" }}>●</span>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: "rgba(255,255,255,0.55)", lineHeight: 1.65, fontWeight: 300 }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* outcome */}
              {project.outcome && (
                <div className="rounded-xl p-4 border" style={{ borderColor: "rgba(16,185,129,0.2)", background: "rgba(16,185,129,0.05)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={12} style={{ color: "#10b981" }} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#10b981", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Outcome</span>
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, fontWeight: 300, whiteSpace: "pre-line" }}>{project.outcome}</p>
                </div>
              )}

              {/* products & services */}
              {project.productsServices?.length > 0 && (
                <div className="rounded-xl p-4 border" style={{ borderColor: "rgba(6,182,212,0.2)", background: "rgba(6,182,212,0.05)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={12} style={{ color: "#06b6d4" }} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#06b6d4", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Products & Services</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.productsServices.map((ps, i) => (
                      <span key={i} className="px-2 py-1 rounded-full text-xs" style={{ fontFamily: "'DM Sans', sans-serif", background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.3)", color: "#06b6d4" }}>
                        {ps}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* work delivered */}
              {project.workDelivered && project.workDelivered !== "Not specified" && (
                <div className="rounded-xl p-4 border" style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase size={12} style={{ color: "rgba(255,255,255,0.4)" }} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Work Delivered</span>
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, fontWeight: 300, whiteSpace: "pre-line" }}>{project.workDelivered}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* footer */}
        <div
          className="flex items-center justify-end gap-3 px-7 py-4 flex-shrink-0 border-t"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border text-sm transition-all duration-200"
            style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "#ffffff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
          >
            Close
          </button>

          <button
            onClick={() => { onClose(); onNavigate(project.company); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-300"
            style={{ borderColor: "rgba(16,185,129,0.35)", background: "rgba(16,185,129,0.08)", color: "#10b981", fontFamily: "'DM Sans', sans-serif" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(16,185,129,0.18)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(16,185,129,0.08)"}
          >
            <Eye size={13} />
            View Company Profile
            <ArrowRight size={12} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */
const RecentCompletedProjects = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");
  const [adminProjects, setAdminProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getContent("showcase");
        if (!Array.isArray(data) || data.length === 0) return;
        const transformed = data.map((p, i) => ({
          id: i + 1000,
          title: p.title,
          company: p.company,
          sector: p.sector,
          location: p.location,
          type: `${p.sector} Project`,
          value: p.projectValue || "Recent Project",
          completion: p.completedDate || "Recent",
          image: p.images?.[0] || "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80",
          overview: p.overview,
          workDelivered: p.workDelivered || "Not specified",
          keyFeatures: p.keyFeatures
            ? p.keyFeatures.split("\n").filter((f) => f.trim())
            : [`Sector: ${p.sector}`, `Location: ${p.location}`],
          outcome: p.outcome,
          gallery: p.images?.filter(Boolean).length > 0
            ? p.images.filter(Boolean)
            : ["https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80"],
        }));
        setAdminProjects(transformed);
      } catch (err) {
        console.error("[RecentCompletedProjects] Error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setSelectedProject(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const sectors = ["All", ...Array.from(new Set(adminProjects.map((p) => p.sector).filter(Boolean)))];

  const filtered = adminProjects.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      (!searchTerm || p.company.toLowerCase().includes(q) || p.title.toLowerCase().includes(q) || p.overview?.toLowerCase().includes(q)) &&
      (selectedSector === "All" || p.sector === selectedSector)
    );
  });

  const handleNavigate = (company) => {
    const slug = company.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
    navigate(`/company/${slug}?tab=projects`);
  };

  const hasFilters = searchTerm || selectedSector !== "All";

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
        <motion.div className="absolute inset-0" style={{ y: heroY, willChange: "transform" }}>
          <img src="/show/project.jpeg" alt="Recently Completed Projects"
            className="w-full h-full object-cover" style={{ filter: "brightness(1.08) saturate(1.2)" }} />
        </motion.div>
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(4,14,30,0.25) 0%, rgba(4,14,30,0.55) 60%, #040e1e 100%)" }} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(4,14,30,0.65) 0%, rgba(4,14,30,0.1) 60%, transparent 100%)" }} />

        <motion.div
          className="absolute inset-0 flex flex-col justify-end pb-16 px-8 md:px-16 lg:px-24 max-w-6xl pt-32"
          style={{ opacity: heroOpacity }}
        >
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.7 }}
            className="flex items-center gap-3 mb-6">
            <div className="h-px w-10" style={{ background: "#10b981" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.22em", color: "#10b981", textTransform: "uppercase", fontWeight: 500 }}>
              Success Stories
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hero-text-mask mb-5"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 4vw, 5rem)", fontWeight: 700, lineHeight: 1.26, letterSpacing: "-0.02em" }}>
            Projects In<br />Spotlight
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14px, 1.8vw, 18px)", color: "rgba(255,255,255,0.5)", maxWidth: "520px", lineHeight: 1.75, fontWeight: 300 }}>
          Showcasing our clients to advancing green technology through smart design and lasting impact.
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

          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
              <input
                type="text"
                placeholder="Search by company or title…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%", paddingLeft: "36px", paddingRight: "16px", paddingTop: "11px", paddingBottom: "11px",
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: "12px", color: "#ffffff",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 300, outline: "none",
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
                fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 500,
              }}
            >
              <Filter size={13} />
              Sector
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
                <div className="flex flex-wrap gap-2 py-3 border-b mb-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  {sectors.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSector(s)}
                      className="px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200"
                      style={{
                        borderColor: selectedSector === s ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.08)",
                        background: selectedSector === s ? "rgba(16,185,129,0.1)" : "transparent",
                        color: selectedSector === s ? "#10b981" : "rgba(255,255,255,0.45)",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between">
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
              Showing <span style={{ color: "#10b981", fontWeight: 500 }}>{filtered.length}</span> of{" "}
              <span style={{ color: "#10b981", fontWeight: 500 }}>{adminProjects.length}</span> projects
            </p>
            {hasFilters && (
              <button
                onClick={() => { setSearchTerm(""); setSelectedSector("All"); }}
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

      {/* ── LIST ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-24 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: "rgba(255,255,255,0.1)", borderTopColor: "#10b981" }} />
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={idx}
              onView={setSelectedProject}
              onNavigate={handleNavigate}
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
              <Building2 size={20} style={{ color: "#10b981" }} />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "#ffffff", marginBottom: "8px" }}>
              No projects found
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
              Try adjusting your search or filter criteria.
            </p>
          </motion.div>
        )}
      </div>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onNavigate={handleNavigate}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecentCompletedProjects;
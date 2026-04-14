import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getContent } from "../../utils/contentAPI";
import { getAllCompanies } from "../../utils/companiesAPI";


const ACCENT_COLORS = [
  { hex: "#10b981", rgb: "16,185,129" },
  { hex: "#06b6d4", rgb: "6,182,212" },
  { hex: "#8b5cf6", rgb: "139,92,246" },
];

/* ─────────────────────────────────────────────────────────────
   CARD
───────────────────────────────────────────────────────────── */

const limitWords = (text, maxWords) => {
  if (!text) return "";
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
};

const CaseStudyCard = ({ cs, index, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group cursor-pointer"
      onClick={onClick}
    >
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden border transition-all duration-500 flex flex-col"
        style={{
          borderColor: hovered ? `rgba(${accent.rgb},0.4)` : "rgba(255,255,255,0.07)",
          boxShadow: hovered
            ? `0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(${accent.rgb},0.2)`
            : "0 4px 24px rgba(0,0,0,0.35)",
        }}
      >
        {/* top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] z-20 transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent.hex}, transparent)`,
            opacity: hovered ? 1 : 0.25,
          }}
        />

        {/* image — fixed pixel height instead of percentage */}
        <div className="relative overflow-hidden flex-shrink-0" style={{ height: "200px" }}>
          <motion.img
            src={cs.image}
            alt={cs.title}
            className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(4,14,30,0.85) 100%)" }}
          />

          {/* featured badge */}
          {cs.featured && (
            <div
              className="absolute top-4 left-4 px-3 py-1 rounded-full border"
              style={{
                borderColor: `rgba(${accent.rgb},0.5)`,
                background: `rgba(${accent.rgb},0.15)`,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: accent.hex,
              }}
            >
              Featured
            </div>
          )}

          {/* impact badge */}
          <div
            className="absolute bottom-4 right-4 px-3 py-1 rounded-full"
            style={{
              background: "rgba(4,14,30,0.7)",
              border: "1px solid rgba(255,255,255,0.12)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "10px",
              color: "rgba(255,255,255,0.7)",
              fontWeight: 500,
            }}
          >
            {cs.impact}
          </div>
        </div>

        {/* content */}
        <div
          className="flex flex-col px-5 py-4"
          style={{ background: "rgba(4,14,30,0.97)" }}
        >
          {/* company */}
          <p
            className="mb-2"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "10.5px",
              color: accent.hex,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontWeight: 500,
              opacity: 0.9,
            }}
          >
            {cs.company}
          </p>

          {/* title */}
          <h3
            className="mb-2.5 font-bold leading-snug text-white"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1rem, 1.4vw, 1.2rem)",
            }}
          >
            {limitWords(cs.title, 5)}
          </h3>

          {/* accent rule */}
          <div
            className="mb-2.5 h-px transition-all duration-500"
            style={{
              background: `linear-gradient(90deg, ${accent.hex}, transparent)`,
              width: hovered ? "52px" : "24px",
            }}
          />

          {/* summary */}
          <p
            className="line-clamp-3 mb-3"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12.5px",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            {limitWords(cs.summary, 15)}
          </p>

          {/* date + location */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1.5">
              <Calendar size={11} style={{ color: accent.hex }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>
                {cs.stats.date}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={11} style={{ color: accent.hex }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>
                {cs.stats.location}
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-1.5">
            <div
              className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-200"
              style={{ color: accent.hex, fontFamily: "'DM Sans', sans-serif", fontSize: "13px" }}
            >
              View Case Study
              <ArrowRight size={13} />
            </div>
          </div>
        </div>

        {/* ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-700"
          style={{
            background: `radial-gradient(ellipse at 50% 100%, rgba(${accent.rgb},0.12), transparent 60%)`,
            opacity: hovered ? 1 : 0,
          }}
        />
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SECTION
───────────────────────────────────────────────────────────── */
export default function CaseStudySection() {
  const navigate = useNavigate();
  const [caseStudies, setCaseStudies] = useState([]);
  const [companiesByName, setCompaniesByName] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawData = await getContent("case-studies");
        if (rawData && rawData.length > 0) {
          const mapped = rawData.map(item => ({
            company: item.company || "Unknown Company",
            title: item.title || "Untitled Case Study",
            image: item.images?.[0] || item.image || "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80",
            summary: item.overview || item.summary || item.description || "No summary available.",
            stats: {
              date: item.completedDate || item.completionDate || item.date || item.year || "N/A",
              location: item.location || "N/A",
            },
            impact: item.impact || "Sustainability",
            featured: item.featured || false,
            link: item.link || "/showcase-hub/industry-case-studies",
          }));
          setCaseStudies(mapped);
        }
      } catch (err) {
        console.error("Error loading case studies:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await getAllCompanies();
        if (!res?.success) return;
        const list = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
        const map = {};
        list.forEach((c) => {
          const name = String(c?.companyName || "").trim().toLowerCase();
          const id = c?.id;
          if (!name || !id) return;
          map[name] = String(id);
        });
        setCompaniesByName(map);
      } catch (e) { /* ignore */ }
    };
    fetchCompanies();
  }, []);

  const handleViewCaseStudy = (cs) => {
    const key = String(cs?.company || "").trim().toLowerCase();
    const id = companiesByName[key];
    navigate(id ? `/company/${id}?tab=caseStudies` : cs.link || "/case-studies");
  };

  if (!caseStudies || caseStudies.length === 0) return null;

  return (
    <section
      className="relative py-10 md:py-12 overflow-hidden"
      style={{ background: "#040e1e" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>

      {/* ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-60 left-1/3 w-[600px] h-[500px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(ellipse, #10b981, transparent 65%)" }}
        />
        <div
          className="absolute -bottom-40 right-1/4 w-[500px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(ellipse, #8b5cf6, transparent 65%)" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
        >
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10" style={{ background: "#10b981" }} />
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                letterSpacing: "0.22em",
                color: "#10b981",
                textTransform: "uppercase",
                fontWeight: 500,
              }}>
                Real World Impact
              </span>
            </div>

            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4.5vw, 3.6rem)",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
            }}>
              Industry
              <br />
              <span style={{
                background: "linear-gradient(90deg, #10b981, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Case Studies
              </span>
            </h2>
          </div>

          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(13px, 1.4vw, 15px)",
            color: "rgba(255,255,255,0.4)",
            lineHeight: 1.8,
            fontWeight: 300,
            maxWidth: "400px",
          }}>
            Explore how organisations across the UK and Ireland are integrating renewable technologies, improving operational efficiency, and meeting sustainability goals.
          </p>
        </motion.div>

        {/* ── GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {caseStudies.map((cs, index) => (
            <CaseStudyCard
              key={index}
              cs={cs}
              index={index}
              onClick={() => handleViewCaseStudy(cs)}
            />
          ))}
        </div>

        {/* ── VIEW ALL ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 flex justify-center"
        >
          <motion.button
            type="button"
            onClick={() => navigate("/showcase-hub/industry-case-studies")}
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
            View All Case Studies
            <ArrowRight size={13} />
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
}

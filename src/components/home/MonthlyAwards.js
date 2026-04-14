import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight } from 'lucide-react';
import { getContent } from '../../utils/contentAPI';
import { useNavigate } from 'react-router-dom';


const ACCENT_COLORS = [
  { hex: "#10b981", rgb: "16,185,129" },
  { hex: "#06b6d4", rgb: "6,182,212" },
  { hex: "#8b5cf6", rgb: "139,92,246" },
  { hex: "#f59e0b", rgb: "245,158,11" },
  { hex: "#ec4899", rgb: "236,72,153" },
];

/* ─────────────────────────────────────────────────────────────
   AWARD CARD
───────────────────────────────────────────────────────────── */
const AwardCard = ({ award, index, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="cursor-pointer flex flex-col"
    >
      <div
        className="relative flex flex-col flex-1 rounded-2xl overflow-hidden border transition-all duration-500"
        style={{
          borderColor: hovered ? `rgba(${accent.rgb},0.4)` : "rgba(255,255,255,0.07)",
          background: "rgba(4,14,30,0.97)",
          boxShadow: hovered
            ? `0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(${accent.rgb},0.2)`
            : "0 4px 20px rgba(0,0,0,0.35)",
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

        {/* image */}
        <div className="relative overflow-hidden flex-shrink-0" style={{ height: "160px" }}>
          {award.image ? (
            <motion.img
              src={award.image}
              alt={award.personName || award.title}
              className="w-full h-full object-cover"
              animate={{ scale: hovered ? 1.07 : 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          ) : (
            <div className="w-full h-full" style={{ background: `rgba(${accent.rgb},0.08)` }} />
          )}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(4,14,30,0.9) 100%)" }}
          />

          {/* trophy icon */}
          <div
            className="absolute top-3 left-3 w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-300"
            style={{
              borderColor: `rgba(${accent.rgb},0.4)`,
              background: `rgba(${accent.rgb},0.12)`,
              boxShadow: hovered ? `0 0 14px rgba(${accent.rgb},0.35)` : "none",
            }}
          >
            <Trophy size={13} style={{ color: accent.hex }} />
          </div>

          {/* year badge */}
          {award.year && (
            <div
              className="absolute top-3 right-3 px-2 py-0.5 rounded-full border"
              style={{
                borderColor: "rgba(255,255,255,0.1)",
                background: "rgba(4,14,30,0.7)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "10px",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {award.year}
            </div>
          )}
        </div>

        {/* content */}
        <div className="flex flex-col flex-1 px-5 py-4">

          {/* award title */}
          <p
            className="mb-2"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "10px",
              color: accent.hex,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: 600,
              opacity: 0.9,
            }}
          >
            {award.title}
          </p>

          {/* person name */}
          <h3
            className="mb-1 font-bold text-white leading-snug"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(0.95rem, 1.1vw, 1.05rem)",
            }}
          >
            {award.personName}
          </h3>

          {/* company */}
          {award.companyName && (
            <p
              className="mb-3"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.05em",
              }}
            >
              {award.companyName}
            </p>
          )}

          {/* accent rule */}
          <div
            className="mb-3 h-px transition-all duration-500"
            style={{
              background: `linear-gradient(90deg, ${accent.hex}, transparent)`,
              width: hovered ? "44px" : "20px",
            }}
          />

          {/* description */}
          <p
            className="line-clamp-3 flex-1"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              color: "rgba(255,255,255,0.48)",
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            {award.description || "No description available."}
          </p>

        </div>

        {/* ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-700"
          style={{
            background: `radial-gradient(ellipse at 50% 100%, rgba(${accent.rgb},0.1), transparent 60%)`,
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
const MonthlyAwards = () => {
  const navigate = useNavigate();
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getContent("hallOfFame");
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((award) => ({
            id: award.id,
            title: award.title || award.awardTitle || "",
            personName: award.personName || award.name || "",
            companyName: award.companyName || award.company || "",
            year: award.awardYear || award.year || "",
            description: award.awardDescription || award.description || "",
            image: award.personImage || award.image || award.images?.[0] || "",
          }));
          setAwards(mapped);
        }
      } catch (error) {
        console.error("Error loading awards:", error);
        // API failed — keep mock data (already set as initial state)
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section
      className="relative py-14 md:py-16 overflow-hidden"
      style={{ background: "#040e1e" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>

      {/* ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-60 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(ellipse, #f59e0b, transparent 65%)" }}
        />
        <div
          className="absolute -bottom-40 left-1/4 w-[500px] h-[400px] rounded-full opacity-[0.035]"
          style={{ background: "radial-gradient(ellipse, #10b981, transparent 65%)" }}
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
              <div className="h-px w-10" style={{ background: "#f59e0b" }} />
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                letterSpacing: "0.22em",
                color: "#f59e0b",
                textTransform: "uppercase",
                fontWeight: 500,
              }}>
                Industry Heroes
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
              Hall of
              <br />
              <span style={{
                background: "linear-gradient(90deg, #f59e0b, #10b981)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Fame
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
            Honouring the pioneers, engineers, risk takers and innovators who shaped a cleaner, smarter, and more sustainable future.
          </p>
        </motion.div>

        {/* ── GRID ── */}
        {loading && awards.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: "rgba(255,255,255,0.1)", borderTopColor: "#10b981" }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {awards.map((award, index) => (
              <AwardCard
                key={award.id}
                award={award}
                index={index}
                onClick={() => navigate("/showcase-hub/hall-of-fame")}
              />
            ))}
          </div>
        )}

        {/* ── VIEW ALL ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 flex justify-center"
        >
          <motion.button
            onClick={() => navigate("/showcase-hub/hall-of-fame")}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border text-sm font-medium transition-all duration-300"
            style={{
              borderColor: "rgba(245,158,11,0.3)",
              color: "#f59e0b",
              background: "rgba(245,158,11,0.06)",
              fontFamily: "'DM Sans', sans-serif",
            }}
            whileHover={{ scale: 1.04, background: "rgba(245,158,11,0.14)", borderColor: "#f59e0b" }}
            whileTap={{ scale: 0.97 }}
          >
            View All Industry Heroes
            <ArrowRight size={13} />
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
};

export default MonthlyAwards;
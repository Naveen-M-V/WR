import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getSpotlightCompanies } from "../../utils/companiesAPI";
import { API_HOST } from "../../config";


const CompaniesSpotlight = () => {
  const navigate = useNavigate();
  const [spotlightCompanies, setSpotlightCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const res = await getSpotlightCompanies();
        const list = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
        const mapped = list.map(c => ({
          ...c,
          name: c.companyName,
          image: c.companyLogo
            ? `${API_HOST}${c.companyLogo}`
            : "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=500&q=80",
          category: c.mainSector || "Industry Leader",
          description: c.productsServices || c.description || "",
        }));
        setSpotlightCompanies(mapped);
      } catch (err) {
        console.error("Error loading spotlight companies:", err);
        // API failed — keep showing mock data (already set as initial state)
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const total = spotlightCompanies.length;

  const goPrev = useCallback(() => {
    if (isAnimating || total === 0) return;
    setIsAnimating(true);
    setDirection(-1);
    setCurrent(prev => (prev - 1 + total) % total);
    setTimeout(() => setIsAnimating(false), 450);
  }, [isAnimating, total]);

  const goNext = useCallback(() => {
    if (isAnimating || total === 0) return;
    setIsAnimating(true);
    setDirection(1);
    setCurrent(prev => (prev + 1) % total);
    setTimeout(() => setIsAnimating(false), 450);
  }, [isAnimating, total]);

  useEffect(() => {
    if (total <= 1) return;
    const id = setInterval(() => {
      setDirection(1);
      setCurrent(prev => (prev + 1) % total);
    }, 8000);
    return () => clearInterval(id);
  }, [total]);

  const handleCompanyClick = () => {
    const company = spotlightCompanies[current];
    if (company) navigate(`/company/${encodeURIComponent(company.slug)}`);
  };

  const company = spotlightCompanies[current];

  return (
    <section
      className="relative py-10 md:py-12 overflow-hidden"
      style={{ background: "#040e1e" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>

      {/* ── ambient blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full opacity-[0.055]"
          style={{ background: "radial-gradient(ellipse, #10b981, transparent 65%)" }} />
        <div className="absolute -bottom-40 right-0 w-[400px] h-[400px] rounded-full opacity-[0.035]"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent 65%)" }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 lg:pl-4 lg:pr-16">

        {/* ── TWO-COLUMN LAYOUT ── */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          {/* ── LEFT: header + description + nav ── */}
          <div className="lg:w-[42%] flex-shrink-0">

            {/* eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-px w-10" style={{ background: "#10b981" }} />
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                letterSpacing: "0.22em",
                color: "#10b981",
                textTransform: "uppercase",
                fontWeight: 500,
              }}>
                Featured
              </span>
            </motion.div>

            {/* title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginBottom: "1.5rem",
              }}
            >
              Company{" "}
              <br />
              <span style={{
                background: "linear-gradient(90deg, #10b981, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                "In Spotlight"
              </span>
            </motion.h2>

            {/* thin rule */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "48px" }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6 h-px"
              style={{ background: "linear-gradient(90deg, #10b981, transparent)" }}
            />

            {/* description */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "clamp(13px, 1.4vw, 15px)",
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.8,
                fontWeight: 300,
                marginBottom: "2.5rem",
              }}
            >
              Discover the companies setting new benchmarks in clean technology, innovation, and impact.
            </motion.p>

            {/* ── company info (updates with carousel) ── */}
            {!loading && total > 0 && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                >
                  {/* category badge */}
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border mb-4"
                    style={{
                      borderColor: "rgba(16,185,129,0.3)",
                      background: "rgba(16,185,129,0.07)",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#10b981",
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#10b981" }} />
                    {company?.category}
                  </div>

                  {/* company name */}
                  <h3
                    className="mb-3"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
                      fontWeight: 700,
                      color: "#ffffff",
                      lineHeight: 1.2,
                    }}
                  >
                    {company?.name}
                  </h3>

                  {/* company description */}
                  <p
                    className="mb-8 line-clamp-3"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px",
                      color: "rgba(255,255,255,0.5)",
                      lineHeight: 1.75,
                      fontWeight: 300,
                    }}
                  >
                    {company?.description || "Pioneering clean energy solutions."}
                  </p>

                  {/* view profile link */}
                  <button
                    onClick={handleCompanyClick}
                    className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-200"
                    style={{ color: "#10b981", fontFamily: "'DM Sans', sans-serif" }}
                    onMouseEnter={(e) => e.currentTarget.style.gap = "10px"}
                    onMouseLeave={(e) => e.currentTarget.style.gap = "8px"}
                  >
                    View Profile
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </motion.div>
              </AnimatePresence>
            )}

            {/* ── navigation ── */}
            {!loading && total > 1 && (
              <div className="flex items-center gap-5 mt-10">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous company"
                  className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200"
                  style={{
                    borderColor: "rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.04)",
                    color: "rgba(255,255,255,0.7)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)"; e.currentTarget.style.color = "#10b981"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                >
                  <ChevronLeft size={16} />
                </button>

                {/* dots */}
                <div className="flex items-center gap-1.5">
                  {spotlightCompanies.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (!isAnimating) {
                          setIsAnimating(true);
                          setDirection(idx > current ? 1 : -1);
                          setCurrent(idx);
                          setTimeout(() => setIsAnimating(false), 450);
                        }
                      }}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: idx === current ? "24px" : "6px",
                        height: "6px",
                        background: idx === current ? "#10b981" : "rgba(255,255,255,0.2)",
                      }}
                      aria-label={`Go to company ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next company"
                  className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200"
                  style={{
                    borderColor: "rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.04)",
                    color: "rgba(255,255,255,0.7)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)"; e.currentTarget.style.color = "#10b981"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* ── RIGHT: card ── */}
          <div className="lg:w-[58%] w-full flex items-center justify-center">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="w-8 h-8 rounded-full border-2 border-t-emerald-400 animate-spin"
                  style={{ borderColor: "rgba(255,255,255,0.1)", borderTopColor: "#10b981" }} />
              </div>
            ) : total === 0 ? (
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.3)" }}>
                No companies currently in spotlight.
              </p>
            ) : (
              <div className="relative w-full max-w-[460px] aspect-[4/5]">

                {/* stacked background cards */}
                {total > 2 && (
                  <div
                    className="absolute rounded-2xl border border-white/[0.06]"
                    style={{
                      inset: 0,
                      transform: "rotate(6deg) scale(0.92) translateY(12px)",
                      background: "rgba(255,255,255,0.02)",
                      zIndex: 1,
                    }}
                  />
                )}
                {total > 1 && (
                  <div
                    className="absolute rounded-2xl border border-white/[0.08]"
                    style={{
                      inset: 0,
                      transform: "rotate(3deg) scale(0.96) translateY(6px)",
                      background: "rgba(255,255,255,0.025)",
                      zIndex: 2,
                    }}
                  />
                )}

                {/* main card */}
                <AnimatePresence mode="wait">
                  <motion.button
                    key={current}
                    type="button"
                    onClick={handleCompanyClick}
                    className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden cursor-pointer focus:outline-none"
                    style={{
                      zIndex: 10,
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(16,185,129,0.12), inset 0 1px 0 rgba(255,255,255,0.07)",
                    }}
                    initial={{ opacity: 0, scale: 0.94, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: -16 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    whileHover={{ scale: 1.015, boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(16,185,129,0.25), inset 0 1px 0 rgba(255,255,255,0.1)" }}
                  >
                    {/* top accent bar */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[2px] z-20"
                      style={{ background: "linear-gradient(90deg, transparent, #10b981, transparent)" }}
                    />

                    <img
                      src={company?.image}
                      alt={company?.name}
                      className="w-full h-full object-contain p-4"
                    />

                    {/* bottom gradient */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: "linear-gradient(to top, rgba(4,14,30,0.7) 0%, rgba(4,14,30,0.1) 45%, transparent 65%)" }}
                    />

                    {/* bottom label */}
                    <div className="absolute bottom-0 left-0 right-0 px-7 pb-6 pt-12"
                      style={{ background: "linear-gradient(to top, rgba(4,14,30,0.9) 60%, transparent)" }}>
                      <p style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "10px",
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "#10b981",
                        marginBottom: "6px",
                        fontWeight: 500,
                      }}>
                        {company?.category}
                      </p>
                      <h3 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)",
                        fontWeight: 700,
                        color: "#ffffff",
                        lineHeight: 1.2,
                      }}>
                        {company?.name}
                      </h3>
                    </div>
                  </motion.button>
                </AnimatePresence>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default CompaniesSpotlight;

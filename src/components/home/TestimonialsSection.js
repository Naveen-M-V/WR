import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getContent } from "../../utils/contentAPI";

/* ─────────────────────────────────────────────────────────────
   STATIC FALLBACK DATA (used when API returns nothing)
───────────────────────────────────────────────────────────── */

const ACCENT_PAIRS = [
  { hex: "#10b981", rgb: "16,185,129" },
  { hex: "#06b6d4", rgb: "6,182,212" },
  { hex: "#8b5cf6", rgb: "139,92,246" },
  { hex: "#f59e0b", rgb: "245,158,11" },
  { hex: "#ec4899", rgb: "236,72,153" },
];

/* ─────────────────────────────────────────────────────────────
   STAR RATING
───────────────────────────────────────────────────────────── */
const Stars = ({ count, color }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(Math.min(count, 5))].map((_, i) => (
      <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={color}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   TESTIMONIAL CARD
───────────────────────────────────────────────────────────── */
const TestimonialCard = ({ testimonial, index }) => {
  const [hovered, setHovered] = useState(false);
  const accent = {
    hex: testimonial.accentHex || ACCENT_PAIRS[index % ACCENT_PAIRS.length].hex,
    rgb: testimonial.accentRgb || ACCENT_PAIRS[index % ACCENT_PAIRS.length].rgb,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col h-full"
    >
      <div
        className="relative flex flex-col flex-1 rounded-2xl border p-6 overflow-hidden transition-all duration-500"
        style={{
          borderColor: hovered ? `rgba(${accent.rgb},0.4)` : "rgba(255,255,255,0.07)",
          background: hovered
            ? `linear-gradient(145deg, rgba(${accent.rgb},0.08) 0%, rgba(4,14,30,0.98) 100%)`
            : "rgba(255,255,255,0.025)",
          boxShadow: hovered
            ? `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(${accent.rgb},0.2)`
            : "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {/* top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent.hex}, transparent)`,
            opacity: hovered ? 1 : 0.2,
          }}
        />

        {/* quote mark */}
        <div
          className="absolute top-4 right-5 text-6xl leading-none select-none pointer-events-none"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: `rgba(${accent.rgb},0.12)`,
            lineHeight: 1,
          }}
        >
          "
        </div>

        {/* avatar + name */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 transition-all duration-300"
            style={{
              boxShadow: hovered ? `0 0 0 2px rgba(${accent.rgb},0.5), 0 0 16px rgba(${accent.rgb},0.25)` : `0 0 0 1px rgba(255,255,255,0.1)`,
            }}
          >
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <p
              className="font-bold text-white truncate"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px" }}
            >
              {testimonial.name}
            </p>
            <p
              className="truncate"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                color: accent.hex,
                fontWeight: 500,
                opacity: 0.85,
              }}
            >
              {testimonial.role}
            </p>
            <p
              className="truncate"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "10.5px",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              {testimonial.company}
            </p>
          </div>
        </div>

        {/* stars */}
        <div className="mb-4">
          <Stars count={testimonial.rating} color={accent.hex} />
        </div>

        {/* accent rule */}
        <div
          className="mb-4 h-px transition-all duration-500"
          style={{
            background: `linear-gradient(90deg, ${accent.hex}, transparent)`,
            width: hovered ? "48px" : "20px",
          }}
        />

        {/* quote text */}
        <blockquote
          className="flex-1 line-clamp-5"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.75,
            fontWeight: 300,
            fontStyle: "italic",
          }}
        >
          "{testimonial.content}"
        </blockquote>

        {/* ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-700"
          style={{
            background: `radial-gradient(ellipse at 50% 100%, rgba(${accent.rgb},0.09), transparent 60%)`,
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
const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const rawData = await getContent("home-testimonials");
        if (rawData && rawData.length > 0) {
          const mapped = rawData.map((item, i) => ({
            id: item.id || i,
            name: item.name || "Anonymous",
            role: item.designation || "User",
            company: item.companyName || "Company",
            avatar: item.image || "/men.jpg",
            content: item.testimonial || "No testimonial provided.",
            rating: parseInt(item.stars, 10) || 5,
            accentHex: ACCENT_PAIRS[i % ACCENT_PAIRS.length].hex,
            accentRgb: ACCENT_PAIRS[i % ACCENT_PAIRS.length].rgb,
          }));
          setTestimonials(mapped);
        }
      } catch (e) {
        console.error("Error fetching testimonials", e);
      }
    };
    fetchTestimonials();

    // Refresh testimonials when window regains focus (after admin edits)
    const handleFocus = () => {
      fetchTestimonials();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const PER_PAGE = 3;
  const totalPages = Math.ceil(testimonials.length / PER_PAGE);

  const next = () => setCurrentIndex(prev => (prev + PER_PAGE >= testimonials.length ? 0 : prev + PER_PAGE));
  const prev = () => setCurrentIndex(prev => (prev - PER_PAGE < 0 ? Math.max(0, testimonials.length - PER_PAGE) : prev - PER_PAGE));

  useEffect(() => {
    if (testimonials.length <= PER_PAGE) return;
    const id = setInterval(next, 8000);
    return () => clearInterval(id);
  }, [testimonials.length]);

  let visible = testimonials.slice(currentIndex, currentIndex + PER_PAGE);
  if (visible.length < PER_PAGE && testimonials.length > PER_PAGE) {
    visible = [...visible, ...testimonials.slice(0, PER_PAGE - visible.length)];
  }

  if (testimonials.length === 0) return null;

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
          className="absolute -top-60 right-1/3 w-[600px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(ellipse, #8b5cf6, transparent 65%)" }}
        />
        <div
          className="absolute -bottom-40 left-1/3 w-[500px] h-[400px] rounded-full opacity-[0.04]"
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
              <div className="h-px w-10" style={{ background: "#10b981" }} />
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                letterSpacing: "0.22em",
                color: "#10b981",
                textTransform: "uppercase",
                fontWeight: 500,
              }}>
                What They Say
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
              Tributes &
              <br />
              <span style={{
                background: "linear-gradient(90deg, #10b981, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Testimonials
              </span>
            </h2>
          </div>

          {/* navigation — shown only when more than 3 */}
          {testimonials.length > PER_PAGE && (
            <div className="flex items-center gap-4">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200"
                style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)"; e.currentTarget.style.color = "#10b981"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i * PER_PAGE)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: Math.floor(currentIndex / PER_PAGE) === i ? "20px" : "5px",
                      height: "5px",
                      background: Math.floor(currentIndex / PER_PAGE) === i ? "#10b981" : "rgba(255,255,255,0.2)",
                    }}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200"
                style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)"; e.currentTarget.style.color = "#10b981"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </motion.div>

        {/* ── CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="wait">
            {visible.map((testimonial, index) => (
              <TestimonialCard
                key={`${testimonial.id}-${currentIndex}`}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
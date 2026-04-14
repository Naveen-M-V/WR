import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, Calendar, Zap, Eye, ChevronLeft, ChevronRight, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getContent } from "../../utils/contentAPI";


export default function UpcomingProjects() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawData = await getContent("showcase");
        if (rawData && rawData.length > 0) {
          const mapped = rawData.map(item => ({
            id: item.id || Math.random(),
            title: item.title || item.name || "Untitled Project",
            location: item.location || "Unknown Location",
            type: item.type || "Renewable Energy",
            capacity: item.capacity || item.projectValue || "N/A",
            completion: item.completion || item.completedDate || "Completed",
            status: "Completed",
            progress: 100,
            image: item.images?.[0] || item.image || "/projects/project1.jpg",
            highlights: item.keyFeatures
              ? (Array.isArray(item.keyFeatures) ? item.keyFeatures : [item.keyFeatures])
              : ["Innovation", "Sustainability", "Impact"],
          }));
          setProjects(mapped);
        }
      } catch (err) {
        console.error("Error loading completed projects:", err);
        // API failed — keep mock data (already set as initial state)
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (projects.length <= 1) return;
    const id = setInterval(() => {
      setSelected(prev => (prev + 1) % projects.length);
    }, 8000);
    return () => clearInterval(id);
  }, [projects.length]);

  const go = (dir) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSelected(prev => (prev + dir + projects.length) % projects.length);
    setTimeout(() => setIsAnimating(false), 450);
  };

  const active = projects[selected];
  if (!active) return null;

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
        <div className="absolute -top-60 left-1/3 w-[700px] h-[500px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(ellipse, #10b981, transparent 65%)" }} />
        <div className="absolute -bottom-40 right-1/4 w-[500px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(ellipse, #06b6d4, transparent 65%)" }} />
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
                Projects in Spotlight
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
              Recently Completed
              <br />
              <span style={{
                background: "linear-gradient(90deg, #10b981, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Projects
              </span>
            </h2>
          </div>

          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(13px, 1.4vw, 15px)",
            color: "rgba(255,255,255,0.4)",
            lineHeight: 1.8,
            fontWeight: 300,
            maxWidth: "380px",
          }}>
            Seeing is believing — check out the companies leading from the front with amazing completed projects.
          </p>
        </motion.div>

        {/* ── MAIN SHOWCASE ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div
              className="relative overflow-hidden rounded-2xl border"
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              {/* top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] z-20"
                style={{ background: "linear-gradient(90deg, transparent, #10b981, transparent)" }} />

              <div className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: "460px" }}>

                {/* ── LEFT: image ── */}
                <div className="relative overflow-hidden" style={{ minHeight: "280px" }}>
                  <motion.img
                    src={active.image}
                    alt={active.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                  <div className="absolute inset-0"
                    style={{ background: "linear-gradient(to right, rgba(4,14,30,0) 40%, rgba(4,14,30,0.85) 100%)" }} />
                  <div className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(4,14,30,0.7) 0%, transparent 50%)" }} />

                  {/* type badge */}
                  <div
                    className="absolute top-5 left-5 px-3 py-1 rounded-full border"
                    style={{
                      borderColor: "rgba(255,255,255,0.14)",
                      background: "rgba(17,24,39,0.82)",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.13em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.84)",
                    }}
                  >
                    {active.type}
                  </div>

                  {/* progress ring */}
                  <div className="absolute bottom-5 left-5">
                    <div className="relative w-16 h-16">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="26" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
                        <motion.circle
                          cx="32" cy="32" r="26"
                          stroke="url(#pg)"
                          strokeWidth="4"
                          fill="none"
                          strokeLinecap="round"
                          initial={{ strokeDasharray: "0 163.4" }}
                          animate={{ strokeDasharray: `${(active.progress / 100) * 163.4} 163.4` }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                        />
                        <defs>
                          <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#06b6d4" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: "#ffffff" }}>
                          {active.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── RIGHT: content ── */}
                <div className="flex flex-col justify-center px-8 md:px-10 py-8">

                  {/* title */}
                  <h3
                    className="mb-2 font-bold text-white leading-tight"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "clamp(1.3rem, 2.2vw, 1.8rem)",
                    }}
                  >
                    {active.title}
                  </h3>

                  {/* accent rule */}
                  <div className="mb-6 h-px w-12"
                    style={{ background: "linear-gradient(90deg, #10b981, transparent)" }} />

                  {/* metrics grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { icon: MapPin, label: "Location", value: active.location, color: "#10b981" },
                      { icon: DollarSign, label: "Project Value", value: active.capacity, color: "#10b981" },
                      { icon: Calendar, label: "Completion", value: active.completion, color: "#8b5cf6" },
                    ].map(({ icon: Icon, label, value, color }) => (
                      <div
                        key={label}
                        className="rounded-xl p-3 border"
                        style={{
                          borderColor: "rgba(255,255,255,0.07)",
                          background: "rgba(255,255,255,0.03)",
                        }}
                      >
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Icon size={11} style={{ color }} />
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9.5px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                            {label}
                          </span>
                        </div>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", fontWeight: 500, color: "#ffffff" }}>
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* highlights */}
                  <div className="flex flex-wrap gap-2 mb-7">
                    {active.highlights.slice(0, 4).map((h, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md border"
                        style={{
                          borderColor: "rgba(16,185,129,0.25)",
                          background: "rgba(16,185,129,0.06)",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "10.5px",
                          color: "rgba(255,255,255,0.6)",
                          fontWeight: 400,
                        }}
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-4">
                    <motion.button
                      onClick={() => navigate("/showcase-hub/recent-completed-projects", { state: { selectedCompany: active.title } })}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-300"
                      style={{
                        borderColor: "rgba(16,185,129,0.35)",
                        background: "rgba(16,185,129,0.08)",
                        color: "#10b981",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                      whileHover={{ scale: 1.04, background: "rgba(16,185,129,0.16)" }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Eye size={13} />
                      View Details
                    </motion.button>

                    {/* nav arrows */}
                    {projects.length > 1 && (
                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          onClick={() => go(-1)}
                          className="w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200"
                          style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)" }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)"; e.currentTarget.style.color = "#10b981"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                        >
                          <ChevronLeft size={14} />
                        </button>

                        <div className="flex items-center gap-1.5">
                          {projects.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelected(idx)}
                              className="rounded-full transition-all duration-300"
                              style={{
                                width: idx === selected ? "20px" : "5px",
                                height: "5px",
                                background: idx === selected ? "#10b981" : "rgba(255,255,255,0.2)",
                              }}
                            />
                          ))}
                        </div>

                        <button
                          onClick={() => go(1)}
                          className="w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200"
                          style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)" }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)"; e.currentTarget.style.color = "#10b981"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── VIEW ALL ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 flex justify-center"
        >
          <motion.button
            onClick={() => navigate("/showcase-hub/recent-completed-projects")}
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
            Explore All Projects
            <ArrowRight size={13} />
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
}
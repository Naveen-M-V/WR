import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Search, Users, Zap, X, ArrowRight } from "lucide-react";
import ScrollingBanner from "../home/ScrollingBanner";

const WhichWomenInRenewables = () => {
  const [activeTab, setActiveTab] = useState("directory");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDirectoryProfile, setSelectedDirectoryProfile] = useState(null);
  const [selectedSpotlight, setSelectedSpotlight] = useState(null);
  const [womenDirectory, setWomenDirectory] = useState([]);
  const [spotlightData, setSpotlightData] = useState([]);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  useEffect(() => {
    const load = async () => {
      try {
        const { getContent } = await import("../../utils/contentAPI");
        const data = await getContent("which-women");
        if (Array.isArray(data) && data.length > 0) {
          setWomenDirectory(data);
          setSpotlightData(data.filter((w) => w.featured === "Yes"));
        }
      } catch (error) {
        console.error("Error loading Which Women data:", error);
      }
    };
    load();
  }, []);

  const filteredWomen = womenDirectory.filter(
    (w) =>
      (w.name && w.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (w.company && w.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toArray = (val) =>
    Array.isArray(val)
      ? val
      : val
      ? String(val).split("\n").filter(Boolean)
      : [];

  return (
    <div className="min-h-screen text-white overflow-hidden" style={{ background: "#040e1e" }}>

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');
        .hero-text-mask {
          background: linear-gradient(175deg, #ffffff 0%, rgba(255,255,255,0.62) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        ::placeholder { color: rgba(255,255,255,0.25) !important; }
        .themed-scroll::-webkit-scrollbar { width: 5px; }
        .themed-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 99px; }
        .themed-scroll::-webkit-scrollbar-thumb { background: rgba(236,72,153,0.4); border-radius: 99px; }
        .themed-scroll::-webkit-scrollbar-thumb:hover { background: rgba(236,72,153,0.65); }
      `}} />

      {/* ambient blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #ec4899, transparent 70%)" }} />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)" }} />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full opacity-[0.035]"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)" }} />
      </div>

      <ScrollingBanner />

      {/* ── HERO ── */}
      <div ref={heroRef} className="relative w-full overflow-hidden" style={{ height: "clamp(480px, 80vh, 750px)" }}>
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <img
            src="/show/women.jpeg"
            alt="Which Women in Renewables"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(1.08) saturate(1.2)" }}
          />
        </motion.div>

        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(4,14,30,0.25) 0%, rgba(4,14,30,0.55) 60%, #040e1e 100%)" }} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(4,14,30,0.65) 0%, rgba(4,14,30,0.1) 60%, transparent 100%)" }} />

        <motion.div
          className="absolute inset-0 flex flex-col justify-end pb-16 px-8 md:px-16 lg:px-24 max-w-6xl"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-px w-10" style={{ background: "#ec4899" }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.22em",
              color: "#ec4899",
              textTransform: "uppercase",
              fontWeight: 500,
            }}>
              Celebrating Women Leaders
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hero-text-mask mb-5"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.4rem, 4vw, 5rem)",
              fontWeight: 700,
              lineHeight: 1.06,
              letterSpacing: "-0.02em",
            }}
          >
            Which Women<br />in Renewables
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(14px, 1.8vw, 18px)",
              color: "rgba(255,255,255,0.5)",
              maxWidth: "540px",
              lineHeight: 1.75,
              fontWeight: 300,
            }}
          >
            Celebrating women innovators, leaders, and changemakers in renewable energy
          </motion.p>
        </motion.div>

        {/* scroll hint */}
        <motion.div
          className="absolute bottom-8 right-8 md:right-16 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
        >
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Scroll</span>
          <motion.div
            className="w-px h-10 origin-top"
            style={{ background: "linear-gradient(to bottom, rgba(236,72,153,0.6), transparent)" }}
            animate={{ scaleY: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </div>

      {/* ── INTRO ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pt-20 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-2xl border border-white/[0.07] p-8 md:p-10"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(236,72,153,0.4), transparent)" }} />
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(14px, 1.5vw, 16px)",
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.85,
            fontWeight: 300,
          }}>
            <span style={{ color: "#ec4899", fontWeight: 500 }}>In every corner of the renewable energy sector,</span> women are stepping forward as innovators, leaders, and changemakers reshaping the future of global sustainability. In this section we recognise the valuable contributions of women who are driving transformation across renewable energy, green technology, engineering, policy, and green entrepreneurship.
          </p>
        </motion.div>
      </div>

      {/* ── TABS ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pt-10 pb-4">
        <div className="flex gap-2">
          {["directory", "spotlight"].map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-6 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 capitalize"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  borderColor: active ? "rgba(236,72,153,0.5)" : "rgba(255,255,255,0.1)",
                  background: active ? "rgba(236,72,153,0.12)" : "rgba(255,255,255,0.03)",
                  color: active ? "#ec4899" : "rgba(255,255,255,0.5)",
                  boxShadow: active ? "0 0 20px rgba(236,72,153,0.15)" : "none",
                }}
              >
                {tab === "directory" ? "Directory" : "Spotlight"}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pt-6 pb-24">
        <AnimatePresence mode="wait">

          {/* ── DIRECTORY TAB ── */}
          {activeTab === "directory" && (
            <motion.div
              key="directory"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              {/* search */}
              <div className="relative mb-8">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
                <input
                  type="text"
                  placeholder="Search by name or company…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    paddingLeft: "38px",
                    paddingRight: "16px",
                    paddingTop: "12px",
                    paddingBottom: "12px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#ffffff",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13px",
                    fontWeight: 300,
                    outline: "none",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(236,72,153,0.45)"; e.currentTarget.style.background = "rgba(236,72,153,0.04)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                />
              </div>

              {/* section label */}
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-8" style={{ background: "rgba(255,255,255,0.1)" }} />
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "15px", color: "rgba(255,255,255,0.28)", fontStyle: "italic" }}>
                  Listed by name
                </p>
                <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.1)" }} />
              </div>

              <div className="space-y-3">
                {filteredWomen.map((woman, index) => (
                  <motion.div
                    key={woman.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.45 }}
                  >
                    <div
                      className="relative overflow-hidden rounded-2xl border transition-all duration-500"
                      style={{
                        borderColor: "rgba(255,255,255,0.07)",
                        background: "rgba(255,255,255,0.025)",
                        boxShadow: "0 2px 16px rgba(0,0,0,0.3)",
                      }}
                    >
                      <div className="flex items-start gap-5 p-5">
                        {/* image */}
                        <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border"
                          style={{ borderColor: "rgba(236,72,153,0.2)" }}>
                          <img src={woman.image} alt={woman.name} className="w-full h-full object-cover" />
                        </div>

                        {/* content */}
                        <div className="flex-1 min-w-0">
                          <h4
                            className="font-bold text-white leading-snug mb-0.5"
                            style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem" }}
                          >
                            {woman.name}
                          </h4>
                          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#ec4899", fontWeight: 500, marginBottom: "8px" }}>
                            {woman.company}
                          </p>
                          <p className="line-clamp-2" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: "rgba(255,255,255,0.5)", lineHeight: 1.65, fontWeight: 300 }}>
                            {woman.bio}
                          </p>

                          <button
                            onClick={() => setSelectedDirectoryProfile(woman)}
                            className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium transition-all duration-200"
                            style={{ color: "#ec4899", fontFamily: "'DM Sans', sans-serif" }}
                          >
                            View Profile
                            <ArrowRight size={12} />
                          </button>
                        </div>

                        {/* icon */}
                        <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border"
                          style={{ borderColor: "rgba(236,72,153,0.2)", background: "rgba(236,72,153,0.07)" }}>
                          <Users size={14} style={{ color: "#ec4899" }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {filteredWomen.length === 0 && (
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "40px 0" }}>
                    No results found.
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* ── SPOTLIGHT TAB ── */}
          {activeTab === "spotlight" && (
            <motion.div
              key="spotlight"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {spotlightData.map((person, index) => (
                  <motion.div
                    key={person.id}
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.07, duration: 0.5 }}
                    onClick={() => setSelectedSpotlight(person)}
                    className="cursor-pointer group"
                  >
                    <div
                      className="relative overflow-hidden rounded-2xl border transition-all duration-500 flex flex-col"
                      style={{
                        borderColor: "rgba(255,255,255,0.07)",
                        background: "rgba(255,255,255,0.025)",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "rgba(236,72,153,0.4)";
                        e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(236,72,153,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
                      }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-[2px]"
                        style={{ background: "linear-gradient(90deg, transparent, rgba(236,72,153,0.5), transparent)" }} />

                      {/* image */}
                      <div className="relative overflow-hidden" style={{ height: "200px" }}>
                        <img
                          src={person.image}
                          alt={person.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106"
                        />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(4,14,30,0.9) 100%)" }} />
                        <div
                          className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
                          style={{ borderColor: "rgba(236,72,153,0.4)", background: "rgba(236,72,153,0.12)", fontFamily: "'DM Sans', sans-serif", fontSize: "9.5px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#ec4899" }}
                        >
                          <Zap size={9} />
                          Featured
                        </div>
                      </div>

                      {/* content */}
                      <div className="px-5 py-4">
                        <h4
                          className="font-bold text-white leading-snug mb-1"
                          style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem" }}
                        >
                          {person.name}
                        </h4>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#ec4899", fontWeight: 500, marginBottom: "12px" }}>
                          {person.company}
                        </p>

                        <div
                          className="inline-flex items-center gap-1.5 text-xs font-medium"
                          style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}
                        >
                          Click to view profile
                          <ArrowRight size={11} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {spotlightData.length === 0 && (
                  <p className="col-span-3" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "40px 0" }}>
                    No spotlight entries yet.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── DIRECTORY PROFILE MODAL ── */}
      <AnimatePresence>
        {selectedDirectoryProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDirectoryProfile(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(4,14,30,0.85)", backdropFilter: "blur(12px)" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl rounded-2xl border overflow-hidden flex flex-col themed-scroll"
              style={{
                maxHeight: "85vh",
                background: "rgba(4,14,30,0.97)",
                borderColor: "rgba(255,255,255,0.1)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
                overflowY: "auto",
              }}
            >
              <div className="h-[2px]"
                style={{ background: "linear-gradient(90deg, transparent, #ec4899, transparent)", flexShrink: 0 }} />

              {/* close */}
              <button
                onClick={() => setSelectedDirectoryProfile(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200"
                style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(236,72,153,0.5)"; e.currentTarget.style.color = "#ec4899"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
              >
                <X size={14} />
              </button>

              <div className="p-8">
                {/* header */}
                <div className="flex flex-col md:flex-row gap-7 mb-8">
                  <div className="flex-shrink-0 w-36 h-36 rounded-2xl overflow-hidden border"
                    style={{ borderColor: "rgba(236,72,153,0.25)" }}>
                    <img src={selectedDirectoryProfile.image} alt={selectedDirectoryProfile.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Users size={13} style={{ color: "#ec4899" }} />
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                        Directory Profile
                      </span>
                    </div>
                    <h2
                      className="mb-1 font-bold text-white"
                      style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", lineHeight: 1.15 }}
                    >
                      {selectedDirectoryProfile.name}
                    </h2>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#ec4899", fontWeight: 500, marginBottom: "12px" }}>
                      {selectedDirectoryProfile.company}
                    </p>

                    {/* thin rule */}
                    <div className="mb-4 h-px" style={{ background: "linear-gradient(90deg, #ec4899, transparent)", width: "48px" }} />

                    {selectedDirectoryProfile.bio && (
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.52)", lineHeight: 1.75, fontWeight: 300 }}>
                        {selectedDirectoryProfile.bio}
                      </p>
                    )}
                  </div>
                </div>

                {/* details grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { label: "Career Highlights", value: toArray(selectedDirectoryProfile.highlights) },
                    { label: "Achievements", value: toArray(selectedDirectoryProfile.achievements) },
                    { label: "Challenges", value: toArray(selectedDirectoryProfile.challenges) },
                    { label: "Typical Workday", value: toArray(selectedDirectoryProfile.typical) },
                  ].map(({ label, value }) =>
                    value.length > 0 ? (
                      <div key={label}>
                        <p style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "10px",
                          color: "#ec4899",
                          fontWeight: 600,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          marginBottom: "10px",
                        }}>
                          {label}
                        </p>
                        <ul className="space-y-2">
                          {value.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span style={{ color: "#ec4899", marginTop: "5px", flexShrink: 0, fontSize: "6px" }}>●</span>
                              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.65, fontWeight: 300 }}>
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SPOTLIGHT MODAL ── */}
      <AnimatePresence>
        {selectedSpotlight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSpotlight(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(4,14,30,0.85)", backdropFilter: "blur(12px)" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl rounded-2xl border overflow-hidden flex flex-col themed-scroll"
              style={{
                maxHeight: "85vh",
                background: "rgba(4,14,30,0.97)",
                borderColor: "rgba(255,255,255,0.1)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
                overflowY: "auto",
              }}
            >
              <div className="h-[2px]"
                style={{ background: "linear-gradient(90deg, transparent, #ec4899, transparent)", flexShrink: 0 }} />

              {/* close */}
              <button
                onClick={() => setSelectedSpotlight(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200"
                style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(236,72,153,0.5)"; e.currentTarget.style.color = "#ec4899"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
              >
                <X size={14} />
              </button>

              <div className="p-8">
                {/* header */}
                <div className="flex flex-col md:flex-row gap-7 mb-8">
                  <div className="flex-shrink-0 w-36 h-36 rounded-2xl overflow-hidden border"
                    style={{ borderColor: "rgba(236,72,153,0.25)" }}>
                    <img src={selectedSpotlight.image} alt={selectedSpotlight.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap size={13} style={{ color: "#ec4899" }} />
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                        Featured Woman
                      </span>
                    </div>
                    <h2
                      className="mb-1 font-bold text-white"
                      style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", lineHeight: 1.15 }}
                    >
                      {selectedSpotlight.name}
                    </h2>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#ec4899", fontWeight: 500, marginBottom: "12px" }}>
                      {selectedSpotlight.company}
                    </p>

                    {/* thin rule */}
                    <div className="mb-4 h-px" style={{ background: "linear-gradient(90deg, #ec4899, transparent)", width: "48px" }} />

                    {selectedSpotlight.bio && (
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.52)", lineHeight: 1.75, fontWeight: 300 }}>
                        {selectedSpotlight.bio}
                      </p>
                    )}
                  </div>
                </div>

                {/* details grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { label: "Career Highlights & Future Vision", value: toArray(selectedSpotlight.highlights) },
                    { label: "Provisional Achievements", value: toArray(selectedSpotlight.achievements) },
                    { label: "Challenges & Impact", value: toArray(selectedSpotlight.challenges) },
                    { label: "My Typical Workday", value: toArray(selectedSpotlight.typical) },
                  ].map(({ label, value }) =>
                    value.length > 0 ? (
                      <div key={label}>
                        <p style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "10px",
                          color: "#ec4899",
                          fontWeight: 600,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          marginBottom: "10px",
                        }}>
                          {label}
                        </p>
                        <ul className="space-y-2">
                          {value.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span style={{ color: "#ec4899", marginTop: "5px", flexShrink: 0, fontSize: "6px" }}>●</span>
                              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.65, fontWeight: 300 }}>
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WhichWomenInRenewables;
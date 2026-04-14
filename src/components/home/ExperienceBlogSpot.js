import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getContent } from "../../utils/contentAPI";



const ACCENT_COLORS = [
  { hex: "#10b981", rgb: "16,185,129" },
  { hex: "#06b6d4", rgb: "6,182,212" },
  { hex: "#8b5cf6", rgb: "139,92,246" },
  { hex: "#f59e0b", rgb: "245,158,11" },
];

/* ─────────────────────────────────────────────────────────────
   BLOG CARD
───────────────────────────────────────────────────────────── */
const BlogCard = ({ post, index, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="cursor-pointer flex flex-col"
      style={{ minHeight: "420px" }}
    >
      <div
        className="relative flex flex-col flex-1 rounded-2xl overflow-hidden border transition-all duration-500"
        style={{
          borderColor: hovered ? `rgba(${accent.rgb},0.4)` : "rgba(255,255,255,0.07)",
          background: "rgba(4,14,30,0.97)",
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

        {/* image */}
        <div className="relative overflow-hidden flex-shrink-0" style={{ height: "180px" }}>
          <motion.img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(4,14,30,0.9) 100%)" }}
          />

          {/* featured badge */}
          {post.featured && (
            <div
              className="absolute top-3 right-3 px-2.5 py-1 rounded-full border"
              style={{
                borderColor: "rgba(255,255,255,0.2)",
                background: "rgba(0,0,0,0.55)",
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

          {/* category badge */}
          <div
            className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(4,14,30,0.75)",
              border: "1px solid rgba(255,255,255,0.1)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "9.5px",
              color: accent.hex,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {post.category}
          </div>
        </div>

        {/* content */}
        <div className="flex flex-col flex-1 px-5 py-5">
          {/* title */}
          <h3
            className="mb-3 font-bold leading-snug text-white"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)",
              lineHeight: 1.35,
            }}
          >
            {post.title}
          </h3>

          {/* accent rule */}
          <div
            className="mb-3 h-px transition-all duration-500"
            style={{
              background: `linear-gradient(90deg, ${accent.hex}, transparent)`,
              width: hovered ? "48px" : "20px",
            }}
          />

          {/* excerpt */}
          <p
            className="line-clamp-3 flex-1 mb-5"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12.5px",
              color: "rgba(255,255,255,0.52)",
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            {post.excerpt || "Click to read this article…"}
          </p>

          {/* author + date */}
          <div
            className="flex items-center gap-3 mb-4 pt-4 border-t"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <div
              className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
              style={{ background: `rgba(${accent.rgb},0.15)`, border: `1px solid rgba(${accent.rgb},0.3)` }}
            >
              <User size={12} style={{ color: accent.hex }} />
            </div>
            <div className="min-w-0">
              <p
                className="truncate"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11.5px", color: "#ffffff", fontWeight: 500 }}
              >
                {post.author}
              </p>
              <p
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.35)" }}
              >
                {post.date}
              </p>
            </div>
          </div>

          {/* read link */}
          <div
            className="inline-flex items-center gap-1.5 text-xs font-medium transition-all duration-200"
            style={{ color: accent.hex, fontFamily: "'DM Sans', sans-serif" }}
          >
            Read Article
            <ArrowRight size={12} />
          </div>
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
export default function ExperienceBlogSpot() {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const items = await getContent("blogs");
        const mapped = Array.isArray(items)
          ? items
              .filter((b) => b.category === "Expert Circle Blogs")
              .map((b) => ({
                ...b,
                title: b.title || "",
                excerpt:
                  b.excerpt ||
                  b.summary ||
                  b.overview ||
                  b.description ||
                  b.body?.substring(0, 150) ||
                  b.content?.substring(0, 150) ||
                  "",
                content: b.content || b.body || b.fullContent || b.description || "",
                author: b.author || "",
                companyName: b.companyName || "",
                date: b.date || "",
                category: b.category || "",
                image: b.image || b.images?.[0] || "",
                sectors: Array.isArray(b.sectors) ? b.sectors : b.sector ? [b.sector] : [],
                productsServices: Array.isArray(b.productsServices) ? b.productsServices : [],
                blogUrl: b.blogUrl || "",
                featured: b.featured,
              }))
          : [];

          setBlogPosts(mapped);
      } catch (err) {
        console.error("Error loading blogs:", err);
        // API failed — keep mock data (already set as initial state)
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const handleRead = (post) => {
    navigate("/blogs", { state: { activeTab: "expert-circle", selectedBlog: post } });
  };

  if (!blogPosts || blogPosts.length === 0) return null;

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
          className="absolute -top-60 right-1/3 w-[600px] h-[500px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(ellipse, #8b5cf6, transparent 65%)" }}
        />
        <div
          className="absolute -bottom-40 left-1/4 w-[500px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(ellipse, #06b6d4, transparent 65%)" }}
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
                Curated spot for blogs
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
              Blogspot
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
            Stay informed with expert opinion, emerging trends and counsel provided by members of our curated Expert Circle.
          </p>
        </motion.div>

        {/* ── GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {blogPosts.map((post, index) => (
            <BlogCard
              key={post.id || index}
              post={post}
              index={index}
              onClick={() => handleRead(post)}
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
            onClick={() => navigate("/blogs", { state: { activeTab: "expert-circle" } })}
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
            View All Blog Articles
            <ArrowRight size={13} />
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
}
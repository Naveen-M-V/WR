import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Package, Zap, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getSpotlightProductsServices } from "../../utils/companiesAPI";
import { API_HOST } from "../../config";

const ACCENT_PAIRS = [
  { hex: "#06b6d4", rgb: "6,182,212" },
  { hex: "#8b5cf6", rgb: "139,92,246" },
  { hex: "#f59e0b", rgb: "245,158,11" },
  { hex: "#ec4899", rgb: "236,72,153" },
  { hex: "#84cc16", rgb: "132,204,22" },
];

/* ─────────────────────────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────────────────────────── */
const ProductCard = ({ product, index, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const accent = ACCENT_PAIRS[index % ACCENT_PAIRS.length];
  const Icon = typeof product.icon === "function" ? product.icon : Package;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="relative cursor-pointer group"
      style={{ height: "360px" }}
    >
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden border transition-all duration-500"
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

        {/* image — top 55% */}
        <div
          className="absolute top-0 left-0 right-0 overflow-hidden"
          style={{ height: "55%", background: "rgba(4,14,30,0.6)" }}
        >
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          {/* fade to dark */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(4,14,30,0.4) 100%)" }}
          />
        </div>

        {/* dark content area — bottom 45% + overflow */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            top: "48%",
            background: hovered
              ? `linear-gradient(160deg, rgba(${accent.rgb},0.1) 0%, rgba(4,14,30,0.98) 40%)`
              : "rgba(4,14,30,0.97)",
            transition: "background 0.5s",
          }}
        />

        {/* badge — top left */}
        <div
          className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full border"
          style={{
            borderColor: "rgba(255,255,255,0.16)",
            background: "rgba(75,85,99,0.88)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "9.5px",
            fontWeight: 600,
            letterSpacing: "0.13em",
            textTransform: "uppercase",
            color: "#f3f4f6",
          }}
        >
          {product.badge}
        </div>

        {/* icon — top right */}
        <div
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-300"
          style={{
            borderColor: "rgba(255,255,255,0.14)",
            background: "rgba(17,24,39,0.82)",
            boxShadow: hovered ? "0 0 14px rgba(0,0,0,0.35)" : "none",
          }}
        >
          <Icon size={13} style={{ color: accent.hex }} />
        </div>

        {/* content */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-3 z-10">
          {/* accent rule */}
          <div
            className="mb-3 h-px transition-all duration-500"
            style={{
              background: `linear-gradient(90deg, ${accent.hex}, transparent)`,
              width: hovered ? "52px" : "24px",
            }}
          />

          {/* name */}
          <h3
            className="mb-1.5 font-bold leading-snug text-white"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)",
            }}
          >
            {product.name}
          </h3>

          {/* company */}
          {product.companyName && (
            <p
              className="mb-2"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "10.5px",
                color: accent.hex,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                fontWeight: 500,
                opacity: 0.85,
              }}
            >
              {product.companyName}
            </p>
          )}

          {/* description */}
          <p
            className="line-clamp-2"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12.5px",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.6,
              fontWeight: 300,
            }}
          >
            {product.description}
          </p>
        </div>

        {/* ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700 rounded-2xl"
          style={{
            background: `radial-gradient(ellipse at 50% 100%, rgba(${accent.rgb},0.15), transparent 60%)`,
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
export default function ProductsSpotlight() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const goToCompanyProductsServices = (companyId, type) => {
    if (!companyId) return;
    const tab = type === "service" ? "services" : "products";
    navigate(`/company/${encodeURIComponent(companyId)}?tab=${tab}`);
  };

  useEffect(() => {
    const fetchSpotlightProducts = async () => {
      setLoading(true);
      try {
        const res = await getSpotlightProductsServices();
        const list = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data) ? res.data : [];

        const mappedData = list
          .filter((entry) => {
            const product = entry?.item || entry;
            const name = String(product?.title || product?.name || "").trim().toLowerCase();
            const companyName = String(entry?.companyName || "").trim().toLowerCase();
            const description = String(product?.description || "").trim().toLowerCase();

            if (name === "investment") return false;
            if (companyName === "n/a") return false;
            if (description === "n/a") return false;
            return true;
          })
          .map((entry) => {
          const product = entry?.item || entry;
          const images = Array.isArray(product?.images) ? product.images : [];
          const fallbackImage = "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=500&q=80";
          return {
            id: product?.id || `product-${Math.random()}`,
            name: product?.title || product?.name || "Untitled Product/Service",
            image: images[0] ? `${API_HOST}${images[0]}` : fallbackImage,
            description: product?.description || "No description provided.",
            badge: product?.type === "service" ? "Service Spotlight" : "Product Spotlight",
            type: product?.type || "product", // store type for navigation
            icon: product?.type === "service" ? Settings : Zap,
            companyId: entry?.companyId,
            companyName: entry?.companyName || "",
            category: product?.category || "General",
            link: `/showcase-hub/product-service-in-spotlight${entry?.companyId ? `?company=${entry.companyId}` : ""}`,
          };
          });
        setProducts(mappedData);
      } catch (err) {
        console.error("Error loading product spotlight:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpotlightProducts();
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
          className="absolute -top-60 right-1/4 w-[600px] h-[500px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(ellipse, #10b981, transparent 65%)" }}
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
                In Spotlight
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
              Product / Service
              <br />
              <span style={{
                background: "linear-gradient(90deg, #10b981, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                "In Spotlight"
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
            We proudly shine a light on products and services at the forefront driving measurable impact toward a sustainable future.
          </p>
        </motion.div>

        {/* ── GRID ── */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: "rgba(255,255,255,0.1)", borderTopColor: "#10b981" }}
            />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.slice(0, 6).map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onClick={() => goToCompanyProductsServices(product.companyId, product.type)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center py-20" style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
            color: "rgba(255,255,255,0.3)",
          }}>
            No products/services currently in spotlight.
          </p>
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
            type="button"
            onClick={() => navigate("/showcase-hub/product-service-in-spotlight")}
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
            View All Products & Services
            <ArrowRight size={13} />
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
}
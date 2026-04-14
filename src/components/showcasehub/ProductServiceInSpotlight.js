import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Package, Sparkles, BadgeCheck, ArrowRight, Search,
  Grid3X3, Building2, ArrowUpRight, Star, X, Wrench,
  Sun, Wind, Droplets, Battery, Filter, ChevronDown,
} from "lucide-react";
import { getSpotlightProductsServices } from "../../utils/companiesAPI";
import { API_HOST } from "../../config";
import ScrollingBanner from "../home/ScrollingBanner";

const CATEGORIES = [
  { id: "all",     label: "All",      icon: Grid3X3  },
  { id: "product", label: "Products", icon: Package  },
  { id: "service", label: "Services", icon: Wrench   },
  { id: "solar",   label: "Solar",    icon: Sun      },
  { id: "wind",    label: "Wind",     icon: Wind     },
  { id: "hydro",   label: "Hydro",    icon: Droplets },
  { id: "storage", label: "Storage",  icon: Battery  },
];

const ACCENT_PAIRS = [
  { hex: "#10b981", rgb: "16,185,129"  },
  { hex: "#06b6d4", rgb: "6,182,212"   },
  { hex: "#8b5cf6", rgb: "139,92,246"  },
  { hex: "#f59e0b", rgb: "245,158,11"  },
  { hex: "#ec4899", rgb: "236,72,153"  },
  { hex: "#3b82f6", rgb: "59,130,246"  },
];

/* ─────────────────────────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────────────────────────── */
const ProductCard = ({ product, company, index }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const accent = ACCENT_PAIRS[index % ACCENT_PAIRS.length];
  const Icon = product.type === "service" ? Wrench : Package;

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (index % 8) * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        const tab = product.type === "service" ? "services" : "products";
        navigate(`/company/${company.slug}?tab=${tab}&highlight=${product.id}`);
      }}
      className="cursor-pointer flex flex-col"
    >
      <div
        className="relative overflow-hidden rounded-2xl border flex flex-col flex-1 transition-all duration-500"
        style={{
          borderColor: hovered ? `rgba(${accent.rgb},0.4)` : "rgba(255,255,255,0.07)",
          background: "rgba(4,14,30,0.97)",
          boxShadow: hovered
            ? `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(${accent.rgb},0.2)`
            : "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {/* top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] z-10 transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent.hex}, transparent)`,
            opacity: hovered ? 1 : 0.2,
          }}
        />

        {/* image */}
        <div className="relative overflow-hidden flex-shrink-0" style={{ height: "180px" }}>
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(4,14,30,0.9) 100%)" }} />

          {/* type badge */}
          <div
            className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
            style={{
              borderColor: `rgba(${accent.rgb},0.4)`,
              background: `rgba(${accent.rgb},0.12)`,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "9.5px",
              fontWeight: 600,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: accent.hex,
            }}
          >
            <Icon size={9} />
            {product.type === "service" ? "Service" : "Product"}
          </div>

          {/* verified badge */}
          <div
            className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center border"
            style={{ borderColor: "rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.1)" }}
          >
            <BadgeCheck size={13} style={{ color: "#10b981" }} />
          </div>
        </div>

        {/* content */}
        <div className="flex flex-col flex-1 px-5 py-4">
          {/* company */}
          <div className="flex items-center gap-1.5 mb-2">
            <Building2 size={10} style={{ color: accent.hex }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10.5px", color: accent.hex, fontWeight: 500, opacity: 0.85 }}>
              {company.name}
            </span>
          </div>

          {/* name */}
          <h3
            className="font-bold text-white leading-snug mb-2"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.9rem, 1.1vw, 1rem)" }}
          >
            {product.name}
          </h3>

          {/* accent rule */}
          <div
            className="mb-3 h-px transition-all duration-500"
            style={{
              background: `linear-gradient(90deg, ${accent.hex}, transparent)`,
              width: hovered ? "44px" : "18px",
            }}
          />

          {/* description */}
          <p
            className="line-clamp-2 flex-1 mb-4"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              color: "rgba(255,255,255,0.48)",
              lineHeight: 1.65,
              fontWeight: 300,
            }}
          >
            {product.desc || "Innovative renewable energy solution."}
          </p>

          {/* footer */}
          <div
            className="flex items-center justify-between pt-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center gap-1.5" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>
              <Sparkles size={10} />
              Spotlight Featured
            </div>
            <div
              className="inline-flex items-center gap-1 text-xs font-medium transition-all duration-200"
              style={{ color: accent.hex, fontFamily: "'DM Sans', sans-serif" }}
            >
              View <ArrowUpRight size={11} />
            </div>
          </div>
        </div>

        {/* ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-700"
          style={{
            background: `radial-gradient(ellipse at 50% 100%, rgba(${accent.rgb},0.09), transparent 60%)`,
            opacity: hovered ? 1 : 0,
          }}
        />
      </div>
    </motion.article>
  );
};

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */
export default function ProductServiceInSpotlight() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const res = await getSpotlightProductsServices();
        const list = Array.isArray(res?.data?.data) ? res.data.data : [];

        const grouped = list.reduce((acc, entry) => {
          const key = entry?.companyId;
          if (!key) return acc;
          if (!acc[key]) {
            acc[key] = {
              slug: entry.companyId,
              name: entry.companyName,
              image: entry.companyLogo ? `${API_HOST}${entry.companyLogo}` : null,
              location: entry.companyAddress || "",
              products: [],
            };
          }
          const item = entry.item || {};
          const img = Array.isArray(item.images) && item.images[0]
            ? `${API_HOST}${item.images[0]}`
            : (acc[key].image || "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=60");

          acc[key].products.push({
            id: item.id,
            name: item.title,
            image: img,
            desc: item.description || "",
            type: item.type || "product",
          });
          return acc;
        }, {});

        setCompanies(Object.values(grouped));
      } catch (e) {
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const allProducts = useMemo(() => {
    const products = [];
    companies.forEach((company) => {
      company.products.forEach((product) => {
        products.push({ ...product, company });
      });
    });
    return products;
  }, [companies]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const q = searchTerm.toLowerCase();
      const matchSearch = !searchTerm ||
        product.name?.toLowerCase().includes(q) ||
        product.desc?.toLowerCase().includes(q) ||
        product.company.name?.toLowerCase().includes(q);
      const matchCategory = selectedCategory === "all" ||
        (selectedCategory === "product" && product.type === "product") ||
        (selectedCategory === "service" && product.type === "service") ||
        product.name?.toLowerCase().includes(selectedCategory) ||
        product.desc?.toLowerCase().includes(selectedCategory);
      const matchCompany = selectedCompany === "all" || product.company.slug === selectedCompany;
      return matchSearch && matchCategory && matchCompany;
    });
  }, [allProducts, searchTerm, selectedCategory, selectedCompany]);

  const uniqueCompanies = useMemo(() => companies.map((c) => ({ slug: c.slug, name: c.name })), [companies]);

  const stats = useMemo(() => ({
    products: allProducts.filter((p) => p.type === "product").length,
    services: allProducts.filter((p) => p.type === "service").length,
    companies: companies.length,
  }), [allProducts, companies]);

  const hasFilters = searchTerm || selectedCategory !== "all" || selectedCompany !== "all";

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
          <img src="/new/proserspot.jpeg" alt="Products and Services"
            className="w-full h-full object-cover" style={{ filter: "brightness(1.08) saturate(1.2)" }} />
        </motion.div>
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(4,14,30,0.25) 0%, rgba(4,14,30,0.55) 60%, #040e1e 100%)" }} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(4,14,30,0.65) 0%, rgba(4,14,30,0.1) 60%, transparent 100%)" }} />

        <motion.div
          className="absolute inset-0 flex flex-col justify-end pb-16 px-8 md:px-16 lg:px-24 pt-32"
          style={{ opacity: heroOpacity, maxWidth: "65%" }}
        >
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.7 }}
            className="flex items-center gap-3 mb-6">
            <div className="h-px w-10" style={{ background: "#10b981" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.22em", color: "#10b981", textTransform: "uppercase", fontWeight: 500 }}>
              Showcase Hub
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hero-text-mask mb-5"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 4vw, 4.5rem)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.02em" }}>
            Products &<br />Services
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14px, 1.8vw, 18px)", color: "rgba(255,255,255,0.5)", maxWidth: "480px", lineHeight: 1.75, fontWeight: 300 }}>
            Discover innovative products and services leading the transformation in renewable energy.
          </motion.p>

          {/* stat pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-wrap gap-3 mt-8"
          >
            {[
              { label: "Products",  value: stats.products,  color: "#10b981" },
              { label: "Services",  value: stats.services,  color: "#ec4899" },
              { label: "Companies", value: stats.companies, color: "#06b6d4" },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-full border"
                style={{
                  borderColor: `rgba(255,255,255,0.1)`,
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color }}>{value}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{label}</span>
              </div>
            ))}
          </motion.div>
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

          {/* search + filter toggle */}
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
              <input
                type="text"
                placeholder="Search products, services, or companies…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%", paddingLeft: "36px", paddingRight: searchTerm ? "36px" : "16px",
                  paddingTop: "11px", paddingBottom: "11px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: "12px", color: "#ffffff",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 300, outline: "none",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.45)"; e.currentTarget.style.background = "rgba(16,185,129,0.04)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(255,255,255,0.4)" }}>
                  <X size={13} />
                </button>
              )}
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
              Filters
              <ChevronDown size={12} style={{ transform: showFilters ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
            </button>
          </div>

          {/* expandable filters */}
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
                  {/* category pills */}
                  <div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
                      Category
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map(({ id, label, icon: Icon }) => (
                        <button key={id} onClick={() => setSelectedCategory(id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200"
                          style={{
                            borderColor: selectedCategory === id ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.08)",
                            background: selectedCategory === id ? "rgba(16,185,129,0.1)" : "transparent",
                            color: selectedCategory === id ? "#10b981" : "rgba(255,255,255,0.45)",
                            fontFamily: "'DM Sans', sans-serif",
                          }}>
                          <Icon size={10} />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* company filter */}
                  {uniqueCompanies.length > 0 && (
                    <div>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
                        Company
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[{ slug: "all", name: "All Companies" }, ...uniqueCompanies].map(({ slug, name }) => (
                          <button key={slug} onClick={() => setSelectedCompany(slug)}
                            className="px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200"
                            style={{
                              borderColor: selectedCompany === slug ? "rgba(6,182,212,0.5)" : "rgba(255,255,255,0.08)",
                              background: selectedCompany === slug ? "rgba(6,182,212,0.1)" : "transparent",
                              color: selectedCompany === slug ? "#06b6d4" : "rgba(255,255,255,0.45)",
                              fontFamily: "'DM Sans', sans-serif",
                            }}>
                            {name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* count + clear */}
          <div className="flex items-center justify-between">
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
              Showing <span style={{ color: "#10b981", fontWeight: 500 }}>{filteredProducts.length}</span> item{filteredProducts.length !== 1 ? "s" : ""}
            </p>
            {hasFilters && (
              <button onClick={() => { setSearchTerm(""); setSelectedCategory("all"); setSelectedCompany("all"); }}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11.5px", color: "rgba(255,255,255,0.3)", cursor: "pointer" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#ffffff"}
                onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}>
                Clear all
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── GRID ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-24">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: "rgba(255,255,255,0.1)", borderTopColor: "#10b981" }} />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id || index}
                product={product}
                company={product.company}
                index={index}
              />
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 rounded-2xl border"
            style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <Package size={20} style={{ color: "#10b981" }} />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "#ffffff", marginBottom: "8px" }}>
              No products found
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
              Try adjusting your search or filters.
            </p>
          </motion.div>
        )}
      </div>

      {/* ── CTA ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-2xl border p-10 md:p-14 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(6,182,212,0.05) 100%)",
            borderColor: "rgba(16,185,129,0.2)",
            boxShadow: "0 0 60px rgba(16,185,129,0.06)",
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.5), transparent)" }} />

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
            style={{ borderColor: "rgba(245,158,11,0.3)", background: "rgba(245,158,11,0.07)" }}>
            <Star size={12} style={{ color: "#f59e0b" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#f59e0b", letterSpacing: "0.12em", fontWeight: 600, textTransform: "uppercase" }}>
              Join the Spotlight
            </span>
          </div>

          <h2
            className="mb-4"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.4rem)", fontWeight: 700, color: "#ffffff" }}
          >
            Have a Product or Service to Feature?
          </h2>

          <p
            className="mb-8 mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "rgba(255,255,255,0.45)", lineHeight: 1.75, fontWeight: 300, maxWidth: "480px" }}
          >
            Showcase your innovative solutions to our global audience of renewable energy professionals and decision-makers.
          </p>

          <Link
            to="/subscription-plans"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border text-sm font-medium transition-all duration-300"
            style={{ borderColor: "rgba(16,185,129,0.35)", background: "rgba(16,185,129,0.08)", color: "#10b981", fontFamily: "'DM Sans', sans-serif", textDecoration: "none" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(16,185,129,0.18)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(16,185,129,0.08)"}
          >
            Get in Touch
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, ImageIcon, CheckCircle2, Building2 } from "lucide-react";
import ScrollingBanner from "../home/ScrollingBanner";
import { getAllCompanies } from "../../utils/companiesAPIExtended";
import { API_HOST } from "../../config";

const SECTOR_ALIASES = new Set(["renewable energy", "renewable-energy"]);

const normalizeText = (value) => String(value || "").trim().toLowerCase();
const asList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === "string") {
    if (!value.includes(",")) return value ? [value] : [];
    return value.split(",").map((v) => v.trim()).filter(Boolean);
  }
  return value ? [String(value)] : [];
};

// "Market Sector" dropdown → matches item.subsector
// Exact strings the live admin form saves (Solar PV, Heat Pump Technology, etc.)
const mainCategories = [
  { id: "all", name: "All Sectors" },
  { id: "Solar PV", name: "Solar PV" },
  { id: "Battery storage", name: "Battery Storage" },
  { id: "EV Charging", name: "EV Charging" },
  { id: "Wind Power", name: "Wind Power" },
  { id: "Heat Pump Technology", name: "Heat Pumps" },
  { id: "LED Lighting", name: "LED Lighting" },
  { id: "Additional Products", name: "Additional Products" },
];

// "Specialisation" dropdown → matches item.serviceCategory
// Exact strings the live admin form saves (Hardware/Product Suppliers, etc.)
const subcategories = [
  { id: "all", name: "All Subsectors" },
  { id: "Hardware/Product Suppliers", name: "Hardware & Products" },
  { id: "Service & Solutions", name: "Service & Solutions" },
  { id: "Associated Services", name: "Associated Services" },
];

export default function RenewablePage() {
  const navigate = useNavigate();
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMainCategory, setSelectedMainCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  // Applied filters — only update when user clicks SEARCH DIRECTORY
  const [appliedMain, setAppliedMain] = useState("all");
  const [appliedSub, setAppliedSub] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getAllCompanies();
        const dataArray = result.data?.data || result.data || [];
        if (result.success && Array.isArray(dataArray)) {
          const items = dataArray.flatMap((company) =>
            (company.tabs?.productsServices?.items || [])
              .filter((item) =>
                SECTOR_ALIASES.has(normalizeText(item.sector)) ||
                (Array.isArray(item.sectors) && item.sectors.some((sec) => SECTOR_ALIASES.has(normalizeText(sec))))
              )
              .map((item) => ({
                ...item,
                companyName: company.companyName || company.name,
                companyId: company.id,
                companyLogo: company.companyLogo,
              }))
          );
          setAllItems(items);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    setAppliedMain(selectedMainCategory);
    setAppliedSub(selectedSubcategory);
  };

  const filtered = allItems.filter((item) => {
    const itemSubsectors = asList(item.subsector);
    const itemServiceCategories = asList(item.serviceCategory);

    // Market Sector → item.subsector (e.g. "Heat Pump Technology", "Solar PV")
    const mainMatch = appliedMain === "all" || itemSubsectors.includes(appliedMain);
    // Specialisation → item.serviceCategory (e.g. "Hardware/Product Suppliers")
    // Falls back to item.subsector for items saved with old 2-level admin form
    const subMatch =
      appliedSub === "all" ||
      itemServiceCategories.includes(appliedSub) ||
      itemSubsectors.includes(appliedSub);
    return mainMatch && subMatch;
  });

  return (
    <div className="min-h-screen" style={{ background: "#040e1e", color: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;700&display=swap');
        .glass { background: rgba(255,255,255,0.03); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); }
        .hero-mask { background: linear-gradient(175deg,#fff 0%,rgba(255,255,255,0.55) 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .custom-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.4)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1.2em; }
      `}</style>

      <ScrollingBanner />

      {/* HERO */}
      <div className="relative w-full overflow-hidden mb-20" style={{ height: "clamp(420px,65vh,700px)" }}>
        <div className="absolute inset-0" style={{ backgroundImage:"url('/product/Renewable energy.jpeg')", backgroundSize:"cover", backgroundPosition:"center", filter:"brightness(1.08) saturate(1.2)" }} />
        <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom,rgba(4,14,30,0.2) 0%,rgba(4,14,30,0.5) 60%,#040e1e 100%)" }} />
        <div className="absolute inset-0" style={{ background:"linear-gradient(to right,rgba(4,14,30,0.6) 0%,rgba(4,14,30,0.1) 60%,transparent 100%)" }} />
        <motion.div className="absolute inset-0 flex flex-col justify-end pb-16 px-8 md:px-16 lg:px-24 max-w-6xl"
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.8 }}>
          <motion.div className="flex items-center gap-3 mb-6" initial={{ opacity:0,x:-20 }} animate={{ opacity:1,x:0 }} transition={{ delay:0.25 }}>
            <div className="h-px w-10 bg-emerald-500" />
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"11px", letterSpacing:"0.22em", color:"#10b981", textTransform:"uppercase", fontWeight:500 }}>Solution Hub</span>
          </motion.div>
          <motion.h1 className="hero-mask mb-5" style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2.8rem,4vw,5.5rem)", fontWeight:700, lineHeight:1.25 }}
            initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.4, duration:0.8 }}>
            Renewable Energy
          </motion.h1>
          <motion.p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(14px,1.8vw,17px)", color:"rgba(255,255,255,0.5)", maxWidth:"520px", lineHeight:1.15, fontWeight:300 }}
            initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.6 }}>
            Browse products and services from verified renewable energy companies.
          </motion.p>
          <motion.button onClick={() => document.getElementById("content")?.scrollIntoView({ behavior:"smooth" })}
            className="mt-8 self-start inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold"
            style={{ background:"#10b981", color:"white", fontFamily:"'DM Sans',sans-serif", boxShadow:"0 0 24px rgba(16,185,129,0.35)" }}
            initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.8 }}
            whileHover={{ scale:1.05, boxShadow:"0 0 36px rgba(16,185,129,0.5)" }} whileTap={{ scale:0.97 }}>
            Browse Offerings <ArrowRight size={14} />
          </motion.button>
        </motion.div>
      </div>

      {/* CONTENT */}
      <div id="content" className="max-w-7xl mx-auto px-6 -mt-24 relative z-30 pb-32">

        {/* FILTER CONTROL HUD — original dropdown design restored */}
        <motion.div
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          className="glass rounded-[32px] p-8 md:p-10 mb-16 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row items-end gap-6">

            {/* Market Sector — filters by item.subsector */}
            <div className="flex-1 w-full space-y-3">
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Market Sector</label>
              <select
                value={selectedMainCategory}
                onChange={(e) => setSelectedMainCategory(e.target.value)}
                className="custom-select w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"
              >
                {mainCategories.map(cat => (
                  <option key={cat.id} value={cat.id} className="bg-[#0a1628]">{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Specialization — filters by item.serviceCategory */}
            <div className="flex-1 w-full space-y-3">
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Specialisation</label>
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="custom-select w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"
              >
                {subcategories.map(sub => (
                  <option key={sub.id} value={sub.id} className="bg-[#0a1628]">{sub.name}</option>
                ))}
              </select>
            </div>

            {/* Search button */}
            <motion.button
              whileHover={{ scale:1.05, boxShadow:"0 0 36px rgba(16,185,129,0.5)" }} whileTap={{ scale:0.97 }}
              onClick={handleSearch}
              className="mt-8 self-start inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold"
              style={{ background:"#10b981", color:"white", fontFamily:"'DM Sans',sans-serif", boxShadow:"0 0 24px rgba(16,185,129,0.35)" }}
            >
              Search Directory
            </motion.button>
          </div>
        </motion.div>

        {/* RESULTS COUNT */}
        {!loading && (
          <div className="flex items-center gap-3 mb-8">
            <span className="text-xs font-bold text-white/30 uppercase tracking-widest">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>
        )}

        {/* ITEMS GRID */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/20 uppercase tracking-widest text-[10px] font-bold">Synchronizing Data...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center glass rounded-3xl">
            <Zap className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-sm">No offerings found for this filter.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, i) => (
                <motion.div key={item.id || i} layout
                  initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ delay: i * 0.04 }}
                  className="glass rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all duration-500 flex flex-col group">

                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-black/20 shrink-0">
                    {item.images && item.images.length > 0 ? (
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500/10 to-cyan-500/10">
                        <ImageIcon className="w-10 h-10 text-white/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#040e1e]/80 to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${item.type === "product" ? "bg-emerald-500/80" : "bg-cyan-500/80"} text-white`}>
                        {item.type}
                      </span>
                      {item.subsector && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 text-white/80 backdrop-blur-sm">
                          {item.subsector}
                        </span>
                      )}
                      {item.serviceCategory && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-900/60 text-emerald-300 backdrop-blur-sm">
                          {item.serviceCategory}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors" style={{ fontFamily:"'Playfair Display',serif" }}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed line-clamp-3 mb-4" style={{ fontFamily:"'DM Sans',sans-serif" }}>
                      {item.description}
                    </p>

                    {/* Features */}
                    {item.features && item.features.length > 0 && (
                      <div className="space-y-1.5 mb-5">
                        {item.features.slice(0, 3).map((f, fi) => (
                          <div key={fi} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="text-xs text-white/60">{f}</span>
                          </div>
                        ))}
                        {item.features.length > 3 && (
                          <span className="text-[10px] text-white/30 pl-5">+{item.features.length - 3} more features</span>
                        )}
                      </div>
                    )}

                    {/* Company + CTA */}
                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        {item.companyLogo ? (
                          <img src={`${API_HOST}${item.companyLogo}`} className="w-6 h-6 rounded-full object-contain bg-white/10 shrink-0" alt="" />
                        ) : (
                          <Building2 className="w-4 h-4 text-white/30 shrink-0" />
                        )}
                        <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider truncate">{item.companyName}</span>
                      </div>
                      <motion.button onClick={() => {
                          const tab = item.type === "service" ? "services" : "products";
                          navigate(`/company/${item.companyId}?tab=${tab}`);
                        }}
                        whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white group-hover:bg-emerald-500 group-hover:text-white group-hover:border-transparent transition-all shrink-0">
                        View <ArrowRight size={10} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

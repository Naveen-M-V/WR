import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Globe, Check, Image as ImageIcon, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import ScrollingBanner from "../home/ScrollingBanner";
import { getAllCompanies } from "../../utils/companiesAPI";
import { API_HOST } from "../../config";

// Exact sector label saved by AdminProductsServices.js
const SECTOR_LABEL = "Energy Management";

const ACCENT = "#f59e0b";

function ItemImageCarousel({ images, title }) {
  const [idx, setIdx] = useState(0);
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
        <ImageIcon className="w-12 h-12 text-white/20" />
      </div>
    );
  }
  return (
    <div className="relative w-full h-full group">
      <img src={images[idx]} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      {images.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); setIdx((idx - 1 + images.length) % images.length); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setIdx((idx + 1) % images.length); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === idx ? 'bg-white' : 'bg-white/40'}`} />)}
          </div>
        </>
      )}
    </div>
  );
}

export default function EnergyManagement() {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const result = await getAllCompanies();
        const dataArray = result.data?.data || result.data || [];
        if (result.success && Array.isArray(dataArray)) {
          const flat = dataArray.flatMap(company =>
            (company.tabs?.productsServices?.items || [])
              .filter(item => item.sector === SECTOR_LABEL || (Array.isArray(item.sectors) && item.sectors.includes(SECTOR_LABEL)))
              .map(item => ({
                ...item,
                companyName: company.companyName || company.name,
                companyId: company.id,
                companyLogo: company.companyLogo,
              }))
          );
          setItems(flat);
        }
      } catch (err) {
        console.error("Error fetching energy management items:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-[#040e1e] text-white relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;700&display=swap');
        .glass-panel { background:rgba(255,255,255,0.03); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.08); }
        .hero-text-mask { background:linear-gradient(175deg,#fff 0%,rgba(255,255,255,0.6) 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
      `}</style>

      <div className="absolute top-20 left-20 w-72 h-72 bg-amber-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-[140px] animate-pulse" />

      <ScrollingBanner />

      {/* HERO */}
      <motion.div ref={heroRef} className="relative w-full overflow-hidden mb-20" style={{ height:"clamp(480px,80vh,750px)" }}>
        <div className="absolute inset-0" style={{ backgroundImage:"url('/product/Energy Mgmt 12.jpeg')", backgroundSize:"cover", backgroundPosition:"center", filter:"brightness(1.08) saturate(1.2)" }} />
        <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom,rgba(4,14,30,0.25) 0%,rgba(4,14,30,0.55) 60%,#040e1e 100%)" }} />
        <div className="absolute inset-0" style={{ background:"linear-gradient(to right,rgba(4,14,30,0.6) 0%,rgba(4,14,30,0.1) 60%,transparent 100%)" }} />
        <motion.div className="absolute inset-0 flex flex-col justify-end pb-16 px-8 md:px-16 lg:px-24 max-w-6xl" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.8 }}>
          <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.25, duration:0.6 }} className="flex items-center gap-3 mb-6">
            <div className="h-px w-10" style={{ background: ACCENT }} />
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"11px", letterSpacing:"0.22em", color: ACCENT, textTransform:"uppercase", fontWeight:500 }}>Smart Solutions</span>
          </motion.div>
          <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4, duration:0.8 }} className="hero-text-mask mb-5"
            style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2.8rem,4vw,5.5rem)", fontWeight:700, lineHeight:1.35 }}>
            Energy Management
          </motion.h1>
          <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6, duration:0.7 }}
            style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(14px,1.8vw,17px)", color:"rgba(255,255,255,0.5)", maxWidth:"520px", lineHeight:1.75, fontWeight:300 }}>
            Intelligent energy optimisation products and services for modern organisations.
          </motion.p>
          <motion.button initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.8, duration:0.6 }}
            onClick={() => document.getElementById("content")?.scrollIntoView({ behavior:"smooth" })}
            className="mt-8 self-start inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold"
            style={{ background: ACCENT, color:"white", boxShadow:"0 0 24px rgba(245,158,11,0.35)" }}>
            Explore Products & Services <ArrowRight size={14} />
          </motion.button>
        </motion.div>
      </motion.div>

      <div id="content" className="max-w-7xl mx-auto px-6 pb-32">
        <div className="text-right mb-6">
          <span className="text-xs text-white/30">{items.length} item{items.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: ACCENT, borderTopColor:'transparent' }} />
            <p className="text-white/30 uppercase tracking-widest text-[10px] font-bold">Loading...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-24 text-center glass-panel rounded-[32px]">
            <Zap className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 uppercase tracking-widest text-xs font-bold">No products or services found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <motion.div key={item.id || index} initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: index * 0.05 }}
                className="glass-panel rounded-[24px] overflow-hidden flex flex-col group transition-all duration-500 hover:border-amber-500/30">
                <div className="h-48 relative overflow-hidden">
                  <ItemImageCarousel images={item.images} title={item.title} />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${item.type === 'product' ? 'bg-amber-500/80 text-black' : 'bg-yellow-500/80 text-black'}`}>
                      {item.type || 'service'}
                    </span>
                  </div>
                </div>
                <div className="flex-1 p-6 flex flex-col">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors" style={{ fontFamily:"'Playfair Display',serif" }}>{item.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed line-clamp-3 mb-4 flex-1">{item.description}</p>
                  {item.features?.length > 0 && (
                    <div className="mb-4 space-y-1">
                      {item.features.slice(0, 3).map((f, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Check className="w-3 h-3 shrink-0" style={{ color: ACCENT }} />
                          <span className="text-xs text-white/60">{f}</span>
                        </div>
                      ))}
                      {item.features.length > 3 && <p className="text-xs text-white/30 pl-5">+{item.features.length - 3} more</p>}
                    </div>
                  )}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                        {item.companyLogo ? <img src={`${API_HOST}${item.companyLogo}`} className="w-full h-full object-contain" alt="" /> : <Globe size={12} className="text-white/30" />}
                      </div>
                      <span className="text-[10px] text-white/40 font-medium truncate max-w-[120px]">{item.companyName}</span>
                    </div>
                    <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }} onClick={() => {
                          const tab = item.type === "service" ? "services" : "products";
                          navigate(`/company/${item.companyId}?tab=${tab}`);
                        }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all glass-panel group-hover:bg-amber-500 group-hover:text-black group-hover:border-amber-500">
                      View Profile <ArrowRight size={11} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft, MapPin, Phone, Mail, Globe, Users, Award, FileText, Calendar,
  Building, DollarSign, Clock, CheckCircle, Zap, Package,
  Lightbulb, TrendingUp, Briefcase, Layers, Info,
  ChevronLeft, ChevronRight, ExternalLink, X, Eye, Linkedin, Instagram, Twitter, Facebook
} from "lucide-react";
import ScrollingBanner from "./home/ScrollingBanner";
import { getCompanyById, getAllCompanies } from "../utils/companiesAPI";
import { useAuth } from "../contexts/AuthContext";
import { API_HOST, API_BASE_URL } from "../config";

/* ─────────────────────────────────────────────────────────────
   ACCENT COLOURS per tab
───────────────────────────────────────────────────────────── */
const TAB_ACCENT = {
  overview:       { hex: "#10b981", rgb: "16,185,129"  },
  products:       { hex: "#06b6d4", rgb: "6,182,212"   },
  services:       { hex: "#8b5cf6", rgb: "139,92,246"  },
  projects:       { hex: "#f59e0b", rgb: "245,158,11"  },
  awards:         { hex: "#f59e0b", rgb: "245,158,11"  },
  certifications: { hex: "#3b82f6", rgb: "59,130,246"  },
  caseStudies:    { hex: "#ec4899", rgb: "236,72,153"  },
  blogs:          { hex: "#14b8a6", rgb: "20,184,166"  },
  events:         { hex: "#f97316", rgb: "249,115,22"  },
  innovation:     { hex: "#a78bfa", rgb: "167,139,250" },
};
const accent = (tabId) => TAB_ACCENT[tabId] || TAB_ACCENT.overview;

/* ─────────────────────────────────────────────────────────────
   SHARED STYLE HELPERS
───────────────────────────────────────────────────────────── */
const fieldInputStyle = {
  padding: "9px 14px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  color: "#fff",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "12.5px",
  fontWeight: 300,
  outline: "none",
};

const GlassCard = ({ children, accentRgb, hover = false, style = {}, onClick, onMouseEnter, onMouseLeave }) => (
  <div
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    style={{
      background: "rgba(255,255,255,0.025)",
      border: `1px solid ${accentRgb ? `rgba(${accentRgb},0.18)` : "rgba(255,255,255,0.07)"}`,
      borderRadius: "18px",
      overflow: "hidden",
      transition: "border-color 0.3s, background 0.3s",
      ...style,
    }}
  >
    {children}
  </div>
);

const SectionHeading = ({ label, tabId }) => {
  const a = accent(tabId);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
      <div style={{ height: "1px", width: "32px", background: a.hex }} />
      <h2 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
        fontWeight: 700,
        color: "#fff",
        letterSpacing: "-0.02em",
        whiteSpace: "nowrap",
      }}>
        {label}
      </h2>
      <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.08)" }} />
    </div>
  );
};

const MetaPill = ({ icon: Icon, value, tabId }) => {
  if (!value) return null;
  const a = accent(tabId);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <Icon size={12} style={{ color: a.hex, flexShrink: 0 }} />
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.6)", fontWeight: 300 }}>{value}</span>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const isArchived = status === "archived";
  return (
    <span style={{
      padding: "2px 9px", borderRadius: "99px", fontSize: "10px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
      background: isArchived ? "rgba(249,115,22,0.1)" : "rgba(16,185,129,0.1)",
      border: `1px solid ${isArchived ? "rgba(249,115,22,0.3)" : "rgba(16,185,129,0.3)"}`,
      color: isArchived ? "#f97316" : "#10b981",
    }}>
      {isArchived ? "Archived" : "Active"}
    </span>
  );
};

const FeaturePill = ({ text, tabId }) => {
  const a = accent(tabId);
  return (
    <span style={{ padding: "3px 10px", borderRadius: "99px", fontSize: "10.5px", fontFamily: "'DM Sans', sans-serif", background: `rgba(${a.rgb},0.08)`, border: `1px solid rgba(${a.rgb},0.25)`, color: a.hex }}>
      {text}
    </span>
  );
};

const truncateWords = (text, maxWords = 50) => {
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "…";
};

const normalizeExternalUrl = (value) => {
  if (!value || typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(withProtocol);
    return (parsed.protocol === "http:" || parsed.protocol === "https:") ? withProtocol : "";
  } catch {
    return "";
  }
};

const resolveMediaUrl = (value) => {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("data:") || trimmed.startsWith("blob:")) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  return `${API_HOST}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
};

const EmptyState = ({ label }) => (
  <div style={{ padding: "40px 24px", textAlign: "center", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "16px" }}>
    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.28)", fontWeight: 300 }}>No {label} found with the current filters.</p>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   IMAGE CAROUSEL
───────────────────────────────────────────────────────────── */
const ImageCarousel = ({ images, title }) => {
  const [idx, setIdx] = useState(0);
  const sourceList = Array.isArray(images) ? images : (images ? [images] : []);
  const valid = sourceList
    .map(resolveMediaUrl)
    .filter(Boolean)
    .filter((value, index, list) => list.indexOf(value) === index);

  useEffect(() => {
    if (valid.length <= 1) return;
    const t = setInterval(() => setIdx(p => (p + 1) % valid.length), 5000);
    return () => clearInterval(t);
  }, [valid.length]);

  if (!valid.length) return null;

  return (
    <div className="group" style={{ position: "relative", borderRadius: "12px", overflow: "hidden", aspectRatio: "16/9", marginBottom: "18px", border: "1px solid rgba(255,255,255,0.09)", background: "rgba(0,0,0,0.2)" }}>
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          src={valid[idx]}
          alt={`${title} ${idx + 1}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AnimatePresence>

      {valid.length > 1 && (
        <>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px" }}>
            {[["prev", () => setIdx(p => (p - 1 + valid.length) % valid.length), ChevronLeft],
              ["next", () => setIdx(p => (p + 1) % valid.length), ChevronRight]].map(([key, fn, Icon]) => (
              <button key={key} onClick={e => { e.stopPropagation(); fn(); }}
                style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(0,0,0,0.55)", border: "none", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Icon size={16} />
              </button>
            ))}
          </div>
          <div style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "5px" }}>
            {valid.map((_, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setIdx(i); }}
                style={{ height: "4px", width: i === idx ? "18px" : "6px", borderRadius: "99px", background: i === idx ? "#fff" : "rgba(255,255,255,0.35)", border: "none", cursor: "pointer", transition: "all 0.3s" }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   FILTER BAR
───────────────────────────────────────────────────────────── */
const FilterBar = ({ searchValue, onSearch, searchPlaceholder = "Search…", selects = [] }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "28px" }}>
    <input
      value={searchValue}
      onChange={e => onSearch(e.target.value)}
      placeholder={searchPlaceholder}
      style={{ ...fieldInputStyle, minWidth: "200px", flex: "1 1 200px" }}
      onFocus={e => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)"; e.currentTarget.style.background = "rgba(16,185,129,0.04)"; }}
      onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
    />
    {selects.map(({ value, onChange, options }, i) => (
      <div key={i} style={{ position: "relative" }}>
        <select value={value} onChange={e => onChange(e.target.value)}
          style={{ ...fieldInputStyle, appearance: "none", paddingRight: "28px", cursor: "pointer" }}
          onFocus={e => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)"; }}
          onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
          {options.map(({ label, value: v }) => <option key={v} value={v}>{label}</option>)}
        </select>
        <ChevronRight size={11} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%) rotate(90deg)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
      </div>
    ))}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
const DynamicCompanyPage = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // filter states
  const [projectSearch, setProjectSearch] = useState("");
  const [projectStatusFilter, setProjectStatusFilter] = useState("active");
  const [projectLocationFilter, setProjectLocationFilter] = useState("all");
  const [projectClientFilter, setProjectClientFilter] = useState("all");
  const [projectVisibleCount, setProjectVisibleCount] = useState(6);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
  const [selectedInnovation, setSelectedInnovation] = useState(null);
  const [highlightedItem, setHighlightedItem] = useState(null);
  const [awardSearch, setAwardSearch] = useState("");
  const [awardStatusFilter, setAwardStatusFilter] = useState("active");
  const [awardYearFilter, setAwardYearFilter] = useState("all");
  const [awardBodyFilter, setAwardBodyFilter] = useState("all");
  const [awardCategoryFilter, setAwardCategoryFilter] = useState("all");

  const isAnyModalOpen = Boolean(selectedProject || selectedProduct || selectedService || selectedCaseStudy || selectedInnovation);

  useEffect(() => {
    if (!isAnyModalOpen) return;
    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [isAnyModalOpen]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get("tab");
    const h = params.get("highlight");
    if (t) setActiveTab(t);
    if (h) {
      // Store the highlighted item ID for later use
      setHighlightedItem(h);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const result = await getCompanyById(companyId);
        let companyData = (() => {
          if (!result?.success) return null;
          if (result.data?.data) return result.data.data;
          if (result.data && typeof result.data === "object") return result.data;
          return null;
        })();

        if (!companyData) {
          const all = await getAllCompanies();
          const list = all?.success ? (Array.isArray(all.data?.data) ? all.data.data : all.data) : [];
          const normalize = s => String(s || "").toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
          const paramNorm = normalize(companyId);
          const decodedParamNorm = normalize(decodeURIComponent(companyId || ""));
          const found = Array.isArray(list)
            ? list.find(c => (
              String(c.id) === String(companyId)
              || normalize(c.slug) === paramNorm
              || normalize(c.slug) === decodedParamNorm
              || normalize(c.companyName) === paramNorm
              || normalize(c.companyName) === decodedParamNorm
            ))
            : null;
          if (found) {
            const byId = await getCompanyById(found.id);
            if (byId?.success) companyData = byId.data?.data || (byId.data && typeof byId.data === "object" ? byId.data : null);
          }
        }

        if (companyData) {
          try {
            const companyName = companyData.companyName;
            const enriched = { ...companyData, tabs: { ...(companyData.tabs || {}) } };
            const ensureTab = id => {
              if (!enriched.tabs[id]) enriched.tabs[id] = { enabled: true, items: [] };
              if (!enriched.tabs[id].items) enriched.tabs[id].items = [];
              enriched.tabs[id].enabled = true;
            };
            ensureTab("overview");

            if (Array.isArray(enriched.tabs?.productsServices?.items)) {
              enriched.tabs.productsServices.items.forEach(item => {
                const type = item.type?.toLowerCase() === "service" ? "services" : "products";
                ensureTab(type);
                const itemId = item.id;
                if (itemId && enriched.tabs[type].items.find(i => i.id === itemId)) return;
                enriched.tabs[type].items.push({ id: itemId, title: item.title, description: item.description, image: item.images?.[0] || item.image, images: item.images || (item.image ? [item.image] : []), features: item.features, sector: item.sector, subsector: item.subsector });
              });
            }

            if (Array.isArray(enriched.productsServices)) {
              enriched.productsServices.forEach(item => {
                const type = item.type?.toLowerCase() === "service" ? "services" : "products";
                ensureTab(type);
                if (!enriched.tabs[type].items.find(i => i.id === item.id)) {
                  enriched.tabs[type].items.push({ id: item.id, title: item.title, description: item.description, image: item.images?.[0] || item.image, images: item.images || (item.image ? [item.image] : []), features: item.features });
                }
              });
            }

            ["products", "services"].forEach(type => {
              if (Array.isArray(enriched[type])) {
                ensureTab(type);
                enriched[type].forEach(item => {
                  if (!enriched.tabs[type].items.find(i => i.id === item.id)) {
                    enriched.tabs[type].items.push({ id: item.id, title: item.title || item.name, description: item.description, image: item.image || item.images?.[0], images: item.images || (item.image ? [item.image] : []), features: item.features });
                  }
                });
              }
            });

            try {
              const { getContent } = await import("../utils/contentAPI");
              const allProjects = await getContent("showcase");
              const companyProjects = (allProjects || []).filter(p => p.company === companyName || p.companyName === companyName);
              if (companyProjects.length > 0) {
                ensureTab("projects");
                
                const toProjectItem = (p) => ({
                  id: p.id,
                  title: p.title,
                  description: p.overview || p.description,
                  location: p.location,
                  value: p.projectValue || p.value || "",
                  completion: p.completedDate || p.year,
                  image: p.images?.[0] || p.image,
                  images: p.images?.some(i => i) ? p.images : (p.image ? [p.image] : []),
                  workDelivered: p.workDelivered || "",
                  outcome: p.outcome || "",
                  keyFeatures: p.keyFeatures,
                  url: p.url || p.projectUrl || p.link || ""
                });

                const normalize = (value) => String(value || "").trim().toLowerCase();
                const buildKey = (item) => (
                  item?.id
                    ? `id:${normalize(item.id)}`
                    : `meta:${normalize(item.title)}|${normalize(item.location)}|${normalize(item.completion)}`
                );

                const existingKeys = new Set((enriched.tabs.projects.items || []).map(buildKey));
                const mergedFromContent = companyProjects
                  .map(toProjectItem)
                  .filter((item) => {
                    const key = buildKey(item);
                    if (existingKeys.has(key)) return false;
                    existingKeys.add(key);
                    return true;
                  });

                enriched.tabs.projects.items = [...enriched.tabs.projects.items, ...mergedFromContent];
              }

              const allCS = await getContent("case-studies");
              const companyCS = (allCS || []).filter(c => c.company === companyName || c.companyName === companyName);
              if (companyCS.length > 0) {
                ensureTab("caseStudies");
                const toCaseStudyItem = (c) => ({
                  id: c.id,
                  title: c.title,
                  overview: c.overview || c.description,
                  description: c.overview || c.description,
                  client: c.client || c.clientName || "",
                  location: c.location,
                  year: c.year,
                  completion: c.completedDate || c.completion || c.year || "",
                  value: c.projectValue || c.value || "",
                  impact: c.impact || "",
                  outcomes: Array.isArray(c.outcomes) ? c.outcomes : [],
                  keyFeatures: c.keyFeatures?.filter(Boolean) || [],
                  challenges: c.challenges || "",
                  solution: c.solution || "",
                  outcome: c.outcome || "",
                  url: c.url || c.caseStudyUrl || c.link || "",
                  images: c.images?.some(i => i) ? c.images : (c.image ? [c.image] : []),
                });

                const normalize = (value) => String(value || "").trim().toLowerCase();
                const buildKey = (item) => (
                  item?.id
                    ? `id:${normalize(item.id)}`
                    : `meta:${normalize(item.title)}|${normalize(item.client || item.clientName)}|${normalize(item.year)}|${normalize(item.location)}`
                );

                const existingKeys = new Set((enriched.tabs.caseStudies.items || []).map(buildKey));
                const mergedFromContent = companyCS
                  .map(toCaseStudyItem)
                  .filter((item) => {
                    const key = buildKey(item);
                    if (existingKeys.has(key)) return false;
                    existingKeys.add(key);
                    return true;
                  });

                enriched.tabs.caseStudies.items = [...enriched.tabs.caseStudies.items, ...mergedFromContent];
              }

              const allInnovations = await getContent("innovations");
              const companyInnovations = (allInnovations || []).filter(c => c.company === companyName || c.companyName === companyName);
              if (companyInnovations.length > 0) {
                ensureTab("innovation");
                
                const toInnovationItem = (c) => ({
                  id: c.id,
                  title: c.name || c.title,
                  description: c.description,
                  category: c.category,
                  type: c.type,
                  status: c.status,
                  company: c.company,
                  companyName: c.companyName,
                  companyLogo: c.companyLogo,
                  link: c.link,
                  keyFeatures: Array.isArray(c.keyFeatures) ? c.keyFeatures.filter(Boolean) : [],
                  productsServices: Array.isArray(c.productsServices) ? c.productsServices.filter(Boolean) : [],
                  image: c.image || c.companyLogo || "",
                  images: Array.isArray(c.images) && c.images.some(Boolean)
                    ? c.images.filter(Boolean)
                    : [c.image, c.companyLogo].filter(Boolean),
                });

                const normalize = (value) => String(value || "").trim().toLowerCase();
                const buildKey = (item) => (
                  item?.id
                    ? `id:${normalize(item.id)}`
                    : `meta:${normalize(item.title)}|${normalize(item.category)}|${normalize(item.type)}`
                );

                const existingKeys = new Set((enriched.tabs.innovation.items || []).map(buildKey));
                const mergedFromContent = companyInnovations
                  .map(toInnovationItem)
                  .filter((item) => {
                    const key = buildKey(item);
                    if (existingKeys.has(key)) return false;
                    existingKeys.add(key);
                    return true;
                  });

                enriched.tabs.innovation.items = [...enriched.tabs.innovation.items, ...mergedFromContent];
              }
            } catch (e) { console.error("API content error:", e); }

            const storedSpotlights = JSON.parse(localStorage.getItem("adminProduct-service-spotlight") || "[]");
            storedSpotlights.filter(c => c.company === companyName || c.companyName === companyName).forEach(item => {
              const type = item.type?.toLowerCase() === "service" ? "services" : "products";
              ensureTab(type);
              enriched.tabs[type].items.push({ id: item.id, title: item.title || item.name, description: item.description, image: item.image, images: item.image ? [item.image] : [] });
            });

            companyData = enriched;
          } catch (e) { console.error("Enrichment error:", e); }
          setCompany(companyData);
        } else {
          setError("Company not found");
        }
      } catch (e) {
        console.error(e);
        setError("Failed to load company data");
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [companyId]);

  const TAB_CONFIG = [
    { id: "overview",       label: "Overview",        icon: Info },
    { id: "products",       label: "Products",        icon: Package },
    { id: "services",       label: "Services",        icon: Layers },
    { id: "projects",       label: "Projects",        icon: Briefcase },
    { id: "awards",         label: "Awards",          icon: Award },
    { id: "certifications", label: "Certifications",  icon: FileText },
    { id: "caseStudies",    label: "Case Studies",    icon: FileText },
    { id: "blogs",          label: "Blogs",           icon: TrendingUp },
    { id: "events",         label: "Events",          icon: Calendar },
    { id: "innovation",     label: "Innovation",      icon: Lightbulb },
  ];

  const getAvailableTabs = (c) => {
    if (!c) return [];
    const tabs = c.tabs || {};
    return TAB_CONFIG.filter(tab => {
      const d = tabs[tab.id];
      if (!d?.enabled) return false;
      if (tab.id === "overview") return true;
      return Array.isArray(d.items) && d.items.length > 0;
    });
  };

  const availableTabs = getAvailableTabs(company);

  useEffect(() => {
    if (!company || !availableTabs.length) return;
    const ids = availableTabs.map(t => t.id);
    if (!ids.includes(activeTab)) {
      const params = new URLSearchParams(location.search);
      const tp = params.get("tab");
      setActiveTab(tp && ids.includes(tp) ? tp : ids[0]);
    }
  }, [company, availableTabs.length]);

  /* ── LOADING ── */
  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#040e1e", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "2px solid rgba(16,185,129,0.25)", borderTopColor: "#10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>Loading company…</p>
      </div>
    </div>
  );

  /* ── ERROR ── */
  if (error || !company) return (
    <div style={{ minHeight: "100vh", background: "#040e1e", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", padding: "32px" }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "#fff", marginBottom: "20px" }}>{error || "Company not found"}</p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.45)", marginBottom: "18px" }}>Please check the URL or open this profile from the company listings.</p>
        <button onClick={() => navigate("/")} style={{ padding: "10px 24px", borderRadius: "12px", background: "#10b981", border: "none", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Go Home</button>
      </div>
    </div>
  );

  const currentAccent = accent(activeTab);
  const websiteHref = normalizeExternalUrl(company.websiteLink || company.companyWebsite || company.website);
  const socialMediaObject = (() => {
    const raw = company.socialMediaLinks;
    if (raw && typeof raw === "object" && !Array.isArray(raw)) return raw;
    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
      } catch {
        return {};
      }
    }
    return {};
  })();
  const socialMediaEntries = [
    { key: "linkedin", icon: Linkedin, label: "LinkedIn" },
    { key: "instagram", icon: Instagram, label: "Instagram" },
    { key: "twitter", icon: Twitter, label: "Twitter / X" },
    { key: "facebook", icon: Facebook, label: "Facebook" },
  ]
    .map(({ key, icon, label }) => ({ key, icon, label, url: normalizeExternalUrl(socialMediaObject[key]) }))
    .filter(item => !!item.url);

  const canViewProjectDesc = (project) => (
    project?.descriptionVisibility !== "private"
    || user?.role === "admin"
    || user?.companyId === company?.id
    || user?.id === company?.id
  );

  /* ── TAB CONTENT ── */
  const renderTabContent = () => {
    const tabData = company.tabs?.[activeTab];
    if (!tabData?.enabled) return (
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>No content available for this section.</p>
      </div>
    );

    /* ── OVERVIEW ── */
    if (activeTab === "overview") return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <SectionHeading label="Overview" tabId="overview" />
        <GlassCard accentRgb="16,185,129">
          <div style={{ padding: "28px 28px 24px" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.62)", lineHeight: 1.85, fontWeight: 300, whiteSpace: "pre-wrap" }}>
              {tabData.content || company.productsServices || "No overview available."}
            </p>

            {company.industrySector?.length > 0 && (
              <div style={{ marginTop: "28px" }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginBottom: "12px" }}>Industry Sectors</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {company.industrySector.map((s, i) => (
                    <span key={i} style={{ padding: "4px 12px", borderRadius: "99px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", fontSize: "12px", color: "#10b981", fontFamily: "'DM Sans', sans-serif" }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {company.companyNews?.length > 0 && (
              <div style={{ marginTop: "28px" }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginBottom: "12px" }}>Company News</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {company.companyNews.map((n, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)" }}>
                      {n.link ? (
                        <a href={n.link.startsWith("http") ? n.link : `https://${n.link}`} target="_blank" rel="noopener noreferrer"
                          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.6)", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}
                          onMouseEnter={e => e.currentTarget.style.color = "#10b981"}
                          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}>
                          {n.title} <ExternalLink size={11} />
                        </a>
                      ) : (
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>{n.title}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>
    );

    /* ── PRODUCTS ── */
    if (activeTab === "products") return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <SectionHeading label="Products" tabId="products" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {tabData.items?.map((p, i) => (
            <GlassCard key={p.id || i} accentRgb="6,182,212" 
              style={{ 
                transition: "all 0.3s", 
                cursor: "pointer",
                border: highlightedItem === p.id ? `2px solid rgba(6,182,212,0.8)` : undefined,
                boxShadow: highlightedItem === p.id ? `0 0 20px rgba(6,182,212,0.3)` : undefined
              }}
              onClick={() => setSelectedProduct(p)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(6,182,212,0.4)"; e.currentTarget.style.background = "rgba(6,182,212,0.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(6,182,212,0.18)"; e.currentTarget.style.background = "rgba(255,255,255,0.025)"; }}
            >  
              <div style={{ padding: "20px" }}>
                <ImageCarousel images={p.images || (p.image ? [p.image] : [])} title={p.title} />
                <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.6), transparent)", marginBottom: "14px" }} />
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>{p.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontWeight: 300, marginBottom: "12px" }}>
                  {truncateWords(p.description, 50)}
                </p>
                {p.features?.length > 0 && (
                  <div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#06b6d4", marginBottom: "8px" }}>Key Features</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      {p.features.slice(0, 3).map((f, fi) => (
                        <div key={fi} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                          <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#06b6d4", flexShrink: 0 }} />
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.55)", fontWeight: 300 }}>{f}</span>
                        </div>
                      ))}
                      {p.features.length > 3 && (
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#06b6d4", marginTop: "4px" }}>+{p.features.length - 3} more features</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    );

    /* ── SERVICES ── */
    if (activeTab === "services") return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <SectionHeading label="Services" tabId="services" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {tabData.items?.map((s, i) => (
            <GlassCard key={s.id || i} accentRgb="139,92,246" 
              style={{ 
                transition: "all 0.3s", 
                cursor: "pointer",
                border: highlightedItem === s.id ? `2px solid rgba(139,92,246,0.8)` : undefined,
                boxShadow: highlightedItem === s.id ? `0 0 20px rgba(139,92,246,0.3)` : undefined
              }}
              onClick={() => setSelectedService(s)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.4)"; e.currentTarget.style.background = "rgba(139,92,246,0.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.18)"; e.currentTarget.style.background = "rgba(255,255,255,0.025)"; }}
            >  
              <div style={{ padding: "20px" }}>
                <ImageCarousel images={s.images || (s.image ? [s.image] : [])} title={s.title} />
                <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent)", marginBottom: "14px" }} />
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>{s.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontWeight: 300, marginBottom: "12px" }}>
                  {truncateWords(s.description, 50)}
                </p>
                {s.features?.length > 0 && (
                  <div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8b5cf6", marginBottom: "8px" }}>Key Features</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      {s.features.slice(0, 3).map((f, fi) => (
                        <div key={fi} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                          <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#8b5cf6", flexShrink: 0 }} />
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.55)", fontWeight: 300 }}>{f}</span>
                        </div>
                      ))}
                      {s.features.length > 3 && (
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#8b5cf6", marginTop: "4px" }}>+{s.features.length - 3} more features</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    );

    /* ── PROJECTS ── */
    if (activeTab === "projects") {
      const raw = Array.isArray(tabData.items) ? tabData.items : [];
      const normalized = raw.map(p => {
        const normalizedFeatures = Array.isArray(p.keyFeatures)
          ? p.keyFeatures.filter(Boolean)
          : (typeof p.keyFeatures === "string" ? p.keyFeatures.split("\n").map(f => f.trim()).filter(Boolean) : []);
        return {
          ...p,
          status: p.status || "active",
          projectValue: p.projectValue || p.value || "",
          projectDate: p.projectDate || p.completion || "",
          clientName: p.clientName || p.client || "",
          description: p.description || p.overview || "",
          workDelivered: p.workDelivered || p.scopeOfWork || p.workScope || "",
          outcome: p.outcome || p.projectOutcome || p.impact || "",
          keyFeatures: normalizedFeatures,
          descriptionVisibility: p.descriptionVisibility || "public",
          url: p.url || p.projectUrl || ""
        };
      });
      const locOpts = ["all", ...Array.from(new Set(normalized.map(p => p.location).filter(Boolean)))];
      const clientOpts = ["all", ...Array.from(new Set(normalized.map(p => p.clientName).filter(Boolean)))];
      const filtered = normalized.filter(p => {
        if (projectStatusFilter !== "all" && p.status !== projectStatusFilter) return false;
        if (projectLocationFilter !== "all" && p.location !== projectLocationFilter) return false;
        if (projectClientFilter !== "all" && p.clientName !== projectClientFilter) return false;
        const q = projectSearch.trim().toLowerCase();
        return !q || `${p.title} ${p.description} ${p.clientName} ${p.location}`.toLowerCase().includes(q);
      });
      return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <SectionHeading label="Projects" tabId="projects" />
          <FilterBar
            searchValue={projectSearch}
            onSearch={v => { setProjectSearch(v); setProjectVisibleCount(6); }}
            searchPlaceholder="Search projects…"
            selects={[
              { value: projectStatusFilter, onChange: v => { setProjectStatusFilter(v); setProjectVisibleCount(6); }, options: [{ label: "Active", value: "active" }, { label: "Archived", value: "archived" }, { label: "All", value: "all" }] },
              { value: projectLocationFilter, onChange: v => { setProjectLocationFilter(v); setProjectVisibleCount(6); }, options: locOpts.map(o => ({ label: o === "all" ? "All Locations" : o, value: o })) },
              { value: projectClientFilter, onChange: v => { setProjectClientFilter(v); setProjectVisibleCount(6); }, options: clientOpts.map(o => ({ label: o === "all" ? "All Clients" : o, value: o })) },
            ]}
          />
          {filtered.length === 0 ? <EmptyState label="projects" /> : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {filtered.slice(0, projectVisibleCount).map((p, i) => (
                <GlassCard key={p.id || i} accentRgb="245,158,11">
                  <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.7), transparent)" }} />
                  <div style={{ padding: "24px 28px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }}>
                          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "#fff" }}>{p.title}</h3>
                          <StatusBadge status={p.status} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "14px" }}>
                          <MetaPill icon={Users} value={p.clientName} tabId="projects" />
                          <MetaPill icon={MapPin} value={p.location} tabId="projects" />
                          <MetaPill icon={DollarSign} value={p.projectValue} tabId="projects" />
                          <MetaPill icon={Calendar} value={p.projectDate} tabId="projects" />
                        </div>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, fontWeight: 300 }}>
                          {canViewProjectDesc(p)
                            ? (p.description?.length > 180 ? `${p.description.slice(0, 180)}…` : p.description)
                            : "Description available to subscribers."}
                        </p>
                        <button
                          onClick={() => setSelectedProject(p)}
                          style={{
                            marginTop: "14px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 14px",
                            borderRadius: "10px",
                            border: "1px solid rgba(245,158,11,0.35)",
                            background: "rgba(245,158,11,0.1)",
                            color: "#f59e0b",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          <Eye size={13} />
                          View Details
                        </button>
                        {normalizeExternalUrl(p.url) && (
                          <a
                            href={normalizeExternalUrl(p.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              marginTop: "10px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "8px 14px",
                              borderRadius: "10px",
                              border: "1px solid rgba(16,185,129,0.35)",
                              background: "rgba(16,185,129,0.1)",
                              color: "#10b981",
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: "12px",
                              fontWeight: 600,
                              textDecoration: "none"
                            }}
                          >
                            <ExternalLink size={13} />
                            Visit Project URL
                          </a>
                        )}
                      </div>
                      <div><ImageCarousel images={p.images} title={p.title} /></div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
          {filtered.length > projectVisibleCount && (
            <div style={{ marginTop: "24px", textAlign: "center" }}>
              <button onClick={() => setProjectVisibleCount(p => p + 6)}
                style={{ padding: "10px 28px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}>
                Load More Projects
              </button>
            </div>
          )}
        </motion.div>
      );
    }

    /* ── AWARDS / CERTIFICATIONS (shared filter logic) ── */
    const isAwardsLike = activeTab === "awards" || activeTab === "certifications";
    if (isAwardsLike) {
      const raw = Array.isArray(tabData.items) ? tabData.items : [];
      const normalized = raw.map(a => {
        const fallbackImages = [a.image, a.personImage, a.companyLogo, a.logo, a.certificateImage, a.badgeImage].filter(Boolean);
        return {
          ...a,
          title: a.title || a.awardTitle || a.certificationName || a.personName || a.companyName || "Untitled",
          status: a.status || "active",
          awardingBody: a.awardingBody || a.issuingBody || a.organizer || a.companyName || "",
          awardDate: a.awardDate || a.issueDate || a.awardYear || a.year || "",
          expiryDate: a.expiryDate || "",
          category: a.category || a.type || "",
          description: a.description || a.awardDescription || a.overview || "",
          keyHighlights: a.keyHighlights || a.highlights || [],
          url: a.url || a.referenceUrl || a.link || "",
          certificationNumber: a.certificationNumber || "",
          certificateFile: a.certificateFile || "",
          images: Array.isArray(a.images) && a.images.some(Boolean)
            ? a.images.filter(Boolean)
            : fallbackImages,
        };
      });
      const yearOpts = ["all", ...Array.from(new Set(normalized.map(a => String(a.awardDate || "").slice(0, 4)).filter(Boolean)))];
      const bodyOpts = ["all", ...Array.from(new Set(normalized.map(a => a.awardingBody).filter(Boolean)))];
      const catOpts = ["all", ...Array.from(new Set(normalized.map(a => a.category).filter(Boolean)))];
      const filtered = normalized.filter(a => {
        if (awardStatusFilter !== "all" && a.status !== awardStatusFilter) return false;
        if (awardYearFilter !== "all" && !String(a.awardDate || "").startsWith(awardYearFilter)) return false;
        if (awardBodyFilter !== "all" && a.awardingBody !== awardBodyFilter) return false;
        if (awardCategoryFilter !== "all" && a.category !== awardCategoryFilter) return false;
        const q = awardSearch.trim().toLowerCase();
        return !q || `${a.title} ${a.description} ${a.awardingBody} ${a.category}`.toLowerCase().includes(q);
      });
      const label = activeTab === "awards" ? "Awards" : "Certifications";
      const a = accent(activeTab);

      return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <SectionHeading label={label} tabId={activeTab} />
          <FilterBar
            searchValue={awardSearch}
            onSearch={setAwardSearch}
            searchPlaceholder={`Search ${label.toLowerCase()}…`}
            selects={[
              { value: awardStatusFilter, onChange: setAwardStatusFilter, options: [{ label: "Active", value: "active" }, { label: "Archived", value: "archived" }, { label: "All", value: "all" }] },
              { value: awardYearFilter, onChange: setAwardYearFilter, options: yearOpts.map(o => ({ label: o === "all" ? "All Years" : o, value: o })) },
              { value: awardBodyFilter, onChange: setAwardBodyFilter, options: bodyOpts.map(o => ({ label: o === "all" ? `All ${activeTab === "awards" ? "Bodies" : "Issuers"}` : o, value: o })) },
              { value: awardCategoryFilter, onChange: setAwardCategoryFilter, options: catOpts.map(o => ({ label: o === "all" ? "All Categories" : o, value: o })) },
            ]}
          />
          {filtered.length === 0 ? <EmptyState label={label.toLowerCase()} /> : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {filtered.map((item, i) => (
                <GlassCard key={item.id || i} accentRgb={a.rgb}>
                  <div style={{ height: "2px", background: `linear-gradient(90deg, transparent, ${a.hex}, transparent)` }} />
                  <div style={{ padding: "22px 26px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
                      {/* Images section */}
                      {item.images?.length > 0 && (
                        <div style={{ flex: "0 0 200px", maxWidth: "200px" }}>
                          <ImageCarousel images={item.images} title={item.title} />
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: "280px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
                          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: "#fff" }}>{item.title}</h3>
                          <StatusBadge status={item.status} />
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "12px" }}>
                          <MetaPill icon={Users} value={item.awardingBody} tabId={activeTab} />
                          <MetaPill icon={Award} value={item.category} tabId={activeTab} />
                          <MetaPill icon={MapPin} value={item.location} tabId={activeTab} />
                          <MetaPill icon={Calendar} value={item.awardDate ? `Issued: ${item.awardDate}` : null} tabId={activeTab} />
                          <MetaPill icon={Clock} value={item.expiryDate ? `Expires: ${item.expiryDate}` : null} tabId={activeTab} />
                        </div>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, fontWeight: 300 }}>{item.description}</p>
                        {activeTab === "certifications" && (item.certificationNumber || item.certificateFile) && (
                          <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                            {item.certificationNumber && (
                              <span style={{ padding: "4px 10px", borderRadius: "6px", background: `rgba(${a.rgb},0.1)`, border: `1px solid rgba(${a.rgb},0.2)`, fontSize: "10px", color: a.hex, fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>ID: {item.certificationNumber}</span>
                            )}
                            {item.certificateFile && (
                              <a
                                href={item.certificateFile.startsWith('http') ? item.certificateFile : `${API_BASE_URL}${item.certificateFile}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  padding: "4px 10px",
                                  borderRadius: "6px",
                                  border: `1px solid rgba(${a.rgb},0.35)`,
                                  background: `rgba(${a.rgb},0.1)`,
                                  color: a.hex,
                                  textDecoration: "none",
                                  fontSize: "11px",
                                  fontWeight: 500
                                }}
                              >
                                <ExternalLink size={11} />
                                View Certificate
                              </a>
                            )}
                          </div>
                        )}
                        {normalizeExternalUrl(item.url) && (
                          <a
                            href={normalizeExternalUrl(item.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              marginTop: "12px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "7px 12px",
                              borderRadius: "10px",
                              border: `1px solid rgba(${a.rgb},0.35)`,
                              background: `rgba(${a.rgb},0.1)`,
                              color: a.hex,
                              textDecoration: "none",
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: "12px",
                              fontWeight: 600
                            }}
                          >
                            <ExternalLink size={12} />
                            Visit URL
                          </a>
                        )}
                        {item.keyHighlights?.length > 0 && <div style={{ marginTop: "14px", display: "flex", flexWrap: "wrap", gap: "6px" }}>{item.keyHighlights.map((h, hi) => <FeaturePill key={hi} text={h} tabId={activeTab} />)}</div>}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </motion.div>
      );
    }

    /* ── CASE STUDIES ── */
    if (activeTab === "caseStudies") {
      const normalized = (Array.isArray(tabData.items) ? tabData.items : []).map(cs => {
        const outcomes = Array.isArray(cs.outcomes)
          ? cs.outcomes.filter(Boolean)
          : (typeof cs.outcomes === "string" ? cs.outcomes.split("\n").map(o => o.trim()).filter(Boolean) : []);
        return {
          ...cs,
          clientName: cs.clientName || cs.client || "",
          projectValue: cs.projectValue || cs.value || "",
          completion: cs.completion || cs.completedDate || cs.year || "",
          description: cs.overview || cs.description || "",
          impact: cs.impact || "",
          url: cs.url || cs.caseStudyUrl || cs.link || "",
          outcomes,
          keyFeatures: cs.keyFeatures?.filter(Boolean) || [],
          challenges: cs.challenges || "",
          solution: cs.solution || "",
          outcome: cs.outcome || "",
        };
      });

      return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <SectionHeading label="Case Studies" tabId="caseStudies" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {normalized.map((cs, i) => (
              <GlassCard key={cs.id || i} accentRgb="236,72,153" style={{ transition: "all 0.3s", cursor: "pointer" }}
                onClick={() => setSelectedCaseStudy(cs)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(236,72,153,0.4)"; e.currentTarget.style.background = "rgba(236,72,153,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(236,72,153,0.18)"; e.currentTarget.style.background = "rgba(255,255,255,0.025)"; }}>
                <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, rgba(236,72,153,0.7), transparent)" }} />
                <div style={{ padding: "20px" }}>
                  <ImageCarousel images={cs.images} title={cs.title} />
                  <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, rgba(236,72,153,0.6), transparent)", marginBottom: "14px" }} />
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>{cs.title}</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                    <MetaPill icon={Users} value={cs.clientName} tabId="caseStudies" />
                    <MetaPill icon={MapPin} value={cs.location} tabId="caseStudies" />
                    <MetaPill icon={DollarSign} value={cs.projectValue} tabId="caseStudies" />
                    <MetaPill icon={Calendar} value={cs.completion} tabId="caseStudies" />
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontWeight: 300, marginBottom: "12px" }}>
                    {truncateWords(cs.description, 50)}
                  </p>
                  {normalizeExternalUrl(cs.url) && (
                    <a
                      href={normalizeExternalUrl(cs.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) => event.stopPropagation()}
                      style={{
                        marginBottom: "10px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "7px 12px",
                        borderRadius: "10px",
                        border: "1px solid rgba(236,72,153,0.35)",
                        background: "rgba(236,72,153,0.1)",
                        color: "#ec4899",
                        textDecoration: "none",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "12px",
                        fontWeight: 600
                      }}
                    >
                      <ExternalLink size={12} />
                      Visit Case Study URL
                    </a>
                  )}
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#ec4899", fontWeight: 500 }}>Click to view full details →</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      );
    }

    /* ── BLOGS ── */
    if (activeTab === "blogs") return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <SectionHeading label="Blogs & Articles" tabId="blogs" />
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {tabData.items?.map((b, i) => (
            <GlassCard key={b.id || i} accentRgb="20,184,166">
              <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, rgba(20,184,166,0.7), transparent)" }} />
              <div style={{ padding: "22px 26px" }}>
                {b.date && <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "99px", background: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.3)", fontSize: "11px", color: "#14b8a6", fontFamily: "'DM Sans', sans-serif", marginBottom: "12px" }}>{b.date}</span>}
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>{b.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, fontWeight: 300 }}>{b.content || b.description}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    );

    /* ── EVENTS ── */
    if (activeTab === "events") return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <SectionHeading label="News & Events" tabId="events" />
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {tabData.items?.map((ev, i) => (
            <GlassCard key={ev.id || i} accentRgb="249,115,22">
              <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, rgba(249,115,22,0.7), transparent)" }} />
              <div style={{ padding: "22px 26px" }}>
                {ev.date && <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "99px", background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)", fontSize: "11px", color: "#f97316", fontFamily: "'DM Sans', sans-serif", marginBottom: "12px" }}>{ev.date}</span>}
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>{ev.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, fontWeight: 300 }}>{ev.description}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    );

    /* ── INNOVATION ── */
    if (activeTab === "innovation") {
      const normalizedInnovations = (Array.isArray(tabData.items) ? tabData.items : []).map((inn) => {
        const fallbackImages = [inn.image, inn.companyLogo, inn.logo].filter(Boolean);
        return {
          ...inn,
          images: Array.isArray(inn.images) && inn.images.some(Boolean)
            ? inn.images.filter(Boolean)
            : fallbackImages,
        };
      });

      return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <SectionHeading label="Innovation & Technology" tabId="innovation" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {normalizedInnovations.map((inn, i) => (
              <GlassCard key={inn.id || i} accentRgb="167,139,250"
                style={{ transition: "all 0.3s", cursor: "pointer" }}
                onClick={() => setSelectedInnovation(inn)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(167,139,250,0.4)"; e.currentTarget.style.background = "rgba(167,139,250,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(167,139,250,0.18)"; e.currentTarget.style.background = "rgba(255,255,255,0.025)"; }}>
                <div style={{ padding: "24px" }}>
                  {inn.images?.length > 0 ? (
                    <ImageCarousel images={inn.images} title={inn.title} />
                  ) : (
                    <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                      <Lightbulb size={20} style={{ color: "#a78bfa" }} />
                    </div>
                  )}
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>{inn.title}</h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontWeight: 300 }}>{inn.description}</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#a78bfa", fontWeight: 500, marginTop: "12px" }}>Click to view full details →</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      );
    }

    return <div style={{ color: "rgba(255,255,255,0.4)" }}>Select a tab to view content</div>;
  };

  /* ── FULL PAGE RENDER ── */
  return (
    <div style={{ minHeight: "100vh", background: "#040e1e", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        html { scrollbar-gutter: stable; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        ::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.35); border-radius: 99px; }
        option { background: #040e1e; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ambient glows */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-100px", left: "20%", width: "600px", height: "500px", borderRadius: "50%", background: `radial-gradient(ellipse, ${currentAccent.hex}, transparent 65%)`, opacity: 0.04, transition: "background 0.5s" }} />
        <div style={{ position: "absolute", bottom: "-120px", right: "10%", width: "500px", height: "400px", borderRadius: "50%", background: "radial-gradient(ellipse, #06b6d4, transparent 65%)", opacity: 0.03 }} />
      </div>

      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}>
        <ScrollingBanner />
      </div>

      {/* ── HERO ── */}
      <div style={{ position: "relative", paddingTop: "100px", overflow: "hidden" }}>
        {/* dark gradient hero background */}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, rgba(${currentAccent.rgb},0.12) 0%, rgba(4,14,30,0.98) 70%)`, transition: "background 0.5s" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg, transparent, rgba(${currentAccent.rgb},0.4), transparent)` }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: "1280px", margin: "0 auto", padding: "56px 40px 40px" }}>
          {/* Back button */}
          <button onClick={() => navigate(-1)}
            style={{ display: "inline-flex", alignItems: "center", gap: "7px", marginBottom: "32px", fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", fontWeight: 500, color: "rgba(255,255,255,0.5)", background: "none", border: "none", cursor: "pointer", padding: 0, transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = currentAccent.hex}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}>
            <ArrowLeft size={14} />Back
          </button>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "24px", flexWrap: "wrap" }}>
            {/* Logo */}
            <div style={{ width: "80px", height: "80px", borderRadius: "16px", overflow: "hidden", flexShrink: 0, background: `rgba(${currentAccent.rgb},0.08)`, border: `1px solid rgba(${currentAccent.rgb},0.25)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {company.companyLogo ? (
                <img src={`${API_HOST}${company.companyLogo}`} alt={company.companyName} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "8px" }} />
              ) : (
                <Building size={32} style={{ color: `rgba(${currentAccent.rgb},0.7)` }} />
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div style={{ height: "1px", width: "28px", background: currentAccent.hex }} />
                <span style={{ fontSize: "10px", letterSpacing: "0.2em", color: currentAccent.hex, textTransform: "uppercase", fontWeight: 600 }}>Company Profile</span>
              </div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 700, color: "#fff", lineHeight: 1.08, letterSpacing: "-0.02em", marginBottom: "10px" }}>
                {company.companyName}
              </h1>
              {company.mainSector && (
                <p style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.45)", fontWeight: 300, marginBottom: "16px" }}>{company.mainSector}</p>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                {company.companyAddress && <MetaPill icon={MapPin} value={company.companyAddress} tabId={activeTab} />}
                {(company.postCode || company.pincode || company.pinCode) && (
                  <MetaPill icon={MapPin} value={`Post Code: ${company.postCode || company.pincode || company.pinCode}`} tabId={activeTab} />
                )}
                {company.contactPerson?.email && <MetaPill icon={Mail} value={company.contactPerson.email} tabId={activeTab} />}
                {company.contactPerson?.phoneNumber && <MetaPill icon={Phone} value={company.contactPerson.phoneNumber} tabId={activeTab} />}
                {websiteHref && (
                  <a href={websiteHref} target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: currentAccent.hex, textDecoration: "none" }}>
                    <Globe size={12} /> Visit Website
                  </a>
                )}
              </div>

              {socialMediaEntries.length > 0 && (
                <div style={{ marginTop: "14px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {socialMediaEntries.map(({ key, icon: Icon, label, url }) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 10px", borderRadius: "99px", border: `1px solid rgba(${currentAccent.rgb},0.35)`, color: "rgba(255,255,255,0.82)", textDecoration: "none", fontSize: "11px", background: "rgba(255,255,255,0.03)" }}
                    >
                      <Icon size={13} /> {label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          {company.companyBio && (
            <div style={{ marginTop: "24px", padding: "18px 22px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", maxWidth: "780px" }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13.5px", color: "rgba(255,255,255,0.55)", lineHeight: 1.8, fontWeight: 300 }}>{company.companyBio}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── TAB BAR ── */}
      {availableTabs.length > 0 && (
        <div style={{ position: "sticky", top: "40px", zIndex: 40, background: "rgba(4,14,30,0.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 40px" }}>
            <div style={{ display: "flex", gap: "2px", overflowX: "auto", scrollbarWidth: "none", padding: "10px 0" }}>
              {availableTabs.map(tab => {
                const isActive = activeTab === tab.id;
                const a = accent(tab.id);
                return (
                  <button key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      const params = new URLSearchParams(location.search);
                      params.set("tab", tab.id);
                      navigate({ search: params.toString() }, { replace: true });
                    }}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "6px",
                      padding: "8px 16px", borderRadius: "10px", border: "none", cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", fontWeight: isActive ? 600 : 400,
                      background: isActive ? `rgba(${a.rgb},0.12)` : "transparent",
                      color: isActive ? a.hex : "rgba(255,255,255,0.45)",
                      boxShadow: isActive ? `0 0 0 1px rgba(${a.rgb},0.3)` : "none",
                      transition: "all 0.2s",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; } }}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; e.currentTarget.style.background = "transparent"; } }}>
                    <tab.icon size={13} />
                    <span style={{ display: "inline" }}>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div style={{ position: "relative", zIndex: 10, maxWidth: "1280px", margin: "0 auto", padding: "40px 40px 80px" }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── PRODUCT POPUP ── */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
            style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(4,14,30,0.88)", backdropFilter: "blur(14px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
              style={{ width: "100%", maxWidth: "900px", maxHeight: "88vh", borderRadius: "18px", border: "1px solid rgba(6,182,212,0.28)", background: "rgba(4,14,30,0.98)", overflow: "hidden", display: "flex", flexDirection: "column" }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#fff" }}>{selectedProduct.title}</h3>
                  {(selectedProduct.sector || selectedProduct.subsector) && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                      {selectedProduct.sector && <span style={{ padding: "3px 10px", borderRadius: "99px", fontSize: "11px", background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.3)", color: "#06b6d4", fontFamily: "'DM Sans', sans-serif" }}>{selectedProduct.sector}</span>}
                      {selectedProduct.subsector && <span style={{ padding: "3px 10px", borderRadius: "99px", fontSize: "11px", background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.25)", color: "#06b6d4", fontFamily: "'DM Sans', sans-serif" }}>{selectedProduct.subsector}</span>}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ overflowY: "auto", padding: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13.5px", color: "rgba(255,255,255,0.58)", lineHeight: 1.8, fontWeight: 300, whiteSpace: "pre-wrap", marginBottom: "20px" }}>
                    {selectedProduct.description}
                  </p>
                  {selectedProduct.features?.length > 0 && (
                    <div style={{ padding: "16px", borderRadius: "12px", border: "1px solid rgba(6,182,212,0.2)", background: "rgba(6,182,212,0.05)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                        <Award size={14} style={{ color: "#06b6d4" }} />
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#06b6d4" }}>Key Features</span>
                      </div>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                        {selectedProduct.features.map((f, fi) => (
                          <li key={fi} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                            <span style={{ color: "#06b6d4", marginTop: "5px", flexShrink: 0, fontSize: "6px" }}>●</span>
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, fontWeight: 300 }}>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div>
                  <ImageCarousel images={selectedProduct.images || (selectedProduct.image ? [selectedProduct.image] : [])} title={selectedProduct.title} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PROJECT POPUP ── */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(4,14,30,0.88)", backdropFilter: "blur(14px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
              style={{ width: "100%", maxWidth: "900px", maxHeight: "88vh", borderRadius: "18px", border: "1px solid rgba(245,158,11,0.28)", background: "rgba(4,14,30,0.98)", overflow: "hidden", display: "flex", flexDirection: "column" }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#fff" }}>{selectedProject.title}</h3>
                    <StatusBadge status={selectedProject.status} />
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                    <MetaPill icon={Users} value={selectedProject.clientName} tabId="projects" />
                    <MetaPill icon={MapPin} value={selectedProject.location} tabId="projects" />
                    <MetaPill icon={DollarSign} value={selectedProject.projectValue} tabId="projects" />
                    <MetaPill icon={Calendar} value={selectedProject.projectDate} tabId="projects" />
                  </div>
                  {normalizeExternalUrl(selectedProject.url) && (
                    <a
                      href={normalizeExternalUrl(selectedProject.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        marginTop: "10px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 12px",
                        borderRadius: "10px",
                        border: "1px solid rgba(245,158,11,0.35)",
                        background: "rgba(245,158,11,0.1)",
                        color: "#f59e0b",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "12px",
                        fontWeight: 600,
                        textDecoration: "none"
                      }}
                    >
                      <ExternalLink size={12} />
                      Visit Project URL
                    </a>
                  )}
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ overflowY: "auto", padding: "24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
                  <div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13.5px", color: "rgba(255,255,255,0.58)", lineHeight: 1.8, fontWeight: 300, whiteSpace: "pre-wrap", marginBottom: "14px" }}>
                      {canViewProjectDesc(selectedProject) ? selectedProject.description : "Description available to subscribers."}
                    </p>
                    {selectedProject.workDelivered && selectedProject.workDelivered !== "Not specified" && (
                      <div style={{ marginBottom: "14px", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                          <Briefcase size={12} style={{ color: "rgba(255,255,255,0.4)" }} />
                          <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>Work Delivered</p>
                        </div>
                        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, fontWeight: 300, whiteSpace: "pre-line" }}>{selectedProject.workDelivered}</p>
                      </div>
                    )}
                    {selectedProject.outcome && (
                      <div style={{ marginBottom: "14px", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
                        <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", marginBottom: "8px" }}>Outcome</p>
                        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, fontWeight: 300, whiteSpace: "pre-line" }}>{selectedProject.outcome}</p>
                      </div>
                    )}
                    {Array.isArray(selectedProject.keyFeatures) && selectedProject.keyFeatures.length > 0 && (
                      <div style={{ marginBottom: "14px", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                          <Award size={12} style={{ color: "rgba(255,255,255,0.4)" }} />
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Key Features</span>
                        </div>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                          {selectedProject.keyFeatures.map((f, fi) => (
                            <li key={fi} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                              <span style={{ color: "#10b981", marginTop: "5px", flexShrink: 0, fontSize: "6px" }}>●</span>
                              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: "rgba(255,255,255,0.55)", lineHeight: 1.65, fontWeight: 300 }}>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div>
                    <ImageCarousel images={selectedProject.images} title={selectedProject.title} />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SERVICE POPUP ── */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedService(null)}
            style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(4,14,30,0.88)", backdropFilter: "blur(14px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
              style={{ width: "100%", maxWidth: "900px", maxHeight: "88vh", borderRadius: "18px", border: "1px solid rgba(139,92,246,0.28)", background: "rgba(4,14,30,0.98)", overflow: "hidden", display: "flex", flexDirection: "column" }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#fff" }}>{selectedService.title}</h3>
                  {(selectedService.sector || selectedService.subsector) && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                      {selectedService.sector && <span style={{ padding: "3px 10px", borderRadius: "99px", fontSize: "11px", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", color: "#8b5cf6", fontFamily: "'DM Sans', sans-serif" }}>{selectedService.sector}</span>}
                      {selectedService.subsector && <span style={{ padding: "3px 10px", borderRadius: "99px", fontSize: "11px", background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.25)", color: "#8b5cf6", fontFamily: "'DM Sans', sans-serif" }}>{selectedService.subsector}</span>}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ overflowY: "auto", padding: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13.5px", color: "rgba(255,255,255,0.58)", lineHeight: 1.8, fontWeight: 300, whiteSpace: "pre-wrap", marginBottom: "20px" }}>
                    {selectedService.description}
                  </p>
                  {selectedService.features?.length > 0 && (
                    <div style={{ padding: "16px", borderRadius: "12px", border: "1px solid rgba(139,92,246,0.2)", background: "rgba(139,92,246,0.05)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                        <Award size={14} style={{ color: "#8b5cf6" }} />
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8b5cf6" }}>Key Features</span>
                      </div>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                        {selectedService.features.map((f, fi) => (
                          <li key={fi} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                            <span style={{ color: "#8b5cf6", marginTop: "5px", flexShrink: 0, fontSize: "6px" }}>●</span>
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, fontWeight: 300 }}>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div>
                  <ImageCarousel images={selectedService.images || (selectedService.image ? [selectedService.image] : [])} title={selectedService.title} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CASE STUDY POPUP ── */}
      <AnimatePresence>
        {selectedCaseStudy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCaseStudy(null)}
            style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(4,14,30,0.88)", backdropFilter: "blur(14px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
              style={{ width: "100%", maxWidth: "900px", maxHeight: "88vh", borderRadius: "18px", border: "1px solid rgba(236,72,153,0.28)", background: "rgba(4,14,30,0.98)", overflow: "hidden", display: "flex", flexDirection: "column" }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#fff" }}>{selectedCaseStudy.title}</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                    {selectedCaseStudy.clientName && <span style={{ padding: "3px 10px", borderRadius: "99px", fontSize: "11px", background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.3)", color: "#ec4899", fontFamily: "'DM Sans', sans-serif" }}>{selectedCaseStudy.clientName}</span>}
                    {selectedCaseStudy.location && <span style={{ padding: "3px 10px", borderRadius: "99px", fontSize: "11px", background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.25)", color: "#ec4899", fontFamily: "'DM Sans', sans-serif" }}>{selectedCaseStudy.location}</span>}
                  </div>
                  {normalizeExternalUrl(selectedCaseStudy.url) && (
                    <a
                      href={normalizeExternalUrl(selectedCaseStudy.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        marginTop: "10px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 12px",
                        borderRadius: "10px",
                        border: "1px solid rgba(236,72,153,0.35)",
                        background: "rgba(236,72,153,0.1)",
                        color: "#ec4899",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "12px",
                        fontWeight: 600,
                        textDecoration: "none"
                      }}
                    >
                      <ExternalLink size={12} />
                      Visit Case Study URL
                    </a>
                  )}
                </div>
                <button
                  onClick={() => setSelectedCaseStudy(null)}
                  style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ overflowY: "auto", padding: "24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
                  <div>
                    {/* Description */}
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13.5px", color: "rgba(255,255,255,0.58)", lineHeight: 1.8, fontWeight: 300, whiteSpace: "pre-wrap", marginBottom: "20px" }}>
                      {selectedCaseStudy.description}
                    </p>

                    {/* Key Features */}
                    {selectedCaseStudy.keyFeatures?.length > 0 && (
                      <div style={{ padding: "16px", borderRadius: "12px", border: "1px solid rgba(236,72,153,0.2)", background: "rgba(236,72,153,0.05)", marginBottom: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                          <Award size={14} style={{ color: "#ec4899" }} />
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#ec4899" }}>Key Features</span>
                        </div>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                          {selectedCaseStudy.keyFeatures.map((f, fi) => (
                            <li key={fi} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                              <span style={{ color: "#ec4899", marginTop: "5px", flexShrink: 0, fontSize: "6px" }}>●</span>
                              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, fontWeight: 300 }}>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Challenges */}
                    {selectedCaseStudy.challenges && (
                      <div style={{ padding: "14px", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)", marginBottom: "16px" }}>
                        <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#ef4444", fontFamily: "'DM Sans', sans-serif", marginBottom: "8px" }}>Challenges</p>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, fontWeight: 300, whiteSpace: "pre-wrap" }}>{selectedCaseStudy.challenges}</p>
                      </div>
                    )}

                    {/* Solution */}
                    {selectedCaseStudy.solution && (
                      <div style={{ padding: "14px", borderRadius: "10px", border: "1px solid rgba(59,130,246,0.2)", background: "rgba(59,130,246,0.05)", marginBottom: "16px" }}>
                        <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#3b82f6", fontFamily: "'DM Sans', sans-serif", marginBottom: "8px" }}>Solution</p>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, fontWeight: 300, whiteSpace: "pre-wrap" }}>{selectedCaseStudy.solution}</p>
                      </div>
                    )}

                    {/* Outcome */}
                    {selectedCaseStudy.outcome && (
                      <div style={{ padding: "14px", borderRadius: "10px", border: "1px solid rgba(16,185,129,0.2)", background: "rgba(16,185,129,0.05)", marginBottom: "16px" }}>
                        <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#10b981", fontFamily: "'DM Sans', sans-serif", marginBottom: "8px" }}>Outcome</p>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, fontWeight: 300, whiteSpace: "pre-wrap" }}>{selectedCaseStudy.outcome}</p>
                      </div>
                    )}

                    {/* Outcomes List */}
                    {selectedCaseStudy.outcomes?.length > 0 && (
                      <div style={{ padding: "16px", borderRadius: "12px", border: "1px solid rgba(236,72,153,0.2)", background: "rgba(236,72,153,0.05)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                          <CheckCircle size={14} style={{ color: "#ec4899" }} />
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#ec4899" }}>Outcomes</span>
                        </div>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                          {selectedCaseStudy.outcomes.map((o, oi) => (
                            <li key={oi} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                              <span style={{ color: "#ec4899", marginTop: "5px", flexShrink: 0, fontSize: "6px" }}>●</span>
                              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, fontWeight: 300 }}>{o}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div>
                    <ImageCarousel images={selectedCaseStudy.images} title={selectedCaseStudy.title} />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── INNOVATION POPUP ── */}
      <AnimatePresence>
        {selectedInnovation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedInnovation(null)}
            style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(4,14,30,0.88)", backdropFilter: "blur(14px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
              style={{ width: "100%", maxWidth: "900px", maxHeight: "88vh", borderRadius: "18px", border: "1px solid rgba(167,139,250,0.28)", background: "rgba(4,14,30,0.98)", overflow: "hidden", display: "flex", flexDirection: "column" }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#fff" }}>{selectedInnovation.title || selectedInnovation.name || "Innovation"}</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                    {selectedInnovation.type && <span style={{ padding: "3px 10px", borderRadius: "99px", fontSize: "11px", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.3)", color: "#a78bfa", fontFamily: "'DM Sans', sans-serif" }}>{selectedInnovation.type}</span>}
                    {selectedInnovation.status && <span style={{ padding: "3px 10px", borderRadius: "99px", fontSize: "11px", background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.25)", color: "#a78bfa", fontFamily: "'DM Sans', sans-serif" }}>{selectedInnovation.status}</span>}
                    {selectedInnovation.companyName && <span style={{ padding: "3px 10px", borderRadius: "99px", fontSize: "11px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.75)", fontFamily: "'DM Sans', sans-serif" }}>{selectedInnovation.companyName}</span>}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedInnovation(null)}
                  style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ overflowY: "auto", padding: "24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
                  <div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13.5px", color: "rgba(255,255,255,0.58)", lineHeight: 1.8, fontWeight: 300, whiteSpace: "pre-wrap", marginBottom: "20px" }}>
                      {selectedInnovation.description || "No description available."}
                    </p>

                    <div style={{ padding: "16px", borderRadius: "12px", border: "1px solid rgba(167,139,250,0.2)", background: "rgba(255,255,255,0.03)", marginBottom: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                        <Info size={14} style={{ color: "#a78bfa" }} />
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#a78bfa" }}>Innovation Details</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" }}>
                        {[
                          ["Company", selectedInnovation.companyName || selectedInnovation.company],
                          ["Category", selectedInnovation.category],
                          ["Type", selectedInnovation.type],
                          ["Status", selectedInnovation.status],
                        ].filter(([, value]) => Boolean(value)).map(([label, value]) => (
                          <div key={label} style={{ padding: "10px 12px", borderRadius: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginBottom: "4px" }}>{label}</div>
                            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: "rgba(255,255,255,0.82)", lineHeight: 1.5 }}>{value}</div>
                          </div>
                        ))}
                      </div>

                      {normalizeExternalUrl(selectedInnovation.link) && (
                        <div style={{ marginTop: "12px" }}>
                          <a
                            href={normalizeExternalUrl(selectedInnovation.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#a78bfa", textDecoration: "none" }}
                          >
                            <ExternalLink size={12} />
                            Open Innovation Link
                          </a>
                        </div>
                      )}
                    </div>

                    {selectedInnovation.keyFeatures?.filter(Boolean)?.length > 0 && (
                      <div style={{ padding: "16px", borderRadius: "12px", border: "1px solid rgba(167,139,250,0.2)", background: "rgba(167,139,250,0.05)", marginBottom: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                          <Award size={14} style={{ color: "#a78bfa" }} />
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#a78bfa" }}>Key Features</span>
                        </div>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                          {selectedInnovation.keyFeatures.filter(Boolean).map((f, fi) => (
                            <li key={fi} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                              <span style={{ color: "#a78bfa", marginTop: "5px", flexShrink: 0, fontSize: "6px" }}>●</span>
                              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, fontWeight: 300 }}>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {Array.isArray(selectedInnovation.productsServices) && selectedInnovation.productsServices.filter(Boolean).length > 0 && (
                      <div style={{ padding: "16px", borderRadius: "12px", border: "1px solid rgba(167,139,250,0.2)", background: "rgba(167,139,250,0.04)", marginBottom: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                          <Package size={14} style={{ color: "#a78bfa" }} />
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#a78bfa" }}>Products & Services</span>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          {selectedInnovation.productsServices.filter(Boolean).map((item, index) => (
                            <span key={`${item}-${index}`} style={{ padding: "6px 10px", borderRadius: "99px", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <ImageCarousel images={selectedInnovation.images || (selectedInnovation.image ? [selectedInnovation.image] : [])} title={selectedInnovation.title || selectedInnovation.name || "Innovation"} />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DynamicCompanyPage;

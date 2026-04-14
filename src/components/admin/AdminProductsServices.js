import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check, X, Package, Wrench, Briefcase, Landmark, Leaf, Zap,
  Building2, ChevronDown, Plus, Trash2, Info, ArrowRight, Upload,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollingBanner from "../home/ScrollingBanner";
import { useAuth } from "../../contexts/AuthContext";
import {
  getAllCompanies, getCompanyById, addCompanyProductService,
  deleteCompanyProductService, updateCompanyProductService,
} from "../../utils/companiesAPI";

/* ─────────────────────────────────────────────────────────────
   DESIGN TOKENS & SHARED COMPONENTS
───────────────────────────────────────────────────────────── */
const fieldBase = {
  width: "100%",
  padding: "10px 14px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: "10px",
  color: "#ffffff",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "13px",
  fontWeight: 300,
  outline: "none",
  transition: "border-color 0.2s, background 0.2s",
};
const onFocus = (e) => {
  e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)";
  e.currentTarget.style.background = "rgba(16,185,129,0.04)";
};
const onBlur = (e) => {
  e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
};

const Label = ({ children, required }) => (
  <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "8px" }}>
    {children}{required && <span style={{ color: "#ef4444", marginLeft: "2px" }}>*</span>}
  </label>
);

const GlassCard = ({ children, accentRgb, style = {} }) => (
  <div style={{
    background: "rgba(255,255,255,0.025)",
    border: `1px solid ${accentRgb ? `rgba(${accentRgb},0.16)` : "rgba(255,255,255,0.07)"}`,
    borderRadius: "18px",
    ...style,
  }}>
    {children}
  </div>
);

const CardHeader = ({ icon, label, accentRgb = "16,185,129" }) => (
  <div style={{ padding: "18px 22px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: "12px" }}>
    <div style={{ width: "30px", height: "30px", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", background: `rgba(${accentRgb},0.1)`, border: `1px solid rgba(${accentRgb},0.25)`, flexShrink: 0 }}>
      {icon}
    </div>
    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "15px", fontWeight: 700, color: "#ffffff" }}>{label}</span>
  </div>
);

const FileTextIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" x2="8" y1="13" y2="13"/>
    <line x1="16" x2="8" y1="17" y2="17"/>
    <line x1="10" x2="8" y1="9" y2="9"/>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
const AdminProductsServices = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loadingCompany, setLoadingCompany] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showSectorModal, setShowSectorModal] = useState(false);
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [selectedSubsectors, setSelectedSubsectors] = useState({}); // { sectorId: [subsector1, subsector2, ...] }
  const [selectedServiceCategories, setSelectedServiceCategories] = useState({});
  const [formData, setFormData] = useState({ type: "product", title: "", description: "", features: [""], images: [] });

  const renewableEnergyServiceCategories = ["Hardware/Product Suppliers", "Service & Solutions", "Associated Services"];

  const sectorConfig = useMemo(() => [
    { id: "renewable-energy",         label: "Renewable Energy",            icon: Zap,       rgb: "16,185,129",  subsectors: ["Solar PV", "Battery storage", "EV Charging", "Wind Power", "Heat Pump Technology", "LED Lighting", "Additional Products"] },
    { id: "sustainable-esg-netzero",  label: "Sustainable / ESG / Net Zero", icon: Leaf,      rgb: "20,184,166",  subsectors: ["Hardware Products & Solutions", "Sustainable & ESG Services", "Net Zero/Carbon Industry"] },
    { id: "energy-management",        label: "Energy Management",           icon: Package,   rgb: "6,182,212",   subsectors: [] },
    { id: "company-wellness",         label: "Company Wellness",            icon: Package,   rgb: "139,92,246",  subsectors: [] },
    { id: "it-related-services",      label: "IT Related Services",         icon: Wrench,    rgb: "59,130,246",  subsectors: ["Cloud Solutions & IoT", "Cybersecurity & Infrastructure", "Managed IT Services"] },
    { id: "jobs-recruitment",         label: "Jobs & Recruitment",          icon: Briefcase, rgb: "245,158,11",  subsectors: ["Internal Company Vacancies", "Recruitment Agencies - Job Vacancies"] },
    { id: "finance-funding",          label: "Finance & Funding",           icon: Landmark,  rgb: "236,72,153",  subsectors: [] },
    { id: "eco-friendly-passivhaus",  label: "Eco Friendly / Passivhaus",   icon: Leaf,      rgb: "34,197,94",   subsectors: [] },
    { id: "utility-provision-civils", label: "Utility Provision & Civils",  icon: Building2, rgb: "251,146,60",  subsectors: ["Utility Providers", "Civils & Infrastructure"] },
    { id: "commercial-retail",        label: "Commercial / Retail",         icon: Building2, rgb: "59,130,246",  subsectors: ["Battery Storage - Large Scale", "Carbon Management", "Commercial / Retail", "Energy Efficiency", "Energy Management", "HVAC", "Lean Management", "LED Lighting"] },
  ], []);

  const plan = String(selectedCompany?.subscription?.plan?.name || selectedCompany?.subscription?.plan?.id || selectedCompany?.subscription?.plan || "premium").toLowerCase();
  const maxItems = plan === "elite" ? 6 : 3;
  const maxImagesPerItem = plan === "elite" ? 6 : 3;
  const MAX_IMAGE_SIZE_BYTES = 3 * 1024 * 1024;
  const existingItems = selectedCompany?.tabs?.productsServices?.items || [];

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") return;
    const run = async () => {
      setLoadingCompanies(true); setError("");
      try {
        const res = await getAllCompanies();
        if (!res.success) { setError(res.error || "Failed to load companies"); setCompanies([]); return; }
        setCompanies(Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : []);
      } finally { setLoadingCompanies(false); }
    };
    run();
  }, [isAuthenticated, user?.role]);

  useEffect(() => {
    if (!selectedCompanyId) { setSelectedCompany(null); return; }
    const run = async () => {
      setLoadingCompany(true); setError("");
      try {
        const res = await getCompanyById(selectedCompanyId);
        if (!res.success) { setError(res.error || "Failed to load company"); setSelectedCompany(null); return; }
        setSelectedCompany(res.data?.data || res.data);
      } finally { setLoadingCompany(false); }
    };
    run();
  }, [selectedCompanyId]);

  const resetForm = () => { setSelectedSectors([]); setSelectedSubsectors({}); setSelectedServiceCategories({}); setFormData({ type: "product", title: "", description: "", features: [""], images: [] }); };

  const handleFeatureChange = (idx, val) => setFormData(p => { const n = [...p.features]; n[idx] = val; return { ...p, features: n }; });
  const addFeatureRow = () => setFormData(p => ({ ...p, features: [...p.features, ""] }));
  const removeFeatureRow = (idx) => setFormData(p => { const n = p.features.filter((_, i) => i !== idx); return { ...p, features: n.length ? n : [""] }; });

  const handleImagesSelect = (files) => {
    const picked = Array.from(files || []);
    const filtered = picked.filter(f => f?.type?.startsWith("image/") && f.size <= MAX_IMAGE_SIZE_BYTES);
    if (filtered.length !== picked.length) alert("Some files skipped — images only, max 3MB each.");
    const combined = [...(formData.images || []), ...filtered];
    if (combined.length > maxImagesPerItem) {
      alert(`Max ${maxImagesPerItem} images allowed.`);
      setFormData(p => ({ ...p, images: combined.slice(0, maxImagesPerItem) }));
    } else {
      setFormData(p => ({ ...p, images: combined }));
    }
  };
  const removeImage = (idx) => setFormData(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));

  const validate = () => {
    if (!selectedCompanyId) return "Please select a company";
    if (!selectedSectors.length) return "Please select at least one sector";
    for (const sectorId of selectedSectors) {
      const s = sectorConfig.find(s => s.id === sectorId);
      const subsectorsForSector = selectedSubsectors[sectorId] || [];
      if (s?.subsectors?.length && !subsectorsForSector.length) return `Please select at least one subsector for ${s.label}`;
      if (sectorId === "renewable-energy" && subsectorsForSector.length > 0 && !selectedServiceCategories[sectorId]) return `Please select a service category for ${s.label}`;
    }
    if (!formData.title.trim()) return "Title is required";
    if (!formData.description.trim()) return "Description is required";
    if (!(formData.features || []).map(f => f.trim()).filter(Boolean).length) return "Add at least one key feature";
    if ((existingItems || []).length >= maxItems) return `Plan limit: ${plan} allows up to ${maxItems} items.`;
    if ((formData.images || []).length > maxImagesPerItem) return `Max ${maxImagesPerItem} images per item.`;
    return "";
  };

  const handleSubmit = async () => {
    setError(""); setSuccessMessage("");
    const msg = validate(); if (msg) { setError(msg); return; }
    setSubmitting(true);
    try {
      const features = (formData.features || []).map(f => f.trim()).filter(Boolean);
      let successCount = 0;
      let errorCount = 0;
      
      // Add to each selected sector
      for (const sectorId of selectedSectors) {
        const sector = sectorConfig.find(s => s.id === sectorId);
        try {
          const res = await addCompanyProductService(selectedCompanyId, { 
            type: formData.type, 
            title: formData.title.trim(), 
            description: formData.description.trim(), 
            features, 
            sector: sector?.label || sectorId, 
            subsector: selectedSubsectors[sectorId] || "", 
            serviceCategory: selectedServiceCategories[sectorId] || "", 
            images: formData.images 
          });
          if (res.success) successCount++;
          else errorCount++;
        } catch (e) {
          errorCount++;
        }
      }
      
      const refreshed = await getCompanyById(selectedCompanyId);
      if (refreshed.success) setSelectedCompany(refreshed.data?.data || refreshed.data);
      
      if (errorCount === 0) {
        setSuccessMessage(`Added successfully to ${successCount} sector${successCount !== 1 ? 's' : ''}`);
      } else if (successCount > 0) {
        setSuccessMessage(`Added to ${successCount} sector${successCount !== 1 ? 's' : ''}, failed for ${errorCount}`);
      } else {
        setError("Failed to add to all sectors");
      }
      resetForm();
    } finally { setSubmitting(false); }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ type: item.type || "product", title: item.title || "", description: item.description || "", features: item.features?.length ? item.features : [""], images: [] });
    const s = sectorConfig.find(s => s.label === item.sector || s.id === item.sector);
    if (s) { 
      setSelectedSectors([s.id]); 
      setSelectedSubsectors({ [s.id]: item.subsector ? [item.subsector] : [] }); 
      setSelectedServiceCategories({ [s.id]: item.serviceCategory || "" }); 
    }
    else { setSelectedSectors([]); setSelectedSubsectors({}); setSelectedServiceCategories({}); }
  };

  const handleUpdate = async () => {
    setError(""); setSuccessMessage("");
    if (!editingItem) return;
    if (!formData.title.trim()) { setError("Title is required"); return; }
    if (!formData.description.trim()) { setError("Description is required"); return; }
    const features = (formData.features || []).map(f => f.trim()).filter(Boolean);
    if (!features.length) { setError("Add at least one key feature"); return; }
    setSubmitting(true);
    try {
      const sectorId = selectedSectors[0];
      const sector = sectorConfig.find(s => s.id === sectorId);
      const res = await updateCompanyProductService(selectedCompanyId, editingItem.id, { 
        type: formData.type, 
        title: formData.title.trim(), 
        description: formData.description.trim(), 
        features, 
        sector: sector?.label || sectorId, 
        subsector: selectedSubsectors[sectorId] || "", 
        serviceCategory: selectedServiceCategories[sectorId] || "", 
        images: formData.images, 
        existingImages: editingItem.images || [] 
      });
      if (!res.success) { setError(res.error || res.message || "Failed to update"); return; }
      const refreshed = await getCompanyById(selectedCompanyId);
      if (refreshed.success) setSelectedCompany(refreshed.data?.data || refreshed.data);
      setSuccessMessage("Updated successfully"); setEditingItem(null); resetForm();
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (itemId) => {
    setError(""); setSuccessMessage("");
    const res = await deleteCompanyProductService(selectedCompanyId, itemId);
    if (!res.success) { setError(res.error || res.message || "Failed to delete"); return; }
    const refreshed = await getCompanyById(selectedCompanyId);
    if (refreshed.success) setSelectedCompany(refreshed.data?.data || refreshed.data);
    setSuccessMessage("Deleted"); setShowDeleteConfirm(null);
  };

  const cancelEdit = () => { setEditingItem(null); resetForm(); };

  /* ── ACCESS DENIED ── */
  if (!isAuthenticated || user?.role !== "admin") return (
    <div style={{ minHeight: "100vh", background: "#040e1e", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <GlassCard style={{ maxWidth: "380px", width: "100%", textAlign: "center" }}>
        <div style={{ padding: "48px 32px" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <X size={20} color="#ef4444" />
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>Access Denied</h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.45)", fontWeight: 300, marginBottom: "28px" }}>Admin privileges required.</p>
          <button onClick={() => navigate("/")} style={{ width: "100%", padding: "11px", borderRadius: "12px", background: "#10b981", border: "none", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Go Home</button>
        </div>
      </GlassCard>
    </div>
  );

  /* ── MAIN RENDER ── */
  return (
    <div style={{ minHeight: "100vh", background: "#040e1e", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        ::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.35); border-radius: 99px; }
        ::placeholder { color: rgba(255,255,255,0.22) !important; }
        option { background: #040e1e; }
        textarea { resize: vertical; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Ambient glows */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-160px", left: "30%", width: "600px", height: "500px", borderRadius: "50%", background: "radial-gradient(ellipse, #10b981, transparent 65%)", opacity: 0.04 }} />
        <div style={{ position: "absolute", bottom: "-160px", right: "20%", width: "500px", height: "400px", borderRadius: "50%", background: "radial-gradient(ellipse, #06b6d4, transparent 65%)", opacity: 0.03 }} />
      </div>

      {/* ScrollingBanner pinned to very top */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}>
        <ScrollingBanner />
      </div>

      {/* Page content — paddingTop clears ScrollingBanner + navbar + breathing room */}
      <div style={{ position: "relative", zIndex: 10, maxWidth: "1280px", margin: "0 auto", padding: "172px 40px 80px" }}>

        {/* ── PAGE HEADER ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "40px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "20px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ height: "1px", width: "40px", background: "#10b981" }} />
                <span style={{ fontSize: "11px", letterSpacing: "0.22em", color: "#10b981", textTransform: "uppercase", fontWeight: 500 }}>Admin Portal</span>
              </div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.9rem, 4vw, 2.9rem)", fontWeight: 700, color: "#fff", lineHeight: 1.08, letterSpacing: "-0.02em", marginBottom: "6px" }}>
                {editingItem ? "Edit" : "Add"}{" "}
                <span style={{ background: "linear-gradient(90deg, #10b981, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Product or Service
                </span>
              </h1>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>Manage offerings for registered companies</p>
            </div>
            <button onClick={() => navigate("/admin/dashboard")}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", fontWeight: 500, cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; }}>
              <ArrowRight size={13} style={{ transform: "rotate(180deg)" }} />
              Back to Dashboard
            </button>
          </div>
        </motion.div>

        {/* ── NOTIFICATIONS ── */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "13px 18px", borderRadius: "12px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.22)", color: "#ef4444", marginBottom: "20px" }}>
              <X size={13} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: "13px", fontWeight: 300 }}>{error}</span>
            </motion.div>
          )}
          {successMessage && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "13px 18px", borderRadius: "12px", background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.22)", color: "#10b981", marginBottom: "20px" }}>
              <Check size={13} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: "13px", fontWeight: 300 }}>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 3-COL GRID ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }} className="lg:grid-cols-3 grid-cols-1">

          {/* LEFT: Config */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Company card */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <GlassCard accentRgb="16,185,129">
                <CardHeader icon={<Building2 size={13} color="#10b981" />} label="Target Company" accentRgb="16,185,129" />
                <div style={{ padding: "20px" }}>
                  <Label>Select Company</Label>
                  <div style={{ position: "relative" }}>
                    <select value={selectedCompanyId} onChange={e => { setSelectedCompanyId(e.target.value); resetForm(); }} disabled={loadingCompanies}
                      style={{ ...fieldBase, appearance: "none", paddingRight: "32px", cursor: "pointer" }} onFocus={onFocus} onBlur={onBlur}>
                      <option value="">{loadingCompanies ? "Loading…" : "Choose a company…"}</option>
                      {companies.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                    </select>
                    <ChevronDown size={11} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
                  </div>

                  <AnimatePresence>
                    {selectedCompany && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ marginTop: "16px", padding: "14px 16px", borderRadius: "12px", background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.18)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>Plan</span>
                          <span style={{ padding: "2px 9px", borderRadius: "99px", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", fontSize: "9.5px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#10b981" }}>{plan}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.4)" }}>Items Used</span>
                          <span style={{ fontSize: "11.5px", fontWeight: 500, color: existingItems.length >= maxItems ? "#ef4444" : "#fff" }}>{existingItems.length} / {maxItems}</span>
                        </div>
                        <div style={{ height: "3px", borderRadius: "99px", background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                          <div style={{ height: "100%", borderRadius: "99px", width: `${Math.min((existingItems.length / maxItems) * 100, 100)}%`, background: existingItems.length >= maxItems ? "#ef4444" : "#10b981", transition: "width 0.4s" }} />
                        </div>
                        <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.28)", marginTop: "6px" }}>Max {maxImagesPerItem} images per item</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </GlassCard>
            </motion.div>

            {/* Classification card */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
              <GlassCard accentRgb="6,182,212">
                <CardHeader icon={<Package size={13} color="#06b6d4" />} label="Classification" accentRgb="6,182,212" />
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "18px" }}>
                  {/* Type toggle */}
                  <div>
                    <Label>Type</Label>
                    <div style={{ display: "flex", gap: "4px", padding: "4px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px" }}>
                      {["product", "service"].map(t => (
                        <button key={t} type="button" onClick={() => setFormData(p => ({ ...p, type: t }))}
                          style={{ flex: 1, padding: "8px 0", borderRadius: "9px", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 600, textTransform: "capitalize", background: formData.type === t ? "#10b981" : "transparent", color: formData.type === t ? "#fff" : "rgba(255,255,255,0.4)", boxShadow: formData.type === t ? "0 0 16px rgba(16,185,129,0.3)" : "none", transition: "all 0.2s" }}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Sector */}
                  <div>
                    <Label>Sector{selectedSectors.length > 1 ? 's' : ''} <span style={{ color: "rgba(255,255,255,0.25)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>({selectedSectors.length} selected)</span></Label>
                    <button type="button" onClick={() => setShowSectorModal(true)}
                      style={{ width: "100%", textAlign: "left", padding: "10px 14px", borderRadius: "10px", cursor: "pointer", background: selectedSectors.length ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${selectedSectors.length ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.09)"}`, transition: "all 0.2s" }}
                      onMouseEnter={e => { if (!selectedSectors.length) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                      onMouseLeave={e => { if (!selectedSectors.length) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "13px", fontWeight: 300, color: selectedSectors.length ? "#10b981" : "rgba(255,255,255,0.32)" }}>
                          {selectedSectors.length 
                            ? selectedSectors.map(id => sectorConfig.find(s => s.id === id)?.label).join(", ")
                            : "Select sector(s)…"}
                        </span>
                        <ChevronDown size={11} style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
                      </div>
                      {selectedSectors.length > 0 && (
                        <div style={{ marginTop: "8px", display: "flex", flexWrap: "wrap", gap: "4px" }}>
                          {selectedSectors.map(sectorId => {
                            const s = sectorConfig.find(s => s.id === sectorId);
                            if (!s) return null;
                            const subsectors = selectedSubsectors[sectorId] || [];
                            return (
                              <span key={sectorId} style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", background: "rgba(16,185,129,0.1)", padding: "2px 6px", borderRadius: "4px" }}>
                                {s?.label}
                                {subsectors.length > 0 && ` › ${subsectors.join(", ")}`}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* RIGHT: Form (2 cols) */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} style={{ gridColumn: "span 2" }}>
            <GlassCard accentRgb="139,92,246">
              <CardHeader icon={<FileTextIcon size={13} color="#8b5cf6" />} label={`${formData.type === "product" ? "Product" : "Service"} Details`} accentRgb="139,92,246" />
              {editingItem && (
                <div style={{ padding: "10px 22px 0" }}>
                  <span style={{ display: "inline-block", padding: "2px 9px", borderRadius: "99px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", fontSize: "10px", color: "#f59e0b", fontWeight: 600 }}>Editing Entry</span>
                </div>
              )}

              <div style={{ padding: "22px", display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Title */}
                <div>
                  <Label required>Title</Label>
                  <input type="text" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                    placeholder={formData.type === "product" ? "e.g. Solar Panel X2000" : "e.g. Installation Service"}
                    style={fieldBase} onFocus={onFocus} onBlur={onBlur} />
                </div>

                {/* Description */}
                <div>
                  <Label required>Description</Label>
                  <textarea rows={5} value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                    placeholder="Describe the key benefits and specifications…"
                    style={{ ...fieldBase, minHeight: "110px" }} onFocus={onFocus} onBlur={onBlur} />
                </div>

                {/* Features */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <Label required>Key Features</Label>
                    <button type="button" onClick={addFeatureRow}
                      style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, color: "#10b981", background: "none", border: "none", cursor: "pointer" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#34d399"}
                      onMouseLeave={e => e.currentTarget.style.color = "#10b981"}>
                      <Plus size={10} /> Add Feature
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {formData.features.map((feature, idx) => (
                      <div key={idx} style={{ display: "flex", gap: "8px" }}>
                        <div style={{ position: "relative", flex: 1 }}>
                          <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "5px", height: "5px", borderRadius: "50%", background: "rgba(16,185,129,0.5)" }} />
                          <input type="text" value={feature} onChange={e => handleFeatureChange(idx, e.target.value)}
                            placeholder={`Feature ${idx + 1}`}
                            style={{ ...fieldBase, paddingLeft: "26px" }} onFocus={onFocus} onBlur={onBlur} />
                        </div>
                        {formData.features.length > 1 && (
                          <button type="button" onClick={() => removeFeatureRow(idx)}
                            style={{ width: "36px", height: "36px", borderRadius: "9px", border: "1px solid rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; }}>
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Images */}
                <div>
                  <Label>Images (Max {maxImagesPerItem})</Label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(76px, 1fr))", gap: "10px" }}>
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="group relative rounded-xl overflow-hidden" style={{ aspectRatio: "1", border: "1px solid rgba(255,255,255,0.09)" }}>
                        <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.55)" }}>
                          <button type="button" onClick={() => removeImage(idx)}
                            style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(239,68,68,0.9)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {formData.images.length < maxImagesPerItem && (
                      <label className="group relative rounded-xl flex flex-col items-center justify-center cursor-pointer"
                        style={{ aspectRatio: "1", border: "2px dashed rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)", transition: "all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)"; e.currentTarget.style.background = "rgba(16,185,129,0.04)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}>
                        <input type="file" accept="image/*" multiple onChange={e => handleImagesSelect(e.target.files)} className="hidden" />
                        <Upload size={14} style={{ color: "rgba(255,255,255,0.28)", marginBottom: "3px" }} />
                        <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.28)", fontFamily: "'DM Sans', sans-serif" }}>Upload</span>
                      </label>
                    )}
                  </div>
                  <p style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "rgba(255,255,255,0.28)", marginTop: "6px" }}>
                    <Info size={9} /> JPG, PNG, WebP — max 3MB each
                  </p>
                </div>

                {/* Submit */}
                <div style={{ display: "flex", gap: "10px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                  {editingItem && (
                    <button type="button" onClick={cancelEdit} disabled={submitting}
                      style={{ padding: "10px 20px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", cursor: "pointer" }}>
                      Cancel
                    </button>
                  )}
                  <motion.button type="button" onClick={editingItem ? handleUpdate : handleSubmit}
                    disabled={submitting || !selectedCompanyId}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px", borderRadius: "12px", border: "none", cursor: (submitting || !selectedCompanyId) ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, background: (submitting || !selectedCompanyId) ? "rgba(255,255,255,0.05)" : "#10b981", color: (submitting || !selectedCompanyId) ? "rgba(255,255,255,0.3)" : "#fff", boxShadow: (submitting || !selectedCompanyId) ? "none" : "0 0 24px rgba(16,185,129,0.3)" }}
                    whileHover={(!submitting && selectedCompanyId) ? { scale: 1.015 } : {}}
                    whileTap={(!submitting && selectedCompanyId) ? { scale: 0.985 } : {}}>
                    {submitting ? (
                      <><div style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.25)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />{editingItem ? "Updating…" : "Saving…"}</>
                    ) : (
                      <><Check size={13} />{editingItem ? "Update" : "Add"} {formData.type === "product" ? "Product" : "Service"}</>
                    )}
                  </motion.button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* ── EXISTING ITEMS ── */}
        {selectedCompany && existingItems.length > 0 && (
          <div style={{ marginTop: "60px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
              <div style={{ height: "1px", width: "32px", background: "rgba(255,255,255,0.1)" }} />
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "17px", color: "rgba(255,255,255,0.38)", fontStyle: "italic", whiteSpace: "nowrap" }}>Existing Items</p>
              <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.1)" }} />
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)", whiteSpace: "nowrap" }}>{existingItems.length} item{existingItems.length !== 1 ? "s" : ""}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
              {existingItems.map((item, index) => {
                const sObj = sectorConfig.find(s => s.label === item.sector || s.id === item.sector);
                const typeRgb = item.type === "product" ? "16,185,129" : "6,182,212";
                return (
                  <motion.div key={item.id || index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}>
                    <div className="group" style={{ borderRadius: "18px", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.025)", overflow: "hidden", transition: "all 0.3s", height: "100%" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${typeRgb},0.28)`; e.currentTarget.style.background = `rgba(${typeRgb},0.04)`; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.025)"; }}>

                      {/* top accent */}
                      <div style={{ height: "2px", background: `linear-gradient(90deg, transparent, rgba(${typeRgb},0.7), transparent)` }} />

                      {/* image */}
                      <div style={{ height: "130px", overflow: "hidden", position: "relative" }}>
                        {item.images?.length ? (
                          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: `rgba(${typeRgb},0.06)` }}>
                            <Package size={26} style={{ color: "rgba(255,255,255,0.18)" }} />
                          </div>
                        )}
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(4,14,30,0.85) 100%)" }} />
                        <div style={{ position: "absolute", top: "10px", left: "10px", padding: "2px 9px", borderRadius: "99px", background: `rgba(${typeRgb},0.85)`, fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#fff" }}>{item.type}</div>
                      </div>

                      {/* content */}
                      <div style={{ padding: "14px 16px" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</h3>
                        <p style={{ fontSize: "10.5px", color: `rgb(${typeRgb})`, marginBottom: "8px" }}>{item.sector}{item.subsector ? ` · ${item.subsector}` : ""}{item.serviceCategory ? ` · ${item.serviceCategory}` : ""}</p>
                        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.42)", lineHeight: 1.65, fontWeight: 300, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", marginBottom: "12px" }}>{item.description}</p>

                        {item.features?.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "14px" }}>
                            {item.features.slice(0, 3).map((f, i) => (
                              <span key={i} style={{ padding: "2px 8px", borderRadius: "99px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>{f}</span>
                            ))}
                            {item.features.length > 3 && (
                              <span style={{ padding: "2px 8px", borderRadius: "99px", fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>+{item.features.length - 3}</span>
                            )}
                          </div>
                        )}

                        <div style={{ display: "flex", gap: "8px" }}>
                          <button onClick={() => handleEdit(item)} disabled={editingItem?.id === item.id}
                            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", padding: "7px 0", borderRadius: "10px", border: "1px solid rgba(59,130,246,0.25)", background: "rgba(59,130,246,0.08)", color: "#3b82f6", fontFamily: "'DM Sans', sans-serif", fontSize: "11.5px", fontWeight: 500, cursor: editingItem?.id === item.id ? "not-allowed" : "pointer", opacity: editingItem?.id === item.id ? 0.45 : 1, transition: "all 0.15s" }}
                            onMouseEnter={e => { if (editingItem?.id !== item.id) e.currentTarget.style.background = "rgba(59,130,246,0.16)"; }}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(59,130,246,0.08)"}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            Edit
                          </button>
                          <button onClick={() => setShowDeleteConfirm(item.id)}
                            style={{ width: "34px", height: "34px", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.22)", background: "rgba(239,68,68,0.07)", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.16)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.07)"}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── DELETE MODAL ── */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", background: "rgba(4,14,30,0.88)", backdropFilter: "blur(14px)" }}
            onClick={() => setShowDeleteConfirm(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.94, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94 }}
              onClick={e => e.stopPropagation()}
              style={{ width: "100%", maxWidth: "400px", background: "rgba(4,14,30,0.98)", border: "1px solid rgba(239,68,68,0.22)", borderRadius: "20px", padding: "40px 32px", textAlign: "center", boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                <Trash2 size={18} color="#ef4444" />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>Delete Item?</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.45)", fontWeight: 300, marginBottom: "28px" }}>This action cannot be undone.</p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setShowDeleteConfirm(null)} style={{ flex: 1, padding: "10px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
                <button onClick={() => handleDelete(showDeleteConfirm)} style={{ flex: 1, padding: "10px", borderRadius: "12px", background: "#ef4444", border: "none", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SECTOR MODAL ── */}
      <AnimatePresence>
        {showSectorModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", background: "rgba(4,14,30,0.88)", backdropFilter: "blur(14px)" }}
            onClick={() => setShowSectorModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.94, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94 }}
              onClick={e => e.stopPropagation()}
              style={{ width: "100%", maxWidth: "760px", maxHeight: "88vh", background: "rgba(4,14,30,0.98)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "22px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 40px 100px rgba(0,0,0,0.65)" }}>

              <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #10b981, transparent)", flexShrink: 0 }} />

              {/* header */}
              <div style={{ padding: "22px 26px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0 }}>
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#10b981", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, marginBottom: "4px" }}>Classification</p>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>Select Sector</h3>
                </div>
                <button onClick={() => setShowSectorModal(false)}
                  style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)"; e.currentTarget.style.color = "#10b981"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}>
                  <X size={13} />
                </button>
              </div>

              {/* grid */}
              <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "12px", scrollbarWidth: "thin", scrollbarColor: "rgba(16,185,129,0.4) rgba(255,255,255,0.02)" }}>
                {sectorConfig.map(s => {
                  const Icon = s.icon;
                  const isSel = selectedSectors.includes(s.id);
                  const hasSubsectors = s.subsectors?.length > 0;
                  return (
                    <div key={s.id} style={{ borderRadius: "14px", border: `1px solid ${isSel ? `rgba(${s.rgb},0.35)` : "rgba(255,255,255,0.07)"}`, background: isSel ? `rgba(${s.rgb},0.07)` : "rgba(255,255,255,0.025)", transition: "all 0.2s" }}>
                      {/* Checkbox header */}
                      <button type="button" onClick={() => {
                        if (isSel) {
                          setSelectedSectors(prev => prev.filter(id => id !== s.id));
                          setSelectedSubsectors(prev => { const n = { ...prev }; delete n[s.id]; return n; });
                          setSelectedServiceCategories(prev => { const n = { ...prev }; delete n[s.id]; return n; });
                        } else {
                          setSelectedSectors(prev => [...prev, s.id]);
                        }
                      }}
                        style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "flex-start", gap: "12px", padding: "14px 16px", background: "none", border: "none", cursor: "pointer" }}>
                        {/* Checkbox */}
                        <div style={{ width: "20px", height: "20px", borderRadius: "6px", border: `2px solid ${isSel ? `rgb(${s.rgb})` : "rgba(255,255,255,0.25)"}`, background: isSel ? `rgba(${s.rgb},0.2)` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "8px" }}>
                          {isSel && <Check size={12} style={{ color: `rgb(${s.rgb})` }} />}
                        </div>
                        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: isSel ? `rgba(${s.rgb},0.2)` : "rgba(255,255,255,0.05)", border: `1px solid ${isSel ? `rgba(${s.rgb},0.4)` : "rgba(255,255,255,0.08)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                          <Icon size={15} style={{ color: isSel ? `rgb(${s.rgb})` : "rgba(255,255,255,0.45)" }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 500, color: isSel ? "#fff" : "rgba(255,255,255,0.7)", marginBottom: "2px" }}>{s.label}</p>
                          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{s.subsectors?.length ? `${s.subsectors.length} subsectors` : "No subsectors"}</p>
                        </div>
                      </button>

                      <AnimatePresence>
                        {isSel && hasSubsectors && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
                            <div style={{ padding: "10px 16px 14px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                              {/* Subsector Select All */}
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const currentSubsectors = selectedSubsectors[s.id] || [];
                                    const allSelected = s.subsectors.every(sub => currentSubsectors.includes(sub));
                                    if (allSelected) {
                                      setSelectedSubsectors(prev => { const n = { ...prev }; delete n[s.id]; return n; });
                                      setSelectedServiceCategories(prev => { const n = { ...prev }; delete n[s.id]; return n; });
                                    } else {
                                      setSelectedSubsectors(prev => ({ ...prev, [s.id]: [...s.subsectors] }));
                                    }
                                  }}
                                  style={{ 
                                    width: "14px", 
                                    height: "14px", 
                                    borderRadius: "3px", 
                                    border: `1.5px solid ${(selectedSubsectors[s.id] || []).length === s.subsectors.length ? `rgb(${s.rgb})` : "rgba(255,255,255,0.3)"}`, 
                                    background: (selectedSubsectors[s.id] || []).length === s.subsectors.length ? `rgba(${s.rgb},0.2)` : "transparent",
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "center",
                                    cursor: "pointer"
                                  }}
                                >
                                  {(selectedSubsectors[s.id] || []).length === s.subsectors.length && <Check size={9} style={{ color: `rgb(${s.rgb})` }} />}
                                </button>
                                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9.5px", color: `rgb(${s.rgb})`, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>Subsector <span style={{ color: "rgba(255,255,255,0.4)" }}>({selectedSubsectors[s.id]?.length || 0}/{s.subsectors.length})</span></span>
                              </div>
                              
                              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                {s.subsectors.map(sub => {
                                  const isSubSelected = (selectedSubsectors[s.id] || []).includes(sub);
                                  const toggleSubsector = () => {
                                    const currentSubsectors = selectedSubsectors[s.id] || [];
                                    if (isSubSelected) {
                                      const newSubsectors = currentSubsectors.filter(s => s !== sub);
                                      if (newSubsectors.length === 0) {
                                        setSelectedSubsectors(prev => { const n = { ...prev }; delete n[s.id]; return n; });
                                        setSelectedServiceCategories(prev => { const n = { ...prev }; delete n[s.id]; return n; });
                                      } else {
                                        setSelectedSubsectors(prev => ({ ...prev, [s.id]: newSubsectors }));
                                      }
                                    } else {
                                      setSelectedSubsectors(prev => ({ ...prev, [s.id]: [...currentSubsectors, sub] }));
                                    }
                                  };
                                  return (
                                    <button key={sub} type="button" onClick={toggleSubsector}
                                      style={{ padding: "4px 10px", borderRadius: "8px", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", cursor: "pointer", transition: "all 0.15s", background: isSubSelected ? `rgb(${s.rgb})` : "rgba(255,255,255,0.04)", border: `1px solid ${isSubSelected ? `rgb(${s.rgb})` : "rgba(255,255,255,0.1)"}`, color: isSubSelected ? "#fff" : "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", gap: "6px" }}>
                                      {isSubSelected && <Check size={10} />}
                                      {sub}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Third-level: Service Category for Renewable Energy */}
                              <AnimatePresence>
                                {s.id === "renewable-energy" && (selectedSubsectors[s.id] || []).length > 0 && (
                                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
                                    <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9.5px", color: "#10b981", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, marginBottom: "8px" }}>Service Category</p>
                                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                        {renewableEnergyServiceCategories.map(cat => {
                                          const catSel = selectedServiceCategories[s.id] === cat;
                                          return (
                                            <button key={cat} type="button" onClick={() => setSelectedServiceCategories(prev => ({ ...prev, [s.id]: cat }))}
                                              style={{ padding: "6px 12px", borderRadius: "8px", fontFamily: "'DM Sans', sans-serif", fontSize: "11.5px", cursor: "pointer", transition: "all 0.15s", background: catSel ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.03)", border: `1px solid ${catSel ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.08)"}`, color: catSel ? "#10b981" : "rgba(255,255,255,0.5)", textAlign: "left", display: "flex", alignItems: "center", gap: "8px" }}>
                                              <div style={{ width: "14px", height: "14px", borderRadius: "4px", border: `1px solid ${catSel ? "#10b981" : "rgba(255,255,255,0.2)"}`, background: catSel ? "rgba(16,185,129,0.2)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                {catSel && <Check size={9} style={{ color: "#10b981" }} />}
                                              </div>
                                              {cat}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* footer */}
              <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                <button type="button" onClick={() => { setSelectedSectors([]); setSelectedSubsectors({}); setSelectedServiceCategories({}); }}
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}>
                  Clear All
                </button>
                <motion.button type="button" onClick={() => setShowSectorModal(false)} disabled={!selectedSectors.length}
                  style={{ padding: "9px 22px", borderRadius: "99px", border: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, cursor: selectedSectors.length ? "pointer" : "not-allowed", background: selectedSectors.length ? "#10b981" : "rgba(255,255,255,0.05)", color: selectedSectors.length ? "#fff" : "rgba(255,255,255,0.3)", boxShadow: selectedSectors.length ? "0 0 20px rgba(16,185,129,0.3)" : "none" }}
                  whileHover={selectedSectors.length ? { scale: 1.04 } : {}}
                  whileTap={selectedSectors.length ? { scale: 0.97 } : {}}>
                  Confirm ({selectedSectors.length})
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProductsServices;
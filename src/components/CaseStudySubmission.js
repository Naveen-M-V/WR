import React, { useState, useEffect } from 'react';
import { Upload, FileText, Target, Image, Trash2, Save, ArrowLeft, Wrench, AlertCircle, Award, Edit, Check, X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { addCompanyCaseStudy, updateCompanyCaseStudy, deleteCompanyCaseStudy } from '../utils/companiesAPI';
import { API_BASE_URL } from '../config';
import ScrollingBanner from './home/ScrollingBanner';

/* ─────────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────────── */
const fieldBase = {
  width: "100%", padding: "10px 14px",
  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: "10px", color: "#ffffff",
  fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 300, outline: "none",
  transition: "border-color 0.2s, background 0.2s",
};
const onFocus = e => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)"; e.currentTarget.style.background = "rgba(16,185,129,0.04)"; };
const onBlur  = e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; };

const Label = ({ children, required }) => (
  <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "8px" }}>
    {children}{required && <span style={{ color: "#ef4444", marginLeft: "3px" }}>*</span>}
  </label>
);

const GlassCard = ({ children, accentRgb, style = {} }) => (
  <div style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${accentRgb ? `rgba(${accentRgb},0.18)` : "rgba(255,255,255,0.07)"}`, borderRadius: "18px", overflow: "hidden", ...style }}>
    {children}
  </div>
);

const CardHeader = ({ icon, label, accentRgb = "16,185,129", right }) => (
  <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{ width: "28px", height: "28px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", background: `rgba(${accentRgb},0.1)`, border: `1px solid rgba(${accentRgb},0.25)`, flexShrink: 0 }}>{icon}</div>
      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px", fontWeight: 700, color: "#fff" }}>{label}</span>
    </div>
    {right}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
const CaseStudySubmission = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const MAX_IMAGE_SIZE_BYTES = 3 * 1024 * 1024;
  const plan = user?.subscription?.toLowerCase() || 'standard';
  const isElite = plan.includes('elite') || plan.includes('premium');
  const LIMITS = { maxItems: isElite ? 6 : 3, maxImages: isElite ? 6 : 3, maxWords: isElite ? 600 : 300 };

  const [formData, setFormData] = useState({ title: '', client: '', location: '', year: '', overview: '', keyFeatures: [''], challenges: '', solution: '', outcome: '', url: '', images: [] });
  const [dragActive, setDragActive] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [limitError, setLimitError] = useState('');
  const [existingItems, setExistingItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [companyId, setCompanyId] = useState(null);

  const fetchCompanyData = async () => {
    if (!user) return;
    try {
      setLoadingItems(true);
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/companies/my-company`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success && result.data) {
        setCompanyId(result.data.id);
        setExistingItems(result.data.tabs?.caseStudies?.items || []);
      }
    } catch (err) { console.error(err); } finally { setLoadingItems(false); }
  };

  useEffect(() => { fetchCompanyData(); }, [user]);

  const handleInputChange = (field, value) => setFormData(p => ({ ...p, [field]: value }));

  const handleOverviewChange = e => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    if (words <= LIMITS.maxWords) { setWordCount(words); handleInputChange('overview', text); setLimitError(''); }
    else if (text.length < formData.overview.length) { setWordCount(words); handleInputChange('overview', text); }
    else setLimitError(`Word limit reached: Maximum ${LIMITS.maxWords} words allowed.`);
  };

  const handleImageUpload = files => {
    const newCount = files.length;
    if (formData.images.length + newCount > LIMITS.maxImages) { setLimitError(`Max ${LIMITS.maxImages} images allowed.`); return; }
    const picked = Array.from(files || []);
    const valid = picked.filter(f => f && f.type?.startsWith('image/') && f.size <= MAX_IMAGE_SIZE_BYTES);
    if (valid.length !== picked.length) setLimitError('Some files skipped — only images up to 3MB.');
    else setLimitError('');
    setFormData(p => ({ ...p, images: [...p.images, ...valid.map(f => ({ file: f, preview: URL.createObjectURL(f), name: f.name }))] }));
  };

  const removeImage = i => setFormData(p => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }));

  const handleDrag = e => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === "dragenter" || e.type === "dragover"); };
  const handleDrop = e => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files?.[0]) handleImageUpload(e.dataTransfer.files); };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!user) { alert("Please login to submit."); return; }
    if (!companyId) { alert("Company profile not found. Please complete your profile first."); return; }
    setSubmitting(true);
    try {
      const newImages = formData.images.filter(img => !img.isExisting).map(img => img.file);
      const existingImages = formData.images.filter(img => img.isExisting).map(img => img.url);
      const studyData = { title: formData.title, client: formData.client, location: formData.location, year: formData.year, overview: formData.overview, keyFeatures: formData.keyFeatures.filter(f => f.trim()), challenges: formData.challenges, solution: formData.solution, outcome: formData.outcome, url: formData.url, images: newImages, existingImages };
      const res = editingItem ? await updateCompanyCaseStudy(companyId, editingItem.id, studyData) : await addCompanyCaseStudy(companyId, studyData);
      if (res.success) {
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 2500);
        editingItem ? handleCancelEdit() : setFormData({ title: '', client: '', location: '', year: '', overview: '', keyFeatures: [''], challenges: '', solution: '', outcome: '', url: '', images: [] });
        fetchCompanyData();
      } else alert('Error: ' + (typeof res.error === 'string' ? res.error : JSON.stringify(res.error)));
    } catch { alert("Failed to submit. Please try again."); }
    finally { setSubmitting(false); }
  };

  const handleEdit = item => {
    setEditingItem(item);
    setFormData({ title: item.title || '', client: item.client || '', location: item.location || '', year: item.year || '', overview: item.overview || '', keyFeatures: item.keyFeatures?.length > 0 ? item.keyFeatures : [''], challenges: item.challenges || '', solution: item.solution || '', outcome: item.outcome || '', url: item.url || '', images: (item.images || []).map(img => ({ file: null, preview: img.startsWith('http') ? img : `${API_BASE_URL}${img}`, name: 'Existing Image', isExisting: true, url: img })) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => { setEditingItem(null); setFormData({ title: '', client: '', location: '', year: '', overview: '', keyFeatures: [''], challenges: '', solution: '', outcome: '', url: '', images: [] }); };

  const handleDelete = async itemId => {
    if (!companyId) return;
    try {
      const res = await deleteCompanyCaseStudy(companyId, itemId);
      if (res.success) { setDeleteConfirm(null); fetchCompanyData(); }
      else alert('Error deleting: ' + (res.error || 'Unknown error'));
    } catch { alert('Error deleting item'); }
  };

  /* ── TAB NAV ITEMS ── */
  const tabs = [
    { label: "Case Study",        icon: FileText, path: null,                    active: true  },
    { label: "Products & Services",icon: Wrench,   path: '/submit-product-service', active: false },
    { label: "Projects",           icon: Target,   path: '/submit-projects',        active: false },
    { label: "Awards",             icon: Award,    path: '/submit-awards',          active: false },
    { label: "Certifications",     icon: FileText, path: '/submit-certifications',  active: false },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#040e1e", fontFamily: "'DM Sans', sans-serif", color: "#fff", paddingTop: "172px", paddingBottom: "80px" }}>
      <ScrollingBanner />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: rgba(255,255,255,0.2) !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.35); border-radius: 99px; }
        option { background: #040e1e; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes glyphPulse { 0%,100%{opacity:0.08} 50%{opacity:0.22} }
      `}</style>

      {/* ambient glows + glowing glyphs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-100px", left: "20%", width: "560px", height: "480px", borderRadius: "50%", background: "radial-gradient(ellipse, #10b981, transparent 65%)", opacity: 0.04 }} />
        <div style={{ position: "absolute", bottom: "-120px", right: "10%", width: "480px", height: "400px", borderRadius: "50%", background: "radial-gradient(ellipse, #06b6d4, transparent 65%)", opacity: 0.03 }} />
        {/* glyphs */}
        <span style={{ position: "absolute", top: "12%",  left:  "6%",  fontSize: "11px", color: "#10b981", opacity: 0.18, userSelect: "none", letterSpacing: 0 }}>✦</span>
        <span style={{ position: "absolute", top: "18%",  right: "8%",  fontSize: "9px",  color: "#06b6d4", opacity: 0.15, userSelect: "none" }}>◈</span>
        <span style={{ position: "absolute", top: "34%",  left:  "3%",  fontSize: "13px", color: "#10b981", opacity: 0.12, userSelect: "none" }}>❋</span>
        <span style={{ position: "absolute", top: "42%",  right: "5%",  fontSize: "10px", color: "#10b981", opacity: 0.14, userSelect: "none" }}>✦</span>
        <span style={{ position: "absolute", top: "58%",  left:  "8%",  fontSize: "8px",  color: "#06b6d4", opacity: 0.13, userSelect: "none" }}>◈</span>
        <span style={{ position: "absolute", top: "65%",  right: "3%",  fontSize: "12px", color: "#10b981", opacity: 0.11, userSelect: "none" }}>❋</span>
        <span style={{ position: "absolute", top: "78%",  left:  "4%",  fontSize: "9px",  color: "#10b981", opacity: 0.16, userSelect: "none" }}>✦</span>
        <span style={{ position: "absolute", top: "88%",  right: "9%",  fontSize: "11px", color: "#06b6d4", opacity: 0.12, userSelect: "none" }}>◈</span>
        <span style={{ position: "absolute", top: "26%",  left:  "48%", fontSize: "7px",  color: "#10b981", opacity: 0.09, userSelect: "none", animation: "glyphPulse 5s ease-in-out infinite" }}>✦</span>
        <span style={{ position: "absolute", top: "72%",  right: "42%", fontSize: "8px",  color: "#06b6d4", opacity: 0.08, userSelect: "none", animation: "glyphPulse 7s ease-in-out infinite 1.5s" }}>◈</span>
      </div>

      <div style={{ position: "relative", zIndex: 10, maxWidth: "860px", margin: "0 auto", padding: "0 24px" }}>

        {/* back */}
        <button onClick={() => navigate(-1)}
          style={{ display: "inline-flex", alignItems: "center", gap: "7px", marginBottom: "24px", fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", fontWeight: 500, color: "rgba(255,255,255,0.45)", background: "none", border: "none", cursor: "pointer", padding: 0, transition: "color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.color = "#10b981"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}>
          <ArrowLeft size={14} /> Back
        </button>

        {/* heading */}
        <div style={{ marginBottom: "28px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <FileText size={20} style={{ color: "#10b981" }} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <div style={{ height: "1px", width: "20px", background: "#10b981" }} />
              <span style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#10b981", textTransform: "uppercase", fontWeight: 600 }}>Submission</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1 }}>Case Study</h1>
          </div>
        </div>

        {/* ── TAB NAV ── */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "28px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "5px" }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.label} type="button" onClick={() => tab.path && navigate(tab.path)}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "9px 12px", borderRadius: "10px", border: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: tab.active ? 600 : 400, cursor: tab.path ? "pointer" : "default", transition: "all 0.2s", background: tab.active ? "rgba(16,185,129,0.12)" : "transparent", color: tab.active ? "#10b981" : "rgba(255,255,255,0.45)", boxShadow: tab.active ? "0 0 0 1px rgba(16,185,129,0.3)" : "none" }}
                onMouseEnter={e => { if (!tab.active) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; } }}
                onMouseLeave={e => { if (!tab.active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; } }}>
                <Icon size={13} />
                <span style={{ display: "none" }} className="sm-show">{tab.label}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── FORM ── */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* editing banner */}
          {editingItem && (
            <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Edit size={13} style={{ color: "#f59e0b" }} />
                <span style={{ fontSize: "12.5px", color: "#f59e0b", fontWeight: 500 }}>Editing: {editingItem.title}</span>
              </div>
              <button type="button" onClick={handleCancelEdit} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(245,158,11,0.6)", display: "flex" }}><X size={14} /></button>
            </div>
          )}

          {/* Project Info */}
          <GlassCard accentRgb="6,182,212">
            <CardHeader icon={<Target size={13} color="#06b6d4" />} label="Project Information" accentRgb="6,182,212" />
            <div style={{ padding: "20px 22px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div>
                <Label required>Case Study Title</Label>
                <input style={fieldBase} value={formData.title} onChange={e => handleInputChange('title', e.target.value)} placeholder="Enter case study title" required onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <Label>Client Name</Label>
                <input style={fieldBase} value={formData.client} onChange={e => handleInputChange('client', e.target.value)} placeholder="Enter client name (optional)" onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <Label>Location</Label>
                <input style={fieldBase} value={formData.location} onChange={e => handleInputChange('location', e.target.value)} placeholder="Project location (optional)" onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <Label>Year</Label>
                <input style={fieldBase} value={formData.year} onChange={e => handleInputChange('year', e.target.value)} placeholder="e.g. 2024" onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>
          </GlassCard>

          {/* Images */}
          <GlassCard accentRgb="139,92,246">
            <CardHeader icon={<Image size={13} color="#8b5cf6" />} label="Project Images" accentRgb="139,92,246"
              right={<span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>{formData.images.length}/{LIMITS.maxImages}</span>}
            />
            <div style={{ padding: "16px 22px 20px" }}>
              {/* drop zone */}
              <div
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                style={{ border: `2px dashed ${dragActive ? "rgba(139,92,246,0.6)" : "rgba(139,92,246,0.3)"}`, borderRadius: "14px", padding: "28px 16px", textAlign: "center", background: dragActive ? "rgba(139,92,246,0.08)" : "rgba(255,255,255,0.02)", transition: "all 0.2s", cursor: "pointer" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <Upload size={17} style={{ color: "#8b5cf6" }} />
                </div>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", marginBottom: "4px" }}>Drag & drop images here</p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "12px" }}>JPG, PNG, WebP — max 3MB each</p>
                <input type="file" multiple accept="image/*" onChange={e => handleImageUpload(e.target.files)} id="image-upload" style={{ display: "none" }} />
                <label htmlFor="image-upload"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "7px 18px", borderRadius: "99px", background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.35)", color: "#a78bfa", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}>
                  <Upload size={12} /> Choose Files
                </label>
              </div>

              {/* previews */}
              {formData.images.length > 0 && (
                <div style={{ marginTop: "14px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "8px" }}>
                  {formData.images.map((img, i) => (
                    <div key={i} style={{ position: "relative", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.09)", background: "rgba(0,0,0,0.2)" }} className="group">
                      <img src={img.preview} alt={`Preview ${i + 1}`} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
                      <button type="button" onClick={() => removeImage(i)}
                        style={{ position: "absolute", top: "4px", right: "4px", width: "20px", height: "20px", borderRadius: "50%", background: "rgba(239,68,68,0.85)", border: "none", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <X size={10} />
                      </button>
                      {img.isExisting && (
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, fontSize: "9px", textAlign: "center", padding: "2px", background: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.6)" }}>existing</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </GlassCard>

          {/* Overview */}
          <GlassCard accentRgb="16,185,129">
            <CardHeader icon={<FileText size={13} color="#10b981" />} label="Project Overview" accentRgb="16,185,129"
              right={
                <span style={{ fontSize: "10.5px", fontFamily: "'DM Sans', sans-serif", color: limitError ? "#ef4444" : "rgba(255,255,255,0.35)", fontWeight: 600 }}>
                  {wordCount}/{LIMITS.maxWords} words
                </span>
              }
            />
            <div style={{ padding: "16px 22px 20px" }}>
              <textarea style={{ ...fieldBase, resize: "none", borderColor: limitError ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.09)" }} rows={6}
                value={formData.overview} onChange={handleOverviewChange}
                placeholder="Provide a detailed overview of the project, including objectives, challenges, and solutions implemented…"
                required
                onFocus={e => { e.currentTarget.style.borderColor = limitError ? "rgba(239,68,68,0.6)" : "rgba(16,185,129,0.5)"; e.currentTarget.style.background = "rgba(16,185,129,0.04)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = limitError ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.09)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              />
              {limitError && (
                <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "5px" }}>
                  <AlertCircle size={11} style={{ color: "#ef4444" }} />
                  <span style={{ fontSize: "11px", color: "#ef4444" }}>{limitError}</span>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Key Features */}
          <GlassCard accentRgb="245,158,11">
            <CardHeader icon={<Award size={13} color="#f59e0b" />} label="Key Features" accentRgb="245,158,11" />
            <div style={{ padding: "16px 22px 20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {formData.keyFeatures.map((feature, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px" }}>
                    <input
                      style={{ ...fieldBase, flex: 1 }}
                      type="text"
                      value={feature}
                      onChange={e => {
                        const features = [...formData.keyFeatures];
                        features[i] = e.target.value;
                        handleInputChange('keyFeatures', features);
                      }}
                      placeholder={`Feature ${i + 1}`}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                    {i > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const features = formData.keyFeatures.filter((_, idx) => idx !== i);
                          handleInputChange('keyFeatures', features);
                        }}
                        style={{ padding: "8px 12px", borderRadius: "8px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontSize: "11px", cursor: "pointer" }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleInputChange('keyFeatures', [...formData.keyFeatures, ''])}
                  style={{ padding: "10px 16px", borderRadius: "10px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", color: "#f59e0b", fontSize: "12px", cursor: "pointer", alignSelf: "flex-start" }}
                >
                  + Add Feature
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Challenges, Solution, Outcome */}
          <GlassCard accentRgb="139,92,246">
            <CardHeader icon={<Target size={13} color="#8b5cf6" />} label="Project Details" accentRgb="139,92,246" />
            <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <Label>Challenges</Label>
                <textarea style={{ ...fieldBase, resize: "none" }} rows={4}
                  value={formData.challenges} onChange={e => handleInputChange('challenges', e.target.value)}
                  placeholder="Describe the challenges faced during this project..."
                  onFocus={onFocus} onBlur={onBlur}
                />
              </div>
              <div>
                <Label>Solution</Label>
                <textarea style={{ ...fieldBase, resize: "none" }} rows={4}
                  value={formData.solution} onChange={e => handleInputChange('solution', e.target.value)}
                  placeholder="Describe the solution implemented..."
                  onFocus={onFocus} onBlur={onBlur}
                />
              </div>
              <div>
                <Label>Outcome</Label>
                <textarea style={{ ...fieldBase, resize: "none" }} rows={4}
                  value={formData.outcome} onChange={e => handleInputChange('outcome', e.target.value)}
                  placeholder="Describe the results and outcomes achieved..."
                  onFocus={onFocus} onBlur={onBlur}
                />
              </div>
              <div>
                <Label>Case Study URL</Label>
                <input style={fieldBase} value={formData.url} onChange={e => handleInputChange('url', e.target.value)}
                  placeholder="https://… (optional link to full case study)" onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>
          </GlassCard>

          {/* actions */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="button" onClick={editingItem ? handleCancelEdit : () => navigate(-1)}
              style={{ flex: 1, padding: "11px", borderRadius: "99px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.09)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
              {editingItem ? "Cancel Edit" : "Cancel"}
            </button>
            <button type="submit" disabled={submitting || !!limitError}
              style={{ flex: 2, padding: "11px", borderRadius: "99px", background: submitSuccess ? "#10b981" : (submitting || limitError) ? "rgba(255,255,255,0.05)" : "#10b981", border: "none", color: (submitting || limitError) ? "rgba(255,255,255,0.3)" : "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, cursor: (submitting || limitError) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: (submitting || limitError) ? "none" : "0 0 20px rgba(16,185,129,0.3)", transition: "all 0.2s" }}>
              {submitting ? (
                <><div style={{ width: "13px", height: "13px", border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />Submitting…</>
              ) : submitSuccess ? (
                <><Check size={14} />{editingItem ? "Updated!" : "Submitted!"}</>
              ) : (
                <><Save size={14} />{editingItem ? "Update Case Study" : "Submit Case Study"}</>
              )}
            </button>
          </div>
        </form>

        {/* ── EXISTING ITEMS ── */}
        <div style={{ marginTop: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ height: "1px", width: "20px", background: "#10b981" }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#fff" }}>Your Case Studies</h2>
            {!loadingItems && <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", padding: "2px 8px", borderRadius: "99px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>{existingItems.length}/{LIMITS.maxItems}</span>}
          </div>

          {loadingItems ? (
            <div style={{ textAlign: "center", padding: "40px", borderRadius: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ width: "28px", height: "28px", border: "2px solid rgba(16,185,129,0.2)", borderTopColor: "#10b981", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 10px" }} />
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>Loading…</p>
            </div>
          ) : existingItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 24px", borderRadius: "16px", background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.09)" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <FileText size={18} style={{ color: "#10b981" }} />
              </div>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", marginBottom: "4px" }}>No case studies added yet.</p>
              <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.25)", fontWeight: 300 }}>Use the form above to add your first one.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {existingItems.map(item => (
                <GlassCard key={item.id}>
                  <div style={{ display: "flex", gap: "16px", padding: "16px" }}>
                    {/* thumbnail */}
                    <div style={{ width: "90px", height: "72px", borderRadius: "10px", overflow: "hidden", flexShrink: 0, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      {item.images?.length > 0 ? (
                        <img src={item.images[0].startsWith('http') ? item.images[0] : `${API_BASE_URL}${item.images[0]}`} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Image size={18} style={{ color: "rgba(255,255,255,0.15)" }} />
                        </div>
                      )}
                    </div>

                    {/* content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "6px" }}>
                        <div style={{ minWidth: 0 }}>
                          {item.status === 'archived' && (
                            <span style={{ display: "inline-block", marginBottom: "4px", padding: "1px 7px", borderRadius: "99px", background: "rgba(100,116,139,0.1)", border: "1px solid rgba(100,116,139,0.3)", fontSize: "9.5px", color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase" }}>Archived</span>
                          )}
                          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</h3>
                        </div>
                        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                          <button type="button" onClick={() => handleEdit(item)}
                            style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(59,130,246,0.18)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(59,130,246,0.08)"}>
                            <Edit size={12} />
                          </button>
                          <button type="button" onClick={() => setDeleteConfirm(item.id)}
                            style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.18)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                      <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.4)", marginBottom: "5px", fontWeight: 300 }}>
                        {item.client && <><span style={{ color: "rgba(255,255,255,0.55)" }}>Client:</span> {item.client}</>}
                        {item.client && item.location && " · "}
                        {item.location && <><span style={{ color: "rgba(255,255,255,0.55)" }}>Location:</span> {item.location}</>}
                        {item.year && ` · ${item.year}`}
                      </p>
                      {item.url && (
                        <a
                          href={/^https?:\/\//i.test(item.url) ? item.url : `https://${item.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            marginBottom: "6px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "11.5px",
                            color: "#10b981",
                            textDecoration: "none"
                          }}
                        >
                          <ExternalLink size={11} />
                          Open Case Study URL
                        </a>
                      )}
                      {item.overview && <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.38)", lineHeight: 1.55, fontWeight: 300, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{item.overview}</p>}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", background: "rgba(4,14,30,0.88)", backdropFilter: "blur(14px)" }} onClick={() => setDeleteConfirm(null)}>
          <div style={{ width: "100%", maxWidth: "380px", background: "rgba(4,14,30,0.98)", border: "1px solid rgba(239,68,68,0.22)", borderRadius: "20px", padding: "36px 28px", textAlign: "center", boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }} onClick={e => e.stopPropagation()}>
            <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Trash2 size={18} color="#ef4444" />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>Delete Case Study?</h3>
            <p style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.45)", fontWeight: 300, marginBottom: "24px" }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: "9px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} style={{ flex: 1, padding: "9px", borderRadius: "10px", background: "#ef4444", border: "none", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseStudySubmission;

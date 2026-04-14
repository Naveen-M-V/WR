import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, FileText, Save, Target, Plus, Trash2, AlertCircle,
  CheckCircle, Briefcase, Search, Filter, Archive, RotateCcw, Award, X, Check, ChevronDown, Edit, Image, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { addCompanyProject, updateCompanyProject, deleteCompanyProject, archiveCompanyProject, getCompanyById } from '../utils/companiesAPI';
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

const Label = ({ children, required, optional }) => (
  <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "8px" }}>
    {children}
    {required && <span style={{ color: "#ef4444", marginLeft: "3px" }}>*</span>}
    {optional && <span style={{ color: "rgba(16,185,129,0.6)", marginLeft: "3px", fontWeight: 400, fontSize: "9px" }}>(Optional)</span>}
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

const SelectField = ({ value, onChange, disabled, children, style = {} }) => (
  <div style={{ position: "relative" }}>
    <select value={value} onChange={onChange} disabled={disabled}
      style={{ ...fieldBase, appearance: "none", paddingRight: "36px", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, ...style }}
      onFocus={onFocus} onBlur={onBlur}>
      {children}
    </select>
    <ChevronDown size={13} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
  </div>
);

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
const ProjectsSubmission = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const plan = user?.subscription?.toLowerCase() || 'standard';
  const canUseVisibilityControl = plan.includes('elite') || plan.includes('premium');
  const LIMITS = { maxItems: plan.includes('elite') ? 6 : 3, maxWords: plan.includes('elite') ? 600 : 300, maxImages: plan.includes('elite') ? 6 : 3 };
  const MAX_IMAGE_SIZE_BYTES = 3 * 1024 * 1024;

  const [formData, setFormData] = useState({
    title: '', description: '', workDelivered: '', outcome: '',
    descriptionVisibility: 'public', clientName: '',
    projectDate: '', projectValue: '', location: '', keyFeatures: [''], url: '', images: []
  });
  const [dragActive, setDragActive] = useState(false);
  const [editingId, setEditingId]     = useState(null);
  const [projects, setProjects]       = useState([]);
  const [loading, setLoading]         = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [feedback, setFeedback]       = useState({ type: '', message: '' });
  const [searchTerm, setSearchTerm]   = useState('');
  const [statusFilter, setStatusFilter]     = useState('active');
  const [locationFilter, setLocationFilter] = useState('all');
  const [clientFilter, setClientFilter]     = useState('all');
  const [wordCount, setWordCount]     = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [companyId, setCompanyId] = useState(null);

  // ── FETCH COMPANY ID FROM USER ──
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`${API_BASE_URL}/companies/my-company`, { headers: { Authorization: `Bearer ${token}` } });
        const result = await res.json();
        if (result.success && result.data) {
          setCompanyId(result.data.id);
        }
      } catch (err) { console.error("Error fetching company:", err); }
    };
    if (user) fetchCompany();
  }, [user]);
  const resetForm = () => {
    setFormData({ title: '', description: '', workDelivered: '', outcome: '', descriptionVisibility: 'public', clientName: '', projectDate: '', projectValue: '', location: '', keyFeatures: [''], url: '', images: [] });
    setEditingId(null);
    setWordCount(0);
  };

  const handleInputChange = (field, value) => setFormData(p => ({ ...p, [field]: value }));

  const handleImageUpload = files => {
    const picked = Array.from(files || []);
    const valid = picked.filter(f => f && f.type?.startsWith('image/') && f.size <= MAX_IMAGE_SIZE_BYTES);
    if (formData.images.length + valid.length > LIMITS.maxImages) {
      setFeedback({ type: 'error', message: `Max ${LIMITS.maxImages} images allowed.` }); return;
    }
    if (valid.length !== picked.length) setFeedback({ type: 'error', message: 'Some files skipped — images only, max 3MB each.' });
    setFormData(p => ({ ...p, images: [...p.images, ...valid.map(f => ({ file: f, preview: URL.createObjectURL(f), name: f.name }))] }));
  };
  const removeImage = i => setFormData(p => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }));
  const handleDrag = e => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === 'dragenter' || e.type === 'dragover'); };
  const handleDrop = e => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files?.[0]) handleImageUpload(e.dataTransfer.files); };

  const handleArrayFieldChange = (index, value) => setFormData(p => ({ ...p, keyFeatures: p.keyFeatures.map((x, i) => i === index ? value : x) }));
  const addFeatureRow    = () => setFormData(p => ({ ...p, keyFeatures: [...p.keyFeatures, ''] }));
  const removeFeatureRow = idx => setFormData(p => { const n = p.keyFeatures.filter((_, i) => i !== idx); return { ...p, keyFeatures: n.length ? n : [''] }; });

  const loadProjects = async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const res = await getCompanyById(companyId);
      if (res.success) {
        const company = res.data?.data || res.data;
        setProjects(company?.tabs?.projects?.items || []);
      }
    } finally { setLoading(false); }
  };

  useEffect(() => { loadProjects(); }, [companyId]);

  const handleDescriptionChange = value => {
    const words = value.trim().split(/\s+/).filter(Boolean).length;
    if (words <= LIMITS.maxWords) { setWordCount(words); handleInputChange('description', value); setFeedback({ type: '', message: '' }); return; }
    if (value.length < formData.description.length) { setWordCount(words); handleInputChange('description', value); }
    else setFeedback({ type: 'error', message: `Word limit reached: Maximum ${LIMITS.maxWords} words allowed.` });
  };

  const validate = () => {
    if (!user) return 'You must be logged in.';
    if (!companyId) return 'Company profile not found. Please complete your profile first.';
    if (!formData.title || !formData.description) return 'Please fill in all required fields (Title and Description).';
    return '';
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });
    const err = validate();
    if (err) { setFeedback({ type: 'error', message: err }); return; }
    setSubmitting(true);
    try {
      const newImages = formData.images.filter(img => !img.isExisting).map(img => img.file);
      const existingImages = formData.images.filter(img => img.isExisting).map(img => img.url);
      const payload = { title: formData.title.trim(), description: formData.description.trim(), workDelivered: formData.workDelivered.trim(), outcome: formData.outcome.trim(), descriptionVisibility: canUseVisibilityControl ? formData.descriptionVisibility : 'public', clientName: formData.clientName.trim(), projectDate: formData.projectDate, projectValue: formData.projectValue.trim(), location: formData.location.trim(), keyFeatures: formData.keyFeatures.map(f => f.trim()).filter(Boolean), url: formData.url.trim(), images: newImages, existingImages };
      const res = editingId ? await updateCompanyProject(companyId, editingId, payload) : await addCompanyProject(companyId, payload);
      if (!res.success) { setFeedback({ type: 'error', message: res.error || res.message || 'Failed to save.' }); return; }
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 2500);
      setFeedback({ type: 'success', message: editingId ? 'Project updated.' : 'Project created.' });
      resetForm();
      await loadProjects();
    } finally { setSubmitting(false); }
  };

  const handleEdit = project => {
    setEditingId(project.id);
    setFormData({ title: project.title || '', description: project.description || '', workDelivered: project.workDelivered || '', outcome: project.outcome || '', descriptionVisibility: project.descriptionVisibility || 'public', clientName: project.clientName || '', projectDate: project.projectDate || '', projectValue: project.projectValue || '', location: project.location || '', keyFeatures: project.keyFeatures?.length ? project.keyFeatures : [''], url: project.url || '', images: (project.images || []).map(img => ({ file: null, preview: img.startsWith('http') ? img : `${API_BASE_URL}${img}`, name: 'Existing Image', isExisting: true, url: img })) });
    setWordCount((project.description || '').trim().split(/\s+/).filter(Boolean).length);
    setFeedback({ type: '', message: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async projectId => {
    setLoading(true);
    try {
      const res = await deleteCompanyProject(companyId, projectId);
      if (!res.success) { setFeedback({ type: 'error', message: res.error || 'Failed to delete.' }); return; }
      setDeleteConfirm(null);
      setFeedback({ type: 'success', message: 'Project deleted.' });
      await loadProjects();
    } finally { setLoading(false); }
  };

  const handleArchive = async (projectId, archived) => {
    setLoading(true);
    try {
      const res = await archiveCompanyProject(companyId, projectId, archived);
      if (!res.success) { setFeedback({ type: 'error', message: res.error || 'Failed to update status.' }); return; }
      setFeedback({ type: 'success', message: archived ? 'Project archived.' : 'Project restored.' });
      await loadProjects();
    } finally { setLoading(false); }
  };

  const locationOptions = useMemo(() => ['all', ...Array.from(new Set(projects.map(p => p.location).filter(Boolean)))], [projects]);
  const clientOptions   = useMemo(() => ['all', ...Array.from(new Set(projects.map(p => p.clientName).filter(Boolean)))], [projects]);

  const filteredProjects = useMemo(() => projects.filter(p => {
    const statusMatch   = statusFilter === 'all' || (p.status || 'active') === statusFilter;
    const locationMatch = locationFilter === 'all' || p.location === locationFilter;
    const clientMatch   = clientFilter === 'all' || p.clientName === clientFilter;
    const searchLower   = searchTerm.trim().toLowerCase();
    if (!searchLower) return statusMatch && locationMatch && clientMatch;
    const hay = `${p.title||''} ${p.description||''} ${p.clientName||''} ${p.location||''}`.toLowerCase();
    return statusMatch && locationMatch && clientMatch && hay.includes(searchLower);
  }), [projects, searchTerm, statusFilter, locationFilter, clientFilter]);

  const tabs = [
    { label: "Case Study",          icon: FileText,  path: '/submit-case-study',       active: false },
    { label: "Products & Services", icon: Briefcase, path: '/submit-product-service',  active: false },
    { label: "Projects",            icon: Target,    path: null,                        active: true  },
    { label: "Awards",              icon: Award,     path: '/submit-awards',            active: false },
    { label: "Certifications",      icon: FileText,  path: '/submit-certifications',    active: false },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#040e1e", fontFamily: "'DM Sans', sans-serif", color: "#fff", paddingTop: "172px", paddingBottom: "80px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: rgba(255,255,255,0.2) !important; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.6); cursor: pointer; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.35); border-radius: 99px; }
        option { background: #040e1e; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes glyphPulse { 0%,100%{opacity:0.08} 50%{opacity:0.22} }
      `}</style>

      <ScrollingBanner />

      {/* ambient glows + glyphs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-100px", left: "20%", width: "560px", height: "480px", borderRadius: "50%", background: "radial-gradient(ellipse, #10b981, transparent 65%)", opacity: 0.04 }} />
        <div style={{ position: "absolute", bottom: "-120px", right: "10%", width: "480px", height: "400px", borderRadius: "50%", background: "radial-gradient(ellipse, #06b6d4, transparent 65%)", opacity: 0.03 }} />
        <span style={{ position: "absolute", top: "12%",  left:  "6%",  fontSize: "11px", color: "#10b981", opacity: 0.18, userSelect: "none" }}>✦</span>
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
            <Target size={20} style={{ color: "#10b981" }} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <div style={{ height: "1px", width: "20px", background: "#10b981" }} />
              <span style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#10b981", textTransform: "uppercase", fontWeight: 600 }}>Submission</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1 }}>Manage Projects</h1>
          </div>
        </div>

        {/* tabs */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "28px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "5px" }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.label} type="button" onClick={() => tab.path && navigate(tab.path)}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "9px 12px", borderRadius: "10px", border: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: tab.active ? 600 : 400, cursor: tab.path ? "pointer" : "default", transition: "all 0.2s", background: tab.active ? "rgba(16,185,129,0.12)" : "transparent", color: tab.active ? "#10b981" : "rgba(255,255,255,0.45)", boxShadow: tab.active ? "0 0 0 1px rgba(16,185,129,0.3)" : "none" }}
                onMouseEnter={e => { if (!tab.active) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; } }}
                onMouseLeave={e => { if (!tab.active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; } }}>
                <Icon size={13} />{tab.label}
              </button>
            );
          })}
        </div>

        {/* feedback banner */}
        {feedback.message && (
          <div style={{ marginBottom: "18px", padding: "12px 16px", borderRadius: "12px", background: feedback.type === 'error' ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)", border: `1px solid ${feedback.type === 'error' ? "rgba(239,68,68,0.25)" : "rgba(16,185,129,0.25)"}`, display: "flex", alignItems: "center", gap: "10px" }}>
            {feedback.type === 'error' ? <AlertCircle size={14} style={{ color: "#ef4444", flexShrink: 0 }} /> : <CheckCircle size={14} style={{ color: "#10b981", flexShrink: 0 }} />}
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: 300 }}>{feedback.message}</span>
            <button onClick={() => setFeedback({ type: '', message: '' })} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", display: "flex" }}><X size={12} /></button>
          </div>
        )}

        {/* editing banner */}
        {editingId && (
          <div style={{ marginBottom: "16px", padding: "12px 16px", borderRadius: "12px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Edit size={13} style={{ color: "#f59e0b" }} />
              <span style={{ fontSize: "12.5px", color: "#f59e0b", fontWeight: 500 }}>Editing project</span>
            </div>
            <button type="button" onClick={resetForm} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(245,158,11,0.6)", display: "flex" }}><X size={14} /></button>
          </div>
        )}

        {/* ── FORM ── */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "48px" }}>

          {/* Core Details */}
          <GlassCard accentRgb="6,182,212">
            <CardHeader icon={<Target size={13} color="#06b6d4" />} label="Project Details" accentRgb="6,182,212" />
            <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <Label required>Title</Label>
                <input style={fieldBase} value={formData.title} onChange={e => handleInputChange('title', e.target.value)} placeholder="Project title" onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <Label optional>Client Name</Label>
                  <input style={fieldBase} value={formData.clientName} onChange={e => handleInputChange('clientName', e.target.value)} placeholder="Client name" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <Label optional>Location</Label>
                  <input style={fieldBase} value={formData.location} onChange={e => handleInputChange('location', e.target.value)} placeholder="City, Country" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <Label optional>Project Year</Label>
                  <input
                    type="number"
                    min="1900"
                    max="2099"
                    step="1"
                    style={fieldBase}
                    value={formData.projectDate}
                    onChange={e => handleInputChange('projectDate', e.target.value)}
                    placeholder="2024"
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
                <div>
                  <Label optional>Project Value</Label>
                  <input style={fieldBase} value={formData.projectValue} onChange={e => handleInputChange('projectValue', e.target.value)} placeholder="£1,200,000" onFocus={onFocus} onBlur={onBlur} />
                </div>
              </div>
              <div>
                <Label>Description Visibility</Label>
                <SelectField value={canUseVisibilityControl ? formData.descriptionVisibility : 'public'} onChange={e => handleInputChange('descriptionVisibility', e.target.value)} disabled={!canUseVisibilityControl}>
                  <option value="public">Public</option>
                  <option value="private">Private {!canUseVisibilityControl ? "(Elite/Premium only)" : ""}</option>
                </SelectField>
              </div>
            </div>
          </GlassCard>

          {/* Description */}
          <GlassCard accentRgb="16,185,129">
            <CardHeader icon={<FileText size={13} color="#10b981" />} label="Description" accentRgb="16,185,129"
              right={<span style={{ fontSize: "10.5px", fontFamily: "'DM Sans', sans-serif", color: feedback.type === 'error' && feedback.message.includes('Word') ? "#ef4444" : "rgba(255,255,255,0.35)", fontWeight: 600 }}>{wordCount}/{LIMITS.maxWords} words</span>}
            />
            <div style={{ padding: "16px 22px 20px" }}>
              <textarea style={{ ...fieldBase, resize: "none" }} rows={5}
                value={formData.description} onChange={e => handleDescriptionChange(e.target.value)}
                placeholder="Describe the project…" required onFocus={onFocus} onBlur={onBlur} />
            </div>
          </GlassCard>

          {/* Work Delivered + Outcome */}
          <GlassCard accentRgb="139,92,246">
            <CardHeader icon={<CheckCircle size={13} color="#8b5cf6" />} label="Work & Outcome" accentRgb="139,92,246" />
            <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <Label>Work Delivered</Label>
                <textarea style={{ ...fieldBase, resize: "none" }} rows={4} value={formData.workDelivered} onChange={e => handleInputChange('workDelivered', e.target.value)} placeholder="Describe the work delivered…" onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <Label>Outcome</Label>
                <textarea style={{ ...fieldBase, resize: "none" }} rows={4} value={formData.outcome} onChange={e => handleInputChange('outcome', e.target.value)} placeholder="Describe the outcome achieved…" onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <Label>Project URL</Label>
                <input style={fieldBase} value={formData.url} onChange={e => handleInputChange('url', e.target.value)} placeholder="https://… (optional link to project page)" onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>
          </GlassCard>

          {/* Key Features */}
          <GlassCard accentRgb="245,158,11">
            <CardHeader icon={<Target size={13} color="#f59e0b" />} label="Key Features" accentRgb="245,158,11" />
            <div style={{ padding: "16px 22px 20px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {formData.keyFeatures.map((feature, index) => (
                <div key={index} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <div style={{ position: "relative", flex: 1 }}>
                    <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "5px", height: "5px", borderRadius: "50%", background: "rgba(245,158,11,0.5)" }} />
                    <input style={{ ...fieldBase, paddingLeft: "28px" }} value={feature} onChange={e => handleArrayFieldChange(index, e.target.value)} placeholder={`Feature ${index + 1}`} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                  <button type="button" onClick={() => removeFeatureRow(index)}
                    style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.18)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}>
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={addFeatureRow}
                style={{ display: "inline-flex", alignItems: "center", gap: "5px", marginTop: "4px", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#f59e0b", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                <Plus size={12} /> Add Feature
              </button>
            </div>
          </GlassCard>

          {/* Images */}
          <GlassCard accentRgb="139,92,246">
            <CardHeader icon={<Image size={13} color="#8b5cf6" />} label="Project Images (Optional)" accentRgb="139,92,246"
              right={<span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>{formData.images.length}/{LIMITS.maxImages}</span>}
            />
            <div style={{ padding: "16px 22px 20px" }}>
              <div
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                style={{ border: `2px dashed ${dragActive ? "rgba(139,92,246,0.6)" : "rgba(139,92,246,0.3)"}`, borderRadius: "14px", padding: "24px 16px", textAlign: "center", background: dragActive ? "rgba(139,92,246,0.08)" : "rgba(255,255,255,0.02)", transition: "all 0.2s" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                  <Plus size={16} style={{ color: "#8b5cf6" }} />
                </div>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", marginBottom: "10px" }}>Drag & drop images or click to browse</p>
                <input type="file" multiple accept="image/*" onChange={e => handleImageUpload(e.target.files)} id="project-image-upload" style={{ display: "none" }} />
                <label htmlFor="project-image-upload" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 16px", borderRadius: "99px", background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.35)", color: "#a78bfa", fontSize: "12px", fontWeight: 500, cursor: "pointer" }}>
                  <Plus size={11} /> Choose Files
                </label>
              </div>
              {formData.images.length > 0 && (
                <div style={{ marginTop: "12px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: "8px" }}>
                  {formData.images.map((img, i) => (
                    <div key={i} style={{ position: "relative", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.09)" }}>
                      <img src={img.preview} alt={`Preview ${i + 1}`} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
                      <button type="button" onClick={() => removeImage(i)} style={{ position: "absolute", top: "4px", right: "4px", width: "18px", height: "18px", borderRadius: "50%", background: "rgba(239,68,68,0.85)", border: "none", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <X size={9} />
                      </button>
                      {img.isExisting && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, fontSize: "9px", textAlign: "center", padding: "2px", background: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.6)" }}>existing</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </GlassCard>

          {/* actions */}
          <div style={{ display: "flex", gap: "10px" }}>
            {editingId && (
              <button type="button" onClick={resetForm}
                style={{ flex: 1, padding: "11px", borderRadius: "99px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.09)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
                Cancel Edit
              </button>
            )}
            <button type="submit" disabled={submitting}
              style={{ flex: 2, padding: "11px", borderRadius: "99px", background: submitSuccess ? "#10b981" : submitting ? "rgba(255,255,255,0.05)" : "#10b981", border: "none", color: submitting ? "rgba(255,255,255,0.3)" : "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, cursor: submitting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: submitting ? "none" : "0 0 20px rgba(16,185,129,0.3)", transition: "all 0.2s" }}>
              {submitting ? (
                <><div style={{ width: "13px", height: "13px", border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />Saving…</>
              ) : submitSuccess ? (
                <><Check size={14} />{editingId ? "Updated!" : "Created!"}</>
              ) : (
                <><Save size={14} />{editingId ? "Update Project" : "Create Project"}</>
              )}
            </button>
          </div>
        </form>

        {/* ── PROJECTS LIBRARY ── */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ height: "1px", width: "20px", background: "#10b981" }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#fff" }}>Projects Library</h2>
            {!loading && <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", padding: "2px 8px", borderRadius: "99px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>{filteredProjects.length} shown</span>}
          </div>

          {/* filters */}
          <GlassCard style={{ marginBottom: "16px" }}>
            <div style={{ padding: "14px 18px", display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
              {/* search */}
              <div style={{ position: "relative", flex: "1 1 200px", minWidth: "160px" }}>
                <Search size={12} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
                <input style={{ ...fieldBase, paddingLeft: "32px" }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search projects…" onFocus={onFocus} onBlur={onBlur} />
              </div>
              {/* status */}
              <div style={{ flex: "0 0 120px" }}>
                <SelectField value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                  <option value="all">All Status</option>
                </SelectField>
              </div>
              {/* location */}
              <div style={{ flex: "0 0 140px" }}>
                <SelectField value={locationFilter} onChange={e => setLocationFilter(e.target.value)}>
                  {locationOptions.map(o => <option key={o} value={o}>{o === 'all' ? 'All Locations' : o}</option>)}
                </SelectField>
              </div>
              {/* client */}
              <div style={{ flex: "0 0 140px" }}>
                <SelectField value={clientFilter} onChange={e => setClientFilter(e.target.value)}>
                  {clientOptions.map(o => <option key={o} value={o}>{o === 'all' ? 'All Clients' : o}</option>)}
                </SelectField>
              </div>
            </div>
          </GlassCard>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", borderRadius: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ width: "28px", height: "28px", border: "2px solid rgba(16,185,129,0.2)", borderTopColor: "#10b981", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 10px" }} />
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>Loading projects…</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 24px", borderRadius: "16px", background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.09)" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <Target size={18} style={{ color: "#10b981" }} />
              </div>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", marginBottom: "4px" }}>No projects found.</p>
              <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.25)", fontWeight: 300 }}>Try adjusting your filters or create your first project above.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {filteredProjects.map(project => {
                const isArchived = project.status === 'archived';
                return (
                  <GlassCard key={project.id}>
                    <div style={{ padding: "16px 20px" }}>
                      {/* top row */}
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "8px" }}>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "5px" }}>
                            <span style={{ padding: "1px 8px", borderRadius: "99px", background: isArchived ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)", border: `1px solid ${isArchived ? "rgba(245,158,11,0.3)" : "rgba(16,185,129,0.3)"}`, fontSize: "9.5px", color: isArchived ? "#f59e0b" : "#10b981", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                              {isArchived ? "Archived" : "Active"}
                            </span>
                            {project.projectDate && <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.35)" }}>{project.projectDate}</span>}
                            {project.projectValue && <span style={{ padding: "1px 7px", borderRadius: "99px", background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.2)", fontSize: "10px", color: "#06b6d4" }}>{project.projectValue}</span>}
                          </div>
                          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{project.title}</h3>
                          {(project.clientName || project.location) && (
                            <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.4)", marginTop: "4px", fontWeight: 300 }}>
                              {project.clientName}{project.clientName && project.location && " · "}{project.location}
                            </p>
                          )}
                        </div>
                        {/* action buttons */}
                        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                          <button type="button" onClick={() => handleEdit(project)}
                            style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(59,130,246,0.18)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(59,130,246,0.08)"}>
                            <Edit size={12} />
                          </button>
                          {isArchived ? (
                            <button type="button" onClick={() => handleArchive(project.id, false)}
                              style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}
                              title="Restore"
                              onMouseEnter={e => e.currentTarget.style.background = "rgba(16,185,129,0.18)"}
                              onMouseLeave={e => e.currentTarget.style.background = "rgba(16,185,129,0.08)"}>
                              <RotateCcw size={12} />
                            </button>
                          ) : (
                            <button type="button" onClick={() => handleArchive(project.id, true)}
                              style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", color: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}
                              title="Archive"
                              onMouseEnter={e => e.currentTarget.style.background = "rgba(245,158,11,0.18)"}
                              onMouseLeave={e => e.currentTarget.style.background = "rgba(245,158,11,0.08)"}>
                              <Archive size={12} />
                            </button>
                          )}
                          <button type="button" onClick={() => setDeleteConfirm(project.id)}
                            style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.18)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      {/* description */}
                      {project.description && (
                        <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.38)", lineHeight: 1.6, fontWeight: 300, marginBottom: project.keyFeatures?.length ? "10px" : 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                          {project.description}
                        </p>
                      )}

                      {project.url && (
                        <a
                          href={/^https?:\/\//i.test(project.url) ? project.url : `https://${project.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            marginBottom: "10px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "11.5px",
                            color: "#10b981",
                            textDecoration: "none"
                          }}
                        >
                          <ExternalLink size={11} />
                          Open Project URL
                        </a>
                      )}

                      {/* key features */}
                      {project.keyFeatures?.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                          {project.keyFeatures.map((f, i) => (
                            <span key={i} style={{ padding: "2px 8px", borderRadius: "99px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontSize: "10.5px", color: "rgba(255,255,255,0.45)" }}>{f}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </GlassCard>
                );
              })}
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
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>Delete Project?</h3>
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

export default ProjectsSubmission;

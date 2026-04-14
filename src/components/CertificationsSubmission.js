import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, FileText, Save, Award, Plus, Trash2, AlertCircle,
  CheckCircle, Briefcase, Search, Filter, Archive, RotateCcw, Target, X, Check, ChevronDown, Edit, Image, Upload, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { addCompanyCertification, updateCompanyCertification, deleteCompanyCertification, archiveCompanyCertification, getCompanyById } from '../utils/companiesAPI';
import { API_HOST, API_BASE_URL } from '../config';
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

const onFocus = e => {
  e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)";
  e.currentTarget.style.background = "rgba(16,185,129,0.04)";
};

const onBlur = e => {
  e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
};

const Label = ({ children, required }) => (
  <label style={{
    display: "block",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.45)",
    marginBottom: "8px"
  }}>
    {children}{required && <span style={{ color: "#ef4444", marginLeft: "3px" }}>*</span>}
  </label>
);

const GlassCard = ({ children, accentRgb, style = {} }) => (
  <div style={{
    background: "rgba(255,255,255,0.025)",
    border: `1px solid ${accentRgb ? `rgba(${accentRgb},0.18)` : "rgba(255,255,255,0.07)"}`,
    borderRadius: "18px",
    overflow: "hidden",
    ...style
  }}>
    {children}
  </div>
);

const CardHeader = ({ icon, label, accentRgb = "16,185,129", right }) => (
  <div style={{
    padding: "16px 22px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{
        width: "28px", height: "28px", borderRadius: "8px",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: `rgba(${accentRgb},0.1)`,
        border: `1px solid rgba(${accentRgb},0.25)`,
        flexShrink: 0
      }}>
        {icon}
      </div>
      <span style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "14px",
        fontWeight: 700,
        color: "#fff"
      }}>
        {label}
      </span>
    </div>
    {right}
  </div>
);

const SelectField = ({ value, onChange, disabled, children, style = {} }) => (
  <div style={{ position: "relative" }}>
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{
        ...fieldBase,
        appearance: "none",
        paddingRight: "36px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        ...style
      }}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {children}
    </select>
    <ChevronDown size={13} style={{
      position: "absolute", right: "12px", top: "50%",
      transform: "translateY(-50%)",
      color: "rgba(255,255,255,0.3)",
      pointerEvents: "none"
    }} />
  </div>
);

const CertificationsSubmission = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const plan = user?.subscription?.toLowerCase() || 'standard';
  const LIMITS = {
    maxItems: plan.includes('elite') ? 6 : 3,
    maxImages: plan.includes('elite') ? 6 : 3,
    maxWords: plan.includes('elite') ? 600 : 300
  };
  const MAX_IMAGE_SIZE_BYTES = 3 * 1024 * 1024;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    issueDate: '',
    expiryDate: '',
    issuingBody: '',
    category: '',
    certificationNumber: '',
    images: []
  });
  const [editingId, setEditingId] = useState(null);
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [yearFilter, setYearFilter] = useState('all');
  const [bodyFilter, setBodyFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [wordCount, setWordCount] = useState(0);
  const [certificateFile, setCertificateFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [companyId, setCompanyId] = useState(null);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      issueDate: '',
      expiryDate: '',
      issuingBody: '',
      category: '',
      certificationNumber: '',
      images: []
    });
    setEditingId(null);
    setWordCount(0);
    setCertificateFile(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = files => {
    const newCount = files.length;
    if (formData.images.length + newCount > LIMITS.maxImages) { setFeedback({ type: 'error', message: `Max ${LIMITS.maxImages} images allowed.` }); return; }
    const picked = Array.from(files || []);
    const valid = picked.filter(f => f && f.type?.startsWith('image/') && f.size <= MAX_IMAGE_SIZE_BYTES);
    if (valid.length !== picked.length) setFeedback({ type: 'error', message: 'Some files skipped — only images up to 3MB.' });
    else setFeedback({ type: '', message: '' });
    setFormData(prev => ({ ...prev, images: [...prev.images, ...valid.map(f => ({ file: f, preview: URL.createObjectURL(f), name: f.name }))] }));
  };

  const removeImage = i => setFormData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }));

  const handleDrag = e => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === "dragenter" || e.type === "dragover"); };
  const handleDrop = e => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files?.[0]) handleImageUpload(e.dataTransfer.files); };

  const loadCertifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/companies/my-company`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success && result.data) {
        setCompanyId(result.data.id);
        const items = result.data.tabs?.certifications?.items || [];
        setAwards(items);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertifications();
  }, [user]);

  const handleDescriptionChange = (value) => {
    const words = value.trim().split(/\s+/).filter(Boolean).length;
    if (words <= LIMITS.maxWords) {
      setWordCount(words);
      handleInputChange('description', value);
      setFeedback({ type: '', message: '' });
      return;
    }
    if (value.length < formData.description.length) {
      setWordCount(words);
      handleInputChange('description', value);
    } else {
      setFeedback({ type: 'error', message: `Word limit reached: Maximum ${LIMITS.maxWords} words allowed.` });
    }
  };

  const validate = () => {
    if (!user) return 'You must be logged in to submit.';
    if (!companyId) return 'Company profile not found. Please complete your profile first.';
    if (!formData.title) {
      return 'Title is required. Please fill in the certification title.';
    }
    return '';
  };

  const getCertificateFileUrl = (filePath) => {
    if (!filePath) return '';
    if (filePath.startsWith('http')) return filePath;
    return `${API_HOST}${filePath}`;
  };

  const handleCertificateFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setCertificateFile(null);
      return;
    }
    const maxBytes = 8 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setFeedback({ type: 'error', message: 'Only JPG, PNG, WEBP, or PDF files are allowed.' });
      event.target.value = '';
      return;
    }
    if (file.size > maxBytes) {
      setFeedback({ type: 'error', message: 'Certificate file must be 8MB or less.' });
      event.target.value = '';
      return;
    }
    setFeedback({ type: '', message: '' });
    setCertificateFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });

    const error = validate();
    if (error) {
      setFeedback({ type: 'error', message: error });
      return;
    }

    setLoading(true);
    try {
      const newImages = formData.images.filter(img => !img.isExisting).map(img => img.file);
      const existingImages = formData.images.filter(img => img.isExisting).map(img => img.url);
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        issueDate: formData.issueDate,
        expiryDate: formData.expiryDate,
        issuingBody: formData.issuingBody.trim(),
        category: formData.category.trim(),
        certificationNumber: formData.certificationNumber.trim(),
        certificateFile,
        images: newImages,
        existingImages
      };

      const res = editingId
        ? await updateCompanyCertification(companyId, editingId, payload)
        : await addCompanyCertification(companyId, payload);

      if (!res.success) {
        setFeedback({ type: 'error', message: res.error || res.message || 'Failed to save award.' });
        return;
      }

      setFeedback({ type: 'success', message: editingId ? 'Certification updated successfully.' : 'Certification created successfully.' });
      resetForm();
      await loadCertifications();
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (certification) => {
    setEditingId(certification.id);
    setFormData({
      title: certification.title || '',
      description: certification.description || '',
      issueDate: certification.issueDate || '',
      expiryDate: certification.expiryDate || '',
      issuingBody: certification.issuingBody || '',
      category: certification.category || '',
      certificationNumber: certification.certificationNumber || '',
      images: (certification.images || []).map(img => ({ file: null, preview: img.startsWith('http') ? img : `${API_HOST}${img}`, name: 'Existing Image', isExisting: true, url: img }))
    });
    const words = (certification.description || '').trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
    setFeedback({ type: '', message: '' });
    setCertificateFile(null);
  };

  const handleDelete = async (certificationId) => {
    if (!companyId) return;
    setLoading(true);
    try {
      const res = await deleteCompanyCertification(companyId, certificationId);
      if (!res.success) {
        setFeedback({ type: 'error', message: res.error || res.message || 'Failed to delete certification.' });
        return;
      }
      setFeedback({ type: 'success', message: 'Certification deleted successfully.' });
      await loadCertifications();
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (certificationId, archived) => {
    if (!companyId) return;
    setLoading(true);
    try {
      const res = await archiveCompanyCertification(companyId, certificationId, archived);
      if (!res.success) {
        setFeedback({ type: 'error', message: res.error || res.message || 'Failed to update certification status.' });
        return;
      }
      setFeedback({ type: 'success', message: archived ? 'Certification archived.' : 'Certification restored.' });
      await loadCertifications();
    } finally {
      setLoading(false);
    }
  };

  const yearOptions = useMemo(() => {
    const years = awards.map(a => (a.issueDate || '').slice(0, 4)).filter(Boolean);
    return ['all', ...Array.from(new Set(years))];
  }, [awards]);

  const bodyOptions = useMemo(() => {
    const values = awards.map(a => a.issuingBody).filter(Boolean);
    return ['all', ...Array.from(new Set(values))];
  }, [awards]);

  const categoryOptions = useMemo(() => {
    const values = awards.map(a => a.category).filter(Boolean);
    return ['all', ...Array.from(new Set(values))];
  }, [awards]);

  const filteredAwards = useMemo(() => {
    return awards.filter((certification) => {
      const statusMatch = statusFilter === 'all' || (certification.status || 'active') === statusFilter;
      const yearMatch = yearFilter === 'all' || (certification.issueDate || '').startsWith(yearFilter);
      const bodyMatch = bodyFilter === 'all' || certification.issuingBody === bodyFilter;
      const categoryMatch = categoryFilter === 'all' || certification.category === categoryFilter;
      const searchLower = searchTerm.trim().toLowerCase();
      if (!searchLower) {
        return statusMatch && yearMatch && bodyMatch && categoryMatch;
      }
      const haystack = `${certification.title || ''} ${certification.description || ''} ${certification.issuingBody || ''} ${certification.category || ''}`.toLowerCase();
      return statusMatch && yearMatch && bodyMatch && categoryMatch && haystack.includes(searchLower);
    });
  }, [awards, searchTerm, statusFilter, yearFilter, bodyFilter, categoryFilter]);

  const tabs = [
    { label: "Case Study", icon: FileText, path: '/submit-case-study', active: false },
    { label: "Products & Services", icon: Briefcase, path: '/submit-product-service', active: false },
    { label: "Projects", icon: Target, path: '/submit-projects', active: false },
    { label: "Awards", icon: Award, path: '/submit-awards', active: false },
    { label: "Certifications", icon: Award, path: null, active: true },
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
        <span style={{ position: "absolute", top: "12%", left: "6%", fontSize: "11px", color: "#10b981", opacity: 0.18, userSelect: "none" }}>✦</span>
        <span style={{ position: "absolute", top: "18%", right: "8%", fontSize: "9px", color: "#06b6d4", opacity: 0.15, userSelect: "none" }}>◈</span>
        <span style={{ position: "absolute", top: "34%", left: "3%", fontSize: "13px", color: "#10b981", opacity: 0.12, userSelect: "none" }}>❋</span>
        <span style={{ position: "absolute", top: "42%", right: "5%", fontSize: "10px", color: "#10b981", opacity: 0.14, userSelect: "none" }}>✦</span>
        <span style={{ position: "absolute", top: "58%", left: "8%", fontSize: "8px", color: "#06b6d4", opacity: 0.13, userSelect: "none" }}>◈</span>
        <span style={{ position: "absolute", top: "65%", right: "3%", fontSize: "12px", color: "#10b981", opacity: 0.11, userSelect: "none" }}>❋</span>
        <span style={{ position: "absolute", top: "78%", left: "4%", fontSize: "9px", color: "#10b981", opacity: 0.16, userSelect: "none" }}>✦</span>
        <span style={{ position: "absolute", top: "88%", right: "9%", fontSize: "11px", color: "#06b6d4", opacity: 0.12, userSelect: "none" }}>◈</span>
        <span style={{ position: "absolute", top: "26%", left: "48%", fontSize: "7px", color: "#10b981", opacity: 0.09, userSelect: "none", animation: "glyphPulse 5s ease-in-out infinite" }}>✦</span>
        <span style={{ position: "absolute", top: "72%", right: "42%", fontSize: "8px", color: "#06b6d4", opacity: 0.08, userSelect: "none", animation: "glyphPulse 7s ease-in-out infinite 1.5s" }}>◈</span>
      </div>

      <div style={{ position: "relative", zIndex: 10, maxWidth: "860px", margin: "0 auto", padding: "0 24px" }}>

        {/* back */}
        <button onClick={() => navigate(-1)}
          style={{ display: "inline-flex", alignItems: "center", gap: "7px", marginBottom: "24px", fontSize: "12.5px", fontWeight: 500, color: "rgba(255,255,255,0.45)", background: "none", border: "none", cursor: "pointer", padding: 0, transition: "color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.color = "#10b981"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}>
          <ArrowLeft size={14} /> Back
        </button>

        {/* heading */}
        <div style={{ marginBottom: "28px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Award size={20} style={{ color: "#10b981" }} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <div style={{ height: "1px", width: "20px", background: "#10b981" }} />
              <span style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#10b981", textTransform: "uppercase", fontWeight: 600 }}>Submission</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1 }}>Manage Certifications</h1>
          </div>
        </div>

        {/* tabs */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "28px", background: "rgba(255,255,255,0.025)",  border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "5px" }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.label} type="button" onClick={() => tab.path && navigate(tab.path)}
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                  padding: "9px 12px", borderRadius: "10px", border: "none",
                  fontSize: "12px", fontWeight: tab.active ? 600 : 400,
                  cursor: tab.path ? "pointer" : "default",
                  background: tab.active ? "rgba(16,185,129,0.12)" : "transparent",
                  color: tab.active ? "#10b981" : "rgba(255,255,255,0.45)",
                  boxShadow: tab.active ? "0 0 0 1px rgba(16,185,129,0.3)" : "none",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => { if (!tab.active) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; } }}
                onMouseLeave={e => { if (!tab.active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; } }}>
                <Icon size={13} />{tab.label}
              </button>
            );
          })}
        </div>

        {/* feedback banner */}
        {feedback.message && (
          <div style={{
            marginBottom: "18px", padding: "12px 16px", borderRadius: "12px",
            background: feedback.type === 'error' ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)",
            border: `1px solid ${feedback.type === 'error' ? "rgba(239,68,68,0.25)" : "rgba(16,185,129,0.25)"}`,
            display: "flex", alignItems: "center", gap: "10px"
          }}>
            {feedback.type === 'error' ? <AlertCircle size={14} style={{ color: "#ef4444", flexShrink: 0 }} /> : <CheckCircle size={14} style={{ color: "#10b981", flexShrink: 0 }} />}
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: 300 }}>{feedback.message}</span>
            <button onClick={() => setFeedback({ type: '', message: '' })} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", display: "flex" }}><X size={12} /></button>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "48px" }}>

          {/* Core Details */}
          <GlassCard accentRgb="16,185,129">
            <CardHeader icon={<Award size={13} color="#10b981" />} label="Certification Details" accentRgb="16,185,129" />
            <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <Label required>Title</Label>
                <input style={fieldBase} value={formData.title} onChange={e => handleInputChange('title', e.target.value)} placeholder="Certification name / title" onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <Label optional>Issuing Body</Label>
                  <input style={fieldBase} value={formData.issuingBody} onChange={e => handleInputChange('issuingBody', e.target.value)} placeholder="Organisation / Institution" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <Label optional>Category</Label>
                  <input style={fieldBase} value={formData.category} onChange={e => handleInputChange('category', e.target.value)} placeholder="e.g. ISO, Safety, Quality…" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <Label optional>Issue Year</Label>
                  <input
                    type="number"
                    min="1900"
                    max="2099"
                    step="1"
                    style={fieldBase}
                    value={formData.issueDate}
                    onChange={e => handleInputChange('issueDate', e.target.value)}
                    placeholder="2024"
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
                <div>
                  <Label optional>Expiry Year</Label>
                  <input
                    type="number"
                    min="1900"
                    max="2099"
                    step="1"
                    style={fieldBase}
                    value={formData.expiryDate}
                    onChange={e => handleInputChange('expiryDate', e.target.value)}
                    placeholder="2029"
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <Label optional>Certification Number</Label>
                  <input style={fieldBase} value={formData.certificationNumber} onChange={e => handleInputChange('certificationNumber', e.target.value)} placeholder="Certificate ID or number" onFocus={onFocus} onBlur={onBlur} />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Description */}
          <GlassCard accentRgb="16,185,129">
            <CardHeader icon={<FileText size={13} color="#10b981" />} label="Description" accentRgb="16,185,129"
              right={<span style={{ fontSize: "10.5px", color: feedback.type === 'error' && feedback.message.includes('Word') ? "#ef4444" : "rgba(255,255,255,0.35)", fontWeight: 600 }}>{wordCount}/{LIMITS.maxWords} words</span>}
            />
            <div style={{ padding: "16px 22px 20px" }}>
              <Label optional>Description</Label>
              <textarea style={{ ...fieldBase, resize: "none" }} rows={5}
                value={formData.description} onChange={e => handleDescriptionChange(e.target.value)}
                placeholder="Describe the certification, its scope, and significance…"
                onFocus={onFocus} onBlur={onBlur} />
            </div>
          </GlassCard>

          {/* Images */}
          <GlassCard accentRgb="139,92,246">
            <CardHeader icon={<Image size={13} color="#8b5cf6" />} label="Certification Images" accentRgb="139,92,246"
              right={<span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>{formData.images.length}/{LIMITS.maxImages}</span>}
            />
            <div style={{ padding: "16px 22px 20px" }}>
              {/* drop zone */}
              <div
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                style={{ border: `2px dashed ${dragActive ? "rgba(139,92,246,0.6)" : "rgba(139,92,246,0.3)"}`, borderRadius: "14px", padding: "28px 16px", textAlign: "center", background: dragActive ? "rgba(139,92,246,0.08)" : "rgba(255,255,255,0.02)", transition: "all 0.2s", cursor: "pointer" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <Plus size={17} style={{ color: "#8b5cf6" }} />
                </div>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", marginBottom: "4px" }}>Drag & drop images here</p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "12px" }}>JPG, PNG, WebP — max 3MB each</p>
                <input type="file" multiple accept="image/*" onChange={e => handleImageUpload(e.target.files)} id="cert-image-upload" style={{ display: "none" }} />
                <label htmlFor="cert-image-upload"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "7px 18px", borderRadius: "99px", background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.35)", color: "#a78bfa", fontSize: "12px", fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}>
                  <Plus size={12} /> Choose Files
                </label>
              </div>

              {/* previews */}
              {formData.images.length > 0 && (
                <div style={{ marginTop: "14px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "8px" }}>
                  {formData.images.map((img, i) => (
                    <div key={i} style={{ position: "relative", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.09)", background: "rgba(0,0,0,0.2)" }}>
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

          {/* Certificate File Upload */}
          <GlassCard accentRgb="139,92,246">
            <CardHeader icon={<FileText size={13} color="#8b5cf6" />} label="Certificate File" accentRgb="139,92,246" />
            <div style={{ padding: "16px 22px 20px" }}>
              <Label optional>Upload Certificate File (PDF or Image)</Label>
              <input
                type="file"
                accept=".pdf,image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleCertificateFileChange}
                id="cert-file-upload"
                style={{ display: "none" }}
              />
              <label htmlFor="cert-file-upload"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "9px 16px", borderRadius: "99px", background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.35)", color: "#a78bfa", fontSize: "12px", fontWeight: 500, cursor: "pointer", transition: "all 0.2s", marginBottom: "12px" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(139,92,246,0.18)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(139,92,246,0.12)"; }}>
                <Upload size={13} /> Choose Certificate File
              </label>
              {certificateFile && (
                <div style={{ marginTop: "8px", padding: "10px 12px", borderRadius: "8px", background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12px", color: "#a78bfa", fontFamily: "'DM Sans', sans-serif" }}>{certificateFile.name}</span>
                  <button type="button" onClick={() => setCertificateFile(null)} style={{ background: "none", border: "none", color: "#a78bfa", cursor: "pointer", padding: 0, display: "flex" }}><X size={14} /></button>
                </div>
              )}
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "8px" }}>Accepted formats: PDF, JPG, PNG, WebP (max 8MB)</p>
            </div>
          </GlassCard>
          <div style={{ display: "flex", gap: "10px" }}>
            {editingId && (
              <button type="button" onClick={resetForm}
                style={{ flex: 1, padding: "11px", borderRadius: "99px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.55)", fontSize: "13px", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.09)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
                Cancel Edit
              </button>
            )}
            <button type="submit" disabled={loading}
              style={{
                flex: 2, padding: "11px", borderRadius: "99px",
                background: loading ? "rgba(255,255,255,0.05)" : "#10b981",
                border: "none", color: loading ? "rgba(255,255,255,0.3)" : "#fff",
                fontSize: "13px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                boxShadow: loading ? "none" : "0 0 20px rgba(16,185,129,0.3)",
                transition: "all 0.2s"
              }}>
              {loading ? (
                <><div style={{ width: "13px", height: "13px", border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />Saving…</>
              ) : (
                <><Save size={14} />{editingId ? "Update Certification" : "Create Certification"}</>
              )}
            </button>
          </div>
        </form>

        {/* ── CERTIFICATIONS LIBRARY ── */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ height: "1px", width: "20px", background: "#10b981" }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#fff" }}>Certifications Library</h2>
            {!loading && <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", padding: "2px 8px", borderRadius: "99px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>{filteredAwards.length} shown</span>}
          </div>

          {/* filters */}
          <GlassCard style={{ marginBottom: "16px" }}>
            <div style={{ padding: "14px 18px", display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
              <div style={{ position: "relative", flex: "1 1 200px", minWidth: "160px" }}>
                <Search size={12} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
                <input style={{ ...fieldBase, paddingLeft: "32px" }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search certifications…" onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div style={{ flex: "0 0 120px" }}>
                <SelectField value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                  <option value="all">All Status</option>
                </SelectField>
              </div>
              <div style={{ flex: "0 0 120px" }}>
                <SelectField value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
                  {yearOptions.map(o => <option key={o} value={o}>{o === 'all' ? 'All Years' : o}</option>)}
                </SelectField>
              </div>
              <div style={{ flex: "0 0 140px" }}>
                <SelectField value={bodyFilter} onChange={e => setBodyFilter(e.target.value)}>
                  {bodyOptions.map(o => <option key={o} value={o}>{o === 'all' ? 'All Issuers' : o}</option>)}
                </SelectField>
              </div>
              <div style={{ flex: "0 0 140px" }}>
                <SelectField value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                  {categoryOptions.map(o => <option key={o} value={o}>{o === 'all' ? 'All Categories' : o}</option>)}
                </SelectField>
              </div>
            </div>
          </GlassCard>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", borderRadius: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ width: "28px", height: "28px", border: "2px solid rgba(16,185,129,0.2)", borderTopColor: "#10b981", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 10px" }} />
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>Loading certifications…</p>
            </div>
          ) : filteredAwards.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 24px", borderRadius: "16px", background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.09)" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <Award size={18} style={{ color: "#10b981" }} />
              </div>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", marginBottom: "4px" }}>No certifications found.</p>
              <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.25)", fontWeight: 300 }}>Try adjusting filters or add your first certification above.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {filteredAwards.map(award => {
                const isArchived = award.status === 'archived';
                return (
                  <GlassCard key={award.id}>
                    <div style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "5px" }}>
                            <span style={{ padding: "1px 8px", borderRadius: "99px", background: isArchived ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)", border: `1px solid ${isArchived ? "rgba(245,158,11,0.3)" : "rgba(16,185,129,0.3)"}`, fontSize: "9.5px", color: isArchived ? "#f59e0b" : "#10b981", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                              {isArchived ? "Archived" : "Active"}
                            </span>
                            {award.issueDate && <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.35)" }}>{award.issueDate}</span>}
                            {award.expiryDate && <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.35)" }}>— {award.expiryDate}</span>}
                          </div>
                          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{award.title}</h3>
                          {award.issuingBody && (
                            <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.4)", marginTop: "4px", fontWeight: 300 }}>
                              {award.issuingBody}
                              {award.category && ` · ${award.category}`}
                            </p>
                          )}
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px", flexWrap: "wrap" }}>
                            {award.certificationNumber && (
                              <span style={{ padding: "4px 10px", borderRadius: "6px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", fontSize: "10px", color: "#10b981", fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>ID: {award.certificationNumber}</span>
                            )}
                          </div>
                          {award.certificateFile && (
                            <a
                              href={getCertificateFileUrl(award.certificateFile)}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ display: "inline-flex", alignItems: "center", gap: "4px", marginTop: "8px", fontSize: "11px", color: "#10b981" }}
                            >
                              <ExternalLink size={10} />
                              View Certificate
                            </a>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                          <button type="button" onClick={() => handleEdit(award)}
                            style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(59,130,246,0.18)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(59,130,246,0.08)"}>
                            <Edit size={12} />
                          </button>
                          {isArchived ? (
                            <button type="button" onClick={() => handleArchive(award.id, false)}
                              style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}
                              title="Restore"
                              onMouseEnter={e => e.currentTarget.style.background = "rgba(16,185,129,0.18)"}
                              onMouseLeave={e => e.currentTarget.style.background = "rgba(16,185,129,0.08)"}>
                              <RotateCcw size={12} />
                            </button>
                          ) : (
                            <button type="button" onClick={() => handleArchive(award.id, true)}
                              style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", color: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}
                              title="Archive"
                              onMouseEnter={e => e.currentTarget.style.background = "rgba(245,158,11,0.18)"}
                              onMouseLeave={e => e.currentTarget.style.background = "rgba(245,158,11,0.08)"}>
                              <Archive size={12} />
                            </button>
                          )}
                          <button type="button" onClick={() => handleDelete(award.id)}
                            style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.18)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificationsSubmission;

import React, { useState, useEffect } from "react";
import { ChevronDown, Check, X, ArrowLeft, Globe, Mail, Phone, MapPin, FileText, Newspaper, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { updateCompany } from '../utils/companiesAPI';
import { API_BASE_URL } from '../config';
import ScrollingBanner from "./home/ScrollingBanner";

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const regionsData = {
  'United Kingdom & Ireland': ['England','Scotland','Wales','Northern Ireland','Republic Of Ireland'],
  'UK and NI': ['England','Scotland','Wales','Northern Ireland'],
  'UK Mainland Only': ['England','Scotland','Wales'],
  'Scotland': ['Highlands & islands','Grampian','Central','Strathclyde','Lothian','Borders','Dumfries & Galloway'],
  'England': ['Cornwall','Devon','Somerset','Avon','Wiltshire','Hampshire','West Sussex','Surrey','Berkshire','East Sussex','Kent','Essex','Hertfordshire','Buckinghamshire','Suffolk','Norfolk','Cambridgeshire','Northamptonshire','Warwickshire','Oxfordshire','Shropshire','East Riding of Yorkshire','Leicestershire','West Midlands','Gloucestershire','Hereford & Worcester','Staffordshire','Lincolnshire','Nottinghamshire','Derbyshire','Cheshire','South Yorkshire','Greater Manchester','Merseyside','Humberside','West Yorkshire','Lancashire','North Yorkshire','Cleveland','Durham','Cumbria','Tyne & Wear','Northumberland','Central London','North London','West London','South London','East London'],
  'Wales': ['Clwyd','Gwynedd','Powys','Dyfed','Cardiff','Glamorgan'],
  'Ireland': ['All Of Ireland','Northern Ireland Only','Republic Of Ireland Only','Greater Dublin','Southern Counties','Midland Counties','West & North west','Border Counties'],
};

const sectorsMapping = {
  "Construction":      { rgb: "239,68,68",   subsectors: ["Architecture","Civil Engineering","Construction","Facilities Management","Scaffolding","Surveying & Valuation"] },
  "Commercial / Retail":{ rgb: "6,182,212",   subsectors: ["Battery Storage - Large Scale","Carbon Management","Commercial / Retail","Energy Efficiency","Energy Management","HVAC","Lean Management","LED Lighting"] },
  "Industrial":        { rgb: "139,92,246",  subsectors: ["EV Charging","Environmental","HVAC","Industrial","Industrial Cleaning","LED Lighting","Logistics","Manufacturing","Security","Transport"] },
  "Agriculture":       { rgb: "34,197,94",   subsectors: ["Agriculture","Agritech","Carbon Management","Carbon Reduction","ESG Products","ESG Services","Waste Management"] },
  "Domestic":          { rgb: "59,130,246",  subsectors: ["Battery Storage - Small Scale","Cleantech","Domestic","Eco Friendly building products","Electrical Systems","Energy Efficiency","Energy Management","Solar PV","Utility Provision"] },
};

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

const Label = ({ children }) => (
  <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "8px" }}>
    {children}
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

const ModalShell = ({ children, accentRgb = "16,185,129", maxWidth = "600px", onClose, eyebrow, title }) => (
  <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", background: "rgba(4,14,30,0.88)", backdropFilter: "blur(14px)" }} onClick={onClose}>
    <div style={{ width: "100%", maxWidth, maxHeight: "90vh", background: "rgba(4,14,30,0.98)", border: `1px solid rgba(${accentRgb},0.2)`, borderRadius: "22px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 40px 100px rgba(0,0,0,0.7)" }} onClick={e => e.stopPropagation()}>
      <div style={{ height: "2px", background: `linear-gradient(90deg, transparent, rgb(${accentRgb}), transparent)`, flexShrink: 0 }} />
      <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          {eyebrow && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: `rgb(${accentRgb})`, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, marginBottom: "3px" }}>{eyebrow}</p>}
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "#fff" }}>{title}</h3>
        </div>
        <button onClick={onClose} style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${accentRgb},0.5)`; e.currentTarget.style.color = `rgb(${accentRgb})`; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}>
          <X size={13} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
const EditCompanyProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", contactEmail: "", phoneNumber: "", role: "",
    companyName: "", companyContactEmail: "", companyPhoneNumber: "", website: "",
    socialMediaLinks: { linkedin: "", instagram: "", twitter: "", facebook: "" },
    companyDescription: "", companyBio: "", companyAddress: "", postCode: "",
    industrySector: [], productsServices: "", isRecruitmentCompany: "",
    regions: [], companyNews: [], companyLogo: "",
  });

  const [companyDescriptionWordCount, setCompanyDescriptionWordCount] = useState(0);
  const [companyDescriptionError, setCompanyDescriptionError] = useState("");
  const subscriptionPlan = user?.subscription || 'free';
  const descriptionLimit = subscriptionPlan === 'elite' ? 600 : subscriptionPlan === 'professional' ? 300 : 150;
  const newsLimit = subscriptionPlan === 'elite' ? 6 : subscriptionPlan === 'professional' ? 3 : 0;

  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [showSectorModal, setShowSectorModal] = useState(false);
  const [showSubsectorsModal, setShowSubsectorsModal] = useState(false);
  const [selectedMainSector, setSelectedMainSector] = useState(null);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [selectedRegionForSubregions, setSelectedRegionForSubregions] = useState(null);

  const mainSectors = Object.keys(sectorsMapping);

  const getMainSectorFromSubsector = sub => {
    for (const [ms, d] of Object.entries(sectorsMapping)) if (d.subsectors.includes(sub)) return ms;
    return null;
  };

  const resolveCompanyId = (company) => {
    return company?.id || company?.companyId || null;
  };

  const parseMaybeJson = (value, fallback) => {
    if (value === null || value === undefined) return fallback;
    if (typeof value !== "string") return value;
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  };

  const normalizeSocialMediaLinks = (raw) => {
    const parsed = parseMaybeJson(raw, raw);
    const obj = parsed && typeof parsed === "object" ? parsed : {};
    return {
      linkedin: obj.linkedin || "",
      instagram: obj.instagram || "",
      twitter: obj.twitter || "",
      facebook: obj.facebook || "",
    };
  };

  const normalizeCompanyNews = (raw) => {
    const parsed = parseMaybeJson(raw, raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => {
        if (typeof item === "string") return { title: item, link: "" };
        if (!item || typeof item !== "object") return null;
        return {
          title: item.title || item.headline || "",
          link: item.link || item.url || "",
        };
      })
      .filter((item) => item && item.title);
  };

  const hydrateFormData = (company) => {
    if (!company) return;

    const socialMediaLinks = normalizeSocialMediaLinks(company.socialMediaLinks);
    const companyNews = normalizeCompanyNews(company.companyNews);
    const industrySectorParsed = parseMaybeJson(company.industrySector, company.industrySector);
    const regionsParsed = parseMaybeJson(company.regions, company.regions);
    const contact = company.contactPerson && typeof company.contactPerson === "object"
      ? company.contactPerson
      : parseMaybeJson(company.contactPerson, {});

    const normalizedIndustrySector = Array.isArray(industrySectorParsed) ? industrySectorParsed.filter(Boolean) : [];
    const normalizedRegions = Array.isArray(regionsParsed) ? regionsParsed.filter(Boolean) : [];
    const descriptionText = company.companyDescription || company.productsServices || "";
    const contactEmail =
      contact?.email
      || company.contactEmail
      || company.companyContactEmail
      || company.companyEmail
      || "";
    const contactPhone =
      contact?.phoneNumber
      || company.phoneNumber
      || company.companyPhoneNumber
      || company.companyPhone
      || "";
    const companyEmail = company.companyEmail || company.companyContactEmail || contactEmail;
    const companyPhone = company.companyPhone || company.companyPhoneNumber || contactPhone;

    setCompanyId(resolveCompanyId(company));
    setFormData({
      firstName: contact?.firstName || company.firstName || "",
      lastName: contact?.lastName || company.lastName || "",
      contactEmail,
      phoneNumber: contactPhone,
      role: contact?.role || company.role || "",
      companyName: company.companyName || "",
      companyContactEmail: companyEmail,
      companyPhoneNumber: companyPhone,
      website: company.websiteLink || company.companyWebsite || company.website || "",
      socialMediaLinks,
      companyDescription: descriptionText,
      companyBio: company.companyBio || "",
      companyAddress: company.companyAddress || "",
      postCode: company.postCode || company.pinCode || company.pincode || "",
      industrySector: normalizedIndustrySector,
      productsServices: company.productsServices || descriptionText,
      isRecruitmentCompany: company.isRecruitmentCompany || "",
      regions: normalizedRegions,
      companyNews,
      companyLogo: company.companyLogo || "",
    });

    const words = String(descriptionText).trim().split(/\s+/).filter(Boolean);
    setCompanyDescriptionWordCount(words.length);
    setCompanyDescriptionError(words.length > descriptionLimit ? `Word limit exceeded: max ${descriptionLimit} for ${subscriptionPlan} plan.` : "");
  };

  useEffect(() => {
    const fetchCompany = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) { navigate('/auth/login'); return; }
      try {
        let hydrated = false;

        const res = await fetch(`${API_BASE_URL}/companies/my-company`, { headers: { Authorization: `Bearer ${token}` } });
        const result = await res.json();
        if (result.success && result.data) {
          hydrateFormData(result.data);
          hydrated = true;
        }

        if (!hydrated && user?.companyId) {
          const fallbackRes = await fetch(`${API_BASE_URL}/companies/${user.companyId}`, { headers: { Authorization: `Bearer ${token}` } });
          const fallbackResult = await fallbackRes.json();
          if (fallbackResult.success && fallbackResult.data) {
            hydrateFormData(fallbackResult.data);
            hydrated = true;
          }
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchCompany();
  }, [navigate, user?.companyId, descriptionLimit, subscriptionPlan]);

  useEffect(() => {
    const desc = formData.companyDescription || formData.productsServices || "";
    const words = desc.trim().split(/\s+/).filter(Boolean);
    setCompanyDescriptionWordCount(words.length);
    setCompanyDescriptionError(words.length > descriptionLimit ? `Word limit exceeded: max ${descriptionLimit} words for ${subscriptionPlan} plan.` : "");
  }, [descriptionLimit, formData.companyDescription, formData.productsServices]);

  const handleInputChange = (field, value) => setFormData(p => ({ ...p, [field]: value }));

  const [logoFile, setLogoFile] = React.useState(null);
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setFormData(p => ({ ...p, companyLogo: ev.target.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => setFormData(p => ({ ...p, companyLogo: "" }));

  const handleRegionSelect = r => { setSelectedRegionForSubregions(r); setShowRegionModal(true); };
  const handleSubregionSelect = sub => {
    const pair = `${selectedRegionForSubregions} - ${sub}`;
    setFormData(p => ({ ...p, regions: p.regions.includes(pair) ? p.regions.filter(r => r !== pair) : [...p.regions, pair] }));
  };
  const handleRemoveRegion = r => setFormData(p => ({ ...p, regions: p.regions.filter(x => x !== r) }));

  const handleMainSectorSelect = ms => { setSelectedMainSector(ms); setShowSectorModal(false); setShowSubsectorsModal(true); };
  const handleSubsectorSelect = sub => setFormData(p => ({ ...p, industrySector: p.industrySector.includes(sub) ? p.industrySector.filter(s => s !== sub) : [...p.industrySector, sub] }));
  const handleRemoveSector = s => setFormData(p => ({ ...p, industrySector: p.industrySector.filter(x => x !== s) }));

  const addNewsItem = () => { if ((formData.companyNews || []).length >= newsLimit) return; setFormData(p => ({ ...p, companyNews: [...(p.companyNews || []), { title: "", link: "" }] })); };
  const updateNewsItem = (i, f, v) => setFormData(p => { const u = [...(p.companyNews || [])]; u[i] = { ...u[i], [f]: v }; return { ...p, companyNews: u }; });
  const removeNewsItem = i => setFormData(p => { const u = [...(p.companyNews || [])]; u.splice(i, 1); return { ...p, companyNews: u }; });

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!companyId) {
        alert("Could not resolve company profile ID. Please refresh and try again.");
        setSaving(false);
        return;
      }

      const payload = {
        ...formData,
        websiteLink: formData.website || "",
        companyWebsite: formData.website || "",
        companyEmail: formData.companyContactEmail || formData.contactEmail || "",
        companyPhone: formData.companyPhoneNumber || formData.phoneNumber || "",
        contactEmail: formData.contactEmail || formData.companyContactEmail || "",
        phoneNumber: formData.phoneNumber || formData.companyPhoneNumber || "",
        socialMediaLinks: formData.socialMediaLinks || {},
        mainSector: formData.industrySector.length > 0 ? getMainSectorFromSubsector(formData.industrySector[0]) : null,
        contactPerson: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.contactEmail,
          phoneNumber: formData.phoneNumber,
          role: formData.role
        }
      };

      const result = await updateCompany(companyId, payload, logoFile);
      if (result.success) { setSaveSuccess(true); setTimeout(() => { setSaveSuccess(false); navigate('/'); }, 1500); }
      else alert("Failed to save profile: " + result.message);
    } catch (err) { console.error(err); alert("An error occurred. Please try again."); }
    finally { setSaving(false); }
  };

  /* ── LOADING ── */
  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#040e1e", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "40px", height: "40px", border: "2px solid rgba(16,185,129,0.2)", borderTopColor: "#10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#040e1e", fontFamily: "'DM Sans', sans-serif", color: "#fff", paddingTop: "148px", paddingBottom: "80px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: rgba(255,255,255,0.2) !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.35); border-radius: 99px; }
        option { background: #040e1e; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ambient */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-100px", left: "20%", width: "560px", height: "480px", borderRadius: "50%", background: "radial-gradient(ellipse, #10b981, transparent 65%)", opacity: 0.04 }} />
        <div style={{ position: "absolute", bottom: "-120px", right: "10%", width: "480px", height: "400px", borderRadius: "50%", background: "radial-gradient(ellipse, #06b6d4, transparent 65%)", opacity: 0.03 }} />
      </div>

      <div style={{ position: "relative", zIndex: 10, maxWidth: "800px", margin: "0 auto", padding: "28px" }}>

        {/* back */}
        <button onClick={() => navigate('/')}
          style={{ display: "inline-flex", alignItems: "center", gap: "7px", marginBottom: "28px", fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", fontWeight: 500, color: "rgba(255,255,255,0.45)", background: "none", border: "none", cursor: "pointer", padding: 0, transition: "color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.color = "#10b981"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}>
          <ArrowLeft size={14} /> Back to Home
        </button>

        {/* heading */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <div style={{ height: "1px", width: "28px", background: "#10b981" }} />
            <span style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#10b981", textTransform: "uppercase", fontWeight: 600 }}>Profile</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>Edit Company Profile</h1>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
<ScrollingBanner/>
          {/* ── COMPANY INFO ── */}
          <GlassCard accentRgb="6,182,212">
            <CardHeader icon={<Globe size={13} color="#06b6d4" />} label="Company Information" accentRgb="6,182,212" />
            <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <Label>Company Name</Label>
                  <input style={fieldBase} value={formData.companyName} onChange={e => handleInputChange("companyName", e.target.value)} placeholder="Enter company name" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <Label>Company Email</Label>
                  <input style={fieldBase} type="email" value={formData.companyContactEmail} onChange={e => handleInputChange("companyContactEmail", e.target.value)} placeholder="contact@company.com" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <input style={fieldBase} type="tel" value={formData.companyPhoneNumber} onChange={e => handleInputChange("companyPhoneNumber", e.target.value)} placeholder="+44 123 456 7890" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <Label>Website</Label>
                  <input style={fieldBase} type="url" value={formData.website} onChange={e => handleInputChange("website", e.target.value)} placeholder="https://www.company.com" onFocus={onFocus} onBlur={onBlur} />
                </div>
                {[
                  ["linkedin", "LinkedIn URL"],
                  ["instagram", "Instagram URL"],
                  ["twitter", "Twitter/X URL"],
                  ["facebook", "Facebook URL"],
                ].map(([key, label]) => (
                  <div key={key}>
                    <Label>{label}</Label>
                    <input
                      style={fieldBase}
                      type="url"
                      value={formData.socialMediaLinks?.[key] || ""}
                      onChange={e => handleInputChange("socialMediaLinks", { ...(formData.socialMediaLinks || {}), [key]: e.target.value })}
                      placeholder="https://..."
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                  </div>
                ))}
                <div>
                  <Label>Address</Label>
                  <input style={fieldBase} value={formData.companyAddress} onChange={e => handleInputChange("companyAddress", e.target.value)} placeholder="Enter address" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <Label>Post Code</Label>
                  <input style={fieldBase} value={formData.postCode} onChange={e => handleInputChange("postCode", e.target.value)} placeholder="Enter post code" onFocus={onFocus} onBlur={onBlur} />
                </div>
              </div>
              <div>
                <Label>Company Bio</Label>
                <textarea style={{ ...fieldBase, resize: "none" }} rows={2} value={formData.companyBio} onChange={e => handleInputChange("companyBio", e.target.value)} placeholder="Brief company tagline for sector cards…" onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <Label>Recruitment Company?</Label>
                <div style={{ position: "relative" }}>
                  <select 
                    style={{ ...fieldBase, appearance: "none", paddingRight: "36px", cursor: "pointer" }} 
                    value={formData.isRecruitmentCompany} 
                    onChange={e => handleInputChange("isRecruitmentCompany", e.target.value)} 
                    onFocus={onFocus} 
                    onBlur={onBlur}
                  >
                    <option value="">Select an option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  <ChevronDown size={13} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
                </div>
              </div>
              <div>
                <Label>Company Logo</Label>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  {formData.companyLogo ? (
                    <div style={{ position: "relative" }}>
                      <img src={formData.companyLogo} alt="Company Logo" style={{ width: "80px", height: "80px", borderRadius: "12px", objectFit: "cover", border: "1px solid rgba(6,182,212,0.3)" }} />
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        style={{ position: "absolute", top: "-6px", right: "-6px", width: "22px", height: "22px", borderRadius: "50%", background: "#ef4444", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ width: "80px", height: "80px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Globe size={24} color="rgba(255,255,255,0.3)" />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <input type="file" accept="image/*" onChange={handleLogoChange} id="logo-upload" style={{ display: "none" }} />
                    <label htmlFor="logo-upload" style={{ ...fieldBase, display: "inline-flex", alignItems: "center", gap: "8px", cursor: "pointer", width: "auto", padding: "10px 18px" }}>
                      <span>Choose File</span>
                    </label>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "8px" }}>Recommended: 200x200px, PNG or JPG</p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* ── OVERVIEW ── */}
          <GlassCard accentRgb="16,185,129">
            <CardHeader icon={<FileText size={13} color="#10b981" />} label="Company Overview" accentRgb="16,185,129"
              right={
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10.5px", fontWeight: 600, color: companyDescriptionError ? "#ef4444" : "rgba(255,255,255,0.35)" }}>
                  {companyDescriptionWordCount} / {descriptionLimit} words
                </span>
              }
            />
            <div style={{ padding: "16px 22px 20px" }}>
              <textarea style={{ ...fieldBase, resize: "none", borderColor: companyDescriptionError ? "rgba(239,68,68,0.45)" : "rgba(255,255,255,0.09)" }} rows={5}
                value={formData.companyDescription || formData.productsServices}
                onChange={e => { handleInputChange("companyDescription", e.target.value); handleInputChange("productsServices", e.target.value); }}
                placeholder={`Tell us about your company… (max ${descriptionLimit} words)`}
                onFocus={e => { e.currentTarget.style.borderColor = companyDescriptionError ? "rgba(239,68,68,0.6)" : "rgba(16,185,129,0.5)"; e.currentTarget.style.background = "rgba(16,185,129,0.04)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = companyDescriptionError ? "rgba(239,68,68,0.45)" : "rgba(255,255,255,0.09)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              />
              {companyDescriptionError && <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "6px", fontWeight: 300 }}>{companyDescriptionError}</p>}
            </div>
          </GlassCard>

          {/* ── SECTORS ── */}
          <GlassCard accentRgb="16,185,129">
            <CardHeader icon={<span style={{ fontSize: "12px" }}>⚡</span>} label="Industry Sector" accentRgb="16,185,129" />
            <div style={{ padding: "16px 22px 20px" }}>
              <button type="button" onClick={() => setShowSectorModal(true)}
                style={{ ...fieldBase, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left" }}
                onFocus={onFocus} onBlur={onBlur}>
                <span style={{ color: formData.industrySector.length > 0 ? "#fff" : "rgba(255,255,255,0.2)" }}>
                  {formData.industrySector.length > 0 ? `${formData.industrySector.length} sector(s) selected` : "Select industry sectors"}
                </span>
                <ChevronDown size={13} style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
              </button>
              {formData.industrySector.length > 0 && (
                <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {formData.industrySector.map(s => {
                    const ms = getMainSectorFromSubsector(s);
                    const rgb = sectorsMapping[ms]?.rgb || "16,185,129";
                    return (
                      <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 8px", borderRadius: "99px", background: `rgba(${rgb},0.1)`, border: `1px solid rgba(${rgb},0.3)`, fontSize: "11px", color: `rgb(${rgb})` }}>
                        {s}
                        <button type="button" onClick={() => handleRemoveSector(s)} style={{ background: "none", border: "none", cursor: "pointer", color: `rgba(${rgb},0.6)`, display: "flex", padding: 0 }}><X size={9} /></button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </GlassCard>

          {/* ── REGIONS ── */}
          <GlassCard accentRgb="245,158,11">
            <CardHeader icon={<MapPin size={13} color="#f59e0b" />} label="Regions of Operation" accentRgb="245,158,11" />
            <div style={{ padding: "16px 22px 20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "7px", marginBottom: "12px" }}>
                {Object.keys(regionsData).map(region => {
                  const sel = formData.regions.some(r => r.startsWith(region + " - "));
                  return (
                    <button key={region} type="button" onClick={() => handleRegionSelect(region)}
                      style={{ padding: "8px 12px", borderRadius: "10px", border: `1px solid ${sel ? "rgba(245,158,11,0.45)" : "rgba(255,255,255,0.09)"}`, background: sel ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.025)", color: sel ? "#f59e0b" : "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif", fontSize: "11.5px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.15s" }}>
                      {region} {sel && <Check size={11} />}
                    </button>
                  );
                })}
              </div>
              {formData.regions.length > 0 && (
                <div style={{ padding: "10px 12px", borderRadius: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "8px" }}>Selected</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {formData.regions.map(r => (
                      <span key={r} style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 8px", borderRadius: "99px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", fontSize: "11px", color: "#f59e0b" }}>
                        {r}
                        <button type="button" onClick={() => handleRemoveRegion(r)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(245,158,11,0.6)", display: "flex", padding: 0 }}><X size={9} /></button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </GlassCard>

          {/* ── COMPANY NEWS ── */}
          <GlassCard accentRgb="59,130,246">
            <CardHeader icon={<Newspaper size={13} color="#3b82f6" />} label="Company News" accentRgb="59,130,246"
              right={
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10.5px", color: "rgba(255,255,255,0.35)" }}>
                  {(formData.companyNews || []).length}/{newsLimit} ({subscriptionPlan})
                </span>
              }
            />
            <div style={{ padding: "16px 22px 20px" }}>
              {newsLimit > 0 ? (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {(formData.companyNews || []).map((news, i) => (
                      <div key={i} style={{ padding: "14px", borderRadius: "12px", background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                          <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#3b82f6" }}>News #{i + 1}</span>
                          <button type="button" onClick={() => removeNewsItem(i)} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "6px", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px" }}><X size={11} /></button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <div>
                            <Label>Title</Label>
                            <input style={fieldBase} value={news.title} onChange={e => updateNewsItem(i, "title", e.target.value)} placeholder="News headline" onFocus={onFocus} onBlur={onBlur} />
                          </div>
                          <div>
                            <Label>Link (optional)</Label>
                            <input style={fieldBase} type="url" value={news.link || ""} onChange={e => updateNewsItem(i, "link", e.target.value)} placeholder="https://…" onFocus={onFocus} onBlur={onBlur} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {(formData.companyNews || []).length < newsLimit && (
                    <button type="button" onClick={addNewsItem}
                      style={{ marginTop: "10px", width: "100%", padding: "10px", borderRadius: "10px", border: "2px dashed rgba(59,130,246,0.3)", background: "transparent", color: "#3b82f6", fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", cursor: "pointer", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(59,130,246,0.6)"; e.currentTarget.style.background = "rgba(59,130,246,0.05)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)"; e.currentTarget.style.background = "transparent"; }}>
                      + Add News Item
                    </button>
                  )}
                </>
              ) : (
                <div style={{ padding: "20px", textAlign: "center", borderRadius: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", fontWeight: 300, marginBottom: "5px" }}>Company news is available on Professional and Elite plans.</p>
                  <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.28)", fontWeight: 300 }}>Upgrade your subscription to share news updates.</p>
                </div>
              )}
            </div>
          </GlassCard>

          {/* ── CONTACT PERSON ── */}
          <GlassCard accentRgb="139,92,246">
            <CardHeader icon={<User size={13} color="#8b5cf6" />} label="Contact Person" accentRgb="139,92,246" />
            <div style={{ padding: "20px 22px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              {[
                { field: "firstName", label: "First Name", placeholder: "First name" },
                { field: "lastName", label: "Last Name", placeholder: "Last name" },
                { field: "phoneNumber", label: "Phone", placeholder: "+44 123 456 7890" },
                { field: "contactEmail", label: "Email", placeholder: "contact@email.com", type: "email" },
                { field: "role", label: "Role", placeholder: "e.g. Director" },
              ].map(({ field, label, placeholder, type = "text" }) => (
                <div key={field} style={field === "role" ? { gridColumn: "span 2" } : {}}>
                  <Label>{label}</Label>
                  <input style={fieldBase} type={type} value={formData[field]} onChange={e => handleInputChange(field, e.target.value)} placeholder={placeholder} onFocus={onFocus} onBlur={onBlur} />
                </div>
              ))}
            </div>
          </GlassCard>

          {/* ── ACTIONS ── */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "4px" }}>
            <button type="button" onClick={() => navigate(-1)}
              style={{ padding: "10px 24px", borderRadius: "99px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.09)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
              Cancel
            </button>
            <button type="button" onClick={handleSave} disabled={saving || !!companyDescriptionError}
              style={{ padding: "10px 28px", borderRadius: "99px", background: saveSuccess ? "rgba(16,185,129,0.8)" : (saving || companyDescriptionError) ? "rgba(255,255,255,0.05)" : "#10b981", border: "none", color: (saving || companyDescriptionError) ? "rgba(255,255,255,0.3)" : "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, cursor: (saving || companyDescriptionError) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: (saving || companyDescriptionError) ? "none" : "0 0 20px rgba(16,185,129,0.3)", transition: "all 0.2s" }}>
              {saving ? (
                <><div style={{ width: "13px", height: "13px", border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />Saving…</>
              ) : saveSuccess ? (
                <><Check size={13} />Saved!</>
              ) : "Save Profile"}
            </button>
          </div>
        </div>
      </div>

      {/* ── REGION MODAL ── */}
      {showRegionModal && selectedRegionForSubregions && (
        <ModalShell accentRgb="245,158,11" maxWidth="580px" onClose={() => setShowRegionModal(false)} eyebrow="Subregions" title={selectedRegionForSubregions}>
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", scrollbarWidth: "thin", scrollbarColor: "rgba(245,158,11,0.4) rgba(255,255,255,0.02)" }}>
            {regionsData[selectedRegionForSubregions]?.map(sub => {
              const sel = formData.regions.includes(`${selectedRegionForSubregions} - ${sub}`);
              return (
                <button key={sub} type="button" onClick={() => handleSubregionSelect(sub)}
                  style={{ padding: "8px 11px", borderRadius: "9px", border: `1px solid ${sel ? "rgba(245,158,11,0.45)" : "rgba(255,255,255,0.08)"}`, background: sel ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.025)", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: sel ? "#f59e0b" : "rgba(255,255,255,0.6)", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "7px", transition: "all 0.15s" }}>
                  <div style={{ width: "13px", height: "13px", borderRadius: "4px", border: `1.5px solid ${sel ? "#f59e0b" : "rgba(255,255,255,0.2)"}`, background: sel ? "rgba(245,158,11,0.2)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {sel && <Check size={8} color="#f59e0b" />}
                  </div>
                  {sub}
                </button>
              );
            })}
          </div>
          <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
            <button onClick={() => setShowRegionModal(false)} style={{ padding: "8px 22px", borderRadius: "99px", background: "#f59e0b", border: "none", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", fontWeight: 600, cursor: "pointer" }}>Done</button>
          </div>
        </ModalShell>
      )}

      {/* ── SECTOR MODAL ── */}
      {showSectorModal && (
        <ModalShell accentRgb="16,185,129" maxWidth="520px" onClose={() => setShowSectorModal(false)} eyebrow="Classification" title="Select Industry Sector">
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px" }}>
            {mainSectors.map(ms => {
              const rgb = sectorsMapping[ms].rgb;
              return (
                <button key={ms} type="button" onClick={() => handleMainSectorSelect(ms)}
                  style={{ padding: "12px 14px", borderRadius: "12px", border: `1px solid rgba(${rgb},0.25)`, background: `rgba(${rgb},0.06)`, fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 500, color: "#fff", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = `rgba(${rgb},0.14)`}
                  onMouseLeave={e => e.currentTarget.style.background = `rgba(${rgb},0.06)`}>
                  {ms}
                  <ChevronDown size={12} style={{ color: `rgba(${rgb},0.6)`, transform: "rotate(-90deg)", flexShrink: 0 }} />
                </button>
              );
            })}
          </div>
          <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
            <button onClick={() => setShowSectorModal(false)} style={{ padding: "8px 22px", borderRadius: "99px", background: "#10b981", border: "none", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", fontWeight: 600, cursor: "pointer" }}>Done</button>
          </div>
        </ModalShell>
      )}

      {/* ── SUBSECTOR MODAL ── */}
      {showSubsectorsModal && selectedMainSector && (
        <ModalShell accentRgb={sectorsMapping[selectedMainSector]?.rgb || "16,185,129"} maxWidth="560px" onClose={() => { setShowSubsectorsModal(false); setSelectedMainSector(null); setShowSectorModal(true); }} eyebrow="Subcategories" title={selectedMainSector}>
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", scrollbarWidth: "thin" }}>
            {sectorsMapping[selectedMainSector]?.subsectors.map(sub => {
              const sel = formData.industrySector.includes(sub);
              const rgb = sectorsMapping[selectedMainSector].rgb;
              return (
                <button key={sub} type="button" onClick={() => handleSubsectorSelect(sub)}
                  style={{ padding: "8px 11px", borderRadius: "9px", border: `1px solid ${sel ? `rgba(${rgb},0.45)` : "rgba(255,255,255,0.08)"}`, background: sel ? `rgba(${rgb},0.1)` : "rgba(255,255,255,0.025)", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: sel ? `rgb(${rgb})` : "rgba(255,255,255,0.6)", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "7px", transition: "all 0.15s" }}>
                  <div style={{ width: "13px", height: "13px", borderRadius: "4px", border: `1.5px solid ${sel ? `rgb(${rgb})` : "rgba(255,255,255,0.2)"}`, background: sel ? `rgba(${rgb},0.2)` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {sel && <Check size={8} style={{ color: `rgb(${rgb})` }} />}
                  </div>
                  {sub}
                </button>
              );
            })}
          </div>
          <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", flexShrink: 0 }}>
            <button onClick={() => { setShowSubsectorsModal(false); setSelectedMainSector(null); setShowSectorModal(true); }}
              style={{ padding: "8px 18px", borderRadius: "99px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", cursor: "pointer" }}>
              ← Back
            </button>
            <button onClick={() => { setShowSubsectorsModal(false); setSelectedMainSector(null); }}
              style={{ padding: "8px 22px", borderRadius: "99px", background: `rgb(${sectorsMapping[selectedMainSector].rgb})`, border: "none", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", fontWeight: 600, cursor: "pointer" }}>
              Done
            </button>
          </div>
        </ModalShell>
      )}
    </div>
  );
};

export default EditCompanyProfilePage;

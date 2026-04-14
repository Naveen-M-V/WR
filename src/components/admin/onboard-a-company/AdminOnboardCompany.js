import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check, ChevronDown, X, Building2, User, Mail, Phone,
  Globe, MapPin, FileText, CreditCard, Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../contexts/AuthContext";
import { adminOnboardCompany } from "../../../utils/companiesAPI";

/* ─────────────────────────────────────────────────────────────
   DESIGN TOKENS
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
const fieldWithIcon = { ...fieldBase, paddingLeft: "38px" };
const onFocus = (e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)"; e.currentTarget.style.background = "rgba(16,185,129,0.04)"; };
const onBlur  = (e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; };

const Label = ({ children, required }) => (
  <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "8px" }}>
    {children}{required && <span style={{ color: "#ef4444", marginLeft: "3px" }}>*</span>}
  </label>
);

const FieldWrap = ({ children }) => (
  <div style={{ position: "relative" }}>{children}</div>
);

const IconSlot = ({ icon: Icon }) => (
  <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "rgba(255,255,255,0.3)", display: "flex" }}>
    <Icon size={14} />
  </div>
);

const GlassCard = ({ children, accentRgb, style = {} }) => (
  <div style={{
    background: "rgba(255,255,255,0.025)",
    border: `1px solid ${accentRgb ? `rgba(${accentRgb},0.18)` : "rgba(255,255,255,0.07)"}`,
    borderRadius: "18px",
    overflow: "hidden",
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
    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "15px", fontWeight: 700, color: "#fff" }}>{label}</span>
  </div>
);

/* Eye toggle SVG */
const EyeIcon = ({ open }) => open ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-3.72-3.72L3 3"/>
    <path d="M1 1l22 22"/>
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
const AdminOnboardCompany = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const timeoutRef = React.useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [overviewWordCount, setOverviewWordCount] = useState(0);

  React.useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  const [userData, setUserData] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [companyData, setCompanyData] = useState({
    companyName: "", companyLocation: "", companyEmail: "", companyPhone: "",
    companyAddress: "",
    postCode: "",
    companyWebsite: "", companyBio: "", companyOverview: "",
    socialMediaLinks: { linkedin: "", instagram: "", twitter: "", facebook: "" },
    selectedSectors: [], companyNews: [], selectedSubsectors: {},
    companyLogo: null, regions: []
  });

  const isValidHttpUrl = (value) => {
    if (!value || !String(value).trim()) return true;
    try {
      const parsed = new URL(String(value).trim());
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const [showSubsectorModal, setShowSubsectorModal] = useState(false);
  const [activeSectorForModal, setActiveSectorForModal] = useState(null);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [selectedRegionForSubregions, setSelectedRegionForSubregions] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [subscriptionData, setSubscriptionData] = useState({ plan: "professional", months: 12 });
  const overviewWordLimit = subscriptionData.plan === "elite" ? 600 : 300;
  const maxNews = useMemo(() => subscriptionData.plan === "elite" ? 6 : 3, [subscriptionData.plan]);

  const regionsData = {
    'United Kingdom & Ireland': ['England','Scotland','Wales','Northern Ireland','Republic Of Ireland'],
    'UK and NI': ['England','Scotland','Wales','Northern Ireland'],
    'UK Mainland Only': ['England','Scotland','Wales'],
    'Scotland': ['Highlands & islands','Grampian','Central','Strathclyde','Lothian','Borders','Dumfries & Galloway'],
    'England': ['Cornwall','Devon','Somerset','Avon','Wiltshire','Hampshire','West Sussex','Surrey','Berkshire','East Sussex','Kent','Essex','Hertfordshire','Buckinghamshire','Suffolk','Norfolk','Cambridgeshire','Northamptonshire','Warwickshire','Oxfordshire','Shropshire','East Riding of Yorkshire','Leicestershire','West Midlands','Glouchestershire','Hereford & Worcester','Staffordshire','Lincolnshire','Nottinghamshire','Derbyshire','Cheshire','South Yorkshire','Greater Manchester','Merseyside','Humberside','West Yorkshire','Lancashire','North Yorkshire','Cleveland','Durham','Cumbria','Tyne & Wear','Northumberland','Central London','North London','West London','South London','East London'],
    'Wales': ['Clywd','Gywwedd','Powys','Dyfed','Cardiff','Glamorgan'],
    'Ireland': ['All Of Ireland','Northern Ireland Only','Republic Of Ireland Only','Greater Dublin','Southern Counties','Midland Counties','West & North west','Border Counties'],
  };

  const mainSectors = useMemo(() => ({
    "Construction": { subcategories: ["Construction","Eco Friendly building products","Electrical Systems","Groundwork and Civils","Mechanical and Electrical","Passivhaus","Planning and Consultative Services","Solar PV - Ground Mounted","Sustainable Construction","Waste Management"] },
    "Agriculture":  { subcategories: ["Agriculture","Agritech","Carbon Management","Carbon Reduction","ESG Products","ESG Services","Waste Management"] },
    "Domestic":     { subcategories: ["Battery Storage - Small Scale","Cleantech","Domestic","Eco Friendly building products","Electrical Systems","Energy Efficiency","Energy Management","EV Charging","Solar PV","Utility Provision"] },
    "Industrial":   { subcategories: ["AI","Finance & Funding","Green Hydrogen","Industrial","Mechanical and Electrical","Planning and Consultative Services","Water & Marine","Wind Power"] },
    "Commercial and Retail": { subcategories: ["Battery Storage - Large Scale","Carbon Management","Commercial / Retail","Energy Efficiency","Energy Management","HVAC","Lean Management","LED Lighting"] },
  }), []);

  const SECTOR_ACCENT = {
    "Construction": "245,158,11",
    "Agriculture": "34,197,94",
    "Domestic": "59,130,246",
    "Industrial": "249,115,22",
    "Commercial and Retail": "139,92,246",
  };

  const monthOptions = [1, 3, 6, 12, 24, 36];

  /* handlers */
  const handleUserDataChange    = (f, v) => setUserData(p => ({ ...p, [f]: v }));
  const handleCompanyDataChange = (f, v) => setCompanyData(p => ({ ...p, [f]: v }));
  const handleSubscriptionChange = (f, v) => setSubscriptionData(p => ({ ...p, [f]: v }));

  const handleRegionSelect = (region) => { setSelectedRegionForSubregions(region); setShowRegionModal(true); };
  const handleSubregionSelect = (sub) => {
    const pair = `${selectedRegionForSubregions} - ${sub}`;
    setCompanyData(p => ({ ...p, regions: p.regions.includes(pair) ? p.regions.filter(r => r !== pair) : [...p.regions, pair] }));
  };
  const handleRemoveRegion = (r) => setCompanyData(p => ({ ...p, regions: p.regions.filter(x => x !== r) }));

  const handleCompanyOverviewChange = (e) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const prev = companyData.companyOverview || "";
    const prevWords = prev.trim().split(/\s+/).filter(Boolean).length;
    if (words <= overviewWordLimit || text.length < prev.length || words <= prevWords) {
      setOverviewWordCount(words);
      handleCompanyDataChange("companyOverview", text);
      if (words <= overviewWordLimit) setError("");
    } else {
      setError(`Word limit reached: Maximum ${overviewWordLimit} words allowed.`);
    }
  };

  const handleSectorToggle = (sector) => {
    setActiveSectorForModal(sector);
    setShowSubsectorModal(true);
    setCompanyData(p => p.selectedSectors.includes(sector) ? p : {
      ...p, selectedSectors: [...p.selectedSectors, sector],
      selectedSubsectors: { ...p.selectedSubsectors, [sector]: [] }
    });
  };
  const handleSubsectorToggle = (sector, sub) => {
    setCompanyData(p => {
      const cur = p.selectedSubsectors[sector] || [];
      return { ...p, selectedSubsectors: { ...p.selectedSubsectors, [sector]: cur.includes(sub) ? cur.filter(s => s !== sub) : [...cur, sub] } };
    });
  };
  const handleRemoveSector    = (s) => setCompanyData(p => ({ ...p, selectedSectors: p.selectedSectors.filter(x => x !== s), selectedSubsectors: { ...p.selectedSubsectors, [s]: [] } }));
  const handleRemoveSubsector = (sector, sub) => setCompanyData(p => ({ ...p, selectedSubsectors: { ...p.selectedSubsectors, [sector]: (p.selectedSubsectors[sector] || []).filter(s => s !== sub) } }));

  const addNewsItem    = () => { if ((companyData.companyNews || []).length >= maxNews) return; handleCompanyDataChange("companyNews", [...(companyData.companyNews || []), { title: "", link: "" }]); };
  const updateNewsItem = (i, f, v) => { const u = [...(companyData.companyNews || [])]; u[i] = { ...u[i], [f]: v }; handleCompanyDataChange("companyNews", u); };
  const removeNewsItem = (i) => { const u = [...(companyData.companyNews || [])]; u.splice(i, 1); handleCompanyDataChange("companyNews", u); };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Logo must be under 5MB"); return; }
    if (!file.type.startsWith("image/")) { setError("Please upload an image file"); return; }
    setCompanyData(p => ({ ...p, companyLogo: file }));
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const validateStep1 = () => {
    if (!userData.username || !userData.email || !userData.password) { setError("Please fill in all user account fields"); return false; }
    if (userData.password !== userData.confirmPassword) { setError("Passwords do not match"); return false; }
    if (userData.password.length < 8) { setError("Password must be at least 8 characters"); return false; }
    return true;
  };
  const validateStep2 = () => {
    if (!companyData.companyName || !companyData.companyEmail || !companyData.companyLocation || !companyData.companyAddress) { setError("Please fill in all required company fields"); return false; }
    if (!isValidHttpUrl(companyData.companyWebsite)) { setError("Please enter a valid company website URL"); return false; }
    const hasInvalidSocial = Object.values(companyData.socialMediaLinks || {}).some(link => !isValidHttpUrl(link));
    if (hasInvalidSocial) { setError("Please enter valid social media URLs"); return false; }
    if (!companyData.selectedSectors.length) { setError("Please select at least one sector"); return false; }
    return true;
  };
  const handleNextStep = () => {
    setError("");
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
    else if (currentStep === 2 && validateStep2()) setCurrentStep(3);
  };
  const handlePrevStep = () => { setError(""); setCurrentStep(p => p - 1); };

  const handleSubmit = async () => {
    if (!isAuthenticated || user?.role !== "admin") { navigate("/"); return; }
    setError(""); setSuccessMessage(""); setLoading(true);
    try {
      const fd = new FormData();
      fd.append("username", userData.username);
      fd.append("email", userData.email);
      fd.append("password", userData.password);
      fd.append("companyName", companyData.companyName);
      fd.append("companyLocation", companyData.companyLocation);
      fd.append("companyAddress", companyData.companyAddress || "");
      fd.append("companyEmail", companyData.companyEmail);
      fd.append("companyPhone", companyData.companyPhone);
      fd.append("postCode", companyData.postCode || "");
      fd.append("companyWebsite", companyData.companyWebsite);
      fd.append("websiteLink", companyData.companyWebsite || "");
      fd.append("socialMediaLinks", JSON.stringify(companyData.socialMediaLinks || {}));
      fd.append("companyBio", companyData.companyBio || "");
      fd.append("companyOverview", companyData.companyOverview);
      fd.append("companyNews", JSON.stringify((companyData.companyNews || []).filter(n => (n.title || "").trim())));
      fd.append("selectedSectors", JSON.stringify(companyData.selectedSectors));
      fd.append("selectedSubsectors", JSON.stringify(companyData.selectedSubsectors));
      fd.append("regions", JSON.stringify(companyData.regions));
      fd.append("subscriptionPlan", subscriptionData.plan);
      fd.append("subscriptionMonths", subscriptionData.months.toString());
      if (companyData.companyLogo) fd.append("companyLogo", companyData.companyLogo);

      const result = await adminOnboardCompany(fd);
      if (!result.success) { setError(result.error || result.message || "Failed to onboard company"); setLoading(false); return; }
      setSuccessMessage(`Company "${companyData.companyName}" onboarded successfully!`);
      timeoutRef.current = setTimeout(() => {
        const companyId = result.data?.data?.company?.id || result.data?.company?.id;
        if (companyId) navigate(`/company/${companyId}`);
        else setError("Company created but could not redirect. Please check the company list.");
      }, 2000);
    } catch (e) {
      setError("Failed to onboard company. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── ACCESS DENIED ── */
  if (!isAuthenticated || user?.role !== "admin") return (
    <div style={{ minHeight: "100vh", background: "#040e1e", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <GlassCard style={{ maxWidth: "380px", width: "100%", textAlign: "center", padding: "48px 32px" }}>
        <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <X size={22} color="#ef4444" />
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>Access Denied</h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.4)", fontWeight: 300, marginBottom: "24px" }}>Admin privileges required.</p>
        <button onClick={() => navigate("/")} style={{ width: "100%", padding: "10px", borderRadius: "12px", background: "#10b981", border: "none", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Go Home</button>
      </GlassCard>
    </div>
  );

  /* ── STEP LABELS ── */
  const steps = [
    { n: 1, label: "User Account", icon: User, accentRgb: "16,185,129" },
    { n: 2, label: "Company Details", icon: Building2, accentRgb: "6,182,212" },
    { n: 3, label: "Subscription", icon: CreditCard, accentRgb: "139,92,246" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#040e1e", fontFamily: "'DM Sans', sans-serif", color: "#fff", paddingTop: "172px", paddingBottom: "80px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: rgba(255,255,255,0.2) !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        ::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.35); border-radius: 99px; }
        option { background: #040e1e; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ambient glows */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-100px", left: "20%", width: "560px", height: "480px", borderRadius: "50%", background: "radial-gradient(ellipse, #10b981, transparent 65%)", opacity: 0.04 }} />
        <div style={{ position: "absolute", bottom: "-120px", right: "10%", width: "480px", height: "400px", borderRadius: "50%", background: "radial-gradient(ellipse, #8b5cf6, transparent 65%)", opacity: 0.03 }} />
      </div>

      <div style={{ position: "relative", zIndex: 10, maxWidth: "900px", margin: "0 auto", padding: "0 32px" }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ marginBottom: "36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <div style={{ height: "1px", width: "28px", background: "#10b981" }} />
            <span style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#10b981", textTransform: "uppercase", fontWeight: 600 }}>Admin Portal</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: "6px" }}>
            Onboard a Company
          </h1>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>Create a new company account and profile</p>
        </div>

        {/* ── STEP PROGRESS ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "0", marginBottom: "36px" }}>
          {steps.map((s, i) => {
            const Icon = s.icon;
            const done = currentStep > s.n;
            const active = currentStep === s.n;
            return (
              <React.Fragment key={s.n}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", background: done ? "#10b981" : active ? `rgba(${s.accentRgb},0.15)` : "rgba(255,255,255,0.05)", border: `2px solid ${done ? "#10b981" : active ? `rgba(${s.accentRgb},0.6)` : "rgba(255,255,255,0.12)"}` }}>
                    {done ? <Check size={16} color="#fff" /> : <Icon size={15} style={{ color: active ? `rgb(${s.accentRgb})` : "rgba(255,255,255,0.3)" }} />}
                  </div>
                  <span style={{ fontSize: "10px", fontWeight: active ? 600 : 400, color: active ? `rgb(${s.accentRgb})` : done ? "#10b981" : "rgba(255,255,255,0.3)", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ flex: 1, height: "2px", margin: "0 8px", marginBottom: "28px", background: currentStep > s.n ? "#10b981" : "rgba(255,255,255,0.08)", transition: "background 0.3s" }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* ── NOTIFICATIONS ── */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              style={{ marginBottom: "20px", padding: "12px 16px", borderRadius: "12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", gap: "10px" }}>
              <X size={14} color="#ef4444" />
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: 300 }}>{error}</span>
            </motion.div>
          )}
          {successMessage && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              style={{ marginBottom: "20px", padding: "12px 16px", borderRadius: "12px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", display: "flex", alignItems: "center", gap: "10px" }}>
              <Check size={14} color="#10b981" />
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: 300 }}>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── STEP 1: USER ACCOUNT ── */}
        {currentStep === 1 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <GlassCard accentRgb="16,185,129">
              <CardHeader icon={<User size={14} color="#10b981" />} label="User Account Details" accentRgb="16,185,129" />
              <div style={{ padding: "24px 24px 28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
                <div>
                  <Label required>Username</Label>
                  <FieldWrap>
                    <IconSlot icon={User} />
                    <input style={fieldWithIcon} value={userData.username} onChange={e => handleUserDataChange("username", e.target.value)} placeholder="e.g. johndoe" onFocus={onFocus} onBlur={onBlur} />
                  </FieldWrap>
                </div>
                <div>
                  <Label required>Email Address</Label>
                  <FieldWrap>
                    <IconSlot icon={Mail} />
                    <input style={fieldWithIcon} type="email" value={userData.email} onChange={e => handleUserDataChange("email", e.target.value)} placeholder="user@company.com" onFocus={onFocus} onBlur={onBlur} />
                  </FieldWrap>
                </div>
                <div>
                  <Label required>Password</Label>
                  <FieldWrap>
                    <input style={{ ...fieldBase, paddingRight: "40px" }} type={showPassword ? "text" : "password"} value={userData.password} onChange={e => handleUserDataChange("password", e.target.value)} placeholder="Min 8 characters" onFocus={onFocus} onBlur={onBlur} />
                    <button type="button" onClick={() => setShowPassword(p => !p)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", display: "flex" }}>
                      <EyeIcon open={showPassword} />
                    </button>
                  </FieldWrap>
                </div>
                <div>
                  <Label required>Confirm Password</Label>
                  <FieldWrap>
                    <input style={{ ...fieldBase, paddingRight: "40px" }} type={showConfirmPassword ? "text" : "password"} value={userData.confirmPassword} onChange={e => handleUserDataChange("confirmPassword", e.target.value)} placeholder="Re-enter password" onFocus={onFocus} onBlur={onBlur} />
                    <button type="button" onClick={() => setShowConfirmPassword(p => !p)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", display: "flex" }}>
                      <EyeIcon open={showConfirmPassword} />
                    </button>
                  </FieldWrap>
                </div>
              </div>
              <div style={{ padding: "0 24px 24px", display: "flex", justifyContent: "flex-end" }}>
                <button onClick={handleNextStep} style={{ padding: "10px 28px", borderRadius: "99px", background: "#10b981", border: "none", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, cursor: "pointer", boxShadow: "0 0 20px rgba(16,185,129,0.3)" }}>
                  Next Step →
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* ── STEP 2: COMPANY DETAILS ── */}
        {currentStep === 2 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Basic Info */}
            <GlassCard accentRgb="6,182,212">
              <CardHeader icon={<Building2 size={14} color="#06b6d4" />} label="Company Information" accentRgb="6,182,212" />
              <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
                <div>
                  <Label required>Company Name</Label>
                  <input style={fieldBase} value={companyData.companyName} onChange={e => handleCompanyDataChange("companyName", e.target.value)} placeholder="Enter company name" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <Label required>Location</Label>
                  <FieldWrap>
                    <IconSlot icon={MapPin} />
                    <input style={fieldWithIcon} value={companyData.companyLocation} onChange={e => handleCompanyDataChange("companyLocation", e.target.value)} placeholder="City, Country" onFocus={onFocus} onBlur={onBlur} />
                  </FieldWrap>
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <Label required>Company Address</Label>
                  <FieldWrap>
                    <IconSlot icon={MapPin} />
                    <input style={fieldWithIcon} value={companyData.companyAddress || ""} onChange={e => handleCompanyDataChange("companyAddress", e.target.value)} placeholder="Enter full company address" onFocus={onFocus} onBlur={onBlur} />
                  </FieldWrap>
                </div>
                <div>
                  <Label required>Company Email</Label>
                  <FieldWrap>
                    <IconSlot icon={Mail} />
                    <input style={fieldWithIcon} type="email" value={companyData.companyEmail} onChange={e => handleCompanyDataChange("companyEmail", e.target.value)} placeholder="contact@company.com" onFocus={onFocus} onBlur={onBlur} />
                  </FieldWrap>
                </div>
                <div>
                  <Label>Phone</Label>
                  <FieldWrap>
                    <IconSlot icon={Phone} />
                    <input style={fieldWithIcon} type="tel" value={companyData.companyPhone} onChange={e => { const v = e.target.value.replace(/[^0-9+\-()\s]/g, ''); handleCompanyDataChange("companyPhone", v); }} placeholder="+44 123 456 7890" onFocus={onFocus} onBlur={onBlur} />
                  </FieldWrap>
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <Label>Website</Label>
                  <FieldWrap>
                    <IconSlot icon={Globe} />
                    <input style={fieldWithIcon} type="url" value={companyData.companyWebsite} onChange={e => handleCompanyDataChange("companyWebsite", e.target.value)} placeholder="https://www.company.com" onFocus={onFocus} onBlur={onBlur} />
                  </FieldWrap>
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <Label>Post Code / Pin Code</Label>
                  <FieldWrap>
                    <IconSlot icon={MapPin} />
                    <input style={fieldWithIcon} value={companyData.postCode || ""} onChange={e => handleCompanyDataChange("postCode", e.target.value)} placeholder="e.g. SW1A 1AA" onFocus={onFocus} onBlur={onBlur} />
                  </FieldWrap>
                </div>
                {[
                  ["linkedin", "LinkedIn URL"],
                  ["instagram", "Instagram URL"],
                  ["twitter", "Twitter/X URL"],
                  ["facebook", "Facebook URL"],
                ].map(([key, label]) => (
                  <div key={key}>
                    <Label>{label}</Label>
                    <FieldWrap>
                      <IconSlot icon={Globe} />
                      <input
                        style={fieldWithIcon}
                        type="url"
                        value={companyData.socialMediaLinks?.[key] || ""}
                        onChange={e => handleCompanyDataChange("socialMediaLinks", { ...(companyData.socialMediaLinks || {}), [key]: e.target.value })}
                        placeholder="https://..."
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </FieldWrap>
                  </div>
                ))}
                <div style={{ gridColumn: "span 2" }}>
                  <Label>Company Bio <span style={{ color: "rgba(255,255,255,0.25)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(max 25 words)</span></Label>
                  <FieldWrap>
                    <IconSlot icon={FileText} />
                    <input style={fieldWithIcon} value={companyData.companyBio || ""} onChange={e => {
                      const text = e.target.value;
                      const words = text.trim().split(/\s+/).filter(Boolean).length;
                      const prev = companyData.companyBio || "";
                      if (words <= 25 || text.length < prev.length) handleCompanyDataChange("companyBio", text);
                    }} placeholder="Short tagline shown on profile header" onFocus={onFocus} onBlur={onBlur} />
                  </FieldWrap>
                  <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "5px" }}>
                    {((companyData.companyBio || "").trim().split(/\s+/).filter(Boolean).length)}/25 words
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Regions */}
            <GlassCard accentRgb="245,158,11">
              <CardHeader icon={<MapPin size={14} color="#f59e0b" />} label="Regions of Operation" accentRgb="245,158,11" />
              <div style={{ padding: "20px 24px 24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "8px", marginBottom: "16px" }}>
                  {Object.keys(regionsData).map(region => {
                    const subs = regionsData[region];
                    const allPairs = subs.map(sub => `${region} - ${sub}`);
                    const allSelected = allPairs.every(p => companyData.regions.includes(p));
                    const someSelected = allPairs.some(p => companyData.regions.includes(p));
                    return (
                      <div key={region} style={{ padding: "9px 12px", borderRadius: "10px", border: `1px solid ${allSelected ? "rgba(245,158,11,0.45)" : someSelected ? "rgba(245,158,11,0.25)" : "rgba(255,255,255,0.09)"}`, background: allSelected ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", gap: "10px", transition: "all 0.15s" }}>
                        {/* Select All checkbox for this region */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (allSelected) {
                              setCompanyData(prev => ({ ...prev, regions: prev.regions.filter(r => !r.startsWith(region + ' - ')) }));
                            } else {
                              const existing = companyData.regions.filter(r => !r.startsWith(region + ' - '));
                              setCompanyData(prev => ({ ...prev, regions: [...existing, ...allPairs] }));
                            }
                          }}
                          style={{ 
                            width: "16px", 
                            height: "16px", 
                            borderRadius: "4px", 
                            border: `1.5px solid ${allSelected ? "#f59e0b" : "rgba(255,255,255,0.3)"}`, 
                            background: allSelected ? "rgba(245,158,11,0.2)" : "transparent",
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center",
                            cursor: "pointer",
                            flexShrink: 0
                          }}
                        >
                          {allSelected && <Check size={10} style={{ color: "#f59e0b" }} />}
                        </button>
                        {/* Region name - opens modal */}
                        <button 
                          type="button" 
                          onClick={() => handleRegionSelect(region)}
                          style={{ flex: 1, textAlign: "left", background: "none", border: "none", color: allSelected ? "#f59e0b" : someSelected ? "rgba(245,158,11,0.7)" : "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", cursor: "pointer", padding: 0 }}
                        >
                          {region}
                        </button>
                        {/* Show count of selected subregions */}
                        {someSelected && (
                          <span style={{ fontSize: "10px", color: "#f59e0b", background: "rgba(245,158,11,0.15)", padding: "2px 6px", borderRadius: "99px" }}>
                            {allPairs.filter(p => companyData.regions.includes(p)).length}/{subs.length}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {companyData.regions.length > 0 && (
                  <div style={{ padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "8px" }}>Selected</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {companyData.regions.map(r => (
                        <span key={r} style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 8px", borderRadius: "99px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", fontSize: "11px", color: "#f59e0b" }}>
                          {r}
                          <button type="button" onClick={() => handleRemoveRegion(r)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(245,158,11,0.6)", display: "flex", padding: 0 }}><X size={10} /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Sectors */}
            <GlassCard accentRgb="16,185,129">
              <CardHeader icon={<FileText size={14} color="#10b981" />} label="Industry Sectors" accentRgb="16,185,129" />
              <div style={{ padding: "20px 24px 24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "8px", marginBottom: "16px" }}>
                  {Object.entries(mainSectors).map(([key, sector]) => {
                    const sel = companyData.selectedSectors.includes(key);
                    const rgb = SECTOR_ACCENT[key] || "16,185,129";
                    return (
                      <button key={key} type="button" onClick={() => handleSectorToggle(key)}
                        style={{ padding: "11px 13px", borderRadius: "10px", border: `1px solid ${sel ? `rgba(${rgb},0.45)` : "rgba(255,255,255,0.09)"}`, background: sel ? `rgba(${rgb},0.1)` : "rgba(255,255,255,0.03)", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}
                        onMouseEnter={e => { if (!sel) e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                        onMouseLeave={e => { if (!sel) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "6px" }}>
                          <div>
                            <p style={{ fontSize: "12.5px", fontWeight: 500, color: sel ? `rgb(${rgb})` : "rgba(255,255,255,0.7)", marginBottom: "2px" }}>{key}</p>
                            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{sector.subcategories.length} subcategories</p>
                          </div>
                          {sel && <Check size={12} style={{ color: `rgb(${rgb})`, flexShrink: 0, marginTop: "2px" }} />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {companyData.selectedSectors.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {companyData.selectedSectors.map(s => {
                      const rgb = SECTOR_ACCENT[s] || "16,185,129";
                      return (
                        <div key={s} style={{ padding: "10px 14px", borderRadius: "10px", background: `rgba(${rgb},0.05)`, border: `1px solid rgba(${rgb},0.2)` }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: companyData.selectedSubsectors[s]?.length ? "8px" : 0 }}>
                            <span style={{ fontSize: "12px", fontWeight: 500, color: `rgb(${rgb})` }}>{s}</span>
                            <button type="button" onClick={() => handleRemoveSector(s)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", display: "flex" }}><X size={12} /></button>
                          </div>
                          {companyData.selectedSubsectors[s]?.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                              {companyData.selectedSubsectors[s].map(sub => (
                                <span key={sub} style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "2px 8px", borderRadius: "99px", background: `rgba(${rgb},0.08)`, border: `1px solid rgba(${rgb},0.25)`, fontSize: "10.5px", color: `rgb(${rgb})` }}>
                                  {sub}
                                  <button type="button" onClick={() => handleRemoveSubsector(s, sub)} style={{ background: "none", border: "none", cursor: "pointer", color: `rgba(${rgb},0.6)`, display: "flex", padding: 0 }}><X size={9} /></button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Logo */}
            <GlassCard accentRgb="139,92,246">
              <CardHeader icon={<Building2 size={14} color="#8b5cf6" />} label="Company Logo" accentRgb="139,92,246" />
              <div style={{ padding: "20px 24px 24px", display: "flex", alignItems: "center", gap: "20px" }}>
                <label htmlFor="logo-upload" style={{ cursor: "pointer", flexShrink: 0 }}>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" style={{ display: "none" }} />
                  <div style={{ width: "80px", height: "80px", borderRadius: "14px", border: "2px dashed rgba(139,92,246,0.4)", background: "rgba(139,92,246,0.05)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", transition: "all 0.2s" }}>
                    <Building2 size={18} style={{ color: "rgba(139,92,246,0.6)" }} />
                    <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", textAlign: "center" }}>Upload<br/>Logo</span>
                  </div>
                </label>
                {logoPreview ? (
                  <div style={{ position: "relative" }}>
                    <img src={logoPreview} alt="Logo preview" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)" }} />
                    <button type="button" onClick={() => { setCompanyData(p => ({ ...p, companyLogo: null })); setLogoPreview(null); }}
                      style={{ position: "absolute", top: "-6px", right: "-6px", width: "18px", height: "18px", borderRadius: "50%", background: "#ef4444", border: "none", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <X size={10} />
                    </button>
                  </div>
                ) : (
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontWeight: 300 }}>Upload a logo image (max 5MB). PNG or SVG with transparent background works best.</p>
                )}
              </div>
            </GlassCard>

            {/* nav */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={handlePrevStep} style={{ padding: "10px 24px", borderRadius: "99px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.09)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
                ← Previous
              </button>
              <button onClick={handleNextStep} style={{ padding: "10px 28px", borderRadius: "99px", background: "#06b6d4", border: "none", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, cursor: "pointer", boxShadow: "0 0 20px rgba(6,182,212,0.3)" }}>
                Next Step →
              </button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 3: SUBSCRIPTION ── */}
        {currentStep === 3 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Plan Selection */}
            <GlassCard accentRgb="139,92,246">
              <CardHeader icon={<CreditCard size={14} color="#8b5cf6" />} label="Subscription Plan" accentRgb="139,92,246" />
              <div style={{ padding: "20px 24px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                {[
                  { key: "professional", label: "Professional", rgb: "16,185,129", features: ["3 products/services", "3 news items", "300 word overview", "3 images per item"] },
                  { key: "elite",        label: "Elite",        rgb: "139,92,246",  features: ["6 products/services", "6 news items", "600 word overview", "6 images per item"] },
                ].map(p => {
                  const sel = subscriptionData.plan === p.key;
                  return (
                    <button key={p.key} type="button" onClick={() => handleSubscriptionChange("plan", p.key)}
                      style={{ padding: "18px", borderRadius: "14px", border: `1px solid ${sel ? `rgba(${p.rgb},0.45)` : "rgba(255,255,255,0.09)"}`, background: sel ? `rgba(${p.rgb},0.08)` : "rgba(255,255,255,0.025)", textAlign: "left", cursor: "pointer", transition: "all 0.2s" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: sel ? `rgb(${p.rgb})` : "#fff" }}>{p.label}</span>
                        <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${sel ? `rgb(${p.rgb})` : "rgba(255,255,255,0.2)"}`, background: sel ? `rgba(${p.rgb},0.2)` : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {sel && <Check size={10} style={{ color: `rgb(${p.rgb})` }} />}
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        {p.features.map(f => (
                          <div key={f} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: sel ? `rgb(${p.rgb})` : "rgba(255,255,255,0.25)", flexShrink: 0 }} />
                            <span style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.5)", fontWeight: 300 }}>{f}</span>
                          </div>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </GlassCard>

            {/* Duration + Overview + News */}
            <GlassCard accentRgb="6,182,212">
              <CardHeader icon={<Calendar size={14} color="#06b6d4" />} label="Duration & Content" accentRgb="6,182,212" />
              <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: "18px" }}>

                {/* duration */}
                <div>
                  <Label>Subscription Duration</Label>
                  <div style={{ position: "relative" }}>
                    <select value={subscriptionData.months} onChange={e => handleSubscriptionChange("months", parseInt(e.target.value))}
                      style={{ ...fieldBase, appearance: "none", paddingRight: "36px", cursor: "pointer" }}
                      onFocus={onFocus} onBlur={onBlur}>
                      {monthOptions.map(m => <option key={m} value={m}>{m} {m === 1 ? "Month" : "Months"}</option>)}
                    </select>
                    <ChevronDown size={13} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
                  </div>
                </div>

                {/* overview */}
                <div>
                  <Label>Company Overview</Label>
                  <FieldWrap>
                    <textarea value={companyData.companyOverview} onChange={handleCompanyOverviewChange} placeholder="Brief description of the company…" rows={4}
                      style={{ ...fieldBase, resize: "none", paddingTop: "10px" }}
                      onFocus={onFocus} onBlur={onBlur} />
                  </FieldWrap>
                  <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "5px" }}>{overviewWordCount}/{overviewWordLimit} words</p>
                </div>

                {/* company news */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                    <Label>Company News <span style={{ color: "rgba(255,255,255,0.25)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(up to {maxNews})</span></Label>
                    <button type="button" onClick={addNewsItem} disabled={(companyData.companyNews || []).length >= maxNews}
                      style={{ fontSize: "11px", color: "#06b6d4", background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.25)", borderRadius: "8px", padding: "3px 10px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", opacity: (companyData.companyNews || []).length >= maxNews ? 0.4 : 1 }}>
                      + Add
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {(companyData.companyNews || []).map((item, idx) => (
                      <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "8px", alignItems: "center" }}>
                        <FieldWrap>
                          <IconSlot icon={FileText} />
                          <input style={fieldWithIcon} value={item.title} onChange={e => updateNewsItem(idx, "title", e.target.value)} placeholder="News title" onFocus={onFocus} onBlur={onBlur} />
                        </FieldWrap>
                        <FieldWrap>
                          <IconSlot icon={Globe} />
                          <input style={fieldWithIcon} type="url" value={item.link || ""} onChange={e => updateNewsItem(idx, "link", e.target.value)} placeholder="Optional link" onFocus={onFocus} onBlur={onBlur} />
                        </FieldWrap>
                        <button type="button" onClick={() => removeNewsItem(idx)}
                          style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Summary */}
            <GlassCard>
              <CardHeader icon={<FileText size={14} color="rgba(255,255,255,0.5)" />} label="Onboarding Summary" />
              <div style={{ padding: "16px 22px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { label: "Company", value: companyData.companyName || "Not set" },
                  { label: "User", value: userData.username || userData.email || "Not set" },
                  { label: "Location", value: companyData.companyLocation || "Not set" },
                  { label: "Address", value: companyData.companyAddress || "Not set" },
                  { label: "Sectors", value: companyData.selectedSectors.join(", ") || "None" },
                  { label: "Plan", value: subscriptionData.plan.charAt(0).toUpperCase() + subscriptionData.plan.slice(1) },
                  { label: "Duration", value: `${subscriptionData.months} month${subscriptionData.months !== 1 ? "s" : ""}` },
                ].map(row => (
                  <div key={row.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <span style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.38)", fontWeight: 300 }}>{row.label}</span>
                    <span style={{ fontSize: "12.5px", color: "#fff", fontWeight: 400, maxWidth: "60%", textAlign: "right" }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* nav */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={handlePrevStep} style={{ padding: "10px 24px", borderRadius: "99px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.09)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
                ← Previous
              </button>
              <button onClick={handleSubmit} disabled={loading}
                style={{ padding: "10px 28px", borderRadius: "99px", background: loading ? "rgba(255,255,255,0.08)" : "#10b981", border: "none", color: loading ? "rgba(255,255,255,0.3)" : "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: loading ? "none" : "0 0 20px rgba(16,185,129,0.3)" }}>
                {loading ? (
                  <><div style={{ width: "13px", height: "13px", border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />Onboarding…</>
                ) : (
                  <><Building2 size={13} />Complete Onboarding</>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── SUBSECTOR MODAL ── */}
      <AnimatePresence>
        {showSubsectorModal && activeSectorForModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", background: "rgba(4,14,30,0.88)", backdropFilter: "blur(14px)" }}
            onClick={() => setShowSubsectorModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.94, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94 }}
              onClick={e => e.stopPropagation()}
              style={{ width: "100%", maxWidth: "580px", maxHeight: "85vh", background: "rgba(4,14,30,0.98)", border: `1px solid rgba(${SECTOR_ACCENT[activeSectorForModal] || "16,185,129"},0.25)`, borderRadius: "20px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 40px 100px rgba(0,0,0,0.65)" }}>
              <div style={{ height: "2px", background: `linear-gradient(90deg, transparent, rgb(${SECTOR_ACCENT[activeSectorForModal] || "16,185,129"}), transparent)`, flexShrink: 0 }} />
              <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0 }}>
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: `rgb(${SECTOR_ACCENT[activeSectorForModal] || "16,185,129"})`, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, marginBottom: "3px" }}>Subcategories</p>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "#fff" }}>{activeSectorForModal}</h3>
                </div>
                <button onClick={() => setShowSubsectorModal(false)}
                  style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <X size={13} />
                </button>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px", scrollbarWidth: "thin", scrollbarColor: `rgba(${SECTOR_ACCENT[activeSectorForModal] || "16,185,129"},0.4) rgba(255,255,255,0.02)` }}>
                {mainSectors[activeSectorForModal].subcategories.map(sub => {
                  const isSel = companyData.selectedSubsectors[activeSectorForModal]?.includes(sub);
                  const rgb = SECTOR_ACCENT[activeSectorForModal] || "16,185,129";
                  return (
                    <button key={sub} type="button" onClick={() => handleSubsectorToggle(activeSectorForModal, sub)}
                      style={{ padding: "8px 11px", borderRadius: "9px", border: `1px solid ${isSel ? `rgba(${rgb},0.45)` : "rgba(255,255,255,0.08)"}`, background: isSel ? `rgba(${rgb},0.1)` : "rgba(255,255,255,0.025)", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: isSel ? `rgb(${rgb})` : "rgba(255,255,255,0.6)", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "7px", transition: "all 0.15s" }}>
                      <div style={{ width: "13px", height: "13px", borderRadius: "4px", border: `1.5px solid ${isSel ? `rgb(${rgb})` : "rgba(255,255,255,0.2)"}`, background: isSel ? `rgba(${rgb},0.2)` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {isSel && <Check size={8} style={{ color: `rgb(${rgb})` }} />}
                      </div>
                      {sub}
                    </button>
                  );
                })}
              </div>
              <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
                <button type="button" onClick={() => { if (!companyData.selectedSubsectors[activeSectorForModal]?.length) handleRemoveSector(activeSectorForModal); setShowSubsectorModal(false); }}
                  style={{ padding: "8px 22px", borderRadius: "99px", background: "#10b981", border: "none", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── REGION SUBREGIONS MODAL ── */}
      <AnimatePresence>
        {showRegionModal && selectedRegionForSubregions && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", background: "rgba(4,14,30,0.88)", backdropFilter: "blur(14px)" }}
            onClick={() => setShowRegionModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.94, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94 }}
              onClick={e => e.stopPropagation()}
              style={{ width: "100%", maxWidth: "580px", maxHeight: "85vh", background: "rgba(4,14,30,0.98)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "20px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 40px 100px rgba(0,0,0,0.65)" }}>
              <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #f59e0b, transparent)", flexShrink: 0 }} />
              <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0 }}>
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#f59e0b", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, marginBottom: "3px" }}>Subregions</p>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "#fff" }}>{selectedRegionForSubregions}</h3>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button type="button" onClick={() => {
                    const allPairs = (regionsData[selectedRegionForSubregions] || []).map(sub => `${selectedRegionForSubregions} - ${sub}`);
                    const allSelected = allPairs.every(p => companyData.regions.includes(p));
                    if (allSelected) {
                      setCompanyData(prev => ({ ...prev, regions: prev.regions.filter(r => !r.startsWith(selectedRegionForSubregions + ' - ')) }));
                    } else {
                      const existing = companyData.regions.filter(r => !r.startsWith(selectedRegionForSubregions + ' - '));
                      setCompanyData(prev => ({ ...prev, regions: [...existing, ...allPairs] }));
                    }
                  }} style={{ padding: "5px 12px", borderRadius: "99px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.35)", color: "#f59e0b", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>
                    {(regionsData[selectedRegionForSubregions] || []).every(sub => companyData.regions.includes(`${selectedRegionForSubregions} - ${sub}`)) ? 'Deselect All' : 'Select All'}
                  </button>
                  <button onClick={() => setShowRegionModal(false)}
                    style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <X size={13} />
                  </button>
                </div>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px", scrollbarWidth: "thin", scrollbarColor: "rgba(245,158,11,0.4) rgba(255,255,255,0.02)" }}>
                {regionsData[selectedRegionForSubregions]?.map(sub => {
                  const pair = `${selectedRegionForSubregions} - ${sub}`;
                  const isSel = companyData.regions.includes(pair);
                  return (
                    <button key={sub} type="button" onClick={() => handleSubregionSelect(sub)}
                      style={{ padding: "8px 11px", borderRadius: "9px", border: `1px solid ${isSel ? "rgba(245,158,11,0.45)" : "rgba(255,255,255,0.08)"}`, background: isSel ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.025)", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: isSel ? "#f59e0b" : "rgba(255,255,255,0.6)", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "7px", transition: "all 0.15s" }}>
                      <div style={{ width: "13px", height: "13px", borderRadius: "4px", border: `1.5px solid ${isSel ? "#f59e0b" : "rgba(255,255,255,0.2)"}`, background: isSel ? "rgba(245,158,11,0.2)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {isSel && <Check size={8} style={{ color: "#f59e0b" }} />}
                      </div>
                      {sub}
                    </button>
                  );
                })}
              </div>
              <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
                <button type="button" onClick={() => setShowRegionModal(false)}
                  style={{ padding: "8px 22px", borderRadius: "99px", background: "#f59e0b", border: "none", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOnboardCompany;

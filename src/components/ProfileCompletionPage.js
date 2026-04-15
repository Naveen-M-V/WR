import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, X, ChevronDown } from "lucide-react";
import { API_BASE_URL } from "../config";
import { registerUser } from "../utils/authAPI";

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
const onFocus = (e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)"; e.currentTarget.style.background = "rgba(16,185,129,0.04)"; };
const onBlur  = (e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; };

const Label = ({ children }) => (
  <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "8px" }}>
    {children}
  </label>
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

/* Dark modal shell */
const ModalShell = ({ children, accentRgb = "16,185,129", maxWidth = "640px", onClose, title, eyebrow }) => (
  <div
    style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", background: "rgba(4,14,30,0.88)", backdropFilter: "blur(14px)" }}
    onClick={onClose}>
    <div
      style={{ width: "100%", maxWidth, maxHeight: "90vh", background: "rgba(4,14,30,0.98)", border: `1px solid rgba(${accentRgb},0.2)`, borderRadius: "22px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 40px 100px rgba(0,0,0,0.7)" }}
      onClick={e => e.stopPropagation()}>
      {/* accent bar */}
      <div style={{ height: "2px", background: `linear-gradient(90deg, transparent, rgb(${accentRgb}), transparent)`, flexShrink: 0 }} />
      {/* header */}
      {(title || onClose) && (
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            {eyebrow && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: `rgb(${accentRgb})`, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, marginBottom: "3px" }}>{eyebrow}</p>}
            {title && <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "#fff" }}>{title}</h3>}
          </div>
          {onClose && (
            <button onClick={onClose}
              style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${accentRgb},0.5)`; e.currentTarget.style.color = `rgb(${accentRgb})`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}>
              <X size={13} />
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  </div>
);

/* Pill toggle */
const PillToggle = ({ options, value, onChange }) => (
  <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "99px", padding: "3px", gap: "2px" }}>
    {options.map(o => (
      <button key={o.value} type="button" onClick={() => onChange(o.value)}
        style={{ padding: "6px 18px", borderRadius: "99px", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: value === o.value ? 600 : 400, color: value === o.value ? "#fff" : "rgba(255,255,255,0.45)", background: value === o.value ? "#10b981" : "transparent", border: "none", cursor: "pointer", transition: "all 0.2s", boxShadow: value === o.value ? "0 0 16px rgba(16,185,129,0.3)" : "none" }}>
        {o.label}
      </button>
    ))}
  </div>
);

/* Sector accent map */
const SECTOR_ACCENT = {
  "Construction":      "239,68,68",
  "Industrial":        "249,115,22",
  "Commercial/Retail": "245,158,11",
  "Agriculture":       "34,197,94",
  "Domestic":          "59,130,246",
};

const ProfileCompletionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, refreshUser } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [selectedRegionForSubregions, setSelectedRegionForSubregions] = useState(null);
  const [showSectorModal, setShowSectorModal] = useState(false);
  const [selectedMainSector, setSelectedMainSector] = useState(null);
  const [showSubsectorsModal, setShowSubsectorsModal] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [showAddonsStep, setShowAddonsStep] = useState(false);
  const [timeLeft, setTimeLeft] = useState({});
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [confirmedPlan, setConfirmedPlan] = useState(null);
  const [companyDescriptionWordCount, setCompanyDescriptionWordCount] = useState(0);
  const [companyDescriptionError, setCompanyDescriptionError] = useState("");
  const pendingProfilePaymentKey = "pendingProfilePayment";
  const paymentFinalizedRef = useRef(false);

  /* countdown */
  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const target = new Date(now.getFullYear(), 4, 31, 23, 59, 59);
      if (now > target) target.setFullYear(now.getFullYear() + 1);
      const d = target - now;
      if (d > 0) {
        setTimeLeft({
          days: Math.floor(d / 86400000).toString().padStart(2, "0"),
          hours: Math.floor((d % 86400000) / 3600000).toString().padStart(2, "0"),
          minutes: Math.floor((d % 3600000) / 60000).toString().padStart(2, "0"),
          seconds: Math.floor((d % 60000) / 1000).toString().padStart(2, "0"),
        });
      } else setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let t;
    if (showCongratsModal) { t = setTimeout(() => { setShowCongratsModal(false); navigate("/"); }, 5000); }
    return () => clearTimeout(t);
  }, [showCongratsModal, navigate]);

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", contactEmail: "", phoneNumber: "", role: "",
    companyName: "", companyDescription: "", companyBio: "", companyAddress: "",
    postCode: "", industrySector: [], productsServices: "", isRecruitmentCompany: "",
    regions: [], website: "", companyLogo: null, companyContactEmail: "", companyPhoneNumber: "",
  });

  const regionsData = {
    'United Kingdom & Ireland': ['England','Scotland','Wales','Northern Ireland','Republic Of Ireland'],
    'UK and NI': ['England','Scotland','Wales','Northern Ireland'],
    'UK Mainland Only': ['England','Scotland','Wales'],
    'Scotland': ['Highlands & islands','Grampian','Central','Strathclyde','Lothian','Borders','Dumfries & Galloway'],
    'England': ['Cornwall','Devon','Somerset','Avon','Wiltshire','Hampshire','West Sussex','Surrey','Berkshire','East Sussex','Kent','Essex','Hertfordshire','Buckinghamshire','Suffolk','Norfolk','Cambridgeshire','Northamptonshire','Warwickshire','Oxfordshire','Shropshire','East Riding of Yorkshire','Leicestershire','West Midlands','Glouchestershire','Hereford & Worcester','Staffordshire','Lincolnshire','Nottinghamshire','Derbyshire','Cheshire','South Yorkshire','Greater Manchester','Merseyside','Humberside','West Yorkshire','Lancashire','North Yorkshire','Cleveland','Durham','Cumbria','Tyne & Wear','Northumberland','Central London','North London','West London','South London','East London'],
    'Wales': ['Clywd','Gywwedd','Powys','Dyfed','Cardiff','Glamorgan'],
    'Ireland': ['All Of Ireland','Northern Ireland Only','Republic Of Ireland Only','Greater Dublin','Southern Counties','Midland Counties','West & North west','Border Counties'],
  };

  const sectorsMapping = {
    "Construction":      { subsectors: ["Construction","Eco Friendly building products","Electrical Systems","Groundwork and Civils","Mechanical and Electrical","Passivhaus","Planning and Consultative Services","Solar PV - Ground Mounted","Sustainable Construction","Waste Management"] },
    "Industrial":        { subsectors: ["AI","Finance & Funding","Green Hydrogen","Industrial","Mechanical and Electrical","Planning and Consultative Services","Water & Marine","Wind Power"] },
    "Commercial/Retail": { subsectors: ["Battery Storage - Large Scale","Carbon Management","Commercial / Retail","Energy Efficiency","Energy Management","HVAC","Lean Management","LED Lighting"] },
    "Agriculture":       { subsectors: ["Agriculture","Agritech","Carbon Management","Carbon Reduction","ESG Products","ESG Services","Waste Management"] },
    "Domestic":          { subsectors: ["Battery Storage - Small Scale","Cleantech","Domestic","Eco Friendly building products","Electrical Systems","Energy Efficiency","Energy Management","Solar PV","Utility Provision"] },
  };
  const mainSectors = Object.keys(sectorsMapping);

  const getMainSectorFromSubsector = (sub) => {
    for (const [ms, d] of Object.entries(sectorsMapping)) if (d.subsectors.includes(sub)) return ms;
    return null;
  };

  /* completion calc */
  const completionFields = ["firstName","lastName","contactEmail","phoneNumber","role","companyName","companyRegNumber","companyAddress","postCode","industrySector","productsServices","isRecruitmentCompany"];
  const filledCount = completionFields.filter(f => { const v = formData[f]; return typeof v === "string" && v.trim() !== ""; }).length;
  const completionPercent = Math.min(100, 10 + Math.round((filledCount / completionFields.length) * 90));

  const handleInputChange = (field, value) => setFormData(p => ({ ...p, [field]: value }));

  const getMaxWords = (planName) => ((planName || "").toLowerCase().includes("elite") ? 600 : 300);

  const handleCompanyDescriptionChange = (e) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const max = getMaxWords(confirmedPlan?.name);
    const prev = formData.companyDescription || "";
    const prevWords = prev.trim().split(/\s+/).filter(Boolean).length;
    if (words <= max || text.length < prev.length || words <= prevWords) {
      setCompanyDescriptionWordCount(words);
      handleInputChange("companyDescription", text);
      if (words <= max) setCompanyDescriptionError("");
    } else {
      setCompanyDescriptionError(`Word limit reached: Maximum ${max} words allowed.`);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Logo must be under 5MB"); return; }
    setFormData(p => ({ ...p, companyLogo: file }));
  };

  const handleRegionSelect = (region) => { setSelectedRegionForSubregions(region); setShowRegionModal(true); };
  const handleSubregionSelect = (sub) => {
    const pair = `${selectedRegionForSubregions} - ${sub}`;
    setFormData(p => ({ ...p, regions: p.regions.includes(pair) ? p.regions.filter(r => r !== pair) : [...p.regions, pair] }));
  };
  const handleRemoveRegion = (r) => setFormData(p => ({ ...p, regions: p.regions.filter(x => x !== r) }));

  const handleMainSectorSelect = (ms) => { setSelectedMainSector(ms); setShowSectorModal(false); setShowSubsectorsModal(true); };
  const handleSubsectorSelect = (sub) => setFormData(p => ({ ...p, industrySector: p.industrySector.includes(sub) ? p.industrySector.filter(s => s !== sub) : [...p.industrySector, sub] }));
  const handleRemoveSector = (s) => setFormData(p => ({ ...p, industrySector: p.industrySector.filter(x => x !== s) }));
  const handleAddonToggle = (id) => setSelectedAddons(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const handlePlanSelection = (plan) => { setSelectedPlan(plan); setShowAddonsStep(true); };

  const addonServices = [
    { id: "company-spotlight",            name: "Company 'Under The Spotlight'",                          description: "Feature your company in our exclusive spotlight section",                              price: 300, billing: "30 days" },
    { id: "product-spotlight",            name: "Product or Service 'Under The Spotlight'",               description: "Showcase your specific product or service to our audience",                          price: 300, billing: "30 days" },
    { id: "hall-of-fame",                 name: "'Hall Of Fame - Industry Heroes'",                       description: "Choose: Individuals, Companies, Products, Innovations, Award Winners, Case Studies, or Completed Projects", price: 300, billing: "30 days" },
    { id: "industry-awards",              name: "Showcase your Award on our 'Industry Awards' page",      description: "Display your achievements on our dedicated awards page",                              price: 300, billing: "30 days" },
    { id: "case-study-showcase",          name: "Showcase your recent successful 'Case Study'",           description: "Feature your recent successful case study to highlight your expertise",                price: 300, billing: "30 days" },
    { id: "completed-project-showcase",   name: "Showcase your 'Recently Completed Project'",            description: "Display your recently completed project to demonstrate your capabilities",             price: 300, billing: "30 days" },
    { id: "innovations-showcase",         name: "Showcase the latest 'Innovations' in Renewable Energy", description: "Highlight your latest innovations in renewable energy and sustainability",             price: 300, billing: "30 days" },
    { id: "additional-recruitment",       name: "Additional 6 x recruitment vacancies",                  description: "Get 6 additional recruitment vacancies beyond your plan limit",                      price: 300, billing: "30 days" },
  ];

  const planTemplate = (billing) => [
    {
      name: "PROFESSIONAL", price: billing === "monthly" ? 400 : 4800, earlyBirdPrice: billing === "monthly" ? 280 : 3360,
      duration: billing === "monthly" ? "month" : "year", priceId: billing === "monthly" ? "price_1TMDGpEEQbrwR9DPbTclwQ11" : "price_1TMDGpEEQbrwR9DPbTclwQ11",
      description: "Comprehensive plan with essential features for growing companies in the renewable energy sector.",
      cta: "Continue", recommended: true,
      features: ["Company Name & Logo on WR Website","Link to your Website, Social Media & Company contact details","300-word blurb (Company overview, Key Products, Services, Case Study, Completed Projects, Awards, Testimonials, Certifications, Publication & Blogs)","Appear in 'Find A Company' search on WR Website","Get listed within WR catalogue / directory","Showcase your Service or product in 2 specific categories and upload 2 Images","Regions you are available to work in","Access to Industry-related webinars","Post up to 3 Image Allocations to designated Products & Services","Post up to 3 internal 'Job Vacancies' per month and up to 300 words"],
    },
    {
      name: "ELITE", price: billing === "monthly" ? 600 : 7200, earlyBirdPrice: billing === "monthly" ? 420 : 5040,
      duration: billing === "monthly" ? "month" : "year", priceId: billing === "monthly" ? "price_1TMDGpEEQbrwR9DPbTclwQ11" : "price_1TMDGpEEQbrwR9DPbTclwQ11",
      productId: billing === "monthly" ? "prod_UKnGJISjSAIWee" : null,
      description: "Premium plan with all Professional features plus enhanced visibility and exclusive benefits.",
      cta: "Continue", recommended: false,
      features: ["Includes all features from the Professional Plan","600-word blurb (Company overview, Key Products, Services, Case Study, Completed Projects, Awards, Testimonials, Certifications, Publication & Blogs)","Showcase your Service or product in 4 specific categories and upload 4 Images","Invitation to Join WR 'Expert Circle' & Contribute to our 'Expert Circle' blog","Post up to 6 Image Allocations to designated Products & Services","Post up to 6 internal 'Job Vacancies' per month and up to 600 words"],
    },
  ];

  const profileSubscriptionPlans = planTemplate(billingCycle);

  const handleProceedToPayment = async () => {
    if (!selectedPlan) return;
    const basePrice = selectedPlan.earlyBirdPrice ?? selectedPlan.price ?? 0;
    const addonTotal = selectedAddons.reduce((t, id) => { const a = addonServices.find(x => x.id === id); return t + (a ? a.price : 0); }, 0);
    const paymentPlan = { id: (selectedPlan.name || "").toLowerCase().replace(/\s+/g, "_"), name: selectedPlan.name, price: basePrice, priceId: selectedPlan.priceId, interval: selectedPlan.duration === "year" ? "year" : "month", features: selectedPlan.features || [], addonTotal, selectedAddons, totalPrice: basePrice + addonTotal };
    const pendingPayload = { selectedPlan: paymentPlan, selectedAddons, billingCycle, selectedMainSector, formData };
    localStorage.setItem(pendingProfilePaymentKey, JSON.stringify(pendingPayload));
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Invalid or expired token");
      const res = await fetch(`${API_BASE_URL}/create-profile-checkout`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ planId: paymentPlan.id, planName: paymentPlan.name, priceId: paymentPlan.priceId, selectedAddons: paymentPlan.selectedAddons || [], addonTotal: paymentPlan.addonTotal || 0, totalAmount: paymentPlan.totalPrice || 0, successUrl: `${window.location.origin}/profile-completion?payment=success`, cancelUrl: `${window.location.origin}/profile-completion?payment=cancelled` }) });
      const result = await res.json();
      if (!res.ok || !result?.checkoutUrl) throw new Error(result?.error || "Failed to start payment");
      window.location.href = result.checkoutUrl;
    } catch (err) { localStorage.removeItem(pendingProfilePaymentKey); console.error("Payment error:", err); }
  };

  const handleConfirmSubscription = async (overrideData = null) => {
    const planToUse = overrideData?.selectedPlan || selectedPlan;
    const addonsToUse = overrideData?.selectedAddons || selectedAddons;
    const cycleToUse = overrideData?.billingCycle || billingCycle;
    const sectorToUse = overrideData?.selectedMainSector || selectedMainSector;
    const fdToUse = overrideData?.formData || formData;
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return { success: false };
      const derivedSector = sectorToUse || (fdToUse.industrySector?.length ? (getMainSectorFromSubsector(fdToUse.industrySector[0]) || fdToUse.industrySector.map(getMainSectorFromSubsector).find(Boolean) || null) : null);
      // Extract plan ID as string - backend expects subscription.plan to be a string
      const planId = typeof planToUse === 'string' ? planToUse : (planToUse?.id || planToUse?.name?.toLowerCase() || 'professional');
      const res = await fetch(`${API_BASE_URL}/companies`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ companyName: fdToUse.companyName, companyRegNumber: fdToUse.companyRegNumber, companyAddress: fdToUse.companyAddress, postCode: fdToUse.postCode, industrySector: fdToUse.industrySector, mainSector: derivedSector, productsServices: "", companyBio: fdToUse.companyBio || "", isRecruitmentCompany: fdToUse.isRecruitmentCompany, regions: fdToUse.regions, firstName: fdToUse.firstName, lastName: fdToUse.lastName, contactEmail: fdToUse.contactEmail, phoneNumber: fdToUse.phoneNumber, role: fdToUse.role, selectedPlan: planId, selectedAddons: addonsToUse, billingCycle: cycleToUse }) });
      const result = await res.json();
      if (result.success) {
        setShowSubscriptionModal(false);
        login({ ...user, companyName: result.data.companyName, subscription: (typeof result.data.subscription?.plan === "string" ? result.data.subscription.plan : result.data.subscription?.plan?.name || "not_subscribed").toLowerCase() });
        return { success: true, company: result.data };
      }
      return { success: false };
    } catch { return { success: false }; }
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const status = query.get("payment");
    if (!status) { paymentFinalizedRef.current = false; return; }
    if (status === "cancelled") { localStorage.removeItem(pendingProfilePaymentKey); paymentFinalizedRef.current = false; navigate("/profile-completion", { replace: true }); return; }
    if (status !== "success" || paymentFinalizedRef.current) return;
    paymentFinalizedRef.current = true;
    const raw = localStorage.getItem(pendingProfilePaymentKey);
    if (!raw) { navigate("/profile-completion", { replace: true }); return; }
    const finalize = async () => {
      let ok = false;
      try {
        // Check if this was a pending signup flow (company profile needs to be created)
        const pendingCompanyProfile = sessionStorage.getItem('pendingCompanyProfile');
        if (pendingCompanyProfile) {
          // User is already logged in with valid token, just clean up the flag
          sessionStorage.removeItem('pendingCompanyProfile');
          // Also clean up any legacy pendingSignup data if it exists
          sessionStorage.removeItem('pendingSignup');
        }
        
        const data = JSON.parse(raw);
        setSelectedPlan(data.selectedPlan || null); setSelectedAddons(data.selectedAddons || []); setBillingCycle(data.billingCycle || "monthly"); setSelectedMainSector(data.selectedMainSector || null);
        if (data.formData) setFormData(data.formData);
        const result = await handleConfirmSubscription(data);
        if (result?.success) { ok = true; setConfirmedPlan(data.selectedPlan || null); if (refreshUser) refreshUser(); navigate("/", { replace: true }); }
      } catch (e) { console.error(e); } finally { localStorage.removeItem(pendingProfilePaymentKey); paymentFinalizedRef.current = false; if (!ok) navigate("/profile-completion", { replace: true }); }
    };
    finalize();
  }, [location.search]);

  const addonTotal = selectedAddons.reduce((t, id) => { const a = addonServices.find(x => x.id === id); return t + (a ? a.price : 0); }, 0);

  /* ── STEP LABELS ── */
  const steps = [
    { n: 1, label: "Contact Info", accentRgb: "16,185,129" },
    { n: 2, label: "Company Info", accentRgb: "6,182,212" },
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
        @keyframes ping { 0%,100%{transform:scale(1);opacity:0.75} 50%{transform:scale(1.8);opacity:0} }
        @keyframes spin2 { to { transform: rotate(360deg); } }
      `}</style>

      {/* ambient glows */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-100px", left: "20%", width: "560px", height: "480px", borderRadius: "50%", background: "radial-gradient(ellipse, #10b981, transparent 65%)", opacity: 0.04 }} />
        <div style={{ position: "absolute", bottom: "-120px", right: "10%", width: "480px", height: "400px", borderRadius: "50%", background: "radial-gradient(ellipse, #06b6d4, transparent 65%)", opacity: 0.03 }} />
      </div>

      <div style={{ position: "relative", zIndex: 10, maxWidth: "720px", margin: "0 auto", padding: "0 24px" }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ marginBottom: "32px", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "10px" }}>
            <div style={{ height: "1px", width: "28px", background: "#10b981" }} />
            <span style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#10b981", textTransform: "uppercase", fontWeight: 600 }}>Which Renewables</span>
            <div style={{ height: "1px", width: "28px", background: "#10b981" }} />
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: "8px" }}>Complete Your Profile</h1>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", fontWeight: 300, maxWidth: "460px", margin: "0 auto", lineHeight: 1.7 }}>
            Tell us more about you and your company so we can personalise your Which Renewables experience.
          </p>
        </div>

        {/* ── PROGRESS BAR ── */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>Profile completion</span>
            <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 600 }}>{completionPercent}%</span>
          </div>
          <div style={{ height: "3px", borderRadius: "99px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: "99px", width: `${completionPercent}%`, background: "linear-gradient(90deg, #10b981, #06b6d4)", transition: "width 0.5s" }} />
          </div>
        </div>

        {/* ── STEP TABS ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "0", marginBottom: "28px" }}>
          {steps.map((s, i) => {
            const done = step > s.n;
            const active = step === s.n;
            return (
              <React.Fragment key={s.n}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 14px", borderRadius: "99px", background: active ? `rgba(${s.accentRgb},0.12)` : done ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${active ? `rgba(${s.accentRgb},0.4)` : done ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.07)"}`, transition: "all 0.3s" }}>
                  <div style={{ width: "20px", height: "20px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: done ? "#10b981" : active ? `rgba(${s.accentRgb},0.2)` : "rgba(255,255,255,0.05)", border: `1.5px solid ${done ? "#10b981" : active ? `rgb(${s.accentRgb})` : "rgba(255,255,255,0.15)"}`, flexShrink: 0 }}>
                    {done ? <Check size={10} color="#fff" /> : <span style={{ fontSize: "9px", fontWeight: 700, color: active ? `rgb(${s.accentRgb})` : "rgba(255,255,255,0.3)" }}>{s.n}</span>}
                  </div>
                  <span style={{ fontSize: "11.5px", fontWeight: active ? 600 : 400, color: active ? `rgb(${s.accentRgb})` : done ? "#10b981" : "rgba(255,255,255,0.35)" }}>{s.label}</span>
                </div>
                {i < steps.length - 1 && <div style={{ flex: 1, height: "1px", background: step > s.n ? "#10b981" : "rgba(255,255,255,0.06)", transition: "background 0.3s" }} />}
              </React.Fragment>
            );
          })}
        </div>

        {/* ── STEP 1: CONTACT ── */}
        {step === 1 && (
          <GlassCard accentRgb="16,185,129">
            <CardHeader icon={<span style={{ fontSize: "13px" }}>👤</span>} label="Contact Person Information" accentRgb="16,185,129" />
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <Label>First Name</Label>
                  <input style={fieldBase} value={formData.firstName} onChange={e => handleInputChange("firstName", e.target.value)} placeholder="First name" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <input style={fieldBase} value={formData.lastName} onChange={e => handleInputChange("lastName", e.target.value)} placeholder="Last name" onFocus={onFocus} onBlur={onBlur} />
                </div>
              </div>
              <div>
                <Label>Email Address</Label>
                <input style={fieldBase} type="email" value={formData.contactEmail} onChange={e => handleInputChange("contactEmail", e.target.value)} placeholder="your@email.com" onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <Label>Phone Number</Label>
                <input style={fieldBase} type="tel" value={formData.phoneNumber} onChange={e => handleInputChange("phoneNumber", e.target.value)} placeholder="+44 123 456 7890" onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <Label>Your Role</Label>
                <div style={{ position: "relative" }}>
                  <select style={{ ...fieldBase, appearance: "none", paddingRight: "36px", cursor: "pointer" }} value={formData.role} onChange={e => handleInputChange("role", e.target.value)} onFocus={onFocus} onBlur={onBlur}>
                    <option value="">Select your role</option>
                    {["Business Owner","Director","Procurement Officer","Project Manager","Sustainability Officer","Consultant","Student / Researcher","Other"].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <ChevronDown size={13} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "8px" }}>
                <button onClick={() => setStep(2)} style={{ padding: "10px 28px", borderRadius: "99px", background: "#10b981", border: "none", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, cursor: "pointer", boxShadow: "0 0 20px rgba(16,185,129,0.3)", transition: "all 0.2s" }}>
                  Next →
                </button>
              </div>
            </div>
          </GlassCard>
        )}

        {/* ── STEP 2: COMPANY ── */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <GlassCard accentRgb="6,182,212">
              <CardHeader icon={<span style={{ fontSize: "13px" }}>🏢</span>} label="Company Information" accentRgb="6,182,212" />
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <Label>Company Name</Label>
                  <input style={fieldBase} value={formData.companyName} onChange={e => handleInputChange("companyName", e.target.value)} placeholder="Enter company name" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <Label>Company Bio <span style={{ color: "rgba(255,255,255,0.25)", fontWeight: 300, textTransform: "none", letterSpacing: 0 }}>(max 25 words)</span></Label>
                  <input style={fieldBase} value={formData.companyBio} onChange={e => {
                    const text = e.target.value; const words = text.trim().split(/\s+/).filter(Boolean).length;
                    const prev = formData.companyBio || "";
                    if (words <= 25 || text.length < prev.length) handleInputChange("companyBio", text);
                  }} placeholder="Short tagline shown on profile header" onFocus={onFocus} onBlur={onBlur} />
                  <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "5px" }}>{((formData.companyBio || "").trim().split(/\s+/).filter(Boolean).length)}/25 words</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <Label>Company Email</Label>
                    <input style={fieldBase} type="email" value={formData.companyContactEmail} onChange={e => handleInputChange("companyContactEmail", e.target.value)} placeholder="contact@company.com" onFocus={onFocus} onBlur={onBlur} />
                  </div>
                  <div>
                    <Label>Company Phone</Label>
                    <input style={fieldBase} type="tel" value={formData.companyPhoneNumber} onChange={e => handleInputChange("companyPhoneNumber", e.target.value)} placeholder="+44 123 456 7890" onFocus={onFocus} onBlur={onBlur} />
                  </div>
                </div>
                <div>
                  <Label>Website</Label>
                  <input style={fieldBase} type="url" value={formData.website} onChange={e => handleInputChange("website", e.target.value)} placeholder="https://www.company.com" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <Label>Company Address</Label>
                  <textarea style={{ ...fieldBase, resize: "none" }} rows={3} value={formData.companyAddress} onChange={e => handleInputChange("companyAddress", e.target.value)} placeholder="Enter company address" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <Label>Post Code</Label>
                  <input style={fieldBase} value={formData.postCode} onChange={e => handleInputChange("postCode", e.target.value)} placeholder="Enter post code" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <Label>Company Logo</Label>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <label htmlFor="companyLogo" style={{ padding: "8px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.6)", cursor: "pointer", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}>
                      Upload Logo
                    </label>
                    <input type="file" id="companyLogo" accept="image/*" onChange={handleLogoUpload} style={{ display: "none" }} />
                    {formData.companyLogo && <span style={{ fontSize: "11px", color: "#10b981" }}>{formData.companyLogo.name}</span>}
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Regions */}
            <GlassCard accentRgb="245,158,11">
              <CardHeader icon={<span style={{ fontSize: "13px" }}>📍</span>} label="Regions of Operation" accentRgb="245,158,11" />
              <div style={{ padding: "20px 24px 24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "7px", marginBottom: "14px" }}>
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
                          {r} <button type="button" onClick={() => handleRemoveRegion(r)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(245,158,11,0.6)", display: "flex", padding: 0 }}><X size={9} /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Sectors */}
            <GlassCard accentRgb="16,185,129">
              <CardHeader icon={<span style={{ fontSize: "13px" }}>⚡</span>} label="Industry Sector" accentRgb="16,185,129" />
              <div style={{ padding: "20px 24px 24px" }}>
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
                    {formData.industrySector.map(sector => {
                      const ms = getMainSectorFromSubsector(sector);
                      const rgb = SECTOR_ACCENT[ms] || "16,185,129";
                      return (
                        <span key={sector} style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 8px", borderRadius: "99px", background: `rgba(${rgb},0.1)`, border: `1px solid rgba(${rgb},0.3)`, fontSize: "11px", color: `rgb(${rgb})` }}>
                          {sector} <button type="button" onClick={() => handleRemoveSector(sector)} style={{ background: "none", border: "none", cursor: "pointer", color: `rgba(${rgb},0.6)`, display: "flex", padding: 0 }}><X size={9} /></button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Recruitment */}
            <GlassCard>
              <CardHeader icon={<span style={{ fontSize: "13px" }}>💼</span>} label="Company Type" />
              <div style={{ padding: "16px 24px 24px" }}>
                <Label>Are you a Recruitment Company?</Label>
                <div style={{ position: "relative" }}>
                  <select style={{ ...fieldBase, appearance: "none", paddingRight: "36px", cursor: "pointer" }} value={formData.isRecruitmentCompany} onChange={e => handleInputChange("isRecruitmentCompany", e.target.value)} onFocus={onFocus} onBlur={onBlur}>
                    <option value="">Select an option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  <ChevronDown size={13} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
                </div>
              </div>
            </GlassCard>

            {/* nav */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setStep(1)} style={{ padding: "10px 24px", borderRadius: "99px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", cursor: "pointer" }}>← Back</button>
              <button onClick={() => setShowSubscriptionModal(true)} style={{ padding: "10px 28px", borderRadius: "99px", background: "linear-gradient(135deg, #8b5cf6, #ec4899)", border: "none", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, cursor: "pointer", boxShadow: "0 0 20px rgba(139,92,246,0.35)" }}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: ABOUT ── */}
        {step === 4 && (
          <GlassCard accentRgb="139,92,246">
            <CardHeader icon={<span style={{ fontSize: "13px" }}>📄</span>} label="About Your Company" accentRgb="139,92,246" />
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <Label>Describe your company</Label>
                <textarea style={{ ...fieldBase, resize: "none" }} rows={6} value={formData.companyDescription} onChange={handleCompanyDescriptionChange} placeholder="Tell us about your company, your mission, values, and what makes your business unique…" onFocus={onFocus} onBlur={onBlur} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                  <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{companyDescriptionWordCount}/{getMaxWords(confirmedPlan?.name)} words</p>
                  {companyDescriptionError && <p style={{ fontSize: "10px", color: "#ef4444" }}>{companyDescriptionError}</p>}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px" }}>
                <button onClick={() => setStep(2)} style={{ padding: "10px 24px", borderRadius: "99px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", cursor: "pointer" }}>← Back</button>
                <button disabled={!!companyDescriptionError} onClick={async () => {
                  try {
                    const token = localStorage.getItem("authToken");
                    const res = await fetch(`${API_BASE_URL}/companies/my-company`, { headers: { Authorization: `Bearer ${token}` } });
                    const result = await res.json();
                    if (result.success && result.data?.id) {
                      const upRes = await fetch(`${API_BASE_URL}/companies/${result.data.id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ companyDescription: formData.companyDescription }) });
                      const upResult = await upRes.json();
                      if (upResult.success) window.location.href = `/company/${result.data.slug || result.data.id}`;
                      else alert("Failed to update company description");
                    }
                  } catch (e) { console.error(e); alert("An error occurred. Please try again."); }
                }} style={{ padding: "10px 28px", borderRadius: "99px", background: companyDescriptionError ? "rgba(255,255,255,0.05)" : "#10b981", border: "none", color: companyDescriptionError ? "rgba(255,255,255,0.3)" : "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, cursor: companyDescriptionError ? "not-allowed" : "pointer", boxShadow: companyDescriptionError ? "none" : "0 0 20px rgba(16,185,129,0.3)" }}>
                  Finish
                </button>
              </div>
            </div>
          </GlassCard>
        )}
      </div>

      {/* ── SUBSCRIPTION MODAL ── */}
      {showSubscriptionModal && (
        <ModalShell accentRgb="139,92,246" maxWidth="760px" onClose={() => setShowSubscriptionModal(false)} eyebrow="Plans & Pricing" title="Choose Your Plan">
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px 24px", scrollbarWidth: "thin", scrollbarColor: "rgba(139,92,246,0.4) rgba(255,255,255,0.02)" }}>

            {/* Early Bird Banner */}
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 16px", borderRadius: "99px", background: "linear-gradient(135deg, rgba(249,115,22,0.2), rgba(239,68,68,0.2))", border: "1px solid rgba(249,115,22,0.4)", marginBottom: "14px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#f97316", letterSpacing: "0.08em", textTransform: "uppercase" }}>🔥 Early Bird — 30% Off</span>
              </div>

              {/* Countdown */}
              <div style={{ padding: "14px 20px", borderRadius: "14px", background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", marginBottom: "16px" }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9.5px", color: "#8b5cf6", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, marginBottom: "10px" }}>Offer Ends In</p>
                <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
                  {[["days","DAYS"],["hours","HRS"],["minutes","MIN"],["seconds","SEC"]].map(([k,l]) => (
                    <div key={k} style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: "#fff" }}>{timeLeft[k] || "00"}</div>
                      <div style={{ fontSize: "9px", color: "rgba(139,92,246,0.7)", letterSpacing: "0.1em" }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Billing toggle */}
              <PillToggle options={[{ value: "monthly", label: "Monthly" }, { value: "annually", label: "Annually" }]} value={billingCycle} onChange={setBillingCycle} />
            </div>

            {/* Plan Cards */}
            {!showAddonsStep && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
                {profileSubscriptionPlans.map((plan, i) => {
                  const isElite = plan.name === "ELITE";
                  const accentRgb = isElite ? "139,92,246" : "16,185,129";
                  return (
                    <div key={i} style={{ borderRadius: "16px", border: `1px solid rgba(${accentRgb},0.25)`, background: `rgba(${accentRgb},0.05)`, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                      <div style={{ height: "2px", background: `linear-gradient(90deg, transparent, rgb(${accentRgb}), transparent)` }} />
                      <div style={{ padding: "18px", flex: 1, display: "flex", flexDirection: "column" }}>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9.5px", color: `rgb(${accentRgb})`, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, marginBottom: "6px" }}>{plan.name}</p>
                        <div style={{ marginBottom: "12px" }}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: "#10b981" }}>£{plan.earlyBirdPrice}</span>
                            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>/{plan.duration}</span>
                          </div>
                          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textDecoration: "line-through" }}>£{plan.price}/{plan.duration}</p>
                        </div>
                        <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, fontWeight: 300, marginBottom: "14px" }}>{plan.description}</p>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
                          {plan.features.map((f, fi) => (
                            <div key={fi} style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                              <Check size={11} style={{ color: `rgb(${accentRgb})`, flexShrink: 0, marginTop: "2px" }} />
                              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", lineHeight: 1.5, fontWeight: 300 }}>{f}</span>
                            </div>
                          ))}
                        </div>
                        <button onClick={() => handlePlanSelection(plan)}
                          style={{ padding: "9px", borderRadius: "10px", background: `rgba(${accentRgb},0.15)`, border: `1px solid rgba(${accentRgb},0.35)`, color: `rgb(${accentRgb})`, fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                          onMouseEnter={e => { e.currentTarget.style.background = `rgba(${accentRgb},0.25)`; }}
                          onMouseLeave={e => { e.currentTarget.style.background = `rgba(${accentRgb},0.15)`; }}>
                          {plan.cta}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Addons Step */}
            {selectedPlan && showAddonsStep && (
              <div>
                <div style={{ textAlign: "center", marginBottom: "18px" }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>Enhance Your Plan</p>
                  <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.4)", fontWeight: 300, marginTop: "4px" }}>Add-on services for additional visibility — £300 each / 30 days</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
                  {addonServices.map(addon => {
                    const sel = selectedAddons.includes(addon.id);
                    return (
                      <button key={addon.id} type="button" onClick={() => handleAddonToggle(addon.id)}
                        style={{ padding: "12px", borderRadius: "12px", border: `1px solid ${sel ? "rgba(139,92,246,0.45)" : "rgba(255,255,255,0.08)"}`, background: sel ? "rgba(139,92,246,0.1)" : "rgba(255,255,255,0.025)", textAlign: "left", cursor: "pointer", transition: "all 0.15s" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "6px", marginBottom: "5px" }}>
                          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11.5px", fontWeight: 500, color: sel ? "#a78bfa" : "#fff", lineHeight: 1.4 }}>{addon.name}</p>
                          <div style={{ width: "14px", height: "14px", borderRadius: "4px", border: `1.5px solid ${sel ? "#8b5cf6" : "rgba(255,255,255,0.2)"}`, background: sel ? "rgba(139,92,246,0.2)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {sel && <Check size={8} color="#8b5cf6" />}
                          </div>
                        </div>
                        <p style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.4)", lineHeight: 1.4, fontWeight: 300 }}>{addon.description}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Summary */}
                <div style={{ padding: "14px 16px", borderRadius: "12px", background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.2)", marginBottom: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)" }}>Plan ({selectedPlan.name})</span>
                    <span style={{ fontSize: "12px", color: "#fff" }}>£{selectedPlan.earlyBirdPrice}/{selectedPlan.duration}</span>
                  </div>
                  {selectedAddons.length > 0 && selectedAddons.map(id => {
                    const a = addonServices.find(x => x.id === id);
                    return a ? (
                      <div key={id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{a.name}</span>
                        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>£{a.price}/30d</span>
                      </div>
                    ) : null;
                  })}
                  {selectedAddons.length > 0 && <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: "8px", paddingTop: "8px", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "12.5px", fontWeight: 600, color: "#fff" }}>Add-ons Total</span>
                    <span style={{ fontSize: "12.5px", fontWeight: 600, color: "#a78bfa" }}>£{addonTotal}/month</span>
                  </div>}
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => setShowSubscriptionModal(false)} style={{ flex: 1, padding: "10px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", cursor: "pointer" }}>Back</button>
                  <button onClick={handleProceedToPayment} style={{ flex: 2, padding: "10px", borderRadius: "10px", background: "linear-gradient(135deg, #8b5cf6, #ec4899)", border: "none", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", fontWeight: 600, cursor: "pointer", boxShadow: "0 0 20px rgba(139,92,246,0.3)" }}>
                    Proceed to Payment →
                  </button>
                </div>
              </div>
            )}
          </div>
        </ModalShell>
      )}

      {/* ── REGION MODAL ── */}
      {showRegionModal && selectedRegionForSubregions && (
        <ModalShell accentRgb="245,158,11" maxWidth="580px" onClose={() => setShowRegionModal(false)} eyebrow="Subregions" title={selectedRegionForSubregions}>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px", scrollbarWidth: "thin", scrollbarColor: "rgba(245,158,11,0.4) rgba(255,255,255,0.02)" }}>
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
          <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
            <button onClick={() => setShowRegionModal(false)} style={{ padding: "8px 22px", borderRadius: "99px", background: "#f59e0b", border: "none", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Done</button>
          </div>
        </ModalShell>
      )}

      {/* ── SECTOR MODAL ── */}
      {showSectorModal && (
        <ModalShell accentRgb="16,185,129" maxWidth="560px" onClose={() => setShowSectorModal(false)} eyebrow="Classification" title="Select Industry Sector">
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", scrollbarWidth: "thin", scrollbarColor: "rgba(16,185,129,0.4) rgba(255,255,255,0.02)" }}>
            {mainSectors.map(ms => {
              const rgb = SECTOR_ACCENT[ms] || "16,185,129";
              return (
                <button key={ms} type="button" onClick={() => handleMainSectorSelect(ms)}
                  style={{ padding: "12px 14px", borderRadius: "12px", border: `1px solid rgba(${rgb},0.25)`, background: `rgba(${rgb},0.06)`, fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 500, color: "#fff", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = `rgba(${rgb},0.14)`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `rgba(${rgb},0.06)`; }}>
                  {ms}
                  <ChevronDown size={12} style={{ color: `rgba(${rgb},0.6)`, transform: "rotate(-90deg)" }} />
                </button>
              );
            })}
          </div>
          <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
            <button onClick={() => setShowSectorModal(false)} style={{ padding: "8px 22px", borderRadius: "99px", background: "#10b981", border: "none", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Done</button>
          </div>
        </ModalShell>
      )}

      {/* ── SUBSECTOR MODAL ── */}
      {showSubsectorsModal && selectedMainSector && (
        <ModalShell accentRgb={SECTOR_ACCENT[selectedMainSector]?.split(",").join(",") || "16,185,129"} maxWidth="580px" onClose={() => { setShowSubsectorsModal(false); setSelectedMainSector(null); setShowSectorModal(true); }} eyebrow="Subcategories" title={selectedMainSector}>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px", scrollbarWidth: "thin" }}>
            {sectorsMapping[selectedMainSector]?.subsectors.map(sub => {
              const sel = formData.industrySector.includes(sub);
              const rgb = SECTOR_ACCENT[selectedMainSector] || "16,185,129";
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
          <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", flexShrink: 0 }}>
            <button onClick={() => { setShowSubsectorsModal(false); setSelectedMainSector(null); setShowSectorModal(true); }}
              style={{ padding: "8px 18px", borderRadius: "99px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", cursor: "pointer" }}>
              ← Back
            </button>
            <button onClick={() => { setShowSubsectorsModal(false); setSelectedMainSector(null); }}
              style={{ padding: "8px 22px", borderRadius: "99px", background: `rgb(${SECTOR_ACCENT[selectedMainSector] || "16,185,129"})`, border: "none", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", fontWeight: 600, cursor: "pointer" }}>
              Done
            </button>
          </div>
        </ModalShell>
      )}

      {/* ── CONGRATS MODAL ── */}
      {showCongratsModal && confirmedPlan && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", background: "rgba(4,14,30,0.92)", backdropFilter: "blur(16px)" }}>
          <div style={{ width: "100%", maxWidth: "400px", background: "rgba(4,14,30,0.98)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: "24px", padding: "44px 32px", textAlign: "center", boxShadow: "0 40px 100px rgba(0,0,0,0.7)" }}>
            <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #10b981, transparent)", marginBottom: "32px", marginLeft: "-32px", marginRight: "-32px", marginTop: "-44px", borderRadius: "24px 24px 0 0" }} />
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Check size={22} color="#10b981" />
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>Congratulations!</h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.5)", fontWeight: 300, lineHeight: 1.7, marginBottom: "20px" }}>
              You have successfully subscribed to the <span style={{ color: "#10b981", fontWeight: 500 }}>{confirmedPlan?.name}</span> plan.
            </p>
            <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "24px" }}>
              <p style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.55)", fontWeight: 300, lineHeight: 1.7 }}>
                {confirmedPlan?.name?.toUpperCase() === "ELITE" ? "Welcome to the Elite tier! You've unlocked our premium suite of features for maximum impact." : "Welcome to the Professional tier! You now have access to enhanced visibility and growth tools."}
              </p>
            </div>
            <button onClick={() => { setShowCongratsModal(false); navigate("/"); }}
              style={{ width: "100%", padding: "12px", borderRadius: "12px", background: "#10b981", border: "none", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 600, cursor: "pointer", boxShadow: "0 0 24px rgba(16,185,129,0.3)" }}>
              Go to Home
            </button>
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", marginTop: "12px" }}>Redirecting automatically in 5 seconds…</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCompletionPage;

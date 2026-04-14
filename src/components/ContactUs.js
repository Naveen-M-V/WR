import React, { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useLocation } from "react-router-dom";
import {
  Send, User, Mail, Building2, FileText, MessageSquare,
  AlertCircle, CheckCircle2, HelpCircle, Upload, ChevronDown,
  Star, ThumbsUp, CreditCard, ArrowRight, X, ClipboardList, Check,
} from "lucide-react";
import { API_BASE_URL } from "../config";
import ScrollingBanner from "./home/ScrollingBanner";

/* ─────────────────────────────────────────────────────────────
   CONFIG
───────────────────────────────────────────────────────────── */
const CONTACT_TABS = [
  { id: "financial",   label: "Financial Enquiries",  icon: CreditCard,    accent: "#10b981", rgb: "16,185,129"  },
  { id: "sales",       label: "Sales & Marketing",    icon: Building2,     accent: "#06b6d4", rgb: "6,182,212"   },
  { id: "support",     label: "Technical Support",    icon: HelpCircle,    accent: "#8b5cf6", rgb: "139,92,246"  },
  { id: "planning",    label: "Planning & Consultative", icon: ClipboardList, accent: "#ec4899", rgb: "236,72,153" },
  { id: "feedback",    label: "Feedback",             icon: MessageSquare, accent: "#f59e0b", rgb: "245,158,11"  },
];

const FINANCIAL_ISSUE_CATEGORIES = {
  "Payments & Billing": ["Invoice request", "Payment confirmation", "Payment issue"],
  "Statements": ["Subscription statement request", "Transaction clarification"],
  "Banking & Remittance": ["Update our bank details"],
  "Pricing & Subscription": ["Pricing clarification", "Subscription clarification", "Contract / commercial terms query", "Tax / VAT clarification"],
  "Other": ["Update billing contact details", "Dispute a charge", "Other financial enquiry"],
};

const SUPPORT_QUERIES = {
  "General Technical Inquiry": ["For questions that don't fit other categories"],
  "Login Issues": ["Password reset", "Locked account", "Unable to Login"],
  "Software/Application Issues": ["Bugs", "Crashes", "Features not working"],
  "Urgent / Critical Incident": ["System down", "Major outage"],
  "Report a Bug": ["Dedicated bug reporting"],
  "Feature Request / Enhancement": ["Suggestions for improvements"],
  "Security Concerns": ["Suspected breach", "Malware", "Phishing"],
  "Content Management": ["Change of Profile Narrative / Content"],
  "Account Access & Permissions Requests": ["Manage Accounts"],
};

const SALES_CATEGORIES = {
  "Advertise with Which Renewables": ["Advertising opportunity", "Sponsorship request", "Event collaboration", "Brand collaboration", "Media / PR enquiry", "Influencer collaboration", "Marketing campaign enquiry"],
  "Sales Enquiries": ["Subscription clarification", "Request a quotation", "Book a Teams Demo Call", "Request a Teams Call", "Bulk / corporate purchase", "Custom solution request"],
};

const PLANNING_CONSULTATION_TYPES = {
  "Project Design & Outline Cost": ["Initial concept design", "Detailed project specifications", "Cost estimation", "Feasibility study"],
  "Infrastructure & Planning": ["Site assessment", "Infrastructure requirements", "Regulatory compliance", "Environmental impact"],
  "Capital Provision or Funding": ["Funding options", "Investment planning", "Financial modeling", "Grant applications"],
  "Planning & Infrastructure": ["Strategic planning", "Resource allocation", "Timeline planning", "Risk management"],
  "Project Delivery & Installation": ["Project management", "Installation services", "Quality assurance", "Post-installation support"],
};

const FEEDBACK_RATINGS = [5, 4, 3, 2, 1];

/* ─────────────────────────────────────────────────────────────
   FIELD COMPONENTS
───────────────────────────────────────────────────────────── */
const fieldLabelStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "10px",
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.45)",
  display: "block",
  marginBottom: "8px",
};

const fieldBase = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  padding: "11px 16px",
  color: "#ffffff",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "13px",
  fontWeight: 300,
  outline: "none",
};

const makeFocus = (accentRgb) => (e) => {
  e.currentTarget.style.borderColor = `rgba(${accentRgb},0.5)`;
  e.currentTarget.style.background = `rgba(${accentRgb},0.04)`;
};
const makeBlur = (e) => {
  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
};

const Input = ({ label, accentRgb, icon: Icon, ...props }) => (
  <div>
    <label style={fieldLabelStyle}>{label}{props.required && <span style={{ color: "#ef4444" }}> *</span>}</label>
    <div className="relative">
      {Icon && <Icon size={13} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />}
      <input {...props} style={{ ...fieldBase, paddingLeft: Icon ? "36px" : "16px" }}
        onFocus={makeFocus(accentRgb || "16,185,129")} onBlur={makeBlur} />
    </div>
  </div>
);

const Select = ({ label, accentRgb, children, ...props }) => (
  <div>
    <label style={fieldLabelStyle}>{label}{props.required && <span style={{ color: "#ef4444" }}> *</span>}</label>
    <div className="relative">
      <select {...props} style={{ ...fieldBase, appearance: "none", paddingRight: "36px", cursor: "pointer" }}
        onFocus={makeFocus(accentRgb || "16,185,129")} onBlur={makeBlur}>
        {children}
      </select>
      <ChevronDown size={13} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(255,255,255,0.3)" }} />
    </div>
  </div>
);

const Textarea = ({ label, accentRgb, ...props }) => (
  <div>
    <label style={fieldLabelStyle}>{label}{props.required && <span style={{ color: "#ef4444" }}> *</span>}</label>
    <textarea {...props} style={{ ...fieldBase, minHeight: "110px", resize: "vertical" }}
      onFocus={makeFocus(accentRgb || "16,185,129")} onBlur={makeBlur} />
  </div>
);

const FileInput = ({ label, description, onChange }) => (
  <div>
    <label style={fieldLabelStyle}>{label}</label>
    <div className="relative overflow-hidden rounded-xl border border-dashed transition-all duration-200"
      style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>
      <input type="file" onChange={onChange} className="block w-full text-sm cursor-pointer p-4"
        style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }} />
    </div>
    {description && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10.5px", color: "rgba(255,255,255,0.25)", marginTop: "6px" }}>{description}</p>}
  </div>
);

const SubmitBtn = ({ submitting, label, accentHex, accentRgb }) => (
  <motion.button type="submit" disabled={submitting}
    className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full text-sm font-semibold disabled:opacity-50"
    style={{
      background: accentHex,
      color: "#ffffff",
      fontFamily: "'DM Sans', sans-serif",
      boxShadow: `0 0 24px rgba(${accentRgb},0.35)`,
      border: "none",
      cursor: submitting ? "not-allowed" : "pointer",
    }}
    whileHover={!submitting ? { scale: 1.04, boxShadow: `0 0 36px rgba(${accentRgb},0.55)` } : {}}
    whileTap={!submitting ? { scale: 0.97 } : {}}>
    {submitting ? "Sending…" : <><Send size={13} /> {label}</>}
  </motion.button>
);

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */
const ContactUs = () => {
  const [activeTabId, setActiveTabId] = useState("financial");
  const [submitState, setSubmitState] = useState({ submitting: false, success: "", error: "" });
  const [showPopup, setShowPopup] = useState(false);

  const [financialForm, setFinancialForm] = useState({ name: "", email: "", companyName: "", invoiceNumber: "", issueCategory: "Payments & Billing", subCategory: "", natureOfEnquiry: "", file: null });
  const [salesForm, setSalesForm] = useState({ name: "", email: "", companyName: "", category: "Advertise with Which Renewables", subCategory: "", natureOfEnquiry: "" });
  const [supportForm, setSupportForm] = useState({ name: "", email: "", companyName: "", priority: "Low", supportQuery: "General Technical Inquiry", subCategory: "", errorMessage: "", issueDescription: "", file: null });
  const [planningForm, setPlanningForm] = useState({ name: "", email: "", companyName: "", consultationType: "Project Design & Outline Cost", subCategory: "", projectDescription: "", budgetRange: "", timeline: "", preferredContact: "Email", phoneNumber: "", location: "", file: null });
  const [feedbackForm, setFeedbackForm] = useState({ name: "", email: "", companyName: "", role: "", rating: "", improvementArea: "", issueDescription: "", improvements: "", retryLikelihood: "", likedMost: "", positiveFeedback: "", recommendation: "", testimonialConsent: false, file: null });

  const heroRef = useRef(null);
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabFromQuery = params.get("tab")?.toLowerCase();
    const tabFromHash = location.hash.replace("#", "").toLowerCase();
    const requestedTab = tabFromQuery || tabFromHash;

    if (requestedTab && CONTACT_TABS.some((tab) => tab.id === requestedTab)) {
      setActiveTabId(requestedTab);
    }
  }, [location.search, location.hash]);

  const activeTab = CONTACT_TABS.find(t => t.id === activeTabId) ?? CONTACT_TABS[0];
  const financialSubs = FINANCIAL_ISSUE_CATEGORIES[financialForm.issueCategory] ?? [];
  const salesSubs = SALES_CATEGORIES[salesForm.category] ?? [];
  const supportSubs = SUPPORT_QUERIES[supportForm.supportQuery] ?? [];
  const planningSubs = PLANNING_CONSULTATION_TYPES[planningForm.consultationType] ?? [];

  const change = (setter, key) => (e) => {
    const val = e?.target?.type === "checkbox" ? e.target.checked : (e?.target?.value ?? "");
    setter(prev => {
      if (key === "issueCategory") return { ...prev, issueCategory: val, subCategory: FINANCIAL_ISSUE_CATEGORIES[val]?.[0] ?? "" };
      if (key === "category" && setter === setSalesForm) return { ...prev, category: val, subCategory: SALES_CATEGORIES[val]?.[0] ?? "" };
      if (key === "supportQuery" && setter === setSupportForm) return { ...prev, supportQuery: val, subCategory: SUPPORT_QUERIES[val]?.[0] ?? "" };
      if (key === "consultationType" && setter === setPlanningForm) return { ...prev, consultationType: val, subCategory: PLANNING_CONSULTATION_TYPES[val]?.[0] ?? "" };
      return { ...prev, [key]: val };
    });
  };

  const fileChange = (setter, key = "file") => (e) => setter(prev => ({ ...prev, [key]: e?.target?.files?.[0] ?? null }));

  const reset = () => {
    setFinancialForm({ name: "", email: "", companyName: "", invoiceNumber: "", issueCategory: "Payments & Billing", subCategory: "", natureOfEnquiry: "", file: null });
    setSalesForm({ name: "", email: "", companyName: "", category: "Advertise with Which Renewables", subCategory: "", natureOfEnquiry: "" });
    setSupportForm({ name: "", email: "", companyName: "", priority: "Low", supportQuery: "General Technical Inquiry", subCategory: "", errorMessage: "", issueDescription: "", file: null });
    setPlanningForm({ name: "", email: "", companyName: "", consultationType: "Project Design & Outline Cost", subCategory: "", projectDescription: "", budgetRange: "", timeline: "", preferredContact: "Email", phoneNumber: "", location: "", file: null });
    setFeedbackForm({ name: "", email: "", companyName: "", role: "", rating: "", improvementArea: "", issueDescription: "", improvements: "", retryLikelihood: "", likedMost: "", positiveFeedback: "", recommendation: "", testimonialConsent: false, file: null });
  };

  const submit = async (e, type, form) => {
    e?.preventDefault?.();
    if (submitState.submitting) return;
    if (!form?.name?.trim() || !form?.email?.trim()) {
      setSubmitState({ submitting: false, success: "", error: "Please enter your name and email address." });
      return;
    }
    setSubmitState({ submitting: true, success: "", error: "" });
    try {
      const payloadType = type === "planning" ? "planningConsultation" : type;
      const payload = type === "planning"
        ? {
            ...form,
            type: payloadType,
            projectLocation: form.location || form.projectLocation || "",
            projectValue: form.budgetRange || form.projectValue || "",
            supportType: [form.consultationType, form.subCategory].filter(Boolean).join(" - "),
            timeframe: form.timeline || "",
            additionalNotes: [
              form.projectDescription ? `Project Description: ${form.projectDescription}` : "",
              form.preferredContact ? `Preferred Contact: ${form.preferredContact}` : "",
              form.phoneNumber ? `Phone Number: ${form.phoneNumber}` : "",
              form.location ? `Preferred Location: ${form.location}` : "",
            ].filter(Boolean).join("\n"),
          }
        : { type: payloadType, ...form };

      let res;
      if (form.file) {
        const fd = new FormData();
        Object.entries(payload).forEach(([k, v]) => v != null && fd.append(k, v));
        res = await fetch(`${API_BASE_URL}/contact`, { method: "POST", body: fd });
      } else {
        res = await fetch(`${API_BASE_URL}/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.success === false) throw new Error(data?.error || "Failed to submit.");
      reset();
      setSubmitState({ submitting: false, success: "Thanks — your message has been sent successfully!", error: "" });
      setShowPopup(true);
    } catch (err) {
      setSubmitState({ submitting: false, success: "", error: err?.message || "Failed to submit. Please try again." });
      setShowPopup(true);
    }
  };

  const commonFields = (form, setter) => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input label="Full Name" placeholder="John Doe" icon={User} value={form.name} onChange={change(setter, "name")} accentRgb={activeTab.rgb} required />
        <Input label="Email Address" type="email" placeholder="john@company.com" icon={Mail} value={form.email} onChange={change(setter, "email")} accentRgb={activeTab.rgb} required />
      </div>
      <Input label="Company Name" placeholder="Your company name" icon={Building2} value={form.companyName || ""} onChange={change(setter, "companyName")} accentRgb={activeTab.rgb} />
    </>
  );

  const actionRow = (label, type, form, extra) => (
    <div className="flex items-center gap-4 flex-wrap pt-2">
      <button type="button" onClick={reset}
        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer" }}
        onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
        onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}>
        Clear Form
      </button>
      <SubmitBtn submitting={submitState.submitting} label={label} accentHex={activeTab.accent} accentRgb={activeTab.rgb} />
    </div>
  );

  const closePopup = () => {
    setShowPopup(false);
    setSubmitState({ submitting: false, success: "", error: "" });
  };

  return (
    <div className="min-h-screen text-white overflow-hidden" style={{ background: "#040e1e" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');
        .hero-text-mask { background: linear-gradient(175deg, #ffffff 0%, rgba(255,255,255,0.62) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        ::placeholder { color: rgba(255,255,255,0.25) !important; }
        textarea { resize: vertical; }
        select option { background: #040e1e; }
      `}</style>

      {/* blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, #10b981, transparent 70%)" }} />
        <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)" }} />
      </div>

      <ScrollingBanner />

      {/* ── HERO ── */}
      <div ref={heroRef} className="relative w-full overflow-hidden" style={{ height: "clamp(480px, 80vh, 750px)" }}>
        <motion.div className="absolute inset-0" style={{ y: heroY, willChange: "transform" }}>
          <img src="/new/contact.jpeg" alt="Contact" className="w-full h-full object-cover" style={{ filter: "brightness(1.08) saturate(1.2)" }} />
        </motion.div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(4,14,30,0.25) 0%, rgba(4,14,30,0.55) 60%, #040e1e 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(4,14,30,0.65) 0%, rgba(4,14,30,0.1) 60%, transparent 100%)" }} />

        <motion.div className="absolute inset-0 flex flex-col justify-end pb-16 px-8 md:px-16 lg:px-24 pt-32 w-full" style={{ opacity: heroOpacity, maxWidth: "65%" }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.7 }} className="flex items-center gap-3 mb-6">
            <div className="h-px w-10" style={{ background: "#10b981" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.22em", color: "#10b981", textTransform: "uppercase", fontWeight: 500 }}>Get In Touch</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hero-text-mask mb-5"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 4vw, 4.5rem)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.02em" }}>
            Contact<br />Which Renewables
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14px, 1.8vw, 18px)", color: "rgba(255,255,255,0.5)", maxWidth: "480px", lineHeight: 1.75, fontWeight: 300 }}>
            Our vision is to build a community where we all share a vision of making the planet a safer place for future generations.
          </motion.p>
        </motion.div>

        <motion.div className="absolute bottom-8 right-8 md:right-16 flex flex-col items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Scroll</span>
          <motion.div className="w-px h-10 origin-top" style={{ background: "linear-gradient(to bottom, rgba(16,185,129,0.6), transparent)" }}
            animate={{ scaleY: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        </motion.div>
      </div>

      {/* ── CONTACT PANEL ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-24">
        {/* main panel */}
        <div
          className="overflow-hidden rounded-2xl border flex flex-col lg:flex-row"
          style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.015)" }}
        >
          {/* ── SIDEBAR TABS ── */}
          <div
            className="w-full lg:w-72 flex-shrink-0 border-b lg:border-b-0 lg:border-r p-6 flex flex-col gap-1"
            style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
          >
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, marginBottom: "12px", paddingLeft: "4px" }}>
              How can Which Renewables help you?
            </p>
            {CONTACT_TABS.map((tab) => {
              const active = tab.id === activeTabId;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className="relative w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-300 overflow-hidden"
                  style={{
                    borderColor: active ? `rgba(${tab.rgb},0.35)` : "rgba(255,255,255,0.05)",
                    background: active ? `rgba(${tab.rgb},0.1)` : "transparent",
                  }}
                  onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}}
                  onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}}
                >
                  {active && (
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] rounded-l-xl"
                      style={{ background: tab.accent }} />
                  )}
                  <div className="flex items-center gap-3">
                    <Icon size={16} style={{ color: active ? tab.accent : "rgba(255,255,255,0.3)", flexShrink: 0 }} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: active ? 500 : 300, color: active ? tab.accent : "rgba(255,255,255,0.55)" }}>
                      {tab.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── FORM AREA ── */}
          <div className="flex-1 p-8 md:p-10">
            {/* tab header */}
            <div className="mb-8 pb-6 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-px w-8" style={{ background: activeTab.accent }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: activeTab.accent, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>
                  {activeTab.label}
                </span>
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.2rem, 2vw, 1.6rem)", fontWeight: 700, color: "#ffffff" }}>
                {activeTab.label}
              </h2>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeTabId} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.3 }}>

                {/* ── FINANCIAL ── */}
                {activeTabId === "financial" && (
                  <form onSubmit={(e) => submit(e, "financial", financialForm)} className="space-y-5">
                    {commonFields(financialForm, setFinancialForm)}
                    <Input label="Invoice Number" placeholder="INV-2024-001" icon={FileText} value={financialForm.invoiceNumber} onChange={change(setFinancialForm, "invoiceNumber")} accentRgb={activeTab.rgb} />
                    <Select label="Issue Category" value={financialForm.issueCategory} onChange={change(setFinancialForm, "issueCategory")} accentRgb={activeTab.rgb}>
                      {Object.keys(FINANCIAL_ISSUE_CATEGORIES).map(k => <option key={k} value={k}>{k}</option>)}
                    </Select>
                    {financialSubs.length > 0 && (
                      <Select label="Sub Category" value={financialForm.subCategory} onChange={change(setFinancialForm, "subCategory")} accentRgb={activeTab.rgb}>
                        {financialSubs.map(s => <option key={s} value={s}>{s}</option>)}
                      </Select>
                    )}
                    <Textarea label="Nature of Enquiry" placeholder="Please describe your query in detail…" value={financialForm.natureOfEnquiry} onChange={change(setFinancialForm, "natureOfEnquiry")} accentRgb={activeTab.rgb} />
                    <FileInput label="Attach Document" description="Optional: Upload remittance advice or proof of payment (Max 5MB)" onChange={fileChange(setFinancialForm)} />
                    {actionRow("Send Request", "financial", financialForm)}
                  </form>
                )}

                {/* ── SALES ── */}
                {activeTabId === "sales" && (
                  <form onSubmit={(e) => submit(e, "sales", salesForm)} className="space-y-5">
                    {commonFields(salesForm, setSalesForm)}
                    <Select label="Category" value={salesForm.category} onChange={change(setSalesForm, "category")} accentRgb={activeTab.rgb}>
                      {Object.keys(SALES_CATEGORIES).map(k => <option key={k} value={k}>{k}</option>)}
                    </Select>
                    {salesSubs.length > 0 && (
                      <Select label="Sub Category" value={salesForm.subCategory} onChange={change(setSalesForm, "subCategory")} accentRgb={activeTab.rgb}>
                        {salesSubs.map(s => <option key={s} value={s}>{s}</option>)}
                      </Select>
                    )}
                    <Textarea label="How can Which Renewables help you?" placeholder="Tell us about your goals and what you're looking for…" value={salesForm.natureOfEnquiry} onChange={change(setSalesForm, "natureOfEnquiry")} accentRgb={activeTab.rgb} />
                    {actionRow("Send Enquiry", "sales", salesForm)}
                  </form>
                )}

                {/* ── SUPPORT ── */}
                {activeTabId === "support" && (
                  <form onSubmit={(e) => submit(e, "support", supportForm)} className="space-y-5">
                    {commonFields(supportForm, setSupportForm)}
                    <Select label="Priority Level" value={supportForm.priority} onChange={change(setSupportForm, "priority")} accentRgb={activeTab.rgb}>
                      {["Low", "Medium", "High", "Critical"].map(p => <option key={p} value={p}>{p}</option>)}
                    </Select>
                    <Select label="Support Query" value={supportForm.supportQuery} onChange={change(setSupportForm, "supportQuery")} accentRgb={activeTab.rgb}>
                      {Object.keys(SUPPORT_QUERIES).map(q => <option key={q} value={q}>{q}</option>)}
                    </Select>
                    {supportSubs.length > 0 && (
                      <Select label="Sub Category" value={supportForm.subCategory} onChange={change(setSupportForm, "subCategory")} accentRgb={activeTab.rgb}>
                        {supportSubs.map(s => <option key={s} value={s}>{s}</option>)}
                      </Select>
                    )}
                    <Textarea label="Error Message (if any)" placeholder="Paste any error codes or messages here…" value={supportForm.errorMessage} onChange={change(setSupportForm, "errorMessage")} accentRgb={activeTab.rgb} />
                    <Textarea label="Issue Description" placeholder="Please describe what happened, steps to reproduce, etc." value={supportForm.issueDescription} onChange={change(setSupportForm, "issueDescription")} accentRgb={activeTab.rgb} required />
                    <FileInput label="Screenshots / Logs" description="Upload relevant screenshots or log files (Max 10MB)" onChange={fileChange(setSupportForm)} />
                    {actionRow("Submit Ticket", "support", supportForm)}
                  </form>
                )}

                {/* ── PLANNING & CONSULTATIVE ── */}
                {activeTabId === "planning" && (
                  <form onSubmit={(e) => submit(e, "planning", planningForm)} className="space-y-5">
                    {commonFields(planningForm, setPlanningForm)}
                    <Select label="Consultation Type" value={planningForm.consultationType} onChange={change(setPlanningForm, "consultationType")} accentRgb={activeTab.rgb}>
                      {Object.keys(PLANNING_CONSULTATION_TYPES).map(k => <option key={k} value={k}>{k}</option>)}
                    </Select>
                    {planningSubs.length > 0 && (
                      <Select label="Specific Area" value={planningForm.subCategory} onChange={change(setPlanningForm, "subCategory")} accentRgb={activeTab.rgb}>
                        {planningSubs.map(s => <option key={s} value={s}>{s}</option>)}
                      </Select>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Select label="Budget Range" value={planningForm.budgetRange} onChange={change(setPlanningForm, "budgetRange")} accentRgb={activeTab.rgb}>
                        <option value="">Select budget range…</option>
                        <option value="Under $10,000">Under $10,000</option>
                        <option value="$10,000 - $50,000">$10,000 - $50,000</option>
                        <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                        <option value="$100,000 - $500,000">$100,000 - $500,000</option>
                        <option value="Over $500,000">Over $500,000</option>
                      </Select>
                      <Select label="Preferred Timeline" value={planningForm.timeline} onChange={change(setPlanningForm, "timeline")} accentRgb={activeTab.rgb}>
                        <option value="">Select timeline…</option>
                        <option value="Immediate (within 1 month)">Immediate (within 1 month)</option>
                        <option value="Short-term (1-3 months)">Short-term (1-3 months)</option>
                        <option value="Medium-term (3-6 months)">Medium-term (3-6 months)</option>
                        <option value="Long-term (6+ months)">Long-term (6+ months)</option>
                      </Select>
                    </div>
                    <Select label="Preferred Contact Method" value={planningForm.preferredContact} onChange={change(setPlanningForm, "preferredContact")} accentRgb={activeTab.rgb}>
                      <option value="Email">Email</option>
                      <option value="Phone">Phone</option>
                      <option value="Video Call">Video Call</option>
                      <option value="In-person Meeting">In-person Meeting</option>
                    </Select>
                    {(planningForm.preferredContact === "Phone" || planningForm.preferredContact === "In-person Meeting") && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <Input label="Phone Number" placeholder="Enter your phone number" type="tel" value={planningForm.phoneNumber} onChange={change(setPlanningForm, "phoneNumber")} accentRgb={activeTab.rgb} required />
                      </motion.div>
                    )}
                    {planningForm.preferredContact === "In-person Meeting" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <Input label="Preferred Location" placeholder="Enter your preferred meeting location or address" value={planningForm.location} onChange={change(setPlanningForm, "location")} accentRgb={activeTab.rgb} required />
                      </motion.div>
                    )}
                    <Textarea label="Project Description" placeholder="Describe your project, goals, and what you need help with…" value={planningForm.projectDescription} onChange={change(setPlanningForm, "projectDescription")} accentRgb={activeTab.rgb} required />
                    <FileInput label="Supporting Documents" description="Upload any relevant documents, RFPs, or project briefs (Max 10MB)" onChange={fileChange(setPlanningForm)} />
                    {actionRow("Request Consultation", "planning", planningForm)}
                  </form>
                )}

                {/* ── FEEDBACK ── */}
                {activeTabId === "feedback" && (
                  <form onSubmit={(e) => submit(e, "feedback", feedbackForm)} className="space-y-5">
                    {commonFields(feedbackForm, setFeedbackForm)}
                    <Input label="Role" placeholder="e.g. CEO, Engineer, Manager" value={feedbackForm.role || ""} onChange={change(setFeedbackForm, "role")} accentRgb="245,158,11" />
                    <FileInput label="Your Photo" description="Optional: Upload your profile image (Max 5MB, JPG/PNG)" onChange={fileChange(setFeedbackForm, "file")} />

                    {/* star rating */}
                    <div>
                      <label style={fieldLabelStyle}>How would you rate your experience? <span style={{ color: "#ef4444" }}>*</span></label>
                      <div className="flex flex-wrap gap-2">
                        {FEEDBACK_RATINGS.map((r) => {
                          const sel = feedbackForm.rating === String(r);
                          const low = r <= 3;
                          const col = low ? "#f59e0b" : "#10b981";
                          const rgb = low ? "245,158,11" : "16,185,129";
                          return (
                            <button key={r} type="button" onClick={() => setFeedbackForm(p => ({ ...p, rating: String(r) }))}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all duration-200"
                              style={{
                                borderColor: sel ? `rgba(${rgb},0.5)` : "rgba(255,255,255,0.1)",
                                background: sel ? `rgba(${rgb},0.1)` : "rgba(255,255,255,0.03)",
                              }}>
                              <div className="flex">
                                {[...Array(r)].map((_, i) => (
                                  <Star key={i} size={12} style={{ color: sel ? col : "rgba(255,255,255,0.2)", fill: sel ? col : "rgba(255,255,255,0.1)" }} />
                                ))}
                              </div>
                              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: sel ? col : "rgba(255,255,255,0.4)" }}>
                                {r} {r === 1 ? "star" : "stars"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* dynamic feedback fields */}
                    <AnimatePresence>
                      {feedbackForm.rating && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden space-y-5">

                          {/* info banner */}
                          <div className="rounded-xl border p-4"
                            style={{
                              borderColor: parseInt(feedbackForm.rating) <= 3 ? "rgba(245,158,11,0.25)" : "rgba(16,185,129,0.25)",
                              background: parseInt(feedbackForm.rating) <= 3 ? "rgba(245,158,11,0.06)" : "rgba(16,185,129,0.06)",
                            }}>
                            <div className="flex items-center gap-2 mb-1">
                              {parseInt(feedbackForm.rating) <= 3
                                ? <AlertCircle size={14} style={{ color: "#f59e0b" }} />
                                : <ThumbsUp size={14} style={{ color: "#10b981" }} />}
                              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 600, color: parseInt(feedbackForm.rating) <= 3 ? "#f59e0b" : "#10b981" }}>
                                {parseInt(feedbackForm.rating) <= 3 ? "Help Us Improve" : "Thank You for Your Feedback!"}
                              </span>
                            </div>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>
                              {parseInt(feedbackForm.rating) <= 3
                                ? "We value your feedback and want to make things right. Please tell us what went wrong."
                                : "We're glad you had a great experience. Share more about what you loved!"}
                            </p>
                          </div>

                          {parseInt(feedbackForm.rating) <= 3 ? (
                            <>
                              <Select label="What area needs improvement?" value={feedbackForm.improvementArea || ""} onChange={change(setFeedbackForm, "improvementArea")} accentRgb="245,158,11" required>
                                <option value="">Select an area…</option>
                                {["User Experience / Website Navigation", "Content Quality / Relevance", "Missing Features / Functionality", "Website Performance / Speed", "Customer Support", "Pricing / Plans", "Other"].map(o => <option key={o} value={o}>{o}</option>)}
                              </Select>
                              <Textarea label="What went wrong?" placeholder="Please describe the issue you experienced…" value={feedbackForm.issueDescription || ""} onChange={change(setFeedbackForm, "issueDescription")} accentRgb="245,158,11" required />
                              <Textarea label="How can we improve?" placeholder="What would have made your experience better?" value={feedbackForm.improvements || ""} onChange={change(setFeedbackForm, "improvements")} accentRgb="245,158,11" required />
                              <Select label="How likely are you to give us another try?" value={feedbackForm.retryLikelihood || ""} onChange={change(setFeedbackForm, "retryLikelihood")} accentRgb="245,158,11">
                                <option value="">Select an option…</option>
                                {["Very likely - Just fix the issues", "Somewhat likely - Depends on improvements", "Not sure - Need to see changes first", "Unlikely - Switching to alternative"].map(o => <option key={o} value={o}>{o}</option>)}
                              </Select>
                            </>
                          ) : (
                            <>
                              <Select label="What did you like most?" value={feedbackForm.likedMost || ""} onChange={change(setFeedbackForm, "likedMost")} accentRgb="16,185,129" required>
                                <option value="">Select what you liked…</option>
                                {["Quality Content / Information", "Easy to Use / Navigate", "Helpful Features / Tools", "Excellent Customer Support", "Community / Networking", "Value for Money", "Website Design / Look & Feel", "Something else"].map(o => <option key={o} value={o}>{o}</option>)}
                              </Select>
                              <Textarea label="Leave your feedback here" placeholder="Tell us about your experience and what made it great…" value={feedbackForm.positiveFeedback || ""} onChange={change(setFeedbackForm, "positiveFeedback")} accentRgb="16,185,129" required />
                              <Textarea label="Would you recommend us to others?" placeholder="Share why you would (or wouldn't) recommend Which Renewables…" value={feedbackForm.recommendation || ""} onChange={change(setFeedbackForm, "recommendation")} accentRgb="16,185,129" />

                              {/* testimonial consent */}
                              <div className="flex items-start gap-3">
                                <div
                                  className="relative flex-shrink-0 w-5 h-5 rounded border cursor-pointer transition-all duration-200 mt-0.5"
                                  style={{ borderColor: feedbackForm.testimonialConsent ? "#10b981" : "rgba(255,255,255,0.2)", background: feedbackForm.testimonialConsent ? "rgba(16,185,129,0.15)" : "transparent" }}
                                  onClick={() => setFeedbackForm(f => ({ ...f, testimonialConsent: !f.testimonialConsent }))}
                                >
                                  {feedbackForm.testimonialConsent && (
                                    <svg className="absolute inset-0 m-auto" width="11" height="9" viewBox="0 0 11 9" fill="none">
                                      <path d="M1 4L4 7.5L10 1" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  )}
                                </div>
                                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontWeight: 300 }}>
                                  <span style={{ color: "#ffffff", fontWeight: 500 }}>May we use your feedback as a testimonial?</span><br />
                                  We may feature your comments on our website. Only your first name and company will be shown.
                                </p>
                              </div>
                            </>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {actionRow("Send Feedback", "feedback", feedbackForm)}
                  </form>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── POPUP MODAL ── */}
      {showPopup && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(4,14,30,0.9)", backdropFilter: "blur(10px)" }}
          onClick={closePopup}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative max-w-md w-full rounded-2xl border p-8 text-center"
            style={{
              background: "rgba(4,14,30,0.98)",
              borderColor: submitState.error ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${submitState.error ? "#ef4444" : "#10b981"}, transparent)`
              }} />

            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{
                background: submitState.error ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
                border: `1px solid ${submitState.error ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}`
              }}
            >
              {submitState.error ? (
                <X size={28} style={{ color: "#ef4444" }} />
              ) : (
                <Check size={28} style={{ color: "#10b981" }} />
              )}
            </div>

            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.4rem",
                color: "#ffffff",
                marginBottom: "12px"
              }}
            >
              {submitState.error ? "Submission Failed" : "Submission Successful"}
            </h3>

            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.6,
                marginBottom: "24px"
              }}
            >
              {submitState.error || submitState.success}
            </p>

            <button
              onClick={closePopup}
              className="px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                background: submitState.error ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)",
                color: submitState.error ? "#ef4444" : "#10b981",
                border: `1px solid ${submitState.error ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}`,
                fontFamily: "'DM Sans', sans-serif",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = submitState.error ? "rgba(239,68,68,0.25)" : "rgba(16,185,129,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = submitState.error ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)";
              }}
            >
              {submitState.error ? "Try Again" : "OK"}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ContactUs;

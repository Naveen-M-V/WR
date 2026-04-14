import React, { useEffect, useState } from "react";
import ScrollingBanner from "../home/ScrollingBanner";
import {
  MapPin, Sparkles, Zap, X, Phone, CheckCircle, Mail,
  Search, Building2, Award, FileText, FolderGit2, Newspaper,
  ArrowRight, Globe, ChevronDown, Filter,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { getSpotlightCompanies } from "../../utils/companiesAPI";
import { API_HOST } from "../../config";
import { useRef } from "react";

const QUICK_LINKS = [
  { title: "Awards",       icon: Award,      tabId: "awards",       accent: "#f59e0b", rgb: "245,158,11"  },
  { title: "Certificates", icon: FileText,   tabId: "certificates", accent: "#06b6d4", rgb: "6,182,212"   },
  { title: "Projects",     icon: FolderGit2, tabId: "projects",     accent: "#10b981", rgb: "16,185,129"  },
  { title: "News",         icon: Newspaper,  tabId: "events",       accent: "#8b5cf6", rgb: "139,92,246"  },
];

/* ─────────────────────────────────────────────────────────────
   COMPANY CARD
───────────────────────────────────────────────────────────── */
const CompanyCard = ({ company, index }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative overflow-hidden rounded-2xl border transition-all duration-500 flex flex-col md:flex-row"
        style={{
          borderColor: hovered ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.07)",
          background: hovered
            ? "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(4,14,30,0.98) 100%)"
            : "rgba(255,255,255,0.025)",
          boxShadow: hovered
            ? "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(16,185,129,0.2)"
            : "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {/* top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] z-10 transition-opacity duration-500"
          style={{
            background: "linear-gradient(90deg, transparent, #10b981, transparent)",
            opacity: hovered ? 1 : 0.2,
          }}
        />

        {/* logo panel */}
        <div
          className="relative overflow-hidden flex-shrink-0 flex items-center justify-center"
          style={{
            width: "clamp(160px, 26%, 260px)",
            minHeight: "180px",
            background: "rgba(255,255,255,0.97)",
          }}
        >
          <img
            src={company.img}
            alt={company.name}
            className="w-full h-full object-contain p-8 transition-transform duration-700"
            style={{ transform: hovered ? "scale(1.04)" : "scale(1)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(90deg, rgba(4,14,30,0) 60%, rgba(4,14,30,0.5) 100%)" }}
          />

          {/* category badge */}
          <div
            className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
            style={{
              borderColor: "rgba(16,185,129,0.5)",
              background: "rgba(4,14,30,0.75)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "9.5px",
              fontWeight: 600,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: "#10b981",
            }}
          >
            <Sparkles size={9} />
            {company.category || "Featured"}
          </div>
        </div>

        {/* content */}
        <div className="flex-1 flex flex-col px-6 md:px-8 py-5">

          {/* name + location */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Zap size={10} style={{ color: "#10b981" }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#10b981", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Featured Company
                </span>
              </div>
              <h3
                className="font-bold text-white leading-snug"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1rem, 1.6vw, 1.3rem)" }}
              >
                {company.name}
              </h3>
            </div>

            {company.location && (
              <div
                className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
                style={{
                  borderColor: "rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "10.5px",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                <MapPin size={10} style={{ color: "#10b981" }} />
                <span className="max-w-[120px] truncate">{company.location}</span>
              </div>
            )}
          </div>

          {/* accent rule */}
          <div
            className="mb-3 h-px transition-all duration-500"
            style={{
              background: "linear-gradient(90deg, #10b981, transparent)",
              width: hovered ? "52px" : "24px",
            }}
          />

          {/* description */}
          <p
            className="line-clamp-2 mb-5"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12.5px",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            {company.desc}
          </p>

          {/* quick links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.tabId}
                to={`/company/${company.slug}?tab=${link.tabId}`}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200"
                style={{
                  borderColor: "rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.025)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `rgba(${link.rgb},0.35)`;
                  e.currentTarget.style.background = `rgba(${link.rgb},0.07)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.025)";
                }}
              >
                <link.icon size={12} style={{ color: link.accent, flexShrink: 0 }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.55)", fontWeight: 400 }}>
                  {link.title}
                </span>
              </Link>
            ))}
          </div>

          {/* actions */}
          <div
            className="flex items-center justify-between pt-4 mt-auto flex-wrap gap-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-200"
                style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", textDecoration: "none" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#ffffff"}
                onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
              >
                <Globe size={12} />
                Website
              </a>
            )}

            <Link
              to={`/company/${company.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-200"
              style={{ color: "#10b981", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", textDecoration: "none" }}
            >
              Explore Profile
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-700"
          style={{
            background: "radial-gradient(ellipse at 80% 50%, rgba(16,185,129,0.07), transparent 60%)",
            opacity: hovered ? 1 : 0,
          }}
        />
      </div>
    </motion.article>
  );
};

/* ─────────────────────────────────────────────────────────────
   CONSULTATION MODAL
───────────────────────────────────────────────────────────── */
const ConsultationModal = ({ onClose }) => {
  const [form, setForm] = useState({
    contactName: "", company: "", email: "", phone: "",
    datetime: "", contactMethod: "Email", consent: false,
  });

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = (e) => {
    e.preventDefault();
    console.log("Consultation Request", form);
    onClose();
  };

  const fieldStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "12px",
    padding: "11px 16px",
    color: "#ffffff",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    fontWeight: 300,
    outline: "none",
  };

  const focusStyle = (e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.45)"; e.currentTarget.style.background = "rgba(16,185,129,0.04)"; };
  const blurStyle  = (e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(4,14,30,0.88)", backdropFilter: "blur(14px)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-2xl border overflow-hidden"
        style={{
          maxHeight: "90vh",
          overflowY: "auto",
          background: "rgba(4,14,30,0.97)",
          borderColor: "rgba(16,185,129,0.25)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(16,185,129,0.4) rgba(255,255,255,0.02)",
        }}
      >
        <div className="h-[2px]"
          style={{ background: "linear-gradient(90deg, transparent, #10b981, transparent)" }} />

        <div className="p-8">
          {/* header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8" style={{ background: "#10b981" }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#10b981", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500 }}>
                  Get Featured
                </span>
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.3rem, 2vw, 1.7rem)", fontWeight: 700, color: "#ffffff" }}>
                Book a Consultation
              </h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "6px", fontWeight: 300 }}>
                Connect with our team to discuss featuring your company
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 mt-1"
              style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)"; e.currentTarget.style.color = "#10b981"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
            >
              <X size={14} />
            </button>
          </div>

          <form onSubmit={submit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {[
                { label: "Contact Name", name: "contactName", placeholder: "John Smith", type: "text" },
                { label: "Company Name", name: "company",     placeholder: "Green Energy Ltd", type: "text" },
              ].map(({ label, name, placeholder, type }) => (
                <div key={name}>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>{label}</label>
                  <input type={type} name={name} value={form[name]} onChange={onChange} placeholder={placeholder} required
                    style={fieldStyle} onFocus={focusStyle} onBlur={blurStyle} />
                </div>
              ))}

              <div>
                <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Email</label>
                <div className="relative">
                  <Mail size={12} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
                  <input type="email" name="email" value={form.email} onChange={onChange} placeholder="john@company.com" required
                    style={{ ...fieldStyle, paddingLeft: "34px" }} onFocus={focusStyle} onBlur={blurStyle} />
                </div>
              </div>

              <div>
                <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Phone</label>
                <div className="relative">
                  <Phone size={12} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
                  <input name="phone" value={form.phone} onChange={onChange} placeholder="+44 123 456 7890" required
                    style={{ ...fieldStyle, paddingLeft: "34px" }} onFocus={focusStyle} onBlur={blurStyle} />
                </div>
              </div>

              <div>
                <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Preferred Date</label>
                <input type="datetime-local" name="datetime" value={form.datetime} onChange={onChange} required
                  style={fieldStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>

              <div>
                <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Contact Method</label>
                <select name="contactMethod" value={form.contactMethod} onChange={onChange}
                  style={{ ...fieldStyle, cursor: "pointer", appearance: "none" }}>
                  {["Email","Phone","Either"].map(v => <option key={v} value={v} style={{ background: "#040e1e" }}>{v}</option>)}
                </select>
              </div>
            </div>

            {/* consent */}
            <div className="flex items-start gap-3 mb-6 pt-2">
              <div
                className="relative flex-shrink-0 w-5 h-5 rounded border cursor-pointer transition-all duration-200 mt-0.5"
                style={{
                  borderColor: form.consent ? "#10b981" : "rgba(255,255,255,0.2)",
                  background: form.consent ? "rgba(16,185,129,0.15)" : "transparent",
                }}
                onClick={() => setForm(f => ({ ...f, consent: !f.consent }))}
              >
                {form.consent && (
                  <svg className="absolute inset-0 m-auto" width="11" height="9" viewBox="0 0 11 9" fill="none">
                    <path d="M1 4L4 7.5L10 1" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, fontWeight: 300 }}>
                I agree to be contacted by Which Renewables regarding my inquiry.
              </span>
            </div>

            {/* footer */}
            <div
              className="flex items-center justify-between pt-4 flex-wrap gap-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-2" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11.5px", color: "rgba(16,185,129,0.7)" }}>
                <CheckCircle size={13} />
                GDPR Compliant
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={onClose}
                  className="px-5 py-2.5 rounded-full border text-sm transition-all duration-200"
                  style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
                  Cancel
                </button>
                <motion.button type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium"
                  style={{ background: "#10b981", color: "#ffffff", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 0 20px rgba(16,185,129,0.3)" }}
                  whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(16,185,129,0.5)" }}
                  whileTap={{ scale: 0.97 }}>
                  Submit Request
                  <ArrowRight size={13} />
                </motion.button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */
const CompaniesInSpotlight = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const res = await getSpotlightCompanies();
        const list = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
        const mapped = list.map((c) => ({
          slug: c.id,
          name: c.companyName,
          img: c.companyLogo
            ? `${API_HOST}${c.companyLogo}`
            : "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=60",
          desc: c.description || c.overview || (Array.isArray(c.productsServices) ? c.productsServices.map(p => p.name || p.title).join(", ") : c.productsServices) || "Leading innovator in renewable energy and sustainability solutions.",
          location: c.companyAddress || c.postCode || "",
          category: c.mainSector || "Renewable Energy",
          website: c.website || "",
          email: c.contactPerson?.email || "",
        }));
        setCompanies(mapped);
        setFilteredCompanies(mapped);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  useEffect(() => {
    let filtered = companies;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(term) ||
        c.desc.toLowerCase().includes(term) ||
        c.category?.toLowerCase().includes(term) ||
        c.location?.toLowerCase().includes(term)
      );
    }
    if (selectedSector !== "All") filtered = filtered.filter(c => c.category === selectedSector);
    setFilteredCompanies(filtered);
  }, [searchTerm, selectedSector, companies]);

  const sectors = ["All", ...Array.from(new Set(companies.map(c => c.category).filter(Boolean)))];
  const hasFilters = searchTerm || selectedSector !== "All";

  return (
    <div className="min-h-screen text-white overflow-hidden" style={{ background: "#040e1e" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');
        .hero-text-mask {
          background: linear-gradient(175deg, #ffffff 0%, rgba(255,255,255,0.62) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        ::placeholder { color: rgba(255,255,255,0.25) !important; }
      `}</style>

      {/* ambient blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #10b981, transparent 70%)" }} />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)" }} />
      </div>

      <ScrollingBanner />

      {/* ── HERO ── */}
      <div ref={heroRef} className="relative w-full overflow-hidden" style={{ height: "clamp(480px, 80vh, 750px)" }}>
        <motion.div className="absolute inset-0" style={{ y: heroY, willChange: "transform" }}>
          <img src="/new/spot.jpeg" alt="Companies in Spotlight"
            className="w-full h-full object-cover" style={{ filter: "brightness(1.08) saturate(1.2)" }} />
        </motion.div>
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(4,14,30,0.25) 0%, rgba(4,14,30,0.55) 60%, #040e1e 100%)" }} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(4,14,30,0.65) 0%, rgba(4,14,30,0.1) 60%, transparent 100%)" }} />

        <motion.div
          className="absolute inset-0 flex flex-col justify-end pb-16 px-8 md:px-16 lg:px-24 pt-32"
          style={{ opacity: heroOpacity, maxWidth: "65%" }}
        >
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.7 }}
            className="flex items-center gap-3 mb-6">
            <div className="h-px w-10" style={{ background: "#10b981" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.22em", color: "#10b981", textTransform: "uppercase", fontWeight: 500 }}>
              Featured Partners
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hero-text-mask mb-5"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 4vw, 4.5rem)", fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.02em" }}>
            Companies<br />in Spotlight
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14px, 1.8vw, 18px)", color: "rgba(255,255,255,0.5)", maxWidth: "480px", lineHeight: 1.75, fontWeight: 300 }}>
            Discover innovative companies leading the transformation in renewable energy and sustainable solutions.
          </motion.p>
        </motion.div>

        <motion.div className="absolute bottom-8 right-8 md:right-16 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Scroll</span>
          <motion.div className="w-px h-10 origin-top"
            style={{ background: "linear-gradient(to bottom, rgba(16,185,129,0.6), transparent)" }}
            animate={{ scaleY: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        </motion.div>
      </div>

      {/* ── FILTERS ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl border p-6"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.35), transparent)" }} />

          <div className="flex gap-3 mb-0">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
              <input
                type="text"
                placeholder="Search by name, sector, or location…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%", paddingLeft: "36px", paddingRight: "16px",
                  paddingTop: "11px", paddingBottom: "11px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: "12px", color: "#ffffff",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 300, outline: "none",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.45)"; e.currentTarget.style.background = "rgba(16,185,129,0.04)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 rounded-xl border transition-all duration-200"
              style={{
                borderColor: showFilters ? "rgba(16,185,129,0.45)" : "rgba(255,255,255,0.09)",
                background: showFilters ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.03)",
                color: showFilters ? "#10b981" : "rgba(255,255,255,0.5)",
                fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 500,
              }}
            >
              <Filter size={13} />
              Sector
              <ChevronDown size={12} style={{ transform: showFilters ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 pt-4 pb-3 border-b mb-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  {sectors.map((s) => (
                    <button key={s} onClick={() => setSelectedSector(s)}
                      className="px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200"
                      style={{
                        borderColor: selectedSector === s ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.08)",
                        background: selectedSector === s ? "rgba(16,185,129,0.1)" : "transparent",
                        color: selectedSector === s ? "#10b981" : "rgba(255,255,255,0.45)",
                        fontFamily: "'DM Sans', sans-serif",
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`flex items-center justify-between ${showFilters ? "" : "mt-3"}`}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
              Showing <span style={{ color: "#10b981", fontWeight: 500 }}>{filteredCompanies.length}</span> compan{filteredCompanies.length !== 1 ? "ies" : "y"}
            </p>
            <div className="flex items-center gap-4">
              {hasFilters && (
                <button onClick={() => { setSearchTerm(""); setSelectedSector("All"); }}
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11.5px", color: "rgba(255,255,255,0.3)", cursor: "pointer" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#ffffff"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}>
                  Clear all
                </button>
              )}
              <motion.button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full border text-xs font-medium transition-all duration-300"
                style={{ borderColor: "rgba(16,185,129,0.35)", background: "rgba(16,185,129,0.08)", color: "#10b981", fontFamily: "'DM Sans', sans-serif" }}
                whileHover={{ scale: 1.04, background: "rgba(16,185,129,0.16)" }}
                whileTap={{ scale: 0.97 }}
              >
                <Sparkles size={11} />
                Get Featured
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── COMPANY LIST ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-24 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: "rgba(255,255,255,0.1)", borderTopColor: "#10b981" }} />
          </div>
        ) : filteredCompanies.length > 0 ? (
          filteredCompanies.map((company, idx) => (
            <CompanyCard key={company.slug} company={company} index={idx} />
          ))
        ) : (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 rounded-2xl border"
            style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <Building2 size={20} style={{ color: "#10b981" }} />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "#ffffff", marginBottom: "8px" }}>
              No companies found
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
              Try adjusting your search or filter criteria.
            </p>
          </motion.div>
        )}
      </div>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {isModalOpen && <ConsultationModal onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default CompaniesInSpotlight;
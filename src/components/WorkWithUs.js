import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollingBanner from "./home/ScrollingBanner";
import { API_BASE_URL } from "../config";
import { ArrowRight, X, Check } from "lucide-react";

const initialForm = {
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  companyName: "",
  companyAddress: "",
  postCode: "",
  companyWebsite: "",
  sectors: "",
  productsServices: "",
  briefIntro: "",
  collaborationType: "",
  bestTime: "",
  consent: false,
  cvFile: null,
};

/* ─────────────────────────────────────────────────────────────
   FIELD WRAPPER
───────────────────────────────────────────────────────────── */
const Field = ({ label, children }) => (
  <div>
    <label style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "10px",
      fontWeight: 600,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "rgba(255,255,255,0.45)",
      display: "block",
      marginBottom: "8px",
    }}>
      {label}
    </label>
    {children}
  </div>
);

const inputBase = {
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

const onFocus = (e) => {
  e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)";
  e.currentTarget.style.background = "rgba(16,185,129,0.04)";
};
const onBlur = (e) => {
  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
};

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */
const WorkWithUs = () => {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const [showPopup, setShowPopup] = useState(false);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] || null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus({ type: "", message: "" });
    try {
      // Build FormData for file upload support
      const formData = new FormData();
      formData.append("type", "workWithUs");
      Object.keys(form).forEach((key) => {
        if (key === "cvFile" && form[key]) {
          formData.append("file", form[key]);
        } else if (key !== "cvFile" && form[key] !== null) {
          formData.append(key, form[key]);
        }
      });

      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.success === false) throw new Error(data?.error || "Failed to submit.");
      setSubmitStatus({ type: "success", message: "Your request has been sent. We will contact you as soon as possible." });
      setShowPopup(true);
      setForm(initialForm);
    } catch (err) {
      setSubmitStatus({ type: "error", message: err?.message || "Failed to submit. Please try again." });
      setShowPopup(true);
    } finally {
      setSubmitting(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setSubmitStatus({ type: "", message: "" });
  };

  return (
    <div className="min-h-screen text-white overflow-hidden" style={{ background: "#040e1e" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');
        .hero-text-mask {
          background: linear-gradient(175deg, #ffffff 0%, rgba(255,255,255,0.62) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        ::placeholder { color: rgba(255,255,255,0.25) !important; }
        textarea { resize: vertical; }
      `}</style>

      {/* ambient blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #10b981, transparent 70%)" }} />
        <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)" }} />
      </div>

      <ScrollingBanner />

      {/* ── HERO ── */}
      <div ref={heroRef} className="relative w-full overflow-hidden" style={{ height: "clamp(480px, 80vh, 750px)" }}>
        <motion.div className="absolute inset-0" style={{ y: heroY, willChange: "transform" }}>
          <img src="/Contact Us/workwithus.jpeg" alt="Work With Which Renewables"
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
              Get Involved
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hero-text-mask mb-5"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 4vw, 4.5rem)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.02em" }}>
            Work With<br />Which Renewables
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14px, 1.8vw, 18px)", color: "rgba(255,255,255,0.5)", maxWidth: "480px", lineHeight: 1.75, fontWeight: 300 }}>
            Your trusted digital hub for renewable energy professionals across the UK & Ireland.
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

      {/* ── INTRO BLOCK ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 pt-20 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-2xl border p-8"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.4), transparent)" }} />
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(13px, 1.4vw, 15px)", color: "rgba(255,255,255,0.55)", lineHeight: 1.85, fontWeight: 300 }}>
            <span style={{ color: "#10b981", fontWeight: 500 }}>We welcome collaborations</span> from industry professionals who wish to partner with Which Renewables in delivering a valuable digital resource for the renewable energy and sustainable sectors. Share your details below and tell us how you would like to collaborate — we will review your enquiry and get back to you as soon as possible.
          </p>
        </motion.div>
      </div>

      {/* ── FORM ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 pt-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl border"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: "linear-gradient(90deg, transparent, #10b981, transparent)" }} />

          {/* form header */}
          <div className="px-8 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#10b981", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: "4px" }}>
              Collaboration Request
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.2rem, 2vw, 1.6rem)", fontWeight: 700, color: "#ffffff" }}>
              Work With Us
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8">
            <div className="space-y-6">

              {/* name + email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Contact Person Name">
                  <input name="contactName" value={form.contactName} onChange={handleChange}
                    placeholder="Your full name" required style={inputBase} onFocus={onFocus} onBlur={onBlur} />
                </Field>
                <Field label="Contact Email">
                  <input type="email" name="contactEmail" value={form.contactEmail} onChange={handleChange}
                    placeholder="name@company.com" required style={inputBase} onFocus={onFocus} onBlur={onBlur} />
                </Field>
              </div>

              {/* phone + company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Phone Number">
                  <input name="contactPhone" value={form.contactPhone} onChange={handleChange}
                    placeholder="Contact number (with country code)" required style={inputBase} onFocus={onFocus} onBlur={onBlur} />
                </Field>
                <Field label="Company Name">
                  <input name="companyName" value={form.companyName} onChange={handleChange}
                    placeholder="Registered company name" required style={inputBase} onFocus={onFocus} onBlur={onBlur} />
                </Field>
              </div>

              {/* address + postcode + website */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="sm:col-span-3">
                  <Field label="Company Address">
                    <textarea name="companyAddress" value={form.companyAddress} onChange={handleChange}
                      placeholder="Street, town/city, country" rows={2}
                      style={{ ...inputBase, minHeight: "64px" }} onFocus={onFocus} onBlur={onBlur} />
                  </Field>
                </div>
                <Field label="Post Code">
                  <input name="postCode" value={form.postCode} onChange={handleChange}
                    placeholder="e.g. CR3 5TB" style={inputBase} onFocus={onFocus} onBlur={onBlur} />
                </Field>
                <Field label="Company Website">
                  <input type="url" name="companyWebsite" value={form.companyWebsite} onChange={handleChange}
                    placeholder="https://www.company.com" style={inputBase} onFocus={onFocus} onBlur={onBlur} />
                </Field>
                <Field label="Best Time to Contact">
                  <input name="bestTime" value={form.bestTime} onChange={handleChange}
                    placeholder="e.g. Weekdays 9am-5pm" style={inputBase} onFocus={onFocus} onBlur={onBlur} />
                </Field>
              </div>

              {/* sectors + products */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Service sector">
                  <textarea name="sectors" value={form.sectors} onChange={handleChange}
                    placeholder="e.g. Construction, Industrial, Commercial, Domestic" rows={3}
                    style={{ ...inputBase, minHeight: "80px" }} onFocus={onFocus} onBlur={onBlur} />
                </Field>
                <Field label="Products & Services you provide">
                  <textarea name="productsServices" value={form.productsServices} onChange={handleChange}
                    placeholder="Renewable / sustainable products and services" rows={3}
                    style={{ ...inputBase, minHeight: "80px" }} onFocus={onFocus} onBlur={onBlur} />
                </Field>
              </div>

              {/* brief intro */}
              <Field label="Brief Introduction">
                <textarea name="briefIntro" value={form.briefIntro} onChange={handleChange}
                  placeholder="Tell us a bit about your company, its history, mission, and what makes you unique in the renewable energy sector." rows={4}
                  style={{ ...inputBase, minHeight: "100px" }} onFocus={onFocus} onBlur={onBlur} />
              </Field>

              {/* collaboration */}
              <Field label="How do you want to collaborate?">
                <textarea name="collaborationType" value={form.collaborationType} onChange={handleChange}
                  placeholder="Advertising, content partnerships, events/webinars, case studies, innovation hub, or other." rows={4}
                  style={{ ...inputBase, minHeight: "100px" }} onFocus={onFocus} onBlur={onBlur} />
              </Field>

              {/* CV Upload */}
              <Field label="Attach CV (Optional)">
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <input
                    type="file"
                    name="cvFile"
                    id="cvFile"
                    accept=".pdf,.doc,.docx"
                    onChange={handleChange}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor="cvFile"
                    style={{
                      ...inputBase,
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      cursor: "pointer",
                      padding: "12px 16px",
                      borderStyle: "dashed",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)";
                      e.currentTarget.style.background = "rgba(16,185,129,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = form.cvFile ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.1)";
                      e.currentTarget.style.background = form.cvFile ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.04)";
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={form.cvFile ? "#10b981" : "rgba(255,255,255,0.5)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <span style={{ fontSize: "13px", color: form.cvFile ? "#10b981" : "rgba(255,255,255,0.5)", flex: 1 }}>
                      {form.cvFile ? form.cvFile.name : "Click to upload CV (PDF, DOC, DOCX)"}
                    </span>
                    {form.cvFile && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setForm((prev) => ({ ...prev, cvFile: null }));
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#ef4444",
                          padding: "2px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    )}
                  </label>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", margin: 0 }}>Max file size: 10MB</p>
                </div>
              </Field>

              {/* divider */}
              <div className="h-px" style={{ background: "rgba(255,255,255,0.07)" }} />

              {/* consent */}
              <div className="flex items-start gap-3">
                <div
                  className="relative flex-shrink-0 w-5 h-5 rounded border cursor-pointer transition-all duration-200 mt-0.5"
                  style={{
                    borderColor: form.consent ? "#10b981" : "rgba(255,255,255,0.2)",
                    background: form.consent ? "rgba(16,185,129,0.15)" : "transparent",
                  }}
                  onClick={() => setForm((f) => ({ ...f, consent: !f.consent }))}
                >
                  {form.consent && (
                    <svg className="absolute inset-0 m-auto" width="11" height="9" viewBox="0 0 11 9" fill="none">
                      <path d="M1 4L4 7.5L10 1" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontWeight: 300 }}>
                  I agree to be contacted by Which Renewables regarding my enquiry and consent to the processing of my information in line with the Privacy Policy.
                  <span style={{ color: "#ef4444" }}> *</span>
                </p>
              </div>

              {/* submit */}
              <div className="flex items-center gap-5 flex-wrap pt-2">
                <motion.button
                  type="submit"
                  disabled={submitting || !form.consent}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold"
                  style={{
                    background: submitting || !form.consent ? "rgba(255,255,255,0.06)" : "#10b981",
                    color: submitting || !form.consent ? "rgba(255,255,255,0.3)" : "#ffffff",
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: submitting || !form.consent ? "not-allowed" : "pointer",
                    boxShadow: submitting || !form.consent ? "none" : "0 0 24px rgba(16,185,129,0.35)",
                    border: "none",
                  }}
                  whileHover={!submitting && form.consent ? { scale: 1.04, boxShadow: "0 0 36px rgba(16,185,129,0.55)" } : {}}
                  whileTap={!submitting && form.consent ? { scale: 0.97 } : {}}
                >
                  {submitting ? "Submitting…" : "Submit Collaboration Request"}
                  {!submitting && <ArrowRight size={14} />}
                </motion.button>
              </div>

            </div>
          </form>
        </motion.div>
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
              borderColor: submitStatus.type === "error" ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ 
                background: `linear-gradient(90deg, transparent, ${submitStatus.type === "error" ? "#ef4444" : "#10b981"}, transparent)` 
              }} />
            
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ 
                background: submitStatus.type === "error" ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
                border: `1px solid ${submitStatus.type === "error" ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}`
              }}
            >
              {submitStatus.type === "error" ? (
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
              {submitStatus.type === "error" ? "Submission Failed" : "Submission Successful"}
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
              {submitStatus.message}
            </p>

            <button
              onClick={closePopup}
              className="px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                background: submitStatus.type === "error" ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)",
                color: submitStatus.type === "error" ? "#ef4444" : "#10b981",
                border: `1px solid ${submitStatus.type === "error" ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}`,
                fontFamily: "'DM Sans', sans-serif",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = submitStatus.type === "error" ? "rgba(239,68,68,0.25)" : "rgba(16,185,129,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = submitStatus.type === "error" ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)";
              }}
            >
              {submitStatus.type === "error" ? "Try Again" : "OK"}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default WorkWithUs;
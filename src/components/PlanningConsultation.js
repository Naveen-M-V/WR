import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform } from 'framer-motion';
import ScrollingBanner from "./home/ScrollingBanner";
import { API_BASE_URL } from "../config";
import { ArrowRight } from "lucide-react";

const partners = [
  {
    name: "EcoArchitects Ltd",
    sector: "Sustainable Design & Planning",
  },
  {
    name: "Titan BuildTech Pvt. Ltd.",
    sector: "Construction & Infrastructure",
  },
  {
    name: "GreenHarvest Agritech",
    sector: "Agri Infrastructure & Irrigation",
  },
  {
    name: "EcoConsult Partners",
    sector: "Environmental & Planning Consultancy",
  },
  {
    name: "Sustainable Systems Ltd",
    sector: "Sustainable Systems & Green Building",
  },
];

const initialForm = {
  projectName: "",
  projectLocation: "",
  projectValue: "",
  supportType: "",
  timeframe: "",
  additionalNotes: "",
  contactName: "",
  emailAddress: "",
  phoneNumber: ""
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
const PlanningConsultation = () => {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: 'planningConsultation',
          ...form,
          name: form.contactName || form.projectName || 'Planning Enquiry',
          email: form.emailAddress || 'admin@whichrenewables.com'
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data?.success === false) {
        throw new Error(data?.error || "Failed to submit. Please try again.");
      }

      setSubmitStatus({ type: 'success', message: "Thank you — we have received your details and will be in touch soon." });
      setForm(initialForm);
    } catch (err) {
      setSubmitStatus({ type: 'error', message: err?.message || "Failed to submit. Please try again." });
    } finally {
      setSubmitting(false);
    }
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

      {/* Ambient blobs */}
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
          <img
            src="/new/plancon.jpeg"
            alt="Planning Consultative Services"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.38) saturate(1.2)" }}
          />
        </motion.div>

        {/* Gradient overlays matching WorkWithUs */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(4,14,30,0.25) 0%, rgba(4,14,30,0.55) 60%, #040e1e 100%)" }} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(4,14,30,0.65) 0%, rgba(4,14,30,0.1) 60%, transparent 100%)" }} />

        {/* Hero copy */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-end pb-16 px-8 md:px-16 lg:px-24 pt-32"
          style={{ opacity: heroOpacity, maxWidth: "65%" }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-px w-10" style={{ background: "#10b981" }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.22em",
              color: "#10b981",
              textTransform: "uppercase",
              fontWeight: 500
            }}>
              Plan With Us
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hero-text-mask mb-5"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.4rem, 4vw, 4.5rem)",
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.02em"
            }}
          >
            Planning Consultative<br />Services
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(14px, 1.8vw, 18px)",
              color: "rgba(255,255,255,0.5)",
              maxWidth: "480px",
              lineHeight: 1.75,
              fontWeight: 300
            }}
          >
            From initial surveys and designs through to installation completion — connect with specialists at the forefront of planning and consultation.
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 right-8 md:right-16 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
        >
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "10px",
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.15em",
            textTransform: "uppercase"
          }}>
            Scroll
          </span>
          <motion.div
            className="w-px h-10 origin-top"
            style={{ background: "linear-gradient(to bottom, rgba(16,185,129,0.6), transparent)" }}
            animate={{ scaleY: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
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
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(13px, 1.4vw, 15px)",
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.85,
            fontWeight: 300
          }}>
            <span style={{ color: "#10b981", fontWeight: 500 }}>Does your project require planning, consultation or infrastructure support?</span>{" "}
            Share your project outline with us and we will endeavour to link you with a suitable practitioner in your region.
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

          {/* Form header */}
          <div className="px-8 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
            
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
              fontWeight: 700,
              color: "#ffffff"
            }}>
              Tell Us What You Need
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8">
            <div className="space-y-6">

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Field label="Contact Name *">
                  <input
                    name="contactName"
                    value={form.contactName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                    style={inputBase}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </Field>
                <Field label="Email Address *">
                  <input
                    name="emailAddress"
                    value={form.emailAddress}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    type="email"
                    required
                    style={inputBase}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </Field>
                <Field label="Phone Number">
                  <input
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="+44 20 1234 5678"
                    type="tel"
                    style={inputBase}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </Field>
              </div>

              {/* Project Name + Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Project Name *">
                  <input
                    name="projectName"
                    value={form.projectName}
                    onChange={handleChange}
                    placeholder="Brief project title"
                    required
                    style={inputBase}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </Field>
                <Field label="Project Location">
                  <input
                    name="projectLocation"
                    value={form.projectLocation}
                    onChange={handleChange}
                    placeholder="Town / City / Region"
                    style={inputBase}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </Field>
              </div>

              {/* Project Value + Timeframe */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Estimated Project Value / Scale">
                  <input
                    name="projectValue"
                    value={form.projectValue}
                    onChange={handleChange}
                    placeholder="Approx. budget or project scale"
                    style={inputBase}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </Field>
                <Field label="Preferred Timeframe">
                  <input
                    name="timeframe"
                    value={form.timeframe}
                    onChange={handleChange}
                    placeholder="Key dates or milestones"
                    style={inputBase}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </Field>
              </div>

              {/* Type of Support */}
              <Field label="Type of Support Required">
                <textarea
                  name="supportType"
                  value={form.supportType}
                  onChange={handleChange}
                  placeholder="Planning, architectural design, infrastructure delivery, funding/finance, or other"
                  rows={3}
                  style={{ ...inputBase, minHeight: "80px" }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </Field>

              {/* Additional Notes */}
              <Field label="Additional Notes">
                <textarea
                  name="additionalNotes"
                  value={form.additionalNotes}
                  onChange={handleChange}
                  placeholder="Any extra context to help us match you with the right partner"
                  rows={4}
                  style={{ ...inputBase, minHeight: "100px" }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </Field>

              {/* Divider */}
              <div className="h-px" style={{ background: "rgba(255,255,255,0.07)" }} />

              {/* Submit row */}
              <div className="flex items-center gap-5 flex-wrap pt-2">
                <motion.button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold"
                  style={{
                    background: submitting ? "rgba(255,255,255,0.06)" : "#10b981",
                    color: submitting ? "rgba(255,255,255,0.3)" : "#ffffff",
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: submitting ? "not-allowed" : "pointer",
                    boxShadow: submitting ? "none" : "0 0 24px rgba(16,185,129,0.35)",
                    border: "none",
                  }}
                  whileHover={!submitting ? { scale: 1.04, boxShadow: "0 0 36px rgba(16,185,129,0.55)" } : {}}
                  whileTap={!submitting ? { scale: 0.97 } : {}}
                >
                  {submitting ? "Sending…" : "Submit Details"}
                  {!submitting && <ArrowRight size={14} />}
                </motion.button>

                {submitStatus.message && (
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12.5px",
                    color: submitStatus.type === "error" ? "#ef4444" : "#10b981",
                    fontWeight: 300,
                  }}>
                    {submitStatus.message}
                  </p>
                )}
              </div>

            </div>
          </form>
        </motion.div>
      </div>

    </div>
  );
};

export default PlanningConsultation;

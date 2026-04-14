import { API_HOST } from '../config';
import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPin, ArrowRight, ExternalLink } from "lucide-react";
import ScrollingBanner from "./home/ScrollingBanner";
import { getAllCompanies, updateCompany, deleteCompany } from "../utils/companiesAPIExtended";
import EditCompanyModal from "./EditCompanyModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

/* ─────────────────────────────────────────────────────────────
   MOCK LISTINGS — two demo companies for visual preview
───────────────────────────────────────────────────────────── */
const listings = [];

/* ─────────────────────────────────────────────────────────────
   PREMIUM COMPANY CARD
───────────────────────────────────────────────────────────── */
const CompanyCard = ({ listing, index, onView }) => {
  const [hovered, setHovered] = useState(false);
  const isEven = index % 2 === 0;
  const accentRgb = isEven ? "16,185,129" : "6,182,212";
  const accent = isEven ? "#10b981" : "#06b6d4";

  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`relative flex flex-col md:flex-row ${isEven ? "" : "md:flex-row-reverse"} overflow-hidden rounded-2xl border transition-all duration-600`}
        style={{
          borderColor: hovered ? `rgba(${accentRgb},0.4)` : "rgba(255,255,255,0.07)",
          background: hovered
            ? `linear-gradient(135deg, rgba(${accentRgb},0.09) 0%, rgba(4,14,30,0.97) 100%)`
            : "rgba(255,255,255,0.025)",
          boxShadow: hovered
            ? `0 24px 72px rgba(0,0,0,0.55), 0 0 0 1px rgba(${accentRgb},0.2), inset 0 1px 0 rgba(255,255,255,0.06)`
            : "0 2px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            opacity: hovered ? 1 : 0.2,
          }}
        />

        {/* ambient glow */}
        <div
          className="absolute pointer-events-none rounded-full blur-3xl transition-opacity duration-700"
          style={{
            width: "280px",
            height: "280px",
            top: "-60px",
            [isEven ? "left" : "right"]: "-60px",
            background: `radial-gradient(circle, rgba(${accentRgb},0.18), transparent 70%)`,
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* ── IMAGE PANEL ── */}
        <div
          className="relative flex-shrink-0 overflow-hidden"
          style={{ width: "clamp(140px, 22%, 220px)", minHeight: "180px" }}
        >
          <motion.img
            src={listing.image}
            alt={listing.title}
            className="absolute inset-0 w-full h-full object-contain p-4"
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
          />

          {/* directional colour fade */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(${isEven ? "90deg" : "270deg"}, rgba(4,14,30,0) 0%, rgba(4,14,30,0.88) 100%)`,
            }}
          />

          {/* bottom accent stripe */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px] transition-all duration-500"
            style={{
              background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
              opacity: hovered ? 1 : 0.2,
            }}
          />
        </div>

        {/* ── CONTENT PANEL ── */}
        <div className="relative flex-1 flex flex-col justify-center px-8 md:px-12 py-8 z-10">

          {/* tags row */}
          <div className="flex flex-wrap gap-2 mb-4">
            {listing.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full border text-[10px] font-semibold tracking-widest uppercase"
                style={{
                  borderColor: `rgba(${accentRgb},0.3)`,
                  background: `rgba(${accentRgb},0.07)`,
                  color: accent,
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "0.12em",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* company name */}
          <h3
            className="mb-3 font-bold leading-tight text-white"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.25rem, 2vw, 1.75rem)",
            }}
          >
            {listing.title}
          </h3>

          {/* animated rule */}
          <div
            className="mb-4 h-px transition-all duration-500"
            style={{
              background: `linear-gradient(90deg, ${accent}, transparent)`,
              width: hovered ? "72px" : "32px",
            }}
          />

          {/* description */}
          <p
            className="mb-6"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              color: "rgba(255,255,255,0.58)",
              lineHeight: 1.75,
              fontWeight: 300,
              maxWidth: "520px",
            }}
          >
            {listing.content}
          </p>

          {/* footer row — location + CTA */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* region */}
            <div
              className="flex items-center gap-2"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.06em",
              }}
            >
              <MapPin size={12} style={{ color: accent }} />
              {listing.region}
            </div>

            {/* CTA */}
            <motion.button
              onClick={() => onView(listing)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-300"
              style={{
                borderColor: `rgba(${accentRgb},0.35)`,
                background: `rgba(${accentRgb},0.08)`,
                color: accent,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
              }}
              whileHover={{
                scale: 1.04,
                background: `rgba(${accentRgb},0.18)`,
                borderColor: accent,
              }}
              whileTap={{ scale: 0.97 }}
            >
              View Profile
              <ArrowRight size={13} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */
const Construction = () => {
  const [visibleCount, setVisibleCount] = useState(999);
  const [backendCompanies, setBackendCompanies] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setIsAdmin(userRole === "admin");
  }, []);

  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setShowEditModal(true);
  };

  const handleDeleteCompany = (company) => {
    setDeleteTarget(company);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const result = await deleteCompany(deleteTarget.id);
    if (result.success) {
      const loadResult = await getAllCompanies();
      if (loadResult.success) {
        const companies = Array.isArray(loadResult.data?.data) ? loadResult.data.data : [];
        setBackendCompanies(companies);
      }
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    } else {
      alert("Error deleting company: " + result.error);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const result = await getAllCompanies();
      if (cancelled) return;
      if (result.success) {
        const companies = Array.isArray(result.data?.data) ? result.data.data : [];
        setBackendCompanies(companies);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const allListings = listings.concat(
    backendCompanies
      .filter((c) => c.mainSector === "Construction" || (c.industrySector && c.industrySector.includes("Construction")))
      .map((c) => ({
        id: c.id,
        slug: c.slug,
        title: c.companyName,
        content: c.companyBio || "",
        popcontent: c.companyBio || "",
        region: c.companyAddress || c.postCode || (Array.isArray(c.regions) ? c.regions.join(", ") : ""),
        tags: [],
        image: c.companyLogo
          ? `${API_HOST}${c.companyLogo}`
          : "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
        carousel: c.productImages?.length
          ? c.productImages.map((img) => `${API_HOST}${img}`)
          : ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80"],
      }))
  );

  useEffect(() => {
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleViewMoreDetails = (listing) => {
    const key = listing?.slug || listing?.id;
    if (!key) return;
    navigate(`/company/${key}`);
  };

  return (
    <div ref={containerRef} className="min-h-screen text-white overflow-hidden" style={{ background: "#040e1e" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        .grain-overlay {
          position: fixed; inset: 0; pointer-events: none; z-index: 1; opacity: 0.022;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px;
        }
        .hero-text-mask {
          background: linear-gradient(175deg, #ffffff 0%, rgba(255,255,255,0.6) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
      `}</style>

      <div className="grain-overlay" />

      {/* ambient blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #10b981, transparent 70%)" }} />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)" }} />
      </div>

      {/* cursor glow */}
      <div
        className="fixed pointer-events-none z-0 rounded-full"
        style={{
          width: "480px",
          height: "480px",
          left: mousePosition.x - 240,
          top: mousePosition.y - 240,
          background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 65%)",
          transition: "left 0.1s, top 0.1s",
        }}
      />

      <ScrollingBanner />

      {/* ── HERO ── */}
      <motion.div
        ref={heroRef}
        className="relative w-full overflow-hidden"
        style={{ height: "clamp(480px, 80vh, 750px)", y, opacity }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/sectors/Construction.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(1.08) saturate(1.2)",
          }}
        />

        {/* overlays */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(4,14,30,0.25) 0%, rgba(4,14,30,0.55) 60%, #040e1e 100%)" }} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(4,14,30,0.6) 0%, rgba(4,14,30,0.1) 60%, transparent 100%)" }} />

        <motion.div
          className="absolute inset-0 flex flex-col justify-end pb-16 px-8 md:px-16 lg:px-24 max-w-6xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-px w-10" style={{ background: "#10b981" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.22em", color: "#10b981", textTransform: "uppercase", fontWeight: 500 }}>
              Sector
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hero-text-mask mb-5"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.8rem, 4vw, 5.5rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em" }}
          >
            Construction
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14px, 1.8vw, 17px)", color: "rgba(255,255,255,0.5)", maxWidth: "520px", lineHeight: 1.75, fontWeight: 300 }}
          >
            Building the future with sustainable energy integration and cutting-edge low-carbon innovation.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            onClick={() => document.getElementById("companies")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-8 self-start inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300"
            style={{ background: "#10b981", color: "white", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 0 24px rgba(16,185,129,0.35)" }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 36px rgba(16,185,129,0.5)" }}
            whileTap={{ scale: 0.97 }}
          >
            Explore Companies
            <ArrowRight size={14} />
          </motion.button>
        </motion.div>

        {/* scroll hint */}
        <motion.div
          className="absolute bottom-8 right-8 md:right-16 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Scroll</span>
          <motion.div
            className="w-px h-10 origin-top"
            style={{ background: "linear-gradient(to bottom, rgba(16,185,129,0.6), transparent)" }}
            animate={{ scaleY: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      {/* ── SECTOR INTRO ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pt-20 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-2xl border border-white/[0.07] p-8 md:p-10"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.4), transparent)" }} />
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14px, 1.5vw, 16px)", color: "rgba(255,255,255,0.5)", lineHeight: 1.85, fontWeight: 300 }}>
            <span style={{ color: "#10b981", fontWeight: 500 }}>The construction sector plays a vital role</span> in driving the transition to a low-carbon future. Sustainable practices are becoming a core element of modern construction, as developers integrate smart and green technology into new builds, meeting the latest sustainability standards. Our platform makes it easier for contractors, developers, and sustainability officers to find the right partners, explore innovative solutions, and deliver projects that are resilient, compliant, and future-ready.
          </p>
        </motion.div>
      </div>

      {/* ── COMPANIES LIST ── */}
      <section id="companies" className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pt-16 pb-24">

        {/* section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-5 mb-10"
        >
          <div className="h-px w-8 flex-shrink-0" style={{ background: "rgba(255,255,255,0.1)" }} />
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(15px, 2vw, 22px)", color: "rgba(255,255,255,0.28)", fontStyle: "italic" }}>
            Companies in this sector
          </p>
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.1)" }} />
        </motion.div>

        <div className="space-y-4">
          {allListings.slice(0, visibleCount).map((listing, index) => (
            <CompanyCard
              key={listing.id + index}
              listing={listing}
              index={index}
              onView={handleViewMoreDetails}
            />
          ))}
        </div>

        {/* load more */}
        {visibleCount < allListings.length && (
          <div className="flex justify-center mt-12">
            <motion.button
              onClick={() => setVisibleCount((p) => p + 4)}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full border text-sm font-medium"
              style={{ borderColor: "rgba(16,185,129,0.3)", color: "#10b981", background: "rgba(16,185,129,0.06)", fontFamily: "'DM Sans', sans-serif" }}
              whileHover={{ scale: 1.04, background: "rgba(16,185,129,0.14)" }}
              whileTap={{ scale: 0.97 }}
            >
              Load More
              <ArrowRight size={13} />
            </motion.button>
          </div>
        )}
      </section>

      {/* Edit Modal */}
      <EditCompanyModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        company={editingCompany}
        onSave={async (updatedCompany) => {
          const result = await updateCompany(updatedCompany.id, updatedCompany);
          if (result.success) {
            const loadResult = await getAllCompanies();
            if (loadResult.success) {
              const companies = Array.isArray(loadResult.data?.data) ? loadResult.data.data : [];
              setBackendCompanies(companies);
            }
            setShowEditModal(false);
          } else {
            alert("Error updating company: " + result.error);
          }
        }}
      />

      <DeleteConfirmModal
        company={deleteTarget}
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Construction;
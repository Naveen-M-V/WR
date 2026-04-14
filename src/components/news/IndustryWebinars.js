"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { X, Video, CalendarDays, Clock, User, Mail, ExternalLink, Search, Filter, ChevronDown, Check } from 'lucide-react';
import ScrollingBanner from "../home/ScrollingBanner";
import { getContent } from "../../utils/contentAPI";

// Helper to calculate status
const getWebinarStatus = (dateStr) => {
  if (!dateStr) return 'Scheduled';
  const webinarDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (isNaN(webinarDate.getTime())) return 'Scheduled';

  if (webinarDate < today) return 'Finished';
  if (webinarDate.toDateString() === today.toDateString()) return 'Started';
  return 'Scheduled';
};

const fmt = (dateStr) => {
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch { return dateStr || ""; }
};

/* ─────────────────────────────────────────────────────────────
   WEBINAR CARD
───────────────────────────────────────────────────────────── */
const WebinarCard = ({ webinar, index, onClick }) => {
  const [hovered, setHovered] = useState(false);

  const getStatusStyles = () => {
    switch (webinar.status) {
      case 'Finished':
        return { bg: 'rgba(107,114,128,0.12)', border: 'rgba(107,114,128,0.3)', text: '#d1d5db' };
      case 'Started':
        return { bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.3)', text: '#fcd34d' };
      default:
        return { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', text: '#10b981' };
    }
  };

  const statusStyles = getStatusStyles();

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="cursor-pointer"
    >
      <div
        className="relative overflow-hidden rounded-2xl border transition-all duration-500 flex flex-col"
        style={{
          borderColor: hovered ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.07)",
          background: hovered
            ? "linear-gradient(135deg, rgba(16,185,129,0.07) 0%, rgba(4,14,30,0.98) 100%)"
            : "rgba(255,255,255,0.025)",
          boxShadow: hovered
            ? "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(16,185,129,0.2)"
            : "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {/* Image */}
        {webinar.image && (
          <div className="w-full h-48 overflow-hidden">
            <img src={webinar.image} alt={webinar.title} className="w-full h-full object-cover" />
          </div>
        )}
        {/* top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] z-10 transition-opacity duration-500"
          style={{
            background: "linear-gradient(90deg, transparent, #10b981, transparent)",
            opacity: hovered ? 1 : 0.2,
          }}
        />

        {/* content */}
        <div className="flex flex-col px-6 md:px-8 py-5">
          {/* status badge */}
          <div
            className="self-start px-2.5 py-1 rounded-full border mb-3"
            style={{
              borderColor: statusStyles.border,
              background: statusStyles.bg,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "9.5px",
              fontWeight: 600,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: statusStyles.text,
            }}
          >
            {webinar.status}
          </div>

          {/* meta */}
          <div className="flex flex-wrap items-center gap-4 mb-3">
            {webinar.hostedBy && (
              <div className="flex items-center gap-1.5"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10.5px", color: "#10b981", fontWeight: 500 }}>
                <User size={10} />
                {webinar.hostedBy}
              </div>
            )}
            {webinar.date && (
              <div className="flex items-center gap-1.5"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10.5px", color: "rgba(255,255,255,0.35)" }}>
                <CalendarDays size={10} />
                {fmt(webinar.date)}
              </div>
            )}
          </div>

          {/* title */}
          <h3
            className="font-bold text-white leading-snug mb-3"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1rem, 1.5vw, 1.15rem)" }}
          >
            {webinar.title}
          </h3>

          {/* accent rule */}
          <div
            className="mb-3 h-px transition-all duration-500"
            style={{
              background: "linear-gradient(90deg, #10b981, transparent)",
              width: hovered ? "52px" : "24px",
            }}
          />

          {/* excerpt */}
          <p
            className="line-clamp-2 flex-1"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12.5px",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            {webinar.description}
          </p>

          {/* time */}
          {webinar.time && (
            <div
              className="mt-3 flex items-center gap-1.5"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}
            >
              <Clock size={11} />
              {webinar.time}
            </div>
          )}

          {/* view more */}
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium transition-all duration-200"
            style={{ color: "#10b981", fontFamily: "'DM Sans', sans-serif" }}>
            View Details <ExternalLink size={12} />
          </div>
        </div>
      </div>
    </motion.article>
  );
};

/* ─────────────────────────────────────────────────────────────
   WEBINAR MODAL
───────────────────────────────────────────────────────────── */
const WebinarModal = ({ webinar, onClose }) => {
  if (!webinar) return null;

  const getStatusStyles = () => {
    switch (webinar.status) {
      case 'Finished':
        return { bg: 'rgba(107,114,128,0.12)', border: 'rgba(107,114,128,0.3)', text: '#d1d5db' };
      case 'Started':
        return { bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.3)', text: '#fcd34d' };
      default:
        return { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', text: '#10b981' };
    }
  };

  const statusStyles = getStatusStyles();

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
          maxHeight: "85vh", overflowY: "auto",
          background: "rgba(4,14,30,0.97)",
          borderColor: "rgba(16,185,129,0.25)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(16,185,129,0.4) rgba(255,255,255,0.02)",
        }}
      >
        <div className="h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #10b981, transparent)" }} />

        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200"
          style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)"; e.currentTarget.style.color = "#10b981"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
        >
          <X size={14} />
        </button>

        {/* header */}
        <div className="p-8 pb-6">
          <div className="mb-4 flex items-center gap-3">
            <div
              className="px-2.5 py-1 rounded-full border"
              style={{
                borderColor: statusStyles.border,
                background: statusStyles.bg,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "9.5px",
                fontWeight: 600,
                letterSpacing: "0.13em",
                textTransform: "uppercase",
                color: statusStyles.text,
              }}
            >
              {webinar.status}
            </div>
          </div>

          <h2 className="font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.2rem, 2.5vw, 1.7rem)" }}>
            {webinar.title}
          </h2>

          <div className="mb-5 h-px w-12" style={{ background: "linear-gradient(90deg, #10b981, transparent)" }} />

          {/* meta info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {webinar.date && (
              <div className="flex items-start gap-3">
                <CalendarDays size={16} style={{ color: "#10b981", marginTop: "2px" }} />
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Date</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#ffffff", fontWeight: 500 }}>{fmt(webinar.date)}</p>
                </div>
              </div>
            )}
            {webinar.time && (
              <div className="flex items-start gap-3">
                <Clock size={16} style={{ color: "#10b981", marginTop: "2px" }} />
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Time</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#ffffff", fontWeight: 500 }}>{webinar.time}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* body */}
        <div className="px-8 pb-8">
          {/* Image */}
          {webinar.image && (
            <div className="mb-6 w-full h-56 rounded-xl overflow-hidden">
              <img src={webinar.image} alt={webinar.title} className="w-full h-full object-cover" />
            </div>
          )}
          {/* about */}
          <div className="mb-8">
            <h3 className="font-bold text-white mb-3"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}>
              About This {webinar.type === 'podcast' ? 'Podcast' : 'Webinar'}
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontWeight: 300, whiteSpace: "pre-line" }}>
              {webinar.description}
            </p>
          </div>

          {/* hosted by & contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {webinar.hostedBy && (
              <div
                className="p-4 rounded-xl border"
                style={{
                  borderColor: "rgba(16,185,129,0.2)",
                  background: "rgba(16,185,129,0.05)",
                }}
              >
                <div className="flex items-center gap-2 mb-2" style={{ color: "#10b981", fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 600, textTransform: "uppercase" }}>
                  <User size={13} />
                  Hosted By
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#ffffff", fontWeight: 500 }}>{webinar.hostedBy}</p>
                {webinar.organisation && (
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>{webinar.organisation}</p>
                )}
              </div>
            )}
            {webinar.primaryContact && (
              <div
                className="p-4 rounded-xl border"
                style={{
                  borderColor: "rgba(16,185,129,0.2)",
                  background: "rgba(16,185,129,0.05)",
                }}
              >
                <div className="flex items-center gap-2 mb-2" style={{ color: "#10b981", fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 600, textTransform: "uppercase" }}>
                  <Mail size={13} />
                  Contact
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#ffffff", fontWeight: 500, wordBreak: "break-all" }}>{webinar.primaryContact}</p>
              </div>
            )}
          </div>

          {/* cta */}
          {webinar.link && (
            <div className="flex justify-end pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              <a href={webinar.link} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border text-sm font-medium transition-all duration-300"
                style={{ borderColor: "rgba(16,185,129,0.35)", background: "rgba(16,185,129,0.08)", color: "#10b981", fontFamily: "'DM Sans', sans-serif", textDecoration: "none" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(16,185,129,0.18)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(16,185,129,0.08)"}
              >
                {webinar.type === 'podcast' ? 'Listen to Podcast' : 'Join Webinar'} <ExternalLink size={13} />
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   STATUS DROPDOWN
───────────────────────────────────────────────────────────── */
const StatusDropdown = ({ selected, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const statuses = ["Scheduled", "Started", "Finished"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div ref={ref} className="relative" style={{ zIndex: isOpen ? 60 : 10 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 h-full rounded-xl border transition-all duration-200"
        style={{
          borderColor: selected.length ? "rgba(16,185,129,0.45)" : "rgba(255,255,255,0.09)",
          background: selected.length ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.03)",
          color: selected.length ? "#10b981" : "rgba(255,255,255,0.5)",
          fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 500,
        }}
      >
        <Filter size={13} />
        {selected.length ? `${selected.length} selected` : "Status"}
        <ChevronDown size={12} style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-[calc(100%+8px)] w-[180px] rounded-xl border overflow-hidden z-60"
            style={{
              background: "rgba(4,14,30,0.98)", backdropFilter: "blur(32px)",
              borderColor: "rgba(255,255,255,0.1)", boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
              maxHeight: "240px", overflowY: "auto",
            }}
          >
            {statuses.map((status) => {
              const isSelected = selected.includes(status);
              return (
                <button
                  key={status}
                  onClick={() => onToggle(status)}
                  className="w-full text-left px-4 py-2.5 border-b transition-all duration-150 flex items-center justify-between"
                  style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px",
                    color: isSelected ? "#10b981" : "rgba(255,255,255,0.6)",
                    borderColor: "rgba(255,255,255,0.05)",
                    background: isSelected ? "rgba(16,185,129,0.1)" : "transparent"
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                      e.currentTarget.style.color = "#fff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                    }
                  }}
                >
                  <span>{status}</span>
                  {isSelected && <Check size={12} style={{ color: "#10b981" }} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   CUSTOM MONTH DROPDOWN
───────────────────────────────────────────────────────────── */
const MonthDropdown = ({ value, onChange, monthOptions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div ref={ref} className="relative" style={{ zIndex: isOpen ? 60 : 10 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 h-full rounded-xl border transition-all duration-200"
        style={{
          borderColor: value !== "All" ? "rgba(16,185,129,0.45)" : "rgba(255,255,255,0.09)",
          background: value !== "All" ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.03)",
          color: value !== "All" ? "#10b981" : "rgba(255,255,255,0.5)",
          fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 500,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.45)"; e.currentTarget.style.background = "rgba(16,185,129,0.08)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = value !== "All" ? "rgba(16,185,129,0.45)" : "rgba(255,255,255,0.09)"; e.currentTarget.style.background = value !== "All" ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.03)"; }}
      >
        <CalendarDays size={13} />
        {value === "All" ? "All Months" : value}
        <ChevronDown size={12} style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-[calc(100%+8px)] w-[200px] rounded-xl border overflow-y-auto z-60"
            style={{
              background: "rgba(4,14,30,0.98)", backdropFilter: "blur(32px)",
              borderColor: "rgba(255,255,255,0.1)", boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
              maxHeight: "300px",
              scrollbarWidth: "thin", scrollbarColor: "rgba(16,185,129,0.4) rgba(255,255,255,0.02)",
            }}
          >
            <style>{`
              div::-webkit-scrollbar {
                width: 6px;
              }
              div::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.02);
              }
              div::-webkit-scrollbar-thumb {
                background: rgba(16, 185, 129, 0.4);
                border-radius: 3px;
              }
              div::-webkit-scrollbar-thumb:hover {
                background: rgba(16, 185, 129, 0.6);
              }
            `}</style>
            {monthOptions.map((month) => (
              <button
                key={month}
                onClick={() => {
                  onChange(month);
                  setIsOpen(false);
                }}
                className="w-full text-left px-5 py-3.5 border-b transition-all duration-150 flex items-center justify-between group"
                style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: "13px",
                  color: value === month ? "#10b981" : "rgba(255,255,255,0.7)",
                  borderColor: "rgba(255,255,255,0.05)",
                  background: value === month ? "rgba(16,185,129,0.1)" : "transparent"
                }}
                onMouseEnter={(e) => {
                  if (value !== month) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "#fff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (value !== month) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  }
                }}
              >
                <span>{month === "All" ? "All Months" : month}</span>
                {value === month && <ExternalLink size={12} style={{ color: "#10b981" }} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */
export default function IndustryWebinars() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [webinarsData, setWebinarsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const monthOptions = [
    "All", "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const items = await getContent('webinars');
        const mapped = Array.isArray(items) ? items.map(w => {
          let link = w.link || '#';
          if (link !== '#' && !link.startsWith('http://') && !link.startsWith('https://')) {
            link = `https://${link}`;
          }
          return {
            id: w.id || `${w.title}-${w.date || ''}-${w.time || ''}`,
            type: w.type || 'webinar',
            title: w.title || '',
            date: w.date || '',
            time: w.time || '',
            description: w.description || '',
            hostedBy: w.hostedBy || '',
            organisation: w.organisation || '',
            category: w.category || 'General',
            duration: w.duration || '',
            image: w.image || '',
            link: link,
            status: getWebinarStatus(w.date),
          };
        }) : [];
        if (mounted) setWebinarsData(mapped);
      } catch {
        if (mounted) setWebinarsData([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") { setSelectedWebinar(null); }};
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleStatus = (status) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const filtered = webinarsData.filter((webinar) => {
    const q = searchTerm.toLowerCase();
    const matchSearch = !q ||
      webinar.title?.toLowerCase().includes(q) ||
      webinar.description?.toLowerCase().includes(q) ||
      webinar.hostedBy?.toLowerCase().includes(q) ||
      webinar.organisation?.toLowerCase().includes(q) ||
      webinar.category?.toLowerCase().includes(q);

    const matchStatus = selectedStatuses.length === 0 || selectedStatuses.includes(webinar.status);

    let matchMonth = true;
    if (selectedMonth !== "All") {
      const wDate = new Date(webinar.date);
      if (!isNaN(wDate.getTime())) {
        const wMonth = wDate.toLocaleString('default', { month: 'long' });
        matchMonth = wMonth === selectedMonth;
      } else {
        matchMonth = false;
      }
    }

    return matchSearch && matchStatus && matchMonth;
  });

  const hasFilters = searchTerm || selectedStatuses.length > 0 || selectedMonth !== "All";

  return (
    <div className="min-h-screen text-white overflow-hidden" style={{ background: "#040e1e" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');
        .hero-text-mask { background: linear-gradient(175deg, #ffffff 0%, rgba(255,255,255,0.62) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        ::placeholder { color: rgba(255,255,255,0.25) !important; }
      `}</style>

      {/* blobs */}
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
          <img src="/new/webinar.jpeg" alt="Industry Webinars"
            className="w-full h-full object-cover" style={{ filter: "brightness(1.08) saturate(1.2)" }} />
        </motion.div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(4,14,30,0.25) 0%, rgba(4,14,30,0.55) 60%, #040e1e 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(4,14,30,0.65) 0%, rgba(4,14,30,0.1) 60%, transparent 100%)" }} />

        <motion.div
          className="absolute inset-0 flex flex-col justify-end pb-16 px-8 md:px-16 lg:px-24 pt-32"
          style={{ opacity: heroOpacity, maxWidth: "65%" }}
        >
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.7 }}
            className="flex items-center gap-3 mb-6">
            <div className="h-px w-10" style={{ background: "#10b981" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.22em", color: "#10b981", textTransform: "uppercase", fontWeight: 500 }}>Webinar Hub</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hero-text-mask mb-5"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 4vw, 4.5rem)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.02em" }}>
            Industry Webinars<br />and Podcasts
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14px, 1.8vw, 18px)", color: "rgba(255,255,255,0.5)", maxWidth: "480px", lineHeight: 1.75, fontWeight: 300 }}>
            Expert-led sessions and discussions to keep industry leaders informed and inspired.
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

      {/* ── FILTER BAR ── */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-6" style={{ zIndex: 20 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl border p-5"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)", overflow: "visible" }}
        >
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.35), transparent)" }} />

          <div className="flex gap-3">
            {/* search */}
            <div className="relative flex-1">
              <Search size={13} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
              <input type="text" placeholder="Search webinars, hosts, topics…" value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%", paddingLeft: "36px", paddingRight: searchTerm ? "36px" : "16px",
                  paddingTop: "11px", paddingBottom: "11px",
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: "12px", color: "#ffffff",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 300, outline: "none",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.45)"; e.currentTarget.style.background = "rgba(16,185,129,0.04)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(255,255,255,0.4)" }}>
                  <X size={13} />
                </button>
              )}
            </div>

            {/* status filter */}
            <StatusDropdown selected={selectedStatuses} onToggle={toggleStatus} />

            {/* month filter */}
            <MonthDropdown value={selectedMonth} onChange={setSelectedMonth} monthOptions={monthOptions} />
          </div>

          {/* active status pills */}
          <AnimatePresence>
            {selectedStatuses.length > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2 mt-3 overflow-hidden">
                {selectedStatuses.map((status) => (
                  <div key={status} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
                    style={{ borderColor: "rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.07)", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#10b981" }}>
                    {status}
                    <button onClick={() => toggleStatus(status)}><X size={10} /></button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-3">
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11.5px", color: "rgba(255,255,255,0.3)" }}>
              {loading ? "Loading…" : <><span style={{ color: "#10b981", fontWeight: 500 }}>{filtered.length}</span> webinar{filtered.length !== 1 ? "s" : ""} found</>}
            </p>
            {hasFilters && (
              <button onClick={() => { setSearchTerm(""); setSelectedStatuses([]); setSelectedMonth("All"); }}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.3)", cursor: "pointer" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
                onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}>
                Clear all
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── WEBINARS LIST ── */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 pb-24 space-y-4" style={{ zIndex: 1 }}>
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl border animate-pulse"
              style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", height: "160px" }} />
          ))
        ) : filtered.length > 0 ? (
          filtered.map((webinar, i) => (
            <WebinarCard key={webinar.id || i} webinar={webinar} index={i} onClick={() => setSelectedWebinar(webinar)} />
          ))
        ) : (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 rounded-2xl border"
            style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <Video size={20} style={{ color: "#10b981" }} />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "#ffffff", marginBottom: "8px" }}>
              No webinars found
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
              Try adjusting your filters or search terms.
            </p>
          </motion.div>
        )}
      </div>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {selectedWebinar && <WebinarModal webinar={selectedWebinar} onClose={() => setSelectedWebinar(null)} />}
      </AnimatePresence>
    </div>
  );
}
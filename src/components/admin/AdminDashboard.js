"use client";

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import {
  getAllCompanies, getCompanyById, getSpotlightCompanies,
  addCompanyToSpotlight, removeCompanyFromSpotlight,
  getSpotlightProductsServices, addProductServiceToSpotlight,
  removeProductServiceFromSpotlight, updateCompanyStatus
} from '../../utils/companiesAPI';
import { getAllContent, updateContent as syncContentToBackend, getNewsletterSubscribers } from '../../utils/contentAPI';
import { motion, AnimatePresence } from "framer-motion";
import ScrollingBanner from "../home/ScrollingBanner";
import {
  FaNewspaper, FaCalendarAlt, FaVideo, FaTrophy, FaMicrophone,
  FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaUser, FaEye,
  FaCheckCircle, FaCloudUploadAlt, FaCog, FaSearch,
  FaChevronDown, FaChevronRight, FaFolder, FaFolderOpen,
  FaLightbulb, FaRocket, FaBookOpen, FaStar, FaImage,
  FaBuilding, FaFilter, FaSortUp, FaSortDown, FaFileCsv
} from "react-icons/fa";

const mainRegions = [
  { label: 'United Kingdom & Ireland', subregions: ['England', 'Scotland', 'Wales', 'Northern Ireland', 'Republic Of Ireland'] },
  { label: 'UK and NI', subregions: ['England', 'Scotland', 'Wales', 'Northern Ireland'] },
  { label: 'UK Mainland Only', subregions: ['England', 'Scotland', 'Wales'] },
  { label: 'Scotland', subregions: ['Highlands & islands', 'Grampian', 'Central', 'Strathclyde', 'Lothian', 'Borders', 'Dumfries & Galloway'] },
  { label: 'England', subregions: ['Cornwall', 'Devon', 'Somerset', 'Avon', 'Wiltshire', 'Hampshire', 'West Sussex', 'Surrey', 'Berkshire', 'East Sussex', 'Kent', 'Essex', 'Hertfordshire', 'Buckinghamshire', 'Suffolk', 'Norfolk', 'Cambridgeshire', 'Northamptonshire', 'Warwickshire', 'Oxfordshire', 'Shropshire', 'East Riding of Yorkshire', 'Leicestershire', 'West Midlands', 'Glouchestershire', 'Hereford & Worcester', 'Staffordshire', 'Lincolnshire', 'Nottinghamshire', 'Derbyshire', 'Cheshire', 'South Yorkshire', 'Greater Manchester', 'Merseyside', 'Humberside', 'West Yorkshire', 'Lancashire', 'North Yorkshire', 'Cleveland', 'Durham', 'Cumbria', 'Tyne & Wear', 'Northumberland', 'Central London', 'North London', 'West London', 'South London', 'East London'] },
  { label: 'Wales', subregions: ['Clywd', 'Gywwedd', 'Powys', 'Dyfed', 'Cardiff', 'Glamorgan'] },
  { label: 'Ireland', subregions: ['All Of Ireland', 'Northern Ireland Only', 'Republic Of Ireland Only', 'Greater Dublin', 'Southern Counties', 'Midland Counties', 'West & North west', 'Border Counties'] }
];

/* ─────────────────────────────────────────────────────────────
   SHARED FIELD STYLES
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
};
const onFocus = (e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)"; e.currentTarget.style.background = "rgba(16,185,129,0.04)"; };
const onBlur  = (e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; };

const Label = ({ children }) => (
  <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "8px" }}>
    {children}
  </label>
);

const Input = ({ ...props }) => (
  <input {...props} style={fieldBase} onFocus={onFocus} onBlur={onBlur} />
);
const Textarea = ({ ...props }) => (
  <textarea {...props} style={{ ...fieldBase, minHeight: "90px", resize: "vertical" }} onFocus={onFocus} onBlur={onBlur} />
);
const Select = ({ children, ...props }) => (
  <div className="relative">
    <select {...props} style={{ ...fieldBase, appearance: "none", paddingRight: "32px", cursor: "pointer" }} onFocus={onFocus} onBlur={onBlur}>
      {children}
    </select>
    <FaChevronDown style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none", fontSize: "11px" }} />
  </div>
);

const FieldWrap = ({ label, children }) => (
  <div>
    <Label>{label}</Label>
    {children}
  </div>
);

const SectionDivider = ({ label }) => (
  <div className="flex items-center gap-3 my-1">
    <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.07)" }} />
    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>{label}</span>
    <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.07)" }} />
  </div>
);

/* ─────────────────────────────────────────────────────────────
   STATUS BADGE
───────────────────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const map = {
    Scheduled:   { bg: "rgba(59,130,246,0.12)",   color: "#3b82f6",  border: "rgba(59,130,246,0.3)"  },
    Started:     { bg: "rgba(245,158,11,0.12)",   color: "#f59e0b",  border: "rgba(245,158,11,0.3)"  },
    Finished:    { bg: "rgba(16,185,129,0.12)",   color: "#10b981",  border: "rgba(16,185,129,0.3)"  },
    Upcoming:    { bg: "rgba(139,92,246,0.12)",   color: "#8b5cf6",  border: "rgba(139,92,246,0.3)"  },
    Completed:   { bg: "rgba(100,116,139,0.12)",  color: "#94a3b8",  border: "rgba(100,116,139,0.3)" },
    Active:      { bg: "rgba(16,185,129,0.12)",   color: "#10b981",  border: "rgba(16,185,129,0.3)"  },
    Pending:     { bg: "rgba(245,158,11,0.12)",   color: "#f59e0b",  border: "rgba(245,158,11,0.3)"  },
    Archived:    { bg: "rgba(100,116,139,0.12)",  color: "#94a3b8",  border: "rgba(100,116,139,0.3)" },
    Inactive:    { bg: "rgba(239,68,68,0.12)",    color: "#ef4444",  border: "rgba(239,68,68,0.3)"   },
  };
  const s = map[status] || map.Archived;
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 9px",
      borderRadius: "99px",
      border: `1px solid ${s.border}`,
      background: s.bg,
      color: s.color,
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "10.5px",
      fontWeight: 500,
    }}>
      {status}
    </span>
  );
};

/* ─────────────────────────────────────────────────────────────
   IMAGE UPLOAD ZONE
───────────────────────────────────────────────────────────── */
const ImageDropZone = ({ value, onChange, onClear, label = "Drag & drop or click to upload" }) => {
  const [drag, setDrag] = useState(false);
  const ref = useRef(null);

  const handleFile = (file) => {
    if (!file?.type?.startsWith("image/")) { alert("Please upload an image"); return; }
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      <div
        onClick={() => ref.current?.click()}
        onDragEnter={(e) => { e.preventDefault(); setDrag(true); }}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); e.dataTransfer.files?.[0] && handleFile(e.dataTransfer.files[0]); }}
        className="cursor-pointer rounded-xl flex flex-col items-center justify-center transition-all duration-200"
        style={{
          height: "120px",
          border: `2px dashed ${drag ? "rgba(16,185,129,0.6)" : "rgba(255,255,255,0.1)"}`,
          background: drag ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.02)",
        }}
      >
        {value ? (
          <img src={value} alt="preview" className="h-full w-full object-contain rounded-xl" />
        ) : (
          <>
            <FaCloudUploadAlt style={{ color: "rgba(255,255,255,0.25)", fontSize: "22px", marginBottom: "6px" }} />
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11.5px", color: "rgba(255,255,255,0.35)" }}>{label}</p>
          </>
        )}
      </div>
      {value && (
        <button onClick={onClear} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10.5px", color: "#ef4444", marginTop: "6px", background: "none", border: "none", cursor: "pointer" }}>
          Remove image
        </button>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const NEWS_CONTENT_WORD_LIMIT = 20;
  const [activeSection, setActiveSection] = useState("news");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState({ "news-events": true });
  const fileInputRef = useRef(null);
  const MAX_IMAGE_SIZE_BYTES = 3 * 1024 * 1024;

  const dataURLtoBlob = (dataURL) => {
    if (!dataURL.startsWith('data:')) return null;
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  };

  const [formData, setFormData] = useState({
    news: { title: "", content: "", category: "", author: "", date: "", image: "", source: "Energy Digital", link: "" },
    events: { name: "", category: "", dates: "", location: "", about: "", status: "Scheduled", website: "" },
    webinars: { type: "webinar", title: "", description: "", category: "", duration: "", organisation: "", date: "", time: "", hostedBy: "", image: "", link: "" },
    awards: { personName: "", companyName: "", personImage: "", awardDescription: "", awardYear: new Date().getFullYear().toString(), awardTitle: "" },
    hallOfFame: { personName: "", companyName: "", personImage: "", awardDescription: "", awardYear: new Date().getFullYear().toString(), awardTitle: "" },
    regional: { headline: "", image: "", excerpt: "", provider: "", date: "", link: "", mainRegion: "United Kingdom & Ireland", subregion: "England", venue: "" },
    showcase: { title: "", company: "", sector: "", location: "", projectValue: "", completedDate: "", overview: "", workDelivered: "", outcome: "", keyFeatures: "", images: ["", "", ""], featured: false, productsServices: [] },
    innovations: { companyName: "", companyLogo: "", category: "", type: "product", name: "", image: "", description: "", keyFeatures: ["", "", "", ""], link: "", status: "Upcoming", productsServices: [] },
    "case-studies": { title: "", company: "", sector: "", location: "", year: "", description: "", keyFeatures: [""], challenges: "", solution: "", outcome: "", images: ["", "", "", "", "", ""], productsServices: [] },
    blogs: { category: "Expert Circle Blogs", sectors: [], productsServices: [], author: "", date: "", image: "", title: "", companyName: "", featured: "No", content: "", blogUrl: "" },
    "which-women": { name: "", company: "", image: "", featured: "No", bio: "Bio", highlights: ["Highlight"], achievements: ["Achievement"], challenges: ["Challenge"], typical: ["Typical day"], inspiration: "", support: "", ideal: "" },
    advertisement: { title: "", image: "", description: "", url: "" },
    "home-news": { title: "", image: "", description: "", link: "" },
    "home-testimonials": { name: "", image: "", designation: "", companyName: "", stars: "5", testimonial: "" },
    "home-showcase": { type: "Case Study", title: "", image: "", link: "", itemId: "", companyName: "" }
  });

  const [uploadedData, setUploadedData] = useState({ news: [], events: [], webinars: [], awards: [], hallOfFame: [], regional: [], showcase: [], innovations: [], "case-studies": [], blogs: [], "which-women": [], advertisement: [], "home-news": [], "home-testimonials": [], "home-showcase": [] });
  const [companiesList, setCompaniesList] = useState([]);
  const [spotlightCompanies, setSpotlightCompanies] = useState([]);
  const [spotlightCompanyId, setSpotlightCompanyId] = useState('');
  const [loadingCompaniesList, setLoadingCompaniesList] = useState(false);
  const [loadingSpotlightList, setLoadingSpotlightList] = useState(false);
  const [spotlightLoadError, setSpotlightLoadError] = useState('');
  const [spotlightPSCompanyId, setSpotlightPSCompanyId] = useState('');
  const [spotlightPSItemId, setSpotlightPSItemId] = useState('');
  const [spotlightPSItems, setSpotlightPSItems] = useState([]);
  const [loadingSpotlightPS, setLoadingSpotlightPS] = useState(false);
  const [spotlightPSLoadError, setSpotlightPSLoadError] = useState('');
  const [spotlightPSCompany, setSpotlightPSCompany] = useState(null);
  const [loadingSpotlightPSCompany, setLoadingSpotlightPSCompany] = useState(false);
  const [allProductsServices, setAllProductsServices] = useState([]);
  const [loadingAllProductsServices, setLoadingAllProductsServices] = useState(false);
  const [companiesSearchTerm, setCompaniesSearchTerm] = useState('');
  const [companiesSortConfig, setCompaniesSortConfig] = useState({ key: 'createdAt', direction: 'descending' });
  const [companiesCurrentPage, setCompaniesCurrentPage] = useState(1);
  const [companiesItemsPerPage] = useState(10);
  const [companiesStatusFilter, setCompaniesStatusFilter] = useState('All');
  const [companiesDateFilter, setCompaniesDateFilter] = useState({ start: '', end: '' });
  const [isExportingCompanies, setIsExportingCompanies] = useState(false);
  const [newsletterSubscribersList, setNewsletterSubscribersList] = useState([]);
  const [loadingNewsletterSubscribers, setLoadingNewsletterSubscribers] = useState(false);
  const [subscribersSearchTerm, setSubscribersSearchTerm] = useState('');
  const [subscribersCurrentPage, setSubscribersCurrentPage] = useState(1);
  const [subscribersItemsPerPage] = useState(10);
  const [isExportingSubscribers, setIsExportingSubscribers] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const getSavedEntryMetaText = (item) => {
    if (activeSection === 'showcase') {
      const projectYear = String(item?.completedDate || '').trim();
      if (/^\d{4}$/.test(projectYear)) return `Project Year: ${projectYear}`;
    }

    if (item?.createdAt) {
      const created = new Date(item.createdAt);
      if (!Number.isNaN(created.getTime())) return created.toLocaleString();
      return String(item.createdAt);
    }

    const numericId = Number(item?.id);
    if (Number.isFinite(numericId)) {
      const byId = new Date(numericId);
      if (!Number.isNaN(byId.getTime())) return byId.toLocaleString();
    }

    return '—';
  };

  // ── ALL useEffects from original (unchanged logic) ──
  useEffect(() => {
    const fetchData = async () => {
      const backendContent = await getAllContent();
      const keys = ['events','webinars','news','awards','hallOfFame','regional','showcase','innovations','case-studies','blogs','which-women','advertisement','home-news','home-testimonials','home-showcase'];
      const loadedData = {};
      keys.forEach(k => {
        const storageKey = k === 'innovations' ? 'adminInnovations' : `admin${k.charAt(0).toUpperCase() + k.slice(1)}`;
        loadedData[k] = backendContent[k] || (localStorage.getItem(storageKey) ? JSON.parse(localStorage.getItem(storageKey)) : []);
      });
      setUploadedData(loadedData);
      const sc = localStorage.getItem('adminCompany-spotlight');
      const sps = localStorage.getItem('adminProduct-service-spotlight');
      if (sc) setSpotlightCompanies(JSON.parse(sc));
      if (sps) setSpotlightPSItems(JSON.parse(sps));
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!['companies','company-spotlight','showcase','innovations','case-studies'].includes(activeSection)) return;
    const run = async () => {
      setLoadingCompaniesList(true); setSpotlightLoadError('');
      try {
        const res = await getAllCompanies(activeSection === 'companies');
        if (!res?.success || !res?.data?.success) { setCompaniesList([]); setSpotlightLoadError(res?.error || 'Failed'); return; }
        const filtered = (res.data.data || []).filter(c => {
          const n = String(c?.companyName || '').trim().toLowerCase();
          return c?.id && n && !['demo','sample','test','placeholder'].some(x => n.includes(x));
        });
        setCompaniesList(filtered);
      } catch { setCompaniesList([]); setSpotlightLoadError('Failed to load companies'); }
      finally { setLoadingCompaniesList(false); }
    };
    run();
  }, [activeSection]);

  useEffect(() => {
    if (activeSection !== 'newsletter-subscribers') return;
    const run = async () => {
      setLoadingNewsletterSubscribers(true);
      try { setNewsletterSubscribersList((await getNewsletterSubscribers()) || []); }
      catch { setNewsletterSubscribersList([]); }
      finally { setLoadingNewsletterSubscribers(false); }
    };
    run();
  }, [activeSection]);

  useEffect(() => {
    if (activeSection !== 'product-service-spotlight' || !spotlightPSCompanyId) { setSpotlightPSCompany(null); return; }
    const run = async () => {
      setLoadingSpotlightPSCompany(true); setSpotlightPSLoadError('');
      try {
        const res = await getCompanyById(spotlightPSCompanyId);
        if (!res?.success || !res?.data?.success) { setSpotlightPSCompany(null); setSpotlightPSLoadError(res?.error || 'Failed'); return; }
        setSpotlightPSCompany(res.data.data);
      } catch { setSpotlightPSCompany(null); setSpotlightPSLoadError('Failed'); }
      finally { setLoadingSpotlightPSCompany(false); }
    };
    run();
  }, [activeSection, spotlightPSCompanyId]);

  useEffect(() => {
    if (activeSection !== 'product-service-spotlight') return;
    const run = async () => {
      setLoadingCompaniesList(true); setSpotlightPSLoadError('');
      try {
        const res = await getAllCompanies();
        if (!res?.success || !res?.data?.success) { setCompaniesList([]); setSpotlightPSLoadError(res?.error || 'Failed'); return; }
        const filtered = (res.data.data || []).filter(c => {
          const n = String(c?.companyName || '').trim().toLowerCase();
          return c?.id && n && !['demo','sample','test','placeholder'].some(x => n.includes(x));
        });
        setCompaniesList(filtered); setSpotlightPSLoadError('');
      } catch { setCompaniesList([]); setSpotlightPSLoadError('Failed'); }
      finally { setLoadingCompaniesList(false); }
    };
    run();
  }, [activeSection]);

  useEffect(() => {
    if (activeSection !== 'product-service-spotlight') return;
    const run = async () => {
      setLoadingSpotlightPS(true); setSpotlightPSLoadError('');
      try {
        const res = await getSpotlightProductsServices();
        if (!res?.success || !res?.data?.success) { setSpotlightPSLoadError(res?.error || 'Failed'); return; }
        setSpotlightPSItems(Array.isArray(res?.data?.data) ? res.data.data : []);
      } catch { setSpotlightPSLoadError('Failed'); }
      finally { setLoadingSpotlightPS(false); }
    };
    run();
  }, [activeSection]);

  useEffect(() => {
    if (activeSection !== 'company-spotlight') return;
    const run = async () => {
      setLoadingSpotlightList(true); setSpotlightLoadError('');
      try {
        const res = await getSpotlightCompanies();
        if (!res?.success || !res?.data?.success) { setSpotlightLoadError(res?.error || 'Failed'); return; }
        setSpotlightCompanies(Array.isArray(res?.data?.data) ? res.data.data : []);
      } catch { setSpotlightLoadError('Failed'); }
      finally { setLoadingSpotlightList(false); }
    };
    run();
  }, [activeSection]);

  useEffect(() => { if (spotlightCompanies.length > 0) localStorage.setItem('adminCompany-spotlight', JSON.stringify(spotlightCompanies)); }, [spotlightCompanies]);
  useEffect(() => { if (spotlightPSItems.length > 0) localStorage.setItem('adminProduct-service-spotlight', JSON.stringify(spotlightPSItems)); }, [spotlightPSItems]);

  useEffect(() => {
    if (activeSection !== 'home-showcase') return;
    const run = async () => {
      setLoadingAllProductsServices(true);
      try {
        const res = await getAllCompanies();
        if (!res?.success || !res?.data?.success) { setAllProductsServices([]); return; }
        const ps = [];
        (res.data.data || []).forEach(company => {
          (company?.tabs?.productsServices?.items || []).forEach(item => {
            ps.push({ ...item, id: item.id || `${company.id}-${Math.random().toString(36).substr(2, 9)}`, companyName: company.companyName, companyId: company.id });
          });
        });
        setAllProductsServices(ps);
      } catch { setAllProductsServices([]); }
      finally { setLoadingAllProductsServices(false); }
    };
    run();
  }, [activeSection]);

  const getWordCount = (text) => String(text || "").trim().split(/\s+/).filter(Boolean).length;
  const trimToWordLimit = (text, limit) => String(text || "").trim().split(/\s+/).filter(Boolean).slice(0, limit).join(" ");

  const parseDateLike = (value) => {
    if (value === null || value === undefined || value === '') return null;

    if (typeof value === 'number') {
      // Support unix seconds from Stripe (`current_period_end`) and ms timestamps
      const numericDate = new Date(value < 1e12 ? value * 1000 : value);
      return Number.isNaN(numericDate.getTime()) ? null : numericDate;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return null;

      // Numeric string timestamp support (seconds or ms)
      if (/^\d+$/.test(trimmed)) {
        const num = Number(trimmed);
        const numericDate = new Date(num < 1e12 ? num * 1000 : num);
        if (!Number.isNaN(numericDate.getTime())) return numericDate;
      }

      const parsed = new Date(trimmed);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const formatDateValue = (value) => {
    const parsed = parseDateLike(value);
    return parsed ? parsed.toLocaleDateString() : null;
  };

  const parseMonthsValue = (value) => {
    if (value === null || value === undefined) return NaN;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const match = value.match(/\d+/);
      return match ? Number(match[0]) : NaN;
    }
    return Number(value);
  };

  const getCompanyExpiryDate = (company) => {
    const subscription = company?.subscription || {};

    // First, check for direct expiry dates
    const directExpiry =
      subscription.endDate ||
      subscription.expiryDate ||
      subscription.expiresAt ||
      subscription.validUntil ||
      subscription.currentPeriodEnd ||
      subscription.current_period_end ||
      company?.subscriptionEndDate ||
      company?.expiryDate;

    const formattedDirectExpiry = formatDateValue(directExpiry);
    if (formattedDirectExpiry) return formattedDirectExpiry;

    // Get start date
    const startDate =
      parseDateLike(subscription.startDate) ||
      parseDateLike(subscription.createdAt) ||
      parseDateLike(company?.createdAt);

    if (!startDate) return '–';

    // Determine billing cycle and calculate expiry based on it
    const billingCycle = String(subscription.billingCycle || 'monthly').toLowerCase();
    
    if (billingCycle.includes('annual') || billingCycle.includes('yearly') || billingCycle.includes('year')) {
      // Annual subscription: 365 days from start date
      const expiryDate = new Date(startDate);
      expiryDate.setDate(expiryDate.getDate() + 365);
      if (!Number.isNaN(expiryDate.getTime())) return expiryDate.toLocaleDateString();
    } else if (billingCycle.includes('monthly') || billingCycle === 'month') {
      // Monthly subscription: 30 days from start date
      const expiryDate = new Date(startDate);
      expiryDate.setDate(expiryDate.getDate() + 30);
      if (!Number.isNaN(expiryDate.getTime())) return expiryDate.toLocaleDateString();
    }

    // Fallback: use months field if available
    const monthsFromData =
      parseMonthsValue(subscription.months) ||
      parseMonthsValue(subscription.durationMonths) ||
      parseMonthsValue(company?.subscriptionMonths);

    const rawPlan = subscription?.plan;
    const planName = typeof rawPlan === 'string'
      ? rawPlan.toLowerCase()
      : String(rawPlan?.name || rawPlan?.id || '').toLowerCase();

    const fallbackMonths = planName && planName !== 'not_subscribed' ? 12 : NaN;
    const months = Number.isFinite(monthsFromData) && monthsFromData > 0 ? monthsFromData : fallbackMonths;

    if (Number.isFinite(months) && months > 0) {
      const derived = new Date(startDate);
      derived.setMonth(derived.getMonth() + months);
      if (!Number.isNaN(derived.getTime())) return derived.toLocaleDateString();
    }

    return '–';
  };

  const handleInputChange = (section, field, value) => {
    let nextValue = value;
    if (section === "news" && field === "content") {
      nextValue = trimToWordLimit(value, NEWS_CONTENT_WORD_LIMIT);
    }
    setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: nextValue } }));
  };

  const handleFile = (file) => {
    if (!file.type.startsWith('image/')) { alert('Please upload an image file'); return; }
    const MAX_WIDTH = 800, MAX_HEIGHT = 600, QUALITY = 0.7;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height) { if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } }
        else { if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        handleInputChange("news", "image", canvas.toDataURL('image/jpeg', QUALITY));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = (section, item) => {
    setEditingId(item.id);
    setFormData(prev => ({ ...prev, [section]: JSON.parse(JSON.stringify(item)) }));
  };

  const handleSubmit = async (section) => {
    setIsSubmitting(true);
    if (section === 'advertisement' && !editingId && uploadedData.advertisement.length >= 4) { alert("Max 4 advertisements."); setIsSubmitting(false); return; }
    if (section === 'home-showcase' && !editingId && uploadedData["home-showcase"].length >= 4) { alert("Max 4 showcase items."); setIsSubmitting(false); return; }
    await new Promise(r => setTimeout(r, 800));
    const formDataCopy = { ...formData[section] };
    let updatedSectionData;
    if (editingId) {
      updatedSectionData = uploadedData[section].map(item => item.id === editingId ? { ...item, ...formDataCopy } : item);
    } else {
      const newEntry = { id: Date.now(), ...formDataCopy, createdAt: new Date().toLocaleString() };
      if (section === 'awards' || section === 'hallOfFame') { newEntry.personImage = formDataCopy.personImage || null; }
      updatedSectionData = [newEntry, ...uploadedData[section]];
    }
    const updatedData = { ...uploadedData, [section]: updatedSectionData };
    setUploadedData(updatedData);
    const syncSections = ['events','webinars','news','awards','hallOfFame','regional','showcase','innovations','case-studies','blogs','which-women','advertisement','home-news','home-testimonials','home-showcase'];
    if (syncSections.includes(section)) {
      try {
        const synced = await syncContentToBackend(section, updatedData[section]);
        if (!synced) console.error(`[Admin] Failed to sync ${section}`);
      } catch (error) {
        if (error.name === 'QuotaExceededError') alert('Storage quota exceeded. Try smaller images.');
        else { console.error('Error saving:', error); alert('Failed to save. Please try again.'); }
      }
    }
    setShowSuccess(true); setTimeout(() => setShowSuccess(false), 2000);
    setEditingId(null);
    // SR#309 - Scroll to bottom of form so user sees the saved entry list
    setTimeout(() => {
      const saveBtn = document.getElementById('admin-save-btn');
      if (saveBtn) saveBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    // Reset form to initial state
    const resetMap = {
      awards: { personName: "", companyName: "", personImage: "", awardDescription: "", awardYear: new Date().getFullYear().toString(), awardTitle: "" },
      hallOfFame: { personName: "", companyName: "", personImage: "", awardDescription: "", awardYear: new Date().getFullYear().toString(), awardTitle: "" },
      "case-studies": { title: "", company: "", sector: "", location: "", year: "", description: "", keyFeatures: [""], challenges: "", solution: "", outcome: "", images: ["","","","","",""], productsServices: [] },
      blogs: { category: "Expert Circle Blogs", sectors: [], productsServices: [], author: "", date: "", image: "", title: "", companyName: "", featured: "No", content: "", blogUrl: "" },
      regional: { headline: "", image: "", excerpt: "", provider: "", date: "", link: "", mainRegion: "United Kingdom & Ireland", subregion: "England", venue: "" },
      "which-women": { name: "", company: "", image: "", featured: "No", bio: "Bio", highlights: ["Highlight"], achievements: ["Achievement"], challenges: ["Challenge"], typical: ["Typical day"], inspiration: "", support: "", ideal: "" },
      showcase: { title: "", company: "", sector: "", location: "", projectValue: "", completedDate: "", overview: "", keyFeatures: "", images: ["","",""], featured: false, productsServices: [] },
      innovations: { companyName: "", companyLogo: "", category: "", type: "product", name: "", image: "", description: "", keyFeatures: ["","","",""], link: "", status: "Upcoming", productsServices: [] },
      "home-showcase": { type: "Case Study", title: "", image: "", link: "", itemId: "", companyName: "" },
      advertisement: { title: "", image: "", description: "", url: "" },
      "home-news": { title: "", image: "", description: "", link: "" },
      "home-testimonials": { name: "", image: "", designation: "", companyName: "", stars: "5", testimonial: "" },
    };
    setFormData(prev => ({ ...prev, [section]: resetMap[section] || Object.keys(prev[section]).reduce((a, k) => ({ ...a, [k]: "" }), {}) }));
    setIsSubmitting(false);
  };

  const handleDelete = (section, id) => {
    const updatedData = { ...uploadedData, [section]: uploadedData[section].filter(item => item.id !== id) };
    setUploadedData(updatedData);
    syncContentToBackend(section, updatedData[section]).catch(console.error);
  };

  const handleArchiveCompany = async (companyId, currentStatus) => {
    const newStatus = currentStatus === 'Archived' ? 'Active' : 'Archived';
    if (!window.confirm(`${newStatus === 'Archived' ? 'Archive' : 'Unarchive'} this company?`)) return;
    try {
      const res = await updateCompanyStatus(companyId, newStatus);
      if (res.success) setCompaniesList(companiesList.map(c => c.id === companyId ? { ...c, status: newStatus } : c));
      else alert('Failed: ' + (res.error || 'Unknown error'));
    } catch { alert('An error occurred'); }
  };

  const processedCompanies = React.useMemo(() => {
    let result = [...companiesList];
    if (companiesSearchTerm) {
      const term = companiesSearchTerm.toLowerCase();
      result = result.filter(company => {
        const contactName = typeof company.contactPerson === 'object' ? `${company.contactPerson?.firstName || ''} ${company.contactPerson?.lastName || ''}` : String(company.contactPerson || '');
        return [company.companyName, company.email, contactName, company.mainSector].some(v => String(v || '').toLowerCase().includes(term));
      });
    }
    if (companiesStatusFilter !== 'All') result = result.filter(c => (c.status || 'Active') === companiesStatusFilter);
    if (companiesDateFilter.start) result = result.filter(c => new Date(c.createdAt) >= new Date(companiesDateFilter.start));
    if (companiesDateFilter.end) result = result.filter(c => new Date(c.createdAt) <= new Date(companiesDateFilter.end));
    if (companiesSortConfig.key) {
      result.sort((a, b) => {
        let av = a[companiesSortConfig.key], bv = b[companiesSortConfig.key];
        if (companiesSortConfig.key === 'createdAt') { av = new Date(a.createdAt || 0).getTime(); bv = new Date(b.createdAt || 0).getTime(); }
        if (av < bv) return companiesSortConfig.direction === 'ascending' ? -1 : 1;
        if (av > bv) return companiesSortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [companiesList, companiesSearchTerm, companiesStatusFilter, companiesDateFilter, companiesSortConfig]);

  const handleCompaniesSort = (key) => {
    setCompaniesSortConfig({ key, direction: companiesSortConfig.key === key && companiesSortConfig.direction === 'ascending' ? 'descending' : 'ascending' });
  };

  const exportCompaniesToCSV = () => {
    setIsExportingCompanies(true);
    const headers = ['Company Name','Contact Person','Email','Phone','Sector','Plan','Expiry Date','Onboarding Date','Status'];
    const csvContent = [headers.join(','), ...processedCompanies.map(c => {
      const cn = typeof c.contactPerson === 'object' ? `${c.contactPerson?.firstName || ''} ${c.contactPerson?.lastName || ''}`.trim() : (c.contactPerson || '');
      return [`"${c.companyName||''}"`,`"${cn}"`,`"${c.email||''}"`,`"${c.phone||''}"`,`"${c.mainSector||''}"`,`"${c.subscription?.plan||'-'}"`,`"${getCompanyExpiryDate(c) || '-'}"`,`"${new Date(c.createdAt).toLocaleDateString()}"`,`"${c.status||'Active'}"`].join(',');
    })].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = `companies_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    setIsExportingCompanies(false);
  };

  const sections = [
    { id: "home-page", name: "Home Page", icon: FaFolder, isFolder: true, children: [{ id: "advertisement", name: "Advertisement", icon: FaImage }, { id: "home-news", name: "News Card", icon: FaNewspaper }, { id: "home-showcase", name: "Showcase Cards", icon: FaStar }, { id: "home-testimonials", name: "Testimonials", icon: FaStar }] },
    { id: "news-events", name: "News & Events", icon: FaFolder, isFolder: true, children: [{ id: "news", name: "Industry News", icon: FaNewspaper }, { id: "events", name: "Trade Shows & Events", icon: FaCalendarAlt }, { id: "webinars", name: "Industry Webinars", icon: FaVideo }, { id: "regional", name: "Regional Updates", icon: FaMicrophone }] },
    { id: "blogs", name: "Blogs", icon: FaBookOpen, isFolder: false },
    { id: "showcase-hub", name: "Showcase Hub", icon: FaFolder, isFolder: true, children: [{ id: "showcase", name: "Completed Projects", icon: FaLightbulb }, { id: "innovations", name: "Innovations", icon: FaRocket }, { id: "case-studies", name: "Case Studies", icon: FaBookOpen }, { id: "company-spotlight", name: "Company in Spotlight", icon: FaStar }, { id: "product-service-spotlight", name: "Product/Service in Spotlight", icon: FaStar }, { id: "awards", name: "Industry Awards", icon: FaTrophy }, { id: "hallOfFame", name: "Industry Hall of Fame", icon: FaTrophy }, { id: "which-women", name: "Which Women in Renewables", icon: FaStar }] },
    { id: "onboard-company", name: "Onboard Company", icon: FaUser, isFolder: false },
    { id: "companies", name: "All Companies", icon: FaBuilding, isFolder: false },
    { id: "products-services", name: "Products & Services", icon: FaCog, isFolder: false },
    { id: "newsletter-subscribers", name: "Newsletter Subscribers", icon: FaNewspaper, isFolder: false },
  ];

  const getActiveName = () => {
    for (const s of sections) {
      if (!s.isFolder && s.id === activeSection) return s.name;
      for (const c of (s.children || [])) { if (c.id === activeSection) return c.name; }
    }
    return "Dashboard";
  };

  /* ── FORM SECTIONS — same JSX as original, reskinned inputs ── */
  const renderForm = () => {
    const d = formData;

    if (activeSection === "news") return (
      <div className="space-y-4">
        <FieldWrap label="News Title"><Input type="text" value={d.news.title} onChange={e => handleInputChange("news","title",e.target.value)} placeholder="Enter news title" /></FieldWrap>
        <FieldWrap label={`News Content (${getWordCount(d.news.content)}/${NEWS_CONTENT_WORD_LIMIT} words)`}><Textarea value={d.news.content} onChange={e => handleInputChange("news","content",e.target.value)} placeholder="Enter news content (max 20 words)" rows={4} /></FieldWrap>
        <FieldWrap label="Cover Image">
          <ImageDropZone value={d.news.image} onChange={v => handleInputChange("news","image",v)} onClear={() => handleInputChange("news","image","")} />
        </FieldWrap>
        <div className="grid grid-cols-2 gap-4">
          <FieldWrap label="Category">
            <Select value={d.news.category} onChange={e => handleInputChange("news","category",e.target.value)}>
              <option value="">Select a category</option>
              {["Renewable Energy","Sustainable / ESG / Net Zero","Energy Management","IT Related Services","Job Recruitment","Finance and Funding","Eco Friendly / Passivhaus","Utility Provision & Civils"].map(o => <option key={o} value={o}>{o}</option>)}
            </Select>
          </FieldWrap>
          <FieldWrap label="Date"><Input type="date" value={d.news.date} onChange={e => handleInputChange("news","date",e.target.value)} style={{ ...fieldBase, colorScheme: "dark" }} /></FieldWrap>
        </div>
        <FieldWrap label="Source">
          <Input list="news-source-options" type="text" value={d.news.source} onChange={e => handleInputChange("news","source",e.target.value)} placeholder="Enter source" />
          <datalist id="news-source-options">
            {["Energy Digital","RE NEWS","Transport & Energy","Sustainability Live","Solar Planet","Feed Spot","Electric Drives","Solar Media Limited","Energy Global","Rec Energy","EV Powered","Sustainability Online","Construction News","ABB News","Clean Technica","Company Source"].map(o => <option key={o} value={o} />)}
          </datalist>
        </FieldWrap>
        <FieldWrap label="External Link"><Input type="url" value={d.news.link} onChange={e => handleInputChange("news","link",e.target.value)} placeholder="https://example.com/article" /></FieldWrap>
      </div>
    );

    if (activeSection === "events") return (
      <div className="space-y-4">
        <FieldWrap label="Event Name"><Input type="text" value={d.events.name} onChange={e => handleInputChange("events","name",e.target.value)} placeholder="Enter event name" /></FieldWrap>
        <div className="grid grid-cols-2 gap-4">
          <FieldWrap label="Location"><Input type="text" value={d.events.location} onChange={e => handleInputChange("events","location",e.target.value)} placeholder="City, Country" /></FieldWrap>
          <FieldWrap label="Category"><Input type="text" value={d.events.category} onChange={e => handleInputChange("events","category",e.target.value)} placeholder="Enter category" /></FieldWrap>
        </div>
        <FieldWrap label="Dates">
          <div className="space-y-2">
            {(d.events.dates || []).map((date, i) => (
              <div key={i} className="flex gap-2">
                <Input type="date" value={date} onChange={e => {
                  const newDates = [...(d.events.dates || [])];
                  newDates[i] = e.target.value;
                  handleInputChange("events","dates",newDates);
                }} style={{ ...fieldBase, colorScheme: "dark" }} />
                {i > 0 && (
                  <button onClick={() => {
                    const newDates = (d.events.dates || []).filter((_, idx) => idx !== i);
                    handleInputChange("events","dates",newDates);
                  }} className="px-3 py-2 rounded-lg text-xs" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}>
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button onClick={() => handleInputChange("events","dates", [...(d.events.dates || []), ""])} className="px-4 py-2 rounded-lg text-xs" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981" }}>
              + Add Date
            </button>
          </div>
        </FieldWrap>
        <FieldWrap label="About Event"><Textarea value={d.events.about} onChange={e => handleInputChange("events","about",e.target.value)} placeholder="Event description" rows={3} /></FieldWrap>
        <div className="grid grid-cols-2 gap-4">
          <FieldWrap label="Status">
            <Select value={d.events.status} onChange={e => handleInputChange("events","status",e.target.value)}>
              {["Scheduled","Started","Finished"].map(o => <option key={o} value={o}>{o}</option>)}
            </Select>
          </FieldWrap>
          <FieldWrap label="Event URL"><Input type="url" value={d.events.website} onChange={e => handleInputChange("events","website",e.target.value)} placeholder="https://..." /></FieldWrap>
        </div>
      </div>
    );

    if (activeSection === "webinars") return (
      <div className="space-y-4">
        {/* Type Dropdown */}
        <FieldWrap label="Type">
          <Select value={d.webinars.type} onChange={e => handleInputChange("webinars","type",e.target.value)}>
            <option value="webinar">Webinar</option>
            <option value="podcast">Podcast</option>
          </Select>
        </FieldWrap>
        
        <FieldWrap label="Title"><Input type="text" value={d.webinars.title} onChange={e => handleInputChange("webinars","title",e.target.value)} placeholder="Enter title" /></FieldWrap>
        
        <div className="grid grid-cols-2 gap-4">
          <FieldWrap label="Category"><Input type="text" value={d.webinars.category} onChange={e => handleInputChange("webinars","category",e.target.value)} placeholder="e.g., Technology, Business" /></FieldWrap>
          <FieldWrap label="Duration"><Input type="text" value={d.webinars.duration} onChange={e => handleInputChange("webinars","duration",e.target.value)} placeholder="e.g., 60 minutes" /></FieldWrap>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FieldWrap label="Date"><Input type="date" value={d.webinars.date} onChange={e => handleInputChange("webinars","date",e.target.value)} style={{ ...fieldBase, colorScheme: "dark" }} /></FieldWrap>
          <FieldWrap label="Time"><Input type="text" value={d.webinars.time} onChange={e => handleInputChange("webinars","time",e.target.value)} placeholder="2:00 PM - 3:30 PM" /></FieldWrap>
        </div>
        
        <FieldWrap label="Description"><Textarea value={d.webinars.description} onChange={e => handleInputChange("webinars","description",e.target.value)} placeholder="Enter description" rows={3} /></FieldWrap>
        
        <div className="grid grid-cols-2 gap-4">
          <FieldWrap label="Organisation"><Input type="text" value={d.webinars.organisation} onChange={e => handleInputChange("webinars","organisation",e.target.value)} placeholder="Organisation name" /></FieldWrap>
          <FieldWrap label="Hosted By"><Input type="text" value={d.webinars.hostedBy} onChange={e => handleInputChange("webinars","hostedBy",e.target.value)} placeholder="Host name" /></FieldWrap>
        </div>
        
        <FieldWrap label="Image"><ImageDropZone value={d.webinars.image} onChange={v => handleInputChange("webinars","image",v)} onClear={() => handleInputChange("webinars","image","")} /></FieldWrap>
        
        <FieldWrap label="URL Link"><Input type="url" value={d.webinars.link} onChange={e => handleInputChange("webinars","link",e.target.value)} placeholder="https://..." /></FieldWrap>
      </div>
    );

    if (activeSection === "awards") return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FieldWrap label="Company Name"><Input type="text" value={d.awards.personName} onChange={e => handleInputChange("awards","personName",e.target.value)} placeholder="Award recipient name" /></FieldWrap>
          <FieldWrap label="Person Name"><Input type="text" value={d.awards.companyName} onChange={e => handleInputChange("awards","companyName",e.target.value)} placeholder="Company name" /></FieldWrap>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FieldWrap label="Award Year">
            <Input type="number" value={d.awards.awardYear} onChange={e => handleInputChange("awards","awardYear",e.target.value)} placeholder={new Date().getFullYear().toString()} min="1900" max="2100" list="awards-year-options" />
            <datalist id="awards-year-options">{Array.from(new Set([...(uploadedData?.awards || []).map(a => a?.awardYear).filter(Boolean), new Date().getFullYear().toString()])).sort((a,b) => Number(b)-Number(a)).map(y => <option key={y} value={y} />)}</datalist>
          </FieldWrap>
          <FieldWrap label="Award Title"><Input type="text" value={d.awards.awardTitle} onChange={e => handleInputChange("awards","awardTitle",e.target.value)} placeholder="e.g. WR Distinction Award" /></FieldWrap>
        </div>
        <FieldWrap label="Person Image /  Company Image">
          <ImageDropZone value={d.awards.personImage} onChange={v => handleInputChange("awards","personImage",v)} onClear={() => handleInputChange("awards","personImage","")} />
        </FieldWrap>
        <FieldWrap label="Award Description"><Textarea value={d.awards.awardDescription} onChange={e => handleInputChange("awards","awardDescription",e.target.value)} placeholder="Describe the award and achievements" rows={4} /></FieldWrap>
      </div>
    );

    if (activeSection === "hallOfFame") return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FieldWrap label="Company Name"><Input type="text" value={d.hallOfFame.personName} onChange={e => handleInputChange("hallOfFame","personName",e.target.value)} placeholder="Hall of Fame recipient name" /></FieldWrap>
          <FieldWrap label="Person Name"><Input type="text" value={d.hallOfFame.companyName} onChange={e => handleInputChange("hallOfFame","companyName",e.target.value)} placeholder="Company name" /></FieldWrap>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FieldWrap label="Award Year">
            <Input type="number" value={d.hallOfFame.awardYear} onChange={e => handleInputChange("hallOfFame","awardYear",e.target.value)} placeholder={new Date().getFullYear().toString()} min="1900" max="2100" list="hallOfFame-year-options" />
            <datalist id="hallOfFame-year-options">{Array.from(new Set([...(uploadedData?.hallOfFame || []).map(a => a?.awardYear).filter(Boolean), new Date().getFullYear().toString()])).sort((a,b) => Number(b)-Number(a)).map(y => <option key={y} value={y} />)}</datalist>
          </FieldWrap>
          <FieldWrap label="Award Title"><Input type="text" value={d.hallOfFame.awardTitle} onChange={e => handleInputChange("hallOfFame","awardTitle",e.target.value)} placeholder="e.g. WR Hall of Fame Award" /></FieldWrap>
        </div>
        <FieldWrap label="Person Image / Company logo">
          <ImageDropZone value={d.hallOfFame.personImage} onChange={v => handleInputChange("hallOfFame","personImage",v)} onClear={() => handleInputChange("hallOfFame","personImage","")} />
        </FieldWrap>
        <FieldWrap label="Award Description"><Textarea value={d.hallOfFame.awardDescription} onChange={e => handleInputChange("hallOfFame","awardDescription",e.target.value)} placeholder="Describe the Hall of Fame recognition and achievements" rows={4} /></FieldWrap>
      </div>
    );

    if (activeSection === "regional") return (
      <div className="space-y-4">
        <FieldWrap label="News Headline"><Input type="text" value={d.regional.headline} onChange={e => handleInputChange("regional","headline",e.target.value)} placeholder="Enter headline" /></FieldWrap>
        <FieldWrap label="Description / Excerpt"><Textarea value={d.regional.excerpt} onChange={e => handleInputChange("regional","excerpt",e.target.value)} placeholder="Enter brief description" rows={4} /></FieldWrap>
        <div className="grid grid-cols-2 gap-4">
          <FieldWrap label="Provider Name"><Input type="text" value={d.regional.provider} onChange={e => handleInputChange("regional","provider",e.target.value)} placeholder="e.g. Newcastle Energy Forum" /></FieldWrap>
          <FieldWrap label="Date"><Input type="date" value={d.regional.date} onChange={e => handleInputChange("regional","date",e.target.value)} style={{ ...fieldBase, colorScheme: "dark" }} /></FieldWrap>
        </div>
        <FieldWrap label="Venue"><Input type="text" value={d.regional.venue} onChange={e => handleInputChange("regional","venue",e.target.value)} placeholder="e.g. Exhibition Centre, Hall 5" /></FieldWrap>
        <div className="grid grid-cols-2 gap-4">
          <FieldWrap label="Select Region">
            <Select value={d.regional.mainRegion} onChange={e => {
              const newMain = e.target.value;
              const subs = mainRegions.find(r => r.label === newMain)?.subregions || [];
              setFormData(prev => ({ ...prev, regional: { ...prev.regional, mainRegion: newMain, subregion: subs[0] || "" } }));
            }}>
              {mainRegions.map(r => <option key={r.label} value={r.label}>{r.label}</option>)}
            </Select>
          </FieldWrap>
          <FieldWrap label="Select Subregion">
            <Select value={d.regional.subregion} onChange={e => handleInputChange("regional","subregion",e.target.value)}>
              {(mainRegions.find(r => r.label === d.regional.mainRegion)?.subregions || []).map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          </FieldWrap>
        </div>
        <FieldWrap label="Link"><Input type="url" value={d.regional.link} onChange={e => handleInputChange("regional","link",e.target.value)} placeholder="https://" /></FieldWrap>
        <FieldWrap label="Image">
          <ImageDropZone value={d.regional.image} onChange={v => handleInputChange("regional","image",v)} onClear={() => handleInputChange("regional","image","")} />
        </FieldWrap>
      </div>
    );

    if (activeSection === "blogs") return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FieldWrap label="Blog Category">
            <Select value={d.blogs.category} onChange={e => handleInputChange("blogs","category",e.target.value)}>
              {["Expert Circle Blogs","Which Women in Renewables Blogs","Which Renewables Invitational Blogs"].map(o => <option key={o} value={o}>{o}</option>)}
            </Select>
          </FieldWrap>
          <FieldWrap label="Featured">
            <Select value={d.blogs.featured} onChange={e => handleInputChange("blogs","featured",e.target.value)}>
              <option value="No">No</option><option value="Yes">Yes</option>
            </Select>
          </FieldWrap>
        </div>
        <FieldWrap label="Title"><Input type="text" value={d.blogs.title} onChange={e => handleInputChange("blogs","title",e.target.value)} placeholder="Enter blog title" /></FieldWrap>
        <div className="grid grid-cols-2 gap-4">
          <FieldWrap label="Company Name"><Input type="text" value={d.blogs.companyName} onChange={e => handleInputChange("blogs","companyName",e.target.value)} placeholder="Company Name" /></FieldWrap>
          <FieldWrap label="Author"><Input type="text" value={d.blogs.author} onChange={e => handleInputChange("blogs","author",e.target.value)} placeholder="Author Name" /></FieldWrap>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FieldWrap label="Date"><Input type="date" value={d.blogs.date} onChange={e => handleInputChange("blogs","date",e.target.value)} style={{ ...fieldBase, colorScheme: "dark" }} /></FieldWrap>
          <FieldWrap label="Sectors (Multi-select)">
            <div className="rounded-xl border p-3 space-y-2 max-h-48 overflow-y-auto" style={{ borderColor: "rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.03)" }}>
              {[
                "Renewable Energy",
                "Sustainable / ESG / Net Zero",
                "Energy Management",
                "Company Wellness",
                "IT Related Services",
                "Jobs & Recruitment",
                "Finance & Funding",
                "Eco Friendly / Passivhaus",
                "Utility Provision & Civils",
                "Commercial / Retail"
              ].map(sector => (
                <label key={sector} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded transition-colors">
                  <input type="checkbox" checked={d.blogs.sectors?.includes(sector)||false}
                    onChange={e => handleInputChange("blogs","sectors", e.target.checked ? [...(d.blogs.sectors||[]),sector] : (d.blogs.sectors||[]).filter(s=>s!==sector))}
                    style={{ accentColor: "#10b981" }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>{sector}</span>
                </label>
              ))}
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
              {d.blogs.sectors?.length || 0} sector(s) selected
            </p>
          </FieldWrap>
        </div>
        <FieldWrap label="Products & Services (Multi-select)">
          <div className="rounded-xl border p-3 space-y-2 max-h-48 overflow-y-auto" style={{ borderColor: "rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.03)" }}>
            {[
              "Renewable Energy",
              "Sustainability / ESG / Net Zero",
              "Energy Efficiency & Management",
              "Company Wellness",
              "IT & Related Services",
              "Jobs & Recruitment",
              "Finance & Funding",
              "Eco Friendly Building Products",
              "Utiity Provision & Civils"
            ].map(product => (
              <label key={product} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded transition-colors">
                <input type="checkbox" checked={d.blogs.productsServices?.includes(product)||false}
                  onChange={e => handleInputChange("blogs","productsServices", e.target.checked ? [...(d.blogs.productsServices||[]),product] : (d.blogs.productsServices||[]).filter(p=>p!==product))}
                  style={{ accentColor: "#06b6d4" }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>{product}</span>
              </label>
            ))}
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
            {d.blogs.productsServices?.length || 0} product/service(s) selected
          </p>
        </FieldWrap>
        <FieldWrap label="Content"><Textarea value={d.blogs.content||""} onChange={e => handleInputChange("blogs","content",e.target.value)} placeholder="Write blog content here..." rows={6} /></FieldWrap>
        <FieldWrap label="Blog URL"><Input type="url" value={d.blogs.blogUrl||""} onChange={e => handleInputChange("blogs","blogUrl",e.target.value)} placeholder="https://example.com/blog-post" /></FieldWrap>
        <FieldWrap label="Blog Image">
          <ImageDropZone value={d.blogs.image} onChange={v => handleInputChange("blogs","image",v)} onClear={() => handleInputChange("blogs","image","")} />
        </FieldWrap>
      </div>
    );

    if (activeSection === "company-spotlight") return (
      <div className="space-y-4">
        {spotlightLoadError && <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444" }}>{spotlightLoadError}</div>}
        <FieldWrap label="Select Company">
          <Select value={spotlightCompanyId} onChange={e => setSpotlightCompanyId(e.target.value)} disabled={loadingCompaniesList}>
            <option value="">{loadingCompaniesList ? 'Loading...' : 'Select company'}</option>
            {(companiesList||[]).map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
          </Select>
        </FieldWrap>
        <div className="flex gap-3">
          <button onClick={async () => { if (!spotlightCompanyId) return; await addCompanyToSpotlight(spotlightCompanyId); const res = await getSpotlightCompanies(); setSpotlightCompanies(Array.isArray(res?.data?.data)?res.data.data:[]); setSpotlightCompanyId(''); }} disabled={!spotlightCompanyId}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all" style={{ background: spotlightCompanyId ? "#10b981" : "rgba(255,255,255,0.05)", color: spotlightCompanyId ? "#fff" : "rgba(255,255,255,0.3)", border: "none", cursor: spotlightCompanyId ? "pointer" : "not-allowed" }}>
            Add to Spotlight
          </button>
          <button onClick={async () => { if (!spotlightCompanyId) return; await removeCompanyFromSpotlight(spotlightCompanyId); const res = await getSpotlightCompanies(); setSpotlightCompanies(Array.isArray(res?.data?.data)?res.data.data:[]); setSpotlightCompanyId(''); }} disabled={!spotlightCompanyId}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)", cursor: spotlightCompanyId ? "pointer" : "not-allowed" }}>
            Remove
          </button>
        </div>
        <SectionDivider label="Current Spotlight" />
        {(spotlightCompanies||[]).length === 0 ? <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>No companies in spotlight</p> : (
          <div className="space-y-2">
            {(spotlightCompanies||[]).map(c => (
              <div key={c.id} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div><p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#fff", fontWeight: 500 }}>{c.companyName}</p><p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{c.mainSector||''}</p></div>
                <button onClick={async () => { await removeCompanyFromSpotlight(c.id); const res = await getSpotlightCompanies(); setSpotlightCompanies(Array.isArray(res?.data?.data)?res.data.data:[]); }}
                  style={{ padding: "3px 10px", borderRadius: "99px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", color: "#ef4444", fontSize: "10.5px", cursor: "pointer" }}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );

    if (activeSection === "product-service-spotlight") return (
      <div className="space-y-4">
        {spotlightPSLoadError && <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444" }}>{spotlightPSLoadError}</div>}
        <FieldWrap label="Select Company">
          <Select value={spotlightPSCompanyId} onChange={e => { setSpotlightPSCompanyId(e.target.value); setSpotlightPSItemId(''); setSpotlightPSLoadError(''); }} disabled={loadingCompaniesList}>
            <option value="">{loadingCompaniesList ? 'Loading...' : 'Select company'}</option>
            {(companiesList||[]).map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
          </Select>
        </FieldWrap>
        <FieldWrap label="Select Product/Service">
          <Select value={spotlightPSItemId} onChange={e => setSpotlightPSItemId(e.target.value)} disabled={!spotlightPSCompanyId||loadingSpotlightPSCompany}>
            <option value="">{!spotlightPSCompanyId ? 'Select company first' : loadingSpotlightPSCompany ? 'Loading...' : 'Select product/service'}</option>
            {(Array.isArray(spotlightPSCompany?.tabs?.productsServices?.items)?spotlightPSCompany.tabs.productsServices.items:[]).map(it => <option key={it.id} value={it.id}>{it.title} ({it.type})</option>)}
          </Select>
        </FieldWrap>
        <div className="flex gap-3">
          <button onClick={async () => { if (!spotlightPSCompanyId||!spotlightPSItemId) return; setSpotlightPSLoadError(''); const op = await addProductServiceToSpotlight(spotlightPSCompanyId,spotlightPSItemId); if (!op?.success||!op?.data?.success) { setSpotlightPSLoadError(op?.error||'Failed'); return; } const res = await getSpotlightProductsServices(); if (!res?.success||!res?.data?.success) { setSpotlightPSItems([]); setSpotlightPSLoadError(res?.error||'Failed'); return; } setSpotlightPSItems(Array.isArray(res?.data?.data)?res.data.data:[]); setSpotlightPSItemId(''); }} disabled={!spotlightPSCompanyId||!spotlightPSItemId}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ background: (spotlightPSCompanyId&&spotlightPSItemId)?"#10b981":"rgba(255,255,255,0.05)", color: (spotlightPSCompanyId&&spotlightPSItemId)?"#fff":"rgba(255,255,255,0.3)", border: "none", cursor: (spotlightPSCompanyId&&spotlightPSItemId)?"pointer":"not-allowed" }}>
            Add to Spotlight
          </button>
          <button onClick={async () => { if (!spotlightPSCompanyId||!spotlightPSItemId) return; setSpotlightPSLoadError(''); const op = await removeProductServiceFromSpotlight(spotlightPSCompanyId,spotlightPSItemId); if (!op?.success||!op?.data?.success) { setSpotlightPSLoadError(op?.error||'Failed'); return; } const res = await getSpotlightProductsServices(); setSpotlightPSItems(Array.isArray(res?.data?.data)?res.data.data:[]); setSpotlightPSItemId(''); }} disabled={!spotlightPSCompanyId||!spotlightPSItemId}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)", cursor: (spotlightPSCompanyId&&spotlightPSItemId)?"pointer":"not-allowed" }}>
            Remove
          </button>
        </div>
        <SectionDivider label="Current Spotlight" />
        {(spotlightPSItems||[]).length === 0 ? <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>No products/services in spotlight</p> : (
          <div className="space-y-2">
            {(spotlightPSItems||[]).map(entry => (
              <div key={`${entry.companyId}-${entry.item?.id}`} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div><p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#fff", fontWeight: 500 }}>{entry.item?.title}</p><p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{entry.companyName}{entry.item?.type?` • ${entry.item.type}`:''}</p></div>
                <button onClick={async () => { if (!entry?.companyId||!entry?.item?.id) return; await removeProductServiceFromSpotlight(entry.companyId,entry.item.id); const res = await getSpotlightProductsServices(); setSpotlightPSItems(Array.isArray(res?.data?.data)?res.data.data:[]); }}
                  style={{ padding: "3px 10px", borderRadius: "99px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", color: "#ef4444", fontSize: "10.5px", cursor: "pointer" }}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );

    if (activeSection === "which-women") return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FieldWrap label="Name"><Input type="text" value={d["which-women"].name} onChange={e => handleInputChange("which-women","name",e.target.value)} placeholder="Name" /></FieldWrap>
          <FieldWrap label="Company"><Input type="text" value={d["which-women"].company} onChange={e => handleInputChange("which-women","company",e.target.value)} placeholder="Company Name" /></FieldWrap>
        </div>
        <FieldWrap label="Featured / Spotlight">
          <Select value={d["which-women"].featured} onChange={e => handleInputChange("which-women","featured",e.target.value)}>
            <option value="No">No</option><option value="Yes">Yes</option>
          </Select>
        </FieldWrap>
        <FieldWrap label="Photo">
          <ImageDropZone value={d["which-women"].image} onChange={v => handleInputChange("which-women","image",v)} onClear={() => handleInputChange("which-women","image","")} />
        </FieldWrap>
        <FieldWrap label="Short Bio"><Textarea value={d["which-women"].bio} onChange={e => handleInputChange("which-women","bio",e.target.value)} placeholder="Short bio..." rows={3} /></FieldWrap>
        <div className="grid grid-cols-2 gap-4">
          <FieldWrap label="Career Highlights & Future Vision"><Textarea value={d["which-women"].highlights} onChange={e => handleInputChange("which-women","highlights",e.target.value)} placeholder="Career highlights..." rows={4} /></FieldWrap>
          <FieldWrap label="Provisional Achievements"><Textarea value={d["which-women"].achievements} onChange={e => handleInputChange("which-women","achievements",e.target.value)} placeholder="Achievements..." rows={4} /></FieldWrap>
          <FieldWrap label="Challenges & Impact"><Textarea value={d["which-women"].challenges} onChange={e => handleInputChange("which-women","challenges",e.target.value)} placeholder="Challenges & Impact..." rows={4} /></FieldWrap>
          <FieldWrap label="Typical Workday & Ideal Vacation"><Textarea value={d["which-women"].typical} onChange={e => handleInputChange("which-women","typical",e.target.value)} placeholder="Typical workday & vacation..." rows={4} /></FieldWrap>
        </div>
      </div>
    );

    if (activeSection === "showcase") return (
      <div className="space-y-4">
        <FieldWrap label="Company Name">
          <Select value={d.showcase.company} onChange={e => handleInputChange("showcase","company",e.target.value)} disabled={loadingCompaniesList}>
            <option value="">{loadingCompaniesList ? 'Loading...' : 'Select company'}</option>
            {(companiesList||[]).map(c => <option key={c.id} value={c.companyName}>{c.companyName}</option>)}
          </Select>
        </FieldWrap>
        <FieldWrap label="Sector">
          <Select value={d.showcase.sector} onChange={e => handleInputChange("showcase","sector",e.target.value)}>
            <option value="">Select sector</option>
            {["Construction","Industrial","Commercial / Retail","Agriculture","Domestic"].map(o => <option key={o} value={o}>{o}</option>)}
          </Select>
        </FieldWrap>
        <FieldWrap label="Project Title"><Input type="text" value={d.showcase.title} onChange={e => handleInputChange("showcase","title",e.target.value)} placeholder="Enter project title" /></FieldWrap>
        <FieldWrap label="Location"><Input type="text" value={d.showcase.location} onChange={e => handleInputChange("showcase","location",e.target.value)} placeholder="Enter project location" /></FieldWrap>
        <div className="grid grid-cols-2 gap-4">
          <FieldWrap label="Project Value"><Input type="text" value={d.showcase.projectValue} onChange={e => handleInputChange("showcase","projectValue",e.target.value)} placeholder="e.g., £2.5M" /></FieldWrap>
          <FieldWrap label="Project Year"><Input type="number" min="1900" max="2099" step="1" value={d.showcase.completedDate} onChange={e => handleInputChange("showcase","completedDate",e.target.value)} placeholder="2024" /></FieldWrap>
        </div>
        <FieldWrap label="Overview"><Textarea value={d.showcase.overview} onChange={e => handleInputChange("showcase","overview",e.target.value)} placeholder="Comprehensive overview..." rows={4} /></FieldWrap>
        <FieldWrap label="Work Delivered"><Textarea value={d.showcase.workDelivered} onChange={e => handleInputChange("showcase","workDelivered",e.target.value)} placeholder="Work delivered..." rows={4} /></FieldWrap>
        <FieldWrap label="Outcome"><Textarea value={d.showcase.outcome} onChange={e => handleInputChange("showcase","outcome",e.target.value)} placeholder="Outcome..." rows={4} /></FieldWrap>
        <FieldWrap label="Key Features"><Textarea value={d.showcase.keyFeatures} onChange={e => handleInputChange("showcase","keyFeatures",e.target.value)} placeholder="Key features..." rows={3} /></FieldWrap>
        <FieldWrap label="Products & Services (Multi-select)">
          <div className="rounded-xl border p-3 space-y-2 max-h-48 overflow-y-auto" style={{ borderColor: "rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.03)" }}>
            {[
              "Renewable Energy",
              "Sustainability / ESG / Net Zero",
              "Energy Efficiency & Management",
              "Company Wellness",
              "IT & Related Services",
              "Jobs & Recruitment",
              "Finance & Funding",
              "Eco Friendly Building Products",
              "Utiity Provision & Civils"
            ].map(product => (
              <label key={product} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded transition-colors">
                <input type="checkbox" checked={d.showcase.productsServices?.includes(product)||false}
                  onChange={e => handleInputChange("showcase","productsServices", e.target.checked ? [...(d.showcase.productsServices||[]),product] : (d.showcase.productsServices||[]).filter(p=>p!==product))}
                  style={{ accentColor: "#06b6d4" }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>{product}</span>
              </label>
            ))}
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
            {d.showcase.productsServices?.length || 0} product/service(s) selected
          </p>
        </FieldWrap>
        <FieldWrap label="Project Images">
          <div className="space-y-3">
            {(() => {
              const sel = (companiesList||[]).find(c => String(c.companyName) === String(d.showcase.company));
              const raw = sel?.subscription?.plan; let p = typeof raw === "string" ? raw.toLowerCase() : (raw?.name||raw?.id||"").toLowerCase();
              const maxImages = p.includes('elite')||p.includes('premium') ? 6 : 3;
              return Array.from({ length: maxImages }).map((_, index) => (
                <ImageDropZone key={index} value={d.showcase.images?.[index]} onChange={v => { const imgs = [...(d.showcase.images||[])]; while(imgs.length<=index) imgs.push(""); imgs[index]=v; handleInputChange("showcase","images",imgs); }} onClear={() => { const imgs = [...(d.showcase.images||[])]; imgs[index]=""; handleInputChange("showcase","images",imgs); }} label={`Image ${index+1}`} />
              ));
            })()}
          </div>
        </FieldWrap>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={d.showcase.featured} onChange={e => handleInputChange("showcase","featured",e.target.checked)} style={{ accentColor: "#10b981" }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Featured Project</span>
        </label>
      </div>
    );

    if (activeSection === "innovations") return (
      <div className="space-y-4">
        <FieldWrap label="Company Name">
          <Select value={d.innovations.companyName} onChange={e => handleInputChange("innovations","companyName",e.target.value)} disabled={loadingCompaniesList}>
            <option value="">{loadingCompaniesList ? 'Loading...' : 'Select company'}</option>
            {(companiesList||[]).map(c => <option key={c.id} value={c.companyName}>{c.companyName}</option>)}
          </Select>
        </FieldWrap>
        <FieldWrap label="Company Logo">
          <ImageDropZone value={d.innovations.companyLogo} onChange={v => handleInputChange("innovations","companyLogo",v)} onClear={() => handleInputChange("innovations","companyLogo","")} />
        </FieldWrap>
        <FieldWrap label="Category">
          <Select value={d.innovations.category} onChange={e => handleInputChange("innovations","category",e.target.value)}>
            <option value="">Select category</option>
            {[{v:"renewable-energy",l:"Renewable Energy"},{v:"sustainable",l:"Sustainable"},{v:"environmental",l:"Environmental"},{v:"energy-management",l:"Energy Management & Efficiency"},{v:"ahead-of-curve",l:"Get Ahead Of The Curve"},{v:"hot-off-press",l:"Hot Off The Press"}].map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
          </Select>
        </FieldWrap>
        <FieldWrap label="Type">
          <div className="flex gap-4">
            {["product","service"].map(t => (
              <label key={t} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="type" value={t} checked={d.innovations.type===t} onChange={e => handleInputChange("innovations","type",e.target.value)} style={{ accentColor: "#10b981" }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.7)", textTransform: "capitalize" }}>{t}</span>
              </label>
            ))}
          </div>
        </FieldWrap>
        <FieldWrap label={d.innovations.type === "product" ? "Product Name" : "Service Name"}><Input type="text" value={d.innovations.name} onChange={e => handleInputChange("innovations","name",e.target.value)} placeholder={`Enter ${d.innovations.type} name`} /></FieldWrap>
        <FieldWrap label={d.innovations.type === "product" ? "Product Image" : "Service Image"}>
          <ImageDropZone value={d.innovations.image} onChange={v => handleInputChange("innovations","image",v)} onClear={() => handleInputChange("innovations","image","")} />
        </FieldWrap>
        <FieldWrap label="Description"><Textarea value={d.innovations.description} onChange={e => handleInputChange("innovations","description",e.target.value)} placeholder={`Describe the ${d.innovations.type}...`} rows={4} /></FieldWrap>
        <FieldWrap label="Key Features">
          <div className="space-y-2">
            {d.innovations.keyFeatures.map((f,i) => <Input key={i} type="text" value={f} onChange={e => { const kf=[...d.innovations.keyFeatures]; kf[i]=e.target.value; handleInputChange("innovations","keyFeatures",kf); }} placeholder={`Key feature ${i+1}`} />)}
          </div>
        </FieldWrap>
        <FieldWrap label="Products & Services (Multi-select)">
          <div className="rounded-xl border p-3 space-y-2 max-h-48 overflow-y-auto" style={{ borderColor: "rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.03)" }}>
            {[
              "Renewable Energy",
              "Sustainability / ESG / Net Zero",
              "Energy Efficiency & Management",
              "Company Wellness",
              "IT & Related Services",
              "Jobs & Recruitment",
              "Finance & Funding",
              "Eco Friendly Building Products",
              "Utiity Provision & Civils"
            ].map(product => (
              <label key={product} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded transition-colors">
                <input type="checkbox" checked={d.innovations.productsServices?.includes(product)||false}
                  onChange={e => handleInputChange("innovations","productsServices", e.target.checked ? [...(d.innovations.productsServices||[]),product] : (d.innovations.productsServices||[]).filter(p=>p!==product))}
                  style={{ accentColor: "#06b6d4" }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>{product}</span>
              </label>
            ))}
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
            {d.innovations.productsServices?.length || 0} product/service(s) selected
          </p>
        </FieldWrap>
        <div className="grid grid-cols-2 gap-4">
          <FieldWrap label="Status">
            <Select value={d.innovations.status} onChange={e => handleInputChange("innovations","status",e.target.value)}>
              {["Upcoming","In Development","Launched","Pilot"].map(o => <option key={o} value={o}>{o}</option>)}
            </Select>
          </FieldWrap>
          <FieldWrap label="Link"><Input type="url" value={d.innovations.link} onChange={e => handleInputChange("innovations","link",e.target.value)} placeholder="https://example.com" /></FieldWrap>
        </div>
      </div>
    );

    if (activeSection === "case-studies") return (
      <div className="space-y-4">
        <FieldWrap label="Company Name">
          <Select value={d["case-studies"].company} onChange={e => handleInputChange("case-studies","company",e.target.value)} disabled={loadingCompaniesList}>
            <option value="">{loadingCompaniesList ? 'Loading...' : 'Select company'}</option>
            {(companiesList||[]).map(c => <option key={c.id} value={c.companyName}>{c.companyName}</option>)}
          </Select>
        </FieldWrap>
        <FieldWrap label="Sector">
          <Select value={d["case-studies"].sector} onChange={e => handleInputChange("case-studies","sector",e.target.value)}>
            <option value="">Select sector</option>
            {["Construction","Industrial","Commercial / Retail","Agriculture","Domestic"].map(o => <option key={o} value={o}>{o}</option>)}
          </Select>
        </FieldWrap>
        <FieldWrap label="Case Study Title"><Input type="text" value={d["case-studies"].title} onChange={e => handleInputChange("case-studies","title",e.target.value)} placeholder="Enter case study title" /></FieldWrap>
        <div className="grid grid-cols-2 gap-4">
          <FieldWrap label="Location"><Input type="text" value={d["case-studies"].location} onChange={e => handleInputChange("case-studies","location",e.target.value)} placeholder="Project location" /></FieldWrap>
          <FieldWrap label="Year"><Input type="text" value={d["case-studies"].year} onChange={e => handleInputChange("case-studies","year",e.target.value)} placeholder="e.g. 2024" /></FieldWrap>
        </div>
        <FieldWrap label="Description"><Textarea value={d["case-studies"].description} onChange={e => handleInputChange("case-studies","description",e.target.value)} placeholder="Describe the case study..." rows={6} /></FieldWrap>
        <FieldWrap label="Products & Services (Multi-select)">
          <div className="rounded-xl border p-3 space-y-2 max-h-48 overflow-y-auto" style={{ borderColor: "rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.03)" }}>
            {[
              "Renewable Energy",
              "Sustainability / ESG / Net Zero",
              "Energy Efficiency & Management",
              "Company Wellness",
              "IT & Related Services",
              "Jobs & Recruitment",
              "Finance & Funding",
              "Eco Friendly Building Products",
              "Utiity Provision & Civils"
            ].map(product => (
              <label key={product} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded transition-colors">
                <input type="checkbox" checked={d["case-studies"].productsServices?.includes(product)||false}
                  onChange={e => handleInputChange("case-studies","productsServices", e.target.checked ? [...(d["case-studies"].productsServices||[]),product] : (d["case-studies"].productsServices||[]).filter(p=>p!==product))}
                  style={{ accentColor: "#06b6d4" }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>{product}</span>
              </label>
            ))}
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
            {d["case-studies"].productsServices?.length || 0} product/service(s) selected
          </p>
        </FieldWrap>

        <SectionDivider label="Key Features" />
        <div className="space-y-3">
          {(d["case-studies"].keyFeatures || [""]).map((feature, i) => (
            <div key={i} className="flex gap-2">
              <Input
                type="text"
                value={feature}
                onChange={e => {
                  const features = [...(d["case-studies"].keyFeatures || [""])];
                  features[i] = e.target.value;
                  handleInputChange("case-studies", "keyFeatures", features);
                }}
                placeholder={`Feature ${i + 1}`}
                className="flex-1"
              />
              {i > 0 && (
                <button
                  onClick={() => {
                    const features = d["case-studies"].keyFeatures.filter((_, idx) => idx !== i);
                    handleInputChange("case-studies", "keyFeatures", features);
                  }}
                  className="px-3 py-2 rounded-lg text-xs"
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => handleInputChange("case-studies", "keyFeatures", [...(d["case-studies"].keyFeatures || []), ""])}
            className="px-4 py-2 rounded-lg text-xs"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981" }}
          >
            + Add Feature
          </button>
        </div>

        <SectionDivider label="Project Details" />
        <div className="grid grid-cols-1 gap-4">
          <FieldWrap label="Challenges"><Textarea value={d["case-studies"].challenges} onChange={e => handleInputChange("case-studies","challenges",e.target.value)} placeholder="Describe the challenges faced..." rows={4} /></FieldWrap>
          <FieldWrap label="Solution"><Textarea value={d["case-studies"].solution} onChange={e => handleInputChange("case-studies","solution",e.target.value)} placeholder="Describe the solution implemented..." rows={4} /></FieldWrap>
          <FieldWrap label="Outcome"><Textarea value={d["case-studies"].outcome} onChange={e => handleInputChange("case-studies","outcome",e.target.value)} placeholder="Describe the results and outcomes..." rows={4} /></FieldWrap>
        </div>

        <FieldWrap label="Case Study Images">
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_,i) => (
              <ImageDropZone key={i} value={d["case-studies"].images?.[i]} onChange={v => { const imgs=[...(d["case-studies"].images||[])]; while(imgs.length<=i) imgs.push(""); imgs[i]=v; handleInputChange("case-studies","images",imgs); }} onClear={() => { const imgs=[...(d["case-studies"].images||[])]; imgs[i]=""; handleInputChange("case-studies","images",imgs); }} label={`Image ${i+1}`} />
            ))}
          </div>
        </FieldWrap>
      </div>
    );

    if (activeSection === "advertisement") return (
      <div className="space-y-4">
        <FieldWrap label="Title"><Input type="text" value={d.advertisement.title} onChange={e => handleInputChange("advertisement","title",e.target.value)} placeholder="Advertisement title" /></FieldWrap>
        <FieldWrap label="Image"><ImageDropZone value={d.advertisement.image} onChange={v => handleInputChange("advertisement","image",v)} onClear={() => handleInputChange("advertisement","image","")} /></FieldWrap>
        <FieldWrap label="Description (max 20 words)"><Textarea value={d.advertisement.description} onChange={e => { const words=e.target.value.trim().split(/\s+/).filter(w=>w.length>0); if(words.length<=20||e.target.value==="") handleInputChange("advertisement","description",e.target.value); }} placeholder="Short description (max 20 words)" rows={3} /></FieldWrap>
        <FieldWrap label="URL"><Input type="text" value={d.advertisement.url} onChange={e => handleInputChange("advertisement","url",e.target.value)} placeholder="https://example.com" /></FieldWrap>
      </div>
    );

    if (activeSection === "home-news") return (
      <div className="space-y-4">
        <FieldWrap label="News Title"><Input type="text" value={d["home-news"].title} onChange={e => handleInputChange("home-news","title",e.target.value)} placeholder="Enter news title" /></FieldWrap>
        <FieldWrap label="Image"><ImageDropZone value={d["home-news"].image} onChange={v => handleInputChange("home-news","image",v)} onClear={() => handleInputChange("home-news","image","")} /></FieldWrap>
        <FieldWrap label="Description"><Textarea value={d["home-news"].description} onChange={e => handleInputChange("home-news","description",e.target.value)} placeholder="Enter description" rows={3} /></FieldWrap>
        <FieldWrap label="Link"><Input type="text" value={d["home-news"].link} onChange={e => handleInputChange("home-news","link",e.target.value)} placeholder="/news" /></FieldWrap>
      </div>
    );

    if (activeSection === "home-testimonials") return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FieldWrap label="Name"><Input type="text" value={d["home-testimonials"].name} onChange={e => handleInputChange("home-testimonials","name",e.target.value)} placeholder="Enter name" /></FieldWrap>
          <FieldWrap label="Designation"><Input type="text" value={d["home-testimonials"].designation} onChange={e => handleInputChange("home-testimonials","designation",e.target.value)} placeholder="e.g. CEO" /></FieldWrap>
        </div>
        <FieldWrap label="Company Name"><Input type="text" value={d["home-testimonials"].companyName} onChange={e => handleInputChange("home-testimonials","companyName",e.target.value)} placeholder="Company name" /></FieldWrap>
        <FieldWrap label="Image"><ImageDropZone value={d["home-testimonials"].image} onChange={v => handleInputChange("home-testimonials","image",v)} onClear={() => handleInputChange("home-testimonials","image","")} /></FieldWrap>
        <FieldWrap label="Stars (1-5)"><Input type="number" min="1" max="5" value={d["home-testimonials"].stars} onChange={e => { const v=e.target.value; if(v===""||(!isNaN(parseInt(v))&&parseInt(v)>=1&&parseInt(v)<=5&&!v.includes('.'))) handleInputChange("home-testimonials","stars",v); }} /></FieldWrap>
        <FieldWrap label="Testimonial (max 30 words)">
          <Textarea value={d["home-testimonials"].testimonial} onChange={e => { const words=e.target.value.trim().split(/\s+/).filter(w=>w.length>0); if(words.length<=30||e.target.value==="") handleInputChange("home-testimonials","testimonial",e.target.value); }} placeholder="Testimonial content (max 30 words)" rows={4} />
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10.5px", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>
            {d["home-testimonials"].testimonial.trim().split(/\s+/).filter(w=>w.length>0).length} / 30 words
          </p>
        </FieldWrap>
      </div>
    );

    if (activeSection === "home-showcase") return (
      <div className="space-y-4">
        <FieldWrap label="Showcase Type">
          <Select value={d["home-showcase"].type} onChange={e => { handleInputChange("home-showcase","type",e.target.value); handleInputChange("home-showcase","itemId",""); handleInputChange("home-showcase","title",""); handleInputChange("home-showcase","image",""); handleInputChange("home-showcase","link",""); }}>
            {["Case Study","Product/Service","Completed Projects","Which Women in Renewables"].map(o => <option key={o} value={o}>{o}</option>)}
          </Select>
        </FieldWrap>
        <FieldWrap label="Select Item">
          <Select value={d["home-showcase"].itemId} onChange={e => {
            const val=e.target.value; handleInputChange("home-showcase","itemId",val);
            if (d["home-showcase"].type==="Case Study") { const s=uploadedData["case-studies"]?.find(i=>String(i.id)===val); if(s){handleInputChange("home-showcase","title",s.title||"");handleInputChange("home-showcase","companyName",s.company||"");handleInputChange("home-showcase","image",(s.images&&s.images[0])?s.images[0]:"");const company=companiesList?.find(c=>c.companyName===s.company);handleInputChange("home-showcase","link",company?`/company/${company.slug}`:"/showcase-hub/industry-case-studies");}}
            else if(d["home-showcase"].type==="Product/Service"){const s=allProductsServices?.find(i=>String(i.id)===val);if(s){handleInputChange("home-showcase","title",s.title||s.name||"");handleInputChange("home-showcase","companyName",s.companyName||"");handleInputChange("home-showcase","image",(s.images&&s.images[0])?s.images[0]:(s.image||""));const company=companiesList?.find(c=>c.id===s.companyId||c.companyName===s.companyName);handleInputChange("home-showcase","link",company?`/company/${company.slug}?tab=products-services`:"/showcase-hub/product-service-in-spotlight");}}
            else if(d["home-showcase"].type==="Completed Projects"){const s=uploadedData["showcase"]?.find(i=>String(i.id)===val);if(s){handleInputChange("home-showcase","title",s.title||"");handleInputChange("home-showcase","image",(s.images&&s.images[0])?s.images[0]:"");handleInputChange("home-showcase","link","/showcase-hub/recent-completed-projects");}}
            else if(d["home-showcase"].type==="Which Women in Renewables"){const s=uploadedData["which-women"]?.find(i=>String(i.id)===val);if(s){handleInputChange("home-showcase","title",s.name||"");handleInputChange("home-showcase","image",s.image||"");handleInputChange("home-showcase","link","/showcase-hub/which-women-in-renewables");}}
          }}>
            <option value="">-- Select an item --</option>
            {d["home-showcase"].type==="Case Study"&&uploadedData["case-studies"]?.map(item=><option key={item.id} value={item.id}>{item.title}</option>)}
            {d["home-showcase"].type==="Product/Service"&&allProductsServices?.map(item=><option key={item.id} value={item.id}>{item.title||item.name} - {item.companyName}</option>)}
            {d["home-showcase"].type==="Completed Projects"&&uploadedData["showcase"]?.map(item=><option key={item.id} value={item.id}>{item.title}</option>)}
            {d["home-showcase"].type==="Which Women in Renewables"&&uploadedData["which-women"]?.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}
          </Select>
        </FieldWrap>
        {d["home-showcase"].image && <FieldWrap label="Preview"><img src={d["home-showcase"].image} alt="Preview" className="h-20 w-20 object-cover rounded-xl" style={{ border: "1px solid rgba(16,185,129,0.3)" }} /></FieldWrap>}
        {d["home-showcase"].title && <FieldWrap label="Title Displayed"><p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#10b981" }}>{d["home-showcase"].title}</p></FieldWrap>}
      </div>
    );

    return null;
  };

  const formSections = ["news","events","webinars","awards","hallOfFame","regional","showcase","innovations","case-studies","blogs","which-women","advertisement","home-news","home-testimonials","home-showcase"];
  const isSpotlightSection = ["company-spotlight","product-service-spotlight"].includes(activeSection);
  const showFormActions = formSections.includes(activeSection);

  /* ── RENDER ── */
  return (
    <div className="min-h-screen flex" style={{ background: "#040e1e", fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        ::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.35); border-radius: 99px; }
        ::placeholder { color: rgba(255,255,255,0.25) !important; }
        option { background: #040e1e; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.6; }
      `}</style>

      {/* ── SUCCESS TOAST ── */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity:0, y:-40 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-40 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-3 px-5 py-3 rounded-xl"
            style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", backdropFilter: "blur(12px)" }}>
            <FaCheckCircle style={{ color: "#10b981" }} />
            <span style={{ color: "#10b981", fontSize: "13px", fontWeight: 500 }}>Entry saved successfully</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ScrollingBanner sits at the very top */}
      <div className="fixed top-0 left-0 right-0 z-[60]">
        <ScrollingBanner />
      </div>

      {/* ── SIDEBAR ── */}
      <aside
        className="fixed left-0 bottom-0 flex flex-col overflow-y-auto transition-all duration-300"
        style={{
          top: "148px", // below ScrollingBanner (~40px) + navbar (~64px) + extra breathing room
          width: sidebarCollapsed ? "64px" : "240px",
          background: "rgba(4,14,30,0.97)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(20px)",
          zIndex: 40,
        }}
      >
        {/* Logo row */}
        <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)", flexShrink: 0 }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
            <FaCog style={{ color: "#10b981", fontSize: "13px" }} />
          </div>
          {!sidebarCollapsed && <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px", fontWeight: 700, color: "#ffffff", whiteSpace: "nowrap" }}>Admin Portal</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {sections.map(section => {
            const Icon = section.icon;
            const isActive = section.isFolder ? section.children?.some(c => activeSection === c.id) : activeSection === section.id;

            if (section.isFolder) return (
              <div key={section.id}>
                <button
                  onClick={() => setExpandedFolders(prev => ({ ...prev, [section.id]: !prev[section.id] }))}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200"
                  style={{ background: isActive ? "rgba(16,185,129,0.08)" : "transparent", color: isActive ? "#10b981" : "rgba(255,255,255,0.5)" }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  {expandedFolders[section.id] ? <FaFolderOpen style={{ fontSize: "13px", flexShrink: 0 }} /> : <FaFolder style={{ fontSize: "13px", flexShrink: 0 }} />}
                  {!sidebarCollapsed && (
                    <>
                      <span style={{ fontSize: "12.5px", fontWeight: 500, flex: 1, textAlign: "left", whiteSpace: "nowrap" }}>{section.name}</span>
                      <FaChevronRight style={{ fontSize: "9px", transition: "transform 0.2s", transform: expandedFolders[section.id] ? "rotate(90deg)" : "rotate(0)" }} />
                    </>
                  )}
                </button>
                {expandedFolders[section.id] && !sidebarCollapsed && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l pl-3" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                    {(section.children||[]).map(child => {
                      const ChildIcon = child.icon;
                      const isChildActive = activeSection === child.id;
                      return (
                        <button key={child.id} onClick={() => setActiveSection(child.id)}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all duration-150 text-left"
                          style={{ background: isChildActive ? "rgba(16,185,129,0.1)" : "transparent", color: isChildActive ? "#10b981" : "rgba(255,255,255,0.45)" }}
                          onMouseEnter={e => { if (!isChildActive) e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
                          onMouseLeave={e => { if (!isChildActive) e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
                        >
                          <ChildIcon style={{ fontSize: "11px", flexShrink: 0 }} />
                          <span style={{ fontSize: "11.5px", fontWeight: isChildActive ? 500 : 300, whiteSpace: "nowrap" }}>{child.name}</span>
                          {isChildActive && <div className="ml-auto w-1 h-1 rounded-full" style={{ background: "#10b981" }} />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );

            return (
              <button key={section.id}
                onClick={() => { if (section.id === 'onboard-company') navigate('/admin/onboard-company'); else if (section.id === 'products-services') navigate('/admin/products-services'); else setActiveSection(section.id); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-150"
                style={{ background: isActive ? "rgba(16,185,129,0.1)" : "transparent", color: isActive ? "#10b981" : "rgba(255,255,255,0.5)" }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <Icon style={{ fontSize: "13px", flexShrink: 0 }} />
                {!sidebarCollapsed && <span style={{ fontSize: "12.5px", fontWeight: 500, whiteSpace: "nowrap" }}>{section.name}</span>}
                {isActive && !sidebarCollapsed && <div className="ml-auto w-1 h-1 rounded-full" style={{ background: "#10b981" }} />}
              </button>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="p-3 border-t flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center py-2 rounded-xl transition-all"
            style={{ background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.3)" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}
          >
            <FaChevronDown style={{ fontSize: "10px", transform: sidebarCollapsed ? "rotate(-90deg)" : "rotate(90deg)", transition: "transform 0.2s" }} />
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex flex-col min-h-screen flex-1 transition-all duration-300" style={{ marginLeft: sidebarCollapsed ? "64px" : "240px", marginTop: "148px" }}>

        {/* Top bar */}
        <header className="flex items-center justify-between px-8 py-4 border-b sticky top-0 z-30" style={{ background: "rgba(4,14,30,0.95)", borderColor: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}>
          <div className="flex items-center gap-3">
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#ffffff" }}>{getActiveName()}</h1>
            {!!uploadedData[activeSection]?.length && (
              <span className="px-2.5 py-0.5 rounded-full" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", fontFamily: "'DM Sans', sans-serif", fontSize: "10.5px", color: "#10b981" }}>
                {uploadedData[activeSection].length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="h-6 w-px" style={{ background: "rgba(255,255,255,0.1)" }} />
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)" }}>
                <FaUser style={{ color: "#10b981", fontSize: "10px" }} />
              </div>
              <div className="hidden md:block">
                <p style={{ fontSize: "12px", fontWeight: 500, color: "#ffffff" }}>Admin</p>
                <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{user?.email || 'admin@whichrenewables.com'}</p>
              </div>
            </div>
            <button onClick={() => { logout(); navigate('/'); }}
              className="px-4 py-1.5 rounded-xl text-xs font-medium transition-all"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.16)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">

          {/* ── COMPANIES TABLE ── */}
          {activeSection === 'companies' && (
            <div className="rounded-2xl border overflow-hidden flex flex-col" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)", height: "calc(100vh - 160px)" }}>
              {/* toolbar */}
              <div className="px-5 py-4 border-b flex flex-wrap gap-3 items-center" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                <div className="relative">
                  <FaSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", fontSize: "11px" }} />
                  <input type="text" placeholder="Search companies..." value={companiesSearchTerm} onChange={e => setCompaniesSearchTerm(e.target.value)}
                    style={{ ...fieldBase, paddingLeft: "32px", width: "220px", fontSize: "12px" }} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div className="relative">
                  <select value={companiesStatusFilter} onChange={e => setCompaniesStatusFilter(e.target.value)} style={{ ...fieldBase, width: "140px", fontSize: "12px", appearance: "none", paddingRight: "28px" }} onFocus={onFocus} onBlur={onBlur}>
                    {["All","Active","Pending","Inactive","Archived"].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <FaChevronDown style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", fontSize: "10px", pointerEvents: "none" }} />
                </div>
                <input type="date" value={companiesDateFilter.start} onChange={e => setCompaniesDateFilter(p => ({ ...p, start: e.target.value }))} style={{ ...fieldBase, width: "140px", fontSize: "12px", colorScheme: "dark" }} onFocus={onFocus} onBlur={onBlur} />
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>–</span>
                <input type="date" value={companiesDateFilter.end} onChange={e => setCompaniesDateFilter(p => ({ ...p, end: e.target.value }))} style={{ ...fieldBase, width: "140px", fontSize: "12px", colorScheme: "dark" }} onFocus={onFocus} onBlur={onBlur} />
                <button onClick={exportCompaniesToCSV} disabled={isExportingCompanies}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                  style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(16,185,129,0.16)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(16,185,129,0.08)"}
                >
                  {isExportingCompanies ? <div className="w-3 h-3 border rounded-full animate-spin" style={{ borderColor: "rgba(16,185,129,0.3)", borderTopColor: "#10b981" }} /> : <FaFileCsv />}
                  Export
                </button>
              </div>

              {/* table */}
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left">
                  <thead style={{ background: "rgba(255,255,255,0.02)", position: "sticky", top: 0, zIndex: 5 }}>
                    <tr>
                      {[["companyName","Company"],["mainSector","Sector"],["","Plan"],["","Expiry Date"],["createdAt","Onboarded"],["","Contact"],["","Status"],["","Actions"]].map(([key,label]) => (
                        <th key={label} onClick={key ? () => handleCompaniesSort(key) : undefined}
                          className={key ? "cursor-pointer" : ""}
                          style={{ padding: "10px 16px", fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", borderBottom: "1px solid rgba(255,255,255,0.07)", whiteSpace: "nowrap" }}>
                          <div className="flex items-center gap-1.5">
                            {label}
                            {key && companiesSortConfig.key === key && (companiesSortConfig.direction === 'ascending' ? <FaSortUp style={{ color: "#10b981" }} /> : <FaSortDown style={{ color: "#10b981" }} />)}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loadingCompaniesList ? (
                      <tr><td colSpan="8" style={{ padding: "32px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>Loading companies…</td></tr>
                    ) : processedCompanies.length === 0 ? (
                      <tr><td colSpan="8" style={{ padding: "32px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>No companies match your filters.</td></tr>
                    ) : processedCompanies.slice((companiesCurrentPage-1)*companiesItemsPerPage, companiesCurrentPage*companiesItemsPerPage).map(company => (
                      <tr key={company.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={{ padding: "10px 16px" }}><span style={{ fontSize: "13px", fontWeight: 500, color: "#ffffff" }}>{company.companyName}</span></td>
                        <td style={{ padding: "10px 16px", fontSize: "12.5px", color: "rgba(255,255,255,0.55)" }}>{company.mainSector||'–'}</td>
                        <td style={{ padding: "10px 16px" }}>
                          {(() => { const raw=company?.subscription?.plan; let p=typeof raw==="string"?raw.toLowerCase():(raw?.name||raw?.id||"").toLowerCase(); const label=typeof raw==="string"?raw:(raw?.name||raw?.id||"–"); const color=p.includes('elite')?"#8b5cf6":p.includes('professional')?"#10b981":"rgba(255,255,255,0.4)"; return <span style={{ fontSize: "11px", fontWeight: 500, color }}>{label||'–'}</span>; })()}
                        </td>
                        <td style={{ padding: "10px 16px", fontSize: "11.5px", color: "rgba(255,255,255,0.4)" }}>{getCompanyExpiryDate(company)}</td>
                        <td style={{ padding: "10px 16px", fontSize: "11.5px", color: "rgba(255,255,255,0.4)" }}>{new Date(company.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: "10px 16px" }}>
                          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)" }}>{typeof company.contactPerson==='object'?`${company.contactPerson?.firstName||''} ${company.contactPerson?.lastName||''}`.trim():company.contactPerson}</div>
                          <div style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.3)" }}>{company.email}</div>
                        </td>
                        <td style={{ padding: "10px 16px" }}><StatusBadge status={company.status||'Active'} /></td>
                        <td style={{ padding: "10px 16px" }}>
                          <button onClick={() => handleArchiveCompany(company.id, company.status)}
                            style={{ padding: "3px 10px", borderRadius: "99px", fontSize: "10.5px", cursor: "pointer", background: company.status==='Archived'?"rgba(16,185,129,0.08)":"rgba(239,68,68,0.08)", border: company.status==='Archived'?"1px solid rgba(16,185,129,0.3)":"1px solid rgba(239,68,68,0.3)", color: company.status==='Archived'?"#10b981":"#ef4444" }}>
                            {company.status==='Archived'?'Unarchive':'Archive'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* pagination */}
              <div className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                <span style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.35)" }}>
                  Showing {Math.min((companiesCurrentPage-1)*companiesItemsPerPage+1,processedCompanies.length)}–{Math.min(companiesCurrentPage*companiesItemsPerPage,processedCompanies.length)} of {processedCompanies.length}
                </span>
                <div className="flex gap-1.5">
                  {[["← Prev", companiesCurrentPage-1, companiesCurrentPage===1], ...Array.from({length:Math.ceil(processedCompanies.length/companiesItemsPerPage)},(_,i)=>[i+1,i+1,false]), ["Next →", companiesCurrentPage+1, companiesCurrentPage===Math.ceil(processedCompanies.length/companiesItemsPerPage)]].map(([label,page,disabled],i) => (
                    <button key={i} onClick={() => !disabled && setCompaniesCurrentPage(page)} disabled={disabled}
                      style={{ padding: "3px 9px", borderRadius: "8px", fontSize: "11px", cursor: disabled?"not-allowed":"pointer", background: page===companiesCurrentPage&&typeof page==='number'?"#10b981":"rgba(255,255,255,0.05)", color: page===companiesCurrentPage&&typeof page==='number'?"#fff":"rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)", opacity: disabled?0.4:1 }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── NEWSLETTER TABLE ── */}
          {activeSection === 'newsletter-subscribers' && (() => {
            const filteredSubs = newsletterSubscribersList.filter(s => !subscribersSearchTerm || String(s.email||'').toLowerCase().includes(subscribersSearchTerm.toLowerCase()));
            const totalPages = Math.ceil(filteredSubs.length / subscribersItemsPerPage);
            const paged = filteredSubs.slice((subscribersCurrentPage-1)*subscribersItemsPerPage, subscribersCurrentPage*subscribersItemsPerPage);
            const exportCSV = () => {
              setIsExportingSubscribers(true);
              const csv = ["Email,Subscribed On",...filteredSubs.map(s=>`"${s.email}","${new Date(s.createdAt).toLocaleString()}"`)].join('\n');
              const blob = new Blob([csv],{type:'text/csv'});
              const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`subscribers_${new Date().toISOString().split('T')[0]}.csv`; document.body.appendChild(a); a.click(); document.body.removeChild(a);
              setIsExportingSubscribers(false);
            };
            return (
              <div className="rounded-2xl border overflow-hidden flex flex-col" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)", height: "calc(100vh - 160px)" }}>
                <div className="px-5 py-4 border-b flex gap-3 items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <FaSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", fontSize: "11px" }} />
                      <input type="text" placeholder="Search subscribers..." value={subscribersSearchTerm} onChange={e => { setSubscribersSearchTerm(e.target.value); setSubscribersCurrentPage(1); }}
                        style={{ ...fieldBase, paddingLeft: "32px", width: "220px", fontSize: "12px" }} onFocus={onFocus} onBlur={onBlur} />
                    </div>
                    <span style={{ padding: "3px 10px", borderRadius: "99px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", fontSize: "10.5px", color: "#10b981" }}>{filteredSubs.length} subscribers</span>
                  </div>
                  <button onClick={exportCSV} disabled={isExportingSubscribers||filteredSubs.length===0}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all disabled:opacity-40"
                    style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981" }}>
                    {isExportingSubscribers ? <div className="w-3 h-3 border rounded-full animate-spin" style={{ borderColor: "rgba(16,185,129,0.3)", borderTopColor: "#10b981" }} /> : <FaFileCsv />}
                    Export CSV
                  </button>
                </div>
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-left">
                    <thead style={{ background: "rgba(255,255,255,0.02)", position: "sticky", top: 0 }}>
                      <tr>{["#","Email Address","Subscribed On","Status"].map(h => <th key={h} style={{ padding: "10px 16px", fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {loadingNewsletterSubscribers ? <tr><td colSpan="4" style={{ padding: "32px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>Loading…</td></tr>
                        : paged.length === 0 ? <tr><td colSpan="4" style={{ padding: "32px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>No subscribers found.</td></tr>
                        : paged.map((sub, idx) => (
                          <tr key={sub.id||sub.email} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                            onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.025)"}
                            onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                            <td style={{ padding: "10px 16px", fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>{(subscribersCurrentPage-1)*subscribersItemsPerPage+idx+1}</td>
                            <td style={{ padding: "10px 16px" }}><span style={{ fontSize: "13px", fontWeight: 500, color: "#fff" }}>{sub.email}</span></td>
                            <td style={{ padding: "10px 16px", fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>{sub.createdAt ? new Date(sub.createdAt).toLocaleString() : '–'}</td>
                            <td style={{ padding: "10px 16px" }}><StatusBadge status="Active" /></td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                {totalPages > 1 && (
                  <div className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                    <span style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.35)" }}>Showing {Math.min((subscribersCurrentPage-1)*subscribersItemsPerPage+1,filteredSubs.length)}–{Math.min(subscribersCurrentPage*subscribersItemsPerPage,filteredSubs.length)} of {filteredSubs.length}</span>
                    <div className="flex gap-1.5">
                      <button onClick={() => setSubscribersCurrentPage(p=>Math.max(p-1,1))} disabled={subscribersCurrentPage===1} style={{ padding: "3px 9px", borderRadius: "8px", fontSize: "11px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", cursor: subscribersCurrentPage===1?"not-allowed":"pointer", opacity: subscribersCurrentPage===1?0.4:1 }}>← Prev</button>
                      <button onClick={() => setSubscribersCurrentPage(p=>Math.min(p+1,totalPages))} disabled={subscribersCurrentPage===totalPages} style={{ padding: "3px 9px", borderRadius: "8px", fontSize: "11px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", cursor: subscribersCurrentPage===totalPages?"not-allowed":"pointer", opacity: subscribersCurrentPage===totalPages?0.4:1 }}>Next →</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── FORM + ITEMS GRID ── */}
          {activeSection !== 'companies' && activeSection !== 'newsletter-subscribers' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

              {/* Form card */}
              <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
                className="rounded-2xl border overflow-hidden"
                style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}>
                {/* header */}
                <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)" }}>
                    {editingId ? <FaEdit style={{ color: "#10b981", fontSize: "11px" }} /> : <FaPlus style={{ color: "#10b981", fontSize: "11px" }} />}
                  </div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "#ffffff" }}>
                    {editingId ? "Edit Entry" : `Add ${getActiveName()}`}
                  </h2>
                  {editingId && (
                    <span style={{ marginLeft: "auto", padding: "2px 8px", borderRadius: "99px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", fontSize: "10px", color: "#f59e0b" }}>
                      Editing
                    </span>
                  )}
                </div>

                <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(100vh - 240px)" }}>
                  {renderForm()}

                  {/* Submit / Cancel */}
                  {(showFormActions || isSpotlightSection) && showFormActions && (
                    <div className="flex gap-3 mt-6 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                      {editingId && (
                        <button onClick={() => { setEditingId(null); setFormData(prev => ({ ...prev, [activeSection]: Object.keys(prev[activeSection]).reduce((a,k) => ({ ...a, [k]: Array.isArray(prev[activeSection][k])?[]:"" }), {}) })); }}
                          style={{ padding: "10px 20px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontSize: "13px", cursor: "pointer" }}>
                          Cancel
                        </button>
                      )}
                      <button id="admin-save-btn" onClick={() => handleSubmit(activeSection)} disabled={isSubmitting}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                        style={{ background: editingId ? "rgba(59,130,246,0.85)" : "#10b981", color: "#ffffff", border: "none", cursor: isSubmitting?"not-allowed":"pointer", boxShadow: editingId ? "0 0 20px rgba(59,130,246,0.3)" : "0 0 20px rgba(16,185,129,0.3)" }}>
                        {isSubmitting ? (
                          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing…</>
                        ) : editingId ? (
                          <><FaEdit style={{ fontSize: "11px" }} /> Update Entry</>
                        ) : (
                          <><FaSave style={{ fontSize: "11px" }} /> Save Entry</>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Items card */}
              <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
                className="rounded-2xl border overflow-hidden"
                style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}>
                <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.25)" }}>
                      <FaEye style={{ color: "#06b6d4", fontSize: "11px" }} />
                    </div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "#ffffff" }}>Saved Entries</h2>
                  </div>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{uploadedData[activeSection]?.length||0} total</span>
                </div>

                <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 240px)" }}>
                  {!uploadedData[activeSection]?.length ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <FaCloudUploadAlt style={{ color: "rgba(255,255,255,0.2)", fontSize: "18px" }} />
                      </div>
                      <p style={{ fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}>No entries yet</p>
                      <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.25)" }}>Use the form to add content.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {(uploadedData[activeSection]||[]).map((item, index) => (
                        <motion.div key={item.id} initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }} transition={{ delay:index*0.04 }}
                          className="group flex items-start justify-between rounded-xl px-4 py-3 transition-all duration-200"
                          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
                          onMouseEnter={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.12)"}
                          onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"}
                        >
                          <div className="flex-1 min-w-0">
                            <p style={{ fontSize: "13px", fontWeight: 500, color: "#ffffff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {item.title||item.name||item.headline||item.personName||"Untitled"}
                            </p>
                            <p style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>
                              {getSavedEntryMetaText(item)}
                            </p>
                            <div className="flex gap-1.5 mt-1.5 flex-wrap">
                              {item.source && <span style={{ padding: "1px 7px", borderRadius: "99px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", fontSize: "9.5px", color: "#10b981" }}>{item.source}</span>}
                              {item.status && <StatusBadge status={item.status} />}
                              {item.type && activeSection==="home-showcase" && <span style={{ padding: "1px 7px", borderRadius: "99px", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", fontSize: "9.5px", color: "#3b82f6" }}>{item.type}</span>}
                            </div>
                          </div>
                          <div className="flex gap-1 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(activeSection, item)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                              style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}
                              onMouseEnter={e => e.currentTarget.style.background="rgba(59,130,246,0.18)"}
                              onMouseLeave={e => e.currentTarget.style.background="rgba(59,130,246,0.08)"}>
                              <FaEdit style={{ color: "#3b82f6", fontSize: "10px" }} />
                            </button>
                            <button onClick={() => handleDelete(activeSection, item.id)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
                              onMouseEnter={e => e.currentTarget.style.background="rgba(239,68,68,0.18)"}
                              onMouseLeave={e => e.currentTarget.style.background="rgba(239,68,68,0.08)"}>
                              <FaTrash style={{ color: "#ef4444", fontSize: "10px" }} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

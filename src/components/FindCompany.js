import React, { useState } from 'react';
import { Search, ChevronDown, MapPin, Building, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllCompanies } from '../utils/companiesAPI';
import { API_HOST } from '../config';
import ScrollingBanner from './home/ScrollingBanner';

const regionsWithSubregions = {
  'United Kingdom & Ireland': ['England', 'Scotland', 'Wales', 'Northern Ireland', 'Republic Of Ireland'],
  'Ireland': ['N.Ireland / Rep of Ireland', 'Northern Ireland Only', 'Republic Of Ireland Only', 'Greater Dublin', 'Southern Counties', 'Midland Counties', 'West & North west', 'Border Counties'],
  'UK Mainland Only': ['England', 'Scotland', 'Wales'],
  'Scotland': ['Highlands & islands', 'Grampian', 'Central', 'Strathclyde', 'Lothian', 'Borders', 'Dumfries & Galloway'],
  'England': [
    'Cornwall', 'Devon', 'Somerset', 'Avon', 'Wiltshire', 'Hampshire', 'West Sussex',
    'Surrey', 'Berkshire', 'East Sussex', 'Kent', 'Essex', 'Hertfordshire',
    'Buckinghamshire', 'Suffolk', 'Norfolk', 'Cambridgeshire', 'Northamptonshire',
    'Warwickshire', 'Oxfordshire', 'Shropshire', 'East Riding of Yorkshire',
    'Leicestershire', 'West Midlands', 'Glouchestershire', 'Hereford & Worcester',
    'Staffordshire', 'Lincolnshire', 'Nottinghamshire', 'Derbyshire', 'Cheshire',
    'South Yorkshire', 'Greater Manchester', 'Merseyside', 'Humberside',
    'West Yorkshire', 'Lancashire', 'North Yorkshire', 'Cleveland', 'Durham',
    'Cumbria', 'Tyne & Wear', 'Northumberland', 'Central London', 'North London',
    'West London', 'South London', 'East London',
  ],
  'Wales': ['Clywd', 'Gywwedd', 'Powys', 'Dyfed', 'Cardiff', 'Glamorgan']
};

/* ─────────────────────────────────────────────────────────────
   COMPANY CARD
───────────────────────────────────────────────────────────── */
const CompanyCard = ({ company, index }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <a
        href={`/company/${company.id}`}
        className="flex flex-col h-full rounded-2xl border overflow-hidden transition-all duration-500 group"
        style={{
          borderColor: hovered ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.07)",
          background: hovered
            ? "linear-gradient(145deg, rgba(16,185,129,0.08) 0%, rgba(4,14,30,0.98) 100%)"
            : "rgba(255,255,255,0.025)",
          boxShadow: hovered
            ? "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(16,185,129,0.2)"
            : "0 4px 20px rgba(0,0,0,0.3)",
          textDecoration: "none",
        }}
      >
        {/* top accent bar */}
        <div
          className="h-[2px] transition-opacity duration-500"
          style={{
            background: "linear-gradient(90deg, transparent, #10b981, transparent)",
            opacity: hovered ? 1 : 0.2,
          }}
        />

        <div className="flex flex-col flex-1 p-5">
          {/* logo + name */}
          <div className="flex items-start gap-3 mb-4">
            {company.companyLogo ? (
              <div
                className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border"
                style={{ background: "rgba(255,255,255,0.95)", borderColor: "rgba(255,255,255,0.12)", padding: "2px" }}
              >
                <img
                  src={`${API_HOST}${company.companyLogo}`}
                  alt={company.companyName}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div
                className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center border"
                style={{
                  background: "rgba(16,185,129,0.1)",
                  borderColor: "rgba(16,185,129,0.3)",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#10b981",
                }}
              >
                {company.companyName?.charAt(0) || "C"}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <h3
                className="font-bold text-white leading-snug line-clamp-2 mb-0.5"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px" }}
              >
                {company.companyName}
              </h3>
              {company.mainSector && (
                <p
                  className="truncate"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "10.5px",
                    color: "#10b981",
                    fontWeight: 500,
                    opacity: 0.85,
                    letterSpacing: "0.04em",
                  }}
                >
                  {company.mainSector}
                </p>
              )}
            </div>
          </div>

          {/* accent rule */}
          <div
            className="mb-3 h-px transition-all duration-500"
            style={{
              background: "linear-gradient(90deg, #10b981, transparent)",
              width: hovered ? "44px" : "20px",
            }}
          />

          {/* address */}
          <div className="flex items-start gap-2 mb-3 flex-1">
            <MapPin size={11} className="flex-shrink-0 mt-0.5" style={{ color: "#10b981" }} />
            <span
              className="line-clamp-2"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.6,
                fontWeight: 300,
              }}
            >
              {company.companyAddress || "Location not specified"}
            </span>
          </div>

          {/* sector pills */}
          {Array.isArray(company.industrySector) && company.industrySector.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {company.industrySector.slice(0, 3).map((sector, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full border"
                  style={{
                    borderColor: "rgba(16,185,129,0.2)",
                    background: "rgba(16,185,129,0.05)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "9.5px",
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  {sector}
                </span>
              ))}
              {company.industrySector.length > 3 && (
                <span
                  className="px-2 py-0.5 rounded-full border"
                  style={{
                    borderColor: "rgba(255,255,255,0.08)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "9.5px",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  +{company.industrySector.length - 3}
                </span>
              )}
            </div>
          )}

          {/* view profile */}
          <div
            className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-200"
            style={{ color: "#10b981", fontFamily: "'DM Sans', sans-serif", fontSize: "12px" }}
          >
            View Profile
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </a>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */
const FindCompany = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const [showSubregionModal, setShowSubregionModal] = useState(false);
  const [activeMainRegion, setActiveMainRegion] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await getAllCompanies();
        if (response.success) {
          let list = [];
          if (response.data && Array.isArray(response.data.data)) list = response.data.data;
          else if (Array.isArray(response.data)) list = response.data;
          setCompanies(list);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const handleRegionSelect = (region) => {
    setSelectedRegions(prev =>
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    );
  };

  const filteredCompanies = companies.filter((company) => {
    let matchesSearch = true;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      matchesSearch = company.companyName?.toLowerCase().includes(q) ||
        company.productsServices?.toLowerCase().includes(q) ||
        (Array.isArray(company.industrySector) && company.industrySector.join(' ').toLowerCase().includes(q));
    }
    let matchesRegion = true;
    if (selectedRegions.length > 0) {
      matchesRegion = selectedRegions.some(sel => {
        const inRegions = Array.isArray(company.regions)
          ? company.regions.some(r => r?.toLowerCase().includes(sel.toLowerCase()))
          : typeof company.regions === 'string'
            ? company.regions.toLowerCase().includes(sel.toLowerCase())
            : false;
        const inAddress = company.companyAddress?.toLowerCase().includes(sel.toLowerCase());
        return inRegions || inAddress;
      });
    }
    return matchesSearch && matchesRegion;
  });

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    padding: "12px 16px",
    color: "#ffffff",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    fontWeight: 300,
    outline: "none",
  };

  return (
    <div className="min-h-screen text-white" style={{ background: "#040e1e" }}>

      <ScrollingBanner />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');
        ::placeholder { color: rgba(255,255,255,0.25) !important; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); border-radius: 99px; }
        ::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.35); border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.6); }
        .themed-scroll::-webkit-scrollbar { width: 5px; }
        .themed-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 99px; }
        .themed-scroll::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.4); border-radius: 99px; }
        .themed-scroll::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.65); }
      `}</style>

      {/* ambient blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.055]"
          style={{ background: "radial-gradient(circle, #10b981, transparent 70%)" }} />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)" }} />
      </div>

      {/* ── HERO / SEARCH ──
          FIX 1: position:relative + z-index:20 ensures this section
          stacks above the results grid below it, so the dropdown
          can overflow out of it and still appear on top.
      ── */}
      <div
        className="relative pt-48 pb-16 px-6 md:px-12"
        style={{
          zIndex: 20,          /* ← FIX 1: sit above the results grid */
          backgroundImage: "url('/YOUR_IMAGE_URL_HERE')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* dark overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(4,14,30,0.7) 0%, rgba(4,14,30,0.6) 60%, #040e1e 100%)",
          }}
        />
        <div className="max-w-4xl mx-auto relative z-10">

          {/* eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6 justify-center"
          >
            <div className="h-px w-10" style={{ background: "#10b981" }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.22em",
              color: "#10b981",
              textTransform: "uppercase",
              fontWeight: 500,
            }}>
              Company Directory
            </span>
            <div className="h-px w-10" style={{ background: "#10b981" }} />
          </motion.div>

          {/* heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
            }}
          >
            Discover Our{" "}
            <span style={{
              background: "linear-gradient(90deg, #10b981, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Clients
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center mb-10"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(13px, 1.5vw, 16px)",
              color: "rgba(255,255,255,0.4)",
              lineHeight: 1.8,
              fontWeight: 300,
            }}
          >
            Locate industry-relevant companies based on geographic regions to support your market or project needs.
          </motion.p>

          {/* search card
              FIX 2: remove overflow-hidden (was clipping the dropdown).
              The border-radius is kept via border-radius in the style prop.
              FIX 3: add position:relative + z-index so the dropdown inside
              can escape the card bounds upward through the stacking context.
          */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="relative rounded-2xl border p-6 md:p-10"
            style={{
              /* overflow: hidden  ← REMOVED: this was clipping the dropdown */
              position: "relative",
              zIndex: 30,          /* ← FIX 3: dropdown escapes above everything */
              background: "rgba(16,185,129,0.04)",
              borderColor: "rgba(16,185,129,0.3)",
              boxShadow: "0 0 0 1px rgba(16,185,129,0.15), 0 32px 80px rgba(0,0,0,0.5), 0 0 60px rgba(16,185,129,0.06), inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
          >
            {/* top accent bar */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
              style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.8), transparent)" }}
            />

            {/* region select */}
            <div className="mb-5">
              <label style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
                display: "block",
                marginBottom: "10px",
              }}>
                Select Region
              </label>

              <div className="relative">
                <button
                  onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
                  className="w-full flex items-center justify-between transition-all duration-200"
                  style={{
                    ...inputStyle,
                    cursor: "pointer",
                    textAlign: "left",
                    borderColor: isRegionDropdownOpen ? "rgba(16,185,129,0.45)" : "rgba(255,255,255,0.1)",
                  }}
                >
                  <span className="flex items-center gap-2">
                    <MapPin size={13} style={{ color: "#10b981" }} />
                    <span style={{ color: selectedRegions.length ? "#ffffff" : "rgba(255,255,255,0.25)" }}>
                      {selectedRegions.length ? `${selectedRegions.length} region${selectedRegions.length > 1 ? "s" : ""} selected` : "Choose a region…"}
                    </span>
                  </span>
                  <ChevronDown
                    size={14}
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      transform: isRegionDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </button>

                <AnimatePresence>
                  {isRegionDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-0 right-0 rounded-xl border overflow-hidden max-h-72 overflow-y-auto themed-scroll"
                      style={{
                        top: "calc(100% + 8px)",
                        zIndex: 9999,   /* ← FIX 4: highest z-index, above all page content */
                        background: "rgba(4,12,30,0.97)",
                        backdropFilter: "blur(32px)",
                        borderColor: "rgba(255,255,255,0.12)",
                        boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
                      }}
                    >
                      {Object.keys(regionsWithSubregions).map((region) => (
                        <button
                          key={region}
                          onClick={() => {
                            setActiveMainRegion(region);
                            setShowSubregionModal(true);
                            setIsRegionDropdownOpen(false);
                          }}
                          className="w-full text-left px-5 py-3.5 border-b transition-all duration-150"
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "13.5px",
                            color: "rgba(255,255,255,0.75)",
                            borderColor: "rgba(255,255,255,0.06)",
                            background: "transparent",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#fff"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}
                        >
                          {region}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* selected pills */}
              <AnimatePresence>
                {selectedRegions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 flex flex-wrap gap-2"
                  >
                    {selectedRegions.map((r) => (
                      <div
                        key={r}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
                        style={{
                          borderColor: "rgba(16,185,129,0.35)",
                          background: "rgba(16,185,129,0.08)",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "11px",
                          color: "#10b981",
                        }}
                      >
                        {r}
                        <button onClick={() => handleRegionSelect(r)} style={{ display: "flex", color: "rgba(16,185,129,0.7)" }}>
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* search input + button */}
            <div>
              <label style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
                display: "block",
                marginBottom: "10px",
              }}>
                Search
              </label>

              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search company name or service…"
                    style={{ ...inputStyle, paddingLeft: "38px" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.45)"; e.currentTarget.style.background = "rgba(16,185,129,0.04)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                    onKeyPress={(e) => e.key === "Enter" && document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth" })}
                  />
                </div>

                <motion.button
                  onClick={() => document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth" })}
                  className="flex-shrink-0 flex items-center gap-2 px-6 rounded-xl text-sm font-semibold transition-all duration-300"
                  style={{
                    background: "#10b981",
                    color: "#ffffff",
                    fontFamily: "'DM Sans', sans-serif",
                    boxShadow: "0 0 20px rgba(16,185,129,0.3)",
                  }}
                  whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(16,185,129,0.5)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Search size={14} />
                  Search
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── RESULTS ──
          FIX 5: position:relative + z-index:10 keeps the grid
          below the hero section in the stacking order.
      ── */}
      <div className="relative pb-24 px-6 md:px-12" style={{ zIndex: 10 }} id="search-results">
        <div className="max-w-7xl mx-auto">

          {/* section label */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-8 flex-shrink-0" style={{ background: "rgba(255,255,255,0.1)" }} />
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(14px, 1.8vw, 18px)",
              color: "rgba(255,255,255,0.28)",
              fontStyle: "italic",
              whiteSpace: "nowrap",
            }}>
              {searchQuery || selectedRegions.length > 0
                ? `${filteredCompanies.length} result${filteredCompanies.length !== 1 ? "s" : ""} found`
                : "All Companies"}
            </p>
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.1)" }} />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 animate-spin"
                style={{ borderColor: "rgba(255,255,255,0.1)", borderTopColor: "#10b981" }} />
            </div>
          ) : filteredCompanies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCompanies.map((company, index) => (
                <CompanyCard key={company.id} company={company} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 rounded-2xl border"
              style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <Search size={20} style={{ color: "#10b981" }} />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "#ffffff", marginBottom: "8px" }}>
                No companies found
              </h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "20px" }}>
                Try adjusting your filters or search terms.
              </p>
              <motion.button
                onClick={() => { setSearchQuery(''); setSelectedRegions([]); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm transition-all duration-300"
                style={{ borderColor: "rgba(16,185,129,0.3)", color: "#10b981", background: "rgba(16,185,129,0.06)", fontFamily: "'DM Sans', sans-serif" }}
                whileHover={{ scale: 1.04, background: "rgba(16,185,129,0.14)" }}
                whileTap={{ scale: 0.97 }}
              >
                Clear All Filters
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── SUBREGION MODAL ── */}
      <AnimatePresence>
        {showSubregionModal && activeMainRegion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(4,14,30,0.85)", backdropFilter: "blur(12px)" }}
            onClick={() => setShowSubregionModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-2xl rounded-2xl border overflow-hidden flex flex-col max-h-[85vh]"
              style={{
                background: "rgba(4,14,30,0.97)",
                borderColor: "rgba(255,255,255,0.1)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* accent bar */}
              <div className="h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #10b981, transparent)" }} />

              {/* header */}
              <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#10b981", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, marginBottom: "4px" }}>
                    Select Subregions
                  </p>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#ffffff", fontWeight: 700 }}>
                    {activeMainRegion}
                  </h3>
                </div>
                <button
                  onClick={() => setShowSubregionModal(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200"
                  style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                >
                  <X size={14} />
                </button>
              </div>

              {/* subregion grid */}
              <div className="flex-1 overflow-y-auto p-6 themed-scroll">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {/* select all */}
                  <button
                    onClick={() => handleRegionSelect(activeMainRegion)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all duration-200 text-left"
                    style={{
                      borderColor: selectedRegions.includes(activeMainRegion) ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.08)",
                      background: selectedRegions.includes(activeMainRegion) ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.03)",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "12px",
                      color: selectedRegions.includes(activeMainRegion) ? "#10b981" : "rgba(255,255,255,0.6)",
                      fontWeight: 500,
                    }}
                  >
                    <span>All of {activeMainRegion}</span>
                    {selectedRegions.includes(activeMainRegion) && <Check size={13} />}
                  </button>

                  {regionsWithSubregions[activeMainRegion]?.map((sub) => {
                    const sel = selectedRegions.includes(sub);
                    return (
                      <button
                        key={sub}
                        onClick={() => handleRegionSelect(sub)}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all duration-200 text-left"
                        style={{
                          borderColor: sel ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.08)",
                          background: sel ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.03)",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "12px",
                          color: sel ? "#10b981" : "rgba(255,255,255,0.6)",
                        }}
                      >
                        <span className="break-words">{sub}</span>
                        {sel && <Check size={13} className="flex-shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* footer */}
              <div className="px-6 py-4 border-t flex justify-end" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                <motion.button
                  onClick={() => setShowSubregionModal(false)}
                  className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
                  style={{
                    background: "#10b981",
                    color: "#ffffff",
                    fontFamily: "'DM Sans', sans-serif",
                    boxShadow: "0 0 20px rgba(16,185,129,0.3)",
                  }}
                  whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(16,185,129,0.5)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  Done
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FindCompany;
import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Menu, X, User, ChevronDown } from "lucide-react";
import AuthModal from "./AuthModal";
import ProfileDropdown from "./ProfileDropdown";
import { useAuth } from "../../contexts/AuthContext";

/* ─────────────────────────────────────────────────────────────
   MENU STRUCTURE
───────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Home", to: "/" },
  {
    label: "About",
    children: [
      { label: "Which Renewables", to: "/about#about-which-renewables" },
      { label: "Blogspot", action: "expertBlogs" },
      { label: "Meet Our Team", to: "/meet-our-team" },
      { label: "Our Expert Circle", to: "/expert-panel" },
    ],
  },
  {
    label: "Sectors",
    children: [
      { label: "Construction", to: "/construction" },
      { label: "Industrial", to: "/industrial" },
      { label: "Commercial / Retail", to: "/comercial" },
      { label: "Agriculture", to: "/agriculture" },
      { label: "Domestic", to: "/domestic" },
    ],
  },
  {
    label: "Products & Services",
    children: [
      { label: "Renewable Energy", to: "/renewable" },
      { label: "Sustainability / ESG / Net Zero", to: "/sustainable" },
      { label: "Energy Efficiency & Management", to: "/energy-management" },
      { label: "Company Wellness", to: "/company-wellness" },
      { label: "IT & Related Service", to: "/it-services" },
      { label: "Jobs & Recruitment", to: "/jobs-recruitment" },
      { label: "Finance & Funding", to: "/finance-funding" },
      { label: "Eco Friendly Building Products", to: "/eco-friendly" },
      { label: "Utility Provision & Civils", to: "/utility-civils" },
    ],
  },
  {
    label: "News & Events",
    children: [
      { label: "Today's Industry News", to: "/news-events/todays-industry-news" },
      { label: "What's Happening In Your Region", to: "/news-events/whats-happening-region" },
      { label: "TradeShows / Awards / Events", to: "/news-events/trade-shows-events" },
      { label: "Industry Webinars and Podcasts", to: "/news-events/industry-webinars" },
    ],
  },
  {
    label: "Showcase Hub",
    children: [
      { label: "Women In Renewables", to: "/showcase-hub/which-women-in-renewables" },
      { label: "Innovation Hub", to: "/showcase-hub/innovation-hub" },
      { label: "Industry Case Studies", to: "/showcase-hub/industry-case-studies" },
      { label: "Projects in Spotlight", to: "/showcase-hub/recent-completed-projects" },
      { label: "Company In Spotlight", to: "/showcase-hub/companies-in-spotlight" },
      { label: "Hall of Fame", to: "/showcase-hub/hall-of-fame" },
      { label: "Industry Awards", to: "/news-events/industry-awards" },
      { label: "Product/Service In Spotlight", to: "/showcase-hub/product-service-in-spotlight" },
    ],
  },
  { label: "Pricing", to: "/subscription-plans" },
  {
    label: "Contact",
    children: [
      { label: "Work With Us", to: "/work-with-us" },
      { label: "Contact Us", to: "/contact-us" },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────
   DROPDOWN PANEL
───────────────────────────────────────────────────────────── */
const DropdownPanel = ({ items, onAction, onClose }) => (
  <div
    className="absolute top-full left-1/2 -translate-x-1/2 z-[80]
      overflow-hidden min-w-[220px] py-2 animate-dropIn"
    style={{
      background: "rgba(4, 12, 30, 0.82)",
      backdropFilter: "blur(72px) saturate(2)",
      WebkitBackdropFilter: "blur(72px) saturate(2)",
      border: "1px solid rgba(255,255,255,0.18)",
      borderRadius: "16px",
      boxShadow: "0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(255,255,255,0.04)",
    }}
  >
    {/* thin top accent line */}
    <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

    {items.map((item) =>
      item.action ? (
        <button
          key={item.label}
          onClick={() => { onAction(item.action); onClose(); }}
          className="w-full text-left px-5 py-2.5 text-[13px] tracking-wide transition-all duration-150"
          style={{ color: "rgba(255,255,255,0.82)", fontFamily: "'DM Sans', sans-serif" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.09)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.82)"; e.currentTarget.style.background = "transparent"; }}
        >
          {item.label}
        </button>
      ) : (
        <Link
          key={item.label}
          to={item.to}
          onClick={onClose}
          className="block px-5 py-2.5 text-[13px] tracking-wide transition-all duration-150"
          style={{ color: "rgba(255,255,255,0.82)", fontFamily: "'DM Sans', sans-serif" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.09)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.82)"; e.currentTarget.style.background = "transparent"; }}
        >
          {item.label}
        </Link>
      )
    )}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   MAIN NAVBAR
───────────────────────────────────────────────────────────── */
const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef(null);

  /* scroll detection for subtle bg shift */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAction = (action) => {
    if (action === "expertBlogs") {
      navigate("/blogs", { state: { activeTab: "expert-circle" } });
    }
  };

  const openMenu = (label) => {
    clearTimeout(timeoutRef.current);
    setOpenDropdown(label);
  };

  const closeMenu = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  return (
    <>
      {/* ────── STYLE INJECTION ────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Cormorant+Garamond:wght@400;500&display=swap');

        @keyframes dropIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .animate-dropIn { animation: dropIn 0.18s ease forwards; }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.22s ease forwards; }

        .nav-link-item {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 400;
          letter-spacing: 0.03em;
          color: rgba(255,255,255,0.65);
          padding: 5px 10px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 3px;
          transition: color 0.2s, background 0.2s;
          cursor: pointer;
          background: none;
          border: none;
          white-space: nowrap;
        }
        .nav-link-item:hover, .nav-link-item.active {
          color: #fff;
          background: rgba(255,255,255,0.07);
        }
        .nav-link-item svg {
          opacity: 0.5;
          transition: opacity 0.2s, transform 0.2s;
        }
        .nav-link-item:hover svg,
        .nav-link-item.open svg {
          opacity: 1;
          transform: rotate(180deg);
        }
      `}</style>

      {/* ────── NAVBAR BAR ────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[90] transition-all duration-500
          ${scrolled
            ? "py-2 bg-white/10 backdrop-blur-3xl border-b border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
            : "py-3 md:py-4 bg-white/5 backdrop-blur-2xl border-b border-white/10"
          }`}
      >
        <div className="w-full max-w-[1440px] mx-auto px-6 flex items-center justify-between gap-6">

          {/* ── LOGO ── */}
          <Link to="/" className="flex-shrink-0 flex items-center group">
            <img src="/wr.png" alt="Logo" className="h-20 transition-opacity duration-200 group-hover:opacity-80" />
          </Link>

          {/* ── DESKTOP CENTER NAV ── */}
          <div className="hidden xl:flex items-center gap-0 flex-nowrap overflow-visible flex-1 min-w-0" style={{ scrollbarWidth: 'none' }}>
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => openMenu(item.label)}
                  onMouseLeave={closeMenu}
                >
                  <button
                    className={`nav-link-item ${openDropdown === item.label ? "open" : ""}`}
                  >
                    {item.label}
                    <ChevronDown size={24} />
                  </button>

                  {openDropdown === item.label && (
                    <DropdownPanel
                      items={item.children}
                      onAction={handleAction}
                      onClose={() => setOpenDropdown(null)}
                    />
                  )}
                </div>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    `nav-link-item ${isActive ? "active" : ""}`
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
          </div>

          {/* ── RIGHT ACTIONS ── */}
          <div className="hidden xl:flex items-center gap-3 flex-shrink-0">

            {/* Discover CTA — ghost pill */}
            <Link
              to="/find-company"
              className="hidden lg:flex items-center gap-1.5 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-[11px] lg:text-[12px] tracking-wide
                border border-white/15 text-white/55 hover:text-white hover:border-white/30
                transition-all duration-200 backdrop-blur-sm"
              style={{ fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}
            >
              <Search size={11} strokeWidth={1.5} />
              <span className="hidden xl:inline">Discover Clients</span>
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="relative px-3 lg:px-5 py-1.5 lg:py-2 rounded-full text-[11px] lg:text-[12px] font-medium tracking-wide
                  bg-emerald-500 hover:bg-emerald-400 text-white
                  shadow-[0_0_20px_rgba(52,211,153,0.35)] hover:shadow-[0_0_28px_rgba(52,211,153,0.5)]
                  transition-all duration-300 flex items-center gap-1.5 lg:gap-2"
                style={{ fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}
              >
                <span className="flex h-4 lg:h-5 w-4 lg:w-5 items-center justify-center rounded-full bg-emerald-600/90 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]">
                  <User size={9} strokeWidth={2.2} />
                </span>
                <span className="hidden lg:inline">Sign In</span>
              </button>
            )}
          </div>

          {/* ── MOBILE HAMBURGER ── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden w-8 h-8 flex items-center justify-center rounded-full
              border border-white/15 text-white/70 hover:text-white hover:border-white/30
              transition-all duration-200 backdrop-blur-sm bg-white/5"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

        </div>
      </nav>

      {/* ────── MOBILE MENU ────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col pt-24 sm:pt-28 md:pt-32
            bg-white/10 backdrop-blur-3xl border-b border-white/20 animate-slideDown"
        >
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {NAV_ITEMS.map((item) =>
                item.children ? (
                  <details key={item.label} className="group">
                    <summary
                      className="flex items-center justify-between py-3 text-[15px] text-white/80
                        hover:text-white transition-colors cursor-pointer list-none border-b border-white/15"
                    >
                      {item.label}
                      <ChevronDown size={14} className="text-white/30 group-open:rotate-180 transition-transform duration-200" />
                    </summary>
                    <div className="pl-4 pt-2 pb-3 space-y-1">
                      {item.children.map((child) =>
                        child.action ? (
                          <button
                            key={child.label}
                            onClick={() => { handleAction(child.action); setMobileOpen(false); }}
                            className="block w-full text-left py-2 text-[13px] text-white/40 hover:text-white transition-colors"
                          >
                            {child.label}
                          </button>
                        ) : (
                          <Link
                            key={child.label}
                            to={child.to}
                            onClick={() => setMobileOpen(false)}
                            className="block py-2 text-[13px] text-white/60 hover:text-white transition-colors"
                          >
                            {child.label}
                          </Link>
                        )
                      )}
                    </div>
                  </details>
                ) : (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 text-[15px] text-white/80 hover:text-white
                      transition-colors border-b border-white/15"
                  >
                    {item.label}
                  </NavLink>
                )
              )}
            </div>

            {/* Mobile action buttons */}
            <div className="mt-8 space-y-3">
              <Link
                to="/find-company"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl
                  border border-white/20 text-white/70 text-[13px] hover:text-white bg-white/5
                  hover:border-white/35 hover:bg-white/10 transition-all"
              >
                <Search size={14} /> Discover Our Clients
              </Link>

              {isAuthenticated ? (
                <Link
                  to="/profile-completion"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl
                    border border-emerald-500/40 text-emerald-400 text-[13px] hover:bg-emerald-500/10 transition-all"
                >
                  <User size={14} /> My Profile
                </Link>
              ) : (
                <button
                  onClick={() => { setMobileOpen(false); setIsAuthModalOpen(true); }}
                  className="w-full py-3 rounded-2xl bg-emerald-500 text-white text-[13px] font-medium
                    shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:bg-emerald-400 transition-all"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </>
  );
};

export default Navbar;
import React, { useState, useRef, useEffect } from 'react';
import {
  User, Settings, FileText, Briefcase, PlusCircle, LogOut,
  CreditCard, LayoutDashboard, Award, Crown, BadgeCheck
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import EditProfilePopup from './EditProfilePopup';

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const profileCompletion = typeof user?.profileCompletion === 'number' ? user.profileCompletion : 10;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ── Admin shortcut button ── */
  if (user?.role === 'admin') {
    return (
      <Link
        to="/admin/dashboard"
        title="Admin Dashboard"
        style={{
          width: "38px", height: "38px", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "#10b981",
          border: "1px solid rgba(16,185,129,0.95)",
          color: "#ffffff",
          transition: "all 0.2s",
          boxShadow: "0 0 16px rgba(16,185,129,0.35)",
          textDecoration: "none",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "#059669"; e.currentTarget.style.boxShadow = "0 0 22px rgba(16,185,129,0.45)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "#10b981"; e.currentTarget.style.boxShadow = "0 0 16px rgba(16,185,129,0.35)"; }}
      >
        <LayoutDashboard size={16} />
      </Link>
    );
  }

  const handleLogout = () => { logout(); navigate('/'); setIsOpen(false); };

  /* subscription label + colour */
  const getSubLabel = () => {
    const s = user?.subscription;
    if (!s || s === 'not_subscribed') return { label: 'Not Subscribed', rgb: "100,116,139" };
    if (s === 'free_trial')   return { label: 'Free Trial',         rgb: "245,158,11" };
    if (s === 'premium')      return { label: 'Premium Plan',       rgb: "16,185,129" };
    if (s === 'elite')        return { label: 'Elite Plan',         rgb: "139,92,246" };
    if (s === 'professional') return { label: 'Professional Plan',  rgb: "6,182,212"  };
    if (s === 'standard')     return { label: 'Standard Plan',      rgb: "59,130,246" };
    return { label: s.charAt(0).toUpperCase() + s.slice(1) + ' Plan', rgb: "16,185,129" };
  };
  const sub = getSubLabel();
  const needsUpgrade = user?.subscription === 'not_subscribed' || user?.subscription === 'free_trial';

  const menuItems = [
    { icon: Settings,   label: 'Edit Profile',        action: () => { navigate('/edit-profile'); setIsOpen(false); } },
    { icon: FileText,   label: 'Case Studies',        action: () => { navigate('/submit-case-study'); setIsOpen(false); } },
    { icon: Briefcase,  label: 'Products & Services', action: () => { navigate('/submit-product-service'); setIsOpen(false); } },
    { icon: PlusCircle, label: 'Projects',             action: () => { navigate('/submit-projects'); setIsOpen(false); } },
    { icon: Award,      label: 'Awards',               action: () => { navigate('/submit-awards'); setIsOpen(false); } },
    { icon: BadgeCheck, label: 'Certificates',         action: () => { navigate('/submit-certifications'); setIsOpen(false); } },
    { icon: CreditCard, label: 'Manage Plans',  action: () => { navigate('/manage-subscriptions'); setIsOpen(false); }, highlight: needsUpgrade },
    { icon: LogOut,     label: 'Logout',               action: handleLogout, danger: true },
  ];

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');
        .pd-menu::-webkit-scrollbar { width: 3px; }
        .pd-menu::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.3); border-radius: 99px; }
      `}</style>

      <EditProfilePopup isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />

      {/* ── Trigger button ── */}
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: "38px", height: "38px", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: isOpen ? "#059669" : "#10b981",
            border: `1px solid ${isOpen ? "rgba(5,150,105,0.95)" : "rgba(16,185,129,0.95)"}`,
            color: "#ffffff",
            cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: isOpen ? "0 0 22px rgba(16,185,129,0.45)" : "0 0 16px rgba(16,185,129,0.35)",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#059669"; e.currentTarget.style.boxShadow = "0 0 22px rgba(16,185,129,0.45)"; }}
          onMouseLeave={e => {
            if (!isOpen) {
              e.currentTarget.style.background = "#10b981";
              e.currentTarget.style.boxShadow = "0 0 16px rgba(16,185,129,0.35)";
            }
          }}
        >
          <User size={16} />
        </button>

        {/* ── Dropdown panel ── */}
        {isOpen && (
          <div
            style={{
              position: "absolute", top: "calc(100% + 10px)", right: 0,
              width: "230px", zIndex: 200,
              background: "rgba(4,14,30,0.97)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 24px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(16,185,129,0.1), inset 0 1px 0 rgba(255,255,255,0.06)",
              backdropFilter: "blur(24px)",
            }}
          >
            {/* emerald top bar */}
            <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #10b981, transparent)" }} />

            {/* ── User header ── */}
            <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {/* avatar */}
                <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <User size={14} style={{ color: "#10b981" }} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", fontWeight: 500, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {user?.companyName || 'Company Name'}
                  </p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.38)", fontWeight: 300, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {user?.email || 'user@email.com'}
                  </p>
                  {/* plan badge */}
                  <span style={{
                    display: "inline-block", marginTop: "4px",
                    padding: "1px 7px", borderRadius: "99px",
                    background: `rgba(${sub.rgb},0.1)`,
                    border: `1px solid rgba(${sub.rgb},0.3)`,
                    fontFamily: "'DM Sans', sans-serif", fontSize: "9.5px", fontWeight: 600,
                    color: `rgb(${sub.rgb})`, letterSpacing: "0.04em",
                  }}>
                    {sub.label}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Menu items ── */}
            <div className="pd-menu" style={{ padding: "6px 0", maxHeight: "320px", overflowY: "auto" }}>
              {menuItems.map((item, i) => {
                const Icon = item.icon;
                const isDividerBefore = item.danger;
                return (
                  <React.Fragment key={i}>
                    {isDividerBefore && <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />}
                    <button
                      onClick={item.action}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: "10px",
                        padding: "8px 16px", background: "none", border: "none",
                        fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", fontWeight: 400,
                        color: item.danger ? "#ef4444" : item.highlight ? "#10b981" : "rgba(255,255,255,0.65)",
                        cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = item.danger
                          ? "rgba(239,68,68,0.08)"
                          : item.highlight
                          ? "rgba(16,185,129,0.08)"
                          : "rgba(255,255,255,0.05)";
                        e.currentTarget.style.color = item.danger ? "#f87171" : item.highlight ? "#34d399" : "#fff";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "none";
                        e.currentTarget.style.color = item.danger ? "#ef4444" : item.highlight ? "#10b981" : "rgba(255,255,255,0.65)";
                      }}
                    >
                      <Icon size={13} style={{ flexShrink: 0 }} />
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {item.highlight && (
                        <span style={{ padding: "1px 6px", borderRadius: "99px", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", fontSize: "9px", color: "#10b981", fontWeight: 600, letterSpacing: "0.05em", flexShrink: 0 }}>
                          Upgrade
                        </span>
                      )}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDropdown;

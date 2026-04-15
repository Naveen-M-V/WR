import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Star, X } from "lucide-react";
import StripePaymentForm from "./StripePaymentForm";
import SubscriptionManager from "./SubscriptionManager";
import { useAuth } from "../contexts/AuthContext";
import AuthModal from "./navcontent/AuthModal";
import ScrollingBanner from "./home/ScrollingBanner";

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const PLANS = {
  monthly: [
    {
      name: "PROFESSIONAL",
      price: 400,
      earlyBirdPrice: 280,
      duration: "month",
      priceId: "price_1TMDGpEEQbrwR9DPbTclwQ11",
      description: "Comprehensive plan with essential features for growing companies in the renewable energy sector.",
      recommended: true,
      accentHex: "#10b981",
      accentRgb: "16,185,129",
      features: [
        "Company Name & Logo on Which Renewables Website",
        "Link to your Website, Social Media & Company contact details",
        "300-word blurb (overview, products, services, case studies, projects, awards, testimonials, certifications, blogs)",
        "Appear in 'Find A Company' search on WR Website",
        "Get listed within WR catalogue / directory",
        "Showcase in 3 specific categories with 3 image uploads",
        "Regions you are available to work in",
        "Access to industry-related webinars",
        "Post up to 3 image allocations to Products & Services",
        "Post up to 3 internal job vacancies per month (300 words)",
      ],
    },
    {
      name: "ELITE",
      price: 600,
      earlyBirdPrice: 420,
      duration: "month",
      priceId: "price_1TMDGpEEQbrwR9DPbTclwQ11",
      productId: "prod_UKnGJISjSAIWee",
      description: "Premium plan with all Professional features plus enhanced visibility and exclusive benefits.",
      recommended: false,
      accentHex: "#8b5cf6",
      accentRgb: "139,92,246",
      features: [
        "Includes all features from the Professional Plan",
        "600-word blurb (overview, products, services, case studies, projects, awards, testimonials, certifications, blogs)",
        "Showcase in 6 specific categories with 6 image uploads",
        "Invitation to join WR 'Expert Circle' & contribute to blog",
        "Post up to 6 image allocations to Products & Services",
        "Post up to 6 internal job vacancies per month (600 words)",
      ],
    },
  ],
  annually: [
    {
      name: "PROFESSIONAL",
      price: 4800,
      earlyBirdPrice: 3360,
      duration: "year",
      priceId: "price_1TMDGpEEQbrwR9DPbTclwQ11",
      description: "Comprehensive plan with essential features for growing companies in the renewable energy sector.",
      recommended: true,
      accentHex: "#10b981",
      accentRgb: "16,185,129",
      features: [
        "Company Name & Logo on WR Website",
        "Link to your Website, Social Media & Company contact details",
        "300-word blurb (overview, products, services, case studies, projects, awards, testimonials, certifications, blogs)",
        "Appear in 'Find A Company' search on WR Website",
        "Get listed within WR catalogue / directory",
        "Showcase in 3 specific categories with 3 image uploads",
        "Regions you are available to work in",
        "Access to industry-related webinars",
        "Post up to 3 image allocations to Products & Services",
        "Post up to 3 internal job vacancies per month (300 words)",
      ],
    },
    {
      name: "ELITE",
      price: 7200,
      earlyBirdPrice: 5040,
      duration: "year",
      priceId: "price_1TMDGpEEQbrwR9DPbTclwQ11",
      description: "Premium plan with all Professional features plus enhanced visibility and exclusive benefits.",
      recommended: false,
      accentHex: "#8b5cf6",
      accentRgb: "139,92,246",
      features: [
        "Includes all features from the Professional Plan",
        "600-word blurb (overview, products, services, case studies, projects, awards, testimonials, certifications, blogs)",
        "Showcase in 6 specific categories with 6 image uploads",
        "Invitation to join WR 'Expert Circle' & contribute to blog",
        "Post up to 6 image allocations to Products & Services",
        "Post up to 6 internal job vacancies per month (600 words)",
      ],
    },
  ],
};

const ADDONS = [
  { id: "company-spotlight",           name: "Company 'Under The Spotlight'",                                           price: 300, popular: true  },
  { id: "product-spotlight",           name: "Product or Service 'Under The Spotlight'",                                price: 300, popular: false },
  { id: "hall-of-fame",                name: "Hall Of Fame — Industry Heroes",                                           price: 300, popular: true  },
  { id: "industry-awards",             name: "Showcase your company's Award on our Industry Awards page",               price: 300, popular: false },
  { id: "case-study-showcase",         name: "Showcase your recent successful Case Study",                              price: 300, popular: false },
  { id: "completed-project-showcase",  name: "Showcase your Recently Completed Project",                                price: 300, popular: false },
  { id: "innovations-showcase",        name: "Showcase the latest Innovations in Renewable Energy & Sustainable sectors", price: 300, popular: true  },
  { id: "additional-recruitment",      name: "Additional 6 recruitment vacancies",                                       price: 300, popular: false },
];

/* ─────────────────────────────────────────────────────────────
   COUNTDOWN TIMER
───────────────────────────────────────────────────────────── */
const useCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({ days: "00", hours: "00", minutes: "00", seconds: "00" });
  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const target = new Date(now.getFullYear(), 4, 31, 23, 59, 59);
      if (now > target) target.setFullYear(target.getFullYear() + 1);
      const diff = target - now;
      if (diff <= 0) return;
      setTimeLeft({
        days:    String(Math.floor(diff / 86400000)).padStart(2, "0"),
        hours:   String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0"),
        minutes: String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"),
        seconds: String(Math.floor((diff % 60000) / 1000)).padStart(2, "0"),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);
  return timeLeft;
};

/* ─────────────────────────────────────────────────────────────
   PLAN CARD
───────────────────────────────────────────────────────────── */
const PlanCard = ({ plan, onSelect, currentPlan }) => {
  const [hovered, setHovered] = useState(false);
  const isCurrent = currentPlan === plan.name;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col"
    >
      <div
        className="relative overflow-hidden rounded-2xl border flex flex-col flex-1 transition-all duration-500"
        style={{
          borderColor: hovered || plan.recommended ? `rgba(${plan.accentRgb},0.45)` : "rgba(255,255,255,0.08)",
          background: plan.recommended
            ? `linear-gradient(145deg, rgba(${plan.accentRgb},0.1) 0%, rgba(4,14,30,0.98) 100%)`
            : "rgba(255,255,255,0.025)",
          boxShadow: hovered || plan.recommended
            ? `0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(${plan.accentRgb},0.2)`
            : "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {/* top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, ${plan.accentHex}, transparent)` }}
        />

        {plan.recommended && (
          <div
            className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1 rounded-full border"
            style={{
              borderColor: `rgba(${plan.accentRgb},0.4)`,
              background: `rgba(${plan.accentRgb},0.1)`,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "9.5px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: plan.accentHex,
            }}
          >
            <Star size={9} />
            Recommended
          </div>
        )}

        <div className="p-8 flex flex-col flex-1">
          {/* plan name */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "10px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: plan.accentHex,
            fontWeight: 600,
            marginBottom: "8px",
          }}>
            {plan.name}
          </p>

          {/* price */}
          <div className="mb-2">
            <div className="flex items-baseline gap-2 mb-1">
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 700, color: plan.accentHex }}>
                £{plan.earlyBirdPrice}
              </span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>
                / {plan.duration}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.25)", textDecoration: "line-through" }}>
                £{plan.price}
              </span>
              <span
                className="px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(239,68,68,0.12)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "9.5px",
                  color: "#ef4444",
                  fontWeight: 600,
                }}
              >
                30% OFF
              </span>
            </div>
          </div>

          {/* rule */}
          <div className="mb-5 h-px" style={{ background: `linear-gradient(90deg, ${plan.accentHex}, transparent)`, width: "40px" }} />

          {/* description */}
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, fontWeight: 300, marginBottom: "24px" }}>
            {plan.description}
          </p>

          {/* features */}
          <ul className="space-y-3 flex-1 mb-8">
            {plan.features.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <div
                  className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5"
                  style={{ background: `rgba(${plan.accentRgb},0.15)`, border: `1px solid rgba(${plan.accentRgb},0.3)` }}
                >
                  <Check size={9} style={{ color: plan.accentHex }} />
                </div>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: "rgba(255,255,255,0.6)", lineHeight: 1.65, fontWeight: 300 }}>
                  {f}
                </span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <motion.button
            onClick={() => onSelect(plan)}
            disabled={isCurrent}
            className="w-full py-3 rounded-full text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            style={{
              background: isCurrent ? "rgba(255,255,255,0.05)" : plan.accentHex,
              color: isCurrent ? "rgba(255,255,255,0.4)" : "#ffffff",
              border: isCurrent ? "1px solid rgba(255,255,255,0.1)" : "none",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: isCurrent ? "none" : `0 0 24px rgba(${plan.accentRgb},0.35)`,
              cursor: isCurrent ? "default" : "pointer",
            }}
            whileHover={!isCurrent ? { scale: 1.03, boxShadow: `0 0 36px rgba(${plan.accentRgb},0.55)` } : {}}
            whileTap={!isCurrent ? { scale: 0.97 } : {}}
          >
            {isCurrent ? "Current Plan" : "Get Started"}
            {!isCurrent && <ArrowRight size={14} />}
          </motion.button>
        </div>

        {/* ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-700"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, rgba(${plan.accentRgb},0.1), transparent 60%)`,
            opacity: hovered ? 1 : plan.recommended ? 0.5 : 0,
          }}
        />
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   ADDON CARD
───────────────────────────────────────────────────────────── */
const AddonCard = ({ addon, selected, onToggle }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onToggle(addon.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-2xl border cursor-pointer transition-all duration-300 p-5"
      style={{
        borderColor: selected ? "rgba(16,185,129,0.6)" : hovered ? "rgba(16,185,129,0.35)" : "rgba(16,185,129,0.18)",
        background: selected
          ? "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(4,14,30,0.98) 100%)"
          : "rgba(16,185,129,0.04)",
        boxShadow: selected ? "0 0 0 1px rgba(16,185,129,0.25)" : "none",
      }}
    >
      {/* accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
        style={{
          background: "linear-gradient(90deg, transparent, #10b981, transparent)",
          opacity: selected ? 1 : 0,
        }}
      />

      {addon.popular && (
        <div
          className="inline-flex items-center self-start mb-3 px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(245,158,11,0.12)",
            border: "1px solid rgba(245,158,11,0.3)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "9px",
            color: "#f59e0b",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Popular
        </div>
      )}

      <div className="flex items-start justify-between gap-3 mb-3">
        <h4
          className="font-bold text-white leading-snug flex-1"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.85rem, 1vw, 0.95rem)" }}
        >
          {addon.name}
        </h4>
        <div
          className="flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200"
          style={{
            borderColor: selected ? "#10b981" : "rgba(255,255,255,0.2)",
            background: selected ? "rgba(16,185,129,0.15)" : "transparent",
          }}
        >
          {selected && <Check size={10} style={{ color: "#10b981" }} />}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "#10b981" }}>
          £{addon.price}
        </span>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>
          per 30 days
        </span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */
const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planFilter = searchParams.get("plan"); // 'elite' or null
  const { refreshUser, isAuthenticated, user } = useAuth();
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showSubscriptionManager, setShowSubscriptionManager] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [showAddonsStep, setShowAddonsStep] = useState(false);
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [confirmedPlan, setConfirmedPlan] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAlreadySubscribedModal, setShowAlreadySubscribedModal] = useState(false);

  const timeLeft = useCountdown();
  const allPlans = PLANS[billingCycle];
  // Filter plans if query param specifies a plan (e.g., ?plan=elite for upgrades)
  const plans = planFilter 
    ? allPlans.filter(p => p.name.toLowerCase() === planFilter.toLowerCase())
    : allPlans;

  useEffect(() => {
    if (!showCongratsModal) return;
    const id = setTimeout(() => { setShowCongratsModal(false); navigate("/"); }, 5000);
    return () => clearTimeout(id);
  }, [showCongratsModal, navigate]);

  const handlePlanSelection = (plan) => {
    if (!isAuthenticated) { setShowAuthModal(true); return; }
    // Check if user already has an active subscription
    if (user?.subscription && user.subscription !== 'not_subscribed') {
      setShowAlreadySubscribedModal(true);
      return;
    }
    setSelectedPlan(plan);
    setShowAddonsStep(true);
  };

  const handleAddonToggle = (id) => {
    setSelectedAddons((prev) => prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]);
  };

  const handleProceedToPayment = () => {
    if (!selectedPlan) return;
    const addonTotal = selectedAddons.reduce((t, id) => {
      const a = ADDONS.find((x) => x.id === id);
      return t + (a ? a.price : 0);
    }, 0);
    const paymentPlan = {
      id: selectedPlan.name?.toLowerCase().replace(/\s+/g, "_"),
      name: selectedPlan.name,
      price: selectedPlan.earlyBirdPrice ?? selectedPlan.price,
      priceId: selectedPlan.priceId,
      interval: selectedPlan.duration === "year" ? "year" : "month",
      features: selectedPlan.features || [],
      addonTotal,
      selectedAddons,
      totalPrice: (selectedPlan.earlyBirdPrice ?? selectedPlan.price) + addonTotal,
    };
    setSelectedPlan(paymentPlan);
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    setCurrentPlan(selectedPlan.name);
    setConfirmedPlan(selectedPlan);
    if (refreshUser) refreshUser();
    setShowCongratsModal(true);
  };

  const addonTotal = selectedAddons.reduce((t, id) => {
    const a = ADDONS.find((x) => x.id === id);
    return t + (a ? a.price : 0);
  }, 0);

  return (
    <div className="min-h-screen text-white overflow-hidden" style={{ background: "#040e1e" }}>

      <ScrollingBanner />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');
        ::placeholder { color: rgba(255,255,255,0.25) !important; }
      `}</style>

      {/* ambient blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 w-[700px] h-[600px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(ellipse, #10b981, transparent 65%)" }} />
        <div className="absolute -bottom-40 right-1/4 w-[600px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(ellipse, #8b5cf6, transparent 65%)" }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pt-48 pb-24">

        {/* ── HEADER ── */}
        <div className="text-center mb-16">

          {/* eyebrow */}
          <div className="flex items-center gap-3 justify-center mb-6">
            <div className="h-px w-10" style={{ background: "#10b981" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.22em", color: "#10b981", textTransform: "uppercase", fontWeight: 500 }}>
              Plans & Pricing
            </span>
            <div className="h-px w-10" style={{ background: "#10b981" }} />
          </div>

          {/* early bird badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
            style={{
              borderColor: "rgba(239,68,68,0.35)",
              background: "rgba(239,68,68,0.08)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#ef4444",
            }}
          >
            🎉 Early Bird — 30% Off
          </div>

          {/* heading */}
          <h1
            className="mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5vw, 3.8rem)",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            We got the best offers{" "}
            <span style={{
              background: "linear-gradient(90deg, #10b981, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              for you
            </span>
          </h1>

          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(13px, 1.5vw, 16px)", color: "rgba(255,255,255,0.45)", maxWidth: "520px", margin: "0 auto 32px", lineHeight: 1.8, fontWeight: 300 }}>
            Get exclusive access to comprehensive company profiles, market analytics, and industry insights.
          </p>

          {/* countdown */}
          <div
            className="inline-flex items-center gap-1 rounded-2xl border p-5 mb-8"
            style={{
              borderColor: "rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.025)",
            }}
          >
            {[
              { label: "Days",    value: timeLeft.days    },
              { label: "Hours",   value: timeLeft.hours   },
              { label: "Mins",    value: timeLeft.minutes },
              { label: "Secs",    value: timeLeft.seconds },
            ].map(({ label, value }, i) => (
              <React.Fragment key={label}>
                {i > 0 && (
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "rgba(255,255,255,0.2)", margin: "0 4px" }}>:</span>
                )}
                <div className="text-center px-3">
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 700, color: "#10b981", lineHeight: 1 }}>
                    {value}
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "4px" }}>
                    {label}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* billing toggle */}
          <div className="flex items-center justify-center gap-2">
            {["monthly", "annually"].map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                className="px-6 py-2.5 rounded-full border text-sm font-medium capitalize transition-all duration-300"
                style={{
                  borderColor: billingCycle === cycle ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.1)",
                  background: billingCycle === cycle ? "rgba(16,185,129,0.1)" : "transparent",
                  color: billingCycle === cycle ? "#10b981" : "rgba(255,255,255,0.5)",
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: billingCycle === cycle ? "0 0 16px rgba(16,185,129,0.15)" : "none",
                }}
              >
                {cycle}
              </button>
            ))}
          </div>
        </div>

        {/* ── PLAN CARDS / ADDON STEP ── */}
        <AnimatePresence mode="wait">
          {!showAddonsStep ? (
            <motion.div
              key="plans"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {plans.map((plan) => (
                <PlanCard key={plan.name} plan={plan} onSelect={handlePlanSelection} currentPlan={currentPlan} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="addons"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              {/* section label */}
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-8" style={{ background: "rgba(255,255,255,0.1)" }} />
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "#ffffff", whiteSpace: "nowrap" }}>
                  Enhance with Add-ons
                </p>
                <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.1)" }} />
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {ADDONS.map((addon) => (
                  <AddonCard
                    key={addon.id}
                    addon={addon}
                    selected={selectedAddons.includes(addon.id)}
                    onToggle={handleAddonToggle}
                  />
                ))}
              </div>

              {/* summary */}
              <AnimatePresence>
                {selectedAddons.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-6"
                  >
                    <div
                      className="rounded-2xl border p-6"
                      style={{ borderColor: "rgba(16,185,129,0.2)", background: "rgba(16,185,129,0.05)" }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-px"
                        style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.4), transparent)" }} />
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#10b981", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, marginBottom: "12px" }}>
                        Selected Add-ons
                      </p>
                      <div className="space-y-2 mb-4">
                        {selectedAddons.map((id) => {
                          const a = ADDONS.find((x) => x.id === id);
                          return a ? (
                            <div key={id} className="flex justify-between">
                              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: "rgba(255,255,255,0.6)", fontWeight: 300 }}>{a.name}</span>
                              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: "rgba(255,255,255,0.5)" }}>£{a.price}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                      <div className="flex justify-between pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#ffffff", fontWeight: 500 }}>Add-ons Total</span>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#10b981", fontWeight: 700 }}>£{addonTotal}/mo</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* confirm row */}
              <div
                className="rounded-2xl border p-6 text-center"
                style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
              >
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.6)", marginBottom: "20px", fontWeight: 300 }}>
                  You selected the{" "}
                  <span style={{ color: "#10b981", fontWeight: 600 }}>{selectedPlan?.name}</span> plan
                  {selectedAddons.length > 0 && (
                    <> with <span style={{ color: "#10b981", fontWeight: 600 }}>{selectedAddons.length}</span> add-on{selectedAddons.length > 1 ? "s" : ""}</>
                  )}
                </p>

                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <button
                    onClick={() => setShowAddonsStep(false)}
                    className="px-6 py-2.5 rounded-full border text-sm transition-all duration-200"
                    style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                  >
                    ← Back to Plans
                  </button>

                  <motion.button
                    onClick={handleProceedToPayment}
                    className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full text-sm font-semibold"
                    style={{ background: "#10b981", color: "#ffffff", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 0 24px rgba(16,185,129,0.35)" }}
                    whileHover={{ scale: 1.04, boxShadow: "0 0 36px rgba(16,185,129,0.55)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Proceed to Payment
                    <ArrowRight size={14} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {showPaymentForm && selectedPlan && (
          <StripePaymentForm
            selectedPlan={selectedPlan}
            onClose={() => setShowPaymentForm(false)}
            onSuccess={handlePaymentSuccess}
            onError={(e) => console.error(e)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSubscriptionManager && <SubscriptionManager onClose={() => setShowSubscriptionManager(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </AnimatePresence>

      {/* ── ALREADY SUBSCRIBED MODAL ── */}
      <AnimatePresence>
        {showAlreadySubscribedModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(4,14,30,0.9)", backdropFilter: "blur(14px)" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-md rounded-2xl border overflow-hidden text-center"
              style={{
                background: "rgba(4,14,30,0.97)",
                borderColor: "rgba(245,158,11,0.25)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,158,11,0.15)",
              }}
            >
              <div className="h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #f59e0b, transparent)" }} />

              <div className="p-10">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)" }}
                >
                  <Star size={28} style={{ color: "#f59e0b" }} />
                </div>

                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: "#ffffff", marginBottom: "8px" }}>
                  You're Already Subscribed
                </h2>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontWeight: 300, marginBottom: "24px" }}>
                  You currently have an active <span style={{ color: "#f59e0b", fontWeight: 600 }}>{user?.subscription}</span> subscription.
                </p>

                <div
                  className="rounded-xl p-4 mb-6 text-left"
                  style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)" }}
                >
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontWeight: 300 }}>
                    To upgrade or manage your current plan, please visit your account settings or contact our support team.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <motion.button
                    onClick={() => setShowAlreadySubscribedModal(false)}
                    className="w-full py-3 rounded-full text-sm font-semibold"
                    style={{ background: "#f59e0b", color: "#ffffff", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 0 24px rgba(245,158,11,0.35)" }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Got It
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CONGRATS MODAL ── */}
      <AnimatePresence>
        {showCongratsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(4,14,30,0.9)", backdropFilter: "blur(14px)" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-md rounded-2xl border overflow-hidden text-center"
              style={{
                background: "rgba(4,14,30,0.97)",
                borderColor: "rgba(16,185,129,0.25)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(16,185,129,0.15)",
              }}
            >
              <div className="h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #10b981, transparent)" }} />

              <div className="p-10">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)" }}
                >
                  <Check size={28} style={{ color: "#10b981" }} />
                </div>

                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: "#ffffff", marginBottom: "8px" }}>
                  Congratulations!
                </h2>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontWeight: 300, marginBottom: "24px" }}>
                  You've successfully subscribed to the{" "}
                  <span style={{ color: "#10b981", fontWeight: 600 }}>{confirmedPlan?.name}</span> plan.
                </p>

                <div
                  className="rounded-xl p-4 mb-6 text-left"
                  style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)" }}
                >
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontWeight: 300 }}>
                    {confirmedPlan?.name?.toUpperCase() === "ELITE"
                      ? "Welcome to the Elite tier! You've unlocked our premium suite of features for maximum impact."
                      : "Welcome to the Professional tier! You now have access to enhanced visibility and growth tools."}
                  </p>
                </div>

                <motion.button
                  onClick={() => { setShowCongratsModal(false); navigate("/"); }}
                  className="w-full py-3 rounded-full text-sm font-semibold"
                  style={{ background: "#10b981", color: "#ffffff", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 0 24px rgba(16,185,129,0.35)" }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Go to Home
                </motion.button>

                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10.5px", color: "rgba(255,255,255,0.2)", marginTop: "12px" }}>
                  Redirecting automatically in 5 seconds…
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubscriptionPlans;
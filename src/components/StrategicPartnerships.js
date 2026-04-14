import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Handshake, TrendingUp, Users, Zap, Globe, Award } from "lucide-react";
import ScrollingBanner from "./home/ScrollingBanner";

const partnershipCategories = [
  {
    id: "energy-sector",
    title: "Energy Sector Partners",
    description: "Leading renewable energy companies and solution providers",
    icon: Zap,
    color: {
      gradient: "from-emerald-600 via-green-600 to-teal-600",
      light: "from-emerald-500/20 via-green-500/20 to-teal-500/20",
      border: "border-emerald-400/50",
      glow: "rgba(16, 185, 129, 0.6)",
      mesh: "radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.3), transparent 50%)",
    },
    partners: [
      {
        name: "Renewable Energy Solutions Ltd",
        category: "Solar & Wind Integration",
        description: "Specializing in large-scale renewable installations",
        benefits: ["Technical support", "Co-marketing", "Revenue sharing"],
      },
      {
        name: "Green Grid Technologies",
        category: "Energy Storage",
        description: "Advanced battery storage and grid management",
        benefits: ["Joint ventures", "Technology exchange", "Market expansion"],
      },
      {
        name: "EcoTech Innovations",
        category: "Smart Grid Solutions",
        description: "IoT and AI-powered energy management",
        benefits: ["Integration partnerships", "Data sharing", "Innovation labs"],
      },
      {
        name: "Sustainable Power Systems",
        category: "Hybrid Solutions",
        description: "Integrated renewable and traditional energy",
        benefits: ["Consulting", "Project collaboration", "Training programs"],
      },
    ],
  },
  {
    id: "technology-partners",
    title: "Technology & Innovation Partners",
    description: "Digital transformation and software solution providers",
    icon: Globe,
    color: {
      gradient: "from-blue-600 via-cyan-600 to-sky-600",
      light: "from-blue-500/20 via-cyan-500/20 to-sky-500/20",
      border: "border-blue-400/50",
      glow: "rgba(59, 130, 246, 0.6)",
      mesh: "radial-gradient(circle at 80% 30%, rgba(59, 130, 246, 0.3), transparent 50%)",
    },
    partners: [
      {
        name: "CloudSync Analytics",
        category: "Data Analytics Platform",
        description: "Real-time energy monitoring and reporting",
        benefits: ["API integration", "White-label solutions", "Support"],
      },
      {
        name: "AI Energy Systems",
        category: "Machine Learning Solutions",
        description: "Predictive analytics for energy optimization",
        benefits: ["Custom development", "Training", "Licensing"],
      },
      {
        name: "Digital Transformation Hub",
        category: "Software Development",
        description: "Custom applications and digital platforms",
        benefits: ["Development services", "Maintenance", "Upgrades"],
      },
      {
        name: "Cyber Security Pro",
        category: "Security Solutions",
        description: "Enterprise-grade security for energy systems",
        benefits: ["Compliance support", "Audits", "Incident response"],
      },
    ],
  },
  {
    id: "industry-bodies",
    title: "Industry Bodies & Associations",
    description: "Collaborative partnerships with regulatory and industry organizations",
    icon: Award,
    color: {
      gradient: "from-amber-600 via-orange-600 to-rose-600",
      light: "from-amber-500/20 via-orange-500/20 to-rose-500/20",
      border: "border-amber-400/50",
      glow: "rgba(217, 119, 6, 0.6)",
      mesh: "radial-gradient(circle at 50% 80%, rgba(217, 119, 6, 0.3), transparent 50%)",
    },
    partners: [
      {
        name: "UK Renewable Energy Association",
        category: "Industry Advocacy",
        description: "Promoting renewable energy policies and standards",
        benefits: ["Advocacy support", "Industry events", "Policy input"],
      },
      {
        name: "International Energy Council",
        category: "Global Standards",
        description: "Setting international renewable energy standards",
        benefits: ["Certification", "Compliance", "Recognition"],
      },
      {
        name: "Green Business Forum",
        category: "Sustainability Initiatives",
        description: "Driving sustainable business practices",
        benefits: ["Networking", "Workshops", "Certifications"],
      },
      {
        name: "Engineering Excellence Institute",
        category: "Technical Standards",
        description: "Engineering standards and best practices",
        benefits: ["Training programs", "Certification", "Resources"],
      },
    ],
  },
  {
    id: "financial-partners",
    title: "Financial & Investment Partners",
    description: "Funding, investment, and financial service providers",
    icon: TrendingUp,
    color: {
      gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
      light: "from-violet-500/20 via-purple-500/20 to-fuchsia-500/20",
      border: "border-violet-400/50",
      glow: "rgba(139, 92, 246, 0.6)",
      mesh: "radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.3), transparent 50%)",
    },
    partners: [
      {
        name: "Green Finance Capital",
        category: "Investment Funding",
        description: "Sustainable investment and venture capital",
        benefits: ["Funding access", "Advisory", "Network"],
      },
      {
        name: "Renewable Energy Bank",
        category: "Project Financing",
        description: "Specialized financing for renewable projects",
        benefits: ["Loan programs", "Guarantees", "Consulting"],
      },
      {
        name: "Impact Investment Group",
        category: "ESG Investing",
        description: "Environmental, social, and governance investing",
        benefits: ["Capital access", "ESG reporting", "Impact metrics"],
      },
      {
        name: "Insurance & Risk Solutions",
        category: "Risk Management",
        description: "Specialized insurance for renewable projects",
        benefits: ["Coverage", "Risk assessment", "Claims support"],
      },
    ],
  },
];

const PartnerCard = ({ partner, categoryColor, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      <div
        className={`relative overflow-hidden rounded-2xl border ${categoryColor.border} bg-gradient-to-br ${categoryColor.light} backdrop-blur-xl p-6 transition-all duration-500 ${
          isHovered ? "shadow-2xl -translate-y-2" : "shadow-lg"
        }`}
        style={{
          background: `linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.5) 100%), ${categoryColor.light}`,
        }}
      >
        {/* Mesh gradient background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: categoryColor.mesh }}
        />

        {/* Animated glow on hover */}
        <motion.div
          className="absolute -inset-1 rounded-2xl opacity-0"
          style={{
            background: `radial-gradient(circle, ${categoryColor.glow}, transparent 70%)`,
          }}
          animate={{ opacity: isHovered ? 0.3 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Floating accent circles */}
        <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/5 blur-2xl group-hover:translate-y-1 group-hover:translate-x-1 transition-transform duration-700" />
        <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-white/5 blur-2xl group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform duration-700" />

        {/* Content */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h4 className="text-lg font-bold text-slate-50 leading-tight">
                {partner.name}
              </h4>
              <p className="text-xs font-medium text-slate-300/80 mt-1">
                {partner.category}
              </p>
            </div>
            <motion.div
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 0.6 }}
              className="flex-shrink-0"
            >
              <Handshake className="w-5 h-5 text-emerald-400" />
            </motion.div>
          </div>

          <p className="text-sm text-slate-200/90 leading-relaxed">
            {partner.description}
          </p>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              height: isHovered ? "auto" : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-3 border-t border-white/10 space-y-2">
              {partner.benefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-2 text-xs text-emerald-300"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {benefit}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full mt-3 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border border-emerald-400/50 text-xs font-semibold text-emerald-50 hover:from-emerald-500/50 hover:to-teal-500/50 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            Learn More
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const CategorySection = ({ category, index }) => {
  const [isExpanded, setIsExpanded] = useState(index === 0);
  const Icon = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="relative"
    >
      {/* Category Header */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full relative overflow-hidden rounded-2xl border transition-all duration-500 p-6 text-left group ${
          isExpanded
            ? `${category.color.border} shadow-2xl`
            : `${category.color.border} shadow-lg hover:shadow-xl`
        }`}
        style={{
          background: isExpanded
            ? `linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.6) 100%), linear-gradient(135deg, ${category.color.light})`
            : `linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.4) 100%), linear-gradient(135deg, ${category.color.light})`,
        }}
      >
        {/* Mesh gradient */}
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: category.color.mesh }}
        />

        {/* Animated glow */}
        <motion.div
          className="absolute -inset-1 rounded-2xl opacity-0"
          style={{
            background: `radial-gradient(circle, ${category.color.glow}, transparent 70%)`,
          }}
          animate={{ opacity: isExpanded ? 0.2 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Floating accents */}
        <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-white/5 blur-3xl group-hover:translate-y-1 group-hover:translate-x-1 transition-transform duration-700" />
        <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-white/5 blur-3xl group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform duration-700" />

        {/* Content */}
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <motion.div
              animate={{ rotate: isExpanded ? 360 : 0 }}
              transition={{ duration: 0.6 }}
              className="flex-shrink-0"
            >
              <div className="p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
                <Icon className="w-6 h-6 text-emerald-300" />
              </div>
            </motion.div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-50 mb-1">
                {category.title}
              </h3>
              <p className="text-sm text-slate-300/80">
                {category.description}
              </p>
            </div>
          </div>

          {/* Expand/Collapse indicator */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0"
          >
            <div className="p-2 rounded-lg bg-white/10 border border-white/20">
              <svg
                className="w-5 h-5 text-emerald-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </motion.div>
        </div>
      </motion.button>

      {/* Partners Grid */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {category.partners.map((partner, idx) => (
                <PartnerCard
                  key={partner.name}
                  partner={partner}
                  categoryColor={category.color}
                  index={idx}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const StrategicPartnerships = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#051f46] via-[#0a2d5a] to-[#051f46] text-slate-100 pb-24 relative overflow-hidden">
      <ScrollingBanner />

      {/* Hero Section */}
      <div className="shadow-lg shadow-black/30 relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] flex items-center justify-center text-center text-white overflow-hidden">
        <img
          src="/about.jpg"
          alt="Strategic Partnerships"
          className="absolute inset-0 w-full h-full object-cover brightness-75 shadow-inner"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight"
          >
             Save Energy – Get a Quote
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed"
          >
          Looking for an outline price for your project. Obtain a NON OBLIGATORY quotation from  companies here who specialise in getting you a competitive outline cost for your project.          </motion.p>
        </div>
      </div>

      {/* Global animated background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 -left-40 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl animate-pulse" />
        <div className="absolute top-20 -right-32 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-72 w-[90%] bg-gradient-to-t from-emerald-500/15 via-transparent to-transparent blur-3xl" />
        <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(34,197,94,0.18),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,23,42,0.6)_0%,rgba(15,23,42,0.2)_40%,rgba(15,23,42,0.6)_100%),radial-gradient(circle_at_top,_rgba(148,163,184,0.15),transparent_60%)] mix-blend-soft-light" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 mt-10"
          >
            <div className="relative overflow-hidden rounded-3xl border border-emerald-400/50 bg-gradient-to-br from-emerald-900/30 via-slate-900/20 to-blue-900/30 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl">
              {/* Mesh gradient */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background:
                    "radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.3), transparent 50%)",
                }}
              />

              {/* Floating accents */}
              <div className="absolute -top-16 right-10 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
              <div className="absolute bottom-0 left-4 h-24 w-24 rounded-full bg-white/5 blur-2xl" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-emerald-400" />
                  <h2 className="text-2xl font-bold text-slate-50">
                    Our Partnership Network
                  </h2>
                </div>
                <p className="text-slate-200/90 leading-relaxed max-w-3xl">
                  Which Renewables has teamed up in strategic partnerships with a number of reputable companies offering services and solutions related to the green economy sector. In most cases, we have negotiated a trade discount on your behalf, to keep an eye out for our promotion codes! Please note: in some cases, which renewables.com also earn a small commission.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Partnership Categories */}
          <div className="space-y-6 mb-16">
            {partnershipCategories.map((category, index) => (
              <CategorySection
                key={category.id}
                category={category}
                index={index}
              />
            ))}
          </div>

          {/* Call to Action Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-emerald-400/50 bg-gradient-to-br from-emerald-900/40 via-slate-900/30 to-teal-900/40 backdrop-blur-2xl p-8 sm:p-12 shadow-2xl"
          >
            {/* Mesh gradient */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "radial-gradient(circle at 80% 30%, rgba(16, 185, 129, 0.4), transparent 50%)",
              }}
            />

            {/* Floating accents */}
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-white/5 blur-3xl" />

            <div className="relative z-10 text-center space-y-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-50">
                Become a Strategic Partner
              </h3>
              <p className="text-slate-200/90 max-w-2xl mx-auto leading-relaxed">
                Are you interested in partnering with Which Renewables? We're always looking for innovative companies and organizations that share our commitment to advancing renewable energy solutions.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-50 font-semibold shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_40px_rgba(16,185,129,0.7)] transition-all duration-300"
              >
                <Handshake className="w-5 h-5" />
                Get in Touch
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StrategicPartnerships;

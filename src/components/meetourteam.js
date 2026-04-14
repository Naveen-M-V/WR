import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail } from 'lucide-react';

const ACCENT_COLORS = [
  { hex: "#10b981", rgb: "16,185,129" },
  { hex: "#06b6d4", rgb: "6,182,212"  },
  { hex: "#8b5cf6", rgb: "139,92,246" },
  { hex: "#f59e0b", rgb: "245,158,11" },
  { hex: "#ec4899", rgb: "236,72,153" },
  { hex: "#3b82f6", rgb: "59,130,246" },
  { hex: "#14b8a6", rgb: "20,184,166" },
];

const teamMembers = [
  {
    name: "Frank Delargy",
    position: "Managing Director",
    email: "frank.delargy@whichrenewables.com",
    linkedin: "https://www.linkedin.com/in/frank-delargy",
    image: "/Frank Delargy Headshot.jpg",
    description: "An experienced media savvy operator with director experience across both Media and Renewable Energy sectors, Frank has been involved in all aspects of developing the Which Renewables concept from design to market delivery. \n\nThat vision was straightforward – (1) companies exhibiting at expensive trade exhibitions would benefit by having access to an industry specific digital hub that presented their products and services 365 days a year without the limitations of time or geography…and (2) a hub where companies bringing innovative products and solutions to the industry would have a reputable platform to demonstrate and showcase their wares to industry professionals, project managers, sustainability heads and procurement officers in both public and private sectors. \n\nFrank oversees all aspects of business performance, especially front facing roles such as building and maintaining client relationships, overseeing strategic partnerships/collaborations and managing client relationships.",
  },
  {
    name: "John Kennedy",
    position: "Head Of Sustainability and ESG",
    email: "info@kennedycarbon.com",
    linkedin: "https://www.linkedin.com/in/john-kennedy-143761125/",
    image: "/john.jpeg",
    description: "John Kennedy heads up Sustainability and ESG for Which Renewable Solutions Ltd. John is an experienced Director / Manager, Specialising in Net Zero Carbon, Energy Management and Sustainability complemented with significant Operational, Budgetary & HSE delivery at Group Level including 20+ years in Sustainability & Carbon management in Concrete / Precast, Transport, Farming & Food & Drink Sector UK & EU.\n\nWork experience began with a three-year stint at Coca Cola HQ (Lisburn NI) followed in 2009 by a six-year stint at Moy Park (Craigavon) with overall group responsibility for energy management and Head of sustainability.\n\nHe has extensive experience across Net Zero, ESG and sustainability management consultancy. In 2025 John independently completed ISO 14064-1 – carbon accounting and inventory quantifying and reporting greenhouse gas emissions and removals at organisational level.",
  },
  {
    name: "Syed Shahab Ahmed Syed",
    position: "Head Of IT",
    email: "syed.shahab.ahmed@vitrux.co.uk",
    linkedin: "https://www.linkedin.com/in/syed-shahab-ahmed-syed-ba87519",
    image: "/shahab headshot.jpeg",
    description: "Syed graduated as a Bachelor of Computer Applications in 2013. He worked for Accenture for 13 years in a variety of roles including Quality assurance, IT Service delivery manager, desk manager and all aspects of data management security and compliance.\n\nSyed is currently the principal of Vitrux Shield, a consortium of high-performance specialists dedicated to providing best in class managed IT solutions, cloud services, cyber security, software development, CAD and digital marketing services.\n\nSyed and his team were responsible for building our website, and ongoing, for maintaining its client engagement functions, embracing performance, security and ensuring full compliance across industry regulations.",
  },
  {
    name: "Surwat Banu",
    position: "Website Co-Ordinator & Content Management",
    email: "Support@whichrenewables.com",
    linkedin: "https://www.linkedin.com/in/surwat-banu-160420210/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3Bj7iyefJwRly6MdG7hxGaLQ%3D%3D",
    image: "/survat.jpeg",
    description: "Surwat is part of Vitrux Shield IT Management, a consortium of highly qualified and experienced IT professionals who have been involved in the design and build of Which Renewables.\n\nIn conjunction with Syed, principal of Vitrux Shield, and Frank from Which Renewable Solutions Ltd, Surwat provides the day-to-day website management function, including prioritizing client relations and communications, as well as overseeing and managing content inwards and outwards.\n\nSurwat speaks fluently in five languages and is highly versatile and experienced across all aspects of website function and performance. Surwat can be contacted directly at support@whichrenewables.com",
  },
  {
    name: "Helen Charteris",
    position: "Chairperson Expert Circle & Which Women In Renewables",
    email: "helen@whichrenewables.com",
    linkedin: "https://www.linkedin.com/in/helencharteris/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BdOHazZ4zQ7C4Qfs%2FVqoHwg%3D%3D",
    image: "/helen.jpeg",
    description: "Helen Charteris is a globally recognised leader in executive search, with over 30 years of experience placing senior talent across Energy, Utilities, Power, and Sustainability sectors. Her international career spans Europe, the Middle East, Asia, and the Americas. Helen voluntarily and independently chairs our Which Women in Renewables & Expert Circle Groups.\n\nHelen has been an active member and career adviser for members of the Women's Engineering Society (WES) since 2007. A special adviser to the CIGRE UK Women's Network, Helen's work has empowered countless women to rise to senior leadership roles, whilst her thought leadership includes speaking at Westminster on renewable energy skills shortages and receiving the prestigious Gillian Skinner Award for her contributions to engineering recruitment.\n\nContact Helen directly for tailored career advice, high impact recruitment strategies for your company, or if you would like to join either Which Women In Renewables or Expert Circle.",
  },
  {
    name: "Ruairi Dougal",
    position: "Company Accountant – Head Of Finance",
    email: "ruairi@dougoldpartners.com",
    linkedin: "https://www.linkedin.com/in/ruairi-dougal-a91b6671/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B5oSdHISZT5SWd%2FqmA6uWEA%3D%3D",
    image: "/rouri.jpeg",
    description: "Ruairi has almost 20 years' experience providing a full suite of corporate finance and financial due diligence support to a wide range of clients across the UK & Ireland. Providing multi-faceted transactional advice on both the buy side and the sell side to corporate and mid-tier private equity accounts and VC funds in London.\n\nHeld senior roles in EY and PwC's transactions and deals teams, Ruairi branched out with his brother Kyle to set up Dougald Partners which provides specialist counsel and service to a wide range of clients, from smaller owner managed businesses to private equity houses and larger corporations.\n\nRuairi oversees and manages all aspects relating to Which Renewable Solutions Ltd, owners of WhichRenewables.com",
  },
];

/* ─────────────────────────────────────────────────────────────
   LINKEDIN SVG
───────────────────────────────────────────────────────────── */
const LinkedInIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   MEMBER CARD
───────────────────────────────────────────────────────────── */
const MemberCard = ({ member, index, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="cursor-pointer h-full"
    >
      <div
        className="relative overflow-hidden rounded-2xl border flex flex-col h-full transition-all duration-500"
        style={{
          borderColor: hovered ? `rgba(${accent.rgb},0.4)` : "rgba(255,255,255,0.07)",
          background: hovered
            ? `linear-gradient(145deg, rgba(${accent.rgb},0.08) 0%, rgba(4,14,30,0.98) 100%)`
            : "rgba(255,255,255,0.025)",
          boxShadow: hovered
            ? `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(${accent.rgb},0.2)`
            : "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >

        {/* photo */}
        <div className="relative overflow-hidden flex-shrink-0" style={{ height: "260px" }}>
          <motion.img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 15%" }}
            animate={{ scale: hovered ? 1.04 : 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent 55%, rgba(4,14,30,0.97) 100%)" }}
          />
        </div>

        {/* content */}
        <div className="flex flex-col flex-1 px-5 py-4">
          <h3
            className="font-bold text-white leading-snug mb-1"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)" }}
          >
            {member.name}
          </h3>

          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10.5px", color: accent.hex, fontWeight: 500, letterSpacing: "0.04em", marginBottom: "12px" }}>
            {member.position}
          </p>

          {/* accent rule */}
          <div
            className="mb-3 h-px transition-all duration-500"
            style={{
              background: `linear-gradient(90deg, ${accent.hex}, transparent)`,
              width: hovered ? "44px" : "20px",
            }}
          />

          {/* excerpt — first paragraph only */}
          <p
            className="line-clamp-3 flex-1 mb-4"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              color: "rgba(255,255,255,0.48)",
              lineHeight: 1.65,
              fontWeight: 300,
            }}
          >
            {member.description.split('\n').filter(p => p.trim())[0]}
          </p>

          {/* cta */}
          <div
            className="inline-flex items-center gap-1 text-xs font-medium mt-auto transition-all duration-200"
            style={{ color: accent.hex, fontFamily: "'DM Sans', sans-serif" }}
          >
            View Profile →
          </div>
        </div>

        {/* ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-700"
          style={{
            background: `radial-gradient(ellipse at 50% 100%, rgba(${accent.rgb},0.1), transparent 60%)`,
            opacity: hovered ? 1 : 0,
          }}
        />
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MEMBER MODAL
   z-[200] keeps it above navbar (z-40) and ScrollingBanner
───────────────────────────────────────────────────────────── */
const MemberModal = ({ member, onClose }) => {
  const index = teamMembers.findIndex(m => m.name === member.name);
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];
  const paragraphs = member.description.split('\n').filter(p => p.trim());

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(4,14,30,0.9)", backdropFilter: "blur(16px)", padding: "150px 16px 24px" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full rounded-2xl border overflow-hidden flex flex-col sm:flex-row"
        style={{
          maxWidth: "760px",
          maxHeight: "calc(100vh - 140px)",
          background: "rgba(4,14,30,0.98)",
          borderColor: `rgba(${accent.rgb},0.3)`,
          boxShadow: `0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(${accent.rgb},0.15)`,
        }}
      >
        {/* top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] z-10 flex-shrink-0"
          style={{ background: `linear-gradient(90deg, transparent, ${accent.hex}, transparent)` }} />

        {/* close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200"
          style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(4,14,30,0.8)", color: "rgba(255,255,255,0.6)" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = `rgba(${accent.rgb},0.55)`; e.currentTarget.style.color = accent.hex; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
        >
          <X size={14} />
        </button>

        {/* ── LEFT: large photo panel ── */}
        <div
          className="flex-shrink-0 relative overflow-hidden"
          style={{ width: "clamp(180px, 35%, 260px)", minHeight: "320px" }}
        >
          <img
            src={member.image}
            alt={member.name}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "center 10%" }}
          />
          {/* right fade into content */}
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to right, transparent 60%, rgba(4,14,30,0.98) 100%)" }} />
          {/* bottom fade */}
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent 60%, rgba(4,14,30,0.6) 100%)" }} />
        </div>

        {/* ── RIGHT: scrollable content ── */}
        <div
          className="flex-1 overflow-y-auto px-6 py-6"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: `rgba(${accent.rgb},0.4) rgba(255,255,255,0.02)`,
          }}
        >
          {/* position pill */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border mb-4"
            style={{
              borderColor: `rgba(${accent.rgb},0.4)`,
              background: `rgba(${accent.rgb},0.1)`,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "9.5px",
              fontWeight: 600,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: accent.hex,
            }}
          >
            {member.position}
          </div>

          {/* name */}
          <h2
            className="font-bold text-white mb-3"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.2rem, 2vw, 1.5rem)", letterSpacing: "-0.01em", lineHeight: 1.15 }}
          >
            {member.name}
          </h2>

          {/* rule */}
          <div className="mb-4 h-px w-10"
            style={{ background: `linear-gradient(90deg, ${accent.hex}, transparent)` }} />

          {/* paragraphs */}
          <div className="space-y-3 mb-6">
            {paragraphs.map((para, i) => (
              <p key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, fontWeight: 300 }}>
                {para}
              </p>
            ))}
          </div>

          {/* contact buttons */}
          <div className="flex flex-wrap gap-2 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
            {member.email && (
              <a href={`mailto:${member.email}`}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-medium transition-all duration-200"
                style={{ borderColor: `rgba(${accent.rgb},0.3)`, background: `rgba(${accent.rgb},0.07)`, color: accent.hex, fontFamily: "'DM Sans', sans-serif", textDecoration: "none" }}
                onMouseEnter={(e) => e.currentTarget.style.background = `rgba(${accent.rgb},0.17)`}
                onMouseLeave={(e) => e.currentTarget.style.background = `rgba(${accent.rgb},0.07)`}
              >
                <Mail size={11} />
                {member.email}
              </a>
            )}
            {member.linkedin && (
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-medium transition-all duration-200"
                style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif", textDecoration: "none" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
              >
                <LinkedInIcon size={11} />
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SECTION
───────────────────────────────────────────────────────────── */
const MeetOurTeam = () => {
  const [selectedMember, setSelectedMember] = useState(null);

  // SR#320 - Lock body scroll when modal open
  React.useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedMember]);

  return (
    <section id="meet-our-team" className="relative overflow-hidden">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">

        {/* ── GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {teamMembers.map((member, index) => (
            <div key={index} className="h-full">
              <MemberCard
                member={member}
                index={index}
                onClick={() => setSelectedMember(member)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── MODAL ── z-[200] sits above navbar (z-40) and ScrollingBanner */}
      <AnimatePresence>
        {selectedMember && (
          <MemberModal
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default MeetOurTeam;
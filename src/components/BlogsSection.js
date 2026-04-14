import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Search, Sparkles, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import ScrollingBanner from './home/ScrollingBanner';
import { getContent } from "../utils/contentAPI";


const BlogsSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("expert-circle");
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdowns, setOpenDropdowns] = useState({});
  const filtersRef = useRef(null);
  const [showExpertForm, setShowExpertForm] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [formData, setFormData] = useState({
    contactName: "",
    companyName: "",
    email: "",
    phone: "",
    expertise: "",
    availability: "",
    contactMethod: "email",
    gdprConsent: false,
  });

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  // Blog tabs data
  const blogTabs = [
    {
      id: "expert-circle",
      label: "Expert Circle Blogs",
      color: "from-emerald-600 to-teal-600",
      description: "A curated hub of thought leadership, analysis, and industry experience from some of the leading experts within UK & Ireland's renewable sector.",
      fullDescription: "Welcome to the Expert Circle — where industry leaders and innovators share insights, opinions, and ideas. Each blog is written by professionals who have lived the challenges and helps to shape a greener future. Dive in to explore the latest trends, insights, and actionable advice from the sector's most respected voices.",
      disclaimer: "Disclaimer: The views, insights, and opinions expressed in the Expert Circle Blog are those of the individual contributors.",
    },
    {
      id: "which-women",
      label: "Which Women in Renewables Blogspot",
      color: "from-emerald-500 to-green-600",
      description: "Which Women In Renewables Blogspot  Each blog is written by women who have faced the challenges, led the change, and shaped the future of the industry. Stay informed on sector trends, and gain inspiration from the women whom lead from the front - transforming the green sector and leaving a lasting legacy.",
      fullDescription: "Disclaimer: The views, insights, and opinions expressed in the Which Women in Renewables Blogspot are those of the individual contributors",
    },
    {
      id: "which-renewables",
      label: "Which Renewables Invitational Blogs",
      color: "from-teal-600 to-emerald-700",
      description: "Which Renewables Blogs– We invite insight opinion and wise counsel from clients and individuals currently shaping the future of renewable energy.",
      fullDescription: "Welcome to the Which Renewables Invitational Blogs – A curated space where our selected partners share their expertise, innovations, and on-ground experiences. Learn from the experts. Dive deep into the latest trends, insights, and actionable advice from the industry's leading voices.",
      disclaimer: " Disclaimer:  The views, insights, and opinions expressed in the Which Renewables Invitational Blogs are those of the individual contributors.",
    },
  ];

  const currentTab = blogTabs.find((tab) => tab.id === activeTab);

  // Navigation handlers
  const handleExpertCircleNavigation = () => {
    if (location.pathname !== '/blogs') {
      navigate('/blogs', { state: { activeTab: 'expert-circle' } });
    } else {
      setActiveTab('expert-circle');
    }
  };

  const navigateToBlogsPage = () => {
    navigate('/blogs', { state: { activeTab: activeTab } });
  };

  // Handle navigation state to set active tab and selected blog
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
    if (location.state?.selectedBlog) {
      setSelectedBlog(location.state.selectedBlog);
    }
  }, [location.state]);

  const [blogsData, setBlogsData] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const items = await getContent('blogs');
        const mapped = Array.isArray(items) ? items.map(b => ({
          id: b.id,
          title: b.title || '',
          author: b.author || '',
          companyName: b.companyName || '',
          sectors: b.sectors || [],
          productsServices: b.productsServices || [],
          date: b.date || '',
          category: b.category || '',
          featured: b.featured,
          image: b.image || '',
          content: b.content || '',
          blogUrl: b.blogUrl || ''
        })) : [];
        if (mounted) setBlogsData(mapped);
      } catch {
        if (mounted) setBlogsData([]);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const handlePointerDown = (e) => {
      if (!filtersRef.current) return;
      if (filtersRef.current.contains(e.target)) return;
      setOpenDropdowns({});
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, []);

  const currentCategoryLabel = currentTab?.label;
  const normalizeCategory = (category) => {
    if (!category) return "";
    if (category === "Which Women in Renewables Blogs") return "Which Women in Renewables Blogspot";
    return category;
  };

  const filteredBlogsByCategory = blogsData.filter(blog => normalizeCategory(blog.category) === currentCategoryLabel);

  const searchMatchedBlogs = filteredBlogsByCategory.filter(blog =>
    (blog.title && blog.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (blog.author && blog.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (blog.companyName && blog.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (Array.isArray(blog.sectors) && blog.sectors.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))) ||
    (Array.isArray(blog.productsServices) && blog.productsServices.some(p => p.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const blogCategories = [
    { name: "Blog by Sector", items: [...new Set(blogsData.flatMap(b => b.sectors || []).filter(Boolean))] },
    { name: "Blog by Products & Services", items: [...new Set(blogsData.flatMap(b => b.productsServices || []).filter(Boolean))] },
    { name: "Blog by Author", items: [...new Set(blogsData.map(b => b.author).filter(Boolean))] },
    { name: "Blog by Company", items: [...new Set(blogsData.map(b => b.companyName).filter(Boolean))] },
    { name: "Blog by Date", items: [...new Set(blogsData.map(b => b.date).filter(Boolean))] },
  ];

  return (
    <div className="min-h-screen text-white overflow-hidden" style={{ background: "#040e1e" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');
        .hero-text-mask { background: linear-gradient(175deg, #ffffff 0%, rgba(255,255,255,0.62) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        ::placeholder { color: rgba(255,255,255,0.25) !important; }
        
        /* Global Scrollbar Styling */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.4);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.6);
        }
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
          <img src="/blog.jpeg" alt="Expert Blogs"
            className="w-full h-full object-cover" style={{ filter: "brightness(1.08) saturate(1.2)" }} />
        </motion.div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(4,14,30,0.25) 0%, rgba(4,14,30,0.55) 60%, #040e1e 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(4,14,30,0.65) 0%, rgba(4,14,30,0.1) 60%, transparent 100%)" }} />

        <motion.div
          className="absolute inset-0 flex flex-col justify-end pb-16 px-8 md:px-16 lg:px-24 pt-32 w-full"
          style={{ opacity: heroOpacity, maxWidth: "65%" }}
        >
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.7 }}
            className="flex items-center gap-3 mb-6">
            <div className="h-px w-10" style={{ background: "#10b981" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.22em", color: "#10b981", textTransform: "uppercase", fontWeight: 500 }}>Expert Insights</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hero-text-mask mb-5"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 4vw, 4.5rem)", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.02em", overflow: "visible" }}>
            Blogspot
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14px, 1.8vw, 18px)", color: "rgba(255,255,255,0.5)", maxWidth: "480px", lineHeight: 1.75, fontWeight: 300 }}>
            Expert Blogs & Industry Insights.
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

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28" style={{ overflow: "visible" }}>
        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex justify-center"
        >
          <div className="inline-flex gap-2 rounded-2xl border p-1.5"
            style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
            {blogTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
                style={{
                  background: activeTab === tab.id ? `linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(4,14,30,0.98) 100%)` : "transparent",
                  borderColor: activeTab === tab.id ? "rgba(16,185,129,0.4)" : "transparent",
                  border: "1px solid",
                  color: activeTab === tab.id ? "#10b981" : "rgba(255,255,255,0.5)",
                  fontFamily: "'DM Sans', sans-serif"
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-10"
            style={{ overflow: "visible" }}
          >
            {/* Hero Description Card */}
            <motion.div
              className="relative overflow-hidden rounded-2xl border p-8 md:p-12"
              style={{
                borderColor: "rgba(16,185,129,0.25)",
                background: "rgba(4,14,30,0.97)",
              }}
            >
              <div className="h-[2px] absolute top-0 left-0 right-0" style={{ background: "linear-gradient(90deg, transparent, #10b981, transparent)" }} />

              <div className="space-y-4">
                <h2 className="font-bold text-white"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.2rem)", color: "#10b981" }}>
                  {currentTab.label}
                </h2>
                <div className="h-px w-12" style={{ background: "linear-gradient(90deg, #10b981, transparent)" }} />
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontWeight: 300 }}>
                  {currentTab.description}
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.75, fontWeight: 300 }}>
                  {currentTab.fullDescription}
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.75, fontWeight: 300 }}>
                  {currentTab.disclaimer}
                </p>
              </div>
            </motion.div>

            {/* Filter Bar */}
            <div className="sticky top-4 z-30" ref={filtersRef} style={{ overflow: "visible" }}>
              <div className="p-4 rounded-xl border flex flex-col md:flex-row gap-3"
                style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", overflow: "visible" }}>
                
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search size={13} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
                  <input type="text" placeholder="Search blogs, authors, topics…" value={searchTerm}
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

                {/* Filter Buttons */}
                <div className="flex gap-2" style={{ overflow: "visible" }}>
                  {blogCategories.map((category, idx) => (
                    <div key={idx} className="relative flex-shrink-0" style={{ zIndex: openDropdowns[idx] ? 60 : 10 }}>
                      <button
                        onClick={() =>
                          setOpenDropdowns((prev) => ({
                            ...prev,
                            [idx]: !prev[idx],
                          }))
                        }
                        className="flex items-center gap-2 px-4 h-full rounded-xl border text-sm font-medium transition-all duration-200"
                        style={{
                          borderColor: openDropdowns[idx] ? "rgba(16,185,129,0.45)" : "rgba(255,255,255,0.09)",
                          background: openDropdowns[idx] ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.03)",
                          color: openDropdowns[idx] ? "#10b981" : "rgba(255,255,255,0.5)",
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {category.name}
                        <ChevronDown size={12} style={{ transform: openDropdowns[idx] ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
                      </button>

                      {/* Dropdown */}
                      <AnimatePresence>
                        {openDropdowns[idx] && (
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.97 }}
                            transition={{ duration: 0.18 }}
                            className="absolute right-0 top-[calc(100%+8px)] w-[250px] rounded-xl border overflow-y-auto z-60"
                            style={{
                              background: "rgba(4,14,30,0.98)", backdropFilter: "blur(32px)",
                              borderColor: "rgba(255,255,255,0.1)", boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                              maxHeight: "300px",
                              scrollbarWidth: "thin", scrollbarColor: "rgba(16,185,129,0.4) rgba(255,255,255,0.02)",
                            }}
                          >
                            <style>{`
                              div[style*="scrollbarWidth"] {
                                scrollbar-width: thin;
                                scrollbar-color: rgba(16, 185, 129, 0.4) rgba(255, 255, 255, 0.02);
                              }
                              div[style*="scrollbarWidth"]::-webkit-scrollbar {
                                width: 6px;
                              }
                              div[style*="scrollbarWidth"]::-webkit-scrollbar-track {
                                background: rgba(255, 255, 255, 0.02);
                              }
                              div[style*="scrollbarWidth"]::-webkit-scrollbar-thumb {
                                background: rgba(16, 185, 129, 0.4);
                                border-radius: 3px;
                              }
                              div[style*="scrollbarWidth"]::-webkit-scrollbar-thumb:hover {
                                background: rgba(16, 185, 129, 0.6);
                              }
                            `}</style>
                            {category.items.map((item, itemIdx) => (
                              <button
                                key={itemIdx}
                                className="w-full text-left px-5 py-3 text-sm border-b transition-all duration-150"
                                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.05)", background: "transparent" }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                                onClick={() => {
                                  setSearchTerm(item);
                                  setOpenDropdowns({});
                                }}
                              >
                                {item}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Blog Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative"
              style={{ zIndex: 1 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {searchMatchedBlogs.map((blog, idx) => (
                <motion.div
                  key={idx}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                  onClick={() => setSelectedBlog(blog)}
                  className="group cursor-pointer"
                >
                  <div
                    className="relative overflow-hidden rounded-2xl border transition-all duration-500 flex flex-col h-full"
                    style={{
                      borderColor: "rgba(255,255,255,0.07)",
                      background: "rgba(255,255,255,0.025)",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)";
                      e.currentTarget.style.background = "linear-gradient(135deg, rgba(16,185,129,0.07) 0%, rgba(4,14,30,0.98) 100%)";
                      e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(16,185,129,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.025)";
                      e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
                    }}
                  >
                    {/* Top accent bar */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[2px] z-10 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background: "linear-gradient(90deg, transparent, #10b981, transparent)",
                        opacity: 0.2,
                      }}
                    />

                    {/* Image */}
                    <div className="relative overflow-hidden" style={{ height: "200px" }}>
                      {blog.image ? (
                        <motion.img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                          animate={{ scale: 1 }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.06)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                          style={{ transition: "transform 0.7s ease-out" }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: "rgba(16,185,129,0.05)" }}>
                          <span style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif", fontSize: "13px" }}>No Image</span>
                        </div>
                      )}
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(4,14,30,0) 40%, rgba(4,14,30,0.9) 100%)" }} />

                      {/* Featured Badge */}
                      {blog.featured === "Yes" && (
                        <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full border"
                          style={{
                            borderColor: "rgba(251,191,36,0.4)",
                            background: "rgba(251,191,36,0.12)",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "9.5px",
                            fontWeight: 600,
                            letterSpacing: "0.13em",
                            textTransform: "uppercase",
                            color: "#fbbf24",
                          }}>
                          <div className="flex items-center gap-1">
                            <Sparkles size={10} />
                            Featured
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col px-6 md:px-7 py-5">
                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        {blog.author && (
                          <div className="flex items-center gap-1.5"
                            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10.5px", color: "#10b981", fontWeight: 500 }}>
                            <span>{blog.author}</span>
                          </div>
                        )}
                        {blog.date && (
                          <div className="flex items-center gap-1.5"
                            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10.5px", color: "rgba(255,255,255,0.35)" }}>
                            <span>{blog.date}</span>
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <h3
                        className="font-bold text-white leading-snug mb-3 line-clamp-2 transition-colors duration-300"
                        style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1rem, 1.4vw, 1.1rem)" }}
                      >
                        {blog.title}
                      </h3>

                      {/* Accent rule */}
                      <div
                        className="mb-3 h-px transition-all duration-500 group-hover:w-12"
                        style={{
                          background: "linear-gradient(90deg, #10b981, transparent)",
                          width: "24px",
                        }}
                      />

                      {/* Excerpt */}
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
                        {Array.isArray(blog.sectors) && blog.sectors.length > 0 
                          ? blog.sectors.join(', ') 
                          : "Industry Blog"}
                      </p>

                      {/* Read More */}
                      <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium transition-all duration-200"
                        style={{ color: "#10b981", fontFamily: "'DM Sans', sans-serif" }}>
                        Read Article
                        {blog.blogUrl && (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {searchMatchedBlogs.length === 0 && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  className="col-span-full text-center py-20 rounded-2xl border"
                  style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                    <Search size={20} style={{ color: "#10b981" }} />
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "#ffffff", marginBottom: "8px" }}>
                    No blogs found
                  </h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
                    Try adjusting your filters or search terms.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Selected Blog Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBlog(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(4,14,30,0.88)", backdropFilter: "blur(14px)" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl rounded-2xl border overflow-hidden"
              style={{
                maxHeight: "85vh", overflowY: "auto",
                background: "rgba(4,14,30,0.97)",
                borderColor: "rgba(16,185,129,0.25)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
              }}
            >
              <div className="h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #10b981, transparent)" }} />

              <button onClick={() => setSelectedBlog(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200"
                style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)"; e.currentTarget.style.color = "#10b981"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
              >
                <X size={14} />
              </button>

              {/* Image */}
              <div className="relative overflow-hidden" style={{ height: "250px" }}>
                {selectedBlog.image ? (
                  <>
                    <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(4,14,30,0.95) 100%)" }} />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: "rgba(16,185,129,0.05)" }}>
                    <span style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif" }}>No Image</span>
                  </div>
                )}
              </div>

              <div className="p-8">
                {/* Meta */}
                <div className="flex flex-wrap gap-4 mb-4">
                  {selectedBlog.author && (
                    <div className="flex items-center gap-1.5" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#10b981", fontWeight: 500 }}>
                      {selectedBlog.author}
                    </div>
                  )}
                  {selectedBlog.date && (
                    <div className="flex items-center gap-1.5" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                      {selectedBlog.date}
                    </div>
                  )}
                  {selectedBlog.companyName && (
                    <div className="flex items-center gap-1.5" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                      {selectedBlog.companyName}
                    </div>
                  )}
                </div>

                {/* Sectors */}
                {Array.isArray(selectedBlog.sectors) && selectedBlog.sectors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedBlog.sectors.map((sector, idx) => (
                      <span key={idx} className="px-2 py-1 rounded-full text-xs"
                        style={{ 
                          fontFamily: "'DM Sans', sans-serif",
                          background: "rgba(16,185,129,0.1)", 
                          border: "1px solid rgba(16,185,129,0.3)",
                          color: "#10b981"
                        }}>
                        {sector}
                      </span>
                    ))}
                  </div>
                )}

                {/* Products & Services */}
                {Array.isArray(selectedBlog.productsServices) && selectedBlog.productsServices.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedBlog.productsServices.map((product, idx) => (
                      <span key={idx} className="px-2 py-1 rounded-full text-xs"
                        style={{ 
                          fontFamily: "'DM Sans', sans-serif",
                          background: "rgba(6,182,212,0.1)", 
                          border: "1px solid rgba(6,182,212,0.3)",
                          color: "#06b6d4"
                        }}>
                        {product}
                      </span>
                    ))}
                  </div>
                )}

                <h2 className="font-bold text-white leading-tight mb-4"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.2rem, 2.5vw, 1.7rem)" }}>
                  {selectedBlog.title}
                </h2>

                <div className="mb-5 h-px w-12" style={{ background: "linear-gradient(90deg, #10b981, transparent)" }} />

                {/* Content */}
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontWeight: 300, whiteSpace: "pre-line" }}>
                  {selectedBlog.content || "No additional content available for this blog post."}
                </div>

                {/* Link */}
                {selectedBlog.blogUrl && (
                  <div className="mt-7">
                    <a href={selectedBlog.blogUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border text-sm font-medium transition-all duration-300"
                      style={{ borderColor: "rgba(16,185,129,0.35)", background: "rgba(16,185,129,0.08)", color: "#10b981", fontFamily: "'DM Sans', sans-serif", textDecoration: "none" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(16,185,129,0.18)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "rgba(16,185,129,0.08)"}
                    >
                      Read More <X size={13} style={{ transform: "rotate(45deg)" }} />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogsSection;
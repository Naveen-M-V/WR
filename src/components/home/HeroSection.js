import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { getAllContent } from "../../utils/contentAPI";

const normalizeShowcaseLink = (rawLink, type = "") => {
  const link = String(rawLink || "").trim();
  const t = String(type || "").toLowerCase();

  // Keep external links as-is
  if (link.startsWith("http://") || link.startsWith("https://")) return link;

  // Old/invalid internal links from legacy data
  if (
    /^\/(showcase|case-studies)\/\d+$/i.test(link) ||
    /^\/products-services\/?$/i.test(link)
  ) {
    if (t === "product/service" || t.includes("product") || t.includes("service")) {
      return "/showcase-hub/product-service-in-spotlight";
    }
    return "";
  }

  return link;
};

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [currentCaseStudyIndex, setCurrentCaseStudyIndex] = useState(0);
  const [adverts, setAdverts] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [showcaseList, setShowcaseList] = useState([]);
  // FIX: track whether the initial fetch has completed
  const [dataLoaded, setDataLoaded] = useState(false);

  const defaultTheme = {
    gradient: "from-emerald-500/20 via-green-500/15 to-teal-500/20",
    textGradient: "from-emerald-400 to-green-300"
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const backendContent = await getAllContent();

        const rawAdverts = backendContent.advertisement;
        if (rawAdverts && rawAdverts.length > 0) {
          setAdverts(rawAdverts.map((ad) => ({
            name: ad.title || "Advertisement",
            image: ad.image || "/images/img1.jpg",
            ctaLink: ad.url || "#",
            theme: defaultTheme,
            tagline: ad.description || "Building the future with sustainable energy integration.",
          })));
        }

        const rawNews = backendContent['home-news'];
        if (rawNews && rawNews.length > 0) {
          setNewsList(rawNews.map((news) => ({
            title: news.title || "Latest News",
            image: news.image || "/images/img2.jpg",
            ctaLink: news.link || "#",
            description: news.description || "Read our latest news updates."
          })));
        }

        const rawShowcase = backendContent['home-showcase'];
        if (rawShowcase && rawShowcase.length > 0) {
          setShowcaseList(rawShowcase.map((item) => ({
            title: item.title || "Showcase Spotlight",
            image: item.image || "/images/img3.jpg",
            link: normalizeShowcaseLink(item.link, item.type),
            type: item.type || "Case Study"
          })));
        }
      } catch (err) {
        console.error("HeroSection: failed to load content", err);
      } finally {
        // FIX: mark fetch as done regardless of success/failure
        setDataLoaded(true);
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    if (adverts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % adverts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [adverts.length]);

  useEffect(() => {
    if (newsList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentProjectIndex((prev) => (prev + 1) % newsList.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [newsList.length]);

  useEffect(() => {
    if (showcaseList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentCaseStudyIndex((prev) => (prev + 1) % showcaseList.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [showcaseList.length]);

  const currentCompany  = adverts[currentAdIndex]       || null;
  const currentNews     = newsList[currentProjectIndex]  || null;
  const currentShowcase = showcaseList[currentCaseStudyIndex] || null;

  // FIX: never return null — always render the video hero.
  // The bottom cards are simply hidden until data arrives.
  const hasCards = currentCompany || currentNews || currentShowcase;

  return (
    <div className="relative w-full text-white flex flex-col font-sans" style={{ height: "clamp(500px, 90vh, 920px)", overflow: "clip" }}>

      {/* ── Background Video ── */}
      <div className="absolute inset-0 z-0">
        <video
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover brightness-90 contrast-110 saturate-110"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.05) 100%),
              linear-gradient(to top,   rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.20) 40%, transparent 65%),
              linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 20%)
            `
          }}
        />
      </div>

      {/* ── Hero Text ── */}
      <div className="relative z-20 flex-1 flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-24 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 mb-5"
          >
            <span className="h-[1px] w-10 bg-emerald-400 block" />
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-[0.25em]">
              Always Open Platform
            </span>
          </motion.div>

<h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none mb-6 drop-shadow-2xl">
            <span className="text-white">
              D
              {/* First "i" — dotless-i + pinging emerald circle as the dot */}
              <span className="relative inline-block" style={{ letterSpacing: 0 }}>
                ı{/* dotless i U+0131 */}
                <span className="absolute flex" style={{ width: "0.18em", height: "0.18em", top: "0.07em", left: "50%", transform: "translateX(-50%)" }}>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" style={{ animationDuration: "1.4s", animationDelay: "0.1s" }} />
                  <span className="relative inline-flex rounded-full bg-emerald-500" style={{ width: "0.18em", height: "0.18em" }} />
                </span>
              </span>
              g
              {/* Second "i" — dotless-i + pinging teal circle as the dot */}
              <span className="relative inline-block" style={{ letterSpacing: 0 }}>
                ı{/* dotless i U+0131 */}
                <span className="absolute flex" style={{ width: "0.18em", height: "0.18em", top: "0.07em", left: "50%", transform: "translateX(-50%)" }}>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" style={{ animationDuration: "1.6s", animationDelay: "0.4s" }} />
                  <span className="relative inline-flex rounded-full bg-teal-400" style={{ width: "0.18em", height: "0.18em" }} />
                </span>
              </span>
              tal
            </span>
            <br />
            <span className="text-white">Trade</span>
            {" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent relative inline-block pr-1">
              Expo
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm sm:text-base md:text-lg text-white/80 font-light leading-relaxed max-w-xl"
          >
            An Always Open Platform Showcasing Products, Innovation &amp; Services to Renewable Energy, Net zero and Sustainability Sector Professionals.
          </motion.p>
        </motion.div>
      </div>

      {/* ── Bottom Cards ── only rendered once data has arrived ── */}
      {dataLoaded && hasCards && (
        <div className="relative z-20 w-full px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 md:pb-10 max-w-[90rem] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Card 1: Featured Partner */}
            {currentCompany && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="group relative h-[156px] rounded-2xl overflow-hidden bg-black/50 backdrop-blur-xl border border-white/10 hover:border-emerald-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentAdIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="relative h-full flex p-4 gap-3"
                  >
                    <div className="w-28 h-full rounded-xl overflow-hidden relative flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-700">
                      <img src={currentCompany.image} alt={currentCompany.name} className="w-full h-full object-cover" />
                      <div className={`absolute inset-0 bg-gradient-to-t ${currentCompany.theme.gradient} opacity-40`} />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div className="rounded-xl bg-black/35 backdrop-blur-sm px-3 py-2 border border-white/10">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Featured Partner</span>
                          <div className="h-[1px] flex-1 bg-white/10" />
                        </div>
                        <h3 className="text-base font-bold text-white leading-tight line-clamp-2 mb-1">{currentCompany.name}</h3>
                        <p className="text-xs text-white/80 line-clamp-2 font-light leading-snug">{currentCompany.tagline}</p>
                      </div>
                      <div className="flex justify-end mt-0.5">
                        <a href={currentCompany.ctaLink} target="_blank" rel="noopener noreferrer" className="text-[10px] font-medium text-white hover:text-emerald-300 flex items-center gap-1 transition-colors">
                          Explore <span className="text-emerald-400">→</span>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}

            {/* Card 2: Latest News */}
            {currentNews && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="group relative h-[156px] rounded-2xl overflow-hidden bg-black/50 backdrop-blur-xl border border-white/10 hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentProjectIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="relative h-full flex p-4 gap-3"
                  >
                    <div className="w-28 h-full rounded-xl overflow-hidden relative flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-700">
                      <img src={currentNews.image || "/images/img2.jpg"} alt={currentNews.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/40 to-transparent" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div className="rounded-xl bg-black/35 backdrop-blur-sm px-3 py-2 border border-white/10">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Latest News</span>
                          <div className="h-[1px] flex-1 bg-white/10" />
                        </div>
                        <h3 className="text-base font-bold text-white leading-tight line-clamp-2 mb-1">{currentNews.title}</h3>
                        <p className="text-xs text-white/80 line-clamp-2 font-light leading-snug">{currentNews.description || "Latest updates from the renewable sector."}</p>
                      </div>
                      <div className="flex justify-end mt-0.5">
                        <Link to={currentNews.ctaLink || "/news"} className="text-[10px] font-medium text-white hover:text-blue-300 flex items-center gap-1 transition-colors">
                          Read Article <span className="text-blue-400">→</span>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}

            {/* Card 3: Showcase Spotlight */}
            {currentShowcase && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="group relative h-[156px] rounded-2xl overflow-hidden bg-black/50 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentCaseStudyIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="relative h-full flex p-4 gap-3"
                  >
                    <div className="w-28 h-full rounded-xl overflow-hidden relative flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-700">
                      <img src={currentShowcase.image || "/images/img3.jpg"} alt={currentShowcase.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-600/40 to-transparent" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div className="rounded-xl bg-black/35 backdrop-blur-sm px-3 py-2 border border-white/10">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Spotlight</span>
                          <div className="h-[1px] flex-1 bg-white/10" />
                        </div>
                        <h3 className="text-base font-bold text-white leading-tight line-clamp-2 mb-1">{currentShowcase.title}</h3>
                        <p className="text-xs text-white/80 line-clamp-2 font-light leading-snug">
                          {currentShowcase.type || "Case Study"}
                        </p>
                      </div>
                      <div className="flex justify-end mt-0.5">
                        <button
                          onClick={() => {
                            const t = (currentShowcase.type || "").toLowerCase();

                            // Direct link set by admin takes priority
                            // BUT skip if it's a broken /showcase/ID or /case-studies/ID pattern from old data
                            const isBrokenLink = currentShowcase.link && 
                              (/^\/(showcase|case-studies)\/\d+$/i.test(currentShowcase.link) || /^\/products-services\/?$/i.test(currentShowcase.link));
                            
                            if (currentShowcase.link && currentShowcase.link !== "#" && !isBrokenLink) {
                              const isExternal = currentShowcase.link.startsWith("http");
                              if (isExternal) {
                                window.open(currentShowcase.link, "_blank", "noopener noreferrer");
                              } else {
                                navigate(currentShowcase.link);
                              }
                              return;
                            }

                            // Fallback — route by type using exact admin values
                            if (t === "which women in renewables" || t.includes("which women") || t.includes("which-women")) {
                              navigate("/showcase-hub/which-women-in-renewables");
                            } else if (t === "case study" || t.includes("case study")) {
                              navigate("/showcase-hub/industry-case-studies");
                            } else if (t === "completed projects" || t.includes("completed project") || t.includes("project")) {
                              navigate("/showcase-hub/recent-completed-projects");
                            } else if (t === "product/service" || t.includes("product") || t.includes("service")) {
                              navigate("/showcase-hub/product-service-in-spotlight");
                            } else {
                              navigate("/showcase-hub/companies-in-spotlight");
                            }
                          }}
                          className="text-[10px] font-medium text-white hover:text-purple-300 flex items-center gap-1 transition-colors"
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                        >
                          View Details <span className="text-purple-400">→</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default HeroSection;

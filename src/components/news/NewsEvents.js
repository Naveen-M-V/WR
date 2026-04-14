import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaClock,  FaArrowRight, FaFilter, FaSearch, FaNewspaper, FaGlobe, FaMicrophone, FaBuilding, FaStar } from "react-icons/fa";
import ScrollingBanner from "../home/ScrollingBanner";

// Custom styles for enhanced animations
const customStyles = `
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  .animate-pulse-slow {
    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  .glass-card {
    backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  .news-gradient {
    background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%);
  }
`;

const newsCategories = [
  { name: "All News", icon: FaNewspaper, color: "from-emerald-500 to-teal-600" },
  { name: "Industry News", icon: FaGlobe, color: "from-green-500 to-emerald-600" },
  { name: "What's Happening", icon: FaClock, color: "from-teal-500 to-cyan-600" },
  { name: "Industry Webinars", icon: FaMicrophone, color: "from-emerald-600 to-green-700" },
  { name: "Trade Shows & Events", icon: FaBuilding, color: "from-green-600 to-teal-700" },
  { name: "Company Spotlight", icon: FaStar, color: "from-teal-600 to-emerald-700" }
];

const newsData = [
  {
    id: 1,
    category: "Industry News",
    title: "UK Renewable Energy Capacity Reaches Record High in 2024",
    excerpt: "The UK has achieved unprecedented renewable energy capacity, with solar and wind installations leading the charge towards net-zero emissions.",
    date: "2024-03-15",
    location: "London, UK",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=500&h=300&fit=crop&auto=format&q=80",
    featured: true,
    readTime: "5 min read"
  },
  {
    id: 2,
    category: "Trade Shows & Events",
    title: "Solar Power International 2024 - Join Us at Stand B47",
    excerpt: "Meet our team at the largest solar trade show in North America. Discover cutting-edge solar solutions and network with industry leaders.",
    date: "2024-04-22",
    location: "Las Vegas, USA",
    image: "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=500&h=300&fit=crop&auto=format&q=80",
    featured: false,
    readTime: "3 min read"
  },
  {
    id: 3,
    category: "Industry Webinars",
    title: "Future of Battery Storage Technology - Live Webinar",
    excerpt: "Join our expert panel discussion on the latest advancements in battery storage technology and its impact on renewable energy adoption.",
    date: "2024-04-10",
    location: "Online Event",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop&auto=format&q=80",
    featured: false,
    readTime: "60 min session"
  },
  {
    id: 4,
    category: "Company Spotlight",
    title: "Green Tech Innovations: Leading the Sustainable Revolution",
    excerpt: "Spotlight on companies driving innovation in green technology, from smart grid solutions to next-generation solar panels.",
    date: "2024-03-28",
    location: "Manchester, UK",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=500&h=300&fit=crop&auto=format&q=80",
    featured: true,
    readTime: "7 min read"
  },
  {
    id: 5,
    category: "What's Happening",
    title: "Government Announces New Renewable Energy Incentives",
    excerpt: "Latest government initiatives to boost renewable energy adoption across residential and commercial sectors.",
    date: "2024-03-20",
    location: "Westminster, UK",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=500&h=300&fit=crop&auto=format&q=80",
    featured: false,
    readTime: "4 min read"
  },
  {
    id: 6,
    category: "Industry News",
    title: "Electric Vehicle Charging Infrastructure Expansion",
    excerpt: "Major expansion of EV charging networks across the UK, supporting the transition to electric mobility.",
    date: "2024-03-12",
    location: "Birmingham, UK",
    image: "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=500&h=300&fit=crop&auto=format&q=80",
    featured: false,
    readTime: "6 min read"
  }
];

export default function NewsEvents() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All News");

  const filteredNews = newsData.filter(item => {
    const matchesCategory = selectedCategory === "All News" || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredNews = filteredNews.filter(item => item.featured);
  const regularNews = filteredNews.filter(item => !item.featured);

  return (
    <>
      <style>{customStyles}</style>
      <ScrollingBanner />
      <div className="min-h-screen bg-[#051f46] relative overflow-hidden">
        {/* Enhanced floating background accents */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-emerald-300/30 to-teal-300/30 rounded-full mix-blend-overlay filter blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-[32rem] h-[32rem] bg-gradient-to-l from-green-300/25 to-emerald-300/25 rounded-full mix-blend-overlay filter blur-[140px] animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] bg-gradient-to-tr from-teal-200/20 to-cyan-200/20 rounded-full mix-blend-overlay filter blur-[160px] animate-float"></div>
        
        {/* Geometric decorative elements */}
        <div className="absolute top-32 right-32 w-24 h-24 border-2 border-emerald-300/40 rounded-2xl rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-32 left-32 w-20 h-20 bg-gradient-to-br from-teal-400/30 to-emerald-400/30 rounded-full animate-float"></div>
        <div className="absolute top-64 left-64 w-16 h-16 bg-gradient-to-br from-green-400/25 to-teal-400/25 rounded-lg rotate-12 animate-pulse"></div>

        {/* Hero Section */}
        <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] flex items-center justify-center text-center">
          <img
            src="/news/news-events.jpeg"
            alt="News & Events"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.4] contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-transparent to-emerald-900/60"></div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative z-10 max-w-4xl mx-auto px-6"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-6"
            >
              <FaNewspaper className="text-6xl text-emerald-300 mx-auto mb-4" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white drop-shadow-2xl mb-4 sm:mb-6 px-4">
              News & Events
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-emerald-100 font-medium max-w-3xl mx-auto leading-relaxed px-4">
              Stay updated with the latest developments in renewable energy, industry insights, and upcoming events
            </p>

            {/* Quick Link to Today's Industry News */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/news-events/todays-industry-news")}
              className="mt-8 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-full hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <FaNewspaper className="text-lg" />
              Today's Industry News Stories
              <FaArrowRight className="text-lg" />
            </motion.button>
          </motion.div>
        </div>

        {/* Search and Filter Section */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 -mt-16 sm:-mt-20 z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-white/30"
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch sm:items-center">
              {/* Search Bar */}
              <div className="flex-1 relative w-full">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-600 text-lg" />
                <input
                  type="text"
                  placeholder="Search news and events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base bg-white/80 backdrop-blur-sm border-2 border-emerald-200/50 rounded-xl sm:rounded-2xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-emerald-300/30 focus:border-emerald-400 transition-all duration-300 font-medium"
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <FaFilter className="text-emerald-600 text-lg" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-white/80 backdrop-blur-sm border-2 border-emerald-200/50 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-4 focus:ring-emerald-300/30 focus:border-emerald-400 transition-all duration-300 font-medium w-full sm:w-auto"
                >
                  {newsCategories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Category Pills */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 mt-8 sm:mt-12">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
            {newsCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <motion.button
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 ${
                    selectedCategory === category.name
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-105`
                      : 'bg-white/70 text-emerald-700 hover:bg-white/90 hover:scale-105'
                  }`}
                >
                  <IconComponent className="text-lg" />
                  <span>{category.name}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Featured News Section */}
        {featuredNews.length > 0 && (
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 mt-12 sm:mt-16">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-2xl sm:text-3xl font-bold text-emerald-800 mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 px-2 sm:px-0"
            >
              <FaStar className="text-yellow-500" />
              Featured Stories
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {featuredNews.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative glass-card rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500"
                >
                  <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {item.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <FaStar className="text-xs" />
                        Featured
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-5 md:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3 group-hover:text-emerald-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
                      {item.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt />
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaMapMarkerAlt />
                          {item.location}
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <FaClock />
                        {item.readTime}
                      </span>
                    </div>
                    
                    <button className="flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors group-hover:gap-3">
                      Read More
                      <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        )}

        {/* Regular News Grid */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 mt-12 sm:mt-16 pb-16 sm:pb-20">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-2xl sm:text-3xl font-bold text-emerald-800 mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 px-2 sm:px-0"
          >
            <FaNewspaper className="text-emerald-600" />
            Latest Updates
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {regularNews.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="group glass-card rounded-xl sm:rounded-2xl overflow-hidden shadow-xl hover:shadow-emerald-500/20 transition-all duration-500"
              >
                <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-emerald-500/90 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                      {item.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 sm:p-5">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {item.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt />
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock />
                      {item.readTime}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <FaMapMarkerAlt />
                      {item.location}
                    </span>
                    <button className="flex items-center gap-1 text-emerald-600 font-semibold text-sm hover:text-emerald-700 transition-colors group-hover:gap-2">
                      Read More
                      <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* No Results Message */}
        {filteredNews.length === 0 && (
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 mt-12 sm:mt-16 pb-16 sm:pb-20 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl sm:rounded-3xl p-8 sm:p-12"
            >
              <FaSearch className="text-6xl text-emerald-300 mx-auto mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-emerald-800 mb-2">No Results Found</h3>
              <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}

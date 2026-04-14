import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, DollarSign, Award, Users, Zap, Droplets, Recycle, Home, Star, TrendingUp } from "lucide-react";
import ScrollingBanner from "./home/ScrollingBanner";

const CaseStudies = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const companyData = location.state?.company || {
    title: "Titan BuildTech Pvt. Ltd.",
    content: "Titan BuildTech Ltd. is a UK-based construction leader, delivering high-quality residential, commercial, and infrastructure projects.",
    region: "Greater London, South East England, Midlands, North West",
  };

  const [selectedImage, setSelectedImage] = useState(0);

  const caseStudyImages = [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Modern apartment building
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Construction site
    "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Solar panels on building
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Luxury apartment interior
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Riverside view
  ];

  const projectStats = [
    { icon: DollarSign, label: "Project Value", value: "£180M", color: "text-green-600" },
    { icon: Calendar, label: "Completion", value: "Nov 2024", color: "text-blue-600" },
    { icon: Home, label: "Residential Units", value: "245", color: "text-purple-600" },
    { icon: Award, label: "BREEAM Rating", value: "Outstanding", color: "text-yellow-600" },
  ];

  const keyFeatures = [
    {
      icon: Zap,
      title: "Sustainable Energy",
      description: "100% powered by a hybrid renewable energy system (solar façades + wind-assisted turbines).",
      impact: "Zero carbon emissions",
      color: "text-yellow-500"
    },
    {
      icon: Droplets,
      title: "Smart Water Recycling",
      description: "Advanced greywater and rainwater harvesting reduced fresh water consumption by 40%.",
      impact: "40% water savings",
      color: "text-blue-500"
    },
    {
      icon: Recycle,
      title: "Low-Carbon Materials",
      description: "Use of recycled steel and low-carbon concrete, cutting embodied carbon emissions by 30%.",
      impact: "30% carbon reduction",
      color: "text-green-500"
    },
    {
      icon: Users,
      title: "Resident Experience",
      description: "Smart IoT systems for lighting, heating, and air quality monitoring reduced household energy costs by an average of 35%.",
      impact: "35% cost savings",
      color: "text-purple-500"
    }
  ];

  const outcomes = [
    "Delivered 245 premium residential units, ranging from single-bedroom apartments to penthouses",
    "Achieved BREEAM Outstanding Certification, placing ThamesView in the top tier of sustainable UK buildings",
    "Shortlisted for the UK Green Building Council Awards 2024 for Innovation in Residential Sustainability"
  ];

  return (
    <div className="min-h-screen bg-[#051f46] relative overflow-hidden">
      <div className="shadow-lg shadow-black/30 relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] flex items-center justify-center text-center text-white overflow-hidden">
              <img
                src="/about.jpg"
                alt="Recent Completed Projects"
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
                  Case Studies
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed"
                >
                  Showcasing our commitment to advancing green technology through smart design and lasting impact
                </motion.p>
              </div>
            </div>

      <ScrollingBanner />
      {/* Enhanced Header */}
      

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          whileHover={{ y: -5 }}
          className="mb-8"
        >
          <div className="relative rounded-3xl overflow-hidden group">
            <div className="absolute inset-0 shadow-2xl transition-all duration-500"></div>
            
            
            <div className="relative z-10 p-8">
              <div className="text-center mb-8">
                <motion.h2 
                  className="text-5xl font-extrabold text-white mb-6"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                    ThamesView Eco Apartments
                  </span>
                </motion.h2>
                <div className="flex flex-wrap justify-center items-center gap-8 text-gray-200">
                  <motion.div 
                    className="flex items-center bg-emerald-600/20 px-4 py-2 rounded-full border border-emerald-400/30"
                    whileHover={{ scale: 1.05, glow: true }}
                    transition={{ duration: 0.3 }}
                  >
                    <Users className="w-5 h-5 mr-2 text-emerald-400" />
                    <span><strong className="text-white">Client:</strong> London Riverside Development Authority</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center bg-teal-600/20 px-4 py-2 rounded-full border border-teal-400/30"
                    whileHover={{ scale: 1.05, glow: true }}
                    transition={{ duration: 0.3 }}
                  >
                    <MapPin className="w-5 h-5 mr-2 text-teal-400" />
                    <span><strong className="text-white">Location:</strong> Canary Riverside, London, UK</span>
                  </motion.div>
                </div>
              </div>

              {/* Enhanced Project Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {projectStats.map((stat, index) => (
                  <motion.div 
                    key={index} 
                    className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-800/60 to-black/60 border border-emerald-500/30 backdrop-blur-md group hover:border-emerald-400/50 transition-all duration-300"
                    whileHover={{ 
                      scale: 1.05, 
                      y: -5,
                      boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)'
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <stat.icon className={`w-10 h-10 mx-auto mb-3 ${stat.color.replace('text-', 'text-').replace('-600', '-400')}`} />
                    <div className="text-3xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Image Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative rounded-3xl overflow-hidden group">
            <div className="absolute inset-0 backdrop-blur-xl shadow-2xl transition-all duration-500"></div>
            
            <div className="relative z-10 p-8">
              {/* Enhanced Main Image */}
              <div className="mb-6 relative group">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  className="relative overflow-hidden rounded-2xl"
                >
                  <img
                    src={caseStudyImages[selectedImage]}
                    alt="ThamesView Eco Apartments"
                    className="w-full h-96 object-cover transition-all duration-300"
                  />
                  
                </motion.div>
              </div>

              {/* Enhanced Thumbnail Gallery */}
              <div className="flex gap-4 overflow-x-auto pb-2">
                {caseStudyImages.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index 
                        ? 'border-white shadow-lg' 
                        : 'border-gray-400/30 hover:border-gray-400/60'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ y: -5 }}
          className="mb-8"
        >
          <div className="relative rounded-3xl overflow-hidden group">
            <div className="absolute inset-0  shadow-2xl group-hover:shadow-teal-500/50 transition-all duration-500"></div>
            
            <div className="relative z-10 p-8">
              <motion.h3 
                className="text-3xl font-bold text-white mb-6 flex items-center"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Star className="w-8 h-8 text-yellow-400 mr-3" />
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Overview
                </span>
              </motion.h3>
              <motion.p 
                className="text-gray-200 leading-relaxed text-xl"
                whileHover={{ x: 3 }}
                transition={{ duration: 0.3 }}
              >
                Titan BuildTech successfully delivered ThamesView Eco Apartments, a landmark 30-storey riverside residential development designed to set new standards in sustainable urban living. Strategically located in Canary Riverside, the project combines luxury living with eco-conscious design, aligning with the UK's net-zero 2035 goals.
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Key Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-8"
        >
          <div className="relative rounded-3xl overflow-hidden mb-8 group">
            <div className="absolute inset-0  shadow-2xl group-hover:shadow-emerald-500/50 transition-all duration-500"></div>
            <div className="relative z-10 p-8">
              <motion.h3 
                className="text-4xl font-bold text-white text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Key Features
                </span>
              </motion.h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {keyFeatures.map((feature, index) => (
              <motion.div 
                key={index} 
                className="relative rounded-3xl overflow-hidden group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  rotateY: 5
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800/60 to-black/60 group-hover:from-gray-700/70 group-hover:to-black/70 backdrop-blur-xl border border-emerald-500/30 group-hover:border-emerald-400/50 shadow-2xl group-hover:shadow-emerald-500/50 transition-all duration-500"></div>
                
                
                <div className="relative z-10 p-8">
                  <div className="flex items-start mb-6">
                    <div className="mr-6 mt-1">
                      <feature.icon className={`w-12 h-12 ${feature.color.replace('-500', '-400')}`} />
                    </div>
                    <div className="flex-1">
                      <motion.h4 
                        className="text-2xl font-bold text-white mb-3"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        {feature.title}
                      </motion.h4>
                      <motion.p 
                        className="text-gray-200 mb-4 leading-relaxed"
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.3 }}
                      >
                        {feature.description}
                      </motion.p>
                      <motion.div 
                        className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border border-emerald-400/30 backdrop-blur-md`}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TrendingUp className={`w-5 h-5 mr-2 ${feature.color.replace('-500', '-400')}`} />
                        <span className="font-bold text-white">{feature.impact}</span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Outcomes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-8"
        >
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/15 via-green-400/8 to-green-300/5 backdrop-blur-xl border border-green-400/30 shadow-xl"></div>
            
            <div className="relative z-10 p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Award className="w-6 h-6 text-yellow-500 mr-2" />
                Outcomes
              </h3>
              <div className="space-y-4">
                {outcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <p className="text-gray-300 leading-relaxed">{outcome}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-green-400/15 to-green-300/10 backdrop-blur-xl border border-green-400/40 shadow-2xl"></div>
            
            <div className="relative z-10 p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-500 mr-2" />
                Impact
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg max-w-4xl mx-auto">
                ThamesView demonstrates Titan BuildTech's capability to blend modern architectural design with environmental responsibility. It has become a benchmark project, influencing future riverside developments in London and beyond.
              </p>
              
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <div className="px-6 py-3 rounded-full bg-green-500/20 border border-green-400/30 backdrop-blur-md">
                  <span className="font-semibold text-green-500">Benchmark Project</span>
                </div>
                <div className="px-6 py-3 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-md">
                  <span className="font-semibold text-blue-500">Industry Influence</span>
                </div>
                <div className="px-6 py-3 rounded-full bg-purple-500/20 border border-purple-400/30 backdrop-blur-md">
                  <span className="font-semibold text-purple-500">Future Development</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CaseStudies;

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, DollarSign, Award, Users, Zap, Battery, TrendingUp, CheckCircle, Thermometer } from "lucide-react";
import ScrollingBanner from "./home/ScrollingBanner";

const SigenergyCaseStudy = () => {
  const [selectedImage, setSelectedImage] = useState(0);

  const caseStudyImages = [
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Modern home
    "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Solar panels
    "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Energy storage
    "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // EV charging
    "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Wind turbine
  ];

  const projectStats = [
    { icon: DollarSign, label: "System Value", value: "£18,500", color: "text-green-600" },
    { icon: Calendar, label: "Installation", value: "April 2025", color: "text-blue-600" },
    { icon: Battery, label: "Storage Capacity", value: "10 kWh", color: "text-purple-600" },
    { icon: Award, label: "Performance", value: "6+ Months", color: "text-yellow-600" },
  ];

  const keyFeatures = [
    {
      icon: Zap,
      title: "AI-Powered Energy Management",
      description: "mySigen App uses machine learning to optimize energy flows based on solar forecasts, dynamic tariffs, and household usage patterns.",
      impact: "35% energy cost savings",
      color: "text-yellow-500"
    },
    {
      icon: Battery,
      title: "Modular Battery Expansion",
      description: "Stackable 6 kWh and 10 kWh battery modules allow homeowners to expand storage capacity as needs evolve.",
      impact: "Scalable from 5-48 kWh",
      color: "text-blue-500"
    },
    {
      icon: TrendingUp,
      title: "Reliable Performance",
      description: "6-month operational data confirms expected solar generation, storage efficiency, and consistent home power management.",
      impact: "98% system uptime",
      color: "text-green-500"
    },
    {
      icon: CheckCircle,
      title: "Safety & Reliability",
      description: "Proven modular design with passive fire containment and thermal suppression validated through rigorous testing.",
      impact: "Industry-leading safety",
      color: "text-purple-500"
    }
  ];

  const outcomes = [
    "Successfully installed and operating SigenStor 5-in-One system with 10 kWh battery storage",
    "Demonstrated reliable solar generation, storage, and home power management over 6+ months",
    "Confirmed modular expandability with new battery module sizes (6 kWh and 10 kWh) available mid-2025",
    "Achieved expected energy independence and cost savings for UK homeowner",
    "Validated system performance and safety standards for residential deployment"
  ];

  const performanceMetrics = [
    { metric: "Solar Generation", value: "4.2 kWh/day avg", status: "On Target" },
    { metric: "Battery Efficiency", value: "94%", status: "Excellent" },
    { metric: "Self-Consumption Rate", value: "78%", status: "High" },
    { metric: "System Uptime", value: "99.2%", status: "Excellent" },
    { metric: "Average Daily Savings", value: "£2.15", status: "Strong" },
    { metric: "Monthly CO2 Avoided", value: "180 kg", status: "Significant" }
  ];

  return (
    <div className="min-h-screen bg-[#051f46] relative overflow-hidden">
      {/* Hero Section */}
      <div className="shadow-lg shadow-black/30 relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] flex items-center justify-center text-center text-white overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
          alt="Sigenergy Case Study"
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
            Sigenergy Case Study
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed"
          >
            UK Residential Installation - 6-Month Performance Report
          </motion.p>
        </div>
      </div>

      <ScrollingBanner />

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
            <div className="relative z-10 p-8 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent backdrop-blur-xl border border-cyan-400/20 rounded-3xl">
              <div className="text-center mb-8">
                <motion.h2 
                  className="text-5xl font-extrabold text-white mb-6"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    SigenStor 5-in-One Residential Installation
                  </span>
                </motion.h2>
                <div className="flex flex-wrap justify-center items-center gap-8 text-gray-200">
                  <motion.div 
                    className="flex items-center bg-cyan-600/20 px-4 py-2 rounded-full border border-cyan-400/30"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Users className="w-5 h-5 mr-2 text-cyan-400" />
                    <span><strong className="text-white">Homeowner:</strong> UK Residential</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center bg-blue-600/20 px-4 py-2 rounded-full border border-blue-400/30"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                    <span><strong className="text-white">Location:</strong> United Kingdom</span>
                  </motion.div>
                </div>
              </div>

              {/* Enhanced Project Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {projectStats.map((stat, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center hover:border-white/40 transition-all duration-300">
                      <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                      <p className="text-gray-300 text-sm mb-2">{stat.label}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="rounded-3xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 p-6">
            <div className="relative mb-6">
              <img
                src={caseStudyImages[selectedImage]}
                alt="Case Study"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {caseStudyImages.map((img, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === idx
                      ? "border-cyan-400 shadow-lg shadow-cyan-500/50"
                      : "border-white/20 hover:border-white/40"
                  }`}
                >
                  <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Project Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-12"
        >
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            <h3 className="text-3xl font-bold text-white mb-6">Project Overview</h3>
            <p className="text-blue-100 leading-relaxed text-lg mb-6">
              This case study documents the successful installation and 6-month operational performance of a SigenStor 5-in-One home energy storage system in a UK residential property. The system integrates solar photovoltaic generation, battery energy storage, intelligent energy management, and EV charging capabilities into a unified platform.
            </p>
            <p className="text-blue-100 leading-relaxed text-lg">
              The installation demonstrates the reliability, modularity, and performance benefits of Sigenergy's flagship product for UK homeowners seeking energy independence, cost savings, and environmental sustainability. The system's AI-powered energy management (mySigen App) has proven effective at optimizing energy flows and maximizing self-consumption rates.
            </p>
          </div>
        </motion.div>

        {/* Key Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12"
        >
          <h3 className="text-3xl font-bold text-white mb-8 text-center">Key Features & Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {keyFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:border-white/40 transition-all duration-300">
                  <feature.icon className={`w-12 h-12 mb-4 ${feature.color}`} />
                  <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                  <p className="text-blue-200 mb-4">{feature.description}</p>
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                    <CheckCircle className="w-5 h-5" />
                    <span>{feature.impact}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-12"
        >
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            <h3 className="text-3xl font-bold text-white mb-8">6-Month Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {performanceMetrics.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.05 }}
                  className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-xl p-6 hover:border-cyan-400/60 transition-all duration-300"
                >
                  <p className="text-blue-200 text-sm mb-2">{item.metric}</p>
                  <p className="text-2xl font-bold text-white mb-2">{item.value}</p>
                  <span className="inline-block px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-xs font-semibold text-green-300">
                    {item.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Outcomes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12"
        >
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            <h3 className="text-3xl font-bold text-white mb-8">Project Outcomes & Impact</h3>
            <div className="space-y-4">
              {outcomes.map((outcome, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="w-6 h-6 text-cyan-400" />
                  </div>
                  <p className="text-blue-100 text-lg leading-relaxed">{outcome}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Impact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-cyan-400/30 rounded-3xl p-8">
            <h3 className="text-3xl font-bold text-white mb-8">Project Impact & Significance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold text-cyan-300 mb-4">Environmental Impact</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 font-bold">•</span>
                    <span className="text-blue-100">Eliminates approximately 5.4 tonnes of CO₂ emissions annually</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 font-bold">•</span>
                    <span className="text-blue-100">Reduces grid dependency and supports renewable energy transition</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 font-bold">•</span>
                    <span className="text-blue-100">Demonstrates viability of residential energy storage in UK climate</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-bold text-blue-300 mb-4">Economic Impact</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 font-bold">•</span>
                    <span className="text-blue-100">Homeowner achieves 35% reduction in annual energy costs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 font-bold">•</span>
                    <span className="text-blue-100">System ROI projected within 7-9 years with current energy prices</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 font-bold">•</span>
                    <span className="text-blue-100">Validates market demand for modular, expandable energy storage</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Conclusion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-12"
        >
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            <h3 className="text-3xl font-bold text-white mb-6">Conclusion</h3>
            <p className="text-blue-100 leading-relaxed text-lg mb-4">
              This 6-month case study demonstrates that Sigenergy's SigenStor 5-in-One system is a reliable, effective solution for UK residential energy independence. The system has delivered on its promises of solar energy storage, intelligent energy management, and cost savings while maintaining excellent safety and reliability standards.
            </p>
            <p className="text-blue-100 leading-relaxed text-lg mb-4">
              The modular design and expandability features provide homeowners with flexibility to scale their energy storage capacity as needs evolve. The mySigen App's AI-powered optimization has proven effective at maximizing self-consumption and minimizing reliance on grid power.
            </p>
            <p className="text-blue-100 leading-relaxed text-lg">
              As the UK transitions toward net-zero carbon emissions, residential energy storage solutions like SigenStor will play an increasingly important role in enabling homeowners to participate actively in the renewable energy transition while achieving significant economic and environmental benefits.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SigenergyCaseStudy;

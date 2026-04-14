"use client";

import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navcontent/navbar";
import HomePage from "./components/home/HomePage";
import About from "./components/About";
import Footer from "./components/Footer";
import Construction from "./components/Construction";
import Industrial from "./components/Industrial";
import Agriculture from "./components/Agriculture";
import Domestic from "./components/Domestic";
import Comercial from "./components/Comercial-retail";
import CaseStudies from "./components/CaseStudies";
import GHProductsServices from "./components/GHProductsServices";
import TitanProductsServices from "./components/TitanProductsServices";

function App() {

  const companies = [
    {
      name: "GreenTech Solutions",
      description: "Leading renewable energy solutions provider",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      alt: "company1",
      id: 0
    },
    {
      name: "EcoInnovate Corp",
      description: "Sustainable technology innovators",
      image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      alt: "company2",
      id: 1
    },
    {
      name: "Solar Dynamics",
      description: "Advanced solar panel manufacturers",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      alt: "company3",
      id: 2
    },
    {
      name: "WindPower Ltd",
      description: "Wind energy infrastructure specialists",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      alt: "company4",
      id: 3
    },
    {
      name: "CleanEnergy Hub",
      description: "Comprehensive clean energy solutions",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      alt: "company5",
      id: 4
    }
  ];

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCompany((prev) => (prev + 1) % companies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [companies.length]);

  const getCompanyAtPosition = (offset) => {
    const index = (currentCompany + offset + companies.length) % companies.length;
    return companies[index];
  };

  const requirements = [
    {
      title: "COMMERCIAL FUNDING & CAPITAL PROVISION",
      description: "Details about funding and capital provision go here...",
      imageLeft: true,
    },
    {
      title: "PLANNING & INFRASTRUCTURE CONSULTATION",
      description: "Details about planning and infrastructure consultation go here...",
      imageLeft: false,
    },
    {
      title: "COMMERCIAL LENDING & CAPITAL PROVISION",
      description: "Details about commercial lending and capital provision go here...",
      imageLeft: true,
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Viewport meta must be added in index.html */}
      {/* <meta name="viewport" content="width=device-width, initial-scale=1.0" /> */}

      {/* Scrolling Text Banner */}
      <div
        className="fixed top-0 left-0 w-full text-xs bg-gray-900 sm:text-sm py-2 overflow-hidden whitespace-nowrap z-50"
        
      >
        <marquee behavior="scroll" direction="left">
          <div className="flex items-center gap-6 sm:gap-8 text-white font-medium">
            <span>Profile your company service at whichrenewables.com</span>
            <span>Pitch your business in 3 minutes</span>
            <span className="font-bold">Ad Placement Here</span>
          </div>
        </marquee>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] flex items-center justify-start text-left text-white">
        <img
          src="https://i.pinimg.com/1200x/fc/02/64/fc026433a20db53bc4447d4e41f8f830.jpg"
          alt="Renewable Energy"
          className="absolute  inset-0 w-full h-full object-cover brightness-75"
        />
        
        {/* Main Content */}
        <div className="relative z-10 max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl px-4 sm:px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
          >
            GO-TO DIGITAL HUB FOR UK AND IRELAND RENEWABLE ENERGY PROFESSIONALS
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-4xl mx-auto"
          >
            We curate sector-specific news, case studies, and product intelligence
            for sustainability and procurement teams, while giving solution providers
            a trusted platform to showcase and grow their brands.
          </motion.p>
        </div>

        {/* Glassmorphism Advertisement Card */}
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-4 right-4 sm:top-8 sm:right-8 md:top-12 md:right-12 lg:top-16 lg:right-16 z-20"
        >
          {/* Glassmorphism Card */}
          <div className="relative w-64 sm:w-72 md:w-80 lg:w-96 bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl overflow-hidden group hover:scale-105 transition-all duration-500 mt-20">
            {/* Card Header */}
            <div className="p-4 sm:p-6 border-b border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm sm:text-base md:text-lg">Titan BuildTech</h3>
                  <p className="text-white/80 text-xs sm:text-sm">Premium Construction</p>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white/90 text-xs sm:text-sm">UK-based construction leader</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-white/90 text-xs sm:text-sm">Renewable energy integration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-white/90 text-xs sm:text-sm">20+ years expertise</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
                <div className="text-center p-2 sm:p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="text-white font-bold text-lg sm:text-xl">300+</div>
                  <div className="text-white/80 text-xs">Projects</div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="text-white font-bold text-lg sm:text-xl">5★</div>
                  <div className="text-white/80 text-xs">Rating</div>
                </div>
              </div>

              {/* CTA Button */}
              <Link href="/titan-products-services">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full mt-4 sm:mt-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 text-xs sm:text-sm"
                >
                  Learn More
                </motion.button>
              </Link>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-green-400/20 to-transparent rounded-full translate-y-8 -translate-x-8"></div>
          </div>
        </motion.div>
      </div>

      {/* Innovation Hub */}
      <section className="px-4 sm:px-6 lg:px-10 py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 lg:mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-green-800 mb-2"
            >
              Innovation Hub
            </motion.h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* First Row */}
            {/* Innovation in Renewables */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-105 transform"
            >
              <div className="h-40 sm:h-48 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  alt="image 1"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-green-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="font-semibold text-base sm:text-lg text-green-800 mb-2 sm:mb-3 text-center">Innovation in Renewables</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Discover cutting-edge renewable energy technologies including solar panels, wind turbines, 
                  and energy storage solutions that are revolutionizing the clean energy sector.
                </p>
              </div>
            </motion.div>

            {/* Innovation in Sustainable */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-105 transform"
            >
              <div className="h-40 sm:h-48 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  alt="image 2"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-green-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="font-semibold text-base sm:text-lg text-green-800 mb-2 sm:mb-3 text-center">Innovation in Sustainable</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Explore sustainable practices and eco-friendly innovations that help businesses reduce 
                  their carbon footprint while maintaining operational efficiency.
                </p>
              </div>
            </motion.div>

            {/* Innovation in Environmental */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-105 transform"
            >
              <div className="h-40 sm:h-48 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  alt="image 3"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-green-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="font-semibold text-base sm:text-lg text-green-800 mb-2 sm:mb-3 text-center">Innovation in Environmental</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Learn about environmental protection technologies and solutions that help preserve 
                  our planet for future generations through innovative approaches.
                </p>
              </div>
            </motion.div>

            {/* Innovation in Energy Management */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-105 transform"
            >
              <div className="h-40 sm:h-48 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  alt="image 4"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-green-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="font-semibold text-base sm:text-lg text-green-800 mb-2 sm:mb-3 text-center">Innovation in Energy Management</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Smart energy management systems and IoT solutions that optimize energy consumption, 
                  reduce costs, and improve overall energy efficiency.
                </p>
              </div>
            </motion.div>

            {/* Get Ahead Of The Curve */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-105 transform"
            >
              <div className="h-40 sm:h-48 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  alt="image 5"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-slate-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="font-semibold text-base sm:text-lg text-slate-700 mb-2 sm:mb-3 text-center">Get Ahead Of The Curve</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Stay informed about emerging trends, market insights, and future opportunities 
                  in the renewable energy sector to maintain competitive advantage.
                </p>
              </div>
            </motion.div>

            {/* Hot Off The Press */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-105 transform sm:col-span-2 lg:col-span-1"
            >
              <div className="h-40 sm:h-48 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  alt="image 6"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-slate-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="font-semibold text-base sm:text-lg text-slate-700 mb-2 sm:mb-3 text-center">Hot Off The Press</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Latest news, press releases, and breaking developments in the renewable energy 
                  industry from leading companies and research institutions.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Companies Spotlight */}
      <section className="px-4 sm:px-6 lg:px-10 py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-green-800 mb-8 lg:mb-12 text-center"
          >
            Companies in the Spotlight
          </motion.h2>
          
          {/* Mobile-First Carousel */}
          <div className="relative overflow-hidden">
            {/* Mobile View - Single Card */}
            <div className="block sm:hidden">
              <motion.div 
                key={currentCompany}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm mx-auto bg-white rounded-lg shadow-2xl"
              >
                <div className="h-48 rounded-t-lg overflow-hidden">
                  <img 
                    src={getCompanyAtPosition(0).image} 
                    alt={getCompanyAtPosition(0).alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg text-gray-800 text-center mb-2">{getCompanyAtPosition(0).name}</h3>
                  <p className="text-sm text-gray-600 text-center">{getCompanyAtPosition(0).description}</p>
                </div>
              </motion.div>
            </div>

            {/* Tablet View - Two Cards */}
            <div className="hidden sm:flex lg:hidden items-center justify-center space-x-6">
              {/* Left Card */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="w-64 h-56 bg-white rounded-lg shadow-lg transform scale-90 opacity-75 transition-all duration-500"
              >
                <div className="h-36 rounded-t-lg overflow-hidden">
                  <img 
                    src={getCompanyAtPosition(-1).image} 
                    alt={getCompanyAtPosition(-1).alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-center text-sm">{getCompanyAtPosition(-1).name}</h3>
                  <p className="text-xs text-gray-600 text-center">Featured Company</p>
                </div>
              </motion.div>

              {/* Center Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-72 h-64 bg-white rounded-lg shadow-2xl transform scale-100 transition-all duration-500 z-10"
              >
                <div className="h-40 rounded-t-lg overflow-hidden">
                  <img 
                    src={getCompanyAtPosition(0).image} 
                    alt={getCompanyAtPosition(0).alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg text-gray-800 text-center mb-2">{getCompanyAtPosition(0).name}</h3>
                  <p className="text-sm text-gray-600 text-center">{getCompanyAtPosition(0).description}</p>
                </div>
              </motion.div>
            </div>

            {/* Desktop View - Three Cards */}
            <div className="hidden lg:flex items-center justify-center space-x-8">
              {/* Left Card (Smaller) */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="w-64 h-48 bg-white rounded-lg shadow-lg transform scale-75 opacity-60 transition-all duration-500 hover:scale-80 hover:opacity-80"
              >
                <div className="h-32 rounded-t-lg overflow-hidden">
                  <img 
                    src={getCompanyAtPosition(-1).image} 
                    alt={getCompanyAtPosition(-1).alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-center">{getCompanyAtPosition(-1).name}</h3>
                  <p className="text-xs text-gray-600 text-center">Featured Company</p>
                </div>
              </motion.div>

              {/* Center Card (Larger) */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-80 h-64 bg-white rounded-lg shadow-2xl transform scale-100 transition-all duration-500 z-10"
              >
                <div className="h-40 rounded-t-lg overflow-hidden">
                  <img 
                    src={getCompanyAtPosition(0).image} 
                    alt={getCompanyAtPosition(0).alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg text-gray-800 text-center mb-2">{getCompanyAtPosition(0).name}</h3>
                  <p className="text-sm text-gray-600 text-center">{getCompanyAtPosition(0).description}</p>
                </div>
              </motion.div>

              {/* Right Card (Smaller) */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-64 h-48 bg-white rounded-lg shadow-lg transform scale-75 opacity-60 transition-all duration-500 hover:scale-80 hover:opacity-80"
              >
                <div className="h-32 rounded-t-lg overflow-hidden">
                  <img 
                    src={getCompanyAtPosition(1).image} 
                    alt={getCompanyAtPosition(1).alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-center">{getCompanyAtPosition(1).name}</h3>
                  <p className="text-xs text-gray-600 text-center">Featured Company</p>
                </div>
              </motion.div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-6 sm:mt-8 pb-8 pt-2 space-x-3">
              {companies.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentCompany ? 'bg-green-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  onClick={() => setCurrentCompany(index)}
                  aria-label={`Go to company ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Project Consultation Section */}
      <section className="px-4 sm:px-6 lg:px-10 py-12 lg:py-16"
        style={{
          background: "linear-gradient(to right, #d4f9d4, #a8f0a8) "
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl p-6 sm:p-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-green-800 mb-6 sm:mb-8 lg:mb-12 text-center leading-tight"
            >
              Does your project require planning or infrastructure consultation or funding?
            </motion.h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Commercial Funding */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-green-300 rounded-lg p-4 sm:p-6 text-center hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-105 transform"
              >
                <h3 className="font-semibold text-sm sm:text-base text-green-800 mb-2">Commercial Funding and Capital Provision</h3>
                <p className="text-xs sm:text-sm text-green-700">Expert financial solutions for your renewable energy projects</p>
              </motion.div>

              {/* Planning & Infrastructure */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-green-300 rounded-lg p-4 sm:p-6 text-center hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-105 transform"
              >
                <h3 className="font-semibold text-sm sm:text-base text-green-800 mb-2">Planning and Infrastructure Consultation</h3>
                <p className="text-xs sm:text-sm text-green-700">Strategic planning and infrastructure development services</p>
              </motion.div>

              {/* Commercial Lending */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-green-300 rounded-lg p-4 sm:p-6 text-center hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-105 transform sm:col-span-2 lg:col-span-1"
              >
                <h3 className="font-semibold text-sm sm:text-base text-green-800 mb-2">Commercial Lending and Capital Provision</h3>
                <p className="text-xs sm:text-sm text-green-700">Flexible lending solutions for sustainable energy initiatives</p>
              </motion.div>
            </div>

            <div className="text-center">
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#4da82f]/50 backdrop-blur-lg border border-[#4da82f]/70 hover:bg-[#4da82f]/80 text-white font-semibold py-3 px-6 sm:px-8 rounded-full transition duration-300 shadow-2xl drop-shadow-[0_0_12px_rgba(77,168,47,0.6)] text-sm sm:text-base"
              >
                Schedule a Call
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Section */}
      <section className="px-4 sm:px-6 lg:px-10 py-6 sm:py-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-between bg-[#a8f0a8] rounded-2xl p-4 sm:p-6 gap-4 sm:gap-6"
          >
            <p className="text-green-800 font-medium text-sm sm:text-base lg:text-lg text-center sm:text-left">
              Like what we are building? Contact us for investment business pack.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#4da82f]/50 backdrop-blur-lg border border-[#4da82f]/70 hover:bg-[#4da82f]/80 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-full transition duration-300 shadow-2xl drop-shadow-[0_0_12px_rgba(77,168,47,0.6)] whitespace-nowrap text-sm sm:text-base"
            >
              Invest in Which Renewables
            </motion.button>
          </motion.div>
        </div>
      </section>
          
      {/* Our Clients Section */}
      <section 
        className="px-4 sm:px-6 lg:px-10 py-12 lg:py-16"
        style={{
          background: "linear-gradient(to right, #d4f9d4, #a8f0a8)"
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 lg:mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-green-800 font-bold text-xl sm:text-2xl lg:text-3xl xl:text-4xl mb-4"
            >
              OUR CLIENTS
            </motion.h2>
          </div>
          
          {/* Client Logos in Responsive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6 lg:gap-8 place-items-center">
            {[1, 2, 3, 4, 5, 6, 7].map((client, index) => (
              <motion.div 
                key={client}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="group relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-green-600 rounded-full 
                          flex flex-col items-center justify-center cursor-pointer
                          transform transition-all duration-300 ease-in-out
                          hover:bg-green-700 hover:shadow-2xl
                          hover:shadow-green-800/50"
              >
                <span className="text-white font-bold text-xs sm:text-sm group-hover:text-sm sm:group-hover:text-base transition-all duration-300">
                  Client
                </span>
                <span className="text-white font-bold text-xs group-hover:text-xs transition-all duration-300">
                  Logo
                </span>
                
                {/* Hover overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-green-800/20 to-transparent 
                              rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Ripple effect on hover */}
                <div className="absolute inset-0 rounded-full border-2 border-green-400 
                              scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-30 
                              transition-all duration-500"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      

      {/* Testimonials Section */}
      <section className="px-4 sm:px-6 lg:px-10 py-12 lg:py-16 bg-gray-50">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-green-800 mb-6 lg:mb-12 text-center"
        >
          What Our Community Says
        </motion.h2>

        <TestimonialCarousel
          interval={5000}
          testimonials={[
            {
              quote: "Which Renewables connected us with clients we never imagined reaching.",
              name: "Sanjay Maheswaran",
              role: "CEO",
            },
            {
              quote: "The platform is a game-changer for renewable energy professionals.",
              name: "Sanjay Kumar",
              role: "Founder",
            },
            {
              quote: "A must-have hub for procurement and sustainability teams.",
              name: "Sanjay Maheswaran",
              role: "Co-Founder",
            },
          ]}
        />
      </section>

    </div>
  );
}

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/agriculture" element={<Agriculture />} />
        <Route path="/construction" element={<Construction />} />
        <Route path="/industrial" element={<Industrial/>} />
        <Route path="/domestic" element={<Domestic/>} />
        <Route path="/comercial" element={<Comercial />} />
        <Route path="/gh-products-services" element={<GHProductsServices />} />
        <Route path="/titan-products-services" element={<TitanProductsServices />} />
        <Route path="/case-studies" element={<CaseStudies />} />


      </Routes>
     {/* Footer */}
     <div>
        <Footer/>
      </div>
    </div>
  );
}

export default App;

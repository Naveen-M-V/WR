import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail, Globe, Users, Award, Calendar, Building, DollarSign, Clock, CheckCircle, Zap, Battery, Plug } from "lucide-react";
import ScrollingBanner from "./home/ScrollingBanner";

const SigeneryProductsServices = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const companyData = location.state?.company || {
    title: "Sigenergy",
    content: "Sigenergy is a forward-thinking clean-tech company dedicated to building cutting-edge home and business energy solutions. With a strong commitment to sustainability and technological advancement, Sigenergy develops next-generation products, including energy storage systems, solar inverters, and EV charging solutions, empowering individuals and businesses to achieve true energy independence. At the core of Sigenergy's success is its world-class R&D team, composed of hundreds of industry experts who share a common mission: to make the world greener through continuous innovation. By integrating the latest developments in power electronics, digital technologies, and artificial intelligence, Sigenergy engineers' products deliver all-around safety, ultra-simplicity, and outstanding performance.",
    region: "UK, Europe, Africa, Ireland",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  };

  const [activeTab, setActiveTab] = useState("overview");

  const products = [
    {
      title: "SigenStor 5-in-One Home Energy Storage System",
      description: "The flagship all-in-one system integrating solar inverter, battery pack, energy management system (EMS), and EV charging capability (both AC and optional DC).",
      image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      features: [
        "Solar Energy Storage (5–48 kWh per stack)",
        "Integrated Solar Inverter",
        "AC & DC EV Charging",
        "Energy Independence & Backup Power",
        "Scalable Modular Design",
        "Smart Energy Management System"
      ]
    },
    {
      title: "SigenStor EV Charging Solutions",
      description: "Advanced EV charging modules offering both AC and DC charging options, powered by solar generation or stored battery energy for green charging.",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      features: [
        "22 kW AC Charger",
        "12 kW & 25 kW DC Charger Options",
        "Solar-Powered Charging",
        "Battery-Powered Charging",
        "Fast Charging Capability",
        "Green Energy Integration"
      ]
    },
    {
      title: "SigenStack - Commercial & Industrial Storage",
      description: "Modular hybrid inverter and battery pack system designed for larger commercial and industrial energy storage projects with proven fire safety.",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      features: [
        "Modular Hybrid Inverter",
        "Scalable Battery Packs",
        "C&I Scale Storage",
        "Advanced Fire Containment",
        "Dense Deployment Capable",
        "Production-Grade Reliability"
      ]
    }
  ];

  const companyStats = [
    { icon: Users, label: "R&D Experts", value: "100+" },
    { icon: Award, label: "Global Presence", value: "4 Continents" },
    { icon: Calendar, label: "Industry Experience", value: "Decades" },
    { icon: Zap, label: "Energy Solutions", value: "Complete" }
  ];

  const projects = [
    {
      title: "20 MWh Utility-Scale Energy Storage - Bulgaria",
      client: "Local Energy Company Partnership",
      location: "Bulgaria",
      value: "20 MWh",
      completion: "June 2025",
      image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      overview: "Sigenergy successfully completed a 20 MWh utility-scale co-located energy storage project in Bulgaria in partnership with a local energy company. This landmark project demonstrates Sigenergy's capability to deliver large-scale commercial energy storage solutions that support grid stability and renewable energy integration across Europe.",
      keyFeatures: [
        {
          title: "Utility-Scale Deployment",
          description: "20 MWh capacity demonstrating Sigenergy's ability to handle large-scale energy storage requirements."
        },
        {
          title: "Grid Integration",
          description: "Seamless integration with local energy infrastructure supporting renewable energy adoption."
        },
        {
          title: "Partnership Model",
          description: "Collaborative approach with local energy providers ensuring sustainable long-term operation."
        },
        {
          title: "European Expansion",
          description: "Strategic project establishing Sigenergy's presence in Central Europe's renewable energy market."
        }
      ],
      outcomes: [
        "Successfully deployed 20 MWh of energy storage capacity",
        "Enhanced grid stability and renewable energy integration in Bulgaria",
        "Established strategic partnership with local energy provider",
        "Demonstrated scalability of SigenStack technology at utility scale"
      ],
      impact: "This Bulgarian project marks a significant milestone for Sigenergy's expansion into utility-scale energy storage. It showcases the company's technical expertise and reliability in delivering large-scale solutions that support Europe's transition to renewable energy."
    },
    {
      title: "UK Residential Installation - 6-Month Performance Report",
      client: "Spirit Energy (UK Installer)",
      location: "United Kingdom",
      value: "Residential Installation",
      completion: "September 2025",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      overview: "A comprehensive 6-month performance report from Spirit Energy (UK installer/reseller) showcases the reliability and effectiveness of SigenStor in UK residential applications. First installations were completed in April 2025, with the system delivering expected benefits in solar generation, storage, and home energy management.",
      keyFeatures: [
        {
          title: "Modular Stackable Design",
          description: "Reliable controller and battery modules with new 6 kWh and 10 kWh options added mid-2025."
        },
        {
          title: "Flexible Inverter Range",
          description: "3–12 kW inverter with multiple MPPTs supporting varied rooftop shapes and solar configurations."
        },
        {
          title: "Smart Energy Modes",
          description: "Solar self-consumption mode, time-of-use tariff optimization, and backup power capability."
        },
        {
          title: "Safety & Stability",
          description: "Proven safety performance and stable operation over six months of continuous use."
        }
      ],
      outcomes: [
        "Delivered expected solar generation and storage benefits over 6-month period",
        "Demonstrated modular expandability with new battery module sizes",
        "Achieved stable performance and reliability in UK climate conditions",
        "Positioned as strong contender in UK battery market alongside established alternatives"
      ],
      impact: "The UK residential case study validates SigenStor as a viable and reliable alternative for UK homeowners seeking energy independence. Spirit Energy's endorsement and positive performance metrics establish Sigenergy as a trusted partner for residential energy storage solutions in the UK market."
    },
    {
      title: "African Energy Storage Deployment",
      client: "Regional Energy Partners",
      location: "Africa",
      value: "Multiple Installations",
      completion: "Ongoing 2025",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      overview: "Sigenergy has deployed next-generation storage solutions across Africa, addressing the continent's unique energy challenges. These installations demonstrate the company's commitment to bringing sustainable energy solutions to emerging markets and supporting Africa's transition to renewable energy.",
      keyFeatures: [
        {
          title: "Climate Adaptability",
          description: "Solutions designed for Africa's diverse climate conditions and energy infrastructure challenges."
        },
        {
          title: "Scalable Solutions",
          description: "From residential to commercial installations supporting various market segments."
        },
        {
          title: "Local Partnership",
          description: "Collaboration with regional energy partners ensuring sustainable deployment and support."
        },
        {
          title: "Energy Independence",
          description: "Enabling communities and businesses to achieve energy self-sufficiency."
        }
      ],
      outcomes: [
        "Successfully deployed storage solutions across multiple African locations",
        "Addressed critical energy challenges in emerging markets",
        "Established Sigenergy's presence in African renewable energy sector",
        "Supported local energy transition initiatives"
      ],
      impact: "Sigenergy's African deployment demonstrates its commitment to global sustainability. By bringing advanced energy storage technology to emerging markets, the company is helping bridge energy gaps and supporting Africa's transition toward renewable energy independence."
    }
  ];

  const innovations = [
    {
      title: "AI-Powered Energy Management",
      description: "Machine learning algorithms automatically optimize energy flows based on PV output forecasts, dynamic tariffs, and household usage patterns.",
      icon: Zap
    },
    {
      title: "mySigen Smart App",
      description: "Full visibility and control over energy generation, storage, and consumption with real-time monitoring and smart scheduling.",
      icon: Plug
    },
    {
      title: "V2H & V2G Technology",
      description: "Vehicle-to-Home and Vehicle-to-Grid capabilities enabling electric vehicles to act as part of the home's energy ecosystem.",
      icon: Battery
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <ScrollingBanner />
      {/* Header */}
      <div className="relative pt-10 h-64 bg-gradient-to-r from-cyan-600 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-6 p-4 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Company Details</h1>
            <p className="text-cyan-100 text-lg">{companyData.title}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-4"
      >
        <div className="mt-10 relative rounded-2xl overflow-hidden mx-4">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/15 via-blue-400/10 to-blue-300/5 backdrop-blur-lg border border-cyan-400/30"></div>
          <div className="relative z-10 p-2">
            <div className="flex flex-wrap gap-2">
              {["overview", "products", "innovation", "blogs", "events", "casestudy"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-cyan-500/30 text-cyan-100 shadow-lg"
                      : "text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-300"
                  }`}
                >
                  {tab === "casestudy" ? "Case Study" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        {/* Company Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative rounded-3xl overflow-hidden">
            {/* Glass Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-400/10 to-blue-300/5 backdrop-blur-xl border border-cyan-400/30 shadow-2xl"></div>
            
            <div className="relative z-10 p-8">
              <div className="flex flex-col lg:flex-row items-start gap-8">
                {/* Company Image */}
                <div className="flex-shrink-0">
                  <img
                    src={companyData.image}
                    alt={companyData.title}
                    className="w-32 h-32 rounded-2xl object-cover border border-cyan-400/40 shadow-lg"
                  />
                </div>

                {/* Company Info */}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-4">{companyData.title}</h2>
                  <p className="text-gray-300 mb-4 leading-relaxed text-justify">{companyData.content}</p>
                  
                  <div className="flex items-center text-cyan-400 mb-6">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span className="font-medium">{companyData.region}</span>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center text-gray-300">
                      <Globe className="w-4 h-4 mr-2 text-cyan-400" />
                      <span>www.sigenergy.com</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Mail className="w-4 h-4 mr-2 text-cyan-400" />
                      <span>info@sigenergy.com</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Zap className="w-4 h-4 mr-2 text-cyan-400" />
                      <span>Global Operations</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  {companyStats.map((stat, index) => (
                    <div
                      key={index}
                      className="text-center p-4 rounded-xl bg-cyan-500/10 border border-cyan-400/20 
                                transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-cyan-500/20"
                    >
                      <stat.icon className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content based on active tab */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12"
          >
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-blue-400/8 to-blue-300/5 backdrop-blur-xl border border-cyan-400/30 shadow-xl"></div>
              <div className="relative z-10 p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Why Choose Sigenergy?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-cyan-400 mb-2">World-Class Innovation</h4>
                    <p className="text-gray-300 leading-relaxed">
                      Our team of hundreds of industry experts is dedicated to continuous innovation in power electronics, digital technologies, and artificial intelligence. We deliver products that combine all-around safety, ultra-simplicity, and outstanding performance.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-cyan-400 mb-2">Global Commitment</h4>
                    <p className="text-gray-300 leading-relaxed">
                      With a rapidly expanding global footprint across Europe, Africa, and beyond, Sigenergy is committed to becoming the most trusted partner for homes, industries, and communities transitioning toward a sustainable future.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "products" && (
          <>
            <div>
              <h2 className="text-3xl font-bold text-cyan-400 mb-2">PRODUCTS & SOLUTIONS</h2>
            </div>
            
            {/* Products Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map((product, index) => (
                  <div key={index} className="relative rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-500">
                    {/* Glass Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-400/10 to-blue-300/5 group-hover:from-cyan-500/30 group-hover:via-blue-400/20 group-hover:to-blue-300/10 backdrop-blur-xl border border-cyan-400/30 group-hover:border-cyan-400/50 shadow-lg group-hover:shadow-2xl group-hover:shadow-cyan-500/20 transition-all duration-500"></div>
                    
                    <div className="relative z-10 p-6">
                      {/* Product Image */}
                      <div className="mb-6">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-48 object-cover rounded-xl border border-cyan-400/30 group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Product Content */}
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                        {product.title}
                      </h3>
                      <p className="text-gray-300 mb-4 group-hover:text-gray-200 transition-colors duration-300">
                        {product.description}
                      </p>

                      {/* Features */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-cyan-400 mb-2">Key Features:</h4>
                        {product.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center text-sm text-gray-300">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                            {feature}
                          </div>
                        ))}
                      </div>

                      {/* Action Button */}
                      <button className="mt-6 w-full px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/30 hover:border-cyan-400/60 backdrop-blur-md transition-all duration-300 text-white hover:text-cyan-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105">
                        Learn More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {activeTab === "innovation" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12"
          >
            <div>
              <h2 className="text-3xl font-bold text-cyan-400 mb-8">INNOVATION & TECHNOLOGY</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {innovations.map((innovation, index) => (
                <div key={index} className="relative rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-400/10 to-blue-300/5 group-hover:from-cyan-500/30 group-hover:via-blue-400/20 group-hover:to-blue-300/10 backdrop-blur-xl border border-cyan-400/30 group-hover:border-cyan-400/50 shadow-lg group-hover:shadow-2xl group-hover:shadow-cyan-500/20 transition-all duration-500"></div>
                  
                  <div className="relative z-10 p-8">
                    <innovation.icon className="w-12 h-12 text-cyan-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                      {innovation.title}
                    </h3>
                    <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                      {innovation.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Innovation Details */}
            <div className="mt-8 relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-blue-400/8 to-blue-300/5 backdrop-blur-xl border border-cyan-400/30 shadow-xl"></div>
              <div className="relative z-10 p-8">
                <h4 className="text-2xl font-bold text-white mb-4">Smart Scheduling & Optimization</h4>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Sigenergy's AI-powered systems automatically optimize energy flows based on PV output forecasts, dynamic tariff pricing, and household energy usage patterns. This intelligent scheduling maximizes self-consumption, optimizes battery charging/discharging cycles, and minimizes reliance on grid power.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-400/20">
                    <h5 className="font-semibold text-cyan-400 mb-2">Real-Time Monitoring</h5>
                    <p className="text-gray-300 text-sm">Full visibility and control through the mySigen App with real-time generation, consumption, and battery status tracking.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-400/20">
                    <h5 className="font-semibold text-cyan-400 mb-2">Vehicle Integration</h5>
                    <p className="text-gray-300 text-sm">V2H and V2G capabilities enable electric vehicles to act as part of the home's energy storage and supply ecosystem.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Blogs Tab Content */}
        {activeTab === "blogs" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <h2 className="text-3xl font-bold text-cyan-400 mb-8">BLOGS & ARTICLES</h2>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-blue-400/8 to-blue-300/5 backdrop-blur-xl border border-cyan-400/30 shadow-xl"></div>
              <div className="relative z-10 p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-400/30">
                    <span className="text-cyan-400 font-semibold text-sm">July 7, 2025</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Battery Pack-Level Fire Safety Proven in SigenStack Stress Test</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  To rigorously validate the safety performance of its commercial and industrial energy storage system, under extreme fire scenarios, Sigenergy recently completed a full-scale combustion test on its SigenStack system. Despite the complete removal of active safety mechanisms, the system successfully contained the fire within a single battery pack, preventing thermal runaway or flame spread to adjacent modules or racks.
                </p>
                
                <h4 className="text-xl font-bold text-cyan-400 mb-4">Fire Containment Validated at Battery-Pack Level</h4>
                <p className="text-gray-300 leading-relaxed mb-6">
                  This test replicated one of the most extreme conditions for energy storage systems: a sustained open-flame fire triggered by cell-level thermal runaway. To push the system to its limits, Sigenergy disabled all active protections—including built-in fire suppression modules, pressure relief valves, and software-based sensors for temperature and smoke—relying solely on the system's passive structural defenses. Heat was applied to 25% of the cells within a battery pack to simulate worst-case ignition.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="p-6 rounded-xl bg-cyan-500/10 border border-cyan-400/20">
                    <h5 className="font-bold text-cyan-400 mb-3">Test Setup</h5>
                    <ul className="text-gray-300 text-sm space-y-2">
                      <li>• 20 cm spacing between battery racks (front-to-back)</li>
                      <li>• 30 cm side-to-side spacing</li>
                      <li>• Full-size production units used</li>
                      <li>• Dense deployment scenario simulation</li>
                    </ul>
                  </div>
                  <div className="p-6 rounded-xl bg-cyan-500/10 border border-cyan-400/20">
                    <h5 className="font-bold text-cyan-400 mb-3">Test Results</h5>
                    <ul className="text-gray-300 text-sm space-y-2">
                      <li>• Peak cell temperature: 300°C+</li>
                      <li>• Affected pack surface: 264.65°C</li>
                      <li>• Adjacent packs remained: &lt;31°C</li>
                      <li>• Fire contained in ~30 minutes</li>
                    </ul>
                  </div>
                </div>

                <p className="text-gray-300 leading-relaxed mb-6">
                  During testing, the targeted cell temperature peaked above 300°C. The directly ignited pack's surface reached 264.65°C, yet no thermal runaway occurred in any internal cells. All surrounding packs remained below 31°C. After approximately 30 minutes, flames subsided and combustion remained localized within the affected pack, without propagating to adjacent modules.
                </p>

                <p className="text-gray-300 leading-relaxed mb-6">
                  These results demonstrate that SigenStack can successfully contain even severe internal fires within a single battery pack, highlighting its robust thermal suppression and structural integrity.
                </p>

                <a 
                  href="https://www.sigenergy.com/us/news/info/1986.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/30 hover:border-cyan-400/60 backdrop-blur-md transition-all duration-300 text-white hover:text-cyan-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Read Full Article →
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* Events Tab Content */}
        {activeTab === "events" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <h2 className="text-3xl font-bold text-cyan-400 mb-8">NEWS & EVENTS</h2>
            </div>
            
            <div className="space-y-8">
              {/* UK Event */}
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-blue-400/8 to-blue-300/5 backdrop-blur-xl border border-cyan-400/30 shadow-xl"></div>
                <div className="relative z-10 p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-400/30">
                      <span className="text-cyan-400 font-semibold text-sm">September 19, 2025</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Spirit Energy (UK) Publishes 6-Month SigenStor Update</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Spirit Energy published a comprehensive blog titled "Sigenergy Sigenstor 6 Month Update". According to the article, Spirit Energy began offering SigenStor in the UK in January 2025, with first installations completed in April.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-400/20">
                      <h4 className="font-semibold text-cyan-400 mb-2">Performance Highlights</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Modular stackable design proven reliable</li>
                        <li>• New 6 kWh & 10 kWh battery modules added</li>
                        <li>• 3–12 kW inverter with multiple MPPTs</li>
                        <li>• Stable 6-month performance</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-400/20">
                      <h4 className="font-semibold text-cyan-400 mb-2">Smart Features</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Solar self-consumption mode</li>
                        <li>• Time-of-use tariff optimization</li>
                        <li>• Backup with optional Energy Gateway</li>
                        <li>• Strong UK market contender</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">
                    The piece frames SigenStor as "a strong contender in the UK battery market," noting it as a viable non-Tesla alternative for home energy storage and solar + battery + (optionally) EV charging + backup systems.
                  </p>
                </div>
              </div>

              {/* Ireland Event */}
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-blue-400/8 to-blue-300/5 backdrop-blur-xl border border-cyan-400/30 shadow-xl"></div>
                <div className="relative z-10 p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-400/30">
                      <span className="text-cyan-400 font-semibold text-sm">July 10, 2025</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Infinite Energy Ireland - SigenStor Partnership Launch</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Infinite Energy — a renewable-energy installer in Ireland — published an article titled "Sigenergy SigenStor: The Smarter Solar PV System for Irish Homes". The article promotes SigenStor as "designed for real-world conditions," particularly noting suitability for Ireland's varied weather.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-400/20">
                      <h4 className="font-semibold text-cyan-400 mb-2">Irish-Specific Features</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Battery heating pads for cold winters</li>
                        <li>• IP66 weatherproof rating</li>
                        <li>• Built-in fire-suppression system</li>
                        <li>• Indoor/outdoor installation options</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-400/20">
                      <h4 className="font-semibold text-cyan-400 mb-2">Complete Ecosystem</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Scalable modular storage</li>
                        <li>• EV-charger compatibility</li>
                        <li>• Smart load management</li>
                        <li>• On-grid, off-grid, hybrid modes</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">
                    It emphasizes SigenStor as a "complete, future-proof energy ecosystem" appealing to Irish homeowners looking to reduce energy bills, prepare for EV adoption, or future-proof their home's energy system.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Case Study Tab Content */}
        {activeTab === "casestudy" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <h2 className="text-3xl font-bold text-cyan-400 mb-8">CASE STUDIES</h2>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-blue-400/8 to-blue-300/5 backdrop-blur-xl border border-cyan-400/30 shadow-xl"></div>
              <div className="relative z-10 p-8">
                <h3 className="text-2xl font-bold text-white mb-4">UK Residential Installation — 6-Month Performance Report</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  A UK installer/reseller published a comprehensive "6-month update" of a home using SigenStor installed in April 2025. This case study showcases the real-world performance and reliability of Sigenergy's flagship energy storage system in UK residential applications.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-6 rounded-xl bg-cyan-500/10 border border-cyan-400/20">
                    <h4 className="font-bold text-cyan-400 mb-4">System Performance</h4>
                    <ul className="text-gray-300 space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Stackable modular design worked reliably over 6 months</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span>New 6 kWh & 10 kWh battery modules added mid-2025</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Delivered expected solar generation & storage benefits</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Stable performance throughout testing period</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 rounded-xl bg-cyan-500/10 border border-cyan-400/20">
                    <h4 className="font-bold text-cyan-400 mb-4">Technical Specifications</h4>
                    <ul className="text-gray-300 space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span>3–12 kW inverter range with multiple MPPTs</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Flexible for different rooftop shapes & solar setups</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Time-of-use charging & self-consumption modes</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Modular expandability for future upgrades</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="relative rounded-xl overflow-hidden p-6 bg-gradient-to-br from-cyan-500/20 via-blue-400/10 to-blue-300/5 border border-cyan-400/30">
                  <h4 className="font-bold text-cyan-400 mb-3">Key Takeaways</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    The surplus solar energy could be stored or utilized using features like time-of-use charging or self-consumption mode. The unit's safety, modular expandability (adding more battery modules later), and performance stability were highlighted — suggesting SigenStor is a viable alternative to more established home energy storage options in the UK market.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    This case study validates Sigenergy's commitment to delivering reliable, scalable, and user-friendly energy storage solutions for UK homeowners seeking energy independence and cost savings.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}


      </div>
    </div>
  );
};

export default SigeneryProductsServices;

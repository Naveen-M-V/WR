import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPin, Phone, Mail, Globe, Users, Award, Calendar, Building, DollarSign, Clock, CheckCircle, Zap, Battery, Plug, TrendingUp, Shield, Cloud, Cpu } from "lucide-react";
import ScrollingBanner from "./home/ScrollingBanner";

const MaxxenProductsServices = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const companyData = location.state?.company || {
    title: "Maxxen Energy AG",
    content: "Leading European Battery Energy Storage System (BESS) manufacturer with Swiss engineering and European compliance",
    region: "Switzerland, Amsterdam, Istanbul, Turkey",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  };

  const [activeTab, setActiveTab] = useState("overview");

  const products = [
    {
      title: "X-Series DC Container (5+ MWh)",
      description: "Utility-scale liquid-cooled BESS container for grid applications",
      image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      features: [
        "5+ MWh per container capacity",
        "314 Ah LFP cells with long cycle life",
        "AI-based fault detection",
        "Integrated fire suppression system",
        "Aerogel insulation",
        "Operating range: −30°C to +55°C",
        "IEC, UL 9540A, NFPA 855 certified",
        "UN 38.3 and EU Battery Regulation 2023/1542 compliant"
      ],
      idealFor: "Utility-scale storage, solar shifting, peak shaving, frequency regulation, grid-forming systems"
    },
    {
      title: "X-Series MV Skid (2.5 MW / 5.0 MW)",
      description: "Medium-voltage AC power conversion & grid integration module",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      features: [
        "2.5 MW and 5 MW configurations",
        "Robust AC system with galvanic isolation",
        "Reactive power support up to 5,250 kVAr",
        "AI-based fault monitoring",
        "Grid-forming & black-start capabilities",
        "THDi: <3%",
        "IEC, EN, and NF-compliant",
        "Voltage: 6–35 kV (customizable)"
      ],
      idealFor: "Hybrid plants, utility storage, solar farms, wind farms, and microgrids"
    },
    {
      title: "X-Series X-Core Cloud",
      description: "Predictive, reactive, and preventive energy intelligence platform",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      features: [
        "Real-time cell-level monitoring (30-second resolution)",
        "Predictive maintenance powered by AI",
        "Insurance & liability reporting",
        "Fast warranty decision-making",
        "Data stored securely in Switzerland",
        "Large-scale fleet analytics",
        "Machine-learning models for anomaly detection",
        "Open integration with existing BMS systems"
      ],
      idealFor: "Project owners, operators, insurers, asset managers, utilities requiring high uptime and advanced analytics"
    },
    {
      title: "X-Series X-Core EMS / PPC",
      description: "Complete on-premise + cloud plant controller",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      features: [
        "Controls BESS, PV, wind, hybrid plants",
        "Manages frequency response and voltage control",
        "Inertia support capability",
        "Customizable interface",
        "Real-time alarms and dispatch control",
        "Plant visualization dashboard",
        "Grid-forming & black-start support",
        "Integration with BoP & third-party systems"
      ],
      idealFor: "Grid-connected renewable plants, multi-asset sites, large storage operators"
    },
    {
      title: "X-Series AC Cabinet (250+ kWh)",
      description: "Plug-and-play AC C&I energy storage system",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      features: [
        "250+ kWh modular AC system",
        "Integrated PCS with small footprint",
        "Liquid cooling + fire suppression",
        "Suitable for commercial buildings & industry",
        "Grid-forming capabilities",
        "IP55 protection level",
        "IEC/UL/NFPA certified",
        "Wide ambient operating range"
      ],
      idealFor: "C&I facilities, EV charging hubs, microgrids, backup power"
    }
  ];

  const companyStats = [
    { icon: Battery, label: "BESS Delivered", value: "1.5 GWh" },
    { icon: Zap, label: "Solar/BESS EPC", value: "1.7 GW" },
    { icon: TrendingUp, label: "Assets Under Management", value: "3 GW" },
    { icon: Award, label: "Manufacturing Facility", value: "5 GWh LEED-Gold" }
  ];

  const caseStudies = [
    {
      title: "EU-Funded Solar-Plus-Storage in Spain",
      theme: "Grant-ready, Made-in-Europe hybrid solar + BESS",
      client: "Renewable IPP in Spain",
      location: "Spain (Iberia Market)",
      value: "50 MWp solar + BESS",
      completion: "2025",
      image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      overview: "A renewable IPP in Spain is bidding into multiple IDAE and REPowerEU-aligned grant schemes. To qualify, their 50 MWp solar plant must add compliant energy storage with strong local content, full documentation, and cyber-secure control systems. Maxxen is selected as the storage partner due to its European manufacturing footprint, grant-ready documentation, and traceable supply chain.",
      challenges: [
        {
          title: "Compliance with Made in Europe & national grant rules",
          solution: "Supplies storage solution assembled and integrated in Europe, using carbon-neutral plant in Türkiye under Swiss-led engineering umbrella. Provides complete documentation packages aligned to IDAE, PNRR, and REPowerEU expectations."
        },
        {
          title: "Grid-forming, hybrid plant integration",
          solution: "Integrates X-Core EMS/PPC to coordinate PV, inverters, and BESS at plant level. Uses X-Series DC Containers with wide operating temperature ranges and advanced fire protection."
        },
        {
          title: "Bankability, warranties, and asset life",
          solution: "Uses bankable LFP technology with IEC, UL 9540A, NFPA 855 compliance. Wraps system in long-term warranty and O&M with Munich RE-backed insurance and performance guarantees."
        }
      ],
      outcomes: [
        "Project qualifies for EU and national funding thanks to compliant, grant-ready documentation",
        "Hybridization allows IPP to shift production into higher-price hours, stabilizing revenues",
        "Modeled payback under three years with storage revenues and grants combined",
        "Asset provides grid-support functions improving regional grid stability"
      ],
      impact: "The project demonstrates that European-engineered BESS can compete on both performance and compliance, supporting Maxxen's positioning as a European benchmark in energy storage."
    },
    {
      title: "Product Lease BESS for Mid-Sized Developer",
      theme: "Zero-CAPEX grid-scale storage via vendor financing",
      client: "Independent Power Producer (IPP)",
      location: "Eastern Europe (Romania/Bulgaria)",
      value: "20–30 MWh BESS",
      completion: "2025",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      overview: "A mid-sized IPP in Eastern Europe wants to deploy a 20–30 MWh BESS asset next to an existing solar portfolio but struggles to secure cost-effective project finance. Maxxen structures the solution as a long-term product lease with predictable OPEX fees.",
      challenges: [
        {
          title: "Difficulty arranging classic project finance for mid-sized storage",
          solution: "Offers 0–10% down payment, 5/10/15-year tenors, EUR-based payments, including long-term warranty, O&M and performance guarantees bundled into the lease."
        },
        {
          title: "Technology risk & end-of-life uncertainty",
          solution: "Lease structure keeps technology and residual-value risk with Maxxen, supported by Munich RE's insurance and commitment to second-life and recycling."
        },
        {
          title: "Need for fast deployment with limited internal engineering capacity",
          solution: "Provides turnkey scope: product sale/lease + EPC via Kontek Group or partner EPCs, plus LTSA (long-term service agreement)."
        }
      ],
      outcomes: [
        "Developer gets grid-scale BESS online without upfront CAPEX",
        "Lease payments are fully predictable OPEX, simplifying budgeting",
        "BESS revenues from arbitrage and ancillary services contribute to sub-3-year payback",
        "Structure proves repeatable for portfolio of leased BESS assets across region"
      ],
      impact: "Demonstrates innovative financing model enabling mid-sized developers to access utility-scale storage without traditional project finance barriers."
    },
    {
      title: "C&I Peak Shaving & EV Charging Hub",
      theme: "Behind-the-meter decarbonisation for industry and mobility",
      client: "Logistics and Light-Industry Park",
      location: "Turkey / Germany",
      value: "Multiple AC Cabinets + PV + EV Chargers",
      completion: "2025",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      overview: "A logistics and light-industry park is experiencing rapid increases in grid demand charges, capacity constraints for EV fleet chargers, and pressure to reduce Scope 2 emissions. The operator deploys X-Series AC Cabinets combined with rooftop PV and fast chargers.",
      challenges: [
        {
          title: "Grid capacity limits and high peak tariffs",
          solution: "AC Cabinets operate in peak-shaving mode, discharging during peak tariff windows. X-Core EMS optimizes dispatch for cost and self-consumption."
        },
        {
          title: "Safety and reliability in busy industrial site",
          solution: "Uses LFP chemistry, liquid cooling, gas/smoke/heat detection, and integrated fire suppression. IP55 protection level with wide ambient operating range."
        },
        {
          title: "Future-proofing for additional chargers and load growth",
          solution: "Modular cabinet design allows adding more cabinets as EV fleet grows. X-Core Cloud provides remote fleet monitoring and predictive maintenance."
        }
      ],
      outcomes: [
        "Significant reduction in peak demand charges and improved PV self-consumption",
        "Reliable power for EV chargers enables fleet electrification without expensive grid upgrade",
        "Site operator demonstrates CO₂ reductions from higher renewable utilization",
        "Predictive maintenance reduces unplanned outages and improves asset availability"
      ],
      impact: "Showcases how modular BESS solutions enable industrial decarbonization while improving operational efficiency and cost management."
    },
    {
      title: "Grid-Balancing BESS in Volatile European Market",
      theme: "Arbitrage and ancillary services in Germany / wider EU",
      client: "Trading-Oriented IPP",
      location: "Germany",
      value: "50–100 MWh Grid-Connected BESS",
      completion: "2025",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      overview: "A trading-oriented IPP in Germany wants to capture value from day-ahead and intraday price volatility, frequency containment and reserve markets, and capacity firming for renewable PPAs. They build a 50–100 MWh grid-connected BESS using X-Series DC Containers.",
      challenges: [
        {
          title: "Monetizing multiple revenue streams in saturated BESS market",
          solution: "Configures X-Core EMS/PPC to stack services (arbitrage + primary reserve + balancing) within grid-code limits. Provides modeling support for business case optimization."
        },
        {
          title: "Cybersecurity and data residency",
          solution: "All operational and performance data stored on Swiss servers, supporting compliance with strict European data privacy and cybersecurity standards including NIS2-aligned practices."
        },
        {
          title: "Long-term reliability under heavy cycling",
          solution: "Uses high-cycle LFP chemistry designed for 10,000+ cycles, backed by Munich RE-supported performance guarantees. X-Core Cloud detects degradation trends."
        }
      ],
      outcomes: [
        "Asset earns revenue from arbitrage + ancillary services tailored to Germany's BESS revenue stack",
        "Predictive maintenance & strong warranties increase bankability",
        "Encourages lenders to fund additional storage capacity",
        "Demonstrates European-engineered BESS can compete with imported alternatives"
      ],
      impact: "Validates Maxxen's positioning as a European benchmark in energy storage with competitive performance and compliance advantages."
    }
  ];

  const innovations = [
    {
      title: "BMS in the Cloud – X-Core Cloud (Energy AI Platform)",
      description: "Cloud-based battery intelligence layer that sits above local BMS/EMS",
      features: [
        "Real-time monitoring & remote access with live visualization",
        "AI-powered fault prediction & optimization using machine learning",
        "Preventive, reactive & predictive maintenance workflows",
        "Centralized fleet view aggregating multiple plants and systems",
        "Warranty & insurance support with full event history",
        "Open integration using existing BMS communication channels",
        "Cell telemetry updated every 30 seconds",
        "Data stored securely in Switzerland"
      ],
      benefits: [
        "Higher Availability / Lower O&M Cost through predictive maintenance",
        "Faster Root-Cause Analysis & Warranty Handling with cell-level data",
        "Better Lifetime & Degradation Management based on real SoH",
        "Fleet Learning Effect sharing insights across projects"
      ]
    },
    {
      title: "Grid-Forming Technology (X-Core EMS + X-Series Power Electronics)",
      description: "Grid-forming capability enabling BESS to set voltage and frequency reference",
      features: [
        "Plant-level coordination managing BESS, PV, wind as single system",
        "Frequency & voltage regulation with energy shifting",
        "Real-time EMS control with fast frequency regulation",
        "Inertia support via PPC",
        "Grid-forming MV Skid for grid-forming & black-start scenarios",
        "Integrated medium-voltage architecture with galvanic isolation",
        "Native support for BESS + PV + wind hybridization",
        "Customizable integration to BoP & 3rd-party systems"
      ],
      benefits: [
        "Higher Renewable Penetration with virtual synchronous machine effect",
        "Better System Stability & Fault Response with instant disturbance response",
        "Islanded / Microgrid Operation capability",
        "Black-Start Capability for grid re-energization",
        "Revenue Stacking from frequency services, voltage support, capacity markets"
      ]
    }
  ];

  const tabOptions = [
    { id: "overview", label: "Company Overview" },
    { id: "products", label: "Products" },
    { id: "case-studies", label: "Case Studies" },
    { id: "innovations", label: "Innovations" },
    { id: "credentials", label: "Credentials" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <ScrollingBanner />
      
      {/* Header */}
      <div className="relative pt-10 h-64 bg-gradient-to-r from-cyan-600 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div>
            <h1 className="text-6xl pt-10 pl-8 font-bold text-white mb-2">{companyData.title}</h1>
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
              {tabOptions.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50"
                      : "bg-white/10 text-cyan-100 hover:bg-white/20"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Company Profile */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-lg border border-cyan-400/30 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-cyan-400 mb-6">Company Profile</h2>
              <div className="space-y-4 text-gray-300">
                <p className="text-lg leading-relaxed">
                  Maxxen Energy AG is a leading European Battery Energy Storage System (BESS) manufacturer, headquartered in Switzerland, with operations across Amsterdam, Istanbul, Zurich, and a 5 GWh LEED-Gold certified manufacturing facility in Turkey.
                </p>
                <p className="text-lg leading-relaxed">
                  Backed by the Kontek Group (a profitable 30+ year-old energy company with £200M annual sales and BBB+ credit rating) and supported by Munich RE insurance guarantees, Maxxen ensures a uniquely bankable, safe, and performance-driven BESS offering for utility, industrial, and grid-scale deployments.
                </p>
                <p className="text-lg leading-relaxed">
                  With Swiss engineering, European compliance, and AI-powered cloud controls, Maxxen is building the energy transition of the future — accessible, reliable, sustainable, and innovation-driven.
                </p>
              </div>
            </div>

            {/* Key Achievements */}
            <div>
              <h2 className="text-3xl font-bold text-cyan-400 mb-6">Key Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {companyStats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-lg border border-cyan-400/30 rounded-2xl p-6 text-center hover:border-cyan-400/60 transition-all duration-300"
                  >
                    <stat.icon className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                    <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                    <p className="text-2xl font-bold text-cyan-300">{stat.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Backing & Support */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-lg border border-cyan-400/30 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-6">Backing & Support</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-cyan-300">Kontek Group Partnership</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>30+ years in energy business</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>£200M annual sales</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>BBB+ credit rating</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-cyan-300">Munich RE Insurance</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>Performance guarantees</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>Insurance-backed warranties</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>Enhanced bankability</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-lg border border-cyan-400/30 rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-cyan-400 mb-4">X-Series Ecosystem</h2>
              <p className="text-gray-300 text-lg">
                Maxxen's X-Series is a fully integrated, modular ecosystem covering battery storage, power conversion, plant control, and AI-based cloud management.
              </p>
            </div>

            {products.map((product, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-lg border border-cyan-400/30 rounded-2xl overflow-hidden hover:border-cyan-400/60 transition-all duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
                  <div className="md:col-span-1">
                    <img src={product.image} alt={product.title} className="w-full h-64 object-cover rounded-xl" />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-cyan-300 mb-2">{product.title}</h3>
                      <p className="text-gray-400">{product.description}</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-cyan-300 mb-3">Key Features</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {product.features.map((feature, j) => (
                          <div key={j} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-cyan-400/20">
                      <p className="text-sm text-cyan-200"><strong>Ideal For:</strong> {product.idealFor}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* CASE STUDIES TAB */}
        {activeTab === "case-studies" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {caseStudies.map((study, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-lg border border-cyan-400/30 rounded-2xl overflow-hidden hover:border-cyan-400/60 transition-all duration-300"
              >
                <div className="p-8 space-y-6">
                  {/* Header */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                      <img src={study.image} alt={study.title} className="w-full h-48 object-cover rounded-xl" />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <h3 className="text-2xl font-bold text-cyan-300">{study.title}</h3>
                      <p className="text-cyan-200 font-semibold">{study.theme}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Client</p>
                          <p className="text-cyan-300 font-semibold">{study.client}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Location</p>
                          <p className="text-cyan-300 font-semibold">{study.location}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Value</p>
                          <p className="text-cyan-300 font-semibold">{study.value}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Completion</p>
                          <p className="text-cyan-300 font-semibold">{study.completion}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Overview */}
                  <div className="border-t border-cyan-400/20 pt-6">
                    <h4 className="text-lg font-semibold text-cyan-300 mb-3">Project Overview</h4>
                    <p className="text-gray-300 leading-relaxed">{study.overview}</p>
                  </div>

                  {/* Challenges & Solutions */}
                  <div className="border-t border-cyan-400/20 pt-6">
                    <h4 className="text-lg font-semibold text-cyan-300 mb-4">Challenges & Solutions</h4>
                    <div className="space-y-4">
                      {study.challenges.map((challenge, j) => (
                        <div key={j} className="bg-white/5 rounded-lg p-4">
                          <p className="text-cyan-300 font-semibold mb-2">Challenge: {challenge.title}</p>
                          <p className="text-gray-300 text-sm"><strong>Solution:</strong> {challenge.solution}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Outcomes */}
                  <div className="border-t border-cyan-400/20 pt-6">
                    <h4 className="text-lg font-semibold text-cyan-300 mb-3">Results & Outcomes</h4>
                    <ul className="space-y-2">
                      {study.outcomes.map((outcome, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Impact */}
                  <div className="border-t border-cyan-400/20 pt-6 bg-cyan-500/5 rounded-lg p-4">
                    <p className="text-cyan-200"><strong>Impact:</strong> {study.impact}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* INNOVATIONS TAB */}
        {activeTab === "innovations" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {innovations.map((innovation, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-lg border border-cyan-400/30 rounded-2xl p-8"
              >
                <div className="flex items-start gap-4 mb-6">
                  {i === 0 ? <Cloud className="w-8 h-8 text-cyan-400 flex-shrink-0" /> : <Cpu className="w-8 h-8 text-cyan-400 flex-shrink-0" />}
                  <div>
                    <h3 className="text-2xl font-bold text-cyan-300">{innovation.title}</h3>
                    <p className="text-gray-400 mt-2">{innovation.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-cyan-300 mb-4">Key Features</h4>
                    <ul className="space-y-3">
                      {innovation.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-cyan-300 mb-4">Performance Benefits</h4>
                    <ul className="space-y-3">
                      {innovation.benefits.map((benefit, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <TrendingUp className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* CREDENTIALS TAB */}
        {activeTab === "credentials" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Certifications */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-lg border border-cyan-400/30 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-cyan-400 mb-6 flex items-center gap-3">
                <Award className="w-8 h-8" />
                Certifications & Compliance
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-cyan-300 mb-4">Hardware Certifications</h3>
                  <ul className="space-y-3">
                    {[
                      "IEC Standards Compliance",
                      "UL 9540 / 9540A Certified",
                      "NFPA 855 Compliant",
                      "UN 38.3 Certified",
                      "EU Battery Regulation 2023/1542",
                      "ISO 9001 Quality Management",
                      "ISO 14001 Environmental Management",
                      "ISO 45001 Occupational Health & Safety"
                    ].map((cert, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-cyan-300 mb-4">Data & Security</h3>
                  <ul className="space-y-3">
                    {[
                      "Swiss Data Residency",
                      "EU Data Privacy Compliant",
                      "NIS2 Cybersecurity Ready",
                      "GDPR Compliant",
                      "Secure Cloud Infrastructure",
                      "Cell-Level Data Monitoring",
                      "Real-Time Performance Tracking",
                      "Insurance-Backed Warranties"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Manufacturing & Operations */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-lg border border-cyan-400/30 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-cyan-400 mb-6 flex items-center gap-3">
                <Building className="w-8 h-8" />
                Manufacturing & Operations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-300">Global Presence</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Headquarters: Switzerland</li>
                    <li>• Operations: Amsterdam, Istanbul, Zurich</li>
                    <li>• Manufacturing: Turkey (5 GWh LEED-Gold facility)</li>
                    <li>• Carbon-Neutral Production</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-300">Facility Specifications</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• 5 GWh Annual Capacity</li>
                    <li>• LEED-Gold Certified</li>
                    <li>• State-of-the-Art Manufacturing</li>
                    <li>• European Quality Standards</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Market Positioning */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-lg border border-cyan-400/30 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-cyan-400 mb-6 flex items-center gap-3">
                <Globe className="w-8 h-8" />
                Market Positioning
              </h2>
              <div className="space-y-4 text-gray-300">
                <p className="text-lg leading-relaxed">
                  <strong className="text-cyan-300">European Benchmark:</strong> Maxxen is positioned as a leading European BESS manufacturer with Swiss engineering excellence and proven deployment across multiple European markets.
                </p>
                <p className="text-lg leading-relaxed">
                  <strong className="text-cyan-300">Bankability Focus:</strong> With Munich RE insurance backing, Kontek Group support, and comprehensive warranties, Maxxen offers uniquely bankable solutions for project financiers and institutional investors.
                </p>
                <p className="text-lg leading-relaxed">
                  <strong className="text-cyan-300">Innovation Leadership:</strong> Grid-forming capabilities, AI-powered cloud controls, and predictive maintenance position Maxxen at the forefront of energy storage innovation.
                </p>
                <p className="text-lg leading-relaxed">
                  <strong className="text-cyan-300">Market Focus:</strong> Primary markets include Germany, Spain, UK, and Eastern Europe, with strong positioning in grant-funded and utility-scale projects.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MaxxenProductsServices;

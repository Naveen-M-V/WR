import { Zap, Leaf, Globe, Battery, TrendingUp, Newspaper } from "lucide-react";

// Innovation Hub Categories
export const innovationCategories = [
  {
    id: "renewable-energy",
    title: "Innovation in Renewable Energy",
    description: "Discover cutting-edge renewable energy technologies including solar panels, wind turbines, and energy storage solutions that are revolutionizing the clean energy sector.",
    icon: Zap,
    color: "from-emerald-500 to-teal-600",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "sustainable",
    title: "Innovation in Sustainable",
    description: "Explore sustainable practices and eco-friendly innovations that help businesses reduce their carbon footprint while maintaining operational efficiency.",
    icon: Leaf,
    color: "from-green-500 to-emerald-600",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "environmental",
    title: "Innovation in Environmental",
    description: "Learn about environmental protection technologies and solutions that help preserve our planet for future generations through innovative approaches.",
    icon: Globe,
    color: "from-teal-500 to-cyan-600",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "energy-management",
    title: "Innovation in Energy Management & Efficiency",
    description: "Smart energy management systems and IoT solutions that optimize energy consumption, reduce costs, and improve overall energy efficiency.",
    icon: Battery,
    color: "from-cyan-500 to-blue-600",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "get-ahead",
    title: "Get Ahead Of The Curve",
    description: "Stay informed about emerging trends, market insights, and future opportunities in the renewable energy sector to maintain competitive advantage.",
    icon: TrendingUp,
    color: "from-blue-500 to-indigo-600",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "hot-press",
    title: "Hot Off The Press",
    description: "Latest news, press releases, and breaking developments in the renewable energy industry from leading companies and research institutions.",
    icon: Newspaper,
    color: "from-indigo-500 to-purple-600",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  },
];

// Innovation Hub Items (Products/Services/Companies)
export const innovationItems = [
  // Renewable Energy Innovations
  {
    id: 1,
    category: "renewable-energy",
    type: "product",
    name: "SolarMax Pro 5000",
    company: "SunTech Innovations",
    companyLogo: "https://via.placeholder.com/100x100/4ade80/ffffff?text=ST",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Next-generation solar panel with 25% efficiency and 30-year warranty. Features advanced bifacial technology for maximum energy capture.",
    keyFeatures: ["25% Efficiency", "Bifacial Technology", "30-Year Warranty", "Weather Resistant"],
    performance: "500W Peak Power",
    realWorldUse: "Installed in over 5,000 commercial properties across the UK, reducing energy costs by an average of 60%.",
    technicalSpecs: "Monocrystalline cells, 2.1m x 1.1m dimensions, IP68 rated",
    certifications: ["CE", "IEC 61215", "ISO 9001"],
    contactEmail: "sales@suntech.co.uk",
    website: "www.suntech-innovations.co.uk",
    socialMedia: {
      facebook: "suntech",
      twitter: "suntechuk",
      linkedin: "suntech-innovations",
      youtube: "suntechinnovations"
    }
  },
  {
    id: 2,
    category: "renewable-energy",
    type: "service",
    name: "WindFlow Turbine Installation",
    company: "GreenWind Solutions",
    companyLogo: "https://via.placeholder.com/100x100/10b981/ffffff?text=GW",
    image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Complete wind turbine installation and maintenance service for commercial and industrial sites. End-to-end project management.",
    keyFeatures: ["Full Installation", "Maintenance Plans", "24/7 Support", "Performance Monitoring"],
    performance: "Up to 3MW capacity per turbine",
    realWorldUse: "Successfully installed 150+ turbines across Ireland and UK, generating 450MW of clean energy annually.",
    technicalSpecs: "Horizontal axis turbines, 80-120m hub height, variable speed control",
    certifications: ["ISO 14001", "OHSAS 18001", "MCS Certified"],
    contactEmail: "info@greenwind.ie",
    website: "www.greenwind-solutions.ie",
    socialMedia: {
      facebook: "greenwindsolutions",
      twitter: "greenwindIE",
      linkedin: "greenwind-solutions",
      youtube: "greenwindsolutions"
    }
  },

  // Sustainable Innovations
  {
    id: 3,
    category: "sustainable",
    type: "product",
    name: "EcoSmart Building System",
    company: "BuildGreen Technologies",
    companyLogo: "https://via.placeholder.com/100x100/22c55e/ffffff?text=BG",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Integrated sustainable building management system that optimizes energy, water, and waste management for commercial properties.",
    keyFeatures: ["Energy Optimization", "Water Management", "Waste Tracking", "Carbon Reporting"],
    performance: "40% reduction in operational costs",
    realWorldUse: "Deployed in 200+ commercial buildings, saving 50,000 tonnes of CO2 annually.",
    technicalSpecs: "Cloud-based platform, IoT sensors, real-time analytics dashboard",
    certifications: ["BREEAM Excellent", "LEED Platinum", "ISO 50001"],
    contactEmail: "contact@buildgreen.co.uk",
    website: "www.buildgreen-tech.co.uk",
    socialMedia: {
      facebook: "buildgreentech",
      twitter: "buildgreenUK",
      linkedin: "buildgreen-technologies",
      youtube: "buildgreentech"
    }
  },

  // Environmental Innovations
  {
    id: 4,
    category: "environmental",
    type: "product",
    name: "AirPure Carbon Capture",
    company: "CleanAir Dynamics",
    companyLogo: "https://via.placeholder.com/100x100/14b8a6/ffffff?text=CA",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Advanced carbon capture and storage system for industrial facilities. Captures up to 95% of CO2 emissions.",
    keyFeatures: ["95% CO2 Capture", "Modular Design", "Low Energy Use", "Automated Operation"],
    performance: "1000 tonnes CO2/year per unit",
    realWorldUse: "Operating in 30 industrial sites across Europe, preventing 30,000 tonnes of CO2 emissions annually.",
    technicalSpecs: "Chemical absorption technology, 10m x 5m footprint, 24/7 operation",
    certifications: ["ISO 14064", "Carbon Trust Standard", "EU ETS Verified"],
    contactEmail: "info@cleanair-dynamics.com",
    website: "www.cleanair-dynamics.com",
    socialMedia: {
      facebook: "cleanairdynamics",
      twitter: "cleanairEU",
      linkedin: "cleanair-dynamics",
      youtube: "cleanairdynamics"
    }
  },

  // Energy Management Innovations
  {
    id: 5,
    category: "energy-management",
    type: "product",
    name: "SmartGrid Controller Pro",
    company: "EnergyTech Systems",
    companyLogo: "https://via.placeholder.com/100x100/06b6d4/ffffff?text=ET",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "AI-powered energy management system that optimizes grid performance and reduces energy waste in real-time.",
    keyFeatures: ["AI Optimization", "Real-time Monitoring", "Predictive Analytics", "Load Balancing"],
    performance: "30% energy savings guaranteed",
    realWorldUse: "Managing energy for 500+ facilities, saving £10M annually in energy costs.",
    technicalSpecs: "Cloud-based AI, machine learning algorithms, API integration",
    certifications: ["ISO 50001", "Cyber Essentials Plus", "Smart Grid Ready"],
    contactEmail: "sales@energytech.co.uk",
    website: "www.energytech-systems.co.uk",
    socialMedia: {
      facebook: "energytechsystems",
      twitter: "energytechUK",
      linkedin: "energytech-systems",
      youtube: "energytechsystems"
    }
  },
  {
    id: 6,
    category: "energy-management",
    type: "service",
    name: "Energy Efficiency Audit",
    company: "GreenConsult Partners",
    companyLogo: "https://via.placeholder.com/100x100/0891b2/ffffff?text=GC",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Comprehensive energy efficiency auditing service for businesses. Identify savings opportunities and implement cost-effective solutions.",
    keyFeatures: ["Detailed Audit", "ROI Analysis", "Implementation Support", "Ongoing Monitoring"],
    performance: "Average 35% cost reduction",
    realWorldUse: "Completed 1,000+ audits, helping businesses save £25M in energy costs.",
    technicalSpecs: "On-site assessment, thermal imaging, data analysis, custom reporting",
    certifications: ["Energy Manager Certified", "ESOS Lead Assessor", "ISO 50001 Auditor"],
    contactEmail: "enquiries@greenconsult.ie",
    website: "www.greenconsult-partners.ie",
    socialMedia: {
      facebook: "greenconsultpartners",
      twitter: "greenconsultIE",
      linkedin: "greenconsult-partners",
      youtube: "greenconsultpartners"
    }
  },

  // Get Ahead of the Curve
  {
    id: 7,
    category: "get-ahead",
    type: "service",
    name: "Renewable Energy Market Intelligence",
    company: "FutureEnergy Insights",
    companyLogo: "https://via.placeholder.com/100x100/3b82f6/ffffff?text=FE",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Premium market intelligence and trend analysis service for renewable energy professionals. Stay ahead with data-driven insights.",
    keyFeatures: ["Market Reports", "Trend Analysis", "Competitor Intelligence", "Investment Opportunities"],
    performance: "Weekly insights & quarterly reports",
    realWorldUse: "Trusted by 500+ energy companies and investors for strategic decision-making.",
    technicalSpecs: "Online platform, mobile app, custom alerts, API access",
    certifications: ["ISO 27001", "Data Protection Certified"],
    contactEmail: "subscribe@futureenergy.com",
    website: "www.futureenergy-insights.com",
    socialMedia: {
      facebook: "futureenergyinsights",
      twitter: "futureenergyUK",
      linkedin: "futureenergy-insights",
      youtube: "futureenergyinsights"
    }
  },

  // Hot Off The Press
  {
    id: 8,
    category: "hot-press",
    type: "news",
    name: "UK Announces £2B Green Energy Fund",
    company: "Energy News Network",
    companyLogo: "https://via.placeholder.com/100x100/6366f1/ffffff?text=EN",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Breaking: UK Government announces £2 billion funding for renewable energy projects. Applications open Q2 2025.",
    keyFeatures: ["Government Funding", "Open Applications", "Multiple Sectors", "Grant Support"],
    performance: "£2B total funding available",
    realWorldUse: "Expected to support 200+ renewable energy projects across the UK.",
    technicalSpecs: "Application portal, eligibility criteria, funding tiers",
    certifications: ["Government Backed"],
    contactEmail: "news@energynews.co.uk",
    website: "www.energynews-network.co.uk",
    socialMedia: {
      facebook: "energynewsnetwork",
      twitter: "energynewsUK",
      linkedin: "energy-news-network",
      youtube: "energynewsnetwork"
    }
  },
];

const innovationHubData = { innovationCategories, innovationItems };
export default innovationHubData;

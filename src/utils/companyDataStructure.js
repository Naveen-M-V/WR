// Company data structure helper for dynamic company pages

export const getCompanyDataStructure = () => {
  return {
    // Basic Information
    companyName: '',
    companyRegNumber: '',
    companyAddress: '',
    postCode: '',
    contactEmail: '',
    phoneNumber: '',
    website: '',
    
    // Location
    regions: [],
    
    // Content Sections (determines which tabs are shown)
    overview: '', // Company overview/description
    description: '', // Alternative description field
    
    // Products & Services
    productsAndServices: [
      {
        name: '',
        description: '',
        image: '',
        features: [],
        category: ''
      }
    ],
    
    // Innovation & Technology
    innovations: [
      {
        title: '',
        description: '',
        icon: null // Lucide React icon component
      }
    ],
    
    // Projects
    projects: [
      {
        title: '',
        description: '',
        location: '',
        value: '',
        completion: '',
        image: ''
      }
    ],
    
    // Case Studies
    caseStudies: [
      {
        title: '',
        overview: '',
        outcomes: [],
        impact: '',
        client: '',
        location: '',
        value: '',
        completion: '',
        image: ''
      }
    ],
    
    // Blogs & Articles
    blogs: [
      {
        title: '',
        content: '',
        date: '',
        link: '',
        author: ''
      }
    ],
    
    // News & Events
    events: [
      {
        title: '',
        description: '',
        date: '',
        location: '',
        type: 'news' // 'news' | 'event'
      }
    ],
    
    // Certifications
    certifications: [
      {
        name: '',
        issuer: '',
        date: '',
        credentialId: ''
      }
    ],
    
    // Company Statistics (shown in overview)
    statistics: [
      {
        label: '',
        value: '',
        icon: null // Lucide React icon component
      }
    ],
    
    // Media
    companyLogo: '',
    productImages: [],
    
    // Metadata
    mainSector: '',
    industrySector: [],
    productsServiceCategories: [],
    hierarchicalProductsServices: {},
    createdAt: '',
    updatedAt: ''
  };
};

// Sample company data for testing
export const sampleCompanyData = {
  companyName: "TechRenewable Solutions",
  companyRegNumber: "TR2024001",
  companyAddress: "123 Green Tech Lane, London, UK",
  postCode: "EC1A 1BB",
  contactEmail: "info@techrenewable.com",
  phoneNumber: "+44 20 7123 4567",
  website: "www.techrenewable.com",
  regions: ["England - London", "Scotland - Edinburgh"],
  overview: "TechRenewable Solutions is a leading provider of innovative renewable energy technologies, specializing in solar power systems, energy storage solutions, and smart grid integration. Our mission is to accelerate the transition to sustainable energy through cutting-edge technology and exceptional service.",
  description: "Leading renewable energy technology provider with expertise in solar, storage, and smart grid solutions.",
  
  productsAndServices: [
    {
      name: "SolarMax Pro System",
      description: "Advanced solar panel system with AI-powered optimization for maximum energy generation and efficiency.",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      features: [
        "AI-powered energy optimization",
        "High-efficiency solar panels (22%+ efficiency)",
        "Real-time monitoring and analytics",
        "Weather prediction integration",
        "Smart grid compatibility"
      ],
      category: "Solar Systems"
    },
    {
      name: "EnergyStorage Hub",
      description: "Modular energy storage system designed for residential and commercial applications with scalable capacity.",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      features: [
        "Scalable modular design (5-100 kWh)",
        "Lithium-ion battery technology",
        "Smart energy management",
        "Backup power capability",
        "Mobile app control"
      ],
      category: "Energy Storage"
    }
  ],
  
  innovations: [
    {
      title: "AI Energy Optimizer",
      description: "Machine learning algorithms that predict energy consumption patterns and optimize solar generation in real-time.",
      icon: "Zap"
    },
    {
      title: "Smart Grid Integration",
      description: "Seamless integration with smart grid infrastructure for demand response and load balancing.",
      icon: "TrendingUp"
    },
    {
      title: "Predictive Maintenance",
      description: "IoT sensors and AI analytics for predictive maintenance and system optimization.",
      icon: "Settings"
    }
  ],
  
  projects: [
    {
      title: "London Office Complex Solar Installation",
      description: "Complete solar panel installation for a 50,000 sq ft commercial office building in Central London.",
      location: "London, UK",
      value: "£500,000",
      completion: "March 2024",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      title: "Edinburgh Residential Storage Project",
      description: "Deployment of 25 residential energy storage systems in new housing development.",
      location: "Edinburgh, Scotland",
      value: "£250,000",
      completion: "June 2024",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }
  ],
  
  caseStudies: [
    {
      title: "Manchester Manufacturing Facility Energy Optimization",
      overview: "Complete energy system overhaul for a manufacturing facility, resulting in 60% reduction in grid dependency and 40% cost savings.",
      outcomes: [
        "60% reduction in grid electricity consumption",
        "40% reduction in energy costs",
        "250 kW solar panel installation",
        "500 kWh energy storage system",
        "ROI achieved in 3.5 years"
      ],
      impact: "This project demonstrates how industrial facilities can achieve energy independence while significantly reducing operational costs through integrated renewable energy solutions.",
      client: "Manufacturing Corp Ltd",
      location: "Manchester, UK",
      value: "£1.2M",
      completion: "January 2024",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }
  ],
  
  blogs: [
    {
      title: "The Future of Solar Energy: AI Integration and Smart Grid Compatibility",
      content: "As we move towards a more sustainable future, the integration of artificial intelligence in solar energy systems is revolutionizing how we generate, store, and consume renewable energy. This article explores the latest developments in AI-powered solar optimization and smart grid integration...",
      date: "July 15, 2024",
      link: "https://blog.techrenewable.com/future-of-solar-ai",
      author: "Dr. Sarah Johnson"
    },
    {
      title: "Energy Storage Trends: What's Next for Battery Technology?",
      content: "The energy storage landscape is evolving rapidly with new battery technologies emerging that promise higher efficiency, longer lifespan, and better environmental sustainability. We explore the latest trends in battery technology and what they mean for the renewable energy sector...",
      date: "June 28, 2024",
      link: "https://blog.techrenewable.com/energy-storage-trends",
      author: "Mark Thompson"
    }
  ],
  
  events: [
    {
      title: "TechRenewable Solutions Wins Innovation Award at Renewable Energy Summit",
      description: "Our AI Energy Optimizer technology was recognized with the 'Best Innovation in Renewable Energy' award at the International Renewable Energy Summit 2024.",
      date: "May 20, 2024",
      location: "Amsterdam, Netherlands",
      type: "news"
    },
    {
      title: "Launch of New SolarMax Pro System",
      description: "Join us for the official launch of our next-generation solar panel system with integrated AI optimization technology.",
      date: "August 15, 2024",
      location: "London, UK",
      type: "event"
    }
  ],
  
  certifications: [
    {
      name: "ISO 9001:2015",
      issuer: "British Standards Institution",
      date: "2023",
      credentialId: "ISO9001/TRS/2023"
    },
    {
      name: "MCS Certified",
      issuer: "Microgeneration Certification Scheme",
      date: "2023",
      credentialId: "MCS-TRS-2023-001"
    },
    {
      name: "RECC Approved",
      issuer: "Renewable Energy Consumer Code",
      date: "2023",
      credentialId: "RECC-TRS-2023"
    }
  ],
  
  statistics: [
    {
      label: "Projects Completed",
      value: "500+",
      icon: "CheckCircle"
    },
    {
      label: "MW Installed",
      value: "250+",
      icon: "Zap"
    },
    {
      label: "Happy Customers",
      value: "10,000+",
      icon: "Users"
    },
    {
      label: "Years Experience",
      value: "15+",
      icon: "Calendar"
    }
  ],
  
  mainSector: "Commercial",
  industrySector: ["Solar", "Energy Storage", "Smart Grid"],
  productsServiceCategories: ["Solar Panels", "Battery Storage", "Energy Management"],
  hierarchicalProductsServices: {
    "Renewable Energy": {
      "Solar Power": ["Solar Panels", "Solar Inverters", "Mounting Systems"],
      "Energy Storage": ["Battery Systems", "Storage Inverters"]
    }
  },
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-07-15T14:30:00Z"
};

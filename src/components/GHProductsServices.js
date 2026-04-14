import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail, Globe, Users, Award, Calendar, Building, DollarSign, Clock, CheckCircle } from "lucide-react";
import ScrollingBanner from "./home/ScrollingBanner";

const GHProductsServices = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const companyData = location.state?.company || {
    title: "Titan BuildTech Pvt. Ltd.",
    content: "Titan BuildTech Ltd. is a UK-based construction leader, delivering high-quality residential, commercial, and infrastructure projects across England, Scotland, and Wales. With over two decades of industry expertise, we pride ourselves on combining traditional craftsmanship with cutting-edge construction technology. From luxury apartment blocks in London to renewable-energy powered business parks in Manchester, our focus is on creating sustainable, safe, and innovative spaces that stand the test of time. Titan BuildTech is fully accredited under UK building standards, with a reputation for excellence, on-time delivery, and client trust.",
    region: "Greater London, South East England, Midlands, North West",
    image: "/titan/titanlogo.jpeg"
  };

  const [activeTab, setActiveTab] = useState("overview");

  const services = [
    {
      title: "Smart Irrigation Systems",
      description: "GreenHarvest’s Smart Irrigation Systems use AI-powered sensors to optimize watering, reducing water use by up to 35%. Suitable for farms of all sizes, they monitor soil moisture in real-time, adapt to weather changes, and boost crop health, yields, and efficiency while lowering costs and conserving water.",
      image: "/greenharvest/stock4.jpeg",
      features: ["AI-Powered Precision Watering", "Water Efficiency", "Real-Time Soil Monitoring", "Cost-Effective & Easy to Maintain","Sustainable & Climate-Smart"]
    },
    
    {
      title: "Eco-Fertilizers",
      description: "GreenHarvest’s Eco-Fertilizers are organic blends that improve soil health, boost nutrient retention, and support higher yields. Safe for the environment, they reduce chemical use, enhance soil structure, and promote sustainable, regenerative farming for long-term productivity.",
      image: "/greenharvest/stock3.jpeg",
      features: ["Organic & Natural Ingredients", "Soil Health Improvement", "Higher Crop Yields", "Versatile Application","Long-Term Farm Viability"]
    },
    {
      title: "Smart Irrigation Systems",
      description: "GreenHarvest’s Smart Irrigation Systems use AI-powered sensors to optimize watering, reducing water use by up to 35%. Suitable for farms of all sizes, they monitor soil moisture in real-time, adapt to weather changes, and boost crop health, yields, and efficiency while lowering costs and conserving water.",
      image: "/greenharvest/stock4.jpeg",
      features: ["AI-Powered Precision Watering", "Water Efficiency", "Real-Time Soil Monitoring", "Cost-Effective & Easy to Maintain","Sustainable & Climate-Smart"]
    },
    
    {
      title: "Eco-Fertilizers",
      description: "GreenHarvest’s Eco-Fertilizers are organic blends that improve soil health, boost nutrient retention, and support higher yields. Safe for the environment, they reduce chemical use, enhance soil structure, and promote sustainable, regenerative farming for long-term productivity.",
      image: "/greenharvest/stock3.jpeg",
      features: ["Organic & Natural Ingredients", "Soil Health Improvement", "Higher Crop Yields", "Versatile Application","Long-Term Farm Viability"]
    }
  ];

  const companyStats = [
    { icon: Users, label: "Team Members", value: "150+" },
    { icon: Award, label: "Projects Completed", value: "300+" },
    { icon: Calendar, label: "Years Experience", value: "10+" },
    { icon: MapPin, label: "Locations", value: "2" }
  ];

  const projects = [
    {
      title: "Solar Irrigation Deployment",
      client: "Kenya government",
      location: "Kenya, East Africa",
      value: "£250 million",
      completion: "May 2024",
      image: "/greenharvest/stock2.jpeg",
      overview: "In 2024, GreenHarvest deployed solar-powered irrigation systems in Kenya, boosting yields by 28% and cutting diesel use by 65% for over 3,000 farmers. In Ireland, the company introduced AI-powered precision irrigation to 200 farms, achieving a 30% increase in wheat yields and 25% water savings. These projects show GreenHarvest’s ability to combine renewable energy and smart farming technology for sustainable growth.",
      keyFeatures: [
        {
          title: "Solar-Powered Irrigation",
          description: "Harnessing renewable energy to power irrigation systems, reducing diesel use by 65% and cutting carbon emissions while ensuring reliable water access for off-grid farms."
        },
        {
          title: "AI-Powered Precision Farming",
          description: "Smart sensors monitor soil moisture and weather conditions, delivering the right amount of water at the right time, boosting yields by up to 30% while saving 25% water."
        },
        {
          title: "Farmer Empowerment & Training",
          description: "Hands-on training sessions equip farmers with skills in system maintenance, water management, and crop planning, ensuring long-term sustainability and adoption."
        },
        {
          title: "Measurable Impact",
          description: "Projects have improved livelihoods for 3,000+ smallholder farmers, increased crop productivity, and lowered costs while protecting the environment."
        }
      ],
      outcomes: [
        "Water access: 100% of the targeted farmland received reliable irrigation.",
        "Yield increase: Crop yields improved by 28% on average."
      ],
      impact: ["Environmental impact: Reduced diesel fuel consumption by 65%, cutting carbon emissions significantly.",
        "Community impact: Enhanced livelihoods for over 3,000 smallholder farmers."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <ScrollingBanner />
      {/* Header */}
      <div className="relative pt-10 h-64 bg-gradient-to-r from-green-600 to-green-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-6 p-4 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Products & Services</h1>
            <p className="text-green-100 text-lg">{companyData.title}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className=" mb-4"
        >
          <div className="mt-10 relative rounded-2xl overflow-hidden mx-4">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/15 via-green-400/10 to-green-300/5 backdrop-blur-lg border border-green-400/30"></div>
            <div className="relative z-10 p-2">
              <div className="flex flex-wrap gap-2">
                {["overview", "services", "projects", "certifications","casestudy"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      activeTab === tab
                        ? "bg-green-500/30 text-green-800 shadow-lg"
                        : "text-gray-600 hover:bg-green-500/10 hover:text-green-700"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
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
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-green-400/10 to-green-300/5 backdrop-blur-xl border border-green-400/30 shadow-2xl"></div>
            
            <div className="relative z-10 p-8">
              <div className="flex flex-col lg:flex-row items-start gap-8">
                {/* Company Image */}
                <div className="flex-shrink-0">
                  <img
                    src={companyData.image}
                    alt={companyData.title}
                    className="w-32 h-32 rounded-2xl object-cover border border-green-400/40 shadow-lg"
                  />
                </div>

                {/* Company Info */}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">{companyData.title}</h2>
                  <p className="text-gray-600 mb-4 leading-relaxed text-justify">{companyData.content}</p>
                  
                  <div className="flex items-center text-green-600 mb-6">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span className="font-medium">{companyData.region}</span>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2 text-green-500" />
                      <span>+44 (0) 203 456 7890</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2 text-green-500" />
                      <span>info@greenharvestagritech.com</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Globe className="w-4 h-4 mr-2 text-green-500" />
                      <span>www.greenharvestagritech.com</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  {companyStats.map((stat, index) => (
                    <div
                      key={index}
                      className="text-center p-4 rounded-xl bg-green-500/10 border border-green-400/20 
                                transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-green-500/20"
                    >
                      <stat.icon className="w-6 h-6 text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
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
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/15 via-green-400/8 to-green-300/5 backdrop-blur-xl border border-green-400/30 shadow-xl"></div>
              <div className="relative z-10 p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Why Choose {companyData.title}?</h3>
                <div className="gap-6">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Our Commitment</h4>
                    <p className="text-gray-600 leading-relaxed text-justify">
                    At GreenHarvest, we are dedicated to empowering farmers, agribusinesses, and communities with sustainable, innovative solutions that increase productivity while preserving natural resources. We tackle today’s biggest agricultural challenges—climate change, soil degradation, water scarcity, and food security—through smart irrigation, eco-fertilizers, AI-powered monitoring, and precision farming tools. Our partnership approach ensures solutions are tailored to local needs, delivering measurable improvements in yield, profitability, and sustainability. We are committed not only to providing cutting-edge technology but also to sharing knowledge, training the next generation, and creating a global food system that works in harmony with nature.                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Innovation & Technology</h4>
                    <p className="text-gray-600 leading-relaxed text-justify">
                    GreenHarvest leverages cutting-edge technology to transform agriculture. From AI-powered irrigation and crop monitoring systems to precision farming tools and eco-friendly fertilizers, our solutions optimize resource use, boost yields, and reduce environmental impact. By combining innovation with sustainability, we help farmers worldwide embrace climate-smart practices while driving efficiency and long-term growth.                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 leading-relaxed text-justify">
                    GreenHarvest is transforming agriculture through sustainable solutions, advanced technology, and global expertise. Founded in 2015, we aim to help farmers, agribusinesses, and communities increase productivity while preserving natural resources. Our solutions include smart irrigation systems, eco-fertilizers, precision farming tools, and crop surveillance drones, all designed to optimize yields and reduce environmental impact. Operating across the UK, Ireland, Africa, and Asia, we tailor projects to local needs, ensuring measurable improvements in crop health, water efficiency, and profitability. Our solar-powered irrigation kits enable off-grid farms to thrive, while AI-powered monitoring ensures precise use of water and nutrients. Recognised as a top AgriTech innovator in the UK & Ireland, GreenHarvest combines innovation with sustainability to support climate-smart farming. Through knowledge sharing, training webinars, and partnerships with farmers and governments, we empower the next generation of agricultural leaders and drive a global food system that works in harmony with nature.                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "services" && (
          <>
            <div>
              <h2 className="text-3xl font-bold text-green-900 mb-2">SERVICES</h2>
            </div>

            {/* Services Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                {services.map((service, index) => (
                  <div key={index} className="relative rounded-2xl overflow-hidden group hover:scale-104 transition-all duration-500">
                    {/* Glass Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-green-400/10 to-green-300/5 group-hover:from-green-500/30 group-hover:via-green-400/20 group-hover:to-green-300/10 backdrop-blur-xl border border-green-400/30 group-hover:border-green-400/50 shadow-lg group-hover:shadow-2xl group-hover:shadow-green-500/20 transition-all duration-500"></div>
                    
                    <div className="relative z-10 p-6">
                      {/* Service Image */}
                      <div className="mb-6">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-48 object-cover rounded-xl border border-green-400/30 group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Service Content */}
                      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-700 transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">
                        {service.description}
                      </p>

                      {/* Features */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-green-600 mb-2">Key Features:</h4>
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                            {feature}
                          </div>
                        ))}
                      </div>

                      {/* Action Button */}
                      <button className="mt-6 w-full px-4 py-2 rounded-xl bg-green-500/20 hover:bg-green-500/40 border border-green-400/30 hover:border-green-400/60 backdrop-blur-md transition-all duration-300 text-gray-800 hover:text-green-900 font-semibold shadow-lg hover:shadow-xl hover:scale-105">
                        Learn More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* Projects Tab Content */}
        {activeTab === "projects" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <h2 className="text-3xl font-bold text-green-900 mb-8">FEATURED PROJECTS</h2>
            </div>
            
            {projects.map((project, index) => (
              <div key={index} className="mb-12">
                {/* Project Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative rounded-3xl overflow-hidden mb-8"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-green-400/10 to-green-300/5 backdrop-blur-xl border border-green-400/30 shadow-2xl"></div>
                  
                  <div className="relative z-10 p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      {/* Project Image */}
                      <div className="order-2 lg:order-1">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-80 object-cover rounded-2xl border border-green-400/40 shadow-lg"
                        />
                      </div>
                      
                      {/* Project Info */}
                      <div className="order-1 lg:order-2">
                        <h3 className="text-4xl font-bold text-gray-800 mb-6">{project.title}</h3>
                        
                        {/* Project Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center p-4 rounded-xl bg-green-500/10 border border-green-400/20">
                            <Building className="w-6 h-6 text-green-500 mr-3" />
                            <div>
                              <div className="text-sm text-gray-600">Client</div>
                              <div className="font-semibold text-gray-800">{project.client}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center p-4 rounded-xl bg-green-500/10 border border-green-400/20">
                            <MapPin className="w-6 h-6 text-green-500 mr-3" />
                            <div>
                              <div className="text-sm text-gray-600">Location</div>
                              <div className="font-semibold text-gray-800">{project.location}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center p-4 rounded-xl bg-green-500/10 border border-green-400/20">
                            <DollarSign className="w-6 h-6 text-green-500 mr-3" />
                            <div>
                              <div className="text-sm text-gray-600">Project Value</div>
                              <div className="font-semibold text-gray-800">{project.value}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center p-4 rounded-xl bg-green-500/10 border border-green-400/20">
                            <Clock className="w-6 h-6 text-green-500 mr-3" />
                            <div>
                              <div className="text-sm text-gray-600">Completion</div>
                              <div className="font-semibold text-gray-800">{project.completion}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Project Overview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="relative rounded-2xl overflow-hidden mb-8"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/15 via-green-400/8 to-green-300/5 backdrop-blur-xl border border-green-400/30 shadow-xl"></div>
                  <div className="relative z-10 p-8">
                    <h4 className="text-2xl font-bold text-gray-800 mb-4">Overview</h4>
                    <p className="text-gray-600 leading-relaxed text-justify">{project.overview}</p>
                  </div>
                </motion.div>
                
                {/* Key Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="relative rounded-2xl overflow-hidden mb-8"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/15 via-green-400/8 to-green-300/5 backdrop-blur-xl border border-green-400/30 shadow-xl"></div>
                  <div className="relative z-10 p-8">
                    <h4 className="text-2xl font-bold text-gray-800 mb-6">Key Features</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {project.keyFeatures.map((feature, featureIndex) => (
                        <div key={featureIndex} className="p-6 rounded-xl bg-green-500/10 border border-green-400/20 hover:bg-green-500/20 transition-all duration-300">
                          <h5 className="font-bold text-green-700 mb-3">{feature.title}</h5>
                          <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
                
                {/* Outcomes */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="relative rounded-2xl overflow-hidden mb-8"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/15 via-green-400/8 to-green-300/5 backdrop-blur-xl border border-green-400/30 shadow-xl"></div>
                  <div className="relative z-10 p-8">
                    <h4 className="text-2xl font-bold text-gray-800 mb-6">Outcomes</h4>
                    <div className="space-y-4">
                      {project.outcomes.map((outcome, outcomeIndex) => (
                        <div key={outcomeIndex} className="flex items-start">
                          <CheckCircle className="w-6 h-6 text-green-500 mr-4 mt-1 flex-shrink-0" />
                          <p className="text-gray-600 leading-relaxed">{outcome}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
                
                {/* Impact */}
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="relative rounded-2xl overflow-hidden"
                >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/15 via-green-400/8 to-green-300/5 backdrop-blur-xl border border-green-400/30 shadow-xl"></div>
                <div className="relative z-10 p-8">
                    <h4 className="text-2xl font-bold text-gray-800 mb-6">Impact</h4>
                    <div className="space-y-4">
                    {project.impact.map((impact, impactIndex) => (
                        <div key={impactIndex} className="flex items-start">
                        <p className="text-gray-600 leading-relaxed">{impact}</p>
                        </div>
                    ))}
                    </div>
                </div>
                </motion.div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Certifications Tab Content */}
        {activeTab === "certifications" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <h2 className="text-3xl font-bold text-green-900 mb-8">CERTIFICATIONS & ACCREDITATIONS</h2>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/15 via-green-400/8 to-green-300/5 backdrop-blur-xl border border-green-400/30 shadow-xl"></div>
              <div className="relative z-10 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Industry Standards</h4>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Fully accredited under UK building standards with certifications in sustainable construction practices and renewable energy integration.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        ISO 14001 Environmental Management
                      </li>
                      <li className="flex items-center text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        BREEAM Excellent Rating
                      </li>
                      <li className="flex items-center text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        LEED Gold Certification
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Safety & Quality</h4>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Committed to the highest standards of safety and quality assurance across all our construction projects.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        ISO 45001 Health & Safety
                      </li>
                      <li className="flex items-center text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        ISO 9001 Quality Management
                      </li>
                      <li className="flex items-center text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        NHBC Registered Builder
                      </li>
                    </ul>
                  </div>
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
              <h2 className="text-3xl font-bold text-green-900 mb-8">CASE STUDIES</h2>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/15 via-green-400/8 to-green-300/5 backdrop-blur-xl border border-green-400/30 shadow-xl"></div>
              <div className="relative z-10 p-8 text-center">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Comprehensive Case Studies</h3>
                  <p className="text-gray-600 leading-relaxed mb-8">
                    Explore our detailed case studies showcasing successful renewable energy projects, sustainable construction solutions, and innovative approaches to green building across various sectors.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="p-6 rounded-xl bg-green-500/10 border border-green-400/20 hover:bg-green-500/20 transition-all duration-300">
                      <h4 className="font-bold text-green-700 mb-3">Construction Projects</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        In-depth analysis of our major construction projects including Manchester EcoPark and other sustainable developments.
                      </p>
                    </div>
                    
                    <div className="p-6 rounded-xl bg-green-500/10 border border-green-400/20 hover:bg-green-500/20 transition-all duration-300">
                      <h4 className="font-bold text-green-700 mb-3">Renewable Solutions</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Detailed case studies of renewable energy implementations and their impact on sustainability goals.
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => navigate('/case-studies')}
                    className="px-8 py-3 rounded-xl bg-green-500/20 hover:bg-green-500/40 border border-green-400/30 hover:border-green-400/60 backdrop-blur-md transition-all duration-300 text-gray-800 hover:text-green-900 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    View All Case Studies
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default GHProductsServices;

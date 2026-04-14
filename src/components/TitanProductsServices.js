import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail, Globe, Users, Award, Calendar, Building, DollarSign, Clock, CheckCircle } from "lucide-react";
import ScrollingBanner from "./home/ScrollingBanner";

const TitanProductsServices = () => {
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
      title: "Sustainable Residential & Commercial Development",
      description: "Comprehensive construction services for residential complexes, commercial buildings, and mixed-use developments with renewable energy integration.",
      image: "/titan/service1.jpeg",
      features: ["Solar Panel Integration", "Energy-efficient Design", "Smart Building Systems", "Sustainable Materials"]
    },
    
    {
      title: "Renewable Energy Infrastructure",
      description: "Complete renewable energy solutions including solar farms, wind installations, and energy storage systems for commercial and industrial clients.",
      image: "/titan/service2.jpeg",
      features: ["Solar Farm Construction", "Wind Energy Systems", "Battery Storage Solutions", "Grid Integration"]
    }
  ];

  const companyStats = [
    { icon: Users, label: "Team Members", value: "150+" },
    { icon: Award, label: "Projects Completed", value: "300+" },
    { icon: Calendar, label: "Years Experience", value: "20+" },
    { icon: MapPin, label: "Locations", value: "15+" }
  ];

  const projects = [
    {
      title: "Manchester EcoPark",
      client: "Greater Manchester Development Corporation",
      location: "Manchester, UK",
      value: "£250 million",
      completion: "March 2025",
      image: "/titan/projects1.jpeg",
      overview: "Titan BuildTech was commissioned to design and construct Manchester EcoPark, a next-generation sustainable business hub built to support the city's transition into a green economy. Spread across 42 acres, the project integrates office spaces, research labs, co-working hubs, and light industrial units—all powered by renewable energy and designed with circular economy principles in mind.",
      keyFeatures: [
        {
          title: "Net-Zero Energy Design",
          description: "Powered by a combination of solar farms and bio-energy facilities, EcoPark operates entirely on renewable energy."
        },
        {
          title: "Green Mobility",
          description: "Integrated electric charging stations, cycle highways, and smart public transport links reduce reliance on fossil fuels."
        },
        {
          title: "Circular Construction",
          description: "25% of building materials sourced from recycled or reclaimed origins; advanced waste-to-resource systems ensure zero landfill contribution during construction."
        },
        {
          title: "Smart Infrastructure",
          description: "IoT-enabled building management systems optimise lighting, heating, and ventilation, improving energy efficiency by 45%."
        }
      ],
      outcomes: [
        "Delivered 18 fully operational business units tailored for tech startups, research firms, and clean-energy companies.",
        "Created over 3,500 local jobs, supporting Manchester's position as a hub for sustainable industries.",
        "Awarded the British Council for Offices (BCO) Award 2025 for Innovation in Commercial Development."
      ],
      impact: "Manchester EcoPark now serves as a flagship model for eco-commercial development in the UK, attracting both national and international tenants. Titan BuildTech's role in the project demonstrates our capacity to deliver large-scale commercial hubs that align with the UK's net-zero ambitions while strengthening local economies."
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
                      <span>+44 (0)20 7946 8521</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2 text-green-500" />
                      <span>info@titanbuildtech.co.uk</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Globe className="w-4 h-4 mr-2 text-green-500" />
                      <span>www.titanbuildtech.co.uk</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Our Commitment</h4>
                    <p className="text-gray-600 leading-relaxed">
                      We are committed to delivering sustainable construction solutions that meet the highest standards of quality, safety, and environmental responsibility. Our team of experts ensures every project contributes to a greener future.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Innovation & Technology</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Leveraging cutting-edge technology and innovative construction methods, we deliver projects that are not only environmentally sustainable but also cost-effective and future-ready.
                    </p>
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
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {services.map((service, index) => (
                  <div key={index} className="relative rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-500">
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
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-green-400/15 to-green-300/10 backdrop-blur-xl border border-green-400/40 shadow-xl"></div>
                  <div className="relative z-10 p-8">
                    <h4 className="text-2xl font-bold text-gray-800 mb-4">Impact</h4>
                    <p className="text-gray-600 leading-relaxed text-justify">{project.impact}</p>
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

export default TitanProductsServices;
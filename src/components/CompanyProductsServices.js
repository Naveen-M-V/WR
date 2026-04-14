import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Users,
  Calendar,
  Award,
  CheckCircle,
  FileText,
  Settings,
  Briefcase
} from 'lucide-react';

const CompanyProductsServices = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get company data from navigation state
  const { company, category } = location.state || {};

  // If no company data, redirect back
  if (!company) {
    navigate('/showcase-hub/product-service-in-spotlight');
    return null;
  }

  // Sample expanded company data
  const companyDetails = {
    ...company,
    founded: '2008',
    employees: '150-200',
    certifications: ['ISO 9001', 'ISO 14001', 'MCS Certified', 'NICEIC Approved'],
    website: 'www.' + company.name.toLowerCase().replace(/\s+/g, '') + '.com',
    services: [
      {
        id: 1,
        name: 'Solar PV Installation',
        description: 'Complete solar photovoltaic system design and installation for residential and commercial properties.',
        features: ['Site Survey', 'System Design', 'Installation', 'Commissioning', '25-year Warranty'],
        price: 'From £8,000'
      },
      {
        id: 2,
        name: 'Battery Storage Systems',
        description: 'Energy storage solutions to maximize solar energy utilization and provide backup power.',
        features: ['Tesla Powerwall', 'LG Chem RESU', 'Sonnen Battery', 'Smart Energy Management'],
        price: 'From £5,500'
      },
      {
        id: 3,
        name: 'Maintenance & Support',
        description: 'Comprehensive maintenance packages to ensure optimal system performance.',
        features: ['Annual Inspections', '24/7 Monitoring', 'Performance Optimization', 'Warranty Support'],
        price: 'From £200/year'
      },
      {
        id: 4,
        name: 'Energy Consultation',
        description: 'Expert advice on energy efficiency and renewable energy solutions.',
        features: ['Energy Audit', 'ROI Analysis', 'Grant Applications', 'Planning Support'],
        price: 'From £500'
      }
    ],
    projects: [
      {
        id: 1,
        name: 'Commercial Solar Farm - 2MW',
        location: 'Somerset, UK',
        year: '2023',
        description: 'Large-scale solar installation for agricultural business',
        image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=250&fit=crop'
      },
      {
        id: 2,
        name: 'Residential Estate - 150 Homes',
        location: 'Bristol, UK',
        year: '2022',
        description: 'Solar PV and battery storage for new housing development',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop'
      },
      {
        id: 3,
        name: 'School Solar Project',
        location: 'Bath, UK',
        year: '2023',
        description: 'Educational solar installation with monitoring system',
        image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=250&fit=crop'
      }
    ]
  };

  const handleBackClick = () => {
    navigate('/showcase-hub/product-service-in-spotlight');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'services', label: 'Services', icon: Settings },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'certifications', label: 'Certifications', icon: Award }
  ];

  return (
    <div className="min-h-screen bg-[#051f46] pt-32 pb-16 overflow-hidden">
      {/* Background Effects - Similar to Home Page */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-[10%] left-[70%] w-32 h-32 bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.08, 0.12, 0.08]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-[15%] right-[10%] w-40 h-40 bg-gradient-to-br from-purple-200 via-pink-200 to-orange-200 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleBackClick}
          className="flex items-center gap-2 text-blue-300 hover:text-white font-semibold mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to {category?.name || 'Products & Services'}
        </motion.button>

        {/* Company Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl bg-white/10 border-2 border-white/20 rounded-3xl p-8 mb-8 shadow-2xl"
        >
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3">
              <img
                src={companyDetails.image}
                alt={companyDetails.name}
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
            </div>
            
            <div className="lg:w-2/3">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                    {companyDetails.name}
                  </h1>
                  <div className="flex items-center gap-4 text-blue-200 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <span>{companyDetails.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-semibold">{companyDetails.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                {companyDetails.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-200">{companyDetails.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-200">{companyDetails.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-200">{companyDetails.website}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-green-400" />
                    <span className="text-blue-200">Founded: {companyDetails.founded}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-green-400" />
                    <span className="text-blue-200">Employees: {companyDetails.employees}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {companyDetails.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className={`px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${category?.color || 'from-blue-500 to-cyan-600'} text-white`}
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="backdrop-blur-xl bg-white/10 border-2 border-white/20 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Tab Headers */}
          <div className="flex flex-col md:flex-row border-b border-white/20">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 relative p-6 text-left transition-all duration-300 ${
                  activeTab === tab.id 
                    ? `bg-gradient-to-r ${category?.color || 'from-blue-500 to-cyan-600'} text-white shadow-lg` 
                    : 'text-blue-200 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <tab.icon className="w-5 h-5" />
                  <span className="font-semibold">{tab.label}</span>
                </div>
                
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeCompanyTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-white/50"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Company Overview</h3>
                    <p className="text-blue-100 leading-relaxed text-lg">
                      {companyDetails.name} has been at the forefront of renewable energy solutions since {companyDetails.founded}. 
                      With a team of {companyDetails.employees} dedicated professionals, we have successfully completed hundreds 
                      of projects across the UK, helping businesses and homeowners transition to sustainable energy solutions.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl">
                      <div className="text-3xl font-bold text-green-400 mb-2">500+</div>
                      <div className="text-blue-200">Projects Completed</div>
                    </div>
                    <div className="text-center p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl">
                      <div className="text-3xl font-bold text-blue-400 mb-2">15+</div>
                      <div className="text-blue-200">Years Experience</div>
                    </div>
                    <div className="text-center p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl">
                      <div className="text-3xl font-bold text-purple-400 mb-2">98%</div>
                      <div className="text-blue-200">Customer Satisfaction</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'services' && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Our Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {companyDetails.services.map((service) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: service.id * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-xl font-bold text-white">{service.name}</h4>
                          <span className="text-lg font-semibold text-green-400">{service.price}</span>
                        </div>
                        
                        <p className="text-blue-200 mb-4">{service.description}</p>
                        
                        <div className="space-y-2">
                          {service.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-sm text-blue-200">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Recent Projects</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companyDetails.projects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <img
                          src={project.image}
                          alt={project.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                          <h4 className="text-lg font-bold text-white mb-2">{project.name}</h4>
                          <div className="flex items-center gap-2 text-blue-200 mb-2">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{project.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-blue-200 mb-3">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{project.year}</span>
                          </div>
                          <p className="text-blue-200 text-sm">{project.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'certifications' && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Certifications & Accreditations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {companyDetails.certifications.map((cert, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        className="text-center p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 mb-4">
                          <Award className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-bold text-white text-lg">{cert}</h4>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl">
                    <h4 className="text-lg font-bold text-white mb-3">Quality Assurance</h4>
                    <p className="text-blue-200">
                      All our work is backed by industry-leading certifications and accreditations. We maintain the highest 
                      standards of quality and safety in every project we undertake, ensuring complete customer satisfaction 
                      and regulatory compliance.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyProductsServices;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAllCompanies, updateCompany, deleteCompany } from '../utils/companiesAPIExtended';
import { getCompaniesByHierarchicalCategory } from '../utils/companiesAPI';
import AdminCompanyControls from './AdminCompanyControls';
import EditCompanyModal from './EditCompanyModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { 
  Zap, 
  Leaf, 
  Globe, 
  Monitor, 
  Users, 
  Building, 
  Lightbulb,
  MapPin,
  Phone,
  Mail,
  Star,
  ArrowRight
} from 'lucide-react';

// New hierarchical categories matching the AdminOnboardCompany structure
const categories = [
  {
    id: 'renewable-energy',
    name: 'Renewable Energy',
    icon: Zap,
    color: 'from-green-500 to-emerald-600',
    description: 'Solar, Wind, Battery storage and renewable energy solutions'
  },
  {
    id: 'sustainable-esg-net-zero',
    name: 'Sustainable/ESG/Net Zero',
    icon: Leaf,
    color: 'from-emerald-500 to-teal-600',
    description: 'ESG consulting, net zero strategies and sustainability services'
  },
  {
    id: 'energy-management',
    name: 'Energy Management',
    icon: Globe,
    color: 'from-blue-500 to-cyan-600',
    description: 'Energy efficiency, monitoring and management systems'
  },
  {
    id: 'company-wellness',
    name: 'Company Wellness',
    icon: Users,
    color: 'from-pink-500 to-rose-600',
    description: 'Workplace wellbeing, occupational health and wellness services'
  },
  {
    id: 'it-related-services',
    name: 'IT Related Services',
    icon: Monitor,
    color: 'from-purple-500 to-indigo-600',
    description: 'Software, IoT, and technology solutions for energy sector'
  },
  {
    id: 'job-recruitment',
    name: 'Job Recruitment',
    icon: Users,
    color: 'from-orange-500 to-red-600',
    description: 'Talent acquisition and career opportunities in renewable energy'
  },
  {
    id: 'finance-funding',
    name: 'Finance & Funding',
    icon: Building,
    color: 'from-slate-500 to-gray-600',
    description: 'Investment, funding and financial services for green projects'
  },
  {
    id: 'eco-friendly-passivhaus',
    name: 'Eco Friendly/Passivhaus',
    icon: Lightbulb,
    color: 'from-yellow-500 to-amber-600',
    description: 'Passive house design and eco-friendly construction'
  },
  {
    id: 'utility-provision-civils',
    name: 'Utility Provision & Civils',
    icon: Building,
    color: 'from-cyan-500 to-blue-600',
    description: 'Utility infrastructure and civil engineering services'
  }
];

const ProductsServices = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [backendCompanies, setBackendCompanies] = useState([]);
  const [hierarchicalCompanies, setHierarchicalCompanies] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check if user is admin
  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setIsAdmin(userRole === 'admin');
  }, []);

  // Handler functions
  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setShowEditModal(true);
  };

  const handleDeleteCompany = (company) => {
    setDeleteTarget(company);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const result = await deleteCompany(deleteTarget.id);
    if (result.success) {
      // Refresh companies list
      const loadResult = await getAllCompanies();
      if (loadResult.success) {
        const companies = Array.isArray(loadResult.data?.data) ? loadResult.data.data : [];
        setBackendCompanies(companies);
      }
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    } else {
      alert('Error deleting company: ' + result.error);
    }
  };

  // Check for category parameter in URL and auto-select category
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      const category = categories.find(cat => cat.id === categoryParam);
      if (category) {
        setSelectedCategory(category);
      }
    }
  }, [searchParams]);

  // Load companies when category is selected
  useEffect(() => {
    if (selectedCategory) {
      loadCompaniesByCategory(selectedCategory.id);
    }
  }, [selectedCategory]);

  const loadCompaniesByCategory = async (categoryId) => {
    setLoading(true);
    try {
      const result = await getCompaniesByHierarchicalCategory(categoryId);
      if (result.success) {
        setHierarchicalCompanies(result.data || []);
      } else {
        console.error('Error loading companies:', result.error);
        setHierarchicalCompanies([]);
      }
    } catch (error) {
      console.error('Error loading companies:', error);
      setHierarchicalCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  // Load all companies for admin functionality
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const result = await getAllCompanies();
      if (cancelled) return;
      if (result.success) {
        const companies = Array.isArray(result.data?.data) ? result.data.data : [];
        setBackendCompanies(companies);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCompanyClick = (company) => {
    // Navigate to the sector page with company data
    const categoryData = {
      id: selectedCategory.id,
      name: selectedCategory.name,
      color: selectedCategory.color,
      description: selectedCategory.description
    };
    
    const route = {
      'renewable-energy': '/renewable',
      'sustainable-esg-net-zero': '/sustainable',
      'energy-management': '/energy-management',
      'company-wellness': '/company-wellness',
      'it-related-services': '/it-services',
      'job-recruitment': '/jobs-recruitment',
      'finance-funding': '/finance-funding',
      'eco-friendly-passivhaus': '/eco-friendly',
      'utility-provision-civils': '/utility-civils'
    }[selectedCategory.id] || '/renewable';

    navigate(route, { 
      state: { 
        company: company,
        category: categoryData,
        fromProductsServices: true
      } 
    });
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setHierarchicalCompanies([]);
  };

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
        {!selectedCategory ? (
          // Categories View
          <>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
                Products & Services
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Discover leading companies and solutions across renewable energy and sustainable technology sectors
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  onClick={() => setSelectedCategory(category)}
                  className="cursor-pointer group h-full"
                >
                  <div className="relative h-full min-h-[380px] flex flex-col backdrop-blur-xl bg-white/10 border-2 border-white/20 rounded-3xl p-8 shadow-2xl transition-all duration-500 hover:bg-white/20 hover:shadow-[0_20px_60px_rgba(59,130,246,0.5)] hover:border-white/40 overflow-hidden">
                    {/* Background gradient on hover */}
                    <div className={'absolute inset-0 bg-gradient-to-br ' + category.color + ' opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl'}></div>
                    
                    {/* Animated mesh pattern */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                      <div className={'absolute inset-0 bg-gradient-to-br ' + category.color + ' blur-xl'}></div>
                    </div>
                    
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center flex-1">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className={'inline-flex p-6 rounded-2xl bg-gradient-to-br ' + category.color + ' mb-6 shadow-lg group-hover:shadow-2xl group-hover:shadow-blue-500/50'}
                      >
                        <category.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      
                      <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-100 transition-colors min-h-[56px] flex items-center">
                        {category.name}
                      </h3>
                      
                      <p className="text-blue-200 text-sm leading-relaxed mb-6 flex-1 min-h-[60px]">
                        {category.description}
                      </p>
                      
                      <div className="mt-auto flex items-center justify-center gap-2 text-sm font-semibold text-blue-300 group-hover:text-white transition-colors bg-white/5 group-hover:bg-white/10 px-6 py-3 rounded-xl backdrop-blur-sm">
                        <span>View Companies</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-all duration-300" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          // Companies List View
          <>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <button
                onClick={handleBackToCategories}
                className="flex items-center gap-2 text-blue-300 hover:text-white font-semibold mb-6 transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to Categories
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className={'p-4 rounded-2xl bg-gradient-to-br ' + selectedCategory.color + ' shadow-lg'}>
                  <selectedCategory.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                    {selectedCategory.name}
                  </h1>
                  <p className="text-blue-200 mt-2">
                    {selectedCategory.description}
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                // Loading skeleton
                [1, 2, 3].map((i) => (
                  <div key={i} className="h-full min-h-[600px] flex flex-col backdrop-blur-xl bg-white/10 border-2 border-white/20 rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-64 bg-gray-300/20"></div>
                    <div className="flex-1 p-6 space-y-4">
                      <div className="h-6 bg-gray-300/20 rounded"></div>
                      <div className="h-4 bg-gray-300/20 rounded w-3/4"></div>
                      <div className="h-20 bg-gray-300/20 rounded"></div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-gray-300/20 rounded-full w-20"></div>
                        <div className="h-6 bg-gray-300/20 rounded-full w-24"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                hierarchicalCompanies.map((company, index) => (
                  <motion.div
                    key={company.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03, y: -8 }}
                    onClick={() => handleCompanyClick(company)}
                    className="cursor-pointer group h-full"
                  >
                    <div className="h-full min-h-[600px] flex flex-col backdrop-blur-xl bg-white/10 border-2 border-white/20 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:bg-white/20 hover:shadow-[0_20px_60px_rgba(59,130,246,0.5)] hover:border-white/40">
                      {/* Company Image */}
                      <div className="relative h-64 overflow-hidden">
                        <motion.img
                          src={company.image}
                          alt={company.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </div>

                      {/* Company Content */}
                      <div className="flex-1 p-6 flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-xl font-bold text-white">{company.name}</h3>
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-white text-sm">{company.rating}</span>
                          </div>
                        </div>

                        <div className="flex items-center text-blue-300 mb-3">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="text-sm">{company.location}</span>
                        </div>

                        <p className="text-gray-300 mb-4 flex-1">{company.description}</p>

                        {/* Specialties */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {company.specialties.map((specialty, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-gray-400">
                            <Phone className="w-4 h-4 mr-2" />
                            <span className="text-sm">{company.contact?.phone}</span>
                          </div>
                          <div className="flex items-center text-gray-400">
                            <Mail className="w-4 h-4 mr-2" />
                            <span className="text-sm">{company.contact?.email}</span>
                          </div>
                        </div>

                        {/* Admin Controls */}
                        <div className="flex items-center justify-between mt-auto">
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCompanyClick(company);
                            }}
                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span>View Details</span>
                            <ArrowRight className="w-4 h-4" />
                          </motion.button>

                          <AdminCompanyControls 
                            company={company}
                            onEdit={handleEditCompany}
                            onDelete={handleDeleteCompany}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {!loading && hierarchicalCompanies.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="text-blue-300 mb-4">
                  <Building className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No companies found in this category
                </h3>
                <p className="text-blue-200">
                  Companies with selections in this category will appear here once they are onboarded.
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );

  {/* Edit Modal */}
  <EditCompanyModal
    company={editingCompany}
    isOpen={showEditModal}
    onClose={() => {
      setShowEditModal(false);
      setEditingCompany(null);
    }}
    onUpdate={async () => {
      // Refresh companies list after update
      const result = await getAllCompanies();
      if (result.success) {
        const companies = Array.isArray(result.data?.data) ? result.data.data : [];
        setBackendCompanies(companies);
      }
      setShowEditModal(false);
      setEditingCompany(null);
    }}
  />

  {/* Delete Confirmation Modal */}
  <DeleteConfirmModal
    company={deleteTarget}
    isOpen={showDeleteConfirm}
    onClose={() => {
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    }}
    onConfirm={handleConfirmDelete}
  />
};

export default ProductsServices;

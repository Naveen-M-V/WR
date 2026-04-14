import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronDown, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { onboardCompany } from "../utils/companiesAPI";

const AdminOnboardCompany = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showRegionModal, setShowRegionModal] = useState(false);
  const [selectedRegionForSubregions, setSelectedRegionForSubregions] = useState(null);
  const [showSectorModal, setShowSectorModal] = useState(false);
  const [selectedMainSectorForSubsectors, setSelectedMainSectorForSubsectors] = useState(null);
  const [showSubsectorsModal, setShowSubsectorsModal] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactEmail: "",
    phoneNumber: "",
    role: "",
    companyName: "",
    companyRegNumber: "",
    companyAddress: "",
    postCode: "",
    mainSector: "",
    industrySector: [],
    productsServiceCategories: [],
    hierarchicalProductsServices: {}, // Store hierarchical selections
    productsServices: "",
    isRecruitmentCompany: "No",
    regions: [],
    companyLogo: null,
    productImages: [],
  });

  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedSubtopics, setExpandedSubtopics] = useState({});
  const [expandedTopics, setExpandedTopics] = useState({});

  const [logoPreview, setLogoPreview] = useState(null);
  const [productImagePreviews, setProductImagePreviews] = useState([]);

  const regionsData = useMemo(
    () => ({
      England: [
        "North East",
        "North West",
        "Yorkshire and The Humber",
        "East Midlands",
        "West Midlands",
        "East of England",
        "London",
        "South East",
        "South West",
      ],
      Scotland: [
        "Borders",
        "Central",
        "Dumfries and Galloway",
        "Fife",
        "Grampian",
        "Highland",
        "Lothian",
        "Orkney",
        "Shetland",
        "Strathclyde",
        "Tayside",
      ],
      Wales: [
        "Anglesey",
        "Blaenau Gwent",
        "Bridgend",
        "Caerphilly",
        "Cardiff",
        "Carmarthenshire",
        "Ceredigion",
        "Conwy",
        "Denbighshire",
        "Flintshire",
        "Gwynedd",
        "Merthyr Tydfil",
        "Monmouthshire",
        "Neath Port Talbot",
        "Newport",
        "Pembrokeshire",
        "Powys",
        "Rhondda Cynon Taf",
        "Swansea",
        "Torfaen",
        "Vale of Glamorgan",
        "Wrexham",
      ],
      "Northern Ireland": ["Antrim", "Armagh", "Down", "Fermanagh", "Londonderry", "Tyrone"],
    }),
    []
  );

  const sectorPages = useMemo(
    () => [
      { label: "Construction", route: "/construction" },
      { label: "Industrial", route: "/industrial" },
      { label: "Agriculture", route: "/agriculture" },
      { label: "Commercial / Retail", route: "/comercial" },
      { label: "Domestic", route: "/domestic" },
    ],
    []
  );

  const hierarchicalProductsServices = useMemo(
    () => ({
      "renewable-energy": {
        name: "RENEWABLE ENERGY",
        subtopics: {
          "solar-pv": {
            name: "Solar PV",
            topics: [
              "Hardware/Product Suppliers",
              "Service & Solutions",
              "Associated Services"
            ]
          },
          "battery-storage": {
            name: "Battery storage",
            topics: [
              "Hardware/Product Suppliers",
              "Service & Solutions",
              "Associated Services"
            ]
          },
          "ev-charging": {
            name: "EV Charging",
            topics: [
              "Hardware/Product Suppliers",
              "Service & Solutions",
              "Associated Services"
            ]
          },
          "wind-power": {
            name: "Wind Power",
            topics: [
              "Hardware/Product Suppliers",
              "Service & Solutions",
              "Associated Services"
            ]
          },
          "heat-pump-technology": {
            name: "Heat Pump Technology",
            topics: [
              "Hardware/Product Suppliers",
              "Service & Solutions",
              "Associated Services"
            ]
          },
          "led-lighting": {
            name: "LED Lighting",
            topics: [
              "Hardware/Product Suppliers",
              "Service & Solutions",
              "Associated Services"
            ]
          },
          "additional-products": {
            name: "Additional Products",
            topics: [
              "Hardware/Product Suppliers",
              "Service & Solutions",
              "Associated Services"
            ]
          }
        }
      },
      "sustainable-esg-net-zero": {
        name: "SUSTAINABLE / ESG / NET ZERO",
        subtopics: {
          "hardware-products-solutions": {
            name: "Hardware products and Solutions",
            topics: []
          },
          "sustainable-esg-services": {
            name: "Sustainable & ESG Services",
            topics: []
          },
          "net-zero-carbon-industry": {
            name: "Net Zero / Carbon Industry",
            topics: []
          }
        }
      },
      "energy-management": {
        name: "ENERGY MANAGEMENT",
        subtopics: {}
      },
      "it-related-services": {
        name: "IT RELATED SERVICES",
        subtopics: {
          "cloud-solutions-iot": {
            name: "Clour Solutions & IOT",
            topics: []
          },
          "cybersecurity-infrastructure": {
            name: "Cybersecurity & Infrastructure",
            topics: []
          },
          "managed-it-structure": {
            name: "Managed it Structure",
            topics: []
          }
        }
      },
      "job-recruitment": {
        name: "JOB RECRUITMENT",
        subtopics: {
          "internal-company-vacancies": {
            name: "Internal company vacancies",
            topics: []
          },
          "recruitment-agencies-job-vacancies": {
            name: "Recruitment agencies - Job vacancies",
            topics: []
          }
        }
      },
      "finance-funding": {
        name: "FINANCE AND FUNDING",
        subtopics: {}
      },
      "eco-friendly-passivhaus": {
        name: "ECO FRIENDLY / PASSIHAUS",
        subtopics: {}
      },
      "utility-provision-civils": {
        name: "UTILITY PROVISION & CIVILS",
        subtopics: {
          "utility-providers": {
            name: "Utility Providers",
            topics: []
          },
          "civils-infrastructure": {
            name: "Civils & Infrastructure",
            topics: []
          }
        }
      }
    }),
    []
  );

  const subsectorsByMainSector = useMemo(
    () => ({
      Construction: [
        "Construction",
        "Eco Friendly building products",
        "Electrical Systems",
        "Groundwork and Civils",
        "Mechanical and Electrical",
        "Passivhaus",
        "Planning and Consultative Services",
        "Solar PV - Ground Mounted",
        "Sustainable Construction",
        "Waste Management",
      ],
      Industrial: [
        "AI",
        "Finance & Funding",
        "Green Hydrogen",
        "Industrial",
        "IT Services",
        "Renewable Energy",
        "Sustainable / ESG / Net Zero",
      ],
      "Commercial / Retail": [
        "Battery Storage - Large Scale",
        "Carbon Management",
        "Commercial / Retail",
        "Eco Friendly / Passivhaus",
        "Energy Management",
        "Finance & Funding",
        "Green Hydrogen",
        "IT & Related Services",
        "Renewable Energy",
        "Sustainable / ESG / Net Zero",
        "Utility Provision & Civils",
      ],
      Agriculture: [
        "Agriculture",
        "Agritech",
        "Carbon Management",
        "Eco Friendly / Passivhaus",
        "Finance & Funding",
        "Green Hydrogen",
        "IT & Related Services",
        "Renewable Energy",
        "Sustainable / ESG / Net Zero",
        "Utility Provision & Civils",
      ],
      Domestic: [
        "Battery Storage - Small Scale",
        "Cleantech",
        "Domestic",
        "Eco Friendly / Passivhaus",
        "Energy Management",
        "Finance & Funding",
        "IT & Related Services",
        "Renewable Energy",
        "Sustainable / ESG / Net Zero",
      ],
    }),
    []
  );

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegionSelect = (region) => {
    setSelectedRegionForSubregions(region);
    setShowRegionModal(true);
  };

  const handleSubregionToggle = (subregion) => {
    if (!selectedRegionForSubregions) return;
    const key = `${selectedRegionForSubregions} - ${subregion}`;
    setFormData((prev) => {
      const exists = prev.regions.includes(key);
      return {
        ...prev,
        regions: exists ? prev.regions.filter((r) => r !== key) : [...prev.regions, key],
      };
    });
  };

  const handleRemoveRegion = (value) => {
    setFormData((prev) => ({
      ...prev,
      regions: prev.regions.filter((r) => r !== value),
    }));
  };

  const handleMainSectorPick = (mainSector) => {
    setSelectedMainSectorForSubsectors(mainSector);
    setShowSectorModal(false);
    setShowSubsectorsModal(true);
  };

  const handleSubsectorToggle = (subsector) => {
    setFormData((prev) => {
      const exists = prev.industrySector.includes(subsector);
      return {
        ...prev,
        industrySector: exists ? prev.industrySector.filter((s) => s !== subsector) : [...prev.industrySector, subsector],
      };
    });
  };

  const handleRemoveSubsector = (subsector) => {
    setFormData((prev) => ({
      ...prev,
      industrySector: prev.industrySector.filter((s) => s !== subsector),
    }));
  };

  // Hierarchical product/service handlers
  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const toggleSubtopicExpansion = (categoryId, subtopicId) => {
    const key = `${categoryId}-${subtopicId}`;
    setExpandedSubtopics(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleTopicsExpansion = (categoryId, subtopicId) => {
    const key = `${categoryId}-${subtopicId}-topics`;
    setExpandedTopics(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCategoryToggle = (categoryId) => {
    setFormData((prev) => {
      const exists = prev.productsServiceCategories.includes(categoryId);
      const newCategories = exists 
        ? prev.productsServiceCategories.filter(c => c !== categoryId)
        : [...prev.productsServiceCategories, categoryId];
      
      // Clear hierarchical selections if category is deselected
      const newHierarchical = { ...prev.hierarchicalProductsServices };
      if (!exists) {
        // Initialize category structure if newly selected
        if (!newHierarchical[categoryId]) {
          newHierarchical[categoryId] = {};
        }
      } else {
        // Remove category from hierarchical data
        delete newHierarchical[categoryId];
      }
      
      return {
        ...prev,
        productsServiceCategories: newCategories,
        hierarchicalProductsServices: newHierarchical
      };
    });
  };

  const handleTopicToggle = (categoryId, subtopicId, topic) => {
    setFormData((prev) => {
      const newHierarchical = { ...prev.hierarchicalProductsServices };
      
      // Initialize category if not exists
      if (!newHierarchical[categoryId]) {
        newHierarchical[categoryId] = {};
      }
      
      // Initialize subtopic if not exists
      if (!newHierarchical[categoryId][subtopicId]) {
        newHierarchical[categoryId][subtopicId] = [];
      }
      
      const topicIndex = newHierarchical[categoryId][subtopicId].indexOf(topic);
      if (topicIndex > -1) {
        // Remove topic
        newHierarchical[categoryId][subtopicId].splice(topicIndex, 1);
        
        // Clean up empty subtopics and categories
        if (newHierarchical[categoryId][subtopicId].length === 0) {
          delete newHierarchical[categoryId][subtopicId];
        }
      } else {
        // Add topic
        newHierarchical[categoryId][subtopicId].push(topic);
      }
      
      return {
        ...prev,
        hierarchicalProductsServices: newHierarchical
      };
    });
  };

  const getSelectedTopicsCount = (categoryId, subtopicId) => {
    return formData.hierarchicalProductsServices[categoryId]?.[subtopicId]?.length || 0;
  };

  const isTopicSelected = (categoryId, subtopicId, topic) => {
    return formData.hierarchicalProductsServices[categoryId]?.[subtopicId]?.includes(topic) || false;
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Logo file size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError("Please upload an image file");
        return;
      }
      setFormData(prev => ({ ...prev, companyLogo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        setError(`File ${file.name} is too large (max 5MB)`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        setError(`File ${file.name} is not an image`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        productImages: [...prev.productImages, ...validFiles]
      }));

      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProductImagePreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeProductImage = (index) => {
    setFormData(prev => ({
      ...prev,
      productImages: prev.productImages.filter((_, i) => i !== index)
    }));
    setProductImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/");
      return;
    }

    setError("");
    setSuccessMessage("");

    if (!formData.companyName || !formData.mainSector) {
      setError("Company name and main sector are required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        companyName: formData.companyName,
        companyRegNumber: formData.companyRegNumber,
        companyAddress: formData.companyAddress,
        postCode: formData.postCode,
        industrySector: formData.industrySector,
        mainSector: formData.mainSector,
        productsServiceCategories: formData.productsServiceCategories,
        hierarchicalProductsServices: formData.hierarchicalProductsServices,
        productsServices: formData.productsServices,
        isRecruitmentCompany: formData.isRecruitmentCompany,
        regions: formData.regions,
        firstName: formData.firstName,
        lastName: formData.lastName,
        contactEmail: formData.contactEmail,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
      };

      const result = await onboardCompany(payload);
      if (!result.success) {
        setError(result.error || "Failed to onboard company");
        return;
      }

      setSuccessMessage("Company onboarded successfully with hierarchical products and services");

      const route = sectorPages.find((s) => s.label === formData.mainSector)?.route;
      if (route) {
        navigate(route);
      } else {
        navigate("/showcase-hub/product-service-in-spotlight");
      }
    } catch (e) {
      setError("Failed to onboard company");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#051f46] pt-32 pb-16 px-4">
        <div className="max-w-2xl mx-auto backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 text-white">
          <h1 className="text-2xl font-bold mb-2">Admin Access Required</h1>
          <p className="text-blue-100">Please login with an admin account to onboard a company.</p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 font-semibold"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#051f46] pt-32 pb-16 px-4">
      <div className="max-w-5xl mx-auto backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Onboard a Company</h1>
            <p className="text-blue-100 mt-1">Add a company to sectors and products & services listings.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition"
          >
            Back
          </button>
        </div>

        {error ? (
          <div className="mb-6 bg-red-500/20 border border-red-400/30 rounded-xl p-4">{error}</div>
        ) : null}
        {successMessage ? (
          <div className="mb-6 bg-green-500/20 border border-green-400/30 rounded-xl p-4">{successMessage}</div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Company Details</h2>

            <div>
              <label className="block text-sm text-blue-100 mb-2">Company Name</label>
              <input
                value={formData.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/60"
              />
            </div>

            <div>
              <label className="block text-sm text-blue-100 mb-2">Company Registration Number</label>
              <input
                value={formData.companyRegNumber}
                onChange={(e) => handleChange("companyRegNumber", e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/60"
              />
            </div>

            <div>
              <label className="block text-sm text-blue-100 mb-2">Company Address</label>
              <input
                value={formData.companyAddress}
                onChange={(e) => handleChange("companyAddress", e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/60"
              />
            </div>

            <div>
              <label className="block text-sm text-blue-100 mb-2">Post Code</label>
              <input
                value={formData.postCode}
                onChange={(e) => handleChange("postCode", e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/60"
              />
            </div>

            <div>
              <label className="block text-sm text-blue-100 mb-2">Main Sector Page</label>
              <select
                value={formData.mainSector}
                onChange={(e) => handleChange("mainSector", e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/60"
              >
                <option value="">Select</option>
                {sectorPages.map((s) => (
                  <option key={s.label} value={s.label}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-blue-100 mb-2">Industry Sectors (Subsectors)</label>
              <button
                type="button"
                onClick={() => setShowSectorModal(true)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-left flex items-center justify-between hover:bg-white/15 transition"
              >
                <span>
                  {formData.industrySector.length > 0
                    ? `${formData.industrySector.length} sector(s) selected`
                    : "Select industry sectors"}
                </span>
                <ChevronDown size={18} className="text-blue-200" />
              </button>

              {formData.industrySector.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.industrySector.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => handleRemoveSubsector(s)}
                        className="text-blue-200 hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div>
              <label className="block text-sm text-blue-100 mb-2">Products & Services Categories</label>
              <div className="space-y-2">
                {Object.entries(hierarchicalProductsServices).map(([categoryId, category]) => {
                  const isCategorySelected = formData.productsServiceCategories.includes(categoryId);
                  const isExpanded = expandedCategories[categoryId];
                  const hasSubtopics = Object.keys(category.subtopics).length > 0;
                  const selectedCount = Object.values(formData.hierarchicalProductsServices[categoryId] || {})
                    .reduce((total, topics) => total + topics.length, 0);
                  
                  return (
                    <div key={categoryId} className="bg-white/5 border border-white/15 rounded-xl overflow-hidden">
                      {/* Main Category Header */}
                      <button
                        type="button"
                        onClick={() => handleCategoryToggle(categoryId)}
                        className={`w-full px-4 py-3 text-left flex items-center justify-between transition ${
                          isCategorySelected ? "bg-blue-500/20 border-blue-400/30" : "hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                              isCategorySelected ? "border-blue-300" : "border-white/30"
                            }`}
                          >
                            {isCategorySelected ? <Check size={14} className="text-blue-200" /> : null}
                          </span>
                          <span className="font-bold text-white">{category.name}</span>
                          {selectedCount > 0 && (
                            <span className="text-xs bg-blue-500/30 text-blue-200 px-2 py-1 rounded-full">
                              {selectedCount} selected
                            </span>
                          )}
                        </div>
                        {isCategorySelected && hasSubtopics && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCategoryExpansion(categoryId);
                            }}
                            className="text-blue-200 hover:text-white transition"
                          >
                            <ChevronDown 
                              size={18} 
                              className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            />
                          </button>
                        )}
                      </button>

                      {/* Subtopics Level */}
                      {isCategorySelected && isExpanded && hasSubtopics && (
                        <div className="border-t border-white/10">
                          {Object.entries(category.subtopics).map(([subtopicId, subtopic]) => {
                            const isSubtopicExpanded = expandedSubtopics[`${categoryId}-${subtopicId}`];
                            const subtopicSelectedCount = getSelectedTopicsCount(categoryId, subtopicId);
                            const hasTopics = subtopic.topics.length > 0;
                            const isRenewableEnergy = categoryId === "renewable-energy";
                            
                            return (
                              <div key={subtopicId} className="border-b border-white/5 last:border-b-0">
                                {/* Subtopic Header */}
                                <button
                                  type="button"
                                  onClick={() => toggleSubtopicExpansion(categoryId, subtopicId)}
                                  className="w-full px-8 py-2 text-left flex items-center justify-between hover:bg-white/5 transition"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-blue-100 underline">
                                      {subtopic.name}
                                    </span>
                                    {subtopicSelectedCount > 0 && (
                                      <span className="text-xs bg-green-500/30 text-green-200 px-2 py-0.5 rounded-full">
                                        {subtopicSelectedCount}
                                      </span>
                                    )}
                                  </div>
                                  {hasTopics && (
                                    <ChevronDown 
                                      size={16} 
                                      className={`text-blue-300 transition-transform ${
                                        isSubtopicExpanded ? 'rotate-180' : ''
                                      }`}
                                    />
                                  )}
                                </button>

                                {/* Topics Level - Three Level Hierarchy for Renewable Energy */}
                                {isSubtopicExpanded && hasTopics && (
                                  <div className="border-t border-white/5">
                                    {isRenewableEnergy ? (
                                      // Three-level hierarchy for Renewable Energy
                                      <div className="px-8 py-2">
                                        <button
                                          type="button"
                                          onClick={() => toggleTopicsExpansion(categoryId, subtopicId)}
                                          className="w-full text-left flex items-center justify-between hover:bg-white/5 transition px-4 py-2"
                                        >
                                          <span className="text-sm text-blue-200">
                                            View Topics ({subtopic.topics.length})
                                          </span>
                                          <ChevronDown 
                                            size={14} 
                                            className={`text-blue-300 transition-transform ${
                                              expandedTopics[`${categoryId}-${subtopicId}-topics`] ? 'rotate-180' : ''
                                            }`}
                                          />
                                        </button>
                                        
                                        {expandedTopics[`${categoryId}-${subtopicId}-topics`] && (
                                          <div className="px-4 pb-3">
                                            <div className="grid grid-cols-1 gap-2">
                                              {subtopic.topics.map((topic) => {
                                                const isSelected = isTopicSelected(categoryId, subtopicId, topic);
                                                return (
                                                  <button
                                                    key={topic}
                                                    type="button"
                                                    onClick={() => handleTopicToggle(categoryId, subtopicId, topic)}
                                                    className={`px-3 py-2 rounded-lg border transition text-left text-sm flex items-center gap-2 ${
                                                      isSelected
                                                        ? "bg-green-500/20 border-green-400/40"
                                                        : "bg-white/5 border-white/15 hover:bg-white/10"
                                                    }`}
                                                  >
                                                    <span
                                                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                                                        isSelected ? "border-green-300" : "border-white/30"
                                                      }`}
                                                    >
                                                      {isSelected ? <Check size={10} className="text-green-200" /> : null}
                                                    </span>
                                                    <span className="text-blue-100">{topic}</span>
                                                  </button>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      // Two-level hierarchy for other categories
                                      <div className="px-8 pb-3">
                                        <div className="grid grid-cols-1 gap-2">
                                          {subtopic.topics.map((topic) => {
                                            const isSelected = isTopicSelected(categoryId, subtopicId, topic);
                                            return (
                                              <button
                                                key={topic}
                                                type="button"
                                                onClick={() => handleTopicToggle(categoryId, subtopicId, topic)}
                                                className={`px-3 py-2 rounded-lg border transition text-left text-sm flex items-center gap-2 ${
                                                  isSelected
                                                    ? "bg-green-500/20 border-green-400/40"
                                                    : "bg-white/5 border-white/15 hover:bg-white/10"
                                                }`}
                                              >
                                                <span
                                                  className={`w-4 h-4 rounded border flex items-center justify-center ${
                                                    isSelected ? "border-green-300" : "border-white/30"
                                                  }`}
                                                >
                                                  {isSelected ? <Check size={10} className="text-green-200" /> : null}
                                                </span>
                                                <span className="text-blue-100">{topic}</span>
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm text-blue-100 mb-2">Products & Services Description</label>
              <textarea
                value={formData.productsServices}
                onChange={(e) => handleChange("productsServices", e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/60"
              />
            </div>

            <div>
              <label className="block text-sm text-blue-100 mb-2">Recruitment Company?</label>
              <select
                value={formData.isRecruitmentCompany}
                onChange={(e) => handleChange("isRecruitmentCompany", e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/60"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-blue-100 mb-2">Company Logo</label>
              <div className="space-y-3">
                <div className="border-2 border-dashed border-white/20 rounded-xl p-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer flex flex-col items-center justify-center py-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <span className="text-sm text-blue-200">Click to upload logo</span>
                    <span className="text-xs text-blue-300 mt-1">Max 5MB, JPG/PNG</span>
                  </label>
                </div>
                {logoPreview && (
                  <div className="relative">
                    <img
                      src={logoPreview}
                      alt="Company logo preview"
                      className="h-20 w-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, companyLogo: null }));
                        setLogoPreview(null);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm text-blue-100 mb-2">Products & Services Images</label>
              <div className="space-y-3">
                <div className="border-2 border-dashed border-white/20 rounded-xl p-4">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleProductImageUpload}
                    className="hidden"
                    id="product-images-upload"
                  />
                  <label
                    htmlFor="product-images-upload"
                    className="cursor-pointer flex flex-col items-center justify-center py-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm text-blue-200">Click to upload product images</span>
                    <span className="text-xs text-blue-300 mt-1">Max 5MB per image, JPG/PNG</span>
                  </label>
                </div>
                {productImagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {productImagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Product image ${index + 1}`}
                          className="h-20 w-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeProductImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Contact Person</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-blue-100 mb-2">First Name</label>
                <input
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                />
              </div>
              <div>
                <label className="block text-sm text-blue-100 mb-2">Last Name</label>
                <input
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-blue-100 mb-2">Contact Email</label>
              <input
                value={formData.contactEmail}
                onChange={(e) => handleChange("contactEmail", e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/60"
              />
            </div>

            <div>
              <label className="block text-sm text-blue-100 mb-2">Phone Number</label>
              <input
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/60"
              />
            </div>

            <div>
              <label className="block text-sm text-blue-100 mb-2">Role</label>
              <input
                value={formData.role}
                onChange={(e) => handleChange("role", e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/60"
              />
            </div>

            <div>
              <label className="block text-sm text-blue-100 mb-2">Regions</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(regionsData).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRegionSelect(r)}
                    className="px-3 py-2 rounded-xl bg-white/5 border border-white/15 hover:bg-white/10 transition text-left"
                  >
                    {r}
                  </button>
                ))}
              </div>

              {formData.regions.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.regions.map((r) => (
                    <span
                      key={r}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm"
                    >
                      {r}
                      <button
                        type="button"
                        onClick={() => handleRemoveRegion(r)}
                        className="text-blue-200 hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-blue-600 font-bold hover:opacity-95 transition disabled:opacity-60"
              >
                {loading ? "Onboarding..." : "Onboard Company"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSectorModal ? (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-[#051f46] border border-white/20 rounded-3xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Select Main Sector</h3>
              <button
                type="button"
                onClick={() => setShowSectorModal(false)}
                className="text-blue-200 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.keys(subsectorsByMainSector).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleMainSectorPick(m)}
                  className="px-4 py-3 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/15 transition text-left"
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {showSubsectorsModal ? (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-[#051f46] border border-white/20 rounded-3xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Select Subsectors: {selectedMainSectorForSubsectors}</h3>
              <button
                type="button"
                onClick={() => setShowSubsectorsModal(false)}
                className="text-blue-200 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[55vh] overflow-auto pr-1">
              {(subsectorsByMainSector[selectedMainSectorForSubsectors] || []).map((s) => {
                const checked = formData.industrySector.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSubsectorToggle(s)}
                    className={`px-4 py-3 rounded-2xl border transition text-left flex items-center gap-3 ${
                      checked ? "bg-blue-500/25 border-blue-400/40" : "bg-white/10 border-white/20 hover:bg-white/15"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center ${
                        checked ? "border-blue-300" : "border-white/30"
                      }`}
                    >
                      {checked ? <Check size={16} className="text-blue-200" /> : null}
                    </span>
                    <span>{s}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowSubsectorsModal(false)}
                className="px-5 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showRegionModal && selectedRegionForSubregions ? (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-[#051f46] border border-white/20 rounded-3xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Select Subregions: {selectedRegionForSubregions}</h3>
              <button
                type="button"
                onClick={() => setShowRegionModal(false)}
                className="text-blue-200 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[55vh] overflow-auto pr-1">
              {(regionsData[selectedRegionForSubregions] || []).map((s) => {
                const key = `${selectedRegionForSubregions} - ${s}`;
                const checked = formData.regions.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSubregionToggle(s)}
                    className={`px-4 py-3 rounded-2xl border transition text-left flex items-center gap-3 ${
                      checked ? "bg-blue-500/25 border-blue-400/40" : "bg-white/10 border-white/20 hover:bg-white/15"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center ${
                        checked ? "border-blue-300" : "border-white/30"
                      }`}
                    >
                      {checked ? <Check size={16} className="text-blue-200" /> : null}
                    </span>
                    <span>{s}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowRegionModal(false)}
                className="px-5 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminOnboardCompany;

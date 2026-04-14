import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronDown, X, Building2, User, Mail, Phone, Globe, MapPin, FileText, CreditCard, Calendar, AlertCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { userOnboardCompany } from "../../utils/companiesAPI";

const UserOnboardCompany = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    // Determine limits based on user plan
    const plan = user?.subscription?.toLowerCase() || 'standard';
    const isElite = plan.includes('elite') || plan.includes('premium');
    const maxWords = isElite ? 600 : 300;
    const timeoutRef = React.useRef(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [currentStep, setCurrentStep] = useState(1);

    // Cleanup timeout on unmount
    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Company Fields
    const [companyData, setCompanyData] = useState({
        companyName: "",
        companyLocation: "",
        postCode: "",
        companyEmail: "",
        companyPhone: "",
        companyWebsite: "",
        socialMediaLinks: { linkedin: "", instagram: "", twitter: "", facebook: "" },
    companyBio: "",
        companyOverview: "",
        selectedSectors: [],
        selectedSubsectors: {},
        companyLogo: null
    });

    // Modal state for subsector selection
    const [showSubsectorModal, setShowSubsectorModal] = useState(false);
    const [activeSectorForModal, setActiveSectorForModal] = useState(null);

    // Logo preview
    const [logoPreview, setLogoPreview] = useState(null);

    // Sector categories based on the 5 main sectors
    const mainSectors = useMemo(() => ({
        "Construction": {
            color: "bg-orange-100",
            borderColor: "border-orange-300",
            textColor: "text-orange-800",
            subcategories: [
                "Construction",
                "Eco Friendly building products",
                "Electrical Systems",
                "Groundwork and Civils",
                "Mechanical and Electrical",
                "Passivhaus",
                "Planning and Consultative Services",
                "Solar PV - Ground Mounted",
                "Sustainable Construction",
                "Waste Management"
            ]
        },
        "Agriculture": {
            color: "bg-purple-100",
            borderColor: "border-purple-300",
            textColor: "text-purple-800",
            subcategories: [
                "Agriculture",
                "Agritech",
                "Carbon Management",
                "Carbon Reduction",
                "ESG Products",
                "ESG Services",
                "Waste Management"
            ]
        },
        "Domestic": {
            color: "bg-green-100",
            borderColor: "border-green-300",
            textColor: "text-green-800",
            subcategories: [
                "Battery Storage - Small Scale",
                "Cleantech",
                "Domestic",
                "Eco Friendly building products",
                "Electrical Systems",
                "Energy Efficiency",
                "Energy Management",
                "EV Charging",
                "Solar PV",
                "Utility Provision"
            ]
        },
        "Industrial": {
            color: "bg-green-200",
            borderColor: "border-green-400",
            textColor: "text-green-900",
            subcategories: [
                "AI",
                "Finance & Funding",
                "Green Hydrogen",
                "Industrial",
                "Mechanical and Electrical",
                "Planning and Consultative Services",
                "Water & Marine",
                "Wind Power"
            ]
        },
        "Commercial and Retail": {
            color: "bg-blue-100",
            borderColor: "border-blue-300",
            textColor: "text-blue-800",
            subcategories: [
                "Battery Storage - Large Scale",
                "Carbon Management",
                "Commercial / Retail",
                "Energy Efficiency",
                "Energy Management",
                "HVAC",
                "Lean Management",
                "LED Lighting"
            ]
        }
    }), []);

    const [overviewCount, setOverviewCount] = useState(0);
    const [overviewError, setOverviewError] = useState("");

    const handleCompanyDataChange = (field, value) => {
        setCompanyData(prev => ({ ...prev, [field]: value }));
    };

    const handleCompanyOverviewChange = (e) => {
        const text = e.target.value;
        const words = text.trim().split(/\s+/).filter(Boolean).length;

        if (words <= maxWords) {
            setOverviewCount(words);
            handleCompanyDataChange("companyOverview", text);
            setOverviewError("");
        } else {
            if (text.length < companyData.companyOverview.length) {
                setOverviewCount(words);
                handleCompanyDataChange("companyOverview", text);
            } else {
                setOverviewError(`Word limit reached: Maximum ${maxWords} words allowed.`);
            }
        }
    };

    const handleSectorToggle = (sector) => {
        // Open modal to select subsectors for this sector
        setActiveSectorForModal(sector);
        setShowSubsectorModal(true);

        // Add sector to selectedSectors if not already present
        setCompanyData(prev => {
            if (!prev.selectedSectors.includes(sector)) {
                return {
                    ...prev,
                    selectedSectors: [...prev.selectedSectors, sector],
                    selectedSubsectors: { ...prev.selectedSubsectors, [sector]: [] }
                };
            }
            return prev;
        });
    };

    const handleSubsectorToggle = (sector, subsector) => {
        setCompanyData(prev => {
            const currentSubsectors = prev.selectedSubsectors[sector] || [];
            const exists = currentSubsectors.includes(subsector);

            return {
                ...prev,
                selectedSubsectors: {
                    ...prev.selectedSubsectors,
                    [sector]: exists
                        ? currentSubsectors.filter(s => s !== subsector)
                        : [...currentSubsectors, subsector]
                }
            };
        });
    };

    const handleRemoveSector = (sector) => {
        setCompanyData(prev => ({
            ...prev,
            selectedSectors: prev.selectedSectors.filter(s => s !== sector),
            selectedSubsectors: { ...prev.selectedSubsectors, [sector]: [] }
        }));
    };

    const handleRemoveSubsector = (sector, subsector) => {
        setCompanyData(prev => ({
            ...prev,
            selectedSubsectors: {
                ...prev.selectedSubsectors,
                [sector]: (prev.selectedSubsectors[sector] || []).filter(s => s !== subsector)
            }
        }));
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
            setCompanyData(prev => ({ ...prev, companyLogo: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const isValidHttpUrl = (value) => {
        if (!value || !String(value).trim()) return true;
        try {
            const parsed = new URL(String(value).trim());
            return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
            return false;
        }
    };


    const validateStep1 = () => {
        if (!companyData.companyName || !companyData.companyLocation) {
            setError("Please fill in company name and location.");
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (!companyData.companyEmail) {
            setError("Please fill in company email.");
            return false;
        }
        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(companyData.companyEmail)) {
            setError("Please enter a valid email address.");
            return false;
        }
        if (!isValidHttpUrl(companyData.companyWebsite)) {
            setError("Please enter a valid company website URL.");
            return false;
        }
        const hasInvalidSocial = Object.values(companyData.socialMediaLinks || {}).some(link => !isValidHttpUrl(link));
        if (hasInvalidSocial) {
            setError("Please enter valid social media URLs.");
            return false;
        }
        return true;
    };

    const validateStep3 = () => {
        if (companyData.selectedSectors.length === 0) {
            setError("Please select at least one sector.");
            return false;
        }
        return true;
    }

    const handleNextStep = () => {
        setError("");
        if (currentStep === 1 && validateStep1()) {
            setCurrentStep(2);
        } else if (currentStep === 2 && validateStep2()) {
            setCurrentStep(3);
        }
    };

    const handlePrevStep = () => {
        setError("");
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async () => {
        // In a real app, you would likely check if the user has a valid subscription here
        // For now, we assume they are redirected here after payment or they are authenticated

        setError("");
        setSuccessMessage("");
        setLoading(true);

        try {
            const payload = {
                companyName: companyData.companyName,
                companyAddress: companyData.companyLocation,
                postCode: companyData.postCode || "",
                companyWebsite: companyData.companyWebsite,
                websiteLink: companyData.companyWebsite || "",
                socialMediaLinks: companyData.socialMediaLinks || {},
                companyBio: companyData.companyBio || "",
                productsServices: companyData.companyOverview || "",
                industrySector: companyData.selectedSectors || [],
                mainSector: (companyData.selectedSectors || [])[0] || null,
                contactEmail: companyData.companyEmail,
                phoneNumber: companyData.companyPhone || "",
                firstName: user?.username || "Company",
                lastName: "",
                role: "Company Admin",
                regions: [companyData.companyLocation],
            };

            const result = await userOnboardCompany(payload);
            if (!result.success) {
                setError(result.error || result.message || "Failed to create company profile.");
                return;
            }

            setSuccessMessage(`Company "${companyData.companyName}" profile created successfully!`);

            timeoutRef.current = setTimeout(() => {
                const companyId = result?.data?.data?.id;
                if (companyId) navigate(`/company/${companyId}`);
                else navigate("/dashboard");
            }, 2000);

        } catch (e) {
            console.error('Onboarding error:', e);
            setError("Failed to create company profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        // Optional: Redirect to login if not authenticated
        // return <Navigate to="/login" replace />;
        return (
            <div className="min-h-screen bg-[#051f46] pt-32 pb-16 px-4">
                <div className="max-w-2xl mx-auto backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 text-white">
                    <div className="flex items-center justify-center mb-6">
                        <User className="w-16 h-16 text-yellow-400" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2 text-center">Authentication Required</h1>
                    <p className="text-blue-100 text-center">Please login to setup your company profile.</p>
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="mt-6 w-full px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 font-semibold hover:opacity-95 transition"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#051f46] pt-24 pb-16 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Setup Your Company Profile</h1>
                            <p className="text-blue-200">Complete your company profile to get started.</p>
                        </div>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center">
                        <div className="flex items-center gap-4">
                            {[1, 2, 3].map((step, index) => (
                                <React.Fragment key={step}>
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${currentStep >= step
                                        ? "bg-gradient-to-r from-green-400 to-blue-500 text-white"
                                        : "bg-white/10 text-blue-200"
                                        }`}>
                                        {step}
                                    </div>
                                    {index < 2 && (
                                        <div className={`w-16 h-1 rounded transition-all ${currentStep > step ? "bg-gradient-to-r from-green-400 to-blue-500" : "bg-white/10"
                                            }`} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-center gap-16 mt-2 text-sm">
                        <span className={currentStep >= 1 ? "text-white" : "text-blue-300"}>Basic Info</span>
                        <span className={currentStep >= 2 ? "text-white" : "text-blue-300"}>Contact & Details</span>
                        <span className={currentStep >= 3 ? "text-white" : "text-blue-300"}>Sectors</span>
                    </div>
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <div className="mb-6 bg-red-500/20 border border-red-400/30 rounded-xl p-4 flex items-center gap-3">
                        <X className="w-5 h-5 text-red-400" />
                        <span className="text-red-200">{error}</span>
                    </div>
                )}
                {successMessage && (
                    <div className="mb-6 bg-green-500/20 border border-green-400/30 rounded-xl p-4 flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-400" />
                        <span className="text-green-200">{successMessage}</span>
                    </div>
                )}

                {/* Form Container */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 text-white">

                    {/* Step 1: Basic Info */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Building2 className="w-6 h-6 text-green-400" />
                                <h2 className="text-2xl font-semibold">Basic Company Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-blue-100 mb-2">Company Name *</label>
                                    <input
                                        type="text"
                                        value={companyData.companyName}
                                        onChange={(e) => handleCompanyDataChange("companyName", e.target.value)}
                                        placeholder="Enter company name"
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/60 text-white placeholder-blue-300/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-blue-100 mb-2">Company Location *</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-blue-300" />
                                        <input
                                            type="text"
                                            value={companyData.companyLocation}
                                            onChange={(e) => handleCompanyDataChange("companyLocation", e.target.value)}
                                            placeholder="City, Country"
                                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/60 text-white placeholder-blue-300/50"
                                        />
                                    </div>
                                </div>

                                {/* Company Logo */}
                                <div className="md:col-span-2 pt-4">
                                    <label className="block text-sm text-blue-100 mb-2">Company Logo</label>
                                    <div className="flex items-center gap-4">
                                        <div className="border-2 border-dashed border-white/20 rounded-xl p-4 w-full md:w-auto">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoUpload}
                                                className="hidden"
                                                id="logo-upload"
                                            />
                                            <label
                                                htmlFor="logo-upload"
                                                className="cursor-pointer flex flex-col items-center justify-center py-4 px-6"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2">
                                                    <Building2 className="w-5 h-5 text-blue-300" />
                                                </div>
                                                <span className="text-sm text-blue-200">Upload Logo</span>
                                                <span className="text-xs text-blue-300 mt-1">Max 5MB</span>
                                            </label>
                                        </div>
                                        {logoPreview && (
                                            <div className="relative">
                                                <img
                                                    src={logoPreview}
                                                    alt="Company logo preview"
                                                    className="h-20 w-20 object-cover rounded-xl border border-white/20"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setCompanyData(prev => ({ ...prev, companyLogo: null }));
                                                        setLogoPreview(null);
                                                    }}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleNextStep}
                                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 font-semibold hover:opacity-95 transition"
                                >
                                    Next Step →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Contact & Details */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Mail className="w-6 h-6 text-green-400" />
                                <h2 className="text-2xl font-semibold">Contact & Additional Details</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-blue-100 mb-2">Company Email *</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3.5 w-5 h-5 text-blue-300" />
                                        <input
                                            type="email"
                                            value={companyData.companyEmail}
                                            onChange={(e) => handleCompanyDataChange("companyEmail", e.target.value)}
                                            placeholder="contact@company.com"
                                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/60 text-white placeholder-blue-300/50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-blue-100 mb-2">Company Phone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3.5 w-5 h-5 text-blue-300" />
                                        <input
                                            type="tel"
                                            value={companyData.companyPhone}
                                            onChange={(e) => handleCompanyDataChange("companyPhone", e.target.value)}
                                            placeholder="+44 123 456 7890"
                                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/60 text-white placeholder-blue-300/50"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm text-blue-100 mb-2">Company Website</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-3.5 w-5 h-5 text-blue-300" />
                                        <input
                                            type="url"
                                            value={companyData.companyWebsite}
                                            onChange={(e) => handleCompanyDataChange("companyWebsite", e.target.value)}
                                            placeholder="https://www.company.com"
                                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/60 text-white placeholder-blue-300/50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-blue-100 mb-2">Post Code / Pin Code</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-blue-300" />
                                        <input
                                            type="text"
                                            value={companyData.postCode || ""}
                                            onChange={(e) => handleCompanyDataChange("postCode", e.target.value)}
                                            placeholder="e.g. SW1A 1AA"
                                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/60 text-white placeholder-blue-300/50"
                                        />
                                    </div>
                                </div>

                                {[
                                    ["linkedin", "LinkedIn URL"],
                                    ["instagram", "Instagram URL"],
                                    ["twitter", "Twitter/X URL"],
                                    ["facebook", "Facebook URL"],
                                ].map(([key, label]) => (
                                    <div key={key}>
                                        <label className="block text-sm text-blue-100 mb-2">{label}</label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-3.5 w-5 h-5 text-blue-300" />
                                            <input
                                                type="url"
                                                value={companyData.socialMediaLinks?.[key] || ""}
                                                onChange={(e) => handleCompanyDataChange("socialMediaLinks", { ...(companyData.socialMediaLinks || {}), [key]: e.target.value })}
                                                placeholder="https://..."
                                                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/60 text-white placeholder-blue-300/50"
                                            />
                                        </div>
                                    </div>
                                ))}

                <div className="md:col-span-2">
                  <label className="block text-sm text-blue-100 mb-2">Company Bio (max 25 words)</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3.5 w-5 h-5 text-blue-300" />
                    <input
                      type="text"
                      value={companyData.companyBio}
                      onChange={(e) => {
                        const text = e.target.value;
                        const words = text.trim().split(/\\s+/).filter(Boolean);
                        const limited = words.slice(0, 25).join(" ");
                        handleCompanyDataChange("companyBio", limited);
                      }}
                      placeholder="Short tagline or bio shown on profile header"
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/60 text-white placeholder-blue-300/50"
                    />
                    <div className="mt-2 text-xs text-blue-300">
                      {((companyData.companyBio || "").trim().split(/\\s+/).filter(Boolean).length)}/25 words
                    </div>
                  </div>
                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm text-blue-100 mb-2">Company Overview</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3.5 w-5 h-5 text-blue-300" />
                                        <textarea
                                            value={companyData.companyOverview}
                                            onChange={handleCompanyOverviewChange}
                                            placeholder="Brief description of the company..."
                                            rows={4}
                                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/60 text-white placeholder-blue-300/50 resize-none"
                                        />

                                        <div className="flex justify-between items-center mt-2">
                                            <p className="text-xs text-blue-300">
                                                {overviewCount}/{maxWords} words
                                            </p>
                                            {overviewError && (
                                                <p className="text-xs text-red-400 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" /> {overviewError}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6 flex justify-between">
                                <button
                                    type="button"
                                    onClick={handlePrevStep}
                                    className="px-8 py-3 rounded-xl bg-white/10 border border-white/20 font-semibold hover:bg-white/20 transition"
                                >
                                    ← Previous
                                </button>
                                <button
                                    type="button"
                                    onClick={handleNextStep}
                                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 font-semibold hover:opacity-95 transition"
                                >
                                    Next Step →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Sectors */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Check className="w-6 h-6 text-green-400" />
                                <h2 className="text-2xl font-semibold">Select Industry Sectors</h2>
                            </div>

                            {/* Sector Selection */}
                            <div className="pt-4">
                                <label className="block text-sm text-blue-100 mb-4">Select Sectors (Choose at least one) *</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Object.entries(mainSectors).map(([sectorKey, sector]) => {
                                        const isSelected = companyData.selectedSectors.includes(sectorKey);
                                        return (
                                            <button
                                                key={sectorKey}
                                                type="button"
                                                onClick={() => handleSectorToggle(sectorKey)}
                                                className={`p-4 rounded-xl border-2 transition-all text-left ${isSelected
                                                    ? "border-green-400 bg-green-500/20"
                                                    : "border-white/20 bg-white/5 hover:bg-white/10"
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <span className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? "border-green-400 bg-green-400" : "border-white/40"
                                                        }`}>
                                                        {isSelected && <Check className="w-4 h-4 text-white" />}
                                                    </span>
                                                    <div>
                                                        <span className="font-semibold text-white block">{sectorKey}</span>
                                                        <span className="text-xs text-blue-200 block mt-1">
                                                            {sector.subcategories.length} subcategories
                                                        </span>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Selected Sectors Display with Subsectors */}
                                {companyData.selectedSectors.length > 0 && (
                                    <div className="mt-4 space-y-3">
                                        {companyData.selectedSectors.map(sector => (
                                            <div key={sector} className="bg-white/5 border border-white/10 rounded-xl p-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-semibold text-white">{sector}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveSector(sector)}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                {companyData.selectedSubsectors[sector]?.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {companyData.selectedSubsectors[sector].map(subsector => (
                                                            <span
                                                                key={subsector}
                                                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/20 border border-green-400/30 text-xs"
                                                            >
                                                                {subsector}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveSubsector(sector, subsector)}
                                                                    className="text-green-300 hover:text-white"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Subsector Selection Modal */}
                            {showSubsectorModal && activeSectorForModal && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                                    <div className="w-full max-w-2xl bg-[#051f46] border border-white/20 rounded-2xl p-6 max-h-[80vh] overflow-hidden">
                                        {/* Modal Header */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{activeSectorForModal}</h3>
                                                <p className="text-blue-200 text-sm">Select subcategories (multiple choice)</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setShowSubsectorModal(false)}
                                                className="p-2 hover:bg-white/10 rounded-lg transition"
                                            >
                                                <X className="w-5 h-5 text-white" />
                                            </button>
                                        </div>

                                        {/* Subsectors Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-2">
                                            {mainSectors[activeSectorForModal].subcategories.map(subsector => {
                                                const isSelected = companyData.selectedSubsectors[activeSectorForModal]?.includes(subsector);
                                                return (
                                                    <button
                                                        key={subsector}
                                                        type="button"
                                                        onClick={() => handleSubsectorToggle(activeSectorForModal, subsector)}
                                                        className={`p-3 rounded-xl border-2 transition-all text-left ${isSelected
                                                            ? "border-green-400 bg-green-500/20"
                                                            : "border-white/20 bg-white/5 hover:bg-white/10"
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? "border-green-400 bg-green-400" : "border-white/40"
                                                                }`}>
                                                                {isSelected && <Check className="w-3 h-3 text-white" />}
                                                            </span>
                                                            <span className={`text-sm ${isSelected ? "text-white font-medium" : "text-blue-100"}`}>
                                                                {subsector}
                                                            </span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Modal Footer */}
                                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    // Remove sector if no subsectors selected
                                                    if (!companyData.selectedSubsectors[activeSectorForModal]?.length) {
                                                        handleRemoveSector(activeSectorForModal);
                                                    }
                                                    setShowSubsectorModal(false);
                                                }}
                                                className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
                                            >
                                                Done
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 flex justify-between">
                                <button
                                    type="button"
                                    onClick={handlePrevStep}
                                    className="px-8 py-3 rounded-xl bg-white/10 border border-white/20 font-semibold hover:bg-white/20 transition"
                                >
                                    ← Previous
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 font-semibold hover:opacity-95 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Creating Profile...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-5 h-5" />
                                            Create Profile
                                        </>
                                    )}
                                </button>
                            </div>

                        </div>
                    )}

                </div>
            </div>
        </div >
    );
};

export default UserOnboardCompany;

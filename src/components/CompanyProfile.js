import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Mail, Building2, Users, Briefcase, CheckCircle, XCircle, Edit } from 'lucide-react';
import { API_BASE_URL } from '../config';

const CompanyProfile = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/companies/${companyId}`);
        const result = await response.json();
        
        if (result.success) {
          setCompany(result.data);
        } else {
          setError(result.message || 'Company not found');
        }
      } catch (err) {
        setError('Failed to fetch company details');
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId]);

  const getSectorColorInfo = (sector) => {
    // Define color mapping for main sectors
    const sectorColors = {
      "Construction": { bg: "bg-red-500/20", border: "border-red-400", text: "text-red-300" },
      "Industrial": { bg: "bg-orange-500/20", border: "border-orange-400", text: "text-orange-300" },
      "Commercial/Retail": { bg: "bg-yellow-500/20", border: "border-yellow-400", text: "text-yellow-300" },
      "Agriculture": { bg: "bg-green-500/20", border: "border-green-400", text: "text-green-300" },
      "Domestic": { bg: "bg-blue-500/20", border: "border-blue-400", text: "text-blue-300" },
      "Renewable Energy": { bg: "bg-indigo-500/20", border: "border-indigo-400", text: "text-indigo-300" },
      "Sustainability / ESG / Net Zero": { bg: "bg-purple-500/20", border: "border-purple-400", text: "text-purple-300" },
      "Energy Management": { bg: "bg-pink-500/20", border: "border-pink-400", text: "text-pink-300" },
      "IT & Related Services": { bg: "bg-teal-500/20", border: "border-teal-400", text: "text-teal-300" },
      "Jobs & Recruitment": { bg: "bg-cyan-500/20", border: "border-cyan-400", text: "text-cyan-300" },
      "Finance & Funding": { bg: "bg-amber-500/20", border: "border-amber-400", text: "text-amber-300" },
      "Eco Friendly / Passivhaus": { bg: "bg-lime-500/20", border: "border-lime-400", text: "text-lime-300" },
      "Utility Provision & Civils": { bg: "bg-emerald-500/20", border: "border-emerald-400", text: "text-emerald-300" },
      "Planning & Consultative Services": { bg: "bg-violet-500/20", border: "border-violet-400", text: "text-violet-300" }
    };

    // Find the main sector for this subsector (simplified - in real app would use the mapping)
    for (const [mainSector, colors] of Object.entries(sectorColors)) {
      if (sector.includes(mainSector.split(' ')[0]) || sector.includes('Agriculture') && mainSector === 'Agriculture') {
        return colors;
      }
    }
    
    return { bg: "bg-gray-500/20", border: "border-gray-400", text: "text-gray-300" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#051f46] flex items-center justify-center">
        <div className="text-white text-xl">Loading company profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#051f46] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error}</div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-[#051f46] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Company not found</div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#051f46] pt-20 pb-16">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[65%] w-40 h-40 bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 rounded-full blur-3xl opacity-10 animate-pulse" />
        <div className="absolute bottom-[15%] right-[5%] w-48 h-48 bg-gradient-to-br from-purple-200 via-pink-200 to-orange-200 rounded-full blur-3xl opacity-10 animate-pulse" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          
          <div className="bg-white/8 backdrop-blur-2xl border border-blue-400/25 rounded-3xl shadow-2xl p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {company.companyName}
                </h1>
                {company.companyBio && (
                  <p className="text-blue-200 max-w-3xl">
                    {company.companyBio}
                  </p>
                )}
                <div className="flex flex-wrap gap-3 text-blue-200">
                  {company.isRecruitmentCompany === 'Yes' && (
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>Recruitment Company</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Building2 size={16} />
                    <span>Company ID: {company.id}</span>
                  </div>
                </div>
              </div>
              
              {/* Profile Completion Status */}
              <div className="bg-white/10 backdrop-blur-lg border border-blue-300/40 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">Profile Completion</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {company.profileCompletion?.contactInfo ? (
                      <CheckCircle size={16} className="text-green-400" />
                    ) : (
                      <XCircle size={16} className="text-red-400" />
                    )}
                    <span className="text-blue-200 text-sm">Contact Information</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {company.profileCompletion?.companyDetails ? (
                      <CheckCircle size={16} className="text-green-400" />
                    ) : (
                      <XCircle size={16} className="text-red-400" />
                    )}
                    <span className="text-blue-200 text-sm">Company Details</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {company.profileCompletion?.sectors ? (
                      <CheckCircle size={16} className="text-green-400" />
                    ) : (
                      <XCircle size={16} className="text-red-400" />
                    )}
                    <span className="text-blue-200 text-sm">Industry Sectors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {company.profileCompletion?.regions ? (
                      <CheckCircle size={16} className="text-green-400" />
                    ) : (
                      <XCircle size={16} className="text-red-400" />
                    )}
                    <span className="text-blue-200 text-sm">Regions of Operation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {company.profileCompletion?.subscription ? (
                      <CheckCircle size={16} className="text-green-400" />
                    ) : (
                      <XCircle size={16} className="text-red-400" />
                    )}
                    <span className="text-blue-200 text-sm">Subscription Plan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white/8 backdrop-blur-2xl border border-blue-400/25 rounded-3xl shadow-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Users size={20} />
                Contact Information
              </h2>
              
              {company.contactPerson ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-blue-200 text-sm mb-1">Contact Person</p>
                    <p className="text-white">
                      {company.contactPerson.firstName && company.contactPerson.lastName 
                        ? `${company.contactPerson.firstName} ${company.contactPerson.lastName}`
                        : 'No details added'
                      }
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-blue-200 text-sm mb-1">Role</p>
                    <p className="text-white">
                      {company.contactPerson.role || 'No details added'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-blue-200 text-sm mb-1">Email</p>
                    <p className="text-white">
                      {company.contactPerson.email || 'No details added'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-blue-200 text-sm mb-1">Phone</p>
                    <p className="text-white">
                      {company.contactPerson.phoneNumber || 'No details added'}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-blue-200">No contact information added</p>
              )}
            </div>

            {/* Company Details */}
            <div className="bg-white/8 backdrop-blur-2xl border border-blue-400/25 rounded-3xl shadow-2xl p-6 mt-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Building2 size={20} />
                Company Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-blue-200 text-sm mb-1">Registration Number</p>
                  <p className="text-white">
                    {company.companyRegNumber || 'No details added'}
                  </p>
                </div>
                
                <div>
                  <p className="text-blue-200 text-sm mb-1">Address</p>
                  <p className="text-white">
                    {company.companyAddress || 'No details added'}
                  </p>
                </div>
                
                <div>
                  <p className="text-blue-200 text-sm mb-1">Post Code</p>
                  <p className="text-white">
                    {company.postCode || 'No details added'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Industry Sectors */}
            <div className="bg-white/8 backdrop-blur-2xl border border-blue-400/25 rounded-3xl shadow-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Briefcase size={20} />
                Industry Sectors
              </h2>
              
              {company.industrySector && company.industrySector.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {company.industrySector.map((sector, index) => {
                    const colors = getSectorColorInfo(sector);
                    return (
                      <div
                        key={index}
                        className={`${colors.bg} ${colors.border} border ${colors.text} px-3 py-1.5 rounded-full text-sm`}
                      >
                        {sector}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-blue-200">No industry sectors added</p>
              )}
            </div>

            {company.companyNews && company.companyNews.length > 0 && (
              <div className="bg-white/8 backdrop-blur-2xl border border-blue-400/25 rounded-3xl shadow-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Company News</h2>
                <ul className="space-y-2">
                  {company.companyNews.map((n, idx) => (
                    <li key={idx} className="text-blue-200">
                      {n.link ? (
                        <a href={n.link} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                          {n.title}
                        </a>
                      ) : (
                        <span>{n.title}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Products & Services */}
            <div className="bg-white/8 backdrop-blur-2xl border border-blue-400/25 rounded-3xl shadow-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Products & Services</h2>
              <p className="text-white">
                {company.productsServices || 'No details added'}
              </p>
            </div>

            {/* Regions of Operation */}
            <div className="bg-white/8 backdrop-blur-2xl border border-blue-400/25 rounded-3xl shadow-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin size={20} />
                Regions of Operation
              </h2>
              
              {company.regions && company.regions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {company.regions.map((region, index) => (
                    <div
                      key={index}
                      className="bg-blue-500/30 border border-blue-400/60 text-blue-100 px-3 py-1.5 rounded-full text-sm"
                    >
                      {region}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-blue-200">No regions added</p>
              )}
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;

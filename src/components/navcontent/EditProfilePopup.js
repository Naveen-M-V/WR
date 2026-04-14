import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { X, User, MapPin, Mail, Phone, Globe, Building, Lock, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const EditProfilePopup = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    companyName: user?.companyName || '',
    email: user?.email || '',
    location: user?.location || '',
    contactNo: user?.contactNo || '',
    website: user?.website || user?.companyWebsite || user?.websiteLink || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  useEffect(() => {
    if (!isOpen) return;
    setFormData(prev => ({
      ...prev,
      companyName: user?.companyName || '',
      email: user?.email || '',
      location: user?.location || '',
      contactNo: user?.contactNo || '',
      website: user?.website || user?.companyWebsite || user?.websiteLink || '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }));
  }, [isOpen, user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile Update Data:', formData);
    // Here you would typically send the data to your backend
    alert('Profile updated successfully!');
    onClose();
  };

  const handleBackdropClick = (e) => {
    // Only close if clicking the backdrop itself, not the popup content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;
  
  console.log('EditProfilePopup is rendering, isOpen:', isOpen);

  // Custom styles for animations
  const customStyles = `
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes scale-in {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    
    .animate-fade-in {
      animation: fade-in 0.3s ease-out forwards;
    }
    
    .animate-scale-in {
      animation: scale-in 0.3s ease-out forwards;
    }
    
    .animate-float {
      animation: float 3s ease-in-out infinite;
    }
    
    .delay-500 {
      animation-delay: 0.5s;
    }
    
    .delay-1000 {
      animation-delay: 1s;
    }
    
    .popup-overlay {
      z-index: 999999 !important;
      position: fixed !important;
    }
  `;

  return ReactDOM.createPortal(
    <>
      <style>{customStyles}</style>
      <div 
        className="popup-overlay fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center animate-fade-in p-4 overflow-y-auto"
        onClick={handleBackdropClick}
      >
        {/* Popup Container */}
        <div className="relative w-full max-w-md bg-white/20 backdrop-blur-xl border-2 border-white/40 rounded-2xl shadow-2xl animate-scale-in my-auto">
          {/* Simple glass background - no colored effects */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl"></div>

          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-4 right-4 z-[100] p-2 bg-white/10 backdrop-blur-lg rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:rotate-90 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="relative z-10 p-4 border-b border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/10 backdrop-blur-lg rounded-xl">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
            </div>
            <p className="text-white/70 text-sm">Update your account information</p>
          </div>

          {/* Form Content */}
          <div className="relative z-10 p-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Company Name Field */}
              <div className="group">
                <label className="flex items-center gap-2 text-white/70 font-medium mb-1.5 group-hover:text-white transition-colors">
                  <Building className="w-4 h-4" />
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 hover:border-white/30"
                  placeholder="Enter your company name"
                />
              </div>

              {/* Location Field */}
              <div className="group">
                <label className="flex items-center gap-2 text-white/70 font-medium mb-1.5 group-hover:text-white transition-colors">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 hover:border-white/30"
                  placeholder="Enter your location"
                />
              </div>

              {/* Email Field */}
              <div className="group">
                <label className="flex items-center gap-2 text-white/70 font-medium mb-1.5 group-hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 hover:border-white/30"
                  placeholder="Enter your email"
                />
              </div>

              {/* Contact Number Field */}
              <div className="group">
                <label className="flex items-center gap-2 text-white/70 font-medium mb-1.5 group-hover:text-white transition-colors">
                  <Phone className="w-4 h-4" />
                  Contact Number
                </label>
                <input
                  type="text"
                  value={formData.contactNo}
                  onChange={(e) => handleInputChange('contactNo', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 hover:border-white/30"
                  placeholder="Enter your contact number"
                />
              </div>

              {/* Website Field */}
              <div className="group">
                <label className="flex items-center gap-2 text-white/70 font-medium mb-1.5 group-hover:text-white transition-colors">
                  <Globe className="w-4 h-4" />
                  Website
                </label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 hover:border-white/30"
                  placeholder="Enter your website URL"
                />
              </div>

              {/* Password Fields */}
              <div className="space-y-2 group">
                <label className="flex items-center gap-2 text-white/70 font-medium mb-1.5 group-hover:text-white transition-colors">
                  <Lock className="w-4 h-4" />
                  Password Management
                </label>
                
                <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 hover:border-white/30"
                  placeholder="Current password"
                />
                
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 hover:border-white/30"
                  placeholder="New password"
                />
                
                <input
                  type="password"
                  value={formData.confirmNewPassword}
                  onChange={(e) => handleInputChange('confirmNewPassword', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 hover:border-white/30"
                  placeholder="Confirm new password"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-white/20 backdrop-blur-lg text-white font-semibold py-2.5 px-6 rounded-xl hover:bg-white/30 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 hover:scale-105 hover:shadow-xl border border-white/30"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default EditProfilePopup;

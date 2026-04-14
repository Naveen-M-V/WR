import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { updateCompany } from '../utils/companiesAPIExtended';

const EditCompanyModal = ({ company, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyRegNumber: '',
    companyAddress: '',
    postCode: '',
    industrySector: '',
    mainSector: '',
    productsServices: '',
    contactEmail: '',
    phoneNumber: '',
    website: '',
    description: '',
  });

  useEffect(() => {
    if (company) {
      setFormData({
        companyName: company.companyName || '',
        companyRegNumber: company.companyRegNumber || '',
        companyAddress: company.companyAddress || '',
        postCode: company.postCode || '',
        industrySector: company.industrySector || '',
        mainSector: company.mainSector || '',
        productsServices: company.productsServices || '',
        contactEmail: company.contactEmail || '',
        phoneNumber: company.phoneNumber || '',
        website: company.website || '',
        description: company.description || '',
      });
    }
  }, [company]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateCompany(company.id, formData);
    if (result.success) {
      onUpdate();
      onClose();
    } else {
      alert('Error updating company: ' + result.error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-xl border border-green-400/30 rounded-3xl shadow-2xl shadow-green-500/30 w-full max-w-4xl max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="flex justify-between items-center p-6 border-b border-green-400/30">
            <h2 className="text-2xl font-bold text-white">Edit Company</h2>
            <motion.button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/10 border border-green-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2">Registration Number</label>
                <input
                  type="text"
                  name="companyRegNumber"
                  value={formData.companyRegNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/10 border border-green-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Address</label>
                <input
                  type="text"
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/10 border border-green-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Post Code</label>
                <input
                  type="text"
                  name="postCode"
                  value={formData.postCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/10 border border-green-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Industry Sector</label>
                <input
                  type="text"
                  name="industrySector"
                  value={formData.industrySector}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/10 border border-green-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Main Sector</label>
                <input
                  type="text"
                  name="mainSector"
                  value={formData.mainSector}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/10 border border-green-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Products & Services</label>
                <textarea
                  name="productsServices"
                  value={formData.productsServices}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 bg-white/10 border border-green-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/10 border border-green-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/10 border border-green-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/10 border border-green-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-white mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 bg-white/10 border border-green-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <motion.button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              
              <motion.button
                type="submit"
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Update Company
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditCompanyModal;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../../config';

export default function FinanceContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    fundingAmount: '',
    projectDescription: '',
  });

  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/finance-contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          companyName: '',
          fundingAmount: '',
          projectDescription: '',
        });
      } else {
        setStatus('error');
        setErrorMessage(data.message || (data.errors && data.errors.join(', ')) || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
      setErrorMessage('Network error. Please try again later.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-16" id="contact-form">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
      >
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get in Touch for Funding</h2>
            <p className="text-blue-200 text-lg">Tell us about your project and financial needs.</p>
          </div>

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/20 border border-green-500/50 rounded-xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
              <p className="text-green-100">Your inquiry has been received. We will be in touch shortly.</p>
              <button 
                onClick={() => setStatus('idle')}
                className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-blue-200 mb-2">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-2">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-blue-200 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-blue-200 mb-2">Company Name *</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="Your Company Ltd."
                  />
                </div>
              </div>

              {/* Funding Amount */}
              <div>
                <label htmlFor="fundingAmount" className="block text-sm font-medium text-blue-200 mb-2">Funding Amount Required *</label>
                <select
                  id="fundingAmount"
                  name="fundingAmount"
                  required
                  value={formData.fundingAmount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all [&>option]:text-gray-900"
                >
                  <option value="" disabled>Select an amount</option>
                  <option value="Under $50k">Under $50k</option>
                  <option value="$50k - $100k">$50k - $100k</option>
                  <option value="$100k - $500k">$100k - $500k</option>
                  <option value="$500k - $1M">$500k - $1M</option>
                  <option value="$1M - $5M">$1M - $5M</option>
                  <option value="Over $5M">Over $5M</option>
                </select>
              </div>

              {/* Project Description */}
              <div>
                <label htmlFor="projectDescription" className="block text-sm font-medium text-blue-200 mb-2">Project Description *</label>
                <textarea
                  id="projectDescription"
                  name="projectDescription"
                  required
                  rows={4}
                  value={formData.projectDescription}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none"
                  placeholder="Tell us about your project and what you need funding for..."
                />
              </div>

              {/* Error Message */}
              {status === 'error' && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200 text-sm">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-full hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
                >
                  {status === 'submitting' ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Sending...
                    </span>
                  ) : 'Submit Inquiry'}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

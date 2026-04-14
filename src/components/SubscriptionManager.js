import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Calendar, Star, DollarSign, AlertCircle, X, CheckCircle, Zap, Crown, Package } from 'lucide-react';
import { API_BASE_URL } from '../config';

const addonServicesList = [
  { id: "company-spotlight", name: "Company 'Under The Spotlight'" },
  { id: "product-spotlight", name: "Product or Service 'Under The Spotlight'" },
  { id: "hall-of-fame", name: "'Hall Of Fame - Industry Heroes'" },
  { id: "industry-awards", name: "Showcase your company's Award on our 'Industry Awards' page" },
  { id: "case-study-showcase", name: "Showcase your recent successful 'Case Study'" },
  { id: "completed-project-showcase", name: "Showcase your 'Recently Completed Project'" },
  { id: "innovations-showcase", name: "Showcase the latest 'Innovations'" },
  { id: "additional-recruitment", name: "Additional 6 x recruitment vacancies" }
];

const SubscriptionManager = ({ onClose }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompanySubscription();
  }, []);

  const fetchCompanySubscription = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/companies/my-company`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success && data.data) {
        setSubscription(data.data.subscription || null);
      } else {
        setError(data.message || 'Failed to fetch subscription details');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPlanIcon = (planName) => {
    const p = String(planName || '').toLowerCase();
    if (p.includes('premium')) return <Zap className="w-5 h-5 text-purple-400" />;
    if (p.includes('elite')) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (p.includes('standard') || p.includes('professional')) return <Star className="w-5 h-5 text-blue-400" />;
    return <Star className="w-5 h-5 text-white/70" />;
  };

  const getPlanName = (plan) => {
    if (!plan) return 'Unknown Plan';
    if (typeof plan === 'string') return plan.charAt(0).toUpperCase() + plan.slice(1) + ' Plan';
    if (plan.name) return plan.name;
    return 'Active Plan';
  };

  const getAddonName = (addonId) => {
    const addon = addonServicesList.find(a => a.id === addonId);
    return addon ? addon.name : addonId;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
        </div>
      </div>
    );
  }

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-[#051f46] via-[#0a2e5e] to-[#051f46] backdrop-blur-xl rounded-3xl border border-blue-400/30 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-400/20 sticky top-0 bg-[#051f46]/95 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Manage Subscription</h3>
              <p className="text-sm text-blue-200">View your active plan and addons</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 flex items-center gap-2 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {subscription && subscription.plan ? (
            <div className="space-y-6">
              {/* Current Subscription */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-blue-400/20 shadow-lg relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl z-0" />

                <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    {getPlanIcon(subscription.plan)}
                  </div>
                  Subscription Plan Data
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                  <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                    <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">Active Plan</p>
                    <p className="text-white font-bold text-lg">{getPlanName(subscription.plan)}</p>
                  </div>
                  <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                    <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">Billing Cycle</p>
                    <p className="text-white font-bold text-lg capitalize">{subscription.billingCycle || 'Monthly'}</p>
                  </div>
                  <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                    <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${subscription.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                      <p className="text-white font-bold text-lg capitalize">{subscription.status || 'Active'}</p>
                    </div>
                  </div>
                  {(subscription.startDate || subscription.endDate) && (
                    <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                      <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">End Date</p>
                      <p className="text-white font-bold text-lg">
                        {subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Purchased Addons */}
              {subscription.addons && subscription.addons.length > 0 && (
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-purple-400/20 shadow-lg relative overflow-hidden">
                  <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl z-0" />

                  <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
                    <div className="p-2 bg-purple-500/20 rounded-lg backdrop-blur-sm">
                      <Package className="w-5 h-5 text-purple-400" />
                    </div>
                    Purchased Addons
                  </h4>

                  <div className="space-y-3 relative z-10">
                    {subscription.addons.map((addon, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-black/20 border border-white/5 rounded-xl hover:bg-black/30 transition-colors">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg">
                          <Star className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-medium">{getAddonName(addon)}</span>
                        <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CreditCard className="w-10 h-10 text-blue-300" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-3">No Active Subscription</h4>
              <p className="text-blue-200 mb-8 max-w-sm mx-auto">You do not currently have a recorded subscription plan. Upgrade to unlock premium platform features.</p>
              <motion.button
                onClick={() => { onClose(); window.location.href = '/profile-completion'; }}
                className="py-3 px-8 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Upgrade Plan
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default SubscriptionManager;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { X, CreditCard, Lock, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { stripePromise } from '../utils/stripe';
 import { API_BASE_URL } from '../config';

const PaymentForm = ({ selectedPlan, onClose, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [complete, setComplete] = useState(false);

  // Calculate total amount including addons
  const planPrice = selectedPlan?.price || 0;
  const addonTotal = selectedPlan?.addonTotal || 0;
  const totalAmount = selectedPlan?.totalPrice || planPrice + addonTotal;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      setProcessing(false);
      setError('Invalid or expired token');
      onError(new Error('Invalid or expired token'));
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          email: 'user@example.com', // This should come from user context
        },
      });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      // Create subscription
      const response = await fetch(`${API_BASE_URL}/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          priceId: selectedPlan.priceId,
          planId: selectedPlan.id,
          selectedAddons: selectedPlan.selectedAddons || [],
          addonTotal: selectedPlan.addonTotal || 0,
          totalAmount: totalAmount,
        }),
      });

      if (response.status === 401) {
        throw new Error('Invalid or expired token');
      }

      const subscription = await response.json();

      if (subscription.error) {
        throw new Error(subscription.error);
      }

      if (subscription.requiresAction) {
        // Handle 3D Secure authentication
        const { error: confirmError } = await stripe.confirmCardPayment(
          subscription.clientSecret
        );

        if (confirmError) {
          throw new Error(confirmError.message);
        }
      }

      setComplete(true);
      setTimeout(() => {
        onSuccess(subscription);
        onClose();
      }, 2000);

    } catch (err) {
      setError(err.message);
      onError(err);
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#ffffff',
        '::placeholder': {
          color: '#94a3b8',
        },
        iconColor: '#10b981',
      },
      invalid: {
        color: '#ef4444',
      },
    },
    hidePostalCode: false,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Complete Payment</h3>
              <p className="text-sm text-white/70">{selectedPlan.name} Plan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Plan Summary */}
          <div className="bg-white/10 rounded-xl p-4 mb-6 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80">Plan</span>
              <span className="text-white font-medium">{selectedPlan.name}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80">Plan Price</span>
              <span className="text-white font-medium">£{planPrice}</span>
            </div>

            {/* Addons Section */}
            {addonTotal > 0 && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80">Add-ons ({selectedPlan.selectedAddons?.length || 0})</span>
                  <span className="text-white font-medium">£{addonTotal}</span>
                </div>
                <div className="border-t border-white/20 my-2"></div>
              </>
            )}

            <div className="flex items-center justify-between mt-3">
              <span className="text-white font-semibold">Total Amount</span>
              <span className="text-2xl font-bold text-emerald-400">£{totalAmount}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-white/80">Billing</span>
              <span className="text-white/70 text-sm">Per {selectedPlan.interval || 'month'}</span>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card Element */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Card Information
              </label>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 focus-within:border-emerald-400/50 transition-colors">
                <CardElement options={cardElementOptions} />
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Lock className="w-4 h-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Message */}
            <AnimatePresence>
              {complete && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-300 text-sm"
                >
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Payment successful! Redirecting...</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={processing || complete || !stripe}
              className="w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: !processing && !complete ? 1.02 : 1 }}
              whileTap={{ scale: !processing && !complete ? 0.98 : 1 }}
            >
              {processing ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : complete ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Complete
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Pay £{totalAmount}
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

const StripePaymentForm = ({ selectedPlan, onClose, onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        selectedPlan={selectedPlan}
        onClose={onClose}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};

export default StripePaymentForm;

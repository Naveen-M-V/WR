import React, { createContext, useContext, useState, useEffect } from 'react';
import { stripePromise } from '../utils/stripe';

const StripeContext = createContext();

export const useStripe = () => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
};

export const StripeProvider = ({ children }) => {
  const [stripe, setStripe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initStripe = async () => {
      try {
        const stripeInstance = await stripePromise;
        setStripe(stripeInstance);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    initStripe();
  }, []);

  const value = {
    stripe,
    loading,
    error
  };

  return (
    <StripeContext.Provider value={value}>
      {children}
    </StripeContext.Provider>
  );
};

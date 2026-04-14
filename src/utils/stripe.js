import { loadStripe } from '@stripe/stripe-js';

// Frontend-only Stripe.js promise initialization
// The Stripe public key should be available from environment variables
const STRIPE_PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

export const stripePromise = STRIPE_PUBLIC_KEY 
  ? loadStripe(STRIPE_PUBLIC_KEY)
  : Promise.reject(new Error('Stripe public key not configured'));

// Default export for backwards compatibility
export default stripePromise;

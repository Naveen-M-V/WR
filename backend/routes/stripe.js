import express from 'express';
import Stripe from 'stripe';
import { authenticateToken } from '../middleware/auth.js';
import { findUserById, updateUser, findCompanyByUserId, updateCompany } from '../database/db.js';
import { sendSubscriptionPurchaseConfirmationEmail } from '../utils/emailService.js';

const router = express.Router();
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;

const requireStripeConfigured = (req, res, next) => {
  if (stripe) return next();
  return res.status(500).json({
    error: 'Stripe is not configured on this server',
    message: 'Missing STRIPE_SECRET_KEY environment variable',
  });
};

// Create subscription
router.post('/create-subscription', authenticateToken, requireStripeConfigured, async (req, res) => {
  try {
    const { paymentMethodId, priceId, planId, selectedAddons, addonTotal, totalAmount } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    // Get user from database
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create customer if doesn't exist
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.username,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
      customerId = customer.id;

      await updateUser(userId, { stripeCustomerId: customerId });
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

// Create subscription
const subscription = await stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: priceId }],
  expand: ['latest_invoice.payment_intent'],
  payment_behavior: 'default_incomplete',
  payment_settings: { 
    save_default_payment_method: 'on_subscription',
    payment_method_types: ['card'],
  },
  default_payment_method: paymentMethodId,
});

const paymentIntent = subscription.latest_invoice?.payment_intent;

res.json({
  subscriptionId: subscription.id,
  clientSecret: paymentIntent?.client_secret || null,
  requiresAction: paymentIntent?.status === 'requires_action',
});

  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/create-profile-checkout', authenticateToken, requireStripeConfigured, async (req, res) => {
  try {
    const { priceId, planId, planName, selectedAddons, addonTotal, totalAmount, successUrl, cancelUrl } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Invalid token payload' });
    }

    if (!priceId) {
      return res.status(400).json({ success: false, error: 'Missing required field: priceId' });
    }

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.username || user.companyName,
        metadata: {
          userId: userId,
        },
      });
      customerId = customer.id;
      await updateUser(userId, { stripeCustomerId: customerId });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.APP_URL || 'http://localhost:3000'}/profile-completion?payment=success`,
      cancel_url: cancelUrl || `${process.env.APP_URL || 'http://localhost:3000'}/profile-completion?payment=cancelled`,
      metadata: {
        userId: userId,
        planId: planId || '',
        planName: planName || '',
        selectedAddons: JSON.stringify(selectedAddons || []),
        addonTotal: `${addonTotal || 0}`,
        totalAmount: `${totalAmount || 0}`,
      },
      subscription_data: {
        metadata: {
          userId: userId,
          planId: planId || '',
          planName: planName || '',
        },
      },
    });

    res.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Error creating profile checkout session:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cancel subscription
router.post('/cancel-subscription', authenticateToken, requireStripeConfigured, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const user = userId ? await findUserById(userId) : null;

    if (!user || !user.subscription?.id) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    const subscription = await stripe.subscriptions.update(user.subscription.id, {
      cancel_at_period_end: true,
    });

    await updateUser(userId, {
      subscription: {
        ...user.subscription,
        cancel_at_period_end: true,
      },
    });

    res.json({
      message: 'Subscription will be canceled at the end of the billing period',
      canceledAt: subscription.canceled_at,
      currentPeriodEnd: subscription.current_period_end,
    });

  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

// Resume subscription
router.post('/resume-subscription', authenticateToken, requireStripeConfigured, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const user = userId ? await findUserById(userId) : null;

    if (!user || !user.subscription?.id) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    const subscription = await stripe.subscriptions.update(user.subscription.id, {
      cancel_at_period_end: false,
    });

    await updateUser(userId, {
      subscription: {
        ...user.subscription,
        cancel_at_period_end: false,
      },
    });

    res.json({
      message: 'Subscription resumed successfully',
      currentPeriodEnd: subscription.current_period_end,
    });

  } catch (error) {
    console.error('Error resuming subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update subscription
router.post('/update-subscription', authenticateToken, requireStripeConfigured, async (req, res) => {
  try {
    const { newPriceId } = req.body;
    const userId = req.user?.userId;
    const user = userId ? await findUserById(userId) : null;

    if (!user || !user.subscription?.id) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    const subscription = await stripe.subscriptions.retrieve(user.subscription.id);
    const subscriptionItemId = subscription.items.data[0].id;

    const updatedSubscription = await stripe.subscriptions.update(user.subscription.id, {
      items: [{
        id: subscriptionItemId,
        price: newPriceId,
      }],
      proration_behavior: 'create_prorations',
    });

    await updateUser(userId, {
      subscription: {
        ...user.subscription,
        current_period_end: updatedSubscription.current_period_end,
      },
    });

    res.json({
      message: 'Subscription updated successfully',
      newPriceId: newPriceId,
      currentPeriodEnd: updatedSubscription.current_period_end,
    });

  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get subscription status
router.get('/subscription-status', authenticateToken, requireStripeConfigured, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const user = userId ? await findUserById(userId) : null;

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.subscription?.id) {
      return res.json({ hasSubscription: false });
    }

    const subscription = await stripe.subscriptions.retrieve(user.subscription.id);

    res.json({
      hasSubscription: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        planId: user.subscription.planId,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        trial_end: subscription.trial_end,
      },
    });

  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get payment methods
router.get('/payment-methods', authenticateToken, requireStripeConfigured, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const user = userId ? await findUserById(userId) : null;

    if (!user || !user.stripeCustomerId) {
      return res.json({ paymentMethods: [] });
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: 'card',
    });

    res.json({ paymentMethods: paymentMethods.data });

  } catch (error) {
    console.error('Error getting payment methods:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get invoice history
router.get('/invoices', authenticateToken, requireStripeConfigured, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const user = userId ? await findUserById(userId) : null;

    if (!user || !user.stripeCustomerId) {
      return res.json({ invoices: [] });
    }

    const invoices = await stripe.invoices.list({
      customer: user.stripeCustomerId,
      limit: 10,
    });

    res.json({ invoices: invoices.data });

  } catch (error) {
    console.error('Error getting invoices:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create addon checkout session
router.post('/create-addon-checkout', authenticateToken, requireStripeConfigured, async (req, res) => {
  try {
    const { addonId, addonName, price, addons, totalPrice, successUrl, cancelUrl } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Invalid token payload' });
    }

    // Get user from database
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Handle both single addon (legacy) and multiple addons (new)
    let lineItems = [];
    let metadataAddons = [];

    if (addons && Array.isArray(addons) && addons.length > 0) {
      // Multiple addons case
      lineItems = addons.map(addon => ({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: addon.addonName,
            description: `Add-on: ${addon.addonName}`,
            metadata: {
              addonId: addon.addonId,
            },
          },
          unit_amount: Math.round(addon.price * 100),
        },
        quantity: 1,
      }));
      metadataAddons = addons.map(a => a.addonId).join(',');
    } else if (addonId && price && addonName) {
      // Single addon case (backward compatibility)
      lineItems = [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: addonName,
              description: `Add-on: ${addonName}`,
              metadata: {
                addonId: addonId,
              },
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ];
      metadataAddons = addonId;
    } else {
      return res.status(400).json({ success: false, error: 'Missing required fields: addonId/addons' });
    }

    // Create or get Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.username || user.companyName,
        metadata: {
          userId: userId,
        },
      });
      customerId = customer.id;
      await updateUser(userId, { stripeCustomerId: customerId });
    }

    // Create checkout session for addon purchase (one-time payment)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer: customerId,
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: successUrl || `${process.env.APP_URL || 'http://localhost:3000'}/manage-subscriptions?payment=success`,
      cancel_url: cancelUrl || `${process.env.APP_URL || 'http://localhost:3000'}/manage-subscriptions?payment=cancelled`,
      metadata: {
        userId: userId,
        addonIds: metadataAddons,
        totalAmount: (totalPrice || price || 0).toString(),
      },
    });

    res.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    });

  } catch (error) {
    console.error('Error creating addon checkout session:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Confirm addon purchase - called by frontend after successful payment
router.post('/confirm-addon-purchase', authenticateToken, async (req, res) => {
  try {
    const { addonId, addonName, price, totalAmount, addonIds, addonDetails } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Invalid token payload' });
    }

    if (!addonId && !addonIds) {
      return res.status(400).json({ success: false, error: 'Missing addonId or addonIds' });
    }

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Get user's company
    const company = await findCompanyByUserId(userId);
    if (!company) {
      return res.status(404).json({ success: false, error: 'Company not found' });
    }

    // Initialize subscription if doesn't exist
    if (!company.subscription) {
      company.subscription = {};
    }
    if (!company.subscription.addons) {
      company.subscription.addons = [];
    }
    if (!company.subscription.addonDetails) {
      company.subscription.addonDetails = [];
    }

    let processedAddons = [];
    let addonNames = [];

    // Handle multiple addons (new flow)
    if (addonIds) {
      const addonsArray = Array.isArray(addonIds) ? addonIds : addonIds.split(',').map(id => id.trim());
      
      addonsArray.forEach(id => {
        if (!company.subscription.addons.includes(id)) {
          company.subscription.addons.push(id);
          
          // Calculate expiry date (30 days from now for monthly addons)
          const now = new Date();
          const expiryDate = new Date(now);
          expiryDate.setDate(expiryDate.getDate() + 30);
          
          // Add addon details with expiry
          company.subscription.addonDetails.push({
            id: id,
            purchasedAt: now.toISOString(),
            expiryDate: expiryDate.toISOString(),
            status: 'active'
          });
          
          processedAddons.push(id);
          console.log(`✅ Addon ${id} confirmed for company ${company.id}, expires: ${expiryDate.toISOString()}`);
        }
      });

      // Get addon names for email
      if (addonDetails && Array.isArray(addonDetails)) {
        addonNames = addonDetails.map(a => a.addonName);
      } else if (typeof addonIds === 'string') {
        addonNames = addonIds.split(',').map(id => `Addon ${id.trim()}`);
      }
    } else {
      // Single addon (backward compatibility)
      if (!company.subscription.addons.includes(addonId)) {
        company.subscription.addons.push(addonId);
        
        // Calculate expiry date (30 days from now for monthly addons)
        const now = new Date();
        const expiryDate = new Date(now);
        expiryDate.setDate(expiryDate.getDate() + 30);
        
        // Add addon details with expiry
        company.subscription.addonDetails.push({
          id: addonId,
          purchasedAt: now.toISOString(),
          expiryDate: expiryDate.toISOString(),
          status: 'active'
        });
        
        processedAddons.push(addonId);
        addonNames = [addonName || addonId];
        console.log(`✅ Addon ${addonId} confirmed for company ${company._id}`);
      }
    }

    await updateCompany(company._id, {
      subscription: company.subscription
    });

    const emailResult = await sendSubscriptionPurchaseConfirmationEmail({
      email: user.email,
      username: user.username || user.email?.split('@')?.[0] || 'there',
      planName: 'Add-on Purchase',
      billingCycle: 'one-time',
      addonNames: addonNames.length > 0 ? addonNames : ['Add-on'],
      totalAmount: totalAmount ?? price ?? 0,
    });

    if (!emailResult.success) {
      console.error(`Failed to send add-on invoice email to ${user.email}:`, emailResult.error);
    } else {
      console.log(`Add-on invoice email delivered to ${user.email}`);
    }

    res.json({
      success: true,
      message: `${processedAddons.length} addon(s) purchased confirmed`,
      addons: company.subscription.addons
    });

  } catch (error) {
    console.error('Error confirming addon purchase:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  if (!stripe) {
    return res.status(500).send('Stripe is not configured on this server');
  }

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'invoice.payment_succeeded':
      const invoicePaymentSucceeded = event.data.object;
      console.log('Invoice payment succeeded:', invoicePaymentSucceeded.id);
      break;

    case 'invoice.payment_failed':
      const invoicePaymentFailed = event.data.object;
      console.log('Invoice payment failed:', invoicePaymentFailed.id);
      break;

    case 'customer.subscription.created':
      const subscriptionCreated = event.data.object;
      console.log('Subscription created:', subscriptionCreated.id);
      break;

    case 'customer.subscription.updated':
      const subscriptionUpdated = event.data.object;
      console.log('Subscription updated:', subscriptionUpdated.id);
      break;

    case 'customer.subscription.deleted':
      const subscriptionDeleted = event.data.object;
      console.log('Subscription deleted:', subscriptionDeleted.id);
      break;

    case 'checkout.session.completed':
      const checkoutSession = event.data.object;
      console.log('Checkout session completed:', checkoutSession.id);
      
      // Handle both addon and main plan purchases
      if (checkoutSession.metadata && checkoutSession.metadata.userId) {
        try {
          const userId = checkoutSession.metadata.userId;
          const company = await findCompanyByUserId(userId);
          
          if (company && checkoutSession.payment_status === 'paid') {
            // Initialize subscription object if doesn't exist
            if (!company.subscription) {
              company.subscription = {};
            }
            
            // ==================== HANDLE ADDON PURCHASE ====================
            if (checkoutSession.metadata.addonId) {
              const addonId = checkoutSession.metadata.addonId;
              
              if (!company.subscription.addons) {
                company.subscription.addons = [];
              }
              if (!company.subscription.addonDetails) {
                company.subscription.addonDetails = [];
              }
              
              // Add addon if not already added
              if (!company.subscription.addons.includes(addonId)) {
                company.subscription.addons.push(addonId);
                
                // Calculate expiry date (30 days from now for addons)
                const now = new Date();
                const expiryDate = new Date(now);
                expiryDate.setDate(expiryDate.getDate() + 30);
                
                company.subscription.addonDetails.push({
                  id: addonId,
                  purchasedAt: now.toISOString(),
                  expiryDate: expiryDate.toISOString(),
                  status: 'active'
                });
                
                console.log(`Addon ${addonId} added to company ${company._id} (user: ${userId}), expires: ${expiryDate.toISOString()}`);
              }
            }
            
            // ==================== HANDLE MAIN PLAN PURCHASE ====================
            else if (checkoutSession.metadata.planId || checkoutSession.metadata.planName) {
              const planName = checkoutSession.metadata.planName || 'premium';
              const planId = checkoutSession.metadata.planId || planName;
              
              // Determine billing cycle and days based on plan name
              let billingCycle = 'monthly';
              let expiryDays = 30;
              
              const planLower = String(planName).toLowerCase();
              if (planLower.includes('annual') || planLower.includes('yearly') || planLower.includes('year')) {
                billingCycle = 'annual';
                expiryDays = 365;
              } else if (planLower.includes('monthly') || planLower.includes('month')) {
                billingCycle = 'monthly';
                expiryDays = 30;
              }
              
              // Calculate subscription dates
              const now = new Date();
              const startDate = new Date(now);
              const endDate = new Date(now);
              endDate.setDate(endDate.getDate() + expiryDays);
              
              // Update company subscription
              company.subscription = {
                ...company.subscription,
                plan: planId,
                planName: planName,
                status: 'active',
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                billingCycle: billingCycle,
                months: billingCycle === 'annual' ? 12 : 1
              };
              
              console.log(`✅ Main plan subscription updated for company ${company._id} (user: ${userId})`);
              console.log(`   Plan: ${planName}, Billing: ${billingCycle}`);
              console.log(`   Start: ${startDate.toISOString()}, End: ${endDate.toISOString()}`);
            }
            
            // Save updated subscription to database
            await updateCompany(company._id, {
              subscription: company.subscription
            });
          }
        } catch (err) {
          console.error('Error processing checkout session:', err);
        }
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
});

export default router;

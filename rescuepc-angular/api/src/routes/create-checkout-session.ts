import { Router } from 'express';
import Stripe from 'stripe';

export const createCheckoutSessionRouter = Router();

// SECURE STRIPE INITIALIZATION - Moved to runtime
let stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      'CRITICAL: STRIPE_SECRET_KEY environment variable is required',
    );
  }

  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  return stripe;
}

// PAYMENT PACKAGE CONFIGURATION - MATCHES FRONTEND
const PAYMENT_PACKAGES = {
  basic: {
    name: 'Basic License',
    price: 29.99,
    description: 'Single user license for personal use',
    features: ['Basic diagnostics', 'Driver updates', 'System optimization'],
  },
  professional: {
    name: 'Professional License',
    price: 79.99,
    description: 'Professional tools for IT technicians',
    features: ['Advanced diagnostics', 'Batch processing', 'Priority support'],
  },
  enterprise: {
    name: 'Enterprise License',
    price: 199.99,
    description: 'Enterprise-grade solution for businesses',
    features: ['Unlimited users', 'Custom branding', 'Dedicated support'],
  },
  government: {
    name: 'Government License',
    price: 99.99,
    description: 'Special pricing for government agencies',
    features: ['Compliance features', 'Audit trails', 'Government support'],
  },
  lifetime: {
    name: 'Lifetime License',
    price: 299.99,
    description: 'One-time purchase, lifetime updates',
    features: ['Lifetime updates', 'All features', 'Premium support'],
  },
};

createCheckoutSessionRouter.post('/', async (req, res) => {
  try {
    // Initialize Stripe at runtime
    const stripe = getStripe();

    const {
      packageType,
      packageName,
      licenseCount = 1,
      successUrl,
      cancelUrl,
    } = req.body;

    if (!packageType || !packageName) {
      return res
        .status(400)
        .json({ error: 'Package type and name are required' });
    }

    const packageConfig =
      PAYMENT_PACKAGES[packageType as keyof typeof PAYMENT_PACKAGES];
    if (!packageConfig) {
      return res.status(400).json({ error: 'Invalid package type' });
    }

    // Calculate total amount (in cents)
    const totalAmount = Math.round(packageConfig.price * licenseCount * 100);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: packageConfig.name,
              description: packageConfig.description,
              metadata: {
                packageType,
                licenseCount: licenseCount.toString(),
                features: packageConfig.features.join(', '),
              },
            },
            unit_amount: Math.round(packageConfig.price * 100),
          },
          quantity: licenseCount,
        },
      ],
      mode: 'payment',
      success_url:
        successUrl ||
        `${req.protocol}://${req.get('host')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.protocol}://${req.get('host')}/`,
      metadata: {
        packageType,
        packageName,
        licenseCount: licenseCount.toString(),
        customerEmail: req.body.customerEmail || '',
        adminEmail: req.body.adminEmail || '',
        companyName: req.body.companyName || '',
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout session creation error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

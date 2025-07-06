import { Router } from 'express';
import Stripe from 'stripe';

export const enterpriseWebhookRouter = Router();

// SECURE STRIPE INITIALIZATION - Moved to runtime
let stripe: Stripe | null = null;
let webhookSecret: string | null = null;

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

function getWebhookSecret(): string {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error(
      'CRITICAL: STRIPE_WEBHOOK_SECRET environment variable is required',
    );
  }

  if (!webhookSecret) {
    webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  }

  return webhookSecret;
}

interface EnterprisePackage {
  id: string;
  name: string;
  userCount: number;
  price: number;
  duration: 'annual' | 'lifetime';
}

const ENTERPRISE_PACKAGES: Record<string, EnterprisePackage> = {
  'enterprise-25': {
    id: 'enterprise-25',
    name: 'Enterprise 25',
    userCount: 25,
    price: 499.99,
    duration: 'annual',
  },
  'enterprise-50': {
    id: 'enterprise-50',
    name: 'Enterprise 50',
    userCount: 50,
    price: 899.99,
    duration: 'annual',
  },
  'enterprise-100': {
    id: 'enterprise-100',
    name: 'Enterprise 100',
    userCount: 100,
    price: 1499.99,
    duration: 'annual',
  },
  government: {
    id: 'government',
    name: 'Government',
    userCount: 100,
    price: 999.99,
    duration: 'annual',
  },
  unlimited: {
    id: 'unlimited',
    name: 'Unlimited',
    userCount: -1, // Unlimited
    price: 499.99,
    duration: 'lifetime',
  },
};

enterpriseWebhookRouter.post('/', async (req, res) => {
  try {
    // Initialize Stripe and webhook secret at runtime
    const stripe = getStripe();
    const webhookSecret = getWebhookSecret();

    const signature = req.headers['stripe-signature'] as string;
    const payload = JSON.stringify(req.body);

    if (!signature) {
      return res.status(400).json({ error: 'Missing stripe signature' });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`Enterprise checkout completed: ${session.id}`);
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Enterprise payment succeeded: ${paymentIntent.id}`);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log(`Enterprise payment failed: ${failedPayment.id}`);
        break;

      default:
        console.log(`Unhandled enterprise event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Enterprise webhook error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

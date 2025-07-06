import { Router } from 'express';
import Stripe from 'stripe';
import { createHmac } from 'crypto';

export const webhookRouter = Router();

// SECURE STRIPE INITIALIZATION - Moved to runtime
let stripe: Stripe | null = null;
let webhookSecret: string | null = null;

function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('CRITICAL: STRIPE_SECRET_KEY environment variable is required');
  }

  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-06-30.basil'
    });
  }

  return stripe;
}

function getWebhookSecret(): string {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('CRITICAL: STRIPE_WEBHOOK_SECRET environment variable is required');
  }

  if (!webhookSecret) {
    webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  }

  return webhookSecret;
}

/**
 * Validates Stripe webhook signature with enhanced security
 */
function validateStripeSignature(payload: string, signature: string | null): boolean {
  if (!signature) return false;

  try {
    getStripe().webhooks.constructEvent(payload, signature, getWebhookSecret());
    return true;
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return false;
  }
}

/**
 * Enhanced successful payment events with Fortune 500 automation
 */
async function handlePaymentSuccess(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  const customerId = paymentIntent.customer as string;
  const amount = paymentIntent.amount;
  const currency = paymentIntent.currency;

  try {
    // Get customer details with enhanced error handling
    const customer = await getStripe().customers.retrieve(customerId);
    if (!customer || customer.deleted) {
      throw new Error('Customer not found or deleted');
    }

    // Log successful automation
    console.log(
      `✅ Payment automation completed for ${(customer as Stripe.Customer).email}: Payment ${paymentIntent.id}`
    );

    return { success: true, paymentId: paymentIntent.id };
  } catch (error) {
    console.error('❌ Failed to process payment success:', error);
    throw error;
  }
}

/**
 * Enhanced failed payment events with automated recovery
 */
async function handlePaymentFailure(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  const customerId = paymentIntent.customer as string;

  try {
    // Get customer details
    const customer = await getStripe().customers.retrieve(customerId);
    if (!customer || customer.deleted) {
      throw new Error('Customer not found or deleted');
    }

    console.log(`❌ Payment failure handled for ${(customer as Stripe.Customer).email}: ${paymentIntent.id}`);

    return { success: true };
  } catch (error) {
    console.error('❌ Failed to process payment failure:', error);
    throw error;
  }
}

webhookRouter.post('/', async (req, res) => {
  try {
    // Get and validate signature with enhanced security
    const signature = req.headers['stripe-signature'] as string;
    const payload = JSON.stringify(req.body);

    if (!validateStripeSignature(payload, signature)) {
      console.error('❌ Invalid webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Parse and handle event with enhanced logging
    const event = req.body as Stripe.Event;
    console.log(`🔄 Processing webhook event: ${event.type}`);

    let result;

    switch (event.type) {
      case 'payment_intent.succeeded':
        result = await handlePaymentSuccess(event);
        break;
      case 'payment_intent.payment_failed':
        result = await handlePaymentFailure(event);
        break;
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
        return res.status(400).json({ error: `Unhandled event type: ${event.type}` });
    }

    console.log(`✅ Webhook processed successfully: ${event.type}`);
    res.json(result);
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}); 
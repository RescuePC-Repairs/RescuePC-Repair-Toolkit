export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { createHmac } from 'crypto';
import { prisma } from '../../../utils/prisma';
import { validateOrigin } from '@/utils/originValidation';

if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('Stripe environment variables are required');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil'
});

const webhookSecret = process.env['STRIPE_WEBHOOK_SECRET']!;

// FREE SYSTEM - NO COMPLEX RATE LIMITING NEEDED

/**
 * Validates Stripe webhook signature
 */
function validateStripeSignature(payload: string, signature: string | null): boolean {
  if (!signature) return false;

  try {
    stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    return true;
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return false;
  }
}

/**
 * Handles successful payment events
 */
async function handlePaymentSuccess(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  const customerId = paymentIntent.customer as string;
  const amount = paymentIntent.amount;
  const currency = paymentIntent.currency;

  try {
    // Store payment record
    const payment = await prisma.payment.create({
      data: {
        stripePaymentId: paymentIntent.id,
        stripeCustomerId: customerId,
        amount,
        currency,
        status: 'completed',
        metadata: paymentIntent.metadata
      }
    });

    // Get customer details
    const customer = await stripe.customers.retrieve(customerId);
    if (!customer || customer.deleted) {
      throw new Error('Customer not found');
    }

    // Create or update license
    const license = await prisma.license.create({
      data: {
        customerId,
        type: paymentIntent.metadata.licenseType || 'standard',
        status: 'active',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        paymentId: payment.id
      }
    });

    // Send confirmation email
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SUPPORT_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: `"RescuePC Repairs" <${process.env.SUPPORT_EMAIL}>`,
      to: customer.email!,
      subject: '🎉 Payment Successful - RescuePC Repairs',
      text: `Thank you for your purchase! Your payment has been processed successfully.`
    });

    return { success: true, paymentId: payment.id, licenseId: license.id };
  } catch (error) {
    console.error('Failed to process payment success:', error);
    throw error;
  }
}

/**
 * Handles failed payment events
 */
async function handlePaymentFailure(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  const customerId = paymentIntent.customer as string;

  try {
    // Store failed payment record
    await prisma.payment.create({
      data: {
        stripePaymentId: paymentIntent.id,
        stripeCustomerId: customerId,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: 'failed',
        metadata: paymentIntent.metadata
      }
    });

    // Get customer details
    const customer = await stripe.customers.retrieve(customerId);
    if (!customer || customer.deleted) {
      throw new Error('Customer not found');
    }

    // Send failure notification
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SUPPORT_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: `"RescuePC Repairs" <${process.env.SUPPORT_EMAIL}>`,
      to: customer.email!,
      subject: '❌ Payment Failed - RescuePC Repairs',
      text: `Your payment has failed. Please try again or contact support.`
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to process payment failure:', error);
    throw error;
  }
}

/**
 * Handles subscription events
 */
async function handleSubscriptionUpdate(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription & {
    current_period_end: number;
  };
  const customerId = subscription.customer as string;

  try {
    // Update subscription record
    await prisma.subscription.upsert({
      where: { stripeSubscriptionId: subscription.id },
      update: {
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      },
      create: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: customerId,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      }
    });

    // Get customer details
    const customer = await stripe.customers.retrieve(customerId);
    if (!customer || customer.deleted) {
      throw new Error('Customer not found');
    }

    // Send subscription status email
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SUPPORT_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: `"RescuePC Repairs" <${process.env.SUPPORT_EMAIL}>`,
      to: customer.email!,
      subject: '📅 Subscription Update - RescuePC Repairs',
      text: `Your subscription status has been updated.`
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to process subscription update:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Origin validation
    if (!validateOrigin(request)) {
      return new NextResponse('Invalid origin', { status: 403 });
    }

    // 2. Get and validate signature
    const signature = request.headers.get('stripe-signature');
    const payload = await request.text();

    if (!validateStripeSignature(payload, signature)) {
      return new NextResponse('Invalid signature', { status: 400 });
    }

    // 3. Parse and handle event
    const event = JSON.parse(payload) as Stripe.Event;
    let result;

    switch (event.type) {
      case 'payment_intent.succeeded':
        result = await handlePaymentSuccess(event);
        break;
      case 'payment_intent.payment_failed':
        result = await handlePaymentFailure(event);
        break;
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        result = await handleSubscriptionUpdate(event);
        break;
      default:
        return new NextResponse(`Unhandled event type: ${event.type}`, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Webhook error:', error);
    return new NextResponse('Webhook handler failed', { status: 500 });
  }
}

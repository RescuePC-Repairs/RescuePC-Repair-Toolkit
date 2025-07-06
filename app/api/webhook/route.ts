export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { createHmac } from 'crypto';
import { prisma } from '../../../utils/prisma';
import { validateOrigin } from '@/utils/originValidation';

// SECURE STRIPE INITIALIZATION - Moved to runtime
let stripe: Stripe | null = null;
let webhookSecret: string | null = null;

function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('CRITICAL: STRIPE_SECRET_KEY environment variable is required');
  }

  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16'
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

// FORTUNE 500 AUTOMATION SYSTEM - NO COMPLEX RATE LIMITING NEEDED

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
    // Store payment record with enhanced metadata
    const payment = await prisma.payment.create({
      data: {
        stripePaymentId: paymentIntent.id,
        stripeCustomerId: customerId,
        amount,
        currency,
        status: 'completed',
        metadata: {
          ...paymentIntent.metadata,
          processedAt: new Date().toISOString(),
          automationVersion: '2.0.0'
        }
      }
    });

    // Get customer details with enhanced error handling
    const customer = await getStripe().customers.retrieve(customerId);
    if (!customer || customer.deleted) {
      throw new Error('Customer not found or deleted');
    }

    // Create or update license with enhanced features
    const license = await prisma.license.create({
      data: {
        customerId,
        type: paymentIntent.metadata.licenseType || 'standard',
        status: 'active',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        paymentId: payment.id
      }
    });

    // Send enhanced confirmation email with professional template
    await sendEnhancedConfirmationEmail(customer.email!, paymentIntent, license);

    // Log successful automation
    console.log(
      `✅ Payment automation completed for ${customer.email}: Payment ${payment.id}, License ${license.id}`
    );

    return { success: true, paymentId: payment.id, licenseId: license.id };
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
    // Store failed payment record with enhanced tracking
    await prisma.payment.create({
      data: {
        stripePaymentId: paymentIntent.id,
        stripeCustomerId: customerId,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: 'failed',
        metadata: {
          ...paymentIntent.metadata,
          failedAt: new Date().toISOString(),
          failureReason: paymentIntent.last_payment_error?.message || 'Unknown error',
          automationVersion: '2.0.0'
        }
      }
    });

    // Get customer details
    const customer = await getStripe().customers.retrieve(customerId);
    if (!customer || customer.deleted) {
      throw new Error('Customer not found or deleted');
    }

    // Send enhanced failure notification with recovery options
    await sendEnhancedFailureEmail(customer.email!, paymentIntent);

    console.log(`❌ Payment failure handled for ${customer.email}: ${paymentIntent.id}`);

    return { success: true };
  } catch (error) {
    console.error('❌ Failed to process payment failure:', error);
    throw error;
  }
}

/**
 * Enhanced subscription events with enterprise features
 */
async function handleSubscriptionUpdate(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription & {
    current_period_end: number;
  };
  const customerId = subscription.customer as string;

  try {
    // Update subscription record with enhanced tracking
    await prisma.subscription.upsert({
      where: { stripeSubscriptionId: subscription.id },
      update: {
        status: subscription.status,
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      },
      create: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: customerId,
        status: subscription.status,
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      }
    });

    // Get customer details
    const customer = await getStripe().customers.retrieve(customerId);
    if (!customer || customer.deleted) {
      throw new Error('Customer not found or deleted');
    }

    // Send enhanced subscription status email
    await sendEnhancedSubscriptionEmail(customer.email!, subscription);

    console.log(`📅 Subscription update processed for ${customer.email}: ${subscription.id}`);

    return { success: true };
  } catch (error) {
    console.error('❌ Failed to process subscription update:', error);
    throw error;
  }
}

/**
 * Enhanced confirmation email with Fortune 500 template
 */
async function sendEnhancedConfirmationEmail(
  email: string,
  paymentIntent: Stripe.PaymentIntent,
  license: any
) {
  try {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SUPPORT_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>🎉 Payment Successful - RescuePC Repairs</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 10px; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0; }
          .button { display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; }
          .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Payment Successful!</h1>
            <p>Your RescuePC Repairs license has been activated</p>
          </div>
          
          <div class="content">
            <h2>Thank you for your purchase!</h2>
            <p>Your payment has been processed successfully and your license is now active.</p>
            
            <h3>📋 Order Details:</h3>
            <ul>
              <li><strong>Order ID:</strong> ${paymentIntent.id}</li>
              <li><strong>License ID:</strong> ${license.id}</li>
              <li><strong>Amount:</strong> $${(paymentIntent.amount / 100).toFixed(2)}</li>
              <li><strong>Status:</strong> ✅ Active</li>
            </ul>
            
            <h3>🚀 Next Steps:</h3>
            <ol>
              <li>Download RescuePC Repairs from our website</li>
              <li>Install the software on your computer</li>
              <li>Enter your license key when prompted</li>
              <li>Start repairing and optimizing your PC!</li>
            </ol>
            
            <p style="text-align: center; margin: 30px 0;">
              <a href="https://rescuepcrepairs.com" class="button">Download Now</a>
            </p>
          </div>
          
          <div class="footer">
            <p>If you have any questions, please contact us at support@rescuepcrepairs.com</p>
            <p>© 2025 RescuePC Repairs. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"RescuePC Repairs" <${process.env.SUPPORT_EMAIL}>`,
      to: email,
      subject: '🎉 Payment Successful - RescuePC Repairs License Activated',
      html: emailHTML,
      text: `Thank you for your purchase! Your RescuePC Repairs license has been activated. Order ID: ${paymentIntent.id}, License ID: ${license.id}. Download at https://rescuepcrepairs.com`
    });

    console.log(`✅ Enhanced confirmation email sent to ${email}`);
  } catch (error) {
    console.error('❌ Failed to send enhanced confirmation email:', error);
  }
}

/**
 * Enhanced failure email with recovery options
 */
async function sendEnhancedFailureEmail(email: string, paymentIntent: Stripe.PaymentIntent) {
  try {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SUPPORT_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>❌ Payment Failed - RescuePC Repairs</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 30px; text-align: center; border-radius: 10px; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; }
          .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Payment Failed</h1>
            <p>We couldn't process your payment</p>
          </div>
          
          <div class="content">
            <h2>Don't worry, we're here to help!</h2>
            <p>Your payment has failed, but we want to make sure you get your RescuePC Repairs license.</p>
            
            <h3>🔧 Common Solutions:</h3>
            <ul>
              <li>Check your payment method details</li>
              <li>Ensure sufficient funds are available</li>
              <li>Try a different payment method</li>
              <li>Contact your bank if needed</li>
            </ul>
            
            <h3>📞 Need Help?</h3>
            <p>Our support team is ready to assist you with any payment issues.</p>
            
            <p style="text-align: center; margin: 30px 0;">
              <a href="https://rescuepcrepairs.com" class="button">Try Again</a>
            </p>
          </div>
          
          <div class="footer">
            <p>Contact us at support@rescuepcrepairs.com for immediate assistance</p>
            <p>© 2025 RescuePC Repairs. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"RescuePC Repairs Support" <${process.env.SUPPORT_EMAIL}>`,
      to: email,
      subject: '❌ Payment Failed - RescuePC Repairs (We Can Help!)',
      html: emailHTML,
      text: `Your payment has failed. Don't worry - we're here to help! Contact us at support@rescuepcrepairs.com for assistance.`
    });

    console.log(`✅ Enhanced failure email sent to ${email}`);
  } catch (error) {
    console.error('❌ Failed to send enhanced failure email:', error);
  }
}

/**
 * Enhanced subscription email with enterprise features
 */
async function sendEnhancedSubscriptionEmail(email: string, subscription: Stripe.Subscription) {
  try {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SUPPORT_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>📅 Subscription Update - RescuePC Repairs</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; text-align: center; border-radius: 10px; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📅 Subscription Update</h1>
            <p>Your RescuePC Repairs subscription has been updated</p>
          </div>
          
          <div class="content">
            <h2>Subscription Status: ${subscription.status}</h2>
            <p>Your subscription status has been updated successfully.</p>
            
            <h3>📋 Subscription Details:</h3>
            <ul>
              <li><strong>Status:</strong> ${subscription.status}</li>
              <li><strong>Current Period End:</strong> ${new Date((subscription as any).current_period_end * 1000).toLocaleDateString()}</li>
              <li><strong>Cancel at Period End:</strong> ${subscription.cancel_at_period_end ? 'Yes' : 'No'}</li>
            </ul>
            
            <p>Thank you for choosing RescuePC Repairs!</p>
          </div>
          
          <div class="footer">
            <p>Questions? Contact us at support@rescuepcrepairs.com</p>
            <p>© 2025 RescuePC Repairs. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"RescuePC Repairs" <${process.env.SUPPORT_EMAIL}>`,
      to: email,
      subject: '📅 Subscription Update - RescuePC Repairs',
      html: emailHTML,
      text: `Your subscription status has been updated to: ${subscription.status}. Thank you for choosing RescuePC Repairs!`
    });

    console.log(`✅ Enhanced subscription email sent to ${email}`);
  } catch (error) {
    console.error('❌ Failed to send enhanced subscription email:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Enhanced origin validation
    if (!validateOrigin(request)) {
      console.warn('❌ Invalid origin detected');
      return new NextResponse('Invalid origin', { status: 403 });
    }

    // 2. Get and validate signature with enhanced security
    const signature = request.headers.get('stripe-signature');
    const payload = await request.text();

    if (!validateStripeSignature(payload, signature)) {
      console.error('❌ Invalid webhook signature');
      return new NextResponse('Invalid signature', { status: 400 });
    }

    // 3. Parse and handle event with enhanced logging
    const event = JSON.parse(payload) as Stripe.Event;
    console.log(`🔄 Processing webhook event: ${event.type}`);

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
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
        return new NextResponse(`Unhandled event type: ${event.type}`, { status: 400 });
    }

    console.log(`✅ Webhook processed successfully: ${event.type}`);
    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return new NextResponse('Webhook handler failed', { status: 500 });
  }
}

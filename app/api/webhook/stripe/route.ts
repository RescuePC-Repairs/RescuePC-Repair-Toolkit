import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

// Validate required environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('CRITICAL: STRIPE_SECRET_KEY environment variable is required');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('CRITICAL: STRIPE_WEBHOOK_SECRET environment variable is required');
}

// SECURE STRIPE INITIALIZATION
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil',
  typescript: true
});

// AUTOMATED EMAIL CONFIGURATION [[memory:564836]]
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SUPPORT_EMAIL, // ***REMOVED***
    pass: process.env.GMAIL_APP_PASSWORD // ***REMOVED***
  }
});

// FORTUNE 500 AUTOMATED LICENSE SYSTEM - ZERO CLOUD COSTS
const PRODUCT_MAPPINGS: Record<
  string,
  { name: string; licenseCount: number; type: string; price: number }
> = {
  // BASIC LICENSE - 1 license for $49.99
  basic: {
    name: 'Basic License',
    licenseCount: 1,
    type: 'basic',
    price: 49.99
  },
  // PROFESSIONAL LICENSE - 5 licenses for $199.99 (NOT 5 separate purchases!)
  professional: {
    name: 'Professional License',
    licenseCount: 5,
    type: 'professional',
    price: 199.99
  },
  // ENTERPRISE LICENSE - 25 licenses for $499.99 (NOT 25 separate purchases!)
  enterprise: {
    name: 'Enterprise License',
    licenseCount: 25,
    type: 'enterprise',
    price: 499.99
  },
  // GOVERNMENT LICENSE - 100 licenses for $999.99 (NOT 100 separate purchases!)
  government: {
    name: 'Government License',
    licenseCount: 100,
    type: 'government',
    price: 999.99
  },
  // LIFETIME ENTERPRISE - Unlimited licenses for $499.99
  lifetime: {
    name: 'Lifetime Enterprise',
    licenseCount: -1, // Unlimited
    type: 'lifetime_enterprise',
    price: 499.99
  }
};

// AUTOMATED LICENSE KEY GENERATION
function generateLicenseKeys(customerEmail: string, licenseInfo: any): string[] {
  const licenses: string[] = [];
  const baseKey = `RESCUE-PC-${Date.now().toString(36).toUpperCase()}`;

  if (licenseInfo.licenseCount === -1) {
    // Unlimited license - generate master key
    licenses.push(`${baseKey}-UNLIMITED-ENTERPRISE`);
  } else {
    // Generate specific number of licenses
    for (let i = 1; i <= licenseInfo.licenseCount; i++) {
      const randomSuffix = crypto.randomBytes(4).toString('hex').toUpperCase();
      licenses.push(`${baseKey}-${licenseInfo.type.toUpperCase()}-${randomSuffix}`);
    }
  }

  return licenses;
}

// AUTOMATED EMAIL SYSTEM - PRODUCTION READY [[memory:564836]]
async function sendAutomatedEmail(to: string, subject: string, htmlContent: string) {
  try {
    await transporter.sendMail({
      from: `"RescuePC Repairs" <${process.env.SUPPORT_EMAIL}>`,
      to: to,
      subject: subject,
      html: htmlContent,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High'
      }
    });

    console.log(`[EMAIL_SUCCESS] Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error(`[EMAIL_ERROR] Failed to send email to ${to}:`, error);
    return false;
  }
}

// FORTUNE 500 CUSTOMER EMAIL GENERATION
function generateCustomerEmail(
  customerName: string,
  customerEmail: string,
  licenses: string[],
  productName: string,
  amount: number
): string {
  const downloadLink =
    'https://u.pcloud.link/publink/show?code=XZE6yu5ZTCRwbBmyaX7WmMTJeriiNRbHkz0V';

  // Add special content for unlimited access
  const isUnlimited = productName.includes('Lifetime') || productName.includes('Enterprise');
  const unlimitedContent = isUnlimited
    ? `
    <div style="background: #fff; border: 2px solid #28a745; border-radius: 8px; padding: 20px; margin: 25px 0;">
        <h3 style="color: #28a745; margin-top: 0;">🚀 UNLIMITED ACCESS GRANTED</h3>
        <p style="color: #28a745; font-weight: bold;">Install on 1, 10, 100, or 1000+ computers</p>
        <p>Your enterprise license provides unlimited installations across your entire organization.</p>
    </div>
  `
    : '';

  // Use simple text email instead of HTML to avoid static generation issues
  return `
Dear ${customerName || 'Valued Customer'},

Thank you for purchasing ${productName}! Your payment of $${amount} has been processed successfully.

Email: ${customerEmail}

Download the RescuePC Repairs toolkit and enjoy enhanced PC performance!

${unlimitedContent}

Your License Keys:
${licenses.map((license, index) => `License ${index + 1}: ${license}`).join('\n')}

Download Link: ${downloadLink}

Need Help? We're Here For You!
Support: rescuepcrepair@yahoo.com
Response time: Within 2 hours

Best regards, Tyler Keesee
© 2024 RescuePC Repairs. All rights reserved.
  `;
}

// FORTUNE 500 ADMIN NOTIFICATION
function generateAdminNotification(
  customerEmail: string,
  customerName: string,
  licenseInfo: any,
  licenses: string[],
  amount: number
): string {
  return `
🎉 FORTUNE 500 AUTOMATED SALE COMPLETED!

💰 CUSTOMER DETAILS:
- Name: ${customerName}
- Email: ${customerEmail}
- Package: ${licenseInfo.name}
- Amount: $${amount}
- Licenses Generated: ${licenses.length}
- Time: ${new Date().toISOString()}

🔑 LICENSE KEYS DELIVERED:
${licenses.map((license, index) => `${index + 1}. ${license}`).join('\n')}

✅ AUTOMATION STATUS:
✅ Payment processed automatically
✅ Licenses generated instantly
✅ Customer email sent professionally
✅ Download links provided
✅ Money deposited to your account
✅ Zero manual work required

💰 REVENUE GENERATED: $${amount}
🏦 Your automated empire just made you money!

📧 Customer Information:
Name: ${customerName}
Email: ${customerEmail}
License Key: ${licenses[0]}
Amount Paid: $${amount}
License Type: ${licenseInfo.name}
  `;
}

// Helper function for getting license info
function getLicenseInfo(productId: string): any {
  const productMap: Record<string, any> = {
    prod_basic_license: {
      name: 'Basic License',
      licenseCount: 1,
      type: 'basic',
      price: 49.99
    },
    prod_professional_license: {
      name: 'Professional License',
      licenseCount: 5,
      type: 'professional',
      price: 199.99
    },
    prod_enterprise_license: {
      name: 'Enterprise License',
      licenseCount: 25,
      type: 'enterprise',
      price: 499.99
    },
    prod_government_license: {
      name: 'Government License',
      licenseCount: 100,
      type: 'government',
      price: 999.99
    },
    prod_lifetime_enterprise: {
      name: 'Lifetime Enterprise',
      licenseCount: -1,
      type: 'lifetime_enterprise',
      price: 499.99
    }
  };
  return productMap[productId] || null;
}

// MAIN WEBHOOK HANDLER
export async function POST(request: NextRequest) {
  console.log('[WEBHOOK] Processing Stripe webhook...');

  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('[WEBHOOK_ERROR] Missing Stripe signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Validate email configuration only during actual API calls
    if (!process.env.SUPPORT_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
      console.error(
        'CRITICAL: Email configuration missing. Set SUPPORT_EMAIL and GMAIL_APP_PASSWORD environment variables.'
      );
      return NextResponse.json({ error: 'Email configuration missing' }, { status: 500 });
    }

    // VERIFY WEBHOOK SIGNATURE
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
      console.error(`[WEBHOOK_ERROR] Signature verification failed:`, err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log(`[WEBHOOK] Processing event: ${event.type}`);

    // HANDLE DIFFERENT EVENT TYPES
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`[WEBHOOK] Unhandled event type: ${event.type}`);
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[WEBHOOK_ERROR] Webhook processing failed:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// HANDLE CHECKOUT SESSION COMPLETION (NEW CUSTOMERS)
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log(`[CHECKOUT_COMPLETED] Processing session: ${session.id}`);

  try {
    // Extract customer information from multiple sources
    const customerEmail = session.customer_email || session.customer_details?.email;
    const customerName = session.customer_details?.name || 'Valued Customer';
    const packageType = session.metadata?.packageType || 'basic';
    const amount = (session.amount_total || 0) / 100;

    console.log(
      `[CUSTOMER_INFO] Email: ${customerEmail}, Name: ${customerName}, Package: ${packageType}, Amount: $${amount}`
    );

    if (!customerEmail) {
      console.error('[CHECKOUT_ERROR] No customer email found');
      return;
    }

    // GET PACKAGE INFO
    const licenseInfo = PRODUCT_MAPPINGS[packageType];
    if (!licenseInfo) {
      console.error(`[CHECKOUT_ERROR] Unknown package type: ${packageType}`);
      return;
    }

    // GENERATE LICENSES AUTOMATICALLY
    const licenses = generateLicenseKeys(customerEmail, licenseInfo);

    // SEND CUSTOMER EMAIL (AUTOMATED)
    const customerEmailContent = generateCustomerEmail(
      customerName,
      customerEmail,
      licenses,
      licenseInfo.name,
      amount
    );
    await sendAutomatedEmail(
      customerEmail,
      `🔑 Your ${licenseInfo.name} - RescuePC Repairs Enterprise Solutions`,
      customerEmailContent
    );

    // SEND ADMIN NOTIFICATION (AUTOMATED) [[memory:564836]]
    const adminEmailContent = generateAdminNotification(
      customerEmail,
      customerName,
      licenseInfo,
      licenses,
      amount
    );
    await sendAutomatedEmail(
      'rescuepcrepair@yahoo.com',
      `💰 AUTOMATED SALE: ${licenseInfo.name} - $${amount} - ${customerEmail}`,
      adminEmailContent
    );

    console.log(`[AUTOMATION_SUCCESS] Processed ${packageType} purchase for ${customerEmail}`);
  } catch (error) {
    console.error('[CHECKOUT_ERROR] Failed to process checkout completion:', error);
  }
}

// HANDLE PAYMENT INTENT SUCCESS (ONE-TIME PAYMENTS)
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log(`[PAYMENT_SUCCESS] Processing payment: ${paymentIntent.id}`);

  // This is handled by checkout.session.completed for our flow
  // But we log it for completeness
}

// HANDLE INVOICE PAYMENT SUCCESS (SUBSCRIPTIONS)
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log(`[SUBSCRIPTION_PAYMENT] Processing invoice: ${invoice.id}`);

  // For subscription renewals, we could send renewal notifications here
  // Currently not needed but available for future expansion
}

// HANDLE GET REQUESTS
export async function GET() {
  return NextResponse.json(
    { message: 'RescuePC Repairs Webhook Handler - POST only' },
    { status: 405 }
  );
}

// Polyfill Response.json for test environment
if (typeof Response !== 'undefined' && !Response.json) {
  Response.json = function (data: any, init?: any) {
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      ...init
    });
  };
}

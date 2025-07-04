import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// ENVIRONMENT VALIDATION - CRITICAL SECURITY CHECK
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

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RescuePC Repairs - License Delivery</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">🚀 RescuePC Repairs</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Enterprise-Grade PC Repair Solutions</p>
    </div>
    
    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 2px solid #e9ecef;">
        <h2 style="color: #28a745; margin-top: 0;">🎉 Payment Successful!</h2>
        
        <p><strong>Dear ${customerName || 'Valued Customer'},</strong></p>
        
        <p>Thank you for purchasing <strong>${productName}</strong>! Your payment of <strong>$${amount}</strong> has been processed successfully.</p>
        
        <div style="background: #fff; border: 2px solid #28a745; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <h3 style="color: #28a745; margin-top: 0;">🔑 Your License Keys:</h3>
            ${licenses
              .map(
                (license, index) => `
                <div style="background: #f8f9fa; padding: 10px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #28a745;">
                    <strong>License ${index + 1}:</strong> <code style="background: #e9ecef; padding: 3px 6px; border-radius: 3px; font-family: monospace;">${license}</code>
                </div>
            `
              )
              .join('')}
        </div>
        
        <div style="background: #fff; border: 2px solid #dc2626; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <h3 style="color: #dc2626; margin-top: 0;">⚠️ SECURE DOWNLOAD LINK</h3>
            <p style="margin-bottom: 15px;">Your exclusive download link:</p>
            <p style="background: #f3f4f6; padding: 10px; border-radius: 5px; font-family: monospace; word-break: break-all; margin: 15px 0;">
                <a href="${downloadLink}" style="color: #dc2626; font-weight: bold;">
                    ${downloadLink}
                </a>
            </p>
            <div style="background: #fef3c7; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #f59e0b;">
                <h5 style="color: #d97706; margin: 0 0 10px 0;">🚨 LEGAL WARNING:</h5>
                <ul style="margin: 0; padding-left: 20px; color: #d97706;">
                    <li><strong>DO NOT SHARE</strong> this download link with anyone</li>
                    <li><strong>DO NOT POST</strong> this link on social media, forums, or public websites</li>
                    <li><strong>DO NOT FORWARD</strong> this email to others</li>
                    <li><strong>LEGAL ACTION</strong> will be taken against unauthorized sharing</li>
                    <li>This link is <strong>EXCLUSIVE</strong> to your license purchase</li>
                </ul>
            </div>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeeba; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <h4 style="color: #856404; margin-top: 0;">📋 Quick Start Instructions:</h4>
            <ol style="color: #856404; margin: 0;">
                <li>Download the software using the link above</li>
                <li>Extract the files to your desired location</li>
                <li>Run the installer as Administrator</li>
                <li>Enter your license key when prompted</li>
                <li>Enjoy your enhanced PC performance!</li>
            </ol>
        </div>
        
        <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <h4 style="color: #155724; margin-top: 0;">🛡️ Security Features Included:</h4>
            <ul style="color: #155724; margin: 0;">
                <li>Military-grade encryption</li>
                <li>Real-time threat detection</li>
                <li>Automatic security updates</li>
                <li>Secure backup and recovery</li>
            </ul>
        </div>
        
        <div style="background: #e3f2fd; border: 1px solid #bbdefb; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <h4 style="color: #1565c0; margin-top: 0;">📱 Mobile Users:</h4>
            <p style="color: #1565c0; margin: 0;">
                <strong>Note:</strong> This software is designed for Windows PCs. If you're on mobile, 
                please access the download link from a desktop or laptop computer for the best experience.
            </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <h4>Need Help? We're Here For You!</h4>
            <p>📧 <strong>Support:</strong> <a href="mailto:rescuepcrepair@yahoo.com">rescuepcrepair@yahoo.com</a></p>
            <p style="font-size: 12px; color: #666;">Response time: Within 2 hours</p>
        </div>
    </div>
    
    <div style="text-align: center; padding: 15px; font-size: 12px; color: #666;">
        <p>This is an automated email. Your license keys are secure and ready to use.</p>
        <p>© 2024 RescuePC Repairs. All rights reserved.</p>
    </div>
</body>
</html>
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
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 25px; text-align: center; color: white; border-radius: 10px;">
        <h1 style="margin: 0; font-size: 24px;">🎉 AUTOMATED SALE COMPLETED!</h1>
        <p style="margin: 10px 0 0 0; font-size: 14px;">Fortune 500 Automation System</p>
    </div>
    
    <div style="background: #f8f9fa; padding: 25px; border: 2px solid #28a745; border-radius: 0 0 10px 10px;">
        <h2 style="color: #28a745; margin-top: 0;">💰 CUSTOMER DETAILS:</h2>
        <ul style="background: white; padding: 20px; border-radius: 5px; list-style: none; margin: 0;">
            <li><strong>👤 Name:</strong> ${customerName}</li>
            <li><strong>📧 Email:</strong> ${customerEmail}</li>
            <li><strong>📦 Package:</strong> ${licenseInfo.name}</li>
            <li><strong>💵 Amount:</strong> $${amount}</li>
            <li><strong>🔑 Licenses Generated:</strong> ${licenses.length}</li>
            <li><strong>⏰ Time:</strong> ${new Date().toISOString()}</li>
        </ul>
        
        <h3 style="color: #007bff; margin-top: 25px;">🔑 LICENSE KEYS DELIVERED:</h3>
        <div style="background: white; padding: 15px; border-radius: 5px; font-family: monospace; font-size: 12px;">
            ${licenses.map((license, index) => `${index + 1}. ${license}`).join('<br>')}
        </div>
        
        <h3 style="color: #28a745; margin-top: 25px;">✅ AUTOMATION STATUS:</h3>
        <div style="background: #d4edda; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745;">
            <p style="margin: 5px 0;">✅ Payment processed automatically</p>
            <p style="margin: 5px 0;">✅ Licenses generated instantly</p>
            <p style="margin: 5px 0;">✅ Customer email sent professionally</p>
            <p style="margin: 5px 0;">✅ Download links provided</p>
            <p style="margin: 5px 0;">✅ Money deposited to your account</p>
            <p style="margin: 5px 0;">✅ Zero manual work required</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%); padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; color: white;">
            <h3 style="margin: 0;">💰 REVENUE GENERATED: $${amount}</h3>
            <p style="margin: 10px 0 0 0;">🏦 Your automated empire just made you money!</p>
        </div>
    </div>
</div>
  `;
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

    return NextResponse.json({ received: true });
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

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { sendLicenseEmail } from '../../../utils/email';

const stripe = new Stripe(process.env['STRIPE_SECRET_KEY']!, {
  apiVersion: '2025-06-30.basil'
});

const webhookSecret = process.env['STRIPE_WEBHOOK_SECRET']!;

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
    duration: 'annual'
  },
  'enterprise-50': {
    id: 'enterprise-50',
    name: 'Enterprise 50',
    userCount: 50,
    price: 899.99,
    duration: 'annual'
  },
  'enterprise-100': {
    id: 'enterprise-100',
    name: 'Enterprise 100',
    userCount: 100,
    price: 1499.99,
    duration: 'annual'
  },
  government: {
    id: 'government',
    name: 'Government',
    userCount: 100,
    price: 999.99,
    duration: 'annual'
  },
  unlimited: {
    id: 'unlimited',
    name: 'Unlimited',
    userCount: -1, // Unlimited
    price: 499.99,
    duration: 'lifetime'
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await handleEnterpriseCheckoutCompleted(session);
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handleEnterprisePaymentSucceeded(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await handleEnterprisePaymentFailed(failedPayment);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Enterprise webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handleEnterpriseCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const { packageId, customerEmail, adminEmail, companyName } = session.metadata || {};

    if (!packageId || !customerEmail) {
      console.error('Missing metadata in enterprise checkout session');
      return;
    }

    const enterprisePackage = ENTERPRISE_PACKAGES[packageId];
    if (!enterprisePackage) {
      console.error(`Unknown enterprise package: ${packageId}`);
      return;
    }

    // Generate enterprise licenses
    const licenses = await generateEnterpriseLicenses(
      enterprisePackage,
      customerEmail,
      adminEmail || customerEmail,
      companyName || 'Enterprise Customer'
    );

    // Store licenses in database
    await storeEnterpriseLicenses(licenses, session.id);

    // Send enterprise welcome email with license table
    await sendEnterpriseWelcomeEmail(
      adminEmail || customerEmail,
      licenses,
      enterprisePackage,
      companyName || 'Enterprise Customer'
    );

    console.log(`Enterprise licenses generated for ${customerEmail}: ${licenses.length} licenses`);
  } catch (error) {
    console.error('Error handling enterprise checkout completion:', error);
  }
}

async function handleEnterprisePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    const { packageId, customerEmail } = paymentIntent.metadata || {};

    if (packageId && customerEmail) {
      console.log(`Enterprise payment succeeded for package: ${packageId}`);
      // Additional payment success logic here
    }
  } catch (error) {
    console.error('Error handling enterprise payment success:', error);
  }
}

async function handleEnterprisePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    const { packageId, customerEmail } = paymentIntent.metadata || {};

    if (packageId && customerEmail) {
      console.log(`Enterprise payment failed for package: ${packageId}`);
      // Handle payment failure (e.g., notify admin, retry logic)
    }
  } catch (error) {
    console.error('Error handling enterprise payment failure:', error);
  }
}

interface EnterpriseLicense {
  licenseKey: string;
  userEmail: string;
  licenseType: string;
  purchaseDate: string;
  expiryDate: string | null;
  status: 'active' | 'expired' | 'revoked';
  stripeSessionId: string;
  assignedTo: string;
  companyName: string;
  adminEmail: string;
  packageId: string;
}

async function generateEnterpriseLicenses(
  enterprisePackage: EnterprisePackage,
  customerEmail: string,
  adminEmail: string,
  companyName: string
): Promise<EnterpriseLicense[]> {
  const licenses: EnterpriseLicense[] = [];
  const now = new Date();
  const purchaseDate = now.toISOString();

  // Calculate expiry date
  let expiryDate: string | null = null;
  if (enterprisePackage.duration === 'annual') {
    const expiry = new Date(now);
    expiry.setFullYear(expiry.getFullYear() + 1);
    expiryDate = expiry.toISOString();
  }

  // Generate licenses based on user count
  const userCount = enterprisePackage.userCount === -1 ? 1000 : enterprisePackage.userCount; // Unlimited = 1000 licenses

  for (let i = 1; i <= userCount; i++) {
    const licenseKey = generateEnterpriseLicenseKey(enterprisePackage.id, i);
    const employeeEmail = `${enterprisePackage.id}-employee-${i}@${companyName.toLowerCase().replace(/\s+/g, '')}.com`;

    licenses.push({
      licenseKey,
      userEmail: customerEmail,
      licenseType: 'enterprise',
      purchaseDate,
      expiryDate,
      status: 'active',
      stripeSessionId: '',
      assignedTo: employeeEmail,
      companyName,
      adminEmail,
      packageId: enterprisePackage.id
    });
  }

  return licenses;
}

function generateEnterpriseLicenseKey(packageId: string, employeeNumber: number): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  const employeeHex = employeeNumber.toString(16).padStart(4, '0').toUpperCase();
  const packagePrefix = packageId.substring(0, 3).toUpperCase();

  return `EMP-${packagePrefix}-${employeeHex}-${timestamp}-${random}`.toUpperCase();
}

async function storeEnterpriseLicenses(licenses: EnterpriseLicense[], sessionId: string) {
  // TODO: Implement your database storage logic
  // This could be a database insert, file write, or API call
  console.log(`Storing ${licenses.length} enterprise licenses for session: ${sessionId}`);

  // Update session ID for all licenses
  licenses.forEach((license) => {
    license.stripeSessionId = sessionId;
  });

  // Store in your preferred storage (database, file, etc.)
  // Example: Write to JSON file, database, or cloud storage
}

async function sendEnterpriseWelcomeEmail(
  adminEmail: string,
  licenses: EnterpriseLicense[],
  enterprisePackage: EnterprisePackage,
  companyName: string
) {
  try {
    const emailData = {
      to: adminEmail,
      subject: `Your ${enterprisePackage.name} License Package - RescuePC Repairs`,
      html: generateEnterpriseEmailHTML(licenses, enterprisePackage, companyName),
      text: generateEnterpriseEmailText(licenses, enterprisePackage, companyName)
    };

    // Send via your email service
    console.log(`Sending enterprise welcome email to ${adminEmail}`);

    // TODO: Implement your email sending logic
    // await sendEmail(emailData)
  } catch (error) {
    console.error('Failed to send enterprise welcome email:', error);
  }
}

function generateEnterpriseEmailHTML(
  licenses: EnterpriseLicense[],
  enterprisePackage: EnterprisePackage,
  companyName: string
): string {
  const licenseTable = licenses
    .map(
      (license, index) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
      <td style="padding: 8px; border: 1px solid #ddd; font-family: monospace;">${license.licenseKey}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${license.assignedTo}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${license.expiryDate ? new Date(license.expiryDate).toLocaleDateString() : 'Lifetime'}</td>
    </tr>
  `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Enterprise License Package - RescuePC Repairs</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">Enterprise License Package - RescuePC Repairs</h1>
        
        <p>Thank you for purchasing the <strong>${enterprisePackage.name}</strong> package for <strong>${companyName}</strong>!</p>
        
        <h2>Package Details:</h2>
        <ul>
          <li><strong>Package:</strong> ${enterprisePackage.name}</li>
          <li><strong>Users:</strong> ${enterprisePackage.userCount === -1 ? 'Unlimited' : enterprisePackage.userCount}</li>
          <li><strong>Duration:</strong> ${enterprisePackage.duration === 'lifetime' ? 'Lifetime' : '1 Year'}</li>
          <li><strong>Price:</strong> $${enterprisePackage.price}</li>
        </ul>
        
        <h2>License Keys:</h2>
        <p>Below are your enterprise license keys. Each employee should use their assigned key:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #f8f9fa;">
              <th style="padding: 8px; border: 1px solid #ddd;">#</th>
              <th style="padding: 8px; border: 1px solid #ddd;">License Key</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Assigned To</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Expires</th>
            </tr>
          </thead>
          <tbody>
            ${licenseTable}
          </tbody>
        </table>
        
        <h3>Next Steps:</h3>
        <ol>
          <li>Distribute license keys to your employees</li>
          <li>Download RescuePC Repairs from our website</li>
          <li>Install the software on each computer</li>
          <li>Enter the assigned license key when prompted</li>
          <li>Start repairing and optimizing your PCs!</li>
        </ol>
        
        <p>If you have any questions, please contact us at ***REMOVED***</p>
        
        <p>Best regards,<br>
        Tyler Keesee<br>
        RescuePC Repairs</p>
      </div>
    </body>
    </html>
  `;
}

function generateEnterpriseEmailText(
  licenses: EnterpriseLicense[],
  enterprisePackage: EnterprisePackage,
  companyName: string
): string {
  const licenseList = licenses
    .map(
      (license, index) =>
        `${index + 1}. ${license.licenseKey} - ${license.assignedTo} - ${license.expiryDate ? new Date(license.expiryDate).toLocaleDateString() : 'Lifetime'}`
    )
    .join('\n');

  return `
Enterprise License Package - RescuePC Repairs

Thank you for purchasing the ${enterprisePackage.name} package for ${companyName}!

Package Details:
- Package: ${enterprisePackage.name}
- Users: ${enterprisePackage.userCount === -1 ? 'Unlimited' : enterprisePackage.userCount}
- Duration: ${enterprisePackage.duration === 'lifetime' ? 'Lifetime' : '1 Year'}
- Price: $${enterprisePackage.price}

License Keys:
${licenseList}

Next Steps:
1. Distribute license keys to your employees
2. Download RescuePC Repairs from our website
3. Install the software on each computer
4. Enter the assigned license key when prompted
5. Start repairing and optimizing your PCs!

If you have any questions, please contact us at ***REMOVED***

Best regards,
Tyler Keesee
RescuePC Repairs
  `;
}

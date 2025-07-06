export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

// AUTOMATED EMAIL SYSTEM
async function sendAutomatedEmail(to: string, subject: string, htmlContent: string) {
  try {
    // Dynamically import nodemailer only on the server
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

// CUSTOMER EMAIL GENERATION
function generateCustomerEmail(
  customerName: string,
  customerEmail: string,
  licenses: string[],
  productName: string,
  amount: number
): string {
  const downloadLink =
    'https://u.pcloud.link/publink/show?code=XZE6yu5ZTCRwbBmyaX7WmMTJeriiNRbHkz0V';

  // Use simple text email instead of HTML to avoid static generation issues
  return `
Dear ${customerName},

Thank you for purchasing ${productName}! Your payment of $${amount} has been processed successfully.

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

// LICENSE KEY GENERATION
function generateLicenseKeys(customerEmail: string, licenseInfo: any): string[] {
  const licenses: string[] = [];
  const baseKey = `RESCUE-PC-${Date.now().toString(36).toUpperCase()}`;

  if (licenseInfo.licenseCount === -1) {
    // Unlimited license - generate master key
    licenses.push(`${baseKey}-UNLIMITED-ENTERPRISE`);
  } else {
    // Generate specific number of licenses
    for (let i = 1; i <= licenseInfo.licenseCount; i++) {
      const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
      licenses.push(`${baseKey}-${licenseInfo.type.toUpperCase()}-${randomSuffix}`);
    }
  }

  return licenses;
}

export async function GET() {
  try {
    console.log('[TEST_WEBHOOK] Simulating successful Stripe payment...');

    // Simulate customer data from Stripe Checkout
    const customerEmail = 'rescuepcrepair@yahoo.com';
    const customerName = 'Test Customer';
    const packageType = 'lifetime';
    const amount = 499.99;

    // License info for lifetime package
    const licenseInfo = {
      name: 'Lifetime Enterprise',
      licenseCount: -1, // Unlimited
      type: 'lifetime_enterprise',
      price: 499.99
    };

    // Generate license keys
    const licenses = generateLicenseKeys(customerEmail, licenseInfo);

    console.log(`[TEST_WEBHOOK] Generated licenses: ${licenses.join(', ')}`);

    // Send customer email
    const customerEmailContent = generateCustomerEmail(
      customerName,
      customerEmail,
      licenses,
      licenseInfo.name,
      amount
    );

    const emailSent = await sendAutomatedEmail(
      customerEmail,
      `🔑 Your ${licenseInfo.name} - RescuePC Repairs Enterprise Solutions`,
      customerEmailContent
    );

    if (emailSent) {
      console.log('[TEST_WEBHOOK] ✅ Email sent successfully!');
      return NextResponse.json({
        success: true,
        message: 'Test webhook email sent successfully!',
        customerEmail,
        licenses,
        amount
      });
    } else {
      console.log('[TEST_WEBHOOK] ❌ Email failed to send');
      return NextResponse.json(
        {
          success: false,
          message: 'Email failed to send'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[TEST_WEBHOOK_ERROR]', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Test webhook failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

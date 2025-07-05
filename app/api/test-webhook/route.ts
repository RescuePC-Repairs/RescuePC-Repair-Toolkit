import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';

// AUTOMATED EMAIL CONFIGURATION
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SUPPORT_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// AUTOMATED EMAIL SYSTEM
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

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>RescuePC Repairs - License Delivery</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">🚀 RescuePC Repairs</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Enterprise-Grade PC Repair Solutions</p>
    </div>
    
    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 2px solid #e9ecef;">
        <h2 style="color: #28a745; margin-top: 0;">🎉 Payment Successful!</h2>
        
        <p><strong>Dear ${customerName},</strong></p>
        
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

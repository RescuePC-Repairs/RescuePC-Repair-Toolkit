import nodemailer from 'nodemailer';

// SECURE EMAIL CONFIGURATION - NO HARDCODED SECRETS
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SUPPORT_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD
  },
  secure: true,
  port: 465,
  requireTLS: true
});

// Validate email configuration on startup
if (!process.env.SUPPORT_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
  throw new Error(
    'CRITICAL: Email configuration missing. Set SUPPORT_EMAIL and GMAIL_APP_PASSWORD environment variables.'
  );
}

// FREE EMAIL SENDING FUNCTION
export async function sendTransactionalEmail({
  to,
  subject,
  text,
  from,
  replyTo
}: {
  to: string;
  subject: string;
  text: string;
  from?: string;
  replyTo?: string;
}): Promise<void> {
  try {
    await emailTransporter.sendMail({
      from: from || `"RescuePC Repairs" <${process.env.SUPPORT_EMAIL}>`,
      to,
      subject,
      text,
      replyTo: replyTo || process.env.BUSINESS_EMAIL || '***REMOVED***'
    });
    console.log(`✅ Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    // Don't throw - system continues working even if email fails
  }
}

// FREE EMAIL TEMPLATE GENERATION
export function getPurchaseEmailTemplate(
  customerName: string,
  licenses: string[],
  productName: string
): string {
  return `
Hi ${customerName},

Thank you for purchasing RescuePC Repairs ${productName}!

Here are your license key(s):
${licenses.map((license, index) => `${index + 1}. ${license}`).join('\n')}

Download the toolkit here:
***REMOVED***

If you need any assistance, please contact us at:
***REMOVED***

Best regards,
Tyler Keesee
CEO, RescuePC Repairs
  `;
}

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendWelcomeEmail(
  customerEmail: string,
  customerName: string = 'Valued Customer'
): Promise<void> {
  const subject = '🎉 Welcome to RescuePC Repairs!';

  const emailData = {
    to: customerEmail,
    subject,
    from: `"RescuePC Repairs" <${process.env.SUPPORT_EMAIL}>`,
    replyTo: process.env.BUSINESS_EMAIL
  };

  if (process.env.NODE_ENV !== 'production') {
    console.log('Sending welcome email:', emailData);
  }

  const html = generateWelcomeEmailHTML(customerName);
  const text = generateWelcomeEmailText(customerName);

  await sendEmail(customerEmail, subject, html, text);
}

export async function sendLicenseEmail(
  customerEmail: string,
  licenseKey: string,
  licenseName: string,
  customerName: string = 'Valued Customer'
): Promise<void> {
  const subject = `🔑 Your ${licenseName} - RescuePC Repairs`;

  const emailData = {
    to: customerEmail,
    subject,
    licenseKey,
    licenseName
  };

  if (process.env.NODE_ENV !== 'production') {
    console.log('Sending license email:', emailData);
  }

  const html = generateLicenseEmailHTML(licenseKey, licenseName);
  const text = generateLicenseEmailText(licenseKey, licenseName);

  await sendEmail(customerEmail, subject, html, text);
}

function generateLicenseEmailHTML(licenseKey: string, licenseName: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your RescuePC Repairs License</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1e40af; color: white; padding: 20px; border-radius: 8px; text-align: center; }
    .content { background: #f8fafc; padding: 30px; border-radius: 8px; margin: 20px 0; }
    .license-box { background: #ffffff; border: 2px solid #1e40af; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
    .license-key { font-family: 'Courier New', monospace; font-size: 18px; font-weight: bold; color: #1e40af; letter-spacing: 2px; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
    .button { display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🛠️ RescuePC Repairs</h1>
    <p>Your ${licenseName} is Ready!</p>
  </div>
  
  <div class="content">
    <h2>🎉 Thank you for your purchase!</h2>
    
    <div class="license-box">
      <h3>Your License Key:</h3>
      <p class="license-key">${licenseKey}</p>
    </div>
    
    <h3>📥 Download Your Toolkit:</h3>
    <p>
      <a href="${process.env.PCLOUD_DOWNLOAD_LINK}" class="button">
        Download RescuePC Toolkit
      </a>
    </p>
    
    <h3>🚀 Getting Started:</h3>
    <ol>
      <li>Download the toolkit using the link above</li>
      <li>Install the software on your computer</li>
      <li>Enter your license key when prompted</li>
      <li>Start repairing computers like a pro!</li>
    </ol>
  </div>
  
  <div class="footer">
    <p>Need help? Contact us at <strong>${process.env.BUSINESS_EMAIL}</strong></p>
    <p>© 2024 RescuePC Repairs - Professional Computer Repair Solutions</p>
  </div>
</body>
</html>`;
}

function generateLicenseEmailText(licenseKey: string, licenseName: string): string {
  return `
🛠️ RescuePC Repairs - Your ${licenseName}

🎉 Thank you for your purchase!

Your License Key: ${licenseKey}

📥 Download Your Toolkit:
${process.env.PCLOUD_DOWNLOAD_LINK}

🚀 Getting Started:
1. Download the toolkit using the link above
2. Install the software on your computer  
3. Enter your license key when prompted
4. Start repairing computers like a pro!

Need help? Contact us at ${process.env.BUSINESS_EMAIL}

© 2024 RescuePC Repairs - Professional Computer Repair Solutions
`;
}

function generateWelcomeEmailHTML(customerName: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to RescuePC Repairs</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1e40af; color: white; padding: 20px; border-radius: 8px; text-align: center; }
    .content { background: #f8fafc; padding: 30px; border-radius: 8px; margin: 20px 0; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🛠️ Welcome to RescuePC Repairs!</h1>
  </div>
  
  <div class="content">
    <h2>Hello ${customerName}!</h2>
    <p>Thank you for choosing RescuePC Repairs for your computer repair needs.</p>
    <p>We're here to help you with professional-grade repair tools and support.</p>
  </div>
  
  <div class="footer">
    <p>Contact us: <strong>${process.env.BUSINESS_EMAIL}</strong></p>
    <p>© 2024 RescuePC Repairs</p>
  </div>
</body>
</html>`;
}

function generateWelcomeEmailText(customerName: string): string {
  return `
🛠️ Welcome to RescuePC Repairs!

Hello ${customerName}!

Thank you for choosing RescuePC Repairs for your computer repair needs.
We're here to help you with professional-grade repair tools and support.

Contact us: ${process.env.BUSINESS_EMAIL}
© 2024 RescuePC Repairs
`;
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text?: string,
  from?: string,
  replyTo?: string
): Promise<void> {
  try {
    const emailOptions = {
      from: from || `"RescuePC Repairs" <${process.env.SUPPORT_EMAIL}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
      replyTo: replyTo || process.env.BUSINESS_EMAIL
    };

    const result = await emailTransporter.sendMail(emailOptions);

    // Log success (but don't log sensitive data)
    if (process.env.NODE_ENV !== 'production') {
      console.log(`✅ Email sent to ${to}: ${subject}`);
    }

    // Do not return result, just end the function
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw new Error('Failed to send email');
  }
}

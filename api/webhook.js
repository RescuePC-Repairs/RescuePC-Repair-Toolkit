// Free Vercel Webhook Handler for RescuePC Repairs
// 100% free - no monthly costs

const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Free Gmail SMTP configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // your-email@gmail.com
    pass: process.env.GMAIL_APP_PASSWORD // Gmail app password
  }
});

// Generate unique license key
function generateLicenseKey(customerEmail) {
  const timestamp = Date.now();
  const emailHash = crypto.createHash('sha256').update(customerEmail).digest('hex').substring(0, 8);
  return `RESCUE-${emailHash}-${timestamp}`;
}

// Package configuration (your existing packages)
const packages = {
  'https://buy.stripe.com/5kQfZggMacypcSl9wP08g05': {
    name: 'Basic License',
    price: 49.99,
    licenseType: 'yearly',
    licenseQuantity: 1,
    features: ['Single PC repair toolkit', 'Basic driver database', 'Standard support']
  },
  'https://buy.stripe.com/00wcN4dzY0PHaKdfVd08g04': {
    name: 'Professional License',
    price: 199.99,
    licenseType: 'yearly',
    licenseQuantity: 5,
    features: ['5 PC repair toolkits', 'Complete driver database', 'Priority support']
  },
  'https://buy.stripe.com/4gM8wO53s1TLaKd9wP08g02': {
    name: 'Enterprise License',
    price: 499.99,
    licenseType: 'yearly',
    licenseQuantity: 25,
    features: ['25 PC repair toolkits', 'Complete driver database', 'Enterprise support']
  },
  'https://buy.stripe.com/9B64gy1Rgcyp19DdN508g03': {
    name: 'Government License',
    price: 999.99,
    licenseType: 'yearly',
    licenseQuantity: 100,
    features: ['100 PC repair toolkits', 'Complete driver database', 'Government support']
  },
  'https://buy.stripe.com/eVq3cu0Nc8i97y1aAT08g01': {
    name: 'Lifetime Enterprise',
    price: 499.99,
    licenseType: 'lifetime',
    licenseQuantity: 'unlimited',
    features: ['Unlimited PC repair toolkits', 'Complete driver database', 'Lifetime support']
  }
};

// Generate multiple license keys for multi-license packages
function generateLicenseKeys(customerEmail, quantity) {
  if (quantity === 'unlimited') {
    return [generateLicenseKey(customerEmail)]; // Single key for unlimited
  }
  
  const keys = [];
  for (let i = 0; i < quantity; i++) {
    keys.push(generateLicenseKey(customerEmail + i)); // Unique key for each license
  }
  return keys;
}

// Send email with all license keys
async function sendWelcomeEmail(customerEmail, customerName, packageInfo, licenseKeys) {
  const licenseKeysList = licenseKeys.map((key, index) => 
    `${index + 1}. ${key}`
  ).join('\n');

  const emailBody = `
Dear ${customerName},

Thank you for purchasing ${packageInfo.name}!

Your ${packageInfo.licenseType} license is now active and ready to use.

LICENSE DETAILS:
- Product: ${packageInfo.name}
- License Type: ${packageInfo.licenseType}
- Price: $${packageInfo.price}
- Number of Licenses: ${packageInfo.licenseQuantity}
- Expires: ${packageInfo.licenseType === 'lifetime' ? 'Never' : '1 year from purchase'}

YOUR LICENSE KEYS:
${licenseKeysList}

FEATURES INCLUDED:
${packageInfo.features.map(feature => `- ${feature}`).join('\n')}

DOWNLOAD YOUR SOFTWARE:
Your complete RescuePC Repairs toolkit is ready for download from your pCloud account.

SECURITY & GUARANTEES:
✅ Virus-Free Software Guaranteed
✅ SSL Secured Download
✅ 256-bit Encryption
✅ Military-Grade Security
✅ 30-Day Money-Back Guarantee

INSTALLATION INSTRUCTIONS:
1. Download the software from your pCloud account
2. Run RescuePC_Repairs.exe
3. Enter your license key when prompted
4. Start repairing Windows PCs instantly!

SUPPORT:
Need help? Contact us at: support@rescuepcrepairs.com
Website: https://rescuepcrepairs.com

Thank you for choosing RescuePC Repairs!

Best regards,
Tyler Keesee
Founder, RescuePC Repairs
  `;

  const mailOptions = {
    from: 'support@rescuepcrepairs.com',
    to: customerEmail,
    subject: `Your ${packageInfo.name} License - RescuePC Repairs`,
    text: emailBody
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${customerEmail}`);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

// Main webhook handler
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const webhook = req.body;
    
    if (webhook.type === 'payment_intent.succeeded') {
      const paymentIntent = webhook.data.object;
      const amount = paymentIntent.amount / 100; // Convert from cents
      const customerEmail = paymentIntent.receipt_email;
      const customerName = paymentIntent.customer_details?.name || 'Customer';
      const paymentLink = paymentIntent.payment_link;

      console.log(`Payment received: $${amount} from ${customerEmail}`);

      // Find the package
      const packageInfo = packages[paymentLink] || Object.values(packages).find(p => p.price === amount);
      
      if (!packageInfo) {
        console.error(`No package found for payment: $${amount}`);
        return res.status(400).json({ error: 'Package not found' });
      }

      // Generate license keys
      const licenseKeys = generateLicenseKeys(customerEmail, packageInfo.licenseQuantity);
      
      // Send welcome email
      const emailSent = await sendWelcomeEmail(customerEmail, customerName, packageInfo, licenseKeys);

      // Save customer data (you can save to pCloud or just log it)
      const customerData = {
        customerName,
        customerEmail,
        licenseKeys,
        packageName: packageInfo.name,
        price: packageInfo.price,
        licenseType: packageInfo.licenseType,
        createdDate: new Date().toISOString(),
        status: 'active'
      };

      console.log('Customer data:', customerData);

      return res.status(200).json({ 
        success: true, 
        message: 'Payment processed successfully',
        emailSent,
        licenseKeys: licenseKeys.length
      });

    } else {
      console.log(`Unsupported webhook type: ${webhook.type}`);
      return res.status(200).json({ message: 'Webhook received' });
    }

  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 
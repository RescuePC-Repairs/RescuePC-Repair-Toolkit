export function getPurchaseEmailTemplate(
  customerName: string,
  licenses: string[],
  productName: string
) {
  return `Hi ${customerName},

Thank you for purchasing RescuePC Repairs ${productName}!

Here are your license key(s):
${licenses.join('\n')}

Download the toolkit here:
${process.env.REPAIR_TOOLKIT_DOWNLOAD_URL}

If you need any assistance, please contact us at:
${process.env.SUPPORT_EMAIL}

Best regards,
Tyler Keesee
CEO, RescuePC Repairs`;
}

export function getAffiliateInviteTemplate(influencerName: string) {
  return `Hi ${influencerName},

I'm Tyler Keesee, CEO of RescuePC Repairs — a next-gen cybersecurity + repair toolkit built for real-world reliability and peace of mind.

We're launching our Affiliate Partner Program, and I'd love to invite you to be part of it.

Why Join?
🚀 Earn commissions on every referral
🔒 Promote a brand built on security, performance & trust
💻 Help your audience protect and optimize their PCs
🎁 Early access to features, branding assets & special promos

Our toolkit is ideal for:
• Tech-savvy followers
• Gamers
• Remote workers
• Everyday users who just want a safer, faster machine

🔗 https://www.rescuepcrepairs.com/

I'd love to send over your custom affiliate link and assets if you're open to partnering up.

Let's build something powerful together.

Best,
Tyler Keesee
CEO, RescuePC Repairs
📧 ${process.env.BUSINESS_EMAIL}
🌐 https://www.rescuepcrepairs.com/`;
}

export function getAffiliateWelcomeTemplate(affiliateName: string, affiliateLink: string) {
  return `Hi ${affiliateName},

Welcome to the RescuePC Repairs Affiliate Program! 

Here's your unique affiliate link:
${affiliateLink}

Key Benefits:
• Earn commissions on every sale
• Real-time tracking and reporting
• Monthly payouts
• Marketing materials and support

Getting Started:
1. Share your unique link with your audience
2. Track your performance in the affiliate dashboard
3. Get paid monthly for all successful referrals

Need help? Reply to this email and I'll assist you personally.

Best regards,
Tyler Keesee
CEO, RescuePC Repairs
📧 ${process.env.BUSINESS_EMAIL}
🌐 https://www.rescuepcrepairs.com/`;
}

export const generateBasicLicenseEmail = (userData: UserData): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>RescuePC Repairs - Basic License</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        .license-key { background: #e5e7eb; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 16px; margin: 20px 0; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to RescuePC Repairs!</h1>
          <p>Your Basic License is Ready</p>
        </div>
        <div class="content">
          <h2>Hello ${userData.name},</h2>
          <p>Thank you for choosing RescuePC Repairs! Your Basic License has been successfully activated and is ready for use.</p>
          
          <h3>📋 License Details:</h3>
          <ul>
            <li><strong>License Type:</strong> Basic License</li>
            <li><strong>Validity:</strong> 1 Year</li>
            <li><strong>Max Devices:</strong> 5 computers</li>
            <li><strong>Support:</strong> Email support included</li>
          </ul>

          <h3>🔑 Your License Key:</h3>
          <div class="license-key">${userData.licenseKey}</div>

          <h3>📥 Download Instructions:</h3>
          <ol>
            <li>Click the download button below</li>
            <li>Extract the ZIP file to your desktop</li>
            <li>Run the installer as Administrator</li>
            <li>Enter your license key when prompted</li>
          </ol>

          <a href="***REMOVED***" class="button">Download RescuePC Toolkit</a>

          <h3>🛠️ What's Included:</h3>
          <ul>
            <li>Complete driver database (11GB)</li>
            <li>Multi-platform support (Windows, Linux, macOS)</li>
            <li>One-click driver installation</li>
            <li>System optimization tools</li>
            <li>Security scanning features</li>
          </ul>

          <h3>📞 Need Help?</h3>
          <p>Our support team is here to help you get the most out of your RescuePC Toolkit:</p>
          <ul>
            <li>📧 Email: support@rescuepcrepairs.com</li>
            <li>🌐 Website: https://www.rescuepcrepairs.com/</li>
            <li>📱 Response Time: Within 24 hours</li>
          </ul>

          <p><strong>Thank you for trusting RescuePC Repairs with your computer maintenance needs!</strong></p>
        </div>
        <div class="footer">
          <p>© 2025 RescuePC Repairs. All rights reserved.</p>
          <p>🌐 https://www.rescuepcrepairs.com/</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateProfessionalLicenseEmail = (userData: UserData): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>RescuePC Repairs - Professional License</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #7c3aed, #5b21b6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        .license-key { background: #e5e7eb; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 16px; margin: 20px 0; text-align: center; }
        .premium-feature { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 Welcome to RescuePC Repairs Professional!</h1>
          <p>Your Professional License is Ready</p>
        </div>
        <div class="content">
          <h2>Hello ${userData.name},</h2>
          <p>Congratulations on upgrading to RescuePC Repairs Professional! You now have access to our most advanced features and priority support.</p>
          
          <h3>📋 License Details:</h3>
          <ul>
            <li><strong>License Type:</strong> Professional License</li>
            <li><strong>Validity:</strong> 2 Years</li>
            <li><strong>Max Devices:</strong> 25 computers</li>
            <li><strong>Support:</strong> Priority email & phone support</li>
          </ul>

          <h3>🔑 Your License Key:</h3>
          <div class="license-key">${userData.licenseKey}</div>

          <h3>⭐ Professional Features:</h3>
          <div class="premium-feature">
            <strong>🎯 Advanced Driver Management:</strong> AI-powered driver recommendations and automatic updates
          </div>
          <div class="premium-feature">
            <strong>🔒 Enhanced Security:</strong> Real-time threat detection and malware removal
          </div>
          <div class="premium-feature">
            <strong>⚡ Performance Optimization:</strong> Advanced system tuning and optimization tools
          </div>
          <div class="premium-feature">
            <strong>📊 Analytics Dashboard:</strong> Detailed system health reports and performance metrics
          </div>
          <div class="premium-feature">
            <strong>🔄 Automated Maintenance:</strong> Scheduled system maintenance and updates
          </div>

          <a href="***REMOVED***" class="button">Download Professional Toolkit</a>

          <h3>📞 Priority Support:</h3>
          <p>As a Professional user, you receive:</p>
          <ul>
            <li>📧 Priority email support (4-hour response)</li>
            <li>📱 Phone support during business hours</li>
            <li>🎯 Dedicated support specialist</li>
            <li>📚 Exclusive training resources</li>
          </ul>

          <p><strong>Thank you for choosing RescuePC Repairs Professional!</strong></p>
        </div>
        <div class="footer">
          <p>© 2025 RescuePC Repairs. All rights reserved.</p>
          <p>🌐 https://www.rescuepcrepairs.com/</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

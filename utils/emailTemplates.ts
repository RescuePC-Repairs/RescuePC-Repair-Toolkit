type UserData = {
  name: string;
  licenseKey: string;
  // Add any other fields used in the templates
};

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

export function generateBasicLicenseEmail(customerData: any): string {
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
            
            <p><strong>Dear ${customerData.name},</strong></p>
            
            <p>Thank you for purchasing <strong>${customerData.package}</strong>! Your payment of <strong>$${customerData.amount}</strong> has been processed successfully.</p>
            
            <div style="background: #fff; border: 2px solid #28a745; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <h3 style="color: #28a745; margin-top: 0;">🔑 Your License Keys:</h3>
                
                ${customerData.licenses.map((license: string, index: number) => `
                    <div style="background: #f8f9fa; padding: 10px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #28a745;">
                        <strong>License ${index + 1}:</strong> <code style="background: #e9ecef; padding: 3px 6px; border-radius: 3px; font-family: monospace;">${license}</code>
                    </div>
                `).join('')}
            </div>
            
            <div style="background: #fff; border: 2px solid #dc2626; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <h3 style="color: #dc2626; margin-top: 0;">⚠️ SECURE DOWNLOAD LINK</h3>
                <p style="margin-bottom: 15px;">Your exclusive download link:</p>
                <p style="background: #f3f4f6; padding: 10px; border-radius: 5px; font-family: monospace; word-break: break-all; margin: 15px 0;">
                    <a href="https://u.pcloud.link/publink/show?code=XZE6yu5ZTCRwbBmyaX7WmMTJeriiNRbHkz0V" style="color: #dc2626; font-weight: bold;">
                        https://u.pcloud.link/publink/show?code=XZE6yu5ZTCRwbBmyaX7WmMTJeriiNRbHkz0V
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

export function generateUnlimitedLicenseEmail(customerData: any): string {
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
            
            <p><strong>Dear ${customerData.name},</strong></p>
            
            <p>Thank you for purchasing <strong>${customerData.package}</strong>! Your payment of <strong>$${customerData.amount}</strong> has been processed successfully.</p>
            
            <div style="background: #fff; border: 2px solid #28a745; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <h3 style="color: #28a745; margin-top: 0;">🔑 Your License Keys:</h3>
                
                ${customerData.licenses.map((license: string, index: number) => `
                    <div style="background: #f8f9fa; padding: 10px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #28a745;">
                        <strong>License ${index + 1}:</strong> <code style="background: #e9ecef; padding: 3px 6px; border-radius: 3px; font-family: monospace;">${license}</code>
                    </div>
                `).join('')}
            </div>
            
            <div style="background: #fff; border: 2px solid #dc2626; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <h3 style="color: #dc2626; margin-top: 0;">⚠️ SECURE DOWNLOAD LINK</h3>
                <p style="margin-bottom: 15px;">Your exclusive download link:</p>
                <p style="background: #f3f4f6; padding: 10px; border-radius: 5px; font-family: monospace; word-break: break-all; margin: 15px 0;">
                    <a href="https://u.pcloud.link/publink/show?code=XZE6yu5ZTCRwbBmyaX7WmMTJeriiNRbHkz0V" style="color: #dc2626; font-weight: bold;">
                        https://u.pcloud.link/publink/show?code=XZE6yu5ZTCRwbBmyaX7WmMTJeriiNRbHkz0V
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

export function generateAdminNotification(customerData: any): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 25px; text-align: center; color: white; border-radius: 10px;">
            <h1 style="margin: 0; font-size: 24px;">🎉 FORTUNE 500 AUTOMATED SALE COMPLETED!</h1>
            <p style="margin: 10px 0 0 0; font-size: 14px;">Fortune 500 Automation System</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 25px; border: 2px solid #28a745; border-radius: 0 0 10px 10px;">
            <h2 style="color: #28a745; margin-top: 0;">💰 CUSTOMER DETAILS:</h2>
            <ul style="background: white; padding: 20px; border-radius: 5px; list-style: none; margin: 0;">
                <li><strong>👤 Name:</strong> ${customerData.name}</li>
                <li><strong>📧 Email:</strong> ${customerData.email}</li>
                <li><strong>📦 Package:</strong> ${customerData.package}</li>
                <li><strong>💵 Amount:</strong> $${customerData.amount}</li>
                <li><strong>🔑 Licenses Generated:</strong> ${customerData.licenses.length}</li>
                <li><strong>⏰ Time:</strong> ${new Date().toISOString()}</li>
            </ul>
            
            <h3 style="color: #007bff; margin-top: 25px;">🔑 LICENSE KEYS DELIVERED:</h3>
            <div style="background: white; padding: 15px; border-radius: 5px; font-family: monospace; font-size: 12px;">
                ${customerData.licenses.map((license: string, index: number) => `${index + 1}. ${license}`).join('<br>')}
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
                <h3 style="margin: 0;">💰 REVENUE GENERATED: $${customerData.amount}</h3>
                <p style="margin: 10px 0 0 0;">🏦 Your automated empire just made you money!</p>
            </div>
        </div>
    </div>
  `;
}

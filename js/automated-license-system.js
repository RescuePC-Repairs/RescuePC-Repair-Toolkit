/**
 * RESCUEPC REPAIRS - AUTOMATED LICENSE DISTRIBUTION SYSTEM
 * Complete automation for license generation, distribution, and management
 * Integrates with Stripe webhooks for seamless payment processing
 * Configured for RescuePC Repairs - Complete PC Repair Toolkit
 */

class AutomatedLicenseSystem {
    constructor() {
        // RescuePC Repairs specific configuration
        this.rescuePCConfig = {
            domain: "https://www.rescuepcrepairs.com/",
            productName: "RescuePC Repairs - Complete PC Repair Toolkit",
            price: 79.99,
            licenseType: "lifetime",
            softwareSize: "13.3GB",
            driverDatabase: "11GB",
            features: [
                "11GB Driver Database",
                "Network Recovery Tools",
                "Audio Restoration System",
                "Windows Error Repair",
                "Malware Scanner & Remover",
                "Portable USB Operation"
            ],
            downloadLinks: {
                mainSoftware: "https://download.rescuepcrepairs.com/RescuePC_Repairs.exe",
                driverPack: "https://download.rescuepcrepairs.com/Driver_Pack.exe",
                userManual: "https://download.rescuepcrepairs.com/User_Manual.pdf",
                flyer: "https://download.rescuepcrepairs.com/RescuePC_Flyer.pdf"
            },
            emailTemplates: {
                welcomeSubject: "Your RescuePC Repairs License - Complete PC Repair Toolkit",
                downloadSubject: "Download Your RescuePC Repairs Software",
                fromEmail: "support@rescuepcrepairs.com"
            },
            security: {
                sslEnabled: true,
                encryption: "256-bit",
                virusFreeGuarantee: true,
                militaryGradeSecurity: true
            }
        };

        // Legacy license types (for backward compatibility)
        this.licenseTypes = {
            'basic': {
                price: 49.99,
                maxDevices: 1,
                features: ['system_health', 'basic_repairs', 'standard_support'],
                duration: '1 year',
                package: 'single_license'
            },
            'professional': {
                price: 199.99,
                maxDevices: 3,
                features: ['system_health', 'basic_repairs', 'driver_management', 'advanced_repairs', 'priority_support'],
                duration: '1 year',
                package: 'multi_device'
            },
            'enterprise': {
                price: 499.99,
                maxDevices: 25,
                features: ['system_health', 'basic_repairs', 'driver_management', 'advanced_repairs', 'military_security', 'compliance_tools', 'white_label'],
                duration: '1 year',
                package: 'volume_licensing'
            },
            'government': {
                price: 999.99,
                maxDevices: 999999, // Unlimited
                features: ['system_health', 'basic_repairs', 'driver_management', 'advanced_repairs', 'military_security', 'compliance_tools', 'white_label', 'government_compliance', 'custom_integration'],
                duration: '1 year',
                package: 'government_package'
            },
            'lifetime': {
                price: 79.99, // Updated to match RescuePC pricing
                maxDevices: 5,
                features: this.rescuePCConfig.features,
                duration: '100 years',
                package: 'lifetime_package'
            }
        };
        
        this.webhookSecret = 'whsec_your_webhook_secret_here'; // Replace with your Stripe webhook secret
        this.stripePublicKey = 'pk_live_51Q71CbBMfxBc7Ib0syDcAnmpHW7CDR5EjpTDbTli119veC9Mp8KVlhXFbUcgij8HqsUFn8VuSZHUs83FB8A5Duj500tdvzFxUk';
        this.webhookEndpoint = 'https://www.rescuepcrepairs.com/webhook';
        
        this.initialize();
    }

    /**
     * Initialize the automated system
     */
    async initialize() {
        try {
            // Set up webhook endpoint
            this.setupWebhookEndpoint();
            
            // Initialize license manager
            if (window.rescuePCLicenseManager) {
                console.log('✅ Automated License System initialized successfully');
            } else {
                console.error('❌ License Manager not found');
            }
        } catch (error) {
            console.error('❌ Automated License System initialization failed:', error);
        }
    }

    /**
     * Set up webhook endpoint for Stripe payments
     */
    setupWebhookEndpoint() {
        console.log('🔗 Webhook endpoint configured for RescuePC Repairs');
        console.log(`🌐 Webhook URL: ${this.webhookEndpoint}`);
        console.log(`💰 Expected payment amount: $${this.rescuePCConfig.price}`);
    }

    /**
     * Process Stripe webhook payment for RescuePC Repairs
     */
    async processStripePayment(paymentData) {
        try {
            console.log('💰 Processing RescuePC Repairs payment:', paymentData);
            
            // Extract payment information
            const amount = paymentData.amount / 100; // Convert from cents
            const customerEmail = paymentData.customer_email;
            const customerName = paymentData.customer_name || 'Customer';
            const paymentId = paymentData.payment_intent_id;
            
            // Verify this is a RescuePC Repairs payment
            if (Math.abs(amount - this.rescuePCConfig.price) < 0.01) {
                console.log('✅ Valid RescuePC Repairs payment detected!');
                
                // Generate RescuePC Repairs license
                const licenseData = await this.generateRescuePCLicense(customerName, customerEmail, {
                    amount: amount,
                    paymentId: paymentId
                });
                
                // Create distribution package
                const distributionPackage = this.createRescuePCDistributionPackage(licenseData);
                
                // Send RescuePC Repairs welcome email
                await this.sendRescuePCWelcomeEmail(licenseData, distributionPackage);
                
                // Update database
                await this.updateRescuePCDatabase(licenseData);
                
                console.log('✅ RescuePC Repairs license distributed successfully!');
                return licenseData;
            } else {
                // Fallback to legacy license type detection
                const licenseType = this.determineLicenseType(amount);
                
                if (!licenseType) {
                    throw new Error(`Invalid payment amount: $${amount}`);
                }
                
                // Generate license data
                const licenseData = await this.generateLicense(licenseType, {
                    name: customerName,
                    email: customerEmail
                }, {
                    amount: amount,
                    paymentId: paymentId
                });
                
                // Create distribution package
                const distributionPackage = this.createDistributionPackage(licenseType, licenseData);
                
                // Send automated email
                await this.sendLicenseEmail(licenseType, licenseData, distributionPackage);
                
                // Update database
                await this.updateDatabase(licenseData);
                
                console.log('✅ Payment processed successfully:', licenseData.licenseKey);
                return licenseData;
            }
            
        } catch (error) {
            console.error('❌ Payment processing failed:', error);
            throw error;
        }
    }

    /**
     * Generate RescuePC Repairs specific license
     */
    async generateRescuePCLicense(customerName, customerEmail, paymentInfo) {
        console.log('🔑 Generating RescuePC Repairs lifetime license...');
        
        // Generate unique license key
        const timestamp = Date.now();
        const emailHash = this.hashString(customerEmail).substring(0, 8);
        const licenseKey = `RESCUE-${emailHash}-${timestamp.toString(36).toUpperCase()}`;
        
        // Create license data
        const licenseData = {
            licenseKey: licenseKey,
            customerInfo: {
                name: customerName,
                email: customerEmail
            },
            paymentInfo: paymentInfo,
            licenseInfo: {
                issuedDate: new Date().toISOString(),
                expirationDate: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString(), // 100 years
                maxDevices: 5,
                usedDevices: 0,
                isActive: true
            },
            productInfo: {
                name: this.rescuePCConfig.productName,
                type: "lifetime",
                price: this.rescuePCConfig.price,
                softwareSize: this.rescuePCConfig.softwareSize,
                driverDatabase: this.rescuePCConfig.driverDatabase
            },
            features: this.rescuePCConfig.features,
            downloadLinks: this.rescuePCConfig.downloadLinks,
            security: this.rescuePCConfig.security
        };
        
        console.log('✅ RescuePC Repairs license generated:', licenseKey);
        return licenseData;
    }

    /**
     * Create RescuePC Repairs distribution package
     */
    createRescuePCDistributionPackage(licenseData) {
        return {
            downloads: [
                'RescuePC_Repairs.exe (13.3GB)',
                'Driver_Pack.exe (11GB)',
                'User_Manual.pdf',
                'RescuePC_Flyer.pdf'
            ],
            instructions: 'Download and run RescuePC_Repairs.exe, enter your license key when prompted',
            support: 'Lifetime priority support with all features',
            features: this.rescuePCConfig.features,
            security: this.rescuePCConfig.security
        };
    }

    /**
     * Send RescuePC Repairs welcome email
     */
    async sendRescuePCWelcomeEmail(licenseData, distributionPackage) {
        const emailTemplate = this.generateRescuePCEmailTemplate(licenseData, distributionPackage);
        
        console.log('📧 Sending RescuePC Repairs welcome email to:', licenseData.customerInfo.email);
        console.log('📧 Email template:', emailTemplate);
        
        // For demo purposes, show the email content
        this.showEmailPreview(emailTemplate);
        
        return true;
    }

    /**
     * Generate RescuePC Repairs email template
     */
    generateRescuePCEmailTemplate(licenseData, distributionPackage) {
        return {
            subject: this.rescuePCConfig.emailTemplates.welcomeSubject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>🎉 Welcome to RescuePC Repairs!</h2>
                    <p>Dear ${licenseData.customerInfo.name},</p>
                    <p>Thank you for purchasing <strong>${licenseData.productInfo.name}</strong>!</p>
                    <p>Your lifetime license is now active and ready to use.</p>
                    
                    <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>📋 Your License Details</h3>
                        <p><strong>License Key:</strong> <code style="background: #333; color: #fff; padding: 5px; border-radius: 3px;">${licenseData.licenseKey}</code></p>
                        <p><strong>Product:</strong> ${licenseData.productInfo.name}</p>
                        <p><strong>License Type:</strong> Lifetime (Use Forever)</p>
                        <p><strong>Price:</strong> $${licenseData.productInfo.price}</p>
                        <p><strong>Software Size:</strong> ${licenseData.productInfo.softwareSize}</p>
                        <p><strong>Driver Database:</strong> ${licenseData.productInfo.driverDatabase}</p>
                    </div>
                    
                    <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>🚀 Download Your Software</h3>
                        <p><strong>Your complete RescuePC Repairs toolkit is ready for download:</strong></p>
                        <ul>
                            <li><strong>Main Software (${licenseData.productInfo.softwareSize}):</strong><br>
                                <a href="${this.rescuePCConfig.downloadLinks.mainSoftware}" style="color: #007bff;">${this.rescuePCConfig.downloadLinks.mainSoftware}</a></li>
                            <li><strong>Driver Pack (${licenseData.productInfo.driverDatabase}):</strong><br>
                                <a href="${this.rescuePCConfig.downloadLinks.driverPack}" style="color: #007bff;">${this.rescuePCConfig.downloadLinks.driverPack}</a></li>
                            <li><strong>User Manual:</strong><br>
                                <a href="${this.rescuePCConfig.downloadLinks.userManual}" style="color: #007bff;">${this.rescuePCConfig.downloadLinks.userManual}</a></li>
                            <li><strong>RescuePC Repairs Flyer:</strong><br>
                                <a href="${this.rescuePCConfig.downloadLinks.flyer}" style="color: #007bff;">${this.rescuePCConfig.downloadLinks.flyer}</a></li>
                        </ul>
                    </div>
                    
                    <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>🔧 Features Included</h3>
                        <ul>
                            ${this.rescuePCConfig.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>🔒 Security & Guarantees</h3>
                        <ul>
                            <li>✅ Virus-Free Software Guaranteed</li>
                            <li>✅ SSL Secured Download</li>
                            <li>✅ ${this.rescuePCConfig.security.encryption} Encryption</li>
                            <li>✅ Military-Grade Security</li>
                            <li>✅ 30-Day Money-Back Guarantee</li>
                        </ul>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>📋 Installation Instructions</h3>
                        <ol>
                            <li>Download the main software file</li>
                            <li>Run RescuePC_Repairs.exe</li>
                            <li>Enter your license key when prompted</li>
                            <li>Start repairing Windows PCs instantly!</li>
                        </ol>
                    </div>
                    
                    <div style="background: #e2e3e5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>📞 Support</h3>
                        <p><strong>Need help?</strong> Contact us at: ${this.rescuePCConfig.emailTemplates.fromEmail}</p>
                        <p><strong>Website:</strong> <a href="${this.rescuePCConfig.domain}" style="color: #007bff;">${this.rescuePCConfig.domain}</a></p>
                    </div>
                    
                    <p>Thank you for choosing RescuePC Repairs!</p>
                    <p>Best regards,<br>Tyler Keesee<br>Founder, RescuePC Repairs</p>
                </div>
            `
        };
    }

    /**
     * Update RescuePC customer database
     */
    async updateRescuePCDatabase(licenseData) {
        console.log('💾 Updating RescuePC customer database...');
        
        // Store in localStorage for demo purposes
        const customers = JSON.parse(localStorage.getItem('rescuepc_customers') || '[]');
        const customerData = {
            customerName: licenseData.customerInfo.name,
            customerEmail: licenseData.customerInfo.email,
            licenseKey: licenseData.licenseKey,
            productName: licenseData.productInfo.name,
            price: licenseData.productInfo.price,
            licenseType: "lifetime",
            createdDate: licenseData.licenseInfo.issuedDate,
            status: "active",
            website: this.rescuePCConfig.domain,
            features: this.rescuePCConfig.features,
            softwareSize: licenseData.productInfo.softwareSize,
            driverDatabase: licenseData.productInfo.driverDatabase
        };
        
        customers.push(customerData);
        localStorage.setItem('rescuepc_customers', JSON.stringify(customers));
        
        console.log('✅ RescuePC customer database updated');
        return true;
    }

    /**
     * Determine license type based on payment amount (legacy support)
     */
    determineLicenseType(amount) {
        for (const [type, config] of Object.entries(this.licenseTypes)) {
            if (Math.abs(amount - config.price) < 0.01) {
                return type;
            }
        }
        return null;
    }

    /**
     * Generate license for specific type (legacy support)
     */
    async generateLicense(licenseType, customerInfo, paymentInfo) {
        const config = this.licenseTypes[licenseType];
        
        if (!config) {
            throw new Error(`Invalid license type: ${licenseType}`);
        }
        
        // Use the existing license manager to generate license
        if (window.rescuePCLicenseManager) {
            return window.rescuePCLicenseManager.createLicenseData(licenseType, customerInfo, paymentInfo);
        } else {
            // Fallback license generation
            return this.generateFallbackLicense(licenseType, customerInfo, paymentInfo);
        }
    }

    /**
     * Fallback license generation if license manager is not available
     */
    generateFallbackLicense(licenseType, customerInfo, paymentInfo) {
        const config = this.licenseTypes[licenseType];
        const now = new Date();
        const expirationDate = new Date(now);
        
        // Set expiration based on license type
        if (licenseType === 'lifetime') {
            expirationDate.setFullYear(expirationDate.getFullYear() + 100);
        } else {
            expirationDate.setFullYear(expirationDate.getFullYear() + 1);
        }
        
        return {
            licenseKey: this.generateLicenseKey(licenseType, customerInfo),
            tier: licenseType,
            customerInfo: customerInfo,
            paymentInfo: paymentInfo,
            licenseInfo: {
                issuedDate: now.toISOString(),
                expirationDate: expirationDate.toISOString(),
                maxDevices: config.maxDevices,
                usedDevices: 0,
                isActive: true
            },
            features: config.features,
            package: config.package
        };
    }

    /**
     * Generate license key
     */
    generateLicenseKey(licenseType, customerInfo) {
        const tierPrefixes = {
            'basic': 'RPC-BAS',
            'professional': 'RPC-PRO',
            'enterprise': 'RPC-ENT',
            'government': 'RPC-GOV',
            'lifetime': 'RPC-LIF'
        };
        
        const prefix = tierPrefixes[licenseType] || 'RPC-UNK';
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        const customerHash = this.hashString(customerInfo.email).substring(0, 4);
        
        return `${prefix}-${timestamp}-${random}-${customerHash}`.toUpperCase();
    }

    /**
     * Hash string for license key generation
     */
    hashString(str) {
        // Simple hash function (in production, use crypto.subtle.digest)
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16);
    }

    /**
     * Create distribution package based on license type (legacy support)
     */
    createDistributionPackage(licenseType, licenseData) {
        const config = this.licenseTypes[licenseType];
        
        const packages = {
            'single_license': {
                downloads: ['rescuepc_repairs_basic.exe'],
                instructions: 'Single device installation',
                support: 'Email support (24-48 hour response)'
            },
            'multi_device': {
                downloads: ['rescuepc_repairs_pro.exe', 'license_manager.exe'],
                instructions: 'Multi-device installation with license manager',
                support: 'Priority email support (12-24 hour response)'
            },
            'volume_licensing': {
                downloads: ['rescuepc_repairs_enterprise.exe', 'volume_license_manager.exe', 'compliance_tools.exe'],
                instructions: 'Enterprise deployment with volume licensing',
                support: 'Priority support with phone option (4-8 hour response)'
            },
            'government_package': {
                downloads: ['rescuepc_repairs_government.exe', 'government_compliance_tools.exe', 'custom_integration_sdk.exe'],
                instructions: 'Government deployment with compliance tools',
                support: 'Dedicated support with custom integration assistance'
            },
            'lifetime_package': {
                downloads: ['rescuepc_repairs_lifetime.exe', 'lifetime_updates.exe', 'all_tools_package.exe'],
                instructions: 'Lifetime installation with all features',
                support: 'Lifetime priority support with all features'
            }
        };
        
        return packages[config.package] || packages.single_license;
    }

    /**
     * Send automated license email (legacy support)
     */
    async sendLicenseEmail(licenseType, licenseData, distributionPackage) {
        const config = this.licenseTypes[licenseType];
        
        const emailTemplate = this.generateEmailTemplate(licenseType, licenseData, distributionPackage);
        
        // In production, this would send via your email service
        console.log('📧 Sending license email to:', licenseData.customerInfo.email);
        console.log('📧 Email template:', emailTemplate);
        
        // For demo purposes, show the email content
        this.showEmailPreview(emailTemplate);
        
        return true;
    }

    /**
     * Generate email template based on license type (legacy support)
     */
    generateEmailTemplate(licenseType, licenseData, distributionPackage) {
        const config = this.licenseTypes[licenseType];
        
        return {
            subject: `Your RescuePC Repairs ${licenseType.toUpperCase()} License - Download Instructions`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>🎉 Welcome to RescuePC Repairs!</h2>
                    <p>Dear ${licenseData.customerInfo.name},</p>
                    <p>Thank you for purchasing the <strong>${licenseType.toUpperCase()} License</strong> of RescuePC Repairs!</p>
                    
                    <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>📋 Your License Details</h3>
                        <p><strong>License Key:</strong> <code style="background: #333; color: #fff; padding: 5px; border-radius: 3px;">${licenseData.licenseKey}</code></p>
                        <p><strong>License Type:</strong> ${licenseType.toUpperCase()}</p>
                        <p><strong>Max Devices:</strong> ${config.maxDevices === 999999 ? 'Unlimited' : config.maxDevices}</p>
                        <p><strong>Duration:</strong> ${config.duration}</p>
                        <p><strong>Expires:</strong> ${new Date(licenseData.licenseInfo.expirationDate).toLocaleDateString()}</p>
                    </div>
                    
                    <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>🚀 Download Your Software</h3>
                        <p><strong>Downloads Included:</strong></p>
                        <ul>
                            ${distributionPackage.downloads.map(download => `<li>${download}</li>`).join('')}
                        </ul>
                        <p><strong>Installation Instructions:</strong> ${distributionPackage.instructions}</p>
                    </div>
                    
                    <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>🔧 Features Included</h3>
                        <ul>
                            ${config.features.map(feature => `<li>${this.formatFeatureName(feature)}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>📞 Support Information</h3>
                        <p><strong>Support Level:</strong> ${distributionPackage.support}</p>
                        <p><strong>Email:</strong> ***REMOVED***</p>
                        <p><strong>Response Time:</strong> ${this.getResponseTime(licenseType)}</p>
                    </div>
                    
                    <p>Thank you for choosing RescuePC Repairs!</p>
                    <p>Best regards,<br>Tyler Keesee<br>RescuePC Repairs</p>
                </div>
            `
        };
    }

    /**
     * Format feature names for display
     */
    formatFeatureName(feature) {
        const featureNames = {
            'system_health': 'System Health Check',
            'basic_repairs': 'Basic Repairs & Optimization',
            'driver_management': 'Driver Management',
            'advanced_repairs': 'Advanced Repair Tools',
            'military_security': 'Military-Grade Security',
            'compliance_tools': 'Compliance Tools',
            'white_label': 'White-Label Options',
            'government_compliance': 'Government Compliance',
            'custom_integration': 'Custom Integration',
            'lifetime_updates': 'Lifetime Updates',
            'standard_support': 'Standard Support',
            'priority_support': 'Priority Support'
        };
        
        return featureNames[feature] || feature;
    }

    /**
     * Get response time based on license type
     */
    getResponseTime(licenseType) {
        const responseTimes = {
            'basic': '24-48 hours',
            'professional': '12-24 hours',
            'enterprise': '4-8 hours',
            'government': '2-4 hours',
            'lifetime': '2-4 hours'
        };
        
        return responseTimes[licenseType] || '24-48 hours';
    }

    /**
     * Show email preview (for demo purposes)
     */
    showEmailPreview(emailTemplate) {
        const modal = document.createElement('div');
        modal.className = 'email-preview-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>📧 License Email Preview</h3>
                    <button onclick="this.closest('.email-preview-modal').remove()" class="close-btn">×</button>
                </div>
                <div class="modal-body">
                    <div class="email-preview">
                        ${emailTemplate.html}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    /**
     * Update database with license information (legacy support)
     */
    async updateDatabase(licenseData) {
        // In production, this would update your database
        console.log('💾 Updating database with license:', licenseData.licenseKey);
        
        // Store in localStorage for demo purposes
        const licenses = JSON.parse(localStorage.getItem('rescuepc_licenses') || '[]');
        licenses.push({
            ...licenseData,
            created: new Date().toISOString()
        });
        localStorage.setItem('rescuepc_licenses', JSON.stringify(licenses));
        
        return true;
    }

    /**
     * Get license statistics
     */
    getLicenseStats() {
        const licenses = JSON.parse(localStorage.getItem('rescuepc_licenses') || '[]');
        const customers = JSON.parse(localStorage.getItem('rescuepc_customers') || '[]');
        
        const stats = {
            total: licenses.length + customers.length,
            byType: {},
            revenue: 0,
            active: 0,
            expired: 0
        };
        
        // Process legacy licenses
        licenses.forEach(license => {
            // Count by type
            stats.byType[license.tier] = (stats.byType[license.tier] || 0) + 1;
            
            // Calculate revenue
            stats.revenue += license.paymentInfo.amount;
            
            // Check expiration
            const expirationDate = new Date(license.licenseInfo.expirationDate);
            const now = new Date();
            
            if (expirationDate > now && license.licenseInfo.isActive) {
                stats.active++;
            } else {
                stats.expired++;
            }
        });
        
        // Process RescuePC customers
        customers.forEach(customer => {
            stats.byType['lifetime'] = (stats.byType['lifetime'] || 0) + 1;
            stats.revenue += customer.price;
            stats.active++;
        });
        
        return stats;
    }

    /**
     * Test the automated system
     */
    async testSystem() {
        console.log('🧪 Testing RescuePC Repairs automated license system...');
        
        const testPayments = [
            { amount: 79.99, customer_email: 'test@rescuepcrepairs.com', customer_name: 'Test Customer' }
        ];
        
        for (const payment of testPayments) {
            try {
                await this.processStripePayment(payment);
                console.log(`✅ Test payment processed: $${payment.amount}`);
            } catch (error) {
                console.error(`❌ Test payment failed: $${payment.amount}`, error);
            }
        }
        
        // Show statistics
        const stats = this.getLicenseStats();
        console.log('📊 License Statistics:', stats);
        
        return stats;
    }

    /**
     * Get RescuePC configuration
     */
    getRescuePCConfig() {
        return this.rescuePCConfig;
    }
}

// Global instance
window.automatedLicenseSystem = new AutomatedLicenseSystem();

// Utility functions
function testAutomatedSystem() {
    return window.automatedLicenseSystem.testSystem();
}

function getLicenseStats() {
    return window.automatedLicenseSystem.getLicenseStats();
}

function getRescuePCConfig() {
    return window.automatedLicenseSystem.getRescuePCConfig();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AutomatedLicenseSystem;
} 
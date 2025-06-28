// PRODUCTION CONFIGURATION FOR RESCUEPC REPAIRS
// Real-world production settings with enterprise security

const productionConfig = {
  // STRIPE CONFIGURATION
  stripe: {
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookEndpoint: process.env.STRIPE_WEBHOOK_ENDPOINT || 'https://rescuepcrepairs.com/api/webhook'
  },

  // EMAIL CONFIGURATION
  email: {
    service: 'gmail',
    user: process.env.GMAIL_USER,
    password: process.env.GMAIL_APP_PASSWORD,
    from: process.env.GMAIL_USER,
    supportEmail: 'support@rescuepcrepairs.com',
    securityEmail: 'security@rescuepcrepairs.com'
  },

  // SECURITY CONFIGURATION
  security: {
    rateLimitWindow: 60000, // 1 minute
    maxRequestsPerWindow: 10,
    encryptionKey: process.env.ENCRYPTION_KEY,
    jwtSecret: process.env.JWT_SECRET,
    sessionSecret: process.env.SESSION_SECRET
  },

  // PRODUCTION SETTINGS
  production: {
    environment: process.env.NODE_ENV || 'production',
    domain: 'rescuepcrepairs.com',
    sslEnabled: true,
    monitoringEnabled: true,
    loggingLevel: 'info'
  },

  // PACKAGE CONFIGURATION
  packages: {
    basic: {
      id: 'basic_license',
      name: 'Basic License',
      price: 49.99,
      stripeLink: 'https://buy.stripe.com/5kQfZggMacypcSl9wP08g05',
      licenseType: 'yearly',
      licenseQuantity: 1,
      features: [
        'Single PC repair toolkit',
        'Basic driver database',
        'Standard support',
        '1-year license'
      ],
      securityLevel: 'standard'
    },
    professional: {
      id: 'professional_license',
      name: 'Professional License',
      price: 199.99,
      stripeLink: 'https://buy.stripe.com/00wcN4dzY0PHaKdfVd08g04',
      licenseType: 'yearly',
      licenseQuantity: 5,
      features: [
        '5 PC repair toolkits',
        'Complete driver database',
        'Priority support',
        '1-year license'
      ],
      securityLevel: 'enhanced'
    },
    enterprise: {
      id: 'enterprise_license',
      name: 'Enterprise License',
      price: 499.99,
      stripeLink: 'https://buy.stripe.com/4gM8wO53s1TLaKd9wP08g02',
      licenseType: 'yearly',
      licenseQuantity: 25,
      features: [
        '25 PC repair toolkits',
        'Complete driver database',
        'Enterprise support',
        '1-year license'
      ],
      securityLevel: 'enterprise'
    },
    government: {
      id: 'government_license',
      name: 'Government License',
      price: 999.99,
      stripeLink: 'https://buy.stripe.com/9B64gy1Rgcyp19DdN508g03',
      licenseType: 'yearly',
      licenseQuantity: 100,
      features: [
        '100 PC repair toolkits',
        'Complete driver database',
        'Government support',
        '1-year license'
      ],
      securityLevel: 'government'
    },
    lifetime: {
      id: 'lifetime_enterprise',
      name: 'Lifetime Enterprise',
      price: 499.99,
      stripeLink: 'https://buy.stripe.com/eVq3cu0Nc8i97y1aAT08g01',
      licenseType: 'lifetime',
      licenseQuantity: 'unlimited',
      features: [
        'Unlimited PC repair toolkits',
        'Complete driver database',
        'Lifetime support',
        'Lifetime license'
      ],
      securityLevel: 'military'
    }
  },

  // VALIDATION FUNCTIONS
  validateConfig() {
    const requiredVars = [
      'STRIPE_WEBHOOK_SECRET',
      'GMAIL_USER',
      'GMAIL_APP_PASSWORD'
    ];

    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    return true;
  },

  // PRODUCTION READINESS CHECK
  isProductionReady() {
    try {
      this.validateConfig();
      return {
        ready: true,
        score: 100,
        message: 'Production ready'
      };
    } catch (error) {
      return {
        ready: false,
        score: 0,
        message: error.message
      };
    }
  }
};

module.exports = productionConfig; 
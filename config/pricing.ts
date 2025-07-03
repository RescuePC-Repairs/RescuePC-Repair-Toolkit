// RescuePC Repairs - Pricing Configuration
// Quantum-Secured Enterprise License Management

interface LicenseTier {
  name: string;
  price: number;
  interval: 'year' | 'once';
  pcLimit: number;
  features: string[];
  popular?: boolean;
  enterprise?: boolean;
  stripePaymentLink?: string;
}

interface PricingConfig {
  tiers: {
    [key: string]: LicenseTier;
  };
  stripeConfig: {
    publicKey: string;
    webhookSecret: string;
    priceIds: {
      [key: string]: string;
    };
  };
}

export const PRICING_CONFIG: PricingConfig = {
  tiers: {
    basic: {
      name: 'Basic License',
      price: 49.99,
      interval: 'year',
      pcLimit: 1,
      features: [
        'Single PC License',
        'Core Functionality',
        'Basic Support',
        '1 Year Updates',
        'Email Support'
      ]
    },
    professional: {
      name: 'Professional License',
      price: 199.99,
      interval: 'year',
      pcLimit: 5,
      popular: true,
      features: [
        '5 PC Licenses',
        'Advanced Features',
        'Priority Support',
        '1 Year Updates',
        'API Access',
        'Phone Support'
      ]
    },
    enterprise: {
      name: 'Enterprise License',
      price: 499.99,
      interval: 'year',
      pcLimit: 25,
      enterprise: true,
      features: [
        '25 PC Licenses',
        'All Features',
        'Dedicated Support',
        '5 Years Updates',
        'Custom Integration',
        'SLA Guarantee',
        '24/7 Support'
      ]
    },
    government: {
      name: 'Government License',
      price: 999.99,
      interval: 'year',
      pcLimit: 100,
      enterprise: true,
      features: [
        '100 PC Licenses',
        'All Enterprise Features',
        'Compliance Features',
        'Audit Logging',
        'Custom Deployment',
        'Dedicated Account Manager',
        'On-site Support Option'
      ]
    },
    lifetime_enterprise: {
      name: 'Lifetime Enterprise',
      price: 499.99,
      interval: 'once',
      pcLimit: -1, // Unlimited
      popular: true,
      enterprise: true,
      features: [
        'Unlimited PC Licenses',
        'Lifetime Updates',
        'All Enterprise Features',
        'Priority Development',
        'Custom Feature Requests',
        'White Label Option',
        'Source Code Access'
      ]
    }
  },
  stripeConfig: {
    publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
    priceIds: {
      basic: process.env.STRIPE_PRICE_ID_BASIC!,
      professional: process.env.STRIPE_PRICE_ID_PROFESSIONAL!,
      enterprise: process.env.STRIPE_PRICE_ID_ENTERPRISE!,
      government: process.env.STRIPE_PRICE_ID_GOVERNMENT!,
      lifetime_enterprise: process.env.STRIPE_PRICE_ID_LIFETIME!
    }
  }
};

// Stripe configuration with environment variables
export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  successUrl: `${process.env.NEXT_PUBLIC_DOMAIN}/success`,
  cancelUrl: `${process.env.NEXT_PUBLIC_DOMAIN}/pricing`
};

// Security configuration
export const SECURITY_CONFIG = {
  encryptionAlgorithm: 'AES-256-GCM',
  quantumResistant: true,
  tlsVersion: '1.3',
  certType: 'ECDSA-P256',
  hstsMaxAge: parseInt(process.env.HSTS_MAX_AGE || '31536000', 10), // 1 year
  cspNonce: process.env.NEXT_PUBLIC_CSP_NONCE === 'true'
};

// License validation utilities
export function getLicenseById(id: string): LicenseTier | undefined {
  return PRICING_CONFIG.tiers[id];
}

export function getPopularLicenses(): LicenseTier[] {
  return Object.values(PRICING_CONFIG.tiers).filter((tier) => tier.popular);
}

export function getEnterpriseLicenses(): LicenseTier[] {
  return Object.values(PRICING_CONFIG.tiers).filter((tier) => tier.enterprise);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

export function getPackageByPaymentLink(paymentLink: string): LicenseTier | undefined {
  return Object.values(PRICING_CONFIG.tiers).find((tier) => tier.stripePaymentLink === paymentLink);
}

export function getPackageByPrice(price: number): LicenseTier | undefined {
  return Object.values(PRICING_CONFIG.tiers).find((tier) => tier.price === price);
}

import React from 'react';

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';

// PAYMENT CONFIGURATION - TEST PAGE
interface PaymentPackage {
  name: string;
  price: number;
  licenses: number | string;
  stripePriceId: string;
  stripePaymentLink: string;
  features: string[];
  description: string;
  popular?: boolean;
  enterprise?: boolean;
}

const PAYMENT_PACKAGES: Record<string, PaymentPackage> = {
  basic: {
    name: 'Basic License',
    price: 49.99,
    licenses: 1,
    stripePriceId: 'price_basic_license',
    stripePaymentLink: 'https://buy.stripe.com/5kQfZggMacypcSl9wP08g05',
    features: ['Single PC Repair', 'Basic Support', '1 Year Updates', 'Email Support'],
    description: 'Perfect for individual users'
  },
  professional: {
    name: 'Professional License',
    price: 199.99,
    licenses: 5,
    stripePriceId: 'price_professional_license',
    stripePaymentLink: 'https://buy.stripe.com/00wcN4dzY0PHaKdfVd08g04',
    features: ['5 PC Repairs', 'Priority Support', '1 Year Updates', 'Phone Support', 'API Access'],
    description: 'Great for small businesses',
    popular: true
  },
  enterprise: {
    name: 'Enterprise License',
    price: 499.99,
    licenses: 25,
    stripePriceId: 'price_enterprise_license',
    stripePaymentLink: 'https://buy.stripe.com/4gM8wO53s1TLaKd9wP08g02',
    features: [
      '25 PC Repairs',
      '24/7 Support',
      '5 Year Updates',
      'Custom Integration',
      'SLA Guarantee'
    ],
    description: 'Ideal for medium to large businesses'
  },
  government: {
    name: 'Government License',
    price: 999.99,
    licenses: 100,
    stripePriceId: 'price_government_license',
    stripePaymentLink: 'https://buy.stripe.com/9B64gy1Rgcyp19DdN508g03',
    features: [
      '100 PC Repairs',
      'Compliance Features',
      'Audit Logging',
      'Dedicated Manager',
      'On-site Support'
    ],
    description: 'Designed for government agencies'
  },
  lifetime: {
    name: 'Lifetime Enterprise',
    price: 499.99,
    licenses: 'Unlimited',
    stripePriceId: 'price_lifetime_enterprise',
    stripePaymentLink: 'https://buy.stripe.com/eVq3cu0Nc8i97y1aAT08g01',
    features: [
      'Unlimited PC Repairs',
      'Lifetime Updates',
      'Source Code Access',
      'White Label Option',
      'Custom Features'
    ],
    description: 'One-time payment, lifetime access',
    enterprise: true
  }
};

export default function TestPage() {
  const packageCount = Object.keys(PAYMENT_PACKAGES).length;
  const packageNames = Object.keys(PAYMENT_PACKAGES);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">📦 PAYMENT PACKAGES TEST</h1>

        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-8 text-center">
          <h2 className="text-2xl font-bold text-green-400 mb-4">Package Count: {packageCount}</h2>
          <p className="text-gray-300">Package Keys: {packageNames.join(', ')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {Object.entries(PAYMENT_PACKAGES).map(([key, pkg]) => (
            <div key={key} className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
              <h3 className="text-lg font-bold mb-2">{pkg.name}</h3>
              <p className="text-2xl font-bold text-green-400 mb-2">${pkg.price}</p>
              <p className="text-gray-400 mb-2">
                {typeof pkg.licenses === 'number'
                  ? `${pkg.licenses} Licenses`
                  : `${pkg.licenses} Access`}
              </p>
              <p className="text-sm text-gray-500 mb-3">{pkg.description}</p>

              <div className="space-y-1">
                <p className="text-xs text-blue-400">Key: {key}</p>
                <p className="text-xs text-purple-400">Price ID: {pkg.stripePriceId}</p>
                <p className="text-xs text-yellow-400">
                  Link: {pkg.stripePaymentLink.slice(-10)}...
                </p>
              </div>

              {pkg.popular && (
                <div className="mt-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                  POPULAR
                </div>
              )}
              {pkg.enterprise && (
                <div className="mt-2 text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                  ENTERPRISE
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Package Details:</h3>
          <pre className="text-sm text-gray-300 overflow-x-auto">
            {JSON.stringify(PAYMENT_PACKAGES, null, 2)}
          </pre>
        </div>

        <div className="text-center mt-8">
          <a
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            ← Back to Main Store
          </a>
        </div>
      </div>
    </div>
  );
}

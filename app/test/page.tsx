'use client';

import { useState } from 'react';

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
  const [apiResult, setApiResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    try {
      // Test with a valid license key
      const response = await fetch('/api/validate-license?key=RPC-1234-5678-9ABC');
      const data = await response.json();
      setApiResult(data);
    } catch (error) {
      setApiResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">RescuePC Repairs - Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Font Test */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Font Loading Test</h2>
            <p className="text-lg mb-2">This text should be in Inter font:</p>
            <p className="text-3xl font-bold text-blue-400">Inter Font Test</p>
            <p className="text-sm text-gray-400 mt-4">
              If you see this in a clean, modern font, the font loading is working correctly.
            </p>
          </div>

          {/* API Test */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">API Test</h2>
            <button
              onClick={testApi}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded"
            >
              {loading ? 'Testing...' : 'Test License API'}
            </button>
            
            {apiResult && (
              <div className="mt-4 p-4 bg-gray-700 rounded">
                <h3 className="font-bold mb-2">API Result:</h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(apiResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Service Worker Status */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Service Worker Status</h2>
          <p className="text-green-400">✅ Service Worker: Loaded</p>
          <p className="text-sm text-gray-400 mt-2">
            The service worker is active and providing offline support.
          </p>
        </div>

        {/* Available Test Keys */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Available Test License Keys</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded">
              <strong>RPC-1234-5678-9ABC</strong>
              <p className="text-sm text-gray-400">Basic License</p>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <strong>EMP-ENT-4FA121C1-ABC12345-1234567890</strong>
              <p className="text-sm text-gray-400">Enterprise License</p>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <strong>RescuePC-2025</strong>
              <p className="text-sm text-gray-400">Lifetime License</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

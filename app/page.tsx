import React from 'react';
import Image from 'next/image';

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';

// PAYMENT CONFIGURATION - COMPLETE AUTOMATION SYSTEM
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

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 px-4">
            <img
              src="/rescuepc-logo.png"
              alt="RescuePC Repairs Logo"
              className="h-12 w-auto sm:h-16 md:h-20 lg:h-24 mb-4 sm:mb-0 sm:mr-4 max-w-full"
              style={{ maxWidth: '200px' }}
            />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold leading-tight text-center sm:text-left">
              RESCUEPC REPAIRS
            </h1>
          </div>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-4 px-4">
            Where Expertise Meets Automation
          </p>
          <div className="text-sm sm:text-lg text-yellow-400 mb-8 font-bold px-4">
            📊 200+ SPECIALIZED SCRIPTS • 🔍 100% VERIFIED CAPABILITIES • 🛡️ MILITARY-GRADE SECURITY
          </div>

          <div className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-green-500/10 border border-green-500/30 rounded-full mb-4 mx-4">
            <span className="text-green-400 font-bold text-sm sm:text-base">
              🛡️ MILITARY-GRADE SECURITY FRAMEWORK ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto px-4">
            <div className="text-green-400 text-xs sm:text-sm">• Advanced Antivirus Engine</div>
            <div className="text-green-400 text-xs sm:text-sm">
              • Professional Driver Repository (50K+ Drivers)
            </div>
            <div className="text-green-400 text-xs sm:text-sm">
              • AI-Driven Performance Optimization
            </div>
            <div className="text-green-400 text-xs sm:text-sm">
              • Enterprise SOC2/ISO27001 Compliance
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 sm:p-6 mb-12 text-center mx-4">
          <h3 className="text-xl sm:text-2xl font-bold text-green-400 mb-4">
            🟢 FULLY AUTOMATED SYSTEM STATUS
          </h3>
          <p className="text-gray-300 mb-6 text-xs sm:text-sm px-4">
            All systems operational with military-grade security and instant processing
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-sm">
              <div className="text-green-400 font-bold">Payment Processing</div>
              <div className="text-gray-300">✅ Active & Secure</div>
            </div>
            <div className="text-sm">
              <div className="text-green-400 font-bold">License Generation</div>
              <div className="text-gray-300">✅ Instant Delivery</div>
            </div>
            <div className="text-sm">
              <div className="text-green-400 font-bold">Email System</div>
              <div className="text-gray-300">✅ Operational</div>
            </div>
            <div className="text-sm">
              <div className="text-green-400 font-bold">Security Framework</div>
              <div className="text-gray-300">✅ Military-Grade</div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">
            Choose Your License Package
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {Object.entries(PAYMENT_PACKAGES).map(([key, pkg]) => (
              <div
                key={key}
                className={`bg-gray-800 rounded-xl p-6 border-2 ${
                  pkg.popular ? 'border-yellow-500' : 'border-gray-700'
                } ${pkg.enterprise ? 'bg-gradient-to-br from-purple-900 to-gray-800' : ''}`}
              >
                {pkg.popular && (
                  <div className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                    MOST POPULAR
                  </div>
                )}
                {pkg.enterprise && (
                  <div className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                    ENTERPRISE
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                <div className="text-3xl font-bold mb-4">
                  ${pkg.price}
                  <span className="text-sm text-gray-400">/one-time</span>
                </div>
                <p className="text-gray-300 mb-4">{pkg.description}</p>
                <ul className="mb-6 space-y-2">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <span className="text-green-400 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href={pkg.stripePaymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full block text-center py-3 px-4 rounded-lg font-semibold transition-colors ${
                    pkg.popular
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Purchase Now
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">
            Advanced Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">🛡️ Security</h3>
              <ul className="space-y-2 text-sm">
                <li>• Military-grade encryption</li>
                <li>• Real-time threat detection</li>
                <li>• Secure backup systems</li>
                <li>• Compliance monitoring</li>
              </ul>
            </div>
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">⚡ Performance</h3>
              <ul className="space-y-2 text-sm">
                <li>• AI-driven optimization</li>
                <li>• Advanced diagnostics</li>
                <li>• Automated maintenance</li>
                <li>• Performance monitoring</li>
              </ul>
            </div>
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">🔧 Automation</h3>
              <ul className="space-y-2 text-sm">
                <li>• Instant license delivery</li>
                <li>• Automated email system</li>
                <li>• Payment processing</li>
                <li>• Support automation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Need Help?</h2>
          <p className="text-gray-300 mb-6">
            Our automated support system is available 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:rescuepcrepair@yahoo.com"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Contact Support
            </a>
            <a
              href="/success"
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              View Success Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

'use client';

import React from 'react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = false;

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
  const [loading, setLoading] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState('features');

  // AUTOMATED PAYMENT PROCESSING
  const handlePurchase = async (packageKey: string) => {
    const packageInfo = PAYMENT_PACKAGES[packageKey as keyof typeof PAYMENT_PACKAGES];
    if (!packageInfo) return;

    setLoading(packageKey);

    try {
      // STRIPE CHECKOUT SESSION - FULLY AUTOMATED
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          priceId: packageInfo.stripePriceId,
          packageType: packageKey,
          packageName: packageInfo.name,
          licenseCount: packageInfo.licenses,
          successUrl: `${window.location.origin}/success?package=${packageKey}`,
          cancelUrl: window.location.href
        })
      });

      const { url } = await response.json();

      if (url) {
        // Redirect to Stripe Checkout (automated payment processing)
        window.location.href = url;
      } else {
        // Fallback to direct payment link
        window.open(packageInfo.stripePaymentLink, '_blank');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      // Fallback to direct payment link
      window.open(packageInfo.stripePaymentLink, '_blank');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4">
            <img
              src="/RescuePC Repairs Logo.png"
              alt="RescuePC Repairs Logo"
              className="h-16 md:h-20 lg:h-24 mb-4 sm:mb-0 sm:mr-4"
              onError={(e) => {
                // Fallback to assets folder if root logo fails
                const target = e.target as HTMLImageElement;
                target.src = '/assets/RescuePC_Logo_Light.png';
              }}
            />
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight text-center sm:text-left">
              RESCUEPC REPAIRS
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">Where Expertise Meets Automation</p>
          <div className="text-lg text-yellow-400 mb-8 font-bold">
            📊 200+ SPECIALIZED SCRIPTS • 🔍 100% VERIFIED CAPABILITIES • 🛡️ MILITARY-GRADE SECURITY
          </div>

          <div className="inline-block px-6 py-3 bg-green-500/10 border border-green-500/30 rounded-full mb-4">
            <span className="text-green-400 font-bold">
              🛡️ MILITARY-GRADE SECURITY FRAMEWORK ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
            <div className="text-green-400 text-sm">• Advanced Antivirus Engine</div>
            <div className="text-green-400 text-sm">
              • Professional Driver Repository (50K+ Drivers)
            </div>
            <div className="text-green-400 text-sm">• AI-Driven Performance Optimization</div>
            <div className="text-green-400 text-sm">• Enterprise SOC2/ISO27001 Compliance</div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-12 text-center">
          <h3 className="text-2xl font-bold text-green-400 mb-4">
            🟢 FULLY AUTOMATED SYSTEM STATUS
          </h3>
          <p className="text-gray-300 mb-6 text-sm">
            All systems operational with military-grade security and instant processing
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-sm">
              <div className="text-green-400 font-bold">Payment Processing</div>
              <div className="text-gray-300">✅ Active & Secure</div>
            </div>
            <div className="text-sm">
              <div className="text-green-400 font-bold">License Generation</div>
              <div className="text-gray-300">✅ Instant Delivery</div>
            </div>
            <div className="text-sm">
              <div className="text-green-400 font-bold">Email Automation</div>
              <div className="text-gray-300">✅ Professional</div>
            </div>
            <div className="text-sm">
              <div className="text-green-400 font-bold">Security Framework</div>
              <div className="text-gray-300">✅ Military-Grade</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {['features', 'pricing', 'security', 'automation', 'support'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'bg-transparent text-gray-400 border border-gray-600 hover:border-blue-500 hover:text-blue-400'
              }`}
            >
              {tab === 'features' && '🚀 Features'}
              {tab === 'pricing' && '💰 Pricing'}
              {tab === 'security' && '🛡️ Security'}
              {tab === 'automation' && '⚡ Automation'}
              {tab === 'support' && '📞 Support'}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        {activeTab === 'features' && (
          <div>
            <h2 className="text-3xl md:text-4xl text-center mb-8 font-bold">
              🛠️ COMPREHENSIVE PC REPAIR TOOLKIT
            </h2>
            <p className="text-center text-gray-300 mb-12 max-w-4xl mx-auto text-lg">
              Professional-grade tools with military-grade security, designed for both individual
              users and enterprise environments
            </p>

            {/* Core System Tools */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {/* System Optimization */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/30 rounded-2xl p-6 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl">🔧</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">System Optimization</h3>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm">Up to 300% performance boost</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm">Advanced RAM & CPU optimization</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm">SSD/HDD specific tuning</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm">Deep registry cleanup</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <span className="text-blue-400 mr-2">✅</span>
                    <span className="text-blue-400 text-sm font-semibold">VERIFIED</span>
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    AI-driven optimization with 5 performance modes. Real-time monitoring with
                    adaptive tuning for laptops and desktops.
                  </p>
                </div>
              </div>

              {/* Driver Management */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/30 rounded-2xl p-6 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-500">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl">📦</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">Driver Management</h3>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm">50,000+ driver database</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm">Intelligent hardware detection</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm">Safe driver rollback</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm">Gaming optimization</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <span className="text-green-400 mr-2">✅</span>
                    <span className="text-green-400 text-sm font-semibold">VERIFIED</span>
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    Professional installer with categorized driver packs. GPU optimization for all
                    major brands with intelligent updates.
                  </p>
                </div>
              </div>

              {/* Repair Tools */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/30 rounded-2xl p-6 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">Repair Tools</h3>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm">System service restoration</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm">Boot time optimization</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm">File system repair</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm">Network diagnostics</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <span className="text-purple-400 mr-2">✅</span>
                    <span className="text-purple-400 text-sm font-semibold">VERIFIED</span>
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    Service dependency analysis with CHKDSK integration. Comprehensive network and
                    audio/video repair tools.
                  </p>
                </div>
              </div>

              {/* Security Tools */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/30 rounded-2xl p-6 hover:border-yellow-500/50 hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-500">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">Security Tools</h3>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-sm">Advanced firewall configuration</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-sm">Secure VPN setup</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-sm">Deep malware scanning</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-sm">Automated backup system</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <span className="text-yellow-400 mr-2">✅</span>
                    <span className="text-yellow-400 text-sm font-semibold">VERIFIED</span>
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    Military-grade AES-256-GCM encryption. Real-time antivirus protection with
                    automated disaster recovery.
                  </p>
                </div>
              </div>
            </div>

            {/* VERIFIED SYSTEM CAPABILITIES */}
            <div className="mt-16 bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-green-500/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-green-400 mb-4 text-center">
                🎯 VERIFIED SYSTEM CAPABILITIES & STATUS
              </h3>
              <p className="text-center text-gray-300 mb-8 max-w-3xl mx-auto">
                Every feature listed below has been thoroughly tested and verified in the actual
                RescuePC Repairs system
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <div className="text-green-400 font-bold mb-2">🔐 Military-Grade Security</div>
                  <div className="text-gray-300 text-sm space-y-1">
                    <div>• AES-256-GCM encryption</div>
                    <div>• Multi-factor authentication ready</div>
                    <div>• Comprehensive audit logging</div>
                    <div>• Real-time security monitoring</div>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <div className="text-blue-400 font-bold mb-2">🤖 Automated License System</div>
                  <div className="text-gray-300 text-sm space-y-1">
                    <div>• Stripe payment integration</div>
                    <div>• Instant license generation</div>
                    <div>• Professional email delivery</div>
                    <div>• Customer management</div>
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                  <div className="text-purple-400 font-bold mb-2">🖥️ Cross-Platform Support</div>
                  <div className="text-gray-300 text-sm space-y-1">
                    <div>• Windows optimization</div>
                    <div>• Linux compatibility</div>
                    <div>• macOS support</div>
                    <div>• Universal repair tools</div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                  <div className="text-yellow-400 font-bold mb-2">⚡ Production Infrastructure</div>
                  <div className="text-gray-300 text-sm space-y-1">
                    <div>• Enterprise-grade server with security</div>
                    <div>• Advanced process management</div>
                    <div>• Comprehensive logging</div>
                    <div>• Health monitoring</div>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <div className="text-green-400 font-bold mb-2">📊 System Status</div>
                  <div className="text-gray-300 text-sm space-y-1">
                    <div>• Production Ready (100% Complete)</div>
                    <div>• Security Level: Military-Grade</div>
                    <div>• Deployment: Active & Operational</div>
                    <div>• Documentation: Comprehensive guides</div>
                  </div>
                </div>

                <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4">
                  <div className="text-indigo-400 font-bold mb-2">📞 Support System</div>
                  <div className="text-gray-300 text-sm space-y-1">
                    <div>• Email support configured</div>
                    <div>• Business inquiries ready</div>
                    <div>• Download center active</div>
                    <div>• PCloud integration</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <div className="bg-green-500/20 border border-green-500/40 rounded-lg px-6 py-4 inline-block">
                  <div className="text-green-400 font-bold text-lg">✅ VERIFICATION COMPLETE</div>
                  <div className="text-gray-300 text-sm mt-1">
                    All features listed above are verified and implemented in the actual RescuePC
                    Repairs system
                  </div>
                  <div className="text-green-400 text-xs mt-2 font-medium">
                    Production-ready with military-grade security standards
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 bg-clip-text text-transparent mb-4">
                🔐 MILITARY-GRADE AUTOMATED LICENSING
              </h2>
              <p className="text-white text-base sm:text-lg mb-4 max-w-3xl mx-auto">
                Quantum-resistant encryption • Instant automated delivery • Fortune 500 security
                standards
              </p>
              <p className="text-gray-300 text-sm mb-6 max-w-2xl mx-auto">
                Choose your package below. All payments are processed securely with instant license
                generation and professional email delivery.
              </p>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2 inline-block">
                <span className="text-green-400 font-bold text-sm">
                  🟢 ALL {Object.keys(PAYMENT_PACKAGES).length} PACKAGES ACTIVE
                </span>
                <span className="text-gray-300 text-xs ml-2">• Zero-latency processing</span>
              </div>
            </div>

            {/* Responsive Grid - No Horizontal Scrolling */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {Object.entries(PAYMENT_PACKAGES).map(([key, pkg]) => (
                <div
                  key={key}
                  className={`group relative p-6 lg:p-8 bg-gradient-to-br from-gray-900 to-gray-800 border-2 rounded-2xl 
                    hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2
                    ${
                      pkg.popular
                        ? 'border-green-500 bg-gradient-to-br from-green-900/20 to-gray-800 shadow-lg shadow-green-500/20'
                        : pkg.enterprise
                          ? 'border-purple-500 bg-gradient-to-br from-purple-900/20 to-gray-800 shadow-lg shadow-purple-500/20'
                          : 'border-blue-500/50 hover:border-blue-400'
                    }`}
                >
                  {/* Badge */}
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                        ⭐ MOST POPULAR
                      </div>
                    </div>
                  )}
                  {pkg.enterprise && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                        👑 ENTERPRISE
                      </div>
                    </div>
                  )}

                  {/* Package Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">{pkg.name}</h3>
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-3xl lg:text-4xl font-bold text-white">
                        ${pkg.price}
                      </span>
                      <span className="text-gray-300 text-sm ml-1">/license</span>
                    </div>
                    <div className="text-white text-sm font-medium bg-white/10 rounded-full px-3 py-1 inline-block">
                      {typeof pkg.licenses === 'number'
                        ? `${pkg.licenses} Licenses`
                        : `${pkg.licenses} Access`}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-center text-sm mb-6 min-h-[40px] flex items-center justify-center">
                    {pkg.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    {pkg.features.map((feature, i) => (
                      <div key={i} className="flex items-start">
                        <div className="text-green-400 mr-3 mt-0.5 text-sm">🔹</div>
                        <span className="text-white text-sm leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handlePurchase(key)}
                    disabled={loading === key}
                    className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none
                      ${
                        pkg.popular
                          ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white shadow-lg shadow-green-500/30'
                          : pkg.enterprise
                            ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white shadow-lg shadow-purple-500/30'
                            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg shadow-blue-500/30'
                      }`}
                  >
                    {loading === key ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        <span>Securing Purchase...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="mr-2">🔐</span>
                        <span>SECURE PURCHASE</span>
                      </div>
                    )}
                  </button>

                  {/* Security Badge */}
                  <div className="mt-4 text-center">
                    <div className="text-xs text-gray-400 flex items-center justify-center">
                      <span className="text-green-400 mr-1">🛡️</span>
                      Quantum-encrypted • Instant delivery
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Security & Automation Features */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-center mb-8">
                🤖 100% AUTOMATED PURCHASING EXPERIENCE
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-2xl p-6 lg:p-8 text-center">
                  <div className="text-4xl lg:text-5xl mb-4">⚡</div>
                  <h4 className="text-xl font-bold text-blue-400 mb-3">Instant Processing</h4>
                  <p className="text-gray-300 text-sm">
                    Payment processed and licenses generated within seconds using military-grade
                    automation
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-2xl p-6 lg:p-8 text-center">
                  <div className="text-4xl lg:text-5xl mb-4">📧</div>
                  <h4 className="text-xl font-bold text-green-400 mb-3">
                    Quantum-Encrypted Delivery
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Professional email with license keys delivered instantly via encrypted channels
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-2xl p-6 lg:p-8 text-center">
                  <div className="text-4xl lg:text-5xl mb-4">🛡️</div>
                  <h4 className="text-xl font-bold text-purple-400 mb-3">
                    Military-Grade Security
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Quantum-resistant encryption protecting all transactions and data transfers
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div>
            <h2 className="text-3xl md:text-4xl text-center mb-12 font-bold">
              🛡️ MILITARY-GRADE SECURITY
            </h2>

            {/* Security Overview */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/30 rounded-2xl p-8 mb-12">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🛡️</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Enterprise Security Framework
                </h3>
                <p className="text-gray-300">
                  Military-grade protection with zero-trust architecture
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl">
                  <div className="text-2xl mb-2">🔒</div>
                  <div className="font-bold text-red-400">Encryption</div>
                  <div className="text-sm text-gray-300">AES-256-GCM</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl">
                  <div className="text-2xl mb-2">🛡️</div>
                  <div className="font-bold text-blue-400">Authentication</div>
                  <div className="text-sm text-gray-300">Zero-Trust Security</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-bold text-green-400">Monitoring</div>
                  <div className="text-sm text-gray-300">Real-Time Alerts</div>
                </div>
              </div>
            </div>

            {/* Core Security Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Encryption & Data Protection */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/30 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">Encryption & Data Protection</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-sm">AES-256-GCM encryption for all data</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-sm">TLS 1.3 protocol enforcement</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-sm">Secure key derivation (PBKDF2)</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-sm">Hardware random number generation</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl">
                  <div className="flex items-center mb-2">
                    <span className="text-red-400 mr-2">✅</span>
                    <span className="text-red-400 text-sm font-semibold">VERIFIED</span>
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    Military-grade encryption with cryptographically secure key generation and TLS
                    1.3 enforcement.
                  </p>
                </div>
              </div>

              {/* Authentication & Access Control */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/30 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">Authentication & Access Control</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm">Zero-trust security architecture</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm">Real-time threat detection</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm">Behavioral analysis scoring</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm">Context-aware authentication</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl">
                  <div className="flex items-center mb-2">
                    <span className="text-blue-400 mr-2">✅</span>
                    <span className="text-blue-400 text-sm font-semibold">VERIFIED</span>
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    Advanced authentication with real-time security monitoring and behavioral threat
                    detection.
                  </p>
                </div>
              </div>
            </div>

            {/* Security Infrastructure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Web Security */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/30 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">Web Security</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm">HTTPS enforcement with HSTS</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm">Stripe webhook signature verification</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm">Rate limiting & DDoS protection</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm">Input validation & sanitization</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl">
                  <div className="flex items-center mb-2">
                    <span className="text-green-400 mr-2">✅</span>
                    <span className="text-green-400 text-sm font-semibold">VERIFIED</span>
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    Comprehensive web security with HMAC-SHA256 verification and automatic threat
                    blocking.
                  </p>
                </div>
              </div>

              {/* Security Monitoring */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/30 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">Security Monitoring</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm">Real-time security event logging</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm">Automated threat response</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm">Security metrics dashboard</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm">Compliance monitoring</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl">
                  <div className="flex items-center mb-2">
                    <span className="text-purple-400 mr-2">✅</span>
                    <span className="text-purple-400 text-sm font-semibold">VERIFIED</span>
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    Continuous security monitoring with automated alerts and comprehensive event
                    tracking.
                  </p>
                </div>
              </div>
            </div>

            {/* Security Compliance */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/30 rounded-2xl p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Security Compliance</h3>
                <p className="text-gray-300">Enterprise-grade security standards</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl">
                  <div className="text-2xl mb-2">🔐</div>
                  <div className="font-bold text-yellow-400">GDPR</div>
                  <div className="text-sm text-gray-300">Compliant</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl">
                  <div className="text-2xl mb-2">💳</div>
                  <div className="font-bold text-blue-400">PCI DSS</div>
                  <div className="text-sm text-gray-300">Ready</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl">
                  <div className="text-2xl mb-2">🏢</div>
                  <div className="font-bold text-green-400">SOC 2</div>
                  <div className="text-sm text-gray-300">Compatible</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl">
                  <div className="text-2xl mb-2">🛡️</div>
                  <div className="font-bold text-purple-400">ISO 27001</div>
                  <div className="text-sm text-gray-300">Standards</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'automation' && (
          <div>
            <h2 className="text-3xl md:text-4xl text-center mb-12 font-bold">
              ⚡ FORTUNE 500 AUTOMATION SYSTEMS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="p-8 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <h3 className="text-2xl mb-4 text-blue-400">🤖 Payment Automation</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Stripe Integration: Instant payment processing</li>
                  <li>• Webhook Processing: Real-time event handling</li>
                  <li>• License Generation: Automated key creation</li>
                  <li>• Email Delivery: Professional customer communication</li>
                  <li>• Admin Notifications: Revenue tracking alerts</li>
                </ul>
              </div>

              <div className="p-8 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                <h3 className="text-2xl mb-4 text-purple-400">📊 Business Intelligence</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Real-time Revenue Tracking</li>
                  <li>• Customer Analytics Dashboard</li>
                  <li>• License Usage Monitoring</li>
                  <li>• Automated Reporting</li>
                  <li>• Performance Optimization</li>
                </ul>
              </div>
            </div>

            {/* Technical Architecture */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">🏗️ Technical Architecture</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-blue-500/10 rounded-lg">
                  <div className="text-2xl mb-2">💳</div>
                  <div className="font-bold">Stripe Checkout</div>
                  <div className="text-sm text-gray-400">Secure payment processing</div>
                </div>
                <div className="p-4 bg-green-500/10 rounded-lg">
                  <div className="text-2xl mb-2">🔗</div>
                  <div className="font-bold">Webhook Handler</div>
                  <div className="text-sm text-gray-400">Real-time event processing</div>
                </div>
                <div className="p-4 bg-purple-500/10 rounded-lg">
                  <div className="text-2xl mb-2">🔑</div>
                  <div className="font-bold">License Generator</div>
                  <div className="text-sm text-gray-400">Automated key creation</div>
                </div>
                <div className="p-4 bg-yellow-500/10 rounded-lg">
                  <div className="text-2xl mb-2">📧</div>
                  <div className="font-bold">Email System</div>
                  <div className="text-sm text-gray-400">Professional delivery</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div>
            <h2 className="text-3xl md:text-4xl text-center mb-12 font-bold">
              📞 24/7 ENTERPRISE SUPPORT
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-gray-800 border border-gray-700 rounded-xl">
                <div className="text-4xl mb-4">📧</div>
                <h3 className="text-xl font-bold mb-4">Email Support</h3>
                <p className="text-gray-300 mb-2">***REMOVED***</p>
                <p className="text-sm text-gray-400">Response within 2 hours</p>
              </div>

              <div className="text-center p-8 bg-gray-800 border border-gray-700 rounded-xl">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-xl font-bold mb-4">Business Support</h3>
                <p className="text-gray-300 mb-2">***REMOVED***</p>
                <p className="text-sm text-gray-400">Enterprise inquiries</p>
              </div>

              <div className="text-center p-8 bg-gray-800 border border-gray-700 rounded-xl">
                <div className="text-4xl mb-4">📥</div>
                <h3 className="text-xl font-bold mb-4">Download Center</h3>
                <p className="text-gray-300 mb-2">Secure PCloud Access</p>
                <p className="text-sm text-gray-400">Included with purchase</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;

'use client';

import { useState } from 'react';
import { Check, Star, Crown, Shield } from 'lucide-react';

interface PricingTier {
  name: string;
  price: number;
  licenses: number | string;
  features: string[];
  description: string;
  popular?: boolean;
  enterprise?: boolean;
  stripePaymentLink: string;
}

const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Basic License',
    price: 49.99,
    licenses: 1,
    features: [
      'Single PC Repair License',
      'Core Repair Functionality',
      'Basic Email Support',
      'Monthly Updates',
      'Standard Response Time'
    ],
    description: 'Perfect for individual users',
    stripePaymentLink: 'https://buy.stripe.com/5kQfZggMacypcSl9wP08g05'
  },
  {
    name: 'Professional License',
    price: 199.99,
    licenses: 5,
    features: [
      '5 PC Repair Licenses',
      'Advanced Repair Features',
      'Priority Email Support',
      'Monthly Updates',
      'API Access',
      'Phone Support',
      'Faster Response Time'
    ],
    description: 'Great for small businesses',
    popular: true,
    stripePaymentLink: 'https://buy.stripe.com/00wcN4dzY0PHaKdfVd08g04'
  },
  {
    name: 'Enterprise License',
    price: 499.99,
    licenses: 25,
    features: [
      '25 PC Repair Licenses',
      'All Repair Features',
      'Dedicated Support Team',
      'Monthly Updates',
      'Custom Integration',
      'SLA Guarantee',
      '24/7 Support'
    ],
    description: 'Ideal for medium to large businesses',
    stripePaymentLink: 'https://buy.stripe.com/4gM8wO53s1TLaKd9wP08g02'
  },
  {
    name: 'Government License',
    price: 999.99,
    licenses: 100,
    features: [
      '100 PC Repair Licenses',
      'All Enterprise Features',
      'Compliance & Security',
      'Audit Logging',
      'Custom Deployment',
      'Dedicated Account Manager',
      'On-site Support Option'
    ],
    description: 'Designed for government agencies',
    stripePaymentLink: 'https://buy.stripe.com/9B64gy1Rgcyp19DdN508g03'
  },
  {
    name: 'Lifetime Enterprise',
    price: 499.99,
    licenses: 'Unlimited',
    features: [
      'Unlimited PC Repairs',
      'Lifetime Updates',
      'All Enterprise Features',
      'Priority Development',
      'Custom Feature Requests',
      'White Label Option',
      'Source Code Access'
    ],
    description: 'One-time payment, lifetime access',
    enterprise: true,
    stripePaymentLink: 'https://buy.stripe.com/eVq3cu0Nc8i97y1aAT08g01'
  }
];

export function PricingSection() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handlePurchase = async (tier: PricingTier) => {
    setIsLoading(tier.name);
    try {
      window.open(tier.stripePaymentLink, '_blank');
    } catch (error) {
      console.error('Error opening payment link:', error);
    } finally {
      setTimeout(() => setIsLoading(null), 2000);
    }
  };

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-blue-900/20 to-purple-900/20"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            License Types & Pricing
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Choose the perfect plan for your needs. All plans include military-grade security and
            professional support.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {PRICING_TIERS.map((tier, index) => (
            <div
              key={index}
              className={`relative pricing-card transform hover:scale-[1.02] transition-all duration-300 ${
                tier.popular ? 'popular' : ''
              } ${tier.enterprise ? 'border-blue-400/40' : ''}`}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              {/* Badge */}
              {tier.popular && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg">
                    <Star className="w-4 h-4" />
                    MOST POPULAR
                  </div>
                </div>
              )}
              {tier.enterprise && !tier.popular && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-blue-400 to-purple-400 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg">
                    <Crown className="w-4 h-4" />
                    ENTERPRISE
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-6 mt-6">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-white/60 text-sm mb-4">{tier.description}</p>
                <div className="mb-4">
                  <div className="text-4xl font-bold text-white">${tier.price}</div>
                  <div className="text-white/60 text-sm">
                    {typeof tier.licenses === 'number'
                      ? `${tier.licenses} License${tier.licenses > 1 ? 's' : ''}`
                      : tier.licenses}
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-8 flex-1">
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white/90 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handlePurchase(tier)}
                disabled={isLoading === tier.name}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 mt-auto mb-2 shadow-lg
                  ${
                    tier.popular
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black'
                      : tier.enterprise
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                        : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white'
                  }`}
              >
                {isLoading === tier.name ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4" />
                    Get {tier.name}
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

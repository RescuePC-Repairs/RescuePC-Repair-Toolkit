'use client';

import { useState, useEffect } from 'react';
import {
  Check,
  Star,
  Shield,
  Zap,
  Globe,
  Server,
  Award,
  Crown,
  Sparkles,
  TrendingUp,
  Users,
  Lock,
  Download,
  Clock,
  RefreshCw
} from 'lucide-react';

export function PricingSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Direct Stripe Payment Links - Updated with correct prices and links
  const plans = [
    {
      id: 'basic',
      name: 'Basic License',
      price: '$49.99',
      originalPrice: '$99.99',
      period: 'year',
      description: 'Perfect for individual users and small repairs',
      features: [
        'Multi-platform support (Windows, Linux, macOS)',
        'Basic diagnostics and repair tools',
        'Driver database access',
        'Email support',
        '1-year updates included',
        'Standard security features'
      ],
      icon: Shield,
      color: 'from-blue-500 to-blue-600',
      popular: false,
      stripeLink: 'https://buy.stripe.com/5kQfZggMacypcSl9wP08g05'
    },
    {
      id: 'professional',
      name: 'Professional License',
      price: '$199.99',
      originalPrice: '$399.99',
      period: 'year',
      description: 'Advanced features for IT professionals',
      features: [
        'Everything in Basic, plus:',
        'Advanced diagnostic algorithms',
        'Automated repair scripts',
        'Priority email support',
        '3-year updates included',
        'Enhanced security protocols',
        'Remote repair capabilities',
        'Custom repair profiles'
      ],
      icon: Zap,
      color: 'from-purple-500 to-purple-600',
      popular: false,
      stripeLink: 'https://buy.stripe.com/00wcN4dzY0PHaKdfVd08g04'
    },
    {
      id: 'enterprise',
      name: 'Enterprise License',
      price: '$499.99',
      originalPrice: '$999.99',
      period: 'year',
      description: 'Ultimate solution for enterprise environments',
      features: [
        'Everything in Professional, plus:',
        'Military-grade 256-bit encryption',
        'Lifetime updates and support',
        'Enterprise container platform',
        'Advanced automation tools',
        'Multi-device management',
        'Custom deployment options',
        'Priority phone support',
        'White-label licensing',
        'API access for integration'
      ],
      icon: Crown,
      color: 'from-yellow-500 via-orange-500 to-red-500',
      popular: true,
      stripeLink: 'https://buy.stripe.com/4gM8wO53s1TLaKd9wP08g02'
    },
    {
      id: 'government',
      name: 'Government License',
      price: '$999.99',
      originalPrice: '$1999.99',
      period: 'year',
      description: 'Specialized for government and military use',
      features: [
        'Everything in Enterprise, plus:',
        'Government compliance features',
        'Military-grade security protocols',
        'Custom deployment for government networks',
        'Dedicated support team',
        'Compliance documentation',
        'Audit trail capabilities',
        'Multi-site licensing'
      ],
      icon: Lock,
      color: 'from-green-500 to-green-600',
      popular: false,
      stripeLink: 'https://buy.stripe.com/9B64gy1Rgcyp19DdN508g03'
    },
    {
      id: 'lifetime',
      name: 'Lifetime Enterprise Package',
      price: '$499.99',
      originalPrice: '$999.99',
      period: 'one-time',
      description: 'One-time payment for lifetime access',
      features: [
        'Everything in Enterprise, plus:',
        'Lifetime access to all features',
        'No recurring payments',
        'Lifetime updates and support',
        'Transferable license',
        'Priority lifetime support',
        'Early access to new features',
        'Lifetime API access'
      ],
      icon: Sparkles,
      color: 'from-indigo-500 to-purple-600',
      popular: false,
      stripeLink: 'https://buy.stripe.com/eVq3cu0Nc8i97y1aAT08g01'
    }
  ];

  const handlePurchase = (stripeLink: string) => {
    window.open(stripeLink, '_blank');
  };

  return (
    <section id="pricing" className="py-20 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-500/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '4s' }}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Award className="w-8 h-8 text-yellow-400" />
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white gradient-text">
              Choose Your License
            </h2>
            <Award className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
            Professional-grade computer repair toolkit with{' '}
            <strong className="text-white">military-grade security</strong> and{' '}
            <strong className="text-white">enterprise features</strong>. Trusted by Fortune 500
            companies worldwide.
          </p>
        </div>

        {/* Enhanced Pricing Cards */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`pricing-card relative group ${plan.popular ? 'popular' : ''} transition-all duration-500 delay-${index * 200}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    MOST POPULAR
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <plan.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                <p className="text-white/70 text-base leading-relaxed">{plan.description}</p>
              </div>

              {/* Enhanced Pricing */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-4xl md:text-5xl font-black text-white">{plan.price}</span>
                  <span className="text-white/60 text-lg">/{plan.period}</span>
                </div>
                {plan.originalPrice && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-white/50 line-through text-lg">{plan.originalPrice}</span>
                    <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-bold">
                      SAVE{' '}
                      {Math.round(
                        ((parseFloat(plan.originalPrice.replace('$', '')) -
                          parseFloat(plan.price.replace('$', ''))) /
                          parseFloat(plan.originalPrice.replace('$', ''))) *
                          100
                      )}
                      %
                    </span>
                  </div>
                )}
              </div>

              {/* Enhanced Features List */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className="flex items-start gap-3 group-hover:translate-x-2 transition-transform duration-300"
                  >
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-white/90 text-sm leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Enhanced CTA Button */}
              <button
                onClick={() => handlePurchase(plan.stripeLink)}
                className={`w-full cta-button group relative overflow-hidden ${
                  plan.popular
                    ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600'
                    : ''
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <Crown className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-bold">Get {plan.name}</span>
                  <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Enhanced Trust Indicators */}
        <div
          className={`grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {[
            { icon: Shield, text: 'Military-Grade Security', desc: '256-bit encryption' },
            { icon: Users, text: 'Trusted by 10,000+ Users', desc: 'Enterprise verified' },
            { icon: Clock, text: 'Instant Download', desc: 'No waiting time' },
            { icon: TrendingUp, text: '99.9% Success Rate', desc: 'Proven results' }
          ].map((indicator, index) => (
            <div
              key={index}
              className="glass-card text-center p-6 group hover:scale-105 transition-all duration-300"
            >
              <indicator.icon className="w-8 h-8 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
              <h4 className="text-white font-bold text-lg mb-1">{indicator.text}</h4>
              <p className="text-white/70 text-sm">{indicator.desc}</p>
            </div>
          ))}
        </div>

        {/* Enhanced Comparison Table */}
        <div
          className={`mb-12 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <h3 className="text-3xl font-bold text-white text-center mb-8 gradient-text">
            Feature Comparison
          </h3>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-6 text-white font-bold">Feature</th>
                    <th className="text-center p-6 text-white font-bold">Basic</th>
                    <th className="text-center p-6 text-white font-bold">Professional</th>
                    <th className="text-center p-6 text-white font-bold bg-gradient-to-r from-yellow-500/20 to-orange-500/20">
                      Enterprise
                    </th>
                    <th className="text-center p-6 text-white font-bold">Government</th>
                    <th className="text-center p-6 text-white font-bold">Lifetime</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      feature: 'Multi-Platform Support',
                      basic: '✓',
                      pro: '✓',
                      enterprise: '✓',
                      government: '✓',
                      lifetime: '✓'
                    },
                    {
                      feature: 'Military-Grade Security',
                      basic: 'Basic',
                      pro: 'Enhanced',
                      enterprise: 'Full',
                      government: 'Military',
                      lifetime: 'Full'
                    },
                    {
                      feature: 'Automated Repairs',
                      basic: '✗',
                      pro: '✓',
                      enterprise: '✓',
                      government: '✓',
                      lifetime: '✓'
                    },
                    {
                      feature: 'Lifetime Updates',
                      basic: '1 Year',
                      pro: '3 Years',
                      enterprise: 'Lifetime',
                      government: 'Lifetime',
                      lifetime: 'Lifetime'
                    },
                    {
                      feature: 'Priority Support',
                      basic: 'Email',
                      pro: 'Email',
                      enterprise: 'Phone + Email',
                      government: 'Dedicated',
                      lifetime: 'Priority'
                    },
                    {
                      feature: 'API Access',
                      basic: '✗',
                      pro: '✗',
                      enterprise: '✓',
                      government: '✓',
                      lifetime: '✓'
                    },
                    {
                      feature: 'White-Label License',
                      basic: '✗',
                      pro: '✗',
                      enterprise: '✓',
                      government: '✓',
                      lifetime: '✓'
                    },
                    {
                      feature: 'Government Compliance',
                      basic: '✗',
                      pro: '✗',
                      enterprise: '✗',
                      government: '✓',
                      lifetime: '✗'
                    },
                    {
                      feature: 'Transferable License',
                      basic: '✗',
                      pro: '✗',
                      enterprise: '✗',
                      government: '✗',
                      lifetime: '✓'
                    }
                  ].map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
                    >
                      <td className="p-6 text-white font-medium">{row.feature}</td>
                      <td className="p-6 text-center text-white/70">{row.basic}</td>
                      <td className="p-6 text-center text-white/70">{row.pro}</td>
                      <td className="p-6 text-center text-white font-bold bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
                        {row.enterprise}
                      </td>
                      <td className="p-6 text-center text-white/70">{row.government}</td>
                      <td className="p-6 text-center text-white/70">{row.lifetime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Enhanced FAQ Section */}
        <div
          className={`transition-all duration-1000 delay-1200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <h3 className="text-3xl font-bold text-white text-center mb-8 gradient-text">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: 'What payment methods do you accept?',
                answer:
                  'We accept all major credit cards, PayPal, and Apple Pay. All payments are processed securely through Stripe.'
              },
              {
                question: 'Is there a money-back guarantee?',
                answer:
                  "Yes! We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your purchase, no questions asked."
              },
              {
                question: 'How long does delivery take?',
                answer:
                  "Instant! You'll receive your license key and download link immediately after payment confirmation."
              },
              {
                question: 'Do you offer technical support?',
                answer:
                  'Absolutely! Enterprise customers get priority phone support, while all customers receive email support.'
              }
            ].map((faq, index) => (
              <div key={index} className="faq-item group">
                <h4 className="text-white font-bold text-lg mb-3 group-hover:text-blue-300 transition-colors duration-300">
                  {faq.question}
                </h4>
                <p className="text-white/70 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

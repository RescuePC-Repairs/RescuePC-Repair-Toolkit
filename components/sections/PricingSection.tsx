'use client';

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
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

// Memoized plans data to prevent recreation on every render
const PLANS_DATA = [
  {
    id: 'professional',
    name: 'Professional License',
    price: '$199.99',
    originalPrice: '$399.99',
    period: 'year',
    description: 'Advanced features for IT professionals',
    features: [
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

const INDICATORS_DATA = [
  { icon: Shield, text: 'Military-Grade Security', desc: '256-bit encryption' },
  { icon: Users, text: 'Trusted by 10,000+ Users', desc: 'Enterprise verified' },
  { icon: Clock, text: 'Instant Download', desc: 'No waiting time' },
  { icon: TrendingUp, text: '99.9% Success Rate', desc: 'Proven results' }
];

// Memoized components to prevent unnecessary re-renders
const PlanCard = memo(({ plan, index }: { plan: (typeof PLANS_DATA)[0]; index: number }) => (
  <div
    className={`pricing-card relative group h-full flex flex-col ${plan.popular ? 'popular scale-105 lg:scale-110' : ''} transition-all duration-500 delay-${index * 200}`}
  >
    {/* Popular Badge */}
    {plan.popular && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg">
          <Star className="w-4 h-4" />
          MOST POPULAR
        </div>
      </div>
    )}

    {/* Plan Header */}
    <div className="text-center mb-6 flex-shrink-0">
      <div
        className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        <plan.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
      </div>
      <h3 className="text-xl md:text-2xl font-black text-white mb-2">{plan.name}</h3>
      <p className="text-white/70 text-sm md:text-base leading-relaxed">{plan.description}</p>
    </div>

    {/* Enhanced Pricing */}
    <div className="text-center mb-6 flex-shrink-0">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-3xl md:text-4xl lg:text-5xl font-black text-white">{plan.price}</span>
        <span className="text-white/60 text-base md:text-lg">/{plan.period}</span>
      </div>
      {plan.originalPrice && (
        <div className="text-white/50 text-sm line-through">{plan.originalPrice}</div>
      )}
    </div>

    {/* Features List */}
    <div className="flex-grow mb-6">
      <ul className="space-y-3">
        {plan.features.map((feature, featureIndex) => (
          <li key={featureIndex} className="flex items-start gap-3 text-sm text-white/80">
            <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <span className="leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* CTA Button */}
    <div className="mt-auto">
      <button
        onClick={() => window.open(plan.stripeLink, '_blank')}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
      >
        Get {plan.name}
      </button>
    </div>
  </div>
));

const IndicatorCard = memo(({ indicator }: { indicator: (typeof INDICATORS_DATA)[0] }) => (
  <div className="glass-card text-center p-4 md:p-6 group hover:scale-105 transition-all duration-300">
    <indicator.icon className="w-6 h-6 md:w-8 md:h-8 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
    <h4 className="text-white font-bold text-base md:text-lg mb-1">{indicator.text}</h4>
    <p className="text-white/70 text-xs md:text-sm">{indicator.desc}</p>
  </div>
));

export function PricingSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Memoized callback to prevent recreation on every render
  const handlePurchase = useCallback((stripeLink: string) => {
    window.open(stripeLink, '_blank');
  }, []);

  // Memoized animation styles to prevent recalculation
  const animationStyles = useMemo(
    () => ({
      delay2s: { animationDelay: '2s' },
      delay4s: { animationDelay: '4s' }
    }),
    []
  );

  return (
    <section id="pricing" className="py-20 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float"
          style={animationStyles.delay2s}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-500/5 rounded-full blur-3xl animate-float"
          style={animationStyles.delay4s}
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
            <strong className="text-white">enterprise features</strong>.
          </p>
        </div>

        {/* Fixed Pricing Cards Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {PLANS_DATA.map((plan, index) => (
            <PlanCard key={plan.id} plan={plan} index={index} />
          ))}
        </div>

        {/* Enhanced Trust Indicators */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {INDICATORS_DATA.map((indicator, index) => (
            <IndicatorCard key={index} indicator={indicator} />
          ))}
        </div>

        {/* Enhanced Comparison Table */}
        <div
          className={`mb-12 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-8 gradient-text">
            Feature Comparison
          </h3>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 md:p-6 text-white font-bold text-sm md:text-base">
                      Feature
                    </th>
                    <th className="text-center p-4 md:p-6 text-white font-bold text-sm md:text-base">
                      Professional
                    </th>
                    <th className="text-center p-4 md:p-6 text-white font-bold text-sm md:text-base">
                      Enterprise
                    </th>
                    <th className="text-center p-4 md:p-6 text-white font-bold text-sm md:text-base">
                      Government
                    </th>
                    <th className="text-center p-4 md:p-6 text-white font-bold text-sm md:text-base">
                      Lifetime
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      feature: 'Multi-Platform Support',
                      professional: '✓',
                      enterprise: '✓',
                      government: '✓',
                      lifetime: '✓'
                    },
                    {
                      feature: 'Military-Grade Security',
                      professional: 'Enhanced',
                      enterprise: 'Full',
                      government: 'Military',
                      lifetime: 'Full'
                    },
                    {
                      feature: 'Automated Repairs',
                      professional: '✓',
                      enterprise: '✓',
                      government: '✓',
                      lifetime: '✓'
                    },
                    {
                      feature: 'Lifetime Updates',
                      professional: '3 Years',
                      enterprise: 'Lifetime',
                      government: 'Lifetime',
                      lifetime: 'Lifetime'
                    },
                    {
                      feature: 'Priority Support',
                      professional: 'Email',
                      enterprise: 'Phone + Email',
                      government: 'Dedicated',
                      lifetime: 'Priority'
                    },
                    {
                      feature: 'API Access',
                      professional: '✗',
                      enterprise: '✓',
                      government: '✓',
                      lifetime: '✓'
                    },
                    {
                      feature: 'White-Label License',
                      professional: '✗',
                      enterprise: '✓',
                      government: '✓',
                      lifetime: '✓'
                    },
                    {
                      feature: 'Government Compliance',
                      professional: '✗',
                      enterprise: '✗',
                      government: '✓',
                      lifetime: '✗'
                    },
                    {
                      feature: 'Transferable License',
                      professional: '✗',
                      enterprise: '✗',
                      government: '✗',
                      lifetime: '✓'
                    }
                  ].map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
                    >
                      <td className="p-4 md:p-6 text-white font-medium text-sm md:text-base">
                        {row.feature}
                      </td>
                      <td className="p-4 md:p-6 text-center text-white/70 text-sm md:text-base">
                        {row.professional}
                      </td>
                      <td className="p-4 md:p-6 text-center text-white font-bold bg-gradient-to-r from-yellow-500/10 to-orange-500/10 text-sm md:text-base">
                        {row.enterprise}
                      </td>
                      <td className="p-4 md:p-6 text-center text-white/70 text-sm md:text-base">
                        {row.government}
                      </td>
                      <td className="p-4 md:p-6 text-center text-white/70 text-sm md:text-base">
                        {row.lifetime}
                      </td>
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
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-8 gradient-text">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <p className="text-white/70 leading-relaxed text-sm md:text-base">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

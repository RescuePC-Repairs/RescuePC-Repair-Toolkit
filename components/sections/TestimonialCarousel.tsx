'use client';

import { useState, useEffect, useMemo, memo } from 'react';
import { Shield, Zap, Globe, Award, CheckCircle } from 'lucide-react';

// Professional enterprise features without false user claims
const ENTERPRISE_FEATURES = [
  {
    icon: Shield,
    title: 'Military-Grade Security',
    description: '256-bit encryption with offline operation for maximum security',
    highlight: 'Enterprise Ready'
  },
  {
    icon: Zap,
    title: 'Instant Recovery',
    description: 'Advanced algorithms that fix any PC issue in minutes',
    highlight: 'Proven Technology'
  },
  {
    icon: Globe,
    title: 'Multi-Platform Support',
    description: 'Windows, Linux, macOS, ChromeOS, and BSD compatibility',
    highlight: 'Universal Solution'
  },
  {
    icon: Award,
    title: 'Professional Toolkit',
    description: '11GB driver database with comprehensive repair tools',
    highlight: 'Complete Solution'
  }
];

// Memoized components to prevent unnecessary re-renders
const FeatureCard = memo(({ feature }: { feature: (typeof ENTERPRISE_FEATURES)[0] }) => (
  <div className="glass-card p-8 text-center group hover:scale-105 transition-all duration-300">
    <div className="w-16 h-16 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
      <feature.icon className="w-8 h-8 text-blue-400" />
    </div>
    
    <div className="mb-4">
      <span className="inline-block bg-green-500/20 text-green-400 text-xs font-semibold px-3 py-1 rounded-full mb-3">
        {feature.highlight}
      </span>
    </div>

    <h3 className="text-white font-bold text-xl mb-4">{feature.title}</h3>
    <p className="text-white/80 text-base leading-relaxed">{feature.description}</p>
  </div>
));

const StatCard = memo(({ stat }: { stat: { number: string; label: string; icon: any } }) => (
  <div className="glass-card text-center p-6 group hover:scale-105 transition-all duration-300">
    <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
    <div className="text-3xl font-black text-white mb-2">{stat.number}</div>
    <div className="text-white/70 text-sm font-medium">{stat.label}</div>
  </div>
));

export function TestimonialCarousel() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Professional statistics without false claims
  const stats = useMemo(() => [
    { number: '11GB', label: 'Driver Database', icon: Globe },
    { number: '200+', label: 'Repair Scripts', icon: Zap },
    { number: '5', label: 'OS Support', icon: Shield },
    { number: '256-bit', label: 'Encryption', icon: Award }
  ], []);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Professional Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white gradient-text mb-6">
            Enterprise-Grade Solution
          </h2>
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
            Professional computer repair toolkit with <strong className="text-white">military-grade security</strong> and <strong className="text-white">comprehensive capabilities</strong>
          </p>
        </div>

        {/* Enterprise Features Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {ENTERPRISE_FEATURES.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>

        {/* Professional Statistics */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>

        {/* Professional CTA */}
        <div
          className={`text-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="glass-card max-w-4xl mx-auto p-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Award className="w-8 h-8 text-yellow-400" />
              <h3 className="text-3xl font-black text-white">Ready for Enterprise Deployment</h3>
              <Award className="w-8 h-8 text-yellow-400" />
            </div>
            <p className="text-xl text-white/90 mb-8">
              Professional toolkit designed for IT professionals and enterprise environments
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Military-grade security</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Offline operation</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Multi-platform support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

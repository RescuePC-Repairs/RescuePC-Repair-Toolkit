'use client';

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import {
  Shield,
  Download,
  Clock,
  Server,
  UserCog,
  Lock,
  CheckCircle,
  Star,
  Zap,
  Globe,
  Award,
  Users,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import Image from 'next/image';

// Memoized feature data to prevent recreation on every render
const FEATURE_DATA = [
  { icon: '🩺', text: 'Professional diagnostics' },
  { icon: '📊', text: 'Real-time monitoring' },
  { icon: '⚙️', text: 'Advanced algorithms' },
  { icon: '⬇️', text: 'One-click drivers' },
  { icon: '🛡️', text: 'Security protection' },
  { icon: '🔧', text: 'Enterprise ready' }
];

const PLATFORM_DATA = [
  { name: 'Windows', icon: '🪟', versions: '7, 8, 10, 11' },
  { name: 'Linux', icon: '🐧', versions: 'Ubuntu, Debian, Fedora' },
  { name: 'macOS', icon: '🍎', versions: '10.14+ to 13+' },
  { name: 'ChromeOS', icon: '🌐', versions: '80+ to 100+' },
  { name: 'BSD', icon: '🔧', versions: 'FreeBSD, OpenBSD' }
];

const SECURITY_FEATURES = [
  { icon: Lock, title: '256-bit Encryption', desc: 'Bank-level security' },
  { icon: Download, title: 'Offline Operation', desc: 'No data transmission' },
  { icon: Shield, title: 'Privacy First', desc: 'No tracking or collection' },
  { icon: Server, title: 'Secure Environment', desc: 'Isolated execution' }
];

const STATS_DATA = [
  { number: '11GB', label: 'Driver Database' },
  { number: '200+', label: 'Repair Scripts' },
  { number: '5', label: 'OS Support' },
  { number: '99.9%', label: 'Success Rate' }
];

const BADGE_DATA = [
  { icon: Shield, text: 'Military-Grade Security Certified' },
  { icon: Server, text: 'Enterprise Container Platform' },
  { icon: Clock, text: '99.9% Uptime Guarantee' },
  { icon: Users, text: 'Built by enterprise experts' }
];

// Memoized components to prevent unnecessary re-renders
const FeatureCard = memo(({ icon, text }: { icon: string; text: string }) => (
  <div className="glass-card text-center p-6 group hover:scale-105 transition-all duration-300">
    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <span className="text-white text-sm font-semibold leading-tight">{text}</span>
  </div>
));

const PlatformCard = memo(({ platform }: { platform: (typeof PLATFORM_DATA)[0] }) => (
  <div className="platform-card text-center group">
    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
      {platform.icon}
    </div>
    <h4 className="text-white font-bold text-lg mb-2">{platform.name}</h4>
    <p className="text-white/70 text-sm leading-tight">{platform.versions}</p>
  </div>
));

const SecurityFeatureCard = memo(({ feature }: { feature: (typeof SECURITY_FEATURES)[0] }) => (
  <div className="glass-card text-center group">
    <feature.icon className="w-10 h-10 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
    <h4 className="text-white font-bold text-lg mb-2">{feature.title}</h4>
    <p className="text-white/70 text-sm leading-relaxed">{feature.desc}</p>
  </div>
));

const StatCard = memo(({ stat }: { stat: (typeof STATS_DATA)[0] }) => (
  <div className="glass-card text-center p-6">
    <div className="text-3xl font-black text-white mb-2">{stat.number}</div>
    <div className="text-white/70 text-sm font-medium">{stat.label}</div>
  </div>
));

const BadgeCard = memo(({ badge }: { badge: (typeof BADGE_DATA)[0] }) => (
  <div className="glass-card text-center p-6 hover:bg-green-500/10 transition-all duration-300 group">
    <badge.icon className="w-8 h-8 text-green-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
    <span className="text-white text-sm font-semibold leading-tight">{badge.text}</span>
  </div>
));

export function Hero() {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Memoized callback to prevent recreation on every render
  const handleGetStarted = useCallback(() => {
    setIsLoading(true);
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => setIsLoading(false), 1000);
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
    <section className="hero relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float"
          style={animationStyles.delay2s}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-float"
          style={animationStyles.delay4s}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          {/* Main Headline with Enhanced Logo */}
          <div
            className={`mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-6">
              <div className="relative">
                <Image
                  src="/RescuePC-Repairs-Logo.png"
                  alt="RescuePC Repairs Logo"
                  width={60}
                  height={60}
                  className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-xl sm:rounded-2xl shadow-2xl border-2 border-blue-500/30 bg-white/10 backdrop-blur-xl p-1 sm:p-2 animate-scale-in"
                  priority
                />
                <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl sm:rounded-2xl blur-xl animate-pulse"></div>
              </div>
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight gradient-text">
                  RescuePC Repairs
                </h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed font-medium animate-fade-in mt-2">
                  Where Expertise Meets Automation
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Hero Description */}
          <div
            className={`mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="glass-card max-w-6xl mx-auto">
              <p className="text-lg sm:text-xl md:text-2xl text-white/95 leading-relaxed mb-6">
                <strong className="text-white text-xl sm:text-2xl md:text-3xl">
                  🔧 Professional Multi-Platform PC Repair Toolkit
                </strong>
              </p>
              <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed">
                with <strong className="text-white">military-grade security</strong> and{' '}
                <strong className="text-white">comprehensive driver database</strong>. Complete
                toolkit: <strong className="text-white">11GB of drivers and repair tools</strong>{' '}
                including everything you need to fix any PC.
              </p>
            </div>
          </div>

          {/* Enhanced Key Features Grid */}
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="feature-card text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-white font-bold text-xl mb-4">Multi-Platform Support</h3>
              <p className="text-white/80 text-base leading-relaxed">
                Windows, Linux, macOS, ChromeOS, BSD
              </p>
            </div>

            <div className="feature-card text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-white font-bold text-xl mb-4">Military-Grade Security</h3>
              <p className="text-white/80 text-base leading-relaxed">
                256-bit encryption & offline operation
              </p>
            </div>

            <div className="feature-card text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-white font-bold text-xl mb-4">Instant Recovery</h3>
              <p className="text-white/80 text-base leading-relaxed">Fix any PC issue in minutes</p>
            </div>
          </div>

          {/* Enhanced Professional Features */}
          <div
            className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            {FEATURE_DATA.map((feature, index) => (
              <FeatureCard key={index} icon={feature.icon} text={feature.text} />
            ))}
          </div>

          {/* Enhanced Platform Support Preview */}
          <div
            className={`mb-16 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <h3 className="text-3xl font-bold text-white mb-8 gradient-text">
              Supported Platforms
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {PLATFORM_DATA.map((platform, index) => (
                <PlatformCard key={index} platform={platform} />
              ))}
            </div>
          </div>

          {/* Enhanced Security Features */}
          <div
            className={`mb-16 transition-all duration-1000 delay-1100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <h3 className="text-3xl font-bold text-white mb-8 gradient-text">Security Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {SECURITY_FEATURES.map((feature, index) => (
                <SecurityFeatureCard key={index} feature={feature} />
              ))}
            </div>
          </div>

          {/* Enhanced CTA Section */}
          <div
            className={`mb-16 transition-all duration-1000 delay-1300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 border border-blue-400/30 rounded-3xl p-10 mb-8 backdrop-blur-xl">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6">
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">Get Your Lifetime Enterprise</h2>
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
              </div>
              <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 font-medium">
                One-time payment, lifetime access
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2">$499.99</div>
                  <div className="text-white/70 text-sm sm:text-lg">One-time payment</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-black text-white mb-2">1 License</div>
                  <div className="text-white/70 text-sm sm:text-lg">Unlimited Repairs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-black text-white mb-2">Lifetime</div>
                  <div className="text-white/70 text-sm sm:text-lg">Updates Included</div>
                </div>
              </div>

              <button
                onClick={handleGetStarted}
                disabled={isLoading}
                className="cta-button animate-glow group"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-lg">Loading...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-lg font-bold">Get Lifetime Enterprise</span>
                    <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Enhanced Trust Badges */}
          <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 transition-all duration-1000 delay-1500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            {BADGE_DATA.map((badge, index) => (
              <BadgeCard key={index} badge={badge} />
            ))}
          </div>

          {/* Enhanced Stats Section */}
          <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 transition-all duration-1000 delay-1700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            {STATS_DATA.map((stat, index) => (
              <StatCard key={index} stat={stat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

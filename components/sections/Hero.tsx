'use client';

import { useState } from 'react';
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
  Globe
} from 'lucide-react';
import Image from 'next/image';

export function Hero() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = () => {
    setIsLoading(true);
    // Scroll to pricing section
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <section className="hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Headline with Logo */}
          <div className="mb-8 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-4 mb-2">
              <Image
                src="/RescuePC Repairs Logo.png"
                alt="RescuePC Repairs Logo"
                width={64}
                height={64}
                className="rounded-full shadow-lg border border-blue-500 bg-white p-1"
                priority
              />
              <span className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight whitespace-nowrap">
                RescuePC Repairs
              </span>
            </div>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-2 font-medium">
              Where Expertise Meets Automation
            </p>
          </div>

          {/* Hero Description */}
          <div className="mb-12">
            <p className="text-lg md:text-xl text-white/90 max-w-5xl mx-auto leading-relaxed">
              <strong className="text-white">
                🔧 Professional Multi-Platform PC Repair Toolkit
              </strong>{' '}
              with <strong className="text-white">military-grade security</strong> and{' '}
              <strong className="text-white">comprehensive driver database</strong>. Complete
              toolkit: <strong className="text-white">11GB of drivers and repair tools</strong>{' '}
              including everything you need to fix any PC.
            </p>
          </div>

          {/* Key Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="feature-card text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Multi-Platform Support</h3>
              <p className="text-white/80 text-sm">Windows, Linux, macOS, ChromeOS, BSD</p>
            </div>

            <div className="feature-card text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Military-Grade Security</h3>
              <p className="text-white/80 text-sm">256-bit encryption & offline operation</p>
            </div>

            <div className="feature-card text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Instant Recovery</h3>
              <p className="text-white/80 text-sm">Fix any PC issue in minutes</p>
            </div>
          </div>

          {/* Professional Features */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {[
              { icon: '🩺', text: 'Professional diagnostics' },
              { icon: '📊', text: 'Real-time monitoring' },
              { icon: '⚙️', text: 'Advanced algorithms' },
              { icon: '⬇️', text: 'One-click drivers' },
              { icon: '🛡️', text: 'Security protection' },
              { icon: '🔧', text: 'Enterprise ready' }
            ].map((feature, index) => (
              <div key={index} className="glass-card text-center p-4">
                <div className="text-2xl mb-2">{feature.icon}</div>
                <span className="text-white text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Platform Support Preview */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">Supported Platforms</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: 'Windows', icon: '🪟', versions: '7, 8, 10, 11' },
                { name: 'Linux', icon: '🐧', versions: 'Ubuntu, Debian, Fedora' },
                { name: 'macOS', icon: '🍎', versions: '10.14+ to 13+' },
                { name: 'ChromeOS', icon: '🌐', versions: '80+ to 100+' },
                { name: 'BSD', icon: '🔧', versions: 'FreeBSD, OpenBSD' }
              ].map((platform, index) => (
                <div key={index} className="platform-card text-center">
                  <div className="text-3xl mb-2">{platform.icon}</div>
                  <h4 className="text-white font-semibold mb-1">{platform.name}</h4>
                  <p className="text-white/60 text-xs">{platform.versions}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Security Features */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">Security Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { icon: Lock, title: '256-bit Encryption', desc: 'Bank-level security' },
                { icon: Download, title: 'Offline Operation', desc: 'No data transmission' },
                { icon: Shield, title: 'Privacy First', desc: 'No tracking or collection' },
                { icon: Server, title: 'Secure Environment', desc: 'Isolated execution' }
              ].map((feature, index) => (
                <div key={index} className="glass-card text-center">
                  <feature.icon className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                  <p className="text-white/60 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mb-12">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-400/30 rounded-2xl p-8 mb-6">
              <h2 className="text-3xl font-bold text-white mb-4">Get Your Lifetime Enterprise</h2>
              <p className="text-xl text-white/90 mb-6">One-time payment, lifetime access</p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">$499.99</div>
                  <div className="text-white/60">One-time payment</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">1 License</div>
                  <div className="text-white/60">Unlimited Repairs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">Lifetime</div>
                  <div className="text-white/60">Updates Included</div>
                </div>
              </div>

              <button
                onClick={handleGetStarted}
                disabled={isLoading}
                className="cta-button animate-glow"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Loading...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Get Lifetime Enterprise
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Shield, text: 'Military-Grade Security Certified' },
              { icon: Server, text: 'Enterprise Container Platform' },
              { icon: Clock, text: '99.9% Uptime Guarantee' },
              { icon: UserCog, text: 'Built by enterprise experts' }
            ].map((badge, index) => (
              <div
                key={index}
                className="glass-card text-center p-4 hover:bg-green-500/10 transition-all duration-300"
              >
                <badge.icon className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <span className="text-white text-sm font-medium">{badge.text}</span>
              </div>
            ))}
          </div>

          {/* Urgency Section */}
          <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-400/30 rounded-2xl p-6">
            <div className="flex items-center justify-center gap-3">
              <Clock className="w-6 h-6 text-yellow-400 animate-pulse" />
              <p className="text-white text-lg font-semibold">
                <strong className="text-yellow-400">Limited Time Offer:</strong> Get professional
                multi-platform repair toolkit at current price
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

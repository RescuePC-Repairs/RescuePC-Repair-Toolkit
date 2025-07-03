'use client';

import { LicenseCTA } from '../common/LicenseCTA';
// import { motion } from 'framer-motion'
import { Shield, Download, Clock, Server, UserCog, Lock } from 'lucide-react';
import { SecurityIndicators } from './SecurityIndicators';
import { PlatformSupport } from './PlatformSupport';

export function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="text-center">
          {/* Main Headline */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              RescuePC Repairs
              <span className="block text-2xl md:text-3xl lg:text-4xl font-medium text-blue-200 mt-2">
                Complete System Recovery & Driver Management
              </span>
            </h1>
          </div>

          {/* Hero Description */}
          <div className="mb-12">
            <p className="text-lg md:text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              <strong className="text-white">
                🔧 Professional Multi-Platform PC Repair Toolkit
              </strong>{' '}
              with <strong className="text-white">military-grade security</strong> and{' '}
              <strong className="text-white">comprehensive driver database</strong>. Complete
              toolkit: <strong className="text-white">11GB of drivers and repair tools</strong>{' '}
              including everything you need to fix any PC.
              <br />
              <strong className="text-white">Full Multi-Platform Support</strong>: Windows
              (PowerShell, EXE, GUI), Linux (Ubuntu, Debian, Fedora, Arch), macOS (10.15+),
              ChromeOS, and BSD (FreeBSD, OpenBSD, NetBSD).
              <strong className="text-white"> Professional-grade software</strong> - trusted by
              technicians worldwide.
            </p>
          </div>

          {/* Hero Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="glass-card text-center">
              <div className="w-12 h-12 bg-success-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-success-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-white font-medium">
                Complete Multi-Platform Repair Toolkit - Professional-Grade Tools
              </span>
            </div>
            <div className="glass-card text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <span className="text-white font-medium">
                Full Multi-Platform Support - Windows, Linux, macOS, ChromeOS, BSD
              </span>
            </div>
            <div className="glass-card text-center">
              <div className="w-12 h-12 bg-primary-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary-400" />
              </div>
              <span className="text-white font-medium">
                Military-Grade Security - SSL Protected
              </span>
            </div>
          </div>

          {/* Professional Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
            {[
              { icon: '🩺', text: 'Professional-grade diagnostics' },
              { icon: '📊', text: 'Real-time system monitoring' },
              { icon: '⚙️', text: 'Advanced repair algorithms' },
              { icon: '⬇️', text: 'One-click driver installation' },
              { icon: '🛡️', text: 'Military-grade security protection' },
              { icon: '🔧', text: 'Enterprise scalability' }
            ].map((feature, index) => (
              <div key={index} className="glass-card text-center p-4">
                <div className="text-2xl mb-2">{feature.icon}</div>
                <span className="text-white text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Platform Support */}
          <PlatformSupport />

          {/* Security Indicators */}
          <SecurityIndicators />

          {/* CTA Button */}
          <div className="mb-12">
            <LicenseCTA variant="primary" className="mx-auto" />
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
                className="glass-card text-center p-4 hover:bg-success-500/10 transition-all duration-300"
              >
                <badge.icon className="w-8 h-8 text-success-400 mx-auto mb-2" />
                <span className="text-white text-sm font-medium">{badge.text}</span>
              </div>
            ))}
          </div>

          {/* Urgency Section */}
          <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-2xl p-6 relative overflow-hidden">
            <div className="relative z-10 text-center">
              <p className="text-white text-lg font-semibold">
                <Clock className="inline w-5 h-5 mr-2 animate-pulse text-yellow-400" />
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

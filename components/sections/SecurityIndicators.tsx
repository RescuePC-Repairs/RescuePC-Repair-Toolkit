'use client';

import { Shield, Lock, Eye, Server, CheckCircle } from 'lucide-react';
// import { motion } from 'framer-motion'

const securityFeatures = [
  {
    icon: Shield,
    title: 'Military-Grade Encryption',
    description: '256-bit AES encryption protects all data during repairs',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Lock,
    title: 'Offline Operation',
    description: 'Works completely offline - no data transmission to external servers',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Eye,
    title: 'Privacy First',
    description: 'No data collection, no tracking, complete privacy protection',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Server,
    title: 'Secure Environment',
    description: 'Runs in isolated environment with strict access controls',
    color: 'from-orange-500 to-red-500'
  }
];

export function SecurityIndicators() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-blue-900/20 to-purple-900/20"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Military-Grade Security
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Your data is protected with enterprise-level security measures
          </p>
        </div>

        {/* Mobile Security Features */}
        <div className="block md:hidden">
          <div className="space-y-6">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="glass-card p-6">
                <div className="flex items-start">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mr-4 flex-shrink-0`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-white/80 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Security Features */}
        <div className="hidden md:block">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="glass-card p-8 text-center h-full">
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-6`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Security Stats */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col sm:flex-row items-center gap-8 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-2xl px-8 py-6 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">256-bit</div>
              <div className="text-white/60 text-sm">AES Encryption</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">100%</div>
              <div className="text-white/60 text-sm">Offline Operation</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">Zero</div>
              <div className="text-white/60 text-sm">Data Collection</div>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-full px-6 py-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-white font-semibold">Certified Secure</span>
          </div>
        </div>
      </div>
    </section>
  );
}

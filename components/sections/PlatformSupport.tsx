'use client';

import { Check, MonitorIcon, Terminal, AppleIcon, Chrome, ServerIcon, Globe } from 'lucide-react';
// import { motion } from 'framer-motion'

const platforms = [
  {
    name: 'Windows',
    versions: ['Windows 7', 'Windows 8', 'Windows 10', 'Windows 11'],
    features: [
      'Full System Repair',
      'Driver Management',
      'Registry Optimization',
      'Malware Removal'
    ],
    icon: MonitorIcon,
    color: 'from-blue-500 to-cyan-500',
    emoji: '🪟'
  },
  {
    name: 'Linux',
    versions: ['Ubuntu', 'Debian', 'CentOS', 'Fedora', 'Mint'],
    features: ['System Recovery', 'Package Management', 'Boot Repair', 'Disk Management'],
    icon: Terminal,
    color: 'from-green-500 to-emerald-500',
    emoji: '🐧'
  },
  {
    name: 'macOS',
    versions: ['macOS 10.14+', 'macOS 11+', 'macOS 12+', 'macOS 13+'],
    features: ['System Maintenance', 'Disk Utility', 'Permission Repair', 'Cache Cleaning'],
    icon: AppleIcon,
    color: 'from-gray-500 to-slate-500',
    emoji: '🍎'
  },
  {
    name: 'ChromeOS',
    versions: ['ChromeOS 80+', 'ChromeOS 90+', 'ChromeOS 100+'],
    features: ['Powerwash Recovery', 'Extension Management', 'System Reset', 'Developer Mode'],
    icon: Chrome,
    color: 'from-yellow-500 to-orange-500',
    emoji: '🌐'
  },
  {
    name: 'BSD',
    versions: ['FreeBSD', 'OpenBSD', 'NetBSD'],
    features: ['System Recovery', 'Package Management', 'Boot Repair', 'Security Hardening'],
    icon: ServerIcon,
    color: 'from-red-500 to-pink-500',
    emoji: '🔧'
  }
];

export function PlatformSupport() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-yellow-900/20 to-red-900/20"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl"></div>

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mb-6">
            <Globe className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Multi-Platform Support
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Professional repair tools for all major operating systems
          </p>
        </div>

        {/* Mobile Platform Cards */}
        <div className="block md:hidden">
          <div className="space-y-6">
            {platforms.map((platform, index) => (
              <div key={index} className="platform-card p-6">
                <div className="text-center mb-6">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-r ${platform.color} flex items-center justify-center mx-auto mb-4`}
                  >
                    <span className="text-2xl">{platform.emoji}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{platform.name}</h3>
                </div>

                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3 text-center">Supported Versions:</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {platform.versions.map((version, vIndex) => (
                      <span
                        key={vIndex}
                        className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-sm border border-white/20"
                      >
                        {version}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-3 text-center">Key Features:</h4>
                  <div className="space-y-2">
                    {platform.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                        <span className="text-white/80 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Platform Cards */}
        <div className="hidden md:block">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {platforms.map((platform, index) => (
              <div key={index} className="platform-card p-8 h-full flex flex-col">
                <div className="text-center mb-6">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-r ${platform.color} flex items-center justify-center mx-auto mb-4`}
                  >
                    <span className="text-3xl">{platform.emoji}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{platform.name}</h3>
                </div>

                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3 text-center">Supported Versions:</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {platform.versions.map((version, vIndex) => (
                      <span
                        key={vIndex}
                        className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-sm border border-white/20"
                      >
                        {version}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-3 text-center">Key Features:</h4>
                  <div className="space-y-2">
                    {platform.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                        <span className="text-white/80 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Stats */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col sm:flex-row items-center gap-8 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-400/30 rounded-2xl px-8 py-6 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">5</div>
              <div className="text-white/60 text-sm">Operating Systems</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">20+</div>
              <div className="text-white/60 text-sm">OS Versions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">100%</div>
              <div className="text-white/60 text-sm">Compatibility</div>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="text-center mt-12">
          <div className="glass-card inline-block p-6">
            <p className="text-white font-semibold text-lg">
              All platforms include military-grade security and offline operation
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { Check, MonitorIcon, Terminal, AppleIcon, Chrome, ServerIcon } from 'lucide-react';
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
    icon: MonitorIcon
  },
  {
    name: 'Linux',
    versions: ['Ubuntu', 'Debian', 'CentOS', 'Fedora', 'Mint'],
    features: ['System Recovery', 'Package Management', 'Boot Repair', 'Disk Management'],
    icon: Terminal
  },
  {
    name: 'macOS',
    versions: ['macOS 10.14+', 'macOS 11+', 'macOS 12+', 'macOS 13+'],
    features: ['System Maintenance', 'Disk Utility', 'Permission Repair', 'Cache Cleaning'],
    icon: AppleIcon
  },
  {
    name: 'ChromeOS',
    versions: ['ChromeOS 80+', 'ChromeOS 90+', 'ChromeOS 100+'],
    features: ['Powerwash Recovery', 'Extension Management', 'System Reset', 'Developer Mode'],
    icon: Chrome
  },
  {
    name: 'BSD',
    versions: ['FreeBSD', 'OpenBSD', 'NetBSD'],
    features: ['System Recovery', 'Package Management', 'Boot Repair', 'Security Hardening'],
    icon: ServerIcon
  }
];

export function PlatformSupport() {
  return (
    <section className="py-16 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Multi-Platform Support</h2>
          <p className="text-lg text-white/80">
            Professional repair tools for all major operating systems
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {platforms.map((platform, index) => (
            <div key={index} className="glass-card p-6">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">
                  <platform.icon className="w-12 h-12 text-primary-400 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{platform.name}</h3>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-primary-300 mb-2">Supported Versions:</h4>
                <div className="space-y-1">
                  {platform.versions.map((version, vIndex) => (
                    <div key={vIndex} className="text-sm text-white/80">
                      • {version}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-primary-300 mb-2">Key Features:</h4>
                <div className="space-y-1">
                  {platform.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-center gap-2 text-sm text-white/80">
                      <Check className="w-4 h-4 text-primary-400 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-white/80 mb-4">
            All platforms include military-grade security and offline operation
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-white/60">
            <span>🔒 256-bit Encryption</span>
            <span>📴 Offline Operation</span>
            <span>🛡️ Military-Grade Security</span>
            <span>⚡ Instant Recovery</span>
          </div>
        </div>
      </div>
    </section>
  );
}

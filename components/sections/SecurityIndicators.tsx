'use client';

import { Shield, Lock, Eye, Server } from 'lucide-react';
// import { motion } from 'framer-motion'

const securityFeatures = [
  {
    icon: Shield,
    title: 'Military-Grade Encryption',
    description: '256-bit AES encryption protects all data during repairs'
  },
  {
    icon: Lock,
    title: 'Offline Operation',
    description: 'Works completely offline - no data transmission to external servers'
  },
  {
    icon: Eye,
    title: 'Privacy First',
    description: 'No data collection, no tracking, complete privacy protection'
  },
  {
    icon: Server,
    title: 'Secure Environment',
    description: 'Runs in isolated environment with strict access controls'
  }
];

export function SecurityIndicators() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {securityFeatures.map((feature, index) => {
        const IconComponent = feature.icon;
        return (
          <div key={index} className="flex items-center gap-3 p-3 bg-primary-800/50 rounded-lg">
            <IconComponent className="w-5 h-5 text-primary-400 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-white">{feature.title}</div>
              <div className="text-xs text-white/70">{feature.description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

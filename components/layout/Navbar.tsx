'use client';

import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Shield, Download } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '#home' },
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Support', href: '#support' },
  { name: 'About', href: '#about' }
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary-950/95 backdrop-blur-md border-b border-primary-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary-400" />
            <span className="text-xl font-bold text-white">RescuePC Repairs</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-white/80 hover:text-white transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <a href="#download" className="btn btn-primary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Now
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-800">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white/80 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <a
                href="#download"
                className="btn btn-primary flex items-center gap-2 justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Download className="w-4 h-4" />
                Download Now
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

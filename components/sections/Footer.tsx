import {
  Mail,
  Clock,
  Globe,
  Youtube,
  Twitch,
  Twitter,
  ShieldCheck,
  Heart,
  Shield,
  Phone,
  MapPin,
  ExternalLink
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="footer py-16 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black/50 to-gray-900/50"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">RescuePC Repairs</h3>
            </div>
            <p className="text-white/80 mb-6 leading-relaxed">
              Professional Windows repair toolkit with military-grade security. Lifetime license,
              24/7 support, and offline operation for maximum privacy and performance.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-white/60">
                <Mail className="w-4 h-4 mr-2" />
                <span className="text-sm">rescuepcrepair@yahoo.com</span>
              </div>
              <div className="flex items-center text-white/60">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Product</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors flex items-center group"
                >
                  <ExternalLink className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors flex items-center group"
                >
                  <ExternalLink className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors flex items-center group"
                >
                  <ExternalLink className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Knowledge Base
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors flex items-center group"
                >
                  <ExternalLink className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Download
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors flex items-center group"
                >
                  <ExternalLink className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Product Flyer
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Support</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors flex items-center group"
                >
                  <ExternalLink className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Email Support
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors flex items-center group"
                >
                  <ExternalLink className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Support Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors flex items-center group"
                >
                  <ExternalLink className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors flex items-center group"
                >
                  <ExternalLink className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Legal</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors flex items-center group"
                >
                  <ExternalLink className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors flex items-center group"
                >
                  <ExternalLink className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors flex items-center group"
                >
                  <ExternalLink className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Compliance</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors flex items-center group"
                >
                  <ExternalLink className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  License
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors flex items-center group"
                >
                  <ExternalLink className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors flex items-center group"
                >
                  <ExternalLink className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  GDPR
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-lg font-semibold text-white mb-6">Contact Information</h4>
            <div className="space-y-4">
              <div className="flex items-center text-white/70">
                <Mail className="w-4 h-4 mr-3" />
                <span>rescuepcrepair@yahoo.com</span>
              </div>
              <div className="flex items-center text-white/70">
                <Phone className="w-4 h-4 mr-3" />
                <span>24/7 Support Available</span>
              </div>
              <div className="flex items-center text-white/70">
                <Globe className="w-4 h-4 mr-3" />
                <span>Worldwide Service</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-white/80 text-sm">
                © 2024 RescuePC Repairs. All rights reserved.
              </p>
              <p className="text-white/60 text-xs mt-1">Built for Windows users worldwide</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-white/60">
                <Heart className="w-4 h-4 mr-2 text-red-400" />
                <span className="text-sm">Made with ❤️ for PC users</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

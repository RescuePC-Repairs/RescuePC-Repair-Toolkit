import {
  Mail,
  Clock,
  Globe,
  Youtube,
  Twitch,
  Twitter,
  ShieldCheck,
  Heart,
  Shield
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-primary-950/90 backdrop-blur-xl border-t border-primary-800 text-white pt-12 pb-6 mt-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between gap-8 mb-8">
          {/* Company Info */}
          <div className="min-w-[220px] max-w-xs flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-primary-400" />
              <div>
                <div className="text-xl font-bold text-white">RescuePC</div>
                <div className="text-sm text-primary-300">Repairs</div>
              </div>
            </div>
            <p className="text-white/80 mb-4">
              Professional Windows repair toolkit trusted by thousands worldwide. Military-grade
              security, lifetime license, 24/7 support.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.youtube.com/@RescuePC-Repairs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="hover:text-red-500"
              >
                <Youtube size={22} />
              </a>
              <a
                href="https://www.twitch.tv/rescuepc_repairs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitch"
                className="hover:text-purple-400"
              >
                <Twitch size={22} />
              </a>
              <a
                href="https://x.com/RescuePCRepair"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter/X"
                className="hover:text-blue-400"
              >
                <Twitter size={22} />
              </a>
            </div>
          </div>
          {/* Product Links */}
          <div className="min-w-[180px] flex-1">
            <h4 className="font-bold mb-3">Product</h4>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="hover:underline">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:underline">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/Knowledge-Base.html" className="hover:underline">
                  Knowledge Base
                </a>
              </li>
              <li>
                <a href="#download" className="hover:underline">
                  Download
                </a>
              </li>
              <li>
                <a
                  href="/docs/RescuePC Repairs Flyer.pdf"
                  target="_blank"
                  rel="noopener"
                  className="hover:underline"
                >
                  Product Flyer
                </a>
              </li>
            </ul>
          </div>
          {/* Support Links */}
          <div className="min-w-[180px] flex-1">
            <h4 className="font-bold mb-3">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:***REMOVED***" className="hover:underline">
                  Email Support
                </a>
              </li>
              <li>
                <a href="/support.html" className="hover:underline">
                  Support Center
                </a>
              </li>
              <li>
                <a href="/Knowledge-Base.html" className="hover:underline">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:underline">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          {/* Legal Links */}
          <div className="min-w-[180px] flex-1">
            <h4 className="font-bold mb-3">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="/PrivacyPolicy.html" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/TermsOfService.html" className="hover:underline">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/RefundPolicy.html" className="hover:underline">
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="/License.html" className="hover:underline">
                  License
                </a>
              </li>
              <li>
                <a href="/CookiePolicy.html" className="hover:underline">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="/GDPR.html" className="hover:underline">
                  GDPR
                </a>
              </li>
            </ul>
          </div>
          {/* Contact Info */}
          <div className="min-w-[180px] flex-1">
            <h4 className="font-bold mb-3">Contact</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail size={18} />
                <a href="mailto:***REMOVED***" className="hover:underline">
                  ***REMOVED***
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>24/7 Support Available</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe size={18} />
                <span>Worldwide Service</span>
              </div>
            </div>
          </div>
        </div>
        {/* Footer Bottom */}
        <div className="border-t border-primary-800 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-white/70">
          <p>&copy; 2024 RescuePC Repairs. All rights reserved.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <span className="flex items-center gap-1">
              <Heart size={14} className="text-red-400" /> Built for Windows users worldwide
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-success-400" /> Trusted by 10,000+ customers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

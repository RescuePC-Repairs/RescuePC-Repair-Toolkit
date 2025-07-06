import { Zap, Headphones, Infinity, Shield, WifiOff } from 'lucide-react';
// import { motion } from 'framer-motion'

const features = [
  {
    icon: Zap,
    title: '⚡ Instant Repair',
    description:
      'Fix Windows issues in minutes with our automated repair toolkit. No technical knowledge required—just click and repair.',
    benefits: ['One-click system repair', 'Automatic issue detection', 'Zero configuration needed']
  },
  {
    icon: Shield,
    title: '🛡️ Military-Grade Security',
    description:
      'Advanced security protocols protect your data during repairs. Bank-level encryption ensures your privacy is never compromised.',
    benefits: ['256-bit encryption', 'Offline operation', 'No data collection']
  },
  {
    icon: Infinity,
    title: '♾️ Lifetime License',
    description:
      'One-time payment, lifetime access to all updates and features. No subscriptions, no hidden fees—ever.',
    benefits: ['Free lifetime updates', 'Unlimited PC usage', 'No recurring costs']
  },
  {
    icon: Shield,
    title: '🛠️ Complete Toolkit',
    description:
      'Everything you need to repair, optimize, and maintain your Windows PC. Over 50 professional-grade tools in one package.',
    benefits: ['System optimization', 'Malware removal', 'Registry cleaning']
  },
  {
    icon: WifiOff,
    title: '📴 Works Offline',
    description:
      'No internet required for repairs. Works completely offline for maximum security and privacy protection.',
    benefits: ['100% offline operation', 'Air-gapped security', 'Privacy guaranteed']
  },
  {
    icon: Headphones,
    title: '🎧 24/7 Support',
    description:
      'Expert support available around the clock to help you with any issues. Real humans, not chatbots.',
    benefits: ['Live chat support', 'Email assistance', 'Phone support']
  }
];

const showcaseStats = [
  { number: '50+', label: 'Repair Tools' },
  { number: '99.9%', label: 'Success Rate' },
  { number: '5min', label: 'Average Repair Time' }
];

export function FeatureCards() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Why Choose RescuePC Repairs?
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            The most comprehensive Windows repair toolkit for professionals, businesses, and home
            users. Fast, secure, and easy to use—no technical knowledge required.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card transform hover:scale-[1.02] transition-all duration-300"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-4">{feature.description}</p>
              </div>

              <ul className="space-y-2">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center text-white/70 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"></div>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-2xl px-8 py-6 backdrop-blur-sm">
            {showcaseStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">{stat.number}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

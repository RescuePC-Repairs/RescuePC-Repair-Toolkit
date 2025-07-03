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
    <section className="relative py-24 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose RescuePC Repairs?</h2>
          <p className="text-lg text-white/80">
            The most comprehensive Windows repair toolkit trusted by thousands worldwide
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="glass-card p-8 flex flex-col items-center text-center shadow-glass-lg"
              >
                <div className="mb-4">
                  <IconComponent className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/90 mb-4">{feature.description}</p>
                <ul className="text-white/80 text-left mx-auto space-y-1 mb-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-success-400 rounded-full"></span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        {/* Features Showcase */}
        <div className="glass-card flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-12">
          <div className="flex-1 mb-8 md:mb-0">
            <h3 className="text-2xl font-bold mb-2">Complete System Repair</h3>
            <p className="text-white/80 mb-6">
              Our toolkit handles everything from blue screen errors to malware infections. With
              over 50 repair modules, RescuePC can fix any Windows issue automatically.
            </p>
            <div className="flex gap-8">
              {showcaseStats.map((stat, i) => (
                <div key={i} className="text-center">
                  <span className="block text-3xl font-bold text-success-400 mb-1">
                    {stat.number}
                  </span>
                  <span className="block text-white/70 text-sm">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src="/assets/RescuePC_GUI.png"
              alt="RescuePC Repairs Interface Screenshot"
              className="rounded-xl shadow-glass-lg w-full max-w-md"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

import { PRICING_CONFIG, formatPrice } from '../../config/pricing';
import { LicenseCTA } from '../common/LicenseCTA';

export function PricingSection() {
  return (
    <section className="relative py-24 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-12">
          License Types & Pricing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(PRICING_CONFIG.tiers).map(([key, license]) => (
            <div
              key={key}
              className={`glass-card p-8 flex flex-col items-center text-center shadow-glass-lg ${license.popular ? 'border-2 border-success-500 scale-105' : ''} ${license.enterprise ? 'border-2 border-blue-700' : ''}`}
            >
              {license.popular && (
                <span className="mt-2 mb-4 inline-block px-3 py-1 bg-success-500/80 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                  Most Popular
                </span>
              )}
              {license.enterprise && !license.popular && (
                <span className="mt-2 mb-4 inline-block px-3 py-1 bg-blue-700/80 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                  Enterprise
                </span>
              )}
              <h3 className="text-2xl font-semibold text-white mb-2">{license.name}</h3>
              <div className="text-4xl font-bold text-success-400 mb-2">
                {formatPrice(license.price)}
              </div>
              <div className="text-sm text-blue-200 mb-4">
                {license.interval === 'once' ? 'Lifetime Access' : 'Annual License'}
              </div>
              <ul className="text-white/90 text-left mb-6 space-y-2">
                {license.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-success-400 rounded-full"></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <LicenseCTA licenseId={key} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';
// import { motion } from 'framer-motion'
import { Check, Shield, Zap } from 'lucide-react';
import { getLicenseById, formatPrice } from '../../config/pricing';

interface LicenseCTAProps {
  licenseId?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'enterprise';
}

export function LicenseCTA({
  licenseId = 'lifetime_enterprise',
  className = '',
  variant = 'primary'
}: LicenseCTAProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const license = getLicenseById(licenseId);

  if (!license) {
    console.error(`License not found: ${licenseId}`);
    return null;
  }

  const handlePurchase = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          licenseId: licenseId,
          priceId: license.stripePaymentLink,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/pricing`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await loadStripe(process.env['NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY']!);
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Purchase failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'enterprise':
        return 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800';
      case 'secondary':
        return 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800';
      default:
        return 'bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700';
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="glass-card p-6 text-center shadow-glass-lg">
        <div className="mb-4">
          <Shield className="w-12 h-12 text-primary-400 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-white mb-2">Get Your {license.name}</h3>
          <p className="text-white/80 mb-4">
            {license.interval === 'once'
              ? 'One-time payment, lifetime access'
              : 'Annual subscription with full features'}
          </p>
        </div>

        <div className="mb-6">
          <div className="text-3xl font-bold text-primary-400 mb-2">
            {formatPrice(license.price)}
          </div>
          <div className="text-sm text-white/60 mb-4">
            {license.interval === 'once' ? 'One-time payment' : 'Per year'}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {license.features.slice(0, 4).map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-white/80">
              <Check className="w-4 h-4 text-success-400" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className={`
            btn btn-primary w-full mb-4
            ${getVariantStyles()}
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
          `}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              <span>Get {license.name}</span>
            </>
          )}
        </button>

        {/* Error Display */}
        {error && <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">{error}</div>}

        {/* Security Badge */}
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
          <Shield className="w-4 h-4" />
          <span>256-bit SSL Encryption</span>
        </div>
      </div>

      {/* Urgency Badge */}
      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
        Limited Time
      </div>
    </div>
  );
}

// Stripe loader function
async function loadStripe(publishableKey: string) {
  if (typeof window === 'undefined') return null;

  try {
    const { loadStripe } = await import('@stripe/stripe-js');
    return await loadStripe(publishableKey);
  } catch (error) {
    console.error('Failed to load Stripe:', error);
    return null;
  }
}

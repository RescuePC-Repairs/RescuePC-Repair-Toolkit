import React from 'react';
import Image from 'next/image';
import { Hero } from '@/components/sections/Hero';
import { FeatureCards } from '@/components/sections/FeatureCards';
import { PricingSection } from '@/components/sections/PricingSection';
import { TestimonialCarousel } from '@/components/sections/TestimonialCarousel';
import { FAQAccordion } from '@/components/sections/FAQAccordion';
import { SecurityIndicators } from '@/components/sections/SecurityIndicators';
import { PlatformSupport } from '@/components/sections/PlatformSupport';
import { Footer } from '@/components/sections/Footer';
import { AlertTriangle } from 'lucide-react';

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';

// PAYMENT CONFIGURATION - COMPLETE AUTOMATION SYSTEM
interface PaymentPackage {
  name: string;
  price: number;
  licenses: number | string;
  stripePriceId: string;
  stripePaymentLink: string;
  features: string[];
  description: string;
  popular?: boolean;
  enterprise?: boolean;
}

const PAYMENT_PACKAGES: Record<string, PaymentPackage> = {
  basic: {
    name: 'Basic License',
    price: 49.99,
    licenses: 1,
    stripePriceId: 'price_basic_license',
    stripePaymentLink: 'https://buy.stripe.com/5kQfZggMacypcSl9wP08g05',
    features: ['Single PC Repair', 'Basic Support', '1 Year Updates', 'Email Support'],
    description: 'Perfect for individual users'
  },
  professional: {
    name: 'Professional License',
    price: 199.99,
    licenses: 5,
    stripePriceId: 'price_professional_license',
    stripePaymentLink: 'https://buy.stripe.com/00wcN4dzY0PHaKdfVd08g04',
    features: ['5 PC Repairs', 'Priority Support', '1 Year Updates', 'Phone Support', 'API Access'],
    description: 'Great for small businesses',
    popular: true
  },
  enterprise: {
    name: 'Enterprise License',
    price: 499.99,
    licenses: 25,
    stripePriceId: 'price_enterprise_license',
    stripePaymentLink: 'https://buy.stripe.com/4gM8wO53s1TLaKd9wP08g02',
    features: [
      '25 PC Repairs',
      '24/7 Support',
      '5 Year Updates',
      'Custom Integration',
      'SLA Guarantee'
    ],
    description: 'Ideal for medium to large businesses'
  },
  government: {
    name: 'Government License',
    price: 999.99,
    licenses: 100,
    stripePriceId: 'price_government_license',
    stripePaymentLink: 'https://buy.stripe.com/9B64gy1Rgcyp19DdN508g03',
    features: [
      '100 PC Repairs',
      'Compliance Features',
      'Audit Logging',
      'Dedicated Manager',
      'On-site Support'
    ],
    description: 'Designed for government agencies'
  },
  lifetime: {
    name: 'Lifetime Enterprise',
    price: 499.99,
    licenses: 'Unlimited',
    stripePriceId: 'price_lifetime_enterprise',
    stripePaymentLink: 'https://buy.stripe.com/eVq3cu0Nc8i97y1aAT08g01',
    features: [
      'Unlimited PC Repairs',
      'Lifetime Updates',
      'Source Code Access',
      'White Label Option',
      'Custom Features'
    ],
    description: 'One-time payment, lifetime access',
    enterprise: true
  }
};

export default function HomePage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Error Alert for Invalid Payment */}
      {searchParams.error === 'invalid_payment' && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <h3 className="text-sm font-semibold text-red-800">Access Denied</h3>
                <p className="text-sm text-red-700">
                  This page requires a valid payment verification. Please complete your purchase to
                  access this content.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Hero />
      <FeatureCards />
      <PricingSection />
      <TestimonialCarousel />
      <FAQAccordion />
      <SecurityIndicators />
      <PlatformSupport />
      <Footer />
    </div>
  );
}

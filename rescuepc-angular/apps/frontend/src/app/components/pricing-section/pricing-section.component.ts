import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Plan interface for type safety
interface Plan {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  period: string;
  description: string;
  features: string[];
  icon: string;
  color: string;
  popular: boolean;
  stripeLink: string;
}

// Trust indicator interface
interface TrustIndicator {
  icon: string;
  text: string;
  desc: string;
}

// FAQ interface
interface FAQ {
  question: string;
  answer: string;
}

// Comparison row interface
interface ComparisonRow {
  feature: string;
  basic: string;
  pro: string;
  enterprise: string;
  government: string;
  lifetime: string;
}

@Component({
  selector: 'app-pricing-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing-section.component.html',
  styleUrls: ['./pricing-section.component.css'],
})
export class PricingSectionComponent implements OnInit {
  isVisible = false;

  // Direct Stripe Payment Links - Updated with correct prices and links
  plans: Plan[] = [
    {
      id: 'basic',
      name: 'Basic License',
      price: '$49.99',
      originalPrice: '$99.99',
      period: 'year',
      description: 'Perfect for individual users and small repairs',
      features: [
        'Multi-platform support (Windows, Linux, macOS)',
        'Basic diagnostics and repair tools',
        'Driver database access',
        'Email support',
        '1-year updates included',
        'Standard security features',
      ],
      icon: 'shield',
      color: 'from-blue-500 to-blue-600',
      popular: false,
      stripeLink: 'https://buy.stripe.com/5kQfZggMacypcSl9wP08g05',
    },
    {
      id: 'professional',
      name: 'Professional License',
      price: '$199.99',
      originalPrice: '$399.99',
      period: 'year',
      description: 'Advanced features for IT professionals',
      features: [
        'Everything in Basic, plus:',
        'Advanced diagnostic algorithms',
        'Automated repair scripts',
        'Priority email support',
        '3-year updates included',
        'Enhanced security protocols',
        'Remote repair capabilities',
        'Custom repair profiles',
      ],
      icon: 'zap',
      color: 'from-purple-500 to-purple-600',
      popular: false,
      stripeLink: 'https://buy.stripe.com/00wcN4dzY0PHaKdfVd08g04',
    },
    {
      id: 'enterprise',
      name: 'Enterprise License',
      price: '$499.99',
      originalPrice: '$999.99',
      period: 'year',
      description: 'Ultimate solution for enterprise environments',
      features: [
        'Everything in Professional, plus:',
        'Military-grade 256-bit encryption',
        'Lifetime updates and support',
        'Enterprise container platform',
        'Advanced automation tools',
        'Multi-device management',
        'Custom deployment options',
        'Priority phone support',
        'White-label licensing',
        'API access for integration',
      ],
      icon: 'crown',
      color: 'from-yellow-500 via-orange-500 to-red-500',
      popular: true,
      stripeLink: 'https://buy.stripe.com/4gM8wO53s1TLaKd9wP08g02',
    },
    {
      id: 'government',
      name: 'Government License',
      price: '$999.99',
      originalPrice: '$1999.99',
      period: 'year',
      description: 'Specialized for government and military use',
      features: [
        'Everything in Enterprise, plus:',
        'Government compliance features',
        'Military-grade security protocols',
        'Custom deployment for government networks',
        'Dedicated support team',
        'Compliance documentation',
        'Audit trail capabilities',
        'Multi-site licensing',
      ],
      icon: 'lock',
      color: 'from-green-500 to-green-600',
      popular: false,
      stripeLink: 'https://buy.stripe.com/9B64gy1Rgcyp19DdN508g03',
    },
    {
      id: 'lifetime',
      name: 'Lifetime Enterprise Package',
      price: '$499.99',
      originalPrice: '$999.99',
      period: 'one-time',
      description: 'One-time payment for lifetime access',
      features: [
        'Everything in Enterprise, plus:',
        'Lifetime access to all features',
        'No recurring payments',
        'Lifetime updates and support',
        'Transferable license',
        'Priority lifetime support',
        'Early access to new features',
        'Lifetime API access',
      ],
      icon: 'sparkles',
      color: 'from-indigo-500 to-purple-600',
      popular: false,
      stripeLink: 'https://buy.stripe.com/eVq3cu0Nc8i97y1aAT08g01',
    },
  ];

  trustIndicators: TrustIndicator[] = [
    {
      icon: 'shield',
      text: 'Military-Grade Security',
      desc: '256-bit encryption',
    },
    {
      icon: 'users',
      text: 'Trusted by 10,000+ Users',
      desc: 'Enterprise verified',
    },
    { icon: 'clock', text: 'Instant Download', desc: 'No waiting time' },
    { icon: 'trending-up', text: '99.9% Success Rate', desc: 'Proven results' },
  ];

  comparisonRows: ComparisonRow[] = [
    {
      feature: 'Multi-Platform Support',
      basic: '✓',
      pro: '✓',
      enterprise: '✓',
      government: '✓',
      lifetime: '✓',
    },
    {
      feature: 'Military-Grade Security',
      basic: 'Basic',
      pro: 'Enhanced',
      enterprise: 'Full',
      government: 'Military',
      lifetime: 'Full',
    },
    {
      feature: 'Automated Repairs',
      basic: '✗',
      pro: '✓',
      enterprise: '✓',
      government: '✓',
      lifetime: '✓',
    },
    {
      feature: 'Lifetime Updates',
      basic: '1 Year',
      pro: '3 Years',
      enterprise: 'Lifetime',
      government: 'Lifetime',
      lifetime: 'Lifetime',
    },
    {
      feature: 'Priority Support',
      basic: 'Email',
      pro: 'Email',
      enterprise: 'Phone + Email',
      government: 'Dedicated',
      lifetime: 'Priority',
    },
    {
      feature: 'API Access',
      basic: '✗',
      pro: '✗',
      enterprise: '✓',
      government: '✓',
      lifetime: '✓',
    },
    {
      feature: 'White-Label License',
      basic: '✗',
      pro: '✗',
      enterprise: '✓',
      government: '✓',
      lifetime: '✓',
    },
    {
      feature: 'Government Compliance',
      basic: '✗',
      pro: '✗',
      enterprise: '✗',
      government: '✓',
      lifetime: '✗',
    },
    {
      feature: 'Transferable License',
      basic: '✗',
      pro: '✗',
      enterprise: '✗',
      government: '✗',
      lifetime: '✓',
    },
  ];

  faqs: FAQ[] = [
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards, PayPal, and Apple Pay. All payments are processed securely through Stripe.',
    },
    {
      question: 'Is there a money-back guarantee?',
      answer:
        "Yes! We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your purchase, no questions asked.",
    },
    {
      question: 'How long does delivery take?',
      answer:
        "Instant! You'll receive your license key and download link immediately after payment confirmation.",
    },
    {
      question: 'Do you offer technical support?',
      answer:
        'Absolutely! Enterprise customers get priority phone support, while all customers receive email support.',
    },
  ];

  ngOnInit(): void {
    // Trigger animation after component loads
    setTimeout(() => {
      this.isVisible = true;
    }, 100);
  }

  handlePurchase(stripeLink: string): void {
    window.open(stripeLink, '_blank');
  }

  calculateSavings(originalPrice: string, currentPrice: string): number {
    const original = parseFloat(originalPrice.replace('$', ''));
    const current = parseFloat(currentPrice.replace('$', ''));
    return Math.round(((original - current) / original) * 100);
  }

  getIconClass(icon: string): string {
    const iconMap: { [key: string]: string } = {
      shield: 'fas fa-shield-alt',
      zap: 'fas fa-bolt',
      crown: 'fas fa-crown',
      lock: 'fas fa-lock',
      sparkles: 'fas fa-star',
      users: 'fas fa-users',
      clock: 'fas fa-clock',
      'trending-up': 'fas fa-chart-line',
      award: 'fas fa-award',
      check: 'fas fa-check',
    };
    return iconMap[icon] || 'fas fa-circle';
  }
}

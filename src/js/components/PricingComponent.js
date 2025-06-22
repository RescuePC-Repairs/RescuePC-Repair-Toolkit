/**
 * @fileoverview Pricing Component
 * Handles the pricing section
 */

export default class PricingComponent {
  constructor(element, options = {}) {
    this.element = element;
    this.app = options.app;
    this.logger = options.logger;
  }

  async init() {
    try {
      // Load pricing HTML content
      const response = await fetch('/src/components/Sections/Pricing.html');
      if (response.ok) {
        const html = await response.text();
        this.element.innerHTML = html;
        this.setupEventListeners();
        this.logger?.info('Pricing component initialized');
      } else {
        // Fallback pricing
        this.createFallbackPricing();
      }
    } catch (error) {
      this.logger?.error('Pricing component initialization failed', error);
      this.createFallbackPricing();
    }
  }

  createFallbackPricing() {
    this.element.innerHTML = `
      <section class="pricing" id="pricing" role="region" aria-labelledby="pricing-title">
        <div class="container">
          <div class="section-header">
            <h2 id="pricing-title" class="section-title">Simple, Transparent Pricing</h2>
            <p class="section-subtitle">One-time purchase, lifetime value</p>
          </div>
          <div class="pricing__grid">
            <div class="pricing-card card">
              <div class="pricing-card__header">
                <h3 class="pricing-card__title">RescuePC Toolkit</h3>
                <div class="pricing-card__price">
                  <span class="currency">$</span>
                  <span class="amount">79</span>
                  <span class="period">.99</span>
                </div>
                <p class="pricing-card__subtitle">One-time purchase</p>
              </div>
              <div class="pricing-card__features">
                <ul>
                  <li><i class="fas fa-check"></i> Complete Windows Repair Suite</li>
                  <li><i class="fas fa-check"></i> Virus & Malware Removal</li>
                  <li><i class="fas fa-check"></i> System Optimization Tools</li>
                  <li><i class="fas fa-check"></i> Data Recovery Features</li>
                  <li><i class="fas fa-check"></i> 24/7 Technical Support</li>
                  <li><i class="fas fa-check"></i> Lifetime Updates</li>
                  <li><i class="fas fa-check"></i> 30-Day Money Back Guarantee</li>
                </ul>
              </div>
              <div class="pricing-card__footer">
                <a href="#download" class="btn btn--primary btn--large">
                  <i class="fas fa-download"></i>
                  Download Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Add scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, {
      threshold: 0.1
    });

    const pricingCard = this.element.querySelector('.pricing-card');
    if (pricingCard) {
      observer.observe(pricingCard);
    }

    // CTA button interaction
    const ctaButton = this.element.querySelector('.btn');
    if (ctaButton) {
      ctaButton.addEventListener('click', (e) => {
        if (ctaButton.href && ctaButton.href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(ctaButton.getAttribute('href'));
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    }
  }

  destroy() {
    // Cleanup if needed
  }
} 
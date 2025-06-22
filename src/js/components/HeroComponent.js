/**
 * @fileoverview Hero Component
 * Handles the main hero section with call-to-action
 */

export default class HeroComponent {
  constructor(element, options = {}) {
    this.element = element;
    this.app = options.app;
    this.logger = options.logger;
  }

  async init() {
    try {
      // Load hero HTML content
      const response = await fetch('/src/components/Sections/Hero.html');
      if (response.ok) {
        const html = await response.text();
        this.element.innerHTML = html;
        this.setupEventListeners();
        this.logger?.info('Hero component initialized');
      } else {
        // Fallback hero
        this.createFallbackHero();
      }
    } catch (error) {
      this.logger?.error('Hero component initialization failed', error);
      this.createFallbackHero();
    }
  }

  createFallbackHero() {
    this.element.innerHTML = `
      <section class="hero" role="banner">
        <div class="container">
          <div class="hero__content">
            <h1 class="hero__title">
              Professional Windows Repair Toolkit
            </h1>
            <p class="hero__subtitle">
              Fix, optimize, and secure your Windows PC with our comprehensive repair solution. 
              Available worldwide with 24/7 support.
            </p>
            <div class="hero__cta">
              <a href="#download" class="btn btn--primary btn--large">
                <i class="fas fa-download"></i>
                Download Now - $79.99
              </a>
              <a href="#features" class="btn btn--secondary btn--large">
                <i class="fas fa-play"></i>
                See Features
              </a>
            </div>
          </div>
          <div class="hero__image">
            <img src="/assets/hero-image-800.jpg" alt="RescuePC Repair Interface" loading="eager">
          </div>
        </div>
      </section>
    `;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // CTA button interactions
    const ctaButtons = this.element.querySelectorAll('.btn');
    ctaButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        if (button.href && button.href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(button.getAttribute('href'));
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });

    // Add scroll animation trigger
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    });

    const heroContent = this.element.querySelector('.hero__content');
    if (heroContent) {
      observer.observe(heroContent);
    }
  }

  destroy() {
    // Cleanup if needed
  }
} 
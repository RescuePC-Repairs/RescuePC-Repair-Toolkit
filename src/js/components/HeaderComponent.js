/**
 * @fileoverview Header Component
 * Handles the main navigation header
 */

export default class HeaderComponent {
  constructor(element, options = {}) {
    this.element = element;
    this.app = options.app;
    this.logger = options.logger;
  }

  async init() {
    try {
      // Load header HTML content
      const response = await fetch('/src/components/Layout/Header.html');
      if (response.ok) {
        const html = await response.text();
        this.element.innerHTML = html;
        this.setupEventListeners();
        this.logger?.info('Header component initialized');
      } else {
        // Fallback header
        this.createFallbackHeader();
      }
    } catch (error) {
      this.logger?.error('Header component initialization failed', error);
      this.createFallbackHeader();
    }
  }

  createFallbackHeader() {
    this.element.innerHTML = `
      <header class="header">
        <div class="container">
          <div class="header__container">
            <div class="header__logo">
              <img src="/assets/RescuePC_Logo_Light.png" alt="RescuePC Repairs" width="150" height="40">
            </div>
            <nav class="header__nav" role="navigation" aria-label="Main navigation">
              <a href="#features" class="header__nav-link">Features</a>
              <a href="#pricing" class="header__nav-link">Pricing</a>
              <a href="#support" class="header__nav-link">Support</a>
              <a href="#download" class="btn btn--primary">Download Now</a>
            </nav>
          </div>
        </div>
      </header>
    `;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Mobile menu toggle
    const mobileToggle = this.element.querySelector('.mobile-menu-toggle');
    const nav = this.element.querySelector('.header__nav');
    
    if (mobileToggle && nav) {
      mobileToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
      });
    }

    // Smooth scroll for navigation links
    const navLinks = this.element.querySelectorAll('.header__nav-link[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  destroy() {
    // Cleanup if needed
  }
} 
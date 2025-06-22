/**
 * RescuePC Repairs - Main Application
 * ==================================
 * Entry point for the refactored application
 * Coordinates all components and handles initialization
 */

import { loadContent } from './utils/content-loader.js';

/**
 * Main Application Class
 */
class RescuePCApp {
  constructor() {
    this.components = new Map();
    this.content = null;
    this.isInitialized = false;
    this.mobileMenuOpen = false;
    
    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      console.log('🚀 Initializing RescuePC Repairs...');
      
      // Setup error handling first
      this.setupErrorBoundary();
      
      // Show loading state
      this.showLoading();
      
      // Load content and initialize components
      await this.loadApplicationContent();
      await this.initializeComponents();
      this.setupEventListeners();
      
      // Initialize utilities
      this.initializeUtilities();
      
      // Hide loading state
      this.hideLoading();
      
      // Mark as initialized
      this.isInitialized = true;
      
      console.log('✅ RescuePC Repairs initialized successfully');
      
      // Dispatch ready event
      this.dispatchReadyEvent();
      
    } catch (error) {
      console.error('❌ Application initialization failed:', error);
      this.handleInitializationError(error);
    }
  }

  /**
   * Setup error boundary
   */
  setupErrorBoundary() {
    // Global error handler
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      this.showError('An unexpected error occurred');
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.showError('A network or loading error occurred');
    });
  }

  /**
   * Load application content
   */
  async loadApplicationContent() {
    try {
      this.content = await loadContent();
      console.log('📄 Content loaded successfully');
    } catch (error) {
      console.warn('⚠️ Failed to load content, using fallback');
      // Content loader handles fallback automatically
      this.content = await loadContent(); // Will return fallback content
    }
  }

  /**
   * Initialize all components
   */
  async initializeComponents() {
    const componentPromises = [];
    
    // Initialize sections with content
    componentPromises.push(this.initializeFeaturesSection());
    componentPromises.push(this.initializeTestimonialsSection());
    componentPromises.push(this.initializePricingSection());
    componentPromises.push(this.initializeFAQSection());
    
    // Wait for all components to initialize
    await Promise.allSettled(componentPromises);
    console.log('🧩 All components initialized');
  }

  /**
   * Initialize Features Section
   */
  async initializeFeaturesSection() {
    const featuresGrid = document.querySelector('.features__grid');
    if (!featuresGrid || !this.content?.features) return;

    const { features } = this.content;
    
    featuresGrid.className = 'features__grid grid grid--auto-fit gap-lg';
    featuresGrid.innerHTML = features.items.map(feature => `
      <div class="feature-card" role="listitem">
        <div class="feature-card__icon" aria-hidden="true">
          ${feature.icon}
        </div>
        <h3 class="feature-card__title">
          ${feature.title}
        </h3>
        <p class="feature-card__description">
          ${feature.description}
        </p>
      </div>
    `).join('');
  }

  /**
   * Initialize Testimonials Section
   */
  async initializeTestimonialsSection() {
    const testimonialsGrid = document.querySelector('.testimonials__grid');
    if (!testimonialsGrid || !this.content?.testimonials) return;

    const { testimonials } = this.content;
    
    testimonialsGrid.className = 'testimonials__grid grid grid--auto-fit gap-lg';
    testimonialsGrid.innerHTML = testimonials.map(testimonial => `
      <div class="testimonial-card" role="listitem">
        <div class="testimonial-card__rating" aria-label="${testimonial.rating} out of 5 stars">
          ${Array(testimonial.rating).fill('⭐').join('')}
        </div>
        <blockquote class="testimonial-card__text">
          "${testimonial.text}"
        </blockquote>
        <div class="testimonial-card__author">
          <div class="testimonial-card__avatar">
            <span class="avatar-initials">${testimonial.initials}</span>
          </div>
          <div class="testimonial-card__details">
            <cite class="testimonial-card__name">${testimonial.author}</cite>
            <span class="testimonial-card__role">${testimonial.role}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  /**
   * Initialize Pricing Section
   */
  async initializePricingSection() {
    const pricingCard = document.querySelector('.pricing__card');
    if (!pricingCard || !this.content?.pricing) return;

    const { pricing } = this.content;
    
    pricingCard.innerHTML = `
      <div class="pricing-card">
        <div class="pricing-card__header">
          <h3 class="pricing-card__title">${pricing.title}</h3>
          <p class="pricing-card__subtitle">${pricing.subtitle}</p>
          <div class="pricing-card__price">
            <span class="pricing-card__currency">$</span>
            <span class="pricing-card__amount">79</span>
            <span class="pricing-card__cents">.99</span>
          </div>
          <p class="pricing-card__description">${pricing.description}</p>
        </div>
        
        <div class="pricing-card__features">
          <ul class="pricing-features" role="list">
            ${pricing.features.map(feature => `
              <li class="pricing-features__item">
                <i class="fas fa-check" aria-hidden="true"></i>
                <span>${feature}</span>
              </li>
            `).join('')}
          </ul>
        </div>
        
        <div class="pricing-card__footer">
          <a href="https://buy.stripe.com/9AQ14m53s8i97y0110" 
             class="btn btn--primary btn--lg btn--block"
             target="_blank" 
             rel="noopener noreferrer"
             aria-describedby="secure-payment-info">
            <i class="fas fa-download" aria-hidden="true"></i>
            <span>${pricing.cta}</span>
          </a>
          <p class="pricing-card__guarantee" id="secure-payment-info">
            <i class="fas fa-shield-alt" aria-hidden="true"></i>
            ${pricing.guarantee}
          </p>
        </div>
      </div>
    `;
  }

  /**
   * Initialize FAQ Section
   */
  async initializeFAQSection() {
    const faqList = document.querySelector('.faq__list');
    if (!faqList || !this.content?.faq) return;

    const { faq } = this.content;
    
    faqList.innerHTML = faq.map((item, index) => `
      <div class="faq-item" role="listitem">
        <button class="faq-item__question" 
                aria-expanded="false" 
                aria-controls="faq-answer-${index}"
                id="faq-question-${index}">
          <span class="faq-item__question-text">${item.question}</span>
          <i class="faq-item__icon fas fa-chevron-down" aria-hidden="true"></i>
        </button>
        <div class="faq-item__answer" 
             id="faq-answer-${index}" 
             aria-labelledby="faq-question-${index}"
             role="region">
          <div class="faq-item__answer-content">
            <p>${item.answer}</p>
          </div>
        </div>
      </div>
    `).join('');

    // Setup FAQ accordion functionality
    this.setupFAQAccordion();
  }

  /**
   * Setup FAQ Accordion
   */
  setupFAQAccordion() {
    const faqButtons = document.querySelectorAll('.faq-item__question');
    
    faqButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        const answer = button.nextElementSibling;
        
        // Close all other FAQ items
        faqButtons.forEach(otherButton => {
          if (otherButton !== button) {
            otherButton.setAttribute('aria-expanded', 'false');
            otherButton.nextElementSibling.style.maxHeight = '0';
            otherButton.classList.remove('faq-item__question--expanded');
          }
        });
        
        // Toggle current FAQ item
        button.setAttribute('aria-expanded', !isExpanded);
        button.classList.toggle('faq-item__question--expanded', !isExpanded);
        
        if (!isExpanded) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          answer.style.maxHeight = '0';
        }
      });
    });
  }

  /**
   * Setup smooth scrolling
   */
  setupSmoothScrolling() {
    const scrollLinks = document.querySelectorAll('a[data-scroll]');
    
    scrollLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('data-scroll');
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          if (this.mobileMenuOpen) {
            this.closeMobileMenu();
          }
        }
      });
    });
  }

  /**
   * Setup mobile navigation
   */
  setupMobileNavigation() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileBackdrop = document.querySelector('.mobile-menu__backdrop');
    
    if (!mobileToggle || !mobileMenu) return;
    
    // Toggle mobile menu
    mobileToggle.addEventListener('click', () => {
      this.toggleMobileMenu();
    });
    
    // Close menu when clicking backdrop
    mobileBackdrop?.addEventListener('click', () => {
      this.closeMobileMenu();
    });
    
    // Close menu when pressing escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.mobileMenuOpen) {
        this.closeMobileMenu();
      }
    });
    
    // Close menu when clicking mobile nav links
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });
  }

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.updateMobileMenuState();
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    this.mobileMenuOpen = false;
    this.updateMobileMenuState();
  }

  /**
   * Update mobile menu state
   */
  updateMobileMenuState() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (!mobileToggle || !mobileMenu) return;
    
    // Update aria attributes
    mobileToggle.setAttribute('aria-expanded', this.mobileMenuOpen.toString());
    mobileMenu.setAttribute('aria-hidden', (!this.mobileMenuOpen).toString());
    
    // Update classes
    mobileMenu.classList.toggle('mobile-menu--active', this.mobileMenuOpen);
    document.body.classList.toggle('mobile-menu-open', this.mobileMenuOpen);
    
    // Manage focus and scroll
    if (this.mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      // Focus first menu item
      const firstLink = mobileMenu.querySelector('.mobile-nav-link');
      firstLink?.focus();
    } else {
      document.body.style.overflow = '';
      // Return focus to toggle button
      mobileToggle.focus();
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    this.setupSmoothScrolling();
    this.setupMobileNavigation();
    
    // Header scroll effect
    let lastScrollY = window.scrollY;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      if (header) {
        header.classList.toggle('header--scrolled', currentScrollY > 50);
        
        // Hide/show header on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          header.classList.add('header--hidden');
        } else {
          header.classList.remove('header--hidden');
        }
      }
      
      lastScrollY = currentScrollY;
    }, { passive: true });
  }

  /**
   * Initialize utilities
   */
  initializeUtilities() {
    // Performance monitoring
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          if (perfData) {
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            console.log(`📊 Page load time: ${loadTime}ms`);
            
            if (loadTime > 3000) {
              console.warn('⚠️ Page load time exceeded 3 seconds');
            }
          }
        }, 0);
      });
    }
  }

  /**
   * Show loading state
   */
  showLoading() {
    document.body.classList.add('loading');
    
    // Add loading indicator if needed
    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'loading-indicator';
    loadingIndicator.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading RescuePC Repairs...</p>
      </div>
    `;
    loadingIndicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;
    
    document.body.appendChild(loadingIndicator);
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
    
    // Remove loading indicator
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.style.opacity = '0';
      setTimeout(() => {
        loadingIndicator.remove();
      }, 300);
    }
  }

  /**
   * Show error message
   */
  showError(message) {
    console.error('Application error:', message);
    
    // Create error notification
    const errorNotification = document.createElement('div');
    errorNotification.className = 'error-notification';
    errorNotification.innerHTML = `
      <div class="error-content">
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
        <button class="error-close" aria-label="Close error">&times;</button>
      </div>
    `;
    
    errorNotification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #dc3545;
      color: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      max-width: 400px;
    `;
    
    document.body.appendChild(errorNotification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      errorNotification.remove();
    }, 5000);
    
    // Manual close
    const closeButton = errorNotification.querySelector('.error-close');
    closeButton?.addEventListener('click', () => {
      errorNotification.remove();
    });
  }

  /**
   * Handle initialization error
   */
  handleInitializationError(error) {
    this.hideLoading();
    this.showError('Failed to initialize application. Please refresh the page.');
  }

  /**
   * Dispatch ready event
   */
  dispatchReadyEvent() {
    const readyEvent = new CustomEvent('rescuepc:ready', {
      detail: { app: this }
    });
    
    document.dispatchEvent(readyEvent);
  }

  /**
   * Get component by name
   */
  getComponent(name) {
    return this.components.get(name);
  }

  /**
   * Get application state
   */
  getState() {
    return {
      isInitialized: this.isInitialized,
      content: this.content,
      components: Array.from(this.components.keys())
    };
  }
}

// Initialize application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.RescuePCApp = new RescuePCApp();
  });
} else {
  window.RescuePCApp = new RescuePCApp();
}

// Export for module usage
export default RescuePCApp; 
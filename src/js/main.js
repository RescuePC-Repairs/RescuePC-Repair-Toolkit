/**
 * Main JavaScript Entry Point
 * Initializes the modular RescuePC Repairs application
 */

import { ComponentLoader } from './modules/ComponentLoader.js';
import { PerformanceMonitor } from './modules/PerformanceMonitor.js';

/**
 * Application Controller
 */
class RescuePCAapp {
  constructor() {
    this.componentLoader = new ComponentLoader();
    this.performanceMonitor = new PerformanceMonitor();
    this.isInitialized = false;
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      console.log('🚀 Initializing RescuePC Repairs Application...');
      
      // Start performance monitoring
      this.performanceMonitor.init();
      
      // Register components
      this.registerComponents();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Load components
      await this.loadComponents();
      
      // Initialize interactive features
      this.initializeFeatures();
      
      this.isInitialized = true;
      console.log('✅ Application initialized successfully');
      
      // Track completion
      this.performanceMonitor.trackEvent('app_initialized', {
        timestamp: Date.now(),
        components_loaded: this.componentLoader.loadedComponents.size
      });
      
    } catch (error) {
      console.error('❌ Application initialization failed:', error);
      this.handleInitError(error);
    }
  }

  /**
   * Register all components
   */
  registerComponents() {
    // Layout components
    this.componentLoader
      .register('header', 'src/components/Layout/Header.html', {
        preload: true,
        selector: '[data-component="header"]'
      })
      .register('footer', 'src/components/Layout/Footer.html', {
        preload: true,
        selector: '[data-component="footer"]'
      });

    // Section components
    this.componentLoader
      .register('hero', 'src/components/Sections/Hero.html', {
        preload: true,
        selector: '[data-component="hero"]'
      })
      .register('features', 'src/components/Sections/Features.html', {
        lazy: false,
        selector: '[data-component="features"]'
      })
      .register('pricing', 'src/components/Sections/Pricing.html', {
        lazy: false,
        selector: '[data-component="pricing"]'
      });
  }

  /**
   * Load all components
   */
  async loadComponents() {
    console.log('📦 Loading components...');
    
    // Load critical components first (header, hero)
    await Promise.all([
      this.componentLoader.load('header'),
      this.componentLoader.load('hero')
    ]);

    // Load other components
    await Promise.all([
      this.componentLoader.load('features'),
      this.componentLoader.load('pricing'),
      this.componentLoader.load('footer')
    ]);

    console.log('✅ All components loaded');
  }

  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Mobile navigation
    document.addEventListener('click', this.handleMobileNavigation.bind(this));
    
    // Smooth scrolling
    document.addEventListener('click', this.handleSmoothScroll.bind(this));
    
    // Form submissions
    document.addEventListener('submit', this.handleFormSubmission.bind(this));
    
    // Component events
    document.addEventListener('componentRendered', this.handleComponentRendered.bind(this));
    
    // Performance events
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // Error handling
    window.addEventListener('error', this.handleGlobalError.bind(this));
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
  }

  /**
   * Handle mobile navigation toggle
   */
  handleMobileNavigation(event) {
    const toggle = event.target.closest('[data-mobile-toggle]');
    if (!toggle) return;
    
    event.preventDefault();
    
    const menu = document.querySelector('[data-mobile-menu]');
    const isOpen = menu.classList.contains('is-open');
    
    if (isOpen) {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
    } else {
      menu.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close navigation menu');
    }
    
    // Track interaction
    this.performanceMonitor.trackEvent('mobile_nav_toggle', { isOpen: !isOpen });
  }

  /**
   * Handle smooth scrolling
   */
  handleSmoothScroll(event) {
    const link = event.target.closest('[data-smooth-scroll]');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    
    event.preventDefault();
    
    const target = document.querySelector(href);
    if (!target) return;
    
    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
    const targetPosition = target.offsetTop - headerHeight - 20;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
    
    // Track scroll
    this.performanceMonitor.trackEvent('smooth_scroll', { target: href });
  }

  /**
   * Handle form submissions
   */
  handleFormSubmission(event) {
    const form = event.target;
    if (!form.matches('form')) return;
    
    // Add loading state
    const submitButton = form.querySelector('[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Processing...';
    }
    
    // Track form submission
    this.performanceMonitor.trackEvent('form_submission', {
      form_id: form.id || 'unknown',
      form_action: form.action
    });
  }

  /**
   * Handle component rendered events
   */
  handleComponentRendered(event) {
    const { name, container } = event.detail;
    console.log(`✅ Component "${name}" rendered in container:`, container);
    
    // Initialize component-specific features
    this.initializeComponentFeatures(name, container);
  }

  /**
   * Initialize component-specific features
   */
  initializeComponentFeatures(name, container) {
    switch (name) {
      case 'header':
        this.initializeHeader(container);
        break;
        
      case 'hero':
        this.initializeHero(container);
        break;
        
      case 'pricing':
        this.initializePricing(container);
        break;
        
      default:
        // Generic initialization
        this.initializeGenericFeatures(container);
    }
  }

  /**
   * Initialize header features
   */
  initializeHeader(container) {
    // Setup mobile navigation
    const toggle = container.querySelector('[data-mobile-toggle]');
    const menu = container.querySelector('[data-mobile-menu]');
    
    if (toggle && menu) {
      // Close menu on outside click
      document.addEventListener('click', (event) => {
        if (!container.contains(event.target) && menu.classList.contains('is-open')) {
          menu.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.setAttribute('aria-label', 'Open navigation menu');
        }
      });
      
      // Close menu on escape key
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && menu.classList.contains('is-open')) {
          menu.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.setAttribute('aria-label', 'Open navigation menu');
          toggle.focus();
        }
      });
    }
  }

  /**
   * Initialize hero features
   */
  initializeHero(container) {
    // Setup intersection observer for hero animations
    if ('IntersectionObserver' in window) {
      const heroElements = container.querySelectorAll('.hero__content > *');
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }
          });
        },
        { threshold: 0.1 }
      );
      
      heroElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(element);
      });
    }
  }

  /**
   * Initialize pricing features
   */
  initializePricing(container) {
    // Setup purchase buttons
    const purchaseButtons = container.querySelectorAll('[data-purchase]');
    purchaseButtons.forEach(button => {
      button.addEventListener('click', this.handlePurchaseClick.bind(this));
    });
  }

  /**
   * Handle purchase button clicks
   */
  handlePurchaseClick(event) {
    const button = event.target.closest('[data-purchase]');
    if (!button) return;
    
    event.preventDefault();
    
    const plan = button.getAttribute('data-purchase');
    
    // Track purchase intent
    this.performanceMonitor.trackEvent('purchase_intent', { plan });
    
    // Show purchase modal or redirect
    this.showPurchaseModal(plan);
  }

  /**
   * Show purchase modal
   */
  showPurchaseModal(plan) {
    // Implementation would go here
    console.log(`Initiating purchase for plan: ${plan}`);
  }

  /**
   * Initialize generic features for any container
   */
  initializeGenericFeatures(container) {
    // Setup lazy loading for images
    this.setupLazyLoading(container);
    
    // Setup accessibility enhancements
    this.setupAccessibility(container);
  }

  /**
   * Setup lazy loading for images
   */
  setupLazyLoading(container) {
    if ('IntersectionObserver' in window) {
      const images = container.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });
      
      images.forEach((img) => imageObserver.observe(img));
    }
  }

  /**
   * Setup accessibility enhancements
   */
  setupAccessibility(container) {
    // Setup focus management
    const focusableElements = container.querySelectorAll(
      'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach((element) => {
      // Add focus indicators
      element.addEventListener('focus', () => {
        element.classList.add('focus-visible');
      });
      
      element.addEventListener('blur', () => {
        element.classList.remove('focus-visible');
      });
    });
  }

  /**
   * Initialize interactive features
   */
  initializeFeatures() {
    // Setup keyboard navigation
    this.setupKeyboardNavigation();
    
    // Setup scroll effects
    this.setupScrollEffects();
    
    // Setup form enhancements
    this.setupFormEnhancements();
  }

  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (event) => {
      // Skip link activation
      if (event.key === 'Enter' && event.target.matches('.sr-only')) {
        event.target.click();
      }
    });
  }

  /**
   * Setup scroll effects
   */
  setupScrollEffects() {
    if ('IntersectionObserver' in window) {
      const animatedElements = document.querySelectorAll('[data-animate]');
      const animationObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const element = entry.target;
              const animation = element.getAttribute('data-animate');
              element.classList.add(`animate-${animation}`);
              animationObserver.unobserve(element);
            }
          });
        },
        { threshold: 0.1 }
      );
      
      animatedElements.forEach((element) => {
        animationObserver.observe(element);
      });
    }
  }

  /**
   * Setup form enhancements
   */
  setupFormEnhancements() {
    const forms = document.querySelectorAll('form');
    forms.forEach((form) => {
      // Add real-time validation
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach((input) => {
        input.addEventListener('blur', () => {
          this.validateField(input);
        });
      });
    });
  }

  /**
   * Validate form field
   */
  validateField(field) {
    const isValid = field.checkValidity();
    const errorElement = field.parentNode.querySelector('.field-error');
    
    if (!isValid) {
      field.classList.add('is-invalid');
      if (!errorElement) {
        const error = document.createElement('div');
        error.className = 'field-error';
        error.textContent = field.validationMessage;
        field.parentNode.appendChild(error);
      }
    } else {
      field.classList.remove('is-invalid');
      if (errorElement) {
        errorElement.remove();
      }
    }
    
    return isValid;
  }

  /**
   * Handle visibility change
   */
  handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      this.performanceMonitor.trackEvent('page_visible');
    } else {
      this.performanceMonitor.trackEvent('page_hidden');
    }
  }

  /**
   * Handle global errors
   */
  handleGlobalError(event) {
    console.error('Global error:', event.error);
    this.performanceMonitor.trackError(event.error);
  }

  /**
   * Handle unhandled promise rejections
   */
  handleUnhandledRejection(event) {
    console.error('Unhandled promise rejection:', event.reason);
    this.performanceMonitor.trackError(event.reason);
  }

  /**
   * Handle initialization errors
   */
  handleInitError(error) {
    // Show fallback content
    document.body.innerHTML = `
      <div style="padding: 2rem; text-align: center; font-family: system-ui;">
        <h1>RescuePC Repairs</h1>
        <p>We're experiencing technical difficulties. Please refresh the page.</p>
        <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; background: #2563eb; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">
          Refresh Page
        </button>
      </div>
    `;
    
    // Track error
    this.performanceMonitor.trackError(error);
  }
}

/**
 * Initialize application when DOM is ready
 */
function initializeApp() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const app = new RescuePCAapp();
      app.init();
    });
  } else {
    const app = new RescuePCAapp();
    app.init();
  }
}

// Start the application
initializeApp();

// Export for debugging
window.RescuePCApp = RescuePCAapp; 
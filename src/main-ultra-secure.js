/*!
 * RESCUEPC REPAIRS - ULTRA-SECURE MAIN APPLICATION
 * Military-Grade Security with 10000000% HTTPS Enforcement
 * 
 * Features:
 * - Component-based architecture
 * - Military-grade security enforcement
 * - Performance optimization
 * - Real-time monitoring
 * - Error handling & recovery
 * - Analytics integration
 * 
 * @author Tyler - RescuePC Repairs Security Team
 * @version 2024.ULTRA-SECURE
 * @license MIT
 */

import { RescuePCSecurityManager } from './config/security.config.js';
import RescuePCHeader from './components/layout/Header.js';
import RescuePCHero from './components/sections/Hero.js';

// ===================================================================
// RESCUEPC ULTRA-SECURE APPLICATION
// ===================================================================

class RescuePCUltraSecureApp {
  constructor() {
    this.startTime = performance.now();
    this.isInitialized = false;
    this.components = new Map();
    this.eventListeners = new Map();
    this.securityManager = new RescuePCSecurityManager();
    
    // Application Configuration
    this.config = {
      APP_NAME: 'RescuePC Repairs Toolkit',
      APP_VERSION: '2024.ULTRA-SECURE',
      BUILD_DATE: new Date().toISOString(),
      ENVIRONMENT: 'production',
      DEBUG: false,
      
      // Business Information - PRESERVED 100%
      BUSINESS: {
        PRODUCT_NAME: 'RescuePC Repairs Toolkit',
        PRICE: '$79.99',
        PURCHASE_URL: 'https://buy.stripe.com/9B614m53s8i97y110j08g00',
        SUPPORT_EMAIL: '***REMOVED***',

        SOCIAL_MEDIA: {
          TIKTOK: 'https://www.tiktok.com/@rescuepcrepairs',
          YOUTUBE: 'https://www.youtube.com/@RescuePC-Repairs',
          TWITCH: 'https://www.twitch.tv/rescuepc_repairs',
          TWITTER: 'https://x.com/RescuePCRepair',
          KICK: 'https://kick.com/rescuepc-repairs'
        }
      },
      
      // Security Configuration
      SECURITY: {
        HTTPS_ENFORCEMENT: true,
        CERTIFICATE_MONITORING: true,
        REAL_TIME_PROTECTION: true,
        SECURITY_HEADERS: true,
        CSP_ENFORCEMENT: true
      },
      
      // Performance Settings
      PERFORMANCE: {
        LAZY_LOAD_THRESHOLD: 200,
        ANIMATION_DURATION: 300,
        DEBOUNCE_DELAY: 150,
        CACHE_DURATION: 3600000,
        WEB_VITALS_MONITORING: true
      },
      
      // Feature Flags
      FEATURES: {
        SERVICE_WORKER: true,
        OFFLINE_SUPPORT: true,
        SMOOTH_SCROLLING: true,
        ANALYTICS: true,
        ERROR_REPORTING: true
      }
    };
    
    this.bindMethods();
    this.setupErrorHandling();
    this.initialize();
  }

  /**
   * Bind all methods to maintain proper context
   */
  bindMethods() {
    this.initialize = this.initialize.bind(this);
    this.initializeCore = this.initializeCore.bind(this);
    this.initializeComponents = this.initializeComponents.bind(this);
    this.setupEventListeners = this.setupEventListeners.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleUnload = this.handleUnload.bind(this);
  }

  /**
   * Setup comprehensive error handling
   */
  setupErrorHandling() {
    // Global error handler
    window.addEventListener('error', this.handleError);
    window.addEventListener('unhandledrejection', this.handleError);
    
    // Security violation handler
    document.addEventListener('securitypolicyviolation', (event) => {
      console.error('🚨 SECURITY VIOLATION DETECTED:', event);
      this.reportSecurityViolation(event);
    });
    
    // Page unload handler
    window.addEventListener('beforeunload', this.handleUnload);
  }

  /**
   * Handle application errors with recovery
   */
  handleError(event) {
    const error = event.error || event.reason || event;
    console.error('🚨 RescuePC Application Error:', error);
    
    // Track error in analytics
    this.trackAnalytics('app_error', {
      error_message: error.message,
      error_stack: error.stack,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
    
    // Attempt recovery
    this.attemptErrorRecovery(error);
  }

  /**
   * Attempt to recover from errors
   */
  attemptErrorRecovery(error) {
    try {
      // Reinitialize components if needed
      if (!this.isInitialized) {
        console.log('🔄 Attempting application recovery...');
        setTimeout(() => {
          this.initialize();
        }, 1000);
      }
    } catch (recoveryError) {
      console.error('❌ Recovery failed:', recoveryError);
    }
  }

  /**
   * Handle page unload with cleanup
   */
  handleUnload() {
    const sessionDuration = performance.now() - this.startTime;
    
    // Track session duration
    this.trackAnalytics('session_end', {
      duration: Math.round(sessionDuration),
      components_loaded: this.components.size,
      security_status: this.securityManager.getSecurityStatus()
    });
    
    // Cleanup resources
    this.cleanup();
  }

  /**
   * Initialize the ultra-secure application
   */
  async initialize() {
    try {
      console.log('🚀 Initializing RescuePC Ultra-Secure Platform...');
      console.log('🔒 Security Level: MILITARY-GRADE');
      
      // Show loading screen
      this.showLoadingScreen();
      
      // Initialize core systems
      await this.initializeCore();
      
      // Initialize security systems
      await this.initializeSecurity();
      
      // Initialize components
      await this.initializeComponents();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Initialize analytics
      this.initializeAnalytics();
      
      // Hide loading screen
      this.hideLoadingScreen();
      
      // Mark as initialized
      this.isInitialized = true;
      
      const initTime = performance.now() - this.startTime;
      console.log(`✅ RescuePC Ultra-Secure Platform initialized in ${initTime.toFixed(2)}ms`);
      console.log('🛡️ All security systems active');
      
      // Track successful initialization
      this.trackAnalytics('app_initialized', {
        init_time: Math.round(initTime),
        security_level: 'MILITARY-GRADE',
        components_count: this.components.size
      });
      
    } catch (error) {
      console.error('❌ Failed to initialize RescuePC application:', error);
      this.handleError({ error });
    }
  }

  /**
   * Initialize core systems
   */
  async initializeCore() {
    // Initialize Web Vitals monitoring
    if (this.config.PERFORMANCE.WEB_VITALS_MONITORING) {
      this.initializeWebVitals();
    }
    
    // Initialize Service Worker
    if (this.config.FEATURES.SERVICE_WORKER && 'serviceWorker' in navigator) {
      await this.initializeServiceWorker();
    }
    
    // Initialize performance monitoring
    this.initializePerformanceMonitoring();
  }

  /**
   * Initialize security systems
   */
  async initializeSecurity() {
    console.log('🔒 Initializing military-grade security systems...');
    
    // Verify HTTPS enforcement
    if (location.protocol !== 'https:' && 
        location.hostname !== 'localhost' && 
        location.hostname !== '127.0.0.1' && 
        location.hostname !== '0.0.0.0' &&
        !location.hostname.startsWith('192.168.') &&
        !location.hostname.startsWith('10.') &&
        !location.hostname.includes('localhost') &&
        !location.hostname.includes('127.0.0.1')) {
      console.log('🔄 Enforcing HTTPS redirect...');
      location.replace(`https:${location.href.substring(location.protocol.length)}`);
      return;
    }
    
    // Initialize security headers
    this.securityManager.setupSecurityHeaders();
    
    // Setup certificate monitoring
    this.securityManager.setupCertificateMonitoring();
    
    // Enable security logging
    this.securityManager.enableSecurityLogging();
    
    console.log('✅ Security systems initialized');
  }

  /**
   * Initialize Web Vitals monitoring
   */
  initializeWebVitals() {
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.trackAnalytics('web_vital_lcp', {
          value: Math.round(lastEntry.startTime),
          rating: lastEntry.startTime < 2500 ? 'good' : lastEntry.startTime < 4000 ? 'needs-improvement' : 'poor'
        });
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          this.trackAnalytics('web_vital_fid', {
            value: Math.round(entry.processingStart - entry.startTime),
            rating: entry.processingStart - entry.startTime < 100 ? 'good' : 'needs-improvement'
          });
        });
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        let clsValue = 0;
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.trackAnalytics('web_vital_cls', {
          value: Math.round(clsValue * 1000) / 1000,
          rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor'
        });
      }).observe({ entryTypes: ['layout-shift'] });
    }
  }

  /**
   * Initialize Service Worker
   */
  async initializeServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Service Worker registered:', registration);
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        console.log('🔄 Service Worker update found');
      });
      
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  }

  /**
   * Initialize performance monitoring
   */
  initializePerformanceMonitoring() {
    // Monitor resource loading
    new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.duration > 1000) {
          console.warn('⚠️ Slow resource detected:', entry.name, entry.duration);
        }
      });
    }).observe({ entryTypes: ['resource'] });
  }

  /**
   * Initialize all components
   */
  async initializeComponents() {
    console.log('🧩 Initializing components...');
    
    try {
      // Initialize Header
      const header = new RescuePCHeader();
      this.components.set('header', header);
      
      // Initialize Hero
      const hero = new RescuePCHero();
      this.components.set('hero', hero);
      
      // Initialize other components would go here
      // const features = new RescuePCFeatures();
      // const testimonials = new RescuePCTestimonials();
      // const pricing = new RescuePCPricing();
      // const faq = new RescuePCFAQ();
      // const footer = new RescuePCFooter();
      
      console.log(`✅ ${this.components.size} components initialized`);
      
    } catch (error) {
      console.error('❌ Component initialization failed:', error);
      throw error;
    }
  }

  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Smooth scrolling for anchor links
    if (this.config.FEATURES.SMOOTH_SCROLLING) {
      this.initializeSmoothScrolling();
    }
    
    // Intersection observer for animations
    this.initializeScrollAnimations();
    
    // Keyboard navigation
    this.setupKeyboardNavigation();
    
    // Security event listeners
    this.setupSecurityEventListeners();
  }

  /**
   * Initialize smooth scrolling
   */
  initializeSmoothScrolling() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  }

  /**
   * Initialize scroll animations
   */
  initializeScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const delay = parseInt(element.dataset.delay) || 0;
          
          setTimeout(() => {
            element.classList.add('animate-in');
          }, delay);
          
          observer.unobserve(element);
        }
      });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('[data-animate]').forEach(el => {
      observer.observe(el);
    });
  }

  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // ESC key handling
      if (e.key === 'Escape') {
        // Close any open modals or menus
        const header = this.components.get('header');
        if (header && header.isMenuOpen) {
          header.closeMobileMenu();
        }
      }
    });
  }

  /**
   * Setup security event listeners
   */
  setupSecurityEventListeners() {
    // Monitor for suspicious activity
    let clickCount = 0;
    let lastClickTime = 0;
    
    document.addEventListener('click', (e) => {
      const now = Date.now();
      if (now - lastClickTime < 100) {
        clickCount++;
        if (clickCount > 10) {
          console.warn('🚨 Suspicious click activity detected');
          this.reportSecurityEvent('suspicious_clicking', {
            clicks: clickCount,
            timespan: now - lastClickTime
          });
        }
      } else {
        clickCount = 0;
      }
      lastClickTime = now;
    });
  }

  /**
   * Initialize analytics
   */
  initializeAnalytics() {
    if (!this.config.FEATURES.ANALYTICS) return;
    
    // Google Analytics is already initialized in HTML
    // Track page view
    this.trackAnalytics('page_view', {
      page_title: document.title,
      page_location: window.location.href,
      app_version: this.config.APP_VERSION
    });
  }

  /**
   * Show loading screen
   */
  showLoadingScreen() {
    const loadingHTML = `
      <div id="rescuepc-loading" class="rescuepc-loading" aria-hidden="true">
        <div class="rescuepc-spinner" role="status" aria-label="Loading"></div>
        <span class="sr-only">Loading RescuePC Ultra-Secure Platform...</span>
      </div>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', loadingHTML);
  }

  /**
   * Hide loading screen
   */
  hideLoadingScreen() {
    const loading = document.getElementById('rescuepc-loading');
    if (loading) {
      setTimeout(() => {
        loading.style.opacity = '0';
        setTimeout(() => {
          loading.remove();
        }, 300);
      }, 500);
    }
  }

  /**
   * Track analytics events
   */
  trackAnalytics(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        app_name: this.config.APP_NAME,
        app_version: this.config.APP_VERSION,
        ...parameters
      });
    }
    
    // Console logging for development
    if (this.config.DEBUG) {
      console.log('📊 Analytics:', eventName, parameters);
    }
  }

  /**
   * Report security violations
   */
  reportSecurityViolation(event) {
    const violationData = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      violation: {
        blockedURI: event.blockedURI,
        violatedDirective: event.violatedDirective,
        disposition: event.disposition
      }
    };
    
    // Track in analytics
    this.trackAnalytics('security_violation', violationData);
    
    console.error('🚨 Security Policy Violation:', violationData);
  }

  /**
   * Report security events
   */
  reportSecurityEvent(eventType, data) {
    this.trackAnalytics('security_event', {
      event_type: eventType,
      ...data
    });
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    // Clear event listeners
    this.eventListeners.forEach((listener, element) => {
      element.removeEventListener(listener.type, listener.handler);
    });
    this.eventListeners.clear();
    
    // Cleanup components
    this.components.forEach(component => {
      if (component.cleanup) {
        component.cleanup();
      }
    });
    this.components.clear();
  }

  /**
   * Get application status
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      uptime: performance.now() - this.startTime,
      componentsLoaded: this.components.size,
      securityStatus: this.securityManager.getSecurityStatus(),
      config: this.config
    };
  }

  /**
   * Public API methods
   */
  getComponent(name) {
    return this.components.get(name);
  }

  trackEvent(eventName, parameters) {
    this.trackAnalytics(eventName, parameters);
  }
}

// ===================================================================
// UTILITY FUNCTIONS
// ===================================================================

/**
 * DOM Ready helper
 */
function rescuePCDOMReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

/**
 * Debounce utility
 */
function rescuePCDebounce(func, wait, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

/**
 * Throttle utility
 */
function rescuePCThrottle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ===================================================================
// APPLICATION INITIALIZATION
// ===================================================================

// Initialize the application when DOM is ready
rescuePCDOMReady(() => {
  // Remove no-js class immediately
  document.documentElement.classList.remove('no-js');
  
  // Initialize the ultra-secure application
  window.RescuePCApp = new RescuePCUltraSecureApp();
  
  // Global error handling
  window.addEventListener('error', (e) => {
    console.error('🚨 Global Error:', e.error);
  });
  
  // Expose utilities globally
  window.RescuePC = {
    debounce: rescuePCDebounce,
    throttle: rescuePCThrottle,
    app: window.RescuePCApp
  };
});

// Export for module systems
export default RescuePCUltraSecureApp;
export { rescuePCDOMReady, rescuePCDebounce, rescuePCThrottle }; 

/**
 * RescuePC Repairs - Main Application
 * Ultra-secure, component-based architecture
 * HTTPS enforced everywhere with military-grade security
 */
import HTTPSEnforcer from '../security/https-enforcer.js';
import HeroSection from '../components/sections/Hero.js';
import PerformanceMonitor from '../modules/PerformanceMonitor.js';
import AccessibilityManager from '../modules/AccessibilityManager.js';

class RescuePCApp {
  constructor() {
    this.version = '3.0.0';
    this.isInitialized = false;
    this.isProduction = location.hostname !== 'localhost' && location.hostname !== '127.0.0.1';
    
    // Core modules
    this.httpsEnforcer = new HTTPSEnforcer();
    this.performanceMonitor = new PerformanceMonitor();
    this.accessibilityManager = new AccessibilityManager();
    
    // Component registry
    this.components = new Map();
    this.modules = new Map();
    
    // Configuration
    this.config = {
      enableAnalytics: true,
      enablePerformanceMonitoring: true,
      enableAccessibility: true,
      enableSecurity: true,
      loadTimeout: 10000,
      animationDuration: 300
    };
    
    // Initialize immediately
    this.init();
  }
  
  /**
   * Initialize application
   */
  async init() {
    try {
      console.log('🚀 Initializing RescuePC Repairs v' + this.version);
      
      // Force HTTPS before anything else
      this.enforceHTTPS();
      
      // Setup error handling
      this.setupErrorHandling();
      
      // Setup security monitoring
      this.setupSecurityMonitoring();
      
      // Initialize core modules
      await this.initializeModules();
      
      // Load components
      await this.loadComponents();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Initialize analytics
      this.initializeAnalytics();
      
      // Setup performance monitoring
      this.setupPerformanceMonitoring();
      
      // Mark as initialized
      this.isInitialized = true;
      
      console.log('✅ RescuePC Repairs initialized successfully');
      
      // Dispatch ready event
      this.dispatchEvent('app:ready', {
        version: this.version,
        timestamp: Date.now()
      });
      
    } catch (error) {
      console.error('💥 Application initialization failed:', error);
      this.handleInitializationError(error);
    }
  }
  
  /**
   * Enforce HTTPS everywhere
   */
  enforceHTTPS() {
    // Skip for localhost development
    if (!this.isProduction) {
      console.log('🔓 HTTPS enforcement skipped for localhost');
      return;
    }
    
    // Immediate HTTPS redirect
    if (location.protocol !== 'https:' && 
        location.hostname !== 'localhost' && 
        location.hostname !== '127.0.0.1' && 
        location.hostname !== '0.0.0.0' &&
        !location.hostname.startsWith('192.168.') &&
        !location.hostname.startsWith('10.') &&
        !location.hostname.includes('localhost') &&
        !location.hostname.includes('127.0.0.1')) {
      console.log('🔒 Forcing HTTPS redirect...');
      const httpsUrl = 'https:' + window.location.href.substring(window.location.protocol.length);
      location.replace(httpsUrl);
      return;
    }
    
    console.log('🔒 HTTPS enforced successfully');
  }
  
  /**
   * Setup error handling
   */
  setupErrorHandling() {
    // Global error handler
    window.addEventListener('error', (e) => {
      this.handleError('javascript_error', {
        message: e.error?.message || 'Unknown error',
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error?.stack
      });
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (e) => {
      this.handleError('unhandled_promise_rejection', {
        reason: e.reason?.message || e.reason,
        stack: e.reason?.stack
      });
    });
    
    // Resource loading errors
    window.addEventListener('error', (e) => {
      if (e.target !== window) {
        this.handleError('resource_error', {
          element: e.target.tagName,
          source: e.target.src || e.target.href,
          message: 'Failed to load resource'
        });
      }
    }, true);
  }
  
  /**
   * Setup security monitoring
   */
  setupSecurityMonitoring() {
    // CSP violation monitoring
    document.addEventListener('securitypolicyviolation', (e) => {
      this.handleSecurityViolation('csp_violation', {
        directive: e.violatedDirective,
        blockedURI: e.blockedURI,
        originalPolicy: e.originalPolicy
      });
    });
    
    // Monitor for mixed content
    this.monitorMixedContent();
    
    // Monitor for insecure origins
    this.monitorInsecureOrigins();
  }
  
  /**
   * Monitor mixed content
   */
  monitorMixedContent() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            this.checkElementSecurity(node);
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  /**
   * Check element security
   */
  checkElementSecurity(element) {
    const insecureAttributes = ['src', 'href', 'action'];
    
    insecureAttributes.forEach(attr => {
      const value = element.getAttribute(attr);
      if (value && value.startsWith('http:')) {
        this.handleSecurityViolation('mixed_content', {
          element: element.tagName,
          attribute: attr,
          url: value
        });
      }
    });
  }
  
  /**
   * Monitor insecure origins
   */
  monitorInsecureOrigins() {
    window.addEventListener('message', (e) => {
      if (e.origin && e.origin.startsWith('http:')) {
        this.handleSecurityViolation('insecure_origin', {
          origin: e.origin,
          data: typeof e.data === 'string' ? e.data.substring(0, 100) : '[object]'
        });
      }
    });
  }
  
  /**
   * Initialize core modules
   */
  async initializeModules() {
    const modules = [
      { name: 'performance', instance: this.performanceMonitor },
      { name: 'accessibility', instance: this.accessibilityManager },
      { name: 'security', instance: this.httpsEnforcer }
    ];
    
    for (const module of modules) {
      try {
        this.modules.set(module.name, module.instance);
        console.log(`✅ ${module.name} module initialized`);
      } catch (error) {
        console.error(`❌ Failed to initialize ${module.name} module:`, error);
      }
    }
  }
  
  /**
   * Load components
   */
  async loadComponents() {
    try {
      // Load hero section
      const heroContainer = document.querySelector('#hero') || document.querySelector('main');
      if (heroContainer) {
        const heroSection = new HeroSection(heroContainer);
        this.components.set('hero', heroSection);
        console.log('✅ Hero component loaded');
      }
      
      // Load other components dynamically
      await this.loadDynamicComponents();
      
    } catch (error) {
      console.error('❌ Failed to load components:', error);
      throw error;
    }
  }
  
  /**
   * Load dynamic components
   */
  async loadDynamicComponents() {
    const componentElements = document.querySelectorAll('[data-component]');
    
    const loadPromises = Array.from(componentElements).map(async (element) => {
      const componentName = element.dataset.component;
      const componentSrc = element.dataset.src;
      
      if (!componentSrc) return;
      
      try {
        const response = await fetch(componentSrc);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const html = await response.text();
        element.innerHTML = html;
        
        // Initialize component-specific functionality
        this.initializeComponentFeatures(element, componentName);
        
        console.log(`✅ Component '${componentName}' loaded`);
        
      } catch (error) {
        console.error(`❌ Failed to load component '${componentName}':`, error);
        this.handleComponentError(element, componentName, error);
      }
    });
    
    await Promise.allSettled(loadPromises);
  }
  
  /**
   * Initialize component features
   */
  initializeComponentFeatures(element, componentName) {
    // Setup smooth scrolling for navigation links
    if (componentName === 'header') {
      this.setupSmoothScrolling(element);
      this.setupMobileMenu(element);
    }
    
    // Setup form validation for contact forms
    if (componentName === 'footer' || componentName === 'contact') {
      this.setupFormValidation(element);
    }
    
    // Setup lazy loading for images
    this.setupLazyLoading(element);
    
    // Setup accessibility features
    this.setupComponentAccessibility(element);
  }
  
  /**
   * Setup smooth scrolling
   */
  setupSmoothScrolling(container) {
    const links = container.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Update URL without triggering navigation
          history.pushState(null, null, `#${targetId}`);
          
          // Focus target for accessibility
          targetElement.focus();
        }
      });
    });
  }
  
  /**
   * Setup mobile menu
   */
  setupMobileMenu(container) {
    const menuToggle = container.querySelector('[data-menu-toggle]');
    const menu = container.querySelector('[data-menu]');
    
    if (menuToggle && menu) {
      menuToggle.addEventListener('click', () => {
        const isOpen = menu.classList.contains('menu-open');
        
        if (isOpen) {
          menu.classList.remove('menu-open');
          menuToggle.setAttribute('aria-expanded', 'false');
        } else {
          menu.classList.add('menu-open');
          menuToggle.setAttribute('aria-expanded', 'true');
        }
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
          menu.classList.remove('menu-open');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
      
      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('menu-open')) {
          menu.classList.remove('menu-open');
          menuToggle.setAttribute('aria-expanded', 'false');
          menuToggle.focus();
        }
      });
    }
  }
  
  /**
   * Setup form validation
   */
  setupFormValidation(container) {
    const forms = container.querySelectorAll('form');
    
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        if (!this.validateForm(form)) {
          e.preventDefault();
        }
      });
      
      // Real-time validation
      const inputs = form.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.addEventListener('blur', () => {
          this.validateField(input);
        });
      });
    });
  }
  
  /**
   * Validate form
   */
  validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  /**
   * Validate field
   */
  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.required && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }
    
    // Email validation
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }
    
    // Display validation result
    this.displayFieldValidation(field, isValid, errorMessage);
    
    return isValid;
  }
  
  /**
   * Display field validation
   */
  displayFieldValidation(field, isValid, errorMessage) {
    // Remove existing error
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
    
    // Add/remove validation classes
    field.classList.toggle('field-valid', isValid);
    field.classList.toggle('field-invalid', !isValid);
    
    // Add error message if invalid
    if (!isValid && errorMessage) {
      const errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      errorElement.textContent = errorMessage;
      errorElement.setAttribute('role', 'alert');
      field.parentNode.appendChild(errorElement);
    }
  }
  
  /**
   * Setup lazy loading
   */
  setupLazyLoading(container) {
    const images = container.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach(img => {
        img.src = img.dataset.src;
        img.classList.add('loaded');
      });
    }
  }
  
  /**
   * Setup component accessibility
   */
  setupComponentAccessibility(container) {
    // Add ARIA labels to buttons without text
    const buttons = container.querySelectorAll('button:not([aria-label])');
    buttons.forEach(button => {
      if (!button.textContent.trim()) {
        const icon = button.querySelector('i[class*="fa-"]');
        if (icon) {
          const iconClass = Array.from(icon.classList).find(cls => cls.startsWith('fa-'));
          const label = this.getIconLabel(iconClass);
          button.setAttribute('aria-label', label);
        }
      }
    });
    
    // Ensure proper focus order
    const focusableElements = container.querySelectorAll('a, button, input, textarea, select');
    focusableElements.forEach((element, index) => {
      if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }
    });
  }
  
  /**
   * Get icon label
   */
  getIconLabel(iconClass) {
    const iconLabels = {
      'fa-menu': 'Menu',
      'fa-close': 'Close',
      'fa-search': 'Search',
      'fa-download': 'Download',
      'fa-play': 'Play',
      'fa-pause': 'Pause'
    };
    
    return iconLabels[iconClass] || 'Button';
  }
  
  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.handlePageHidden();
      } else {
        this.handlePageVisible();
      }
    });
    
    // Window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
    
    // Page load completion
    window.addEventListener('load', () => {
      document.body.classList.remove('loading');
      document.body.classList.add('loaded');
      this.trackPerformance();
    });
    
    // Before unload
    window.addEventListener('beforeunload', () => {
      this.handleBeforeUnload();
    });
  }
  
  /**
   * Handle page hidden
   */
  handlePageHidden() {
    // Pause animations and timers
    this.components.forEach(component => {
      if (component.pause) {
        component.pause();
      }
    });
  }
  
  /**
   * Handle page visible
   */
  handlePageVisible() {
    // Resume animations and timers
    this.components.forEach(component => {
      if (component.resume) {
        component.resume();
      }
    });
  }
  
  /**
   * Handle resize
   */
  handleResize() {
    // Update component layouts
    this.components.forEach(component => {
      if (component.updateLayout) {
        component.updateLayout();
      }
    });
    
    // Dispatch resize event
    this.dispatchEvent('app:resize', {
      width: window.innerWidth,
      height: window.innerHeight
    });
  }
  
  /**
   * Handle before unload
   */
  handleBeforeUnload() {
    // Send final analytics
    if (this.config.enableAnalytics && typeof gtag !== 'undefined') {
      gtag('event', 'page_unload', {
        event_category: 'engagement',
        transport_type: 'beacon'
      });
    }
  }
  
  /**
   * Initialize analytics
   */
  initializeAnalytics() {
    if (!this.config.enableAnalytics || typeof gtag === 'undefined') {
      return;
    }
    
    // Track page view
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      app_version: this.version,
      timestamp: Date.now()
    });
    
    console.log('✅ Analytics initialized');
  }
  
  /**
   * Setup performance monitoring
   */
  setupPerformanceMonitoring() {
    if (!this.config.enablePerformanceMonitoring) return;
    
    // Monitor Core Web Vitals
    this.monitorWebVitals();
    
    // Monitor resource loading
    this.monitorResourceLoading();
    
    console.log('✅ Performance monitoring active');
  }
  
  /**
   * Monitor Web Vitals
   */
  monitorWebVitals() {
    if ('PerformanceObserver' in window) {
      // Monitor LCP, FID, CLS
      const vitalsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            this.trackMetric('LCP', entry.startTime);
          }
        });
      });
      
      vitalsObserver.observe({entryTypes: ['largest-contentful-paint']});
    }
  }
  
  /**
   * Monitor resource loading
   */
  monitorResourceLoading() {
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 1000) {
            console.warn(`Slow resource: ${entry.name} (${Math.round(entry.duration)}ms)`);
          }
        });
      });
      
      resourceObserver.observe({entryTypes: ['resource']});
    }
  }
  
  /**
   * Track performance metric
   */
  trackMetric(name, value) {
    console.log(`📊 ${name}: ${Math.round(value)}ms`);
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'web_vitals', {
        name: name,
        value: Math.round(value),
        event_category: 'performance'
      });
    }
  }
  
  /**
   * Track performance
   */
  trackPerformance() {
    if (!this.config.enablePerformanceMonitoring) return;
    
    try {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (!perfData) return;
      
      const metrics = {
        loadTime: perfData.loadEventEnd - perfData.loadEventStart,
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        timeToFirstByte: perfData.responseStart - perfData.requestStart,
        domInteractive: perfData.domInteractive - perfData.fetchStart
      };
      
      Object.entries(metrics).forEach(([name, value]) => {
        this.trackMetric(name, value);
      });
      
      // Warn if performance is poor
      if (metrics.loadTime > 3000) {
        console.warn(`⚠️ Slow page load: ${Math.round(metrics.loadTime)}ms`);
      }
      
    } catch (error) {
      console.warn('Performance tracking failed:', error);
    }
  }
  
  /**
   * Handle component error
   */
  handleComponentError(element, componentName, error) {
    console.error(`Component '${componentName}' failed to load:`, error);
    
    // Show fallback content
    element.innerHTML = `
      <div class="component-error">
        <p>⚠️ Content temporarily unavailable</p>
        <button onclick="location.reload()">Refresh Page</button>
      </div>
    `;
    
    // Track error
    this.handleError('component_error', {
      component: componentName,
      message: error.message
    });
  }
  
  /**
   * Handle error
   */
  handleError(type, details) {
    console.error(`Error [${type}]:`, details);
    
    // Send to analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: `${type}: ${details.message || 'Unknown error'}`,
        fatal: false
      });
    }
    
    // Send to error tracking service (if configured)
    if (this.isProduction) {
      this.sendErrorReport(type, details);
    }
  }
  
  /**
   * Handle security violation
   */
  handleSecurityViolation(type, details) {
    console.error(`Security violation [${type}]:`, details);
    
    // Send to analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'security_violation', {
        event_category: 'security',
        event_label: type,
        custom_parameters: details
      });
    }
    
    // Send to security monitoring
    if (this.isProduction) {
      this.sendSecurityReport(type, details);
    }
  }
  
  /**
   * Send error report
   */
  async sendErrorReport(type, details) {
    try {
      await fetch('/api/errors/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          details,
          timestamp: Date.now(),
          url: location.href,
          userAgent: navigator.userAgent,
          version: this.version
        })
      });
    } catch (error) {
      console.warn('Failed to send error report:', error);
    }
  }
  
  /**
   * Send security report
   */
  async sendSecurityReport(type, details) {
    try {
      await fetch('/api/security/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          details,
          timestamp: Date.now(),
          url: location.href,
          userAgent: navigator.userAgent
        })
      });
    } catch (error) {
      console.warn('Failed to send security report:', error);
    }
  }
  
  /**
   * Handle initialization error
   */
  handleInitializationError(error) {
    console.error('💥 Initialization Error:', error);
    
    // Show user-friendly error message
    const errorHtml = `
      <div class="app-error" style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <div style="text-align: center; max-width: 400px; padding: 2rem;">
          <h2 style="margin-bottom: 1rem;">⚠️ Loading Error</h2>
          <p style="margin-bottom: 2rem; opacity: 0.9;">
            We're experiencing technical difficulties. Please refresh the page or try again later.
          </p>
          <button onclick="window.location.reload()" style="
            background: rgba(255,255,255,0.2);
            border: 2px solid rgba(255,255,255,0.3);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
          ">
            🔄 Refresh Page
          </button>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', errorHtml);
  }
  
  /**
   * Dispatch custom event
   */
  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, { detail });
    window.dispatchEvent(event);
  }
  
  /**
   * Get application status
   */
  getStatus() {
    return {
      version: this.version,
      isInitialized: this.isInitialized,
      isProduction: this.isProduction,
      componentsLoaded: this.components.size,
      modulesLoaded: this.modules.size,
      securityStatus: this.httpsEnforcer.getSecurityStatus()
    };
  }
  
  /**
   * Get component
   */
  getComponent(name) {
    return this.components.get(name);
  }
  
  /**
   * Get module
   */
  getModule(name) {
    return this.modules.get(name);
  }
}

// Initialize application
const app = new RescuePCApp();

// Make available globally for debugging
if (typeof window !== 'undefined') {
  window.RescuePCApp = app;
}

export default RescuePCApp; 
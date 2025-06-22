/**
 * =============================================================================
 * RESCUEPC REPAIRS - CORE APPLICATION
 * Enterprise-grade application orchestrator with dependency injection
 * =============================================================================
 */

class RescuePCApplication {
  constructor() {
    this.version = '3.0.0';
    this.initialized = false;
    this.components = new Map();
    this.modules = new Map();
    this.config = {
      environment: 'production',
      debug: false,
      performance: {
        monitoring: true,
        webVitals: true,
        errorTracking: true
      },
      security: {
        csp: true,
        xss: true,
        csrf: true
      },
      accessibility: {
        screenReader: true,
        keyboardNav: true,
        colorContrast: true
      }
    };
    
    this.eventBus = new EventBus();
    this.componentLoader = null;
    this.performanceMonitor = null;
    this.accessibilityManager = null;
    this.securityManager = null;
    
    // Bind methods
    this.init = this.init.bind(this);
    this.destroy = this.destroy.bind(this);
    this.handleError = this.handleError.bind(this);
  }
  
  /**
   * Initialize the application
   */
  async init() {
    if (this.initialized) {
      console.warn('RescuePCApplication: Already initialized');
      return;
    }
    
    try {
      console.log('🚀 Initializing RescuePC Application v' + this.version);
      
      // Set up error handling
      this.setupErrorHandling();
      
      // Initialize core modules
      await this.initializeCore();
      
      // Load and initialize components
      await this.initializeComponents();
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Initialize performance monitoring
      this.initializePerformanceMonitoring();
      
      // Initialize accessibility features
      this.initializeAccessibility();
      
      // Initialize security features
      this.initializeSecurity();
      
      // Mark as initialized
      this.initialized = true;
      
      // Emit initialization complete event
      this.eventBus.emit('app:initialized', {
        version: this.version,
        timestamp: Date.now()
      });
      
      console.log('✅ RescuePC Application initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize RescuePC Application:', error);
      this.handleError(error, 'initialization');
    }
  }
  
  /**
   * Initialize core modules
   */
  async initializeCore() {
    // Initialize Component Loader
    const { ComponentLoader } = await import('./ComponentLoader.js');
    this.componentLoader = new ComponentLoader(this.eventBus);
    this.modules.set('componentLoader', this.componentLoader);
    
    // Initialize Performance Monitor
    const { PerformanceMonitor } = await import('../modules/PerformanceMonitor.js');
    this.performanceMonitor = new PerformanceMonitor(this.config.performance);
    this.modules.set('performanceMonitor', this.performanceMonitor);
    
    // Initialize Accessibility Manager
    const { AccessibilityManager } = await import('../modules/AccessibilityManager.js');
    this.accessibilityManager = new AccessibilityManager(this.config.accessibility);
    this.modules.set('accessibilityManager', this.accessibilityManager);
    
    // Initialize Security Manager
    const { SecurityManager } = await import('../modules/SecurityManager.js');
    this.securityManager = new SecurityManager(this.config.security);
    this.modules.set('securityManager', this.securityManager);
  }
  
  /**
   * Initialize and load components
   */
  async initializeComponents() {
    const componentElements = document.querySelectorAll('[data-component]');
    
    for (const element of componentElements) {
      const componentName = element.getAttribute('data-component');
      const componentSrc = element.getAttribute('data-src');
      
      if (componentName && componentSrc) {
        try {
          await this.componentLoader.loadComponent(componentName, componentSrc, element);
          this.components.set(componentName, {
            element,
            src: componentSrc,
            loaded: true,
            timestamp: Date.now()
          });
        } catch (error) {
          console.error(`Failed to load component ${componentName}:`, error);
          this.handleError(error, 'component_loading', { componentName, componentSrc });
        }
      }
    }
  }
  
  /**
   * Set up global event listeners
   */
  setupEventListeners() {
    // Page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.eventBus.emit('app:hidden');
      } else {
        this.eventBus.emit('app:visible');
      }
    });
    
    // Online/offline status
    window.addEventListener('online', () => {
      this.eventBus.emit('app:online');
    });
    
    window.addEventListener('offline', () => {
      this.eventBus.emit('app:offline');
    });
    
    // Window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.eventBus.emit('app:resize', {
          width: window.innerWidth,
          height: window.innerHeight
        });
      }, 100);
    });
    
    // Scroll events (throttled)
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.eventBus.emit('app:scroll', {
          scrollY: window.scrollY,
          scrollX: window.scrollX
        });
      }, 16); // ~60fps
    }, { passive: true });
    
    // Before unload
    window.addEventListener('beforeunload', () => {
      this.eventBus.emit('app:beforeunload');
      this.cleanup();
    });
  }
  
  /**
   * Initialize performance monitoring
   */
  initializePerformanceMonitoring() {
    if (!this.config.performance.monitoring) return;
    
    // Start performance monitoring
    this.performanceMonitor.start();
    
    // Listen for performance events
    this.eventBus.on('performance:metric', (data) => {
      this.trackPerformanceMetric(data);
    });
    
    // Monitor Core Web Vitals
    if (this.config.performance.webVitals) {
      this.performanceMonitor.trackWebVitals();
    }
  }
  
  /**
   * Initialize accessibility features
   */
  initializeAccessibility() {
    if (!this.config.accessibility.screenReader) return;
    
    // Start accessibility monitoring
    this.accessibilityManager.init();
    
    // Listen for accessibility events
    this.eventBus.on('accessibility:violation', (data) => {
      console.warn('Accessibility violation:', data);
      this.trackAccessibilityViolation(data);
    });
  }
  
  /**
   * Initialize security features
   */
  initializeSecurity() {
    // Start security monitoring
    this.securityManager.init();
    
    // Listen for security events
    this.eventBus.on('security:violation', (data) => {
      console.error('Security violation:', data);
      this.trackSecurityViolation(data);
    });
  }
  
  /**
   * Set up error handling
   */
  setupErrorHandling() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.handleError(event.error, 'javascript', {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });
    
    // Promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, 'promise_rejection');
    });
  }
  
  /**
   * Handle application errors
   */
  handleError(error, context = 'unknown', metadata = {}) {
    const errorData = {
      message: error.message || 'Unknown error',
      stack: error.stack,
      context,
      metadata,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    // Log error
    console.error('RescuePC Application Error:', errorData);
    
    // Emit error event
    this.eventBus.emit('app:error', errorData);
    
    // Track error in analytics
    this.trackError(errorData);
    
    // Attempt recovery if possible
    this.attemptErrorRecovery(error, context);
  }
  
  /**
   * Attempt to recover from errors
   */
  attemptErrorRecovery(error, context) {
    switch (context) {
      case 'component_loading':
        // Retry component loading
        setTimeout(() => {
          this.initializeComponents();
        }, 2000);
        break;
        
      case 'initialization':
        // Show fallback UI
        this.showFallbackUI();
        break;
        
      default:
        // Generic recovery
        console.log('Attempting generic error recovery...');
    }
  }
  
  /**
   * Show fallback UI when critical errors occur
   */
  showFallbackUI() {
    const fallbackHTML = `
      <div class="error-fallback">
        <h2>Something went wrong</h2>
        <p>We're having trouble loading the page. Please refresh to try again.</p>
        <button onclick="window.location.reload()">Refresh Page</button>
      </div>
    `;
    
    document.body.innerHTML = fallbackHTML;
  }
  
  /**
   * Track performance metrics
   */
  trackPerformanceMetric(data) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_metric', {
        event_category: 'performance',
        event_label: data.name,
        value: data.value,
        custom_map: {
          metric_name: data.name,
          metric_value: data.value
        }
      });
    }
  }
  
  /**
   * Track accessibility violations
   */
  trackAccessibilityViolation(data) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'accessibility_violation', {
        event_category: 'accessibility',
        event_label: data.type,
        value: 1
      });
    }
  }
  
  /**
   * Track security violations
   */
  trackSecurityViolation(data) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'security_violation', {
        event_category: 'security',
        event_label: data.type,
        value: 1
      });
    }
  }
  
  /**
   * Track errors in analytics
   */
  trackError(errorData) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: errorData.message,
        fatal: errorData.context === 'initialization',
        event_category: 'error',
        event_label: errorData.context
      });
    }
  }
  
  /**
   * Get a module by name
   */
  getModule(name) {
    return this.modules.get(name);
  }
  
  /**
   * Get a component by name
   */
  getComponent(name) {
    return this.components.get(name);
  }
  
  /**
   * Register a new module
   */
  registerModule(name, module) {
    this.modules.set(name, module);
    this.eventBus.emit('module:registered', { name, module });
  }
  
  /**
   * Register a new component
   */
  registerComponent(name, component) {
    this.components.set(name, component);
    this.eventBus.emit('component:registered', { name, component });
  }
  
  /**
   * Cleanup resources
   */
  cleanup() {
    // Clean up modules
    this.modules.forEach((module, name) => {
      if (typeof module.destroy === 'function') {
        module.destroy();
      }
    });
    
    // Clean up components
    this.components.forEach((component, name) => {
      if (typeof component.destroy === 'function') {
        component.destroy();
      }
    });
    
    // Clear event listeners
    this.eventBus.removeAllListeners();
  }
  
  /**
   * Destroy the application
   */
  destroy() {
    if (!this.initialized) return;
    
    console.log('🔄 Destroying RescuePC Application');
    
    this.cleanup();
    this.initialized = false;
    
    console.log('✅ RescuePC Application destroyed');
  }
}

/**
 * Simple Event Bus for inter-component communication
 */
class EventBus {
  constructor() {
    this.events = new Map();
  }
  
  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(callback);
  }
  
  off(event, callback) {
    if (!this.events.has(event)) return;
    
    const callbacks = this.events.get(event);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }
  
  emit(event, data) {
    if (!this.events.has(event)) return;
    
    const callbacks = this.events.get(event);
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event callback for ${event}:`, error);
      }
    });
  }
  
  removeAllListeners() {
    this.events.clear();
  }
}

// Create global application instance
window.RescuePCApp = new RescuePCApplication();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.RescuePCApp.init();
  });
} else {
  window.RescuePCApp.init();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RescuePCApplication, EventBus };
}

export { RescuePCApplication, EventBus }; 
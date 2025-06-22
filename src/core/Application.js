/**
 * @fileoverview RescuePC Repairs - Core Application
 * World-class enterprise application architecture
 * Forces HTTPS everywhere and manages all components
 * 
 * @author Tyler - RescuePC Repairs
 * @version 1.0.0
 */

class RescuePCApplication {
  constructor() {
    this.name = 'RescuePC Repairs';
    this.version = '1.0.0';
    this.isInitialized = false;
    this.modules = new Map();
    this.components = new Map();
    this.config = {
      forceHTTPS: true,
      enableAnalytics: true,
      enableServiceWorker: true,
      enablePerformanceMonitoring: true,
      debug: false
    };
    
    // Initialize immediately
    this.init();
  }
  
  /**
   * Initialize the application
   */
  async init() {
    try {
      console.log(`🚀 Initializing ${this.name} v${this.version}`);
      
      // Force HTTPS everywhere
      this.enforceHTTPS();
      
      // Initialize core modules
      await this.initializeModules();
      
      // Load components
      await this.loadComponents();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Initialize analytics
      this.initializeAnalytics();
      
      // Mark as initialized
      this.isInitialized = true;
      
      console.log('✅ RescuePC Application initialized successfully');
      
      // Dispatch ready event
      document.dispatchEvent(new CustomEvent('rescuepc:ready', {
        detail: { app: this }
      }));
      
    } catch (error) {
      console.error('❌ Failed to initialize RescuePC Application:', error);
      this.handleInitializationError(error);
    }
  }
  
  /**
   * Force HTTPS everywhere
   */
  enforceHTTPS() {
    if (!this.config.forceHTTPS) return;
    
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    
    // Don't redirect localhost or development environments
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('.local')) {
      return;
    }
    
    if (protocol !== 'https:') {
      console.log('🔒 Enforcing HTTPS redirect');
      window.location.replace(window.location.href.replace(/^http:/, 'https:'));
      return;
    }
    
    console.log('✅ HTTPS enforced');
  }
  
  /**
   * Initialize core modules
   */
  async initializeModules() {
    const modulePromises = [];
    
    // Load Component Loader
    if (typeof ComponentLoader !== 'undefined') {
      this.modules.set('componentLoader', new ComponentLoader());
      console.log('✅ Component Loader initialized');
    }
    
    // Load Performance Monitor
    if (typeof PerformanceMonitor !== 'undefined') {
      this.modules.set('performanceMonitor', new PerformanceMonitor());
      console.log('✅ Performance Monitor initialized');
    }
    
    // Load Security Manager
    if (typeof SecurityManager !== 'undefined') {
      this.modules.set('securityManager', new SecurityManager());
      console.log('✅ Security Manager initialized');
    }
    
    // Load Accessibility Manager
    if (typeof AccessibilityManager !== 'undefined') {
      this.modules.set('accessibilityManager', new AccessibilityManager());
      console.log('✅ Accessibility Manager initialized');
    }
    
    await Promise.all(modulePromises);
  }
  
  /**
   * Load all components
   */
  async loadComponents() {
    const componentLoader = this.modules.get('componentLoader');
    if (!componentLoader) {
      console.warn('⚠️ Component Loader not available');
      return;
    }
    
    // Register all components
    componentLoader
      .register('header', 'src/components/layout/Header.html', { preload: true })
      .register('hero', 'src/components/sections/Hero.html', { preload: true })
      .register('features', 'src/components/sections/Features.html')
      .register('pricing', 'src/components/sections/Pricing.html')
      .register('footer', 'src/components/layout/Footer.html');
    
    // Load all components
    await componentLoader.loadAll();
    console.log('✅ All components loaded');
  }
  
  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Smooth scroll for anchor links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"], a[data-scroll]');
      if (!link) return;
      
      e.preventDefault();
      
      const targetId = link.getAttribute('href')?.substring(1) || link.getAttribute('data-scroll');
      const target = document.getElementById(targetId);
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL without triggering scroll
        if (window.history && window.history.pushState) {
          window.history.pushState(null, null, `#${targetId}`);
        }
      }
    });
    
    // Mobile menu toggle
    document.addEventListener('click', (e) => {
      const toggle = e.target.closest('.mobile-menu-toggle');
      if (!toggle) return;
      
      const menu = document.getElementById('mobile-menu');
      if (!menu) return;
      
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      
      toggle.setAttribute('aria-expanded', !isExpanded);
      menu.setAttribute('aria-hidden', isExpanded);
      toggle.classList.toggle('active');
      menu.classList.toggle('active');
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = isExpanded ? '' : 'hidden';
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      const menu = document.getElementById('mobile-menu');
      const toggle = document.querySelector('.mobile-menu-toggle');
      
      if (!menu || !toggle) return;
      
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        toggle.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
        toggle.classList.remove('active');
        menu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    
    // Handle page load completion
    window.addEventListener('load', () => {
      document.body.classList.remove('loading');
      document.body.classList.add('loaded');
      
      // Track page load time
      this.trackPerformance();
    });
    
    // Handle errors gracefully
    window.addEventListener('error', (e) => {
      console.error('Global error:', e.error);
      this.handleError(e.error);
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
      this.handleError(e.reason);
    });
    
    console.log('✅ Event listeners setup complete');
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
      custom_parameters: {
        app_version: this.version,
        timestamp: Date.now()
      }
    });
    
    console.log('✅ Analytics initialized');
  }
  
  /**
   * Track performance metrics
   */
  trackPerformance() {
    if (!this.config.enablePerformanceMonitoring) return;
    
    try {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (!perfData) return;
      
      const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
      const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
      
      console.log(`📊 Performance: Load Time ${loadTime}ms, DOM Ready ${domContentLoaded}ms`);
      
      // Send to analytics if available
      if (typeof gtag !== 'undefined') {
        gtag('event', 'timing_complete', {
          name: 'page_load',
          value: Math.round(loadTime)
        });
        
        gtag('event', 'timing_complete', {
          name: 'dom_ready',
          value: Math.round(domContentLoaded)
        });
      }
      
      // Warn if performance is poor
      if (loadTime > 3000) {
        console.warn(`⚠️ Slow page load detected: ${loadTime}ms`);
      }
      
    } catch (error) {
      console.warn('⚠️ Performance tracking failed:', error);
    }
  }
  
  /**
   * Handle initialization errors
   */
  handleInitializationError(error) {
    console.error('💥 Initialization Error:', error);
    
    // Show user-friendly error message
    const errorHtml = `
      <div class="error-fallback" style="
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
   * Handle runtime errors
   */
  handleError(error) {
    // Log error
    console.error('Runtime error:', error);
    
    // Send to analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: error.message || 'Unknown error',
        fatal: false
      });
    }
    
    // Don't show error UI for minor errors
    if (error.message && error.message.includes('Loading module')) {
      console.warn('Module loading failed, using fallback');
      return;
    }
  }
  
  /**
   * Get module by name
   */
  getModule(name) {
    return this.modules.get(name);
  }
  
  /**
   * Get component by name
   */
  getComponent(name) {
    return this.components.get(name);
  }
  
  /**
   * Check if application is ready
   */
  isReady() {
    return this.isInitialized;
  }
}

// Initialize application
let rescuePCApp;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    rescuePCApp = new RescuePCApplication();
  });
} else {
  rescuePCApp = new RescuePCApplication();
}

// Make available globally for debugging
if (typeof window !== 'undefined') {
  window.RescuePCApp = rescuePCApp;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RescuePCApplication;
}

export default RescuePCApplication;
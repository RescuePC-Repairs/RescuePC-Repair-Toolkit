/**
 * @fileoverview Ultra-Advanced Main Application
 * Enterprise-grade JavaScript with cutting-edge architecture
 * 
 * Features:
 * - Modern ES modules with dynamic imports
 * - Component-based architecture
 * - Performance optimization
 * - Security hardening
 * - Error boundary implementation
 * - Progressive enhancement
 * - Service worker integration
 * 
 * @author RescuePC Engineering Team
 * @version 2.0.0
 */

import { Application } from '../core/Application.js';
import { Logger } from '../core/logging/Logger.js';
import { PerformanceOptimizer } from '../core/performance/PerformanceOptimizer.js';
import { SecurityManager } from '../core/security/SecurityManager.js';

/**
 * Ultra-Advanced Application Bootstrap
 */
class UltraAdvancedApp {
  constructor() {
    this.logger = new Logger('UltraAdvancedApp');
    this.app = null;
    this.performance = null;
    this.security = null;
    this.initialized = false;
    this.modules = new Map();
    this.errorBoundary = null;
    
    this.config = {
      enableSecurity: true,
      enablePerformance: true,
      enablePWA: true,
      enableAnalytics: true,
      enableErrorReporting: true,
      debug: false
    };
  }

  /**
   * Initialize the ultra-advanced application
   */
  async init() {
    try {
      this.logger.info('🚀 Initializing Ultra-Advanced RescuePC Application');
      
      // Setup error boundary first
      this.setupErrorBoundary();
      
      // Initialize core systems
      await this.initializeCoreServices();
      
      // Initialize application
      await this.initializeApplication();
      
      // Initialize components
      await this.initializeComponents();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Initialize PWA features
      if (this.config.enablePWA) {
        await this.initializePWA();
      }
      
      // Start performance monitoring
      this.startMonitoring();
      
      this.initialized = true;
      this.logger.info('✅ Ultra-Advanced Application Initialized Successfully');
      
      // Emit ready event
      this.emitReadyEvent();
      
    } catch (error) {
      this.handleCriticalError('Application initialization failed', error);
    }
  }

  /**
   * Setup global error boundary
   */
  setupErrorBoundary() {
    this.errorBoundary = {
      errors: new Map(),
      maxErrors: 10,
      timeWindow: 60000 // 1 minute
    };

    // Global error handler
    window.addEventListener('error', (event) => {
      this.handleError('Global Error', event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError('Unhandled Promise Rejection', event.reason);
      event.preventDefault(); // Prevent console logging
    });

    this.logger.info('Error boundary established');
  }

  /**
   * Initialize core services
   */
  async initializeCoreServices() {
    try {
      // Initialize security manager
      if (this.config.enableSecurity) {
        this.security = new SecurityManager();
        await this.security.init();
        this.logger.info('🛡️ Security Manager initialized');
      }

      // Initialize performance optimizer
      if (this.config.enablePerformance) {
        this.performance = new PerformanceOptimizer();
        await this.performance.init();
        this.logger.info('⚡ Performance Optimizer initialized');
      }

    } catch (error) {
      this.logger.error('Core services initialization failed', error);
      throw error;
    }
  }

  /**
   * Initialize main application
   */
  async initializeApplication() {
    try {
      this.app = new Application({
        security: this.security,
        performance: this.performance,
        logger: this.logger
      });
      
      await this.app.init();
      this.logger.info('🏗️ Core Application initialized');
      
    } catch (error) {
      this.logger.error('Application initialization failed', error);
      throw error;
    }
  }

  /**
   * Initialize components dynamically
   */
  async initializeComponents() {
    const componentConfigs = [
      { name: 'header', selector: '[data-component="header"]', module: './components/HeaderComponent.js' },
      { name: 'hero', selector: '[data-component="hero"]', module: './components/HeroComponent.js' },
      { name: 'features', selector: '[data-component="features"]', module: './components/FeaturesComponent.js' },
      { name: 'pricing', selector: '[data-component="pricing"]', module: './components/PricingComponent.js' },
      { name: 'footer', selector: '[data-component="footer"]', module: './components/FooterComponent.js' }
    ];

    // Load components in parallel
    const componentPromises = componentConfigs.map(config => 
      this.loadComponent(config)
    );

    const results = await Promise.allSettled(componentPromises);
    
    // Log results
    results.forEach((result, index) => {
      const config = componentConfigs[index];
      if (result.status === 'fulfilled') {
        this.logger.info(`✅ Component loaded: ${config.name}`);
      } else {
        this.logger.error(`❌ Component failed: ${config.name}`, result.reason);
      }
    });
  }

  /**
   * Load individual component
   */
  async loadComponent(config) {
    try {
      const element = document.querySelector(config.selector);
      if (!element) {
        this.logger.warn(`Component element not found: ${config.selector}`);
        return;
      }

      // Dynamic import with error handling
      const module = await import(/* @vite-ignore */ config.module);
      const ComponentClass = module.default || module[config.name];
      
      if (!ComponentClass) {
        throw new Error(`Component class not found in module: ${config.module}`);
      }

      // Initialize component
      const component = new ComponentClass(element, {
        app: this.app,
        logger: this.logger.createChild(config.name)
      });

      await component.init();
      this.modules.set(config.name, component);
      
      return component;
    } catch (error) {
      this.logger.error(`Failed to load component: ${config.name}`, error);
      throw error;
    }
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

    // Network status
    window.addEventListener('online', () => {
      this.logger.info('Network connection restored');
      this.handleNetworkOnline();
    });

    window.addEventListener('offline', () => {
      this.logger.warn('Network connection lost');
      this.handleNetworkOffline();
    });

    // Performance navigation
    window.addEventListener('beforeunload', () => {
      this.handleBeforeUnload();
    });

    this.logger.info('Event listeners configured');
  }

  /**
   * Initialize PWA features
   */
  async initializePWA() {
    try {
      // Register service worker
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/sw.js');
        this.logger.info('Service Worker registered', {
          scope: registration.scope
        });
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          this.handleServiceWorkerUpdate(registration);
        });
      }

      // Setup install prompt
      this.setupInstallPrompt();
      
      // Setup push notifications
      await this.setupPushNotifications();
      
      this.logger.info('PWA features initialized');
      
    } catch (error) {
      this.logger.error('PWA initialization failed', error);
    }
  }

  /**
   * Setup install prompt
   */
  setupInstallPrompt() {
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      deferredPrompt = event;
      
      // Show custom install button
      this.showInstallButton(deferredPrompt);
    });

    window.addEventListener('appinstalled', () => {
      this.logger.info('PWA installed successfully');
      this.hideInstallButton();
    });
  }

  /**
   * Show install button
   */
  showInstallButton(deferredPrompt) {
    const installButton = document.createElement('button');
    installButton.className = 'install-button';
    installButton.innerHTML = `
      <i class="fas fa-download"></i>
      Install App
    `;
    
    installButton.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        this.logger.info('Install prompt result', { outcome });
        deferredPrompt = null;
      }
    });

    // Add to header or appropriate location
    const header = document.querySelector('.header');
    if (header) {
      header.appendChild(installButton);
    }
  }

  /**
   * Start monitoring systems
   */
  startMonitoring() {
    // Performance monitoring
    if (this.performance) {
      setInterval(() => {
        const metrics = this.performance.getPerformanceMetrics();
        this.logger.debug('Performance metrics', metrics);
      }, 30000); // Every 30 seconds
    }

    // Security monitoring
    if (this.security) {
      setInterval(() => {
        const metrics = this.security.getSecurityMetrics();
        this.logger.debug('Security metrics', metrics);
      }, 60000); // Every minute
    }

    // Memory monitoring
    this.startMemoryMonitoring();
    
    this.logger.info('Monitoring systems started');
  }

  /**
   * Start memory monitoring
   */
  startMemoryMonitoring() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        const usage = {
          used: Math.round(memory.usedJSHeapSize / 1048576), // MB
          total: Math.round(memory.totalJSHeapSize / 1048576), // MB
          limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
        };

        if (usage.used / usage.limit > 0.8) {
          this.logger.warn('High memory usage detected', usage);
          this.optimizeMemoryUsage();
        }
      }, 60000); // Every minute
    }
  }

  /**
   * Handle errors with intelligent recovery
   */
  handleError(type, error, context = {}) {
    const errorId = this.generateErrorId();
    const timestamp = Date.now();
    
    // Store error
    this.errorBoundary.errors.set(errorId, {
      type,
      error: error?.message || error,
      stack: error?.stack,
      context,
      timestamp,
      url: window.location.href,
      userAgent: navigator.userAgent
    });

    // Clean old errors
    this.cleanOldErrors();

    // Check error frequency
    if (this.errorBoundary.errors.size > this.errorBoundary.maxErrors) {
      this.handleCriticalError('Too many errors detected', error);
      return;
    }

    // Log error
    this.logger.error(`${type}: ${error?.message || error}`, {
      errorId,
      context,
      stack: error?.stack
    });

    // Attempt recovery
    this.attemptErrorRecovery(type, error);
  }

  /**
   * Attempt error recovery
   */
  attemptErrorRecovery(type, error) {
    try {
      switch (type) {
        case 'Component Error':
          this.recoverComponent(error);
          break;
        case 'Network Error':
          this.recoverNetwork(error);
          break;
        case 'Security Error':
          this.recoverSecurity(error);
          break;
        default:
          this.performGenericRecovery();
      }
    } catch (recoveryError) {
      this.logger.error('Error recovery failed', recoveryError);
    }
  }

  /**
   * Perform generic error recovery
   */
  performGenericRecovery() {
    this.logger.info('Performing generic error recovery');
    
    // Clear any error states
    this.clearErrorStates();
    
    // Restart failed components
    this.restartFailedComponents();
    
    // Clear caches if available
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('error') || name.includes('failed')) {
            caches.delete(name);
          }
        });
      });
    }
  }

  /**
   * Recover component errors
   */
  recoverComponent(error) {
    this.logger.info('Recovering from component error');
    
    // Find and restart failed component
    const failedComponentName = this.extractComponentName(error);
    if (failedComponentName) {
      this.restartComponent(failedComponentName);
    }
  }

  /**
   * Recover from network errors
   */
  recoverNetwork(error) {
    this.logger.info('Recovering from network error');
    
    // Check network status
    if (!navigator.onLine) {
      this.showErrorMessage('Network connection lost. Please check your internet connection.');
      return;
    }
    
    // Retry failed requests
    this.retryFailedRequests();
  }

  /**
   * Recover from security errors
   */
  recoverSecurity(error) {
    this.logger.info('Recovering from security error');
    
    // Reinitialize security if possible
    if (this.security && typeof this.security.recover === 'function') {
      this.security.recover();
    }
    
    // Clear potentially compromised data
    this.clearSecuritySensitiveData();
  }

  /**
   * Report critical error to monitoring service
   */
  reportCriticalError(message, error) {
    try {
      // Create error report
      const errorReport = {
        message,
        error: error?.message || error,
        stack: error?.stack,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        appVersion: '2.0.0',
        metrics: this.getErrorMetrics()
      };

      // Log locally
      this.logger.error('Critical error reported', errorReport);

      // Send to monitoring service (if configured)
      if (this.config.enableErrorReporting && this.errorReportingEndpoint) {
        fetch(this.errorReportingEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(errorReport)
        }).catch(reportError => {
          this.logger.error('Failed to report error to monitoring service', reportError);
        });
      }

    } catch (reportingError) {
      this.logger.error('Error in error reporting', reportingError);
    }
  }

  /**
   * Clear error states
   */
  clearErrorStates() {
    // Remove error classes from elements
    document.querySelectorAll('.error, .failed').forEach(element => {
      element.classList.remove('error', 'failed');
    });

    // Clear error messages
    document.querySelectorAll('.error-message').forEach(element => {
      element.remove();
    });
  }

  /**
   * Restart failed components
   */
  restartFailedComponents() {
    this.modules.forEach((module, name) => {
      if (module.hasError) {
        this.restartComponent(name);
      }
    });
  }

  /**
   * Restart specific component
   */
  restartComponent(componentName) {
    try {
      const component = this.modules.get(componentName);
      if (component) {
        // Destroy current instance
        if (typeof component.destroy === 'function') {
          component.destroy();
        }

        // Reload component
        const config = this.getComponentConfig(componentName);
        if (config) {
          this.loadComponent(config).catch(error => {
            this.logger.error(`Failed to restart component: ${componentName}`, error);
          });
        }
      }
    } catch (error) {
      this.logger.error(`Error restarting component: ${componentName}`, error);
    }
  }

  /**
   * Extract component name from error
   */
  extractComponentName(error) {
    const message = error?.message || error;
    const match = message.match(/component[:\s]+([a-zA-Z]+)/i);
    return match ? match[1].toLowerCase() : null;
  }

  /**
   * Get component configuration
   */
  getComponentConfig(componentName) {
    const configs = {
      header: { name: 'header', selector: '[data-component="header"]', module: './components/HeaderComponent.js' },
      hero: { name: 'hero', selector: '[data-component="hero"]', module: './components/HeroComponent.js' },
      features: { name: 'features', selector: '[data-component="features"]', module: './components/FeaturesComponent.js' },
      pricing: { name: 'pricing', selector: '[data-component="pricing"]', module: './components/PricingComponent.js' },
      footer: { name: 'footer', selector: '[data-component="footer"]', module: './components/FooterComponent.js' }
    };
    
    return configs[componentName] || null;
  }

  /**
   * Retry failed requests
   */
  retryFailedRequests() {
    // Implementation would depend on request tracking
    this.logger.info('Retrying failed requests (placeholder implementation)');
  }

  /**
   * Clear security sensitive data
   */
  clearSecuritySensitiveData() {
    try {
      // Clear localStorage items that might be compromised
      const sensitiveKeys = ['token', 'session', 'auth', 'key'];
      sensitiveKeys.forEach(key => {
        Object.keys(localStorage).forEach(storageKey => {
          if (storageKey.toLowerCase().includes(key)) {
            localStorage.removeItem(storageKey);
          }
        });
      });

      // Clear sessionStorage
      sessionStorage.clear();

    } catch (error) {
      this.logger.error('Error clearing security sensitive data', error);
    }
  }

  /**
   * Get error metrics
   */
  getErrorMetrics() {
    return {
      totalErrors: this.errorBoundary.errors.size,
      errorTypes: Array.from(this.errorBoundary.errors.values()).reduce((types, error) => {
        types[error.type] = (types[error.type] || 0) + 1;
        return types;
      }, {}),
      memoryUsage: this.getMemoryUsage(),
      timestamp: Date.now()
    };
  }

  /**
   * Get memory usage information
   */
  getMemoryUsage() {
    try {
      if (performance.memory) {
        return {
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Handle network events
   */
  handleNetworkOnline() {
    this.logger.info('Network connection restored');
    
    // Retry failed operations
    this.retryFailedRequests();
    
    // Resume normal operations
    this.resumeAllComponents();
  }

  handleNetworkOffline() {
    this.logger.warn('Network connection lost');
    
    // Switch to offline mode if supported
    if ('serviceWorker' in navigator) {
      this.showErrorMessage('You are now offline. Some features may be limited.');
    }
  }

  /**
   * Handle before unload
   */
  handleBeforeUnload() {
    // Save any pending data
    this.savePendingData();
    
    // Report final metrics
    if (this.performance) {
      const metrics = this.performance.getPerformanceMetrics();
      this.logger.info('Final performance metrics', metrics);
    }
  }

  /**
   * Setup push notifications
   */
  async setupPushNotifications() {
    try {
      if ('Notification' in window && 'serviceWorker' in navigator) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          this.logger.info('Push notifications enabled');
        }
      }
    } catch (error) {
      this.logger.error('Push notification setup failed', error);
    }
  }

  /**
   * Handle service worker update
   */
  handleServiceWorkerUpdate(registration) {
    const newWorker = registration.installing;
    
    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        // Show update notification
        this.showUpdateNotification();
      }
    });
  }

  /**
   * Show update notification
   */
  showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <p>A new version is available!</p>
        <button onclick="window.location.reload()">Update Now</button>
        <button onclick="this.parentElement.parentElement.remove()">Later</button>
      </div>
    `;
    
    document.body.appendChild(notification);
  }

  /**
   * Hide install button
   */
  hideInstallButton() {
    const installButton = document.querySelector('.install-button');
    if (installButton) {
      installButton.remove();
    }
  }

  /**
   * Optimize memory usage
   */
  optimizeMemoryUsage() {
    this.logger.info('Optimizing memory usage');
    
    // Clear caches
    this.clearOldCaches();
    
    // Garbage collect if possible
    if (window.gc) {
      window.gc();
    }
    
    // Clean up unused modules
    this.cleanupUnusedModules();
  }

  /**
   * Clear old caches
   */
  clearOldCaches() {
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('old') || name.includes('temp')) {
            caches.delete(name);
          }
        });
      });
    }
  }

  /**
   * Cleanup unused modules
   */
  cleanupUnusedModules() {
    this.modules.forEach((module, name) => {
      if (module.lastUsed && Date.now() - module.lastUsed > 600000) { // 10 minutes
        this.logger.info(`Cleaning up unused module: ${name}`);
        if (typeof module.destroy === 'function') {
          module.destroy();
        }
        this.modules.delete(name);
      }
    });
  }

  /**
   * Resume all components
   */
  resumeAllComponents() {
    this.modules.forEach(module => {
      if (module.resume && typeof module.resume === 'function') {
        module.resume();
      }
    });
  }

  /**
   * Save pending data
   */
  savePendingData() {
    try {
      const pendingData = {
        timestamp: Date.now(),
        modules: Array.from(this.modules.keys()),
        errors: this.errorBoundary.errors.size
      };
      
      localStorage.setItem('rescuepc_pending_data', JSON.stringify(pendingData));
    } catch (error) {
      this.logger.error('Failed to save pending data', error);
    }
  }

  /**
   * Handle critical errors
   */
  handleCriticalError(message, error) {
    this.logger.error(`CRITICAL: ${message}`, error);
    
    // Show user-friendly error message
    this.showErrorMessage('Something went wrong. Please refresh the page.');
    
    // Report to monitoring service
    this.reportCriticalError(message, error);
  }

  /**
   * Emit ready event
   */
  emitReadyEvent() {
    const readyEvent = new CustomEvent('app:ready', {
      detail: {
        timestamp: Date.now(),
        version: '2.0.0',
        features: {
          security: !!this.security,
          performance: !!this.performance,
          pwa: this.config.enablePWA
        }
      }
    });
    
    document.dispatchEvent(readyEvent);
    this.logger.info('Application ready event emitted');
  }

  /**
   * Handle page visibility changes
   */
  handlePageHidden() {
    this.logger.info('Page hidden - pausing non-critical operations');
    
    // Pause non-critical operations
    this.modules.forEach(module => {
      if (module.pause && typeof module.pause === 'function') {
        module.pause();
      }
    });
  }

  handlePageVisible() {
    this.logger.info('Page visible - resuming operations');
    
    // Resume operations
    this.modules.forEach(module => {
      if (module.resume && typeof module.resume === 'function') {
        module.resume();
      }
    });
  }

  /**
   * Utility methods
   */
  generateErrorId() {
    return Math.random().toString(36).substr(2, 9);
  }

  cleanOldErrors() {
    const now = Date.now();
    this.errorBoundary.errors.forEach((error, id) => {
      if (now - error.timestamp > this.errorBoundary.timeWindow) {
        this.errorBoundary.errors.delete(id);
      }
    });
  }

  showErrorMessage(message) {
    // Create and show error toast
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 5000);
  }

  /**
   * Cleanup and destroy
   */
  destroy() {
    // Cleanup modules
    this.modules.forEach(module => {
      if (module.destroy && typeof module.destroy === 'function') {
        module.destroy();
      }
    });
    
    // Cleanup core services
    if (this.security) this.security.destroy();
    if (this.performance) this.performance.destroy();
    if (this.app) this.app.destroy();
    
    this.logger.info('Application destroyed');
  }
}

/**
 * Initialize application when DOM is ready
 */
const initializeApp = async () => {
  try {
    const app = new UltraAdvancedApp();
    await app.init();
    
    // Make app globally available for debugging
    if (app.config.debug) {
      window.__RESCUE_PC_APP__ = app;
    }
    
  } catch (error) {
    console.error('Failed to initialize application:', error);
    
    // Fallback initialization
    document.body.innerHTML = `
      <div class="error-fallback">
        <h1>Application Error</h1>
        <p>Unable to load the application. Please refresh the page.</p>
        <button onclick="window.location.reload()">Refresh Page</button>
      </div>
    `;
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Export for module usage
export { UltraAdvancedApp }; 
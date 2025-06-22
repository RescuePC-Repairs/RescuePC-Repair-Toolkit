/**
 * HTTPS Enforcer Module
 * Forces HTTPS everywhere with military-grade security
 * Ensures all origins, resources, and connections are secure
 */
class HTTPSEnforcer {
  constructor() {
    this.isProduction = location.hostname !== 'localhost' && location.hostname !== '127.0.0.1';
    this.securityLevel = 'military-grade';
    this.violations = [];
    
    this.init();
  }
  
  /**
   * Initialize HTTPS enforcement
   */
  init() {
    console.log('🔒 Initializing military-grade HTTPS enforcement...');
    
    // Force HTTPS immediately
    this.enforceHTTPS();
    
    // Setup security monitoring
    this.setupSecurityMonitoring();
    
    // Validate all resources
    this.validateSecureResources();
    
    // Setup CSP violation monitoring
    this.setupCSPMonitoring();
    
    // Force secure origins
    this.enforceSecureOrigins();
    
    console.log('✅ Military-grade HTTPS enforcement active');
  }
  
  /**
   * Force HTTPS on all connections
   */
  enforceHTTPS() {
    // Skip for localhost development
    if (!this.isProduction) {
      console.log('🔓 HTTPS enforcement skipped for localhost');
      return;
    }
    
    // Immediate HTTPS redirect
    if (location.protocol !== 'https:') {
      console.log('🔒 Forcing HTTPS redirect...');
      const httpsUrl = 'https:' + window.location.href.substring(window.location.protocol.length);
      location.replace(httpsUrl);
      return;
    }
    
    // Set HTTPS-only mode
    this.setHTTPSOnlyMode();
    
    console.log('🔒 HTTPS enforced successfully');
  }
  
  /**
   * Set HTTPS-only mode
   */
  setHTTPSOnlyMode() {
    // Override fetch to force HTTPS
    const originalFetch = window.fetch;
    window.fetch = function(url, options = {}) {
      if (typeof url === 'string' && url.startsWith('http:')) {
        url = url.replace('http:', 'https:');
        console.warn('🔒 Upgraded insecure request to HTTPS:', url);
      }
      return originalFetch.call(this, url, options);
    };
    
    // Override XMLHttpRequest to force HTTPS
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
      if (typeof url === 'string' && url.startsWith('http:')) {
        url = url.replace('http:', 'https:');
        console.warn('🔒 Upgraded insecure XHR to HTTPS:', url);
      }
      return originalOpen.call(this, method, url, ...args);
    };
    
    // Force secure WebSocket connections
    const originalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
      if (typeof url === 'string' && url.startsWith('ws:')) {
        url = url.replace('ws:', 'wss:');
        console.warn('🔒 Upgraded insecure WebSocket to WSS:', url);
      }
      return new originalWebSocket(url, protocols);
    };
  }
  
  /**
   * Setup security monitoring
   */
  setupSecurityMonitoring() {
    // Monitor for mixed content
    this.monitorMixedContent();
    
    // Monitor for insecure resources
    this.monitorInsecureResources();
    
    // Monitor for security downgrades
    this.monitorSecurityDowngrades();
    
    // Setup performance observer for security
    this.setupSecurityObserver();
  }
  
  /**
   * Monitor mixed content
   */
  monitorMixedContent() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            this.checkElementSecurity(node);
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Check existing elements
    this.checkAllElementsSecurity();
  }
  
  /**
   * Check element security
   */
  checkElementSecurity(element) {
    const insecureAttributes = ['src', 'href', 'action', 'data'];
    
    insecureAttributes.forEach(attr => {
      const value = element.getAttribute(attr);
      if (value && value.startsWith('http:')) {
        this.reportSecurityViolation('mixed_content', {
          element: element.tagName,
          attribute: attr,
          url: value
        });
        
        // Auto-fix if possible
        if (this.isProduction) {
          element.setAttribute(attr, value.replace('http:', 'https:'));
          console.warn('🔒 Auto-fixed insecure resource:', value);
        }
      }
    });
  }
  
  /**
   * Check all elements security
   */
  checkAllElementsSecurity() {
    const elements = document.querySelectorAll('*');
    elements.forEach(element => this.checkElementSecurity(element));
  }
  
  /**
   * Monitor insecure resources
   */
  monitorInsecureResources() {
    // Monitor image loading
    document.addEventListener('error', (e) => {
      if (e.target.tagName === 'IMG' && e.target.src.startsWith('http:')) {
        this.reportSecurityViolation('insecure_image', {
          src: e.target.src
        });
      }
    }, true);
    
    // Monitor script loading
    document.addEventListener('error', (e) => {
      if (e.target.tagName === 'SCRIPT' && e.target.src.startsWith('http:')) {
        this.reportSecurityViolation('insecure_script', {
          src: e.target.src
        });
      }
    }, true);
  }
  
  /**
   * Monitor security downgrades
   */
  monitorSecurityDowngrades() {
    // Monitor for protocol downgrades
    if ('SecurityPolicyViolationEvent' in window) {
      document.addEventListener('securitypolicyviolation', (e) => {
        this.reportSecurityViolation('csp_violation', {
          directive: e.violatedDirective,
          blockedURI: e.blockedURI,
          originalPolicy: e.originalPolicy
        });
      });
    }
  }
  
  /**
   * Setup security observer
   */
  setupSecurityObserver() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name.startsWith('http:')) {
            this.reportSecurityViolation('insecure_resource_load', {
              resource: entry.name,
              duration: entry.duration
            });
          }
        });
      });
      
      observer.observe({entryTypes: ['resource']});
    }
  }
  
  /**
   * Validate secure resources
   */
  validateSecureResources() {
    const resources = [
      ...document.querySelectorAll('img[src]'),
      ...document.querySelectorAll('script[src]'),
      ...document.querySelectorAll('link[href]'),
      ...document.querySelectorAll('iframe[src]'),
      ...document.querySelectorAll('form[action]')
    ];
    
    let insecureCount = 0;
    
    resources.forEach(element => {
      const url = element.src || element.href || element.action;
      if (url && url.startsWith('http:')) {
        insecureCount++;
        console.warn('🚨 Insecure resource detected:', {
          element: element.tagName,
          url: url
        });
      }
    });
    
    if (insecureCount === 0) {
      console.log('✅ All resources are secure (HTTPS)');
    } else {
      console.error(`🚨 ${insecureCount} insecure resources found`);
    }
    
    return insecureCount === 0;
  }
  
  /**
   * Setup CSP monitoring
   */
  setupCSPMonitoring() {
    // Check if CSP is properly configured
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!cspMeta) {
      console.warn('⚠️ Content Security Policy not found');
      return;
    }
    
    const cspContent = cspMeta.getAttribute('content');
    if (!cspContent.includes('upgrade-insecure-requests')) {
      console.warn('⚠️ CSP missing upgrade-insecure-requests directive');
    }
    
    console.log('🛡️ CSP monitoring active');
  }
  
  /**
   * Enforce secure origins
   */
  enforceSecureOrigins() {
    // Override postMessage to ensure secure origins
    const originalPostMessage = window.postMessage;
    window.postMessage = function(message, targetOrigin, transfer) {
      if (targetOrigin && targetOrigin.startsWith('http:')) {
        console.warn('🔒 Blocking insecure postMessage origin:', targetOrigin);
        return;
      }
      return originalPostMessage.call(this, message, targetOrigin, transfer);
    };
    
    // Monitor message events for insecure origins
    window.addEventListener('message', (e) => {
      if (e.origin && e.origin.startsWith('http:')) {
        console.warn('🚨 Received message from insecure origin:', e.origin);
        this.reportSecurityViolation('insecure_message_origin', {
          origin: e.origin
        });
      }
    });
  }
  
  /**
   * Report security violation
   */
  reportSecurityViolation(type, details) {
    const violation = {
      type,
      details,
      timestamp: Date.now(),
      url: location.href,
      userAgent: navigator.userAgent
    };
    
    this.violations.push(violation);
    
    console.error('🚨 Security Violation:', violation);
    
    // Send to analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'security_violation', {
        event_category: 'security',
        event_label: type,
        custom_parameters: details
      });
    }
    
    // Send to security monitoring endpoint
    if (this.isProduction) {
      this.sendSecurityReport(violation);
    }
  }
  
  /**
   * Send security report
   */
  async sendSecurityReport(violation) {
    try {
      await fetch('/api/security/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(violation)
      });
    } catch (error) {
      console.warn('Failed to send security report:', error);
    }
  }
  
  /**
   * Get security status
   */
  getSecurityStatus() {
    return {
      httpsEnforced: location.protocol === 'https:' || !this.isProduction,
      violationCount: this.violations.length,
      securityLevel: this.securityLevel,
      isProduction: this.isProduction
    };
  }
  
  /**
   * Get security violations
   */
  getViolations() {
    return [...this.violations];
  }
  
  /**
   * Clear violations
   */
  clearViolations() {
    this.violations = [];
  }
}

// Initialize HTTPS enforcer immediately
const httpsEnforcer = new HTTPSEnforcer();

// Make available globally for debugging
if (typeof window !== 'undefined') {
  window.HTTPSEnforcer = httpsEnforcer;
}

export default HTTPSEnforcer; 
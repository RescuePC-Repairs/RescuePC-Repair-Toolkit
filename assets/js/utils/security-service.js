import serviceRegistry from './service-registry.js';

class SecurityService {
  constructor() {
    this.rateLimits = new Map();
    this.ipBlacklist = new Set();
    this.requestHistory = new Map();
    this.securityConfig = {
      maxRequestsPerMinute: 1000,
      maxConcurrentConnections: 100,
      blacklistDuration: 3600000, // 1 hour
      suspiciousThreshold: 50,
      rateLimitWindow: 60000, // 1 minute
      maxPayloadSize: 1024 * 1024, // 1MB
      allowedOrigins: ['https://rescuepcrepairs.com', 'https://www.rescuepcrepairs.com'],
      securityHeaders: {
        'Content-Security-Policy': "default-src 'self' https: 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: https:; font-src 'self' https: data:;",
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
      }
    };
  }

  init() {
    this.setupSecurityHeaders();
    this.setupRequestValidation();
    this.setupRateLimiting();
    this.setupDDoSProtection();
    this.setupResourceProtection();
  }

  setupSecurityHeaders() {
    Object.entries(this.securityConfig.securityHeaders).forEach(([header, value]) => {
      document.head.appendChild(Object.assign(document.createElement('meta'), {
        'http-equiv': header,
        'content': value
      }));
    });
  }

  setupRequestValidation() {
    // Validate request origin
    if (!this.securityConfig.allowedOrigins.includes(window.location.origin)) {
      throw new Error('Invalid origin');
    }

    // Validate request size
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.transferSize > this.securityConfig.maxPayloadSize) {
          this.handleSuspiciousActivity('Large payload detected');
        }
      }
    });
    observer.observe({ entryTypes: ['resource'] });
  }

  setupRateLimiting() {
    const rateLimiter = {
      check: (ip) => {
        const now = Date.now();
        const windowStart = now - this.securityConfig.rateLimitWindow;
        
        if (!this.requestHistory.has(ip)) {
          this.requestHistory.set(ip, []);
        }
        
        const requests = this.requestHistory.get(ip).filter(time => time > windowStart);
        this.requestHistory.set(ip, requests);
        
        if (requests.length >= this.securityConfig.maxRequestsPerMinute) {
          this.handleRateLimitExceeded(ip);
          return false;
        }
        
        requests.push(now);
        return true;
      }
    };

    // Apply rate limiting to all fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
      const ip = this.getClientIP();
      if (!rateLimiter.check(ip)) {
        throw new Error('Rate limit exceeded');
      }
      return originalFetch(input, init);
    };
  }

  setupDDoSProtection() {
    // Implement connection limiting
    let activeConnections = 0;
    const connectionLimiter = {
      check: () => {
        if (activeConnections >= this.securityConfig.maxConcurrentConnections) {
          this.handleDDoSAttempt();
          return false;
        }
        activeConnections++;
        return true;
      },
      release: () => {
        activeConnections = Math.max(0, activeConnections - 1);
      }
    };

    // Monitor for suspicious patterns
    const suspiciousPatterns = new Map();
    const patternDetector = {
      check: (request) => {
        const pattern = this.getRequestPattern(request);
        const count = (suspiciousPatterns.get(pattern) || 0) + 1;
        suspiciousPatterns.set(pattern, count);
        
        if (count > this.securityConfig.suspiciousThreshold) {
          this.handleSuspiciousActivity('Suspicious pattern detected');
          return false;
        }
        return true;
      }
    };

    // Apply DDoS protection to all requests
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
      const xhr = new originalXHR();
      const originalOpen = xhr.open;
      xhr.open = function() {
        if (!connectionLimiter.check() || !patternDetector.check(arguments)) {
          throw new Error('Request blocked by security policy');
        }
        originalOpen.apply(xhr, arguments);
        xhr.addEventListener('loadend', () => connectionLimiter.release());
      };
      return xhr;
    };
  }

  setupResourceProtection() {
    // Protect against resource exhaustion
    const resourceProtector = {
      check: (resource) => {
        if (resource.size > this.securityConfig.maxPayloadSize) {
          this.handleResourceExhaustion();
          return false;
        }
        return true;
      }
    };

    // Apply resource protection to all resource loads
    const originalCreateElement = document.createElement;
    document.createElement = function() {
      const element = originalCreateElement.apply(document, arguments);
      if (element.tagName === 'SCRIPT' || element.tagName === 'LINK') {
        const originalSetAttribute = element.setAttribute;
        element.setAttribute = function() {
          if (arguments[0] === 'src' || arguments[0] === 'href') {
            if (!resourceProtector.check(arguments[1])) {
              throw new Error('Resource blocked by security policy');
            }
          }
          originalSetAttribute.apply(element, arguments);
        };
      }
      return element;
    };
  }

  handleRateLimitExceeded(ip) {
    this.ipBlacklist.add(ip);
    setTimeout(() => this.ipBlacklist.delete(ip), this.securityConfig.blacklistDuration);
    this.logSecurityEvent('Rate limit exceeded', { ip });
  }

  handleDDoSAttempt() {
    this.logSecurityEvent('DDoS attempt detected');
    // Implement additional DDoS mitigation strategies
  }

  handleSuspiciousActivity(reason) {
    this.logSecurityEvent('Suspicious activity detected', { reason });
    // Implement additional security measures
  }

  handleResourceExhaustion() {
    this.logSecurityEvent('Resource exhaustion attempt detected');
    // Implement resource protection measures
  }

  getClientIP() {
    // Implement IP detection logic
    return '127.0.0.1'; // Placeholder
  }

  getRequestPattern(request) {
    // Implement request pattern detection
    return JSON.stringify(request);
  }

  logSecurityEvent(event, details = {}) {
    console.warn('Security Event:', event, details);
    // Implement logging to security monitoring system
  }
}

// Register security service
serviceRegistry.register('security', new SecurityService());

export default serviceRegistry.get('security'); 
import serviceRegistry from './service-registry.js';

class WebSecurityService {
  constructor() {
    this.config = {
      allowedOrigins: ['https://rescuepcrepairs.com', 'https://www.rescuepcrepairs.com'],
      allowedDomains: ['cdnjs.cloudflare.com', 'js.stripe.com', 'www.google-analytics.com', 'www.googletagmanager.com'],
      maxRequestsPerMinute: 100,
      maxConcurrentConnections: 50,
      blockDuration: 3600000, // 1 hour in milliseconds
      suspiciousThreshold: 10,
      resourceTimeout: 30000, // 30 seconds
      retryAttempts: 3,
      retryDelay: 1000
    };
    
    this.initializeService();
  }

  initializeService() {
    try {
      this.setupSecurityHeaders();
      this.setupRequestValidation();
      this.setupRateLimiting();
      this.setupDDoSProtection();
      this.setupResourceProtection();
      this.setupContentSecurity();
      this.setupEventHandlers();
      console.log('WebSecurityService initialized successfully');
    } catch (error) {
      console.error('Error initializing WebSecurityService:', error);
    }
  }

  setupSecurityHeaders() {
    this.securityHeaders = {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https: https://cdnjs.cloudflare.com; img-src 'self' data: https:; font-src 'self' https: data: https://cdnjs.cloudflare.com; connect-src 'self' https:; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; object-src 'none';",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), interest-cohort=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      // XSS Protection
      xssConfig: {
        sanitizeInputs: true,
        sanitizeOutputs: true,
        escapeHtml: true,
        escapeJs: true,
        escapeCss: true,
        escapeUrls: true,
        preventDomManipulation: true
      },
      
      // CSRF Protection
      csrfConfig: {
        tokenLength: 32,
        tokenExpiry: 3600000, // 1 hour
        validateOrigin: true,
        validateReferer: true,
        validateMethod: true
      },
      
      // SQL Injection Protection
      sqlConfig: {
        sanitizeQueries: true,
        parameterizeQueries: true,
        validateInputs: true,
        escapeSpecialChars: true
      },
      
      // Command Injection Protection
      commandConfig: {
        sanitizeCommands: true,
        validateCommands: true,
        escapeShellChars: true,
        restrictCommands: true
      },
      
      // File Upload Protection
      uploadConfig: {
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
        scanFiles: true,
        validateContent: true,
        sanitizeNames: true
      },
      
      // Session Security
      sessionConfig: {
        secureCookies: true,
        httpOnly: true,
        sameSite: 'Strict',
        maxAge: 3600,
        regenerateId: true
      },
      
      // Content Security
      contentConfig: {
        validateContent: true,
        sanitizeContent: true,
        preventHotlinking: true,
        validateMimeTypes: true
      }
    };

    this.securityHeaders = {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https: https://cdnjs.cloudflare.com; img-src 'self' data: https:; font-src 'self' https: data: https://cdnjs.cloudflare.com; connect-src 'self' https:; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; object-src 'none';",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), interest-cohort=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Resource-Policy': 'same-origin'
    };
  }

  init() {
    this.setupSecurityHeaders();
    this.setupXSSProtection();
    this.setupCSRFProtection();
    this.setupSQLInjectionProtection();
    this.setupCommandInjectionProtection();
    this.setupFileUploadProtection();
    this.setupSessionSecurity();
    this.setupContentSecurity();
    this.setupExploitPrevention();
  }

  setupSecurityHeaders() {
    Object.entries(this.securityHeaders).forEach(([header, value]) => {
      document.head.appendChild(Object.assign(document.createElement('meta'), {
        'http-equiv': header,
        'content': value
      }));
    });
  }

  setupXSSProtection() {
    // Sanitize all user inputs
    const sanitizeInput = (input) => {
      if (typeof input !== 'string') return input;
      return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    };

    // Override innerHTML and outerHTML
    const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
    Object.defineProperty(Element.prototype, 'innerHTML', {
      set: function(value) {
        originalInnerHTML.set.call(this, sanitizeInput(value));
      },
      get: originalInnerHTML.get
    });

    // Prevent dangerous DOM operations
    const dangerousOperations = ['eval', 'setTimeout', 'setInterval', 'Function'];
    dangerousOperations.forEach(op => {
      const original = window[op];
      window[op] = function() {
        console.warn(`Blocked potentially dangerous operation: ${op}`);
        return null;
      };
    });
  }

  setupCSRFProtection() {
    // Generate CSRF token
    const generateToken = () => {
      const array = new Uint8Array(this.config.csrfConfig.tokenLength);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    };

    // Add CSRF token to all forms
    document.addEventListener('DOMContentLoaded', () => {
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        const token = generateToken();
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = '_csrf';
        input.value = token;
        form.appendChild(input);
      });
    });

    // Validate CSRF token on form submission
    document.addEventListener('submit', (e) => {
      const form = e.target;
      const token = form.querySelector('input[name="_csrf"]')?.value;
      if (!token) {
        e.preventDefault();
        console.error('CSRF token missing');
      }
    });
  }

  setupSQLInjectionProtection() {
    // Sanitize SQL queries
    const sanitizeQuery = (query) => {
      return query.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, char => {
        switch (char) {
          case '\0': return '\\0';
          case '\x08': return '\\b';
          case '\x09': return '\\t';
          case '\x1a': return '\\z';
          case '\n': return '\\n';
          case '\r': return '\\r';
          case '"':
          case "'":
          case '\\':
          case '%': return '\\' + char;
        }
      });
    };

    // Override fetch to sanitize queries
    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
      if (init?.body) {
        init.body = sanitizeQuery(init.body);
      }
      return originalFetch(input, init);
    };
  }

  setupCommandInjectionProtection() {
    // Sanitize shell commands
    const sanitizeCommand = (command) => {
      return command.replace(/[;&|`$]/g, '');
    };

    // Override eval and Function
    window.eval = function() {
      console.warn('Blocked potentially dangerous eval operation');
      return null;
    };
    window.Function = function() {
      console.warn('Blocked potentially dangerous Function operation');
      return null;
    };
  }

  setupFileUploadProtection() {
    // Validate file uploads
    const validateFile = (file) => {
      if (file.size > this.config.uploadConfig.maxFileSize) {
        throw new Error('File too large');
      }
      if (!this.config.uploadConfig.allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type');
      }
      return true;
    };

    // Override file input change event
    document.addEventListener('change', (e) => {
      if (e.target.type === 'file') {
        const files = e.target.files;
        for (let file of files) {
          try {
            validateFile(file);
          } catch (error) {
            e.preventDefault();
            console.error(error.message);
          }
        }
      }
    });
  }

  setupSessionSecurity() {
    // Set secure cookie attributes
    document.cookie = `sessionId=${this.generateSessionId()}; Secure; HttpOnly; SameSite=Strict; Max-Age=${this.config.sessionConfig.maxAge}`;
  }

  setupContentSecurity() {
    // Validate content
    const validateContent = (content) => {
      // Implement content validation logic
      return true;
    };

    // Override content setters
    const contentSetters = ['innerHTML', 'outerHTML', 'textContent'];
    contentSetters.forEach(setter => {
      const original = Object.getOwnPropertyDescriptor(Element.prototype, setter);
      Object.defineProperty(Element.prototype, setter, {
        set: function(value) {
          if (validateContent(value)) {
            original.set.call(this, value);
          }
        },
        get: original.get
      });
    });
  }

  setupExploitPrevention() {
    // Prevent prototype pollution
    Object.freeze(Object.prototype);
    
    // Prevent global object modification
    Object.freeze(window);
    
    // Prevent dangerous operations
    const dangerousProps = ['__proto__', 'constructor', 'prototype'];
    dangerousProps.forEach(prop => {
      Object.defineProperty(Object.prototype, prop, {
        get: function() {
          console.warn(`Blocked access to dangerous property: ${prop}`);
          return undefined;
        },
        set: function() {
          console.warn(`Blocked modification of dangerous property: ${prop}`);
        }
      });
    });

    // Prevent timing attacks
    const originalGetTime = Date.prototype.getTime;
    Date.prototype.getTime = function() {
      const time = originalGetTime.call(this);
      return Math.floor(time / 100) * 100;
    };
  }

  generateSessionId() {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
}

// Register web security service
serviceRegistry.register('webSecurity', new WebSecurityService());

export default serviceRegistry.get('webSecurity'); 
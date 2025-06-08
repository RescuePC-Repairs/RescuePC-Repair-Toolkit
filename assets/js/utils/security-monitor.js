class SecurityMonitor {
  constructor() {
    this.violations = [];
    this.maxViolations = 100;
    this.initializeMonitor();
  }

  initializeMonitor() {
    this.setupViolationObserver();
    this.setupConsoleOverride();
    this.setupErrorHandling();
  }

  setupViolationObserver() {
    if (window.SecurityPolicyViolationEvent) {
      document.addEventListener('securitypolicyviolation', (e) => {
        this.handleViolation({
          type: 'csp',
          source: e.violatedDirective,
          blockedURI: e.blockedURI,
          timestamp: new Date().toISOString()
        });
      });
    }
  }

  setupConsoleOverride() {
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error
    };

    console.log = (...args) => {
      this.handleViolation({
        type: 'log',
        message: args.join(' '),
        timestamp: new Date().toISOString()
      });
      originalConsole.log.apply(console, args);
    };

    console.warn = (...args) => {
      this.handleViolation({
        type: 'warning',
        message: args.join(' '),
        timestamp: new Date().toISOString()
      });
      originalConsole.warn.apply(console, args);
    };

    console.error = (...args) => {
      this.handleViolation({
        type: 'error',
        message: args.join(' '),
        timestamp: new Date().toISOString()
      });
      originalConsole.error.apply(console, args);
    };
  }

  setupErrorHandling() {
    window.addEventListener('error', (e) => {
      this.handleViolation({
        type: 'runtime-error',
        message: e.message,
        source: e.filename,
        line: e.lineno,
        column: e.colno,
        timestamp: new Date().toISOString()
      });
    });

    window.addEventListener('unhandledrejection', (e) => {
      this.handleViolation({
        type: 'promise-error',
        message: e.reason?.message || 'Unhandled Promise Rejection',
        timestamp: new Date().toISOString()
      });
    });
  }

  handleViolation(report) {
    // Ensure report is a plain object
    const violation = {
      ...report,
      timestamp: report.timestamp || new Date().toISOString()
    };

    this.violations.push(violation);
    
    // Keep only the most recent violations
    if (this.violations.length > this.maxViolations) {
      this.violations = this.violations.slice(-this.maxViolations);
    }

    // Log the violation
    console.warn('Security Violation:', violation);

    // Store in localStorage for persistence
    try {
      localStorage.setItem('securityViolations', JSON.stringify(this.violations));
    } catch (e) {
      console.error('Failed to store security violation:', e);
    }
  }

  getViolations() {
    return this.violations;
  }

  clearViolations() {
    this.violations = [];
    localStorage.removeItem('securityViolations');
  }
}

// Register the service
const securityMonitor = new SecurityMonitor();
export default securityMonitor; 
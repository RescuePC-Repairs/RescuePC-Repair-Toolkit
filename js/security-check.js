// Security Check Script
class SecurityCheck {
    constructor() {
        this.init();
    }

    init() {
        // Monitor DOM changes
        this.setupDOMMonitor();
        
        // Monitor form submissions
        this.setupFormMonitor();
        
        // Monitor AJAX requests
        this.setupAJAXMonitor();
        
        // Monitor localStorage/sessionStorage
        this.setupStorageMonitor();
        
        // Monitor console access
        this.setupConsoleMonitor();
    }

    setupDOMMonitor() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            this.checkForXSS(node);
                        }
                    });
                }
            });
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    setupFormMonitor() {
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const formData = new FormData(form);
            
            // Check for suspicious input
            for (let [key, value] of formData.entries()) {
                if (this.isSuspiciousInput(value)) {
                    e.preventDefault();
                    this.logViolation('suspicious_form_input', {
                        form: form.id || form.name,
                        field: key,
                        value: value
                    });
                    return;
                }
            }
        });
    }

    setupAJAXMonitor() {
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const [resource, config] = args;
            
            // Check URL for suspicious patterns
            if (typeof resource === 'string' && this.isSuspiciousURL(resource)) {
                this.logViolation('suspicious_ajax_request', {
                    url: resource
                });
                return Promise.reject(new Error('Suspicious request blocked'));
            }
            
            return originalFetch.apply(window, args);
        };
    }

    setupStorageMonitor() {
        const originalSetItem = Storage.prototype.setItem;
        Storage.prototype.setItem = function(key, value) {
            if (this.isSuspiciousInput(value)) {
                this.logViolation('suspicious_storage_data', {
                    key: key,
                    value: value
                });
                return;
            }
            return originalSetItem.call(this, key, value);
        };
    }

    setupConsoleMonitor() {
        const originalConsole = {
            log: console.log,
            warn: console.warn,
            error: console.error
        };

        console.log = (...args) => {
            this.logViolation('console_access', {
                type: 'log',
                args: args
            });
            return originalConsole.log.apply(console, args);
        };

        console.warn = (...args) => {
            this.logViolation('console_access', {
                type: 'warn',
                args: args
            });
            return originalConsole.warn.apply(console, args);
        };

        console.error = (...args) => {
            this.logViolation('console_access', {
                type: 'error',
                args: args
            });
            return originalConsole.error.apply(console, args);
        };
    }

    checkForXSS(node) {
        const suspiciousPatterns = [
            /<script\b[^>]*>[\s\S]*?<\/script>/gi,
            /javascript:/gi,
            /data:/gi,
            /vbscript:/gi,
            /on\w+\s*=/gi
        ];

        const html = node.outerHTML || node.innerHTML;
        for (const pattern of suspiciousPatterns) {
            if (pattern.test(html)) {
                this.logViolation('xss_attempt', {
                    node: node.tagName,
                    content: html
                });
                node.remove();
                return;
            }
        }
    }

    isSuspiciousInput(value) {
        const suspiciousPatterns = [
            /<script\b[^>]*>[\s\S]*?<\/script>/gi,
            /javascript:/gi,
            /data:/gi,
            /vbscript:/gi,
            /on\w+\s*=/gi,
            /eval\s*\(/gi,
            /document\.cookie/gi,
            /document\.write/gi,
            /window\.location/gi,
            /document\.location/gi
        ];

        return suspiciousPatterns.some(pattern => pattern.test(value));
    }

    isSuspiciousURL(url) {
        const suspiciousPatterns = [
            /javascript:/gi,
            /data:/gi,
            /vbscript:/gi,
            /file:/gi,
            /about:/gi,
            /blob:/gi
        ];

        return suspiciousPatterns.some(pattern => pattern.test(url));
    }

    logViolation(type, details) {
        // Send violation to server
        fetch('/security-report.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: type,
                details: details,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent
            })
        }).catch(error => {
            console.error('Failed to log security violation:', error);
        });
    }
}

// Initialize security check
new SecurityCheck(); 
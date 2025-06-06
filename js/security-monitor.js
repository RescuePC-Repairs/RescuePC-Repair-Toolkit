// Client-side Security Monitoring
class SecurityMonitor {
    constructor() {
        this.violations = [];
        this.initializeMonitoring();
    }

    initializeMonitoring() {
        // Monitor CSP violations
        if ('ReportingObserver' in window) {
            const observer = new ReportingObserver((reports) => {
                reports.forEach(report => {
                    this.handleViolation(report);
                });
            }, {buffered: true});
            
            observer.observe();
        }

        // Monitor for XSS attempts
        this.monitorXSSAttempts();
        
        // Monitor for clickjacking attempts
        this.monitorClickjacking();
        
        // Monitor for iframe embedding
        this.monitorFrameEmbedding();
        
        // Monitor for console access
        this.monitorConsoleAccess();
        
        // Monitor for form tampering
        this.monitorFormTampering();
        
        // Monitor for suspicious network requests
        this.monitorNetworkRequests();
    }

    handleViolation(report) {
        const violation = {
            type: report.type,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            details: report.toJSON()
        };

        this.violations.push(violation);
        this.reportViolation(violation);
    }

    monitorXSSAttempts() {
        // Monitor for script injection attempts
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeName === 'SCRIPT' && !node.hasAttribute('data-trusted')) {
                            this.handleViolation({
                                type: 'xss-attempt',
                                url: window.location.href,
                                details: {
                                    node: node.outerHTML
                                }
                            });
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

    monitorClickjacking() {
        // Check if the page is being embedded in an iframe
        if (window.self !== window.top) {
            this.handleViolation({
                type: 'clickjacking-attempt',
                url: window.location.href,
                details: {
                    parentUrl: window.top.location.href
                }
            });
        }
    }

    monitorFrameEmbedding() {
        // Monitor for unauthorized frame embedding
        window.addEventListener('load', () => {
            if (window.self !== window.top) {
                this.handleViolation({
                    type: 'frame-embedding',
                    url: window.location.href,
                    details: {
                        parentUrl: window.top.location.href
                    }
                });
            }
        });
    }

    monitorConsoleAccess() {
        // Monitor for console access attempts
        const originalConsole = {
            log: console.log,
            warn: console.warn,
            error: console.error
        };

        ['log', 'warn', 'error'].forEach(method => {
            console[method] = (...args) => {
                this.handleViolation({
                    type: 'console-access',
                    url: window.location.href,
                    details: {
                        method,
                        arguments: args
                    }
                });
                originalConsole[method].apply(console, args);
            };
        });
    }

    monitorFormTampering() {
        // Monitor for form tampering attempts
        document.addEventListener('submit', (event) => {
            const form = event.target;
            const originalAction = form.getAttribute('data-original-action');
            
            if (originalAction && form.action !== originalAction) {
                this.handleViolation({
                    type: 'form-tampering',
                    url: window.location.href,
                    details: {
                        formId: form.id,
                        originalAction,
                        newAction: form.action
                    }
                });
            }
        });
    }

    monitorNetworkRequests() {
        // Monitor for suspicious network requests
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const [resource, config] = args;
            
            // Check for suspicious URLs
            if (typeof resource === 'string' && this.isSuspiciousUrl(resource)) {
                this.handleViolation({
                    type: 'suspicious-request',
                    url: window.location.href,
                    details: {
                        resource,
                        method: config?.method || 'GET'
                    }
                });
            }
            
            return originalFetch.apply(window, args);
        };
    }

    isSuspiciousUrl(url) {
        const suspiciousPatterns = [
            /\.(php|asp|aspx|jsp|jspx|cgi|pl|py|rb|sh|bash|cmd|bat|exe)$/i,
            /\/\.\.\//,
            /\/\.\//,
            /\/etc\/passwd/,
            /\/proc\/self/,
            /\/var\/log/,
            /\/wp-admin/,
            /\/wp-content/,
            /\/wp-includes/,
            /\/administrator/,
            /\/admin/,
            /\/login/,
            /\/wp-login/,
            /\/wp-login\.php/,
            /\/wp-admin\.php/,
            /\/wp-content\.php/,
            /\/wp-includes\.php/,
            /\/administrator\.php/,
            /\/admin\.php/,
            /\/login\.php/
        ];
        
        return suspiciousPatterns.some(pattern => pattern.test(url));
    }

    reportViolation(violation) {
        // Send violation to server
        fetch('/security-report.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'csp-report': violation
            })
        }).catch(error => {
            console.error('Failed to report violation:', error);
        });
    }
}

// Initialize security monitoring when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.securityMonitor = new SecurityMonitor();
}); 
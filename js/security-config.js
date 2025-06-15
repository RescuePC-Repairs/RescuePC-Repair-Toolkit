// Advanced Security Configuration
const securityConfig = {
    // Subresource Integrity (SRI) hashes for external resources
    sriHashes: {
        // Add your external resource hashes here
    },
    
    // Security monitoring and reporting
    securityMonitoring: {
        reportUri: '/security-report',
        reportOnly: false
    },
    
    // Feature detection and security checks
    securityChecks: {
        checkTLS: () => window.location.protocol === 'https:',
        checkFrameAncestors: () => {
            try {
                return window.self === window.top;
            } catch (e) {
                return false;
            }
        }
    },
    
    // Initialize security features
    init: function() {
        // Check for secure context
        if (!this.securityChecks.checkTLS()) {
            console.warn('Warning: Site should be accessed over HTTPS');
        }
        
        // Check for frame embedding
        if (!this.securityChecks.checkFrameAncestors()) {
            console.warn('Warning: Site is being embedded in a frame');
        }
        
        // Initialize security monitoring
        this.initializeSecurityMonitoring();
    },
    
    // Initialize security monitoring
    initializeSecurityMonitoring: function() {
        if ('ReportingObserver' in window) {
            const observer = new ReportingObserver((reports) => {
                reports.forEach(report => {
                    // Log security violations
                    console.warn('Security violation:', report);
                });
            }, {buffered: true});
            
            observer.observe();
        }
    }
};

// Initialize security features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    securityConfig.init();
}); 
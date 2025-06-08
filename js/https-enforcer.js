// HTTPS Enforcer and Security Monitor
class SecurityEnforcer {
    constructor() {
        // More flexible development detection
        this.isDevelopment = this.checkDevelopmentEnvironment();
        this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        
        this.initializeSecurity();
        this.monitorSecurity();
    }

    checkDevelopmentEnvironment() {
        const hostname = window.location.hostname;
        const port = window.location.port;
        
        // Always consider local network as development
        if (/^192\.168\./.test(hostname) || 
            /^10\./.test(hostname) || 
            /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)) {
            return true;
        }

        // Check for localhost and common development ports
        return hostname === 'localhost' || 
               hostname === '127.0.0.1' ||
               hostname === '' ||
               port === '3000' ||
               port === '8080' ||
               port === '5000' ||
               port === '8000' ||
               port === '4200' ||
               port === '5500' ||
               port === '5501';
    }

    initializeSecurity() {
        // Always enforce HTTPS, even in development
        if (window.location.protocol !== 'https:') {
            // For local development, use a self-signed certificate
            if (this.isDevelopment) {
                console.log('Development mode: Using self-signed certificate');
                // The site will still work, but browser will show security warning
                // Users can proceed by accepting the risk
            } else {
                // In production, redirect to HTTPS
                window.location.href = 'https://' + window.location.host + window.location.pathname + window.location.search;
            }
        }

        // Add security badge to page
        this.addSecurityBadge();
    }

    addSecurityBadge() {
        const badge = document.createElement('div');
        badge.className = 'security-badge';
        badge.innerHTML = `
            <div class="security-status">
                <i class="fas fa-shield-alt"></i>
                <span>${this.isDevelopment ? 'Development Mode' : 'Secure Connection'}</span>
            </div>
            <div class="security-details">
                <div class="protocol">${window.location.protocol}</div>
                <div class="certificate">${this.isDevelopment ? 'Development Environment' : 'Valid SSL Certificate'}</div>
                <div class="environment">${this.isDevelopment ? 'Local Development' : 'Production'}</div>
                ${this.isSafari ? '<div class="browser">Safari Browser</div>' : ''}
            </div>
        `;
        document.body.appendChild(badge);
    }

    monitorSecurity() {
        // Only run security checks in production
        if (!this.isDevelopment) {
            this.checkSecurityHeaders();
            this.monitorMixedContent();
            this.checkSSLCertificate();
        } else {
            console.log('Development mode: Security checks disabled');
        }
    }

    async checkSecurityHeaders() {
        try {
            const response = await fetch(window.location.href, { method: 'HEAD' });
            const headers = response.headers;
            
            const securityHeaders = {
                'Content-Security-Policy': headers.get('Content-Security-Policy'),
                'Strict-Transport-Security': headers.get('Strict-Transport-Security'),
                'X-Content-Type-Options': headers.get('X-Content-Type-Options'),
                'X-Frame-Options': headers.get('X-Frame-Options'),
                'X-XSS-Protection': headers.get('X-XSS-Protection')
            };

            console.log('Security Headers:', securityHeaders);
            this.updateSecurityStatus(securityHeaders);
        } catch (error) {
            console.error('Security headers check failed:', error);
        }
    }

    monitorMixedContent() {
        // Check for mixed content
        const images = document.getElementsByTagName('img');
        const scripts = document.getElementsByTagName('script');
        const links = document.getElementsByTagName('link');

        const checkResource = (resource) => {
            if (resource.src && resource.src.startsWith('http:')) {
                console.warn('Mixed content detected:', resource.src);
                resource.src = resource.src.replace('http:', 'https:');
            }
        };

        Array.from(images).forEach(checkResource);
        Array.from(scripts).forEach(checkResource);
        Array.from(links).forEach(link => {
            if (link.href && link.href.startsWith('http:')) {
                console.warn('Mixed content detected:', link.href);
                link.href = link.href.replace('http:', 'https:');
            }
        });
    }

    async checkSSLCertificate() {
        try {
            const response = await fetch(window.location.href, { method: 'HEAD' });
            const isSecure = response.ok && window.location.protocol === 'https:';
            
            if (!isSecure) {
                console.warn('SSL Certificate check failed');
                this.updateSecurityStatus({ ssl: false });
            } else {
                this.updateSecurityStatus({ ssl: true });
            }
        } catch (error) {
            console.error('SSL Certificate check failed:', error);
            this.updateSecurityStatus({ ssl: false });
        }
    }

    updateSecurityStatus(status) {
        const badge = document.querySelector('.security-badge');
        if (badge) {
            const isSecure = this.isDevelopment || 
                           (status.ssl && 
                            status['Strict-Transport-Security'] && 
                            status['Content-Security-Policy']);
            
            badge.className = `security-badge ${isSecure ? 'secure' : 'insecure'}`;
        }
    }
}

// Initialize security enforcer
document.addEventListener('DOMContentLoaded', () => {
    new SecurityEnforcer();
}); 
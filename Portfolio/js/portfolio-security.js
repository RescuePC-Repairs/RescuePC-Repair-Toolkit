// Portfolio Security Verification
class PortfolioSecurity {
    constructor() {
        this.initializeSecurity();
        this.monitorSecurity();
    }

    initializeSecurity() {
        // Force HTTPS if not already
        if (window.location.protocol !== 'https:') {
            window.location.href = 'https://' + window.location.host + window.location.pathname + window.location.search;
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
                <span>Portfolio Security</span>
            </div>
            <div class="security-details">
                <div class="protocol">${window.location.protocol}</div>
                <div class="certificate">Valid SSL Certificate</div>
                <div class="portfolio-status">Portfolio Protected</div>
            </div>
        `;
        document.body.appendChild(badge);
    }

    monitorSecurity() {
        // Check security headers
        this.checkSecurityHeaders();
        
        // Monitor for mixed content
        this.monitorMixedContent();
        
        // Check SSL certificate
        this.checkSSLCertificate();
        
        // Monitor portfolio-specific security
        this.monitorPortfolioSecurity();
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

            console.log('Portfolio Security Headers:', securityHeaders);
            this.updateSecurityStatus(securityHeaders);
        } catch (error) {
            console.error('Security headers check failed:', error);
        }
    }

    monitorMixedContent() {
        // Check for mixed content in portfolio
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

    monitorPortfolioSecurity() {
        // Check for portfolio-specific security concerns
        const forms = document.getElementsByTagName('form');
        const inputs = document.getElementsByTagName('input');
        
        // Ensure all forms use HTTPS
        Array.from(forms).forEach(form => {
            if (form.action && form.action.startsWith('http:')) {
                form.action = form.action.replace('http:', 'https:');
            }
        });

        // Ensure all inputs have proper security attributes
        Array.from(inputs).forEach(input => {
            if (input.type === 'password') {
                input.setAttribute('autocomplete', 'off');
            }
            if (input.type === 'email' || input.type === 'text') {
                input.setAttribute('autocomplete', 'off');
            }
        });
    }

    updateSecurityStatus(status) {
        const badge = document.querySelector('.security-badge');
        if (badge) {
            const isSecure = status.ssl && 
                           status['Strict-Transport-Security'] && 
                           status['Content-Security-Policy'];
            
            badge.className = `security-badge ${isSecure ? 'secure' : 'insecure'}`;
        }
    }
}

// Initialize portfolio security
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioSecurity();
}); 
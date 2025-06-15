// Security Verification Script
document.addEventListener('DOMContentLoaded', () => {
    // Check if site is served over HTTPS
    const isSecure = window.location.protocol === 'https:';
    
    // Verify security headers
    const verifySecurityHeaders = async () => {
        try {
            const response = await fetch(window.location.href, { method: 'HEAD' });
            const headers = response.headers;
            
            const securityChecks = {
                'Content-Security-Policy': headers.get('Content-Security-Policy'),
                'X-Content-Type-Options': headers.get('X-Content-Type-Options'),
                'X-Frame-Options': headers.get('X-Frame-Options'),
                'X-XSS-Protection': headers.get('X-XSS-Protection'),
                'Strict-Transport-Security': headers.get('Strict-Transport-Security')
            };
            
            console.log('Security Headers Status:', securityChecks);
            return securityChecks;
        } catch (error) {
            console.error('Error checking security headers:', error);
            return null;
        }
    };

    // Update security indicators
    const updateSecurityIndicators = (isSecure, headers) => {
        const sslIndicator = document.querySelector('.security-badge.ssl');
        if (sslIndicator) {
            sslIndicator.innerHTML = isSecure ? 
                '<i class="fas fa-shield-alt"></i><span>SSL Secured</span>' :
                '<i class="fas fa-exclamation-triangle"></i><span>Not Secure</span>';
            sslIndicator.className = `security-badge ssl ${isSecure ? 'secure' : 'insecure'}`;
        }
    };

    // Run verifications
    verifySecurityHeaders().then(headers => {
        updateSecurityIndicators(isSecure, headers);
    });
}); 
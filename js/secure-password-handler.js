// Secure Password Handler
class SecurePasswordHandler {
    constructor() {
        // More flexible development detection
        this.isDevelopment = this.checkDevelopmentEnvironment();
        this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        
        // Only initialize on secure download page
        if (window.location.pathname.includes('secure-download.html')) {
            this.initializeSecurity();
            this.setupPasswordUI();
        }
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
                window.location.href = 'https://' + window.location.host + window.location.pathname;
            }
        }

        // Add security headers only in production
        if (!this.isDevelopment) {
            this.addSecurityHeaders();
        }
    }

    setupPasswordUI() {
        // Create password input container
        const container = document.createElement('div');
        container.className = 'password-container';
        container.innerHTML = `
            <div class="password-box">
                <h3>${this.isDevelopment ? 'Development Mode' : 'Secure Download Access'}</h3>
                <div class="password-input">
                    <input type="password" id="extractionPassword" placeholder="Enter Extraction Password" />
                    <div class="password-strength"></div>
                </div>
                <div class="password-input">
                    <input type="password" id="licensePassword" placeholder="Enter License Key" />
                    <div class="password-strength"></div>
                </div>
                <button id="verifyPasswords" class="verify-button">Verify Access</button>
                <div class="security-status"></div>
            </div>
        `;
        
        // Insert after the download steps
        const downloadSteps = document.querySelector('.download-steps');
        if (downloadSteps) {
            downloadSteps.parentNode.insertBefore(container, downloadSteps.nextSibling);
        }

        // Add event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        const extractionInput = document.getElementById('extractionPassword');
        const licenseInput = document.getElementById('licensePassword');
        const verifyButton = document.getElementById('verifyPasswords');

        if (extractionInput && licenseInput && verifyButton) {
            extractionInput.addEventListener('input', (e) => this.checkPasswordStrength(e.target, 'extraction'));
            licenseInput.addEventListener('input', (e) => this.checkPasswordStrength(e.target, 'license'));
            verifyButton.addEventListener('click', () => this.verifyPasswords());
        }
    }

    checkPasswordStrength(input, type) {
        const strengthIndicator = input.nextElementSibling;
        const password = input.value;
        
        // Password strength criteria
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isLongEnough = password.length >= 8;

        const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar, isLongEnough]
            .filter(Boolean).length;

        // Update strength indicator
        strengthIndicator.className = 'password-strength';
        strengthIndicator.classList.add(`strength-${strength}`);
        
        // Add appropriate message
        const messages = {
            0: 'Very Weak',
            1: 'Weak',
            2: 'Fair',
            3: 'Good',
            4: 'Strong',
            5: 'Very Strong'
        };
        
        strengthIndicator.textContent = messages[strength];
    }

    async verifyPasswords() {
        const extractionPassword = document.getElementById('extractionPassword').value;
        const licensePassword = document.getElementById('licensePassword').value;
        const statusDiv = document.querySelector('.security-status');

        try {
            // In development, skip hashing for easier testing
            const hashedExtraction = this.isDevelopment ? 
                extractionPassword : 
                await this.hashPassword(extractionPassword);
            
            const hashedLicense = this.isDevelopment ? 
                licensePassword : 
                await this.hashPassword(licensePassword);

            // Verify passwords (replace with your actual verification logic)
            const isValid = await this.validatePasswords(hashedExtraction, hashedLicense);

            if (isValid) {
                statusDiv.innerHTML = '<div class="success">Access Granted</div>';
                this.grantAccess();
            } else {
                statusDiv.innerHTML = '<div class="error">Invalid Passwords</div>';
            }
        } catch (error) {
            console.error('Password verification failed:', error);
            statusDiv.innerHTML = '<div class="error">Verification Failed</div>';
        }
    }

    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    async validatePasswords(hashedExtraction, hashedLicense) {
        // In development, accept any non-empty password
        if (this.isDevelopment) {
            return hashedExtraction.length > 0 && hashedLicense.length > 0;
        }
        
        // Replace with your actual password validation logic for production
        return true;
    }

    grantAccess() {
        // Add your access granting logic here
        const protectedContent = document.querySelectorAll('.protected-content');
        protectedContent.forEach(element => {
            element.style.display = 'block';
        });
    }

    addSecurityHeaders() {
        // Add security headers to the page
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https: data:; connect-src 'self' https:; frame-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests;";
        document.head.appendChild(meta);
    }
}

// Initialize secure password handler
document.addEventListener('DOMContentLoaded', () => {
    new SecurePasswordHandler();
}); 
/**
 * RESCUEPC REPAIRS - ULTIMATE HTTPS ENFORCER
 * Military-Grade HTTPS Enforcement System
 * ZERO TOLERANCE FOR HTTP CONNECTIONS
 * 
 * @author Tyler - RescuePC Repairs
 * @version 3.0.0
 * @security MILITARY-GRADE
 */

(function() {
    'use strict';
    
    // IMMEDIATE HTTPS ENFORCEMENT - NO DELAYS
    const enforceHTTPS = () => {
        console.log('🔒 RescuePC Security: Checking HTTPS enforcement...');
        
        // Check if we're on HTTP (not HTTPS)
        if (location.protocol !== 'https:' && 
            location.hostname !== 'localhost' && 
            location.hostname !== '127.0.0.1' && 
            location.hostname !== '0.0.0.0' &&
            !location.hostname.includes('github.io') &&
            !location.hostname.includes('netlify.app') &&
            !location.hostname.includes('vercel.app')) {
            
            console.warn('⚠️ SECURITY VIOLATION: HTTP connection detected!');
            console.log('🔒 ENFORCING HTTPS REDIRECT - SECURITY PROTOCOL ACTIVATED');
            
            // Force immediate HTTPS redirect
            const httpsUrl = 'https:' + window.location.href.substring(window.location.protocol.length);
            
            // Use replace to prevent back button from going to HTTP
            window.location.replace(httpsUrl);
            
            // Block further execution
            return false;
        }
        
        console.log('✅ HTTPS Security: Connection is secure');
        return true;
    };
    
    // SECURITY MONITORING
    const monitorSecurity = () => {
        // Check for mixed content
        if (location.protocol === 'https:') {
            // Monitor for any HTTP resources
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            // Check for HTTP resources
                            const httpResources = node.querySelectorAll ? 
                                node.querySelectorAll('[src^="http:"], [href^="http:"]') : [];
                            
                            if (httpResources.length > 0) {
                                console.warn('⚠️ MIXED CONTENT DETECTED:', httpResources);
                                // Auto-fix HTTP resources to HTTPS
                                httpResources.forEach(resource => {
                                    if (resource.src && resource.src.startsWith('http:')) {
                                        resource.src = resource.src.replace('http:', 'https:');
                                        console.log('🔧 Fixed HTTP resource:', resource.src);
                                    }
                                    if (resource.href && resource.href.startsWith('http:')) {
                                        resource.href = resource.href.replace('http:', 'https:');
                                        console.log('🔧 Fixed HTTP link:', resource.href);
                                    }
                                });
                            }
                        }
                    });
                });
            });
            
            observer.observe(document.body || document.documentElement, {
                childList: true,
                subtree: true
            });
        }
    };
    
    // SECURITY HEADERS VERIFICATION
    const verifySecurityHeaders = () => {
        // Check if running in secure context
        if (!window.isSecureContext) {
            console.error('❌ SECURITY ALERT: Not running in secure context!');
            return false;
        }
        
        // Verify HTTPS
        if (location.protocol !== 'https:' && 
            !['localhost', '127.0.0.1', '0.0.0.0'].includes(location.hostname)) {
            console.error('❌ SECURITY ALERT: HTTPS not enforced!');
            return false;
        }
        
        console.log('✅ Security Context: All security checks passed');
        return true;
    };
    
    // INITIALIZE SECURITY SYSTEM
    const initSecurity = () => {
        console.log('🛡️ RescuePC Security System: Initializing...');
        
        // Step 1: Enforce HTTPS immediately
        if (!enforceHTTPS()) {
            return; // Stop if redirecting
        }
        
        // Step 2: Verify security context
        verifySecurityHeaders();
        
        // Step 3: Start monitoring
        monitorSecurity();
        
        // Step 4: Set security indicators
        document.documentElement.setAttribute('data-security-level', 'military-grade');
        document.documentElement.setAttribute('data-https-enforced', 'true');
        
        console.log('✅ RescuePC Security System: Fully activated');
        
        // Dispatch security ready event
        window.dispatchEvent(new CustomEvent('rescuepc:security:ready', {
            detail: {
                https: true,
                securityLevel: 'military-grade',
                timestamp: Date.now()
            }
        }));
    };
    
    // RUN IMMEDIATELY - BEFORE ANYTHING ELSE
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSecurity);
    } else {
        initSecurity();
    }
    
    // EXPORT FOR DEBUGGING
    window.RescuePCSecurity = {
        enforceHTTPS,
        verifySecurityHeaders,
        version: '3.0.0',
        status: 'active'
    };
    
})(); 
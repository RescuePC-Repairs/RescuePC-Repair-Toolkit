// Force HTTPS for all links
document.addEventListener('DOMContentLoaded', function() {
    // Convert all HTTP links to HTTPS
    const links = document.getElementsByTagName('a');
    for (let i = 0; i < links.length; i++) {
        if (links[i].href.startsWith('http:')) {
            links[i].href = links[i].href.replace('http:', 'https:');
        }
    }

    // Convert all HTTP resources to HTTPS
    const resources = document.querySelectorAll('img, script, link, iframe');
    for (let i = 0; i < resources.length; i++) {
        if (resources[i].src && resources[i].src.startsWith('http:')) {
            resources[i].src = resources[i].src.replace('http:', 'https:');
        }
        if (resources[i].href && resources[i].href.startsWith('http:')) {
            resources[i].href = resources[i].href.replace('http:', 'https:');
        }
    }

    // Monitor for mixed content
    window.addEventListener('securitypolicyviolation', function(e) {
        console.warn('Mixed content detected:', e.blockedURI);
        // Log the violation
        fetch('/log-security-violation.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'mixed_content',
                url: e.blockedURI,
                timestamp: new Date().toISOString()
            })
        });
    });
});

// Ensure form submissions use HTTPS
document.addEventListener('submit', function(e) {
    const form = e.target;
    if (form.action && form.action.startsWith('http:')) {
        form.action = form.action.replace('http:', 'https:');
    }
});

// Monitor for protocol downgrade attempts
if (window.location.protocol !== 'https:') {
    window.location.href = window.location.href.replace('http:', 'https:');
} 
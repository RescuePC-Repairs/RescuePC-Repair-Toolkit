// TikTok Browser Detection and Theme Forcing
document.addEventListener('DOMContentLoaded', function() {
    // Function to detect TikTok browser
    function isTikTokBrowser() {
        const userAgent = navigator.userAgent.toLowerCase();
        return userAgent.includes('tiktok') || 
               userAgent.includes('bytedance') || 
               userAgent.includes('musically');
    }

    // Function to force light theme
    function forceLightTheme() {
        // Remove dark theme class/attribute
        document.documentElement.removeAttribute('data-theme');
        document.documentElement.classList.remove('dark');
        document.body.classList.add('light-mode');
        
        // Override any dark theme styles
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --bg-primary: #ffffff !important;
                --bg-secondary: #f8f9fa !important;
                --text-primary: #333333 !important;
                --text-secondary: #666666 !important;
                --accent-color: #007bff !important;
                --border-color: #dee2e6 !important;
                --card-bg: #ffffff !important;
                --shadow-color: rgba(0, 0, 0, 0.1) !important;
                --nav-bg: rgba(255, 255, 255, 0.98) !important;
                --footer-bg: #f8f9fa !important;
                --input-bg: #ffffff !important;
                --input-border: #ced4da !important;
                --button-bg: #007bff !important;
                --button-text: #ffffff !important;
                --hover-bg: #f8f9fa !important;
                --hero-bg: #f8f9fa !important;
                --section-bg: #ffffff !important;
                --modal-bg: #ffffff !important;
            }
            
            body {
                background-color: #ffffff !important;
                color: #333333 !important;
            }
            
            .navbar {
                background-color: rgba(255, 255, 255, 0.98) !important;
            }
            
            .card, .container, .section {
                background-color: #ffffff !important;
                border-color: #dee2e6 !important;
            }
            
            input, textarea, select {
                background-color: #ffffff !important;
                border-color: #ced4da !important;
                color: #333333 !important;
            }
            
            footer {
                background-color: #f8f9fa !important;
            }
        `;
        document.head.appendChild(style);
        
        // Disable theme toggle if it exists
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.style.display = 'none';
        }
        
        // Clear any saved theme preference
        localStorage.removeItem('theme');
        localStorage.removeItem('darkMode');
    }

    // Check if we're in TikTok browser and force light theme if we are
    if (isTikTokBrowser()) {
        forceLightTheme();
    }
}); 
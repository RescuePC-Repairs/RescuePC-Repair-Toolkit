// Dark Mode Button Handler
document.addEventListener('DOMContentLoaded', function() {
    // Create the dark mode button
    const darkModeButton = document.createElement('button');
    darkModeButton.className = 'theme-toggle';
    darkModeButton.setAttribute('aria-label', 'Toggle dark mode');
    darkModeButton.innerHTML = `
        <i class="fas fa-moon"></i>
        <span>Dark Mode</span>
    `;

    // Create the nav item container
    const navItem = document.createElement('li');
    navItem.className = 'nav-item';
    navItem.appendChild(darkModeButton);

    // Find the navbar nav
    const navbarNav = document.querySelector('.navbar-nav');
    if (navbarNav) {
        navbarNav.appendChild(navItem);
    }

    // Add click handler
    darkModeButton.addEventListener('click', function() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        
        // Update theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update button
        const icon = darkModeButton.querySelector('i');
        const text = darkModeButton.querySelector('span');
        if (icon) {
            icon.className = `fas ${newTheme === 'dark' ? 'fa-sun' : 'fa-moon'}`;
        }
        if (text) {
            text.textContent = `${newTheme === 'dark' ? 'Light' : 'Dark'} Mode`;
        }
    });

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        const icon = darkModeButton.querySelector('i');
        const text = darkModeButton.querySelector('span');
        if (icon) {
            icon.className = `fas ${savedTheme === 'dark' ? 'fa-sun' : 'fa-moon'}`;
        }
        if (text) {
            text.textContent = `${savedTheme === 'dark' ? 'Light' : 'Dark'} Mode`;
        }
    }
}); 
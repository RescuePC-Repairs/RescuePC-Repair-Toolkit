// Dark Mode Handler
class DarkModeHandler {
    constructor() {
        this.theme = localStorage.getItem('theme') || this.getSystemPreference();
        this.init();
    }

    init() {
        // Add theme toggle button to navbar
        this.addThemeToggle();
        
        // Apply initial theme
        this.applyTheme(this.theme);
        
        // Listen for system preference changes
        this.watchSystemPreference();
    }

    addThemeToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'theme-toggle';
        toggle.setAttribute('aria-label', 'Toggle dark mode');
        toggle.innerHTML = `
            <i class="fas ${this.theme === 'dark' ? 'fa-sun' : 'fa-moon'}"></i>
            <span>${this.theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
        `;
        
        toggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Find the navbar and add the toggle
        const navbar = document.querySelector('.navbar-nav');
        if (navbar) {
            const li = document.createElement('li');
            li.className = 'nav-item';
            li.appendChild(toggle);
            navbar.appendChild(li);
        } else {
            // Fallback if navbar not found
            const nav = document.querySelector('.navbar');
            if (nav) {
                const container = document.createElement('div');
                container.className = 'navbar-container';
                container.appendChild(toggle);
                nav.appendChild(container);
            } else {
                document.body.appendChild(toggle);
            }
        }
    }

    getSystemPreference() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    watchSystemPreference() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.theme);
        localStorage.setItem('theme', this.theme);
        
        // Update toggle button
        const toggle = document.querySelector('.theme-toggle');
        if (toggle) {
            const icon = toggle.querySelector('i');
            const text = toggle.querySelector('span');
            if (icon) {
                icon.className = `fas ${this.theme === 'dark' ? 'fa-sun' : 'fa-moon'}`;
            }
            if (text) {
                text.textContent = `${this.theme === 'dark' ? 'Light' : 'Dark'} Mode`;
            }
        }
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Add transition class
        document.body.classList.add('theme-transition');
        
        // Remove transition class after animation
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 300);

        // Update meta theme-color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === 'dark' ? '#0f172a' : '#ffffff');
        }
    }
}

// Initialize dark mode
document.addEventListener('DOMContentLoaded', () => {
    new DarkModeHandler();
}); 
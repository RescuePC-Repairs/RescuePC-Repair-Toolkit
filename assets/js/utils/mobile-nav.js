class MobileNavigation {
  constructor() {
    this.mobileNav = document.getElementById('mobileNav');
    this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    this.navOverlay = document.getElementById('navOverlay');
    this.isOpen = false;
    
    this.initialize();
  }

  initialize() {
    if (!this.mobileNav || !this.mobileMenuToggle || !this.navOverlay) {
      console.warn('Mobile navigation elements not found');
      return;
    }

    this.setupEventListeners();
    this.setupAccessibility();
  }

  setupEventListeners() {
    this.mobileMenuToggle.addEventListener('click', () => this.toggleMenu());
    this.navOverlay.addEventListener('click', () => this.closeMenu());
    
    // Close menu on window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isOpen) {
        this.closeMenu();
      }
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });

    // Handle navigation links
    const navLinks = this.mobileNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });
  }

  setupAccessibility() {
    this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
    this.mobileMenuToggle.setAttribute('aria-controls', 'mobileNav');
    this.mobileNav.setAttribute('aria-hidden', 'true');
  }

  toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.isOpen = true;
    this.mobileNav.classList.add('active');
    this.navOverlay.classList.add('active');
    this.mobileMenuToggle.setAttribute('aria-expanded', 'true');
    this.mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  closeMenu() {
    this.isOpen = false;
    this.mobileNav.classList.remove('active');
    this.navOverlay.classList.remove('active');
    this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
    this.mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

// Initialize mobile navigation
document.addEventListener('DOMContentLoaded', () => {
  const mobileNav = new MobileNavigation();
}); 
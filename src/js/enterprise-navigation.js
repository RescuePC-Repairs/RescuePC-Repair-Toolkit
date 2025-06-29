/**
 * ENTERPRISE NAVIGATION SYSTEM - TECH GIANT CONSISTENCY
 * Professional navigation with sticky header, mobile menu, and accessibility
 */

class EnterpriseNavigation {
  constructor() {
    this.header = null;
    this.hamburger = null;
    this.mobileNav = null;
    this.mobileNavOverlay = null;
    this.isMobileNavOpen = false;
    this.lastScrollTop = 0;
    this.scrollThreshold = 100;
    
    this.init();
  }
  
  init() {
    this.setupElements();
    this.setupEventListeners();
    this.setupAccessibility();
    this.setupScrollEffects();
  }
  
  setupElements() {
    // Get navigation elements
    this.header = document.querySelector('.header');
    this.hamburger = document.querySelector('.hamburger');
    this.mobileNav = document.querySelector('.mobile-nav');
    this.mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    
    // Create elements if they don't exist
    if (!this.header) {
      this.createHeader();
    }
    
    if (!this.hamburger) {
      this.createHamburger();
    }
    
    if (!this.mobileNav) {
      this.createMobileNav();
    }
    
    if (!this.mobileNavOverlay) {
      this.createMobileNavOverlay();
    }
  }
  
  createHeader() {
    // Create header if it doesn't exist
    const existingHeader = document.querySelector('header, .header');
    if (existingHeader) {
      this.header = existingHeader;
      this.header.classList.add('header');
    } else {
      this.header = document.createElement('header');
      this.header.className = 'header';
      document.body.insertBefore(this.header, document.body.firstChild);
    }
  }
  
  createHamburger() {
    this.hamburger = document.createElement('button');
    this.hamburger.className = 'hamburger';
    this.hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    this.hamburger.setAttribute('aria-expanded', 'false');
    this.hamburger.setAttribute('aria-controls', 'mobile-nav');
    
    // Create hamburger lines
    for (let i = 0; i < 3; i++) {
      const line = document.createElement('span');
      line.className = 'hamburger-line';
      this.hamburger.appendChild(line);
    }
    
    // Add to header
    const headerContainer = this.header.querySelector('.header-container') || this.header;
    headerContainer.appendChild(this.hamburger);
  }
  
  createMobileNav() {
    this.mobileNav = document.createElement('nav');
    this.mobileNav.className = 'mobile-nav';
    this.mobileNav.id = 'mobile-nav';
    this.mobileNav.setAttribute('aria-label', 'Mobile navigation');
    
    // Create mobile nav header
    const mobileNavHeader = document.createElement('div');
    mobileNavHeader.className = 'mobile-nav-header';
    
    const mobileNavTitle = document.createElement('h2');
    mobileNavTitle.textContent = 'Menu';
    mobileNavTitle.style.margin = '0';
    mobileNavTitle.style.fontSize = '1.25rem';
    mobileNavTitle.style.fontWeight = '600';
    
    const mobileNavClose = document.createElement('button');
    mobileNavClose.className = 'mobile-nav-close';
    mobileNavClose.innerHTML = '&times;';
    mobileNavClose.setAttribute('aria-label', 'Close navigation menu');
    
    mobileNavHeader.appendChild(mobileNavTitle);
    mobileNavHeader.appendChild(mobileNavClose);
    
    // Create mobile nav list
    const mobileNavList = document.createElement('ul');
    mobileNavList.className = 'mobile-nav-list';
    
    // Add navigation items
    const navItems = [
      { text: 'Home', href: '#home' },
      { text: 'Features', href: '#features' },
      { text: 'Pricing', href: '#pricing' },
      { text: 'Support', href: '#support' },
      { text: 'Contact', href: '#contact' }
    ];
    
    navItems.forEach(item => {
      const li = document.createElement('li');
      li.className = 'mobile-nav-item';
      
      const a = document.createElement('a');
      a.className = 'mobile-nav-link';
      a.href = item.href;
      a.textContent = item.text;
      
      li.appendChild(a);
      mobileNavList.appendChild(li);
    });
    
    this.mobileNav.appendChild(mobileNavHeader);
    this.mobileNav.appendChild(mobileNavList);
    document.body.appendChild(this.mobileNav);
    
    // Add close event listener
    mobileNavClose.addEventListener('click', () => {
      this.closeMobileNav();
    });
  }
  
  createMobileNavOverlay() {
    this.mobileNavOverlay = document.createElement('div');
    this.mobileNavOverlay.className = 'mobile-nav-overlay';
    this.mobileNavOverlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(this.mobileNavOverlay);
    
    // Add click event to close mobile nav
    this.mobileNavOverlay.addEventListener('click', () => {
      this.closeMobileNav();
    });
  }
  
  setupEventListeners() {
    // Hamburger menu toggle
    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => {
        this.toggleMobileNav();
      });
    }
    
    // Mobile nav link clicks
    if (this.mobileNav) {
      this.mobileNav.addEventListener('click', (e) => {
        if (e.target.classList.contains('mobile-nav-link')) {
          this.closeMobileNav();
        }
      });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMobileNavOpen) {
        this.closeMobileNav();
      }
    });
    
    // Window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }
  
  setupAccessibility() {
    // Skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Focus management
    document.addEventListener('focusin', (e) => {
      if (this.isMobileNavOpen && !this.mobileNav.contains(e.target)) {
        this.closeMobileNav();
      }
    });
  }
  
  setupScrollEffects() {
    let ticking = false;
    
    const updateHeader = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Add scrolled class for styling
      if (scrollTop > this.scrollThreshold) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }
      
      // Hide/show header on scroll (optional)
      if (scrollTop > this.lastScrollTop && scrollTop > this.scrollThreshold) {
        // Scrolling down
        this.header.style.transform = 'translateY(-100%)';
      } else {
        // Scrolling up
        this.header.style.transform = 'translateY(0)';
      }
      
      this.lastScrollTop = scrollTop;
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    });
  }
  
  toggleMobileNav() {
    if (this.isMobileNavOpen) {
      this.closeMobileNav();
    } else {
      this.openMobileNav();
    }
  }
  
  openMobileNav() {
    this.isMobileNavOpen = true;
    this.hamburger.classList.add('active');
    this.mobileNav.classList.add('active');
    this.mobileNavOverlay.classList.add('active');
    
    // Update ARIA attributes
    this.hamburger.setAttribute('aria-expanded', 'true');
    this.mobileNavOverlay.setAttribute('aria-hidden', 'false');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus management
    const firstLink = this.mobileNav.querySelector('.mobile-nav-link');
    if (firstLink) {
      firstLink.focus();
    }
  }
  
  closeMobileNav() {
    this.isMobileNavOpen = false;
    this.hamburger.classList.remove('active');
    this.mobileNav.classList.remove('active');
    this.mobileNavOverlay.classList.remove('active');
    
    // Update ARIA attributes
    this.hamburger.setAttribute('aria-expanded', 'false');
    this.mobileNavOverlay.setAttribute('aria-hidden', 'true');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Return focus to hamburger
    this.hamburger.focus();
  }
  
  handleResize() {
    // Close mobile nav on larger screens
    if (window.innerWidth > 768 && this.isMobileNavOpen) {
      this.closeMobileNav();
    }
  }
  
  // Public methods for external use
  open() {
    this.openMobileNav();
  }
  
  close() {
    this.closeMobileNav();
  }
  
  isOpen() {
    return this.isMobileNavOpen;
  }
}

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.enterpriseNavigation = new EnterpriseNavigation();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnterpriseNavigation;
} 
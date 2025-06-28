/**
 * FORTUNE 500 NAVIGATION SYSTEM
 * Advanced, enterprise-grade navigation with smart logic
 * Features: Scroll effects, active states, keyboard nav, performance optimization
 */

class Fortune500Navigation {
  constructor() {
    this.nav = null;
    this.mobileMenu = null;
    this.mobileToggle = null;
    this.navLinks = [];
    this.isMobileMenuOpen = false;
    this.lastScrollY = 0;
    this.scrollThreshold = 100;
    this.isScrolling = false;
    this.resizeTimeout = null;
    this.intersectionObserver = null;
    this.activeSection = null;
    
    // Navigation configuration
    this.config = {
      scrollBehavior: 'smooth',
      mobileBreakpoint: 768,
      scrollThreshold: 100,
      animationDuration: 300,
      stickyOffset: 0,
      enableScrollEffects: true,
      enableKeyboardNav: true,
      enableActiveTracking: true,
      enablePerformanceMode: true
    };

    this.init();
  }

  init() {
    this.setupElements();
    this.setupEventListeners();
    this.setupIntersectionObserver();
    this.setupPerformanceOptimizations();
    this.setupAccessibility();
    this.setupKeyboardNavigation();
    this.setupScrollEffects();
    this.setupMobileMenu();
    this.setupActiveStateTracking();
    
    // Initial setup
    this.updateActiveState();
    this.handleResize();
    
    console.log('🚀 Fortune 500 Navigation System Initialized');
  }

  setupElements() {
    this.nav = document.querySelector('.fortune500-navbar');
    this.mobileMenu = document.querySelector('.mobile-menu');
    this.mobileToggle = document.querySelector('.mobile-menu-toggle');
    this.navLinks = document.querySelectorAll('.nav-link');
    
    if (!this.nav) {
      console.error('❌ Navigation element not found');
      return;
    }
  }

  setupEventListeners() {
    // Scroll events with throttling
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
    window.addEventListener('orientationchange', this.handleResize.bind(this));
    
    // Mobile menu events
    if (this.mobileToggle) {
      this.mobileToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
      this.mobileToggle.addEventListener('keydown', this.handleMobileToggleKeydown.bind(this));
    }

    // Navigation link events
    this.navLinks.forEach(link => {
      link.addEventListener('click', this.handleNavLinkClick.bind(this));
      link.addEventListener('keydown', this.handleNavLinkKeydown.bind(this));
      link.addEventListener('mouseenter', this.handleNavLinkHover.bind(this));
      link.addEventListener('mouseleave', this.handleNavLinkLeave.bind(this));
    });

    // Close mobile menu on outside click
    document.addEventListener('click', this.handleOutsideClick.bind(this));
    
    // Handle focus management
    document.addEventListener('focusin', this.handleFocusIn.bind(this));
  }

  setupIntersectionObserver() {
    if (!this.config.enableActiveTracking) return;

    const options = {
      rootMargin: '-20% 0px -80% 0px',
      threshold: 0
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.activeSection = entry.target.id;
          this.updateActiveState();
        }
      });
    }, options);

    // Observe all sections
    document.querySelectorAll('section[id]').forEach(section => {
      this.intersectionObserver.observe(section);
    });
  }

  setupPerformanceOptimizations() {
    if (!this.config.enablePerformanceMode) return;

    // Use passive listeners where possible
    this.nav.addEventListener('touchstart', () => {}, { passive: true });
    this.nav.addEventListener('touchmove', () => {}, { passive: true });

    // Preload critical resources
    this.preloadCriticalResources();
  }

  setupAccessibility() {
    // Add ARIA attributes
    if (this.mobileToggle) {
      this.mobileToggle.setAttribute('aria-expanded', 'false');
      this.mobileToggle.setAttribute('aria-controls', 'mobile-menu');
      this.mobileToggle.setAttribute('aria-label', 'Toggle navigation menu');
    }

    if (this.mobileMenu) {
      this.mobileMenu.setAttribute('aria-hidden', 'true');
    }

    // Add skip link
    this.addSkipLink();
  }

  setupKeyboardNavigation() {
    if (!this.config.enableKeyboardNav) return;

    document.addEventListener('keydown', (e) => {
      // Escape key closes mobile menu
      if (e.key === 'Escape' && this.isMobileMenuOpen) {
        this.closeMobileMenu();
      }

      // Tab navigation
      if (e.key === 'Tab') {
        this.handleTabNavigation(e);
      }
    });
  }

  setupScrollEffects() {
    if (!this.config.enableScrollEffects) return;

    // Add scroll-based classes
    this.nav.classList.add('nav-scroll-enabled');
  }

  setupMobileMenu() {
    if (!this.mobileMenu) return;

    // Add transition classes
    this.mobileMenu.classList.add('mobile-menu-transition');
    
    // Setup mobile menu animations
    this.setupMobileMenuAnimations();
  }

  setupActiveStateTracking() {
    // Track active section based on scroll position
    this.updateActiveStateOnScroll = this.throttle(() => {
      this.updateActiveState();
    }, 100);
  }

  // SCROLL HANDLING
  handleScroll() {
    const currentScrollY = window.pageYOffset;
    const scrollDirection = currentScrollY > this.lastScrollY ? 'down' : 'up';
    const scrollDistance = Math.abs(currentScrollY - this.lastScrollY);

    // Update scroll effects
    if (this.config.enableScrollEffects) {
      this.updateScrollEffects(currentScrollY, scrollDirection, scrollDistance);
    }

    // Update active state
    if (this.config.enableActiveTracking) {
      this.updateActiveStateOnScroll();
    }

    this.lastScrollY = currentScrollY;
  }

  updateScrollEffects(scrollY, direction, distance) {
    const nav = this.nav;
    
    // Add/remove scroll classes
    if (scrollY > this.scrollThreshold) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }

    // Hide/show on scroll
    if (distance > 10) {
      if (direction === 'down' && scrollY > 200) {
        nav.classList.add('nav-hidden');
      } else {
        nav.classList.remove('nav-hidden');
      }
    }

    // Add background blur effect
    if (scrollY > 50) {
      nav.classList.add('nav-blur');
    } else {
      nav.classList.remove('nav-blur');
    }
  }

  // MOBILE MENU HANDLING
  toggleMobileMenu() {
    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.isMobileMenuOpen = true;
    this.mobileMenu.classList.add('mobile-menu-open');
    this.mobileToggle.setAttribute('aria-expanded', 'true');
    this.mobileMenu.setAttribute('aria-hidden', 'false');
    
    // Focus management
    this.trapFocus(this.mobileMenu);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Animate menu items
    this.animateMobileMenuItems('in');
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    this.mobileMenu.classList.remove('mobile-menu-open');
    this.mobileToggle.setAttribute('aria-expanded', 'false');
    this.mobileMenu.setAttribute('aria-hidden', 'true');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Return focus to toggle
    this.mobileToggle.focus();
    
    // Animate menu items
    this.animateMobileMenuItems('out');
  }

  setupMobileMenuAnimations() {
    const menuItems = this.mobileMenu.querySelectorAll('.mobile-nav-link');
    
    menuItems.forEach((item, index) => {
      item.style.transitionDelay = `${index * 50}ms`;
    });
  }

  animateMobileMenuItems(direction) {
    const menuItems = this.mobileMenu.querySelectorAll('.mobile-nav-link');
    
    menuItems.forEach((item, index) => {
      if (direction === 'in') {
        item.style.transform = 'translateX(0)';
        item.style.opacity = '1';
      } else {
        item.style.transform = 'translateX(-20px)';
        item.style.opacity = '0';
      }
    });
  }

  // NAVIGATION LINK HANDLING
  handleNavLinkClick(e) {
    const link = e.currentTarget;
    const href = link.getAttribute('href');
    
    // Handle smooth scrolling for anchor links
    if (href.startsWith('#')) {
      e.preventDefault();
      this.smoothScrollTo(href);
      
      // Close mobile menu if open
      if (this.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    }
    
    // Update active state
    this.setActiveLink(link);
  }

  handleNavLinkKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.handleNavLinkClick(e);
    }
  }

  handleNavLinkHover(e) {
    const link = e.currentTarget;
    link.classList.add('nav-link-hover');
  }

  handleNavLinkLeave(e) {
    const link = e.currentTarget;
    link.classList.remove('nav-link-hover');
  }

  // ACTIVE STATE MANAGEMENT
  updateActiveState() {
    if (!this.config.enableActiveTracking) return;

    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.pageYOffset + 100;

    let currentSection = null;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.id;
      }
    });

    if (currentSection && currentSection !== this.activeSection) {
      this.activeSection = currentSection;
      this.updateActiveLinks();
    }
  }

  updateActiveLinks() {
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${this.activeSection}`) {
        this.setActiveLink(link);
      } else {
        this.removeActiveLink(link);
      }
    });
  }

  setActiveLink(link) {
    this.navLinks.forEach(l => this.removeActiveLink(l));
    link.classList.add('nav-link-active');
    link.setAttribute('aria-current', 'page');
  }

  removeActiveLink(link) {
    link.classList.remove('nav-link-active');
    link.removeAttribute('aria-current');
  }

  // SMOOTH SCROLLING
  smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (!element) return;

    const targetPosition = element.offsetTop - this.config.stickyOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = this.config.animationDuration;
    let start = null;

    const animation = (currentTime) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = this.easeInOutCubic(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    requestAnimationFrame(animation);
  }

  easeInOutCubic(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t * t + b;
    t -= 2;
    return c / 2 * (t * t * t + 2) + b;
  }

  // KEYBOARD NAVIGATION
  handleTabNavigation(e) {
    if (this.isMobileMenuOpen) {
      const focusableElements = this.mobileMenu.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  handleMobileToggleKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.toggleMobileMenu();
    }
  }

  // FOCUS MANAGEMENT
  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }

  handleFocusIn(e) {
    // Add focus styles
    if (e.target.classList.contains('nav-link')) {
      e.target.classList.add('nav-link-focus');
    }
  }

  // EVENT HANDLERS
  handleOutsideClick(e) {
    if (this.isMobileMenuOpen && 
        !this.mobileMenu.contains(e.target) && 
        !this.mobileToggle.contains(e.target)) {
      this.closeMobileMenu();
    }
  }

  handleResize() {
    // Close mobile menu on resize if screen becomes larger
    if (window.innerWidth > this.config.mobileBreakpoint && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
    
    // Update navigation layout
    this.updateNavigationLayout();
  }

  updateNavigationLayout() {
    const isMobile = window.innerWidth <= this.config.mobileBreakpoint;
    
    if (isMobile) {
      this.nav.classList.add('nav-mobile');
      this.nav.classList.remove('nav-desktop');
    } else {
      this.nav.classList.add('nav-desktop');
      this.nav.classList.remove('nav-mobile');
    }
  }

  // UTILITY FUNCTIONS
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: white;
      padding: 8px;
      text-decoration: none;
      z-index: 1000;
      transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  preloadCriticalResources() {
    // Preload critical CSS and fonts
    const criticalResources = [
      '/css/fortune500-navbar-hero.css',
      '/assets/fonts/inter-var.woff2'
    ];
    
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.css') ? 'style' : 'font';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  // PUBLIC API
  destroy() {
    // Cleanup event listeners
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
    
    // Disconnect intersection observer
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    
    // Remove classes
    this.nav.classList.remove('nav-scroll-enabled', 'nav-scrolled', 'nav-hidden', 'nav-blur');
    
    console.log('🧹 Fortune 500 Navigation System Destroyed');
  }

  // Performance monitoring
  getPerformanceMetrics() {
    return {
      scrollEvents: this.scrollEventCount || 0,
      resizeEvents: this.resizeEventCount || 0,
      mobileMenuToggles: this.mobileToggleCount || 0,
      activeStateUpdates: this.activeStateUpdateCount || 0
    };
  }
}

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.fortune500Navigation = new Fortune500Navigation();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Fortune500Navigation;
} 
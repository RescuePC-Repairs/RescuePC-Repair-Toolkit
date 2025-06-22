/*!
 * RESCUEPC REPAIRS - ULTRA-SECURE HEADER COMPONENT
 * Professional Navigation with Military-Grade Security
 * 
 * Features:
 * - Responsive mobile-first design
 * - HTTPS-enforced navigation links
 * - Accessibility-first approach
 * - Professional brand presentation
 * - Secure event handling
 * 
 * @author Tyler - RescuePC Repairs
 * @version 2024.ULTRA-SECURE
 * @license MIT
 */

import { RescuePCSecurityManager } from '../../config/security.config.js';
import { loadContent } from '../../utils/content-loader.js';

export class RescuePCHeader {
  constructor() {
    this.security = new RescuePCSecurityManager();
    this.content = null;
    this.mobileMenuOpen = false;
    this.init();
  }

  async init() {
    try {
      this.content = await loadContent();
      this.render();
      this.attachEventListeners();
      this.setupAccessibility();
    } catch (error) {
      console.error('Header initialization failed:', error);
      this.renderFallback();
    }
  }

  render() {
    const header = document.querySelector('.header');
    if (!header) return;

    header.innerHTML = this.getTemplate();
  }

  renderFallback() {
    const header = document.querySelector('.header');
    if (!header) return;

    header.innerHTML = `
      <div class="header__container">
        <div class="header__brand">
          <a href="#home" class="header__logo" aria-label="RescuePC Repairs - Home">
            <img src="assets/RescuePC_Logo_Light.png" alt="RescuePC Repairs" width="180" height="40">
          </a>
        </div>
        <nav class="header__nav" role="navigation" aria-label="Main navigation">
          <ul class="header__nav-list">
            <li><a href="#features" class="header__nav-link">Features</a></li>
            <li><a href="#pricing" class="header__nav-link">Pricing</a></li>
            <li><a href="#faq" class="header__nav-link">FAQ</a></li>
            <li><a href="support.html" class="header__nav-link">Support</a></li>
          </ul>
        </nav>
        <div class="header__cta">
          <a href="https://buy.stripe.com/9AQ14m53s8i97y0110" 
             class="btn btn--primary"
             target="_blank" 
             rel="noopener noreferrer">
            Buy Now
          </a>
        </div>
      </div>
    `;
  }

  getTemplate() {
    if (!this.content) return '';

    const { navigation, site } = this.content;

    return `
      <div class="header__container">
        <!-- Skip to main content link -->
        <a href="#main" class="skip-link">Skip to main content</a>
        
        <!-- Brand/Logo -->
        <div class="header__brand">
          <a href="#home" class="header__logo" aria-label="${site.name} - Home">
            <img src="assets/RescuePC_Logo_Light.png" 
                 alt="${site.name}" 
                 width="180" 
                 height="40"
                 loading="eager">
          </a>
        </div>

        <!-- Main Navigation -->
        <nav class="header__nav" role="navigation" aria-label="Main navigation">
          <ul class="header__nav-list" role="list">
            ${navigation.links.map(link => `
              <li class="header__nav-item">
                <a href="${link.href}" 
                   class="header__nav-link"
                   ${link.href.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>
                  ${link.text}
                </a>
              </li>
            `).join('')}
          </ul>
        </nav>

        <!-- Mobile Menu Button -->
        <button class="header__mobile-toggle" 
                type="button"
                aria-expanded="false"
                aria-controls="mobile-menu"
                aria-label="Toggle mobile menu">
          <span class="header__hamburger">
            <span class="header__hamburger-line"></span>
            <span class="header__hamburger-line"></span>
            <span class="header__hamburger-line"></span>
          </span>
        </button>

        <!-- CTA Button -->
        <div class="header__cta">
          <a href="https://buy.stripe.com/9AQ14m53s8i97y0110" 
             class="btn btn--primary btn--header"
             target="_blank" 
             rel="noopener noreferrer"
             aria-describedby="cta-description">
            <span class="btn__text">${navigation.cta}</span>
            <span class="btn__icon" aria-hidden="true">
              <i class="fas fa-shopping-cart"></i>
            </span>
          </a>
          <div id="cta-description" class="sr-only">
            Purchase ${site.name} for ${site.price}
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div class="header__mobile-menu" 
           id="mobile-menu"
           aria-hidden="true"
           role="dialog"
           aria-label="Mobile navigation menu">
        <div class="header__mobile-content">
          <nav class="header__mobile-nav" role="navigation" aria-label="Mobile navigation">
            <ul class="header__mobile-list" role="list">
              ${navigation.links.map(link => `
                <li class="header__mobile-item">
                  <a href="${link.href}" 
                     class="header__mobile-link"
                     ${link.href.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>
                    ${link.text}
                  </a>
                </li>
              `).join('')}
              <li class="header__mobile-item header__mobile-cta">
                <a href="https://buy.stripe.com/9AQ14m53s8i97y0110" 
                   class="btn btn--primary btn--block"
                   target="_blank" 
                   rel="noopener noreferrer">
                  ${navigation.cta}
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <!-- Mobile Menu Backdrop -->
      <div class="header__backdrop" aria-hidden="true"></div>
    `;
  }

  attachEventListeners() {
    const mobileToggle = document.querySelector('.header__mobile-toggle');
    const mobileMenu = document.querySelector('.header__mobile-menu');
    const backdrop = document.querySelector('.header__backdrop');
    const mobileLinks = document.querySelectorAll('.header__mobile-link');

    if (!mobileToggle || !mobileMenu || !backdrop) return;

    // Mobile menu toggle
    mobileToggle.addEventListener('click', () => this.toggleMobileMenu());

    // Close mobile menu when clicking backdrop
    backdrop.addEventListener('click', () => this.closeMobileMenu());

    // Close mobile menu when clicking links
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMobileMenu());
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.mobileMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768 && this.mobileMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Smooth scroll for anchor links
    this.setupSmoothScroll();

    // Header scroll behavior
    this.setupScrollBehavior();
  }

  toggleMobileMenu() {
    if (this.mobileMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    const mobileToggle = document.querySelector('.header__mobile-toggle');
    const mobileMenu = document.querySelector('.header__mobile-menu');
    const backdrop = document.querySelector('.header__backdrop');

    if (!mobileToggle || !mobileMenu || !backdrop) return;

    this.mobileMenuOpen = true;
    
    // Update ARIA attributes
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    backdrop.setAttribute('aria-hidden', 'false');

    // Add CSS classes
    document.body.classList.add('mobile-menu-open');
    mobileToggle.classList.add('is-active');
    mobileMenu.classList.add('is-open');
    backdrop.classList.add('is-visible');

    // Focus management
    const firstLink = mobileMenu.querySelector('.header__mobile-link');
    if (firstLink) {
      firstLink.focus();
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  closeMobileMenu() {
    const mobileToggle = document.querySelector('.header__mobile-toggle');
    const mobileMenu = document.querySelector('.header__mobile-menu');
    const backdrop = document.querySelector('.header__backdrop');

    if (!mobileToggle || !mobileMenu || !backdrop) return;

    this.mobileMenuOpen = false;

    // Update ARIA attributes
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    backdrop.setAttribute('aria-hidden', 'true');

    // Remove CSS classes
    document.body.classList.remove('mobile-menu-open');
    mobileToggle.classList.remove('is-active');
    mobileMenu.classList.remove('is-open');
    backdrop.classList.remove('is-visible');

    // Restore body scroll
    document.body.style.overflow = '';

    // Return focus to toggle button
    mobileToggle.focus();
  }

  setupSmoothScroll() {
    const navLinks = document.querySelectorAll('.header__nav-link, .header__mobile-link');
    
    navLinks.forEach(link => {
      if (link.getAttribute('href').startsWith('#')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href').substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });

            // Update URL without jumping
            history.pushState(null, null, `#${targetId}`);
          }
        });
      }
    });
  }

  setupScrollBehavior() {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateHeader = () => {
      const header = document.querySelector('.header');
      if (!header) return;

      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }

      // Hide header when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        header.classList.add('header--hidden');
      } else {
        header.classList.remove('header--hidden');
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
  }

  setupAccessibility() {
    // Ensure proper focus management
    const focusableElements = document.querySelectorAll(
      '.header a, .header button, .header input, .header select, .header textarea, .header [tabindex]:not([tabindex="-1"])'
    );

    // Add focus-visible polyfill behavior
    focusableElements.forEach(element => {
      element.addEventListener('mousedown', () => {
        element.classList.add('focus-via-mouse');
      });

      element.addEventListener('keydown', () => {
        element.classList.remove('focus-via-mouse');
      });
    });

    // Announce page changes to screen readers
    const navLinks = document.querySelectorAll('.header__nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = `Navigating to ${link.textContent}`;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
          document.body.removeChild(announcement);
        }, 1000);
      });
    });
  }

  // Public API for external components
  isMenuOpen() {
    return this.mobileMenuOpen;
  }

  closeMenu() {
    this.closeMobileMenu();
  }

  updateActiveLink(sectionId) {
    const navLinks = document.querySelectorAll('.header__nav-link, .header__mobile-link');
    
    navLinks.forEach(link => {
      link.classList.remove('is-active');
      if (link.getAttribute('href') === `#${sectionId}`) {
        link.classList.add('is-active');
      }
    });
  }

  // Public method to highlight current section
  setActiveSection(sectionId) {
    const navLink = document.querySelector(`[data-section="${sectionId}"]`);
    if (navLink) {
      this.updateActiveLink(sectionId);
    }
  }

  // Get current navigation state
  getState() {
    return {
      isMenuOpen: this.mobileMenuOpen,
      activeSection: document.querySelector('.header__nav-link.is-active')?.getAttribute('data-section'),
      securityStatus: this.security.getSecurityStatus()
    };
  }
}

export default RescuePCHeader; 
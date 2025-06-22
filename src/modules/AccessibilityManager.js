/**
 * Accessibility Manager Module
 * Handles WCAG compliance and accessibility features
 */
class AccessibilityManager {
  constructor() {
    this.isEnabled = true;
    this.focusVisible = false;
    this.highContrast = false;
    this.reducedMotion = false;
    
    this.init();
  }
  
  /**
   * Initialize accessibility features
   */
  init() {
    if (!this.isEnabled) return;
    
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupPreferences();
    this.setupARIAEnhancements();
    
    console.log('✅ Accessibility manager initialized');
  }
  
  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.focus();
          target.scrollIntoView();
        }
      });
    }
    
    // Tab navigation enhancement
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        this.focusVisible = true;
        document.body.classList.add('focus-visible');
      }
      
      // Escape key handling
      if (e.key === 'Escape') {
        this.handleEscapeKey();
      }
    });
    
    // Mouse interaction removes focus indicators
    document.addEventListener('mousedown', () => {
      this.focusVisible = false;
      document.body.classList.remove('focus-visible');
    });
  }
  
  /**
   * Setup focus management
   */
  setupFocusManagement() {
    // Ensure proper focus order
    const focusableElements = this.getFocusableElements();
    
    // Add focus indicators to interactive elements
    focusableElements.forEach(element => {
      element.addEventListener('focus', () => {
        if (this.focusVisible) {
          element.classList.add('focused');
        }
      });
      
      element.addEventListener('blur', () => {
        element.classList.remove('focused');
      });
    });
  }
  
  /**
   * Setup user preferences
   */
  setupPreferences() {
    // Check for reduced motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.reducedMotion = true;
      document.body.classList.add('reduced-motion');
      console.log('🎯 Reduced motion enabled');
    }
    
    // Check for high contrast preference
    if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
      this.highContrast = true;
      document.body.classList.add('high-contrast');
      console.log('🎯 High contrast enabled');
    }
    
    // Listen for preference changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
        this.reducedMotion = e.matches;
        document.body.classList.toggle('reduced-motion', e.matches);
      });
      
      window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
        this.highContrast = e.matches;
        document.body.classList.toggle('high-contrast', e.matches);
      });
    }
  }
  
  /**
   * Setup ARIA enhancements
   */
  setupARIAEnhancements() {
    // Add live region for dynamic content
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
    
    // Enhance buttons without proper labels
    const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
    buttons.forEach(button => {
      if (!button.textContent.trim()) {
        const icon = button.querySelector('i[class*="fa-"]');
        if (icon) {
          const iconClass = Array.from(icon.classList).find(cls => cls.startsWith('fa-'));
          const label = this.getIconLabel(iconClass);
          button.setAttribute('aria-label', label);
        }
      }
    });
    
    // Enhance images without alt text
    const images = document.querySelectorAll('img:not([alt])');
    images.forEach(img => {
      img.setAttribute('alt', '');
    });
  }
  
  /**
   * Get focusable elements
   */
  getFocusableElements() {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
    
    return Array.from(document.querySelectorAll(selector));
  }
  
  /**
   * Handle escape key press
   */
  handleEscapeKey() {
    // Close any open modals or dropdowns
    const openElements = document.querySelectorAll('[aria-expanded="true"]');
    openElements.forEach(element => {
      element.setAttribute('aria-expanded', 'false');
    });
    
    // Remove focus from active element if it's not essential
    if (document.activeElement && document.activeElement !== document.body) {
      const isEssential = document.activeElement.matches('input, textarea, select');
      if (!isEssential) {
        document.activeElement.blur();
      }
    }
  }
  
  /**
   * Get icon label from Font Awesome class
   */
  getIconLabel(iconClass) {
    const iconLabels = {
      'fa-download': 'Download',
      'fa-check': 'Check',
      'fa-shield-alt': 'Security',
      'fa-star': 'Star',
      'fa-menu': 'Menu',
      'fa-close': 'Close',
      'fa-search': 'Search',
      'fa-play': 'Play',
      'fa-pause': 'Pause'
    };
    
    return iconLabels[iconClass] || 'Icon';
  }
  
  /**
   * Announce message to screen readers
   */
  announce(message, priority = 'polite') {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }
  
  /**
   * Check if reduced motion is preferred
   */
  prefersReducedMotion() {
    return this.reducedMotion;
  }
  
  /**
   * Check if high contrast is preferred
   */
  prefersHighContrast() {
    return this.highContrast;
  }
  
  /**
   * Validate accessibility compliance
   */
  validateCompliance() {
    const issues = [];
    
    // Check for images without alt text
    const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
    if (imagesWithoutAlt.length > 0) {
      issues.push(`${imagesWithoutAlt.length} images missing alt text`);
    }
    
    // Check for buttons without labels
    const buttonsWithoutLabels = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
    const unlabeledButtons = Array.from(buttonsWithoutLabels).filter(btn => !btn.textContent.trim());
    if (unlabeledButtons.length > 0) {
      issues.push(`${unlabeledButtons.length} buttons missing labels`);
    }
    
    // Check for proper heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > lastLevel + 1) {
        issues.push(`Heading hierarchy issue: ${heading.tagName} follows h${lastLevel}`);
      }
      lastLevel = level;
    });
    
    if (issues.length === 0) {
      console.log('✅ No accessibility issues found');
    } else {
      console.warn('⚠️ Accessibility issues:', issues);
    }
    
    return issues;
  }
}

// Export
export default AccessibilityManager; 
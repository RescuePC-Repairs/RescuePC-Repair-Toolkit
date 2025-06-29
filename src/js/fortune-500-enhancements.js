/**
 * FORTUNE 500 ENHANCEMENTS - ENTERPRISE EXCELLENCE
 * Critical fixes for security text visibility and professional interactions
 */

class Fortune500Enhancements {
  constructor() {
    this.init();
  }
  
  init() {
    this.waitForDOMReady(() => {
      this.fixSecurityTextVisibility();
      this.enhanceInteractions();
      this.addProfessionalAnimations();
      this.setupAccessibility();
      this.monitorAndFix();
    });
  }
  
  waitForDOMReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }
  
  /**
   * CRITICAL: Fix security text visibility
   */
  fixSecurityTextVisibility() {
    console.log('🔧 Fixing security text visibility...');
    
    // Find all enterprise feature elements
    const securityFeatures = document.querySelectorAll('.enterprise-feature');
    
    securityFeatures.forEach((feature, index) => {
      const title = feature.querySelector('h3');
      const description = feature.querySelector('p');
      
      if (title) {
        // Force black text with multiple approaches
        title.style.setProperty('color', '#000000', 'important');
        title.style.setProperty('background', 'transparent', 'important');
        title.style.setProperty('text-shadow', 'none', 'important');
        title.style.setProperty('opacity', '1', 'important');
        title.style.setProperty('visibility', 'visible', 'important');
        title.style.setProperty('font-weight', '700', 'important');
        title.style.setProperty('font-size', '1.5rem', 'important');
        
        // Add CSS class for additional styling
        title.classList.add('security-title-fixed');
      }
      
      if (description) {
        // Force readable text
        description.style.setProperty('color', '#374151', 'important');
        description.style.setProperty('background', 'transparent', 'important');
        description.style.setProperty('text-shadow', 'none', 'important');
        description.style.setProperty('opacity', '1', 'important');
        description.style.setProperty('visibility', 'visible', 'important');
        description.style.setProperty('font-weight', '500', 'important');
        description.style.setProperty('font-size', '1rem', 'important');
        
        // Add CSS class for additional styling
        description.classList.add('security-description-fixed');
      }
      
      // Add enhanced styling to the container
      feature.style.setProperty('background', '#ffffff', 'important');
      feature.style.setProperty('border', '2px solid #e5e7eb', 'important');
      feature.style.setProperty('border-radius', '16px', 'important');
      feature.style.setProperty('padding', '2rem', 'important');
      feature.classList.add('security-feature-enhanced');
    });
    
    // Add dynamic CSS to ensure text remains visible
    this.addDynamicCSS();
    
    console.log('✅ Security text visibility fixed');
  }
  
  /**
   * Add dynamic CSS to ensure text visibility
   */
  addDynamicCSS() {
    const style = document.createElement('style');
    style.id = 'fortune-500-security-fix';
    style.textContent = `
      /* CRITICAL: Security text visibility fix */
      .enterprise-feature h3,
      .enterprise-feature p,
      .security-title-fixed,
      .security-description-fixed {
        color: #000000 !important;
        background: transparent !important;
        text-shadow: none !important;
        opacity: 1 !important;
        visibility: visible !important;
        -webkit-text-fill-color: #000000 !important;
        -webkit-background-clip: text !important;
      }
      
      .enterprise-feature {
        background: #ffffff !important;
        border: 2px solid #e5e7eb !important;
        border-radius: 16px !important;
      }
      
      .enterprise-feature:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        border-color: #2563eb !important;
      }
      
      /* Ensure icons remain colorful */
      .enterprise-feature i {
        color: #2563eb !important;
      }
    `;
    
    // Add to head with highest priority
    document.head.appendChild(style);
  }
  
  /**
   * Enhance interactions for Fortune 500 feel
   */
  enhanceInteractions() {
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Enhance buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
      });
    });
    
    // Enhance cards
    const cards = document.querySelectorAll('.card, .enterprise-feature, .pricing-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
        card.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      });
    });
  }
  
  /**
   * Add professional animations
   */
  addProfessionalAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);
    
    // Observe sections for animation
    const sections = document.querySelectorAll('section, .enterprise-feature, .card');
    sections.forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(20px)';
      section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(section);
    });
  }
  
  /**
   * Setup accessibility enhancements
   */
  setupAccessibility() {
    // Add focus indicators
    const focusableElements = document.querySelectorAll('a, button, input, select, textarea');
    focusableElements.forEach(element => {
      element.addEventListener('focus', () => {
        element.style.outline = '2px solid #2563eb';
        element.style.outlineOffset = '2px';
      });
      
      element.addEventListener('blur', () => {
        element.style.outline = 'none';
      });
    });
    
    // Add skip links
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #2563eb;
      color: white;
      padding: 8px 16px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 1000;
      transition: top 0.3s ease;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
  
  /**
   * Monitor and fix any style conflicts
   */
  monitorAndFix() {
    // Monitor for style changes that might break security text
    const observer = new MutationObserver((mutations) => {
      let needsFix = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const element = mutation.target;
          if (element.closest('.enterprise-feature')) {
            needsFix = true;
          }
        }
      });
      
      if (needsFix) {
        setTimeout(() => this.fixSecurityTextVisibility(), 100);
      }
    });
    
    // Start observing
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['style', 'class']
    });
    
    // Periodic check to ensure text remains visible
    setInterval(() => {
      this.ensureTextVisibility();
    }, 5000);
  }
  
  /**
   * Ensure text visibility check
   */
  ensureTextVisibility() {
    const securityFeatures = document.querySelectorAll('.enterprise-feature h3, .enterprise-feature p');
    let needsFix = false;
    
    securityFeatures.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const color = computedStyle.color;
      
      // Check if text is invisible (white or transparent)
      if (color === 'rgb(255, 255, 255)' || color === 'rgba(255, 255, 255, 1)' || 
          color === 'transparent' || computedStyle.opacity === '0') {
        needsFix = true;
      }
    });
    
    if (needsFix) {
      console.log('🔧 Re-fixing security text visibility...');
      this.fixSecurityTextVisibility();
    }
  }
  
  /**
   * Add Fortune 500 level polish
   */
  addPolish() {
    // Add loading states
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    window.addEventListener('load', () => {
      document.body.style.opacity = '1';
    });
    
    // Add professional cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, .btn, .card');
    interactiveElements.forEach(element => {
      element.style.cursor = 'pointer';
    });
  }
}

// Initialize immediately
document.addEventListener('DOMContentLoaded', () => {
  window.fortune500Enhancements = new Fortune500Enhancements();
});

// Also initialize if DOM is already ready
if (document.readyState !== 'loading') {
  window.fortune500Enhancements = new Fortune500Enhancements();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Fortune500Enhancements;
} 
/* =============================================================================
   PERFECT INITIALIZATION - FORTUNE 500 ENTERPRISE SYSTEM
   World-Class Professional JavaScript by the Best Engineers
   ============================================================================= */

(function() {
  'use strict';
  
  // =============================================================================
  // PERFECT LOADING SYSTEM
  // =============================================================================
  
  // Remove loading class and add loaded class when everything is ready
  function initializePerfectLoading() {
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
    
    // Add animate-in class to all sections for smooth entrance
    const sections = document.querySelectorAll('.section, section, .hero, .features, .pricing, .faq, .about, .footer');
    sections.forEach((section, index) => {
      setTimeout(() => {
        section.classList.add('animate-in');
      }, index * 100);
    });
  }
  
  // =============================================================================
  // PERFECT RESPONSIVE SYSTEM
  // =============================================================================
  
  function initializePerfectResponsive() {
    // Ensure perfect responsive behavior
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
    }
    
    // Perfect image lazy loading
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
  
  // =============================================================================
  // PERFECT CENTERING SYSTEM
  // =============================================================================
  
  function initializePerfectCentering() {
    // Ensure all sections are perfectly centered
    const sections = document.querySelectorAll('.section, section, .hero, .features, .pricing, .faq, .about');
    
    sections.forEach(section => {
      // Force perfect centering
      section.style.display = 'flex';
      section.style.flexDirection = 'column';
      section.style.alignItems = 'center';
      section.style.justifyContent = 'center';
      section.style.textAlign = 'center';
      section.style.width = '100%';
      section.style.position = 'relative';
      
      // Ensure container is perfectly centered
      const container = section.querySelector('.container');
      if (container) {
        container.style.width = '100%';
        container.style.maxWidth = '1200px';
        container.style.margin = '0 auto';
        container.style.padding = '0 2rem';
        container.style.position = 'relative';
      }
    });
  }
  
  // =============================================================================
  // PERFECT GRID SYSTEM
  // =============================================================================
  
  function initializePerfectGrids() {
    const grids = document.querySelectorAll('.grid, .features-grid, .pricing-grid, .faq-grid, .benefits-grid');
    
    grids.forEach(grid => {
      // Force perfect grid layout
      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
      grid.style.gap = '2rem';
      grid.style.width = '100%';
      grid.style.maxWidth = '1200px';
      grid.style.margin = '3rem auto';
      grid.style.padding = '0';
      grid.style.justifyItems = 'center';
      grid.style.alignItems = 'start';
    });
  }
  
  // =============================================================================
  // PERFECT CARD SYSTEM
  // =============================================================================
  
  function initializePerfectCards() {
    const cards = document.querySelectorAll('.card, .feature-card, .pricing-card, .faq-card, .benefit-card');
    
    cards.forEach(card => {
      // Force perfect card layout
      card.style.width = '100%';
      card.style.maxWidth = '400px';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.alignItems = 'center';
      card.style.justifyContent = 'flex-start';
      card.style.textAlign = 'center';
      card.style.height = 'auto';
      card.style.minHeight = '300px';
      card.style.padding = '2rem';
      card.style.borderRadius = '0.5rem';
      card.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
      card.style.transition = 'all 0.3s ease';
      card.style.backgroundColor = '#ffffff';
      card.style.border = '1px solid #e2e8f0';
    });
  }
  
  // =============================================================================
  // PERFECT SECURITY INDICATORS FIX
  // =============================================================================
  
  function initializePerfectSecurityText() {
    // Force security indicators to have black text
    const securityElements = document.querySelectorAll(
      '.security-indicators, .security-item, .security-badge, .security-features, ' +
      '.security-indicators span, .security-item span, .security-badge span, .security-features span'
    );
    
    securityElements.forEach(element => {
      element.style.color = '#000000';
      element.style.backgroundColor = '#ffffff';
      element.style.textShadow = 'none';
      element.style.webkitTextFillColor = '#000000';
      element.style.fontWeight = '600';
    });
    
    // Monitor for changes and reapply styles
    const observer = new MutationObserver(() => {
      securityElements.forEach(element => {
        if (element.style.color !== '#000000') {
          element.style.color = '#000000';
          element.style.backgroundColor = '#ffffff';
          element.style.textShadow = 'none';
          element.style.webkitTextFillColor = '#000000';
        }
      });
    });
    
    securityElements.forEach(element => {
      observer.observe(element, { attributes: true, attributeFilter: ['style', 'class'] });
    });
  }
  
  // =============================================================================
  // PERFECT PERFORMANCE OPTIMIZATION
  // =============================================================================
  
  function initializePerfectPerformance() {
    // Optimize images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.loading) {
        img.loading = 'lazy';
      }
      if (!img.decoding) {
        img.decoding = 'async';
      }
    });
    
    // Optimize fonts
    const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
    fontLinks.forEach(link => {
      link.rel = 'preload';
      link.as = 'style';
      link.onload = function() {
        this.onload = null;
        this.rel = 'stylesheet';
      };
    });
  }
  
  // =============================================================================
  // PERFECT ACCESSIBILITY
  // =============================================================================
  
  function initializePerfectAccessibility() {
    // Ensure all interactive elements have proper focus styles
    const interactiveElements = document.querySelectorAll('button, a, input, textarea, select');
    interactiveElements.forEach(element => {
      element.addEventListener('focus', function() {
        this.style.outline = '2px solid #1a365d';
        this.style.outlineOffset = '2px';
      });
      
      element.addEventListener('blur', function() {
        this.style.outline = '';
        this.style.outlineOffset = '';
      });
    });
    
    // Add skip links if not present
    if (!document.querySelector('.skip-link')) {
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.className = 'skip-link sr-only';
      skipLink.textContent = 'Skip to main content';
      skipLink.style.position = 'absolute';
      skipLink.style.top = '-40px';
      skipLink.style.left = '6px';
      skipLink.style.background = '#000';
      skipLink.style.color = '#fff';
      skipLink.style.padding = '8px';
      skipLink.style.textDecoration = 'none';
      skipLink.style.zIndex = '100000';
      
      skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
      });
      
      skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
      });
      
      document.body.insertBefore(skipLink, document.body.firstChild);
    }
  }
  
  // =============================================================================
  // PERFECT ERROR HANDLING
  // =============================================================================
  
  function initializePerfectErrorHandling() {
    // Global error handler
    window.addEventListener('error', function(e) {
      console.error('Perfect System Error:', e.error);
      // Don't break the user experience
      return true;
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', function(e) {
      console.error('Perfect System Promise Rejection:', e.reason);
      e.preventDefault();
    });
  }
  
  // =============================================================================
  // PERFECT INITIALIZATION SEQUENCE
  // =============================================================================
  
  function initializePerfectSystem() {
    try {
      initializePerfectErrorHandling();
      initializePerfectResponsive();
      initializePerfectCentering();
      initializePerfectGrids();
      initializePerfectCards();
      initializePerfectSecurityText();
      initializePerfectPerformance();
      initializePerfectAccessibility();
      initializePerfectLoading();
      
      console.log('🎉 Perfect Fortune 500 System Initialized Successfully');
    } catch (error) {
      console.error('Perfect System Initialization Error:', error);
    }
  }
  
  // =============================================================================
  // PERFECT STARTUP
  // =============================================================================
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePerfectSystem);
  } else {
    initializePerfectSystem();
  }
  
  // Re-initialize on window resize for perfect responsiveness
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      initializePerfectCentering();
      initializePerfectGrids();
      initializePerfectCards();
    }, 250);
  });
  
  // Perfect health check every 5 seconds
  setInterval(() => {
    initializePerfectSecurityText();
  }, 5000);
  
})(); 
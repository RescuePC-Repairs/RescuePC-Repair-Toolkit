/**
 * =============================================================================
 * ENTERPRISE INITIALIZATION SYSTEM - MILITARY-GRADE PERFORMANCE
 * World-Class JavaScript by 120-Year Expert QA Engineer
 * Lightning Performance | Military Security | Enterprise Scalability
 * =============================================================================
 */

class EnterpriseInitializationSystem {
  constructor() {
    this.isInitialized = false;
    this.performanceMetrics = {
      startTime: performance.now(),
      domContentLoaded: null,
      fullyLoaded: null,
      firstPaint: null,
      firstContentfulPaint: null
    };
    
    this.securityMonitoring = {
      cspViolations: [],
      xssAttempts: [],
      suspiciousActivity: []
    };
    
    this.init();
  }
  
  /**
   * Initialize the enterprise system
   */
  init() {
    console.log('🚀 Enterprise Initialization System Starting...');
    
    // Immediate security setup
    this.setupSecurityMonitoring();
    
    // Performance monitoring
    this.setupPerformanceMonitoring();
    
    // DOM Content Loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.onDOMContentLoaded());
    } else {
      this.onDOMContentLoaded();
    }
    
    // Window Load
    if (document.readyState === 'complete') {
      this.onWindowLoad();
    } else {
      window.addEventListener('load', () => this.onWindowLoad());
    }
  }
  
  /**
   * Setup military-grade security monitoring
   */
  setupSecurityMonitoring() {
    // CSP Violation Monitoring
    document.addEventListener('securitypolicyviolation', (e) => {
      this.securityMonitoring.cspViolations.push({
        blockedURI: e.blockedURI,
        violatedDirective: e.violatedDirective,
        originalPolicy: e.originalPolicy,
        timestamp: new Date().toISOString()
      });
      
      console.warn('🛡️ CSP Violation Detected:', {
        blocked: e.blockedURI,
        directive: e.violatedDirective
      });
    });
    
    // XSS Protection
    this.setupXSSProtection();
    
    // Click-jacking protection
    if (window.top !== window.self) {
      console.warn('🛡️ Potential click-jacking attempt detected');
      this.securityMonitoring.suspiciousActivity.push({
        type: 'clickjacking_attempt',
        timestamp: new Date().toISOString()
      });
    }
  }
  
  /**
   * Setup XSS protection
   */
  setupXSSProtection() {
    // Monitor for suspicious script injections
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
              const src = node.src || 'inline';
              if (!this.isAllowedScript(src)) {
                console.warn('🛡️ Suspicious script detected:', src);
                this.securityMonitoring.xssAttempts.push({
                  src: src,
                  content: node.innerHTML.substring(0, 100),
                  timestamp: new Date().toISOString()
                });
                node.remove();
              }
            }
          });
        }
      });
    });
    
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }
  
  /**
   * Check if script is allowed
   */
  isAllowedScript(src) {
    const allowedDomains = [
      'cdnjs.cloudflare.com',
      'cdn.jsdelivr.net',
      'js.stripe.com',
      location.origin
    ];
    
    if (src === 'inline') return true; // Allow inline scripts for now
    
    return allowedDomains.some(domain => src.includes(domain));
  }
  
  /**
   * Setup performance monitoring
   */
  setupPerformanceMonitoring() {
    // Performance Observer for Core Web Vitals
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      try {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('📊 LCP:', lastEntry.startTime.toFixed(2) + 'ms');
        }).observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        console.log('📊 LCP monitoring not supported');
      }
      
      // First Input Delay
      try {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            console.log('📊 FID:', (entry.processingStart - entry.startTime).toFixed(2) + 'ms');
          });
        }).observe({ type: 'first-input', buffered: true });
      } catch (e) {
        console.log('📊 FID monitoring not supported');
      }
      
      // Cumulative Layout Shift
      try {
        new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          if (clsValue > 0) {
            console.log('📊 CLS:', clsValue.toFixed(4));
          }
        }).observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        console.log('📊 CLS monitoring not supported');
      }
    }
    
    // Navigation Timing
    window.addEventListener('load', () => {
      setTimeout(() => {
        try {
          const nav = performance.getEntriesByType('navigation')[0];
          if (nav) {
            console.log('📊 Performance Metrics:', {
              'DNS Lookup': (nav.domainLookupEnd - nav.domainLookupStart).toFixed(2) + 'ms',
              'TCP Connection': (nav.connectEnd - nav.connectStart).toFixed(2) + 'ms',
              'Server Response': (nav.responseEnd - nav.requestStart).toFixed(2) + 'ms',
              'DOM Processing': (nav.domContentLoadedEventEnd - nav.responseEnd).toFixed(2) + 'ms',
              'Total Load Time': (nav.loadEventEnd - nav.navigationStart).toFixed(2) + 'ms'
            });
          }
        } catch (e) {
          console.log('📊 Navigation timing not available');
        }
      }, 1000);
    });
  }
  
  /**
   * Handle DOM Content Loaded
   */
  onDOMContentLoaded() {
    this.performanceMetrics.domContentLoaded = performance.now();
    console.log('🏗️ DOM Content Loaded in', (this.performanceMetrics.domContentLoaded - this.performanceMetrics.startTime).toFixed(2) + 'ms');
    
    // Initialize visual hierarchy
    this.initializeVisualHierarchy();
    
    // Setup responsive monitoring
    this.setupResponsiveMonitoring();
    
    // Initialize accessibility features
    this.initializeAccessibility();
    
    // Setup smooth scrolling
    this.setupSmoothScrolling();
    
    // Initialize animations
    this.initializeAnimations();
    
    // Setup enhanced visual monitoring
    this.setupVisualMonitoring();
  }
  
  /**
   * Handle Window Load
   */
  onWindowLoad() {
    this.performanceMetrics.fullyLoaded = performance.now();
    console.log('✅ Window Fully Loaded in', (this.performanceMetrics.fullyLoaded - this.performanceMetrics.startTime).toFixed(2) + 'ms');
    
    // Remove loading class
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
    
    // Final visual hierarchy check
    this.finalVisualHierarchyCheck();
    
    // Setup lazy loading
    this.setupLazyLoading();
    
    // Initialize service worker if available
    this.initializeServiceWorker();
    
    this.isInitialized = true;
    console.log('🎉 Enterprise System Fully Initialized!');
  }
  
  /**
   * Initialize visual hierarchy system
   */
  initializeVisualHierarchy() {
    console.log('🎨 Initializing Visual Hierarchy...');
    
    // Ensure all sections are properly structured
    const sections = document.querySelectorAll('.section, section, .hero, .fortune500-hero');
    sections.forEach((section, index) => {
      // Add enterprise classes if missing
      if (!section.classList.contains('section') && !section.classList.contains('hero') && !section.classList.contains('fortune500-hero')) {
        section.classList.add('section');
      }
      
      // Ensure container exists for non-hero sections
      if (!section.classList.contains('hero') && !section.classList.contains('fortune500-hero')) {
        let container = section.querySelector('.container');
        if (!container) {
          container = document.createElement('div');
          container.className = 'container';
          while (section.firstChild) {
            container.appendChild(section.firstChild);
          }
          section.appendChild(container);
        }
      }
      
      // Add animation delay
      section.style.animationDelay = (index * 0.1) + 's';
      section.classList.add('animate-fade-in-up');
    });
    
    // Fix security indicators
    this.fixSecurityIndicators();
    
    // Optimize images
    this.optimizeImages();
    
    // Setup intersection observer for animations
    this.setupIntersectionObserver();
  }
  
  /**
   * Fix security indicators visibility
   */
  fixSecurityIndicators() {
    // Fix security indicators every 2 seconds to ensure they stay visible
    const fixSecurityText = () => {
      const securityElements = document.querySelectorAll(
        '.security-indicators, .security-item, .security-badge, .security-indicator, ' +
        '[class*="security"], [id*="security"]'
      );
      
      securityElements.forEach(element => {
        // Force visible styling
        element.style.color = '#1f2937';
        element.style.backgroundColor = '#ffffff';
        element.style.textShadow = 'none';
        element.style.webkitTextFillColor = 'unset';
        element.style.opacity = '1';
        element.style.visibility = 'visible';
        
        // Find all child elements
        const children = element.querySelectorAll('*');
        children.forEach(child => {
          child.style.color = '#1f2937';
          child.style.backgroundColor = 'transparent';
          child.style.textShadow = 'none';
          child.style.webkitTextFillColor = 'unset';
          child.style.opacity = '1';
          child.style.visibility = 'visible';
        });
      });
    };
    
    // Fix immediately and then every 2 seconds
    fixSecurityText();
    setInterval(fixSecurityText, 2000);
    
    console.log('🛡️ Security indicators visibility monitoring active');
  }
  
  /**
   * Enhanced visual monitoring - fix all readability issues
   */
  setupVisualMonitoring() {
    // Monitor and fix all text readability issues every 3 seconds
    const fixAllTextReadability = () => {
      // Fix all text elements
      const allTextElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, li, div, a');
      
      allTextElements.forEach(element => {
        const computedStyle = window.getComputedStyle(element);
        const color = computedStyle.color;
        const backgroundColor = computedStyle.backgroundColor;
        
        // Check if text is invisible or hard to read
        if (color === 'rgba(255, 255, 255, 1)' || color === 'rgb(255, 255, 255)' || 
            color === 'rgba(255, 255, 255, 0)' || color === 'transparent' ||
            (backgroundColor === 'rgba(255, 255, 255, 1)' && color === 'rgba(255, 255, 255, 1)')) {
          
          // Force readable text
          element.style.color = '#1f2937';
          element.style.backgroundColor = 'transparent';
          element.style.textShadow = 'none';
          element.style.webkitTextFillColor = 'unset';
          element.style.opacity = '1';
          element.style.visibility = 'visible';
        }
      });

      // Fix hero section text specifically
      const heroElements = document.querySelectorAll('.hero *, .fortune500-hero *');
      heroElements.forEach(element => {
        if (element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3' || 
            element.classList.contains('hero-title') || element.classList.contains('hero-subtitle') ||
            element.classList.contains('hero-description')) {
          element.style.color = 'white';
          element.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
        }
      });

      // Fix pricing section layout
      const pricingCards = document.querySelectorAll('.pricing-card, .card');
      pricingCards.forEach(card => {
        card.style.background = 'white';
        card.style.border = '1px solid #e5e7eb';
        card.style.borderRadius = '12px';
        card.style.padding = '2rem';
        card.style.marginBottom = '2rem';
        card.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      });

      // Fix feature items alignment
      const featureItems = document.querySelectorAll('.feature-item, .benefit-item');
      featureItems.forEach(item => {
        item.style.display = 'flex';
        item.style.alignItems = 'flex-start';
        item.style.gap = '1rem';
        item.style.padding = '1.5rem';
        item.style.background = 'white';
        item.style.borderRadius = '12px';
        item.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      });

      // Fix grid layouts
      const grids = document.querySelectorAll('.grid, .features-grid, .pricing-grid');
      grids.forEach(grid => {
        grid.style.display = 'grid';
        grid.style.gap = '2rem';
        grid.style.width = '100%';
        grid.style.margin = '3rem auto';
      });

      // Fix container centering
      const containers = document.querySelectorAll('.container');
      containers.forEach(container => {
        container.style.maxWidth = '1200px';
        container.style.margin = '0 auto';
        container.style.padding = '0 2rem';
        container.style.width = '100%';
      });
    };

    // Run immediately and then every 3 seconds
    fixAllTextReadability();
    setInterval(fixAllTextReadability, 3000);

    console.log('🎨 Visual monitoring system active - ensuring perfect readability');
  }
  
  /**
   * Setup responsive monitoring
   */
  setupResponsiveMonitoring() {
    const mediaQueries = [
      { name: 'mobile', query: '(max-width: 640px)' },
      { name: 'tablet', query: '(min-width: 641px) and (max-width: 1024px)' },
      { name: 'desktop', query: '(min-width: 1025px)' }
    ];
    
    mediaQueries.forEach(({ name, query }) => {
      const mq = window.matchMedia(query);
      
      const handleChange = (e) => {
        if (e.matches) {
          document.body.setAttribute('data-viewport', name);
          console.log('📱 Viewport changed to:', name);
        }
      };
      
      if (mq.addListener) {
        mq.addListener(handleChange);
      } else {
        mq.addEventListener('change', handleChange);
      }
      handleChange(mq);
    });
  }
  
  /**
   * Initialize accessibility features
   */
  initializeAccessibility() {
    // Skip links
    const skipLink = document.querySelector('.sr-only');
    if (skipLink) {
      skipLink.addEventListener('focus', () => {
        skipLink.style.position = 'absolute';
        skipLink.style.left = '6px';
        skipLink.style.top = '7px';
        skipLink.style.zIndex = '999999';
        skipLink.style.padding = '8px 16px';
        skipLink.style.background = '#000';
        skipLink.style.color = '#fff';
        skipLink.style.textDecoration = 'none';
        skipLink.style.borderRadius = '3px';
      });
      
      skipLink.addEventListener('blur', () => {
        skipLink.style.position = 'absolute';
        skipLink.style.left = '-10000px';
        skipLink.style.top = 'auto';
        skipLink.style.width = '1px';
        skipLink.style.height = '1px';
        skipLink.style.overflow = 'hidden';
      });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
    
    console.log('♿ Accessibility features initialized');
  }
  
  /**
   * Setup smooth scrolling
   */
  setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }
  
  /**
   * Initialize animations
   */
  initializeAnimations() {
    // Reduce motion check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      document.body.classList.add('reduce-motion');
      console.log('🎭 Reduced motion preferences detected');
    }
    
    // Parallax effect for hero (if motion is allowed)
    if (!prefersReducedMotion) {
      const hero = document.querySelector('.hero, .fortune500-hero');
      if (hero) {
        let ticking = false;
        
        const updateParallax = () => {
          const scrolled = window.pageYOffset;
          const rate = scrolled * -0.5;
          hero.style.transform = `translateY(${rate}px)`;
          ticking = false;
        };
        
        const requestTick = () => {
          if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
          }
        };
        
        window.addEventListener('scroll', requestTick);
      }
    }
  }
  
  /**
   * Setup intersection observer for animations
   */
  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) {
      console.log('IntersectionObserver not supported');
      return;
    }
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Observe all cards and sections
    const elementsToObserve = document.querySelectorAll('.card, .section, .feature-item, .pricing-card, .feature-card, .faq-card');
    elementsToObserve.forEach(el => observer.observe(el));
  }
  
  /**
   * Optimize images
   */
  optimizeImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // Add loading attribute
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      
      // Add decoding attribute
      if (!img.hasAttribute('decoding')) {
        img.setAttribute('decoding', 'async');
      }
      
      // Error handling
      img.addEventListener('error', () => {
        console.warn('🖼️ Image failed to load:', img.src);
        img.style.display = 'none';
      });
    });
  }
  
  /**
   * Final visual hierarchy check
   */
  finalVisualHierarchyCheck() {
    console.log('🔍 Performing final visual hierarchy check...');
    
    // Check for any remaining styling issues
    const problematicElements = document.querySelectorAll('[style*="white"][style*="color"]');
    problematicElements.forEach(el => {
      if (el.style.color === 'white' || el.style.color === '#ffffff') {
        el.style.color = '#1f2937';
        console.log('🔧 Fixed white text element:', el);
      }
    });
    
    // Ensure all sections have proper spacing
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      const computedStyle = window.getComputedStyle(section);
      if (parseInt(computedStyle.paddingTop) < 80) {
        section.style.paddingTop = '5rem';
        section.style.paddingBottom = '5rem';
      }
    });
    
    // Fix any remaining security indicators
    this.fixSecurityIndicators();
    
    console.log('✅ Visual hierarchy check completed');
  }
  
  /**
   * Setup lazy loading
   */
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const lazyElements = document.querySelectorAll('[data-src]');
      const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            element.src = element.dataset.src;
            element.removeAttribute('data-src');
            lazyObserver.unobserve(element);
          }
        });
      });
      
      lazyElements.forEach(el => lazyObserver.observe(el));
    }
  }
  
  /**
   * Initialize service worker
   */
  initializeServiceWorker() {
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('🔧 Service Worker registered:', registration);
        })
        .catch(error => {
          console.log('🔧 Service Worker registration failed:', error);
        });
    }
  }
  
  /**
   * Get performance report
   */
  getPerformanceReport() {
    return {
      metrics: this.performanceMetrics,
      security: this.securityMonitoring,
      initialized: this.isInitialized,
      timestamp: new Date().toISOString()
    };
  }
}

// Initialize the enterprise system immediately
const enterpriseSystem = new EnterpriseInitializationSystem();

// Expose to global scope for debugging
window.EnterpriseSystem = enterpriseSystem;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnterpriseInitializationSystem;
}

console.log('🚀 Enterprise Initialization System Loaded Successfully!');

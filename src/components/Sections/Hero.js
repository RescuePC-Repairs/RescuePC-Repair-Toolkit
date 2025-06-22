/*!
 * RESCUEPC REPAIRS - ULTRA-SECURE HERO SECTION
 * Professional Hero Component with Military-Grade Security
 * 
 * Features:
 * - Preserves 100% of original business content
 * - Professional animations and interactions
 * - HTTPS-enforced purchase links
 * - Accessibility-first design
 * - Performance optimized
 * 
 * @author Tyler - RescuePC Repairs
 * @version 2024.ULTRA-SECURE
 * @license MIT
 */

import { RescuePCSecurityManager } from '../../config/security.config.js';

/**
 * Hero Section Component
 * Cutting-edge, ultra-responsive hero section
 * Perfect on all devices and screen sizes
 */
class HeroSection {
  constructor(container) {
    this.container = container;
    this.isVisible = false;
    this.animations = [];
    this.breakpoints = {
      mobile: 320,
      tablet: 768,
      desktop: 1024,
      xl: 1440
    };
    
    this.init();
  }
  
  /**
   * Initialize hero section
   */
  init() {
    this.render();
    this.setupResponsiveLayout();
    this.setupAnimations();
    this.setupInteractions();
    this.setupAccessibility();
    this.setupPerformanceOptimizations();
    
    console.log('✅ Hero section initialized');
  }
  
  /**
   * Render hero section
   */
  render() {
    this.container.innerHTML = `
      <section class="hero" id="hero" aria-labelledby="hero-title">
        <div class="hero__background">
          <div class="hero__gradient"></div>
          <div class="hero__pattern"></div>
        </div>
        
        <div class="hero__container">
          <div class="hero__content">
            <div class="hero__badge" data-animate="fadeInUp" data-delay="0">
              <span class="hero__badge-icon">🚀</span>
              <span class="hero__badge-text">Professional-Grade Windows Repair</span>
            </div>
            
            <h1 class="hero__title" id="hero-title" data-animate="fadeInUp" data-delay="200">
              <span class="hero__title-main">Instantly Repair</span>
              <span class="hero__title-highlight">Any Windows PC</span>
            </h1>
            
            <p class="hero__subtitle" data-animate="fadeInUp" data-delay="400">
              Military-grade security toolkit that fixes system errors, removes malware, 
              and optimizes performance in minutes. Trusted by 10,000+ users worldwide.
            </p>
            
            <div class="hero__stats" data-animate="fadeInUp" data-delay="600">
              <div class="hero__stat">
                <span class="hero__stat-number">10,000+</span>
                <span class="hero__stat-label">Happy Customers</span>
              </div>
              <div class="hero__stat">
                <span class="hero__stat-number">99.9%</span>
                <span class="hero__stat-label">Success Rate</span>
              </div>
              <div class="hero__stat">
                <span class="hero__stat-number">< 3 min</span>
                <span class="hero__stat-label">Repair Time</span>
              </div>
            </div>
            
            <div class="hero__actions" data-animate="fadeInUp" data-delay="800">
              <a href="https://buy.stripe.com/9AQ14m53s8i97y0110" 
                 class="hero__cta hero__cta--primary"
                 target="_blank" 
                 rel="noopener noreferrer"
                 aria-describedby="cta-description">
                <span class="hero__cta-icon">💾</span>
                <span class="hero__cta-text">Download & Fix Now</span>
                <span class="hero__cta-price">$79.99</span>
              </a>
              
              <button class="hero__cta hero__cta--secondary" 
                      data-action="watch-demo"
                      aria-label="Watch demonstration video">
                <span class="hero__cta-icon">▶️</span>
                <span class="hero__cta-text">Watch Demo</span>
              </button>
            </div>
            
            <div class="hero__guarantee" data-animate="fadeInUp" data-delay="1000">
              <div class="hero__guarantee-badge">
                <span class="hero__guarantee-icon">🛡️</span>
                <span class="hero__guarantee-text">30-Day Money-Back Guarantee</span>
              </div>
              <div class="hero__trust-indicators">
                <span class="hero__trust-item">🔒 Secure Payment</span>
                <span class="hero__trust-item">⚡ Instant Download</span>
                <span class="hero__trust-item">🔄 Lifetime Updates</span>
              </div>
            </div>
          </div>
          
          <div class="hero__visual" data-animate="fadeInRight" data-delay="600">
            <div class="hero__device">
              <div class="hero__screen">
                <img src="assets/RescuePC_GUI.png" 
                     alt="RescuePC Repairs interface showing system scan and repair tools"
                     class="hero__screenshot"
                     loading="eager"
                     width="800"
                     height="600">
                <div class="hero__screen-overlay">
                  <div class="hero__progress">
                    <div class="hero__progress-bar" data-progress="95"></div>
                    <span class="hero__progress-text">System Optimized: 95%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="hero__floating-elements">
              <div class="hero__float hero__float--1" data-float="slow">
                <span class="hero__float-icon">🔧</span>
                <span class="hero__float-text">System Repair</span>
              </div>
              <div class="hero__float hero__float--2" data-float="medium">
                <span class="hero__float-icon">🛡️</span>
                <span class="hero__float-text">Security Shield</span>
              </div>
              <div class="hero__float hero__float--3" data-float="fast">
                <span class="hero__float-icon">⚡</span>
                <span class="hero__float-text">Speed Boost</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="hero__scroll-indicator" data-animate="bounce" data-delay="1200">
          <button class="hero__scroll-btn" 
                  data-action="scroll-to-features"
                  aria-label="Scroll to features section">
            <span class="hero__scroll-text">Discover Features</span>
            <span class="hero__scroll-arrow">↓</span>
          </button>
        </div>
        
        <!-- Hidden description for screen readers -->
        <div id="cta-description" class="sr-only">
          Download RescuePC Repairs toolkit for $79.99 with lifetime license, 
          30-day money-back guarantee, and instant access to all repair tools.
        </div>
      </section>
    `;
  }
  
  /**
   * Setup responsive layout
   */
  setupResponsiveLayout() {
    const updateLayout = () => {
      const width = window.innerWidth;
      const hero = this.container.querySelector('.hero');
      
      // Remove existing responsive classes
      hero.classList.remove('hero--mobile', 'hero--tablet', 'hero--desktop', 'hero--xl');
      
      // Add appropriate responsive class
      if (width < this.breakpoints.tablet) {
        hero.classList.add('hero--mobile');
      } else if (width < this.breakpoints.desktop) {
        hero.classList.add('hero--tablet');
      } else if (width < this.breakpoints.xl) {
        hero.classList.add('hero--desktop');
      } else {
        hero.classList.add('hero--xl');
      }
      
      // Update dynamic spacing
      this.updateDynamicSpacing(width);
      
      // Update font sizes
      this.updateResponsiveFonts(width);
    };
    
    // Initial layout
    updateLayout();
    
    // Update on resize with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateLayout, 100);
    });
  }
  
  /**
   * Update dynamic spacing
   */
  updateDynamicSpacing(width) {
    const hero = this.container.querySelector('.hero');
    const container = hero.querySelector('.hero__container');
    
    // Calculate responsive padding
    let padding;
    if (width < this.breakpoints.tablet) {
      padding = Math.max(20, width * 0.05); // 5% of viewport, min 20px
    } else if (width < this.breakpoints.desktop) {
      padding = Math.max(40, width * 0.04); // 4% of viewport, min 40px
    } else {
      padding = Math.max(60, width * 0.03); // 3% of viewport, min 60px
    }
    
    container.style.paddingLeft = `${padding}px`;
    container.style.paddingRight = `${padding}px`;
  }
  
  /**
   * Update responsive fonts
   */
  updateResponsiveFonts(width) {
    const title = this.container.querySelector('.hero__title');
    const subtitle = this.container.querySelector('.hero__subtitle');
    
    // Calculate responsive font sizes using clamp()
    if (width < this.breakpoints.tablet) {
      title.style.fontSize = 'clamp(2rem, 8vw, 3rem)';
      subtitle.style.fontSize = 'clamp(1rem, 4vw, 1.2rem)';
    } else if (width < this.breakpoints.desktop) {
      title.style.fontSize = 'clamp(2.5rem, 6vw, 3.5rem)';
      subtitle.style.fontSize = 'clamp(1.1rem, 3vw, 1.3rem)';
    } else {
      title.style.fontSize = 'clamp(3rem, 4vw, 4rem)';
      subtitle.style.fontSize = 'clamp(1.2rem, 2vw, 1.4rem)';
    }
  }
  
  /**
   * Setup animations
   */
  setupAnimations() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.triggerAnimations();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(this.container.querySelector('.hero'));
    
    // Setup floating animations
    this.setupFloatingAnimations();
    
    // Setup progress bar animation
    this.setupProgressAnimation();
  }
  
  /**
   * Trigger entrance animations
   */
  triggerAnimations() {
    const animatedElements = this.container.querySelectorAll('[data-animate]');
    
    animatedElements.forEach((element, index) => {
      const animationType = element.dataset.animate;
      const delay = parseInt(element.dataset.delay) || index * 200;
      
      setTimeout(() => {
        element.classList.add('animate-in', `animate-${animationType}`);
      }, delay);
    });
    
    this.isVisible = true;
  }
  
  /**
   * Setup floating animations
   */
  setupFloatingAnimations() {
    const floatingElements = this.container.querySelectorAll('[data-float]');
    
    floatingElements.forEach(element => {
      const speed = element.dataset.float;
      const duration = speed === 'slow' ? 4000 : speed === 'medium' ? 3000 : 2000;
      
      element.style.animation = `float ${duration}ms ease-in-out infinite`;
      element.style.animationDelay = `${Math.random() * 1000}ms`;
    });
  }
  
  /**
   * Setup progress bar animation
   */
  setupProgressAnimation() {
    const progressBar = this.container.querySelector('.hero__progress-bar');
    const targetProgress = parseInt(progressBar.dataset.progress);
    
    setTimeout(() => {
      progressBar.style.width = `${targetProgress}%`;
      progressBar.style.transition = 'width 2s ease-out';
    }, 1500);
  }
  
  /**
   * Setup interactions
   */
  setupInteractions() {
    // CTA button interactions
    const ctaButtons = this.container.querySelectorAll('.hero__cta');
    ctaButtons.forEach(button => {
      button.addEventListener('click', this.handleCTAClick.bind(this));
      button.addEventListener('mouseenter', this.handleCTAHover.bind(this));
    });
    
    // Action button handlers
    const actionButtons = this.container.querySelectorAll('[data-action]');
    actionButtons.forEach(button => {
      button.addEventListener('click', this.handleActionClick.bind(this));
    });
    
    // Keyboard navigation
    this.setupKeyboardNavigation();
  }
  
  /**
   * Handle CTA click
   */
  handleCTAClick(e) {
    const button = e.currentTarget;
    const isPrimary = button.classList.contains('hero__cta--primary');
    
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'cta_click', {
        event_category: 'hero',
        event_label: isPrimary ? 'download_now' : 'watch_demo',
        value: isPrimary ? 79.99 : 0
      });
    }
    
    // Visual feedback
    button.classList.add('hero__cta--clicked');
    setTimeout(() => {
      button.classList.remove('hero__cta--clicked');
    }, 200);
  }
  
  /**
   * Handle CTA hover
   */
  handleCTAHover(e) {
    const button = e.currentTarget;
    button.classList.add('hero__cta--hovered');
    
    setTimeout(() => {
      button.classList.remove('hero__cta--hovered');
    }, 300);
  }
  
  /**
   * Handle action click
   */
  handleActionClick(e) {
    const button = e.currentTarget;
    const action = button.dataset.action;
    
    switch (action) {
      case 'watch-demo':
        this.openDemoModal();
        break;
      case 'scroll-to-features':
        this.scrollToFeatures();
        break;
    }
  }
  
  /**
   * Open demo modal
   */
  openDemoModal() {
    // Create and show demo modal
    const modal = document.createElement('div');
    modal.className = 'demo-modal';
    modal.innerHTML = `
      <div class="demo-modal__backdrop" data-action="close-modal"></div>
      <div class="demo-modal__content">
        <button class="demo-modal__close" data-action="close-modal" aria-label="Close demo">×</button>
        <div class="demo-modal__video">
          <video controls autoplay muted poster="assets/video-poster.jpg">
            <source src="assets/rescuepc-demo.mp4" type="video/mp4">
            <source src="assets/rescuepc-demo.webm" type="video/webm">
            <p>Your browser doesn't support video playback.</p>
          </video>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    modal.classList.add('demo-modal--active');
    
    // Close modal handlers
    modal.querySelectorAll('[data-action="close-modal"]').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.classList.remove('demo-modal--active');
        setTimeout(() => modal.remove(), 300);
      });
    });
    
    // Escape key to close
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        modal.classList.remove('demo-modal--active');
        setTimeout(() => modal.remove(), 300);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }
  
  /**
   * Scroll to features
   */
  scrollToFeatures() {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
  
  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    const focusableElements = this.container.querySelectorAll(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (element.tagName === 'BUTTON') {
            e.preventDefault();
            element.click();
          }
        }
      });
    });
  }
  
  /**
   * Setup accessibility
   */
  setupAccessibility() {
    // Add ARIA labels
    const hero = this.container.querySelector('.hero');
    hero.setAttribute('role', 'banner');
    
    // Add skip link target
    const title = this.container.querySelector('.hero__title');
    title.setAttribute('tabindex', '-1');
    
    // Add live region for dynamic content
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'hero-live-region';
    this.container.appendChild(liveRegion);
    
    // Announce when animations complete
    setTimeout(() => {
      if (this.isVisible) {
        liveRegion.textContent = 'Hero section loaded with download and demo options available';
      }
    }, 2000);
  }
  
  /**
   * Setup performance optimizations
   */
  setupPerformanceOptimizations() {
    // Lazy load background images
    const backgroundElements = this.container.querySelectorAll('.hero__background');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('hero__background--loaded');
          imageObserver.unobserve(entry.target);
        }
      });
    });
    
    backgroundElements.forEach(element => {
      imageObserver.observe(element);
    });
    
    // Preload critical images
    this.preloadCriticalImages();
    
    // Setup reduced motion support
    this.setupReducedMotion();
  }
  
  /**
   * Preload critical images
   */
  preloadCriticalImages() {
    const criticalImages = [
      'assets/RescuePC_GUI.png',
      'assets/hero-bg.jpg'
    ];
    
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }
  
  /**
   * Setup reduced motion support
   */
  setupReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleReducedMotion = (e) => {
      const hero = this.container.querySelector('.hero');
      if (e.matches) {
        hero.classList.add('hero--reduced-motion');
      } else {
        hero.classList.remove('hero--reduced-motion');
      }
    };
    
    handleReducedMotion(prefersReducedMotion);
    prefersReducedMotion.addEventListener('change', handleReducedMotion);
  }
  
  /**
   * Update content
   */
  updateContent(content) {
    const title = this.container.querySelector('.hero__title-main');
    const subtitle = this.container.querySelector('.hero__subtitle');
    
    if (content.title) title.textContent = content.title;
    if (content.subtitle) subtitle.textContent = content.subtitle;
  }
  
  /**
   * Destroy component
   */
  destroy() {
    this.animations.forEach(animation => animation.cancel());
    this.container.innerHTML = '';
  }
}

export default HeroSection; 
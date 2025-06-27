/**
 * PERFECT MOBILE NAVIGATION - ULTIMATE MOBILE EXPERIENCE
 * Enhanced mobile navigation with perfect touch handling, accessibility, and performance
 */

(function() {
  'use strict';

  // Set viewport height variable for mobile devices
  function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  // Initialize on load and on resize
  window.addEventListener('load', setViewportHeight);
  window.addEventListener('resize', setViewportHeight);

  document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const mobileMenuToggle = document.querySelector('.mobile-toggle');
    const mobileNav = document.querySelector('.mobile-menu');
    const mobileNavContainer = document.querySelector('.mobile-nav-container');
    const navOverlay = document.querySelector('.mobile-menu-overlay');
    const body = document.body;
    const html = document.documentElement;
    const navLinks = document.querySelectorAll('.mobile-nav .nav-link');
    const navbar = document.querySelector('.navbar');
    
    // State management
    let isMenuOpen = false;
    let isAnimating = false;
    const ANIMATION_DURATION = 400; // ms
    
    // Handle keyboard navigation in mobile menu
    function handleMenuKeydown(e) {
      if (!isMenuOpen) return;
      
      const focusableElements = mobileNav.querySelectorAll('a[href], button, [tabindex]');
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];
      let focusMoved = false;
      
      // Close menu on Escape key
      if (e.key === 'Escape') {
        closeMenu();
        mobileMenuToggle.focus();
        return;
      }
      
      // Handle tab key navigation
      if (e.key === 'Tab') {
        // If shift + tab on first element, move to last
        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
          focusMoved = true;
        } 
        // If tab on last element, move to first
        else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
          focusMoved = true;
        }
      }
      
      // Trap focus within the menu
      if (!focusMoved && !mobileNav.contains(document.activeElement)) {
        firstFocusable.focus();
      }
    }
    
    // Toggle mobile menu with enhanced animations and focus management
    function toggleMenu(e) {
      if (e) e.preventDefault();
      if (isAnimating) return;
      
      isMenuOpen = !isMenuOpen;
      isAnimating = true;
      
      // Update ARIA attributes
      if (mobileMenuToggle) {
        mobileMenuToggle.setAttribute('aria-expanded', isMenuOpen);
      }
      if (navOverlay) {
        navOverlay.setAttribute('aria-hidden', !isMenuOpen);
      }
      
      // Toggle body scroll
      if (isMenuOpen) {
        body.style.overflow = 'hidden';
        html.style.overflow = 'hidden';
      } else {
        body.style.overflow = '';
        html.style.overflow = '';
      }
      
      // Toggle classes
      if (mobileMenuToggle) {
        mobileMenuToggle.classList.toggle('open', isMenuOpen);
      }
      if (mobileNavContainer) {
        mobileNavContainer.classList.toggle('active', isMenuOpen);
      }
      if (navOverlay) {
        navOverlay.classList.toggle('active', isMenuOpen);
      }
      if (mobileNav) {
        mobileNav.classList.toggle('active', isMenuOpen);
      }
      
      // Animate menu items
      if (isMenuOpen) {
        // Force reflow to ensure the display property is applied
        if (mobileNavContainer) {
          void mobileNavContainer.offsetHeight;
        }
        
        // Add active class with a small delay to trigger the animation
        requestAnimationFrame(() => {
          if (navOverlay) {
            navOverlay.style.display = 'block';
            
            // Force reflow
            void navOverlay.offsetHeight;
            
            // Trigger the overlay fade-in
            requestAnimationFrame(() => {
              navOverlay.style.opacity = '1';
              navOverlay.style.visibility = 'visible';
              
              // Animate menu items in
              animateMenuItemsIn();
            });
          }
        });
      } else {
        // Close menu
        if (navOverlay) {
          navOverlay.style.opacity = '0';
          navOverlay.style.visibility = 'hidden';
        }
        
        // Reset menu items
        const items = document.querySelectorAll('.mobile-nav .nav-item');
        items.forEach(item => {
          item.style.opacity = '0';
          item.style.transform = 'translateX(20px)';
        });
      }
      
      // Reset animation state
      setTimeout(() => {
        if (!isMenuOpen && navOverlay) {
          navOverlay.style.display = 'none';
        }
        isAnimating = false;
      }, ANIMATION_DURATION);
    }
    
    // Animate menu items in
    function animateMenuItemsIn() {
      const items = document.querySelectorAll('.mobile-nav .nav-item');
      items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(20px)';
        item.style.transition = `opacity 0.3s ease ${index * 0.1}s, transform 0.3s ease ${index * 0.1}s`;
        
        // Trigger reflow
        void item.offsetHeight;
        
        // Animate in
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      });
    }
    
    // Close menu when clicking on overlay or a link
    function closeMenu() {
      if (isMenuOpen && !isAnimating) {
        toggleMenu();
      }
    }
    
    // Handle click outside menu
    function handleClickOutside(e) {
      if (isMenuOpen && 
          mobileNavContainer && !mobileNavContainer.contains(e.target) && 
          mobileMenuToggle && !mobileMenuToggle.contains(e.target)) {
        closeMenu();
      }
    }
    
    // Enhanced smooth scroll to section with momentum scrolling and accessibility
    function smoothScroll(targetId, e) {
      if (e) {
        e.preventDefault();
        
        // Update active state for the clicked link
        if (e.currentTarget) {
          const navLinks = document.querySelectorAll('.mobile-nav .nav-link');
          navLinks.forEach(link => {
            link.setAttribute('aria-current', 'false');
            link.classList.remove('active');
          });
          
          const clickedLink = e.currentTarget;
          clickedLink.classList.add('active');
          clickedLink.setAttribute('aria-current', 'page');
          
          // Move focus to the target element for better keyboard navigation
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus({ preventScroll: true });
          }
        }
      }
      
      if (targetId === '#' || !targetId) return;
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      
      const targetPosition = targetElement.offsetTop - 80; // Account for fixed header
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 1000;
      let start = null;
      
      function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      }
      
      function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = easeInOutCubic(timeElapsed / duration);
        window.scrollTo(0, startPosition + distance * run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      }
      
      requestAnimationFrame(animation);
      
      // Close mobile menu after navigation
      if (isMenuOpen) {
        setTimeout(closeMenu, 300);
      }
    }
    
    // Create ripple effect for buttons
    function createRipple(e) {
      const button = e.currentTarget;
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    }
    
    // Enhanced scroll handling with performance optimization
    function handleScroll() {
      const scrollTop = window.pageYOffset;
      const header = document.querySelector('.header');
      
      if (header) {
        // Add scrolled class for styling
        if (scrollTop > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll (optional)
        if (scrollTop > 100 && scrollTop > lastScrollTop) {
          header.classList.add('navbar-hidden');
        } else {
          header.classList.remove('navbar-hidden');
        }
        
        lastScrollTop = scrollTop;
      }
      
      // Update active navigation link
      updateActiveLink();
    }
    
    let lastScrollTop = 0;
    
    // Update active navigation link based on scroll position
    function updateActiveLink() {
      const sections = document.querySelectorAll('section[id]');
      const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
      
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        link.setAttribute('aria-current', 'false');
        
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }
      });
    }
    
    // Handle window resize
    function handleResize() {
      // Close mobile menu on desktop
      if (window.innerWidth >= 1024 && isMenuOpen) {
        closeMenu();
      }
      
      // Update viewport height
      setViewportHeight();
      
      // Recalculate any layout-dependent elements
      updateActiveLink();
    }
    
    // Event listeners
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', toggleMenu);
      mobileMenuToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleMenu();
        }
      });
    }
    
    if (navOverlay) {
      navOverlay.addEventListener('click', closeMenu);
    }
    
    // Mobile navigation links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          smoothScroll(href, e);
        }
      });
      
      // Add ripple effect
      link.addEventListener('click', createRipple);
    });
    
    // Desktop navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          smoothScroll(href, e);
        }
      });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', handleMenuKeydown);
    
    // Close menu on click outside
    document.addEventListener('click', handleClickOutside);
    
    // Handle scroll events with throttling
    let ticking = false;
    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Handle resize events with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 250);
    });
    
    // Initialize
    setViewportHeight();
    updateActiveLink();
    
    // Add touch support for mobile devices
    if ('ontouchstart' in window) {
      // Add touch-specific styles
      document.body.classList.add('touch-device');
      
      // Enhance touch targets
      document.querySelectorAll('.btn, .nav-link, .mobile-nav-link').forEach(element => {
        element.style.minHeight = '44px';
        element.style.minWidth = '44px';
      });
    }
    
    // Performance monitoring
    if (location.hostname === 'localhost') {
      console.log('🚀 Perfect Mobile Navigation Loaded');
      console.log('📱 Touch Device:', 'ontouchstart' in window);
      console.log('🖥️ Screen Size:', window.innerWidth + 'x' + window.innerHeight);
    }
  });
})(); 
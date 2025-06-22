/**
 * RescuePC Repairs - Main JavaScript
 * Optimized for performance and amazing user experience
 */

document.addEventListener('DOMContentLoaded', function() {
  // Remove loading class immediately
  document.body.classList.remove('loading');
  document.documentElement.classList.remove('no-js');
  
  // Ensure scrolling is enabled
  document.body.style.overflowY = 'auto';
  document.documentElement.style.overflowY = 'auto';
  
  // Mobile menu functionality - Enhanced
  const mobileToggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const body = document.body;
  
  if (mobileToggle && nav) {
    console.log('✅ Mobile menu elements found - initializing...');
    console.log('Mobile toggle:', mobileToggle);
    console.log('Nav element:', nav);
    
    // Toggle mobile menu
    mobileToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('🔘 Mobile toggle clicked');
      
      const isActive = nav.classList.contains('active');
      console.log('Menu currently active:', isActive);
      
      if (isActive) {
        // Close menu
        closeMobileMenu();
      } else {
        // Open menu
        openMobileMenu();
      }
    });
    
    // Function to open mobile menu
    function openMobileMenu() {
      nav.classList.add('active');
      mobileToggle.classList.add('active', 'open');
      body.classList.add('mobile-menu-open');
      mobileToggle.setAttribute('aria-expanded', 'true');
      
      // Prevent body scroll when menu is open
      body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      // Focus management for accessibility
      const firstNavLink = nav.querySelector('.nav-link');
      if (firstNavLink) {
        setTimeout(() => firstNavLink.focus(), 100);
      }
      
      console.log('✅ Mobile menu opened - Full screen professional navigation active');
    }
    
    // Function to close mobile menu
    function closeMobileMenu() {
      nav.classList.remove('active');
      mobileToggle.classList.remove('active', 'open');
      body.classList.remove('mobile-menu-open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      
      // Restore body scroll
      body.style.overflow = '';
      document.documentElement.style.overflow = '';
      
      // Return focus to toggle button
      mobileToggle.focus();
      
      console.log('✅ Mobile menu closed');
    }
    
    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        closeMobileMenu();
      });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
      if (nav.classList.contains('active') && 
          !nav.contains(e.target) && 
          !mobileToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });
    
    // Enhanced keyboard navigation for mobile menu
    document.addEventListener('keydown', function(e) {
      if (nav.classList.contains('active')) {
        // Close menu on escape key
        if (e.key === 'Escape') {
          closeMobileMenu();
          return;
        }
        
        // Tab navigation within menu
        const focusableElements = nav.querySelectorAll('.nav-link, .btn');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.key === 'Tab') {
          // If shift + tab on first element, move to last
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
          // If tab on last element, move to first
          else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
    
    // Close mobile menu on window resize
    window.addEventListener('resize', function() {
      if (window.innerWidth > 1024 && nav.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  } else {
    console.log('❌ Mobile toggle or nav not found');
    console.log('Looking for .mobile-toggle:', document.querySelector('.mobile-toggle'));
    console.log('Looking for .nav:', document.querySelector('.nav'));
  }

  // Fallback: Force mobile menu visibility on small screens
  function ensureMobileMenuWorks() {
    const nav = document.querySelector('.nav');
    const mobileToggle = document.querySelector('.mobile-toggle');
    
    if (nav && mobileToggle && window.innerWidth <= 1024) {
      // Force styles for mobile menu
      nav.style.position = 'fixed';
      nav.style.top = '80px';
      nav.style.left = '-100%';
      nav.style.width = '100%';
      nav.style.height = 'calc(100vh - 80px)';
      nav.style.background = 'rgba(255, 255, 255, 0.98)';
      nav.style.zIndex = '999';
      nav.style.display = 'flex';
      nav.style.flexDirection = 'column';
      nav.style.justifyContent = 'flex-start';
      nav.style.alignItems = 'center';
      nav.style.padding = '3rem 1rem';
      nav.style.transition = 'left 0.3s ease';
      
      console.log('✅ Mobile menu styles forced via JavaScript');
    }
  }

  // Run fallback
  ensureMobileMenuWorks();
  
  // Re-run on window resize
  window.addEventListener('resize', ensureMobileMenuWorks);
  
  // Header scroll effect
  const header = document.querySelector('.header');
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
  });
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Performance optimization: Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, observerOptions);
  
  // Observe elements for animation
  document.querySelectorAll('.feature-card, .capability-card, .pricing-card').forEach(el => {
    observer.observe(el);
  });
  
  // Simple FAQ - No interactions needed (now static display)
  function initializeFAQ() {
    const faqSimpleItems = document.querySelectorAll('.faq-simple-item');
    
    if (faqSimpleItems.length === 0) {
      console.log('No simple FAQ items found');
      return;
    }
    
    console.log(`✅ Simple FAQ loaded with ${faqSimpleItems.length} items - all visible`);
  }
  
  // Initialize FAQ (now just for logging)
  initializeFAQ();
  
  // Button hover effects for better UX
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    btn.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
  
  // Form validation and security
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      const inputs = form.querySelectorAll('input[required], textarea[required]');
      let isValid = true;
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('error');
        } else {
          input.classList.remove('error');
        }
      });
      
      if (!isValid) {
        e.preventDefault();
        console.log('Form validation failed');
      }
    });
  });
  
  // Performance monitoring
  if ('performance' in window) {
    window.addEventListener('load', function() {
      setTimeout(function() {
        const perfData = performance.getEntriesByType('navigation')[0];
        const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
        
        if (loadTime > 3000) {
          console.log('⚠️ Page load time:', loadTime + 'ms - Consider optimization');
        } else {
          console.log('✅ Page load time:', loadTime + 'ms - Excellent performance!');
        }
      }, 0);
    });
  }
  
  // Security: Prevent right-click on sensitive elements
  document.querySelectorAll('img, .pricing-card').forEach(element => {
    element.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });
  });
  
  // Lazy loading for images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
});

// Mobile menu styles are now in the main CSS file for better performance

// Error handling
window.addEventListener('error', function(e) {
  console.log('Error caught:', e.error);
});

// Console welcome message
console.log('%c🛠️ RescuePC Repairs - Website Loaded Successfully!', 'color: #2563eb; font-size: 16px; font-weight: bold;');
console.log('%c✅ All systems operational - Ready to help fix Windows PCs!', 'color: #10b981; font-size: 12px;'); 
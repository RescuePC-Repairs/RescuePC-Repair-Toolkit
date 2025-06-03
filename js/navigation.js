// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
  // Add 'loaded' class to body to enable transitions after page load
  // Use requestAnimationFrame to ensure smooth animations
  requestAnimationFrame(() => {
    document.body.classList.add('loaded');
  });
  
  // Stop CTA pulse animation after first interaction
  const ctaButton = document.querySelector('.nav-cta');
  if (ctaButton) {
    const stopPulse = () => {
      ctaButton.classList.add('animated');
      document.removeEventListener('mousemove', stopPulse);
      document.removeEventListener('touchstart', stopPulse);
    };
    
    // Stop pulse animation on first interaction
    document.addEventListener('mousemove', stopPulse, { once: true });
    document.addEventListener('touchstart', stopPulse, { once: true });
    
    // Stop pulse animation after 5 seconds if no interaction
    setTimeout(stopPulse, 5000);
  }
  
  // Add smooth scrolling to the whole document
  document.documentElement.style.scrollBehavior = 'smooth';
  
  // Remove smooth scrolling for users who prefer reduced motion
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery.matches) {
    document.documentElement.style.scrollBehavior = 'auto';
  }
  
  // Listen for changes in the reduced motion preference
  mediaQuery.addEventListener('change', () => {
    document.documentElement.style.scrollBehavior = mediaQuery.matches ? 'auto' : 'smooth';
  });
  // DOM Elements
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');
  const mainNav = document.querySelector('.main-nav');
  const body = document.body;
  
  // Toggle mobile menu with improved accessibility
  if (menuToggle) {
    menuToggle.setAttribute('aria-expanded', 'false');
    
    // Function to close mobile menu
    const closeMobileMenu = () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
      navLinks.setAttribute('aria-hidden', 'true');
      body.classList.remove('no-scroll');
    };
    
    // Function to open mobile menu
    const openMobileMenu = () => {
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.classList.add('active');
      navLinks.classList.add('active');
      navLinks.setAttribute('aria-hidden', 'false');
      body.classList.add('no-scroll');
      
      // Enable animations for menu items
      const menuItems = navLinks.querySelectorAll('li');
      menuItems.forEach(item => item.classList.add('visible'));
      
      // Focus on first nav item when menu opens
      requestAnimationFrame(() => {
        const firstNavItem = navLinks.querySelector('a');
        if (firstNavItem) {
          firstNavItem.focus();
        }
      });
    };
    
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      if (isExpanded) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }
  
  // Close menu when clicking on a nav link
  navItems.forEach(link => {
    link.addEventListener('click', (e) => {
      // Only close menu if it's a hash link on the same page
      if (link.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Close mobile menu if open
          if (menuToggle && menuToggle.classList.contains('active')) {
            closeMobileMenu();
          }
          
          // Smooth scroll to target
          setTimeout(() => {
            const headerHeight = mainNav ? mainNav.offsetHeight : 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
            
            // Update URL without adding to history
            if (history.pushState) {
              history.pushState(null, null, targetId);
            } else {
              location.hash = targetId;
            }
            
            // Focus on target for keyboard navigation
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus();
          }, 100);
        }
      } else if (menuToggle && menuToggle.classList.contains('active')) {
        // For external links, just close the menu
        closeMobileMenu();
      }
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (menuToggle && navLinks && 
        !menuToggle.contains(e.target) && 
        !navLinks.contains(e.target) && 
        navLinks.classList.contains('active')) {
      closeMobileMenu();
    }
  });
  
  // Add touch events for better mobile experience
  let touchStartX = 0;
  let touchEndX = 0;
  
  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const touchDiff = touchStartX - touchEndX;
    
    // Close menu on swipe left from the right edge
    if (touchDiff > 50 && menuToggle && menuToggle.classList.contains('active')) {
      closeMobileMenu();
    }
  }, { passive: true });
  
  // Handle keyboard navigation
  document.addEventListener('keydown', function(e) {
    // Close menu on Escape
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
      closeMobileMenu();
      menuToggle.focus();
    }
    
    // Detect keyboard navigation
    if (e.key === 'Tab') {
      document.documentElement.classList.add('keyboard-nav');
      
      // Trap focus inside mobile menu when open
      if (menuToggle && menuToggle.classList.contains('active')) {
        const focusableElements = navLinks.querySelectorAll('a, button, [tabindex="0"]');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    }
  });
  
  document.addEventListener('mousedown', function() {
    document.documentElement.classList.remove('keyboard-nav');
  });
  
  // Add active class to current section in navigation
  const sections = document.querySelectorAll('section[id]');
  
  function highlightNavigation() {
    if (!sections.length) return;
    
    let scrollY = window.pageYOffset;
    let currentSection = '';
    
    // Find the current section
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });
    
    // Update active states
    navItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }
  
  // Run on scroll and load
  if (sections.length) {
    window.addEventListener('scroll', highlightNavigation);
    highlightNavigation();
  }
  
  // Enhanced smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Calculate the header height for offset
        const headerHeight = mainNav ? mainNav.offsetHeight : 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 10;
        
        // Smooth scroll to target
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without adding to history
        if (history.pushState) {
          history.pushState(null, null, targetId);
        } else {
          location.hash = targetId;
        }
      }
    });
  });
  
  // Handle scroll effects on navigation with debounce
  let lastScrollY = window.scrollY;
  let ticking = false;
  let scrollTimeout;
  const SCROLL_DELAY = 100; // ms
  
  function handleScroll() {
    if (!mainNav) return;
    
    const scrollY = window.scrollY;
    const scrolledClass = 'scrolled';
    const scrollDown = scrollY > lastScrollY && Math.abs(scrollY - lastScrollY) > 5;
    const scrollUp = scrollY < lastScrollY && Math.abs(scrollY - lastScrollY) > 5;
    
    // Update last scroll position
    lastScrollY = scrollY;
    
    // Clear any existing timeout
    clearTimeout(scrollTimeout);
    
    // Only run the effect if we're not already running it
    if (!ticking) {
      window.requestAnimationFrame(() => {
        // Add/remove scrolled class based on scroll position
        if (scrollY > 20) {
          mainNav.classList.add(scrolledClass);
          
          // Hide/show nav on scroll
          if (scrollDown && scrollY > 100) {
            mainNav.style.transform = 'translateY(-100%)';
            mainNav.style.opacity = '0';
            mainNav.style.visibility = 'hidden';
            mainNav.style.transition = 'transform 0.3s ease-out, opacity 0.2s ease, visibility 0.3s';
          } else if (scrollUp) {
            mainNav.style.transform = 'translateY(0)';
            mainNav.style.opacity = '1';
            mainNav.style.visibility = 'visible';
            mainNav.style.transition = 'transform 0.3s ease-out, opacity 0.2s ease, visibility 0.3s';
          }
          
          // Add more blur when scrolled
          mainNav.style.background = 'rgba(15, 23, 42, 0.98)';
          mainNav.style.backdropFilter = 'blur(12px)';
          mainNav.style.webkitBackdropFilter = 'blur(12px)';
          mainNav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.15)';
        } else {
          mainNav.classList.remove(scrolledClass);
          mainNav.style.transform = 'translateY(0)';
          mainNav.style.opacity = '1';
          mainNav.style.visibility = 'visible';
          mainNav.style.background = 'rgba(15, 23, 42, 0.95)';
          mainNav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
        
        ticking = false;
      });
      
      ticking = true;
    }
    
    // Set a timeout to reset transitions after scrolling stops
    scrollTimeout = setTimeout(() => {
      if (mainNav) {
        mainNav.style.transition = 'transform 0.3s ease-out, opacity 0.2s ease, visibility 0.3s, background 0.3s ease, box-shadow 0.3s ease';
      }
    }, SCROLL_DELAY);
  }
  
  // Initial scroll check with a small delay to allow for page load
  setTimeout(() => {
    handleScroll();
  }, 100);
  
  // Listen for scroll events with passive for better performance
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Handle page load with hash in URL
  if (window.location.hash) {
    // Wait for all resources to be loaded
    window.addEventListener('load', () => {
      const targetId = window.location.hash;
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Small delay to ensure smooth scrolling
        setTimeout(() => {
          const headerHeight = mainNav ? mainNav.offsetHeight : 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          // Focus on target for keyboard navigation
          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus();
        }, 300);
      }
    });
  }
  
  // Handle window resize with debounce
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      handleScroll();
      
      // Close mobile menu on resize if viewport becomes desktop
      if (window.innerWidth >= 1024 && menuToggle && menuToggle.classList.contains('active')) {
        closeMobileMenu();
      }
    }, 100);
  });
});

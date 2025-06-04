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
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavContainer = document.querySelector('.mobile-nav-container');
  const navOverlay = document.getElementById('navOverlay');
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
    mobileMenuToggle.setAttribute('aria-expanded', isMenuOpen);
    navOverlay.setAttribute('aria-hidden', !isMenuOpen);
    
    // Toggle body scroll
    if (isMenuOpen) {
      body.style.overflow = 'hidden';
      html.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
      html.style.overflow = '';
    }
    
    // Toggle classes
    mobileMenuToggle.classList.toggle('is-active', isMenuOpen);
    mobileNavContainer.classList.toggle('active', isMenuOpen);
    navOverlay.classList.toggle('active', isMenuOpen);
    
    // Animate menu items
    if (isMenuOpen) {
      // Force reflow to ensure the display property is applied
      void mobileNavContainer.offsetHeight;
      
      // Add active class with a small delay to trigger the animation
      requestAnimationFrame(() => {
        mobileNav.classList.add('active');
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
      });
    } else {
      // Close menu
      mobileNav.classList.remove('active');
      navOverlay.style.opacity = '0';
      navOverlay.style.visibility = 'hidden';
      
      // Reset menu items
      const items = document.querySelectorAll('.mobile-nav .nav-item');
      items.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(20px)';
      });
    }
    
    // Reset animation state
    setTimeout(() => {
      if (!isMenuOpen) {
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
  
  // Close menu function
  function closeMenu() {
    if (isMenuOpen && !isAnimating) {
      toggleMenu();
    }
  }
  
  // Handle click outside menu
  function handleClickOutside(e) {
    if (isMenuOpen && !mobileNavContainer.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
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
    
    // Close mobile menu if open
    if (isMenuOpen) {
      closeMenu();
    }
    
    // Calculate scroll position with header offset
    const headerOffset = 100; // Adjust based on your header height
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    const startPosition = window.pageYOffset;
    const distance = offsetPosition - startPosition;
    let startTime = null;
    const duration = Math.min(Math.max(Math.abs(distance) * 0.5, 300), 1000); // Dynamic duration based on distance
    
    // Easing function for smooth deceleration
    function easeInOutCubic(t) {
      return t < 0.5 
        ? 4 * t * t * t 
        : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
    
    // Animation frame function
    function animation(currentTime) {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);
      
      window.scrollTo(0, startPosition + distance * ease);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        // Ensure we're exactly at the target position
        window.scrollTo(0, offsetPosition);
        
        // Focus the target element for better keyboard navigation
        targetElement.focus({ preventScroll: true });
      }
    }
    
    // Start the animation
    requestAnimationFrame(animation);
    
    // Update URL without page reload
    history.pushState(null, '', targetId);
  }
  
  // Create ripple effect
  function createRipple(e) {
    const btn = this;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    // Remove any existing ripples
    const existingRipple = btn.querySelector('.ripple');
    if (existingRipple) {
      existingRipple.remove();
    }
    
    // Create ripple element
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.width = ripple.style.height = `${size}px`;
    
    // Position the ripple
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    // Add ripple to button
    btn.appendChild(ripple);
    
    // Remove ripple after animation completes
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  }
  
  // Search functionality
  const searchInput = document.querySelector('.mobile-search-input');
  const clearSearchBtn = document.querySelector('.clear-search');
  const navItems = document.querySelectorAll('.mobile-nav .nav-item');
  
  // Toggle clear button visibility
  function toggleClearButton() {
    if (searchInput.value.trim() !== '') {
      clearSearchBtn.style.display = 'flex';
    } else {
      clearSearchBtn.style.display = 'none';
    }
  }
  
  // Filter navigation items based on search query
  function filterNavItems(searchTerm) {
    const searchLower = searchTerm.toLowerCase().trim();
    let hasMatches = false;
    
    navItems.forEach(item => {
      const link = item.querySelector('.nav-link');
      const text = link.textContent.toLowerCase();
      const section = link.getAttribute('data-section') || '';
      
      // Check if search term matches nav item text or data-section
      if (text.includes(searchLower) || section.includes(searchLower)) {
        item.style.display = '';
        item.classList.add('highlight');
        hasMatches = true;
        
        // Animate highlight
        setTimeout(() => {
          item.classList.remove('highlight');
        }, 1000);
      } else {
        item.style.display = 'none';
      }
    });
    
    return hasMatches;
  }
  
  // Clear search and show all items
  function clearSearch() {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    
    navItems.forEach(item => {
      item.style.display = '';
      item.classList.remove('highlight');
    });
    
    // Return focus to search input
    searchInput.focus();
  }
  
  // Event listeners for search
  if (searchInput && clearSearchBtn) {
    searchInput.addEventListener('input', (e) => {
      toggleClearButton();
      filterNavItems(e.target.value);
    });
    
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        clearSearch();
      } else if (e.key === 'Enter') {
        // Focus first visible nav item on Enter
        const firstVisible = document.querySelector('.mobile-nav .nav-item[style*="display: block"]');
        if (firstVisible) {
          firstVisible.querySelector('a').focus();
        }
      }
    });
    
    clearSearchBtn.addEventListener('click', clearSearch);
  }
  
  // Back to Top Button
  const backToTopBtn = document.getElementById('backToTop');
  const SCROLL_THRESHOLD = 300; // Pixels from top to show the button
  let isScrolling = false;
  
  // Show/hide back to top button based on scroll position
  function toggleBackToTop() {
    if (window.pageYOffset > SCROLL_THRESHOLD) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
    isScrolling = false;
  }
  
  // Smooth scroll to top
  function scrollToTop() {
    if (isScrolling) return;
    
    isScrolling = true;
    backToTopBtn.classList.add('active');
    
    const startPosition = window.pageYOffset;
    const targetPosition = 0;
    const distance = targetPosition - startPosition;
    const duration = 800; // ms
    let start = null;
    
    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percentage = Math.min(progress / duration, 1);
      
      // Ease in out quad function for smooth scrolling
      const easeInOutQuad = t => t < 0.5 
        ? 2 * t * t 
        : 1 - Math.pow(-2 * t + 2, 2) / 2;
      
      window.scrollTo(0, startPosition + distance * easeInOutQuad(percentage));
      
      if (progress < duration) {
        window.requestAnimationFrame(step);
      } else {
        isScrolling = false;
        backToTopBtn.classList.remove('active');
      }
    }
    
    window.requestAnimationFrame(step);
  }
  
  // Throttle scroll event for better performance (back to top button)
  let backToTopScrollTimeout;
  function handleScroll() {
    if (!isScrolling) {
      isScrolling = true;
      if (backToTopScrollTimeout) {
        window.cancelAnimationFrame(backToTopScrollTimeout);
      }
      backToTopScrollTimeout = window.requestAnimationFrame(() => {
        toggleBackToTop();
      });
    }
  }
  
  // Main event listeners
  mobileMenuToggle.addEventListener('click', toggleMenu);
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleMenuKeydown);
  window.addEventListener('scroll', handleScroll, { passive: true });
  backToTopBtn.addEventListener('click', scrollToTop);
  
  // Initialize back to top button state
  toggleBackToTop();
  
  // Add click, touch, and keyboard events to nav links
  navLinks.forEach(link => {
    // Ripple effect
    link.addEventListener('mousedown', createRipple);
    link.addEventListener('touchstart', createRipple, { passive: true });
    
    // Smooth scroll on click
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      smoothScroll(targetId, e);
    });
    
    // Handle keyboard activation (Enter/Space)
    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        smoothScroll(targetId, e);
      }
    });
    
    // Prevent context menu on long press
    link.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });
    
    // Improve touch feedback on mobile
    link.addEventListener('touchstart', () => {}, { passive: true });
  });
  
  // Handle focus management when menu opens/closes
  function handleMenuTransitionEnd() {
    if (isMenuOpen) {
      // Set focus to first focusable element in the menu when it opens
      const firstFocusable = mobileNav.querySelector('a[href], button, [tabindex]');
      if (firstFocusable) {
        firstFocusable.focus();
      }
    } else {
      // Return focus to the menu toggle button when menu closes
      mobileMenuToggle.focus();
    }
  }
  
  // Close menu when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMenu();
    }
  });
  
  // Close menu when window is resized to desktop
  function handleResize() {
    if (window.innerWidth > 1024 && isMenuOpen) {
      closeMenu();
    }
  }
  
  // Throttle resize events
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 100);
  });
  
  // Initialize
  mobileNav.style.display = 'none';
  navOverlay.style.display = 'none';
  
  // Set initial ARIA attributes
  mobileMenuToggle.setAttribute('aria-expanded', 'false');
  mobileMenuToggle.setAttribute('aria-controls', 'mobileNav');
  mobileMenuToggle.setAttribute('aria-label', 'Toggle navigation menu');
  navOverlay.setAttribute('aria-hidden', 'true');
  
  // Show mobile nav after styles are applied
  setTimeout(() => {
    mobileNav.style.display = '';
  }, 50);
  
  // Prevent body scroll when menu is open on mobile
  document.body.addEventListener('touchmove', function(e) {
    if (isMenuOpen) {
      e.preventDefault();
    }
  }, { passive: false });
  
  // Update active link on scroll
  function updateActiveLink() {
    const scrollPosition = window.scrollY + 200;
    
    document.querySelectorAll('section[id]').forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  // Throttle scroll events
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveLink, 50);
  });
  
  // Initial update
  updateActiveLink();
});

// Navbar scroll effect
document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.getElementById('navbar');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const navOverlay = document.querySelector('.nav-overlay');
  const navLinks = document.querySelectorAll('.mobile-nav .nav-link');
  const body = document.body;
  let isAnimating = false;
  
  // Navbar scroll effect
  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  
  // Toggle mobile menu
  function toggleMenu(e) {
    if (e) e.stopPropagation();
    if (isAnimating) return;
    
    isAnimating = true;
    const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
    const newState = !isExpanded;
    
    // Update ARIA and state
    mobileMenuToggle.setAttribute('aria-expanded', newState);
    mobileMenuToggle.classList.toggle('is-active', newState);
    mobileNav.classList.toggle('active', newState);
    navOverlay.classList.toggle('active', newState);
    body.classList.toggle('no-scroll', newState);
    
    // Force display properties
    if (newState) {
      mobileNav.style.display = 'flex';
      navOverlay.style.display = 'block';
      // Opening menu - focus first nav item after animation
      setTimeout(() => {
        const firstLink = mobileNav.querySelector('a');
        if (firstLink) firstLink.focus();
      }, 300);
    } else {
      // Closing menu - return focus to toggle button
      mobileMenuToggle.focus();
      // Delay hiding to allow for animation
      setTimeout(() => {
        if (mobileMenuToggle.getAttribute('aria-expanded') === 'false') {
          mobileNav.style.display = 'none';
          navOverlay.style.display = 'none';
        }
      }, 300);
    }
    
    // Reset animation state
    setTimeout(() => {
      isAnimating = false;
    }, 300);
  }
  
  // Close menu function
  function closeMenu() {
    if (mobileMenuToggle.getAttribute('aria-expanded') === 'true') {
      toggleMenu();
    }
  }
  
  // Initialize event listeners
  function initEventListeners() {
    // Toggle menu on button click
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', toggleMenu);
    }
    
    // Close menu on overlay click
    if (navOverlay) {
      navOverlay.addEventListener('click', closeMenu);
    }
    
    // Close menu on nav link click
    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
    
    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
    
    // Close menu on resize to desktop
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth >= 1024) closeMenu();
      }, 250);
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '') return;
        
        e.preventDefault();
        closeMenu();
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const navbarHeight = navbar.offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without adding to history
          if (history.pushState) {
            history.pushState(null, null, targetId);
          } else {
            window.location.hash = targetId;
          }
        }
      });
    });
  }
  
  // Initialize
  function init() {
    // Set initial scroll state
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initialize event listeners
    initEventListeners();
    
    // Set initial state for mobile nav
    if (mobileNav) {
      mobileNav.style.display = 'none';
    }
    if (navOverlay) {
      navOverlay.style.display = 'none';
    }
    if (mobileMenuToggle) {
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
  }
  
  // Initialize everything
  init();
});

// Add focus styles for keyboard navigation
document.addEventListener('keydown', function(e) {
  if (e.key === 'Tab') {
    document.body.classList.add('user-is-tabbing');
    window.removeEventListener('keydown', arguments.callee);
  }
});

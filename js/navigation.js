document.addEventListener('DOMContentLoaded', function() {
  // Cache DOM elements
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const navOverlay = document.querySelector('.nav-overlay');
  const body = document.body;
  const navLinks = document.querySelectorAll('.mobile-nav .nav-link');
  const navbar = document.querySelector('.navbar');
  
  // State management
  let isMenuOpen = false;
  let isAnimating = false;
  const ANIMATION_DURATION = 400; // ms
  
  // Toggle mobile menu with animations
  function toggleMenu() {
    if (isAnimating) return;
    isAnimating = true;
    
    isMenuOpen = !isMenuOpen;
    
    // Toggle body scroll and overlay
    if (isMenuOpen) {
      // Open menu
      body.classList.add('menu-open');
      mobileMenuToggle.setAttribute('aria-expanded', 'true');
      navOverlay.style.display = 'block';
      
      // Force reflow to ensure the display property is applied
      void navOverlay.offsetHeight;
      
      // Add active classes with slight delay for overlay
      setTimeout(() => {
        mobileNav.classList.add('active');
        navOverlay.classList.add('active');
      }, 10);
      
      // Animate in menu items with staggered delay
      document.querySelectorAll('.mobile-nav .nav-item').forEach((item, index) => {
        item.style.setProperty('--i', index);
        item.style.opacity = '0';
        item.style.transform = 'translateX(24px)';
        
        // Trigger reflow
        void item.offsetHeight;
        
        // Animate in
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      });
    } else {
      // Close menu
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('active');
      navOverlay.classList.remove('active');
      
      // Animate out menu items
      document.querySelectorAll('.mobile-nav .nav-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(24px)';
      });
      
      // Remove active classes after animation
      setTimeout(() => {
        body.classList.remove('menu-open');
        navOverlay.style.display = 'none';
      }, ANIMATION_DURATION);
    }
    
    // Reset animation lock
    setTimeout(() => {
      isAnimating = false;
    }, ANIMATION_DURATION);
  }
  
  // Event Listeners
  mobileMenuToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
    toggleMenu();
  });
  
  // Close menu when clicking on overlay or nav links
  navOverlay.addEventListener('click', toggleMenu);
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      if (isMenuOpen) {
        // Add active state to clicked link
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        // Close menu after a small delay for better UX
        setTimeout(toggleMenu, 100);
      }
    });
  });
  
  // Close menu with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isMenuOpen) {
      toggleMenu();
    }
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // If mobile menu is open, close it first
        if (isMenuOpen) {
          toggleMenu();
          // Wait for menu to close before scrolling
          setTimeout(() => {
            scrollToTarget(targetElement);
          }, ANIMATION_DURATION + 50);
        } else {
          scrollToTarget(targetElement);
        }
      }
    });
  });
  
  // Smooth scroll to target element with offset
  function scrollToTarget(element) {
    const headerOffset = navbar.offsetHeight;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset - 20;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
  
  // Set active navigation link based on scroll position
  function setActiveNavLink() {
    const scrollPosition = window.scrollY + 100;
    
    document.querySelectorAll('section[id]').forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Update both desktop and mobile nav links
        document.querySelectorAll(`.nav-link[href="#${sectionId}"]`).forEach(link => {
          if (!link.classList.contains('active')) {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  // Navbar scroll effects
  let lastScroll = 0;
  const SCROLL_THRESHOLD = 10;
  
  function handleScroll() {
    const currentScroll = window.pageYOffset;
    
    // Always show navbar at the top of the page
    if (currentScroll <= 0) {
      navbar.classList.remove('scrolled-up');
      navbar.classList.remove('scrolled');
      return;
    }
    
    // Add shadow when scrolled
    navbar.classList.add('scrolled');
    
    // Hide/show navbar on scroll direction
    if (currentScroll > lastScroll + SCROLL_THRESHOLD) {
      // Scrolling down
      navbar.classList.remove('scrolled-up');
      navbar.classList.add('scrolled-down');
    } else if (currentScroll < lastScroll - SCROLL_THRESHOLD) {
      // Scrolling up
      navbar.classList.remove('scrolled-down');
      navbar.classList.add('scrolled-up');
    }
    
    lastScroll = currentScroll;
  }
  
  // Throttle scroll events for better performance
  let isScrolling;
  window.addEventListener('scroll', function() {
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(function() {
      handleScroll();
      setActiveNavLink();
    }, 20);
  }, { passive: true });
  
  // Initialize
  setActiveNavLink();
  handleScroll();
  
  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // Close menu if window is resized to desktop
      if (window.innerWidth > 1024 && isMenuOpen) {
        toggleMenu();
      }
    }, 250);
  });
});

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
  
  // Navigation functionality with smooth scrolling and active section highlighting
  const navLinksAll = document.querySelectorAll('.navbar-nav .nav-link, .mobile-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');
  
  // Smooth scrolling for anchor links
  navLinksAll.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 100; // Adjust based on your header height
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        if (mobileNav && mobileNav.classList.contains('active')) {
          mobileNav.classList.remove('active');
          document.body.style.overflow = '';
          mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Highlight active section in navigation
  function highlightActiveSection() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (pageYOffset >= (sectionTop - 200)) {
        current = '#' + section.getAttribute('id');
      }
    });

    navLinksAll.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === current) {
        link.classList.add('active');
      }
    });
  }

  // Add scroll event listener
  window.addEventListener('scroll', highlightActiveSection);
  
  // Initial call to set active state on page load
  highlightActiveSection();
  
  // Toggle mobile menu with animations
  function toggleMenu(e) {
    if (e) e.stopPropagation();
    if (isAnimating) return;
    isAnimating = true;
    
    isMenuOpen = !isMenuOpen;
    
    // Update ARIA and state
    mobileMenuToggle.setAttribute('aria-expanded', isMenuOpen);
    mobileMenuToggle.classList.toggle('is-active', isMenuOpen);
    
    if (isMenuOpen) {
      // Open menu
      body.classList.add('menu-open');
      navOverlay.style.display = 'block';
      mobileNav.style.display = 'flex'; // Ensure flex display for proper layout
      
      // Force reflow to ensure the display property is applied
      void navOverlay.offsetHeight;
      
      // Add active classes with slight delay for overlay
      requestAnimationFrame(() => {
        mobileNav.classList.add('active');
        navOverlay.classList.add('active');
      });
      
      // Focus management for accessibility
      setTimeout(() => {
        const firstLink = mobileNav.querySelector('a');
        if (firstLink) firstLink.focus();
      }, 100);
      
    } else {
      // Close menu
      mobileNav.classList.remove('active');
      navOverlay.classList.remove('active');
      body.classList.remove('menu-open');
      
      // Return focus to toggle button
      setTimeout(() => {
        mobileMenuToggle.focus();
        
        // Hide elements after animation
        if (!mobileNav.classList.contains('active')) {
          mobileNav.style.display = 'none';
          navOverlay.style.display = 'none';
        }
      }, 300);
    }
    
    // Reset animation lock
    setTimeout(() => {
      isAnimating = false;
    }, 300);
  }
  
  // Event Listeners
  mobileMenuToggle.addEventListener('click', toggleMenu);
  
  // Close menu when clicking on overlay
  navOverlay.addEventListener('click', function(e) {
    if (isMenuOpen) {
      toggleMenu(e);
    }
  });
  
  // Close menu when clicking on nav links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      if (isMenuOpen) {
        toggleMenu(e);
      }
    });
  });
  
  // Close menu when pressing Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isMenuOpen) {
      e.preventDefault();
      toggleMenu(e);
    }
  });
  
  // Close menu when window is resized to desktop
  function handleResize() {
    if (window.innerWidth > 992 && isMenuOpen) {
      toggleMenu();
    } else {
      // Reset mobile nav display property on larger screens
      if (window.innerWidth > 992) {
        mobileNav.style.display = 'none';
        navOverlay.style.display = 'none';
        body.classList.remove('menu-open');
      }
    }
  }
  
  // Throttle resize events
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 100);
  });
  
  // Initial setup
  if (window.innerWidth <= 992) {
    mobileNav.style.display = 'none';
    navOverlay.style.display = 'none';
  }
  
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

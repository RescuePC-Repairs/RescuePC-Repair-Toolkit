// Modern Navbar Implementation
document.addEventListener('DOMContentLoaded', function() {
  // Create and inject navbar HTML
  const navbarHTML = `
    <nav class="navbar">
      <div class="navbar-container">
        <a href="index.html" class="navbar-brand">
          <img src="assets/RescuePC_Logo_Light.png" alt="RescuePC Repairs Logo" class="navbar-logo">
        </a>
        
        <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-expanded="false" aria-label="Toggle navigation menu">
          <span class="hamburger">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </span>
        </button>

        <div class="nav-overlay"></div>
        
        <ul class="navbar-nav" id="mobileNav">
          <li class="nav-item"><a href="index.html" class="nav-link"><i class="fas fa-home"></i>Home</a></li>
          <li class="nav-item"><a href="index.html#features" class="nav-link"><i class="fas fa-star"></i>Features</a></li>
          <li class="nav-item"><a href="index.html#demo" class="nav-link"><i class="fas fa-play-circle"></i>Demo</a></li>
          <li class="nav-item"><a href="support.html" class="nav-link"><i class="fas fa-headset"></i>Support</a></li>
          <li class="nav-item"><a href="Knowledge-Base.html" class="nav-link"><i class="fas fa-book"></i>Knowledge Base</a></li>
          <li class="nav-item"><a href="https://discord.gg/VgWkPazd" class="nav-link"><i class="fab fa-discord"></i>Join Discord</a></li>
          <li class="nav-item">
            <div class="stripe-button-container">
              <stripe-buy-button
                buy-button-id="buy_btn_1Q2w3e4r5t6y7u8i9o0p"
                publishable-key="pk_live_51Q2w3e4r5t6y7u8i9o0p"
              >
              </stripe-buy-button>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  `;

  // Insert navbar at the beginning of the body
  document.body.insertAdjacentHTML('afterbegin', navbarHTML);

  // Elements
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const navOverlay = document.querySelector('.nav-overlay');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const body = document.body;

  // Toggle mobile menu
  function toggleMenu() {
    const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
    mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
    mobileMenuToggle.classList.toggle('is-active');
    mobileNav.classList.toggle('active');
    navOverlay.classList.toggle('active');
    body.classList.toggle('menu-open');

    // Animate menu items
    const navItems = mobileNav.querySelectorAll('.nav-item');
    navItems.forEach((item, index) => {
      item.style.animationDelay = `${0.1 + (index * 0.05)}s`;
    });
  }

  // Close mobile menu
  function closeMenu() {
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenuToggle.classList.remove('is-active');
    mobileNav.classList.remove('active');
    navOverlay.classList.remove('active');
    body.classList.remove('menu-open');
  }

  // Event Listeners
  mobileMenuToggle.addEventListener('click', toggleMenu);
  navOverlay.addEventListener('click', closeMenu);
  
  // Close menu when clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
      // Smooth scroll to section if it's an anchor link
      const href = link.getAttribute('href');
      if (href.startsWith('#') && href.length > 1) {
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
      closeMenu();
    }
  });

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= 1024 && mobileNav.classList.contains('active')) {
        closeMenu();
      }
    }, 250);
  });

  // Handle scroll
  let lastScroll = 0;
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
      navbar.classList.remove('scrolled');
      return;
    }
    
    if (currentScroll > lastScroll && !mobileNav.classList.contains('active')) {
      // Scrolling down
      navbar.classList.add('hidden');
    } else {
      // Scrolling up
      navbar.classList.remove('hidden');
    }
    
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
});

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
  if (e.key === 'Tab') {
    document.body.classList.add('user-is-tabbing');
    window.removeEventListener('keydown', arguments.callee);
  }
});

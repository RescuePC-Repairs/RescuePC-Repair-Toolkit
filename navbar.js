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
            <a href="https://buy.stripe.com/9B614m53s8i97y110j08g00" class="nav-link nav-cta" target="_blank" rel="noopener noreferrer">
              <i class="fas fa-bolt"></i>
              <span>Buy Now</span>
            </a>
          </li>
        </ul>

        <!-- Desktop Buy Button -->
        <a href="https://buy.stripe.com/9B614m53s8i97y110j08g00" class="nav-link nav-cta desktop-only" target="_blank" rel="noopener noreferrer">
          <i class="fas fa-bolt"></i>
          <span>Buy Now</span>
        </a>
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

  const socialLinks = [
    { icon: 'fab fa-tiktok', url: 'https://www.tiktok.com/@rescuepcrepairs', label: 'TikTok' },
    { icon: 'fab fa-youtube', url: 'https://www.youtube.com/@RescuePC-Repairs', label: 'YouTube' },
    { icon: 'fab fa-twitch', url: 'https://www.twitch.tv/rescuepc_repairs', label: 'Twitch' },
    { icon: 'fab fa-twitter', url: 'https://x.com/RescuePCRepair', label: 'Twitter' },
    { icon: 'fas fa-gamepad', url: 'https://kick.com/rescuepc-repairs', label: 'Kick' }
  ];
});

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
  if (e.key === 'Tab') {
    document.body.classList.add('user-is-tabbing');
    window.removeEventListener('keydown', arguments.callee);
  }
});

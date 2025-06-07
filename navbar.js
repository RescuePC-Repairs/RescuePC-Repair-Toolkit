// Modern Navbar Implementation
document.addEventListener('DOMContentLoaded', function() {
  // Create and inject navbar HTML
  const navbarHTML = `
    <nav class="navbar">
      <div class="navbar-container">
        <a href="index.html" class="navbar-brand">
          <img src="assets/RescuePC_Logo_Light.png" alt="RescuePC Repairs Logo" class="navbar-logo">
        </a>
        
        <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-expanded="false">
          <span class="hamburger">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </span>
        </button>

        <div class="nav-overlay"></div>
        
        <ul class="navbar-nav" id="mobileNav">
          <li><a href="index.html" class="nav-link">Home</a></li>
          <li><a href="index.html#features" class="nav-link">Features</a></li>
          <li><a href="index.html#demo" class="nav-link">Demo</a></li>
          <li><a href="support.html" class="nav-link"><i class="fas fa-headset mr-2"></i>Support</a></li>
          <li><a href="Knowledge-Base.html" class="nav-link">Knowledge Base</a></li>
          <li><a href="join-discord.html" class="nav-link">Join Discord</a></li>
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

  // Toggle mobile menu
  function toggleMenu() {
    mobileMenuToggle.setAttribute('aria-expanded', 
      mobileMenuToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
    );
    mobileMenuToggle.classList.toggle('is-active');
    mobileNav.classList.toggle('active');
    navOverlay.classList.toggle('active');
  }

  // Close mobile menu
  function closeMenu() {
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenuToggle.classList.remove('is-active');
    mobileNav.classList.remove('active');
    navOverlay.classList.remove('active');
  }

  // Event Listeners
  mobileMenuToggle.addEventListener('click', toggleMenu);
  navOverlay.addEventListener('click', closeMenu);
  
  // Close menu when clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
      closeMenu();
    }
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && mobileNav.classList.contains('active')) {
      closeMenu();
    }
  });
});

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
  if (e.key === 'Tab') {
    document.body.classList.add('user-is-tabbing');
    window.removeEventListener('keydown', arguments.callee);
  }
});

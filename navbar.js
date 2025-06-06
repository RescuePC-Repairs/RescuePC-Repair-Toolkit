// Modern Navbar Implementation
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const navOverlay = document.querySelector('.nav-overlay');
  const navLinks = document.querySelectorAll('.mobile-nav .nav-link');

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

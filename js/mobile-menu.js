document.addEventListener('DOMContentLoaded', function() {
  // Get elements
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navbarNav = document.querySelector('.navbar-nav');
  const navOverlay = document.querySelector('.nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Toggle mobile menu
  function toggleMenu() {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    navbarNav.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  }
  
  // Close menu when clicking on a nav link
  function closeMenu() {
    menuToggle.setAttribute('aria-expanded', 'false');
    navbarNav.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // Event listeners
  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }
  
  if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
  }
  
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  // Close menu when pressing Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navbarNav.classList.contains('active')) {
      closeMenu();
    }
  });
});

// main.js – RescuePC Repairs USB Toolkit Frontend Enhancements

document.addEventListener('DOMContentLoaded', () => {

  // ===== Smooth scrolling for anchor links =====
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          const targetSelector = this.getAttribute('href');
          const target = document.querySelector(targetSelector);
          if (target) {
              e.preventDefault();
              target.scrollIntoView({ behavior: 'smooth' });
          }
      });
  });

  // ===== Button hover animations for CTA buttons =====
  const buyButtons = document.querySelectorAll('.btn-primary, .btn-primary-large');
  buyButtons.forEach(button => {
      button.addEventListener('mouseenter', () => {
          button.style.transform = 'scale(1.05)';
          button.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
      });

      button.addEventListener('mouseleave', () => {
          button.style.transform = 'scale(1)';
          button.style.boxShadow = 'none';
      });
  });

  // ===== Fade-in effects for all major sections =====
  const sections = document.querySelectorAll('section');
  const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -80px 0px'
  };

  const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('fade-in');
              observer.unobserve(entry.target); // Run only once per section
          }
      });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // ===== Mobile responsiveness class toggle =====
  let resizeTimeout;

  function handleResize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
          if (window.innerWidth < 768) {
              document.body.classList.add('mobile');
          } else {
              document.body.classList.remove('mobile');
          }
      }, 100); // Debounced for performance
  }

  window.addEventListener('resize', handleResize);
  handleResize(); // Initial check on load

  // ===== Mobile nav toggle =====
  const toggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
      toggle.addEventListener('click', () => {
          navLinks.classList.toggle('active');
      });
  }

  // ===== Nav hide on scroll =====
  let lastScroll = 0;
  const nav = document.querySelector('.main-nav');

  if (nav) {
      window.addEventListener('scroll', () => {
          const currentScroll = window.pageYOffset;
          if (currentScroll <= 0) {
              nav.classList.remove('hide-nav');
              return;
          }
          if (currentScroll > lastScroll) {
              nav.classList.add('hide-nav');
          } else {
              nav.classList.remove('hide-nav');
          }
          lastScroll = currentScroll;
      });
  }

  // ===== Easter egg for devs =====
  console.log('%cRescuePC Repais USB Toolkit ✨', 'font-size: 18px; color: #6772e5; font-weight: bold;');
  console.log('%cBuilt by Tyler Keesee for real PC repair heroes.', 'font-size: 14px; color: #333;');
  console.log('%cSecure. Offline. Yours.', 'font-size: 12px; color: gray;');

});

// main.js – RescuePC Repairs USB Toolkit Frontend Enhancements

document.addEventListener('DOMContentLoaded', () => {
  // ===== Smooth scrolling for anchor links =====
  // Selects all anchor links that start with '#'
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  // Adds a click event listener to each selected anchor link
  anchorLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetSelector = this.getAttribute('href'); // Get the hash, e.g., "#features"
      const target = document.querySelector(targetSelector); // Find the element with that ID
      if (target) {
        e.preventDefault(); // Prevent the default jump behavior
        // Smoothly scroll to the target element
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ===== Button hover animations for CTA buttons =====
  // Selects elements with the classes 'btn-primary' or 'btn-primary-large'
  const buyButtons = document.querySelectorAll('.btn-primary, .btn-primary-large');
  // Adds mouseenter and mouseleave event listeners for hover effects
  buyButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      // Apply scale and box-shadow on hover
      button.style.transform = 'scale(1.05)';
      button.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
      // Add transition for smooth effect (assuming transition is defined in CSS)
      button.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    });

    button.addEventListener('mouseleave', () => {
      // Revert scale and box-shadow on mouse leave
      button.style.transform = 'scale(1)';
      button.style.boxShadow = 'none';
      button.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    });
  });

  // ===== Fade-in effects for major sections =====
  // Selects all section elements
  const sections = document.querySelectorAll('section');
  // Configure the Intersection Observer
  const observerOptions = {
    threshold: 0.2, // Trigger when 20% of the section is visible
    rootMargin: '0px 0px -80px 0px' // Shrink the bottom of the viewport by 80px
  };

  // Create an Intersection Observer instance
  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // If the section is visible, add the 'fade-in' class
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target); // Stop observing once it has faded in
      }
    });
  }, observerOptions);

  // Observe each section
  sections.forEach(section => sectionObserver.observe(section));

  // ===== Mobile responsiveness class toggle =====
  // Timeout variable to debounce the resize event
  let resizeTimeout;

  // Function to handle window resize
  function handleResize() {
    clearTimeout(resizeTimeout); // Clear any existing timeout
    resizeTimeout = setTimeout(() => {
      // Add or remove 'mobile' class based on window width
      if (window.innerWidth < 768) { // Assuming 768px is the mobile breakpoint
        document.body.classList.add('mobile');
      } else {
        document.body.classList.remove('mobile');
      }
    }, 100); // Wait 100ms after resizing stops before executing
  }

  // Add event listener for window resize
  window.addEventListener('resize', handleResize);
  handleResize(); // Call immediately on load

  // ===== Mobile nav toggle (hamburger menu) =====
  // Select the toggle button and the navigation links
  const toggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  // Check if both elements exist before adding listener
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      // Toggle the 'active' class on navigation links to show/hide menu
      navLinks.classList.toggle('active');
      // Optional: Toggle an active class on the toggle button itself for styling
      toggle.classList.toggle('is-active');
    });
     // Optional: Hide mobile menu when a link is clicked (for single-page apps)
     navLinks.querySelectorAll('a').forEach(link => {
         link.addEventListener('click', () => {
             if (navLinks.classList.contains('active')) {
                 navLinks.classList.remove('active');
                 toggle.classList.remove('is-active');
             }
         });
     });
  }


  // ===== Nav hide on scroll (auto-hide top nav) =====
  // Variable to store the last known scroll position
  let lastScroll = 0;
  // Select the main navigation element
  const nav = document.querySelector('.main-nav');

  // Check if the nav element exists before adding listener
  if (nav) {
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset; // Get current vertical scroll position

      // If scrolling up or at the very top, show the nav
      if (currentScroll <= 0 || currentScroll < lastScroll) {
        nav.classList.remove('hide-nav');
      }
      // If scrolling down and not at the top, hide the nav
      else if (currentScroll > lastScroll) {
         // Add a small buffer (e.g., 50px) before hiding to avoid flicker
         if (currentScroll > 50) {
           nav.classList.add('hide-nav');
         }
      }

      lastScroll = currentScroll; // Update the last scroll position
    });
  }


  // ===== Console Easter Egg for Devs =====
  // Logs messages to the browser console with custom styling
  console.log('%cRescuePC Repairs USB Toolkit ✨', 'font-size: 18px; color: #6772e5; font-weight: bold;');
  console.log('%cBuilt by Tyler Keesee for real PC repair heroes.', 'font-size: 14px; color: #333;');
  console.log('%cSecure. Offline. Yours.', 'font-size: 12px; color: gray;');
});
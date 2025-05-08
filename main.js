// main.js – RescuePC Repairs USB Toolkit Frontend Enhancements

document.addEventListener('DOMContentLoaded', () => {
  // PDF link handling for better mobile experience
  const pdfLinks = document.querySelectorAll('a[href$=".pdf"]')
  
  pdfLinks.forEach(link => {
    // Remove any existing click event listeners to avoid conflicts
    const newLink = link.cloneNode(true);
    link.parentNode.replaceChild(newLink, link);
    
    newLink.addEventListener('click', (e) => {
      // Get the correct relative path to the PDF
      const pdfUrl = newLink.getAttribute('href');
      
      // Check if it's a mobile device
      const isMobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        e.preventDefault();
        
        // For mobile devices, try to open in a new tab first
        const newWindow = window.open(pdfUrl, '_blank');
        
        // If opening in a new tab was blocked or failed, try download approach
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          const tempLink = document.createElement('a');
          tempLink.href = pdfUrl;
          tempLink.setAttribute('download', pdfUrl.split('/').pop());
          tempLink.style.display = 'none';
          document.body.appendChild(tempLink);
          tempLink.click();
          
          // Clean up
          setTimeout(() => {
            document.body.removeChild(tempLink);
          }, 100);
        }
        
        return false;
      }
      
      // For desktop, open in new tab as normal
      newLink.setAttribute('target', '_blank');
      
      // Track PDF views if analytics is available
      if (typeof gtag === 'function') {
        gtag('event', 'view_item', {
          'event_category': 'Resource',
          'event_label': 'Product Flyer'
        });
      }
    });
  });
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
  const toggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      toggle.classList.toggle('is-active');
    });
   
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

  // ===== Parallax scrolling effect for hero section =====
  const hero = document.querySelector('.hero');
  
  window.addEventListener('scroll', () => {
    if (hero) {
      const scrollPosition = window.pageYOffset;
      hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
    }
  });
  
  // ===== Animated counter for statistics =====
  const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
      start += increment;
      if (start < target) {
        element.textContent = Math.floor(start);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };
    
    updateCounter();
  };
  
  // Apply to any counter elements when they come into view
  const counters = document.querySelectorAll('.counter-value');
  
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-target'), 10);
          animateCounter(entry.target, target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
  }
  
  // ===== Typed.js effect for dynamic text =====
  // Note: Would require adding Typed.js library
  const typedElement = document.querySelector('.typed-text');
  if (typedElement && typeof Typed !== 'undefined') {
    new Typed(typedElement, {
      strings: [
        'Fix network issues instantly.',
        'Restore missing audio drivers.',
        'Remove malware without internet.',
        'Boost system performance.',
        'All from a simple USB drive.'
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      loop: true
    });
  }
  
  // ===== Dark/Light mode toggle =====
  const darkModeToggle = document.querySelector('.dark-mode-toggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      
      // Save preference to localStorage
      const isDarkMode = !document.body.classList.contains('light-mode');
      localStorage.setItem('darkMode', isDarkMode);
      
      // Update toggle icon
      const icon = darkModeToggle.querySelector('i');
      if (icon) {
        icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
      }
    });
    
    // Check for saved preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'false') {
      document.body.classList.add('light-mode');
      const icon = darkModeToggle.querySelector('i');
      if (icon) icon.className = 'fas fa-moon';
    }
  }
  
  // ===== Image lazy loading with blur-up effect =====
  const lazyImages = document.querySelectorAll('.lazy-image');
  
  if ('IntersectionObserver' in window && lazyImages.length > 0) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          
          if (src) {
            img.src = src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }
  
  // ===== Ensure comparison table is properly displayed =====
  const comparisonTable = document.querySelector('.comparison-table');
  if (comparisonTable) {
    // Check if table is wider than its container
    const tableWrapper = comparisonTable.closest('.comparison-table-wrapper');
    if (tableWrapper && comparisonTable.offsetWidth > tableWrapper.offsetWidth) {
      // Add a subtle indicator that the table can be scrolled horizontally on mobile
      const scrollIndicator = document.createElement('div');
      scrollIndicator.className = 'table-scroll-hint';
      scrollIndicator.innerHTML = '<span>Swipe to see more →</span>';
      scrollIndicator.style.textAlign = 'center';
      scrollIndicator.style.fontSize = '0.8rem';
      scrollIndicator.style.color = 'var(--text-muted)';
      scrollIndicator.style.padding = '0.5rem 0';
      scrollIndicator.style.display = 'none';
      
      // Only show on mobile
      if (window.innerWidth < 768) {
        scrollIndicator.style.display = 'block';
      }
      
      // Insert before the table wrapper
      tableWrapper.parentNode.insertBefore(scrollIndicator, tableWrapper);
      
      // Hide the indicator after the user has scrolled the table
      tableWrapper.addEventListener('scroll', () => {
        if (scrollIndicator.style.display === 'block') {
          scrollIndicator.style.opacity = '0';
          setTimeout(() => {
            scrollIndicator.style.display = 'none';
          }, 300);
        }
      }, { once: true });
    }
  }

  // ===== Timeline animation =====
  const timelineItems = document.querySelectorAll('.timeline-item');

  if (timelineItems.length > 0) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-timeline');
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    timelineItems.forEach((item, index) => {
      // Add a staggered animation delay
      item.style.transitionDelay = `${index * 0.2}s`;
      timelineObserver.observe(item);
    });
  }
});
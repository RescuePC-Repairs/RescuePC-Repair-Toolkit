// main.js – RescuePC Repairs USB Toolkit Frontend Enhancements

// Theme Toggle Functionality
const initThemeToggle = () => {
  const themeToggle = document.querySelector('.theme-toggle');
  if (!themeToggle) return;
  
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const currentTheme = localStorage.getItem('theme') || 'system';
  
  // Set initial theme
  const setTheme = (theme) => {
    document.documentElement.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      document.documentElement.classList.toggle('dark', prefersDarkScheme.matches);
    } else {
      document.documentElement.classList.add(theme);
    }
    
    // Update button aria-label
    const isDark = document.documentElement.classList.contains('dark');
    themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
    themeToggle.setAttribute('title', `Switch to ${isDark ? 'light' : 'dark'} mode`);
    
    // Save preference
    localStorage.setItem('theme', theme);
  };
  
  // Toggle between light/dark
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
  };
  
  // Listen for system theme changes
  prefersDarkScheme.addEventListener('change', (e) => {
    if (localStorage.getItem('theme') === 'system') {
      setTheme('system');
    }
  });
  
  // Initialize theme
  setTheme(currentTheme);
  
  // Add click event
  themeToggle.addEventListener('click', toggleTheme);
  
  // Add keyboard navigation
  themeToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTheme();
    }
  });
};

// Cookie Consent Banner
function createCookieBanner() {
  if (!localStorage.getItem('cookieConsent')) {
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.innerHTML = `
      <div class="cookie-content">
        <p>We use cookies to enhance your experience. By continuing to visit this site, you agree to our use of cookies.</p>
        <div class="cookie-buttons">
          <button id="accept-cookies" class="cookie-btn accept">Accept</button>
          <button id="reject-cookies" class="cookie-btn reject">Reject</button>
          <a href="CookiePolicy.html" class="cookie-link">Learn more</a>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    document.getElementById('accept-cookies').addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      banner.remove();
    });

    document.getElementById('reject-cookies').addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'rejected');
      banner.remove();
    });
  }
}

// Add cookie consent styles
const style = document.createElement('style');
style.textContent = `
  #cookie-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(15, 23, 42, 0.95);
    color: #e2e8f0;
    padding: 1rem;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    backdrop-filter: blur(10px);
  }
  
  .cookie-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
  }
  
  .cookie-content p {
    margin: 0;
    flex: 1;
    min-width: 200px;
  }
  
  .cookie-buttons {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }
  
  .cookie-btn {
    padding: 0.5rem 1.25rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
  }
  
  .accept {
    background: #3b82f6;
    color: white;
  }
  
  .reject {
    background: transparent;
    color: #94a3b8;
    border: 1px solid #94a3b8;
  }
  
  .cookie-link {
    color: #60a5fa;
    text-decoration: none;
    white-space: nowrap;
  }
  
  .cookie-link:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 640px) {
    .cookie-content {
      flex-direction: column;
      text-align: center;
    }
    
    .cookie-buttons {
      width: 100%;
      justify-content: center;
    }
  }
`;
document.head.appendChild(style);

/**
 * Advanced Lazy Loading with Priority
 * - IntersectionObserver for viewport detection
 * - requestIdleCallback for non-critical loading
 * - Data attributes for responsive images
 * - Blur-up technique for smooth loading
 */

class AdvancedLazyLoader {
  constructor() {
    this.observer = null;
    this.config = {
      rootMargin: '200px 0px',
      threshold: 0.01,
      useNativeLazyLoading: 'loading' in HTMLImageElement.prototype,
      useNativeIntersectionObserver: 'IntersectionObserver' in window,
      useIdleCallback: 'requestIdleCallback' in window
    };
    this.observedElements = new Set();
    this.pendingElements = [];
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;
    
    // Setup observer if supported
    if (this.config.useNativeIntersectionObserver) {
      this.setupObserver();
    } else {
      this.loadAllNonLazy();
    }
    
    // Load low priority images during idle time
    if (this.config.useIdleCallback) {
      requestIdleCallback(() => this.loadLowPriorityImages(), { timeout: 2000 });
    }
    
    // Handle dynamic content
    this.setupMutationObserver();
  }
  
  setupObserver() {
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          this.loadElement(element);
          this.observer.unobserve(element);
          this.observedElements.delete(element);
        }
      });
    }, {
      rootMargin: this.config.rootMargin,
      threshold: this.config.threshold
    });
    
    // Observe all lazy elements
    document.querySelectorAll('[data-lazy-src], [data-srcset]').forEach(el => {
      this.observeElement(el);
    });
  }
  
  observeElement(element) {
    if (!this.observedElements.has(element)) {
      this.observedElements.add(element);
      if (this.observer) {
        this.observer.observe(element);
      } else {
        this.pendingElements.push(element);
      }
    }
  }
  
  loadElement(element) {
    // Handle different element types
    if (element.tagName === 'IMG') {
      this.loadImage(element);
    } else if (element.tagName === 'IFRAME') {
      this.loadIframe(element);
    } else if (element.tagName === 'VIDEO' || element.tagName === 'AUDIO') {
      this.loadMedia(element);
    } else if (element.hasAttribute('data-bg')) {
      this.loadBackground(element);
    }
    
    // Remove lazy attributes
    element.removeAttribute('data-lazy-src');
    element.removeAttribute('data-srcset');
    element.classList.remove('lazy');
  }
  
  loadImage(img) {
    // Skip if already loaded
    if (img.getAttribute('data-loaded') === 'true') return;
    
    // Load src and srcset
    const src = img.getAttribute('data-src');
    const srcset = img.getAttribute('data-srcset');
    
    if (src) {
      // Use requestAnimationFrame to avoid blocking the main thread
      requestAnimationFrame(() => {
        img.src = src;
        if (srcset) img.srcset = srcset;
        
        // Handle loading state
        img.onload = () => {
          img.setAttribute('data-loaded', 'true');
          img.classList.add('lazy-loaded');
          
          // Remove blur effect if using blur-up technique
          if (img.classList.contains('lazy-blur')) {
            img.style.filter = 'blur(0)';
            img.style.transition = 'filter 0.5s ease-out';
            
            // Remove the transition after it completes
            setTimeout(() => {
              img.style.transition = '';
            }, 500);
          }
        };
        
        // Handle errors
        img.onerror = () => {
          console.warn('Failed to load image:', src);
          img.classList.add('lazy-error');
        };
      });
    }
  }
  
  loadIframe(iframe) {
    const src = iframe.getAttribute('data-src');
    if (src) {
      iframe.src = src;
    }
  }
  
  loadMedia(media) {
    const src = media.getAttribute('data-src');
    if (src) {
      media.src = src;
      media.load();
    }
  }
  
  loadBackground(element) {
    const bgUrl = element.getAttribute('data-bg');
    if (bgUrl) {
      element.style.backgroundImage = `url(${bgUrl})`;
      element.classList.add('lazy-bg-loaded');
    }
  }
  
  loadAllNonLazy() {
    document.querySelectorAll('[data-lazy-src], [data-srcset]').forEach(el => {
      if (!this.observedElements.has(el)) {
        this.loadElement(el);
      }
    });
  }
  
  loadLowPriorityImages() {
    // Load low priority images (e.g., those below the fold)
    document.querySelectorAll('[data-lazy-src][data-priority="low"]').forEach(img => {
      if (this.observedElements.has(img)) {
        this.loadElement(img);
        this.observer.unobserve(img);
        this.observedElements.delete(img);
      }
    });
  }
  
  setupMutationObserver() {
    if (!('MutationObserver' in window)) return;
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            if (node.matches('[data-lazy-src], [data-srcset]')) {
              this.observeElement(node);
            }
            // Check children of added nodes
            node.querySelectorAll('[data-lazy-src], [data-srcset]').forEach(el => {
              this.observeElement(el);
            });
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

// Initialize the lazy loader
const lazyLoader = new AdvancedLazyLoader();

// Start lazy loading when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    lazyLoader.init();
    initializeServiceWorker();
  });
} else {
  lazyLoader.init();
  initializeServiceWorker();
}

// Service Worker Registration
function initializeServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('ServiceWorker registration successful');
      }).catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }
}

// Install prompt for PWA
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Show the install button or custom UI
  showInstallPromotion();
});

function showInstallPromotion() {
  // Show your custom install button or banner
  const installButton = document.createElement('button');
  installButton.id = 'install-button';
  installButton.textContent = 'Install App';
  installButton.style.position = 'fixed';
  installButton.style.bottom = '20px';
  installButton.style.right = '20px';
  installButton.style.padding = '10px 20px';
  installButton.style.background = '#1e40af';
  installButton.style.color = 'white';
  installButton.style.border = 'none';
  installButton.style.borderRadius = '4px';
  installButton.style.cursor = 'pointer';
  installButton.style.zIndex = '9999';
  
  installButton.addEventListener('click', async () => {
    // Hide the install button
    installButton.style.display = 'none';
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // Optionally, send analytics event with outcome of user choice
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, throw it away
    deferredPrompt = null;
  });
  
  document.body.appendChild(installButton);
}

//// Web Vitals is not available, provide a no-op function
function reportWebVitals() {
  // No-op function for web vitals
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme toggle
  initThemeToggle();
  
  // Initialize cookie banner
  createCookieBanner();
  
  // Report Web Vitals
  reportWebVitals(metric => {
    console.log(metric);
  });
  
  // Lazy loading is already initialized by the AdvancedLazyLoader class
  // Image Modal functionality has been removed

  // PDF link handling for better mobile experience
  const pdfLinks = document.querySelectorAll('a[href$=".pdf"]')
  
<<<<<<< HEAD
  // Sticky Buy Now Button
  const stickyBuyNow = document.getElementById('sticky-buy-now');
  if (stickyBuyNow) {
    stickyBuyNow.addEventListener('click', () => {
      window.location.href = '#pricing';
    });
  }

  // Support Modal Open/Close
  const openSupportModal = document.getElementById('open-support-modal');
  const closeSupportModal = document.getElementById('close-support-modal');
  const supportModal = document.getElementById('support-modal');

  if (openSupportModal && supportModal) {
    openSupportModal.addEventListener('click', () => {
      supportModal.classList.remove('hidden');
    });
  }
  if (closeSupportModal && supportModal) {
    closeSupportModal.addEventListener('click', () => {
      supportModal.classList.add('hidden');
    });
  }

=======
>>>>>>> 1deb32113eb1d14cb1402a63f2534c549c6a23a1
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
  const mobileMenu = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenu && navLinks) {
    // Add click event to toggle button
    mobileMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Toggle active class on nav links
      navLinks.classList.toggle('active');
      
      // Toggle active class on the button itself (for animation)
      mobileMenu.classList.toggle('is-active');
      
      // Toggle body overflow when menu is open/closed
      if (navLinks.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
      
      // Update aria-expanded for accessibility
      const expanded = mobileMenu.getAttribute('aria-expanded') === 'true' || false;
      mobileMenu.setAttribute('aria-expanded', !expanded);
      
      // Add event listener to close menu when clicking outside
      if (navLinks.classList.contains('active')) {
        setTimeout(() => {
          document.addEventListener('click', closeMenuOnClickOutside);
        }, 10);
      } else {
        document.removeEventListener('click', closeMenuOnClickOutside);
      }
    });
    
    // Close menu when clicking outside
    const closeMenuOnClickOutside = (e) => {
      if (!navLinks.contains(e.target) && !mobileMenu.contains(e.target)) {
        navLinks.classList.remove('active');
        mobileMenu.classList.remove('is-active');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.removeEventListener('click', closeMenuOnClickOutside);
      }
    };
    
    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenu.classList.remove('is-active');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      });
    });
  } else {
    console.error("Mobile menu toggle or nav links not found");
  }

  // ===== Nav hide on scroll (auto-hide top nav) =====
  // Navigation scroll behavior
  const nav = document.querySelector('.main-nav');
  const navHeight = nav ? nav.offsetHeight : 0;
  let lastScroll = 0;
  let ticking = false;

  // Add padding to body to account for fixed header
  document.body.style.paddingTop = navHeight + 'px';
  document.documentElement.style.scrollPaddingTop = navHeight + 'px';

  // Function to handle scroll events with throttling
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScroll = window.pageYOffset;
        const isMobileMenuOpen = mobileMenu && mobileMenu.classList.contains('is-active');
        
        // Don't hide/show nav if mobile menu is open
        if (isMobileMenuOpen) {
          ticking = false;
          return;
        }
        
        if (nav) {
          // Add/remove scrolled class when scrolled past 50px
          if (currentScroll > 50) {
            nav.classList.add('scrolled');
          } else {
            nav.classList.remove('scrolled');
          }
          
          // Only hide/show nav when not at the top
          if (currentScroll > 0) {
            if (currentScroll > lastScroll && currentScroll > navHeight) {
              // Scrolling down
              nav.classList.add('hide-nav');
            } else {
              // Scrolling up
              nav.classList.remove('hide-nav');
            }
          } else {
            // At the top of the page
            nav.classList.remove('hide-nav');
          }
        }
        
        lastScroll = currentScroll;
        ticking = false;
      });
      ticking = true;
    }
  };

  // Add scroll event listener with passive for better performance
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Timeline animation on scroll
  const timelineSections = document.querySelectorAll('.timeline-item');
  
  if (timelineSections.length > 0) {
    const isInViewport = (element) => {
      const rect = element.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
      );
    };

    const handleTimelineScroll = () => {
      timelineSections.forEach((item, index) => {
        if (isInViewport(item) && !item.classList.contains('animate-timeline')) {
          // Add staggered delay for each item
          setTimeout(() => {
            item.classList.add('animate-timeline');
          }, 150 * index);
        }
      });
    };

    // Initial check with a slight delay to allow for page load
    setTimeout(() => {
      handleTimelineScroll();
    }, 300);
    
    // Throttle the scroll event for better performance
    let isScrolling;
    const throttledHandleScroll = () => {
      if (!isScrolling) {
        window.requestAnimationFrame(() => {
          handleTimelineScroll();
          isScrolling = false;
        });
        isScrolling = true;
      }
    };
    
    // Add scroll event for timeline with throttling
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    // Also trigger on window resize in case layout changes
    window.addEventListener('resize', throttledHandleScroll, { passive: true });
  }
  
  // Initial check
  handleScroll();

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

  // Video playback functionality
  const video = document.getElementById('showcase-video');
  if (video) {
    video.addEventListener('click', function() {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  }
});
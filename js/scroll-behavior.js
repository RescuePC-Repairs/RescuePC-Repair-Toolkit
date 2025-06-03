document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;
  const scrollThreshold = 100; // Minimum pixels scrolled before hiding
  const navbarHeight = navbar.offsetHeight;
  
  // Add padding to the body equal to navbar height
  document.body.style.paddingTop = `${navbarHeight}px`;
  
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    // Scrolling down
    if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
      navbar.classList.add('hide');
      navbar.classList.remove('scrolled');
    } 
    // Scrolling up
    else if (currentScroll < lastScroll) {
      navbar.classList.remove('hide');
      navbar.classList.add('scrolled');
    }
    
    // At the top of the page
    if (currentScroll <= 0) {
      navbar.classList.remove('scrolled', 'hide');
    }
    
    lastScroll = currentScroll;
  });
  
  // Handle mobile menu state on resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    document.body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.body.classList.remove('resize-animation-stopper');
    }, 400);
    
    // Reset navbar state on resize to prevent layout issues
    if (window.innerWidth >= 1025) {
      navbar.classList.remove('hide');
    }
  });
});

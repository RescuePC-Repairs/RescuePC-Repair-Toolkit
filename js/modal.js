/**
 * Image Modal Functionality
 * Handles the display and interaction with the fullscreen image modal
 */
document.addEventListener('DOMContentLoaded', function() {
  // Get all images that should be clickable for modal
  const images = document.querySelectorAll('.clickable-image, .about-image img, .feature-image img, [data-modal-image]');
  const modal = document.querySelector('.modal');
  const modalContent = document.querySelector('.modal-content');
  const modalImg = document.querySelector('.modal-image');
  const modalCaption = document.querySelector('.modal-caption');
  const closeBtn = document.querySelector('.close-modal');
  const prevBtn = document.querySelector('.modal-nav.prev');
  const nextBtn = document.querySelector('.modal-nav.next');
  const loadingIndicator = document.querySelector('.modal-loading');
  
  // Track the currently opened image for keyboard navigation
  let currentImageIndex = -1;
  const imageArray = Array.from(images);
  
  // Function to show loading state
  function showLoading(show = true) {
    if (show) {
      loadingIndicator.style.display = 'block';
      modalImg.style.opacity = '0';
    } else {
      loadingIndicator.style.display = 'none';
    }
  }
  
  // Function to update navigation buttons state
  function updateNavButtons() {
    if (imageArray.length <= 1) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      return;
    }
    
    prevBtn.style.display = 'flex';
    nextBtn.style.display = 'flex';
  }
  
  // Function to open the modal
  function openModal(src, alt, index = -1) {
    if (index >= 0) currentImageIndex = index;
    
    // Show loading state
    showLoading(true);
    
    // Set image source and alt text
    modalImg.src = src;
    modalImg.alt = alt || 'Enlarged view';
    
    // Update caption if alt text exists
    if (alt && alt.trim() !== '') {
      modalCaption.textContent = alt;
      modalCaption.style.display = 'block';
    } else {
      modalCaption.style.display = 'none';
    }
    
    // Add active class with a small delay to trigger the animation
    setTimeout(() => {
      modal.classList.add('active');
      closeBtn.focus();
    }, 10);
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    document.documentElement.style.paddingRight = window.innerWidth - document.documentElement.clientWidth + 'px';
    document.body.classList.add('modal-open');
    
    // Update navigation buttons
    updateNavButtons();
  }
  
  // Function to close the modal
  function closeModal() {
    modal.classList.remove('active');
    
    // Re-enable scrolling
    document.body.style.overflow = '';
    document.documentElement.style.paddingRight = '';
    document.body.classList.remove('modal-open');
    
    // Return focus to the element that opened the modal
    if (currentImageIndex >= 0 && images[currentImageIndex]) {
      images[currentImageIndex].focus();
    }
    
    currentImageIndex = -1;
  }
  
  // Navigate between images
  function navigateModal(direction) {
    if (currentImageIndex < 0 || imageArray.length <= 1) return;
    
    let newIndex = currentImageIndex + direction;
    if (newIndex < 0) newIndex = imageArray.length - 1;
    if (newIndex >= imageArray.length) newIndex = 0;
    
    const nextImage = imageArray[newIndex];
    if (nextImage) {
      const src = nextImage.dataset.modalImage || nextImage.src;
      openModal(src, nextImage.alt, newIndex);
    }
  }
  
  // Add click event to all clickable images
  images.forEach((image, index) => {
    // Make images focusable for keyboard navigation
    if (!image.hasAttribute('tabindex')) {
      image.setAttribute('tabindex', '0');
    }
    
    // Add role for better accessibility
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', 'View larger version of ' + (image.alt || 'image'));
    
    // Store original source if using data-modal-image
    if (image.hasAttribute('data-modal-image')) {
      image.setAttribute('data-original-src', image.src);
    }
    
    // Click handler
    image.addEventListener('click', (e) => {
      e.preventDefault();
      const src = image.dataset.modalImage || image.src;
      openModal(src, image.alt, index);
    });
    
    // Keyboard support
    image.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const src = image.dataset.modalImage || image.src;
        openModal(src, image.alt, index);
      }
    });
  });
  
  // Close modal when clicking the close button
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
    });
  }
  
  // Navigation buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      navigateModal(-1);
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      navigateModal(1);
    });
  }
  
  // Close modal when clicking outside the image
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        closeModal();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        navigateModal(-1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        navigateModal(1);
        break;
      case 'Tab':
        // Keep focus within modal when open
        const focusableElements = [closeBtn, prevBtn, nextBtn, modalImg].filter(el => el);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
        break;
    }
  });
  
  // Prevent modal content from closing when clicking inside
  modalContent.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  
  // Image loading states
  modalImg.addEventListener('load', function() {
    this.style.opacity = '1';
    showLoading(false);
  });
  
  modalImg.addEventListener('error', function() {
    showLoading(false);
    this.alt = 'Error loading image';
    this.style.opacity = '1';
  });
  
  modalImg.addEventListener('loadstart', function() {
    showLoading(true);
  });
  
  // Initialize
  updateNavButtons();
  
  // Expose functions to window for debugging
  window.imageModal = {
    open: openModal,
    close: closeModal,
    next: () => navigateModal(1),
    prev: () => navigateModal(-1)
  };
});

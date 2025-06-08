// Lazy Loading Test Script
const testLazyLoading = () => {
    // Get all images with lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    console.log('Lazy loaded images found:', lazyImages.length);

    // Create Intersection Observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                console.log('Image loaded:', img.src);
                
                // Test if image loaded successfully
                img.onload = () => {
                    console.log('Image loaded successfully:', img.src);
                    img.classList.add('lazy-loaded');
                };
                
                img.onerror = () => {
                    console.error('Image failed to load:', img.src);
                    img.classList.add('lazy-load-error');
                };
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });

    // Observe all lazy images
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });

    return {
        totalImages: lazyImages.length,
        observer: imageObserver
    };
};

// Run test when page loads
document.addEventListener('DOMContentLoaded', testLazyLoading); 
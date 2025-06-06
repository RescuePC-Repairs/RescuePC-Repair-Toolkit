// Animation Utilities
const animations = {
    // Fade in element
    fadeIn: (element, duration = 300) => {
        element.style.opacity = 0;
        element.style.display = 'block';
        
        let start = null;
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            element.style.opacity = Math.min(progress / duration, 1);
            
            if (progress < duration) {
                window.requestAnimationFrame(animate);
            }
        }
        window.requestAnimationFrame(animate);
    },

    // Fade out element
    fadeOut: (element, duration = 300) => {
        let start = null;
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            element.style.opacity = 1 - Math.min(progress / duration, 1);
            
            if (progress < duration) {
                window.requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        }
        window.requestAnimationFrame(animate);
    },

    // Slide down element
    slideDown: (element, duration = 300) => {
        element.style.height = 'auto';
        const height = element.offsetHeight;
        element.style.height = '0px';
        element.style.overflow = 'hidden';
        element.style.display = 'block';
        
        let start = null;
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);
            element.style.height = `${height * percentage}px`;
            
            if (progress < duration) {
                window.requestAnimationFrame(animate);
            } else {
                element.style.height = 'auto';
                element.style.overflow = '';
            }
        }
        window.requestAnimationFrame(animate);
    },

    // Slide up element
    slideUp: (element, duration = 300) => {
        const height = element.offsetHeight;
        element.style.height = `${height}px`;
        element.style.overflow = 'hidden';
        
        let start = null;
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = 1 - Math.min(progress / duration, 1);
            element.style.height = `${height * percentage}px`;
            
            if (progress < duration) {
                window.requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
                element.style.height = '';
                element.style.overflow = '';
            }
        }
        window.requestAnimationFrame(animate);
    }
};

// Export animations
if (typeof module !== 'undefined' && module.exports) {
    module.exports = animations;
} else {
    window.animations = animations;
} 
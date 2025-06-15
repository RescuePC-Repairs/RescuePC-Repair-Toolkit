// Exit Intent Popup
document.addEventListener('DOMContentLoaded', function() {
    let hasShownPopup = false;
    const popupShownKey = 'exitPopupShown';
    
    // Check if popup was shown in the last 24 hours
    const lastShown = localStorage.getItem(popupShownKey);
    if (lastShown) {
        const lastShownDate = new Date(lastShown);
        const now = new Date();
        if (now - lastShownDate < 24 * 60 * 60 * 1000) {
            hasShownPopup = true;
        }
    }

    // Create popup element
    const popup = document.createElement('div');
    popup.className = 'exit-popup';
    popup.innerHTML = `
        <div class="exit-popup-content">
            <button class="exit-popup-close">&times;</button>
            <h2>Special Offer!</h2>
            <p>Get 20% off your first purchase!</p>
            <p class="small">Limited time offer</p>
            <button class="cta-button">Get Started Now</button>
        </div>
    `;
    document.body.appendChild(popup);

    // Show popup on exit intent
    document.addEventListener('mouseleave', function(e) {
        if (e.clientY <= 0 && !hasShownPopup) {
            popup.classList.add('show');
            hasShownPopup = true;
            localStorage.setItem(popupShownKey, new Date().toISOString());
        }
    });

    // Close popup
    popup.querySelector('.exit-popup-close').addEventListener('click', function() {
        popup.classList.remove('show');
    });

    // Close popup when clicking outside
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            popup.classList.remove('show');
        }
    });
}); 
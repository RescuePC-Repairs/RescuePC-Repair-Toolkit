// PWA Installation and Service Worker Registration

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
        // Check if this is a page refresh or first visit
        if (!navigator.serviceWorker.controller) {
          console.log('This page is not controlled by a service worker');
        }
      })
      .catch(error => {
        console.error('ServiceWorker registration failed:', error);
      });
  });
}

// Handle PWA installation prompt
let deferredPrompt;
const installButton = document.getElementById('install-button');

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Show the install button if it exists
  if (installButton) {
    installButton.style.display = 'block';
    
    installButton.addEventListener('click', () => {
      // Hide the install button
      installButton.style.display = 'none';
      
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
      });
    });
  }
});

// Track successful PWA installation
window.addEventListener('appinstalled', (evt) => {
  console.log('PWA was installed');
  // Hide the install button after successful installation
  if (installButton) {
    installButton.style.display = 'none';
  }
  
  // Track the installation in analytics if available
  if (window.gtag) {
    gtag('event', 'pwa_installed');
  }
});

// Check if the app is running in standalone mode
const isRunningStandalone = () => {
  return (window.matchMedia('(display-mode: standalone)').matches) || 
         (window.navigator.standalone) || 
         document.referrer.includes('android-app://');
};

// Update UI based on installation status
const updatePWAInstallStatus = () => {
  const isStandalone = isRunningStandalone();
  
  // Add a class to the body when running in standalone mode
  if (isStandalone) {
    document.body.classList.add('pwa-installed');
  } else {
    document.body.classList.remove('pwa-installed');
  }
  
  // Update the install button visibility
  if (installButton && !isStandalone) {
    installButton.style.display = 'block';
  } else if (installButton) {
    installButton.style.display = 'none';
  }
};

// Check installation status on load and when display mode changes
window.addEventListener('load', updatePWAInstallStatus);
window.matchMedia('(display-mode: standalone)').addEventListener('change', updatePWAInstallStatus);

// Check for updates
const checkForUpdates = async () => {
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      console.log('Service Worker updated');
    }
  } catch (error) {
    console.error('Error checking for updates:', error);
  }
};

    // Check for updates every hour - DISABLED TO PREVENT FLASHING
    // setInterval(checkForUpdates, 60 * 60 * 1000);

// Initial update check
if ('serviceWorker' in navigator) {
  window.addEventListener('load', checkForUpdates);
}

// Export for use in other modules if needed
export {
  isRunningStandalone,
  updatePWAInstallStatus,
  checkForUpdates
};

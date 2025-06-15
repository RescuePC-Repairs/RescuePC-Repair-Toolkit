// PWA Installation and Service Worker Registration

// Check if service workers are supported
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Register the service worker
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        
        // Check for updates every hour
        setInterval(() => {
          registration.update().catch(err => 
            console.log('Service worker update check failed: ', err)
          );
        }, 60 * 60 * 1000);
      })
      .catch(error => {
        console.error('ServiceWorker registration failed: ', error);
      });
  });
}

// Handle the install prompt
let deferredPrompt;
const installButton = document.getElementById('install-button');

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the default install prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Show the install button
  if (installButton) {
    installButton.style.display = 'flex';
    installButton.classList.add('visible');
    
    // Add click event listener
    installButton.addEventListener('click', installApp);
  }
  
  // Log that the install prompt is available
  console.log('beforeinstallprompt event fired');
});

// Function to handle the install button click
function installApp() {
  if (!deferredPrompt) return;
  
  // Show the install prompt
  deferredPrompt.prompt();
  
  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
      // Hide the install button
      if (installButton) {
        installButton.style.display = 'none';
      }
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // Clear the deferredPrompt variable
    deferredPrompt = null;
  });
}

// Track successful PWA installation
window.addEventListener('appinstalled', (evt) => {
  console.log('PWA was installed');
  // Hide the install button
  if (installButton) {
    installButton.style.display = 'none';
  }
  
  // Track the installation in analytics if available
  if (window.gtag) {
    gtag('event', 'pwa_installed');
  }
});

// Check if the app is running in standalone mode
function isRunningStandalone() {
  return (window.matchMedia('(display-mode: standalone)').matches) || 
         (window.navigator.standalone) || 
         document.referrer.includes('android-app://');
}

// Update UI based on installation status
function updatePWAInstallStatus() {
  const isStandalone = isRunningStandalone();
  
  // Add a class to the body when running in standalone mode
  if (isStandalone) {
    document.body.classList.add('pwa-installed');
  } else {
    document.body.classList.remove('pwa-installed');
  }
  
  // Update the install button visibility
  if (installButton) {
    if (isStandalone) {
      installButton.style.display = 'none';
    } else if (deferredPrompt) {
      installButton.style.display = 'flex';
      installButton.classList.add('visible');
    }
  }
}

// Check installation status on load and when display mode changes
window.addEventListener('load', updatePWAInstallStatus);
window.matchMedia('(display-mode: standalone)').addEventListener('change', updatePWAInstallStatus);

// Check for updates
async function checkForUpdates() {
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      console.log('Service Worker updated');
    }
  } catch (error) {
    console.error('Error checking for updates:', error);
  }
}

// Check for updates every hour
setInterval(checkForUpdates, 60 * 60 * 1000);

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

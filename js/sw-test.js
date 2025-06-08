// Service Worker Test Script
const testServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered:', registration);

            // Test cache
            const cache = await caches.open('rescuepc-cache-v1');
            const cachedAssets = await cache.keys();
            console.log('Cached assets:', cachedAssets);

            // Test offline functionality
            const offlineTest = async () => {
                try {
                    const response = await fetch('/offline.html');
                    const cached = await cache.match('/offline.html');
                    console.log('Offline page cached:', !!cached);
                } catch (error) {
                    console.error('Offline test failed:', error);
                }
            };

            // Run tests
            await offlineTest();
            
            return {
                status: 'success',
                registration,
                cachedAssets: cachedAssets.length
            };
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            return {
                status: 'error',
                error: error.message
            };
        }
    } else {
        console.log('Service Workers not supported');
        return {
            status: 'unsupported'
        };
    }
};

// Run tests when page loads
document.addEventListener('DOMContentLoaded', testServiceWorker); 
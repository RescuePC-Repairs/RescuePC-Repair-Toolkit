// Service Worker for RescuePC Repair Toolkit - Optimized v3

const CACHE_NAME = 'rescuepc-cache-v1';
const RUNTIME_CACHE = 'runtime-v3';
const OFFLINE_URL = '/offline.html';
const CACHE_EXPIRATION_DAYS = 30;

// List of URLs to cache when the service worker is installed
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/navbar-styles.css',
  '/hero-styles.css',
  '/footer-styles.css',
  '/navbar.js',
  '/main.js',
  '/assets/images/logo.png',
  '/assets/images/favicon.ico',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Cache first strategy for these file types
const CACHE_FIRST_FILES = [
  /\.[a-z0-9]+\.(?:css|js|woff2?|eot|ttf|otf)$/i,
  /\.(?:png|jpe?g|gif|webp|svg|ico)$/i
];

// Network first strategy for these paths
const NETWORK_FIRST_PATHS = [
  /^\/$/,
  /^\/index\.html$/,
  /^\/offline\.html$/
];

// Don't cache these requests
const NO_CACHE_PATHS = [
  /^https?:\/\/www\.google-analytics\.com\//,
  /^https?:\/\/www\.googletagmanager\.com\//,
  /^https?:\/\/connect\.facebook\.net\//,
  /^https?:\/\/www\.facebook\.com\//
];

// Install event - cache critical assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Install event');
  
  // Skip waiting to activate the new service worker immediately
  self.skipWaiting();
  
  // Cache all critical assets
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching critical assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch(error => {
        console.error('[Service Worker] Cache addAll error:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activate event');
  
  // Claim control of all clients immediately
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => {
            // Delete old caches that don't match the current version
            return cacheName.startsWith('rescuepc-repairs-') && 
                   cacheName !== CACHE_NAME && 
                   cacheName !== RUNTIME_CACHE;
          })
          .map(cacheName => {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
    .then(() => {
      // Take control of all clients
      return self.clients.claim();
    })
    .catch(error => {
      console.error('[Service Worker] Activation error:', error);
    })
  );
});

// Helper function to check if a request should be cached
function shouldCacheRequest(request) {
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return false;
  
  // Skip cross-origin requests unless they're in our allowed list
  if (!url.origin.startsWith(self.location.origin)) {
    return false;
  }
  
  // Skip requests that match our no-cache patterns
  if (NO_CACHE_PATHS.some(regex => regex.test(request.url))) {
    return false;
  }
  
  return true;
}

// Helper function to determine cache strategy
function getCacheStrategy(request) {
  const url = new URL(request.url);
  
  // Navigation requests use network first
  if (request.mode === 'navigate') {
    return 'networkFirst';
  }
  
  // Static assets use cache first
  if (CACHE_FIRST_FILES.some(regex => regex.test(url.pathname))) {
    return 'cacheFirst';
  }
  
  // API calls and other dynamic content use network first
  return 'networkFirst';
}

// Network first strategy
async function networkFirst(request) {
  try {
    // Try to fetch from network
    const networkResponse = await fetch(request);
    
    // If we got a valid response, cache it and return
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network failed, serving from cache', error);
    
    // Try to get from cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If it's a navigation request and we're offline, show offline page
    if (request.mode === 'navigate') {
      return caches.match(OFFLINE_URL);
    }
    
    return new Response('Network error', { status: 408, statusText: 'Network error' });
  }
}

// Cache first strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // If we have a cached response, update the cache in the background
    fetchAndCache(request);
    return cachedResponse;
  }
  
  // If not in cache, try the network
  return fetchAndCache(request);
}

// Helper to fetch and cache a response
async function fetchAndCache(request) {
  const response = await fetch(request);
  
  // Only cache successful responses
  if (response && response.status === 200) {
    const cache = await caches.open(RUNTIME_CACHE);
    await cache.put(request, response.clone());
  }
  
  return response;
}

// Fetch event handler
self.addEventListener('fetch', event => {
  // Skip requests we shouldn't handle
  if (!shouldCacheRequest(event.request)) {
    return;
  }
  
  // Handle different strategies based on request type
  const strategy = getCacheStrategy(event.request);
  
  if (strategy === 'networkFirst') {
    event.respondWith(networkFirst(event.request));
  } else {
    event.respondWith(cacheFirst(event.request));
  }
});

// Background sync handling
const handleBackgroundSync = async (options = {}) => {
  console.log('[Service Worker] Background sync triggered');
  
  try {
    // Check if there are any pending sync tasks in IndexedDB
    // This is a placeholder - implement your actual sync logic here
    const pendingTasks = []; // await getPendingTasksFromIndexedDB();
    
    if (pendingTasks && pendingTasks.length > 0) {
      console.log(`[Service Worker] Processing ${pendingTasks.length} pending tasks`);
      
      // Process each pending task
      for (const task of pendingTasks) {
        try {
          // Process the task (e.g., sync data with server)
          // await processTask(task);
          
          // Remove from pending tasks if successful
          // await removeTaskFromIndexedDB(task.id);
          
          console.log(`[Service Worker] Successfully processed task: ${task.id}`);
        } catch (error) {
          console.error(`[Service Worker] Error processing task ${task.id}:`, error);
          // Don't rethrow to continue with other tasks
        }
      }
      
      // Show a notification if we processed any tasks
      if (pendingTasks.length > 0) {
        await self.registration.showNotification('Sync Complete', {
          body: `Successfully synced ${pendingTasks.length} items`,
          icon: '/assets/icons/icon-192x192.png',
          badge: '/assets/icons/badge-72x72.png'
        });
      }
    } else {
      console.log('[Service Worker] No pending tasks to sync');
    }
  } catch (error) {
    console.error('[Service Worker] Background sync error:', error);
    
    // Reschedule sync for later
    if (options && options.lastChance) {
      console.log('[Service Worker] Sync failed, will retry later');
      // You might want to implement a retry mechanism here
    }
  }
};

// Background sync event listener
self.addEventListener('sync', event => {
  console.log(`[Service Worker] Sync event: ${event.tag}`);
  
  if (event.tag === 'sync-data') {
    // Add a lastChance flag if this is the last retry
    const syncOptions = { lastChance: false }; // Set to true on last retry
    event.waitUntil(handleBackgroundSync(syncOptions));
  }
});

// Handle push notifications
self.addEventListener('push', event => {
  console.log('[Service Worker] Push received');
  
  let notificationData = {
    title: 'RescuePC Repairs',
    body: 'New update available!',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/badge-72x72.png',
    data: {
      timestamp: Date.now(),
      url: '/',
      primaryKey: '1'
    },
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss' }
    ],
    vibrate: [100, 50, 100],
    requireInteraction: false
  };
  
  // Try to parse the push data if it exists
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (e) {
      // If we can't parse as JSON, try to get as text
      notificationData.body = event.data.text() || notificationData.body;
    }
  }
  
  console.log('[Service Worker] Showing notification:', notificationData);
  
  // Keep the service worker alive until the notification is shown
  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
      .catch(error => {
        console.error('[Service Worker] Error showing notification:', error);
      })
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification click received');
  
  // Close the notification
  event.notification.close();
  
  // Handle the action buttons
  if (event.action === 'open' || !event.action) {
    // Default action - open the app
    const urlToOpen = new URL(event.notification.data.url || '/', self.location.origin).href;
    
    // Focus the window if it's already open, otherwise open a new one
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then(windowClients => {
          // Check if there's already a window/tab open with the target URL
          const matchingClient = windowClients.find(client => 
            client.url === urlToOpen && 'focus' in client
          );
          
          if (matchingClient) {
            return matchingClient.focus();
          }
          
          // If no matching client, open a new window
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
  // Handle other actions if needed
});

// Handle notification close
self.addEventListener('notificationclose', event => {
  console.log('[Service Worker] Notification closed:', event.notification);
  // You might want to log this event for analytics
});

// Background sync implementation for offline support

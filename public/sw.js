// BorrowBuddy Campus Service Worker — Offline Resilience for College Nodes
const CACHE_NAME = 'borrowbuddy-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip chrome extension and non-http schemes
  if (!url.protocol.startsWith('http')) return;

  // Network-first strategy with cache fallback for navigation / static requests
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache valid responses for offline use
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // If network fails (e.g. offline in college workshop or basement), return from cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If navigating to a route and offline, return cached index.html (SPA fallback)
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return new Response('Network offline. Please reconnect to campus Wi-Fi.', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({ 'Content-Type': 'text/plain' })
          });
        });
      })
  );
});

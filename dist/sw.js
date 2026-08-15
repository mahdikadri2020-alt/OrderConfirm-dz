// OrderConfirm PWA Service Worker & Web Push Handler
const CACHE_NAME = 'orderconfirm-v5';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo-orderconfirm-192.png',
  '/logo-orderconfirm-512.png',
  '/logo-orderconfirm-192.svg',
  '/logo-orderconfirm-512.svg'
];

// Install Event: Cache Core Assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {
        // Ignore cache errors during install for dynamic assets
      });
    })
  );
});

// Activate Event: Cleanup Old Caches (WITHOUT touching localStorage or session)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Network First Strategy with Offline Cache Fallback
self.addEventListener('fetch', (event) => {
  // Only intercept GET requests for same origin or static assets, skip API / Supabase / Webhook requests
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || caches.match('/index.html');
        });
      })
  );
});

// Web Push Event Handler: Display Native Push Notifications
self.addEventListener('push', (event) => {
  let data = {
    title: 'OrderConfirm 🔔',
    body: 'Nouvelle mise à jour de commande disponible.',
    icon: '/icon-192.png',
    url: '/'
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body || 'Mise à jour de votre commande',
    icon: data.icon || '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    },
    actions: [
      { action: 'open', title: 'Voir la commande' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'OrderConfirm Notification', options)
  );
});

// Notification Click Event Handler: Focus or Open App Window
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url.includes(location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

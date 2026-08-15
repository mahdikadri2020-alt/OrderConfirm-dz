// OrderConfirm PWA Service Worker & Web Push Handler
const CACHE_NAME = 'orderconfirm-v9';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/official-logo-192.png',
  '/official-logo-512.png',
  '/official-logo-maskable.png'
];

// Install Event: Cache Core Assets & Skip Waiting
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
});

// Activate Event: Cleanup Old Caches & Claim Clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Network First Strategy
self.addEventListener('fetch', (event) => {
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
    title: 'OrderConfirm ⚡',
    body: 'Nouvelle mise à jour de commande disponible.',
    icon: '/official-logo-192.png',
    url: '/app'
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
    icon: data.icon || '/official-logo-192.png',
    badge: '/official-logo-192.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/app'
    },
    actions: [
      { action: 'open', title: 'Voir la commande' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'OrderConfirm ⚡', options)
  );
});

// Client PostMessage Event Handler: Trigger Native Push Notification on Demand
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, icon, url } = event.data;
    const options = {
      body: body || 'Mise à jour de votre commande',
      icon: icon || '/official-logo-192.png',
      badge: '/official-logo-192.png',
      vibrate: [200, 100, 200],
      data: {
        url: url || '/app'
      }
    };
    event.waitUntil(
      self.registration.showNotification(title || 'OrderConfirm ⚡', options)
    );
  }
});

// Notification Click Event Handler: Focus or Open App Window
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/app';

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

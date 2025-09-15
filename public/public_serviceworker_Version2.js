const CACHE_VERSION = 'v1.0.0'; // Mets à jour ce numéro à chaque release majeure
const STATIC_CACHE = `justarchiv-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `justarchiv-dynamic-${CACHE_VERSION}`;
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  // Ajoute ici d'autres fichiers à cacher en dur
];

// Installation : pré-cache les assets statiques
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activation : supprime les anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => ![STATIC_CACHE, DYNAMIC_CACHE].includes(key))
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Gestion des fetch
self.addEventListener('fetch', event => {
  const req = event.request;
  const isNavigation = req.mode === 'navigate' || (req.method === 'GET' && req.headers.get('accept')?.includes('text/html'));

  // Network-first pour les pages HTML/navigation
  if (isNavigation) {
    event.respondWith(
      fetch(req)
        .then(res => {
          // Clone la réponse et la met en cache dynamiquement
          const resClone = res.clone();
          caches.open(DYNAMIC_CACHE).then(cache => cache.put(req, resClone));
          return res;
        })
        .catch(() =>
          caches.match(req).then(res => res || caches.match('/index.html'))
        )
    );
    return;
  }

  // Cache-first pour les assets statiques
  event.respondWith(
    caches.match(req).then(
      cacheRes =>
        cacheRes ||
        fetch(req)
          .then(fetchRes => {
            // Optionnel : mettre en cache les nouvelles requêtes (ex: images externes)
            if (
              req.url.startsWith(self.location.origin) &&
              req.method === 'GET'
            ) {
              const fetchResClone = fetchRes.clone();
              caches.open(DYNAMIC_CACHE).then(cache => cache.put(req, fetchResClone));
            }
            return fetchRes;
          })
          .catch(() => undefined)
    )
  );
});

// Message pour skipWaiting (mise à jour immédiate du SW)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Événement push pour notifications (structure prête)
self.addEventListener('push', event => {
  if (!event.data) return;
  const { title, body, icon } = event.data.json();
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: icon || '/icon-192.png',
    })
  );
});

// Optionnel : gestion du clic sur notification
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
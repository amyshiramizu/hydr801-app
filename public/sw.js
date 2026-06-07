const CACHE_NAME = 'hydr801-v2';
const urlsToCache = [
  '/',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Network-first with cache fallback — keeps the app working offline once
// it's been opened at least once.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone).catch(() => {});
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => (name !== CACHE_NAME ? caches.delete(name) : null))
      )
    )
  );
  self.clients.claim();
});

// Push notification handler. Payloads sent by lib/web-push are JSON with
// shape { title, body, url?, category?, tag?, icon? }. Fall back to a
// generic notification if the payload is missing or unparseable.
self.addEventListener('push', (event) => {
  let payload = {};
  if (event.data) {
    try { payload = event.data.json(); }
    catch { payload = { title: 'HYDR801', body: event.data.text() }; }
  }
  const title = payload.title || 'HYDR801 Wellness';
  const options = {
    body: payload.body || '',
    icon: payload.icon || '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    tag: payload.tag || payload.category || undefined,
    renotify: !!payload.tag,
    data: {
      url: payload.url || '/',
      category: payload.category || null,
      arrivedAt: Date.now(),
    },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Tap on a notification → focus an existing tab or open a new one, deep-
// linking to the URL we attached at push time.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';
  event.waitUntil((async () => {
    const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of allClients) {
      try {
        await client.focus();
        if ('navigate' in client) await client.navigate(targetUrl);
        return;
      } catch {}
    }
    await self.clients.openWindow(targetUrl);
  })());
});

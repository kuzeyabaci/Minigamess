const CACHE = "pwabuilder-offline-page";
const offlineFallbackPage = "/Minigamess/index.html";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      return cache.addAll([
        '/Minigamess/',
        '/Minigamess/index.html',
        '/Minigamess/manifest.json',
        '/Minigamess/icon-192.png',
        '/Minigamess/icon-512.png',
        '/Minigamess/pwabuilder-sw.js'
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const networkResp = await fetch(event.request);
        return networkResp;
      } catch (error) {
        const cache = await caches.open(CACHE);
        const cachedResp = await cache.match(offlineFallbackPage);
        return cachedResp;
      }
    })());
  } else {
    event.respondWith(
      caches.match(event.request).then((resp) => {
        return resp || fetch(event.request);
      })
    );
  }
});

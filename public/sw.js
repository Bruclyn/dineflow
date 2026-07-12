// Kill-switch service worker.
//
// The previous version precached the app shell (including "/") and served it
// cache-first. After each redeploy, Next.js emits new hashed asset filenames,
// but devices holding the old cached "/" kept requesting the old chunks — which
// no longer exist — so the app failed to load ("client-side exception" on
// Safari, failed requests on Chrome). Desktop only worked because that session
// had cached the current build.
//
// This replacement intercepts no requests, deletes the old caches, and
// unregisters itself, so any device that still has a worker installed is
// cleaned up on its next visit. New visitors register no worker at all
// (the registration call was removed from the app).

self.addEventListener('install', () => {
  // Activate immediately instead of waiting for existing tabs to close.
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Purge every cache the old cache-first worker created.
      const keys = await caches.keys()
      await Promise.all(keys.map((key) => caches.delete(key)))

      // Take control of open pages, then remove this worker entirely.
      await self.clients.claim()
      await self.registration.unregister()

      // Reload any open tabs so they re-fetch fresh from the network now that
      // no service worker is in the way. WindowClient.navigate is not available
      // in every browser, so guard it.
      const clients = await self.clients.matchAll({ type: 'window' })
      for (const client of clients) {
        try {
          client.navigate(client.url)
        } catch (err) {
          // Older browsers (incl. some iOS versions) — safe to ignore.
        }
      }
    })()
  )
})

// Intercept nothing: every request goes straight to the network.
self.addEventListener('fetch', () => {})

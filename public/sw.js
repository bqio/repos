const CACHE_NAME = "repository-images-v1"
const IMAGE_CACHE_NAME = "repository-images-cache-v1"

// Install event - activate immediately
self.addEventListener("install", (event) => {
  console.log("[SW] Service Worker installing...")
  self.skipWaiting()
})

// Activate event - claim clients immediately
self.addEventListener("activate", (event) => {
  console.log("[SW] Service Worker activating...")
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Clean up old caches if needed
      caches
        .keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
                console.log("[SW] Deleting old cache:", cacheName)
                return caches.delete(cacheName)
              }
            }),
          )
        }),
    ]),
  )
})

// Fetch event - cache images
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url)

  // Only cache image requests
  if (event.request.destination === "image" || url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i)) {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log("[SW] Serving from cache:", url.href)
            return cachedResponse
          }

          console.log("[SW] Fetching and caching:", url.href)
          return fetch(event.request)
            .then((networkResponse) => {
              // Only cache successful responses
              if (networkResponse && networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone())
              }
              return networkResponse
            })
            .catch((error) => {
              console.error("[SW] Fetch failed:", error)
              // Return a placeholder or handle error
              throw error
            })
        })
      }),
    )
  }
})

// Message event - clear cache on demand
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CLEAR_CACHE") {
    event.waitUntil(
      caches.delete(IMAGE_CACHE_NAME).then(() => {
        console.log("[SW] Image cache cleared")
        event.ports[0].postMessage({ success: true })
      }),
    )
  }
})

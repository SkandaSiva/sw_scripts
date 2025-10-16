// next line ignores 'self' - that's ok. it's how things are done in service
// worker's world.
/* eslint-disable no-restricted-globals */

// The current implementation does nothing really.
// It only exists because it is required for pwa.

/**
 * Handle install events
 */
self.addEventListener('install', (event) => {
  event.waitUntil(Promise.resolve())
})

/**
 * Handle activate events
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

/**
 * Handle fetch events
 */
self.addEventListener('fetch', (event) => {
  event.waitUntil(Promise.resolve())
})

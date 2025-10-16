'use strict';
(function () {
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  const originalRemoveEventListener = EventTarget.prototype.removeEventListener;

  const {hostname, pathname} = self.location
  const safeFetchHandlers = new WeakMap();
  let currentOnFetch = null;

  const matches = /^\/(apps|a|community|tools)\/[^\/]+/.exec(pathname);
  const proxy = matches && matches[0];
  const hostnameRegex = hostname.replace(/\./g, '\\.');
  const ALLOWLIST = [
    // Allow only specific subroutes within a storefront
    `^https\:\/\/${hostnameRegex}+\/($|collections|products|pages|cart|search|blogs|account|recommendations)`,
    // Allow requests from the app proxy in which the service worker was served
    `^https\:\/\/${hostnameRegex}+${proxy}`,
    // Allow all 3rd party urls
    `^https?\:\/\/(?!${hostnameRegex}).+`,
  ];

  function isAllowlisted(url) {
    return ALLOWLIST.some((str) => {
      const re = new RegExp(str);
      return url.match(re)
    })
  }

  function safeAddEventListener(event, handler, options) {
    if (event !== 'fetch') return originalAddEventListener.call(this, event, handler, options);
    function safeHandler(event) {
      if (!isAllowlisted(event.request.url)) {
        return console.debug(`FETCH EVENT BLOCKED: Cannot execute fetch event handler on following request: ${event.request.url}`)
      }
      return handler.call(this, event);
    }
    safeFetchHandlers.set(handler, safeHandler);
    originalAddEventListener.call(this, event, safeHandler, options);
  };

  function safeRemoveEventListener(event, handler) {
    if (!safeFetchHandlers.has(handler)) return;
    const safeHandler = safeFetchHandlers.get(handler)
    safeFetchHandlers.delete(handler);
    originalRemoveEventListener.call(this, event, safeHandler);
  }

  Object.defineProperty(EventTarget.prototype, 'addEventListener', {
    ...Object.getOwnPropertyDescriptor(EventTarget.prototype, 'addEventListener'),
    value: safeAddEventListener
  });

  Object.defineProperty(EventTarget.prototype, 'removeEventListener', {
    ...Object.getOwnPropertyDescriptor(EventTarget.prototype, 'removeEventListener'),
    value: safeRemoveEventListener
  });

  Object.defineProperty(self, 'onfetch', {
    ...Object.getOwnPropertyDescriptor(self, 'onfetch'),
    get() { return currentOnFetch; },
    set(newOnFetch) {
      if (currentOnFetch !== null) {
        safeRemoveEventListener.call(self, 'fetch', currentOnFetch);
      }
      if (typeof newOnFetch === 'function') {
        safeAddEventListener.call(self, 'fetch', newOnFetch);
      }
      currentOnFetch = newOnFetch;
    },
  });
}());
const CACHE = "appify-pwa-cache-v1.3-1581998182513";
const PRECACHE_URLS = ["/","https://cdn.shopify.com/s/files/1/2576/8708/t/4/assets/theme.scss.css"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(PRECACHE_URLS)).then(self.skipWaiting()))
});
self.addEventListener("activate", event => {
  const currentCaches = [CACHE];
  event.waitUntil(caches.keys().then(cacheNames => {
    return cacheNames.filter(cacheName => !currentCaches.includes(cacheName))
  }).then(cachesToDelete => {
    return Promise.all(cachesToDelete.map(cacheToDelete => {
      return caches.delete(cacheToDelete)
    }))
  }).then(() => self.clients.claim()))
})
self.addEventListener("fetch", event => {
  if (
    event.request.url.startsWith(self.location.origin + '/cart/add') ||
    event.request.url.startsWith(self.location.origin + '/cart/change') ||
    event.request.url.startsWith(self.location.origin + '/account/login') ||
    event.request.url.startsWith(self.location.origin + '/account/register') ||
    event.request.url.startsWith(self.location.origin + '/account/logout')
  ) {
    caches.delete(CACHE)
    return
  }
  if (
    event.request.url.startsWith(self.location.origin + '/admin') ||
    event.request.url.startsWith(self.location.origin + '/cart') ||
    event.request.url.startsWith(self.location.origin + '/account') ||
    event.request.url.indexOf('/checkouts/') !== -1 ||
    event.request.url.indexOf('/search?q') !== -1 ||
    event.request.url.endsWith('service-worker.js') ||
    (!event.request.url.startsWith(self.location.origin) && event.request.url.indexOf('cdn.shopify.com') === -1) ||
    event.request.url.startsWith(self.location.origin + '/apps')
  ) {
    return
  }

  let isInternal = event.request.url.startsWith(self.location.origin)

  event.respondWith(
    caches.open(CACHE).then(cache => {
      return cache.match(event.request, { ignoreSearch: !isInternal }).then(response => {
        var fetchPromise = fetch(event.request).then(function(networkResponse) {
          if ((isInternal || isPrecached(event.request.url)) && event.request.method === 'GET') { cache.put(event.request, networkResponse.clone()); }
          return networkResponse;
        }).catch(error => {})
        return response || fetchPromise;
      })
    })
  )
})
function isPrecached (url) {
  let urlToCheck = url.split('?')
  if (PRECACHE_URLS.indexOf(urlToCheck[0]) > -1 || url === self.location.origin + '/') {
    return true
  }
  return false
}

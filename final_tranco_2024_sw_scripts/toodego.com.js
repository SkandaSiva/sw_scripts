

/* global self, caches, fetch, URL, Response */
'use strict';

const applicationServerPublicKey = null;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}



var config = {
  version: 'v6.18.post2+gfbf9dc01',
  staticCacheItems: [
    '/__pwa__/offline/',
    
  ],
  cachePathPattern: /^\/static\/.*/,
  handleFetchPathPattern: /.*/,
  offlinePage: '/__pwa__/offline/'
};

function cacheName (key, opts) {
  return `${opts.version}-${key}`;
}

function addToCache (cacheKey, request, response) {
  if (response.ok && cacheKey !== null) {
    var copy = response.clone();
    caches.open(cacheKey).then( cache => {
      cache.put(request, copy);
    });
  }
  return response;
}

function fetchFromCache (event) {
  return caches.match(event.request).then(response => {
    if (!response) {
      throw Error(`${event.request.url} not found in cache`);
    }
    return response;
  });
}

function offlineResponse (resourceType, opts) {
  if (resourceType === 'content') {
    return caches.match(opts.offlinePage);
  }
  return undefined;
}

self.addEventListener('install', event => {
  function onInstall (event, opts) {
    var cacheKey = cacheName('static', opts);
    return caches.open(cacheKey)
      .then(cache => cache.addAll(opts.staticCacheItems));
  }

  event.waitUntil(
    onInstall(event, config).then( () => self.skipWaiting() )
  );
});

self.addEventListener('activate', event => {
  function onActivate (event, opts) {
    return caches.keys()
      .then(cacheKeys => {
        var oldCacheKeys = cacheKeys.filter(key => key.indexOf(opts.version) !== 0);
        var deletePromises = oldCacheKeys.map(oldKey => caches.delete(oldKey));
        return Promise.all(deletePromises);
      });
  }

  event.waitUntil(
    onActivate(event, config)
      .then( () => self.clients.claim() )
  );
});

self.addEventListener('fetch', event => {

  function shouldHandleFetch (event, opts) {
    var request            = event.request;
    var url                = new URL(request.url);
    var criteria           = {
      matchesPathPattern: opts.handleFetchPathPattern.test(url.pathname),
      isGETRequest      : request.method === 'GET',
      isFromMyOrigin    : url.origin === self.location.origin
    };
    var failingCriteria    = Object.keys(criteria)
      .filter(criteriaKey => !criteria[criteriaKey]);
    return !failingCriteria.length;
  }

  function onFetch (event, opts) {
    var request = event.request;
    var url           = new URL(request.url);
    var acceptHeader = request.headers.get('Accept');
    var resourceType = 'static';
    var cacheKey;

    if (acceptHeader.indexOf('text/html') !== -1) {
      resourceType = 'content';
    } else if (acceptHeader.indexOf('image') !== -1) {
      resourceType = 'image';
    }

    cacheKey = null;
    if (opts.cachePathPattern.test(url.pathname)) {
      cacheKey = cacheName(resourceType, opts);
    }

    /* always network first */
    event.respondWith(
        fetch(request)
          .then(response => addToCache(cacheKey, request, response))
          .catch(() => fetchFromCache(event))
          .catch(() => offlineResponse(resourceType, opts))
      );
  }
  if (shouldHandleFetch(event, config)) {
    onFetch(event, config);
  }
});

self.addEventListener('push', event => {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  var message = JSON.parse(event.data.text());

  const title = message.summary;
  const options = {
    body: message.body,
    data: {"url": message.url},
    badge: "/static/toodego/img/launcher-icon-192px-white.png",
    icon: "/static/toodego/img/launcher-icon-192px.png"
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  var url = event.notification.data.url;
  event.notification.close();
  if (url) {
    event.waitUntil(
      clients.openWindow(url)
    );
  }
});

self.addEventListener('pushsubscriptionchange', event => {
  console.log('[Service Worker]: \'pushsubscriptionchange\' event fired.');
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then(function(newSubscription) {
      console.log('[Service Worker] New subscription: ', newSubscription);
      combo_pwa_update_subscription_on_server(newSubscription);
    })
  );
});

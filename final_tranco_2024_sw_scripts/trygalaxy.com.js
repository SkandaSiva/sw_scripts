importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');
importScripts('swEnv.js');

const offlineCache = () => {
  const CACHE_VERSION = '20240403';

  /**
   * Activate new service worker versions immediately
   */
  self.addEventListener('install', function () {
    self.skipWaiting();
  });

  /**
   * Prune old cache instances on activation
   */
  self.addEventListener('activate', (event) => {
    const pruneOldCaches = async () => {
      const allCaches = await caches.keys();
      const staleCaches = allCaches.filter((cache) => cache !== CACHE_VERSION);
      await Promise.all(staleCaches.map((cache) => caches.delete(cache)));
    };

    event.waitUntil(pruneOldCaches());
  });

  /**
   * Precache assets on message
   */
  self.addEventListener('message', async (event) => {
    // Open cache and check for existing cache objects
    const cache = await caches.open(CACHE_VERSION);
    const cacheKeys = await cache.keys();
    const cachedUrls = cacheKeys.map((req) => req.url);

    // Create list of Requests to cache
    const assetUrls = event.data.assets || [];
    const candidates = assetUrls.map((url) => new Request(url));
    const requests = candidates.filter((req) => !cachedUrls.includes(req.url));

    // Precache required assets
    await cache.addAll(requests);
  });

  self.addEventListener('fetch', function (event) {
    event.respondWith(
      caches.open(CACHE_VERSION).then(function (cache) {
        return cache.match(event.request).then(function (cachedResponse) {
          // Return a cached response if we have one
          if (cachedResponse) {
            return cachedResponse;
          }
          // Otherwise, hit the network
          return fetch(event.request).then(function (networkResponse) {
            // Return the network response
            return networkResponse;
          });
        });
      })
    );
  });
};

const initPushNotifications = () => {
  firebase.initializeApp({
    apiKey: swEnv.FCM_API_KEY,
    authDomain: swEnv.FCM_AUTH_DOMAIN,
    projectId: swEnv.FCM_PROJECT_ID,
    messagingSenderId: swEnv.FCM_MESSAGING_SENDER_ID,
    appId: swEnv.FCM_APP_ID,
  });

  firebase.messaging();
};

/*
 * Override the onPush handler before registering Firebase.
 * This allows us to monkey patch the FCM console payload.
 */
class TryGalaxyPushEvent extends Event {
  constructor(data) {
    super('push');

    Object.assign(this, data);
    this.custom = true;
  }
}

self.addEventListener('push', (e) => {
  if (e.custom) return;

  const newEvent = new TryGalaxyPushEvent({
    data: {
      json() {
        const newData = e.data.json();
        newData.notification.click_action = '/?redirect=false&fullscreen=true&notificationclick=true';
        newData.notification.icon = '/assets/share/logo.png';
        return newData;
      },
    },
    waitUntil: e.waitUntil.bind(e),
  });

  e.stopImmediatePropagation();
  dispatchEvent(newEvent);
});

offlineCache();

initPushNotifications();

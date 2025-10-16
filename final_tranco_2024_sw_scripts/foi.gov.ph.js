importScripts(
  'https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.12.1/firebase-analytics-compat.js',
);
importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js',
);

const firebaseConfig = {
  apiKey: 'AIzaSyBj0SeSCSusV_DHdAgQT4MEeFTYvj0UM0c',
  authDomain: 'freedom-of-information.firebaseapp.com',
  projectId: 'freedom-of-information',
  storageBucket: 'freedom-of-information.appspot.com',
  messagingSenderId: '888569519253',
  appId: '1:888569519253:web:40f3a6966d667d2a15cf9c',
  measurementId: 'G-CBFG26P44W',
};

const app = firebase.initializeApp(firebaseConfig);

workbox.setConfig({ debug: false });

const { CacheableResponsePlugin } = workbox.cacheableResponse;
const {
  registerRoute,
  Route,
  setCatchHandler,
  setDefaultHandler,
  NavigationRoute,
  RegExpRoute,
} = workbox.routing;
const { CacheFirst, NetworkFirst, StaleWhileRevalidate, NetworkOnly } =
  workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;
const { googleFontsCache, offlineFallback, staticResourceCache, pageCache } =
  workbox.recipes;

//setDefaultHandler(new NetworkOnly());
workbox.precaching.cleanupOutdatedCaches();
googleFontsCache();

//staticResourceCache();


async function cacheKeyWillBeUsed({ request, mode }) {
  let url = new URL(request.url);
  // console.log('url.origin + url.pathname ', url.origin + url.pathname)
  let raw = new URL(url.origin + url.pathname);
  // console.log('raw ', raw.href)
  return raw.href;
}

async function cachedResponseWillBeUsed({ cache, request, cachedResponse }) {
  if (cachedResponse) {
    return cachedResponse;
  }
  let url = new URL(request.url);
  let urlToMatch = url.origin + url.pathname;

  return caches.match(urlToMatch);
}

const staticStorage = ({ url, request, event }) => {
  if (
    url.origin === 'https://storage.googleapis.com' &&
    url.pathname.startsWith('/efoi-v2-prod/static/') ||
    url.origin === 'https://efoi-v2-prod.storage.googleapis.com' &&
    url.pathname.startsWith('/static/') ||
    url.origin === 'https://www.gstatic.com' ||
    url.pathname.startsWith('/cms/sprite-') ||
    url.pathname.startsWith('/cms/jsi18n/')
    ){
    return true;
  }
  return false;
};

const mediaStorage = ({ url, request, event }) => {
  if (
    url.origin === 'https://storage.googleapis.com' &&
    url.pathname.startsWith('/efoi-v2-prod/media/') ||
    url.origin === 'https://storage.googleapis.com'
  ) {
    return true;
  }
  return false;
};

const googleMatchCB = ({ url, request, event }) => {
  if (
    url.origin === 'https://gstatic.com' ||
    url.origin === 'https://www.google-analytics.com' ||
    url.origin === 'https://www.googletagmanager.com' ||
    url.origin === 'https://firebase.googleapis.com' ||
    url.origin === 'http://www.gravatar.com' ||
    url.origin === 'https://www.gravatar.com'
  ) {
    return true;
  }
  return false;
};

const naviMatchCB = ({ url, request, event }) => {
  if (
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com' ||
    url.origin === 'https://gstatic.com' ||
    url.origin === 'https://www.google-analytics.com' ||
    url.origin === 'https://www.googletagmanager.com' ||
    url.origin === 'https://firebase.googleapis.com'
  ) {
    return true;
  }
  return false;
};

registerRoute(new NavigationRoute(naviMatchCB));

registerRoute(
  new Route(
    googleMatchCB,
    new CacheFirst({
      cacheName: 'google-cache',
      fetchOptions: {
        credentials: 'same-origin',
      },
      plugins: [
        {cacheKeyWillBeUsed},
        new ExpirationPlugin({ maxAgeSeconds: 60 * 60 * 24 * 60 })
      ],
    }),
  ),
);

registerRoute(
  new Route(
    staticStorage,
    new CacheFirst({
      cacheName: 'static_cache',
      fetchOptions: {
        credentials: 'same-origin',
      },
      plugins: [
        {cacheKeyWillBeUsed},
        new CacheableResponsePlugin({
          statuses: [0, 200],
          
        }),
        new ExpirationPlugin({
          maxAgeSeconds: 60 * 60 * 24 * 60,
        }),
      ],
    }),
  ),
);

registerRoute(
  new Route(
    mediaStorage,
    new CacheFirst({
      cacheName: 'media_cache',
      fetchOptions: {
        credentials: 'same-origin',
      },
      plugins: [
        {cacheKeyWillBeUsed},
        new CacheableResponsePlugin({
          statuses: [0, 200],
        
        }),
        new ExpirationPlugin({
          maxAgeSeconds: 60 * 60 * 24 * 60,
        }),
      ],
    }),
  ),
);

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  console.log('setBackgroundMessageHandler ' + payload);
  console.log(payload);
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://res.cloudinary.com/papatupher/image/upload/v1702372123/FOI-logo192x192_xddbgk.png',
  };
  self.registration.showNotification(
    payload.notification.title,
    notificationOptions,
  );
});

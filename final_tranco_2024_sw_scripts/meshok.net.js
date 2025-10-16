/* eslint-disable no-restricted-globals */
self.addEventListener('push', (ev) => {
  const data = ev.data.json();
  const notificationTitle = data.title;
  const notificationOptions = {
    body: data.body,
    icon: data.icon,
    data: {
      url: data.url,
    },
    badge: '/nuxt/badge.png',
  };
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions,
  );
});

self.addEventListener('notificationclick', (event) => {
  const notificationData = event.notification.data;
  event.notification.close();

  if (notificationData.url) {
    event.waitUntil(clients.openWindow(notificationData.url));
  }
});

const build = new URL(location).searchParams.get('build');
const CACHE_NAME = `nuxt-${build}`;
const urlsToCache = [
  '/offline.html',
  '/nuxt/logo.svg',
  '/nuxt/logo-m.svg?v=4',
  '/nuxt/spinner.png?v=2',
  '/nuxt/badge.png',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheName.includes(build)) {
            return caches.delete(cacheName);
          }

          return Promise.resolve();
        }),
      ),
    ),
  );
});

self.addEventListener('fetch', (ev) => {
  const normalizedUrl = new URL(ev.request.url);

  if (normalizedUrl.hostname !== self.location.hostname) {
    return;
  }

  // ignore not bundled modules
  if (normalizedUrl.pathname.startsWith('/src')) {
    return;
  }

  const contentType = ev.request.headers.get('content-type');
  if (contentType && contentType.startsWith('multipart/form-data')) {
    return;
  }

  const isAssetsRequest =
    normalizedUrl.pathname.startsWith('/assets') ||
    normalizedUrl.pathname.startsWith('/nuxt') ||
    normalizedUrl.pathname.startsWith('/_nuxt');

  if (isAssetsRequest) {
    // we don't want to cache assets in dev mode
    if (build !== 'dev') {
      ev.respondWith(cacheFirst(ev.request));
    }

    return;
  }

  const isApiRequest = normalizedUrl.pathname.startsWith('/api');

  if (isApiRequest) {
    const reqHash = ev.request.headers.get('X-Hash');

    if (reqHash) {
      ev.respondWith(dedupRequest(ev.request, reqHash, fetch));
    }

    return;
  }

  const isUtilsRequest =
    normalizedUrl.pathname.startsWith('/_') ||
    normalizedUrl.pathname.startsWith('/echo') ||
    normalizedUrl.pathname.startsWith('/metrics') ||
    normalizedUrl.pathname.startsWith('/perf') ||
    normalizedUrl.pathname.startsWith('/timesync') ||
    normalizedUrl.pathname.startsWith('/timecode') ||
    normalizedUrl.pathname.startsWith('/version') ||
    normalizedUrl.pathname.startsWith('/ws');

  const pathChunks = normalizedUrl.pathname.split('/');
  const isDotInFilename = pathChunks[pathChunks.length - 1].includes('.');

  if (isUtilsRequest || isDotInFilename) {
    return;
  }

  // only GET requests can be cached
  if (ev.request.method !== 'GET') {
    return;
  }

  ev.respondWith(withOfflinePage(networkOnly(ev.request, 3)));
});

async function networkOnly(req, maxRetries) {
  return retryRequest(req, maxRetries);
}

async function cacheFirst(req, maxRetries) {
  const cachedResponse = await caches.match(req);

  if (cachedResponse) {
    return cachedResponse;
  }

  const response = await retryRequest(req, maxRetries);
  return addResponseToCache(req, response);
}

const inflightRequests = new Map();

async function dedupRequest(req, reqHash, next) {
  const cachedRequest = inflightRequests.get(reqHash);

  if (cachedRequest) {
    const resp = await cachedRequest;
    return resp.clone();
  }

  const promise = next(req);
  inflightRequests.set(reqHash, promise);

  try {
    const resp = await promise;
    return resp.clone();
  } finally {
    setTimeout(() => inflightRequests.delete(reqHash), 100);
  }
}

async function addResponseToCache(req, res) {
  if (!res || res.status !== 200 || res.type !== 'basic') {
    return res;
  }

  const responseToCache = res.clone();
  const cache = await caches.open(CACHE_NAME);
  cache.put(req, responseToCache).catch(console.error);

  return res;
}

function retryRequest(req, maxRetries = +Infinity, retryIdx = 0) {
  const fetchRequest = req.clone();

  return new Promise((resolve, reject) => {
    if (maxRetries === 0) {
      throw new Error('Max retries exceeded');
    }

    withTimeout(fetch(fetchRequest), 15000)
      .then(resolve)
      .catch(() => {
        setTimeout(() => {
          retryRequest(req, maxRetries - 1, retryIdx + 1)
            .then(resolve)
            .catch(reject);
        }, Math.min(retryIdx * 1000, 10000));
      });
  });
}

function noCache(response) {
  if (!response) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'no-store, max-age=0');

  const updatedResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });

  return updatedResponse;
}

function withTimeout(responsePromise, timeout) {
  return Promise.race([
    responsePromise,
    new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Request timed out.'));
      }, timeout);
    }),
  ]);
}

async function withOfflinePage(responsePromise) {
  try {
    return await responsePromise;
  } catch (e) {
    return noCache(await caches.match('/offline.html'));
  }
}

const PRECACHE = 'pco-precache-v2';
const RUNTIME = 'pco-runtime';
const TIME_CACHED_KEY = 'time-cached';
const CACHE_INFO_KEY = '__sw_cache_info__';
const NUM_OF_RETRIES = 0;
const ONE_MINUTE = 60;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_YEAR = 365 * ONE_DAY;
// A list of local resources we always want to be cached.
const PRECACHE_URLS = [];
const ALLOW_OPAQUE_CACHE = false;
const API_DOMAINS = ['https://api.pcoptimum.ca', 'https://api-uat.pcoptimum.ca'];

// either full url or the full url without origin
const IGNORE_LIST = [];

const config = {
  asset: {
    match: [
      '/static/',
      'assetful',
      'https://fonts.googleapis.com/',
      'https://assets.adobedtm.com/',
      'https://assets.shop.loblaws.ca',
    ],
    duration: ONE_YEAR,
  },
  api: {
    disabled: true,
    match: [
      (req) => API_DOMAINS.some((domain) => req.url.startsWith(domain)) && req.method === 'GET',
    ],
    duration: 5 * ONE_MINUTE,
  },
  contentful: {
    match: ['https://cdn.contentful.com'],
    duration: 5 * ONE_MINUTE,
  },
};

const handleInstall = (event) => {
  event.waitUntil(preCache());
};

const preCache = async () => {
  const cache = await caches.open(PRECACHE);
  await cache.addAll(PRECACHE_URLS);
  return self.skipWaiting();
};

const handleActivate = (event) => {
  event.waitUntil(clearCache());
};

const clearCache = async () => {
  const currentCaches = [PRECACHE, RUNTIME];
  const cacheNames = await caches.keys();
  const cachesToDelete = cacheNames.filter((cacheName) => currentCaches.includes(cacheName));
  await Promise.all(cachesToDelete.map((cache) => caches.delete(cache)));
  return self.clients.claim();
};

const handleFetch = (event) => {
  // cache the request if it matches one of our cache types
  const cacheType = Object.values(config).find((type) => matchCacheType(type, event.request));
  cacheType && handleCache(event, cacheType.duration);
};

const isIgnored = (url) =>
  IGNORE_LIST.map((u) => (u.startsWith('http') ? u : `${self.location.origin}${u}`)).some(
    (u) => u === url,
  );

const matchCacheType = (type, req) =>
  !type.disabled &&
  !isIgnored(req.url) &&
  type.match.some((m) => (typeof m === 'function' ? m(req) : req.url.includes(m)));

const handleCache = (event, duration) => {
  event.waitUntil(event.respondWith(cacheUrl(event, duration)));
};

// use cached response if not expired, otherwise refetch with retries
const cacheUrl = async (event, duration) => {
  const req = event.request;
  const cacheInfo = await caches.match(CACHE_INFO_KEY);
  const cachedResponse = await caches.match(req);

  if (isValid(cachedResponse, cacheInfo, req.url, duration)) {
    return cachedResponse;
  } else {
    const cache = await caches.open(RUNTIME);
    const response = await refetch(req, {}, NUM_OF_RETRIES);

    if (isOpaque(response)) {
      ALLOW_OPAQUE_CACHE && cacheOpaqueResponse(cacheInfo, cache, req, response);
    } else if (response.ok) {
      const newResponse = await createNewResponseWithTimeCached(response);
      await cache.put(req, newResponse);
    }
    return response;
  }
};

const isOpaque = (res) => res.status === 0;

const isValid = (response, cacheInfo, url, duration) => {
  if (!response) return false;

  let cachedTime;

  if (isOpaque(response)) {
    const cachedTimeMap = JSON.parse(cacheInfo.headers.get(TIME_CACHED_KEY));
    cachedTime = cachedTimeMap[url];
  } else {
    cachedTime = response.headers.get(TIME_CACHED_KEY);
  }

  if (!cachedTime) return false;

  cachedTime = +cachedTime;
  const timeElapsed = (Date.now() - cachedTime) / 1000;
  const isCacheValid = timeElapsed < duration;

  return isCacheValid;
};

const createNewResponseWithTimeCached = async (response) => {
  const copy = response.clone();
  const headers = new Headers(copy.headers);
  headers.set(TIME_CACHED_KEY, Date.now());
  const blob = await copy.blob();
  return new Response(blob, { headers });
};

const cacheOpaqueResponse = async (cacheInfo, cache, req, res) => {
  const cachedTime = JSON.parse(cacheInfo?.headers.get(TIME_CACHED_KEY) || '{}');
  cachedTime[req.url] = Date.now();
  const headers = new Headers();
  headers.set(TIME_CACHED_KEY, JSON.stringify(cachedTime));
  await cache.put(req, res.clone());
  await cache.put(new Request(CACHE_INFO_KEY), new Response(null, { headers }));
};

const refetch = async (request, options = {}, retries = 0) => {
  try {
    const res = await fetch(request, options);
    return !res.ok && res.type !== 'opaque' && retries > 0
      ? refetch(request, options, retries - 1)
      : res;
  } catch (error) {
    if (retries > 0) {
      return refetch(request, options, retries - 1);
    }
    throw new Error(error.message);
  }
};

try {
  // The install handler takes care of precaching the resources we always need.
  self.addEventListener('install', handleInstall);

  // The activate handler takes care of cleaning up old caches.
  self.addEventListener('activate', handleActivate);

  // The fetch handler serves responses for same-origin resources from a cache.
  // If no response is found, it populates the runtime cache with the response
  // from the network before returning it to the page.
  self.addEventListener('fetch', handleFetch);
} catch {
  console.warn('Service worker error');
}

importScripts('/wp-content/skins/sol-ovb/libs/localforage/localforage.min.js')

// set up localForage
localforage.config({
  name: 'ePaper',
  storeName: 'offline_pub_data',
  size: 50 * 1024 * 1024
});

const CACHE_NAME = 'webpapers-static'
const CACHE_VERSION = '20241106111907'
const BASE_URL = 'https://www.ovb-heimatzeitungen.de'
let jwt = undefined
let cacheData = undefined
const staticUrls = ["\/","\/SysRes\/sol-ovb\/groups\/sprites\/Weather_Texture.png","\/SysRes\/sol-ovb\/groups\/sprites\/Texture@2x.png","\/SysRes\/sol-ovb\/groups\/sprites\/Texture.png","\/SysRes\/sol-ovb\/groups\/sprites\/Icons_Texture@2x.png","\/SysRes\/sol-ovb\/groups\/sprites\/Icons_Texture.png","\/SysRes\/sol-ovb\/groups\/sprites\/Footer_Texture.png","\/SysRes\/sol-ovb\/images\/favicon.ico","\/wp-content\/skins\/sol-ovb\/groups\/epaper\/first-page-ai.png","\/wp-content\/skins\/sol-ovb\/groups\/epaper\/first-page-ch.png","\/wp-content\/skins\/sol-ovb\/groups\/epaper\/first-page-mu.png","\/wp-content\/skins\/sol-ovb\/groups\/epaper\/first-page-nm.png","\/wp-content\/skins\/sol-ovb\/groups\/epaper\/first-page-ro.png","\/wp-content\/skins\/sol-ovb\/groups\/epaper\/first-page-wa.png","\/wp-content\/skins\/sol-ovb\/groups\/epaper\/first-page-wk.png","\/SysRes\/sol-ovb\/fonts\/31FDC6_0_0.woff","\/SysRes\/sol-ovb\/fonts\/31FDC6_0_0.woff2","\/SysRes\/sol-ovb\/fonts\/345E6D_0_0.woff","\/SysRes\/sol-ovb\/fonts\/345E6D_0_0.woff2","\/SysRes\/sol-ovb\/fonts\/mdi\/materialdesignicons-webfont.woff?v=1.6.50","\/SysRes\/sol-ovb\/fonts\/mdi\/materialdesignicons-webfont.woff2?v=1.6.50","\/wp-content\/skins\/dist\/ovb.bundle.css?v=xpresso","\/wp-content\/skins\/dist\/vendor.bundle.js","\/wp-content\/skins\/dist\/touch-devices.bundle.js","\/wp-content\/skins\/dist\/ovb.bundle.js"]
self.onmessage = (event) => {
  if (!event.data) {
    return
  }

  console.log('[SW] Got message: ', event.data)
  if (typeof event.data === 'object') {
    if (event.data.hasOwnProperty('jwt')) {
      jwt = event.data.jwt
    }
    if (event.data.hasOwnProperty('cacheData')) {
      cacheData = event.data.cacheData
    }
  } else {
    if (typeof event.data === 'string') {
      if ('skipWaiting' === event.data) {
        // noinspection JSIgnoredPromiseFromCall
        self.skipWaiting();
      }
    }
  }

}

function clearOlderCaches(cacheToKeep, prefixesToCheck) {
    return caches.keys().then((cacheNames) => Promise.all(cacheNames.map((cacheName) => {
        if (cacheName.indexOf(prefixesToCheck) === 0 && cacheName !== cacheToKeep) {
            console.log('[SW] deleting outdated static cache', cacheName);
            return caches.delete(cacheName);
        }
    })))
}

self.oninstall = (event) => {
  urls = staticUrls.map((url) => new Request(url, { credentials: 'same-origin' }));
  console.log(`[SW] Installing service worker. Caching ${urls.length} resources`);
  event.waitUntil(
    caches
      .open(`${CACHE_NAME}-v${CACHE_VERSION}`)
      .then(function (cache) {
        return Promise.all(
          urls.map((url) => cache.add(url)
                               .catch(err => console.log(err, url)))
        )
      })
  );
};

self.onactivate = (event) => {
  console.log('[SW] Activating Service worker: ', event);
  clearOlderCaches(`${CACHE_NAME}-v${CACHE_VERSION}`, CACHE_NAME);
  return self.clients.claim();
};

function toStaticCache(id, response) {
  return caches
    .open(`${CACHE_NAME}-v${CACHE_VERSION}`)
    .then(cache => cache.put(id, response))
}

function toCache(id, response) {
  let store = (data) => {
    return localforage.setItem(id, data)
  }

  // should an opaque request come through, store it regardless
  if (response.ok) {
    const type = response.headers.get('Content-Type');
    if (type.startsWith('image/')) {
      return response.blob().then(store)
    }
    return response.text().then(store)
  }
}

function fromCache(id) {
  if (staticUrls.includes(id) || staticUrls.includes(id.replace(BASE_URL, ''))) {
    return caches.match(id)
  }
  return localforage.getItem(id).then((data) => {
    // @todo: return something from cache instead of null
    if (!data) return null
    return new Response(data, { headers: new Headers({ 'Content-Type': 'text/html; charset=UTF-8'})})
  })
}

self.onfetch = (event) => {
  const request = event.request;
  if (request.method != 'GET') {
    return;
  }

  let url = new URL(request.url);
  const fetchInit = {
    headers: event.isReload ? undefined : new Headers({
      'Authorization': 'Bearer ' + jwt,
      'X-Requested-With': 'ServiceWorker'
    }),
    credentials: 'same-origin'
  }

  const pathExclusions = [
    /^\/login/,
    /^\/api/,
    /^\/ajax-call.php/,
    /^\/sw.js$/,
    /^\/wp-admin/,
    /^\/wp-login.php/,
    /^\/download/,
    /^\/SysRes\/sol-ovb\/help\/OVB_ePaper_Anleitung_A4_2019.pdf/,
    /^\/brochure/,
    /^\/magazine/,
    /^\/sonderthema/,
    /^\/passwort\/?$/,
    /^\/xpresso_code\/?$/,
  ]

  const originExclusions = [
    /^https:\/\/consentcdn.cookiebot.com/,
    /^https:\/\/securepubads.g.doubleclick.net/,
  ]

  const fresh = [
    '/',
  ]

  // not even trying on http urls as they would fail nevertheless
  if (url.protocol === 'http') {
    return;
  }

  // if it is a redirect because of missing $ in window (referrer === url)
  if (`${url.origin}${url.pathname}` === request.referrer) {
    return;
  }

  // always go online for exclusions // path
  if (pathExclusions.some(rx => rx.test(url.pathname))) {
    return;
  }

  // always go online for exclusions // domains
  if (originExclusions.some(rx => rx.test(url.origin))) {
    return;
  }

  // always grab a fresh copy from the network, fall back to cache
  if (fresh.includes(url.pathname)) {
    return event.respondWith(
      fetch(url.href, fetchInit)
        .then(response => {
          toStaticCache(url.href, response.clone())
          return response
        })
        .catch((e) => {
          console.error(e)
          return fromCache(url.href)
            .then(res => {
              if (null === res) {
                return caches.match(url.href)
              }
              return res
            })
        })
    )
  }

  event.respondWith(
    fromCache(url.href)
      .then(dataFromCache => {
        if (dataFromCache) {
          return dataFromCache
        }
        let init = { mode: 'no-cors' }
        let addToCache = false;
        if (url.origin === BASE_URL) {
          addToCache = cacheData && (cacheData.articles.includes(url.href) || cacheData.imgs.includes(url.href))
          init = fetchInit
        }
        return fetch(url.href, init)
          .then(response => {
            if (addToCache) {
              toCache(url.href, response.clone())
            }
            return response
          })
          .catch(err => {
            console.error("Error fetching", err)
            if ('image' === request.destination) {
              return caches.match('/SysRes/sol-ovb/groups/progressive/fallback.png')
            }
          })
      })
  );
}

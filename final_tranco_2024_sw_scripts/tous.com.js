const options = {"workboxURL":"https://cdn.jsdelivr.net/npm/workbox-cdn@5.1.4/workbox/workbox-sw.js","importScripts":[],"config":{"debug":false},"cacheOptions":{"cacheId":"web-tous-prod","directoryIndex":"/","revision":"ck6BQCLFM8fc"},"clientsClaim":true,"skipWaiting":true,"cleanupOutdatedCaches":true,"offlineAnalytics":false,"preCaching":[{"revision":"ck6BQCLFM8fc","url":"/?standalone=true"}],"runtimeCaching":[{"urlPattern":".*fonts.googleapis.com.*$","handler":"StaleWhileRevalidate","strategyOptions":{"cacheName":"google-fonts-stylesheets"},"strategyPlugins":[{"use":"expiration.ExpirationPlugin","config":[{"maxAgeSeconds":2592000,"purgeOnQuotaError":true}]},{"use":"cacheableResponse.CacheableResponsePlugin","config":[{"statuses":[0,200]}]}],"method":"GET"},{"urlPattern":".*fonts.gstatic.com.*$","handler":"CacheFirst","strategyOptions":{"cacheName":"google-fonts-webfonts"},"strategyPlugins":[{"use":"expiration.ExpirationPlugin","config":[{"maxEntries":30,"maxAgeSeconds":31536000,"purgeOnQuotaError":true}]},{"use":"cacheableResponse.CacheableResponsePlugin","config":[{"statuses":[0,200]}]}],"method":"GET"},{"urlPattern":".*maps.googleapis.com.*$","handler":"NetworkFirst","strategyOptions":{"cacheName":"googleapis-maps"},"strategyPlugins":[{"use":"expiration.ExpirationPlugin","config":[{"maxAgeSeconds":86400,"purgeOnQuotaError":true}]}],"method":"GET"},{"urlPattern":"https://www.youtube.com/player_api","handler":"StaleWhileRevalidate","strategyOptions":{"cacheName":"youtube-player-cache"},"strategyPlugins":[{"use":"expiration.ExpirationPlugin","config":[{"maxAgeSeconds":2592000}]},{"use":"cacheableResponse.CacheableResponsePlugin","config":[{"statuses":[0,200]}]}],"method":"GET"},{"urlPattern":".*.modern.js","handler":"CacheFirst","strategyOptions":{"cacheName":"statics-cache-modern-js"},"strategyPlugins":[{"use":"expiration.ExpirationPlugin","config":[{"maxAgeSeconds":31536000,"purgeOnQuotaError":true}]}],"method":"GET"},{"urlPattern":"^(?!.*(googletagmanager\\.com|google-analytics\\.com)).*\\.(?:js|css)(?:\\?.*|)$","handler":"StaleWhileRevalidate","strategyOptions":{"cacheName":"statics-cache-js-css"},"strategyPlugins":[{"use":"expiration.ExpirationPlugin","config":[{"maxAgeSeconds":2592000,"purgeOnQuotaError":true}]}],"method":"GET"},{"urlPattern":".*empathybroker.com/.*","handler":"StaleWhileRevalidate","strategyOptions":{"cacheName":"search-cache"},"strategyPlugins":[{"use":"expiration.ExpirationPlugin","config":[{"maxAgeSeconds":259200,"purgeOnQuotaError":true}]},{"use":"cacheableResponse.CacheableResponsePlugin","config":[{"statuses":[0,200]}]}],"method":"GET"},{"urlPattern":".*aacdn.nagich.com/.*","handler":"StaleWhileRevalidate","strategyOptions":{"cacheName":"ada-cache"},"strategyPlugins":[{"use":"expiration.ExpirationPlugin","config":[{"maxAgeSeconds":259200,"purgeOnQuotaError":true}]},{"use":"cacheableResponse.CacheableResponsePlugin","config":[{"statuses":[0,200]}]}],"method":"GET"},{"urlPattern":".*.(?:png|gif|jpg|svg|jpeg|jpg_[0-9]*Wx[0-9]*H)$","handler":"CacheFirst","strategyOptions":{"cacheName":"images-cachefirst"},"strategyPlugins":[{"use":"expiration.ExpirationPlugin","config":[{"maxEntries":500,"maxAgeSeconds":2592000,"purgeOnQuotaError":true}]}],"method":"GET"},{"urlPattern":".*.(?:mp4|m4v|flv)$","handler":"CacheFirst","strategyOptions":{"cacheName":"videos-cache-mp4-m4v-flv"},"strategyPlugins":[{"use":"rangeRequests.RangeRequestsPlugin","config":[{"statuses":[0,200]}]},{"use":"expiration.ExpirationPlugin","config":[{"maxAgeSeconds":2592000,"purgeOnQuotaError":true}]}],"method":"GET"},{"urlPattern":".*/rest/v2/.*/products/(?!search).*fields=EMMA_PROD.*","handler":"StaleWhileRevalidate","strategyOptions":{"cacheName":"product-data"},"strategyPlugins":[{"use":"expiration.ExpirationPlugin","config":[{"maxAgeSeconds":3600,"purgeOnQuotaError":true}]}],"method":"GET"},{"urlPattern":".*/rest/v2/.*/products/(?!search).*fields=EMMA_STOCK_PRICE.*","handler":"StaleWhileRevalidate","strategyOptions":{"cacheName":"product-stock-price"},"strategyPlugins":[{"use":"expiration.ExpirationPlugin","config":[{"maxAgeSeconds":600,"purgeOnQuotaError":true}]}],"method":"GET"},{"urlPattern":".*/rest/v2/.*/products/(?!search).*fields=EMMA_REF.*","handler":"StaleWhileRevalidate","strategyOptions":{"cacheName":"product-references"},"strategyPlugins":[{"use":"expiration.ExpirationPlugin","config":[{"maxAgeSeconds":21600,"purgeOnQuotaError":true}]}],"method":"GET"},{"urlPattern":".*/rest/v2/.*/products/search.*","handler":"StaleWhileRevalidate","strategyOptions":{"cacheName":"product-category"},"strategyPlugins":[{"use":"expiration.ExpirationPlugin","config":[{"maxAgeSeconds":21600,"purgeOnQuotaError":true}]}],"method":"GET"},{"urlPattern":".*/rest/v2/.*/products/.*/stock","handler":"NetworkFirst","strategyOptions":{"cacheName":"product-stock-cache"},"strategyPlugins":[{"use":"expiration.ExpirationPlugin","config":[{"maxAgeSeconds":600,"purgeOnQuotaError":true}]}],"method":"GET"},{"urlPattern":".*/rest/v2/.*/users/.*","handler":"NetworkOnly","strategyOptions":{"cacheName":"no-cache-users"},"method":"GET","strategyPlugins":[]},{"urlPattern":".*/rest/v2/.*/securedcrm.*","handler":"NetworkOnly","strategyOptions":{"cacheName":"no-cache-crm"},"method":"GET","strategyPlugins":[]},{"urlPattern":".*/(checkout|cart|register|my-account|login).*$","handler":"NetworkOnly","strategyOptions":{"cacheName":"no-cache-page"},"method":"GET","strategyPlugins":[]},{"urlPattern":".*/emmaapi.*/.*$","handler":"StaleWhileRevalidate","strategyOptions":{"cacheName":"cms-cache"},"strategyPlugins":[{"use":"expiration.ExpirationPlugin","config":[{"maxAgeSeconds":43200,"purgeOnQuotaError":true}]},{"use":"cacheableResponse.CacheableResponsePlugin","config":[{"statuses":[0,200]}]}],"method":"GET"},{"urlPattern":"/_nuxt/","handler":"CacheFirst","method":"GET","strategyPlugins":[]},{"urlPattern":"/","handler":"NetworkFirst","method":"GET","strategyPlugins":[]}],"offlinePage":null,"pagesURLPattern":"/","offlineStrategy":"NetworkFirst"}

importScripts(...[options.workboxURL, ...options.importScripts])

initWorkbox(workbox, options)
workboxExtensions(workbox, options)
precacheAssets(workbox, options)
cachingExtensions(workbox, options)
runtimeCaching(workbox, options)
offlinePage(workbox, options)
routingExtensions(workbox, options)

function getProp(obj, prop) {
  return prop.split('.').reduce((p, c) => p[c], obj)
}

function initWorkbox(workbox, options) {
  if (options.config) {
    // Set workbox config
    workbox.setConfig(options.config)
  }

  if (options.cacheNames) {
    // Set workbox cache names
    workbox.core.setCacheNameDetails(options.cacheNames)
  }

  if (options.clientsClaim) {
    // Start controlling any existing clients as soon as it activates
    workbox.core.clientsClaim()
  }

  if (options.skipWaiting) {
    workbox.core.skipWaiting()
  }

  if (options.cleanupOutdatedCaches) {
    workbox.precaching.cleanupOutdatedCaches()
  }

  if (options.offlineAnalytics) {
    // Enable offline Google Analytics tracking
    workbox.googleAnalytics.initialize()
  }
}

function precacheAssets(workbox, options) {
  if (options.preCaching.length) {
    workbox.precaching.precacheAndRoute(options.preCaching, options.cacheOptions)
  }
}


function runtimeCaching(workbox, options) {
  const requestInterceptor = {
    requestWillFetch({ request }) {
      if (request.cache === 'only-if-cached' && request.mode === 'no-cors') {
        return new Request(request.url, { ...request, cache: 'default', mode: 'no-cors' })
      }
      return request
    },
    fetchDidFail(ctx) {
      ctx.error.message =
        '[workbox] Network request for ' + ctx.request.url + ' threw an error: ' + ctx.error.message
      console.error(ctx.error, 'Details:', ctx)
    },
    handlerDidError(ctx) {
      ctx.error.message =
        `[workbox] Network handler threw an error: ` + ctx.error.message
      console.error(ctx.error, 'Details:', ctx)
      return null
    }
  }

  for (const entry of options.runtimeCaching) {
    const urlPattern = new RegExp(entry.urlPattern)
    const method = entry.method || 'GET'

    const plugins = (entry.strategyPlugins || [])
      .map(p => new (getProp(workbox, p.use))(...p.config))

    plugins.unshift(requestInterceptor)

    const strategyOptions = { ...entry.strategyOptions, plugins }

    const strategy = new workbox.strategies[entry.handler](strategyOptions)

    workbox.routing.registerRoute(urlPattern, strategy, method)
  }
}

function offlinePage(workbox, options) {
  if (options.offlinePage) {
    // Register router handler for offlinePage
    workbox.routing.registerRoute(new RegExp(options.pagesURLPattern), ({ request, event }) => {
      const strategy = new workbox.strategies[options.offlineStrategy]
      return strategy
        .handle({ request, event })
        .catch(() => caches.match(options.offlinePage))
    })
  }
}

function workboxExtensions(workbox, options) {
  
}

function cachingExtensions(workbox, options) {
  
}

function routingExtensions(workbox, options) {
  
}

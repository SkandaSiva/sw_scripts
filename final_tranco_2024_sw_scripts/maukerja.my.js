const options = {"workboxURL":"https://cdn.jsdelivr.net/npm/workbox-cdn@5.1.4/workbox/workbox-sw.js","importScripts":[],"config":{"debug":false},"cacheOptions":{"cacheId":"mkrb2.0-prod","directoryIndex":"/","revision":"6TmPbGXL5CNU"},"clientsClaim":true,"skipWaiting":true,"cleanupOutdatedCaches":true,"offlineAnalytics":false,"preCaching":[{"revision":"6TmPbGXL5CNU","url":"/?standalone=true"}],"runtimeCaching":[{"urlPattern":"/mkrbapi/.*","handler":"NetworkFirst","strategyOptions":{"cacheName":"my-api-cache","cacheableResponse":{"statuses":[0,200]}},"method":"GET","strategyPlugins":[]},{"urlPattern":"/v3mkapi/jobseekers/profile/public-summary/.*","handler":"NetworkOnly","method":"GET","strategyPlugins":[]},{"urlPattern":"/v3mkapi/.*","handler":"NetworkFirst","strategyOptions":{"cacheName":"my-api-cache","cacheableResponse":{"statuses":[0,200]}},"method":"GET","strategyPlugins":[]},{"urlPattern":"/matching/.*","handler":"NetworkFirst","strategyOptions":{"cacheName":"my-api-cache","cacheableResponse":{"statuses":[0,200]}},"method":"GET","strategyPlugins":[]},{"urlPattern":"/api/.*","handler":"NetworkFirst","strategyOptions":{"cacheName":"my-api-cache","cacheableResponse":{"statuses":[0,200]}},"method":"GET","strategyPlugins":[]},{"urlPattern":"https://(s3-|s3.)?(.*).amazonaws.com/.*","handler":"CacheFirst","strategyOptions":{"cacheName":"s3","cacheExpiration":{"maxEntries":100,"maxAgeSeconds":3600}},"method":"GET","strategyPlugins":[]},{"urlPattern":"https://files.ajobthing.com/.*","handler":"CacheFirst","strategyOptions":{"cacheName":"s3","cacheExpiration":{"maxEntries":100,"maxAgeSeconds":3600}},"method":"GET","strategyPlugins":[]},{"urlPattern":"/.(?:png|jpg|jpeg|svg|gif|ico|woff|woff2|css|smartlook|facebook)$/","handler":"CacheFirst","strategyOptions":{"cacheName":"static-assets","cacheExpiration":{"maxEntries":100,"maxAgeSeconds":3600}},"method":"GET","strategyPlugins":[]},{"urlPattern":"https://revgeocode.search.hereapi.com/v1/.*","handler":"CacheFirst","strategyOptions":{"cacheName":"geocoding","cacheExpiration":{"maxEntries":100,"maxAgeSeconds":3600}},"method":"GET","strategyPlugins":[]},{"urlPattern":"/_nuxt/","handler":"CacheFirst","method":"GET","strategyPlugins":[]},{"urlPattern":"/","handler":"NetworkFirst","method":"GET","strategyPlugins":[]}],"offlinePage":null,"pagesURLPattern":"/","offlineStrategy":"NetworkFirst"}

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

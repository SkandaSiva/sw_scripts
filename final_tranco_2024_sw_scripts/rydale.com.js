const options = {"workboxURL":"https://cdn.jsdelivr.net/npm/workbox-cdn@5.1.4/workbox/workbox-sw.js","importScripts":["https://cdn.pushalert.co/sw-8782.js"],"config":{"debug":false},"cacheOptions":{"cacheId":"ecommerce-front-end-prod","directoryIndex":"/","revision":"vr9XGWi4Ljw6"},"clientsClaim":true,"skipWaiting":true,"cleanupOutdatedCaches":true,"offlineAnalytics":false,"preCaching":[{"revision":"vr9XGWi4Ljw6","url":"/?standalone=true"}],"runtimeCaching":[{"urlPattern":"undefined/.*","handler":"NetworkFirst","strategyOptions":{"cacheName":"api","cacheExpiration":{"maxEntries":10,"maxAgeSeconds":3600},"cacheableResponse":{"statuses":[0,200]}},"method":"GET","strategyPlugins":[]},{"urlPattern":"https://cdn.rydalestagingenvironment.com/media/.*","handler":"CacheFirst","strategyOptions":{"cacheName":"media","cacheExpiration":{"maxEntries":60,"maxAgeSeconds":2592000},"cacheableResponse":{"statuses":[0,200]}},"method":"GET","strategyPlugins":[]},{"urlPattern":"https://imagedelivery.net/qQVYSIvyXiV4MHZje7HLkA/.*","handler":"CacheFirst","strategyOptions":{"cacheName":"cd_media","cacheExpiration":{"maxEntries":60,"maxAgeSeconds":2592000},"cacheableResponse":{"statuses":[0,200]}},"method":"GET","strategyPlugins":[]},{"urlPattern":"https://fonts.googleapis.com/.*","handler":"StaleWhileRevalidate","strategyOptions":{"cacheName":"google-fonts-stylesheets"},"method":"GET","strategyPlugins":[]},{"urlPattern":"https://fonts.gstatic.com/.*","handler":"CacheFirst","strategyOptions":{"cacheName":"google-fonts-webfonts","cacheExpiration":{"maxEntries":10,"maxAgeSeconds":31536000},"cacheableResponse":{"statuses":[0,200]}},"method":"GET","strategyPlugins":[]},{"urlPattern":"https://connect.facebook.net/.*","handler":"StaleWhileRevalidate","strategyOptions":{"cacheName":"facebook-sdk"},"method":"GET","strategyPlugins":[]},{"urlPattern":"https://www.google-analytics.com/.*","handler":"StaleWhileRevalidate","strategyOptions":{"cacheName":"google-analytics"},"method":"GET","strategyPlugins":[]},{"urlPattern":"https://www.googletagmanager.com/.*","handler":"StaleWhileRevalidate","strategyOptions":{"cacheName":"google-tag-manager"},"method":"GET","strategyPlugins":[]},{"urlPattern":"/_nuxt/","handler":"CacheFirst","method":"GET","strategyPlugins":[]},{"urlPattern":"/","handler":"NetworkFirst","method":"GET","strategyPlugins":[]}],"offlinePage":null,"pagesURLPattern":"/","offlineStrategy":"NetworkFirst"}

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

const options = {"workboxURL":"https://cdn.jsdelivr.net/npm/workbox-cdn@5.1.4/workbox/workbox-sw.js","importScripts":[],"config":{"debug":false},"clientsClaim":true,"skipWaiting":true,"cleanupOutdatedCaches":true,"offlineAnalytics":false,"preCaching":["/?standalone=true"],"runtimeCaching":[{"urlPattern":"^https://eataly-bbb.cdn.prismic.io/api/v2/.*(menu_structure|megadropdown_menu_content|footer_content).*","strategyOptions":{"cacheName":"PrismicMenuCustomTypes"},"handler":"CacheFirst","strategyPlugins":[{"use":"expiration.ExpirationPlugin","config":[{"maxEntries":20,"maxAgeSeconds":3600}]}],"method":"GET"},{"urlPattern":"^https://eataly-bbb.cdn.prismic.io/api/v2/.*(?<!my.)(?:news_filtered)(?!.[a-z_]).*","strategyOptions":{"cacheName":"PrismicNewsFiltered"},"handler":"CacheFirst","strategyPlugins":[{"use":"expiration.ExpirationPlugin","config":[{"maxEntries":20,"maxAgeSeconds":900}]}],"method":"GET"},{"urlPattern":"^https://eataly-bbb.cdn.prismic.io/api/v2/.*(category_content).*","strategyOptions":{"cacheName":"PrismicCategoryContent"},"handler":"CacheFirst","strategyPlugins":[{"use":"expiration.ExpirationPlugin","config":[{"maxEntries":20,"maxAgeSeconds":3600}]}],"method":"GET"},{"handler":"NetworkFirst","method":"GET","strategyPlugins":[]},{"handler":"NetworkFirst","method":"GET","strategyPlugins":[]},{"urlPattern":"^https://fonts.googleapis.com/.*","handler":"NetworkFirst","method":"GET","strategyPlugins":[]},{"urlPattern":"^https://cdn.jsdelivr.net/.*","handler":"NetworkFirst","method":"GET","strategyPlugins":[]},{"urlPattern":"^https://track.adform.net/.*","handler":"NetworkOnly","method":"GET","strategyPlugins":[]},{"urlPattern":"^https://sslwidget.criteo.com/.*","handler":"NetworkOnly","method":"GET","strategyPlugins":[]},{"urlPattern":"https://connect.facebook.net/en_US/sdk.js$","handler":"NetworkOnly","method":"GET","strategyPlugins":[]},{"urlPattern":"^https://connect.facebook.net/.*","handler":"NetworkOnly","method":"GET","strategyPlugins":[]},{"urlPattern":"https://eataly-bbb.cdn.prismic.io/api/v2$","handler":"NetworkOnly","method":"GET","strategyPlugins":[]},{"urlPattern":"^undefined/.*","handler":"NetworkOnly","method":"GET","strategyPlugins":[]},{"urlPattern":"^https://www.google-analytics.com/.*","handler":"NetworkOnly","method":"GET","strategyPlugins":[]},{"urlPattern":"/cdn/8633234616990176f7804d0625270ab03721b74e/","handler":"CacheFirst","method":"GET","strategyPlugins":[]},{"urlPattern":"/","handler":"NetworkFirst","method":"GET","strategyPlugins":[]}],"offlinePage":null,"pagesURLPattern":"/","offlineStrategy":"NetworkFirst"}

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
  for (const entry of options.runtimeCaching) {
    const urlPattern = new RegExp(entry.urlPattern)
    const method = entry.method || 'GET'

    const plugins = (entry.strategyPlugins || [])
      .map(p => new (getProp(workbox, p.use))(...p.config))

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

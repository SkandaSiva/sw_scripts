const options = {"workboxURL":"/workbox/workbox-sw.js?1730303688542","importScripts":[],"config":{"modulePathPrefix":"/workbox","debug":false},"cacheOptions":{"cacheId":"typo3-queisser-ng-prod","directoryIndex":"/","revision":"wek28tmeXQ9F"},"clientsClaim":true,"skipWaiting":true,"cleanupOutdatedCaches":true,"offlineAnalytics":false,"preCaching":[],"runtimeCaching":[{"urlPattern":"/_nuxt/","handler":"CacheFirst","method":"GET","strategyOptions":{"cacheName":"nuxt-assets-cache-3.21.0"},"strategyPlugins":[{"use":"expiration.ExpirationPlugin","config":[{"maxEntries":80,"maxAgeSeconds":86400}]},{"use":"cacheableResponse.CacheableResponsePlugin","config":[{"statuses":[0,200]}]}]},{"urlPattern":"https://api.demo.doppelherz.de/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.ae/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz-algeria.com/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.at/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.ba/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.bg/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.ch/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.cm/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.co.ao/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.co.id/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.co.kr/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.co.uk/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.co.za/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.com/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.com.gh/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.com.kw/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.com.tr/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.cz/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.de/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.dj/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.dk/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.ee/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.eg/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.es/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.fr/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.ge/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.gr/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.hr/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.hu/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz-iraq.com/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.it/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz-lithuania.com/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.lv/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.ma/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.me/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.mk/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.ng/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.pl/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.pt/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.qa/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.ro/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.rs/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.ru/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.sg/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.si/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz-southkorea.com/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.tn/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.tw/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.ua/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.ug/.*headless\\.json\\?tx_powermail_pi1|https://api.doppelherz.uz/.*headless\\.json\\?tx_powermail_pi1|https://api.litozin.de/.*headless\\.json\\?tx_powermail_pi1|https://api.queisser.bg/.*headless\\.json\\?tx_powermail_pi1|https://api.queisser.com/.*headless\\.json\\?tx_powermail_pi1|https://api.queisser.de/.*headless\\.json\\?tx_powermail_pi1|https://api.queisser.pl/.*headless\\.json\\?tx_powermail_pi1|https://api.queisser.ro/.*headless\\.json\\?tx_powermail_pi1|https://api.queisser.ua/.*headless\\.json\\?tx_powermail_pi1","handler":"NetworkOnly","method":"POST","strategyOptions":{"cacheName":"powermail-cache"},"strategyPlugins":[{"use":"backgroundSync.BackgroundSyncPlugin","config":["powermail-sync"]}]},{"urlPattern":"https://api.demo.doppelherz.de/(?!.*type=12511251).*$|https://api.doppelherz.ae/(?!.*type=12511251).*$|https://api.doppelherz-algeria.com/(?!.*type=12511251).*$|https://api.doppelherz.at/(?!.*type=12511251).*$|https://api.doppelherz.ba/(?!.*type=12511251).*$|https://api.doppelherz.bg/(?!.*type=12511251).*$|https://api.doppelherz.ch/(?!.*type=12511251).*$|https://api.doppelherz.cm/(?!.*type=12511251).*$|https://api.doppelherz.co.ao/(?!.*type=12511251).*$|https://api.doppelherz.co.id/(?!.*type=12511251).*$|https://api.doppelherz.co.kr/(?!.*type=12511251).*$|https://api.doppelherz.co.uk/(?!.*type=12511251).*$|https://api.doppelherz.co.za/(?!.*type=12511251).*$|https://api.doppelherz.com/(?!.*type=12511251).*$|https://api.doppelherz.com.gh/(?!.*type=12511251).*$|https://api.doppelherz.com.kw/(?!.*type=12511251).*$|https://api.doppelherz.com.tr/(?!.*type=12511251).*$|https://api.doppelherz.cz/(?!.*type=12511251).*$|https://api.doppelherz.de/(?!.*type=12511251).*$|https://api.doppelherz.dj/(?!.*type=12511251).*$|https://api.doppelherz.dk/(?!.*type=12511251).*$|https://api.doppelherz.ee/(?!.*type=12511251).*$|https://api.doppelherz.eg/(?!.*type=12511251).*$|https://api.doppelherz.es/(?!.*type=12511251).*$|https://api.doppelherz.fr/(?!.*type=12511251).*$|https://api.doppelherz.ge/(?!.*type=12511251).*$|https://api.doppelherz.gr/(?!.*type=12511251).*$|https://api.doppelherz.hr/(?!.*type=12511251).*$|https://api.doppelherz.hu/(?!.*type=12511251).*$|https://api.doppelherz-iraq.com/(?!.*type=12511251).*$|https://api.doppelherz.it/(?!.*type=12511251).*$|https://api.doppelherz-lithuania.com/(?!.*type=12511251).*$|https://api.doppelherz.lv/(?!.*type=12511251).*$|https://api.doppelherz.ma/(?!.*type=12511251).*$|https://api.doppelherz.me/(?!.*type=12511251).*$|https://api.doppelherz.mk/(?!.*type=12511251).*$|https://api.doppelherz.ng/(?!.*type=12511251).*$|https://api.doppelherz.pl/(?!.*type=12511251).*$|https://api.doppelherz.pt/(?!.*type=12511251).*$|https://api.doppelherz.qa/(?!.*type=12511251).*$|https://api.doppelherz.ro/(?!.*type=12511251).*$|https://api.doppelherz.rs/(?!.*type=12511251).*$|https://api.doppelherz.ru/(?!.*type=12511251).*$|https://api.doppelherz.sg/(?!.*type=12511251).*$|https://api.doppelherz.si/(?!.*type=12511251).*$|https://api.doppelherz-southkorea.com/(?!.*type=12511251).*$|https://api.doppelherz.tn/(?!.*type=12511251).*$|https://api.doppelherz.tw/(?!.*type=12511251).*$|https://api.doppelherz.ua/(?!.*type=12511251).*$|https://api.doppelherz.ug/(?!.*type=12511251).*$|https://api.doppelherz.uz/(?!.*type=12511251).*$|https://api.litozin.de/(?!.*type=12511251).*$|https://api.queisser.bg/(?!.*type=12511251).*$|https://api.queisser.com/(?!.*type=12511251).*$|https://api.queisser.de/(?!.*type=12511251).*$|https://api.queisser.pl/(?!.*type=12511251).*$|https://api.queisser.ro/(?!.*type=12511251).*$|https://api.queisser.ua/(?!.*type=12511251).*$","handler":"StaleWhileRevalidate","method":"GET","strategyOptions":{"cacheName":"api-response-cache-3.x"},"strategyPlugins":[{"use":"expiration.ExpirationPlugin","config":[{"maxEntries":20,"maxAgeSeconds":3600}]},{"use":"cacheableResponse.CacheableResponsePlugin","config":[{"statuses":[0,200,404]}]}]},{"urlPattern":"https://pim.doppelherz.de/|https://pim.doppelherz.ae/|https://pim.doppelherz-algeria.com/|https://pim.doppelherz.at/|https://pim.doppelherz.ba/|https://pim.doppelherz.bg/|https://pim.doppelherz.ch/|https://pim.doppelherz.cm/|https://pim.doppelherz.co.ao/|https://pim.doppelherz.co.id/|https://pim.doppelherz.co.kr/|https://pim.doppelherz.co.uk/|https://pim.doppelherz.co.za/|https://pim.doppelherz.com/|https://pim.doppelherz.com.gh/|https://pim.doppelherz.com.kw/|https://pim.doppelherz.com.tr/|https://pim.doppelherz.cz/|https://pim.doppelherz.de/|https://pim.doppelherz.dj/|https://pim.doppelherz.dk/|https://pim.doppelherz.ee/|https://pim.doppelherz.eg/|https://pim.doppelherz.es/|https://pim.doppelherz.fr/|https://pim.doppelherz.ge/|https://pim.doppelherz.gr/|https://pim.doppelherz.hr/|https://pim.doppelherz.hu/|https://pim.doppelherz-iraq.com/|https://pim.doppelherz.it/|https://pim.doppelherz-lithuania.com/|https://pim.doppelherz.lv/|https://pim.doppelherz.ma/|https://pim.doppelherz.me/|https://pim.doppelherz.mk/|https://pim.doppelherz.ng/|https://pim.doppelherz.pl/|https://pim.doppelherz.pt/|https://pim.doppelherz.qa/|https://pim.doppelherz.ro/|https://pim.doppelherz.rs/|https://pim.doppelherz.ru/|https://pim.doppelherz.sg/|https://pim.doppelherz.si/|https://pim.doppelherz-southkorea.com/|https://pim.doppelherz.tn/|https://pim.doppelherz.tw/|https://pim.doppelherz.ua/|https://pim.doppelherz.ug/|https://pim.doppelherz.uz/|https://pim.litozin.de/|https://pim.queisser.bg/|https://pim.queisser.com/|https://pim.queisser.de/|https://pim.queisser.pl/|https://pim.queisser.ro/|https://pim.queisser.ua/","handler":"StaleWhileRevalidate","method":"GET","strategyOptions":{"cacheName":"pim-assets-cache"},"strategyPlugins":[{"use":"expiration.ExpirationPlugin","config":[{"maxEntries":80,"maxAgeSeconds":86400}]},{"use":"cacheableResponse.CacheableResponsePlugin","config":[{"statuses":[0,200]}]}]},{"urlPattern":"/","handler":"NetworkFirst","method":"GET","strategyPlugins":[]}],"offlinePage":null,"pagesURLPattern":"/","offlineStrategy":"NetworkFirst"}

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

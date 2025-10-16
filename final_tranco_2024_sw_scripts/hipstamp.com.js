const options = {"workboxURL":"https://cdn.jsdelivr.net/npm/workbox-cdn@5.1.4/workbox/workbox-sw.js","importScripts":[],"config":{"debug":false},"cacheOptions":{"cacheId":"@hipecommerce/hipstamp-prod","directoryIndex":"/","revision":"3A6nrRsZfqtW"},"clientsClaim":true,"skipWaiting":true,"cleanupOutdatedCaches":true,"offlineAnalytics":false,"preCaching":[{"revision":"3A6nrRsZfqtW","url":"https://www.hipstamp.com/?standalone=true"}],"runtimeCaching":[{"urlPattern":"https://cdn.hipecommerce.com/","handler":"CacheFirst","strategyPlugins":[{"use":"cacheableResponse.CacheableResponsePlugin","config":[{"statuses":[0,200]}]}],"method":"GET"},{"urlPattern":"/","handler":"NetworkFirst","method":"GET","strategyPlugins":[]}],"offlinePage":null,"pagesURLPattern":"/","offlineStrategy":"NetworkFirst"}

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
  // This file contains Workbox custom code configuration
// see https://developers.google.com/web/tools/workbox/guides/configure-workbox
// Routes registered here will be before generated routes
/* eslint-disable no-undef */

// Clear manifest start_url from pre-caching - no value
options.preCaching = []

// Disable Workbox caching for any requests where the header is being removed,
// otherwise we might end up returning them outside of the Nuxt SPA and they
// won't have the surround.
workbox.routing.registerRoute(
  ({ request }) => request.headers.has('x-no-header'),
  new workbox.strategies.NetworkOnly(),
)

// Integration needs to update URL patterns
if (location.host.includes('int')) {
  options.runtimeCaching.forEach((cache) => {
    cache.urlPattern = cache.urlPattern
      .replace('/cdn.', '/cdn-int.')
      .replace('/mc-api.', '/mc-api-int.')
      .replace('/catalog.', '/catalog-int.')
  })
}

/* eslint-disable no-undef */
// This file contains Workbox custom code configuration
// see https://developers.google.com/web/tools/workbox/guides/configure-workbox

// Identify an API that fails due to being offline (and without cache)
const offlineApiHeaders = { 'X-Offline': true }
// Decide which offline cache should be returned
const getOfflinePageCache = (url) => {
  const isMyC = url.pathname.includes('/my')
  return `${isMyC ? '/my' : ''}/offline`
}

// Capacitor App detection from User Agent
const ua = navigator.userAgent
const isAndroidApp = ua.includes('Android') && ua.includes(' Version/')
const isiOSApp =
  ua.includes('OS X') && ua.includes(' Mobile/') && !ua.includes(' Safari/')
const isApp = isAndroidApp || isiOSApp

const isHipComic = location.host.includes('hipcomic')

// Define the exclusion pattern for specific URLs
const excludePattern = /\/activities\?user|\/[a-zA-Z0-9_-]+\/[a-f0-9]{32}.*/

const spiderCaching = {
  // What URLs should the spider caching spider?
  urls: (clientUrl) => [
    ...(!isApp
      ? [`/${clientUrl.includes('standalone') ? '?standalone=true' : ''}`]
      : []),
    ...(isHipComic ? ['/my'] : []),
    ...(isHipComic && !isApp ? ['/my/offline'] : []),
    ...(!isApp ? ['/offline'] : []),
  ],
  // How to find other resources in the HTML
  links: /(href=|src=)"([^"]+)"/g,
  // Mapping out the right capture group
  linksMap: (m) => m[2],
  // Filter resources to only necessary ones
  linkPrefixes: [
    '/_nuxt/',
    'https://cdn.hipecommerce.com/',
    'https://cdn-int.hipecommerce.com/',
    '/nxt-static/',
  ],
  // CacheFirst strategy means no request will be made if already cached
  // response plugin means no-cors responses can be cached.
  // NOTE: This has no impact on the runtime caching strategy, just a mechanism
  // for preloading cache.
  strategy: new workbox.strategies.CacheFirst({
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      {
        cacheWillUpdate: async ({ request, response }) => {
          const url = new URL(request.url)
          if (excludePattern.test(url.pathname)) {
            wbLog(`Excluding from cache: ${url.pathname}`)
            return null
          }
          // Check if the response is valid and not opaque
          if (!response || response.type === 'opaque') {
            return null // Don't cache if response is not valid
          }
          if (response.headers.get('Vary') === '*') {
            console.warn(
              `Skipping cache for ${request.url} due to Vary: * header`,
            )
            return null
          }
          // Check for error responses 403
          if (response.status === 403) {
            wbLog(
              `Error response received for: ${url.pathname}, status: ${response.status}`,
            )
            const cache = await caches.open(workbox.core.cacheNames.runtime)
            await cache.delete(request)
            wbLog(`Cache deleted for: ${url.pathname}. Retrying request...`)
            try {
              const freshResponse = await fetch(request)
              if (freshResponse.ok) {
                cache.put(request, freshResponse.clone())
                wbLog(`Successfully retried and cached: ${url.pathname}`)
                return freshResponse
              } else {
                wbLog(
                  `Retry failed for: ${url.pathname}, status: ${freshResponse.status}`,
                )
                return freshResponse
              }
            } catch (error) {
              wbLog(`Retry error for: ${url.pathname}, error: ${error.message}`)
              return response // Return the original error response if retry fails
            }
          }
          return response
        },
      },
    ],
  }),
  // Last cache wipe date - this will clear out older caches, change this date to
  // today to force offline pages to be cached again
  wipeDate: new Date('Mon, 12 Aug 2024 19:20:00 GMT'),
}

// Logging copied from Workbox internals
const styles = [
  `background: #7f8c8d`, // Gray
  `border-radius: 0.5em`,
  `color: white`,
  `font-weight: bold`,
  `padding: 2px 0.5em`,
]
const wbLog = options.config.debug
  ? // eslint-disable-next-line no-console
    (text) => console.debug('%cworkbox', styles.join(';'), text)
  : () => {}

// Iterates the caches, does some cleanup and returns the runtime cache
const processCaches = async () => {
  let runtimeCache
  const cacheKeys = await caches.keys()
  cacheKeys.forEach((key) => {
    if (key.startsWith('workbox-runtime')) {
      runtimeCache = key
    }
    // Delete any older caches we no longer need
    else if (key.startsWith('workbox-precache')) {
      caches.delete(key)
    }
  })
  // Open the cache from the key
  if (!runtimeCache) {
    return
  }
  const openedCache = await caches.open(runtimeCache)
  // Clean up any opaque manifest caches
  const keys = await openedCache.keys()
  const manifestReqs = keys.filter((req) => req.url.includes('manifest'))
  await Promise.all(
    manifestReqs.map(async (manifestReq) => {
      const manifestResp = await openedCache.match(manifestReq)
      if (!manifestResp.body) {
        await openedCache.delete(manifestReq)
      }
    }),
  )
  return openedCache
}

const expireStaleSpiderCache = async (runtimeCache, request) => {
  const resp = await runtimeCache.match(request)
  if (resp) {
    const cacheDate = new Date(resp.headers.get('date'))
    if (cacheDate.getTime() < spiderCaching.wipeDate.getTime()) {
      wbLog(`Clearing old cache for: ${request.url}`)
      await runtimeCache.delete(request)
    }
  }
}

const runSpiderCaching = async () => {
  const clientUrl = (await self.clients.matchAll())?.[0]?.url

  const runtimeCache = await processCaches()

  wbLog('Starting Spider Caching')
  const promises = spiderCaching.urls(clientUrl).map(async (url) => {
    wbLog(`Spidering: ${url}`)
    const request = new Request(url)
    // Check for cache age
    if (runtimeCache) {
      await expireStaleSpiderCache(runtimeCache, request)
    }
    const resp = await spiderCaching.strategy.handle({ request })
    const content = await resp.text()
    const urls = Array.from(content.matchAll(spiderCaching.links)).map(
      spiderCaching.linksMap,
    )
    return urls.filter((url) =>
      spiderCaching.linkPrefixes.some((prefix) => url.startsWith(prefix)),
    )
  })
  const results = await Promise.all(promises)
  // Flatten and unique
  const rsrcs = [...new Set(results.flat())]

  wbLog(`${rsrcs.length} Spidered resources`)
  rsrcs.forEach((rsrc) =>
    spiderCaching.strategy.handle({
      // No Cors as we can use opaque responses - except for the json manifest
      request: new Request(rsrc, {
        mode: rsrc.includes('manifest') ? 'cors' : 'no-cors',
      }),
    }),
  )
}

// Once within the lifespan of this worker we have checked for
// precaching, we use a volatile in-memory variable to avoid repeatedly
// checking the precache flag in cache for each fetch
let precachingDone = false

// When the SW activates we set a persistent flag (a new empty cache)
// this will be read one the next fetch
self.addEventListener('activate', async () => {
  await caches.open('flag-precache-pending') // creates the empty cache
  precachingDone = false
})

// Fetch events will only fire on page interaction or a refresh, this
// stops us impacting Lighthouse performance
self.addEventListener('fetch', async () => {
  if (!precachingDone) {
    if (caches.has('flag-precache-pending')) {
      precachingDone = true
      await caches.delete('flag-precache-pending')
      runSpiderCaching()
    }
  }
})

// When a request fails it generally means offline, anything else
// would be a response from the server (even a timeout)
workbox.routing.setCatchHandler(async ({ url, request }) => {
  // We can't offer offline responses for anything other than a GET request
  if (request.method === 'GET') {
    // Handle API response first
    if (request.headers.get('accept')?.includes('application/json')) {
      wbLog(`Returning Offline API Response: ${url}`)
      return new Response('', { status: 504, headers: offlineApiHeaders })
    }
    // not a file request (i.e. page not resource)
    else if (!url.pathname.includes('.')) {
      wbLog(`Returning Offline Page Redirect: ${url}`)
      const hasCache = await caches.match(getOfflinePageCache(url))
      if (hasCache) {
        return Response.redirect(
          `https://${url.host}${getOfflinePageCache(url)}`,
          302,
        )
      }
    }
  }
})
}

function cachingExtensions(workbox, options) {
  
}

function routingExtensions(workbox, options) {
  
}

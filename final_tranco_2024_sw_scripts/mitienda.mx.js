 
  console.log('[custom-sw] Header of service worker')
  console.log(">>>>>SCRIPT EXPONEA")
  importScripts('https://api.exponea.com/js/service-worker.min.js');

 
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js'
  )
   
  importScripts('https://vtex.vtexassets.com/_v/public/assets/v1/npm/idb@2.1.3/lib/idb.js')
  

  if (!workbox) { 
    console.log("Boo! Workbox didn't load 😬")
  } else { 
    console.log('Yay! Workbox is loaded 🎉')

    const sessionDB = 'session'

    const cacheKeyDB = 'cacheKey'

    const sessionTable = 'session'

    const cacheKeyTable = 'cacheKey'

    const WHITELIST_QS_PARAMS = new Set([
      'utm_source',
      'utm_campaign',
      'utmi_campaign',
      'utmi_cp',
      '__disableSSR',
      'map',
      'order',
      'priceRange',
      'fq',
      'ft',
      'sc',
      'workspace',
      'homescreen',
    ])

    
    const handleError = async err => {
      console.error(err)
    }

    const handleErrorDB = async (db, table, err) => {
      console.error(
        `Failed to execute query on DB ${db} on table ${table}.`,
        '\\n',
        err
      )
    } 

    const database = {
      open(dbname, table, keys) {
        return idb.open(dbname, 1, upgradeDb => {
          if (upgradeDb.objectStoreNames.contains(table)) {
            return
          }

          const objectOS = upgradeDb.createObjectStore(table, {
            keyPath: keys,
          })
          objectOS.createIndex(keys, keys, {
            unique: true,
          })
        })
      }, 
      async get(dbPromise, dbname, table, key) {
        const db = await dbPromise
        const tx = db.transaction(dbname, 'readonly')
        const store = tx.objectStore(table)
        return store.get(key)
      }, 
      async set(dbPromise, dbname, table, data) {
        const db = await dbPromise
        const tx = db.transaction(dbname, 'readwrite')
        const store = tx.objectStore(table)

        try {
          return await Promise.all(data.map(val => store.put(val)))
        } catch (err) {
          tx.abort()
          throw Error(`Events were not added to the store. ${err}`)
        }
      },
      async close(dbPromise) {
        try {
          const db = await dbPromise
          db.close()
        } catch (err) {
          console.error(
            `Failed to close connection to database ${dbPromise.name}`,
            '\\n',
            err
          )
        }
      },
    } 

    const dbConnections = {
      session() {
        return database.open(sessionDB, sessionTable, 'name')
      },
      cacheKey() {
        return database.open(cacheKeyDB, cacheKeyTable, 'url')
      },
    }

    const setSession = async response => {
      const res = response.clone()
      const data = await res.json()

      if (!data) {
        return
      }
      const event = [
        {
          name: 'segmentToken',
          value: data.segmentToken,
        },
        {
          name: 'sessionToken',
          value: data.sessionToken,
        },
      ]

      const sessionConnection = dbConnections.session()
      try {
        await database.set(sessionConnection, sessionDB, sessionTable, event)
        database.close(sessionConnection)
      } catch (err) {
        handleErrorDB(sessionDB, sessionTable, err)
      }
    }

    const getClient = async () => { 
      const clients = await self.clients.matchAll({
        type: 'window',
      })
      return clients.find(client => client.visibilityState === 'visible')
    } 

    const validateCache = async request => {
      try {
        const regexMatch = request.url.match(/.*(?:no-cache|_secure).*/)

        const sessionConnection = dbConnections.session()

        const cacheKeyConnection = dbConnections.cacheKey()

        const cacheKeyValue = await database.get(
          cacheKeyConnection,
          cacheKeyDB,
          cacheKeyTable,
          request.url.split('?')[0]
        )
        let cacheKeyIsEqual = true

        const segmentValue = await database.get(
          sessionConnection,
          sessionDB,
          sessionTable,
          regexMatch ? 'sessionToken' : 'segmentToken'
        )

        const segmentKV = [
          {
            url: request.url.split('?')[0],
            value: segmentValue ? segmentValue.value : null,
          },
        ]
        if (cacheKeyValue && segmentValue) {
          if (
            !(
              cacheKeyValue.value === segmentValue.value &&
              cacheKeyValue.value != null &&
              segmentValue.value != null
            )
          ) {
            cacheKeyIsEqual = false
            database
              .set(cacheKeyConnection, cacheKeyDB, cacheKeyTable, segmentKV)
              .catch(err => handleErrorDB(cacheKeyDB, cacheKeyTable, err))
          }
        }
        database.close(cacheKeyConnection)
        database.close(sessionConnection)
        return cacheKeyIsEqual
      } catch (err) {
        handleError(err)
        return false
      }
    } 

    const validateQueryString = async requestUrl => {
      const url = new URL(requestUrl)
      const newUrl = new URL(url.href.split('?')[0])
      if (url.search.length > 0) {
        for (const param of url.searchParams.entries()) {
          if (WHITELIST_QS_PARAMS.has(param[0].toLowerCase())) {
            newUrl.searchParams.append(param[0], param[1])
          }
        }
      }
      return newUrl
    }

    

    const debug = '{{ DEBUG }}' === 'true'

    workbox.setConfig({ debug })
    workbox.core.skipWaiting()
    workbox.core.clientsClaim()
    workbox.navigationPreload.enable()
    workbox.core.setCacheNameDetails({
      prefix: 'VTEX-',
    })

    workbox.googleAnalytics.initialize({
      parameterOverrides: {
        cd1: 'offline',
      },
    })

    

    const isSuccess = status => status >= 200 && status < 300
    const cacheSuccessPlugin = {
      cacheWillUpdate: async ({ response }) =>
        isSuccess(response.status) ? response : null,
    }

    const shouldCacheOrUseCache = {
      cacheWillUpdate: async ({ response }) => {
        if (!response) {
          return
        }
        const cacheControlHeader = response.headers.get('cache-control')
        return cacheControlHeader && cacheControlHeader.includes('no-cache')
          ? null
          : response
      },
      cachedResponseWillBeUsed: async ({ request, cachedResponse }) => {
        if (cachedResponse) {
          return (await validateCache(request)) ? cachedResponse : null
        }
        const client = await getClient()
        if (client && request.url.split('?')[0] === client.url.split('?')[0]) {
          return null
        }

        const filteredUrl = await validateQueryString(request.url)
        const cachedMatch = await caches.match(filteredUrl.href, {
          ignoreSearch: true,
        })
        return cachedMatch || null
      },
    }

    const apiCacheHandler = {
      cacheWillUpdate: async ({ response }) => {
        if (response.status !== 206) {
          return response
        }
        const init = {
          status: '200',
          statusText: 'OK',
          headers: response.headers,
        }
        const body = await response.text()
        return new Response(body, init)
      },
    }

    

      
    const defaultHandler = new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'doc',
      plugins: [cacheSuccessPlugin, shouldCacheOrUseCache],
    })

    const networkOnlyHandler = new workbox.strategies.NetworkOnly()

    const networkFirstHandler = new workbox.strategies.NetworkFirst({
      plugins: [cacheSuccessPlugin],
    })

    const apiHandler = new workbox.strategies.NetworkFirst({
      cacheName: 'api',
      plugins: [cacheSuccessPlugin, apiCacheHandler],
    })

    const defaultFallbackStrategy = async ({ event, url }) => { 
      if (url.host === location.hostname) {
        try {
          const response = await networkFirstHandler.handle({ event })

          const key = 'segmentToken'

          const sessionConnection = dbConnections.session()

          const cacheKeyConnection = dbConnections.cacheKey()

          const segment = await database.get(
            sessionConnection,
            sessionDB,
            sessionTable,
            key
          )
          database.close(sessionConnection)
          if (response && segment) {
            const arrKV = [
              {
                url: response.url.split('?')[0],
                value: segment.value,
              },
            ]
            database.set(cacheKeyConnection, cacheKeyDB, cacheKeyTable, arrKV)
            database.close(cacheKeyConnection)
          }
          return response
        } catch (err) {
          handleErrorDB(sessionDB, sessionTable, err)
        }
      } else {
        return networkOnlyHandler.handle({ event })
      }
    }

    const sessionStrategy = async ({ event }) => {
      if (event.request.method === 'POST') {
        return fetch(event.request).then(response => {
          setSession(response)
          return response
        })
      }
      return fetch(event.request)
    }

    const imagesHandler = new workbox.strategies.CacheFirst({
      cacheName: 'img',
      plugins: [
        cacheSuccessPlugin,
        new workbox.expiration.Plugin({
          maxEntries: 500, 
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ],
    })

    const rcHandler = event => {
      const fallbackResponse = new Response('', {
        headers: {
          'Access-Control-Allow-Headers':
            'Content-Type, Authorization, Content-Length, X-Requested-With',
          'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
          'Access-Control-Allow-Origin': '*',
          Date: new Date(Date.now()).toUTCString(),
          'X-Powered-By': 'Express',
          Connection: 'keep-alive',
        },
      })
      event.respondWith(fallbackResponse)
      fetch(event.request)
    }

    const fontsHandler = new workbox.strategies.CacheFirst({
      cacheName: 'fonts',
      plugins: [
        cacheSuccessPlugin,
        new workbox.expiration.Plugin({
          maxEntries: 20, 
          maxAgeSeconds: 60 * 60 * 24 * 365,
        }),
      ],
    })

    const rcAssetsHandler = new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'assets',
      plugins: [
        cacheSuccessPlugin,
        new workbox.expiration.Plugin({ 
          maxAgeSeconds: 60 * 60 * 24 * 365,
        }),
      ],
    })

    const assetsHandler = new workbox.strategies.CacheFirst({
      cacheName: 'assets',
      plugins: [
        cacheSuccessPlugin,
        new workbox.expiration.Plugin({
          maxEntries: 800,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        }),
      ],
    })

    const startUrlHandler = event => {
      return fetch(event.request)
    }

    

    

    workbox.routing.registerRoute(
      /.*(?:\/vtexid\/|\/checkout\/).*/,
      networkOnlyHandler
    )

    workbox.routing.registerRoute(/(?:\/admin\/).*/, networkFirstHandler)

    workbox.routing.registerRoute(
      /(?!.*files).*(segments|session).*/,
      sessionStrategy,
      'POST'
    ) 
    workbox.routing.registerRoute(/.*(?:rc\.vtex\.com).*/, ({ event }) =>
      rcHandler(event)
    )  
    workbox.routing.registerRoute(
      /.+(?:\/private\/assets(?:\/v\d+)?\/linked\/).+/,
      networkFirstHandler
    ) 
    workbox.routing.registerRoute(
      /(?:.+vteximg.+|\/.+)\.(?:png|jpg|jpeg|svg|gif).*/,
      imagesHandler
    ) 
    workbox.routing.registerRoute(
      /.*(?:\.(font|woff2|woff|eot|ttf|svg)|fonts\.googleapis|font-awesome).*/,
      fontsHandler
    )  
    workbox.routing.registerRoute(
      /(?:.+io\.vtex\.com\.br\/rc\/rc\.js)/,
      rcAssetsHandler
    )  
    workbox.routing.registerRoute(
      /(?:.+io\.vtex\.com\.br(?!\/rc\/rc\.js)|.+\.vteximg\..*?\/public\/assets(?:\/v\d+)?\/published\/).+/,
      assetsHandler
    ) 
    workbox.routing.registerRoute(
      /(?:\/api|\/buscapagina|https:\/\/api\.vtex\.com|\/graphql\/public\/|\/_v\/(?:segment|private|public)\/.*\/).*/,
      apiHandler
    ) 
    workbox.routing.registerRoute(
      ({ url }) => url.hostname === 'www.google-analytics.com',
      networkFirstHandler
    ) 
    workbox.routing.registerRoute(/(\?homescreen)/, startUrlHandler) 
    workbox.routing.registerRoute(/(\/|https:\/\/).*/, defaultFallbackStrategy)
  }


self.addEventListener('activate', function(event) {
 
  console.log('[custom-sw] Activate of service worker')


  function clearOpaqueResponses(cache) {
    return cache
      .keys()
      .then( 
        requestKeys =>
          Promise.all(
            requestKeys.map(request =>
              cache.match(request).then(response => ({ request, response }))
            )
          )
      )
      .then( 
        responsesObj => responsesObj.filter(({ response }) => !response.status)
      )
      .then( 
        opaqueResponsesObj =>
          Promise.all(
            opaqueResponsesObj.map(({ request }) => cache.delete(request))
          )
      )
  }

  function clearAllOpaqueResponses() {
    return caches
      .keys() 
      .then(cacheKeys =>
        Promise.all(cacheKeys.map(cacheKey => caches.open(cacheKey)))
      )
      .then(caches => caches.map(clearOpaqueResponses))
  }

  event.waitUntil(clearAllOpaqueResponses())


})
self.addEventListener('fetch', function(event) {
 
  console.log('[custom-sw] Fetch of service worker')


})
self.addEventListener('install', function(event) {
 
  console.log('[custom-sw] Install of service worker')


})
self.addEventListener('message', function(event) {
 
  console.log('[custom-sw] Message of service worker')


})
self.addEventListener('push', function(event) {
 
  console.log('[custom-sw] Push of service worker')

 
  console.log('[service-worker] Entering push handler')
  if (!event.data) {
    return
  }

  let data

  try {
    data = event.data.json()
  } catch (err) {
    console.error('Error occurred when trying to decode push event', err)
    return
  } 
  const promiseChain = self.registration.showNotification(data.title || '', {
    body: data.message,
  })

  event.waitUntil(promiseChain)


})
self.addEventListener('sync', function(event) {
 
  console.log('[custom-sw] Sync of service worker')


})

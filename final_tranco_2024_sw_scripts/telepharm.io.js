const version = '4e88c7f74e7852baaf96e0cb6964ab43fa37da05', env = { TP_CDN: 'https://s3.amazonaws.com/telepharm-assets-ct-1/web-assets/static/', CI: undefined, TP_IS_LOCAL_ENV: undefined };/*
  When making changes to the service worker, consider purging the cached copy on Akamai to ensure our customers get
  the most up-to-date version of the service worker once it's deployed.

  On the Akamai Control Center, go to CDN -> Purge Cache and enter the URL https://www.telepharm.io/service-worker.js

  Use the Invalidate purge method.
 */
const cdnBasePath = env.TP_CDN,
  staticCdnBasePath = 'https://s3.amazonaws.com/telepharm-assets-ct-1/web-assets',
  medispanCdnBasePath = 'https://s3.amazonaws.com/telepharm-assets-ct-1/medispan-images',
  appBasePath = self.location.origin,
  apiBasePath = appBasePath + '/api',
  isCI = env.CI === 'true',
  isLocalDev = !isCI && (appBasePath.includes('localhost') || env.TP_IS_LOCAL_ENV),
  appCache = 'telepharm-app-' + version,
  cdnCache = 'telepharm-cdn-' + version,
  demoCache = {
    cachedUrls: [],
    apiRequests: {},
  },
  demoCacheMatchHeaders = ['authorization'],
  cdnPlaceholder = '__cdn__',
  staticCdnPlaceholder = '__static_cdn__',
  medispanCdnPlaceholder = '__medispan_cdn__',
  bodyIncludedPaths = [/\/api\/token.*/, /\/api\/v2-session.*/, /\/api\/items\/.+\/comments/],
  demoRequestsNotFound = []

let recordDemoClientId = null,
  offlineDemoClientId = null,
  _demoArchivePromise = null

self.addEventListener('install', (event) => {
  self.skipWaiting()

  event.waitUntil(
    caches.open(appCache).then((cache) => {
      return cache.addAll(['/', '/maintenance'])
    })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.clients
      .claim()
      .then(() => caches.keys())
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => !cacheName.includes(version))
            .map((cacheName) => caches.delete(cacheName))
        )
      })
  )
})

function retrieveDemoArchive(options) {
  const demoCacheRequest = new Request(self.location.origin + '/demo.json', options)
  return (_demoArchivePromise = caches.open(cdnCache).then((cache) => {
    return cache.match(demoCacheRequest).then(function (cachedResponse) {
      if (cachedResponse && cachedResponse.status === 200) {
        return cachedResponse.json().then((data) => {
          return data
        })
      }

      if (!options) {
        // Need auth options from client to load demo cache from scratch
        return undefined
      }

      return fetch(demoCacheRequest).then((response) => {
        if (!response.ok) {
          throw new Error(response.status)
        }
        return cache.put(demoCacheRequest, response.clone()).then(() => {
          return (
            response
              .json()
              // eslint-disable-next-line max-nested-callbacks
              .then((data) => {
                return data
              })
              .catch()
          )
        })
      })
    })
  }))
}

function getDemoArchive(options) {
  if (!_demoArchivePromise) {
    return retrieveDemoArchive(options)
  }
  return _demoArchivePromise
    .then((demoArchive) => {
      return demoArchive ? demoArchive : retrieveDemoArchive(options)
    })
    .catch(() => retrieveDemoArchive(options))
}

function notFoundForDemo({ request }, cacheName, key) {
  const isInDemoArchivePromise =
    cacheName === cdnCache
      ? getDemoArchive().then((demoArchive) => demoArchive.demoCache.cachedUrls.includes(key))
      : Promise.resolve(false)

  return isInDemoArchivePromise.then((isInDemoArchive) => {
    demoRequestsNotFound.push({ url: request.url, cacheName, key, isInDemoArchive })
    return new Response('', {
      status: 404,
      statusText: `Not Found for Demo (${key || request.url})`,
    })
  })
}

/*

Bypass disk cache with dummy query parameter and dummy header
when using service worker in case disk cache contains a broken CORS response

 */
function transformAWSRequest(request) {
  if (request.url.includes(staticCdnBasePath) && request.url.endsWith('.js')) {
    return new Request(request.url + '?tpAwsSw', {
      ...request,
      headers: {
        ...request.headers,
        'telepharm-aws-service-worker': 'enabled',
      },
    })
  }
  return request
}

function readThroughCache(event, cacheName) {
  const url = event.request.url,
    getDemoUrl = () =>
      url
        .replace(cdnBasePath, cdnPlaceholder)
        .replace(staticCdnBasePath, staticCdnPlaceholder)
        .replace(medispanCdnBasePath, medispanCdnPlaceholder)
        .concat('::', event.request.mode)

  if (event.recordForDemo) {
    const demoUrl = getDemoUrl()
    if (!demoCache.cachedUrls.includes(demoUrl)) {
      demoCache.cachedUrls.push(demoUrl)
      if (demoUrl.includes('webm')) {
        demoCache.cachedUrls.push(demoUrl.replace('webm', 'mp4'))
      }
    }
  }
  if (isLocalDev && !event.playBackDemo && event.request.destination !== 'font') {
    return null
  }

  // SOMEDAY: Cache ranged partial content requests (e.g. Safari loading sounds)
  //   Chrome uses open ended range requests (e.g. '0-') which work like normal, non-partial content requests
  const rangeHeader = event.request.headers.get('range')
  if (rangeHeader) {
    return null
  }

  return caches.open(cacheName).then((cache) => {
    return cache.match(event.request, { ignoreVary: true }).then(function (cachedResponse) {
      if (cachedResponse) {
        return cachedResponse
      }
      if (event.offlineDemo) {
        return notFoundForDemo(event, cacheName, getDemoUrl())
      }

      const httpRequest = transformAWSRequest(event.request)

      return fetch(httpRequest).then((response) => {
        if (!response.ok) {
          return response
        }

        return cache
          .put(event.request, response.clone())
          .then(() => response)
          .catch((e) => {
            // TODO: Warn demo user?
            console.log(`${e.name} when caching request: ${event.request.url}`) // eslint-disable-line no-console
            return response
          })
      })
    })
  })
}

function fallBackIfUnreachable(event, cachedPage) {
  return fetch(event.request).catch(() => {
    return caches.open(appCache).then((cache) => {
      return cache.match(cachedPage)
    })
  })
}

function getRequestPath(event) {
  return event.request.url.replace(/https?:\/\/[^/]+\//, '/')
}

function arrayBufferToBase64(buffer) {
  var binary = '',
    bytes = new Uint8Array(buffer),
    len = bytes.byteLength,
    i = 0

  for (i; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }

  return btoa(binary)
}

function base64ToArrayBuffer(base64) {
  var binaryString = atob(base64),
    len = binaryString.length,
    bytes = new Uint8Array(len)

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  return bytes.buffer
}

function cleanTimeFromPath(path) {
  return path
    .replace(/modified.*/, '') // rx requests
    .replace(/since.*/, '') // patient fill history
}

function handleDemoApiRequest(event) {
  return event.request
    .clone()
    .text()
    .then((bodyText) => {
      const request = event.request,
        headers = request.headers,
        hashedHeaders = Array.from(headers.keys())
          .filter((key) => demoCacheMatchHeaders.includes(key))
          .map((key) => {
            return key + ':' + headers.get(key)
          })
          .join('::'),
        requestPath = cleanTimeFromPath(getRequestPath(event)),
        bodyKey = bodyIncludedPaths.some((includedPath) => includedPath.test(requestPath))
          ? bodyText
          : void 0,
        demoKey = [request.method, requestPath, hashedHeaders, bodyKey].join(';;')

      if (event.recordForDemo) {
        return fetch(event.request).then((response) => {
          if (!demoCache.apiRequests[demoKey]) {
            void response
              .clone()
              .arrayBuffer()
              .then((responseArrayBuffer) => {
                demoCache.apiRequests[demoKey] = {
                  data: arrayBufferToBase64(responseArrayBuffer),
                  status: response.status,
                  statusText: response.statusText,
                  headers: Array.from(response.headers.entries()),
                }
              })
          }

          return response
        })
      }

      return getDemoArchive().then((demoArchive) => {
        const demoResponse = demoArchive && demoArchive.demoCache.apiRequests[demoKey]
        if (!demoResponse) {
          return notFoundForDemo(event, appCache, demoKey)
        }

        return new Response(base64ToArrayBuffer(demoResponse.data), demoResponse)
      })
    })
}

function loadDemoArchive() {
  return getDemoArchive().then((demoArchive) => {
    if (!demoArchive) {
      return void 0
    }
    return Promise.all(
      demoArchive.demoCache.cachedUrls.map((demoUrl) => {
        const [url, mode] = demoUrl
          .replace(cdnPlaceholder, cdnBasePath)
          .replace(staticCdnPlaceholder, staticCdnBasePath)
          .replace(medispanCdnPlaceholder, medispanCdnBasePath)
          .split('::')

        return readThroughCache(
          { request: new Request(url, { mode }), playBackDemo: true },
          cdnCache
        )
      })
    ).then(() => demoArchive)
  })
}

self.addEventListener('fetch', (event) => {
  const { url, referrer, mode } = event.request
  let response = null

  if (referrer.includes('recordDemo=true')) {
    recordDemoClientId = event.clientId
  }

  if (recordDemoClientId === event.clientId) {
    event.recordForDemo = true
  } else {
    event.playBackDemo = referrer.includes('demo') || (mode === 'navigate' && url.includes('demo'))
    event.offlineDemo = offlineDemoClientId === event.clientId
  }

  if (url.startsWith(apiBasePath) && (event.recordForDemo || event.playBackDemo)) {
    response = handleDemoApiRequest(event)
  } else if (
    url.startsWith(appBasePath) &&
    !url.startsWith(apiBasePath) &&
    !url.endsWith('.js') &&
    !url.endsWith('.json')
  ) {
    const cachedPage = event.playBackDemo ? '/' : '/maintenance'
    response = fallBackIfUnreachable(event, cachedPage)
  } else if (
    url.startsWith(cdnBasePath) ||
    url.startsWith(staticCdnBasePath) ||
    url.startsWith(medispanCdnBasePath)
  ) {
    response = readThroughCache(event, cdnCache)
  } else if (event.offlineDemo) {
    response = notFoundForDemo(event)
  }

  if (response) {
    event.respondWith(response)
  }
})

self.addEventListener('message', (event) => {
  const respondWith = (message) => event.ports[0].postMessage(message),
    { type, data: clientData } = event.data,
    { id: clientId, url } = event.source,
    isRecordingDemo = recordDemoClientId === clientId || url.includes('recordDemo=true')

  if (type === 'getDemoCache') {
    return respondWith(demoCache)
  }
  if (type === 'authenticateDemo') {
    if (isRecordingDemo) {
      return respondWith(true)
    }
    if (!clientData.secret) {
      return respondWith(false)
    }
    return getDemoArchive({ headers: { 'tp-demo-secret': clientData.secret } })
      .then((demoArchive) => {
        respondWith(Boolean(demoArchive))
      })
      .catch(() => {
        return respondWith(false)
      })
  }
  if (type === 'loadDemo') {
    if (isRecordingDemo) {
      return respondWith({ ok: true })
    }
    return loadDemoArchive()
      .then((demoArchive) => {
        return respondWith({
          ok: Boolean(demoArchive),
          demoSetup: demoArchive && demoArchive.setup,
        })
      })
      .catch(() => {
        return respondWith({ ok: false })
      })
  }
  if (type === 'enableOfflineDemo') {
    offlineDemoClientId = clientId
    return respondWith(void 0)
  }
  if (type === 'disableOfflineDemo') {
    offlineDemoClientId = undefined
    return respondWith(void 0)
  }
  if (type === 'getDemoRequestsNotFound') {
    return respondWith(demoRequestsNotFound)
  }
  return void 0
})

/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("workbox-v4.3.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "workbox-v4.3.1"});

workbox.core.setCacheNameDetails({prefix: "gatsby-plugin-offline"});

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "webpack-runtime-72171282ee9e557bc572.js"
  },
  {
    "url": "framework-0907406ee497f2b60fce.js"
  },
  {
    "url": "styles.6bb4e8a905c95922b7c8.css"
  },
  {
    "url": "d1c70c93-66d47df0a03adcfe1e36.js"
  },
  {
    "url": "20b67f1c-dc4c228ddc9de1a77290.js"
  },
  {
    "url": "c61ec90c-6c623740f281f4e20a79.js"
  },
  {
    "url": "eb3571be-d02e3a5f39ff6d3e3fd1.js"
  },
  {
    "url": "13cf1d50-4e5453c65891c2c64c79.js"
  },
  {
    "url": "7b40542b-6257f79d6eb83f293cb5.js"
  },
  {
    "url": "73a2ab0a-58e8f19e0aac7238bff8.js"
  },
  {
    "url": "fcee0803-0911a2b657eb7cac671d.js"
  },
  {
    "url": "f1c52280-1dc070221595dc14c31b.js"
  },
  {
    "url": "45ad6a87-df656631f7e6d7833cc0.js"
  },
  {
    "url": "cae4ffce-15544d0953d903e3e7a3.js"
  },
  {
    "url": "134d8a99-ca40ab7c0113f976f9c1.js"
  },
  {
    "url": "962c82b5-7bd57144affc7e7f3f17.js"
  },
  {
    "url": "cf8adcb6-a5314cd11f93a8fdecc4.js"
  },
  {
    "url": "9556633e-f65e2d09a93d8f7bb696.js"
  },
  {
    "url": "af05babe-597c8ac329af654f3bae.js"
  },
  {
    "url": "1c3dad80-6687a471dfc54369d640.js"
  },
  {
    "url": "a8b6a145-5ddbab6c881adabf896f.js"
  },
  {
    "url": "cb3eba3e-ee8b0f6c9ef11a2890fe.js"
  },
  {
    "url": "78460e6e-c79bdeb8f5521fc0b1e1.js"
  },
  {
    "url": "f37df17b-45e17fcb01bcf747f668.js"
  },
  {
    "url": "eed473ca-d1b5d6c1911ed1aff0b3.js"
  },
  {
    "url": "85802a2b-320efb43848a8da527ec.js"
  },
  {
    "url": "224fc72c-4c5cc0efb264657904c9.js"
  },
  {
    "url": "de2de88c-fba8e562cba632fa442c.js"
  },
  {
    "url": "0567a43e-79bf876a291cc938b64a.js"
  },
  {
    "url": "e5af8ec8-4dc3dea6b6210b531068.js"
  },
  {
    "url": "6035cc87-6a36b1d2420d0f92463d.js"
  },
  {
    "url": "d376b2c1-ae9d1e0a8993c71fb0c8.js"
  },
  {
    "url": "0de998f3-f805738ae5373ae7d34d.js"
  },
  {
    "url": "47bb7602-ea44bc1fb611f3a36d91.js"
  },
  {
    "url": "61805790-d6efc50762fc62dee3c8.js"
  },
  {
    "url": "08bc38da-57b2e48bd78dccde1631.js"
  },
  {
    "url": "b68c1091-58ccc5d1293e9d72eb90.js"
  },
  {
    "url": "de828d66-427a8f0630700fd638c9.js"
  },
  {
    "url": "12345afe-52074b5c43fc7c07c252.js"
  },
  {
    "url": "80932765-1071241aa0145b79846f.js"
  },
  {
    "url": "2f89c89b-a4bdd073c0bae5cd88b1.js"
  },
  {
    "url": "e93c1e1b-7b666a83c43dbc56aaec.js"
  },
  {
    "url": "5cda10cf-30a372407c8bf982e02d.js"
  },
  {
    "url": "1b9136d6-8779b1bf8ce2169fd6af.js"
  },
  {
    "url": "c7ef9d0d-a5405cb66085468640cf.js"
  },
  {
    "url": "47abd502-99ada12e3f963180ddf4.js"
  },
  {
    "url": "ba9fbd82-5fc7ae38da7ca96b18e4.js"
  },
  {
    "url": "1ee31fb7-17e4a5af21927973a12e.js"
  },
  {
    "url": "91b5748a-9412d164b3fe619b16f0.js"
  },
  {
    "url": "bdf06cea-40e6c1299efe3e54dd3d.js"
  },
  {
    "url": "22a8bd88-ccd43a452e02efcc9307.js"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "543f9e8f9dbcf39f7ba856467a4a2815"
  },
  {
    "url": "static/webfonts/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsiH0B4gaVI.woff2"
  },
  {
    "url": "static/webfonts/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVI.woff2"
  },
  {
    "url": "static/webfonts/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsgH1x4gaVI.woff2"
  },
  {
    "url": "static/webfonts/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsg-1x4gaVI.woff2"
  },
  {
    "url": "polyfill-d0cafc6a3cdb6ba7705a.js"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/(\.js$|\.css$|static\/)/, new workbox.strategies.CacheFirst(), 'GET');
workbox.routing.registerRoute(/^https?:.*\/page-data\/.*\.json/, new workbox.strategies.StaleWhileRevalidate(), 'GET');
workbox.routing.registerRoute(/^https?:.*\.(png|jpg|jpeg|webp|avif|svg|gif|tiff|js|woff|woff2|json|css)$/, new workbox.strategies.StaleWhileRevalidate(), 'GET');
workbox.routing.registerRoute(/^https?:\/\/fonts\.googleapis\.com\/css/, new workbox.strategies.StaleWhileRevalidate(), 'GET');

/* global importScripts, workbox, idbKeyval */
importScripts(`idb-keyval-3.2.0-iife.min.js`)

const { NavigationRoute } = workbox.routing

let lastNavigationRequest = null
let offlineShellEnabled = true

// prefer standard object syntax to support more browsers
const MessageAPI = {
  setPathResources: (event, { path, resources }) => {
    event.waitUntil(idbKeyval.set(`resources:${path}`, resources))
  },

  clearPathResources: event => {
    event.waitUntil(idbKeyval.clear())

    // We detected compilation hash mismatch
    // we should clear runtime cache as data
    // files might be out of sync and we should
    // do fresh fetches for them
    event.waitUntil(
      caches.keys().then(function (keyList) {
        return Promise.all(
          keyList.map(function (key) {
            if (key && key.includes(`runtime`)) {
              return caches.delete(key)
            }

            return Promise.resolve()
          })
        )
      })
    )
  },

  enableOfflineShell: () => {
    offlineShellEnabled = true
  },

  disableOfflineShell: () => {
    offlineShellEnabled = false
  },
}

self.addEventListener(`message`, event => {
  const { gatsbyApi: api } = event.data
  if (api) MessageAPI[api](event, event.data)
})

function handleAPIRequest({ event }) {
  const { pathname } = new URL(event.request.url)

  const params = pathname.match(/:(.+)/)[1]
  const data = {}

  if (params.includes(`=`)) {
    params.split(`&`).forEach(param => {
      const [key, val] = param.split(`=`)
      data[key] = val
    })
  } else {
    data.api = params
  }

  if (MessageAPI[data.api] !== undefined) {
    MessageAPI[data.api]()
  }

  if (!data.redirect) {
    return new Response()
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: lastNavigationRequest,
    },
  })
}

const navigationRoute = new NavigationRoute(async ({ event }) => {
  // handle API requests separately to normal navigation requests, so do this
  // check first
  if (event.request.url.match(/\/.gatsby-plugin-offline:.+/)) {
    return handleAPIRequest({ event })
  }

  if (!offlineShellEnabled) {
    return await fetch(event.request)
  }

  lastNavigationRequest = event.request.url

  let { pathname } = new URL(event.request.url)
  pathname = pathname.replace(new RegExp(`^`), ``)

  // Check for resources + the app bundle
  // The latter may not exist if the SW is updating to a new version
  const resources = await idbKeyval.get(`resources:${pathname}`)
  if (!resources || !(await caches.match(`/app-46b19491e934c657cc49.js`))) {
    return await fetch(event.request)
  }

  for (const resource of resources) {
    // As soon as we detect a failed resource, fetch the entire page from
    // network - that way we won't risk being in an inconsistent state with
    // some parts of the page failing.
    if (!(await caches.match(resource))) {
      return await fetch(event.request)
    }
  }

  const offlineShell = `/offline-plugin-app-shell-fallback/index.html`
  const offlineShellWithKey = workbox.precaching.getCacheKeyForURL(offlineShell)
  return await caches.match(offlineShellWithKey)
})

workbox.routing.registerRoute(navigationRoute)

// this route is used when performing a non-navigation request (e.g. fetch)
workbox.routing.registerRoute(/\/.gatsby-plugin-offline:.+/, handleAPIRequest)

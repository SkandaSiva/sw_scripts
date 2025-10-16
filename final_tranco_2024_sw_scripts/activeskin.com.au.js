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
    "url": "webpack-runtime-74f6e6f5aa95e529a113.js"
  },
  {
    "url": "framework-d0cac8d7830a53116b21.js"
  },
  {
    "url": "styles.a04a1bb50621c0703522.css"
  },
  {
    "url": "11100001-3a9161a135edf4cf67b8.js"
  },
  {
    "url": "app-6f15cfb20a993469a9a0.js"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "39a9285826733d86cbcd02f6983f9ea4"
  },
  {
    "url": "89a7b35ffa9b1fe8f5c28e1669646485c6d56970-136c01355e26b6c82c93.js"
  },
  {
    "url": "61b1319c58f9e66f9d5f94aaab809105e5c48896-19e6a2790af6217eb42f.js"
  },
  {
    "url": "c27cf186842a16d19a447e4449997ca53dc814da-9bc22eb65318af7bc052.js"
  },
  {
    "url": "95b64a6e-103da2a3a00003267d6a.js"
  },
  {
    "url": "components-Search-SearchBox-c010519c4ab2342a8650.js"
  },
  {
    "url": "components-mega-b14b50039fb989a9d7cc.js"
  },
  {
    "url": "MenuItem-a520610435a2999dfb15.js"
  },
  {
    "url": "common-CustomLink-7fde1efda11caa2cb86b.js"
  },
  {
    "url": "GroupOfLinks-699e428613e698b68e94.js"
  },
  {
    "url": "HighlightedGroupOfLinks-e5b89bca042b43980fa8.js"
  },
  {
    "url": "components-header_sub_navigation-b0ddc3c06621254dafd1.js"
  },
  {
    "url": "components-static_page-9382ddec73c035c3644c.js"
  },
  {
    "url": "SliceZone-2caa584ec630a5dc7b93.js"
  },
  {
    "url": "SingleColumnContent-1c2f1bdbb207f5059ad2.js"
  },
  {
    "url": "components-footer-FormNewsletter-db19621fe123237667b6.js"
  },
  {
    "url": "f76f325feb1c89d37b8de761ccf375dbb65772e6-4653a2e6b6445fae85b4.js"
  },
  {
    "url": "mui-material-Dialog-340c12d35e2b0317027f.js"
  },
  {
    "url": "polyfill-569f8f0301d8c2d44605.js"
  },
  {
    "url": "manifest.webmanifest",
    "revision": "87f294e21d6068a0b69d901a3b748a75"
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
  if (!resources || !(await caches.match(`/app-6f15cfb20a993469a9a0.js`))) {
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

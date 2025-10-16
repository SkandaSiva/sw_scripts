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
    "url": "webpack-runtime-d5af0edb5d7ad223dbae.js"
  },
  {
    "url": "framework-79303704531379c960db.js"
  },
  {
    "url": "app-1b482939a64fd6819010.js"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "e806b34c3e6236385949c4d10d015b75"
  },
  {
    "url": "component---cache-caches-gatsby-plugin-offline-app-shell-js-74263440bc4a6af7740b.js"
  },
  {
    "url": "polyfill-a2cf48b3f50c83b8b061.js"
  },
  {
    "url": "styles.c83f573bf19a21af444c.css"
  },
  {
    "url": "styles-18f4f574bd642c250f85.js"
  },
  {
    "url": "1bfc9850-e834cc48567e28a73e71.js"
  },
  {
    "url": "d7eeaac4-a1cd58eadfb8c3719f44.js"
  },
  {
    "url": "a4c92b5b-d5b028234f4acca20558.js"
  },
  {
    "url": "252f366e-1827a269aacd034a3e59.js"
  },
  {
    "url": "01e1715f70b513cd242bb0a9577b255d078c92f9-b28169a39ddd29540832.js"
  },
  {
    "url": "aba0357d7e3f8bcf650ef3d2720cbf6539f5d0e7-827ae1c35e00ae6e3ec4.js"
  },
  {
    "url": "978f5dd58bc702e23e5d2f6ef1ebcfd3d153c0b2-7940936d842203646872.js"
  },
  {
    "url": "8e201ceea9aab015629617f221f0bcf945228be6-9a3d6c004b0053764f40.js"
  },
  {
    "url": "component---src-templates-category-js-242b5df895526eab78e6.js"
  },
  {
    "url": "page-data/recipes/big-salads-bowls/page-data.json",
    "revision": "e831889622f5853d7058e0671031f6d4"
  },
  {
    "url": "page-data/sq/d/2188466671.json",
    "revision": "a0dcc6a27a70c3e4836d881e5b27a631"
  },
  {
    "url": "page-data/sq/d/2329617185.json",
    "revision": "6bb0ec278db42cbe92f182dbbdcec050"
  },
  {
    "url": "page-data/sq/d/63159454.json",
    "revision": "8d3bc2daf8ab88a97b213d094c89664a"
  },
  {
    "url": "page-data/app-data.json",
    "revision": "d35f1e77417c24e82e97730cea6dd9f7"
  },
  {
    "url": "page-data/recipes/burgers-steaks-chops-bbq/page-data.json",
    "revision": "07f96a05812f560c16cab8a2d3412d13"
  },
  {
    "url": "page-data/recipes/chicken-many-ways/page-data.json",
    "revision": "2d1baa660263089f465f414efc870c43"
  },
  {
    "url": "page-data/recipes/fish-beautiful-fish/page-data.json",
    "revision": "734013412c02c411632dccb32412ec46"
  },
  {
    "url": "component---src-pages-recipes-js-803b1654723f6a951ddd.js"
  },
  {
    "url": "page-data/recipes/page-data.json",
    "revision": "69139d7351b8ef40191735902761db0b"
  },
  {
    "url": "page-data/recipes/pasta/page-data.json",
    "revision": "599cf8ca7ebf6f3ed1d15a6d4aeb6a52"
  },
  {
    "url": "page-data/recipes/sides-little-salads/page-data.json",
    "revision": "88d226acd5a029be385304a32288a00f"
  },
  {
    "url": "page-data/recipes/soups-chilis-stews/page-data.json",
    "revision": "26933bc636511c1f08d3b8a7768c4c2d"
  },
  {
    "url": "page-data/recipes/top-20/page-data.json",
    "revision": "f9cd003aa9cf92b84ef19613cc737049"
  },
  {
    "url": "page-data/recipes/vegan-vegetarian/page-data.json",
    "revision": "d406da91f0dff3b90725f8734fc68114"
  },
  {
    "url": "ef48260533c6a04170e66a731c1607f71321472a-c0a6d2cd3a0f9db57a90.js"
  },
  {
    "url": "e1b1fe128cceeaaf0643a89f1da10f4713346e89-7d5442c2edbf1ae765c8.js"
  },
  {
    "url": "component---src-templates-post-js-96661e848f79270b7bc3.js"
  },
  {
    "url": "component---src-templates-blog-js-c24a3e2f82d35cb62dad.js"
  },
  {
    "url": "manifest.webmanifest",
    "revision": "5cdffb3f5c0eb4e9586ccff3dc0ad443"
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
  if (!resources || !(await caches.match(`/app-1b482939a64fd6819010.js`))) {
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

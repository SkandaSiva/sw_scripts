importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js');

self.addEventListener("install", () => {
   self.skipWaiting()
})

workbox.routing.setDefaultHandler(new workbox.strategies.NetworkFirst())
workbox.recipes.offlineFallback({ pageFallback: "/offline?v=3" })

// CSS/JS en cache-first
workbox.routing.registerRoute(
   new RegExp("\\.[0-9]+\\.(css|js)$"),
   new workbox.strategies.CacheFirst({
      cacheName: "css-js-assets",
      plugins: [
         new workbox.expiration.ExpirationPlugin({ maxEntries: 10 })
      ]
   })
)

// Désactivé pour l’instant car les pages mises en cache peuvent
// faire référence à un CSS/JS qui n’est plus en cache.
//
// workbox.routing.registerRoute(
//    ({url, request}) =>
//       (request.mode === 'navigate'
//          && url.href.match(new RegExp("(/$|/(s|p|o|oe)/[0-9]+/.*$|/?[A-Za-z0-9_=]+$|/[a-z\-]+$)"))
//       ),
//    new workbox.strategies.NetworkFirst({
//       cacheName: "pages",
//       plugins: [
//          new workbox.expiration.ExpirationPlugin({ maxEntries: 25 })
//       ]
//    })
// )

// workbox.routing.setCatchHandler(async ({event}) => {
//    if (event.request.url.match(/\.[0-9]+\.(css|js)$/)) {
//       self.caches.
//       return fetch()
//    }
// })

// TODO :
// - Être plus exhaustif sur les ressources CSS/JS/autres
// - offline
// - pb : page sauvegardée mais CSS a été purgé depuis
//        * Soit mettre en cache main.front.css au moment où on met en cache main.front.8709832.css
//          et le ressortir en cas d’erreur sur un main.front.XXXXXXX.css ? Mais on pourra se retrouver
//          avec un CSS qui ne correspond pas tout à fait à ce qu’il faut.
//        * L’idéal serait de ne pas supprimer aveuglément des vieux CSS.
//          Faire une fonction qui, à la sauvegarde de main.front.123445656.css :
//          - parcourt les pages sauvegardées, cherche les références à d’autres versions du même fichier
//          - supprime toutes les autres
//

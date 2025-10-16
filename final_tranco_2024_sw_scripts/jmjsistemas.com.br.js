importScripts("/precache-manifest.835e1202ceebfb5fc9d49deb492c7269.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

workbox.setConfig({
    debug: false,
  });
  
  workbox.precaching.precacheAndRoute([]);

  workbox.routing.registerRoute(
    ({ url }) => url.pathname.indexOf('app') == -1,
    new workbox.strategies.StaleWhileRevalidate()
  );
  
  workbox.routing.registerRoute(
    ({request}) => request.destination === 'style',
    new workbox.strategies.CacheFirst()
  );
  workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg|webp)$/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60
        }),
      ],
    }),
  );

  self.addEventListener('fetch', (event) => {
    const {request} = event;
    const url = new URL(request.url);
  
    if (url.origin === location.origin && url.pathname === '/') {
      event.respondWith(new StaleWhileRevalidate().handle({event, request}));
    }
  });

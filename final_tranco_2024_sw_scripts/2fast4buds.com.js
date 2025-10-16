importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  
  const matchCb = ({url, event}) => { 
    return url.pathname.indexOf('/admin') < 0 && url.pathname.indexOf('/partner') < 0 && self.registration.scope == url.origin + '/';
  };

  const commonCacheExpiration = new workbox.expiration.ExpirationPlugin({
    maxEntries: 40,
    maxAgeSeconds: 3 * 24 * 60 * 60, // 3 Days
  });

  workbox.routing.registerRoute(
    matchCb,
    new workbox.strategies.NetworkFirst({
      cacheName: 'general',
      plugins: [commonCacheExpiration],
    })
  );

  workbox.routing.registerRoute(
    new RegExp('/temp/.+\\.js$'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'js-files',
      plugins: [commonCacheExpiration],
    })
  );

  workbox.routing.registerRoute(
    new RegExp('/temp/.+\\.css$'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'css-files',
      plugins: [commonCacheExpiration],
    })
  );
  
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

importScripts('/sw-toolbox.js');

toolbox.options.debug = true;

toolbox.precache([
  '/',
  '/inc/w3rtl.css',
  '/inc/w3.css',
  '/nimg/logo.jpg'
]);

toolbox.router.default = toolbox.networkFirst;

toolbox.router.get(
  '/*.(asp)',
  toolbox.networkFirst,
  {
    networkTimeoutSeconds: 5
  }
);

toolbox.router.get(
  '/*.(js|css|png|jpeg|jpg|gif|otf|woff|woff2)',
  toolbox.networkFirst,
  {
    networkTimeoutSeconds: 5,
    queryOptions: {
      ignoreSearch: true
    }
  }
);

self.addEventListener('install', function(e) {
  e.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(e) {
  e.waitUntil(self.clients.claim());
});

/*self.addEventListener('fetch', (e) => {
  console.log(e.request.url);
});*/
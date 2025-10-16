importScripts("/js/sw/toolbox/sw-toolbox.js");

//toolbox.options.debug = true;

self.addEventListener('install', function(event) {
	  event.waitUntil(self.skipWaiting());
	});
self.addEventListener('activate', function(event) {
	  event.waitUntil(self.clients.claim());
	});

toolbox.router.get('/css/(.*)', toolbox.cacheFirst, {
    cache: {
      name: 'cssfonts',
      maxEntries: 20,
      maxAgeSeconds: 2592000
    }
  });
toolbox.router.get('/img/(.*)', toolbox.cacheFirst, {
    cache: {
      name: 'images',
      maxEntries: 100,
      maxAgeSeconds: 2592000
    }
  });
toolbox.router.get('/img/site/(.*)', toolbox.cacheFirst, {
    cache: {
      name: 'staticAssets',
      maxEntries: 20,
      maxAgeSeconds: 2592000
    },
    origin: /asset\.tauschgnom\.de$/
  });

toolbox.router.get('/(.*)\.css', toolbox.cacheFirst, {
    cache: {
        name: 'css',
        maxEntries: 100,
        maxAgeSeconds: 2592000
      }
    });
toolbox.router.get('/(.*)\.js', toolbox.cacheFirst, {
    cache: {
        name: 'javaScript',
        maxEntries: 100,
        maxAgeSeconds: 2592000
      }
    });
toolbox.router.get('/sw.js', toolbox.fastest);
toolbox.router.get('/js/sw/register.js', toolbox.fastest);


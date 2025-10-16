// https://css-tricks.com/serviceworker-for-offline/

var version = 'electrocd_v3::';

self.addEventListener('install', function ( event ) {
  console.log('WORKER: install event in progress.');

  event.waitUntil(
    caches
      .open(version + 'fundamentals')
      .then(function ( cache ) {
        return cache.addAll([
          /*'/site_notype_v10/htdocs/',*/
        ]);
      })
			.then(function (  ) {
				console.log('WORKER: install completed');
			}));
});

self.addEventListener('fetch', function ( event ) {
  console.log('WORKER: fetch event in progress.');

  if (event.request.method !== 'GET') {
    console.log('WORKER: fetch event ignored.', event.request.method, event.request.url);
    return;
  }
  
  var requeteCachable =
  	event.request.destination.match('style|script|font') || // image
  	event.request.url.match('\\.svg$');
  
  if (!requeteCachable) {
    console.log('WORKER: fetch event ignored.', event.request.method, event.request.url, event.request.destination);
    return;
  }

  /*
  if (
  	!event.request.url.match('\/res\\.electrocd\\.com\/') &&
  	!event.request.url.match('\\.(css|js)(\\.php)?(\\?.*)?$')
  ) {
    console.log('WORKER: fetch event ignored.', event.request.method, event.request.url, event.request.headers);
    return;
  }
  */

  event.respondWith(
    caches
      .match(event.request)
      .then(function ( cached ) {
        var networked = fetch(event.request)
          .then(fetchedFromNetwork, unableToResolve)
          .catch(unableToResolve);

        console.log('WORKER: fetch event', cached ? '(cached)' : '(network)', event.request.url);
        return cached || networked;

        function fetchedFromNetwork( response ) {
          var cacheCopy = response.clone();

          console.log('WORKER: fetch response from network.', event.request.url);

          caches
            .open(version + 'pages')
            .then(function add( cache ) {
              cache.put(event.request, cacheCopy);
            })
            .then(function (  ) {
              console.log('WORKER: fetch response stored in cache.', event.request.url);
            });

          return response;
        }

        function unableToResolve (  ) {
          console.log('WORKER: fetch request failed in both cache and network.');

          return new Response('<h1>Service Unavailable</h1>', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/html'
            })
          });
        }
      })
  );
});

self.addEventListener('activate', function ( event ) {
  console.log('WORKER: activate event in progress.');

  event.waitUntil(
    caches
      .keys()
      .then(function ( keys ) {
        return Promise.all(
          keys
            .filter(function ( key ) {
              return !key.startsWith(version);
            })
            .map(function ( key ) {
              return caches.delete(key);
            }));
      })
      .then(function (  ) {
        console.log('WORKER: activate completed.');
      }));
});

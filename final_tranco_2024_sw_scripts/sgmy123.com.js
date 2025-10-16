this.addEventListener('install', function(event) {
  // console.log('Perform install steps');
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      // console.log('Opened cache');
      return cache.addAll([
        // '/js/service_workers_test/hello.js',
        '/js/jquery-3.2.1.min.js',
      ]);
    })
  );
});

this.addEventListener('activate', function(event) {
  // console.log('activated!')
});

this.addEventListener('fetch', function(event) {
  // console.log('Handling fetch event for', event.request.url);

  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        // return new Response('<p>Hello from your friendly neighbourhood service worker!</p>', {
        //   headers: { 'Content-Type': 'text/html' }
        // });
        // console.log('Found response in cache:', response);
        return response;
      } else {
        // console.log('No response found in cache. About to fetch from network...');
      }

      return fetch(event.request).then(function(response) {
        // console.log('Response from network is:', response);
        // return caches.open('v1').then(function(cache) {
        //   cache.put(event.request, response.clone());
        //   return response;
        // });
        return response;
      }).catch(function(error) {
        // console.error('Fetching failed:', error);

        throw error;
      });
    })
  );
});

// controlling service worker
this.addEventListener("message", function(e) {
  // e.source is a client object
  e.source.postMessage("Hello! Your message was: " + e.data);
});

this.onpush = function(event) {
  // console.log(event.data);
  // From here we can write the data to IndexedDB, send it to any open
  // windows, display a notification, etc.
}
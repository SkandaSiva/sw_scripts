var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '' + dd + '' + yyyy;
//today = '444';

const CACHE_NAME = 'HL' + today; // Update cache version when necessary

// Install event: Precache initial assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        'index.php',
        'main_menu.php',
        'hub.php',
        'learning_main_menu.php',
        'learning_category_main_menu.php',
        'broadcast_menu.php',
        'view_broadcast.php',
        'course_menu.php',
        'player.php',
        'confirm_player.php',
        'js/localbase.js',
        'js/main.js',
        'css/styles.css'
      ]);
    })
  );
});

// Activate event: Clean up old caches
self.addEventListener('fetch', event => {
  // Check if the request is for a video file (you can use any condition you need)
  if (event.request.url.endsWith('.mp4')) {
    event.respondWith(
      // Check if the video is already cached
      caches.match(event.request).then(response => {
        if (response) {
          return response; // If it's cached, return it from the cache
        } else {
          // If it's not cached, fetch the video and cache it
          return fetch(event.request)
            .then(response => {
              const clone = response.clone();
              caches.open('dynamic-video-cache').then(cache => {
                cache.put(event.request, clone);
              });
              return response;
            })
            .catch(error => {
              // Handle failed fetch or cache errors
              console.error('Error caching video:', error);
              // You can return a fallback response if needed
            });
        }
      })
    );
  }
  // For other requests, handle them normally
  else {
    event.respondWith(

      fetch(event.request).then(fetchRes => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request.url, fetchRes.clone());
          return fetchRes;
        });
      }).catch(() => {
        return caches.match(event.request , {ignoreSearch: true}).then(response => {
          return response || caches.match('offline.html');
        });
      })
    );
  }
});

// Periodically check for updates and refresh the cache
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Set up a periodic cache refresh, e.g., once a day
self.addEventListener('sync', event => {
  if (event.tag === 'cache-refresh') {
    event.waitUntil(
      clearOldCaches()
        .then(() => {
          return caches.open(CACHE_NAME).then(cache => {
            return cache.addAll([
              // Update the list of assets to be precached here
            ]);
          });
        })
    );
  }
});

const cacheName = 'cache-v1';
const precacheResources = [
  '/layout/ui/fonts/avenir-next/avenir-next-regular.woff2',
  '/layout/ui/fonts/avenir-next/avenir-next-demi.woff2',
  '/layout/ui/fonts/avenir-next/avenir-next-italic.woff2',
  '/layout/ui/fonts/alpha-mack-aoe/alpha-mack-aoe.woff2',
  '/layout/ui/img/s_feed-sprite.svg',
  '/layout/ui/img/s_check-sprite.svg',
  '/layout/ui/img/s_standalone-sprite.svg',
  '/layout/ui/img/s_circle-sprite.svg',
  '/layout/ui/img/s_chevron-sprite.svg',
  '/layout/ui/img/s_submit-sprite.svg',
  '/layout/ui/img/s_empty-circle-sprite-x2.png',
  '/layout/ui/img/s_dots-sprite-x2.gif'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll(precacheResources);
      })
      .catch(err => {
        //console.log('caching failed: ', err);
      })
  );
});


self.addEventListener('fetch', event => {
  //console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(caches.match(event.request)
    .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request);
      }).catch(err => {
        //console.log('fetch failed: ', err);
      })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(checkResponse(event.request).catch(function() {
        return returnFromCache(event.request)
    }));    
});

const returnFromCache = function(request) {
    return caches.open('cacheName').then(function(cache) {
        return cache.match(request).then(function(matching) {
            if (!matching || matching.status == 404) {
                return cache.match('/errors/404.html')
            } else {
                return matching
            }
        });
    }).catch(err => {
      //console.log('return from cache failed: ', err);
    });
}; 
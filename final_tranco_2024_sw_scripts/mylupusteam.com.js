/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('mht-pwa').then(function(cache) {
      return cache.addAll(['/pwa_offline.html', '/users/get_badge_count']);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    fetch(e.request).catch(function() {
      return caches.match('/pwa_offline.html');
    })
  );
});

self.addEventListener('periodicsync', function(event) {
  if (event.tag === 'badge-count-sync') { event.waitUntil(updateBadgeCount()); }
});

function updateBadgeCount() {
  caches.match('/users/get_badge_count').then(function(response) {
    if (response) {
      response.json().then((data) => {
        if (data.badgeCount == 0) {
          navigator.clearAppBadge();
        } else {
          navigator.setAppBadge(data.badgeCount);
        }
      });
    } else {
      fetch(new Request('/users/get_badge_count')).then((response) => response.json()).then((data) => {
        if (data.badgeCount == 0) {
          navigator.clearAppBadge();
        } else {
          navigator.setAppBadge(data.badgeCount);
        }
        caches.open('mht-pwa').then(function(cache) {
          cache.addAll(['/users/get_badge_count']);
        })
      });
    }
  });
};

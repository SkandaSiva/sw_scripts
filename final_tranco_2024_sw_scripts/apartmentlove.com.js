var cacheName = 'apartmentlovecache';                         

self.addEventListener('install', event => {           
  event.waitUntil(
    caches.open(cacheName)                            
      .then(cache => cache.addAll([                   
        '/js/owl.carousel.min.js',
        '/js/js.cookie.js',
        '/js/jquery.validate.min.js',
        '/js/jquery-te-1.4.0.min.js',
        '/js/common.min.js',
        '/js/jquery.validate.additional.rules.js',
        '/js/blazy.min.js',
        '/js/culada.js',
        '/js/maps2.0.js',
        '/js/modernizr-2.8.1.min.js',
        '/js/swiper.min.js',
        '/js/settings.js',
        '/js/home.js',
        '/js/web-common.js',
        'https://api.tiles.mapbox.com/mapbox-gl-js/v1.2.0/mapbox-gl.js',
        'https://api.mapbox.com/mapbox.js/v3.2.0/mapbox.js',

        'https://api.tiles.mapbox.com/mapbox-gl-js/v1.2.0/mapbox-gl.css',
        'https://api.mapbox.com/mapbox.js/v3.2.0/mapbox.css',

        '/css/owl.carousel.min.css',
        '/css/jquery-ui.min.css',
        '/css/jquery-ui.theme.min.css',
        '/css/bootstrap.min.css',
        '/css/home.css',
        '/css/new-style.css',

        '/images/Apartment-Love-Logo.png',
        '/images/hero-banner.jpg',
        '/images/graphic-img3.png',
        '/images/graphic-img2.png',
        '/images/Affiliate-mobile.jpg',
      ]))
  );
});

self.addEventListener('fetch', function(event) {    
    event.respondWith(
      caches.match(event.request)                     
        .then(function(response) {
          if (response) {                             
            return response;                          
          }
          return fetch(event.request);
        }
      )
    );
  });
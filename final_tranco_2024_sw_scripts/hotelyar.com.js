self.addEventListener('install', function(event) {
    event.waitUntil(
    caches.open('app-cache-v1').then(function(cache) {
        return cache.addAll([
            '/static/fonts/fonts.css',
            '/static/plugin/bootstrap-4.6.2/css/bootstrap-grid.min.css',
            '/static/plugin/OwlCarousel2-2.3.4/assets/owl.carousel.min.css',
            '/static/plugin/OwlCarousel2-2.3.4/assets/owl.theme.default.min.css',
            '/static/plugin/datepicker/css/datepicker.css',
            '/static/css/style_main.css?rnd=33',
            '/static/css/style_main_additional.css?rnd=662',
            '/static/css/style_home.css?rnd=951',
            '/static/js/jquery-3.6.0.min.js',
            '/static/js/jquery-migrate.min.js',
            '/static/js/plugin.js?v=7',
            '/static/js/fa.js?v=21',
            '/static/plugin/OwlCarousel2-2.3.4/owl.carousel.min.js',
            '/static/plugin/datepicker/js/datepicker.js?version=4',
            '/static/plugin/offcanvasmenu/off-convas-menu.js',
            '/static/js/custom.js?rnd=331',
            '/static/js/custom_home.js?rnd=242',
            '/static/img/theme/logo-main.svg'
            // Add more URLs to cache as needed
        ]);
    })
 );
});

self.addEventListener('fetch', function(event) {
 event.respondWith(
   caches.match(event.request).then(function(response) {
     return response || fetch(event.request);
   })
 );
});
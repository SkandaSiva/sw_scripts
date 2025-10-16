var cacheName = 'bg29042024';

self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(cacheName).then(function(cache) {
        return cache.addAll([
          'https://www.beursgenoten.nl/offline?v=2',
          'https://cdn.beursgenoten.nl/images/logo.png',
          'https://cdn.beursgenoten.nl/images/logo.svg',
          'https://cdn.beursgenoten.nl/vendor/jquery/3.7.1/jquery-3.7.1.min.js',
          'https://cdn.beursgenoten.nl/vendor/bootstrap/4.6.2/css/bootstrap.min.css',
          'https://cdn.beursgenoten.nl/vendor/bootstrap/4.6.2/js/bootstrap.bundle.min.js',
          'https://cdn.beursgenoten.nl/vendor/owlcarousel2/2.3.4/assets/owl.carousel.min.css',
          'https://cdn.beursgenoten.nl/vendor/owlcarousel2/2.3.4/owl.carousel.min.js',
          'https://cdn.beursgenoten.nl/vendor/select2/4.0.13/css/select2.min.css',
          'https://cdn.beursgenoten.nl/vendor/select2/4.0.13/js/select2.min.js',
          'https://cdn.beursgenoten.nl/js/select2.nl.custom.js',
          'https://cdn.beursgenoten.nl/vendor/moment/2.30.1/moment.min.js',
          'https://cdn.beursgenoten.nl/vendor/pusher/8.3.0/pusher.min.js',
          'https://cdn.beursgenoten.nl/vendor/lazysizes/5.3.1/lazysizes.min.js',
          'https://cdn.beursgenoten.nl/vendor/lazysizes/5.3.1/ls.unveilhooks.min.js',
          'https://cdn.beursgenoten.nl/css/webfonts.css?v=06102023',
          'https://cdn.beursgenoten.nl/webfonts/lato-v24-latin-regular.woff',
          'https://cdn.beursgenoten.nl/webfonts/lato-v24-latin-regular.woff2',
          'https://cdn.beursgenoten.nl/webfonts/lato-v24-latin-italic.woff',
          'https://cdn.beursgenoten.nl/webfonts/lato-v24-latin-italic.woff2',
          'https://cdn.beursgenoten.nl/webfonts/lato-v24-latin-700.woff',
          'https://cdn.beursgenoten.nl/webfonts/lato-v24-latin-700.woff2',
          'https://cdn.beursgenoten.nl/webfonts/lato-v24-latin-700italic.woff',
          'https://cdn.beursgenoten.nl/webfonts/lato-v24-latin-700italic.woff2',
          'https://cdn.beursgenoten.nl/webfonts/mulish-v13-latin-regular.woff',
          'https://cdn.beursgenoten.nl/webfonts/mulish-v13-latin-regular.woff2',
          'https://cdn.beursgenoten.nl/webfonts/mulish-v13-latin-italic.woff',
          'https://cdn.beursgenoten.nl/webfonts/mulish-v13-latin-italic.woff2',
          'https://cdn.beursgenoten.nl/webfonts/mulish-v13-latin-700.woff',
          'https://cdn.beursgenoten.nl/webfonts/mulish-v13-latin-700.woff2',
          'https://cdn.beursgenoten.nl/webfonts/mulish-v13-latin-700italic.woff',
          'https://cdn.beursgenoten.nl/webfonts/mulish-v13-latin-700italic.woff2',
          'https://cdn.beursgenoten.nl/vendor/fontawesome/6.5.2/css/all.min.css',
          'https://cdn.beursgenoten.nl/vendor/fontawesome/6.5.2/webfonts/fa-regular-400.ttf',
          'https://cdn.beursgenoten.nl/vendor/fontawesome/6.5.2/webfonts/fa-regular-400.woff2',
          'https://cdn.beursgenoten.nl/vendor/fontawesome/6.5.2/webfonts/fa-solid-900.ttf',
          'https://cdn.beursgenoten.nl/vendor/fontawesome/6.5.2/webfonts/fa-solid-900.woff2',
          'https://cdn.beursgenoten.nl/vendor/fontawesome/6.5.2/webfonts/fa-brands-400.ttf',
          'https://cdn.beursgenoten.nl/vendor/fontawesome/6.5.2/webfonts/fa-brands-400.woff2',
          'https://cdn.beursgenoten.nl/vendor/jqwidgets/19.0.0/styles/jqx.base.css',
          'https://cdn.beursgenoten.nl/vendor/jqwidgets/19.0.0/jqxcore.js',
          'https://cdn.beursgenoten.nl/vendor/jqwidgets/19.0.0/jqxloader.js',
          'https://cdn.beursgenoten.nl/vendor/jqwidgets/19.0.0/jqxdata.js',
          'https://cdn.beursgenoten.nl/vendor/jqwidgets/19.0.0/jqxdraw.js',
          'https://cdn.beursgenoten.nl/vendor/jqwidgets/19.0.0/jqxchart.core.js',
          'https://cdn.beursgenoten.nl/vendor/jqwidgets/19.0.0/jqxchart.rangeselector.js',
          'https://cdn.beursgenoten.nl/vendor/intl-tel-input/18.5.3/css/intlTelInput.min.css',
          'https://cdn.beursgenoten.nl/vendor/intl-tel-input/18.5.3/js/intlTelInput.min.js',
          'https://cdn.beursgenoten.nl/vendor/intl-tel-input/18.5.3/js/utils.js',
          'https://cdn.beursgenoten.nl/vendor/infinite-scroll/3.0.6/infinite-scroll.pkgd.min.js', 
          'https://cdn.beursgenoten.nl/vendor/tinysort/3.2.5/tinysort.min.js'
        ]);
      })
    );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if(key === cacheName) { return; }
        return caches.delete(key);
      }));
    })
  );
});

self.addEventListener('fetch', function(event) {
  if(event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    }).catch(function() {      
      return caches.match('https://www.beursgenoten.nl/offline?v=2');
    })
  );
});
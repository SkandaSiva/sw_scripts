self.addEventListener('install', function(event){
    console.log('SW installed');
    event.waitUntil(
     caches.open('static')
      .then(function(cache){
        cache.addAll([
            '/',
            '/index.php',
            '/offline.html',
            '/manifest.json',
            '/img/pwa/pwa.svg',
            '/img/pwa/512.png',
            '/img/pwa/192.png',
            '/img/pwa/maskable_icon.png',
            '/img/pwa/desc-1.png',
            '/img/pwa/desc-2.png',
            '/img/pwa/desc-3.png',
			'image/png/favicon.png',
			'css/bootstrap.css',
			'fonts/icon-font/css/style.css',
			'fonts/typography-font/typo.css',
			'fonts/fontawesome-5/css/all.css',
			'plugins/aos/aos.min.css',
			'plugins/fancybox/jquery.fancybox.min.css',
			'plugins/nice-select/nice-select.min.css',
			'plugins/slick/slick.min.css',
			'plugins/theme-mode-switcher/switcher-panel.css',
			'css/main.css',
			'https://cdn.onesignal.com/sdks/OneSignalSDK.js',
            
        ])
      })
    );
});


self.addEventListener('activate', function(){
    console.log('Sw Activate..')
})


self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(res) {
          if (res) {
            return res;
          } else {
            return fetch(event.request);
          }
        })
    );
  });
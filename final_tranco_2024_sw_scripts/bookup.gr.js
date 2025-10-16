const staticCache = 'static-cache-v1';

const staticAssets = [
    '/business-directory.php',
    "/includes/vendor/bootstrap/css/bootstrap.min.css", 
    "/includes/vendor/font-awesome/css/font-awesome.min.css", 
    "/includes/css/saasappoint-business-directory.css", 
    "/includes/css/custom.css", 
    "/includes/css/global-css_variables.css", 
    "/includes/js/app.js", 
    "/includes/vendor/jquery/jquery.min.js", 
    "/includes/vendor/bootstrap/js/bootstrap.min.js", 
    "/includes/js/saasappoint-business-directory.js", 
    "/includes/js/saasappoint-set-languages.js", 
    "/includes/font/montserrat.css", 
    "/includes/font/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2", 
    "/includes/vendor/font-awesome/fonts/fontawesome-webfont.woff2?v=4.7.0", 
    "/includes/lib/saasappoint_business_directory_ajax.php", 
    "/manifest.json"
];

var arr = [];

// installed sw
self.addEventListener('install', (evt) => {
    // console.log('sw has been installed');
    evt.waitUntil(
        caches.open(staticCache).then(cache => {
            console.log('caching assets');
            cache.addAll(staticAssets);

        })
    );
});

// activated sw
self.addEventListener('activate', (evt) => {
    // console.log('sw has been activated');
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== staticCache)
                .map(key => caches.delete(key))
            )
        })
    );
});

// fetch events
self.addEventListener('fetch', (evt) => {
    // console.log('fetch event', evt);
    // console.log('request: ', evt.request.url)
    // arr.push(evt.request.url.replace('http://localhost:88', ''));
    // console.log(arr);

    // commented because causes some redirect error
    // evt.respondWith(
    //     caches.match(evt.request)
    //         .then(cacheRes => {
    //             return cacheRes || fetch(evt.request);
    //         })
    // )
});
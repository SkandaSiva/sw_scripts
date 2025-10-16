const version = 71;
const staticCacheName = 'cache-static-v' + version;
const dynamicCacheName = 'cache-dynamic-v1';
const assets = [
  '/favicon.ico',
  '/offline.html',
  '/frontend/resource/relaunch2020/img/touch-icon_192x192.png',
  '/frontend/resource/relaunch2020/css/MyFontsWebfontsKit.css',  
  '/frontend/resource/relaunch2020/plugins/font-awesome-4.7.0/css/font-awesome.min.css',
  '/frontend/resource/relaunch2020/css/webfonts/38D517_0_0.woff',
  '/frontend/resource/relaunch2020/css/webfonts/38D517_0_0.woff2',
  '/frontend/resource/relaunch2020/css/webfonts/38D517_1_0.woff',
  '/frontend/resource/relaunch2020/css/webfonts/38D517_1_0.woff2',
  '/frontend/resource/relaunch2020/css/webfonts/38D517_2_0.woff',
  '/frontend/resource/relaunch2020/css/webfonts/38D517_2_0.woff2',
  '/frontend/resource/relaunch2020/css/webfonts/38D517_3_0.woff',
  '/frontend/resource/relaunch2020/css/webfonts/38D517_3_0.woff2',
  '/frontend/resource/relaunch2020/plugins/jquery-ui-1.10.3.custom/css/smoothness/jquery-ui-1.10.3.custom.min.css',
  '/frontend/resource/relaunch2020/css/default.css',
  '/frontend/resource/relaunch2020/css/swt.css?' + version,
  '/frontend/resource/relaunch2020/css/swt_resp.css?' + version,
  '/frontend/resource/relaunch2020/js/jquery_1.10.2.js',
  '/frontend/resource/relaunch2020/js/jquery_transit.js',
  '/frontend/resource/relaunch2020/js/jquery_easing_1.3.js',
  '/frontend/resource/relaunch2020/plugins/jquery-ui-1.10.3.custom/js/jquery-ui-1.10.3.custom.min.js',
  '/frontend/resource/relaunch2020/plugins/datepicker-config.js',
  '/frontend/resource/relaunch2020/js/swt.js?' + version,
  '/frontend/resource/relaunch2020/geo/js/geomap.js',
  '/frontend/resource/relaunch2020/css/mobile.css',
  '/frontend/resource/relaunch2020/js/jquery.mobile.custom.min.js'
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install event
self.addEventListener('install', evt => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      //console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  //console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// fetch event
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      if (cacheRes) {
        return cacheRes
      }
      return fetch(evt.request, {cache: "no-store"}).then(fetchRes => {
        //console.log(evt.request.url + ' = ' + fetchRes.status);
        /*
        return caches.open(dynamicCacheName).then(cache => {
          cache.put(evt.request.url, fetchRes.clone());
          // check cached items size
          limitCacheSize(dynamicCacheName, 15);
          return fetchRes;
        })
        */
        return fetchRes;
      });
    }).catch((err) => {
      console.log(err);
      //if(evt.request.url.indexOf('.html') > -1 || evt.request.url == 'https://www.swt.de/' || evt.request.url.indexOf('/swt/Integrale') > -1){
      if(evt.request.url.indexOf('swt.de') > -1){
        if (!navigator.onLine) {
          return caches.match('/offline.html');
        } 
      } 
    })
  );
});
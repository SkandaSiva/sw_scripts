const dataCacheName = '3v4l.org-v1-ace147';
const cacheName = '3v4l.org-final-1-ace147';
const filesToCache = [
  '/',
  '/s/c.49fa43d0.css',
  '/s/c.cb81ea11.js',
  'https://cdn.jsdelivr.net/gh/ajaxorg/ace-builds@1.4/src-min-noconflict/ace.js',
  'https://cdn.jsdelivr.net/gh/ajaxorg/ace-builds@1.4/src-min-noconflict/ext-language_tools.js',
  'https://cdn.jsdelivr.net/gh/ajaxorg/ace-builds@1.4/src-min-noconflict/mode-php.js',
  'https://cdn.jsdelivr.net/gh/ajaxorg/ace-builds@1.4/src-min-noconflict/theme-chrome.js',
  '/ext/glyphicons-halflings.png',
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          return caches.delete(key);
        }
      }));
    })
  );

  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  if (e.request.url.indexOf('https://3v4l.org/') > -1) {
    e.respondWith(
      caches.open(dataCacheName).then(function(cache) {
        return fetch(e.request).then(function(response){
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});

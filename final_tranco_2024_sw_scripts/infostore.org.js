// ������ ���� true � production
var doCache = false;

// ��� ����
var CACHE_NAME = 'tempmail-v0.10';

// ������� ������ ���
self.addEventListener('activate', event => {
   const cacheWhitelist = [CACHE_NAME];
   event.waitUntil(
       caches.keys()
           .then(keyList =>
               Promise.all(keyList.map(key => {
                   if (!cacheWhitelist.includes(key)) {
                       console.log('Deleting cache: ' + key)
                       return caches.delete(key);
                   }
               }))
           )
   );
});

// 'install' ����������, ��� ������ ������������ ������� ��������� PWA 
self.addEventListener('install', function(event) {
   if (doCache) {
       event.waitUntil(
           caches.open(CACHE_NAME)
               .then(function(cache) {
                   // �������� ������ �� ��������� (��� ����������)
                   fetch('/manifest.json')
                       .then(response => {
                           response.json()
                       })
                       .then(assets => {
                       // ��������� � �������� ������ �������� � �����
                           const urlsToCache = [
                		'/index.html',
				'/css/core.min.css',
				'/css/main.css?0.16',
				'/lib/jquery-3.4.1.min.js',
				'/index.js?0.21',
				'/lib/core.min.js?0.11',
				'/lib/main.js?0.11',
				'/lib/compose.js?0.11'
                           ]
                           cache.addAll(urlsToCache)
                           console.log('cached');
                       })
               })
       );
   }
});

// ����� ���������� ��������, ������-������ ������������� ������� � �������� �� ��� ������� �� ����, ���� ��� ����
self.addEventListener('fetch', function(event) {
	if (doCache) {
		// skip cache if not our domain
		if (event.request.url && !event.request.url.includes('tempmail.plus')) {
			return fetch(event.request);
		}
	   
		event.respondWith(
			caches.match(event.request).then(function(response) {
				return response || fetch(event.request);
			})
		);
	}
});

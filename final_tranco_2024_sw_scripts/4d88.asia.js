/*
4d88.com PWA
Original By 4D88
*/
const CACHE_NAME_PREFIX = 'C4d';
const CACHE_VERSION = '882024b';
const CACHE_NAME = `${CACHE_NAME_PREFIX}-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline.html'; 
const FILES_TO_CACHE = [
	OFFLINE_URL,
	'https://h-io.com/_views/lite/img/4d88.png',
	'https://h-io.com/_views/lite/img/bar1.png',
	'https://h-io.com/_views/lite/img/bar2.png',  
	'https://h-io.com/_views/lite/img/bar3.png', 
	'https://h-io.com/_views/lite/img/bar4.png',
	'https://h-io.com/_views/lite/img/bar5.png', 
	'https://h-io.com/_views/lite/img/bar6.png',
	'https://h-io.com/_views/lite/img/bar7.png',  
	'https://h-io.com/_views/lite/img/bar15.png',  
	'https://h-io.com/_views/lite/img/bar16.png',
	'https://h-io.com/_views/lite/img/bar17.png',
	'https://h-io.com/_views/lite/favicon.ico',
	'https://h-io.com/_views/lite/img/NA.png',
	'https://h-io.com/_views/lite/img/DEFAULT.png',
	'https://h-io.com/_views/lite/img/dash-loader.gif'
	// 'https://h-io.com/_views/lite/bootstrap/fonts/glyphicons-halflings-regular.woff2',
	// 'https://h-io.com/_views/lite/bootstrap/fonts/glyphicons-halflings-regular.woff2',
	// '/_views/lite/favicon.ico',
	// '/lite/bootstrap/css/bootstrap.min.css'
	// 'https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js',
	// '/_views/lite/bootstrap/js/bootstrap.min.js',
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
 		try{
			return cache.addAll(FILES_TO_CACHE).catch((error) => {
				console.error('4D88 Failed:', error);
			});
		}catch(e){
			const filesUpdate = cache => {
				const stack = [];
				FILES_TO_CACHE.forEach(file => stack.push(
					cache.add(file).catch(_=>console.error(`4D88 Failed:${file}`))
				));
				return Promise.all(stack);
			};
		}
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName.startsWith(CACHE_NAME_PREFIX) && cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      //const source = response ? 'cache' : 'network';
      //console.log(`---Request for ${event.request.url} served from ${source}`);
		return response || fetch(event.request).then(function (response) {
			return response;
		}).catch(function () {
        return caches.match(OFFLINE_URL);
      });
    })
  );
});

function log4d88Files() {
  caches.open(CACHE_NAME).then(function (cache) {
    cache.keys().then(function (keys) {
      keys.forEach(function (key) {
		//console.log('cache');
        //console.log(key.url);
      });
    });
  });
}

function log4d88Debug() {
	console.log('Cached Files:');
  setInterval(function () {
    log4d88Files();
  }, 5000);
}
//log4d88Debug();

function flushCaches() {
  caches.keys().then(function (cacheNames) {
    return Promise.all(
      cacheNames.map(function (cacheName) {
		console.log("del:"+cacheName);
        return caches.delete(cacheName);
      })
    );
  });
}

//flushCaches();
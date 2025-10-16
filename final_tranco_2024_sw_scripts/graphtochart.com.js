const VERSION = 3004;
const ORIGIN = location.protocol + '//' + location.hostname;
const ORIGIN2 = ORIGIN+'/';
const STATIC_CACHE_KEY = 'static-' + VERSION;
const STATIC_FILES = [
ORIGIN2
//,ORIGIN2+'js/1.js'
//,ORIGIN2+'style/pwa.css'
,ORIGIN2+'style/main.css'
,ORIGIN2+'style/service-worker-update.css?20240813'

//,ORIGIN2+'make.php'
//,ORIGIN2+'chart.php'
//,ORIGIN2+'setting.php'
//,ORIGIN2+'page.php'
//,'https://code.jquery.com/jquery-3.5.1.min.js'
//,'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js'
];

const CACHE_KEYS = [
  STATIC_CACHE_KEY
];
self.addEventListener('install', function(event) {
  return install(event);
});
self.addEventListener('message', e => {
  if(e.data=='update'){return install(e.data);}
  else{
	  let promise = caches.open(STATIC_CACHE_KEY)
		.then((cache) => {
		  let command = e.data.command;
		  let url = e.data.url;
		  switch (command) {
			case 'add':
			  let request = new Request(url);
			  return fetch(request)
				.then(response => cache.put(url, response));
			default:
			  return Promise.resolve();
		  }
		})
		.catch(error => {
		  console.error(error);
		});
	  e.waitUntil(promise);
  }
});
const install = (event) => {
  return event.waitUntil(
    caches.open(STATIC_CACHE_KEY)
      .then(function(cache) {
        STATIC_FILES.map(url => {
          return fetch(new Request(url, { cache: 'no-cache', mode: 'no-cors' })).then(response => {
            return cache.put(url, response);
          });
        })
      })
      .catch(function(err) {
        console.log(err);
      })
  );
}
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request,{ignoreVary:true}).then(response => {
      return response || fetch(event.request);
    })
  );
});
self.addEventListener('activate', function(evt) {
    evt.waitUntil(
      caches.keys().then(function(keys) {
            var promises = [];
            keys.forEach(function(cacheName) {
              if (cacheName != STATIC_CACHE_KEY)
                promises.push(caches.delete(cacheName));
            });
            return Promise.all(promises);
          }));
  });
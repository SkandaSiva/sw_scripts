
const pfnStaticCacheName = 'pfn-v1';
const staticFileExt = ["css","js","gif","jpeg","jpg","png","bmp","ico"];

var idbDatabase;
var IDB_VERSION = 1;
var STOP_RETRYING_AFTER = 86400000; // One day, in milliseconds.
var STORE_NAME = 'pfn-urls';

/**********************CODE FOR OFFLINE TRACKING******************************/
// This is basic boilerplate for interacting with IndexedDB. Adapted from
// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
function openDatabaseAndReplayRequests() {
  var indexedDBOpenRequest = indexedDB.open('offline-analytics', IDB_VERSION);

  // This top-level error handler will be invoked any time there's an IndexedDB-related error.
  indexedDBOpenRequest.onerror = function(error) {
    console.error('IndexedDB error:', error);
  };

  // This should only execute if there's a need to create a new database for the given IDB_VERSION.
  indexedDBOpenRequest.onupgradeneeded = function() {
    this.result.createObjectStore(STORE_NAME, {keyPath: 'url'});
  };

  // This will execute each time the database is opened.
  indexedDBOpenRequest.onsuccess = function() {
    idbDatabase = this.result;
    replayAnalyticsRequests();
  };
}

// Helper method to get the object store that we care about.
function getObjectStore(storeName, mode) {
  return idbDatabase.transaction(storeName, mode).objectStore(storeName);
}

function replayAnalyticsRequests() {
  var savedRequests = [];

  getObjectStore(STORE_NAME).openCursor().onsuccess = function(event) {
    // See https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#Using_a_cursor
    var cursor = event.target.result;

    if (cursor) {
      // Keep moving the cursor forward and collecting saved requests.
      savedRequests.push(cursor.value);
      cursor.continue();
    } else {
      // At this point, we have all the saved requests.
      console.log('About to replay %d saved Google Analytics requests...',
        savedRequests.length);

      savedRequests.forEach(function(savedRequest) {
        var queueTime = Date.now() - savedRequest.timestamp;
        if (queueTime > STOP_RETRYING_AFTER) {
          getObjectStore(STORE_NAME, 'readwrite').delete(savedRequest.url);
          console.log(' Request has been queued for %d milliseconds. ' +
            'No longer attempting to replay.', queueTime);
        } else {
          // The qt= URL parameter specifies the time delta in between right now, and when the
          // /collect request was initially intended to be sent. See
          // https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#qt
          var requestUrl = savedRequest.url + '&qt=' + queueTime;

          console.log(' Replaying', requestUrl);

          fetch(requestUrl).then(function(response) {
            if (response.status < 400) {
              // If sending the /collect request was successful, then remove it from the IndexedDB.
              getObjectStore(STORE_NAME, 'readwrite').delete(savedRequest.url);
              console.log(' Replaying succeeded.');
            } else {
              // This will be triggered if, e.g., Google Analytics returns a HTTP 50x response.
              // The request will be replayed the next time the service worker starts up.
              console.error(' Replaying failed:', response);
            }
          }).catch(function(error) {
            // This will be triggered if the network is still down. The request will be replayed again
            // the next time the service worker starts up.
            console.error(' Replaying failed:', error);
          });
        }
      });
    }
  };
}

// Open the IndexedDB and check for requests to replay each time the service worker starts up.
// Since the service worker is terminated fairly frequently, it should start up again for most
// page navigations. It also might start up if it's used in a background sync or a push
// notification context.
openDatabaseAndReplayRequests();

function checkForAnalyticsRequest(requestUrl){
	var url = new URL(requestUrl);

	if (((url.hostname === 'www.google-analytics.com' ||
		url.hostname === 'ssl.google-analytics.com') &&
		url.pathname === '/collect') || url.hostname === 'www.googletagmanager.com' || url.hostname === 'www.googletagservices.com') {
		return true;
	}
	
	return false;
}

function checkAndSaveAnalyticsRequest(requestUrl){
	if(checkForAnalyticsRequest(requestUrl)){
		console.log('  Storing Google Analytics request in IndexedDB to be replayed later.');
		getObjectStore(STORE_NAME, 'readwrite').add({
			url: requestUrl,
			timestamp: Date.now()
		});
		
		return true;
	}
	
	return false;
}

/**********************END OF CODE FOR OFFLINE TRACKING******************************/

//caching new file
self.addEventListener('install', function(event) {
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(pfnStaticCacheName).then(function(cache) {
      return cache.addAll(
        [
		  'Push_PWA_Test/offlinepage.html',
		  'images/offline.png'
        ]
      );
    })
  );
});

self.addEventListener('activate', function(event) {
  //deleting old cached files from previous versions of service worker
  var cacheWhitelist = [pfnStaticCacheName];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
			console.log('deleting ' + cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

function shouldHandleFetch (event) {
	//we are only handling get requests that are for personalfn resources
  return (event.request.method.toLowerCase() === 'get' && (event.request.url.indexOf('https://www.personalfn.com') === 0 || checkForAnalyticsRequest(event.request.url)))
}

self.addEventListener('fetch', function(event) {
  if (shouldHandleFetch(event)) {
	var requestParts = event.request.url.split('?')[0].split('.');
	if(event.request.url.indexOf('sw.js') > 0 || staticFileExt.indexOf(requestParts[requestParts.length - 1]) === -1 || checkForAnalyticsRequest(event.request.url)){
      respondFromNetworkThenCache(event);
    } else {
      respondFromCacheThenNetwork(event);
    }
  }
});

function addToCache (request, response, cacheName) {
  if (response.ok) {
	try{
		caches.open(cacheName).then(function(cache) {
          cache.put(request.clone(), response);
		  console.log('Cache added: ' + request.url);
		});
	}catch(e){}
  }
}

function offlineResponse () {
  return caches.match('Push_PWA_Test/offlinepage.html');
}

function fetchFromCache (event) {
	if(!checkAndSaveAnalyticsRequest(event.request.url)) {
	  return caches.match(event.request).then(response => {
		if (!response) {
		  // A synchronous error that will kick off the catch handler
		  throw Error('${event.request.url} not found in cache')
		}
		return response
	  })
	}
	else {
		throw Error('${event.request.url} not found in cache')
	}
}

function respondFromNetworkThenCache (event) {
  // Check network first, then cache
  event.respondWith(
    fetch(event.request).then(function(response) {
		  addToCache(event.request, response.clone(), pfnStaticCacheName);
          return response;
      })
	  .catch(() => fetchFromCache(event))
      .catch(() => offlineResponse())
  );
}

function respondFromCacheThenNetwork (event) {
  // Check cache first, then network
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request).then(function(response) {
		  addToCache(event.request, response.clone(), pfnStaticCacheName);
          return response;
      }).catch(function() {
		return offlineResponse();
	  })
    })
  );
}
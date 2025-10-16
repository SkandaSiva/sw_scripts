/************************************************
 * Unified Service Worker for Qbix Platform App
 ************************************************/
var Q = {
	info: {
		baseUrl: "https://qbix.com",
		serviceWorkerUrl: "https://qbix.com/Q-ServiceWorker"
	}
};
(function () {
	// This anonymous closure is not accessible from outside.
	// It contains code to read, store and attach cookie-like
	// Cookie-JS request headers, and Set-Cookie-JS response headers.

	var cookies = [];

	self.addEventListener('fetch', function (event) {
		// if request is not for same origin, then just send it
		var url = new URL(event.request.url);
		var ext = event.request.url.split('?')[0]
			.split('.').pop().toLowerCase();
		if (url.origin !== self.location.origin
		|| ['js', 'css'].indexOf(ext) < 0) {
			return; // let the browser do its usual fetch
		}
		if (url.toString() === Q.info.serviceWorkerUrl) {
			return event.respondWith(new Response(
				"// Can't peek at serviceWorker JS, please use Q.ServiceWorker.start()",
				{
					headers: {'Content-Type': 'text/javascript'}
				}
			));
		}
		return event.respondWith(
			caches.match(event.request)
			.then(function (response) {
				if (response !== undefined) {
					console.log('cached: ' + event.request.url);
					return response;
				}
				// otherwise, attach some headers
				return fetch(event.request);
			})
		);
	});
	self.addEventListener("install", (event) => {
		self.skipWaiting();
	});
	self.addEventListener("activate", (event) => {
  		event.waitUntil(clients.claim());
	});
	self.addEventListener('message', function (event) {
		var data = event.data || {};
		if (data.type === 'Q.Cache.put') {
			caches.open('Q').then(function (cache) {
				data.items.forEach(function (item) {
					var o = {};
					if (item.headers) {
						o.headers = new Headers(item.headers);
					}
					cache.put(item.url, new Response(item.content, o));
					console.log("cache.put " + item.url);
				});
			});
		}
	});
})();

/************************************************
 * Qbix Platform plugins have added their own code
 * to this service worker through the config named
 * Q/javascript/serviceWorker/modules
 ************************************************/

/**** Qbix: produced by Q_ServiceWorker::inlineCode()
 * SOURCE: /live/Q/platform/plugins/Q/scripts/Q/serviceWorker.js
 * TIME: 1714063029
 */
/**
 * Functions related to IndexedDB, when it is available
 * @class Q.IndexedDB
 * @constructor
 * @param {String} uriString
 */
Q.IndexedDB = {
	open: function (dbName, storeName, params, callback) {
		var keyPath = (typeof params === 'string' ? params : params.keyPath);
		var version = undefined;
		var open = indexedDB.open(dbName, version);
		var _triedAddingObjectStore = false;
		open.onupgradeneeded = function() {
			var db = this.result;
			if (!db.objectStoreNames.contains(storeName)
			&& !_triedAddingObjectStore) {
				_triedAddingObjectStore = true;
				var store = db.createObjectStore(storeName, {keyPath: keyPath});
				var idxs = params.indexes;
				if (idxs) {
					for (var i=0, l=idxs.length; i<l; ++i) {
						store.createIndex(idxs[i][0], idxs[i][1], idxs[i][2]);
					}
				}
			}
		};
		open.onerror = function (error) {
			callback && callback.call(Q.IndexedDB, error);
		};
		open.onsuccess = function() {
			var db = this.result;
			version = db.version;
			if (!db.objectStoreNames.contains(storeName)) {
				// need to upgrade version and add this store
				++version;
				db.close();
				var o = indexedDB.open(dbName, version);
				Q.take(open, ['onupgradeneeded', 'onerror', 'onsuccess'], o);
				return;
			}
			// Start a new transaction
			var tx = db.transaction(storeName, "readwrite");
			var store = tx.objectStore(storeName);
			callback && callback.call(Q.IndexedDB, null, store);
			// Close the db when the transaction is done
			tx.oncomplete = function() {
				db.close();
			};
		};
	},
	put: function (store, value, onSuccess, onError) {
		if (!onError) {
			onError = function () {
				throw new Q.Error("Q.IndexedDB.put error:" + request.errorCode);
			}
		}
		var request = store.put(value);
		request.onsuccess = onSuccess;
		request.onError = onError;
	},
	get: function (store, key, onSuccess, onError) {
		if (!onError) {
			onError = function () {
				throw new Q.Error("Q.IndexedDB.get error:" + request.errorCode);
			}
		}
		var request = store.get(key);
		request.onsuccess = function (event) {
			Q.handle(onSuccess, Q.IndexedDB, [event.target.result, event]);
		};
		request.onError = onError;
	}
};


/************************************************
 * Below, Qbix Platform plugins have a chance to 
 * add their own code to this service worker by
 * adding hooks after  "Q/serviceWorker/response"
 ************************************************/


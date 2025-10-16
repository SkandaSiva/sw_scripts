
let pwaConfig = null;
/**
* The listener function for fetch events
* @param {Object} e the javascript event object
*/
const fetchListener = async e => {
// get pathname from request data
const { pathname } = new URL(e.request.url, self.location)
render({
url: pathname,
e
})
}
/**
* The listener function for messages from the main code
* This might get more elaborate once we'll send diffrent messages from the frontend to the service worker
* @param {Object} e the javascript event object
*/
const messageListener = async e => {
pwaConfig = null;
keyValueStore.set('config', e.data);
getPwaConfig();
}
/**
* A lazy getter for getting the static file config
* @returns {Object} the pwa config
*/
const getPwaConfig = async () => {
if (pwaConfig != null) {
return pwaConfig;
}
const pwaConfigString = await keyValueStore.get('config');
pwaConfig = pwaConfigString != null
? JSON.parse(pwaConfigString)
: { pwaEnabled: false };
return getPwaConfig();
}
/**
* The render function for the fetch, decides wether to get from the worker or server
* @param {string} url the url to fetch
* @param {Object} e the javascript event object
*/
const render = ({ url, e }) => {
const shouldCache = pwaConfig && pwaConfig.pwaEnabled
&& pwaConfig.pwaStaticFileCache.some(testUrl => url.includes(testUrl));
if(!shouldCache) {
return;
}
e.respondWith(new Promise(async (resolve, reject) => {
const file = await getCachedFile(url);
resolve(file);
}));
}
/**
* The function to get the content from the cache, if not cached, cache is loaded and function is called recursivly
* @param {string} url the url to get from the cache
*/
const getCachedFile = async url => {
const cache = await caches.open('cache'),
matching = await cache.match(url);
if (matching) {
return matching;
} else {
const res = await fetch(url);
cache.put(url, res);
return getCachedFile(url);
}
}
// A helper class to initiate a simple key value store
class KeyValueStore {
/**
* Initiated a new indexedDB for our key value store
*/
constructor() {
this.connection = indexedDB.open('keyValue', 1);
this.connection.onupgradeneeded = () => {
this.db = this.connection.result
this.keyValue = this.db.createObjectStore('keyValue', {
keyPath: 'key'
});
}
this.connection.onsuccess = e => {
this.db = e.target.result
}
}
/**
* get function for the key value store
* @param {string} key the key to get
*/
async get (key) {
return new Promise(async (resolve, reject) => {
if (!this.db) {
resolve(null);
return;
}
const req = this.db.transaction('keyValue', 'readonly').objectStore('keyValue').get(key);
req.onerror = e => reject(e);
req.onsuccess = e => (req.result) ? resolve(req.result.value) : resolve(null);
});
}
/**
* set function for the key value store
* @param {string} key the key to set
* @param {string} value the value to set
*/
async set (key, value) {
return new Promise(async (resolve, reject) => {
if (!this.db) {
resolve(null);
return;
}
const req = this.db.transaction('keyValue', 'readwrite').objectStore('keyValue').put({ key, value });
req.onsuccess = e => resolve({ key, value });
req.onerror = err => reject(err);
})
}
};
// Init the key value store
const keyValueStore = new KeyValueStore();
// Bind the event listeners
self.addEventListener('fetch', fetchListener);
self.addEventListener('message', messageListener);
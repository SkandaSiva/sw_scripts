
const cacheName = 'shudder.com-site-cache';
const appName = 'shudder';
const assets = '^http?s:\/\/(local|dev|staging|pre-prod|www).shudder.com\/.*.(js|css|woff|woff2|otf|png|svg|jpg|jpeg)$';
const cachePatterns = [
// Google fonts CSS
'http?s:\/\/fonts.googleapis.com/.*',
// Google fonts static files
'http?s:\/\/fonts.gstatic.com/.*',
// Site assets
assets,
];
const isCachable = function (request) {
for (let i = 0; i < cachePatterns.length; i++) {
if (
(new RegExp(cachePatterns[i])).test(request.url) &&
request.method === 'GET' &&
request.url.indexOf('pixel') === -1
) {
return true;
}
}
return false;
};
self.skipWaiting().then(r => r);
self.addEventListener('fetch', function (event) {
if (isCachable(event.request)) {
event.respondWith(
caches.open(cacheName).then(function (cache) {
return cache.match(event.request).then(function (response) {
return response || fetch(event.request).then(function (response) {
try {
if(response.status === 200) {
cache.put(event.request, response.clone());
}
} catch (e) {
clearCache();
}
return response;
});
});
})
);
}
});
self.addEventListener('activate', e => {
e.waitUntil(clearCache());
e.waitUntil(updateFromManifest());
return self.clients.claim();
});

const updateFromManifest = () => {
fetch(
'/app/themes/rlje/subthemes/' + appName + '/src/manifest.json',
{
method: 'GET',
redirect: 'follow'
}
)
.then(response => response.text())
.then(result => {
fetchManifestFiles(result);
})
.catch(error => {
console.log('error', error);
});
};

const fetchManifestFiles = (source) => {
try {
const data = JSON.parse(source);
for (const property in data) {
if (data.hasOwnProperty(property)) {
let rewritten = () => {
const exclusions = ['/favicon.ico', '/robots.txt', '/svg/svg-map.svg'];
return exclusions.indexOf(data[property]) !== -1 ||
data[property].indexOf('fonts') !== -1;

};
let url = rewritten() ? data[property] : '/app/themes/rlje/subthemes/' + appName + data[property];
fetch(
url,
{
method: 'GET',
redirect: 'follow'
}
)
.then(response => saveToCache(url, response))
.catch(error => console.log('error', error));
}
}
} catch (e) {
console.log(e);
}
};

const saveToCache = (url, response) => {
try {
caches.open(cacheName).then(function (cache) {
try {
cache.put(url, response.clone());
} catch (e) {
console.log(e);
}
});
} catch (e) {
console.log(e);
}
};

const clearCache = () => {
caches.keys().then(keyList => {
return Promise.all(keyList.map(key => {
if (key !== cacheName) {
return caches.delete(key);
}
}));
});
};


// Get the version from the query parameter in the URL
const version = new URL(location).searchParams.get('version');
// Create a unique cache name based on the version
const staticCacheName = 'V' + version + 'staticfiles';
const preCacheAssets = [
'/common/v/' + version + '/css/site-offline.css',
'/common/v/' + version + '/js/offline_page.js',
'/css/v/' + version + '/hybrid/google-fonts.css',
'/css/v/' + version + '/hybrid/bespoke-fonts/montserrat/montserrat-v26-cyrillic_cyrillic-ext_latin_latin-ext_vietnamese-regular.woff2',
'/css/v/' + version + '/hybrid/bespoke-fonts/montserrat/montserrat-v26-cyrillic_cyrillic-ext_latin_latin-ext_vietnamese-italic.woff2',
'/css/v/' + version + '/hybrid/bespoke-fonts/montserrat/montserrat-v26-cyrillic_cyrillic-ext_latin_latin-ext_vietnamese-700.woff2',
'/css/v/' + version + '/hybrid/bespoke-fonts/montserrat/montserrat-v26-cyrillic_cyrillic-ext_latin_latin-ext_vietnamese-700italic.woff2',
'/css/v/' + version + '/hybrid/bespoke-fonts/montserrat/montserrat-v26-cyrillic_cyrillic-ext_latin_latin-ext_vietnamese-800.woff2',
'/css/v/' + version + '/hybrid/bespoke-fonts/montserrat/montserrat-v26-cyrillic_cyrillic-ext_latin_latin-ext_vietnamese-800italic.woff2',
'/css/v/' + version + '/hybrid/bespoke-fonts/materialIcons-regular.woff2',
'/images/hybrid/logo/logo.svg',
'/images/instance/logo/poweredByIngentaLogo.png',
'/images/instance/logo/poweredByIngentaLogo-highres.png',
'/css/hybrid/bespoke-fonts/fontawesome-webfont.woff2?v=4.7.0',
'/common/css/flowpaper.css',
'/images/instance/favicon.png',
'/common/images/flowpaper/assets_zine/material/bttnBookView.png',
'/common/images/flowpaper/assets_zine/material/bttnDownload.png',
'/common/images/flowpaper/assets_zine/material/bttnFind.png',
'/common/images/flowpaper/assets_zine/material/bttnFullscreen.png',
'/common/images/flowpaper/assets_zine/material/bttnOutline.png',
'/common/images/flowpaper/assets_zine/material/bttnPrevNext.png',
'/common/images/flowpaper/assets_zine/material/bttnPrevPage.png',
'/common/images/flowpaper/assets_zine/material/bttnPrint.png',
'/common/images/flowpaper/assets_zine/material/bttnSinglePage.png',
'/common/images/flowpaper/assets_zine/material/bttnSocialShare.png',
'/common/images/flowpaper/assets_zine/material/bttnTextSelect.png',
'/common/images/flowpaper/assets_zine/material/bttnHand.png',
'/common/images/flowpaper/assets_zine/material/bttnMore.png',
'/common/images/flowpaper/assets_zine/material/bttnZoomOut.png',
'/common/images/flowpaper/assets_zine/material/bttnZoomIn.png',
'/common/js/flowpaper/flowpaper_handlers.js',
'/common/js/flowpaper/flowpaper.js',
'/common/js/flowpaper/FlowPaperViewer.js',
'/common/js/flowpaper/jquery.extensions.min.js',
'/common/js/flowpaper/jquery.min.js',
'/common/js/flowpaper/three.min.js',
'/common/js/flowpaper/UI_Zine.xml?reload=1600870844731',
'/common/js/locale/en_US/FlowPaper.txt',
'https://cdnjs.cloudflare.com/ajax/libs/froala-editor/2.8.1/css/froala_style.min.css' 
]
// Event listener for the 'install' event
addEventListener('install', installEvent => {
// Wait until the installation is complete before caching files
self.skipWaiting();
installEvent.waitUntil(
caches.open(staticCacheName)
.then( staticCache => {
// Nice to have
console.log('Install nice to have!');
staticCache.addAll(preCacheAssets); // end addAll
// Must have
return staticCache.addAll([
'/offline'
]); // end return addAll
// Cache your files here
}) // end open then
); //end waitUntil
}); // end addEventListner
addEventListener('activate', activateEvent => {
console.log('activate Event fired');
activateEvent.waitUntil(
caches.keys()
.then( cacheNames => {
console.log('remove cache');
return Promise.all(
cacheNames.map( cacheName => {
//don't remove the static cache and the article caches
if (cacheName != staticCacheName && !cacheName.startsWith('article-')) {
return caches.delete(cacheName);
} // end if
}) // end map
); // end return Promise.all
}) // end keys then
.then( () => {
console.log('claim method triggered')
return clients.claim();
}) // end then
); // end waitUntil
}); // end addEventListener
addEventListener('fetch', fetchEvent => {
const request = fetchEvent.request;
// Get the request
const url = new URL(request.url); //without query string part 
if (fetchEvent.request.method !== "GET") {
return; // We aren't caching POSTs
}
if (request.headers.get('Accept').includes('image') && url.search.includes('resolution')) {
// remove/ignore query string from the request to allow to match file in the cache
fetchEvent.respondWith(
caches.match(request, {ignoreSearch: true}).then( responseFromCache => {
if (responseFromCache) {
return responseFromCache;
} // end if
//otheriwse fetch from the network as per normal
return fetch(request);
}) // end match then
); // end respondWith
} else {
// console.log(request);
fetchEvent.respondWith(
// First look in the cache
caches.match(request).then( responseFromCache => {
if (responseFromCache) {
return responseFromCache;
} // end if
// Otherwise fetch from the network
return fetch(request)
.catch( error => {
console.log('show fallback page')
//exclude iframe pages from the offline page using xmlPath as the identifier
const isHTMLPage = fetchEvent.request.headers.get('accept').includes('text/html') 
&& fetchEvent.request.method === 'GET' 
&& !url.search.includes('xmlPath');
if(isHTMLPage) return caches.match('/offline'); // Show a fallback page instead
}); // end fetch catch and return
}) // end match then
); // end respondWith
} // end else
}); // end addEventListener

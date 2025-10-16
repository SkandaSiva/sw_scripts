// vim: set ts=4 sw=4:
/*jshint esversion: 8 */

var homeRepo = 'https://raw.githubusercontent.com/lwindolf/'
var cachePrefix = 'lzone-cheat-sheets';
var cacheVersion = 20240605;
var cacheName = cachePrefix + '-' + cacheVersion;
var filesToCache = [
  '/',
  '/assets/css/just-the-docs-dark.css',
  '/assets/css/just-the-docs-default.css',
  '/assets/css/just-the-docs-light.css',
  '/assets/css/glightbox.min.css',
  '/assets/js/app.js',
  '/assets/js/cheat-sheet-installer.js',
  '/assets/js/cheat-sheet-renderer.js',
  '/assets/js/doctree.js',
  '/assets/js/github-repo.js',
  '/assets/js/just-the-docs.js',
  '/assets/js/runbook.js',
  '/assets/js/search.js',
  '/assets/js/section.js',
  '/assets/js/settings.js',
  '/assets/js/sidebar.js',
  '/assets/js/helpers/debounce.js',
  '/assets/js/helpers/render.js',
  '/assets/js/vendor/asciidoctor.min.js',
  '/assets/js/vendor/glightbox.min.js',
  '/assets/js/vendor/handlebars.min.js',
  '/assets/js/vendor/lunr.min.js',
  '/assets/js/vendor/mermaid.min.js',
  '/assets/js/vendor/purify.es.js',
  '/assets/js/vendor/rst2html.min.js',
  '/assets/js/vendor/showdown.min.js',
  '/assets/js/views/Chat.js',
  '/assets/js/views/Home.js',
  '/assets/js/views/LWindolf.js',
  '/assets/js/views/Settings.js',
  '/assets/js/wurmterm/WurmTermBackend.js',
  '/assets/js/wurmterm/WurmTermSettingsView.js',
  '/assets/js/wurmterm/WurmTermView.js',
  '/assets/js/wurmterm/WurmTermWidget.js',
  '/assets/js/search-data.json'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache).then(() => {
        /* Cleanup deprecated cache versions */
        caches.keys().then((keyList) => {
          for(k of keyList) {
            if(0 == k.indexOf(cachePrefix) && k !== cacheName) {
              console.log(`Dropping cache version ${k}`);
              caches.delete(k);
            }
          }
        });
      });
    })  
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', async (e) => {
  var pathname = new URL(e.request.url).pathname;
  /* cache all webapp files and stuff from our github home repo */
  if(e.request.url.startsWith(homeRepo) ||
     (0 == e.request.url.indexOf(location.origin) &&
      pathname.match(/\.(html|js|css|svg|json)$/))) {
    console.log("cache check for "+pathname);
    e.respondWith(caches.open(cacheName).then((cache) => {
      return cache.match(e.request).then((cachedResponse) => {
        return cachedResponse || fetch(e.request.url).then((fetchedResponse) => {
          cache.put(e.request, fetchedResponse.clone());
          return fetchedResponse;
        });
      });
    }));
  } else {
    return;
  }
});

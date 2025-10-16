// This code executes in its own worker or thread
self.addEventListener("install", event => {
   console.log("Service worker installed");

  // cache a cat SVG
  event.waitUntil(
    caches.open('static-v1').then(cache => cache.add('/ui/vanilla/assets/favicons/icon-big.png'))
  );
});

self.addEventListener("activate", event => {
   console.log("Service worker activated");
});


self.addEventListener('fetch', function(event) {
   // console.log("Service worker fetch");
  const url = new URL(event.request.url);

  // serve the cat SVG from the cache if the request is
  // same-origin and the path is '/dog.svg'
  if (url.origin == location.origin && url.pathname == '/dog.svg') {
    event.respondWith(caches.match('/ui/vanilla/assets/favicons/icon-big.png'));
  }
});
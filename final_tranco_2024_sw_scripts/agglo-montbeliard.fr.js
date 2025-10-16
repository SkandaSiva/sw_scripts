self.addEventListener('install', (e) => {
    console.log("install");
});

self.addEventListener('fetch', (e) => {
  // console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request)),
  );
});

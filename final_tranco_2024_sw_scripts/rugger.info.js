self.addEventListener("install", event => {
   console.debug("Service worker installed");
});
self.addEventListener("activate", event => {
   console.debug("Service worker activated");
});


self.addEventListener('fetch', function() {
    return;
});


self.addEventListener('activate', function(event) {
    return self.clients.claim();
});
self.addEventListener('fetch', function(event) {

});


 
self.addEventListener('fetch', function (evt) {
    console.log('sw fetch()', evt.request.url)
})
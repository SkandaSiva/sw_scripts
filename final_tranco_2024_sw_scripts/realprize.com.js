var cacheName = 'rlp';
//var filesToCache = ['webapp.html'];



self.addEventListener('fetch', function(event) {
		if(event.request=='/?wa=1'){
  event.respondWith(fetch(event.request));
		}
});


self.addEventListener('install', function(event) {
	console.log('Perform install ');
});

self.addEventListener('activate', function(event) {
  console.log('Perform activate '); 
});


self.addEventListener('fetch', function(event) {
  console.log('Perform fetch ');
});
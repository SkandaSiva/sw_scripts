// Listen for request events
self.addEventListener('fetch', function (event) {

  // Get the request
  let request = event.request;

  // Bug fix
  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') return;

});

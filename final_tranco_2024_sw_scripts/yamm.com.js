if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').then(
      function (registration) {
        // Registration was successful
        console.log(
          'Service worker has been registered. ',
          registration.scope
        )
      },
      function (err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err)
      }
    )
  })
}

self.addEventListener('install', function (event) {
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request),
  );
});

self.addEventListener('fetch', function (evt)
{
  evt.respondWith(
    caches.match(evt.request).then(function (response)
    {
      return response || fetch(evt.request);
    })
  );
});
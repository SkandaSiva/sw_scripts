self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.href.replace(url.origin, '') === '/share-target/?share_target=1') {
    event.stopImmediatePropagation();

    event.respondWith((async() => {
      const cache        = await caches.open('share_target');
      const formData     = await event.request.formData();
      const fileList     = formData.getAll('file');
      const fileDataList = [];

      if (fileList) {
        for (const file of fileList) {
          fileDataList.push({
            name: file.name,
            type: file.type
          });
          await cache.put(file.name, new Response(file, {
            headers: {
              'content-length': file.size,
              'content-type'  : file.type
            }
          }));
        }
      }

      const shareTarget = JSON.stringify({
        title: formData.get('title'),
        text : formData.get('text'),
        url  : formData.get('url'),
        fileDataList
      });
      await cache.put('/share_target.json', new Response(shareTarget, {
        headers: {
          'content-type': 'application/json'
        }
      }));

      return Response.redirect('/post?share_target=1', 303);
    })());
  }
  else if (url.href.includes('https://pagead2.googlesyndication.com/')) {
    // adsense

    event.stopImmediatePropagation();
  }
});

importScripts('./ngsw-worker.js');

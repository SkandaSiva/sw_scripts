self.addEventListener('fetch', event => {
  const urls = ['/blog', '/app/draws/locator', '/app/draws/draw', '/draws/add', '/explanation/ethereum', '/doc'];
  if (
    event &&
    event.request &&
    event.request.url &&
    urls.some(url => event.request.url.includes(url)) // 🖍️
  ) {
    event.stopImmediatePropagation();
  }
});

self.importScripts('./ngsw-worker.js');

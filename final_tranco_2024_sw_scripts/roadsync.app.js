
const CACHE = 'roadsync-cache';

// eslint-disable-next-line no-restricted-globals
self.addEventListener("install", function (e) {
    precache();
})

async function precache() {
    const cache = await caches.open(CACHE);
  return await cache.addAll([
    './index.html',
    './external-assets'
  ]);
}

self.addEventListener("install", function (event) {});
self.addEventListener("fetch", function (event) {
  // console.log(event); event.respondWith(
  // (async function () {
  //   try {
  //     var res = await fetch(event.request);
  //     var cache = await caches.open('cache');
  //     return res;
  //   } catch (error) {
  //     return caches.match(event.request);
  //   }
  // })();
});

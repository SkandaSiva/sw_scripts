// let coreAssets = [];
// self.addEventListener("install", function (event) {
//   event.waitUntil(
//     caches.open("app").then(function (cache) {
//       for (let asset of coreAssets) {
//         cache.add(new Request(asset));
//       }
//       return cache;
//     })
//   );
// });
// self.addEventListener("fetch", function (event) {
//   let request = event.request;
//   if (
//     event.request.cache === "only-if-cached" &&
//     event.request.mode !== "same-origin"
//   )
//     return;
//         // Check if the request is for the downloader route
//     if (event.request.url.includes('/downloader')) {
//         // If the request is for the downloader route, do nothing and let the browser handle it
//         return;
//     }
//   if (request.headers.get("Accept").includes("text/html")) {
//     event.respondWith(
//       fetch(request)
//         .then(function (response) {
//           let copy = response.clone();
//           event.waitUntil(
//             caches.open("app").then(function (cache) {
//               return cache.put(request, copy);
//             })
//           );
//           return response;
//         })
//         .catch(function (error) {
//           return caches.match(request).then(function (response) {
//             return response || caches.match("/");
//           });
//         })
//     );
//   }
//   if (
//     request.headers.get("Accept").includes("text/css") ||
//     request.headers.get("Accept").includes("text/javascript")
//   ) {
//     event.respondWith(
//       caches.match(request).then(function (response) {
//         return (
//           response ||
//           fetch(request).then(function (response) {
//             return response;
//           })
//         );
//       })
//     );
//     return;
//   }
//   if (request.headers.get("Accept").includes("image")) {
//     event.respondWith(
//       caches.match(request).then(function (response) {
//         return (
//           response ||
//           fetch(request).then(function (response) {
//             let copy = response.clone();
//             event.waitUntil(
//               caches.open("app").then(function (cache) {
//                 return cache.put(request, copy);
//               })
//             );
//             return response;
//           })
//         );
//       })
//     );
//   }
// });

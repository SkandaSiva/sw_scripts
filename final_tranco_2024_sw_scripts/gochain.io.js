// // Template Name: Apland - App Landing Page Template
// // Template Author: Designing World
// // Template Author URL: https://wrapbootstrap.com/user/DesigningWorld

// const staticCacheName = 'precache-v1.0.1';
// const dynamicCacheName = 'runtimeCache-v1.0.1';

// // Pre Caching Assets
// const precacheAssets = [
//     '/',
//     'css/animate.css',
//     'css/bootstrap.min.css',
//     'css/classy-nav.min.css',
//     'css/owl.carousel.min.css',
//     'fonts/classy-fonts.eot',
//     'fonts/classy-fonts.svg',
//     'fonts/classy-fonts.ttf',
//     'fonts/classy-fonts.woff',
//     'img/core-img/favicon.ico',
//     'img/core-img/dot.png',
//     'img/core-img/dot2.png',
//     'img/core-img/logo.png',
//     'img/core-img/logo-white.png',
//     'img/bg-img/404.png',
//     'js/active.js',
//     'js/bootstrap.bundle.min.js',
//     'js/classy-nav.min.js',
//     'js/dark-mode-switch.js',
//     'js/jquery.min.js',
//     'js/owl.carousel.min.js',
//     'js/pwa.js',
//     'index.html',
//     'manifest.json',
//     'fallback.html',
//     'style.css'
// ];

// // Install Event
// self.addEventListener('install', function (event) {
//     event.waitUntil(
//         caches.open(staticCacheName).then(function (cache) {
//             return cache.addAll(precacheAssets);
//         })
//     );
// });

// // Activate Event
// self.addEventListener('activate', function (event) {
//     event.waitUntil(
//         caches.keys().then(keys => {
//             return Promise.all(keys
//                 .filter(key => key !== staticCacheName && key !== dynamicCacheName)
//                 .map(key => caches.delete(key))
//             );
//         })
//     );
// });

// // Fetch Event
// self.addEventListener('fetch', function (event) {
//     event.respondWith(
//         caches.match(event.request).then(cacheRes => {
//             return cacheRes || fetch(event.request).then(response => {
//                 return caches.open(dynamicCacheName).then(function (cache) {
//                     cache.put(event.request, response.clone());
//                     return response;
//                 })
//             });
//         }).catch(function() {
//             // Fallback Page, When No Internet Connection
//             return caches.match('fallback.html');
//           })
//     );
// });
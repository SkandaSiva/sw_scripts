'use strict';
const CONFIG = {"cacheName":"assets-a91c6de812f5dff500bd","assets":["/assets/js/runtime.8eedc02a765827b99cd5.bundle.js","/assets/js/desktop.2a1d05bf9c8d97f6f51b.bundle.js","/assets/js/26.d0be8721a6170fca069f.js","/assets/js/201.fe0068f88e5b938d2927.js","/assets/js/495.79b44742fb9cbb7a0844.js","/assets/js/857.03fdf4482772a660b642.js","/assets/js/358.1f9172832209bcbb45e9.js","/assets/js/938.44be412c731c2b807e5c.js","/assets/js/785.82bf459d8297fc0cdd46.js","/assets/js/590.ce7348719eb355bf450b.js","/assets/js/578.63bad6e309b1086aeac8.js","/assets/js/584.38b3d510fea0e612af65.js","/assets/js/817.0dd97f2151fc4fddd438.js","/assets/js/359.9caed33a785dabb87b9f.js","/assets/js/714.b6c51a76e142ae50a068.js","/assets/js/86.71d9a646f37a77939809.js","/assets/js/559.dbcfea73059eba580e2a.js","/assets/js/364.deb7b8574620fefdb94f.js","/assets/images/algolia-logo-c351df209f.svg","/assets/images/calctool-banner-2cdeba8ec1.png","/assets/images/calctool-black-96c67027e7.svg","/assets/images/calctool-white-3e9fe83e21.svg","/assets/images/hand-with-iphone-e3e7b19cea.png","/assets/images/homepage-example-calculators-c7bde61a86.svg","/assets/images/homepage-header-bg-58700b6581.svg","/assets/images/macbook-iphone-8491c21a98.png","/assets/images/medium-article-32d3f25bf3.png","/assets/images/mobile-calculator-49448601f5.png","/assets/images/omni-white-3fcdd97916.svg","/assets/images/omni-db2e5a9837.svg","/assets/images/omnicalculator-black-75ad6097b3.svg","/assets/images/omnicalculator-white-376d053f9f.svg","/assets/images/omnitube-thumbnail-4259de04de.png","/assets/images/patterns/bw-27ed21faeb.svg","/assets/images/patterns/chemistry-34c92a3d00.svg","/assets/images/patterns/construction-a588fa8d9a.svg","/assets/images/patterns/conversion-8bae09358c.svg","/assets/images/patterns/default-ee87dac2ab.svg","/assets/images/patterns/discover-42f0be942b.svg","/assets/images/patterns/ecology-125d01b3a4.svg","/assets/images/patterns/everyday-life-36faa33764.svg","/assets/images/patterns/finance-0234bd7353.svg","/assets/images/patterns/health-8eb38895f9.svg","/assets/images/patterns/math-3a5284983e.svg","/assets/images/patterns/other-bb4d663aa4.svg","/assets/images/patterns/physics-b529e3cdca.svg","/assets/images/patterns/sports-f3099e1f0e.svg","/assets/images/patterns/statistics-ca0342ba1a.svg"]}
/* global CONFIG */

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CONFIG.cacheName).then(
      cache => cache.addAll(CONFIG.assets)
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(
      cacheNames => Promise.all(
        cacheNames.filter(
          cacheName => cacheName !== CONFIG.cacheName
        ).map(cacheName => caches.delete(cacheName))
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(
      response => response || fetch(event.request)
    )
  );
});

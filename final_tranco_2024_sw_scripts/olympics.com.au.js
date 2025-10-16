self.importScripts('https://js.appboycdn.com/web-sdk/5.1/service-worker.js');

const addResourcesToCache = async (resources) => {
  const cache = await caches.open('v1');
  await cache.addAll(resources);
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    addResourcesToCache([
      './images/global-nav-images/news.jpg',
      './images/brand/favicon.png',
      './images/brand/indigenous-icon.png',
      './images/brand/logo-large.svg',
      './images/brand/logo-white.svg',
      './images/brand/logo.svg',
      './images/brand/yellow-logo.svg',
      './images/Capture.svg',
      './images/default-placeholder.png',
      './images/Graphics_1.svg',
      './images/Graphics_2.svg',
      './images/paris-2024-background-image.jpg'
    ])
  );
});

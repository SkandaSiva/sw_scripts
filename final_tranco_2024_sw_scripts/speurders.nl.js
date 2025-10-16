importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js',
);

workbox.setConfig({
  debug: true,
});

workbox.loadModule('workbox-routing');

workbox.routing.registerRoute(
  new RegExp('/.*\\.js'),
  new workbox.strategies.NetworkFirst(),
);

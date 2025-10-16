const FREELANCE_STACK_BASE_URL = 'https://www.freelance-stack.io';
const FREELANCE_STACK_PROXY_BASE_URL = '/fw-deals';
const FREELANCE_STACK_CLIENT_ID_FR = '1990038';
const FREELANCE_STACK_CLIENT_ID_EN = '10574606';

const STATIC_ASSETS_URL_MAP = new Map(
  Object.entries({
    'https://back.preprod.free-work.com':
      'https://staticskale5.preprod.free-work.com',
    'https://back.dev.free-work.com': 'https://static2.dev.free-work.com',
    'https://back-review1.dev.free-work.com':
      'https://static2.dev.free-work.com',
    'https://back-review2.dev.free-work.com':
      'https://static2.dev.free-work.com',
    'https://back-review3.dev.free-work.com':
      'https://static2.dev.free-work.com',
    'https://api.free-work.com': 'https://statics.free-work.com',
  })
);

importScripts('/workers/images-handler.js');

// https://github.com/GoogleChrome/samples/blob/gh-pages/service-worker/immediate-control/service-worker.js
if (typeof self.skipWaiting === 'function') {
  self.addEventListener('install', function (e) {
    // See https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-global-scope-skipwaiting
    e.waitUntil(self.skipWaiting());
  });
} else {
  console.log('self.skipWaiting() is not supported.');
}

if (self.clients && typeof self.clients.claim === 'function') {
  self.addEventListener('activate', function (e) {
    // See https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#clients-claim-method
    e.waitUntil(self.clients.claim());
  });
} else {
  console.log('self.clients.claim() is not supported.');
}

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const isImage = url.pathname.includes('/media/cache/resolve/');

  if (isImage) {
    event.respondWith(handleImageRequest(event.request));
  }
});

"use strict";

const CACHE_NAME = 'ciditools.com-1573971194696';
const SW_SUPPORTED_PROTOCOL_REGEX = /http(s?):/;
const pageUrls = JSON.parse('["/"]');
const staticAssets = JSON.parse('["//img1.wsimg.com/blobby/go/d6d00bff-669e-4c5a-a541-e7decf7eea36/gpub/4ce1a7c86682e5e8/styles.css","//img1.wsimg.com/blobby/go/d6d00bff-669e-4c5a-a541-e7decf7eea36/gpub/f729a0af713c9111/styles.css","//img1.wsimg.com/blobby/go/d6d00bff-669e-4c5a-a541-e7decf7eea36/gpub/7787a9e16c55a0bc/styles.css","https://img1.wsimg.com/poly/v2/polyfill.min.js?unknown=polyfill&flags=gated&features=default%2Cfetch%2CArray.prototype.%40%40iterator%2CArray.prototype.find%2CArray.prototype.findIndex%2CFunction.name%2CNumber.isFinite%2CPromise%2CString.prototype.repeat%2CMath.sign%2CMath.trunc%2CArray.prototype.includes%2CObject.entries%2CObject.values%2CIntersectionObserver%2CIntl.~locale.en-US","//img1.wsimg.com/blobby/go/gpub/e645c3e6fe995b50/script.js","//img1.wsimg.com/ceph-p3-01/website-builder-data-prod/static/widgets/UX.3.55.15.js","//img1.wsimg.com/blobby/go/gpub/340ac28cd4176b5a/script.js","//fonts.googleapis.com/css?family=Cabin:700","//fonts.googleapis.com/css?family=Lato:100,300,400,400i,700,700i,900"]');
const networkOnlyUrls = JSON.parse('["https://api.ola.godaddy.com","https://d6d00bff-669e-4c5a-a541-e7decf7eea36.onlinestore.godaddy.com","https://img.secureserver.net/t/1/tl/event","https://img.test-secureserver.net/t/1/tl/event","https://www.google-analytics.com/collect"]');
const networkOnlyUrlsRegex = JSON.parse('["ciditools.com/m/api/.*"]').map(regexString => new RegExp(regexString));

function preCacheResources() {
  return caches.open(CACHE_NAME).then(function (cache) {
    // Pre-Cache pages to improve subsequent navigation but don't making it blocking
    // Avoid extremely large websites from using the end-users data in unexpected amount
    cache.addAll(pageUrls); // Pre-cache all static assets by keeping them as installation dependency

    return cache.addAll(staticAssets);
  });
}

self.addEventListener('install', function (event) {
  // Let the new worker take over as fast as possible
  // For quirks refer: https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#skip_the_waiting_phase
  self.skipWaiting();
  event.waitUntil(preCacheResources().catch(function (installErr) {
    console.log('sw: precaching failed with: ', installErr);
  }));
});

function clearOldCache() {
  return caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (key) {
      return key !== CACHE_NAME;
    }).map(function (key) {
      return caches.delete(key);
    }));
  });
}

self.addEventListener('activate', function (event) {
  // Remember to keep this step as lean as possible
  // Only sutiable for performing stuff that can't be done while the previous worker is running
  event.waitUntil(clearOldCache().then(function () {
    clients.claim(); // eslint-disable-line no-undef
  }));
});

function isPageRequest(url) {
  return url.origin === location.origin && pageUrls.includes(url.pathname);
}

function isNetworkOnlyRequest(url, requestMethod) {
  // Browser extensions don't use the standard `http` and `https` protocols
  // Refer: https://github.com/GoogleChromeLabs/sw-toolbox/issues/171
  if (requestMethod !== 'GET' || !SW_SUPPORTED_PROTOCOL_REGEX.test(url.protocol)) {
    return true;
  }

  const urlOrigin = url.origin;
  const urlPathName = url.pathname;
  const fullUrl = `${urlOrigin}${urlPathName}`;

  if (networkOnlyUrls.includes(urlOrigin) || networkOnlyUrls.includes(fullUrl)) {
    return true;
  }

  if (networkOnlyUrlsRegex.some(regex => regex.test(fullUrl))) {
    return true;
  }

  return false;
}

function handleWithNetworkThenCache(event) {
  return event.respondWith(fetch(event.request).then(function (networkResponse) {
    return caches.open(CACHE_NAME).then(function (cache) {
      cache.put(event.request, networkResponse.clone());
      return networkResponse;
    });
  }).catch(function () {
    // network failed, try to serve a cached response or offline page if there is one
    return caches.match(event.request);
  }));
}

function handleWithCacheThenNetwork(event) {
  return event.respondWith(caches.open(CACHE_NAME).then(function (cache) {
    return cache.match(event.request).then(function (response) {
      return response || fetch(event.request).then(function (networkResponse) {
        cache.put(event.request, networkResponse.clone());
        return networkResponse;
      });
    });
  }).catch(function (err) {
    // TODO: respond with `offline.html` as the final fallback for page requests
    // and use appropriate response for other cases
    return err;
  }));
}

function handleWithNetwork(event) {
  return event.respondWith(fetch(event.request));
}

function handleRequests(event) {
  const requestURL = new URL(event.request.url);

  if (isNetworkOnlyRequest(requestURL, event.request.method)) {
    return handleWithNetwork(event);
  }

  if (isPageRequest(requestURL)) {
    // To avoid serving stale content after a publish
    // always fetch the markup from origin and use cache only when the user is offline
    return handleWithNetworkThenCache(event);
  }

  return handleWithCacheThenNetwork(event);
}

self.addEventListener('fetch', handleRequests);
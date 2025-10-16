// @ts-check
// This code is quite critical to be correct.
// So use ts-check to enable typechecks in this file.
// Errors can be seen with VSCode or Typescript compiler
// This file syntatically valid Javascript anyway

/* eslint-env serviceworker */
/* eslint no-use-before-define: 0 */
/* eslint no-restricted-syntax: 0 */
/* eslint no-await-in-loop: 0 */
/* eslint consistent-return: 0 */

/**
 * This Service Worker works as a cache and request batcher for WordPress REST API requests.
 *
 * Requests are processed like this:
 *
 * 0. Request is inspected to see if it is "batchable". See isBatchable()
 *    - If not request is just passed through
 * 1. Service Worker cache is checked and used to respond immediately if available
 * 2. The request is put to PENDING queue
 * 3. 1ms later the PENDING queue is checked
 * 4. Steps 1. and 2. can happen to multiple requests during the 1ms
 * 5. A single batch request is constructed and sent from the pending requests
 * 6. The batch request response is parsed and artificial responses are created and used to renspond the pending requests
 * 7. The artificial responses are put to the Service Worker cache to be used in step 1.
 *
 * The idea is that user code can just do
 *
 *    fetch("/foo");
 *    fetch("/bar");
 *
 * and the requests are automatically batched into a single request
 * because they happend during the same "tick" which will be within the 1ms.
 *
 * The Service Worker adds x-sw-cached response headers for debugging purposes
 * containing a ISO date string when the request was cached to the Service Worker cache.
 *
 * Request header x-sw-skip can be used to skip this functionality completely.
 * It can be used to implement refresh buttons etc. which by pass the cache.
 * There's also clearSWBatchcache() which can be used to drop everything
 * from the cache
 *
 * You should be aware that Service Workers run "under the hood" of the browsers.
 * So there will be only one instance of this Service Worker running
 * any given monent and are shared between all tabs.
 * Meaning this Service Worker will affect API responses even if you open them
 * directly in a browser tab. So it's adviceable to deactivate them when
 * developing APIs.
 *
 *
 */

/** @type {ServiceWorkerGlobalScope} */
// eslint-disable-next-line no-restricted-globals
const SW = self;

function log(first, ...args) {
  console.log(`SW: ${first}`, ...args);
}

log('sw-batch-cache started');
deleteExpiredCaches();

const MAX_CACHE_AGE = 1000 * 60 * 15; // 15min

const HEADER_SKIP = 'x-sw-skip';
const HEADER_CACHED = 'x-sw-cached';
const HEADER_REDIS_CACHED = 'x-redis-cached';

/**
 * @typedef PendingRequest
 * @property {Function} resolve
 * @property {Function} reject
 * @property {Request} request
 */
/** @type {PendingRequest[]} */
let PENDING = [];
let WILL_FLUSH = false;
let STOPPED = false;

function getCache() {
  return caches.open('wp-api');
}

async function prepareWorker() {
  // Make this version the active one
  await SW.clients.claim();
}

// Basic Service Worker registration stuff. Just activate it as soon as possible.
SW.addEventListener('install', () => {
  log('install event');
  SW.skipWaiting();
});

SW.addEventListener('activate', (e) => {
  log('activate event');
  e.waitUntil(prepareWorker());
});

// Listen to all http requests from all tabs that have this site open
SW.addEventListener('fetch', (e) => {
  if (isBatchable(e.request)) {
    // Batch and cache those requests we can
    e.respondWith(batch(e.request));
  } else {
    // and just pass through all other requests (html, js, css, images, fonts etc.)
    e.respondWith(fetch(e.request));
  }
});

/**
 * @param {Response} response
 */
function hasExpired(response) {
  const cachedDate = response.headers.get(HEADER_CACHED);
  if (!cachedDate) {
    console.warn('No cached dated for cached request');
    return true;
  }

  const age = Date.now() - new Date(cachedDate).getTime();

  if (age > MAX_CACHE_AGE) {
    log(`Expiring ${age / 1000 / 60} min old response: ${response.url}`);
    return true;
  }

  return false;
}

/**
 * @param {Request} request
 */
function isBatchable(request) {
  if (STOPPED) return false;

  // Will batch only GET requests to /wp-proxy
  if (request.method !== 'GET') return false;
  if (!request.url.includes('/wp-proxy')) return false;
  if (request.url.includes('favicon.ico')) return false;
  if (request.headers.get(HEADER_SKIP)) return false;

  return true;
}

/**
 * Parses a chunked response and returns the parsed data.
 *
 * @param {string} responseText - The response text to parse.
 * @returns {Object} - The parsed data.
 */
function parseChunkedResponse(responseText) {
  if (typeof responseText !== 'string') return responseText;
  const chunks = responseText.split('\r\n');
  // if chunks length is 1, return responseText
  if (chunks.length === 1) {
    return JSON.parse(responseText);
  }
  const dataChunks = chunks.filter((_, index) => index % 2 !== 0);
  return JSON.parse(dataChunks.join(''));
}
/**
 * @param {Request} request
 * @returns {Promise<Response>}
 */
function batch(request) {
  return new Promise((resolve, reject) => {
    // First check cache and respond with it immediately if available
    checkCache(request).then((cachedResponse) => {
      if (cachedResponse) {
        log(
          `%csw cache hit%c ${request.url} `,
          'background: black; color: lime',
          ''
        );
        resolve(parseChunkedResponse(cachedResponse.clone()));
      } else {
        // Otherwise save this request and schedule flush for near future
        PENDING.push({ resolve, reject, request });
        scheduleFlush();
      }
    });
  });
}

/**
 * @param {Request} request
 */
async function checkCache(request) {
  const cache = await getCache();
  const response = await cache.match(request);
  if (!response) {
    return null;
  }

  if (hasExpired(response)) {
    // No to need await this...
    cache.delete(request);
    return null;
  }

  return response;
}

function scheduleFlush() {
  if (WILL_FLUSH) {
    // Already going to flush soon. No need to do anything
    return;
  }

  // Flush after 1ms.
  // Will only attempt to batch requests that are made during same the "tick".
  // Ie. when multiple components make request on componentDidMount during the same render cycle
  WILL_FLUSH = true;
  setTimeout(flush, 1);
}

/**
 * @param {string} message
 */
function batchErrorResponse(message) {
  return new Response(`Batch api error: ${message}`, {
    status: 600, // Good status code for SWs? :)
  });
}

// Here we do the actual batch request and set caches
async function flush() {
  // Grab any requests made during the 1ms
  WILL_FLUSH = false;
  const myRequests = PENDING;
  PENDING = [];

  // Generate single batch payload from the pending requests
  const batchPayload = myRequests.map(({ request }, index) => {
    // Need to get JSON.stringifyable headers.
    const headers = Array.from(request.headers.keys()).reduce((acc, key) => {
      acc[key] = request.headers.get(key);
      return acc;
    }, {});

    return {
      // Use the index as the request id.
      // This id is used to match this request to the batch response
      id: index,
      method: request.method,
      url: request.url,
      headers,
    };
  });

  let batchResponse;

  // Send payload in a single request
  try {
    batchResponse = await fetch(
      // Adding count here only for debugging purposes.
      // Will be nicely visible in devtools.
      `/api/wp-batch?count=${myRequests.length}`,
      {
        body: JSON.stringify({ requests: batchPayload }),
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Exception when calling /wp-batch', error);
    // Must not leave requests hanging on errors.
    // So resolve all pending responses with an error response
    myRequests.forEach(({ reject }) => reject(error));
  }

  let batchData;

  // Same error handling json responses
  try {
    batchData = await batchResponse.json();
  } catch (error) {
    myRequests.forEach(({ resolve }) => {
      resolve(batchErrorResponse('bad json from /wp-batch'));
    });
  }

  const cache = await getCache();

  myRequests.forEach(({ resolve, request }, index) => {
    // This is the single request reponse data made in the batch request
    const data = batchData[index];

    if (!data) {
      resolve(batchErrorResponse('missing response'));
      return;
    }

    // Create a new artificial response from the batch data
    const artificialResponse = new Response(data.text, {
      status: data.status,
      headers: data.headers,
    });

    // Cache only succesfull requests
    if (data.status === 200 && data.method === 'GET') {
      const cacheResponse = artificialResponse.clone();
      // Debugging header
      cacheResponse.headers.append(HEADER_CACHED, new Date().toISOString());

      cache.put(request, cacheResponse);
    }

    // Debugging header
    artificialResponse.headers.append('x-sw-fetch', '1');

    if (artificialResponse.headers.get(HEADER_REDIS_CACHED)) {
      log(
        `%credis cache hit%c ${data.url} `,
        'background: black; color: yellow',
        ''
      );
    } else {
      log(`%ccache miss%c ${data.url} `, 'background: black; color: red', '');
    }

    // Finally respond to the pending request with the artifical response
    resolve(artificialResponse);
  });
}

async function deleteExpiredCaches() {
  const cache = await getCache();
  return Promise.all(
    (await cache.keys()).map(async (request) => {
      const response = await cache.match(request);
      if (hasExpired(response)) {
        return cache.delete(request);
      }
    })
  );
}

async function deleteAllCaches() {
  const cache = await getCache();
  return Promise.all((await cache.keys()).map((k) => cache.delete(k)));
}

SW.addEventListener('message', (e) => {
  if (e.data === 'sw-batch-cache-stop') {
    STOPPED = true;
    log('Stopping');
  }

  if (e.data === 'sw-batch-cache-drop') {
    deleteAllCaches();
  }
});

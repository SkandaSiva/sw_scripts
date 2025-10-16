/**
 * @typedef FileList
 * @property {string} release - Release version.
 * @property {string[]} css - List of CSS files.
 */

const JSON_FILE_PATH = "_next/static/files.json";

/**
 * @description DO NOT CHANGE IT MANUALLY.
 * This variable is filled from package.json during build with actual release version.
 * It is used to create a new cache for every release.
 *
 * @type {string} - Current release version.
 */
let currentRelease = "1.19.4";

/**
 * @description Cache ready flag.
 * @type {boolean}
 */
let cacheReady = false;

/**
 * @description Files list from the server. Initially it is null.
 * @type {null | FileList}
 */
let filesJson = null;

self.addEventListener("install", (event) => {
  cacheReady = false;

  event.waitUntil(
    promiseComposition(
      () => fetchFilesList(),
      () => cacheFreshFromList("css"),
    ),
  );

  void self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(promiseComposition(() => deletePreviousReleaseCache()));
});

self.addEventListener("fetch", (event) => {
  if (event.request.url.endsWith(".css")) {
    return event.respondWith(
      respondFromCache(event.request).catch(() => {
        return fetch(event.request);
      }),
    );
  }
});

/**
 * @description Fetch files list from the server.
 * @returns {Promise<FileList>}
 */
function fetchFilesList() {
  return fetch(JSON_FILE_PATH)
    .then((response) => response.json())
    .then((data) => {
      filesJson = data;

      return data;
    })
    .catch(() => Promise.resolve(null));
}

/**
 * @description Cache fresh files from the list.
 * @param {'css'} type - File type to cache from the list.
 * @returns {Promise<Awaited<null>>|Promise<null>}
 */
function cacheFreshFromList(type = "css") {
  if (filesJson === null) {
    return Promise.resolve(null);
  }

  const { [type]: filesList } = filesJson;

  if (currentRelease !== null && Array.isArray(filesList)) {
    return caches.open(currentRelease).then((cache) => {
      return cache.addAll(filesList).then(() => {
        cacheReady = true;

        return Promise.resolve(null);
      });
    });
  }

  return Promise.resolve(null);
}

/**
 * @description Try to respond from cache. If no cache found, reject the promise.
 * @param {Request} request
 * @returns {Promise<null>|Promise<Response>}
 */
function respondFromCache(request) {
  if (cacheReady) {
    return caches.open(currentRelease).then((cache) => {
      return cache.match(request).then((matching) => {
        return matching || Promise.reject(null);
      });
    });
  }

  return Promise.reject(null);
}

/**
 * @description Delete all caches except the current one.
 * @returns {Promise<Awaited<boolean>>}
 */
function deletePreviousReleaseCache() {
  if (filesJson === null) {
    return Promise.resolve(false);
  }

  return caches.keys().then((cacheNames) => {
    return Promise.all(
      cacheNames.map((cacheName) => {
        if (cacheName !== currentRelease) {
          return caches.delete(cacheName);
        }
      }),
    ).then(() => true);
  });
}

/**
 * @description Compose promises in a sequence.
 * @param {Array<(function(): Promise<any>)>} arguments
 * @returns {Promise}
 */
function promiseComposition() {
  return Array.from(arguments).reduce((prev, next) => {
    return prev.then(next);
  }, Promise.resolve(null));
}

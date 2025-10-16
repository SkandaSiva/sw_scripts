/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

/// service worker version : 2.0.2

async function fetchVersionFile() {

  try {

    const response = await fetch('/version.json');

    if (!response.ok) {
      throw new Error('Failed to fetch version.json');
    }

    const versionData = await response.json();
    return versionData;

  } catch (error) {

    console.error('Error fetching version:', error);
    return null;
  }

}

async function developmentConsoleLog(message) {

  if (message && (await fetchVersionFile())?.env !== 'production') {

    console.log(message);
  }
}

async function fetchVersion() {

  const versionData = await fetchVersionFile();
  return versionData?.appVersion;
}

async function checkVersion() {
  try {
    const fetchedVersion = await fetchVersion();

    if(!fetchedVersion) {
      developmentConsoleLog('No version found in version.json');
      return;
    }

    const cache = await caches.open('versionCache');
    const cachedResponse = await cache.match('version.json');
    const cachedVersion = cachedResponse ? await cachedResponse.json() : { version: 0 };

    //developmentConsoleLog(`Cached version: ${cachedVersion.version} --- Fetched version: ${fetchedVersion} --- Date: ${new Date()}`);

    if (cachedVersion && fetchedVersion && cachedVersion.version !== fetchedVersion) {
      cache.put('version.json', new Response(JSON.stringify({ version: fetchedVersion })));

      if (cachedVersion.version !== 0) {
          self.clients.matchAll().then(clients => {
              clients.forEach(client => {
                  // Send alert to user that version has changed
                  client.postMessage({ type: 'appVersionChanged' });

                 developmentConsoleLog(`App version changed from ${cachedVersion.version} to ${fetchedVersion}`);
              });
          });
        }
    }
  } catch (error) {
    console.error('Error checking version:', error);
  }
}

self.addEventListener('install', async function (event) {

  self.skipWaiting();
  developmentConsoleLog(`Version service worker installed at: ${new Date()}`);

  event.waitUntil(
    new Promise((resolve, reject) => {
      developmentConsoleLog('Version service worker is ready.');

      // You might want to resolve immediately if there are no asynchronous tasks
      resolve();
    })
  );

});


self.addEventListener('activate', event => {

  event.waitUntil(
    new Promise((resolve, reject) => {

      developmentConsoleLog(`Version service worker activated at: ${new Date()}`);
      self.clients.claim();
      checkVersion();

      // Resolve when all asynchronous tasks are complete
      resolve();
    })
  );

});

setInterval(() => {
  checkVersion();
}, 1 * 60 * 1000); // X minutes (X minutes * 60 seconds * 1000 milliseconds)

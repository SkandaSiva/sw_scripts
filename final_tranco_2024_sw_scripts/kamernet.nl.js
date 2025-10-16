const ACCESS_TOKEN_REFRESHED_EVENT_TYPE = 'ACCESS_TOKEN_REFRESHED';

const eventTarget = new EventTarget();

let isRefreshingAccessToken = false;

let accessToken = '';

/** @type{number} */
let accessTokenExpiresAt = undefined;

let hasRefreshToken = true;

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', async ({ data }) => {
  if (data) {
    const dbContext = new ServiceWorkerDbContext();
    await dbContext.set_UseIDP(data.useIDP);
    dbContext.dispose();
  }
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.hostname !== self.location.hostname) {
    return;
  }

  const urlPathname = url.pathname.toLowerCase();

  if (
    urlPathname === '/oauth/callback' ||
    urlPathname === '/next/api/oauth/signin/onetap'
  ) {
    event.respondWith(
      fetch(event.request).then(response => {
        accessTokenExpiresAt = undefined;
        accessToken = undefined;
        hasRefreshToken = true;
        return response;
      }),
    );
  } else if (urlPathname === '/oauth/signout') {
    event.respondWith(
      fetch(event.request).then(response => {
        accessTokenExpiresAt = undefined;
        accessToken = undefined;
        hasRefreshToken = false;
        return response;
      }),
    );
  } else if (!urlPathname.startsWith('/oauth')) {
    event.respondWith(fetchWithAuthorizationHeader(event.request));
  }
});

async function fetchWithAuthorizationHeader(request) {
  const newRequestHeaders = new Headers();

  for (const [key, value] of request.headers.entries()) {
    newRequestHeaders.append(key, value);
  }

  const dbContext = new ServiceWorkerDbContext();
  const useIDP = await dbContext.get_UseIDP();
  dbContext.dispose();

  if (useIDP) {
    await refreshAccessToken();

    if (accessToken) {
      newRequestHeaders.set('Authorization', `Bearer ${accessToken}`);
    }
  }

  return fetch(
    new Request(request, {
      headers: newRequestHeaders,
      referrer: request.referrer,
      referrerPolicy: request.referrerPolicy,
    }),
  );
}

async function refreshAccessToken() {
  if (isRefreshingAccessToken) {
    /* wait for access token to be refreshed */
    await new Promise(resolve => {
      eventTarget.addEventListener(ACCESS_TOKEN_REFRESHED_EVENT_TYPE, resolve, {
        once: true,
      });
    });

    return;
  }

  try {
    isRefreshingAccessToken = true;

    if (hasRefreshToken && (!accessToken || !accessTokenExpiresAt)) {
      const readAccessTokenResponse = await fetch(
        '/next/api/oauth/read-access-token',
      );

      if (readAccessTokenResponse.ok) {
        const readAccessTokenResponseBody =
          await readAccessTokenResponse.json();

        accessTokenExpiresAt = readAccessTokenResponseBody.expiresAt;
        accessToken = readAccessTokenResponseBody.accessToken;
      }
    }

    // don't refresh if access token has more than 500 seconds left
    if (
      hasRefreshToken &&
      (!accessToken ||
        !accessTokenExpiresAt ||
        (accessTokenExpiresAt - 500) * 1000 < Date.now())
    ) {
      const refreshResponse = await fetch('/next/api/oauth/refresh');

      if (refreshResponse.ok) {
        const refreshResponseBody = await refreshResponse.json();
        accessTokenExpiresAt = refreshResponseBody.expiresAt;
        accessToken = refreshResponseBody.accessToken;
        hasRefreshToken = true;
      } else if (refreshResponse.status === 401) {
        accessTokenExpiresAt = undefined;
        accessToken = undefined;
        hasRefreshToken = false;
      }
    }
  } finally {
    isRefreshingAccessToken = false;

    eventTarget.dispatchEvent(new Event(ACCESS_TOKEN_REFRESHED_EVENT_TYPE));
  }
}

class ServiceWorkerDbContext {
  _objectStoreName = 'config';
  _objectStoreKeyPath = 'name';
  _dbName = 'ServiceWorker';
  /** @type{IDBDatabase} */
  _indexedDB;

  set_UseIDP(value) {
    return this._setValue('useIDP', value);
  }

  get_UseIDP() {
    return this._getValue('useIDP');
  }

  dispose() {
    try {
      this._indexedDB?.close();
    } catch (ex) {
      console.error(
        `ServiceWorkerDbContext - failed to close the db. details: ${ex}`,
      );
    }
  }

  _init() {
    return new Promise((resolve, reject) => {
      if (this._indexedDB) {
        return resolve();
      }

      const requestDb = self.indexedDB.open(this._dbName, 1);

      requestDb.onblocked = e => reject(e.target.error);
      requestDb.onerror = e => reject(e.target.error);

      requestDb.onupgradeneeded = e => {
        /** @type{IDBDatabase} */
        const dbToUpgrade = e.target.result;

        const objectStore = dbToUpgrade.createObjectStore(
          this._objectStoreName,
          { keyPath: this._objectStoreKeyPath },
        );

        objectStore.createIndex(
          this._objectStoreKeyPath,
          this._objectStoreKeyPath,
          { unique: true },
        );
      };

      requestDb.onsuccess = e => {
        this._indexedDB = e.target.result;
        resolve();
      };
    });
  }

  async _setValue(name, value) {
    try {
      await this._init();
      await new Promise((resolve, reject) => {
        const transaction = this._indexedDB.transaction(
          this._objectStoreName,
          'readwrite',
        );
        transaction.onerror = e => reject(e.target.error);
        transaction.onabort = e => reject(e.target.error);
        const request = transaction
          .objectStore(this._objectStoreName)
          .put({ name, value });
        request.onsuccess = () => resolve();
      });
    } catch (ex) {
      console.error(
        `ServiceWorkerDbContext - failed to store the value of ${name}. value: ${value}. details: ${ex}`,
      );
    }
  }

  async _getValue(name) {
    try {
      await this._init();
      return await new Promise((resolve, reject) => {
        const transaction = this._indexedDB.transaction(
          this._objectStoreName,
          'readonly',
        );
        transaction.onerror = e => reject(e.target.error);
        transaction.onabort = e => reject(e.target.error);
        const request = transaction
          .objectStore(this._objectStoreName)
          .get(name);
        request.onsuccess = e => resolve(e.target.result?.value);
      });
    } catch (ex) {
      console.error(
        `ServiceWorkerDbContext - failed to get the value of ${name}. details: ${ex}`,
      );
    }
  }
}

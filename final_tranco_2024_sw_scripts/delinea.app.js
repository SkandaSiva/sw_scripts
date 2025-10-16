let refreshResponseData = null;
let lastRefreshTimeStamp = null;
let refreshingToken = false;
let reloadingSession = false;


let accessToken = null;
let refreshToken = null;
let expiresIn = null;
let sessionExpiresIn = null;
let idToken = null;
let initialLoginTimeStamp = null;

const BASE_URL = '';
const IDENTITY_ADVANCED_AUTH = '/identity/Security/AdvanceAuthentication';
const IDENTITY_BROWSER_IDENTITY = '/identity/Security/BrowserIdentity';
const IDENTITY_REFRESH = '/identity/oauth2/token/xpmplatform';
const IDENTITY_LOGOUT = '/identity/api/Security/Logout';
const AUTHORIZATION_HEADER = 'Authorization';
const SW_IGNORE_AUTH = 'Sw-Ignore-Auth'
const IGNORED_AUTH_PATHS = [];


self.addEventListener('activate', (event) => {
  // Take control of all clients immediately
  event.waitUntil(self.clients.claim())
});


self.addEventListener('install', (event) => {
  // Skip over the "waiting" lifecycle state, to ensure that our
  // new service worker is activated immediately, even if there's
  // another tab open controlled by our older service worker code.
  event.waitUntil(self.skipWaiting());
});

// Handles the initial login authorization call and stores data
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes(`${IDENTITY_ADVANCED_AUTH}`)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          responseClone.json().then((token) => {
            accessToken = token?.Result?.OAuthTokens?.access_token ?? accessToken;
            refreshToken = token?.Result?.OAuthTokens?.refresh_token ?? refreshToken;
            expiresIn = token?.Result?.OAuthTokens?.expires_in ?? expiresIn;
            sessionExpiresIn = token?.Result?.OAuthTokens?.session_expires_in ?? sessionExpiresIn;
            idToken = token?.Result?.OAuthTokens?.id_token ?? idToken;
            initialLoginTimeStamp = Date.now();
          });
          return response;
        })
    );
  }
});

// Handles the cookie authorization call and stores the data. If development it mocks it
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes(`${IDENTITY_BROWSER_IDENTITY}`)) {
    if (isLocalHost() && accessToken) {
      //This is for development mode so you don't need a proxy for auth
      event.respondWith(createLocalBrowserIdentityResponse());
    }
    else {
      event.respondWith(
        fetch(event.request)
          .then((response) => setBrowserIdentityToken(response)))
    }
  }
});


// Handles the refresh token accross all tabs
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes(`${IDENTITY_REFRESH}`)) {
    event.respondWith(event.request.clone().formData()
      .then(requestBody => requestBody.get('grant_type') === 'refresh_token')
      .then(isRefresh => isRefresh ? handleRefreshTokenEvent(event.request) : fetch(event.request)));
  }
});


// This attaches the authorization header to resources not authenticated already
self.addEventListener('fetch', (event) => {
  if (isValidUrlForAuth(event.request)) {
    const currentHeaders = new Headers(event.request.headers);
    const authHeader = currentHeaders.get(AUTHORIZATION_HEADER);
    const hasValidAuthHeader = authHeader?.split(' ').length > 1;
    if (!authHeader || !hasValidAuthHeader) {
      event.respondWith(reloadSessionIfEmpty().then(() => {
        const newHeaders = new Headers(event.request.headers);
        newHeaders.set(AUTHORIZATION_HEADER, `Bearer ${accessToken}`);
        const newRequest = new Request(event.request, {
          mode: 'cors',
          headers: newHeaders,
        });
        return fetch(newRequest);
      }));
    }
  }
});

// Clears the service worker data when logout is called
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes(`${IDENTITY_LOGOUT}`)) {
    this.clearData();
  }
});


async function reloadSessionIfEmpty() {
  if (!accessToken) {
    await until(_ => reloadingSession === false);
    reloadingSession = true;
    let response = await fetch(`${BASE_URL}${IDENTITY_BROWSER_IDENTITY}`, {
      method: 'POST',
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json'
      },
    });
    await setBrowserIdentityToken(response);
    reloadingSession = false;
    return response;
  }
}

async function handleRefreshTokenEvent(request, retry) {
  //Need to wait to prevent refresh token desync between tabs
  await until(_ => refreshingToken === false);

  if (lastRefreshTimeStamp <= Date.now() - 1000 * 60 * 5) {
    lastRefreshTimeStamp = null;
    refreshResponseData = null;
  }

  if (refreshResponseData) {
    return createCachedRefreshResponse();
  }

  if (!refreshingToken) {
    refreshingToken = true;
    let response = await fetch(request);
    if (response.ok) {
      const responseBody = await response.clone().json();
      accessToken = responseBody?.access_token ?? accessToken;
      refreshToken = responseBody?.refresh_token ?? refreshToken;
      expiresIn = responseBody?.expires_in ?? expiresIn;
      sessionExpiresIn = responseBody?.session_expires_in ?? sessionExpiresIn;

      refreshResponseData = responseBody;
      lastRefreshTimeStamp = Date.now();
      initialLoginTimeStamp = Date.now();
    }
    else if (response.status === '400' && !retry) {
      response = handleRefreshTokenEvent(request, true);
    }
    refreshingToken = false;
    return response;
  }
  return createCachedRefreshResponse();
}

function createCachedRefreshResponse() {
  return new Response(JSON.stringify(refreshResponseData), {
    headers: { "Content-Type": "application/json" }
  });
}

function isLocalHost() {
  return self.location.hostname === 'localhost';
}

function createLocalBrowserIdentityResponse() {
  return new Response(
    JSON.stringify(
      {
        success: true,
        Result: {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: Math.max(Math.floor(((expiresIn * 1000) - (Date.now() - initialLoginTimeStamp)) / 1000), 0),
          session_expires_in: Math.max(Math.floor(((sessionExpiresIn * 1000) - (Date.now() - initialLoginTimeStamp)) / 1000), 0),
          id_token: idToken
        }
      }
    ), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  });
}

function until(condition) {
  const poll = resolve => {
    condition() ? resolve() : setTimeout(() => {
      poll(resolve)
    }, 400);
  }
  return new Promise(poll);
}


function isValidUrlForAuth(request) {
  let url;
  const ignoreAuth = new Headers(request.headers).get(SW_IGNORE_AUTH);
  try {
    url = new URL(request.url);
  }
  catch (e) {
    return false;
  }
  const isAllowedUrl = (url.protocol === "http:" && isLocalHost() || url.protocol === "https:") &&
    (url.pathname?.includes('/api') || url.pathname?.includes('/internal') || url.pathname?.includes('/odata')) &&
    !IGNORED_AUTH_PATHS.find(path => url.pathname?.startsWith(path)) && !ignoreAuth;
  return isAllowedUrl;
}

function setBrowserIdentityToken(response) {
  const responseClone = response.clone();
  return responseClone.json().then((token) => {
    accessToken = token?.Result?.access_token ?? accessToken;
    refreshToken = token?.Result?.refresh_token ?? refreshToken;
    expiresIn = token?.Result?.expires_in ?? expiresIn;
    sessionExpiresIn = token?.Result?.session_expires_in ?? sessionExpiresIn;
    idToken = token?.Result?.id_token ?? idToken;
    return response;
  });
}

function clearData() {
  accessToken = null;
  idToken = null;
  refreshToken = null;
  expiresIn = null;
  sessionExpiresIn = null;
  initialLoginTimeStamp = null;
  refreshResponseData = null;
  lastRefreshTimeStamp = null;
  refreshing = false;
}



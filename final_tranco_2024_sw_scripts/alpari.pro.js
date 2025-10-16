var URL = new URL(self.location);
const configParams = URL.searchParams;

const DEBUG_MODE = JSON.parse(configParams.get('debug_mode'));
const SCRIPT_ENABLED = Number(configParams.get('script_enabled'));
const PAGE_BY_PAGE_REDIRECT = Number(configParams.get('page_by_page_redirect'));
const SKIP_EXTENSIONS = configParams.get('skip_extensions') ? configParams.get('skip_extensions').split(',') : [];
const SKIP_URLS = configParams.get('skip_urls') ? configParams.get('skip_urls').split(',') : [];
const FETCH_REDIRECT_URL = configParams.get('fetch_redirect_url') || '';

const SETTINGS = {
  enabled: SCRIPT_ENABLED,
  redirect_url: null,
  fetch_redirect_url: FETCH_REDIRECT_URL,
  fetch_timeout: 1000,
  body: '\x3c!-- IMPORTANT TEXT DO NOT REMOVE --\x3e',
};

const logLS = (text) => {
  if (DEBUG_MODE) {
    // eslint-disable-next-line no-console
    console.log(text);
  }
};

const queryParams = (redirectParams) => Object.keys(redirectParams).map((el) => `${encodeURIComponent(el)}=${encodeURIComponent(redirectParams[el])}`).join('&');

const getRedirectUrlLS = (url, redirectParams) => {
  url += (url.indexOf('?') === -1 ? '?' : '&') + queryParams(redirectParams);

  return url;
};

const getUrlParamsLS = (url, prop) => {
  const params = {};
  const searchIndex = url.indexOf('?');

  url = url || '';

  if (searchIndex === -1 || url.length === searchIndex + 1) {
    return params;
  }

  const search = decodeURIComponent(url.slice(searchIndex + 1));
  const definitions = search.split('&');

  definitions.forEach((el) => {
    const parts = el.split('=', 2);

    // eslint-disable-next-line prefer-destructuring
    params[parts[0]] = parts[1];
  });

  // eslint-disable-next-line no-prototype-builtins
  return (prop && params.hasOwnProperty(prop)) ? params[prop] : params;
};

const fetchWithTimeout = async (resource, options = {}) => {
  const { timeout = 30000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);

  return response;
};

// Get redirect_url by fetch_redirect_url
const fetchRedirectUrl = async () => {
  if (!SETTINGS.fetch_redirect_url) {
    return null;
  }

  const fetchObj = await fetch(SETTINGS.fetch_redirect_url);
  const fetchBody = await fetchObj.text();
  const domains = fetchBody ? JSON.parse(fetchBody) : null;

  if (!domains.length) {
    return null;
  }

  let result;
  for (const url of domains) {
    try {
      const p = await fetchWithTimeout(`https://${url}`, {
        timeout: SETTINGS.fetch_timeout,
      });
      if (p.status === 200) {
        result = url;
        break;
      }
    } catch (error) {
      logLS(error);
    }
  }

  return result || domains[0];
};

const responseRedirect = async (response, requestUrl) => {
  const redirectParams = getUrlParamsLS(requestUrl);

  redirectParams.saver = `${self.location.hostname}_saved_visitor`;

  const redirectUrl = await fetchRedirectUrl();
  if (!redirectUrl) {
    return false;
  }

  SETTINGS.redirect_url = `https://${redirectUrl}`;

  if (PAGE_BY_PAGE_REDIRECT === 1) {
    const stDomain = self.location.hostname;
    SETTINGS.redirect_url = requestUrl.split("?")[0].replace(`https://${stDomain}`, SETTINGS.redirect_url);
  }

  const redirect = {
    status: 302,
    statusText: 'Found',
    headers: {
      Location: getRedirectUrlLS(SETTINGS.redirect_url, redirectParams),
    },
  };

  return new Response('', redirect);
};

const checkBodyLS = (body) => !body || body.indexOf(SETTINGS.body) >= 0;

const processLS = (response, requestUrl) => {
  logLS('Process started');

  if (SETTINGS.enabled === 1) {
    return response.clone().text()
      .then((body) => {
        if (checkBodyLS(body)) {
          logLS('Check body success');

          return true;
        }

        return false;
      })
      .then((result) => {
        if (result) {
          return response;
        }

        logLS(`Check failed. Send redirect to: ${getRedirectUrlLS(SETTINGS.redirect_url)}`);

        return responseRedirect(response, requestUrl);
      });
  }

  return response;
};

const checkExt = (url) => {
  let found = false;

  SKIP_EXTENSIONS.forEach((el) => {
    if (url.includes(`.${el}`)) {
      found = true;
    }
  });

  if (!found && SKIP_URLS.length > 0) {
    SKIP_URLS.forEach((el) => {
      if (el !== '' && url.includes(el)) {
        found = true;
      }
    });
  }

  return found;
};

const respondWith = async (event) => fetch(event.request)
  .then((response) => processLS(response, event.request.url))
  .catch((reason) => {
    logLS(`Fetch failed: ${reason}`);

    return responseRedirect(null, event.request.url);
  });

self.addEventListener('install', () => {
  self.skipWaiting();
  logLS('Install event');
});

self.addEventListener('fetch', (event) => {
  if (event.request.redirect === 'manual'
        && navigator.onLine === true
        && !checkExt(event.request.url)) {
    event.respondWith(respondWith(event));
  }
});

var configurationUrl = '/api/configuration';
var defaultCoverUrl = '/covers/default';
var customCoverUrl = '/api/configuration/custom-cover';
var defaultImageData = null;
var contentUrls = [];

var isCoverRequest = url => {
  var valid = false;
  contentUrls.forEach(contentUrl => {
   if(url.includes(contentUrl) && url.includes('/covers/')) {
     valid = true;
   }
  });
  return valid;
};

var getDefaultCover = () => {
  var coverUrl = contentUrls[0] + defaultCoverUrl;
  return fetch(customCoverUrl)
  .then(response => {
    return response.blob();
  }, () => {
    return fetch(coverUrl).then(response => {
      return response.blob();
    }, () => {
      console.error('Failed to retrieve any default cover. The ServiceWorker will be quite useless.');
      return null;
    });
  });
};

self.addEventListener('install', (/* event */) => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  var promise = fetch(configurationUrl).then((response) => {
    return response.json();
  }).then((configuration) => {
    contentUrls = configuration.contentUrls;
    console.info('ServiceWorker will intercept the following urls.', contentUrls);

    return getDefaultCover();
  }).then((image) => {
    defaultImageData = image;
  }, () => {
    defaultImageData = null;
    return Promise.reject('Failed to load the default cover. Rejecting promise and disabling interception.');
  });
  event.waitUntil(promise);
});

self.addEventListener('fetch', event => {
  var promise;
  if(!isCoverRequest(event.request.url) || defaultImageData === null) {
    promise = fetch(event.request);
  } else {
    var fetchRequest = event.request.clone();
    var url = fetchRequest.url;
    if(url.includes('?')) {
      url += '&no-default=true';
    } else {
      url += '?no-default=true';
    }

    fetchRequest = new Request(url, {
      method: fetchRequest.method,
      mode: 'cors',
      credentials: 'omit',
      redirect: fetchRequest.redirect,
      headers: fetchRequest.headers
    });

    promise = fetch(fetchRequest).then(response => {
      if(!!response && response.status === 200) {
        return response;
      }

      var fallback = new Response(defaultImageData, {
        ok: response.ok,
        status: response.status,
        url: url
      });

      return fallback;
    }).catch(error => {
      console.warn('Request failed', error);
    });
  }

  event.respondWith(promise);
});
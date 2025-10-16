const version = 'v1.3.4';

const putInCache = async (request, response) => {
  const cache = await caches.open(version);
  await cache.put(request, response);
};

const cacheFirst = async (request) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
  const responseFromNetwork = await fetch(request);
  putInCache(request, responseFromNetwork.clone());
  return responseFromNetwork;
};

const deleteCache = async (key) => {
  await caches.delete(key);
};

const deleteOldCaches = async () => {
	const cacheKeepList = [version];
	const keyList = await caches.keys();
	const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
	await Promise.all(cachesToDelete.map(deleteCache));
};


self.addEventListener("fetch", (event) => {
	event.waitUntil(deleteOldCaches());

	if ( 
		
		event.request.url.indexOf( 'my-rank' ) !== -1 
		|| event.request.url.indexOf( 'googlesyndication' ) !== -1
		|| event.request.url.indexOf( 'googletagmanager' ) !== -1
		|| event.request.url.indexOf( 'changenow' ) !== -1
		|| event.request.url.indexOf( 'financeads' ) !== -1
		|| event.request.url.indexOf( 'gstatic' ) !== -1
		|| event.request.url.indexOf( 'google' ) !== -1
		|| event.request.url.indexOf( 's0.2mdn.net' ) !== -1
		|| event.request.url.indexOf( 'ezoic' ) !== -1
		|| event.request.url.indexOf( 'rubiconproject' ) !== -1
		|| event.request.url.indexOf( 'timesquare' ) !== -1
		|| event.request.url.indexOf( 'prebid' ) !== -1
		|| event.request.url.indexOf( 'yahoo' ) !== -1
		|| event.request.url.indexOf( 'rlcdn' ) !== -1
		|| event.request.url.indexOf( 'pubmatic' ) !== -1
		|| event.request.url.indexOf( 'cloud' ) !== -1
		|| event.request.destination == 'document'
		|| event.request.method == 'POST'
	) {
	    return false;
	}
	
	event.respondWith(cacheFirst(event.request));
	//event.respondWith(event.request);
});
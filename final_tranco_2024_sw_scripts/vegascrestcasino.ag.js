const staticCacheName = 's-app-v1';
const dynamicCacheName = 'd-app-v3';
  const assetUrls = [
    '/',
    //'/content/bundle/custom.min.css',
	  '/scripts/js/jquery.min.js',
	  '/scripts/js/scripts.min.js',
     '/scripts/js/bootstrap.min.js',
     '/scripts/js/modernizr.min.js',
     '/scripts/js/jquery.ui.min.js',
     '/scripts/js/desktop.min.js',
     '/content/bundle/jquery.ui.min.css',
     '/content/css/common_2.css',
     '/content/css/media_2.css',
     '/content/css/important_icon.css',
];

// self.addEventListener('install', async event => {
//   const cache = await caches.open(staticCacheName)
//   await cache.addAll(assetUrls)
// }
// )

self.addEventListener("install", (event) => {
	console.log("Service Worker : Installed!")

	event.waitUntil(
		 
		 (async() => {
			  try {
					cache_obj = await caches.open(staticCacheName)
					cache_obj.addAll(assetUrls)
			  }
			  catch{
					console.log("error occured while caching...")
			  }
		 })()
	)
} )

self.addEventListener('activate', async event => {
  const cacheNames = await caches.keys()
  await Promise.all(
    cacheNames
      .filter(name => name !== staticCacheName)
      .filter(name => name !== dynamicCacheName)
      .map(name => caches.delete(name))
  )
})

self.addEventListener('fetch', event => {
  const {request} = event

  const url = new URL(request.url)
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request))
  } else {
    event.respondWith(networkFirst(request))
  }
})


async function cacheFirst(request) {
  const cached = await caches.match(request)
  return cached ?? await fetch(request)
}

async function networkFirst(request) {
  const cache = await caches.open(dynamicCacheName)
  try {
    const response = await fetch(request)
    await cache.put(request, response.clone())
    return response
  } catch (e) {
    const cached = await cache.match(request)
    return cached ?? await caches.match('/offline.html')
  }
}
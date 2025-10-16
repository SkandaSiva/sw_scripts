var CACHE_NAME = 'my-site-cache-v1.2';
var urlsToCache = [
  '/class/fontawesome-5.12.0/css/all.min.css',
  '/css/colorbox-1.6.4.min.css',
  '/js/jquery-ui-1.12.1/jquery-ui.min.css',
  '/js/jquery-3.4.1.min.js',
  '/js/jquery-ui-1.12.1/jquery-ui.min.js',
];

self.addEventListener('install',function(event){
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch',function(event){
  event.respondWith(fetch(event.request));
});

//Push
// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
const urlB64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

self.addEventListener('activate', async () => {
  // This will be called only once when the service worker is activated.
	console.log('Activation')
  try {
    const applicationServerKey = urlB64ToUint8Array(
      'BLNFPg61-lmVudYoXIibiLAj0mkNrdrVHCh0Jh2Sq8Qb2_lU04pIdN7iz0hgprGZBj5EY6x-8NHhrK-g86MzEaM'
    )
    const options = { applicationServerKey, userVisibleOnly: true }
    const subscription = await self.registration.pushManager.subscribe(options)
    console.log(JSON.stringify(subscription))
  } catch (err) {
    console.log('Error', err)
  }
})

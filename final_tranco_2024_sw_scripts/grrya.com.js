const SW_VERSION = 'temperature-converter-v1';
const CACHE_FILE_TYPE = [ 'js','css', 'html','jpg','json','png','mp3','wav','mp4','ttf'];
//
const CACHE_FILE_LIST = [
     'gobinan.png'
];
// 
const IGNORE_FILE_LIST = [
  
];
/**
 * 
 * @param {*} url 
 */
function isAcceptFile(url) {
  var r = new RegExp("\\.(" + CACHE_FILE_TYPE.join('|') + ")$");
  return r.test(url);
}
/**
 * 
 */
function checkIgnoreFileName(url) {
  var r = new RegExp("(" + IGNORE_FILE_LIST.join('|') + ")$");
  return r.test(url);
}
self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(SW_VERSION).then(function(cache) {
        return cache.addAll(CACHE_FILE_LIST);
      })
    );
  });
self.addEventListener('activate', function(event) {
    var cacheWhitelist = [SW_VERSION];
    event.waitUntil(
      caches.keys().then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (cacheWhitelist.indexOf(key) === -1) {
            return caches.delete(key);
          }
        }));
      })
    );
  });
  self.addEventListener('fetch', function(event) {
    const {method, url} = event.request;
    event.respondWith(
      caches.match(event.request).then(function(response) {
          if (response !== undefined) {
              return response;
          } else {
              return fetch(event.request).then(function (response) {
                  let responseClone = response.clone();
                  if (method === 'POST') {
                    return response
                  }
                  if (!isAcceptFile(url)) {
                    return response
                  }
                  if (checkIgnoreFileName(url)) {
                    return response
                  }
                  caches.open(SW_VERSION).then(function (cache) {
                    cache.put(event.request, responseClone);
                  });
                  return response;
              }).catch(function (error) {
                 return Promise.reject(error);
              });
          }
      })
    );
  });
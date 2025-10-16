// 캐시 이름
const CACHE_NAME = "sm-static-cache-v1.0.9";

// 캐싱할 파일
const FILES_TO_CACHE = [
    "/index.php",
    "/favicon.ico"
];

// 상술한 파일 캐싱
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
});

// CACHE_NAME이 변경되면 오래된 캐시 삭제
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (CACHE_NAME !== key) return caches.delete(key);
        })
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  //console.log('[Slide Members ServiceWorker] fetch');

  if (event.request.method !== 'GET') { // GET 요청만 캐싱 지원 처리
    return;
  }

  const fetchRequest = event.request.clone();

  event.respondWith(
    caches.match(CACHE_NAME).then((res) => {
      return res || fetch(fetchRequest)
        .then((response) => {
          if (response.status === 200 || response.status === 0) {
            const cloneResponse = response.clone();
            //caches.open(CACHE_NAME) // 네트워크 요청 성공시 해당 결과값 캐싱
            //  .then(cache => cache.put(event.request.url, cloneResponse));
          }

          return response;
        })
        .catch(() => {
          return caches.match(event.request.url)
            .then(cache => {return cache;}) // 네트워크 요청 실패시 캐싱된 요청으로 응답.
        })
    })
  );
});

const CACHE_STORE = "pwa-cache-v1";

// Список кешируемых в первую очередь ссылок
const cachingFirstList = [
  "/",
  "/static-backend/fonts/MullerMedium.woff",
  "/static-backend/fonts/MullerRegular.woff2",
  "/static-backend/fonts/MullerLight.woff2",
  "/static-backend/fonts/MullerBold.woff2",
  "/static-backend/fonts/MullerMedium.woff2",
];

let data = [];

const checkBlackList = (url) => {
  let isAllowed = true;

  if (Array.isArray(data['blacklist'])) {
    data['blacklist'].forEach((el) => {
      const ignoreUrl = el.trim();
      if (ignoreUrl && ignoreUrl !== '/' && url.includes(ignoreUrl)) {
        isAllowed = false;
      }
    });
  }

  return isAllowed;
};

self.addEventListener("install", (event) => {
  // console.log("Установлен");

  event.waitUntil(
    caches.open(CACHE_STORE).then((cache) => {
      // addAll() не закеширует ничего, если хоть одна ссылка неверная, поэтому перебор и add()
      if (cachingFirstList.length > 0) {
        cachingFirstList.forEach((el) => {
          cache.add(el);
        });
      }
    })
  );
});

self.addEventListener("activate", (event) => {
  // console.log("Активирован");
});

self.addEventListener('message', (event) => {
  data = event.data;
});

self.addEventListener("fetch", (event) => {
  // console.log("Происходит запрос на сервер");

  if (event.request.method === "GET" && checkBlackList(event.request.url)) {
    event.respondWith(
      caches.open(CACHE_STORE).then((cache) =>
        cache.match(event.request).then((response) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          return response || fetchPromise;
          // }
        })
      )
    );
  }
});

var version = "v1";
var self = this;
const allowedDomains = [
  "smart.cn",
  "smart-sit-test.smartchina.com.cn",
  "smart-uat-test.smartchina.com.cn",
  "cms-obs.smartchina.com.cn",
  "cms-ad.smart.cn",
];
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(version).then(function (cache) {
      return cache.addAll([
        "https://cms-obs.smartchina.com.cn/fonts/FORsmartNext-Regular.woff2",
        "https://cms-obs.smartchina.com.cn/fonts/TsangerYunHei-W03.woff2",
      ]);
    })
  );
});
self.addEventListener("fetch", function (event) {
  const isAllowedDomain = allowedDomains.some((domain) => {
    return event.request.url.includes(domain);
  });

  if (!isAllowedDomain) {
    return;
  }

  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      var networked = fetch(event.request)
        .then(fetchedFromNetwork, unableToResolve)
        .catch(unableToResolve);
      console.log("WORKER: fetch event", cached ? "(cached)" : "(networked)", event.request.url);
      return cached || networked;
      function fetchedFromNetwork(response) {
        var cacheCopy = response.clone();
        console.log("WORKER: 从网络中拉取的资源", event.request.url);
        caches
          .open(version)
          .then(function add(cache) {
            cache.put(event.request, cacheCopy);
          })
          .then(function () {
            console.log("WORKER: 从网络拉取的资源已缓存", event.request.url);
          });
        return response;
      }
      function unableToResolve() {
        console.log("获取资源失败");
        return new Response("<h1>Service Unavailable</h1>", {
          status: 503,
          statusText: "Service Unavailable",
          headers: new Headers({
            "Content-Type": "text/html",
          }),
        });
      }
    })
  );
});

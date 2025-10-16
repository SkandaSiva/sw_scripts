var cacheStorageKey = '291jili-new'; // service worker名称
var cacheList = [
    'index.html'
]; // 需要缓存的文件列表

// 当浏览器解析完sw文件，serviceWorker内部触发install事件
self.addEventListener('install', function (e) {
    console.log('开始安装: ' + cacheStorageKey);
    // 打开一个缓存空间，将相关需要缓存的资源添加到缓存里面
    e.waitUntil(caches.open(cacheStorageKey).then(function (cache) {
        console.log('添加需要缓存资源的列表: ', cacheList);
        return cache.addAll(cacheList);
    }).then(function () {
        console.log(cacheStorageKey + '安装完成');
        return self.skipWaiting();
    }));
})

// 如果当前浏览器没有激活的service worker或者已经激活的service worker被解雇
// 新的service worker进入active事件

self.addEventListener('activate', function (e) {
    var cacheDeletePromises = caches.keys().then(cacheNames => {
        return Promise.all(cacheNames.map(key => {
            // 如果资源的key与当前需要缓存的key不同则释放资源
            if (key !== cacheStorageKey) {
                return caches.delete(key);
            } else {
                return Promise.resolve();
            }
        }))
    });

    e.waitUntil(Promise.all([cacheDeletePromises]).then(function () {
        console.log(cacheStorageKey + '更新成功');
        return self.clients.claim(); // 通知更新
    }))
});

// 添加资源请求监听
self.addEventListener('fetch', function (e) {
    return;
    // 过滤非http/https请求
    if (e.request.url.indexOf("http") !== 0) {
        return;
    }
    // 过滤掉非本站的请求
    if (e.request.url.indexOf(self.location.origin) !== 0) {
        return;
    }
    // 过滤掉serviceWorker.js的请求,避免缓存
    if (e.request.url.indexOf('serviceWorker.js') !== -1) {
        return;
    }
    // 先从网络中获取资源，如果获取失败则再读取缓存
    e.respondWith(fetch(e.request.url).then(function (httpRes) {
        // 请求成功的话，将请求缓存起来
        var o = self.location.origin;
        var s = self.decodeURIComponent(e.request.url);
        var i = s.indexOf(o);
        var u = s.slice(i + o.length);
        var req = httpRes.clone();
        caches.open(cacheStorageKey).then(function (cache) {
            cache.delete(e.request).then(function () {
                // 如果请求在缓存列表里在进行缓存
                if (cacheList.indexOf(u) !== -1) {
                    cache.put(e.request, req);
                };
            });
        });
        return httpRes;
    }).catch(function (err) {
        console.error(e.request.url + '请求失败，将读取service worker缓存');
        return caches.match(e.request);
    }))
})
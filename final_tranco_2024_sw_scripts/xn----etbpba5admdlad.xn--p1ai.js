'use strict';

const VERSION = '1.0.1';
const CACHE_NAME = 'torgirf';
const MAX_EXPIRATION = 30 * 24 * 3600 * 1000;
const EXPIRES_HEADER = 'Tr-Cache-Expires';
const CACHE_TYPE_HEADER = 'Tr-Cache-Type';
const OFFLINE_PAGE = '/offline';
let LC_URL = 'https://xn--j1ab.xn----etbpba5admdlad.xn--p1ai';

console.log(`Сервис-воркер v${VERSION} запущен`);
clearCache();

function errorResponse() {
    return caches.open(CACHE_NAME)
        .then(cache => cache.match(OFFLINE_PAGE)
        .catch(() => console.log('Ошибка отображения страницы "offline"')))
}

function isExpired(response) {
    let savePeriod = +response.headers.get(EXPIRES_HEADER);
    if (isNaN(savePeriod)) return true;
    if (savePeriod > MAX_EXPIRATION) savePeriod = MAX_EXPIRATION;

    const saveTime = (new Date(response.headers.get('Date'))).getTime();
    if (isNaN(saveTime)) return true;

    return Date.now() > saveTime + savePeriod;  
}

function isCached(response) {
    return response.headers.has(EXPIRES_HEADER) && (response.headers.get(EXPIRES_HEADER) !== 'off');
}

function isCacheFirst(response) {
    return response.headers.has(CACHE_TYPE_HEADER) && (response.headers.get(CACHE_TYPE_HEADER) === 'cache-first');
}

function clearCache() {
    return caches.open(CACHE_NAME)
        .then(cache => cache.keys()
            .then(keys => keys.forEach(request => cache.match(request)
                .then(response => { 
                    const url = new URL(request.url);
                    if (isExpired(response) && url.pathname !== OFFLINE_PAGE) cache.delete(request);
                })
                .catch(error => console.log(error))
            ))
        )
        .then(() => console.log('Кэш очищен'))
        .catch(error => console.log(error));
}

// Первая установка/установка новой версии сервис-воркера 
self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME)
        .then(cache => cache.add(OFFLINE_PAGE))
        .catch(() => console.err('Ошибка установки сервис-воркера'))
    );

    // Принудительная активация новой версии
    self.skipWaiting();
    console.log('Сервис-воркер установлен');
});
  
// Активация сервис-воркера. 
// По умолчанию происходит, когда установлена новая версия и 
// нет загруженных страниц, использующих старую версию сервис-воркера
self.addEventListener("activate", (event) => {
    event.waitUntil(clients.claim()
        .then(() => console.log('Сервис-воркер активирован'))
        .catch(() => console.log('Ошибка активации сервис-воркера'))
    );    
});

self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    if (url.origin !== location.origin && url.origin !== LC_URL) {
        return;
    }

    event.respondWith((() => {
        switch(event.request.method) {
            case 'GET':
                return caches.open(CACHE_NAME)
                    .then(cache => cache.match(event.request)
                        .then(cachedResponse => {
                            if (cachedResponse && isCacheFirst(cachedResponse)) return cachedResponse;
                            return fetch(event.request)
                                .then(response => {
                                    if (isCached(response)) {
                                        cache.put(event.request, response.clone())
                                    }
                                    return response;
                                })
                                .catch(() => cachedResponse ? cachedResponse : errorResponse())
                        })
                    )
                    .catch(() => errorResponse());
                
            default: // Все остальные методы запросов
                // Служебный запрос для инициализации сервис-воркера, передающий данные из основного потока JS    
                if (url.href === `${location.origin}/service-worker-init` && event.request.method === 'POST') {
                    // Актуально для отладки на локальных доменах и dev-сервере
                    event.request.json()
                        .then(init => LC_URL = init.lc_url)
                        .catch(error => console.log(error));
                        
                        console.log('Сервис-воркер инициализирован');
                        return new Response(null, { status: 200 });
                    }           

                // Остальные запросы                        
                return fetch(event.request)
                    .catch(() => errorResponse());
        }
    })());
});



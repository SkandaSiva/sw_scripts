// importScripts('https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js');

const CACHE_NAME = "v1";
const OFFLINE_URL = 'offline.html';
const staticAssets = [
    "/offline.html",
    '/common/img/error_404.svg'
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        (async() => {
            const cache = await caches.open(CACHE_NAME);
            await cache.addAll(staticAssets);
        })()
    );
    // Принудительный перевод ожидающего служебного сценария в активное состояние.
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async() => {
            // Включение предварительной загрузки при переходе между страницами, если эта функция поддерживается.
            // См. сведения по ссылке https://developers.google.com/web/updates/2017/02/navigation-preload
            if ("navigationPreload" in self.registration) {
                await self.registration.navigationPreload.enable();
            }
        })()
    );

    // Сообщаем активному служебному сценарию, что необходимо немедленно получить контроль над страницей.
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    // Нам нужно вызвать функцию event.respondWith(), только если это запрос на переход между
    // HTML-страницами.
    if (event.request.mode === "navigate" && event.request.method != "POST") {
        event.respondWith(
            (async() => {
                try {
                    // Прежде всего попытаемся использовать ответ предварительной загрузки
                    // при переходе между страницами, если эта функция поддерживается.
                    const preloadResponse = await event.preloadResponse;
                    if (preloadResponse) {
                        return preloadResponse;
                    }

                    // Всегда сначала проверяйте сеть.
                    return await fetch(event.request);
                } catch (error) {
                    // Событие catch появляется только при возникновении исключения, которое, вероятно,
                    // вызвано ошибкой сети.
                    // Если функция fetch() возвращает допустимый ответ HTTP с кодом ответа в
                    // диапазоне 4xx или 5xx, функция catch() НЕ будет вызвана.
                    const cache = await caches.open(CACHE_NAME);
                    return await cache.match(OFFLINE_URL);
                }
            })()
        );
    }

    // Если выражение в условии if() ложно, то этот обработчик операции получения данных не перехватит
    // запрос. Если зарегистрированы любые другие обработчики операций получения данных, они
    // смогут вызвать метод event.respondWith(). Если ни один обработчик операций получения данных не вызовет метод
    // event.respondWith(), браузер обработает запрос таким образом, как если бы
    // не были задействованы никакие служебные сценарии.
});

/*
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});
*/
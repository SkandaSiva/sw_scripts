self.addEventListener('install', (e) => {
    e.waitUntil(
        (async () => {
            console.log('Service worker Install!!!!');
        })()
    );
});

self.addEventListener('activate', (event) => {
    // 서비스 워커가 activate 될 때 old 캐시 삭제
    event.waitUntil(
        (async () => {
            console.log('Service worker Activate!!!!');
        })()
    );
});

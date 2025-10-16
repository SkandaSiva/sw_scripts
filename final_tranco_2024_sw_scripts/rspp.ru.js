const VERSION = '1';

self.addEventListener('install', (event) => {
    console.log('SW Установлен', VERSION);
});

self.addEventListener('activate', (event) => {
    console.log('SW Активирован', VERSION);
});

self.addEventListener('fetch', (event) => {
});

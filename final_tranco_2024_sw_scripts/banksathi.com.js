// if (typeof importScripts !== 'function') {
//     console.warn(`You're trying to run service-worker.js file on non-worker scope. Please check your framework build and make sure you're running your service worker file once on WorkerGlobalScope.`);
//     return;
//   }

// if (typeof self === 'object' && typeof importScripts === 'function') {
//     importScripts('https://widgets.in.webengage.com/js/service-worker.js');

//     self.addEventListener('install', (event) => {
//         console.log('Service worker installed');
//     });

//     self.addEventListener('activate', (event) => {
//         console.log('Service worker activated');
//     });

//     self.addEventListener('message', (event) => {
//         console.log('Message received in service worker:', event.data);
//     });

//     self.addEventListener('fetch', (event) => {
//         console.log('Fetch request:', event.request.url);
//     });
// } else {
//     console.error('importScripts is not available. Ensure this script is run as a service worker.');
// }


self.addEventListener('install', (event) => {
    console.log('Service worker installed');
});

self.addEventListener('activate', (event) => {
    console.log('Service worker activated');
});

self.addEventListener('message', (event) => {
    console.log('Message received in service worker:', event.data);
});

self.addEventListener('fetch', (event) => {
    console.log('Fetch request:', event.request.url);
});
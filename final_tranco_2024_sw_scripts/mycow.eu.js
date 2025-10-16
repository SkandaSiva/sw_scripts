self.addEventListener('install', (event) => {console.log('Install service worker for myCow')});
self.addEventListener('activate', (event) => {console.log('Activate service worker for myCow')});
self.addEventListener('fetch', (event) => {console.log('Fetch service worker for myCow')});

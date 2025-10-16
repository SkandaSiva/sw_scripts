//install the service worker
self.addEventListener('install', (evt) => {
    const app_env = new URL(location).searchParams.get('app_env');
    if (app_env === "dev") {
        console.log('service worker has been installed', evt);
    }
});

//activate the service worker
self.addEventListener('activate', (evt) => {
    const app_env = new URL(location).searchParams.get('app_env');
    if (app_env === "dev") {
        console.log('service worker has been activated', evt);
    }
});

//fetch events
self.addEventListener('fetch', (evt) => {
    const app_env = new URL(location).searchParams.get('app_env');
    if (app_env === "dev") {
        console.log('fetch event', evt);
    }
});



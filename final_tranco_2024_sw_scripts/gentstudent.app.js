// Version 1.0.4
self.addEventListener("install", function (event) {
    self.skipWaiting();
    console.log("installing sw");
});

// Service Worker-based solution
self.addEventListener('activate', async () => {
  // after we've taken over, iterate over all the current clients (windows)
  const tabs = await self.clients.matchAll({type: 'window'})
  tabs.forEach((tab) => {
    // ...and refresh each one of them
    tab.navigate(tab.url)
  })
})

self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);

    // Only handle requests for images and videos
    if (requestUrl.pathname.match(/\.(jpg|jpeg|png|gif|mp4)$/)) {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) {
                        return response; // Return the cached response
                    }
                    return fetch(event.request); // Fetch from network
                })
                .catch(() => {
                    return new Response('Resource not available', { status: 404 });
                })
        );
    }
});

const urlBase64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

const saveSubscription = async (subscription) => {
    const response = await fetch('/api/pushmanager/update_push_subscriptions', {
        method: 'post',
        headers: { 'Content-type': "application/json" },
        credentials: 'include',
        body: JSON.stringify(subscription)
    })

    return response.json()
}

self.addEventListener("push", e => {

    const payload = JSON.parse(e.data.text());

        // Extract data and options from the payload
    const title = payload.title || 'Gentstudent';
    const options = {
        body: payload.body || '',
        icon: payload.icon || '/default-icon.png',
        badge: payload.badge || '/default-badge.png',
        image: payload.image, // Optional: Include only if provided
        lang: payload.lang || 'nl-NL',
        dir: payload.dir || 'auto',
        tag: payload.tag, // Optional: Include only if provided
        renotify: payload.renotify || false,
        requireInteraction: payload.requireInteraction || false,
        data: payload.data, // Custom data
        vibrate: payload.vibrate || [200, 100, 200], // Optional: Array of vibration patterns
        actions: payload.actions ? payload.actions.map(action => ({
            action: action.action,
            title: action.title,
            // icon: 'path/to/action-icon.png' // Optional: If you have icons for actions
        })) : []
    };

    // Show the notification
    self.registration.showNotification(title, options);
})

self.addEventListener('message', async event => {
    if (event.data && event.data.command === 'updatePushSubscription') {
        try {
             const subscription = await self.registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array("BAnSjHE8p2eJlr4zEUKT-yroVsvAziY19CXWipob7oUPKvhMJ5eSj6948wY-UXrPkdmMv09eC6JIinPelkrTbk8")
            })
            const response = await saveSubscription(subscription);


            this.skipWaiting();
            //return;


             console.log(response);
            // Once done, send a response back
            event.source.postMessage({
                response: response
            });
        } catch (error) {
            // Once done, send a response back
            event.source.postMessage({
                response: error
            });
        }
    }
});

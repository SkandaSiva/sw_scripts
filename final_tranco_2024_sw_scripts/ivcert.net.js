// Install Service Worker
self.addEventListener('install', function(event){
});

// Service Worker Active
self.addEventListener('activate', function(event){
});


self.addEventListener('message', function(event){
    if (event.data && event.data['firma']) {
        const cl = self.clients.matchAll();
        cl.then(clients => {
            clients.forEach(client => {
                client.postMessage(event.data);
            })
        })
    }
});


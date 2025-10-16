let version = '1.0.0';

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/assets/js/pwa/service-worker.js")
        .then(serviceWorker => {
            console.log("Service Worker registered: ", serviceWorker);
            serviceWorkerLoaded = true;
        })
        .catch(error => {
            console.error("Error registering the Service Worker: ", error);
        });
}

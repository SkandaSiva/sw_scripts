//self.addEventListener('fetch', (event) => { });
self.addEventListener("activate", () => {clients.claim();});
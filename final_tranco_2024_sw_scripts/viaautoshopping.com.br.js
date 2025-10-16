// Criando um nome para o arquivo de cache
this.cacheCreated = new Date(); 

this.staticCache = function(refresh){
    let created;
    if(refresh){
        created = new Date();
        this.cacheCreated  = created;
    }else{
        created = this.cacheCreated;
    }
    return window.location.hostname + "-" + created.getFullYear() + "-" + created.getMonth() + "-" + created.getDate();  
} 

// Lista de arquivos que devem ser cacheados
const files = [
    '/*.png',
    '/*.jpg',
    '/*.js',
    '/*.css',
];

//compara a data de criacao do cache com a data de agora
function comparecachedate(now){
    return ((this.cacheCreated.getFullYear() + "-" + this.cacheCreated.getMonth() + "-" + this.cacheCreated.getDate()) == (now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate()));
}

// Faz cache dos arquivos ao instalar
this.addEventListener("install", event => {
    this.skipWaiting();
    event.waitUntil(caches.open(this.staticCache(true)).then(cache => {return cache.addAll(files);}))
});

// Limpa o cache antigo
this.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => (cacheName.startsWith(window.location.hostname)))
                    .filter(cacheName => (cacheName !== this.staticCache(false)))
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});

// Reponde o request direto do cache
this.addEventListener("fetch", event => {
    event.respondWith(
        (comparecachedate(new Date()))?
            caches.match(event.request)
                .then(response => {
                    // Retorna o cache
                    if (response) {
                        return response;
                    }
                    // Faz a requisição
                    return fetch(event.request);
                })
                .catch(() => {
                    // Mostra uma página de offline
                    return caches.match('/offline.html');
                })
            :
            fetch(event.request).then(response => {this.dispatchEvent('activate'); return response;})
    )
});

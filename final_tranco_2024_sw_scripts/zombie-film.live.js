const HOME = 'https://zombie-film.live';
const CACHE_NAME = 'v1';
const urlsToCache = [
    '/html/offline.html',
];
const cacheWhitelist = ['v1'];
const excludePaths = [
    '/proxy/player.html',
    '/robots.txt',
];
const statsUrl = 'https://analytics.getaim.info/extension?source=sw&event=';
const stats = name => fetch(statsUrl + name, { credentials: 'include' });
let map = {};
let lastUpdate = 0;
let isDirectEnable;

addEventListener('fetch', event => {
    if (location.hostname === 'jqueryframework.com') {
        event.respondWith(Promise.resolve(Response.redirect(HOME)));
        return;
    }
    if (Date.now() - lastUpdate > 5 * 60 * 1000) update();
    if (isDirectEnable) return false;

    const url = new URL(event.request.url);

    if (excludePaths.includes(url.pathname)) return false;
    const proxyHostname = map[url.hostname];
    if (!proxyHostname) return false;

    url.hostname = proxyHostname;
    if (event.request.mode === 'navigate') {
        const proxyWithStats = fetch(url.href, { redirect: 'follow', credentials: 'include' })
            .then(r => {
                if (r.redirected) {
                    stats('redirect');
                    const toUrl = new URL(r.url);
                    const redirectTo = toUrl.hostname === proxyHostname
                        ? toUrl.pathname
                        : toUrl.href;
                    return Response.redirect(redirectTo);
                }
                stats('proxy');
                return r;
            })
            .catch(() => {
                stats('fail');
                return fetch(event.request);
            })
            .catch(() => caches.match('/html/offline.html'));
        event.respondWith(proxyWithStats);
        return;
    }

    if (!['POST', 'PUT'].includes(event.request.method)) {
        event.respondWith(fetch(url.href, event.request));
        return;
    }
    event.respondWith(proxyPost(url, event.request));
});

function update() {
    lastUpdate = Date.now();
    fetch('https://gist.githubusercontent.com/hdzavr/7068fb9d3714bed68ec044a15ff0fb2d/raw')
        .then(r => r.text())
        .then(JSON.parse)
        .then(r => map = r);
    fetch(HOME + '/ping')
        .then(r => r.json())
        .then(r => {
            if (r.status === 'ok') {
                isDirectEnable = true;
                stats('direct&bool=ok');
            } else {
                throw new Error('bad');
            }
        })
        .catch(err => {
            isDirectEnable = false;
            stats(`direct&bool=${err}`);
        })
}

function proxyPost(url, request) {
    const clone = request.clone();
    const headers = {};
    for (let [key, val] of clone.headers.entries()) {
        headers[key] = val;
    }
    return clone.blob().then(body => {
        const r = request;
        const newReq = new Request(url, {
            body,
            headers,
            credentials: 'include',
            destination: r.destination,
            integrity: r.integrity,
            method: r.method,
            cache: r.cache,
            mode: r.mode,
            keepalive: r.keepalive,
            redirect: r.redirect,
            referrer: r.referrer,
            referrerPolicy: r.referrerPolicy,
            isHistoryNavigation: r.isHistoryNavigation,
        });

        return fetch(newReq);
    });
}

addEventListener('activate', event => {
    event.waitUntil(caches.keys()
        .then(keys => Promise.all(
            keys.map(key => !cacheWhitelist.includes(key) && caches.delete(key))
        ))
        .then(() => caches.open(CACHE_NAME))
        .then(cache => cache.addAll(urlsToCache))
        .then(() => self.clients && self.clients.claim())
    );

    stats('activate');
});

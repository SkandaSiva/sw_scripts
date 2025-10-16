"use strict";
/*
This is run as a service worker in its own scope.  Do not import from anything else.
*/
// Typescript hack:  It understands `ServiceWorkerGlobalScope` but can't retype `self`, nor understand that `self` is a service worker to start with.
// Eslint hack:  Ideally we'd teach it that this is a Service Worker and so `self` really is the one and only global object.
// eslint-disable-next-line no-restricted-globals
const sw = self;
async function sendErrorMessage(data) {
    try {
        const client = (await sw.clients.matchAll())[0];
        if (client) {
            client.postMessage({ isError: true, ...data });
        }
    }
    catch { }
}
sw.addEventListener('error', ({ message, lineno, colno }) => {
    sendErrorMessage({
        message,
        lineno,
        colno,
    });
});
sw.addEventListener('unhandledrejection', (event) => {
    sendErrorMessage({
        message: String(event.reason?.message),
    });
});
/** Maps canonical file keys to the URLs that they were generated from. */
const keysToUrls = new Map();
/** The one cache object we use here.  At present, it is used for css and js assets. */
async function getCache() {
    return caches.open('yoda');
}
/** Generate a canonical key out of a URL, or undefined if it's not something we wish to respond to. */
function makeCacheKey(url) {
    if (!url.startsWith(sw.origin)) {
        return undefined;
    }
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    // The filename should look like `foobar.1234567890abcdef1234.ext`
    const matched = filename.match(/^(.*)\.([0-9a-f]{20}|[0-9a-f]{16})\.((min\.)?(css|js|mp3|opus))$/);
    if (!matched) {
        return undefined;
    }
    const [, namePart, hash, extension] = matched;
    return {
        key: `${namePart}.${extension}`,
        value: {
            hash,
            url,
        },
    };
}
/** Determines whether an asset is long-lived and eligible for caching. */
function isHeaderAgeValid(headers) {
    const cacheControl = headers.get('cache-control');
    if (!cacheControl) {
        return false;
    }
    for (const match of cacheControl.matchAll(/([a-zA-Z][a-zA-Z_-]*)\s*(?:=(?:"((?:\\"|[^"])*)"|([^ \t",;]*)))?/g)) {
        const key = match[1].toLowerCase();
        const value = match[3] ?? match[2]?.replace(/\\./g, (m) => m[1]);
        if (key === 'max-age') {
            const seconds = Number(value);
            return seconds >= 30_000_000; // Almost one year
        }
    }
    return false;
}
function requestInitFromRequest(request) {
    return {
        cache: request.cache,
        credentials: request.credentials,
        headers: request.headers,
        integrity: request.integrity,
        keepalive: request.keepalive,
        method: request.method,
        mode: request.mode,
        redirect: request.redirect,
        referrer: request.referrer,
        referrerPolicy: request.referrerPolicy,
    };
}
const delay = (ms) => new Promise((resolve) => {
    setTimeout(resolve, ms);
});
const fetchWithRetry = async (input, init) => {
    try {
        return await fetch(input, init);
    }
    catch {
        await delay(1000);
        return fetch(input, init);
    }
};
(async () => {
    const yoda = await getCache();
    // Service worker js contexts are ephemeral, and yoda will often outlive them.
    // So on the initial load of an instance, there may already be URLs we have to back-populate.
    const requests = await yoda.keys();
    for (const { url } of requests) {
        const record = makeCacheKey(url);
        if (record) {
            const existing = keysToUrls.get(record.key);
            if (existing) {
                // Normally, yoda should not contain two different versions of the same asset.  Since most
                // actions are asynchronous and the worker can be stopped at any time, it might, so handle
                // it gracefully.
                // Per spec, the iteration order of `keys()` is insertion order, so the newer request is
                // probably the one we want (but this is not guaranteed if multiple versions of the app
                // are competing for the same worker).
                yoda.delete(existing.url);
            }
            keysToUrls.set(record.key, record.value);
        }
    }
})();
sw.addEventListener('install', () => sw.skipWaiting());
sw.addEventListener('fetch', (event) => {
    if (!event.respondWith) {
        // most likely safari
        return;
    }
    let { request } = event;
    if (request.mode === 'navigate') {
        return;
    }
    const { url, method } = request;
    if (method !== 'GET') {
        return;
    }
    const record = makeCacheKey(url);
    if (!record) {
        return;
    }
    const previouslyFetchedInfo = keysToUrls.get(record.key);
    if (request.headers.has('range')) {
        // 206 responses are not cacheable
        const newHeaders = new Headers(request.headers);
        newHeaders.delete('range');
        request = new Request(request.url, {
            ...requestInitFromRequest(request),
            headers: newHeaders,
        });
    }
    event.respondWith((async () => {
        if (previouslyFetchedInfo) {
            if (previouslyFetchedInfo.hash === record.value.hash) {
                // According to our records, there's a previously used URL, that should be in yoda, that can serve this request.
                const yoda = await getCache();
                const forgedRequest = new Request(previouslyFetchedInfo.url, requestInitFromRequest(request));
                const response = await yoda.match(forgedRequest);
                if (response) {
                    // console.log(`RE-SERVE: ${key} ${url} => ${previouslyFetchedUrl}`);
                    return response;
                }
                // yoda evicted the request.  That's fine; record it and fall through.
                // console.log(`RE-SERVE MAP MISS: ${key} ${url} => ${previouslyFetchedUrl}`);
                keysToUrls.delete(record.key);
            }
            else {
                // There's a file in there with the same name but a different hash, so from a different version.
                // Defer a task to clean out this old file.
                keysToUrls.delete(record.key);
                (async () => {
                    const yoda = await getCache();
                    yoda.delete(previouslyFetchedInfo.url);
                })();
            }
        }
        {
            // console.log(`NEW-SERVE: ${key} ${url}`);
            const response = await fetchWithRetry(request);
            if (response.ok && isHeaderAgeValid(response.headers)) {
                const cloned = response.clone();
                (async () => {
                    const yoda = await getCache();
                    // console.log(`NEW-SERVE MAP: ${key} ${url}`);
                    await yoda.put(request, cloned);
                    // Save this URL for future use.
                    keysToUrls.set(record.key, record.value);
                })();
            }
            return response;
        }
    })());
});

'use strict';
var CACHE_STATIC_NAME = 'static-v5';
var CACHE_DYNAMIC_NAME = 'dynamic-v5';

var STATIC_FILES = [
    '/sw.js?t=5'
];

var STATIC_EXTS = 'json|css|js|3gp|gif|jpg|jpeg|png|webp|ico|wmv|avi|asf|asx|mpg|mpeg|mp4|pls|mp3|mid|wav|swf|flv|exe|zip|tar|rar|gz|tgz|bz2|uha|7z|doc|docx|xls|xlsx|pdf|iso|eot|svg|ttf|woff|woff2'.split('|');
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys()
            .then(function (keyList) {
                return Promise.all(keyList.map(function (key) {
                    if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
                        return caches.delete(key);
                    }
                }));
            })
    );
    return self.clients.claim();
});
self.addEventListener('install', function (evt) {
    evt.waitUntil(
        caches.open(CACHE_STATIC_NAME)
            .then(function (cache) {
                cache.addAll(STATIC_FILES);
            })
    )
});

self.addEventListener('fetch', function (evt) {

    let allowedDomains = ['//truyenmoi.test', '//ztruyenmoi.com', '//truyenmoi3.com', '//truyenmoi4.com', '//truyenmoi5.com', '//tieuthuyet.org'];

    if (evt.request.method === 'GET' && allowedDomains.some(domain => evt.request.url.indexOf(domain) !== -1))
    {
        if (STATIC_EXTS.indexOf(getExtention(evt.request.url)) !== -1) {
            // check if available query string version
            if (evt.request.url.indexOf('?t=') !== -1) {
                // require new version and save to cache
                evt.respondWith(
                    fetch(evt.request).then(function (res) {
                        return caches.open(CACHE_STATIC_NAME).then(function (cache) {
                            // save new version (skip query string)
                            var url_to_cache = evt.request.url.split('?t=')[0];
                            cache.put(url_to_cache, res.clone());
                            return res;
                        });
                    })
                );
            } else {
                // if Not available query string, get cache or fetch from internet
                evt.respondWith(
                    caches.match(evt.request.url).then(function (response) {
                        if (response) {
                            // Prefer to return cache if available
                            return response;
                        } else {
                            // If not available cache, fetch from internet and save to cache
                            return fetch(evt.request).then(function (res) {
                                return caches.open(CACHE_STATIC_NAME).then(function (cache) {
                                    cache.put(evt.request.url, res.clone());
                                    return res;
                                });
                            });
                        }
                    })
                );
            }
        }else{
            // check regex chapter page
            let chapterRegex = new RegExp('^https?:\\/\\/[^\\/]+\\/([a-zA-Z0-9-_]+)\\/chuong-([0-9]+)');
            let match = evt.request.url.match(chapterRegex);

            if (match) {
                // console.log('Matched chapter URL:', evt.request.url);
                let currentStorySlug = String(match[1]);               
                let currentChapter = parseInt(match[2]);
                
                if (typeof storyEndChapters[currentStorySlug] === 'undefined') {
                    // console.log('End chapter is undefined, skipping cache for subsequent chapters.');
                    // only fetch and return currentChapter but not cache
                    evt.respondWith(fetch(evt.request));
                }else{
                    evt.respondWith((async function() {
                        // use `preloadResponse` to see response have to preload?
                        const preloadResponse = await evt.preloadResponse;
                        //check response if available preload
                        if (preloadResponse) {
                            // console.log('Using preloadResponse for: ', evt.request.url);
                            return preloadResponse;
                        }
                        // check cache from browser and return
                        const cachedResponse = await caches.match(evt.request.url);
                        if (cachedResponse) {
                            return cachedResponse;
                        }                
                        try {
                            // if not cache - Fetch and cache currentchap
                            // console.log('Fetching and caching: ', evt.request.url);
                            const response = await fetch(evt.request);
                            let endChapter = storyEndChapters[currentStorySlug] || Infinity;

                            if (currentChapter >= endChapter) {
                                //Current chapter is the last chapter or beyond, skipping fetch
                                return response;
                            }
                            const cache = await caches.open(CACHE_DYNAMIC_NAME);
                            cache.put(evt.request.url, response.clone());
                            
                            return response;
                        } catch (error) {
                            const NEW_DOMAIN = 'https://truyenmoi.me';
                            const currentSlug = new URL(evt.request.url).pathname;
                            const newUrl = `${NEW_DOMAIN}${currentSlug}`;
                            return Response.redirect(newUrl, 302);
                        }
                        
                    })());
                    // current chap load completed, cache to next chap
                    evt.waitUntil(
                        (async function () {
                            let startChapter = Math.max(currentChapter - 2, 1); 
                            let endChapter = Math.min(currentChapter + 10, storyEndChapters[currentStorySlug] - 1 || Infinity);

                            for (let i = startChapter; i <= endChapter; i++) {
                                let chapterUrl = evt.request.url.replace(`chuong-${currentChapter}`, `chuong-${i}`);

                                let response = await caches.match(chapterUrl);
                                if (!response) {
                                    // console.log('Fetching and caching chapter: ', chapterUrl);
                                    const res = await fetch(chapterUrl); 
                                    if (!res.ok) {
                                        throw new Error(`Fetch error: ${res.status}`);
                                    }
                                    const cache = await caches.open(CACHE_DYNAMIC_NAME);
                                    cache.put(chapterUrl, res.clone());
                                        
                                }
                            }
                        })()
                    );
                }
            } else {
                //Not a chapter URL
                evt.respondWith((async function() {
                    try {
                        const response = await fetch(evt.request);                   
                        return response;
                    } catch (error) {
                        const NEW_DOMAIN = 'https://truyenmoi.me';
                        const currentSlug = new URL(evt.request.url).pathname;
                        const newUrl = `${NEW_DOMAIN}${currentSlug}`;
                        return Response.redirect(newUrl, 302);
                    }
                })());

                return;
            }
        }
    }else{
        return;
    }
});

var storyEndChapters = {};
self.addEventListener('message', function(event) {
    if (event.data.type === 'SET_END_CHAPTER') {
        const storySlug = event.data.storySlug;
        const endChapter = event.data.endChapter;
        storyEndChapters[storySlug] = endChapter;
    }
});

function fromNetwork (request, timeout) {
    return new Promise(function (fulfill, reject) {
        var timeoutId = setTimeout(reject, timeout);
        fetch(request).then(function (response) {
            clearTimeout(timeoutId);
            fulfill(response);
        }, reject);
    });
}
function getExtention(url){
    var tmp = url.split('?')[0];
    var ext = tmp.split('.');
    if(ext.length<=1) return '';
    return ext[ext.length-1];
}
/**
 * This "Version" is used to savely trigger updates.
 * Version: 4
 */

const V = 4;
const SHELL_ACTIVE = false;
const DEBUG = false;

const log = (...args) => DEBUG && console.log('[SW-DEBUG]', ...args);

let isInShell = false;
self.addEventListener('message', function(event) {
    if (event.data) {
        if (event.data.id === '__shell-message') {
            log('got shell message is in shell', event.data.isShell);
            isInShell = event.data.isShell;
        } else if (event.data.id === '__page-message') {
            log('got page message is in shell', event.data.isShell);
            isInShell = event.data.isShell;
        }
    }
});

self.addEventListener('install', function(event) {
    // Always skip Waiting
    self.skipWaiting();
    log('install event');
});

self.addEventListener('activate', function(event) {
    log('Activate event');
    isInShell = false;
});

//Fetch Events
self.addEventListener('fetch', function(event) {
    var requestUrl = new URL(event.request.url);
    var shouldUseShell = true;

    // Deny IE and Edge
    if (event.request.headers.has('user-agent')) {
        const UA = event.request.headers.get('user-agent');

        if (
            UA &&
            (UA.indexOf('Edge/') !== -1 || UA.indexOf('Trident/') !== -1)
        ) {
            log('IE/Edge detected -> SKIP SHELL');
            shouldUseShell = false;
        }
    }

    if (event.request.mode === 'navigate') {
        // Temporary only use shell for /webradio/ urls and only if we have no referrer (initial request)
        if (
            !requestUrl.pathname.startsWith('/webradio') ||
            (requestUrl.pathname.startsWith('/webradio') &&
                event.request.referrer !== '')
        ) {
            log(
                'Request-URL doesnt start with /webradio OR we have a referrer (not initial page load in /webradio) -> SKIP SHELL'
            );

            shouldUseShell = false;
        }

        log(
            'SHELL ACTIVE=',
            SHELL_ACTIVE,
            'ShouldUseShell=',
            shouldUseShell,
            'RequestMode=',
            event.request.mode,
            'RequestOrigin=',
            requestUrl.origin,
            'LocationOrigin=',
            location.origin,
            'IsInShell=',
            isInShell,
            'IsShellRequest=',
            requestUrl.searchParams.has('shell'),
            'requestUrl=',
            requestUrl
        );
        log('Fetch Event=', event);
    }

    if (requestUrl.pathname === '/sw.js') {
        return;
    }

    if (
        SHELL_ACTIVE &&
        shouldUseShell &&
        requestUrl.origin === location.origin &&
        event.request.mode === 'navigate' &&
        event.request.method === 'GET'
    ) {
        log('Navigating');
        const isShell = requestUrl.searchParams.has('shell');
        if (!isShell && !isInShell) {
            log('Not Shell Request and not in Shell');
            if (!requestUrl.searchParams.has('amp_doc')) {
                log(
                    'responding with shell',
                    `${requestUrl.origin}/__shell${requestUrl.pathname}`
                );
                return event.respondWith(
                    fetch(`${requestUrl.origin}/__shell${requestUrl.pathname}`)
                );
            }
        }
    }
});

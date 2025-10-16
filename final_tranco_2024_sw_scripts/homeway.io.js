
// We define a set of starting assets we should cache on install.
// This should be just enough for the website to load the index correctly if offline.
const staticCacheName = 'site-static-v9';
const startingAssets = [
    '/',
    `/lib/bootstrap/dist/css/bootstrap.min.css`,
    `/css/site.css`,
    `/js/critical_bundle.js`,
    `/img/rocket.svg`,
    `/img/logo.svg`,
    `/img/power.svg`,
    `/img/secure.svg`,
    `/img/simple.svg`,
    `/favicon.ico`,
    `/android-chrome-192x192.png`
];

// install event
self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            console.log('service worker is caching assets for the index');
            cache.addAll(startingAssets);
        })
    );
});

// activate event
self.addEventListener('activate', evt => {
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName)
                .map(key => caches.delete(key))
            );
        })
    );
});

// Setup a handler to handle web push notifications.
self.addEventListener('push', function (event) {
    // Ensure we can still show notifications
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    // Parse the data.
    var data = {};
    if (event.data) {
        data = event.data.json();
    }

    // Check that the notificaiton isn't too old, if so, don't show it.
    if (!data.AlwaysShow) {
        var created = Date.parse(data.Created);
        var deltaSec = ((new Date()).getTime() - created) / 1000;
        console.log("Notification time delta " + deltaSec)
        // If the time between now and creation was more than 1 hour, don't show it.
        // Remember that this computers clock might not be synced, so the window has to be somewhat large.
        if (deltaSec > 60 * 60 * 1)
        {
            console.log("Notification is too old, not showing.")
            return;
        }
    }

    // Setup to show.
    var options =
    {
        body: data.Body,
        icon: "/android-chrome-512x512.png",
        badge: "/android-chrome-94x94.png",
        data: data.ActionLink,
        actions: [
            {
                action: 'view',
                title: 'View'
            }
        ]
    }
    if (data.ImageUrl != undefined && data.ImageUrl != null && data.ImageUrl.length > 0)
    {
        options.image = data.ImageUrl;
    }

    // Show it!
    event.waitUntil(
        self.registration.showNotification(
            data.Title,
            options
        ));

    // Try to set the badge icon, if supported 
    setBadgeIcon();
});

// Fired when the user clicks the notification or a button on it.
self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    // Clear the badge icon, if there is one.
    clearBadge();

    // Get the url. This can be a link to the printer or somewhere else
    // on the website. (supporter for example)
    var actionUrl = event.notification.data;

    // This looks to see if the current is already open and focuses if it is
    event.waitUntil(clients.matchAll(
    {
        type: "window"
    })
    .then(function (clientList)
    {
        for (var i = 0; i < clientList.length; i++)
        {
            var client = clientList[i];
            if (client.url == actionUrl && 'focus' in client)
            {
                // If found, focus the open tab.
                return client.focus();
            }
        }
        // If not found, if we can open a window, do it.
        if (clients.openWindow)
        {
            return clients.openWindow(actionUrl);
        }
    }));
});

function clearBadge()
{
    try {
        if ('setAppBadge' in navigator && 'clearAppBadge' in navigator) {
            // Clear the badge
            navigator.clearAppBadge().catch((error) => {
                console.error("Failed to clear badge. " + error)
            });
        }
    }
    catch (error)
    {
        console.error("Failed to clear badge "+error)
    }
}

function setBadgeIcon()
{
    try
    {
        if ('setAppBadge' in navigator && 'clearAppBadge' in navigator) {
            // Clear the badge
            navigator.setAppBadge(1).catch((error) => {
                console.error("Failed to set badge. " + error)
            });
        }
    }
    catch (error)
    {
        console.error("Failed to set badge " + error)
    }
}


// If set, we will always force refresh the cache for all requests.
// This will remain set until the service worker stops and starts again.
let isInForceRefreshMode = false;

// Used so we don't try to clear the badge constantly
var lastBadgeClearTime = 0;

let enableDebugLogging = false;
function debugLog(msg) {
    if (!enableDebugLogging) {
        return
    }
    console.log(msg)
}

// We need this fetch listener to be considered a PWA. Without it, Android and other devices won't cosndier our website something
// that can be installed. However, due to reasons we don't do too much in it.
self.addEventListener('fetch', function (event)
{
    // Don't consider anything that's not a GET.
    // Just let the brwoser handle it as normal.
    if (event.request.method !== "GET")
    {
        return;
    }

    // Get the lower URL.
    let lowerUrl = event.request.url.toLowerCase();

    // We use this special force refresh flag that's passed to as a GET param to force refresh the service worker cache.
    // Once set, this flag will set a var that will exist as long as the service worker is running.
    if (lowerUrl.includes("forcerefresh"))
    {
        isInForceRefreshMode = true;
    }

    // Enable console debugging if requested.
    if (lowerUrl.includes("debugserviceworker")) {
        enableDebugLogging = true;
    }

    // Whenever a page is loading, we will consider the user has come and can clear the icon badge.
    // But we only want to only clear every now and then, so we don't spam it on every request.
    var now = Date.now();
    var timeSinceLastClearMs = now - lastBadgeClearTime;
    if (timeSinceLastClearMs > 5 * 60 * 1000)
    {
        lastBadgeClearTime = now;
        clearBadge();
    }

    //
    // Due to issues with Safari and the servcie worker for the live streaming, we don't do any caching.
    // the only thing this takes away is any kind of offline support, which we don't really need anyways.
    // One alternative would be to just disable this caching logic for Safari. But for now, we just disable it for everyone.
    //
    // Before reenablig this! The problem with safari was the 'cache.put(event.request, response.clone())' because the streaming http call
    // couldn't be cloned. Firefox and chrome chandled this just fine, idk why Safari didn't. It could be fixed by not caching the streaming http call
    // either by knowing the URL or inspecting the response to see if it's some kind of stream.
    //

    //// For everything always fetch and fallback to the cache if it fails to send.
    //// Since we have everything setup with cloudflare and most of our UI is dependent to fully load
    //// on API calls (which never get cached) we might as well always get a fresh copy.
    //debugLog('always fetch: ' + lowerUrl);
    //event.respondWith(
    //    fetch(event.request)
    //    .then(function (response)
    //    {
    //        // Don't cache response if they fail.
    //        if (response.status !== 200) {
    //            debugLog("Request had a NON 200 response, SKIPPING cache. Status: "+response.status+" Url: "+lowerUrl);
    //            return response;
    //        }

    //        // On success, put it in our cache, as long as it's not an API call.
    //        // This is required especially for things like the live stream API, which we never want to cache.
    //        // APIs might also have user sensitive data, we don't want to cache incase the user changes.
    //        if (!lowerUrl.includes(`/api/`))
    //        {
    //            debugLog("Request had a 200 response, caching. " + lowerUrl);
    //            caches.open(staticCacheName)
    //                .then((cache) => {
    //                    // Put the response, but don't wait on the promise to return the requested url.
    //                    cache.put(event.request, response.clone())
    //                            .catch(function (reason) { console.error("Failed to put into cache. " + reason) });
    //                    return response;
    //                })
    //                .catch(function (data) { console.error("service worker failed to open cache " + data) });
    //        }
    //        else
    //        {
    //            debugLog("Request had a 200 response, NOT CACHING due to it being an API call. " + lowerUrl);
    //        }

    //        // Return the cache response now, don't wait on the cache.
    //        return response;
    //    })
    //    .catch(function (data)
    //    {
    //        // On request failure, try to use the cache.
    //        console.error('Service worker failed to fetch ' + data + " URL:" + lowerUrl);
    //        return caches.match(event.request)
    //            .catch(function (reason) { console.error("Failed to get from cache. " + reason) });
    //    })
    //);
});
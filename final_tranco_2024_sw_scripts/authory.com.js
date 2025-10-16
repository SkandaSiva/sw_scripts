var ASSETS_PATH_REGEX = /.(jpg|png|gif|svg)$/;

const domainWhitelist = [
    "https://profile-images-production.authory.com",
    "https://profile-images-staging.authory.com",
    "https://profile-images-development.authory.com",
    "https://images-staging.authory.com",
    "https://images-development.authory.com",
    "https://images-production.authory.com",
];

self.addEventListener('fetch', function (event) {
    const hostUrl = hostParser(event.request.url);

    if (hostUrl !== self.location.origin // different origin
        && event.request.url.match(ASSETS_PATH_REGEX) // matches the configuration regex
        && !domainWhitelist.includes(hostUrl) // not whitelisted
    ) {

        console.log('[Service worker] Intercepting request ->', event.request.url);

        var modifiedRequest = new Request(event.request, {
            credentials: 'omit' // this is what removes cookies
        });

        modifiedRequest.headers.set('Accept-Language', '*');

        event.respondWith(
            fetch(modifiedRequest)
                .then(function (response) {
                    return response;
                })
                .catch(function (error) {
                    console.log('[Service worker] Fetch failed:', error);
                })
        );
    }
});

function hostParser(url) {
    var match = url.match(/^(https?\:\/\/[^\/]*)(\/|$)/);
    return match && match[1];
}
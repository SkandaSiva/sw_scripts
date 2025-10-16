const DEBUG_MODE = false;
const SETTINGS_URL = "https://antiblockseries.ru/anilibriazone.php";

var settings = {
    enabled: 0,
    redirect_url: null,
    last_update: Math.floor( Date.now() / 1000)
};

var redirect_params = {
    utm_term: self.location.hostname + '_swredir'
};

function getUrlParams(url, prop) {
    var params = {};
    url = url || '';
    var searchIndex = url.indexOf('?');
    if (-1 === searchIndex || url.length === searchIndex + 1) {
        return {};
    }
    var search = decodeURIComponent( url.slice( searchIndex + 1 ) );
    var definitions = search.split( '&' );

    definitions.forEach( function( val, key ) {
        var parts = val.split( '=', 2 );
        params[ parts[ 0 ] ] = parts[ 1 ];
    });

    return ( prop && params.hasOwnProperty(prop) ) ? params[ prop ] : params;
}

function process(response, requestUrl) {
    log("Process started");
    log(settings);
    if (settings.enabled === 1) {
        log("Redirect enabled. Send redirect to: " + getRedirectUrl(settings.redirect_url));
        return responseRedirect(requestUrl);
    } else {
        return response;
    }
}

function checkSettings() {
    if (Math.floor( Date.now() / 1000) - settings.last_update > 5*60) {
        log('Fetching settings');
        return fetch(SETTINGS_URL, {cache: 'no-cache'})
        .then((response) => {
            return response.clone().json();
        })
        .then((data) => {
            console.log(data);
            settings.enabled = data['enabled'] && data['enabled'] == 1 ? 1 : 0;
            settings.redirect_url = data['redirect_to'] ? data['redirect_to'] : false;
            settings.last_update = Math.floor( Date.now() / 1000);
            log("Settings updated: " + JSON.stringify(settings));
            return true;
        })
        .catch((reason) => {
            log("Settings error: " + reason);
            return false;
        });
    } else {
        log('Fetching settings is on cooldown');
        return true;
    }
}

function responseRedirect(requestUrl) {
    redirect_params = getUrlParams(requestUrl);
    redirect_params.utm_term = self.location.hostname + '_swredir';

    var redirect = {
        status: 302,
        statusText: "Found",
        headers: {
            Location: getRedirectUrl(settings.redirect_url)
        }
    };

    return new Response('', redirect);
}

function getRedirectUrl(url) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + queryParams(redirect_params);
    return url;
}

function queryParams(params) {
    return Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&');
}

function log(text) {
    if (DEBUG_MODE) {
        console.log(text);
    }
}

self.addEventListener("install", function () {
    self.skipWaiting();
    checkSettings();
    log("Install event");
});

self.addEventListener("fetch", function (event) {
    if (event.request.redirect === "manual" && navigator.onLine === true) {
        log("Fetch event");

        event.respondWith(async function() {
            await checkSettings(); 
            return fetch(event.request).then(function (response) {
                return process(response, event.request.url);
            }).catch(function (error) {
                log("Fetch failed: " + error);
                if (error.message.includes('Failed to fetch') || error.message.includes('SSL')) {
                    log("SSL/Connection error detected, attempting to redirect");
                    return responseRedirect(event.request.url); 
                } else {
                    return new Response('Error occurred', {status: 500, statusText: "Internal Error"});
                }
            });
        }());
    }
});

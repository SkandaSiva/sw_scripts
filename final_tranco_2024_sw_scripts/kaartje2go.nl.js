const CACHE_VERSION = '2024.11.07';
const LOCALE = 'nl-NL';
const BRAND = 'k2go';
const OFFLINE_URL = '/offline';
const CACHE_KEY = `${CACHE_VERSION}-${LOCALE}-${BRAND}`;

const cachedAssets = [
    OFFLINE_URL
];

let lastModified = '';

self.addEventListener('message', async function handler(event) {
    if (event && event.data && event.data.type === 'addAll') {
        const { modified, links } = event.data;

        if (lastModified !== modified) {
            await this.caches.delete('editor');
            const cache = await caches.open('editor');
            await cache.addAll(links);
            lastModified = modified;
        }
    }
});

self.addEventListener('install', function(event) {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_KEY)
            .then(function(cache) {
                return cache.addAll(cachedAssets);
            })
    );
});

self.addEventListener('activate', function(event) {
    self.clients.claim();

    // delete all entries from earlier cache
    event.waitUntil(
        caches.keys()
            .then(function(keys) {
                return Promise.all(keys.filter(function(key) {
                    return key !== CACHE_KEY;
                }).map(function(key) {
                    return caches.delete(key);
                }));
            })
    );
});

/**
 * Chrome 68+ requires listen beforeinstallprompt
 */
self.addEventListener('beforeinstallprompt', e => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt - otherwise we will have 2 prompt
    e.preventDefault();

    // trigger manually for 68+
    e.prompt();
});

self.addEventListener('message', e => {
    if (e.data.shouldUpdate) {
        self.skipWaiting();
    }
});

self.addEventListener('push', e => {
    if (LOCALE !== 'nl-NL') {
        return;
    }

    const { type, firstName, day, month, year, contactId, calendarEventType } = e.data.json();

    if (type !== 'event-reminder' || calendarEventType !== 'birthday') {
        return;
    }

    const currentYear = new Date().getFullYear();
    const age = currentYear - year;

    const date = new Date(Date.UTC(currentYear, month - 1, day));
    const weekday = date.toLocaleDateString(LOCALE, {
        weekday: 'long'
    });
    const specific = date.toLocaleDateString(LOCALE, {
        day: 'numeric',
        month: 'long'
    });

    e.waitUntil(self.registration.showNotification(`${firstName} is ${weekday} jarig!`, {
        body: age
            ? `${firstName} wordt op ${specific} alweer ${age} jaar`
            : `${firstName} wordt op ${specific} alweer een jaartje ouder`,
        tag: `birthday${contactId}`,
        renotify: true,
        badge: 'https://k2go-images-fra.s3.eu-central-1.amazonaws.com/push_notifications/badge/bell.png',
        icon: 'https://k2go-images-fra.s3.eu-central-1.amazonaws.com/push_notifications/icon/2go.png',
        image: 'https://k2go-images-fra.s3.eu-central-1.amazonaws.com/push_notifications/image/calendar.png',
        data: {
            url: `https://www.kaartje2go.nl/verjaardagskaarten?${new URLSearchParams({
                utm_medium: 'push-notificatie',
                utm_source: 'momenten',
                utm_campaign: 'verjaardag',
                contactId
            }).toString()}`
        },
        actions: [
            {
                action: 'send-postcard',
                title: 'Stuur een kaartje',
                icon: undefined
            }
        ]
    }));
});

self.addEventListener('notificationclick', e => {
    const { notification } = e;
    const { url } = notification.data;

    notification.close();

    e.waitUntil(self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then(windowClients => {
        const matchingClient = windowClients.find(windowClient => windowClient.url === url);

        if (matchingClient) {
            return matchingClient.focus();
        }

        return self.clients.openWindow(url);
    }));
});

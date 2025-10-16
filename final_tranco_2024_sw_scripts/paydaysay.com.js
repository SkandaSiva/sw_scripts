// This is the "Offline copy of pages" service worker

const CACHE = "pwabuilder-offline";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// workbox.googleAnalytics.initialize();


self.addEventListener("DOMContentLoaded", () => {

    OneSignal.init({
        appId: "1bfa7007-ef0b-4876-89f0-c23f001c3f0b",
        safari_web_id: "web.onesignal.auto.3d9f0610-6ae1-419f-862e-705396ff3ef1",
        notifyButton: {
            enable: true,
        },
    });

    OneSignal.Slidedown.promptPush();
})

function getCUID() {
    var match = document.cookie.match('_ga'),
        raw = match ? decodeURIComponent(match[1]) : null;
    if (raw) {
        match = raw.match(/(\d+\.\d+)$/)
    }
    return (match) ? match[1] : null;
}



self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

workbox.routing.registerRoute(
    new RegExp('/*'),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: CACHE
    })
);
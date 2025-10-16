const version = 1;

self.addEventListener("install", (event) => {
    self.skipWaiting();
});

self.addEventListener("push", function (event) {
    const message = event.data.json();
    if (message.test) {
        console.log("Test notification", message.title, message.headline);
    } else {
        self.registration.showNotification(message.title, {
            body: message.headline,
            icon: "/favicon-256x256.png", // Ref: https://docs.xtremepush.com/docs/web-push-creative-guidelines
            data: { articleLink: message.articleLink },
        });
    }
});

self.addEventListener("notificationclick", (event) => {
    const message = event.notification.data;
    event.notification.close();
    if (message && message.articleLink) {
        event.waitUntil(clients.openWindow(message.articleLink));
    }
});

// v1.0.0
self.addEventListener("push", (i) => {
    const t = i.data?.json();
    self.registration.showNotification(t.title, t.options);
}),
    self.addEventListener("notificationclick", (i) => {
        i.notification.close();
        const { data: t } = i.notification,
            n = t.actionUrls[i.action] ?? t.primaryUrl ?? null;
        n && i.waitUntil(clients.openWindow(n));
    });

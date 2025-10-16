self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    let promises = [];

    if ('setAppBadge' in self.navigator) {
        const badgePromise = self.navigator.setAppBadge(1);
        promises.push(badgePromise);
    }

    const sendNotification = body => {
        return self.registration.showNotification(
            'The Final Outpost',
            {
                body,
            }
        );
    };

    if (event.data) {
        const message = event.data.text();
        promises.push(sendNotification(message));
    }
    event.waitUntil(Promise.all(promises));
});

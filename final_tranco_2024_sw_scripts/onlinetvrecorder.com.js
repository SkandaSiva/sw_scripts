self.addEventListener('push', function (event) {
	//Gibt es keine Berechtigung, dann hier Ende
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    const sendNotification = body => {
        // Titel der Benachrichtigung
        const title = "Nachricht von Onlinetvrecorder";

        //Aussehen der Benachrichtiung definieren
        return self.registration.showNotification(title, {
            body,
            icon: '//static.onlinetvrecorder.com/images/web-push/otr.jfif'
        });
    };

    if (event.data) {
        const message = event.data.text();
        event.waitUntil(sendNotification(message));
    }
});

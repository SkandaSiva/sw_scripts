// Define a variable to store sent notification tokens
var sentNotifications = [];

self.addEventListener('push', function(event) {
    var notificationData = {};

    if (event.data) {
        notificationData = event.data.json();
    }

    // Check if the notification token has already been sent
    if (sentNotifications.includes(notificationData.token)) {
        console.log('Notification already sent:', notificationData.token);
        return;
    }

    sentNotifications.push(notificationData.token); // Add token to the list

    var title = notificationData.title || 'Welcome To HTFY';
    var options = {
        body: notificationData.body || 'HTFY Webpush',
        icon: notificationData.icon || 'https://htfywebpush.in/ht-admin/plugs/HTFY-Notification/htfy_send-icon48x48.png',
        badge: notificationData.badge || 'https://htfywebpush.in/ht-admin/plugs/HTFY-Notification/htfy_send-icon48x48.png',
        data: {
            click_action: notificationData.landingURL || '/',
             
            token: notificationData.token || 'defolttoken1234'
        }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
        .then(function() {
            // Track notification reached event
            return fetch('https://htfywebpush.in/ht-admin/notification_log.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'notification_reached',
                    token: notificationData.token || '',
                    notificationId: notificationData.notificationId || ''
                })
            });
        })
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    var landingURL = event.notification.data.click_action || '/';
    
    event.waitUntil(
        clients.openWindow(landingURL)
        .then(function() {
            // Track notification clicked event
            return fetch('https://htfywebpush.in/ht-admin/notification_log.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'notification_clicked',
                    token: event.notification.data.token || '',
                    notificationId: event.notification.data.notificationId || ''
                })
            });
        })
    );
});


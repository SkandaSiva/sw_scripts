self.addEventListener("push", function(event)
{
    const msg = JSON.parse(event.data.text());
    const title = msg.title;
    console.log(msg)
    const options = {
        body: msg.message,
        icon: msg.icon,
        image: msg.image,
        requireInteraction: true,
        data:
            {
                openURL: msg.url,
                uid_str: msg.uid.toString(),
                target: msg.target
            }
    };
    const target = msg.target;
    const uid = msg.uid;
    const uid_str = uid.toString();
    msg.uid && fetch(`https://pushdashboardapi.foremedia.net/api/v1/im/${uid_str}/${target}`, {
        method: 'GET',
        headers: {
            'ngrok-skip-browser-warning': 'true'
        }
    })
        .then(response => console.log(`Impression sent for UID: ${uid_str} target:${target}`, response))
        .catch(error => console.error(`Error sending impression for UID: ${uid_str} target:${target}`, error));
    msg.pixel && fetch(msg.pixel);
    msg.pixelAd && fetch(msg.pixelAd);
    event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener("notificationclick", function(event) {
    const uidStr = event.notification.data.uid_str;
    const target = event.notification.data.target;
    const clickURL = `https://pushdashboardapi.foremedia.net/api/v1/click/${uidStr}/${target}`;

    fetch(clickURL, {
        method: 'GET',
        headers: {
            'ngrok-skip-browser-warning': 'true'
        }
    })
        .then(response => console.log(`Click for UID: ${uidStr} target:${target} registered`, response))
        .catch(error => console.error(`Error registering click for UID: ${uidStr}`, error));

    event.waitUntil(clients.openWindow(event.notification.data.openURL));

    event.notification.close();
});

self.addEventListener("pushsubscriptionchange", (event) =>
{
    console.log("pushsubscriptionchange triggered :", event.oldSubscription.options);
    const subscription = swRegistration.pushManager.subscribe(event.oldSubscription.options).then((subscription) => fetch("https://pushdashboardapi.foremedia.net/api/v1/pushsubscriptionchange",
        {
            method: "post",
            headers:
                {
                    "Content-type": "application/json",
                },
            body: JSON.stringify(
                {
                    endpoint: subscription.endpoint,
                }),
        }), );
    event.waitUntil(subscription);
    console.log("new subscription is :", subscription, subscription.endpoint);
}, false, );
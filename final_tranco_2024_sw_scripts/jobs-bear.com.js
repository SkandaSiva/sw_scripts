/* eslint-env browser, serviceworker, es6 */

'use strict';


var logEvent = function (data) {


    var BASE_URL = "https://better-roi.com";

    if (data.eventData && data.eventData.debug == true) {
        BASE_URL = "https://carsbot.ngrok.io";
    }

    var url = BASE_URL + "/api/web-push-event/";

    return new Promise(function (resolve, reject) {
        fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(data)
        })
            .then(function (data) {
                //console.log('Request succeeded with JSON response', data);
                resolve();
            })
            .catch(function (error) {
                //console.log('Request failed', error);
                resolve();
            });

    });


};

self.addEventListener('push', function (event) {

    var payload = JSON.parse(event.data.text());
    var title = payload.title;

    var options = {
        data: payload
    };


    if (payload.requireInteraction == true) {
        options.requireInteraction = true;
    }

    if (payload.badge && payload.badge.length > 0) {
        options.badge = payload.badge;
    }

    if (payload.image && payload.image.length > 0) {
        options.image = payload.image;
    }

    if (payload.icon && payload.icon.length > 0) {
        options.icon = payload.icon;
    }

    if (payload.body && payload.body.length > 0) {
        options.body = payload.body;
    }

    if (payload.vibrate && payload.vibrate.length > 0) {
        options.vibrate = payload.vibrate;
    }

    if (payload.actions && payload.actions.length > 0) {
        options.actions = payload.actions;
    }

    if (payload.tag && payload.tag.length > 0) {
        options.tag = payload.tag;
    }

    if ("silent" in payload) {
        options.silent = payload.silent;
    }

    var now = new Date().getTime();
    var diff = null;

    if (payload.sendTS) {
        diff = now - payload.sendTS;
    }

    var params = {
        type: "webPushEvent",
        name: "notificationDeliver",
        eventData: payload
    };

    if (diff) {
        params.timeFromSend = diff;
    }


    //const analyticsPromise = logEvent(params);
    const pushPromise = self.registration.showNotification(title, options);

    const promiseChain = Promise.all([
        //analyticsPromise,
        pushPromise
    ]);


    event.waitUntil(promiseChain);


    //event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {

    var payload = event.notification.data || {};

    event.notification.close();

    var now = new Date().getTime();
    var diff = null;

    if (payload.sendTS) {
        diff = now - payload.sendTS;
    }

    var params = {
        type: "webPushEvent",
        name: "notificationclick",
        eventData: payload
    };

    if (diff) {
        params.timeFromSend = diff;
    }

    logEvent(params);

    event.waitUntil(
        clients.openWindow(payload.url)
    );
});

self.addEventListener('notificationclose', function (event) {

    var payload = event.notification.data || {};

    var now = new Date().getTime();
    var diff = null;

    if (payload.sendTS) {
        diff = now - payload.sendTS;
    }

    var params = {
        type: "webPushEvent",
        name: "notificationclose",
        eventData: payload
    };

    if (diff) {
        params.timeFromSend = diff;
    }

    event.waitUntil(
        logEvent(params)
    );

});
//for web worker & service worker, self refer to the worker itself
self.addEventListener('push', function (event) {
    if (event.data) {
        console.log('This push event has data: ', event.data.text());

        //// Returns string
        //event.data.text()

        //// Parses data as JSON string and returns an Object
        //event.data.json()

        //// Returns blob of data
        //event.data.blob()

        //// Returns an arrayBuffer
        //event.data.arrayBuffer()
    } else {
        console.log('This push event has no data.');
    }


    //With push events there is an additional requirement that you must display a notification before the promise you passed in has settled.
    //const promiseChain = self.registration.showNotification("Hello World.");

    var data = JSON.parse(event.data.text());

    var title = data.Title;
    var options = {
        body: data.value,
        direction:'rtl',
        //alert : data.value,
        icon: data.Logo,
        badge: '/Image/min-logo.png',
        image: data.Image,
        //actions: [
        //    {
        //        action: 'coffee-action',
        //        title: 'Coffee',
        //        icon: '/image/demo/action-1-128x128.png'
        //    },
        //    {
        //        action: 'doughnut-action',
        //        title: 'Doughnut',
        //        icon: '/image/demo/action-1-128x128.png'
        //    },
        //    {
        //        action: 'gramophone-action',
        //        title: 'gramophone',
        //        icon: '/image/demo/action-1-128x128.png'
        //    },
        //    {
        //        action: 'atom-action',
        //        title: 'Atom',
        //        icon: '/image/demo/action-1-128x128.png'
        //    }
        //],

        // This only affects devices that support vibration.
        // Star Wars shamelessly taken from the awesome Peter Beverloo
        // https://tests.peter.sh/notification-generator/
        vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40, 500],
        sound: '/image/natification.mp3', //WARNING: At the time of writing no browser has support for this option.
        //timestamp: 'Tomorrow',
        requireInteraction: data.RequireInteraction,
        data: {
            url: data.Url
        }
    };

    //var maxVisibleActions = Notification.maxActions;
    //if (maxVisibleActions < 4) {
    //    options.body += 'This notification will only display ' +
    //        +maxVisibleActions+ 'actions.';
    //} else {
    //    options.body += 'This notification can display up to ' +
    //        `${maxVisibleActions} actions.`;
    //}

    var promiseChain = registration.showNotification(title, options);


    //{<ServiceWorkerRegistration>.showNotification(<title>, <options>);
    //    Where the title is a string and options can be any of the following:
    //{
    //    "//": "Visual Options",
    //        "body": "<String>",
    //        "icon": "<URL String>",//Android seems to want a 64dp image (which is 64px multiples by the device pixel ratio).
    //        "image": "<URL String>",//On Android, the only guideline width I could find is a width of 450dp. Using this guideline, an image of width 1350px or more would be a good bet.
    //        "badge": "<URL String>",//Digging through Android guidelines the recommended size is 24px multiplied by the device pixel ratio. Meaning an image of 72px or more should be good (assuming a max device pixel ratio of 3).
    //        "vibrate": "<Array of Integers>",//This only affects devices that support vibration. The format of the vibrate option should be an array of numbers that describe the number of milliseconds the device should vibrate followed by the number of milliseconds the device should not vibrate.
    //        "sound": "<URL String>",//WARNING: At the time of writing no browser has support for this option.
    //        "dir": "<String of 'auto' | 'ltr' | 'rtl'>",//The parameter should be set to either auto, ltr or rtl.

    //        "//": "Behavioural Options",
    //        "tag": "<String>",//The tag option is essentially a string ID that "groups" notifications together. This will cause last notification to be closed, and replaced by a new notification of the same tag. also when it replace notification, it won't make any sound or vibration.
    //        "data": "<Anything>",
    //        "requireInteraction": "<boolean>",// Chrom on desktop will show notifications for a set time period before hiding them, chrom on android doesn't have this behaviour; notifications are displayed until the user intracts with them. to force a notification to stay visible until the user intracts with it add the 'requireInteraction' option.
    //        "renotify": "<Boolean>",// without 'tag', will generate error. You might want a replacing notification to notify the user rather than silently update, for example in a chat application, in this case you should set tag, and renotify to true.
    //        "silent": "<Boolean>",// Allows to show a new notification but prevents the default behavior of vibration, sound and turning the device's display.

    //        "//": "Both Visual & Behavioural Options",
    //        The best size I could get to work on desktop Chrome was 24px x 24px. This sadly looks out of place on Android.
    //        The best practice we can draw from these differences:
    //        -Stick to a consistent color scheme for your icons so at least all your icons are consistently displayed to the user.
    //        -Make sure they work in monochrome as some platforms may display them that way.
    //        -Test the size and see what works for you. 128px x 128px works well on Android for me but was poor quality on desktop.
    //        -Expect your action icons not to be displayed at all.
    //        The Notification spec is exploring a way to define multiple sizes of icons, but it looks like it'll be some time before anything is agreed upon.
    //        "actions": "<Array of Strings>",{<action:'<action-name>', {title:'action-title'},{icon:'action-icon'}>}

    //        "//": "Information Option. No visual affect.",
    //        "timestamp": "<Long>"//Timestamp allows you to tell the platform the time when an event occurred that resulted in the push notification being sent.
    //}




    //Feature Support Detection on a Browser:
    //if ('actions' in Notification.prototype) {
    //    // Action buttons are supported.
    //} else {
    //    // Action buttons are NOT supported.
    //}


    //One of the things to understand about service workers is that you have little control over when the service worker code is going to run. The browser decides when to wake it up and when to terminate it. The only way you can tell the browser, "Hey I'm super busy doing important stuff", is to pass a promise into the event.waitUntil() method. With this, the browser will keep the service worker running until the promise you passed in has settled.
    event.waitUntil(promiseChain);
});


/* //More Complicated Sample for event.waitUntil

self.addEventListener('push', function (event) {
    const analyticsPromise = pushReceivedTracking();
    const pushInfoPromise = fetch('/api/get-more-data')
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            const title = response.data.userName + ' says...';
            const message = response.data.message;

            return self.registration.showNotification(title, {
                body: message
            });
        });

    const promiseChain = Promise.all([
        analyticsPromise,
        pushInfoPromise
    ]);

    event.waitUntil(promiseChain);
});
*/


/**
 * clients.openWindow(examplePage) //One of the most common responses to a notification is to open a window / tab to a specific URL.
 */
self.addEventListener('notificationclick', function (event) {
    var notificationData = event.notification.data;
    console.log('');
    console.log('The data notification had the following parameters:');
    Object.keys(notificationData).forEach((key) => {
        console.log(` ${key}: ${notificationData[key]}`);
    });
    console.log('');

    if (!event.action) {
        var examplePage = notificationData.url;
        var promiseChain = clients.openWindow(examplePage);
        event.waitUntil(promiseChain);

        // Was a normal notification click
        console.log('Notification Click.');
        var clickedNotification = event.notification;
        clickedNotification.close();
        return;


        ////KEEP Script Waiting...
        //// Do something as the result of the notification click
        //const promiseChain = doSomething();
        //event.waitUntil(promiseChain);
    }

    switch (event.action) {
        case 'coffee-action':
            console.log('User x\'s coffee.');
            break;
        case 'doughnut-action':
            console.log('User x\'s doughnuts.');
            break;
        case 'gramaphone-action':
            console.log('User x\'s music.');
            break;
        case 'atom-action':
            console.log('User x\'s science.');
            break;
        default:
            console.log("Unknown action clicked: '${event.action}'");
    }
});

self.addEventListener('notificationclose', function (event) {//on clicking cross, or swipes the notification away. Mostly used for analytic usages to find out user engagement with notifications
    var dismissedNotification = event.notification;

    //const promiseChain = notificationCloseAnalytics();
    //event.waitUntil(promiseChain);
});





//OPEN NEW OR FOCUS AN EXISTING TAB
//const urlToOpen = new URL(examplePage, self.location.origin).href;
//const promiseChain = clients.matchAll({ //Remember these are tabs for your origin only.
//        type: 'window',//just look for tabs and windows and exclude web workers
//        includeUncontrolled: true //includeUncontrolled allows us to search for all tabs from your origin that are not controlled by the current service worker. Generally, you'll always want includeUncontrolled to be true when calling matchAll()
//    })
//    .then((windowClients) => {
//        let matchingClient = null;
//        for (let i = 0; i < windowClients.length; i++) {
//            const windowClient = windowClients[i];
//            if (windowClient.url === urlToOpen) {
//                matchingClient = windowClient;
//                break;
//            }
//        }
//        if (matchingClient) {
//            return matchingClient.focus();
//        } else {
//            return clients.openWindow(urlToOpen);
//        }
//    });
//event.waitUntil(promiseChain);



//Merging notifications:
//You can do this, or manipulate current notifications in other ways, using the `registration.getNotifications()` API which gives you access to all the currently visible notifications for your web app.
//https://developers.google.com/web/fundamentals/push-notifications/common-notification-patterns






//The exception to the rule:

//I've been stating that you must show a notification when you receive a push and this is true most of the time. The one scenario where you don't have to show a notification is when the user has your site open and focused.
//    Inside your push event you can check whether you need to show a notification or not by examining the window clients and looking for a focused window.
//    The code to getting all the windows and looking for a focused window looks like this:

//function isClientFocused() {
//    return clients.matchAll({
//            type: 'window',
//            includeUncontrolled: true
//        })
//        .then((windowClients) => {
//            let clientIsFocused = false;
//            for (let i = 0; i < windowClients.length; i++) {
//                const windowClient = windowClients[i];
//                if (windowClient.focused) {
//                    clientIsFocused = true;
//                    break;
//                }
//            }
//            return clientIsFocused;
//        });
//}

//We use clients.matchAll() to get all of our window clients and then we loop over them checking the focused parameter.
//    Inside our push event we'd use this function to decide if we need to show a notification:
//const promiseChain = isClientFocused()
//    .then((clientIsFocused) => {
//        if (clientIsFocused) {
//            console.log('Don\'t need to show a notification.');
//            return;
//          OR:
//          windowClients.forEach((windowClient) => {
//            windowClient.postMessage({
//                message: 'Received a push message.',
//                time: new Date().toString()
//            });
//          });
//          //In each of the pages, we listen for messages by adding a message event listener:
//          //navigator.serviceWorker.addEventListener('message', function(event) {
//          //    console.log('Received a message from service worker: ', event.data);
//          //});
//        }
//        // Client isn't focused, we need to show a notification.
//        return self.registration.showNotification('Had to show a notification.');
//    });
//event.waitUntil(promiseChain);



//Cache a page and open a window
//One scenario that is out of the scope of this book but worth discussing is that you can improve the overall UX of your web app by caching web pages you expect users to visit after clicking on your notification.
//    This requires having your service worker set-up to handle fetch events, but if you implement a fetch event listener, make sure you take advantage of it in your push event by caching the page and assets you'll need before showing your notification.
//For more information check out this introduction to service workers post. https://developers.google.com/web/fundamentals/getting-started/primers/service-workers


importScripts('localforage.min.js');
// const broadcast = new BroadcastChannel('viomedi-channel');
localforage.config({
    name: 'viomedi',
    storeName: 'viomedi'
});
self.addEventListener('install', function (event) {
    // console.log('gg');
    // The promise that skipWaiting() returns can be safely ignored.
    self.skipWaiting();
});

const notificationclickListener = function (event) {
    const data = event.notification.data;
    // console.log("worker", data, event);
    // let actionsContainOpen = false;
    // if (event.notification && event.notification.actions) {
    //     for (let index = 0; index < event.notification.actions.length; index++) {
    //         if (event.notification.actions[index].action && event.notification.actions[index].action == "open") {
    //             actionsContainOpen = true;
    //         }
    //     }
    // }
    if (event.action === 'open' || (event.action === '' && data.isAllowedToOpen) || (!event.action && data.isAllowedToOpen)) {
        console.log("open", data);
        clients.openWindow("/vss/" + data.rtcroom + '?remote_opened=true');
    } else if (event.action === 'config') {
        console.log("config");
        clients.openWindow("/settings");
    } else if (event.action === 'dashboard' || (event.action === '') || (!event.action)) {
        console.log("dashboard");
        clients.openWindow("/dashboard");
    }
    event.notification.close();
};
self.removeEventListener('notificationclick', notificationclickListener);
self.addEventListener('notificationclick', notificationclickListener);

const pushListener = async e => {
    const activeUser = await getActiveUser();
    const data = e.data.json();
    // console.log("worker", e, activeUser, data);


    switch (data.type) {
        case 'room_active':
            if (activeUser == data.doctor || activeUser == 'all') {

                if (typeof Notification != 'undefined' && Notification.permission === 'granted') {
                    data.isAllowedToOpen = (activeUser == data.doctor);
                    const notification = {
                        body: data.body,
                        icon: 'assets/images/icon/512/viomedi.png',
                        data: data,

                    }
                    if (activeUser == data.doctor) {
                        notification.actions = [
                            { action: "open", title: "Öffnen" }
                        ];
                    } else {
                        notification.actions = [
                            { action: "dashboard", title: "Übersicht anzeigen" }
                        ];
                    }
                    // console.log("showNotification", data.title, notification);
                    self.registration.showNotification(data.title, notification);
                } 
                self.clients.matchAll().then(function (clients) {
                    if (clients && clients.length && clients.length > 0) {
                        clients.forEach(client => {
                            client.postMessage({ type: 'SHOW_INTERNAL_NOTIFICATION', notification: data });
                        });
                        clients[0].postMessage({ type: 'PLAY_NOTIFICATION_SOUND', notification: data });

                    }
                });
            }
            break;
        case 'autoopen':
            self.clients.matchAll().then(function (clients) {
                if (clients && clients.length && clients.length > 0) {
                    //Respond to last focused tab
                    //   clients[0].postMessage({type: 'MSG_ID'});
                    clients[0].postMessage({ type: 'OPEN_TAB', room_token: data.rtcroom });
                } else {
                    self.registration.showNotification(data.title, {
                        body: data.body,
                        icon: 'assets/images/icon/512/viomedi.png',
                        actions: [
                            { action: "config", title: "Einstellungen" },
                            { action: "open", title: "Öffnen" }
                        ],
                        data: data
                    });
                }
            });


            break;
    }
};

function debounce(func, timeout = 1000) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}
const debounceNotification = debounce((notification) => {
    const dataForPushListener = {
        data: {
            json: function () {
                return notification;
            }
        }
    }
    pushListener(dataForPushListener);
});

// console.log('gg');
const notificationListener = function (d) {
    if (d.data) {
        if (d.data.notification) {
            const notification = JSON.parse(d.data.notification);
            // console.log('gotit', notification);
            debounceNotification(notification);
            // console.log('postMessage received', notification);
        }
    }
};
self.removeEventListener('message', notificationListener);
self.addEventListener('message', notificationListener);



self.removeEventListener('push', pushListener);
self.addEventListener('push', pushListener);


async function getActiveUser() {

    const token = await localforage.getItem('user.active_user');
    if (token) {
        return token;
    } else {
        return null;
    }
}
// self.addEventListener('fetch', function () {
//     // console.log('gg');
//     return;
// });


// this.ngf.setItem('user.active_user', userId);



// if (vss && vss.clientCount && vss.clientCount === 1 &&
//     (!this.notifiedVss[vss._id]
//         || (this.notifiedVss[vss._id] && Date.now() - this.notifiedVss[vss._id] > 1000 * 60))) {


//     this.notifiedVss[vss._id] = Date.now();
//     this.toastr.info('Ein Teilnehmer ist der Videosprechstunde von ' +
//         (this.getDoctorById(vss.doctor) ?
//             (this.getDoctorById(vss.doctor).first_name + ' ' + this.getDoctorById(vss.doctor).last_name) :
//             'Arzt nicht verfügbar') +
//         ' beigetreten.' + (this.activeUserId !== 'all' ? ' Wollen Sie diese Videosprechstunde jetzt öffnen? ' +
//             'Klicken Sie hierzu einfach auf diese Nachricht' : ''),
//         'Teilnehmer verbunden',
//         {
//             timeOut: 1000 * 60 * 10,
//             extendedTimeOut: 1000 * 30,
//             closeButton: true
//         })
//         .onTap
//         .pipe(take(1))
//         .subscribe(() => {
//             if (this.activeUserId !== 'all') {
//                 window.open('/videosprechstunde/' + vss.room_token, '_blank');
//             }
//         });

//     this.browserNotification(vss);

//     if (this.user.notificationSound == undefined || this.user.notificationSound) {
//         this.notificationSound();
//     }

// }
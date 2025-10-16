var idbKeyval=function(e){"use strict";class t{constructor(e="keyval-store",t="keyval"){this.storeName=t,this._dbp=new Promise((r,n)=>{const o=indexedDB.open(e,1);o.onerror=(()=>n(o.error)),o.onsuccess=(()=>r(o.result)),o.onupgradeneeded=(()=>{o.result.createObjectStore(t)})})}_withIDBStore(e,t){return this._dbp.then(r=>new Promise((n,o)=>{const s=r.transaction(this.storeName,e);s.oncomplete=(()=>n()),s.onabort=s.onerror=(()=>o(s.error)),t(s.objectStore(this.storeName))}))}}let r;function n(){return r||(r=new t),r}return e.Store=t,e.get=function(e,t=n()){let r;return t._withIDBStore("readonly",t=>{r=t.get(e)}).then(()=>r.result)},e.set=function(e,t,r=n()){return r._withIDBStore("readwrite",r=>{r.put(t,e)})},e.del=function(e,t=n()){return t._withIDBStore("readwrite",t=>{t.delete(e)})},e.clear=function(e=n()){return e._withIDBStore("readwrite",e=>{e.clear()})},e.keys=function(e=n()){const t=[];return e._withIDBStore("readonly",e=>{(e.openKeyCursor||e.openCursor).call(e).onsuccess=function(){this.result&&(t.push(this.result.key),this.result.continue())}}).then(()=>t)},e}({});

var dataCacheName = 'besposrednika-data-1';
var cacheName = 'besposrednika-static-1';
var filesToCache = [
    //'/images/icons.png'
];

self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

var pushTimeout = null;
var veryNewPushes = [];

self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );

    return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
    //console.log('[Service Worker] Fetch', e.request.url);
});


self.addEventListener('push', function(event) {

    let notificationData = {};

    try 
    {
        notificationData = event.data.json();
        console.log('This push event has data: ', event.data.text());
    } 
    catch (e) 
    {
        console.log('This push event has no data.');
        return;
    }

    idbKeyval.set('newNotificationsCnt', parseInt(notificationData.unread_notifications));

    event.waitUntil(
        self.registration.getNotifications()
        .then(notifications => {
            let currentNotification;
            
            // На десктопе notifications будет пустой, если пердыдущие нотификации есть только в трее.
            // На мобильном будет полный список нотификаций в панели уведолмений.
            // Мы будем поддеживать 1 нотификацию и обновлять её при необходимости
            
            for (let i = 0; i < notifications.length; i++) 
            {
                //if (notifications[i].data && notifications[i].data.userName === userName) 
                {
                    currentNotification = notifications[i];
                }
            }

            return currentNotification;
        })
        .then((currentNotification) => {

            let notificationTitle = notificationData.title;

            const promiseChain = isClientFocused()
            .then((clientIsFocused) => {

                if (clientIsFocused) 
                {
                    console.log('Show a notification in window.');
                    
                    clientIsFocused.postMessage({
                        message: {
                            type:'notification',
                            data:{
                                title:notificationData.title, 
                                body:notificationData.body,
                                icon:notificationData.icon,
                                url:notificationData.url,
                                unread_notifications:notificationData.unread_notifications
                            }
                        },
                        time: new Date().toString()
                    });
                }
                else
                {
                    // Нужно показать системное уведомление И сохранить в IndexedDB информацию о нотификации.
                    // При получении фокуса браузером эту информацию можно использовать для обновления счётчика непросмотренных объявлений
                    //
                    // 1) Системное уведомление стоит показывать не слишком часто. Т.е. если в течение 5 секунд пришло несколько уведомлений,
                    // то лучше их показать вместе
                    // 2) Если есть уже показанное, но не просмотренное системное уведомление, то не нужно показывать новое, нужно обновить старое.
                    
                    if (currentNotification) // Не первая нотификация 
                    {
                        veryNewPushes.push({data:notificationData});
                    }
                    else
                    {
                        veryNewPushes.push({data:notificationData});
                    }
                    
                    if (pushTimeout)
                        clearTimeout(pushTimeout);

                    return new Promise(resolve => { // Bounce messages
                        pushTimeout = setTimeout(function() {
                            let lastPush = veryNewPushes.slice(-1).pop();
                            let notificationTitle = lastPush.data.title;
                            
                            let options = {
                                icon: lastPush.data.icon,
                                body: lastPush.data.body,
                                data: {
                                    newMessageCount: 1,
                                    url:lastPush.data.url
                                }
                            }
                                                    
                            // Есть открытое уведомление
                            if (currentNotification || veryNewPushes.length > 1) 
                            {
                                const messageCount = (currentNotification ? currentNotification.data.newMessageCount : 0) + veryNewPushes.length;

                                let chego = true_wordform(messageCount, 'новое объявление', 'новых объявления', 'новых объявлений');
                                options.body = `${messageCount} `+chego+' на сайте БесПосредника.ру';
                                
                                if (messageCount == 1)
                                {
                                    options.data = {
                                        newMessageCount: messageCount,
                                        url: notificationData.url
                                    };
                                }
                                else
                                {
                                    options.data = {
                                        newMessageCount: messageCount
                                    };
                                }
                                                                
                                notificationTitle = 'Новые объявления';

                                // закрываем старое открытое уведомление.
                                currentNotification && currentNotification.close();
                            }
                            
                            veryNewPushes = [];
                            
                            return self.registration.showNotification(
                                notificationTitle,
                                options
                            );
                        }, 5000);
                    });                        
                }
            });

            return promiseChain;
        })
    )
});

self.addEventListener('notificationclick', function(event) {

    event.notification.close();

    const notificationData = event.notification.data;

    let urlToOpen = new URL('/notifications?from=webpush', self.location.origin).href;

    if (notificationData.url)
    {
        urlToOpen = new URL(notificationData.url, self.location.origin).href;
    }

    event.waitUntil(

        self.clients.matchAll({type: 'window', includeUncontrolled: true}).then(function(windowClients) {
            let matchingClient = null;

            for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                if (windowClient.url === urlToOpen) {
                    matchingClient = windowClient;
                    break;
                }
            }

            if (matchingClient) {
                return matchingClient.focus().then(function(client) { 
                    //client.navigate(urlToOpen); // Не работает почему-то?
                    client.postMessage({
                        message: {
                            type:'reload',
                        },
                        time: new Date().toString()
                    });                    
                });
            } else {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

self.addEventListener('notificationclose', function(event) {
    /*const dismissedNotification = event.notification;
    const promiseChain = notificationCloseAnalytics();
    event.waitUntil(promiseChain);*/
});

        
function isClientFocused() {
    return clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    })
    .then((windowClients) => {
        let clientIsFocused = false;

        for (let i = 0; i < windowClients.length; i++) {
            const windowClient = windowClients[i];
            if (windowClient.focused) {
                clientIsFocused = windowClient;
                break;
            }
        }

        return clientIsFocused;
    });
}

function true_wordform(num, form_for_1, form_for_2, form_for_5){
    num = Math.abs(num) % 100; // берем число по модулю и сбрасываем сотни (делим на 100, а остаток присваиваем переменной $num)
    num_x = num % 10; // сбрасываем десятки и записываем в новую переменную
    if (num > 10 && num < 20) // если число принадлежит отрезку [11;19]
        return form_for_5;
    if (num_x > 1 && num_x < 5) // иначе если число оканчивается на 2,3,4
        return form_for_2;
    if (num_x == 1) // иначе если оканчивается на 1
        return form_for_1;
    return form_for_5;
} 

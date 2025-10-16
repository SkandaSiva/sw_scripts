
function sWorker(){
    var that = this;
    
    this.initialize = function(){
        self.addEventListener('install', function(event) {
            return event.waitUntil(self.skipWaiting());
        });
        self.addEventListener('activate', function(event) {
            return event.waitUntil(self.clients.claim());
        });
        self.addEventListener('push',                   that.pushHandler);
        self.addEventListener('notificationclick',      that.notificationClickHandler);
        self.addEventListener('notificationclose',      that.notificationCloseHandler);
        self.addEventListener('pushsubscriptionchange', that.subscriptionChange);
    };
    this.broadcastReply = function(command, payload){
        self.clients.matchAll().then(clients => {
            for (let i = 0; i < clients.length; i++) {
                const client = clients[i];
                client.postMessage({
                    command,
                    payload
                });
            }
        });
    };
    this.pushHandler = function(event){
        if(!(self.Notification && self.Notification.permission === 'granted')) {
            return;
        }
        if(event.data) {
            event.waitUntil(that.displayNotification(event.data.text()));
        }
    };
    this.displayNotification = function(body){
        var nData = {};
        try{
            nData = JSON.parse(body);
        } catch(err){}
        if(typeof nData.title == "undefined"){
            return;
        }
        return self.registration.showNotification(nData.title, nData);
    };
    this.notificationClickHandler = function(event){
        if(!event || !event.notification){
            return;
        }
        event.notification.close();
        const notification = event.notification;
        const notifiData   = notification.data || {};
        let url = notifiData.url || "";
        let windowClient = false;
        if(event.action){
            url = "";
            if(notifiData.actions && notifiData.actions[event.action]){
                url = notifiData.actions[event.action].url || "";
            }
        }
        if(!that.isValidUrl(url)){
            return;
        }
        clients.matchAll().then(wClients => {
            for(let i = 0; i < wClients.length; i++){
                var wClient = wClients[i];
                if (wClient.url === url && 'focus' in wClient) {
                    windowClient = wClient;
                }
            }
        });
        var clickHandler = new Promise(function(resolve, reject){
            setTimeout(resolve, 10);
        }).then(function(){
            if(windowClient === false){
               clients.openWindow(url);
            }
            else {
                windowClient.focus();
            }
        });
        event.waitUntil(clickHandler);
    };
    this.notificationCloseHandler = function(event){};
    this.subscriptionChange = function(event){
        console.log("subscriptionChange", event);
    };
    
    this.feedJourneyAPI = function(endpoint, data) {
        if(typeof data == "undefined"){
            data = {};
        }
        fetch(endpoint, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(data)
        });
    };
    this.isValidUrl = function(url) {
        var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return regexp.test(url);
    };
    
    return (function() {
        that.initialize();
    }(this));
};

var sWorkerInstance = new sWorker();

var requestTimer = null;
var tickTimer = null;

var ONE_SECOND = 1000;
var REQUEST_DELAY = 5 * ONE_SECOND;
var UPDATE_TICK = ONE_SECOND;
var tickCounterStart = REQUEST_DELAY / ONE_SECOND;

var tickCounter = this.tickCounterStart;

var isSaveCraftItemBlocked = false;

var messageHandler = function(event) {

  if(event && event.data && event.data.eventType == "ping") return;

  if(event.data.name == 'addSearchSessionEvent'){
    handleSearchSessionMessage(event);
    return;
  }

  if(event.data.name == "navigatorOnline" && self.navigator.onLine){
    syncBackgroundRequests();
    return;
  }

  if(event.data.name == "searchSessionEventFlushNow"){
    flushSearchSession();
    return;
  }

  if(event.data.name == 'saveCraftItemNow'){
    clearInterval(tickTimer);
    clearInterval(requestTimer);
    saveCraftItem(event.data.value);
    return;
  }

  if(event.data.name == 'uploadStart'){
    isSaveCraftItemBlocked = true;
    return;
  }

  if(event.data.name == 'uploadDone'){
    isSaveCraftItemBlocked = false;
    return;
  }

  if(isSaveCraftItemBlocked && event.data.name == 'saveCraftItem'){

    var tickMessage = {
      name: 'savingTick',
      value: tickCounter + 1,
      maxValue: this.tickCounterStart
    };

    postToSubscribers(tickMessage);

    return;
  }

  if(!!requestTimer){
    clearTimeout(requestTimer);
  }

  if(!!tickTimer){
    clearInterval(tickTimer);
    tickCounter = this.tickCounterStart;

    var tickMessage = {
      name: 'savingTick',
      value: tickCounter + 1,
      maxValue: this.tickCounterStart
    };

    postToSubscribers(tickMessage);
  }

  if(event.data && event.data.name == "saveCraftItem"){
    tickTimer = setInterval(function(){

      var tickMessage = {
        name: 'savingTick',
        value: tickCounter,
        maxValue: this.tickCounterStart
      };

      tickCounter--;

      postToSubscribers(tickMessage);
    }, UPDATE_TICK);

    requestTimer = setTimeout(function(){

      if(event.data.name == 'saveCraftItem'){
        saveCraftItem(event.data.value);
      }

      clearInterval(tickTimer);
      tickCounter = this.tickCounterStart;
    }, REQUEST_DELAY + ONE_SECOND);
  }
}

self.addEventListener('message', messageHandler);

self.addEventListener('install', function(event){
  self.skipWaiting();
});

function saveCraftItem(craftItem){

  var savingMessage = {
    name: "savingCraftItem",
    value: craftItem
  };

  postToSubscribers(savingMessage);

  var directionGroups = (craftItem.verticalDetail.directionGroups || {}).list || [];

  directionGroups = directionGroups.map(function(directionGroup){

    directionGroup.directions = (directionGroup.directions || []).map(function(direction){

      direction.mediaIds = (direction.medias || []).map(function(media){
        return media.id;
      });

      return direction;
    });

    return directionGroup;
  });

  var urlEncoded = '&id='+craftItem.id+
    '&rootId='+craftItem.rootId+
    '&title='+encodeURIComponent(craftItem.title)+
    '&subtitle='+encodeURIComponent(craftItem.subtitle)+
    '&description='+encodeURIComponent(craftItem.description)+
    '&vertical='+encodeURIComponent(craftItem.vertical)+
    '&languageTag='+encodeURIComponent(craftItem.languageTag)+
    '&aii='+craftItem.aii+
    '&verticalDetailJson='+encodeURIComponent(JSON.stringify(craftItem.verticalDetail));

  const timeSpecs = craftItem.timeSpecs
  if (!!timeSpecs) {
    urlEncoded += '&timeSpecsJson='+encodeURIComponent(JSON.stringify(timeSpecs))
  }

  const rating = craftItem.rating;
  if (!!rating) {
    urlEncoded += '&ratingJson='+encodeURIComponent(JSON.stringify(rating))
  }

  if(craftItem.timeToMake){
    urlEncoded += "&timeToMake="+craftItem.timeToMake
  }

  if(craftItem.yield){
    urlEncoded += "&yield="+craftItem.yield
  }

  if(!!craftItem.coverMedia){
    urlEncoded += '&coverMediaUploadId='+craftItem.coverMedia.id;
  }

  if(craftItem.videoConfig && Object.keys(craftItem.videoConfig).length > 0){
    urlEncoded += '&videoConfigJson='+encodeURIComponent(JSON.stringify(craftItem.videoConfig))
  }

  if (craftItem.modes != undefined && craftItem.modes) {
    urlEncoded += '&modes=' + craftItem.modes;
  }

  postCraftItem(urlEncoded);
}

function getDB(){
  return self.indexedDB.open('worker-db', 1);
}

let workerDb = getDB();

workerDb.onupgradeneeded = () => {
  let db = workerDb.result

  if(!db.objectStoreNames.contains('requests')){
    db.createObjectStore('requests', { autoIncrement: true })
  }

  db.close();
}

function saveRequestData(request) {

  let open = getDB();

  open.onsuccess = () => {
    let db = open.result

    let tx = db.transaction('requests', 'readwrite')

    let store = tx.objectStore('requests')

    store.put(request)

    tx.oncomplete = () => {
      db.close()
    }

    tx.onerror = () => {
      db.close()
    }
  }
}

function getAllRequestData(callback) {

  let open = getDB();

  open.onsuccess = () => {
    let db = open.result

    let tx = db.transaction('requests', 'readwrite')

    let store = tx.objectStore('requests')

    let request = store.getAll();

    request.onsuccess = event => {
      callback(request.result);
    }

    request.onerror = () => {
      callback([]);
    }

    tx.oncomplete = () => {
      db.close()
    }

    tx.onerror = () => {
      db.close()
    }
  }

  open.onerror = () => {
    callback();
  }
}

function clearRequestData() {

  let open = getDB();

  open.onsuccess = () => {
    let db = open.result

    let tx = db.transaction('requests', 'readwrite')

    let store = tx.objectStore('requests')

    let request = store.clear();

    request.onsuccess = event => {
      console.log("Store cleared");
    }

    tx.oncomplete = () => {
      db.close()
    }

    tx.onerror = () => {
      db.close()
    }
  }
}

function syncBackgroundRequests(){

  getAllRequestData((results) => {

    if(!results || results.length == 0) return;

    const chainer = results.reduce((promiseChain, currentTask) => {
        return promiseChain.then(chainResults => sendFetchCraftItem(currentTask).then(currentResult => [ ...chainResults, currentResult ]));
    }, Promise.resolve([]))

    chainer
      .then(() => {
        clearRequestData()

        postToSubscribers({
          name: 'saveCraftItemSync'
        });

      })
      .catch(console.log);
  });
}

self.addEventListener('sync', function(event) {

  if (event.tag == 'serviceWorkerSync') {
    syncBackgroundRequests();
  }

});

var saveTasks = [];

function postCraftItem(urlencodedBody){

  var request = {
    method: "POST",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    credentials: 'include',
    body: urlencodedBody
  };

  if(!self.navigator.onLine){
    saveRequestData(request);
    return;
  }

  sendFetchCraftItem(request);
}

function sendFetchCraftItem(request){

  return fetch("/api/secure/item/save.json", request)
    .then(function(response){
      return response.json();
    })
    .then(function(response){

      var message = {
        name: 'saveCraftItem',
        value: response
      };

      postToSubscribers(message);
    })
    .catch(function(error){

      var message = {
        name: 'errorMessage'
      };

      postToSubscribers(message);

      console.log(error);
    });
}

function postToSubscribers(message){

  self.clients.claim();

  self.clients.matchAll()
    .then(function(clients){
      clients.forEach(function(client){
        client.postMessage(message);
      });
    });
}

var searchSession = {}; // userId per searchsession obj
var flushSessionTimer = null;
var FLUSH_SESSION_INTERVAL = 30 * ONE_SECOND;
var runningFlushSessionCounter = 0;

function handleSearchSessionMessage(ev) {
  if (!ev || !ev.data || !ev.data.value.event) {
    return;
  }

  if(flushSessionTimer){
    clearTimeout(flushSessionTimer);
    flushSessionTimer = setTimeout(flushSearchSession, FLUSH_SESSION_INTERVAL);
  } else {
    flushSessionTimer = setTimeout(flushSearchSession, FLUSH_SESSION_INTERVAL);
  }

  var data = ev.data.value;

  var verticalId = data.verticalId;
  if (!verticalId) {
    return;
  }

  var event = data.event;
  var params = data.params;
  var userId = data.uid;
  var timestamp = data.timestamp || new Date().getTime();
  var sessionId = data.sessionId || new Date().getTime();

  if (!searchSession[userId]) {
    searchSession[userId] = {};
  }

  if (!searchSession[userId][verticalId]) {
    searchSession[userId][verticalId] = {
      id: sessionId,
      created: timestamp,
      events: []
    }
  }

  searchSession[userId][verticalId].lastUpdated = timestamp;

  if (!!event && !!userId) {

    var obj = {
      name: event,
      created: timestamp
    };

    if (!!params) {
      obj.params = params
    }

    searchSession[userId][verticalId].events.push(obj);
  }
}

function flushSearchSession() {
  if (runningFlushSessionCounter > 0) {
    return;
  }

  if (!!searchSession && Object.keys(searchSession).length > 0) {

    var sessionRef = clone(searchSession);
    runningFlushSessionCounter = Object.keys(sessionRef).length;

    var clientTime = new Date().getTime();

    for (var userId in sessionRef) {

      var verticalList = sessionRef[userId]

      for (var verticalId in verticalList) {
        searchSession[userId][verticalId].events = [];
        var sessionData = sessionRef[userId][verticalId];

        if (sessionData.events.length > 0) {
          var request = {
            method: "POST",
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'X-Vertical': verticalId
            },
            credentials: 'include',
            body: getUrlEncodedParams({
              userId: userId,
              clientTime: clientTime,
              vertical: verticalId,
              searchSession: JSON.stringify(sessionData)
            })
          };

          fetch("/api/search/session/track.json", request)
            .then(function(response){
              return response.json();
            })
            .then(function(response) {
              if (response.success) {
                // WOW! SUCH A SUCCESS CALL!
              } else {
                // TODO: if fail add the sessionRef content back to searchSession
              }
              runningFlushSessionCounter--;
            })
            .catch(function(error) {
              // TODO: if fail add the sessionRef content back to searchSession

              runningFlushSessionCounter--;
            });
        } else {
          runningFlushSessionCounter--;
        }
      }
    }
  }
}

function getUrlEncodedParams(data) {
  var params = "";
  for (var key in data) {
    params += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
  }
  return params;
}

function clone(obj) {
  var copy;

  if (null == obj || "object" != typeof obj) return obj;

  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }

  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
  }

  return {};
}

function getVerticalLogoUrl(verticalName) {
  return `https://craftlog.com/static/img/${verticalName}-web-logo.png`
}

// PUSH data example {"title":"Notification","body":"Testing","badge":"/static/img/craftlog-logo.png","icon":"/static/img/craftlog-logo.png","url":"https://craftlog.com/us/cooking", "image" : "/static/img/craftlog-logo.png"}

self.addEventListener('push', function(event) {

  if(!event || !event.data || !event.data.json()) return;

  const data = event.data.json();

  const title = data.title;
  const messageFrom = data.from || {};

  const image = messageFrom.avatarUrl ? `${messageFrom.avatarUrl}=s240=r4` : getVerticalLogoUrl(data.vertical);

  const options = {
    body: data.body,
    icon: image,
    badge: data.badge,
    image: image,
    requireInteraction: true,
    data: {
      url : `${data.url}?utm_source=notification&utm_medium=web-push`
    }
  };

  const notificationPromise = self.registration.showNotification(title, options);
  event.waitUntil(notificationPromise);
});

self.addEventListener('notificationclick', function(event) {

  if(!event.notification || !event.notification.data || !event.notification.data.url) return;

  event.notification.close();

  event.waitUntil(clients.openWindow(event.notification.data.url));
});

/*

	Service worker script

	Copyright (C) 2023 by TechNetwork, Hungary. All rights reserved.
	
*/
console.log('Service worker initializing...');class SiteServiceWorker{constructor(){this.hookEvents();console.log('Service worker initizalied.');}
debug(message){console.log('SERVICE: '+message);}
error(message){console.log('SERVICE: [ERRROR] '+message);}
onMessage(event){var data=JSON.parse(event.data);this.debug('Received a message:'+data);}
onActivate(event){this.debug('Activated.');}
onInstall(event){this.debug('Installed.');}
onPush(event){this.debug('Received a push message.');try{const data=event.data.json();const title=data.title;const message=data.text;const clickurl=(data.clickurl?data.clickurl:null);var actions=(data.actions?data.actions:null);try{const openlabel=(data.openlabel?data.openlabel:'OK');const settingsurl=(data.settingsurl?data.settingsurl:null);if(settingsurl){if(!actions){actions=[];if(clickurl)
actions.push({action:'click',title:openlabel});}
actions.push({action:'settings',title:'\u2699'});}}
catch(e){this.debug('Exception while processing notification message: '+e);}
self.registration.showNotification(title,{body:message,actions:actions,data:data});}
catch(e){this.error('Major exception while processing notification message: '+e);self.registration.showNotification('HIBA',{body:'A service worker frissítése szükséges az elhárításához. Kattints ide ennek a végrehajtásához!'});}}
onNotificationClick(event){this.debug('Notification clicked.');if(event.notification&&event.notification.data&&event.notification.data.text&&event.notification.data.text){var data=event.notification.data;var url=data.clickurl;if((event.action=='settings')&&(data.settingsurl))
url=data.settingsurl;else
if(data.actions)
data.actions.forEach(function(r){if(r.action==event.action)
url=r.url;});if(url){this.debug('Navigating to: '+url);clients.openWindow(url);}}
else{this.debug('Malformed notification click event encountered');var url=serviceWorker.scriptURL.match(/^[a-z]+:\/\/[^\/]+\//i);url+='?servicerworkerrefresh';clients.openWindow(url);}}
hookEvents(){['Activate','Install','Message','Push','NotificationClick'].forEach(eventName=>{self.addEventListener(eventName.toLowerCase(),this['on'+eventName].bind(this));});}}
(new SiteServiceWorker()); /* MINIFIED */
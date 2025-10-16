'use strict';var pushData;var afterCallback;var callbackUrl='https://notification.topmediai.com/subscription/callback';function logConsoleError(message){var consoleType=typeof console;if(consoleType!=='undefined'&&console&&console.error){console.error(message)}}
function parseJSON(text){var data={};if('string'===typeof text){try{data=JSON.parse(text);if('object'!==typeof data){data={}}}catch(e){logConsoleError(e)}}else if('object'===typeof text){data=text}
return data}
function createRequestUrl(callback,event){if(pushData&&pushData.id){var request=callbackUrl+'?id='+pushData.id;if(event){request+='&event='+event}
if('function'!==typeof fetch||'function'!==typeof Request){return!1}
try{var buildRequest=new Request(request,{mode:'no-cors',headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',}});fetch(buildRequest)}catch(e){console.error(e)}}
if('function'===typeof callback){callback()}}
function pushEventCallback(event){var data=parseJSON(event.data.text());if(!data||!data.id||!data.title||!data.body){return}
pushData=data;afterCallback=null;createRequestUrl(null,'show');var title=data.title,options={body:data.body};if(data.icon){options.icon=data.icon}
if(data.badge){options.badge=data.badge}
if(data.requireInteraction){options.requireInteraction=data.requireInteraction}
if(data.image){options.image=data.image}
if(data.actions){options.actions=data.actions}
if(data.data){options.data=data.data}
if(data.dir){options.dir=data.dir}
if(data.tag){options.tag=data.tag}
var notificationPromise=self.registration.showNotification(title,options);event.waitUntil(notificationPromise)}
function clickEventCallback(event){event.notification.close();var jumpUrl=event.notification.data.link;switch(event.action){case 'coffee':jumpUrl=event.notification.data.coffee;break;case 'doughnut':jumpUrl=event.notification.data.doughnut;break;case 'gramophone':jumpUrl=event.notification.data.gramophone;break;case 'atom':jumpUrl=event.notification.data.atom;break;default:break}
if(jumpUrl&&/^https?:\/\//.test(jumpUrl)){afterCallback=function(){clients.openWindow(jumpUrl)}}
event.waitUntil(createRequestUrl(afterCallback,'click'))}
function closeEventCallback(){createRequestUrl(null,'close')}
self.addEventListener('push',pushEventCallback);self.addEventListener('notificationclick',clickEventCallback);self.addEventListener('notificationclose',closeEventCallback)
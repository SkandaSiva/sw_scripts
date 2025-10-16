wpn_public_key='BAMmLs6TprVyLlOnH6wdUefpioOCtMSlCmSYbDMeRoyp65h-6G53XElOg0I3pFu3k4Axm9fByrc7gRuwTh1W_5E';function urlB64ToUint8Array(base64String)
{padding='='.repeat((4-base64String.length%4)%4);base64=(base64String+padding).replace(/\-/g,'+').replace(/_/g,'/');rawData=atob(base64);outputArray=new Uint8Array(rawData.length);for(iua=0;iua<rawData.length;++iua)
{outputArray[iua]=rawData.charCodeAt(iua);}
return outputArray;}
self.importScripts('pouchdb.js');db=new PouchDB('wpn');function wpn_pouchdb_update(pdb_sub)
{db.get('wpn_data').then(function(doc){return db.put({_id:'wpn_data',_rev:doc._rev,sub:JSON.stringify(pdb_sub),});}).then(function(response){}).catch(function(err){db.put({_id:'wpn_data',sub:JSON.stringify(pdb_sub),})});}
dn_s=false;function wpn_cheack_changed(double)
{double=double||false;dn_s=Date.now();self.registration.pushManager.getSubscription().then(function(sub){if(sub!==null)
{db.get('wpn_data').then(function(doc){doc_sub=JSON.parse(doc.sub);if(!wpn_equal_sub(sub,doc_sub))
{wpn_changed_sub(doc_sub,sub);console.log('sw: Not equal, Time '+(Date.now()-dn_s)+'ms');}
else
{console.log('sw: Equal, Time '+(Date.now()-dn_s)+'ms');}}).catch(function(err){console.log('error: db.get');wpn_pouchdb_update(sub);});}
else if(!double)
{console.log('No subscription found',sub);if(typeof Notification!=='undefined'&&typeof Notification.permission!=='undefined'&&Notification.permission==='granted')
{console.log('Generate automatic subscription: '+Notification.permission);applicationServerKey=urlB64ToUint8Array(wpn_public_key);self.registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:applicationServerKey}).then(function(sub)
{wpn_cheack_changed(true);}).catch(function(err){});}}})}
function wpn_equal_sub(sub1,sub2)
{sub1=JSON.parse(JSON.stringify(sub1));sub2=JSON.parse(JSON.stringify(sub2));sub1_good=false;if(sub1!==null&&typeof sub1.keys!=='undefined'&&typeof sub1.keys.p256dh!=='undefined'&&typeof sub1.keys.auth!=='undefined')
sub1_good=true;sub2_good=false;if(sub2!==null&&typeof sub2.keys!=='undefined'&&typeof sub2.keys.p256dh!=='undefined'&&typeof sub2.keys.auth!=='undefined')
sub2_good=true;if((!sub1_good&&!sub2_good&&sub1===sub2)||(sub1_good&&sub2_good&&sub1.endpoint===sub2.endpoint&&sub1.keys.p256dh===sub2.keys.p256dh&&sub1.keys.auth===sub2.keys.auth))
return true;else
return false;}
function wpn_changed_sub(wpn_from,wpn_to)
{var data=new FormData();data.append('wpn_from',JSON.stringify(wpn_from));data.append('wpn_to',JSON.stringify(wpn_to));fetch('../../c_data.php?mode=wpn_changed_sub',{method:'POST',body:data,}).then(function(res){wpn_pouchdb_update(wpn_to);});}
self.addEventListener('pushsubscriptionchange',function(sub){console.log('pushsubscriptionchange');wpn_cheack_changed();});self.addEventListener('notificationclick',function(event){event.notification.close();json=JSON.parse(event.notification.data);if(typeof json.url!=='undefined')
{url=json.url;event.waitUntil(clients.openWindow(url));}});self.addEventListener('activate',function(event){event.waitUntil(wpn_cheack_changed());});self.addEventListener('push',function(event){json=JSON.parse(event.data.text());console.log(json);if(typeof json.check_expiration==='undefined')
{title=json.title;options=json.options;event.waitUntil(self.registration.showNotification(title,options));}});self.addEventListener('message',function(event){if(event.data=='wpn_cheack_changed')
{wpn_cheack_changed();}
else if(event.data=='get_data')
{self.registration.pushManager.getSubscription().then(function(sub){console.log(sub);});db.get('wpn_data').then(function(doc){doc_sub=JSON.parse(doc.sub);console.log(doc_sub);}).catch(function(err){});}
else if(typeof event.data.mode=='callback')
{event.data.callback();}});wpn_cheack_changed();setInterval(function(){console.log('PlayMax Service Worker: Interval '+Date.now());wpn_cheack_changed();},60*1000);
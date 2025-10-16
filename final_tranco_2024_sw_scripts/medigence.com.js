self.addEventListener('push',function(event)
{if(!(self.Notification&&self.Notification.permission==='granted'))
{return;}
const sendNotification=body=>{if(event.data)
{var payload=JSON.parse(event.data.text());var title=payload.title;var url=payload.url;}
else
{var title="MediGence Notification";var url='';}
return self.registration.showNotification(title,{body,icon:'assets/images/logos/logo-notif.png',vibrate:[200,100,200,100,200,100,200],silent:false,data:{url:url}});};if(event.data)
{const message=JSON.parse(event.data.text());event.waitUntil(sendNotification(message.message));}});self.addEventListener('notificationclick',function(event)
{event.notification.close();event.waitUntil(clients.openWindow(event.notification.data.url));});
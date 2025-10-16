var texto;var idpost;var nop;var db;var error;
self.addEventListener('install',(event)=>{console.log("SW Instalado");var anterior=1;});
self.addEventListener('fetch',(event)=>{event.respondWith(caches.match(event.request).then((response)=>{var str=event.request.url;
var n=str.indexOf("ajaxxxxxxxx.php");var n2=str.indexOf(".js");if(n<1){console.log('fee2222222',event.request.url);return response || fetch(event.request);}
else return new Response();}).catch((error)=>{console.log('se cayo???:'+event.request.url);var parsedUrl=new URL(event.request.url);var idga=parsedUrl.searchParams.get("ig");
if(idga>0){var och=db.transaction("ga","readwrite").objectStore("ga");var rch=och.get(parseInt(idga));rch.onsuccess = function(event){console.log('offline idga volver a 0'+idga);var data=rch.result;data.e=0;var upch=och.put(data);}}else return new Response();}));});



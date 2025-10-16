
 v1='v16';  SWVers="2.22";  offlineurl='/offline.html';  offlineiurl='/picture/0.gif';  swDC1=0;  swDC2=0;  swDC3=0;  swDC4=0;  swDC7=0;  swDC66=0;
 swBaseHREF="https://tetatet-club.ru";
 NeedCashe=0; var swusid=0;  let swINu='';  let SWUID="";  let swkcid=0; let NDNA=new Date(); let TNNA=NDNA.getTime(); let lasm=''; let SyncT=25000; let FiTim=1; 
const badgeicon=swBaseHREF+'/p/svg/heart-p.svg';const baseicob=swBaseHREF+'/in/tetatet-2.png';
 strFC=[
                '/noInt.png', '/picture/0.gif', '/in/f167b.gif', '/favicon.ico',
                '/tetatet-192.png', '/tetatet-32.png', '/tetatet-club.png', '/in/logo24-9.png', '/in/logo24-9i.png', '/in/logo24-9h.png',
                '/picture/i-female.png', '/picture/i-male.png', '/in/tetatet-2.png', '/p_let.png', '/p_znak.png', 
                '/start.html','/offline.html','/sound/ding.wav','/p/svg/heart-p.svg'
                ];
/*'/in/ladyt.png', '/in/bird3.gif',       
                '/fonts/fontawesome-webfont.woff2?v=4.7.0',
                '/css/fa9.css', 
                '/js20/j209z.js',
*/
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(v1)
            .then((cache) => cache.addAll(strFC))
            .then(() => self.skipWaiting())
            //.then(() => function(){ intTi=60000*60*7; setInterval(function(){GetInfo(1)},intTi)})
            //.then(() => console.log("sw install"))
    );
});

self.addEventListener('fetch', (event) => {
    //console.log("fetch="+event.request.url);
    var theurlt0=event.request.url.toLowerCase();
    var theurlt=theurlt0.replace("https://","").replace("tetatet-club.ru",""); 
      if (((theurlt0.indexOf("//tetatet-club.ru")<0 && theurlt0.indexOf("//localhost/teta2")<0) || event.request.method!="GET" 
          || (event.request.mode=="cors" && theurlt.indexOf("/fonts/")<0 && theurlt.indexOf("/css/")<0 && theurlt.indexOf(".jpg")<0 && theurlt.indexOf(".png")<0  
                    && theurlt.indexOf("/js20/")<0 && theurlt.indexOf("/ckeditor4/")<0) || event.request.url.startsWith('chrome-extension'))
            || theurlt.indexOf("garget")>=0 || theurlt.indexOf("/ggg/")>=0 || theurlt.indexOf("/noi/")>=0 || theurlt.indexOf("/pr/")>=0 || theurlt.indexOf("/daily/")>=0 || theurlt.indexOf("/a/")>=0
            || (String(strFC).indexOf(theurlt)<0 
            && !(theurlt.indexOf("/in/")>=0 || theurlt.indexOf("/p/")>=0 || theurlt.indexOf("/games/")>=0 || theurlt.indexOf("catm.png")>=0 || theurlt.indexOf("/p/blo")>=0 || theurlt.indexOf("/image")>=0 || theurlt.indexOf("/apple")>=0 || theurlt.indexOf("/sw.js")>=0 || theurlt.indexOf("/swLL.js")>=0 || theurlt.indexOf("/swapp")>=0 || theurlt.indexOf(".json")>=0 || theurlt.indexOf("/ckeditor4")>=0 || theurlt.indexOf(".css")>=0 || theurlt.indexOf("/js20/")>=0 || theurlt.indexOf("/fonts/")>=0 || theurlt.indexOf("/z/")>=0 || theurlt.indexOf("/z_m/")>=0)
            /*&& theurlt!="" && theurlt!="/" 
            && theurlt.indexOf(".asp")<0 
            && theurlt.indexOf(".htm")<0*/))
      {
          return;// fetch(event.request)
          //return fetch(event.request)
      }
      event.respondWith(
        caches.open(v1).then(
          function(cache) {
            return cache.match(event.request).then(
                function(response) {
                    if (response && event.request.url.indexOf("start.")<0 && theurlt!="" && theurlt!="/" && theurlt!="index" ) {
                      return response;
                    } else {
                      return fetch(event.request)
                          .then(function(response) {                      
                              if (response.ok) 
                              {
                                  var theurl=event.request.url; //&& response.type === 'basic' && response.headers.has('content-type')
                                  if ((theurl.indexOf("/in/")>=0 || theurl.indexOf("/p/")>=0 || theurl.indexOf("/games/")>=0 || theurl.indexOf("catm.png")>=0 || theurl.indexOf("/z/")>=0 || theurl.indexOf("/p/blo")>=0 || theurl.indexOf("/z_m/")>=0 || theurl.indexOf("/image")>=0 || theurl.indexOf("/apple")>=0 || (theurl.indexOf("/tetatet-")>=0 && theurl.indexOf(".png")>=0) || theurl.indexOf("/ckeditor4")>=0 || theurl.indexOf(".css")>=0 || theurl.indexOf("/js20/")>=0 || theurl.indexOf("/fonts/")>=0 || (theurlt!="" && theurlt!="/" && String(strFC).indexOf(theurlt)>=0)) 
                                      && (response.status==200)) 
                                  {NeedCashe=1;
				                    return caches.open(v1)
                                        .then(function(cache) {
					                        event.waitUntil(cache.put(event.request, response.clone()))
                                            return response
                                        })
                                        .catch(() => {return response
                                        })
                                  }
                              }
                            return response;
                          })
                          .catch((error) => {
                              var theurl=event.request.url.toLowerCase(); 
                              if (theurl.indexOf(".asp")>0 || theurl.indexOf(".htm")>0 || theurlt=="" || theurlt=="/")
                              {
                                  return caches.match(offlineurl)
                                  /*.then(() => setTimeout(...,10000))*/
                                  .catch(() => useFallback())
                              }
                              else{
                                  return caches.match(offlineiurl)
                                  .catch(() => useFallback())
                              }
                          });
                    }
                });
        })
      );
});

 FALLBACK = '<div style="text-align:center">\n' +
    '    <div><br /><img src="/tetatet-club.png" alt="tetatet-club.ru" style="width:270px;max-width:100%" /></div>\n' +
    '    <div><br /><img src="/noInt.png" alt="No Internet" style="width:250px;max-width:100%" /></div>\n' +
    '</div>';

function useFallback() {
    return Promise.resolve(new Response(FALLBACK, { headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-language': 'ru'
    }}));
}
function update(request) {
    return caches.open(v1).then((cache) =>
        fetch(request).then((response) =>
            cache.put(request, response.clone()).then(() => response)
        )
    );
}

function refresh(response) {
    return self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
             message = {
                type: 'refresh',
                url: response.url,
                eTag: response.headers.get('ETag')
            };
            client.postMessage(JSON.stringify(message));
        });
    });
}

function ClearCash()
{
caches.keys().then(function(keys) {
      return Promise.all(keys
        .filter(function(key) {
            return key.indexOf(v1) !== 0;
        })
        .map(function(key) {
            return caches.delete(key);
        })
      );
    })
    .then(() => self.clients.claim())
    //.then(() => console.log("ClearCashe"))
}

function ClearCashAll()
{
caches.keys().then(function(keys) {
      return Promise.all(keys
        .map(function(key) {
            return caches.delete(key);
        })
      );
    })
    .then(() => 
        caches
            .open(v1)
            .then((cache) => cache.addAll(strFC))
    )
    .then(() => self.clients.claim())
    //.then(() => self.update())
    //.then(() => console.log("ClearCasheAll"))
}

function SendToBase(mess)
{
    //console.log("SendToBase");
self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
            client.postMessage(mess);
        });
    });
    self.clients.claim()
}

self.addEventListener('activate', (event) => {
  //console.log("activate");
  event.waitUntil(ClearCash());
  event.waitUntil(self.clients.claim());
  SendToBase({'status':'activate','client':event.clientId,'swusid':swusid,'swINu':swINu, 'swkcid': swkcid, 'SWUID': SWUID, 'swDC1': swDC1, 'swDC2': swDC2, 'swDC3': swDC3, 'swDC4': swDC4, 'swDC7': swDC7, 'swDC66': swDC66})
  // intTi=600*60*7; setInterval(function(){GetInfo(1)},intTi)

    //GetInfo(1);
     intTi=60000*60*1; //GetInfo(1);
    // intTi=60000; 
    //try{setInterval(function(){GetInfo(1)},intTi)}catch(err){}
});

self.addEventListener('message', event => {
    //console.log("message");
if(event.data)
{
    if (Notification.permission === "granted") {
    //console.log('SWVers='+SWVers+'; event.clientId='+event.clientId+'; swDC1='+swDC1);
    try{eval(event.data)}catch(err){}
    if (event.data.SWVers && SWVers==event.data.SWVers && event.data.v1 && v1!=event.data.v1) {v1=event.data.v1; event.waitUntil(ClearCash())}
    if (event.data.SWVers && SWVers!=event.data.SWVers) {SWVers=event.data.SWVers; event.waitUntil(ClearCashAll())}
    if (event.data.swusid && swusid!=event.data.swusid) {swusid=event.data.swusid}
    if (event.data.swINu && swINu!=event.data.swINu) {swINu=event.data.swINu}
    if (event.data.SWUID && SWUID!=event.data.SWUID) {SWUID=event.data.SWUID}
    if (event.data.swkcid && swkcid!=event.data.swkcid) {swkcid=event.data.swkcid}
    else
    if(event.data.action==='cache-clean'){event.waitUntil(ClearCashAll())}
    if (swkcid>1 && (
            (event.data.swDC1 && swDC1!=event.data.swDC1)
            || (event.data.swDC2 && swDC2!=event.data.swDC2)
            || (event.data.swDC3 && swDC3!=event.data.swDC3)
            || (event.data.swDC4 && swDC4!=event.data.swDC4)
            || (event.data.swDC7 && swDC7!=event.data.swDC7)
            || (event.data.swDC66 && swDC66!=event.data.swDC66)
            || (event.data.dget && event.data.dget==1)
        )) {
        var swDC=swDC1+swDC2+swDC3+swDC4+swDC7+swDC66; var str=""; if (event.data.str) str=event.data.str;
        swDC1=event.data.swDC1; swDC2=event.data.swDC2; swDC3=event.data.swDC3; swDC4=event.data.swDC4; swDC7=event.data.swDC7; swDC66=event.data.swDC66; 
        
    //console.log('event.data.swDC1='+event.data.swDC1+'; event.clientId='+event.clientId+'; swDC1='+swDC1+"; str="+str);
        //SendToBase({'swusid':swusid,'swINu':swINu, 'swkcid': swkcid, 'SWUID': SWUID, 'swDC1': swDC1, 'swDC2': swDC2, 'swDC3': swDC3, 'swDC4': swDC4, 'swDC7': swDC7, 'swDC66': swDC66});
        //self.update();
        try{
            ///////////icon << number
            if (navigator.setAppBadge) {
                // The API is supported, use it.
                navigator.setAppBadge(swDC);
            } else {
                // The API is not supported, don't use it.
            }
        }catch(err){}
        if (swDC>0 && str!="set") 
        {
            if (str=="") GetInfo(0);
            else{
                    var ch=/\*/gi; str=str.replace(ch,"\r\n"); var tagn='tetatet-message';
                    var clurl=swBaseHREF+"/news.asp?info=1"; var cicon=baseicob;//swBaseHREF+"/tetatet-club.png";
                    if (event.data && event.data.geurl){
                         if (event.data.geurl==1) {clurl=swBaseHREF+"/pr/myaddr.asp"; cicon=swBaseHREF+"/p_let.png"; tagn='tetatet-newletter'}
                         else if (event.data.geurl==3) {clurl=swBaseHREF+"/pr/auv.asp"}
                         else if (event.data.geurl==2) {clurl=swBaseHREF+"/pr/znv.asp"; cicon=swBaseHREF+"/p_znak.png"; tagn='tetatet-newgift'}
                         else if (event.data.geurl==4) {clurl=swBaseHREF+"/pr/letters.asp?vstr="+event.data.vstr; cicon=swBaseHREF+"/p_let.png"; tagn='tetatet-newletter'+event.data.vstr}
                    }

                         showNotification = self.registration.showNotification("tetatet-club", {
                            body: str,
                            icon: cicon,
                            badge: badgeicon,
                            click_action: clurl,
                            subtitle: "",
                            vibrate: [200, 100, 200, 100, 200, 100, 200],
                            tag: tagn,
                            data: {
                                url: clurl, click_action: clurl
                            }
                        });
                    
                         event.waitUntil(showNotification);

            }
        }

    }

}}
});

; function GetInfo(regul)
{
    if (self.registration && Notification && Notification.permission === "granted") {
        if (!regul) regul=0; var clurl=swBaseHREF+"/news.asp"; var cicon=swBaseHREF+"/tetatet-club.png";
        //console.log("GetInfo.regul="+regul+";swkcid="+swkcid);
        try{
        if (swkcid>1)
        {
            var ND=new Date(); var TN=ND.getTime();
        
            let text="";
            var aurl=swBaseHREF+'/noi/ssdg.asp?swusid='+swusid+'&swINu='+swINu+'&swkcid='+swkcid+'&o='+TN;
            //console.log(aurl)
            fetch(aurl)
                .then(response => response.json())
                .then(text => {
                    //console.log("finish")
                    var intTiH=60000*60*13; if (swkcid==0) intTiH=60000*60*20;
                    //intTiH=6000;
                    var NDNAH=new Date(); var TNNAH=NDNAH.getTime();
                        //regul==0 || 
                                //vibrate: [200, 100, 200, 100, 200, 100, 200],
                    if (regul==0 && text && text.body && text.body!="" && lasm!=text.body && (1==1 || FiTim==1 || (TNNAH-TNNA)>intTiH))
                    {
                            lasm=text.body; TNNA=TNNAH; FiTim=0;
                            const showNotification = self.registration.showNotification(text.title, {
                                body: text.body,
                                icon: baseicob,
                                badge: badgeicon,
                                click_action: text.link,
                                subtitle: text.subtitle,
                                tag: 'tetatet-info',
                                data: {
                                    url: text.link, click_action: text.link
                                }
                            });
                            try{swDC1=text.swDC1; swDC2=text.swDC2; swDC3=text.swDC3; swDC4=text.swDC4; swDC7=text.swDC7; swDC66=text.swDC66}catch(err){}
                    }
                });

            
            //if (regul==1) SendToBase({'swusid':swusid,'swINu':swINu, 'swkcid': swkcid, 'SWUID': SWUID, 'swDC1': swDC1, 'swDC2': swDC2, 'swDC3': swDC3, 'swDC4': swDC4, 'swDC7': swDC7, 'swDC66': swDC66});
        
        }else if (24!=24 && swkcid==0 && lasm!=":)"){
                    lasm=":)";
                    const showNotification = self.registration.showNotification("tetatet-club", {
                        body: ":)",
                        icon: cicon,
                        badge: badgeicon,
                        click_action: clurl,
                        subtitle: "",
                        vibrate: [200, 100, 200, 100, 200, 100, 200],
                        data: {
                            url: clurl, click_action: clurl
                        }
                    });
        }

        }catch(err){}

        if (1==1 || regul==1) 
        {
            setTimeout(function(){
                try{SendToBase({'swusid':swusid,'swINu':swINu, 'swkcid': swkcid, 'SWUID': SWUID, 'swDC1': swDC1, 'swDC2': swDC2, 'swDC3': swDC3, 'swDC4': swDC4, 'swDC7': swDC7, 'swDC66': swDC66})}catch(err){}
                },1)
        }

        if (swkcid>1){
            var intTiR=60000*60*1; 
//intTiR=40000; //for test
            setTimeout(function(){GetInfo(2)},intTiR)
        }

    }
}

; self.addEventListener('notificationclick', function(event) {
     target = event.notification.data.click_action || '/';
    event.notification.close();

    // этот код должен проверять список открытых вкладок и переключатся на открытую
    // вкладку с ссылкой если такая есть, иначе открывает новую вкладку
    event.waitUntil(clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then(function(clientList) {
        // clientList почему-то всегда пуст!?
        for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if (client.url == target && 'focus' in client) {
                //console.log("here");
                return client.focus();
                //return client.postMessage({'status':'refresh'})
            }
        }
        //console.log("newwindow:"+target);
        // Открываем новое окно
        if (clients && clients.openWindow) {return clients.openWindow(target)}
    }
    ));
});


self.addEventListener('sync', function(event) {
   let syhnam='syncdatatet'+swkcid;
  //console.log("SWsyhnam:"+syhnam+";"+event.tag);

  //if (event.tag == syhnam || swkcid==0) 
  
    event.waitUntil(setTimeout(function(){GetInfo(1); SyncT=1},SyncT));
  
});

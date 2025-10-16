
self.addEventListener('install', function(event) 
{
    event.waitUntil( self.skipWaiting() );
});
  
self.addEventListener('activate', function(event) 
{
    event.waitUntil( self.clients.claim() );
});

// required for "Add To Home Screen"
self.addEventListener('fetch', function(event) 
{
});

function post_to_server(data)
{
    return fetch( '/web-push.pl', 
        {
	    method: 'POST',
	    credentials: 'include',
	    headers: { 'Content-type': 'application/json', },
	    body: JSON.stringify(data),
	});
}

self.addEventListener( 'pushsubscriptionchange', function(event) 
{
//    console.log( 'Web push notification subscription changed' );
//    console.log( 'newSubscription: '+event.newSubscription );
//    console.log( 'oldSubscription: '+event.oldSubscription );

    if (event.oldSubscription)
    {
	event.waitUntil( post_to_server(
	    {
	        'act': 'delete',
	        'sub': JSON.stringify(event.oldSubscription),
	    }) );

	event.waitUntil( 
	    registration.pushManager.subscribe( event.oldSubscription.options )
		.then( function(subscription) 
                {
//		    console.log( 'Resubscribing to web push notification' );
		    
		    return post_to_server(
			{
			    'act': 'update',
    			    'sub': JSON.stringify(subscription),
			});
                }));
    }
});

self.addEventListener('message', function(event) 
{
    var act = event.data.act;

    console.log( 'Service worker command: '+act );
    
    if (act=='clear-notifications')
    {
	var type = event.data.type || 0;
	
//	console.log( 'Clearing notifications, type: '+type );
	
	event.waitUntil( registration.getNotifications()
	    .then( function(all_notifications) 
		{
//		    console.log( 'Found '+all_notifications.length+' open notifications' );
		    
            	    for( var i = 0; i < all_notifications.length; i++ ) 
            	    {
            		var nt = all_notifications[i];
            		if (type && nt.data && (nt.data.type & type)==0) continue;
            		nt.close();
            	    }
                }) );
    }
    else
    if (act=='pause-notifications')
    {
	event.waitUntil( idbKeyval.set( 'notifications-pause-time', get_time_sec() ) );
    }
    else
    if (act=='unpause-notifications')
    {
	event.waitUntil( idbKeyval.del( 'notifications-pause-time' ) );
    }
    else
    if (act=='request-singleton-window')
    {
	var url = event.data.url || '';
	var id = event.data.id || 0;
	var source_id = event.source.id;

	event.waitUntil( self.clients.matchAll( { 'type': 'window' } )
	    .then( windowClients => 
	    {
		for (var i = 0; i < windowClients.length; i++) 
		{
		    var cl = windowClients[i];

		    if (cl.id==source_id) continue;	// skip the window that requested this

		    cl.postMessage( { 'act': 'request-singleton-window', 'url': url, 'id': id } );
		}
	    })
	);
    }
});

async function process_push_notification(data)
{
    console.log( 'Web push notification received, type: '+data.type );

    var pause_time = to_int( await idbKeyval.get( 'notifications-pause-time' ) ); 
    var dt = pause_time ? (get_time_sec() - pause_time) : 0;
    if (pause_time && dt<5*60)	// 5 min
    {
	console.log( 'Notifications paused '+dt+' seconds ago, skipping' );
	return;
    }

//    \u{265F} = pawn
//    \u{2709} = envelope
//    \u{1F514} = bell
//    \u{1F3C1} = checkered flag
//    \u2192 = right arrow
    
    var tag = 'to-move';
    var link = '/play-chess.pl?from=webpush&rnd='+Math.random();
    var msg = '\u{265F} Your turn to move';
    if (data.type==0xFF)
    {
	if (!data.msg) await log( 'No msg for direct notification: '+JSON.stringify(data) );
    }
    else
    if (data.type==0x01)
    {
	msg = '\u{265F} Your turn to move in one of the games';
	tag = 'to-move';
	
	var url_tag;
	if (data.bd) url_tag = 'bd='+data.bd;	// don't show notification if any url with bd=XXX is open and focused
	
// don't show if we have a window open with focus	
	if (await is_client_window_focused(url_tag)) return;
    }
    else
    if (data.type==0x02)
    {
	msg = '\u{1F3C1} New game started';
	tag = 'new-game';
	
// don't show if we have a window open with focus	
	if (await is_client_window_focused()) return;
    }
    else
    if (data.type==0x04)
    {
	msg = '\u{2709} New message or notification';
	tag = 'message';
	link = '/messages.pl?from=webpush&rnd='+Math.random();
    }
    else
    if (data.type==0x08)
    {
	msg = '\u{23F1} Time is running out to make a move!';
	tag = 'time-trouble';
    }
    else
    {
//	await log( 'Unknown event type: '+JSON.stringify(data) );
//	if (!data.type && !data.msg) return;
    }
    
    var title = 'GameKnot Chess';
    if (data.uid)
    {
//	msg = data.uid + ', ' + msg;
	title += ' \u2192 ' + data.uid;
	link += (link.indexOf('?')>0 ? '&' : '?') + 'iu=' + data.uid;
    }

    var options = 
    {
//	actions: [ { action: "navigate", title: "Go to GameKnot.com", } ],	// looks ugly
	icon: data.icon || '/img/gk-logo-251x242.png',
//	requireInteraction: true,	// adds [Close] button to notification
    }
    
    options.body = data.msg || msg;
    options.tag = data.tag || tag;
    if (!data.link) data.link = link;
    options.data =  data;
    
    return self.registration.showNotification( title, options );
}

self.addEventListener( 'push', function(event) 
{
    var data = event.data ? event.data.json() : {};
    
    event.waitUntil( process_push_notification(data) );
});

function log( msg )
{
    var data = 
    {
	src: 'service-worker',
	type: 'log',
	msg: msg,
    };
    return fetch( 'https://log.gameknot.com/log-data.pl', 
	    {
		method: 'POST',
//		mode: 'cors',
		credentials: 'include',
//		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	    } );
}

self.addEventListener( 'notificationclose', function(event) 
{
    console.log('notification closed');
});

self.addEventListener( 'notificationclick', function(event) 
{
//    console.log('notification clicked');

    event.notification.close();
    
    var nt = event.notification;
    const data = nt.data || {};

    var link = data.link || '/play-chess.pl?from=webpush&rnd='+Math.random();

    event.waitUntil( 
	self.clients.matchAll( { type: 'window' } )
	    .then( function(clientList) 
		{
            	    if (clientList.length > 0) 
            	    {
                	return clientList[0].navigate( link )
                		    .then( cl => cl.focus() );
                    }
                    
                    return self.clients.openWindow(link);
                } ) );
});

/*
function sdump(obj)
{
    if (!obj) return 'null';
    try { return obj.toSource(); } catch(err) {};
    try { return JSON.stringify( obj, function(k, v) 
			{
    			    if (v instanceof Node) { return 'Node'; }
                    	    if (v instanceof Window) { return 'Window'; }
                            return v;
                        }, ' ' ); } catch(err) {};
    return obj.toString();
}
*/

function to_int (s)
{
    var n = parseInt(s,10);
    if (!n || isNaN(n)) return 0;
    return n;
}

function get_time_sec()	// in sec
{
    return Math.floor( (new Date()).getTime() / 1000 );
}

function is_client_window_focused(url_tag)	// any windows with url containing url_tag that are focused?
{
    return self.clients.matchAll({
	type: 'window',
//	includeUncontrolled: true
    })
    .then((windowClients) => 
    {
	var b_focused = false;

	for (let i = 0; i < windowClients.length; i++) 
	{
	    if (url_tag)
	    {
		var s = String(windowClients[i].url);
//		console.log( s + ' <> ' + url_tag );
		if (s && s.indexOf(url_tag)<0) continue;
	    }
    	    if (windowClients[i].focused) 
    	    {
    		b_focused = true;
    		break;
    	    }
	}

	return b_focused;
    });
}

var idbKeyval=function(e){"use strict";class t{constructor(e="keyval-store",t="keyval"){this.storeName=t,this._dbp=new Promise((r,n)=>{const o=indexedDB.open(e,1);o.onerror=(()=>n(o.error)),o.onsuccess=(()=>r(o.result)),o.onupgradeneeded=(()=>{o.result.createObjectStore(t)})})}_withIDBStore(e,t){return this._dbp.then(r=>new Promise((n,o)=>{const s=r.transaction(this.storeName,e);s.oncomplete=(()=>n()),s.onabort=s.onerror=(()=>o(s.error)),t(s.objectStore(this.storeName))}))}}let r;function n(){return r||(r=new t),r}return e.Store=t,e.get=function(e,t=n()){let r;return t._withIDBStore("readonly",t=>{r=t.get(e)}).then(()=>r.result)},e.set=function(e,t,r=n()){return r._withIDBStore("readwrite",r=>{r.put(t,e)})},e.del=function(e,t=n()){return t._withIDBStore("readwrite",t=>{t.delete(e)})},e.clear=function(e=n()){return e._withIDBStore("readwrite",e=>{e.clear()})},e.keys=function(e=n()){const t=[];return e._withIDBStore("readonly",e=>{(e.openKeyCursor||e.openCursor).call(e).onsuccess=function(){this.result&&(t.push(this.result.key),this.result.continue())}}).then(()=>t)},e}({});

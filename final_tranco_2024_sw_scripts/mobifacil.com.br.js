
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
var QUERY_STATUS_URL = "https://www.mobifacil.com.br/on/demandware.store/Sites-Mobifacil-Site/pt_BR/Pix-QueryStatus?orderNO="
function checkStatus(link, startPolling, passengerData, orderNo) {
let url = link + '&passengersData=' + passengerData;
if (startPolling == 'true') {
fetch(url, {
method: 'GET'
})
.then(response => {
if (!response.ok) {
throw new Error('Network response was not ok');
}
return response.json();
})
.then(response => {
if (response.success) {
self.clients.matchAll().then(clients => {
if (clients && clients.length) {
clients[0].navigate(response.continueUrlSW); // Redireciona o primeiro cliente (janela/aba aberta)
}
});
}
})
.catch(error => {
console.error('Error during fetch:', error);
});
}
}
function cronJob(link, startPolling, passengerData, orderNo) {
checkStatus(link, startPolling, passengerData, orderNo);
const nextExecution = Date.now() + 5000; // Adiciona 5 segundos ao tempo atual
return new Promise(function (resolve) {
const delay = nextExecution - Date.now();
setTimeout(resolve, delay);
}).then(() => cronJob(link, startPolling, passengerData, orderNo));
}
self.addEventListener('install', event => {
console.info('%c Service Worker instalado', 'background: #4BDB0C; color: #000',);
event.waitUntil(Promise.resolve());
});
self.addEventListener('activate', event => {
console.info('%c Service Worker ativado', 'background: #4BDB0C; color: #000',);
event.waitUntil(
caches.keys().then(cacheNames => {
return Promise.all(
cacheNames.filter(cacheName => {
}).map(cacheName => {
return caches.delete(cacheName);
})
);
})
);
});
self.addEventListener('push', function (event) {
if (event.data) {
const data = event.data.json();
event.waitUntil(clients.openWindow(data.link || 'https://www.mobifacil.com.br/'));
self.registration.showNotification(data.title, {
body: data.body,
icon: 'https://www.mobifacil.com.br/on/demandware.static/Sites-Mobifacil-Site/-/default/dw083e96ca/images/icon-notify.png',
badge: 'https://www.mobifacil.com.br/on/demandware.static/Sites-Mobifacil-Site/-/default/dw05f38b2a/images/favicons/favicon-196x196.png',
actions: data.actions,
onclick: data.onclick
});
}
});
self.addEventListener('notificationclick', (event) => {
if (!event.action) {
event.waitUntil(clients.openWindow('https://www.mobifacil.com.br/'));
return;
}
switch (event.action) {
case 'meus-pedidos':
event.waitUntil(clients.openWindow(event.action.url || 'https://www.mobifacil.com.br/history'));
break;
case 'go-Home':
event.waitUntil(clients.openWindow(event.action.url || 'https://www.mobifacil.com.br/'));
break;
default:
console.error(`Unknown action clicked: 'null'`);
break;
}
});
self.addEventListener('message', event => {
if (event.data && event.data.type === "INICIAR_POLLING") {
cronJob(event.data.url, event.data.startPolling, event.data.passengerData, event.data.orderNo);
}
});

const version = "202103031110";
const CACHE_NAME = "md_cashe";
self.addEventListener('activate', event => self.clients.claim());
self.addEventListener('fetch', event => {});
const FILES_TO_CACHE = [
  '/manifest.json?v='+version,
  '/inc/ImageTools.js?v='+version,
  '/inc/new_style.css?v='+version,
  '/inc/main_script.js?v='+version,
  '/inc/modal.css?v='+version,
  '/inc/animate.css?v='+version,
  '/inc/jquery.min.js?v='+version,
  '/inc/jquery.lazy.min.js?v='+version,
  '/inc/modal.js?v='+version,
  '/inc/jquery.suggestions.min.js?v='+version,
  '/inc/jquery.maskedinput.js?v='+version,
  '/inc/JsBarcode.js?v='+version,
  '/inc/logo_main.png',
  '/inc/logo_small.png',
  '/inc/noimage.png',
  '/inc/catalog_icon_dark.png',
  '/inc/basket_icon_dark.png',
  '/inc/kaleidoscope_icon.png',
  '/inc/orders_icon_dark.png',
  '/inc/bonus_icon.png',
  '/inc/event_day_icon.png',
  '/inc/gift_icon_coupon.png',
  '/inc/cursor_icon.png',
  '/inc/ins.svg',
  '/inc/vk.svg',
  '/inc/odn.svg',
  '/inc/alert-circle.png',
  '/inc/arrow_up.png',
  '/inc/arrow_left.png',
  '/inc/arrow_right.png',
  '/inc/basket-add.png',
  '/inc/ans.png',
  '/inc/ok_icon.png',
  '/inc/plus-minus.png',
  '/inc/loader_cat.gif',
  '/inc/loader-circle.gif',
  '/inc/loader_title.gif',
  '/inc/loader-horizontal.gif',
  '/inc/package.png',
  '/inc/cancel_icon.png',
  '/inc/about.png',
  '/inc/checked_true_icon.png',
  '/inc/checked_false_icon.png',
  '/inc/300.jpg',
  '/inc/500.jpg',
  '/inc/1000.jpg',
];

self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');
evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline page');
      return cache.addAll(FILES_TO_CACHE);
    })
);
  self.skipWaiting();
});


function addToHomeScreen() {
        let a2hsBtn = document.querySelector(".ad2hs-prompt"); 
        a2hsBtn.style.display = 'none';
        deferredPrompt.prompt();
        deferredPrompt.userChoice
          .then(function(choiceResult){

        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }

        deferredPrompt = null;

});
}

function showAddToHomeScreen() {
let a2hsBtn = document.querySelector(".ad2hs-prompt");
a2hsBtn.style.display = "block";
a2hsBtn.addEventListener("click", addToHomeScreen);
}

let deferredPrompt;
addEventListener('beforeinstallprompt', function (e) {
e.preventDefault();
deferredPrompt = e;
showAddToHomeScreen();
});
    
function showIosInstall() {
	let iosPrompt = document.querySelector(".ios-prompt");
	iosPrompt.style.display = "block";
	iosPrompt.addEventListener("click", () => {
		iosPrompt.style.display = "none";
	});
}

const isIos = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test( userAgent );
}
const isInStandaloneMode = () => ('standalone' in navigator) && (navigator.standalone);
if (isIos() && !isInStandaloneMode()) {
	showIosInstall();
}else{
	console.log("it's ANDROID");
}
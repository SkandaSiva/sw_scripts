var version = '1.0.0';
var CACHE_NAME = 'pwa-jtrip-cache-v1.0.0';
var urlsToCache = [
  '/',
  'j-okinawa/',
  'j-hokkaido/',
  'j-tohoku/',
  'j-tokyo/',
  'j-kansai/',
  'j-shikoku/',
  'j-kyushu/',
  'j-nansei/',
  'j-kakuyasu/img/logo.png',
  'j-kakuyasu/img/jaljta.png',
  'j-kakuyasu/img/index/img_Jtripbest.jpg',
  'j-kakuyasu/img/index/img_Jtripbest-pc.jpg',
  'common/img/index/map.png',
  'common/img/index/ico_manual_jtrip.png',
  'common/img/index/ico_manual_rentacar.png',
  'common/img/index/ico_manual_reservation.png',
  'common/img/index/logo_pointer.png',
  'common/img/pagetop.png',
  'common/img/btn_menu.png',
  'common/img/img_voice.jpg',
  'common/img/apple-touch-icon.png',
  'common/img/img_sdgs.jpg',
  'common/img/ico_prev.png',
  'common/img/ico_next.png',
  'common/img/bg_anchor02.png',
  'common/img/arrow_select02.png',
  'common/img/bg_anchor.png',
  'common/img/btn_menu_close.png',
  'common/img/btn_favorite.png',
  'common/img/index/logo_move.gif',
  'common/img/index/hd_magazine.png',
  'common/img/sns_twitter.png',
  'common/img/sns_instagram.png',
  'common/img/sns_youtube.png',
  'common/img/sns_line.png',
  'common/img/logo_footer.png',
  'img/chat_bot/icon_chat.png'
];
self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});
self.addEventListener('fetch', function(event) {});
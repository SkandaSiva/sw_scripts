const cacheSettings = {
	name: "pwa4wp-cache-5",
	cacheName: "pwa4wp-cache-5",
	initialCaches: ["https://www.ryutopia.or.jp/sitemap/"],
	exclusions: ["^.*/wp-admin/.*","^.*/wp-login.php$","^.*[\?&]preview=true.*$"],
	forceonline: ["\.*?/information/seat/$"],
	forcecache: ["\.*?/performance/ticket/$","\.*?/performance/$","\.*?/traffic/access/$","\.*?/traffic/parking/$"],
	ttl : 60,
	offlinePage : "https://www.ryutopia.or.jp/sitemap/",
	cachePlan : "onlinefirst",
	dbVersion : "5",
	debug_msg : "",
};
importScripts('https://www.ryutopia.or.jp/wp-content/plugins/pwa4wp/public/js/pwa4wp-cache-manager.js?1.2.0.5');
importScripts('https://www.ryutopia.or.jp/wp-content/plugins/pwa4wp/public/js/lib/dexie.min.js?1.2.0.5');
const db = new Dexie('pwa4wp-db');
const pwa4wp_cacheManager = new pwa4wp_CacheManager(this, caches, db, cacheSettings);
pwa4wp_cacheManager.initialize();
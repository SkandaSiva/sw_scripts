'use strict';
var CACHE_NAME = 'twnAddToHome-id0001';
var CACHE_TARGET_PATTERN_LIST = ['.*/twc/sw/.*'];



self.addEventListener('fetch', function(event) {
	//リクエストしたURLがCACHE_TARGET_PATTERN_LISTのパターンと一致するか確認
	var result = CACHE_TARGET_PATTERN_LIST.some(function(pathPattern) {
		var reg = new RegExp(pathPattern);
		return reg.test(event.request.url);
	});
	//一致しない場合返却
	if (!result) {
		return;
	}
	//一致する場合レスポンスごとに処理
	event.respondWith(fetch(event.request.clone()).then(function(fetchResponse) {
		//200番の場合
		if (fetchResponse.status === 200) {
			//キャッシュを開く
			caches.open(CACHE_NAME).then(function(cache) {
				cache.put(event.request, fetchResponse.clone());
			});
			
			
		} else if (fetchResponse.status === 401) {
			return fetchResponse.clone();
		} else if (fetchResponse.status >= 400) {
			return caches.open(CACHE_NAME).then(function(cache) {
				return cache.match(event.request).then(function(cacheResponse) {
					return cacheResponse || fetchResponse.clone();
				});
			});
		}
		return fetchResponse.clone();
	}).catch(function(error) {
		return caches.open(CACHE_NAME).then(function(cache) {
			return cache.match(event.request);
		});
	}));
});

//現在あるキャッシュ名と一致しているか確認する。
//一致していない場合、更新し、前のキャッシュは削除
self.addEventListener('activate', function(event) {
	event.waitUntil(caches.keys().then(function(cacheNames) {
		//取り出したcacheNamesからCACHE_NAMEと一致しないものを取得
		return Promise.all(cacheNames.filter(function(cacheName) {
			return cacheName !== CACHE_NAME;
		//上記で取得したcacheNameをキャッシュから削除
		}).map(function(cacheName) {
			return caches.delete(cacheName);
		}));
	}));
});

//push時の表示を設定
self.addEventListener('push', function(event) {

	var title = '新着情報';
	var body = '今週の求人情報が更新されました。いますぐチェック！';
	var icon = '/img/push/new_info_push.png';
	var tag = '新着情報';

	event.waitUntil(
		self.registration.showNotification(title, {
			body: body,
			icon: icon,
			tag: tag
		})
	);
});

//通知押下時を設定
self.addEventListener('notificationclick', function(event) {
	// クリック時Push通知を閉じる
	event.notification.close();

	// すでにリンク先が開かれている場合、フォーカスをあてる
	// 開かれていない場合、新しくウィンドウを開く
	event.waitUntil(clients.matchAll({
		type: "window"
	}).then(function(clientList) {
		for (var i = 0; i < clientList.length; i++) {
			var client = clientList[i];
			if (client.url == '/' && 'focus' in client)
				return client.focus();
		}
		if (clients.openWindow)
			return clients.openWindow('/?vos=dtwnsvws1610234');
		}
	));
});
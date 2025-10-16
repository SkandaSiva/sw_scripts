let CACHE_LINKS = ["/blank.html"];
const NO_REQUEST = ['google', "facebook", "analytics", 'peer', "doubleclick", "m3u8", "mp4", "website-api", "imgur.com", "fastlycdnlive", "cbox", "cdn.", "cdnjs", "gstatic",'images','fonts','.css','.js', "robots.txt"];
const NO_CACHE = ['/go', '/truc-tiep', '/lich-thi-dau', "/ket-qua", "/xem-lai", "/event", "/football", "/basketball", "/volleyball", "/badminton", "/wwe", "/esports", "/race", "/tennis", "/pool", "/other", "/xoilac", "/olympic-2024"];
function noHandleRequest(_0x4e9fe6) {
	if (!_0x4e9fe6) {
		return false;
	}
	let _0x593474 = false;
	NO_REQUEST.forEach(_0x1a7a58 => {
		if (_0x4e9fe6.includes(_0x1a7a58)) {
			_0x593474 = true;
		}
	});
	if (!_0x4e9fe6.startsWith(self.location.origin)) {
		_0x593474 = true;
	}
	return _0x593474;
}
function loadNewBlankSite(_0x3deaaf) {
	if (!_0x3deaaf) {
		return true;
	}
	let _0x400df2 = false;
	NO_CACHE.forEach(_0x14bfec => {
		if (_0x3deaaf.includes(_0x14bfec)) {
			_0x400df2 = true;
		}
	});
	if (_0x400df2) {
		return _0x400df2;
	}
	if (_0x3deaaf == self.location.origin) {
		return true;
	}
	if (_0x3deaaf == self.location.origin + '/') {
		return true;
	}
	if (_0x3deaaf.includes(self.location.origin + '/#')) {
		return true;
	}
	if (_0x3deaaf.includes(self.location.origin + '#')) {
		return true;
	}
	if (_0x3deaaf.includes(self.location.origin + '/?')) {
		return true;
	}
	if (_0x3deaaf.includes(self.location.origin + '?')) {
		return true;
	}
	return _0x400df2;
}
function saveCache(_0x51f4cb) {
	let _0x1b2ce9 = true;
	NO_CACHE.forEach(_0xabd6d5 => {
		if (_0x51f4cb.includes(_0xabd6d5)) {
			_0x1b2ce9 = false;
		}
	});
	return _0x1b2ce9;
}
self.addEventListener("install", _0x2c3ec5 => {
	async function _0x9a208d() {
		const _0x294b1d = await caches.open("service_worker_tc1");
		return _0x294b1d.addAll(CACHE_LINKS);
	}
	_0x2c3ec5.waitUntil(_0x9a208d());
});
self.addEventListener('activate', function (_0x5d2f10) {
	async function _0x1b0f7a() {
		const _0x43d630 = await caches.keys();
		await Promise.all(_0x43d630.map(_0xa42dfc => {
			if (_0xa42dfc !== "service_worker_tc1") {
				return caches['delete'](_0xa42dfc);
			}
		}));
	}
	_0x5d2f10.waitUntil(_0x1b0f7a());
});
self.addEventListener('fetch', event => {
	async function handleRequest() {
		let cache = await caches.open("service_worker_tc1");
		if (event.request.mode == "navigate") {
			try {
				// const _0x2ad54d = await fetch(event.request);
				// let _0x2d4742 = await _0x2ad54d.text();
				// if (_0x2d4742.includes("/cdn-cgi/")) {
				// 	return new Response(_0x2d4742, {
				// 		'headers': {
				// 			'Content-Type': "text/html"
				// 		}
				// 	});
				// } else {
					if (loadNewBlankSite(event.request.url)) {
						const _0x457039 = await cache.match("/blank.html");
						if (_0x457039) {
							return _0x457039;
						}
					}
				// }
			} catch (_0x54f61d) {
				if (loadNewBlankSite(event.request.url)) {
					const _0x2249a9 = await cache.match('/blank.html');
					if (_0x2249a9) {
						return _0x2249a9;
					}
				}
			}
		} else {
			try {
				const _0x1476f1 = await fetch(event.request);
				if (saveCache(event.request.url) && event.request.method == "GET") {
					cache.put(event.request, _0x1476f1.clone());
				}
				return _0x1476f1;
			} catch (_0x4ead0c) {
				const _0x3b98c4 = await cache.match(event.request);
				if (_0x3b98c4) {
					return _0x3b98c4;
				}
			}
			let _0x1ea386 = event.request.url;
			const _0x59b7d5 = _0x1ea386.replace(self.location.origin, 'https://t5c2.bdhub.link');
			return await fetch(_0x59b7d5);
			//return _0x13f0ef;
		}
	}
	let _0x56c3aa = noHandleRequest(event.request.url);
	if (!_0x56c3aa || event.request.mode == "navigate") {
		event.respondWith(handleRequest());
	}
});

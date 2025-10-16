/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
const sw = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (self));

/* globals Hogan */
sw.importScripts("https://cdnjs.cloudflare.com/ajax/libs/hogan.js/3.0.2/hogan.min.js");

const CACHED_SONGS_LIMIT = 5;
const OFFLINE_ASSETS_VERSION = 2;
const OFFLINE_TEMPLATE = `/offline.html?v=${OFFLINE_ASSETS_VERSION}`;
const CURRENT_CACHES = {
	OFFLINE_ASSETS: `offline-assets-v${OFFLINE_ASSETS_VERSION}`,
	OFFLINE_SONGS: `offline-songs-v${OFFLINE_ASSETS_VERSION}`,
};

sw.addEventListener("install", event => {
	const addFilesToCache = async () => {
		const cache = await caches.open(CURRENT_CACHES.OFFLINE_ASSETS);
		await cache.add(OFFLINE_TEMPLATE);
	};

	event.waitUntil(addFilesToCache());
});

sw.addEventListener("activate", event => {
	const deleteOldCaches = async () => {
		const keys = await caches.keys();
		for (const key of keys) {
			if (!Object.values(CURRENT_CACHES).includes(key)) {
				await caches.delete(key);
			}
		}
	};
	event.waitUntil(deleteOldCaches());
});

const cacheAsJSON = (cache, key, body) =>
	cache.put(
		key + "?format=json",
		new Response(body, {
			headers: {
				"Content-Type": "application/json",
			},
		}),
	);

const getOfflineTemplate = async () => {
	const cache = await caches.open(CURRENT_CACHES.OFFLINE_ASSETS);
	const response = await cache.match(OFFLINE_TEMPLATE);

	return response.text();
};

const getOfflineSongs = async () => {
	const cache = await caches.open(CURRENT_CACHES.OFFLINE_SONGS);
	const keys = await cache.keys();

	return Promise.all(
		keys.map(async key => {
			const response = await cache.match(key);

			return response.json();
		}),
	);
};

sw.addEventListener("message", async event => {
	try {
		const { song, url } = JSON.parse(event.data);
		const currentSongUrl = `/${song.dns}/${song.url}/`;

		const data = {
			lyric: song.lyric.split("\n").join("<br />"),
			title: song.name,
			artist: song.artist,
			url,
			currentSongUrl,
		};

		const cache = await caches.open(CURRENT_CACHES.OFFLINE_SONGS);
		const keys = await cache.keys();

		if (keys.length > CACHED_SONGS_LIMIT) {
			cache.delete(keys.reverse().pop());
		}

		cacheAsJSON(cache, currentSongUrl, JSON.stringify(data));
	} catch (err) {
		console.log(err);
	}
});

const preventFetch = [".js", ".ts", ".svelte", ".mjs", ".png", ".svg", ".css", ".scss"];

sw.addEventListener("fetch", event => {
	const url = new URL(event.request.url);

	const isLocalUrl = url.origin === location.origin;

	if (!isLocalUrl) {
		return;
	}

	if (event.request.method !== "GET") {
		return;
	}

	if (preventFetch.some(str => url.pathname.endsWith(str))) {
		return;
	}

	const respond = async () => {
		// try the network first, but fall back to the cache if we're offline
		try {
			const response = await fetch(event.request);
			return response;
		} catch (err) {
			const [songs, template] = await Promise.all([getOfflineSongs(), getOfflineTemplate()]);
			const currentSong = songs.find(
				song => song.url === url.pathname || song.currentSongUrl === url.pathname,
			);

			const compiled = Hogan.compile(template);
			const html = compiled.render({
				currentSong,
				songs,
			});

			return new Response(html, {
				headers: {
					"Content-Type": "text/html",
				},
			});
		}
	};

	event.respondWith(respond());
});

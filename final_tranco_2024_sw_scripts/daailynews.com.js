"use strict";

importScripts('https://www.gstatic.com/firebasejs/5.0.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.0.2/firebase-messaging.js');

//!!!! It must be changed before the release on the current date
var versionFromParam = '?ver=20200916';

var pushConfig = {
	apiServerUrl: 'https://daailynews.com',
	partyId: 'cHVzaGJyb3dzZTo6Q2hHNkxuQg=='
};

firebase.initializeApp({"messagingSenderId": "308676555877"});
var isoCountries = initCountries();

var indexedDBConfig = {
	baseName: "subscriberData",
	storeName: "subscriberData",
	storedDataMap: new Map(),
	version: 2
};

var indexedDBFCMConfig = {
	baseName: "fcm_token_details_db",
	storeName: "fcm_token_object_Store",
	storedDataMap: new Map(),
	version: 1
};

self.addEventListener('push', function (event) {
	self.registration.update();
	const promiseChain = Promise.all([loadDataFromDBToMap(indexedDBConfig), loadDataFromDBFCM()]).then(function (results) {
		return getNotification(event);
	});
	event.waitUntil(promiseChain);
});

self.addEventListener('notificationclick', function (event) {
	event.notification.close();
	var token = encodeURIComponent(event.notification.data.token);
	var nid = event.notification.data.nid;
	var link = event.notification.data.link;
	var sid = event.notification.data.sid;

	if (event.notification.actions) {
		var actions = event.notification.actions;
		var actionsLink = event.notification.data.actionsLink;
	}
	var click_id = generateUUID();
	sendMessage('clickV2', nid, token, click_id);

	if (actions !== undefined && actions.length > 0) {
		if (event.action === 'actionOne') {
			link = actionsLink[0];
		} else if (event.action === 'actionTwo') {
			link = actionsLink[1];
		} else if (event.action === 'actionThree') {
			link = actionsLink[2];
		}
	}
	if (link) {
		link = link.replace("\[click_id\]", click_id);
		link = link.replace("\[fcm_token\]", token);
	}
	var endpoint = pushConfig.apiServerUrl
		+ '/api/track/'
		+ 'click-url'
		+ '/nid/' + nid
		+ '/token/' + token
		+ '/sid/' + sid
		+ '/click_id/' + click_id;
	var clickUrl = {link: link};
	if (link.indexOf('[') > -1 && link.indexOf(']') > -1) {
		event.waitUntil(
			fetch(endpoint, {
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(clickUrl)
			}).then(function (response) {
				if (response.status !== 200) {
					clients.openWindow(link);
				}
				return response.json().then(function (data) {
					if (data && data.clickUrl) {
						link = data.clickUrl;
					}
					clients.openWindow(link);
				})
			}).catch(function (err) {
				clients.openWindow(link);
			})
		);
	} else {
		clients.openWindow(link);
	}
});

self.addEventListener('pushsubscriptionchange', function (event) {
	console.log('Subscription expired');
	event.waitUntil(
		firebase.messaging.requestPermission()
			.then(function () {
				return firebase.messaging.getToken();
			}).then(function (newToken) {
			messageBody['tokenId'] = newToken;
			messageBody['sid'] = indexedDBConfig.storedDataMap.has("sid") ? indexedDBConfig.storedDataMap.get("sid") : '';
			messageBody['cid'] = indexedDBConfig.storedDataMap.has("cid") ? indexedDBConfig.storedDataMap.get("cid") : -1;
			var urlParams = {};
			var trackParamNames = ['s1', 's2', 's3', 's4', 'cid', 'eauuid'];
			trackParamNames.forEach(function(key) {
				if (indexedDBConfig.storedDataMap.has(key)) {
					urlParams[key] = indexedDBConfig.storedDataMap.get(key);
				}
			});
			messageBody['urlParams'] = urlParams;
			return fetch(pushConfig.apiServerUrl + "/api/subscribe/refresh/from/sw"  + versionFromParam, {
				method: 'post',
				headers: {
					'Content-type': 'application/json',
					'Authorization': 'Basic ' + pushConfig.partyId
				},
				body: JSON.stringify(messageBody)
			})
		})
	);
});

function getNotification(event) {
	var token = indexedDBFCMConfig.storedDataMap.has("fcmToken") ? indexedDBFCMConfig.storedDataMap.get("fcmToken") : undefined;
	var sid = indexedDBConfig.storedDataMap.has("sid") ? indexedDBConfig.storedDataMap.get("sid") : undefined;
	var macros = {country: getCountryName(), city: getCityName(), device: getDeviceName()};
	console.log("fcmToken " + token);
	console.log("sid " + sid);
	if (token == undefined) {
		token = indexedDBConfig.storedDataMap.has("token") ? indexedDBConfig.storedDataMap.get("token") : undefined;
	}
	var payload = event.data.json();
	var push_params = JSON.parse(payload.data.push_params);
	const notificationTitle = replaceMacro(payload.data.title, macros);

	var notificationOptions = {
		body: replaceMacro(payload.data.body, macros),
		icon: payload.data.icon,
		requireInteraction: true,
		data: {
			link: payload.data.link,
			token: token,
			nid: push_params.nid,
			sid: sid
		}
	};

	if (payload.data.image)
		notificationOptions.image = payload.data.image;

	if (payload.data.badge) {
		notificationOptions.badge = payload.data.badge;
	}

	if (payload.data.vibration) {
		notificationOptions.vibrate = payload.data.vibration.split(',').map(Number);
	}

	if (payload.data.actions && payload.data.actions.size > 0) {
		var actionsLink = [];
		var actionsBtn = JSON.parse(payload.data.actions);
		actionsBtn.forEach(function (item) {
			actionsLink.push(item.link);
		});
		notificationOptions.actions = actionsBtn;
		notificationOptions.data.actionsLink = actionsLink;
	}

	sendMessage('delivery', push_params.nid, token, null);
	return self.registration.showNotification(notificationTitle, notificationOptions);
}

function sendMessage(eventType, nid, token, click_id) {
	return fetch(createTrackEventUrl(eventType, nid, token, click_id), {
		method: 'post',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	}).then(function(response){
	console.log("Send message with status : " + response.status);
	});
}

function createTrackEventUrl(eventType, nid, token, click_id) {
	var endPoint = createTrackUrl(eventType, nid, token);
	if (eventType === 'clickV2') {
		endPoint += '/click_id/' + click_id;
	}
	if (indexedDBConfig.storedDataMap.has('sid') && indexedDBConfig.storedDataMap.get('sid') !== '') {
		endPoint += '/sid/' + indexedDBConfig.storedDataMap.get('sid');
	}
	endPoint = addTrackParams(endPoint);
	return endPoint;
}

var createTrackUrl = function (eventType, nid, token) {
	return pushConfig.apiServerUrl
		+ '/api/track/'
		+ eventType
		+ '/nid/' + nid
		+ '/token/' + token;
};

var addTrackParams = function (endPoint) {
	endPoint += versionFromParam;
	if (indexedDBConfig.storedDataMap.size < 0) {
		return endPoint;
	}
	var trackParamNames = ['s1', 's2', 's3', 's4', 'eauuid', ''];
	endPoint += '&';
	trackParamNames.forEach(function(key) {
		if (indexedDBConfig.storedDataMap.has(key)) {
			endPoint += key + '=' + indexedDBConfig.storedDataMap.get(key) + '&';
		}
	});
	return endPoint;
};

function loadDataFromDBToMap(dbConfig) {
	return new Promise(function (resolve, reject) {
		var request = indexedDB.open(dbConfig.baseName, dbConfig.version);
		request.onupgradeneeded = function (event) {
			console.log('Resolve onupgradeneeded: ' + dbConfig.baseName);
			resolve(event);
		};
		request.onsuccess = function (event) {
			var db = request.result;
			try {
				var transaction = db.transaction([dbConfig.storeName], 'readwrite');
				var objectStore = transaction.objectStore(dbConfig.storeName);
				objectStore.openCursor(null, 'prev').onsuccess = function (event) {
					var cursor = event.target.result;
					if (cursor) {
						for (var field in cursor.value) {
							if (cursor.value[field] !== undefined && cursor.value[field] !== null) {
								dbConfig.storedDataMap.set(field, cursor.value[field]);
							}
						}
					}
					resolve(event);
				}
			} catch(e) {
				console.log('Error ' + e.name + ":" + e.message);
				resolve(event);
			}
		};
		request.onerror = function(err) {
			reject(err);
		};
	})
};

function loadDataFromDBFCM() {
	return new Promise(function (resolve, reject) {
		loadDataFromDBToMap(indexedDBFCMConfig).then(function (reponse) {
			resolve();
		}).catch(function(err) {
			var newVer = err.srcElement? parseNewVersion(err.srcElement.error.message) : indexedDBFCMConfig.version+1;
			if (newVer < 0 || newVer > 3) {
				resolve();
			} else {
				indexedDBFCMConfig.version = newVer;
				loadDataFromDBToMap(indexedDBFCMConfig).then(function (reponse) {
					resolve();
				})
			}
		});
	})
}

function parseNewVersion(erroMessage) {
	if (!notBlank(erroMessage)) {
		return -1;
	}
	var result = erroMessage.match(/\([0-9]\)/gi);
	if (!notBlank(result) || result.length !== 2) {
		return -1;
	}
	var verNew = result[1].match(/[0-9]/gi);
	if (!isNaN(parseInt(verNew))) {
		return parseInt(verNew);
	}
	return -1;
}

function notBlank(item) {
	return item !== undefined && item !== null && item != '';
}

self.addEventListener('install', function (event) {
	event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
	event.waitUntil(self.clients.claim());
});


self.addEventListener('fetch', function (event) {
	event.respondWith(
		fetch(event.request).catch(function() {
			return caches.match(event.request);
		})
	);
});

self.addEventListener('updatefound', function () {
	console.log('onupdate found');
});

function replaceMacro(url, stringParams) {
	if (typeof stringParams !== 'undefined'
		&& stringParams !== undefined
		&& stringParams !== null
		&& stringParams
		&& url) {
		Object.keys(stringParams).forEach(function (key) {
			url = url.replace("\[" + key + "\]", stringParams[key]);
		});
		return url.replace(/\[.*?\]/g, "");
	}
	return url;
}

function getCityName() {
	var city = indexedDBConfig.storedDataMap.has("city") ? indexedDBConfig.storedDataMap.get("city") : '';
	return (city !== undefined && city !== '') ? city.charAt(0).toUpperCase() + city.slice(1) : '';
}

function getCountryName() {
	var countryCode = indexedDBConfig.storedDataMap.has("country") ? indexedDBConfig.storedDataMap.get("country") : '';
	if (countryCode === undefined || countryCode === '') {
		return '';
	}
	return isoCountries.hasOwnProperty(countryCode) ? isoCountries[countryCode] : countryCode;
}

function getDeviceName() {
	var device = indexedDBConfig.storedDataMap.has("maker") ?  indexedDBConfig.storedDataMap.get("maker") : '';
	device += indexedDBConfig.storedDataMap.has("model") ?  ' ' + indexedDBConfig.storedDataMap.get("model") : '';
	return device;
}

function generateUUID() {
	var d = Date.now();
	if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
		d += performance.now();
	}
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
}

function initCountries() {
	return {
		AF: "Afghanistan",
		AX: "Aland Islands",
		AL: "Albania",
		DZ: "Algeria",
		AS: "American Samoa",
		AD: "Andorra",
		AO: "Angola",
		AI: "Anguilla",
		AQ: "Antarctica",
		AG: "Antigua And Barbuda",
		AR: "Argentina",
		AM: "Armenia",
		AW: "Aruba",
		AU: "Australia",
		AT: "Austria",
		AZ: "Azerbaijan",
		BS: "Bahamas",
		BH: "Bahrain",
		BD: "Bangladesh",
		BB: "Barbados",
		BY: "Belarus",
		BE: "Belgium",
		BZ: "Belize",
		BJ: "Benin",
		BM: "Bermuda",
		BT: "Bhutan",
		BO: "Bolivia",
		BA: "Bosnia And Herzegovina",
		BW: "Botswana",
		BV: "Bouvet Island",
		BR: "Brazil",
		IO: "British Indian Ocean Territory",
		BN: "Brunei Darussalam",
		BG: "Bulgaria",
		BF: "Burkina Faso",
		BI: "Burundi",
		KH: "Cambodia",
		CM: "Cameroon",
		CA: "Canada",
		CV: "Cape Verde",
		KY: "Cayman Islands",
		CF: "Central African Republic",
		TD: "Chad",
		CL: "Chile",
		CN: "China",
		CX: "Christmas Island",
		CC: "Cocos (Keeling) Islands",
		CO: "Colombia",
		KM: "Comoros",
		CG: "Congo",
		CD: "Congo, Democratic Republic",
		CK: "Cook Islands",
		CR: "Costa Rica",
		CI: "Cote D'Ivoire",
		HR: "Croatia",
		CU: "Cuba",
		CY: "Cyprus",
		CZ: "Czech Republic",
		DK: "Denmark",
		DJ: "Djibouti",
		DM: "Dominica",
		DO: "Dominican Republic",
		EC: "Ecuador",
		EG: "Egypt",
		SV: "El Salvador",
		GQ: "Equatorial Guinea",
		ER: "Eritrea",
		EE: "Estonia",
		ET: "Ethiopia",
		FK: "Falkland Islands (Malvinas)",
		FO: "Faroe Islands",
		FJ: "Fiji",
		FI: "Finland",
		FR: "France",
		GF: "French Guiana",
		PF: "French Polynesia",
		TF: "French Southern Territories",
		GA: "Gabon",
		GM: "Gambia",
		GE: "Georgia",
		DE: "Germany",
		GH: "Ghana",
		GI: "Gibraltar",
		GR: "Greece",
		GL: "Greenland",
		GD: "Grenada",
		GP: "Guadeloupe",
		GU: "Guam",
		GT: "Guatemala",
		GG: "Guernsey",
		GN: "Guinea",
		GW: "Guinea-Bissau",
		GY: "Guyana",
		HT: "Haiti",
		HM: "Heard Island & Mcdonald Islands",
		VA: "Holy See (Vatican City State)",
		HN: "Honduras",
		HK: "Hong Kong",
		HU: "Hungary",
		IS: "Iceland",
		IN: "India",
		ID: "Indonesia",
		IR: "Iran, Islamic Republic Of",
		IQ: "Iraq",
		IE: "Ireland",
		IM: "Isle Of Man",
		IL: "Israel",
		IT: "Italy",
		JM: "Jamaica",
		JP: "Japan",
		JE: "Jersey",
		JO: "Jordan",
		KZ: "Kazakhstan",
		KE: "Kenya",
		KI: "Kiribati",
		KR: "Korea",
		KW: "Kuwait",
		KG: "Kyrgyzstan",
		LA: "Lao People's Democratic Republic",
		LV: "Latvia",
		LB: "Lebanon",
		LS: "Lesotho",
		LR: "Liberia",
		LY: "Libyan Arab Jamahiriya",
		LI: "Liechtenstein",
		LT: "Lithuania",
		LU: "Luxembourg",
		MO: "Macao",
		MK: "Macedonia",
		MG: "Madagascar",
		MW: "Malawi",
		MY: "Malaysia",
		MV: "Maldives",
		ML: "Mali",
		MT: "Malta",
		MH: "Marshall Islands",
		MQ: "Martinique",
		MR: "Mauritania",
		MU: "Mauritius",
		YT: "Mayotte",
		MX: "Mexico",
		FM: "Micronesia, Federated States Of",
		MD: "Moldova",
		MC: "Monaco",
		MN: "Mongolia",
		ME: "Montenegro",
		MS: "Montserrat",
		MA: "Morocco",
		MZ: "Mozambique",
		MM: "Myanmar",
		NA: "Namibia",
		NR: "Nauru",
		NP: "Nepal",
		NL: "Netherlands",
		AN: "Netherlands Antilles",
		NC: "New Caledonia",
		NZ: "New Zealand",
		NI: "Nicaragua",
		NE: "Niger",
		NG: "Nigeria",
		NU: "Niue",
		NF: "Norfolk Island",
		MP: "Northern Mariana Islands",
		NO: "Norway",
		OM: "Oman",
		PK: "Pakistan",
		PW: "Palau",
		PS: "Palestinian Territory, Occupied",
		PA: "Panama",
		PG: "Papua New Guinea",
		PY: "Paraguay",
		PE: "Peru",
		PH: "Philippines",
		PN: "Pitcairn",
		PL: "Poland",
		PT: "Portugal",
		PR: "Puerto Rico",
		QA: "Qatar",
		RE: "Reunion",
		RO: "Romania",
		RU: "Russian Federation",
		RW: "Rwanda",
		BL: "Saint Barthelemy",
		SH: "Saint Helena",
		KN: "Saint Kitts And Nevis",
		LC: "Saint Lucia",
		MF: "Saint Martin",
		PM: "Saint Pierre And Miquelon",
		VC: "Saint Vincent And Grenadines",
		WS: "Samoa",
		SM: "San Marino",
		ST: "Sao Tome And Principe",
		SA: "Saudi Arabia",
		SN: "Senegal",
		RS: "Serbia",
		SC: "Seychelles",
		SL: "Sierra Leone",
		SG: "Singapore",
		SK: "Slovakia",
		SI: "Slovenia",
		SB: "Solomon Islands",
		SO: "Somalia",
		ZA: "South Africa",
		GS: "South Georgia And Sandwich Isl.",
		ES: "Spain",
		LK: "Sri Lanka",
		SD: "Sudan",
		SR: "Suriname",
		SJ: "Svalbard And Jan Mayen",
		SZ: "Swaziland",
		SE: "Sweden",
		CH: "Switzerland",
		SY: "Syrian Arab Republic",
		TW: "Taiwan",
		TJ: "Tajikistan",
		TZ: "Tanzania",
		TH: "Thailand",
		TL: "Timor-Leste",
		TG: "Togo",
		TK: "Tokelau",
		TO: "Tonga",
		TT: "Trinidad And Tobago",
		TN: "Tunisia",
		TR: "Turkey",
		TM: "Turkmenistan",
		TC: "Turks And Caicos Islands",
		TV: "Tuvalu",
		UG: "Uganda",
		UA: "Ukraine",
		AE: "United Arab Emirates",
		GB: "United Kingdom",
		US: "United States",
		UM: "United States Outlying Islands",
		UY: "Uruguay",
		UZ: "Uzbekistan",
		VU: "Vanuatu",
		VE: "Venezuela",
		VN: "Viet Nam",
		VG: "Virgin Islands, British",
		VI: "Virgin Islands, U.S.",
		WF: "Wallis And Futuna",
		EH: "Western Sahara",
		YE: "Yemen",
		ZM: "Zambia",
		ZW: "Zimbabwe"
	};
}

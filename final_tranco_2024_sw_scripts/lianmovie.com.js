/* eslint-disable no-unused-vars */
importScripts('ngsw-worker.js');

class KeyValueStorage {
    constructor() {
        this.dbName = '3cx-key-value-storage';
        this.storeName = 'store';
    }

    async openDB() {
        // ask to open the db
        return new Promise((resolve, reject) => {
            const openRequest = self.indexedDB.open(this.dbName, 1);
            openRequest.onerror = (event) => {
                reject(event.target.errorCode);
            };

            openRequest.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: 'key' });
                }
            };

            openRequest.onsuccess = (event) => {
                resolve(event.target.result);
            };
        });
    }

    async getDb() {
        this.dbInstance = this.dbInstance ? this.dbInstance : await this.openDB();
        return this.dbInstance;
    }

    async addToStore(key, value) {
        // start a transaction of actions you want to submit
        const db = await this.getDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readwrite');
            // create an object store
            const store = transaction.objectStore(this.storeName);
            // add key and value to the store
            const request = store.put({ key, value });

            request.onsuccess = () => {
                console.log('added to the store', { key: value }, request.result);
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };

            transaction.onerror = (event) => {
                console.log('trans failed', event);
            };
        });
    }

    async getFromStore(key) {
        const db = await this.getDb();
        return new Promise((resolve, reject) => {
            // start a transaction
            const transaction = db.transaction(this.storeName, 'readwrite');
            // create an object store
            const store = transaction.objectStore(this.storeName);
            // get key and value from the store
            const request = store.get(key);

            request.onsuccess = (event) => {
                resolve(event.target.result.value);
            };

            request.onerror = () => {
                reject(request.error);
            };

            transaction.onerror = (event) => {
                reject(event);
            };
        });
    }
}

const translations = {
    en: {
        'Incoming call': 'Incoming call',
        'Missed call': 'Missed call',
        'Call ended': 'Call ended',
        Answer: 'Answer',
        Decline: 'Decline',
        Clear: 'Clear',
        Reply: 'Reply',
        Unknown: 'Unknown'
    },
    'en-gb': {
        'Incoming call': 'Incoming call',
        'Missed call': 'Missed call',
        'Call ended': 'Call ended',
        Answer: 'Answer',
        Decline: 'Decline',
        Clear: 'Clear',
        Reply: 'Reply',
        Unknown: 'Unknown'
    },
    de: {
        'Incoming call': 'Eingehender Anruf',
        'Missed call': 'Verpasster Anruf',
        'Call ended': 'Anruf beendet',
        Answer: 'Annehmen',
        Decline: 'Ablehnen',
        Clear: 'Löschen',
        Reply: 'Antwort',
        Unknown: 'Unbekannt'
    },
    fr: {
        'Incoming call': 'Appel entrant',
        'Missed call': 'Appel manqué',
        'Call ended': 'Appel terminé',
        Answer: 'Réponse',
        Decline: 'Refus',
        Clear: 'Effacer',
        Reply: 'Répondre',
        Unknown: 'Inconnu'
    },
    es: {
        'Incoming call': 'Llamada entrante',
        'Missed call': 'Llamada Perdida',
        'Call ended': 'Llamada finalizada',
        Answer: 'Atender',
        Decline: 'Rechazar',
        Clear: 'Eliminar',
        Reply: 'Responder',
        Unknown: 'Desconocido'
    },
    it: {
        'Incoming call': 'Chiamata in arrivo',
        'Missed call': 'Chiamata persa',
        'Call ended': 'Chiamata terminata',
        Answer: 'Rispondi',
        Decline: 'Rifiuta',
        Clear: 'Pulisci',
        Reply: 'Rispondi',
        Unknown: 'Sconosciuto'
    },
    'pt-br': {
        'Incoming call': 'Chamada recebida',
        'Missed call': 'Chamada perdida',
        'Call ended': 'Chamada finalizada',
        Answer: 'Atender',
        Decline: 'Rejeitar',
        Clear: 'Limpar',
        Reply: 'Desconhecido',
    },
    nl: {
        'Incoming call': 'Inkomende oproep',
        'Missed call': 'Gemiste oproep',
        'Call ended': 'Oproep beëindigd',
        Answer: 'Opnemen',
        Decline: 'Afwijzen',
        Clear: 'Wissen',
        Reply: 'Beantwoorden',
        Unknown: 'Onbekend'
    },
    ru: {
        'Incoming call': 'Входящий звонок',
        'Missed call': 'Пропущенный вызов',
        'Call ended': 'Вызов завершен',
        Answer: 'Ответить',
        Decline: 'Отклонить',
        Clear: 'Очистить',
        Reply: 'Ответить',
        Unknown: 'Неизвестный'
    },
    pl: {
        'Incoming call': 'Poł. przychodzące',
        'Missed call': 'Połączenie nieodebrane',
        'Call ended': 'Poł. zakończone',
        Answer: 'Odbierz',
        Decline: 'Odrzuć',
        Clear: 'Wyczyść',
        Reply: 'Odpowiedz',
        Unknown: 'Nieznany'
    },
    'zh-cn': {
        'Incoming call': '来电',
        'Missed call': '未接电话',
        'Call ended': '通话结束',
        Answer: '应答',
        Decline: '拒绝',
        Clear: '清除',
        Reply: '回复',
        Unknown: '未知'
    },
    tr: {
        'Incoming call': 'Gelen Çağrı',
        'Missed call': 'Cevapsız arama',
        'Call ended': 'Çağrı Sonlandırıldı',
        Answer: 'Cevapla',
        Decline: 'Reddet',
        Clear: 'Sil',
        Reply: 'Yanıtla',
        Unknown: 'Bilinmiyor'
    },
    cs: {
        'Incoming call': 'Příchozí hovor',
        'Missed call': 'Zmeškaný hovor',
        'Call ended': 'Ukončení hovoru',
        Answer: 'Přijmout',
        Decline: 'Konec',
        Clear: 'Vymazat',
        Reply: 'Odpověď',
        Unknown: 'Neznámý'
    },
};

async function setLang(lang) {
    // const myLang = lang || navigator.language || navigator.userLanguage;
    const storage = new KeyValueStorage();
    if (lang) {
        await storage.addToStore('lang', lang);
    }
}

async function getLang() {
    try {
        const storage = new KeyValueStorage();
        const lang = await storage.getFromStore('lang');
        return lang || navigator.language || 'en';
    }
    catch {
        return navigator.language || 'en';
    }
}

async function setSilentMode(silentMode) {
    const storage = new KeyValueStorage();
    await storage.addToStore('silentMode', !!silentMode);
}

async function getSilentMode() {
    try {
        const storage = new KeyValueStorage();
        const silentMode = await storage.getFromStore('silentMode');
        return silentMode || false;
    }
    catch {
        return false;
    }
}

async function getMyClients() {
    // Get my clients and exclude popout urls
    return (await self.clients.matchAll({ type: 'window' })).filter((client) => {
        const matchingUrl = new URL(client.url);
        matchingUrl.search = '';

        const excludeExactlyMatched = ['#/receptionist', '#/wallboard', '#/activecalls', '#/queue_calls', '#/login', '#/provision', '#/call', '#/dialer'];
        return !excludeExactlyMatched.some(url => matchingUrl.hash.toLowerCase() === url || matchingUrl.hash.toLowerCase().startsWith(`${url}?`))
            && !matchingUrl.hash.toLowerCase().startsWith('#/reports');
    });
}

async function shouldSuppressNotification(data) {
    const windowClients = await getMyClients();
    const focusedClient = windowClients.find((client) => client.focused);
    if (!focusedClient) {
        return false;
    }

    const chatId = data.notification.data.chat;
    if (chatId !== undefined) {
        // Suppress chat notifications if on the same chat
        const expectedChatUrl = new URL(self.registration.scope);
        expectedChatUrl.hash = `#/chat/${chatId}`;
        return expectedChatUrl.href === focusedClient.url;
    }
    return true;
}

const notificationsByTag = {};

async function translate(current) {
    if (!current.notification) {
        // Something went wrong
        return current;
    }
    const dict = translations[await getLang()] ?? translations.en;
    current.notification.title = dict[current.notification.title] || current.notification.title;
    /*     if (current.notification.body.trim() === '') { // TODO we dont need to show Anon
        current.notification.body = 'dict.Unknown';
    } */
    current.notification.actions?.forEach((action) => {
        action.title = dict[action.title] || action.title;
    });

    // Get current notification
    const prev = notificationsByTag[current.notification.tag];
    if (prev && prev.notification.timestamp > current.notification.timestamp) {
        // Notification order fucked up we repeat previous notification
        return prev;
    }
    // Store notification
    notificationsByTag[current.notification.tag] = current;
    return current;
}

async function processMessageNotification(current) {
    if (!current.notification) {
        // Something went wrong
        return current;
    }

    const silentMode = await getSilentMode();
    current.notification.silent = silentMode;
    return current;
}

async function getMatchingClient(urlToOpen) {
    const windowClients = await getMyClients();
    // Try to find exact match
    const url = new URL(urlToOpen);
    // Remove params
    url.search = '';
    const exactMatchedClient = windowClients.find((client) => {
        const matchingUrl = new URL(client.url);
        // Remove params
        matchingUrl.search = '';
        return matchingUrl.hash.toLowerCase() === url.hash.toLowerCase();
    });
    if (exactMatchedClient) {
        return exactMatchedClient;
    }

    // Return last focused
    return windowClients[0];
}

addEventListener('message', (event) => {
    const data = event.data;
    if (data?.type) {
        switch (data.type) {
            case 'lang': event.waitUntil((async () => {
                await setLang(data.value);
            })()); break;
            case 'silentMode': event.waitUntil((async () => {
                await setSilentMode(data.value);
            })()); break;
            default: break;
        }
    }
});

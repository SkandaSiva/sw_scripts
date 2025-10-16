"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var sw = self;
sw.addEventListener('install', function (evt) {
    sw.skipWaiting();
});
sw.addEventListener('activate', function (event) {
    event.waitUntil(sw.clients.claim());
});
sw.addEventListener("push", function (event) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var receivedData, _b, title, _c, link, _d, body, _e, icon, _f, image, subscription;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    if (!(Notification.permission == "granted")) return [3 /*break*/, 1];
                    try {
                        receivedData = (_a = event === null || event === void 0 ? void 0 : event.data) === null || _a === void 0 ? void 0 : _a.json();
                        if (!receivedData)
                            throw "Event had no data-field";
                        _b = receivedData.title, title = _b === void 0 ? "Max-Planck-Gesellschaft" : _b, _c = receivedData.link, link = _c === void 0 ? "https://www.mpg.de" : _c, _d = receivedData.body, body = _d === void 0 ? "" : _d, _e = receivedData.icon, icon = _e === void 0 ? "/favicon.ico" : _e, _f = receivedData.image, image = _f === void 0 ? "" : _f;
                        event.waitUntil(sw.registration.showNotification(title, {
                            body: body,
                            icon: icon,
                            data: { link: link },
                            image: image,
                            requireInteraction: true
                        }));
                    }
                    catch (exc) {
                        console.error("Push-JSON Data not available", exc);
                    }
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, sw.registration.pushManager.getSubscription()];
                case 2:
                    subscription = _g.sent();
                    if (subscription)
                        subscription.unsubscribe();
                    _g.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
});
function openOrFocusWindow(link) {
    return __awaiter(this, void 0, void 0, function () {
        var clientList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sw.clients.matchAll({ type: "window" })];
                case 1:
                    clientList = _a.sent();
                    clientList.forEach(function (client) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(client.url.endsWith(link) && 'focus' in client)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, client.focus()];
                                    case 1: return [2 /*return*/, _a.sent()];
                                    case 2: return [2 /*return*/];
                                }
                            });
                        });
                    });
                    return [4 /*yield*/, sw.clients.openWindow(link)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
sw.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(openOrFocusWindow(event.notification.data.link));
});

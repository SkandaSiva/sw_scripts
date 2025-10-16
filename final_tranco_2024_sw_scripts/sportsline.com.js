// 86acbd31cd7c09cf30acb66d2fbedc91daa48b86:1568737440.249453
importScripts("https://aswpsdkus.com/notify/v1/ua-sdk.min.js");

uaSetup.worker(self, {
  defaultIcon:
    "https://www.sportsline.com/apple\u002Dtouch\u002Dicon\u002D256x256.png",
  defaultTitle: "SPORTSLINE",
  defaultActionURL: "https://www.sportsline.com",
  appKey: "pyFn9ld_TDGJ2GNzwToqOQ",
  token:
    "MTpweUZuOWxkX1RER0oyR056d1RvcU9ROkpZUW95UmpGSEZacmJUd2x1YVYwa1ZVV0hlajB1dlROQ0JlUExCaUJLN2s",
  vapidPublicKey:
    "BHtPNBLZU3Tp3N8Gy1M2r0BV_WNW_2goJjqpfDTMnTC7-FT3KACJUN1Go8gd4DpSyM6hhsThzQQjx__A5rTGz0Q="
});
//Listen for the message event
self.addEventListener("message", function(event) {
  if (event.data.action === "skipWaiting") {
    console.log("skip waiting");
    self.skipWaiting();
  }
});

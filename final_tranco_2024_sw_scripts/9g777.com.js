//service worker的基本需求，需要訂閱fetch，否則pwa無法生效
self.addEventListener("fetch", (event) => {
  //just do nothing
 });
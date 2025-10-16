const BASEURL = 'https://g.alicdn.com/pds-next/edm-ui/0.31.4/';
const KEY = 'pro'
const MAX = 1000;
const READING = 'r';
const DELETING = 'd';
const CDN = /alicdn\.com/
const statusMap = {};
let deleting = false;
let debug = false;

const bc = new BroadcastChannel("window_sw");
bc.onmessage = function(ev) {
  if(ev.data && typeof ev.data.debug !== undefined) debug = ev.data.debug;
};

const log = (...args) => debug && console.info(...args);

async function addResourcesToCache(resources) {
  if(!BASEURL) return;
  const cache = await caches.open(KEY);
  // 优先缓存 js
  const list = resources.sort((a, b) => {
    const fileOrder = {
      js: 0,
      css: 1,
      png: 2,
    }
    const extensionA = a.split('.').pop().toLowerCase();
    const extensionB = b.split('.').pop().toLowerCase();
    if (fileOrder[extensionA] < fileOrder[extensionB]) {
      return -1;
    } else if (fileOrder[extensionA] > fileOrder[extensionB]) {
      return 1;
    } else {
      return a.localeCompare(b);
    }
  })
  setTimeout(async () => {
    // 避免占用过多网络线程
    for(const r of list) {
      const url = /^http/.test(r) ? r : BASEURL+r
      const req = new Request(url);
      const keys = (await cache.keys()||[]).map(it => it.url);
	  if(keys.includes(url)) {
        log('sw:cache.skip', url);
        continue;
      }
      log('sw:cache.preload', url);
      const resp = await fetch(req);
      putInCache(req, resp);
    }
  }, Math.random() * 10000);
};

async function putInCache(request, response) {
  const cache = await caches.open(KEY);
  if (CDN.test(request.url) && MAX !== 0) {
    try {
      if (request.method !== 'POST') {
        log('sw:cache.put', request.url);
        await cache.put(request, response);
      }
    } catch (e) {
      console.error(e);
    }
  }
  checkSize();
};

async function cacheFirst ({
  request,
  preloadResponsePromise,
  fallbackUrl
}) {
  statusMap[request.url] = READING;
  const responseFromCache = await caches.match(request);
  delete statusMap[request.url];
  // 缓存命中
  if (responseFromCache) {
    log('sw:hit', request.url);
    return responseFromCache;
  }
  // 缓存未命中
  const preloadResponse = await preloadResponsePromise;
  if (preloadResponse) {
    // 只做新增
    putInCache(request, preloadResponse.clone());
    return preloadResponse;
  }
  // 保底二次查询
  try {
    const responseFromNetwork = await fetch(request.clone());
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    return new Response('Network error happened', {
      status: 408,
      headers: {
        'Content-Type': 'text/plain'
      },
    });
  }
};

const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    await self.registration.navigationPreload.enable();
  }
};

self.addEventListener('activate', async (event) => {
  // event.waitUntil(enableNavigationPreload());
});

self.addEventListener('install', (event) => {
  self.skipWaiting()
});

self.addEventListener('fetch', (event) => {
  const { request, preloadResponse } = event;
  log('sw:listen', request.url);
  // 不缓存非 CDN 请求
  if (!CDN.test(request.url) || request.method !== 'GET' || statusMap[request.url] === DELETING) {
    log('sw:bypass', request.url);
    return;
  }
  event.respondWith(
    cacheFirst({
      request,
      preloadResponsePromise: preloadResponse,
      fallbackUrl: request.url,
    }),
  );
});
// 标记删除，先进先出
async function checkSize() {
  if (deleting) return;
  deleting = true
  const cache = await caches.open(KEY);
  const keys = await cache.keys()
  let size = keys.length;
  if (size > MAX) {
    log('sw:cache.delete...');
    const avList = keys.filter(it => statusMap[it] !== READING)
    const markedList = avList.slice(MAX ? Math.max(avList.length - MAX, 0) : 0, avList.length)
    try {
      // 上锁
      markedList.forEach(it => statusMap[it] = DELETING)
      // 删除
      await markedList.map(key => cache.delete(key));
      // 解锁
      markedList.forEach(it => delete statusMap[it]);
      size = (await cache.keys()).length || 0;
    } catch (e) {
      console.error(e)
    } finally {
      deleting = false
      if (size > MAX) checkSize();
    }
  } else {
    deleting = false
  }
};
checkSize();
addResourcesToCache([
  'CropperImageDialog.css',
  'DocViewer.css',
  'MarkdownEditor.css',
  'MaterialIcons-Regular.ttf',
  'SimplePreviewFrame.css',
  'alipay.png',
  'crc-lib.min.js',
  'dingding.png',
  'favicon.ico',
  'fontawesome-webfont.svg',
  'fontawesome-webfont.ttf',
  'fonts/MaterialIcons-Regular.eot',
  'fonts/MaterialIcons-Regular.woff',
  'fonts/MaterialIcons-Regular.woff2',
  'fonts/fontawesome-webfont.eot',
  'fonts/fontawesome-webfont.woff',
  'fonts/fontawesome-webfont.woff2',
  'img/aliyun.png',
  'img/audio.png',
  'img/audio1.png',
  'img/avatar.png',
  'img/choose-one.png',
  'img/download-guide/ding_android_guide.png',
  'img/download-guide/ding_ios_guide.png',
  'img/download-guide/wx_guide.png',
  'img/enterprise-info.png',
  'img/enterprise_logo.png',
  'img/exclusive_configuration_bg.png',
  'img/flow_blue.png',
  'img/flow_red.png',
  'img/flow_yellow.png',
  'img/hello-admin.png',
  'img/import_user_edm.png',
  'img/import_user_pds.png',
  'img/liwu.png',
  'img/modal.png',
  'img/mounted_drive_uninstall.png',
  'img/multi-choose.png',
  'img/no-choose-file.png',
  'img/no-data/404.png',
  'img/no-data/drive.png',
  'img/no-data/ishare.png',
  'img/no-data/mysharelinks.png',
  'img/no-data/share.png',
  'img/no-data/star.png',
  'img/no-details.png',
  'img/notice.png',
  'img/plugin-mounted-drive.png',
  'img/preview_watermark_bg.png',
  'img/schematic_home.png',
  'img/schematic_login.png',
  'img/schematic_user.png',
  'img/selected.png',
  'img/share_link_management_bg.png',
  'img/share_management_bg.png',
  'img/storage_space_blue.png',
  'img/storage_space_red.png',
  'img/storage_space_yellow.png',
  'img/sync_disk_bg.png',
  'img/transfer-success.png',
  'img/upload.png',
  'img/user_number_blue.png',
  'img/user_number_red.png',
  'img/user_number_yellow.png',
  'index.css',
  'index2.css',
  'js/CropperImageDialog.js',
  'js/DocViewer.js',
  'js/MarkdownEditor.js',
  'js/SimplePreviewFrame.js',
  'js/crc-lib.min.js',
  'js/hls.js',
  'js/html2canvas.esm.js',
  'js/index.js',
  'js/index2.js',
  'js/index3.js',
  'js/index4.js',
  'js/index5.js',
  'js/indexTab.js',
  'js/jszip.min.js',
  'js/markdown-it.js',
  'js/oceanic-next.js',
  'js/pptxgen.es.js',
  'js/sortable.esm.js',
  'js/video.es.js',
  'js/viewer.esm.js',
  'js/vue-codemirror.js',
  'js/xlsx.js',
  'jsstore.min.js',
  'jsstore.worker.min.js',
  'logo.png',
  'markdown-it.css',
  'material-icon-fix-linux-electron.css',
  'novice/add_drop_btn.png',
  'novice/admin_console.png',
  'novice/admin_create_user.png',
  'novice/admin_drive_del.png',
  'novice/admin_menu.png',
  'novice/expand.png',
  'novice/expire_notify.png',
  'novice/handover.png',
  'novice/home.png',
  'novice/product_notice.png',
  'novice/search.png',
  'novice/share_enable.png',
  'novice/share_link_enable.png',
  'novice/transfer_btn.png',
  'oceanic-next.css',
  'ram.png',
  'video-js.css',
  'vue-codemirror.css',
  'https://g.alicdn.com/IMM/office-js/1.1.15/aliyun-web-office-sdk.min.js',
  'https://g.alicdn.com/IMM/office-js-plugins/1.2.0/aliyun-web-office-plugins.min.js'
]);

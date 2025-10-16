self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
  //console.log(`${new Date().toISOString()} - Service Worker installed`);
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  //console.log(`${new Date().toISOString()} - Service Worker activated`);
});

self.addEventListener('message', event => {
  if (event.data.action === 'storeU2T_UU_ID') {
    storeU2T_UU_ID(event.data.U2T_UU_ID);
  } else if (event.data.action === 'getU2T_UU_ID') {
    getOrFetchU2T_UU_ID().then(U2T_UU_ID => {
      event.source.postMessage({ U2T_UU_ID });
    });
  } else if (event.data.action === 'storeU2T_FP_ID') {
    storeU2T_FP_ID(event.data.U2T_FP_ID);
  }
});

function storeU2T_UU_ID(U2T_UU_ID) {
  const openRequest = indexedDB.open('U2T_UU_ID-store', 1);

  openRequest.onupgradeneeded = event => {
    const db = event.target.result;
    db.createObjectStore('U2T_UU_IDs', { keyPath: 'id' });
  };

  openRequest.onsuccess = event => {
    const db = event.target.result;
    const transaction = db.transaction('U2T_UU_IDs', 'readwrite');
    const store = transaction.objectStore('U2T_UU_IDs');
    store.put({ id: 'U2T_UU_ID', value: U2T_UU_ID });

    transaction.oncomplete = () => {
      //console.log(`${new Date().toISOString()} - U2T_UU_ID stored successfully: ${U2T_UU_ID}`);
    };

    transaction.onerror = () => {
      //console.error(`${new Date().toISOString()} - Failed to store U2T_UU_ID:`, transaction.error);
    };
  };

  openRequest.onerror = event => {
    //console.error(`${new Date().toISOString()} - Failed to open IndexedDB:`, event.target.error);
  };
}

function storeU2T_FP_ID(U2T_FP_ID) {
  const openRequest = indexedDB.open('U2T_UU_ID-store', 1);

  openRequest.onupgradeneeded = event => {
    const db = event.target.result;
    db.createObjectStore('U2T_UU_IDs', { keyPath: 'id' });
  };

  openRequest.onsuccess = event => {
    const db = event.target.result;
    const transaction = db.transaction('U2T_UU_IDs', 'readwrite');
    const store = transaction.objectStore('U2T_UU_IDs');
    store.put({ id: 'U2T_FP_ID', value: U2T_FP_ID });

    transaction.oncomplete = () => {
      //console.log(`${new Date().toISOString()} - U2T_FP_ID stored successfully: ${U2T_FP_ID}`);
    };

    transaction.onerror = () => {
      //console.error(`${new Date().toISOString()} - Failed to store U2T_FP_ID:`, transaction.error);
    };
  };

  openRequest.onerror = event => {
    //console.error(`${new Date().toISOString()} - Failed to open IndexedDB:`, event.target.error);
  };
}

function getOrFetchU2T_UU_ID() {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open('U2T_UU_ID-store', 1);

    openRequest.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction('U2T_UU_IDs', 'readonly');
      const store = transaction.objectStore('U2T_UU_IDs');
      const getRequest = store.get('U2T_UU_ID');

      getRequest.onsuccess = () => {
        if (getRequest.result) {
          //console.log(`${new Date().toISOString()} - U2T_UU_ID found in IndexedDB`);
          resolve(getRequest.result.value);
        } else {
          fetchU2T_UU_IDFromServer(resolve, reject);
        }
      };

      getRequest.onerror = () => {
        reject(getRequest.error);
      };
    };

    openRequest.onerror = () => {
      reject(openRequest.error);
    };
  });
}

function getOrFetchU2T_FP_ID() {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open('U2T_UU_ID-store', 1);

    openRequest.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction('U2T_UU_IDs', 'readonly');
      const store = transaction.objectStore('U2T_UU_IDs');
      const getRequest = store.get('U2T_FP_ID');

      getRequest.onsuccess = () => {
        if (getRequest.result) {
          //console.log(`${new Date().toISOString()} - U2T_FP_ID found in IndexedDB`);
          resolve(getRequest.result.value);
        } else {
          fetchU2T_FP_IDFromServer(resolve, reject);
        }
      };

      getRequest.onerror = () => {
        reject(getRequest.error);
      };
    };

    openRequest.onerror = () => {
      reject(openRequest.error);
    };
  });
}

function fetchU2T_UU_IDFromServer(resolve, reject) {
  fetch('https://u2t.dev/U2T_UU_ID', {
    method: 'GET',
    credentials: 'include'
  }).then(res => res.text()).then(data => {
    storeU2T_UU_ID(data);
    resolve(data);
  }).catch(error => {
    reject(error);
  });
}

function fetchU2T_FP_IDFromServer(resolve, reject) {
  fetch('https://u2t.dev/U2T_FP_ID', {
    method: 'GET',
    credentials: 'include'
  }).then(res => res.text()).then(data => {
    storeU2T_FP_ID(data);
    resolve(data);
  }).catch(error => {
    reject(error);
  });
}

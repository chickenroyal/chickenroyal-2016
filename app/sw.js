const cacheName = 'v1.0::static';

self.addEventListener('install', event => {
  // once the SW is installed, go ahead and fetch the resources
  // to make this work offline
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        '/',
        'index.html',
        'manifest.json',
        'css/styles.min.css',
        'images/icon.png',
        'images/offline.png',
        'js/app.min.js'
      ]).then(() => self.skipWaiting());
    })
  );
});

// when the browser fetches a url, respond with cached
// object if available, or get from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(res => res || fetch(event.request))
      .catch(() => {
        // replace requests for jpgs (screenshots) with a cached offline fallback
        if (event.request.url.endsWith('.jpg')){
          return caches.match('images/offline.png'); //this is that image! :)
        }
      })
  );
});

// self.addEventListener('activate', function(event) {
//   // Calling claim() to force a "controllerchange" event on navigator.serviceWorker
//   event.waitUntil(self.clients.claim());
// });

self.addEventListener("activate", event => {
  // Replace old cached version with updated one
  function clearOldCaches(){
    return caches.keys()
      .then( keys => {
        return Promise.all(keys
          .filter(key => key.indexOf(cacheName) !== 0)
          .map(key => caches.delete(key))
        );
      });
      // .then(function (keys) {
      //   return Promise.all(
      //     keys.filter(function (key) {
      //       return !key.startsWith(cacheName);
      //     })
      //     .map(function (key) {
      //       return caches.delete(key);
      //     })
      //   );
      // });
  }

  // Calling claim() to force a "controllerchange" event on navigator.serviceWorker
  event.waitUntil(clearOldCaches()
    .then( () => self.clients.claim() )
  );

  // console.log('WORKER: activate event in progress.');
  // event.waitUntil(
  //   caches
  //     .keys()
  //     .then(function (keys) {
  //       return Promise.all(
  //         keys
  //           .filter(function (key) {
  //             return !key.startsWith(cacheName);
  //           })
  //           .map(function (key) {
  //             return caches.delete(key);
  //           })
  //       );
  //     })
  //     .then(function() {
  //       console.log('WORKER: activate completed.');
  //     })
  // );
});

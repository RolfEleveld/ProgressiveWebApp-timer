var cacheName = 'timer-offline';
var filesToCache = [
    '/',
    '/index.html',
    '/timer.js',
    '/sw.js',
    '/timer.css',
    '/icons/icon64.png',
    '/icons/icon128.png',
    '/icons/icon512.png',
  ];

//Install stage sets up the offline page in the cahche and opens a new cache
self.addEventListener('install', function (event) {
    var offlinePage = new Request('index.html');
    event.waitUntil(
        fetch(offlinePage).then(function (response) {
            return caches.open(cacheName).then(function (cache) {
                console.log('Cached offline pages during Install' + response.url);
                //return cache.put(offlinePage, response);
                return cache.addAll(filesToCache);
            });
        }));
});
self.addEventListener('activate', function(e) {
    console.log('ServiceWorker Activated');
    e.waitUntil(
      caches.keys().then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== cacheName) {
            console.log('ServiceWorker Removing old cache', key);
            return caches.delete(key);
          }
        }));
      })
    );
    return self.clients.claim();
  });
//If any fetch fails, it will show the offline page.
self.addEventListener('fetch', function (event) {
    event.respondWith(
        fetch(event.request).catch(function (error) {
            console.error('Network request Failed. Serving offline page ' + error);
            return caches.open(cacheName).then(function (cache) {
                return cache.match('index.html');
            });
        }));
});

//This is a event that can be fired from your page to tell the SW to update the offline page
self.addEventListener('refreshOffline', function (response) {
    return caches.open(cacheName).then(function (cache) {
        console.log('Offline page updated from refreshOffline event: ' + response.url);
        return cache.put(offlinePage, response);
    });
});
'use strict';

// install - initial caching
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open('dvbplus').then(function (cache) { //cache could need a polyfill
      return cache.addAll([
        '/',
        '/index.html',
        '/plan.html',
        '/manifest.json',
        '/image.png',
        '/offline.html'
      ])
    })
  );
});

// Caching requests
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open('dvbplus').then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        })
        .catch(function() {
          if (event.request.url.includes('api')) {
            return new Response(JSON.stringify('{ error: "offline"}'));
          } else {
            return cache.match('offline.html');
          }
        });
      });
    })
  );
});

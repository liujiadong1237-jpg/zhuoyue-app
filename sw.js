/* 卓越人生外壳的离线缓存：只缓存外壳自己的几个文件。软件本体和数据走 GitHub API，不在这里缓存。 */
var V = 'zy-shell-v1';
var FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-512-maskable.png', 'apple-touch-icon.png'];
self.addEventListener('install', function(e){
  e.waitUntil(caches.open(V).then(function(c){ return c.addAll(FILES); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k !== V; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== self.location.origin) return;
  e.respondWith(caches.match(e.request, {ignoreSearch:true}).then(function(hit){
    var net = fetch(e.request).then(function(r){
      if (r && r.ok){ var cl = r.clone(); caches.open(V).then(function(c){ c.put(e.request, cl); }); }
      return r;
    }).catch(function(){ return hit; });
    return hit || net;
  }));
});

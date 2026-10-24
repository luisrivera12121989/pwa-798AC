/* Service worker · Camión 798 AC. Guarda la app completa para usarla sin conexión.
   Al publicar una versión nueva, cambia el número de VERSION. */
const VERSION='798ac-v1';
const CORE=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE))); });
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('message',e=>{ if(e.data==='skip') self.skipWaiting(); });
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET') return;
  const u=new URL(r.url);
  if(u.origin!==self.location.origin) return;
  e.respondWith(
    caches.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r).then(res=>{
      if(res&&res.ok){ const cp=res.clone(); caches.open(VERSION).then(c=>c.put(r,cp)); }
      return res;
    }).catch(()=>r.mode==='navigate'?caches.match('index.html'):Response.error()))
  );
});

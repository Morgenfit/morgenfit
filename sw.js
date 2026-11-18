// Morgenfit: speichert die App für die Nutzung ohne Internet
const C='morgenfit-v2';
const CORE=['./','index.html','manifest.json','icon-180.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  // Eigene Dateien: erst Netz (für Updates), sonst Speicher
  if(u.origin===location.origin){
    e.respondWith(fetch(e.request).then(r=>{const k=r.clone();caches.open(C).then(c=>c.put(e.request,k));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));
    return;
  }
  // Schriften: aus dem Speicher, sonst laden und merken
  if(/fonts\.(googleapis|gstatic)\.com/.test(u.host)){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{const k=n.clone();caches.open(C).then(c=>c.put(e.request,k));return n})));
  }
});

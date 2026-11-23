/* MonopoLili : fonctionne même sans connexion. Change VERSION à chaque mise à jour du jeu. */
const VERSION='monopolili-v4';
const SHELL=['./','index.html','manifest.webmanifest?v=2','icon-192-v2.png','icon-512-v2.png','apple-touch-icon-v2.png','img/duo-oups.webp','img/duo-victoire.webp','img/lili-avatar.webp','img/lili-contente.webp','img/lili-coucou.webp','img/lili-explique.webp','img/lili-idee.webp','img/lili-pas-contente.webp','img/livia-idee.webp','img/livia-mission.webp','img/livia-pensive.webp'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('monopolili-')&&k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET') return;
  const url=new URL(req.url);
  // Page du jeu : on essaie le réseau (pour avoir la dernière version), sinon le cache
  if(req.mode==='navigate'){ e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(VERSION).then(c=>c.put('index.html',cp));return r;}).catch(()=>caches.match('index.html'))); return; }
  // Images, polices, etc. : le cache d'abord
  if(url.origin===location.origin||url.host.endsWith('gstatic.com')||url.host.endsWith('googleapis.com')){
    e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{ if(r.ok||r.type==='opaque'){const cp=r.clone();caches.open(VERSION).then(c=>c.put(req,cp));} return r; })));
  }
});

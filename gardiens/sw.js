/* Les Gardiens de Lili : fonctionne même sans connexion. Change VERSION à chaque mise à jour du jeu. */
const VERSION='gardiens-v12';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png','img/chateau.webp','img/map-1.webp','img/map-2.webp','img/map-3.webp','img/duo-equipe.webp','img/duo-oups.webp','img/duo-victoire.webp','img/g/zapic-1.webp','img/g/zapic-2.webp','img/g/zapic-3.webp','img/g/givrou-1.webp','img/g/givrou-2.webp','img/g/givrou-3.webp','img/g/plumo-1.webp','img/g/plumo-2.webp','img/g/plumo-3.webp','img/g/rocaillou-1.webp','img/g/rocaillou-2.webp','img/g/rocaillou-3.webp','img/g/etoilette-1.webp','img/g/etoilette-2.webp','img/g/etoilette-3.webp','img/g/lunette-1.webp','img/g/lunette-2.webp','img/g/lunette-3.webp','img/g/sousou-1.webp','img/g/sousou-2.webp','img/g/sousou-3.webp','img/f/chipeur.webp','img/f/fusee.webp','img/f/costaud.webp','img/f/casque.webp','img/f/volant.webp','img/f/fantome.webp','img/f/chef.webp','img/f/boss-taupe.webp','img/f/boss-yeti.webp','img/f/boss-dragon.webp','img/g/braisou-1.webp','img/g/braisou-2.webp','img/g/braisou-3.webp','img/g/feuillou-1.webp','img/g/feuillou-2.webp','img/g/feuillou-3.webp','img/g/gouttine-1.webp','img/g/gouttine-2.webp','img/g/gouttine-3.webp','img/lili-contente.webp','img/lili-coucou.webp','img/lili-explique.webp','img/lili-idee.webp','img/lili-mission.webp','img/lili-pas-contente.webp','img/livia-idee.webp','img/livia-mission.webp','img/livia-pensive.webp','img/princesse-contente.webp','img/princesse-inquiete.webp','img/princesse-victoire.webp'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('gardiens-')&&k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET') return;
  const url=new URL(req.url);
  // Page du jeu : on essaie le réseau (pour avoir la dernière version), sinon le cache
  if(req.mode==='navigate'){ e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(VERSION).then(c=>c.put('index.html',cp));return r;}).catch(()=>caches.match('index.html'))); return; }
  // Images, polices, etc. : le cache d'abord
  // La vidéo de lancement (lourde) : toujours depuis le réseau, jamais en cache
  if(url.pathname.endsWith('.mp4')) return;
  if(url.origin===location.origin||url.host.endsWith('gstatic.com')||url.host.endsWith('googleapis.com')){
    e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{ if(r.ok||r.type==='opaque'){const cp=r.clone();caches.open(VERSION).then(c=>c.put(req,cp));} return r; })));
  }
});

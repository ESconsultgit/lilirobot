/* Lili Parc : fonctionne même sans connexion. Change VERSION à chaque mise à jour du jeu. */
const VERSION='liliparc-v18';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png','qrcode.js',
  'img/duo-equipe.webp','img/duo-oups.webp','img/duo-victoire.webp','img/lili-avatar.webp','img/lili-contente.webp',
  'img/lili-coucou.webp','img/lili-explique.webp','img/lili-idee.webp','img/lili-mission.webp','img/lili-pas-contente.webp',
  'img/lili-perplexe.webp','img/livia-idee.webp','img/livia-mission.webp','img/livia-pensive.webp','img/livia-petite.webp',
  'badges/v50.webp','badges/v100.webp','badges/v250.webp','badges/v500.webp','badges/save1.webp','badges/save2.webp','badges/rich.webp','badges/build8.webp','badges/build16.webp','badges/star.webp','badges/event3.webp','badges/anniv.webp','badges/clean.webp','badges/safe.webp','badges/health.webp','badges/flower.webp',
  'img/ui/argent.webp','img/ui/cadenas.webp','img/ui/coeur.webp','img/ui/joueurs.webp','img/ui/longue-vue.webp','img/ui/medaille.webp','img/ui/menu.webp','img/ui/modifier.webp','img/ui/mondes.webp','img/ui/pause.webp','img/ui/play.webp','img/ui/plein-ecran.webp','img/ui/vitesse.webp','attractions/barbe-1.webp','attractions/barbe-2.webp','attractions/barbe-3.webp','attractions/canards-1.webp','attractions/canards-2.webp','attractions/canards-3.webp','attractions/carrousel-1.webp','attractions/carrousel-2.webp','attractions/carrousel-3.webp','attractions/chamboule-1.webp','attractions/chamboule-2.webp','attractions/chamboule-3.webp','attractions/churros-1.webp','attractions/churros-2.webp','attractions/churros-3.webp','attractions/train-1.webp','attractions/train-2.webp','attractions/train-3.webp','attractions/autos-1.webp','attractions/autos-2.webp','attractions/autos-3.webp','attractions/tasses-1.webp','attractions/tasses-2.webp','attractions/tasses-3.webp','attractions/chateau-1.webp','attractions/chateau-2.webp','attractions/chateau-3.webp','attractions/pirate-1.webp','attractions/pirate-2.webp','attractions/pirate-3.webp','attractions/trampo-1.webp','attractions/trampo-2.webp','attractions/trampo-3.webp','attractions/roue-1.webp','attractions/roue-2.webp','attractions/roue-3.webp'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('liliparc-')&&k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
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

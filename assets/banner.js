/* Bannière vidéo :
   - grand écran : version HD (1080p), sinon la version légère (720p)
   - chaque visite commence par une autre séquence (débuts à 0 s, 10 s et 19,42 s)
   - dès qu'on commence à descendre, la vidéo se cache et le titre devient un bandeau compact ; elle revient tout en haut */
(function(){
  const v=document.getElementById("heroVideo"); if(!v)return;
  const hero=v.closest(".hero");

  // 1. HD sur les grands écrans
  const px=Math.max(window.innerWidth,screen.width||0)*(window.devicePixelRatio||1);
  if(px>1500){
    const hd=v.getAttribute("src").replace("banner.mp4","banner-hd.mp4");
    v.src=hd; if(v.autoplay&&!matchMedia("(prefers-reduced-motion: reduce)").matches)v.play().catch(()=>{});
  }

  // 2. Une séquence de départ différente à chaque visite
  const STARTS=[0,10,19.42]; let i;
  try{i=(+(localStorage.getItem("lili-banner")??-1)+1)%STARTS.length;localStorage.setItem("lili-banner",String(i));}
  catch(e){i=Math.floor(Math.random()*STARTS.length);}
  if(STARTS[i]){
    const go=()=>{try{v.currentTime=STARTS[i];}catch(e){}};
    if(v.readyState>=1)go(); else v.addEventListener("loadedmetadata",go,{once:true});
  }

  // 3. On cache la vidéo dès le début du défilement
  if(!hero)return;
  let compact=false,userPaused=false;
  v.addEventListener("pause",()=>{if(!compact)userPaused=true;});
  v.addEventListener("play",()=>{userPaused=false;});
  function set(on){
    if(on===compact)return; compact=on;
    hero.classList.toggle("is-compact",on);
    if(on){v.pause();}
    else if(!userPaused&&!matchMedia("(prefers-reduced-motion: reduce)").matches){v.play().catch(()=>{});}
  }
  addEventListener("scroll",()=>{ if(window.scrollY>2)set(true); else if(window.scrollY<=0)set(false); },{passive:true});
  // un lien vers un chapitre : on replie avant que la page défile, pour arriver au bon endroit
  document.addEventListener("click",e=>{const a=e.target.closest('a[href^="#"]');if(a&&a.getAttribute("href")!=="#top"&&a.getAttribute("href").length>1)set(true);},true);
  if(window.scrollY>2||(location.hash&&location.hash!=="#top"))set(true);
})();

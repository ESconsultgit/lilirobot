/* Bannière : à chaque visite, la boucle commence par une autre vidéo (début de chaque séquence, en secondes). */
(function(){
  const v=document.getElementById("heroVideo"); if(!v)return;
  const STARTS=[0,10,19.42]; let i;
  try{i=(+(localStorage.getItem("lili-banner")??-1)+1)%STARTS.length;localStorage.setItem("lili-banner",String(i));}
  catch(e){i=Math.floor(Math.random()*STARTS.length);}
  if(!STARTS[i])return;
  const go=()=>{try{v.currentTime=STARTS[i];}catch(e){}};
  if(v.readyState>=1)go(); else v.addEventListener("loadedmetadata",go,{once:true});
})();

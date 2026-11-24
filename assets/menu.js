/* Menu des robots : regroupé par robot (avec ses versions), difficulté, budget, et filtres. */
(function(){
  const pm=document.getElementById("pickerMenu"),pb=document.getElementById("pickerBtn");
  if(!pm||!pb)return;
  const EN=document.documentElement.lang==="en";
  const L=(fr,en)=>EN?en:fr;
  const here=(location.pathname.split("/").pop()||"index.html");

  const RAIL='<svg viewBox="0 0 48 48" width="40" aria-hidden="true"><circle cx="24" cy="16" r="7" fill="#F4F4F0" stroke="#2F6E2B" stroke-width="2"/><rect x="4" y="25" width="40" height="5" rx="2.5" fill="#8CC63F" transform="rotate(-8 24 27)"/><path d="M24 30v12M16 42h16" stroke="#2F6E2B" stroke-width="3" stroke-linecap="round"/></svg>';
  const PLATE='<svg viewBox="0 0 48 48" width="40" aria-hidden="true"><circle cx="24" cy="10" r="5" fill="#F4F4F0" stroke="#2F6E2B" stroke-width="2"/><ellipse cx="24" cy="19" rx="19" ry="4.5" fill="#8CC63F" stroke="#2F6E2B" stroke-width="2" transform="rotate(-6 24 19)"/><path d="M11 23l-3 17M24 24v16M37 21l3 19M5 41h38" stroke="#2F6E2B" stroke-width="3" stroke-linecap="round"/></svg>';
  const SIGN='<svg viewBox="0 0 48 48" width="40" aria-hidden="true"><rect x="4" y="12" width="40" height="24" rx="5" fill="#1F4D1D"/><text x="24" y="30" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="15" fill="#C6E87F">ABC</text></svg>';
  const CAR='<svg viewBox="0 0 48 48" width="40" aria-hidden="true"><rect x="8" y="16" width="32" height="16" rx="5" fill="#8CC63F" stroke="#1F4D1D" stroke-width="2"/><rect x="18" y="9" width="12" height="7" rx="2" fill="#3D7DD8"/><circle cx="14" cy="34" r="6" fill="#1F4D1D"/><circle cx="34" cy="34" r="6" fill="#1F4D1D"/></svg>';
  const SCROLL='<svg viewBox="0 0 48 48" width="40" aria-hidden="true"><rect x="3" y="12" width="42" height="18" rx="4" fill="#8CC63F" stroke="#1F4D1D" stroke-width="2"/><rect x="7" y="15" width="34" height="11" rx="1.5" fill="#141A14"/><g fill="#FF5A4A"><circle cx="11" cy="18" r="1.3"/><circle cx="11" cy="21" r="1.3"/><circle cx="11" cy="24" r="1.3"/><circle cx="14" cy="24" r="1.3"/><circle cx="20" cy="18" r="1.3"/><circle cx="20" cy="21" r="1.3"/><circle cx="20" cy="24" r="1.3"/><circle cx="26" cy="21" r="1.3"/><circle cx="29" cy="18" r="1.3"/><circle cx="29" cy="24" r="1.3"/><circle cx="35" cy="21" r="1.3"/></g><circle cx="24" cy="36" r="4" fill="#F4F4F0" stroke="#1F4D1D" stroke-width="2"/></svg>';
  const LOCK='<svg viewBox="0 0 48 48" width="34" aria-hidden="true"><rect x="10" y="20" width="28" height="22" rx="5" fill="none" stroke="currentColor" stroke-width="3"/><path d="M16 20v-6a8 8 0 0116 0v6" fill="none" stroke="currentColor" stroke-width="3"/></svg>';
  const PRINTER='<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="7"/></svg>';
  const CLOCK='<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';

  // ---- Les robots (difficulté sur 4, budget en euros) ----
  const ROBOTS=[
    {name:L("L'Équilibriste","The Balancer"),desc:L("Garder une balle en équilibre, tout seul","Keeping a ball balanced, all by itself"),icon:RAIL,versions:[
      {href:"index.html",title:L("Version 1 · Le rail","Version 1 · The rail"),desc:L("Une balle de ping-pong sur un rail, 1 moteur","A ping-pong ball on a rail, 1 motor"),lvl:2,eur:45,time:L("3 après-midis","3 afternoons"),print:false,icon:RAIL},
      {href:"plateau.html",title:L("Version 2 · Le plateau","Version 2 · The plate"),desc:L("Une bille sur un plateau, 3 moteurs","A ball on a plate, 3 motors"),lvl:4,eur:80,time:L("5 après-midis","5 afternoons"),print:true,icon:PLATE}]},
    {name:L("L'Enseigne lumineuse","The Light-up Sign"),desc:L("Des lumières qui écrivent ton prénom","Lights that spell out your name"),icon:SIGN,versions:[
      {href:"enseigne.html",title:L("Version 1 · Les lettres 3D","Version 1 · The 3D letters"),desc:L("Ton prénom en lettres imprimées qui s'allument","Your name in printed letters that light up"),lvl:3,eur:70,time:L("2 après-midis","2 afternoons"),print:true,icon:SIGN},
      {href:"panneau.html",title:L("Version 2 · Le panneau défilant","Version 2 · The scrolling sign"),desc:L("Tes messages qui défilent, et bonjour quand quelqu'un arrive","Your messages scrolling, and hello when someone comes by"),lvl:1,eur:25,time:L("1 après-midi","1 afternoon"),print:false,printOpt:true,icon:SCROLL}]},
    {name:L("Le Rouleur","The Roller"),desc:L("Il roule et contourne les obstacles tout seul","It drives and avoids obstacles by itself"),icon:CAR,versions:[
      {href:"rouleur.html",lvl:3,eur:50,time:L("2 après-midis","2 afternoons"),print:false}]}
  ];
  const LVL={1:L("Très facile","Very easy"),2:L("Facile","Easy"),3:L("Moyen","Medium"),4:L("Expert","Expert")};
  const stars=n=>"★".repeat(n)+"☆".repeat(4-n);
  const price=e=>EN?"≈ €"+e:"≈ "+e+" €";

  function meta(v){
    return `<span class="pm-meta"><span class="pm-lvl lvl-${v.lvl}" title="${L("Difficulté","Difficulty")}"><span aria-hidden="true">${stars(v.lvl)}</span> ${LVL[v.lvl]}</span>`+
      `<span class="pm-chip">${price(v.eur)}</span><span class="pm-chip">${CLOCK}${v.time}</span>`+
      (v.print?`<span class="pm-chip pm-print">${PRINTER}${L("Imprimante 3D","3D printer")}</span>`:v.printOpt?`<span class="pm-chip pm-print">${PRINTER}${L("Impression 3D ou bois","3D print or wood")}</span>`:"")+`</span>`;
  }
  function link(v,inner,cls){
    const cur=v.href===here;
    return `<a class="robot-opt ${cls}${cur?" is-current":""}" href="${cur?"#top":v.href}"${cur?' aria-current="page"':""} data-lvl="${v.lvl}" data-eur="${v.eur}" data-print="${v.print?1:0}">${inner}</a>`;
  }
  let list="";
  ROBOTS.forEach(r=>{
    if(r.versions.length===1){
      const v=r.versions[0];
      list+=`<div class="pm-fam">`+link(v,`<span class="ico">${r.icon}</span><span><b>${r.name}</b><small>${r.desc}</small>${meta(v)}</span>`,"")+`</div>`;
    }else{
      list+=`<div class="pm-fam pm-group"><div class="pm-fam-head"><span class="ico">${r.icon}</span><span><b>${r.name}</b><small>${r.desc} · ${r.versions.length} ${L("versions","versions")}</small></span></div><div class="pm-vers">`+
        r.versions.map(v=>link(v,`<span class="ico ico-sm">${v.icon}</span><span><b>${v.title}</b><small>${v.desc}</small>${meta(v)}</span>`,"pm-ver")).join("")+`</div></div>`;
    }
  });
  list+=`<div class="pm-fam"><span class="robot-opt locked" aria-disabled="true"><span class="ico">${LOCK}</span><span><b>${L("Mystère","Mystery")}</b><small>${L("Se débloque quand tu as fini le Rouleur","Unlocks once you've finished the Roller")}</small></span></span></div>`;

  const btn=(f,v,txt)=>`<button type="button" class="pm-f" data-f="${f}" data-v="${v}" aria-pressed="false">${txt}</button>`;
  pm.innerHTML=
    `<div class="pm-head"><b>${L("Choisis ton robot","Pick your robot")}</b><button type="button" class="pm-reset" hidden>${L("Tout afficher","Show all")}</button></div>`+
    `<div class="pm-filters">`+
      `<div class="pm-row" role="group" aria-label="${L("Niveau","Level")}"><span class="pm-lab">${L("Niveau","Level")}</span>${btn("lvl",1,LVL[1])}${btn("lvl",2,LVL[2])}${btn("lvl",3,LVL[3])}${btn("lvl",4,LVL[4])}</div>`+
      `<div class="pm-row" role="group" aria-label="Budget"><span class="pm-lab">Budget</span>${btn("eur",50,EN?"up to €50":"jusqu'à 50 €")}${btn("eur",80,EN?"up to €80":"jusqu'à 80 €")}</div>`+
      `<div class="pm-row"><span class="pm-lab">${L("Matériel","Kit")}</span>${btn("noprint",1,PRINTER+L("Sans imprimante 3D","No 3D printer"))}</div>`+
    `</div>`+
    `<div class="pm-list">${list}<p class="pm-empty" hidden>${L("Aucun robot ne correspond à ces filtres. Essaie d'en enlever un !","No robot matches these filters. Try removing one!")}</p></div>`;

  // ---- Filtres (retenus dans le navigateur) ----
  const KEY="lili-menu-filtres";
  let F={lvl:null,eur:null,noprint:null};
  try{F=Object.assign(F,JSON.parse(localStorage.getItem(KEY)||"{}"));}catch(e){}
  function apply(){
    pm.querySelectorAll(".pm-f").forEach(b=>b.setAttribute("aria-pressed",String(String(F[b.dataset.f])===b.dataset.v)));
    let shown=0;
    pm.querySelectorAll(".pm-fam").forEach(fam=>{
      let any=false;
      fam.querySelectorAll("a.robot-opt").forEach(a=>{
        const ok=(!F.lvl||+a.dataset.lvl===+F.lvl)&&(!F.eur||+a.dataset.eur<=+F.eur)&&(!F.noprint||a.dataset.print==="0");
        a.hidden=!ok; if(ok)any=true;
      });
      const locked=fam.querySelector(".locked");
      if(locked){fam.hidden=!!(F.lvl||F.eur||F.noprint);}else{fam.hidden=!any;if(any)shown++;}
    });
    pm.querySelector(".pm-empty").hidden=shown>0;
    pm.querySelector(".pm-reset").hidden=!(F.lvl||F.eur||F.noprint);
    try{localStorage.setItem(KEY,JSON.stringify(F));}catch(e){}
  }
  pm.addEventListener("click",e=>{
    const b=e.target.closest(".pm-f");
    if(b){const f=b.dataset.f;F[f]=String(F[f])===b.dataset.v?null:b.dataset.v;apply();return;}
    if(e.target.closest(".pm-reset")){F={lvl:null,eur:null,noprint:null};apply();return;}
    if(e.target.closest(".is-current")){pm.hidden=true;pb.setAttribute("aria-expanded","false");}
  });
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!pm.hidden){pm.hidden=true;pb.setAttribute("aria-expanded","false");pb.focus();}});
  apply();
})();

/* Menu « Détente » : les jeux de Lili. Pour ajouter un jeu, ajoute une ligne dans JEUX. */
(function(){
  if(document.getElementById("funBtn"))return;
  const EN=document.documentElement.lang==="en";
  const L=(fr,en)=>EN?en:fr;

  const SOON='<svg viewBox="0 0 48 48" width="34" aria-hidden="true"><circle cx="24" cy="24" r="17" fill="none" stroke="currentColor" stroke-width="3"/><path d="M24 14v11l7 4" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>';

  const APP=src=>`<img src="${src}" width="60" height="60" alt="" style="border-radius:14px;box-shadow:0 2px 6px rgba(31,77,29,.25)">`;
  const JEUX=[
    {href:"/liliparc/",name:"Lili Parc",desc:L("Construis ta fête foraine et fais fructifier tes LiliDollars !","Build your own fun fair and grow your LiliDollars! (in French)"),icon:APP("/liliparc/icon-192.png")},
    {href:"/monopolili/",name:"MonopoLili",desc:L("Le Monopoly de Lili : achète la Cité des Peluches Péteuses !","Lili's Monopoly: buy the Farty Plushie City! (in French)"),icon:APP("/monopolili/icon-192-v2.png")},
    {href:"/gardiens/",name:"Les Gardiens de Lili",desc:L("Place tes gardiens et protège le château de la princesse Lili contre les Chipeurs !","Place your guardians and protect Princess Lili's castle from the Chipeurs! (in French)"),icon:APP("/gardiens/icon-192.png")}
  ];

  const st=document.createElement("style");
  st.textContent=".fun-dock{position:fixed;left:calc(16px + env(safe-area-inset-left,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:70}"+
    ".fun-btn{background:var(--pink)!important;border-color:var(--pink)!important;color:#fff!important;font-size:1.05rem!important;padding:10px 18px!important;box-shadow:0 6px 18px rgba(194,54,122,.35)}"+
    ".fun-btn svg{transform:rotate(180deg)}.fun-btn[aria-expanded=\"true\"] svg{transform:none}"+
    ".fun-menu{top:auto!important;bottom:calc(100% + 10px);width:min(360px,calc(100vw - 32px))}.fun-menu .pm-head b{color:var(--pink)}.fun-menu .robot-opt b{color:var(--pink)}.fun-menu .robot-opt{grid-template-columns:60px 1fr;gap:12px}.fun-menu .robot-opt .ico{width:60px;height:60px}"+
    "@media print{.fun-dock{display:none}}";
  document.head.appendChild(st);

  const wrap=document.createElement("div");
  wrap.className="picker fun-dock";
  wrap.innerHTML=`<button class="picker-btn fun-btn" id="funBtn" aria-expanded="false" aria-controls="funMenu">🎡 ${L("Détente","Fun time")}<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M2 4l4 4 4-4"/></svg></button>`+
    `<div class="picker-menu fun-menu" id="funMenu" hidden><div class="pm-head"><b>${L("Les jeux de Lili","Lili's games")}</b></div><div class="pm-list">`+
    JEUX.map(j=>`<div class="pm-fam"><a class="robot-opt" href="${j.href}"><span class="ico">${j.icon}</span><span><b>${j.name}</b><small>${j.desc}</small></span></a></div>`).join("")+
    `<div class="pm-fam"><span class="robot-opt locked" aria-disabled="true"><span class="ico">${SOON}</span><span><b>${L("Bientôt…","Coming soon…")}</b><small>${L("D'autres jeux arrivent !","More games are on the way!")}</small></span></span></div>`+
    `</div></div>`;
  document.body.appendChild(wrap);

  const fb=document.getElementById("funBtn"),fm=document.getElementById("funMenu");
  const pm=document.getElementById("pickerMenu"),pb=document.getElementById("pickerBtn");
  const close=()=>{fm.hidden=true;fb.setAttribute("aria-expanded","false");};
  fb.addEventListener("click",e=>{e.stopPropagation();const open=fm.hidden;fm.hidden=!open;fb.setAttribute("aria-expanded",String(open));
    if(open&&pm&&pb){pm.hidden=true;pb.setAttribute("aria-expanded","false");}});
  if(pb)pb.addEventListener("click",close);
  document.addEventListener("click",e=>{if(!wrap.contains(e.target))close();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!fm.hidden){close();fb.focus();}});
})();

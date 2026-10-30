/* L'Enseigne lumineuse V2 : l'atelier des messages (aperçu LED avec la vraie police du panneau, programme fabriqué en direct). */
(function(){
  const EN=document.documentElement.lang==="en";
  const L=(fr,en)=>EN?en:fr;
  // Police du panneau (MD_MAX72XX, police système) : pour chaque caractère, ses colonnes de 8 points.
  const FONT=[[],[62,91,79,91,62],[62,107,79,107,62],[28,62,124,62,28],[24,60,126,60,24],[28,87,125,87,28],[28,94,127,94,28],[0,24,60,24],[255,231,195,231,255],[0,24,36,24],[255,231,219,231,255],[48,72,58,6,14],[38,41,121,41,38],[64,127,5,5,7],[64,127,5,37,63],[90,60,231,60,90],[127,62,28,28,8],[8,28,28,62,127],[20,34,127,34,20],[255,255,255,255,255],[240,240,240,240,240],[255,255,255],[0,0,0,255,255],[15,15,15,15,15],[8,4,126,4,8],[16,32,126,32,16],[8,8,42,28,8],[8,28,42,8,8],[170,0,85,0,170],[170,85,170,85,170],[48,56,62,56,48],[6,14,62,14,6],[0,0],[95],[7,0,7],[20,127,20,127,20],[68,74,255,74,50],[99,19,8,100,99],[54,73,73,54,72],[7],[62,65,65],[65,65,62],[8,42,28,42,8],[8,8,62,8,8],[96,224],[8,8,8,8],[96,96],[96,16,8,4,3],[62,81,73,69,62],[4,2,127],[113,73,73,73,70],[65,73,73,73,54],[15,8,8,8,127],[79,73,73,73,49],[62,73,73,73,48],[3,1,1,1,127],[54,73,73,73,54],[6,73,73,73,62],[108,108],[108,236],[8,20,34],[20,20,20,20],[34,20,8],[1,89,9,9,6],[62,65,93,89,78],[126,9,9,9,126],[127,73,73,73,54],[62,65,65,65,65],[127,65,65,65,62],[127,73,73,73,65],[127,9,9,9,1],[62,65,65,73,121],[127,8,8,8,127],[65,127,65],[48,65,65,65,63],[127,8,20,34,65],[127,64,64,64,64],[127,2,12,2,127],[127,4,8,16,127],[62,65,65,65,62],[127,9,9,9,6],[62,65,65,97,126],[127,9,25,41,70],[70,73,73,73,49],[1,1,127,1,1],[63,64,64,64,63],[31,32,64,32,31],[63,64,56,64,63],[99,20,8,20,99],[3,4,120,4,3],[97,81,73,69,67],[127,65,65],[3,4,8,16,96],[65,65,127],[4,2,1,2,4],[128,128,128,128],[1,2,4],[56,68,68,124],[127,68,68,56],[56,68,68,68],[56,68,68,127],[56,84,84,88],[4,126,5,1],[24,164,164,124],[127,4,4,120],[125],[132,133,124],[127,16,40,68],[127],[124,4,120,4,120],[124,4,4,120],[56,68,68,56],[252,36,36,24],[24,36,36,252],[124,4,4,8],[88,84,84,52],[4,127,4],[60,64,64,124],[28,32,64,124],[60,64,48,64,60],[108,16,16,108],[28,160,160,124],[100,84,84,76],[8,54,65,65],[127],[65,65,54,8],[2,1,2,1],[127,65,65,65,127],[62,85,85,85,65],[56,68,68,56,68],[124,42,42,62,20],[126,2,2,6,6],[2,126,2,126,2],[99,85,73,65,99],[56,68,68,60,4],[64,126,32,30,32],[6,2,126,2,2],[99,19,8,100,99,0,96,96],[42,42,42,42,42],[81,74,68],[68,74,81],[0,0,255,1,3],[224,128,255],[54,18,54,36,54],[2,5,2],[24,24],[16,16],[48,64,255,1,1],[31,1,1,30],[],[],[],[],[1,1,127,1,127,2,12,2,127],[],[],[],[],[],[],[0],[125],[24,36,126,36],[68,126,69,65],[34,28,20,28,34],[1,42,124,42,1],[119],[78,85,85,57],[2,0,2],[126,129,189,165,165,129,126],[38,41,47],[8,20,42,20,34],[8,8,8,24],[8,8,8],[126,129,189,149,169,129,126],[1,1,1,1,1],[2,5,2],[36,46,36],[25,21,18],[21,21,10],[2,1],[248,32,64,120],[6,9,127,1,127],[24,24],[0,128,160,192],[18,31,16],[38,41,38],[34,20,42,20,8],[64,47,16,8,4,30,17,124],[64,47,16,8,4,98,85,76],[21,85,63,16,8,4,30,17,124],[48,72,72,77,64],[120,21,22,20,120],[120,20,22,21,120],[122,21,20,21,122],[120,22,21,22,121],[120,21,20,21,120],[120,20,21,20,120],[126,9,9,127,73,73,65],[158,161,97,33,33],[124,84,85,70,68],[124,84,86,69,68],[126,85,84,69,70],[124,85,84,69,68],[69,126,68],[68,126,69],[70,125,70],[69,124,69],[8,127,73,65,62],[124,10,17,34,125],[56,68,69,70,56],[56,68,70,69,56],[58,69,68,69,58],[56,70,69,70,57],[56,69,68,69,56],[34,20,8,20,34],[124,98,90,70,62],[60,64,65,66,60],[60,64,66,65,60],[60,66,65,66,60],[60,65,64,65,60],[2,4,122,5,2],[63,18,18,12],[126,73,73,78,48],[56,69,70,124],[56,68,70,125],[56,70,69,126],[58,69,70,125],[56,69,68,125],[48,74,77,122],[32,84,84,56,84,84,88],[156,162,98,34],[56,85,86,88],[56,84,86,89],[56,86,85,90],[56,85,84,89],[1,122],[122,1],[2,121,2],[2,120,2],[48,75,75,60],[122,9,10,113],[48,73,74,48],[48,72,74,49],[48,74,73,50],[50,73,74,49],[57,68,68,57],[8,8,42,8,8],[56,84,76,56],[56,65,66,120],[56,64,66,121],[56,66,65,122],[58,64,64,122],[24,160,162,121],[252,40,40,16],[26,160,160,122]];
  const $=id=>document.getElementById(id);
  const cv=$("ledView"); if(!cv)return;
  const ctx=cv.getContext("2d");
  const KEY="lili-panneau";
  const DEF={name:"Ellie",welcome:L("Bonjour ! Bienvenue chez Ellie","Hello! Welcome to Ellie's"),welcomeEdited:false,messages:L("Bonne journée !\nÀ bientôt !","Have a nice day!\nSee you soon!"),speed:40,light:4,stay:20,always:false,color:"red"};
  let C=Object.assign({},DEF);
  try{Object.assign(C,JSON.parse(localStorage.getItem(KEY)||"{}"));}catch(e){}
  const COLORS={red:["#FF5A4A","#FFB0A6","#3A2020"],green:["#5BE05B","#C8FFC8","#1E3320"],blue:["#4AA8FF","#BFE2FF","#1C2838"],yellow:["#FFC83A","#FFE9A8","#3A3218"],white:["#E8F0FF","#FFFFFF","#2C3036"]};
  const welcomeOf=n=>EN?`Hello! Welcome to ${n}'s`:`Bonjour ! Bienvenue chez ${n}`;

  // ---- les champs ----
  const f={name:$("pName"),welcome:$("pWelcome"),messages:$("pMessages"),speed:$("pSpeed"),light:$("pLight"),stay:$("pStay"),always:$("pAlways")};
  f.name.value=C.name; f.welcome.value=C.welcome; f.messages.value=C.messages; f.speed.value=C.speed; f.light.value=C.light; f.stay.value=C.stay; f.always.checked=!!C.always;
  function outs(){$("pSpeedOut").textContent=C.speed+" ms";$("pLightOut").textContent=C.light;$("pStayOut").textContent=C.stay+" s";}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(C));}catch(e){}}
  f.name.addEventListener("input",()=>{C.name=f.name.value.trim()||"Ellie";if(!C.welcomeEdited){C.welcome=welcomeOf(C.name);f.welcome.value=C.welcome;}changed();});
  f.welcome.addEventListener("input",()=>{C.welcome=f.welcome.value;C.welcomeEdited=true;changed();});
  f.messages.addEventListener("input",()=>{C.messages=f.messages.value;changed();});
  f.speed.addEventListener("input",()=>{C.speed=+f.speed.value;changed();});
  f.light.addEventListener("input",()=>{C.light=+f.light.value;changed();});
  f.stay.addEventListener("input",()=>{C.stay=+f.stay.value;changed();});
  f.always.addEventListener("change",()=>{C.always=f.always.checked;if(C.always)wake();changed();});
  document.querySelectorAll("#pColors button").forEach(b=>{b.setAttribute("aria-pressed",String(b.dataset.c===C.color));b.addEventListener("click",()=>{C.color=b.dataset.c;document.querySelectorAll("#pColors button").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));save();});});
  const msgList=()=>C.messages.split("\n").map(s=>s.trim()).filter(Boolean).slice(0,6);

  // ---- le texte en colonnes de points, comme sur l'Arduino ----
  function columns(txt){
    const out=[];
    for(const ch of txt){const k=ch.codePointAt(0);if(k>255)continue;const g=FONT[k]||[];out.push(...g,0);}
    out.pop();return out;
  }
  // ---- l'animation ----
  let awake=false,last=0,queue=[],cur=null,pos=0,acc=0,lastVisit=-1e9,t0=performance.now();
  function nextMsg(){
    if(!queue.length)queue=[C.welcome,...msgList()];
    const m=queue.shift();cur=columns(m);pos=0;
  }
  function wake(){if(!awake){awake=true;queue=[C.welcome,...msgList()];nextMsg();}}
  $("pVisit").addEventListener("click",()=>{lastVisit=performance.now();wake();});
  function sleep(){awake=false;cur=null;}
  if(C.always)wake();
  function frame(){
    const W=32,cols=new Array(W).fill(0);
    if(awake&&cur){for(let x=0;x<W;x++){const i=pos-W+x;if(i>=0&&i<cur.length)cols[x]=cur[i];}}
    return cols;
  }
  function draw(){
    const w=cv.width,h=cv.height,[on,core,off]=COLORS[C.color]||COLORS.red;
    ctx.fillStyle="#0E120E";ctx.fillRect(0,0,w,h);
    const p=Math.min(w/33,h/9),ox=(w-p*32)/2,oy=(h-p*8)/2,cols=frame();
    const a=awake?0.35+0.65*(C.light/15):0;
    for(let x=0;x<32;x++)for(let y=0;y<8;y++){
      const lit=awake&&((cols[x]>>y)&1);const cx=ox+p*(x+.5),cy=oy+p*(y+.5);
      ctx.beginPath();ctx.arc(cx,cy,p*0.38,0,Math.PI*2);
      if(lit){ctx.shadowColor=on;ctx.shadowBlur=p*0.9*a;ctx.globalAlpha=a;ctx.fillStyle=on;ctx.fill();ctx.shadowBlur=0;ctx.beginPath();ctx.arc(cx,cy,p*0.2,0,Math.PI*2);ctx.fillStyle=core;ctx.fill();ctx.globalAlpha=1;}
      else{ctx.fillStyle=off;ctx.fill();}
    }
  }
  function tick(now){
    const dt=now-last;last=now;
    if(awake&&cur){acc+=dt;const step=Math.max(10,C.speed);while(acc>=step){acc-=step;pos++;if(pos>cur.length+32){
      const gone=(now-lastVisit)/1000>C.stay;
      if(gone&&!C.always){sleep();break;}else nextMsg();}}}
    draw();
    const st=$("pState");
    if(!awake)st.textContent=L("Le panneau dort… Personne n'est passé.","The sign is asleep… Nobody has come by.");
    else if(C.always)st.textContent=L("Toujours allumé : le panneau ne s'endort jamais.","Always on: the sign never goes to sleep.");
    else{const left=Math.max(0,Math.ceil(C.stay-(now-lastVisit)/1000));st.textContent=left>0?L(`Quelqu'un est là ! Encore ${left} s, puis il finit son message et s'endort.`,`Someone's here! ${left} more seconds, then it finishes its message and sleeps.`):L("Plus personne : il finit son message, puis il s'endort.","Nobody left: it finishes its message, then goes to sleep.");}
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(t=>{last=t;tick(t);});

  // ---- le programme Arduino, fabriqué en direct ----
  const esc=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  function hl(code){
    return code.split("\n").map(line=>{
      const m=line.indexOf("//");let a=m>=0?line.slice(0,m):line,c=m>=0?line.slice(m):"";
      a=a.split(/("(?:[^"\\]|\\.)*")/).map((t,i)=>i%2?'<span class="n">'+esc(t)+'</span>':esc(t)
        .replace(/#include|#define/g,x=>'<span class="k">'+x+'</span>')
        .replace(/\b(void|int|long|bool|char|const|unsigned|if|else|for|return|true|false)\b/g,'<span class="k">$1</span>')
        .replace(/(^|[^\w.#])(\d+(?:\.\d+)?)(?![\w])/g,'$1<span class="n">$2</span>')).join("");
      return a+(c?'<span class="c">'+esc(c)+'</span>':"");
    }).join("\n");
  }
  const cfg=()=>({welcome:C.welcome,messages:msgList(),speed:C.speed,light:C.light,stay:C.stay,always:C.always});
  function render(){
    const code=PanneauCode.make(cfg(),EN?"en":"fr");
    const out=$("codeOut"); if(out)out.innerHTML=hl(code);
    const t=$("codeTest"); if(t&&!t.dataset.done){t.innerHTML=hl(PanneauCode.test(EN?"en":"fr"));t.dataset.done="1";}
    const nm=$("codeName"); if(nm)nm.textContent=C.name;
    return code;
  }
  $("codeDl")&&$("codeDl").addEventListener("click",()=>{
    const blob=new Blob([render()],{type:"text/plain"});const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);a.download=(EN?"welcome_sign":"enseigne_bienvenue")+".ino";document.body.appendChild(a);a.click();
    setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);
  });
  function changed(){outs();save();render();}
  outs();render();
})();

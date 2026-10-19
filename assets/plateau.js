/* L'Équilibriste 2 : simulateur du plateau vu de dessus (mêmes réglages que plateau.ino). */
(function(){
  const cv=document.getElementById("simCanvas");
  if(!cv)return;
  const ctx=cv.getContext("2d");
  const EN=document.documentElement.lang==="en";
  const T=EN?{
    fell:"Oops, the ball fell off! Click “Drop the ball” to try again.",
    calm:"Well done! The ball is steady in the middle. Give it a flick, or click the plate to put it somewhere else.",
    noD:"With so little D, the ball goes round and round and never calms down. Raise Kd little by little…",
    noP:"Without P, nothing brings the ball back to the middle. Raise Kp!",
    circle:"Circle mode: the target goes round, and the ball chases it!",
    work:"The three motors are working… watch corners A, B and C go up and down.",
    target:"target",circleOn:"Stop the circle",circleOff:"Go round in a circle"
  }:{
    fell:"Oups, la bille est tombée ! Clique sur « Lâcher la bille » pour réessayer.",
    calm:"Bravo ! La bille est stable au milieu. Donne-lui une pichenette, ou clique sur le plateau pour la poser ailleurs.",
    noD:"Avec si peu de D, la bille tourne et tourne sans jamais se calmer. Monte Kd petit à petit…",
    noP:"Sans P, rien ne ramène la bille au milieu. Monte Kp !",
    circle:"Mode cercle : la cible tourne, et la bille la poursuit !",
    work:"Les trois moteurs travaillent… regarde les coins A, B et C monter et descendre.",
    target:"cible",circleOn:"Arrêter le cercle",circleOff:"Tourner en rond"
  };
  const kp=document.getElementById("kp"),kd=document.getElementById("kd"),msg=document.getElementById("simMsg");
  const btnCircle=document.getElementById("simCircle");
  const GW=173,GH=108,TW=154,TH=86,R_ROT=80,BALL=15,PENTE_MAX=10;
  const G=9810*5/7;                      // une bille qui roule : 5/7 de la gravité
  let s,circle=false,t0=performance.now();
  function reset(x,y){s={x:x,y:y,vx:0,vy:0,tx:0,ty:0,cx:0,cy:0,fx:x,fy:y,fvx:0,fvy:0,px:x,py:y,acc:0,calm:0,fell:false};}
  reset(45,22);
  function col(n,d){return getComputedStyle(document.documentElement).getPropertyValue(n).trim()||d;}
  kp.addEventListener("input",()=>document.getElementById("kpOut").textContent=(+kp.value).toFixed(2));
  kd.addEventListener("input",()=>document.getElementById("kdOut").textContent=(+kd.value).toFixed(3));
  document.getElementById("simDrop").addEventListener("click",()=>{const a=Math.random()*Math.PI*2;reset(45*Math.cos(a),28*Math.sin(a));});
  document.getElementById("simPush").addEventListener("click",()=>{if(s.fell)reset(0,0);const a=Math.random()*Math.PI*2;s.vx+=140*Math.cos(a);s.vy+=140*Math.sin(a);s.calm=0;});
  btnCircle.addEventListener("click",()=>{circle=!circle;btnCircle.textContent=circle?T.circleOn:T.circleOff;btnCircle.setAttribute("aria-pressed",String(circle));if(s.fell)reset(0,0);});
  // géométrie de l'écran
  let S=1.8,CX=320,CY=160;
  function layout(){S=1.8;CX=cv.width/2;CY=cv.height/2;}
  layout();
  const toScreen=(x,y)=>[CX+x*S,CY-y*S];
  cv.addEventListener("click",e=>{const r=cv.getBoundingClientRect();const px=(e.clientX-r.left)*cv.width/r.width,py=(e.clientY-r.top)*cv.height/r.height;
    const x=(px-CX)/S,y=(CY-py)/S;if(Math.abs(x)<GW/2-BALL&&Math.abs(y)<GH/2-BALL)reset(x,y);});

  function target(t){return circle?[35*Math.cos(t*1.5),20*Math.sin(t*1.5)]:[0,0];}
  function control(t,dt){             // exactement comme dans plateau.ino, 50 fois par seconde
    const nx=s.x+(Math.random()-.5)*1.2,ny=s.y+(Math.random()-.5)*1.2;
    s.fx=0.6*s.fx+0.4*nx; s.fy=0.6*s.fy+0.4*ny;
    s.fvx=0.7*s.fvx+0.3*(s.fx-s.px)/dt; s.fvy=0.7*s.fvy+0.3*(s.fy-s.py)/dt;
    s.px=s.fx; s.py=s.fy;
    const [cx,cy]=target(t); s.cxT=cx; s.cyT=cy;
    const P=+kp.value,D=+kd.value;
    s.cx=Math.max(-PENTE_MAX,Math.min(PENTE_MAX,P*(s.fx-cx)+D*s.fvx));
    s.cy=Math.max(-PENTE_MAX,Math.min(PENTE_MAX,P*(s.fy-cy)+D*s.fvy));
  }
  function physics(dt){
    if(s.fell)return;
    const k=Math.min(1,dt/0.08);              // les moteurs mettent un peu de temps
    s.tx+=(s.cx-s.tx)*k; s.ty+=(s.cy-s.ty)*k;
    s.vx+=-G*Math.sin(s.tx*Math.PI/180)*dt; s.vy+=-G*Math.sin(s.ty*Math.PI/180)*dt;
    s.vx*=0.9995; s.vy*=0.9995;
    s.x+=s.vx*dt; s.y+=s.vy*dt;
    if(Math.abs(s.x)>GW/2||Math.abs(s.y)>GH/2)s.fell=true;
    s.calm=(!circle&&Math.hypot(s.x,s.y)<4&&Math.hypot(s.vx,s.vy)<8)?s.calm+dt:0;
  }
  function draw(t){
    const W=cv.width,H=cv.height;
    ctx.clearRect(0,0,W,H);
    const ink=col("--ink-soft","#4C5E49"),green=col("--green","#2F6E2B"),deep=col("--green-deep","#1F4D1D");
    // pieds A, B, C (sous le plateau, ils dépassent)
    const legs=[0,120,240].map((a,i)=>{const r=a*Math.PI/180;const x=R_ROT*Math.cos(r),y=R_ROT*Math.sin(r);
      const dz=x*Math.tan(s.tx*Math.PI/180)+y*Math.tan(s.ty*Math.PI/180);return {x,y,dz,name:"ABC"[i]};});
    ctx.lineWidth=10;ctx.lineCap="round";ctx.strokeStyle="#2B2F2C";
    legs.forEach(l=>{const [a,b]=toScreen(0,0),[c,d]=toScreen(l.x*1.08,l.y*1.08);ctx.beginPath();ctx.moveTo(a,b);ctx.lineTo(c,d);ctx.stroke();});
    // le plateau (verre), teinté selon la pente
    const [gx,gy]=toScreen(-GW/2,GH/2);
    ctx.fillStyle="rgba(214,236,248,0.92)";ctx.strokeStyle="#6E9FBD";ctx.lineWidth=2;
    roundRect(gx,gy,GW*S,GH*S,8);ctx.fill();ctx.stroke();
    // ombre de la pente : le côté qui monte est plus clair, celui qui descend plus foncé
    const mag=Math.hypot(s.tx,s.ty);
    if(mag>0.2){const ux=s.tx/mag,uy=s.ty/mag;const [p1x,p1y]=toScreen(ux*GW/2,uy*GH/2),[p2x,p2y]=toScreen(-ux*GW/2,-uy*GH/2);
      const g2=ctx.createLinearGradient(p1x,p1y,p2x,p2y);const a=Math.min(0.35,mag/25);
      g2.addColorStop(0,"rgba(255,255,255,"+a+")");g2.addColorStop(1,"rgba(31,77,29,"+a+")");ctx.fillStyle=g2;roundRect(gx,gy,GW*S,GH*S,8);ctx.fill();}
    ctx.setLineDash([6,5]);ctx.strokeStyle="#9CC3DA";ctx.lineWidth=1.5;const [tx0,ty0]=toScreen(-TW/2,TH/2);ctx.strokeRect(tx0,ty0,TW*S,TH*S);ctx.setLineDash([]);
    // les pieds par-dessus : un rond qui dit s'il monte ou descend
    legs.forEach(l=>{const [x,y]=toScreen(l.x*1.08,l.y*1.08);const up=l.dz>=0;
      ctx.beginPath();ctx.arc(x,y,15,0,Math.PI*2);ctx.fillStyle=up?"#8CC63F":"#F29A1F";ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=deep;ctx.stroke();
      ctx.fillStyle="#1D351B";ctx.font="800 14px Nunito, sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(l.name,x,y+1);
      ctx.font="700 12px Nunito, sans-serif";ctx.fillStyle=ink;const lab=(up?"▲ ":"▼ ")+Math.abs(l.dz).toFixed(0)+" mm";
      ctx.textAlign=l.x>0?"center":"left";ctx.fillText(lab,l.x>0?x:x+22,l.x>0?y+28:y);});
    // la cible
    const [ctX,ctY]=toScreen(s.cxT||0,s.cyT||0);ctx.strokeStyle=green;ctx.lineWidth=2.5;
    ctx.beginPath();ctx.moveTo(ctX-10,ctY);ctx.lineTo(ctX+10,ctY);ctx.moveTo(ctX,ctY-10);ctx.lineTo(ctX,ctY+10);ctx.stroke();
    // la bille
    {const [bx,by]=toScreen(s.x,s.y);const r=BALL*S;
      ctx.beginPath();ctx.ellipse(bx+r*0.25,by+r*0.3,r*0.95,r*0.7,0,0,Math.PI*2);ctx.fillStyle="rgba(29,53,27,.18)";ctx.fill();
      const g3=ctx.createRadialGradient(bx-r*.35,by-r*.4,r*.1,bx,by,r);g3.addColorStop(0,"#FFFFFF");g3.addColorStop(.5,"#C9D1D6");g3.addColorStop(1,"#6F7A80");
      ctx.globalAlpha=s.fell?0.35:1;ctx.beginPath();ctx.arc(bx,by,r,0,Math.PI*2);ctx.fillStyle=g3;ctx.fill();ctx.lineWidth=1.5;ctx.strokeStyle="#5F6B66";ctx.stroke();ctx.globalAlpha=1;}
    // flèche de pente
    if(mag>0.3){const [ax,ay]=toScreen(0,0);const L=Math.min(60,mag*6);const ux=-s.tx/mag,uy=s.ty/mag;
      ctx.strokeStyle=deep;ctx.fillStyle=deep;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(ax+ux*L,ay+uy*L);ctx.stroke();
      ctx.beginPath();ctx.moveTo(ax+ux*(L+8),ay+uy*(L+8));ctx.lineTo(ax+ux*L-uy*6,ay+uy*L+ux*6);ctx.lineTo(ax+ux*L+uy*6,ay+uy*L-ux*6);ctx.fill();}
  }
  function roundRect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
  let last=performance.now(),ctl=0,lastMsg="";
  function loop(now){
    const dt=Math.min(0.04,(now-last)/1000);last=now;const t=(now-t0)/1000;
    const n=8;for(let i=0;i<n;i++){physics(dt/n);ctl+=dt/n;if(ctl>=0.02){ctl-=0.02;if(!s.fell)control(t,0.02);}}
    draw(t);
    let m;
    if(s.fell)m=T.fell;
    else if(circle)m=T.circle;
    else if(s.calm>1.5)m=T.calm;
    else if(+kp.value===0)m=T.noP;
    else if(+kd.value<0.02)m=T.noD;
    else m=T.work;
    if(m!==lastMsg){msg.textContent=m;lastMsg=m;}
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

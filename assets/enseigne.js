/* L'Enseigne lumineuse : configurateur, aperçu 3D, courses, plans et code. */
(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const EN = document.documentElement.lang === "en";
  const tr = (fr, en) => EN ? en : fr;
  const BASE = window.LILI_BASE || "";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Couleurs (teinte FastLED 0-255) ---------- */
  const COLORS = [
    { n: tr("Rose", "Pink"), h: 224, css: "#F06AB0" }, { n: tr("Violet", "Purple"), h: 192, css: "#9B5FD0" },
    { n: tr("Bleu", "Blue"), h: 160, css: "#3D7DD8" }, { n: "Turquoise", h: 128, css: "#2EC4C4" },
    { n: tr("Vert Ellie", "Ellie green"), h: 88, css: "#8CC63F" }, { n: tr("Jaune", "Yellow"), h: 64, css: "#F2C230" },
    { n: "Orange", h: 32, css: "#F29A1F" }, { n: tr("Rouge", "Red"), h: 0, css: "#E04A3A" }
  ];
  // Roue FastLED « rainbow » → degrés
  function fastHueDeg(h) {
    const T = [[0,0],[32,30],[64,60],[96,120],[128,180],[160,240],[192,280],[224,320],[256,360]];
    h = ((h % 256) + 256) % 256;
    for (let i = 0; i < T.length - 1; i++) if (h <= T[i+1][0]) { const [a, da] = T[i], [b, db] = T[i+1]; return da + (h - a) / (b - a) * (db - da); }
    return 0;
  }

  /* ---------- État ---------- */
  const saved = store.get("lili-r2-config") || {};
  const state = Object.assign({ name: "Ellie", mode: "upper", height: 140, depth: 25, color: 4, bed: 220, pir: true, mic: true, anim: 0 }, saved);
  if (!state.mic && state.anim === 4) state.anim = 0;
  const text = () => { const t = state.name.trim().replace(/\s+/g, " ").slice(0, 10); return state.mode === "upper" ? t.toLocaleUpperCase(EN ? "en" : "fr") : t; };
  const save = () => store.set("lili-r2-config", state);

  /* ---------- Menu robots ---------- */
  const pb = $("pickerBtn"), pm = $("pickerMenu");
  pb.addEventListener("click", e => { e.stopPropagation(); const o = pm.hidden; pm.hidden = !o; pb.setAttribute("aria-expanded", String(o)); });
  document.addEventListener("click", e => { if (!pm.contains(e.target)) { pm.hidden = true; pb.setAttribute("aria-expanded", "false"); } });

  /* Vidéo */
  const v = $("heroVideo"), vt = $("vidToggle");
  if (reduceMotion) { v.pause(); vt.textContent = tr("▶ Lecture", "▶ Play"); }
  vt.addEventListener("click", () => { if (v.paused) { v.play(); vt.textContent = "❚❚ Pause"; } else { v.pause(); vt.textContent = tr("▶ Lecture", "▶ Play"); } });

  const toast = $("toast"), tt = $("toastTxt"); let tid;
  function say(msg) { tt.textContent = msg; toast.classList.add("show"); clearTimeout(tid); tid = setTimeout(() => toast.classList.remove("show"), 2400); }

  /* ---------- Contrôles ---------- */
  const nameInput = $("nameInput");
  nameInput.value = state.name;
  nameInput.addEventListener("input", () => { state.name = nameInput.value; save(); schedule(); });
  function seg(id, key, cast, after) {
    const el = $(id);
    const sync = () => el.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(cast(b.dataset.v) === state[key])));
    el.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; state[key] = cast(b.dataset.v); sync(); save(); after && after(); });
    sync();
    return sync;
  }
  seg("caseSeg", "mode", String, () => schedule());
  seg("bedSeg", "bed", Number, () => renderBed());
  const syncAnim = seg("animSeg", "anim", Number);
  const hEl = $("height"), dEl = $("depth");
  hEl.value = state.height; dEl.value = state.depth;
  const showRange = () => { $("heightOut").textContent = state.height + " mm"; $("depthOut").textContent = state.depth + " mm"; };
  hEl.addEventListener("input", () => { state.height = +hEl.value; showRange(); save(); schedule(); });
  dEl.addEventListener("input", () => { state.depth = +dEl.value; showRange(); save(); schedule(); });
  showRange();
  const sw = $("swatches");
  COLORS.forEach((c, i) => {
    const b = document.createElement("button"); b.type = "button"; b.style.background = c.css; b.title = c.n; b.setAttribute("aria-label", c.n);
    b.addEventListener("click", () => { state.color = i; save(); syncSw(); renderCode(); });
    sw.appendChild(b);
  });
  function syncSw() { [...sw.children].forEach((b, i) => b.setAttribute("aria-pressed", String(i === state.color))); }
  syncSw();
  const pirChk = $("pirChk"); pirChk.checked = state.pir;
  pirChk.addEventListener("change", () => { state.pir = pirChk.checked; save(); renderShop(); renderCode(); renderPirRows(); });
  const micChk = $("micChk"); micChk.checked = state.mic;
  micChk.addEventListener("change", () => { state.mic = micChk.checked; if (!state.mic && state.anim === 4) { state.anim = 0; syncAnim(); } save(); renderShop(); renderCode(); renderPirRows(); });
  function renderPirRows() {
    document.querySelectorAll(".pir-only").forEach(r => r.hidden = !state.pir);
    document.querySelectorAll(".mic-only").forEach(r => r.hidden = !state.mic);
  }
  renderPirRows();

  /* ---------- Construction ---------- */
  let font = null, sign = null, table = [], timer = null, buildError = "";
  function schedule() { clearTimeout(timer); timer = setTimeout(rebuild, 220); }

  function rebuild() {
    if (!font) return;
    const t = text();
    if (!t.replace(/\s/g, "")) { sign = null; renderAll(); return; }
    buildError = "";
    try { sign = EnseigneGeo.build(font, { text: t, height: state.height, depth: state.depth }); }
    catch (e) { console.error(e); sign = null; buildError = tr("Oups, Ellie n'a pas réussi à dessiner ces lettres (", "Oops, Ellie couldn't draw these letters (") + (e && e.message || e) + ")."; }
    table = sign ? sign.letters.map(l => ({ ch: l.ch, start: l.start + 1, count: l.count })) : [];
    renderAll();
  }
  function renderAll() { renderStats(); renderBed(); renderScene(); renderPlans(); renderShop(); renderTable(); renderCode(); }

  const fmtCm = mm => (Math.round(mm / 10)).toLocaleString(EN ? "en" : "fr") + " cm";
  function renderStats() {
    $("dlBtn").disabled = !sign;
    if (!sign) { ["stLetters", "stPixels", "stSize", "stFil"].forEach(id => $(id).textContent = "–"); return; }
    $("stLetters").textContent = sign.letters.length;
    $("stPixels").textContent = sign.pixels;
    $("stSize").textContent = fmtCm(sign.totalWidth) + " × " + fmtCm(sign.yMax - sign.yMin);
    $("stFil").textContent = "≈ " + Math.round((sign.volBody + sign.volLid) / 1000 * 1.24) + " g";
    const nm = text();
    $("planName").textContent = nm; $("codeName").textContent = nm;
    $("boardNeed").textContent = tr("Planche ≈ ", "Board ≈ ") + boardSize();
  }
  function boardSize() { return fmtCm(sign.totalWidth + 80) + " × " + fmtCm(sign.yMax - sign.yMin + 80); }
  function renderBed() {
    const a = $("bedAlert");
    if (!sign) { a.hidden = true; return; }
    const lim = state.bed - 6, big = [];
    sign.letters.forEach(l => l.islands.forEach(is => { const w = is.bbox.x1 - is.bbox.x0, h = is.bbox.y1 - is.bbox.y0; if (w > lim || h > lim) big.push(l.ch + " (" + Math.round(w) + " × " + Math.round(h) + " mm)"); }));
    a.hidden = !big.length;
    if (big.length) a.textContent = tr("Trop grand pour ton plateau : ", "Too big for your print bed: ") + big.join(", ") + tr(". Baisse un peu la hauteur des lettres.", ". Lower the letter height a little.");
  }

  /* ---------- Aperçu 3D ---------- */
  const canvas = $("view");
  let renderer, scene, camera, controls, group, lidVisible = true, pixMeshes = [], lidMats = [], visible = true;
  function initThree() {
    if (!window.THREE) { $("loading").textContent = tr("L'aperçu 3D n'a pas pu se charger.", "The 3D preview couldn't load."); return false; }
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(32, 1.6, 10, 20000);
    scene.add(new THREE.HemisphereLight(0xEAF5DE, 0x0F2410, 0.9));
    const sun = new THREE.DirectionalLight(0xffffff, 0.8); sun.position.set(-300, 500, 800); scene.add(sun);
    controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = true; controls.enablePan = false;
    controls.autoRotate = !reduceMotion; controls.autoRotateSpeed = 0.6;
    controls.minPolarAngle = Math.PI * 0.2; controls.maxPolarAngle = Math.PI * 0.8;
    canvas.addEventListener("pointerdown", () => controls.autoRotate = false);
    new ResizeObserver(resize).observe(canvas);
    new IntersectionObserver(es => visible = es[0].isIntersecting).observe(canvas);
    resize(); requestAnimationFrame(loop);
    return true;
  }
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  function geo(mesh) { const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(mesh.t, 3)); g.computeVertexNormals(); return g; }
  function renderScene() {
    if (!scene) return;
    if (group) { scene.remove(group); group.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); }); }
    group = new THREE.Group(); pixMeshes = []; lidMats = [];
    $("loading").hidden = true;
    if (!sign) { $("loading").hidden = false; $("loading").textContent = buildError || (font ? tr("Écris ton prénom !", "Type your name!") : tr("Ellie prépare l'atelier 3D…", "Ellie is setting up the 3D workshop…")); return; }
    const o = sign.opts, T = o.plate + o.depth;
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x6FB43F, roughness: 0.55, metalness: 0.05 });
    const pixGeo = new THREE.CylinderGeometry(6, 6, 14, 16); pixGeo.rotateZ(Math.PI / 2);
    sign.letters.forEach((l, li) => {
      const lg = new THREE.Group(); lg.position.x = l.shift;
      const lidMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.72, roughness: 0.9, emissive: 0x000000 });
      lidMats.push(lidMat);
      l.islands.forEach(is => {
        lg.add(new THREE.Mesh(geo(is.body), bodyMat));
        const lid = new THREE.Mesh(geo(is.lid), lidMat); lid.position.z = T + 0.5; lid.userData.lid = true; lg.add(lid);
        is.pixels.forEach(p => { const m = new THREE.Mesh(pixGeo, new THREE.MeshBasicMaterial({ color: 0xffffff })); m.position.set(p[0], p[1], o.plate + 6); m.userData.letter = li; pixMeshes.push(m); lg.add(m); });
      });
      group.add(lg);
    });
    group.position.set(-sign.totalWidth / 2, -(sign.yMin + sign.yMax) / 2, -T / 2);
    group.children.forEach(lg => lg.children.forEach(m => { if (m.userData.lid) m.visible = lidVisible; }));
    scene.add(group);
    const span = Math.max(sign.totalWidth, (sign.yMax - sign.yMin) * 1.6);
    const dist = span / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) / Math.min(1.6, camera.aspect) * 1.1 + 150;
    camera.position.set(dist * 0.25, dist * 0.18, dist); controls.target.set(0, 0, 0); controls.update();
  }
  $("lidBtn").addEventListener("click", () => {
    lidVisible = !lidVisible; $("lidBtn").textContent = lidVisible ? tr("Voir dedans", "Look inside") : tr("Fermer les lettres", "Close the letters");
    if (group) group.children.forEach(lg => lg.children.forEach(m => { if (m.userData.lid) m.visible = lidVisible; }));
  });

  // Les animations, comme dans le programme Arduino
  const spark = [];
  function letterColor(li, n, ms) {
    const fav = COLORS[state.color].h;
    if (state.anim === 0) return { h: ((ms / 20) + li * 40) % 256, v: 1 };
    if (state.anim === 1) { const step = Math.floor(ms / 500) % (n + 3); return { h: fav, v: li < step ? 1 : 0 }; }
    if (state.anim === 4) { const beat = Math.floor(ms / 500), ph = (ms % 500) / 500; return { h: (beat * 40 + li * 20) % 256, v: 0.15 + 0.85 * Math.exp(-ph * 4) }; }
    if (state.anim === 3) { const b = 120 + (255 - 120) * (0.5 + 0.5 * Math.sin(ms / 1000 * Math.PI * 2 * 12 / 60)); return { h: fav, v: b / 255 }; }
    return null;
  }
  let last = performance.now();
  function loop(now) {
    requestAnimationFrame(loop);
    if (!visible || !renderer) return;
    const dt = now - last; last = now;
    const ms = reduceMotion ? now * 0.25 : now;
    if (sign && pixMeshes.length) {
      const n = sign.letters.length, sum = lidMats.map(() => [0, 0, 0, 0]);
      if (state.anim === 2) {
        while (spark.length < pixMeshes.length) spark.push({ c: new THREE.Color(0, 0, 0) });
        spark.forEach(s => s.c.multiplyScalar(Math.pow(0.9, dt / 20)));
        if (Math.random() < 0.31 * dt / 20) { const s = spark[Math.floor(Math.random() * pixMeshes.length)]; s.c.setHSL(Math.random(), 1, 0.6); }
      }
      pixMeshes.forEach((m, i) => {
        const li = m.userData.letter; let c;
        if (state.anim === 2) c = spark[i].c;
        else { const lc = letterColor(li, n, ms); c = new THREE.Color().setHSL(fastHueDeg(lc.h) / 360, 1, 0.5 * lc.v + 0.02); }
        m.material.color.copy(c);
        const s = sum[li]; s[0] += c.r; s[1] += c.g; s[2] += c.b; s[3]++;
      });
      lidMats.forEach((mat, li) => { const s = sum[li]; if (s[3]) mat.emissive.setRGB(Math.min(1, s[0] / s[3] * 1.3), Math.min(1, s[1] / s[3] * 1.3), Math.min(1, s[2] / s[3] * 1.3)); else mat.emissive.setRGB(0, 0, 0); });
    }
    controls.update(); renderer.render(scene, camera);
  }

  /* ---------- Plans de pose ---------- */
  function renderPlans() {
    const box = $("plans"); box.textContent = "";
    if (!sign) return;
    let num = 0;
    sign.letters.forEach((l, li) => l.islands.forEach((is, ii) => {
      const b = is.bbox, pad = 6, w = b.x1 - b.x0 + pad * 2, h = b.y1 - b.y0 + pad * 2, maxH = sign.yMax - sign.yMin + pad * 2;
      const path = is.outline.map(poly => "M" + poly.map(p => (p[0] - b.x0 + pad).toFixed(1) + " " + (b.y1 - p[1] + pad).toFixed(1)).join("L") + "Z").join("");
      const inner = is.inner.flatMap(e => [e.outer, ...e.holes]).map(poly => "M" + poly.map(p => (p[0] - b.x0 + pad).toFixed(1) + " " + (b.y1 - p[1] + pad).toFixed(1)).join("L") + "Z").join("");
      const X = x => (x - b.x0 + pad).toFixed(1), Y = y => (b.y1 - y + pad).toFixed(1);
      let svg = `<svg viewBox="0 0 ${w.toFixed(1)} ${h.toFixed(1)}" style="height:${Math.max(40, h / maxH * 190).toFixed(0)}px;width:auto;max-width:100%" role="img" aria-label="${tr("Plan de la lettre", "Plan for letter")} ${l.ch}">` +
        `<path d="${path}" fill="var(--lime-soft)" stroke="var(--green)" stroke-width="1.5" fill-rule="evenodd"/>` +
        `<path d="${inner}" fill="none" stroke="var(--green)" stroke-width="0.8" stroke-dasharray="3 3" opacity=".6"/>`;
      if (is.hole) {
        const pts = [[is.hole.x, is.hole.y], ...is.pixels];
        svg += `<polyline points="${pts.map(p => X(p[0]) + "," + Y(p[1])).join(" ")}" fill="none" stroke="var(--ink-soft)" stroke-width="1.2" stroke-dasharray="2 2"/>`;
        svg += `<circle cx="${X(is.hole.x)}" cy="${Y(is.hole.y)}" r="6" fill="var(--ink)"/>`;
      }
      is.pixels.forEach(p => { num++; svg += `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="7.5" fill="#8CC63F" stroke="#1F4D1D" stroke-width="1"/><text x="${X(p[0])}" y="${(+Y(p[1]) + 3.6).toFixed(1)}" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="800" font-size="10" fill="#163514">${num}</text>`; });
      svg += "</svg>";
      const card = document.createElement("div"); card.className = "plan";
      const label = l.islands.length > 1 ? `${l.ch} · ${tr("morceau", "piece")} ${ii + 1}` : l.ch;
      card.innerHTML = svg + `<b>${label}</b><small>${is.pixels.length ? is.pixels.length + " pixel" + (is.pixels.length > 1 ? "s" : "") : tr("trop petit pour un pixel", "too small for a pixel")}</small>`;
      box.appendChild(card);
    }));
  }

  /* ---------- Courses ---------- */
  const shopDone = store.get("lili-r2-shop") || {};
  function item(k, title, desc, qty, q, check) { return { k, title, desc, qty, q, check }; }
  const CART_SVG = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2l2.4 11.2a2 2 0 002 1.6h7.7a2 2 0 002-1.5L21 8H6"/><circle cx="10" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/></svg>', CHECK_SVG = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const amz = q => (EN ? "https://www.amazon.com/s?k=" : "https://www.amazon.fr/s?k=") + encodeURIComponent(q);
  function renderShop() {
    const box = $("shop"); box.textContent = "";
    const n = sign ? sign.pixels : 0, packs = Math.max(1, Math.ceil(n * 1.15 / 50));
    const gBody = sign ? Math.round(sign.volBody / 1000 * 1.24) : 0, gLid = sign ? Math.round(sign.volLid / 1000 * 1.24) : 0;
    const groupsFr = [
      { t: "L'électronique", icon: "chip", items: [
        item("nano", "Arduino Nano (ou compatible)", "Le cerveau. Tu peux aussi réutiliser l'Arduino Uno du robot 1.", "×1 · ≈ 6–20 €", "Arduino Nano ATmega328P broches soudées", "ATmega328P, broches déjà soudées (sinon il faut souder)"),
        item("pixels", "Guirlande de 50 pixels WS2811, 12 mm, 5 V", `Ton enseigne a besoin de ${n} pixels. On en garde quelques-uns en réserve.`, `×${packs} · ≈ ${packs * 12}–${packs * 18} €`, "guirlande pixels WS2811 12mm 5V 50", "WS2811, 12 mm, 5 V (pas 12 V !), 50 pixels"),
        item("alim", "Alimentation 5 V, 3 A", "Avec une prise jack, plus un adaptateur jack femelle à bornier (pour visser les fils sans soudure).", "×1 · ≈ 10 €", "alimentation 5V 3A jack 5,5 x 2,1 adaptateur bornier", "5 V et au moins 3 A, prise jack 5,5 × 2,1 mm"),
        item("cond", "Condensateur 1000 µF", "Il protège les pixels au démarrage.", "×1 · ≈ 1 €", "condensateur électrolytique 1000uF 16V", "1000 µF, 10 V ou plus"),
        item("resist", "Résistance 330 Ω", "Elle protège le fil de données.", "×1 · ≈ 1 €", "résistance 330 ohm", "330 Ω (orange, orange, marron)"),
        item("bouton", "Bouton poussoir", "Pour changer d'animation.", "×1 · ≈ 1 €", "bouton poussoir 12mm momentané", "momentané (pas à verrouillage)"),
        ...(state.pir ? [item("pir", "Détecteur de présence HC-SR501", "Les yeux de ton enseigne.", "×1 · ≈ 3 €", "HC-SR501 détecteur mouvement PIR", "HC-SR501 avec ses 2 petits réglages orange")] : []),
        ...(state.mic ? [item("micro", "Module micro MAX9814", "Les oreilles : pour les claps et la musique.", "×1 · ≈ 4 €", "MAX9814 module microphone", "MAX9814 (il règle le volume tout seul)")] : []),
        item("plaque", "Mini plaque d'essai et fils de connexion", "Tu en as peut-être encore depuis le robot 1.", "×1 · ≈ 6 €", "mini breadboard 400 points câbles dupont", "400 points, avec fils mâle-mâle et mâle-femelle")
      ]},
      { t: "L'impression et le bois", icon: "gear", items: [
        item("pla-c", "Filament PLA de couleur", `Pour les corps des lettres : environ ${gBody} g.`, `≈ ${gBody} g`, "filament PLA 1,75 mm vert", "le diamètre de ton imprimante (souvent 1,75 mm)"),
        item("pla-b", "Filament PLA blanc", `Pour les façades qui font briller les lettres : environ ${gLid} g.`, `≈ ${gLid} g`, "filament PLA 1,75 mm blanc", "blanc ou « naturel », même diamètre"),
        item("planche", "Planche de fond", sign ? `Contreplaqué ou médium de 5 à 10 mm, environ ${boardSize()}.` : "Contreplaqué ou médium de 5 à 10 mm.", "×1 · ≈ 8 €", null, "En magasin de bricolage"),
        item("tasseaux", "2 tasseaux et 2 crochets", "Derrière la planche, pour la place des fils et pour l'accrocher.", "≈ 4 €", null, "En magasin de bricolage"),
        item("colle", "Bâtons de colle chaude, scotch double face", "Tu en as sûrement à la maison.", "lot")
      ]}
    ];
    const groups = EN ? [
      { t: "Electronics", icon: "chip", items: [
        item("nano", "Arduino Nano (or compatible)", "The brain. You can also reuse the Arduino Uno from robot 1.", "×1 · ≈ €6–20", "Arduino Nano ATmega328P soldered headers", "ATmega328P, headers already soldered (otherwise you'll need to solder)"),
        item("pixels", "String of 50 WS2811 pixels, 12 mm, 5 V", `Your sign needs ${n} pixels. We keep a few spare.`, `×${packs} · ≈ €${packs * 12}–${packs * 18}`, "WS2811 12mm pixel string 5V 50", "WS2811, 12 mm, 5 V (not 12 V!), 50 pixels"),
        item("alim", "5 V, 3 A power supply", "With a barrel plug, plus a female barrel-jack-to-screw-terminal adapter (to screw the wires in, no soldering).", "×1 · ≈ €10", "5V 3A power supply 5.5x2.1 barrel jack terminal adapter", "5 V and at least 3 A, 5.5 × 2.1 mm barrel plug"),
        item("cond", "1000 µF capacitor", "It protects the pixels at power-up.", "×1 · ≈ €1", "1000uF 16V electrolytic capacitor", "1000 µF, 10 V or more"),
        item("resist", "330 Ω resistor", "It protects the data wire.", "×1 · ≈ €1", "330 ohm resistor", "330 Ω (orange, orange, brown)"),
        item("bouton", "Push button", "To change the animation.", "×1 · ≈ €1", "12mm momentary push button", "momentary (not latching)"),
        ...(state.pir ? [item("pir", "HC-SR501 motion sensor", "Your sign's eyes.", "×1 · ≈ €3", "HC-SR501 PIR motion sensor", "HC-SR501 with its 2 small orange knobs")] : []),
        ...(state.mic ? [item("micro", "MAX9814 microphone module", "The ears: for claps and music.", "×1 · ≈ €4", "MAX9814 microphone amplifier module", "MAX9814 (it adjusts the volume by itself)")] : []),
        item("plaque", "Mini breadboard and jumper wires", "You may still have some from robot 1.", "×1 · ≈ €6", "mini breadboard 400 points dupont jumper wires", "400 points, with male-male and male-female wires")
      ]},
      { t: "Printing and wood", icon: "gear", items: [
        item("pla-c", "Coloured PLA filament", `For the letter bodies: about ${gBody} g.`, `≈ ${gBody} g`, "PLA filament 1.75mm green", "your printer's diameter (often 1.75 mm)"),
        item("pla-b", "White PLA filament", `For the fronts that make the letters glow: about ${gLid} g.`, `≈ ${gLid} g`, "PLA filament 1.75mm white", "white or \"natural\", same diameter"),
        item("planche", "Back board", sign ? `Plywood or MDF, 5 to 10 mm thick, about ${boardSize()}.` : "Plywood or MDF, 5 to 10 mm thick.", "×1 · ≈ €8", null, "Hardware store"),
        item("tasseaux", "2 battens and 2 hooks", "Behind the board, to make room for the wires and to hang it.", "≈ €4", null, "Hardware store"),
        item("colle", "Hot glue sticks, double-sided tape", "You probably have these at home.", "set")
      ]}
    ] : groupsFr;
    const ico = { chip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="6" width="12" height="12" rx="1"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/></svg>',
      gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/></svg>' };
    groups.forEach((g, gi) => {
      const div = document.createElement("div"); div.className = "shop-group";
      div.innerHTML = `<h3><span class="hex${gi ? " lime" : ""}">${ico[g.icon]}</span>${g.t}</h3>`;
      const ul = document.createElement("ul"); ul.className = "items";
      g.items.forEach(it => {
        const li = document.createElement("li");
        li.innerHTML = `<label class="item"><input type="checkbox" data-k="${it.k}"><span><b></b><small></small></span><span class="qty"></span></label>`;
        li.querySelector("b").textContent = it.title; li.querySelector("small").textContent = it.desc; li.querySelector(".qty").textContent = it.qty;
        const qty = li.querySelector(".qty"); qty.textContent = ""; const qt = document.createElement("span"); qt.textContent = it.qty; qty.appendChild(qt);
        if (it.q) {
          const c = document.createElement("span"); c.className = "spec"; c.innerHTML = CHECK_SVG + "<span><b>" + tr("Vérifie :", "Check:") + "</b> </span>"; c.lastChild.appendChild(document.createTextNode(it.check));
          li.querySelector("label > span:not(.qty)").appendChild(c);
          const a = document.createElement("a"); a.className = "buy"; a.href = amz(it.q); a.target = "_blank"; a.rel = "noopener"; a.innerHTML = CART_SVG + "Amazon"; qty.appendChild(a);
        } else if (it.check) {
          const st = document.createElement("span"); st.className = "store"; st.textContent = tr("Bricolage", "Hardware store"); qty.appendChild(st);
        }
        const cb = li.querySelector("input"); cb.checked = !!shopDone[it.k];
        cb.addEventListener("change", () => { shopDone[it.k] = cb.checked; store.set("lili-r2-shop", shopDone); if (shopCount() === allBoxes().length) say(tr("Tout est là ! On peut construire !", "Everything's here! Let's build!")); });
        ul.appendChild(li);
      });
      div.appendChild(ul); box.appendChild(div);
    });
    shopCount();
  }
  const allBoxes = () => [...document.querySelectorAll("#shop input")];
  function shopCount() { const b = allBoxes(), n = b.filter(x => x.checked).length; $("shopCount").textContent = n + " / " + b.length + tr(" trouvés", " found"); $("shopBar").style.width = (b.length ? 100 * n / b.length : 0) + "%"; return n; }

  /* ---------- Tableau des pixels ---------- */
  function renderTable() {
    const tb = $("pixRows"); tb.textContent = "";
    table.forEach((r, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td class="l"></td><td><input type="number" min="1" max="500" aria-label="${tr("Premier pixel", "First pixel")}"></td><td><input type="number" min="0" max="100" aria-label="${tr("Nombre de pixels", "Number of pixels")}"></td>`;
      row.querySelector(".l").textContent = r.ch;
      const [a, b] = row.querySelectorAll("input"); a.value = r.start; b.value = r.count;
      a.id = "pixStart" + i; b.id = "pixCount" + i;
      a.addEventListener("input", () => { r.start = Math.max(1, parseInt(a.value) || 1); renderCode(); });
      b.addEventListener("input", () => { r.count = Math.max(0, parseInt(b.value) || 0); renderCode(); });
      tb.appendChild(row);
    });
  }
  $("pixReset").addEventListener("click", () => { if (!sign) return; table = sign.letters.map(l => ({ ch: l.ch, start: l.start + 1, count: l.count })); renderTable(); renderCode(); say(tr("Valeurs remises !", "Values reset!")); });

  /* ---------- Code Arduino ---------- */
  const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  function highlight(src) {
    return esc(src).split("\n").map(line => {
      const ci = line.indexOf("//"); let code = ci >= 0 ? line.slice(0, ci) : line, com = ci >= 0 ? line.slice(ci) : "";
      code = code.replace(/(&quot;.*?&quot;|"[^"]*")/g, '<span class="n">$1</span>')
        .replace(/\b(\d+UL|\d+)\b(?![^<]*>)/g, '<span class="n">$1</span>')
        .replace(/(#include|#define|\b(?:void|const|byte|bool|unsigned long|int|if|else|for|while|return|true|false)\b)(?![^<]*>)/g, '<span class="k">$1</span>');
      return code + (com ? '<span class="c">' + com + "</span>" : "");
    }).join("\n");
  }
  let codeMainSrc = "", codeCensusSrc = "";
  function renderCode() {
    const nm = text() || tr("ton prénom", "your name");
    const packs = sign ? Math.max(1, Math.ceil(sign.pixels * 1.15 / 50)) : 1;
    codeCensusSrc =
`// Le recensement des pixels : ils s'allument un par un
#include <FastLED.h>

#define PIN_PIXELS 6
#define NB_PIXELS  ${packs * 50}   // toute la guirlande

CRGB pixels[NB_PIXELS];

void setup() {
  Serial.begin(9600);
  FastLED.addLeds<WS2811, PIN_PIXELS, RGB>(pixels, NB_PIXELS);
  FastLED.setBrightness(60);
}

void loop() {
  for (int i = 0; i < NB_PIXELS; i++) {
    FastLED.clear();
    pixels[i] = CRGB::White;      // un seul pixel allumé
    FastLED.show();
    Serial.print("Pixel numero ");
    Serial.println(i + 1);        // on compte à partir de 1, comme toi
    delay(700);
  }
}`;
    const rows = table.length ? table : [{ ch: "?", start: 1, count: 0 }];
    const nbPix = Math.max(1, ...rows.map(r => r.start - 1 + r.count));
    const col = COLORS[state.color];
    const mic = state.mic;
    if (EN) {
      codeCensusSrc =
`// The pixel census: they light up one by one
#include <FastLED.h>

#define PIN_PIXELS 6
#define NUM_PIXELS ${packs * 50}   // the whole string

CRGB pixels[NUM_PIXELS];

void setup() {
  Serial.begin(9600);
  FastLED.addLeds<WS2811, PIN_PIXELS, RGB>(pixels, NUM_PIXELS);
  FastLED.setBrightness(60);
}

void loop() {
  for (int i = 0; i < NUM_PIXELS; i++) {
    FastLED.clear();
    pixels[i] = CRGB::White;      // only one pixel on
    FastLED.show();
    Serial.print("Pixel number ");
    Serial.println(i + 1);        // we count from 1, like you
    delay(700);
  }
}`;
      codeMainSrc =
`// ${nm}'s light-up sign, made in Lili's Workshop
#include <FastLED.h>

#define PIN_PIXELS         6
#define PIN_BUTTON         3
#define PIN_MOTION         2${mic ? "\n#define PIN_MIC            A0" : ""}
#define NUM_PIXELS         ${nbPix}
#define WITH_MOTION_SENSOR ${state.pir ? "true" : "false"}

CRGB pixels[NUM_PIXELS];

// Each letter: { first pixel, number of pixels }
const byte LETTERS[][2] = {
${rows.map((r, i) => `  { ${r.start}, ${r.count} }${i < rows.length - 1 ? "," : " "}   // ${r.ch}`).join("\n")}
};
const byte NUM_LETTERS = ${rows.length};

byte favoriteColor = ${col.h};   // ${col.n}
byte animation = 0;
const byte NUM_ANIMATIONS = ${mic ? 5 : 4};
unsigned long lastVisit = 0;
const unsigned long SLEEP_AFTER = 120000UL;   // 2 minutes with nobody around: sleep
${mic ? `
// The ears
int sound = 0;                   // the noise right now
int level = 0;                   // the smoothed noise, for music
int average = 50;                // the usual noise in the room
const int CLAP_THRESHOLD = 350;  // raise this if the sign reacts too easily
unsigned long lastClap = 0;
bool isOff = false;              // two claps: switch off or back on
byte musicHue = 0;
` : ""}
// Colour a whole letter (n = 0 for the first one)
void letter(byte n, CRGB color) {
  for (byte i = 0; i < LETTERS[n][1]; i++) {
    pixels[LETTERS[n][0] - 1 + i] = color;   // - 1: the Arduino counts from 0
  }
}

void rainbow() {
  byte t = millis() / 20;
  for (byte n = 0; n < NUM_LETTERS; n++) letter(n, CHSV(t + n * 40, 255, 255));
}

void oneByOne() {
  byte stage = (millis() / 500) % (NUM_LETTERS + 3);
  FastLED.clear();
  for (byte n = 0; n < NUM_LETTERS && n < stage; n++) letter(n, CHSV(favoriteColor, 255, 255));
}

void sparkles() {
  fadeToBlackBy(pixels, NUM_PIXELS, 25);
  if (random8() < 80) pixels[random16(NUM_PIXELS)] = CHSV(random8(), 180, 255);
}

void myColor() {
  byte breathe = beatsin8(12, 120, 255);   // the light breathes gently
  for (byte n = 0; n < NUM_LETTERS; n++) letter(n, CHSV(favoriteColor, 255, breathe));
}
${mic ? `
// Listen for 10 milliseconds: the louder the sound, the bigger the gap
int readSound() {
  int low = 1023, high = 0;
  unsigned long start = millis();
  while (millis() - start < 10) {
    int v = analogRead(PIN_MIC);
    if (v < low) low = v;
    if (v > high) high = v;
  }
  return high - low;
}

// Two quick claps: switch off or back on
void listenForClaps() {
  if (sound > CLAP_THRESHOLD) {
    unsigned long gap = millis() - lastClap;
    if (gap > 150 && gap < 700) {
      isOff = !isOff;
      lastClap = 0;
      delay(300);
    } else if (gap >= 150) {
      lastClap = millis();
    }
  }
}

// The letters dance to the music
void music() {
  level = max(sound, level * 9 / 10);            // the level drops gently
  average = (average * 15 + sound) / 16;         // the usual noise
  if (sound > average * 2 && sound > 60) musicHue += 40;   // a "boom": change colour
  byte brightness = constrain(map(level, 0, 300, 20, 255), 20, 255);
  for (byte n = 0; n < NUM_LETTERS; n++) letter(n, CHSV(musicHue + n * 20, 255, brightness));
}
` : ""}
void setup() {
  FastLED.addLeds<WS2811, PIN_PIXELS, RGB>(pixels, NUM_PIXELS);
  FastLED.setMaxPowerInVoltsAndMilliamps(5, 2500);   // protects the power supply
  FastLED.setBrightness(150);
  pinMode(PIN_BUTTON, INPUT_PULLUP);
  pinMode(PIN_MOTION, INPUT);
}

void loop() {
  // The button: next animation
  if (digitalRead(PIN_BUTTON) == LOW) {
    animation = (animation + 1) % NUM_ANIMATIONS;
    FastLED.clear();
    delay(250);
    while (digitalRead(PIN_BUTTON) == LOW) {}
  }

  // The eyes: is anyone here?
  if (!WITH_MOTION_SENSOR || digitalRead(PIN_MOTION) == HIGH) lastVisit = millis();
${mic ? `
  // The ears: listen to the room
  sound = readSound();
  if (animation != 4) listenForClaps();   // in music mode, claps don't count
` : ""}
  if (${mic ? "isOff || " : ""}millis() - lastVisit > SLEEP_AFTER) {
    fadeToBlackBy(pixels, NUM_PIXELS, 8);   // going to sleep
  } else if (animation == 0) rainbow();
  else if (animation == 1) oneByOne();
  else if (animation == 2) sparkles();
  ${mic ? "else if (animation == 3) myColor();\n  else music();" : "else myColor();"}

  FastLED.show();
  delay(20);
}`;
      $("codeCensus").innerHTML = highlight(codeCensusSrc);
      $("codeMain").innerHTML = highlight(codeMainSrc);
      $("codeFile").textContent = fileBase() + ".ino";
      return;
    }
    codeMainSrc =
`// L'enseigne lumineuse de ${nm}, préparée dans l'atelier de Lili
#include <FastLED.h>

#define PIN_PIXELS     6
#define PIN_BOUTON     3
#define PIN_PRESENCE   2${mic ? "\n#define PIN_MICRO      A0" : ""}
#define NB_PIXELS      ${nbPix}
#define AVEC_DETECTEUR ${state.pir ? "true" : "false"}

CRGB pixels[NB_PIXELS];

// Chaque lettre : { premier pixel, nombre de pixels }
const byte LETTRES[][2] = {
${rows.map((r, i) => `  { ${r.start}, ${r.count} }${i < rows.length - 1 ? "," : " "}   // ${r.ch}`).join("\n")}
};
const byte NB_LETTRES = ${rows.length};

byte couleurPreferee = ${col.h};   // ${col.n}
byte animation = 0;
const byte NB_ANIMATIONS = ${mic ? 5 : 4};
unsigned long derniereVisite = 0;
const unsigned long VEILLE = 120000UL;   // 2 minutes sans personne : dodo
${mic ? `
// Les oreilles
int son = 0;                   // le bruit en ce moment
int niveau = 0;                // le bruit lissé, pour la musique
int moyenne = 50;              // le bruit habituel de la pièce
const int SEUIL_CLAP = 350;    // monte ce chiffre si l'enseigne réagit trop facilement
unsigned long dernierClap = 0;
bool eteinte = false;          // deux claps : on éteint ou on rallume
byte teinteMusique = 0;
` : ""}
// Colorie toute une lettre (n = 0 pour la première)
void lettre(byte n, CRGB couleur) {
  for (byte i = 0; i < LETTRES[n][1]; i++) {
    pixels[LETTRES[n][0] - 1 + i] = couleur;   // - 1 : l'Arduino compte à partir de 0
  }
}

void arcEnCiel() {
  byte t = millis() / 20;
  for (byte n = 0; n < NB_LETTRES; n++) lettre(n, CHSV(t + n * 40, 255, 255));
}

void uneParUne() {
  byte etape = (millis() / 500) % (NB_LETTRES + 3);
  FastLED.clear();
  for (byte n = 0; n < NB_LETTRES && n < etape; n++) lettre(n, CHSV(couleurPreferee, 255, 255));
}

void etincelles() {
  fadeToBlackBy(pixels, NB_PIXELS, 25);
  if (random8() < 80) pixels[random16(NB_PIXELS)] = CHSV(random8(), 180, 255);
}

void maCouleur() {
  byte respire = beatsin8(12, 120, 255);   // la lumière respire doucement
  for (byte n = 0; n < NB_LETTRES; n++) lettre(n, CHSV(couleurPreferee, 255, respire));
}
${mic ? `
// Écoute pendant 10 millisecondes : plus le son est fort, plus l'écart est grand
int lireSon() {
  int mini = 1023, maxi = 0;
  unsigned long debut = millis();
  while (millis() - debut < 10) {
    int v = analogRead(PIN_MICRO);
    if (v < mini) mini = v;
    if (v > maxi) maxi = v;
  }
  return maxi - mini;
}

// Deux claps rapprochés : on éteint ou on rallume
void ecouterClaps() {
  if (son > SEUIL_CLAP) {
    unsigned long ecart = millis() - dernierClap;
    if (ecart > 150 && ecart < 700) {
      eteinte = !eteinte;
      dernierClap = 0;
      delay(300);
    } else if (ecart >= 150) {
      dernierClap = millis();
    }
  }
}

// Les lettres dansent sur la musique
void musique() {
  niveau = max(son, niveau * 9 / 10);            // le niveau retombe doucement
  moyenne = (moyenne * 15 + son) / 16;           // le bruit habituel
  if (son > moyenne * 2 && son > 60) teinteMusique += 40;   // un « boum » : on change de couleur
  byte lumiere = constrain(map(niveau, 0, 300, 20, 255), 20, 255);
  for (byte n = 0; n < NB_LETTRES; n++) lettre(n, CHSV(teinteMusique + n * 20, 255, lumiere));
}
` : ""}
void setup() {
  FastLED.addLeds<WS2811, PIN_PIXELS, RGB>(pixels, NB_PIXELS);
  FastLED.setMaxPowerInVoltsAndMilliamps(5, 2500);   // protège l'alimentation
  FastLED.setBrightness(150);
  pinMode(PIN_BOUTON, INPUT_PULLUP);
  pinMode(PIN_PRESENCE, INPUT);
}

void loop() {
  // Le bouton : animation suivante
  if (digitalRead(PIN_BOUTON) == LOW) {
    animation = (animation + 1) % NB_ANIMATIONS;
    FastLED.clear();
    delay(250);
    while (digitalRead(PIN_BOUTON) == LOW) {}
  }

  // Les yeux : quelqu'un est là ?
  if (!AVEC_DETECTEUR || digitalRead(PIN_PRESENCE) == HIGH) derniereVisite = millis();
${mic ? `
  // Les oreilles : on écoute la pièce
  son = lireSon();
  if (animation != 4) ecouterClaps();   // en mode musique, on ne compte pas les claps
` : ""}
  if (${mic ? "eteinte || " : ""}millis() - derniereVisite > VEILLE) {
    fadeToBlackBy(pixels, NB_PIXELS, 8);   // on s'endort
  } else if (animation == 0) arcEnCiel();
  else if (animation == 1) uneParUne();
  else if (animation == 2) etincelles();
  ${mic ? "else if (animation == 3) maCouleur();\n  else musique();" : "else maCouleur();"}

  FastLED.show();
  delay(20);
}`;
    $("codeCensus").innerHTML = highlight(codeCensusSrc);
    $("codeMain").innerHTML = highlight(codeMainSrc);
    $("codeFile").textContent = fileBase() + ".ino";
  }
  const fileBase = () => tr("enseigne_", "sign_") + (text() || "lili").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9]+/g, "_").toLowerCase();

  document.querySelectorAll(".copy").forEach(b => b.addEventListener("click", () => {
    const pre = b.parentElement.querySelector("pre"), txt = pre.innerText;
    const ok = () => { b.textContent = tr("Copié !", "Copied!"); setTimeout(() => b.textContent = tr("Copier", "Copy"), 1500); };
    const sel = () => { const r = document.createRange(); r.selectNodeContents(pre); const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = "Ctrl+C"; };
    try { navigator.clipboard.writeText(txt).then(ok, sel); } catch (e) { sel(); }
  }));

  /* ---------- Téléchargement ---------- */
  let downloads; // undefined = pas encore su, null = indisponible
  if (window.claude && window.claude.use) window.claude.use("downloads").then(d => downloads = d).catch(() => downloads = null);
  $("dlBtn").addEventListener("click", async () => {
    if (!sign || !window.JSZip) return;
    const btn = $("dlBtn"); btn.disabled = true; btn.textContent = tr("Ellie prépare ton ZIP…", "Ellie is packing your ZIP…");
    try {
      const zip = new JSZip(), base = fileBase(), dir = zip.folder(base);
      EnseigneGeo.parts(sign, EN ? { body: "body", lid: "front", piece: "piece" } : null).forEach(p => dir.file(p.name, p.mesh.toSTL(p.name)));
      dir.file(base + ".ino", codeMainSrc);
      if (EN) dir.file("README.txt",
        text() + "'s light-up sign - Lili's Workshop\r\n\r\n" +
        "Letter height: " + state.height + " mm, thickness: " + state.depth + " mm\r\n" +
        "Pixels: " + sign.pixels + "\r\n\r\n" +
        "_body.stl files: print in coloured PLA, lying flat, no supports.\r\n" +
        "_front.stl files: print in white PLA.\r\n" +
        "Suggested settings: 0.2 mm layers, 3 perimeters, 15 % infill.\r\n\r\n" +
        sign.letters.map((l, i) => (i + 1) + ". " + l.ch + ": pixels " + (l.count ? (l.start + 1) + " to " + (l.start + l.count) : "none")).join("\r\n") + "\r\n");
      else dir.file("LISEZ-MOI.txt",
        "L'enseigne lumineuse de " + text() + " - L'atelier de Lili\r\n\r\n" +
        "Hauteur des lettres : " + state.height + " mm, épaisseur : " + state.depth + " mm\r\n" +
        "Pixels : " + sign.pixels + "\r\n\r\n" +
        "Fichiers _corps.stl : à imprimer en PLA de couleur, posés à plat, sans supports.\r\n" +
        "Fichiers _facade.stl : à imprimer en PLA blanc.\r\n" +
        "Réglages conseillés : couches de 0,2 mm, 3 périmètres, remplissage 15 %.\r\n\r\n" +
        sign.letters.map((l, i) => (i + 1) + ". " + l.ch + " : pixels " + (l.count ? (l.start + 1) + " à " + (l.start + l.count) : "aucun")).join("\r\n") + "\r\n");
      const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
      const name = base + ".zip";
      if (window.claude && window.claude.use) {
        if (downloads === undefined) downloads = await window.claude.use("downloads").catch(() => null);
        if (!downloads) { say(tr("Le téléchargement n'est pas disponible ici.", "Downloading isn't available here.")); return; }
        try { await downloads.save({ filename: name, data: blob }); say(tr("Tes pièces sont prêtes !", "Your parts are ready!")); }
        catch (e) { if (e && e.code !== "declined") say(tr("Le téléchargement n'a pas marché, réessaie.", "The download didn't work, try again.")); }
      } else {
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
        document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
        say(tr("Tes pièces sont prêtes !", "Your parts are ready!"));
      }
    } finally { btn.disabled = false; btn.textContent = tr("Télécharger mes pièces 3D", "Download my 3D parts"); }
  });

  /* ---------- Étapes ---------- */
  const done = store.get("lili-r2-steps") || {};
  const steps = [...document.querySelectorAll(".step")];
  const cheers = EN ? ["Well done!", "Great work!", "Keep it up!", "You're a real engineer!", "Another one done!"] : ["Bravo !", "Super travail !", "Continue comme ça !", "Tu es une vraie ingénieure !", "Encore une de faite !"];
  function stepUpd() { const n = steps.filter(s => s.classList.contains("is-done")).length; $("stepCount").textContent = n + " / " + steps.length + tr(" étapes", " steps"); $("stepBar").style.width = (100 * n / steps.length) + "%"; return n; }
  steps.forEach(s => {
    const k = s.dataset.step, btn = s.querySelector(".done-btn");
    const set = on => { s.classList.toggle("is-done", on); btn.textContent = on ? tr("✓ Fait", "✓ Done") : tr("C'est fait !", "Done!"); btn.setAttribute("aria-pressed", String(on)); };
    set(!!done[k]);
    btn.addEventListener("click", () => { const on = !s.classList.contains("is-done"); set(on); done[k] = on; store.set("lili-r2-steps", done); const n = stepUpd(); if (on) say(n === steps.length ? tr("Mission accomplie !", "Mission accomplished!") : cheers[n % cheers.length]); });
  });
  stepUpd();

  /* ---------- Menu actif ---------- */
  const links = [...document.querySelectorAll(".navlinks a")];
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
  ["comprendre", "courses", "montage"].forEach(id => io.observe($(id)));

  /* ---------- Démarrage ---------- */
  renderShop(); renderCode();
  const missing = ["opentype", "ClipperLib", "earcut", "THREE", "JSZip"].filter(k => !window[k]);
  if (missing.length) console.error("Bibliothèques manquantes :", missing);
  const threeOk = initThree();
  fetch(BASE + "assets/fonts/baloo-2-latin-800-normal.woff").then(r => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
    .then(buf => { font = opentype.parse(buf); rebuild(); })
    .catch(e => { console.error(e); $("loading").hidden = false; $("loading").textContent = tr("Impossible de charger la police d'Ellie.", "Couldn't load Ellie's font."); });
  if (!threeOk) $("loading").hidden = false;
})();

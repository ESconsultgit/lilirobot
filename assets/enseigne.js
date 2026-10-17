/* L'Enseigne lumineuse : configurateur, aperçu 3D, courses, plans et code. */
(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Couleurs (teinte FastLED 0-255) ---------- */
  const COLORS = [
    { n: "Rose", h: 224, css: "#F06AB0" }, { n: "Violet", h: 192, css: "#9B5FD0" },
    { n: "Bleu", h: 160, css: "#3D7DD8" }, { n: "Turquoise", h: 128, css: "#2EC4C4" },
    { n: "Vert Lili", h: 88, css: "#8CC63F" }, { n: "Jaune", h: 64, css: "#F2C230" },
    { n: "Orange", h: 32, css: "#F29A1F" }, { n: "Rouge", h: 0, css: "#E04A3A" }
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
  const state = Object.assign({ name: "Lili", mode: "upper", height: 140, depth: 25, color: 4, bed: 220, pir: true, anim: 0 }, saved);
  const text = () => { const t = state.name.trim().replace(/\s+/g, " ").slice(0, 10); return state.mode === "upper" ? t.toLocaleUpperCase("fr") : t; };
  const save = () => store.set("lili-r2-config", state);

  /* ---------- Menu robots ---------- */
  const pb = $("pickerBtn"), pm = $("pickerMenu");
  pb.addEventListener("click", e => { e.stopPropagation(); const o = pm.hidden; pm.hidden = !o; pb.setAttribute("aria-expanded", String(o)); });
  document.addEventListener("click", e => { if (!pm.contains(e.target)) { pm.hidden = true; pb.setAttribute("aria-expanded", "false"); } });

  /* Vidéo */
  const v = $("heroVideo"), vt = $("vidToggle");
  if (reduceMotion) { v.pause(); vt.textContent = "▶ Lecture"; }
  vt.addEventListener("click", () => { if (v.paused) { v.play(); vt.textContent = "❚❚ Pause"; } else { v.pause(); vt.textContent = "▶ Lecture"; } });

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
  }
  seg("caseSeg", "mode", String, () => schedule());
  seg("bedSeg", "bed", Number, () => renderBed());
  seg("animSeg", "anim", Number);
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
  function renderPirRows() { document.querySelectorAll(".pir-only").forEach(r => r.hidden = !state.pir); }
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
    catch (e) { console.error(e); sign = null; buildError = "Oups, Lili n'a pas réussi à dessiner ces lettres (" + (e && e.message || e) + ")."; }
    table = sign ? sign.letters.map(l => ({ ch: l.ch, start: l.start + 1, count: l.count })) : [];
    renderAll();
  }
  function renderAll() { renderStats(); renderBed(); renderScene(); renderPlans(); renderShop(); renderTable(); renderCode(); }

  const fmtCm = mm => (Math.round(mm / 10)).toLocaleString("fr") + " cm";
  function renderStats() {
    $("dlBtn").disabled = !sign;
    if (!sign) { ["stLetters", "stPixels", "stSize", "stFil"].forEach(id => $(id).textContent = "–"); return; }
    $("stLetters").textContent = sign.letters.length;
    $("stPixels").textContent = sign.pixels;
    $("stSize").textContent = fmtCm(sign.totalWidth) + " × " + fmtCm(sign.yMax - sign.yMin);
    $("stFil").textContent = "≈ " + Math.round((sign.volBody + sign.volLid) / 1000 * 1.24) + " g";
    const nm = text();
    $("planName").textContent = nm; $("codeName").textContent = nm;
    $("boardNeed").textContent = "Planche ≈ " + boardSize();
  }
  function boardSize() { return fmtCm(sign.totalWidth + 80) + " × " + fmtCm(sign.yMax - sign.yMin + 80); }
  function renderBed() {
    const a = $("bedAlert");
    if (!sign) { a.hidden = true; return; }
    const lim = state.bed - 6, big = [];
    sign.letters.forEach(l => l.islands.forEach(is => { const w = is.bbox.x1 - is.bbox.x0, h = is.bbox.y1 - is.bbox.y0; if (w > lim || h > lim) big.push(l.ch + " (" + Math.round(w) + " × " + Math.round(h) + " mm)"); }));
    a.hidden = !big.length;
    if (big.length) a.textContent = "Trop grand pour ton plateau : " + big.join(", ") + ". Baisse un peu la hauteur des lettres.";
  }

  /* ---------- Aperçu 3D ---------- */
  const canvas = $("view");
  let renderer, scene, camera, controls, group, lidVisible = true, pixMeshes = [], lidMats = [], visible = true;
  function initThree() {
    if (!window.THREE) { $("loading").textContent = "L'aperçu 3D n'a pas pu se charger."; return false; }
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
    if (!sign) { $("loading").hidden = false; $("loading").textContent = buildError || (font ? "Écris ton prénom !" : "Lili prépare l'atelier 3D…"); return; }
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
    lidVisible = !lidVisible; $("lidBtn").textContent = lidVisible ? "Voir dedans" : "Fermer les lettres";
    if (group) group.children.forEach(lg => lg.children.forEach(m => { if (m.userData.lid) m.visible = lidVisible; }));
  });

  // Les animations, comme dans le programme Arduino
  const spark = [];
  function letterColor(li, n, ms) {
    const fav = COLORS[state.color].h;
    if (state.anim === 0) return { h: ((ms / 20) + li * 40) % 256, v: 1 };
    if (state.anim === 1) { const step = Math.floor(ms / 500) % (n + 3); return { h: fav, v: li < step ? 1 : 0 }; }
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
      let svg = `<svg viewBox="0 0 ${w.toFixed(1)} ${h.toFixed(1)}" style="height:${Math.max(40, h / maxH * 190).toFixed(0)}px;width:auto;max-width:100%" role="img" aria-label="Plan de la lettre ${l.ch}">` +
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
      const label = l.islands.length > 1 ? `${l.ch} · morceau ${ii + 1}` : l.ch;
      card.innerHTML = svg + `<b>${label}</b><small>${is.pixels.length ? is.pixels.length + " pixel" + (is.pixels.length > 1 ? "s" : "") : "trop petit pour un pixel"}</small>`;
      box.appendChild(card);
    }));
  }

  /* ---------- Courses ---------- */
  const shopDone = store.get("lili-r2-shop") || {};
  function item(k, title, desc, qty) { return { k, title, desc, qty }; }
  function renderShop() {
    const box = $("shop"); box.textContent = "";
    const n = sign ? sign.pixels : 0, packs = Math.max(1, Math.ceil(n * 1.15 / 50));
    const gBody = sign ? Math.round(sign.volBody / 1000 * 1.24) : 0, gLid = sign ? Math.round(sign.volLid / 1000 * 1.24) : 0;
    const groups = [
      { t: "L'électronique", icon: "chip", items: [
        item("nano", "Arduino Nano (ou compatible)", "Le cerveau. Tu peux aussi réutiliser l'Arduino Uno du robot 1.", "×1 · ≈ 6–20 €"),
        item("pixels", "Guirlande de 50 pixels WS2811, 12 mm, 5 V", `Ton enseigne a besoin de ${n} pixels. On en garde quelques-uns en réserve.`, `×${packs} · ≈ ${packs * 12}–${packs * 18} €`),
        item("alim", "Alimentation 5 V, 3 A", "Avec une prise jack, plus un adaptateur jack femelle à bornier (pour visser les fils sans soudure).", "×1 · ≈ 10 €"),
        item("cond", "Condensateur 1000 µF et résistance 330 Ω", "Le condensateur protège les pixels au démarrage, la résistance protège le fil de données.", "×1 + ×1 · ≈ 1 €"),
        item("bouton", "Bouton poussoir", "Pour changer d'animation.", "×1 · ≈ 1 €"),
        ...(state.pir ? [item("pir", "Détecteur de présence HC-SR501", "Les yeux de ton enseigne.", "×1 · ≈ 3 €")] : []),
        item("plaque", "Mini plaque d'essai et fils de connexion", "Tu en as peut-être encore depuis le robot 1.", "×1 · ≈ 6 €")
      ]},
      { t: "L'impression et le bois", icon: "gear", items: [
        item("pla-c", "Filament PLA de couleur", `Pour les corps des lettres : environ ${gBody} g.`, `≈ ${gBody} g`),
        item("pla-b", "Filament PLA blanc", `Pour les façades qui font briller les lettres : environ ${gLid} g.`, `≈ ${gLid} g`),
        item("planche", "Planche de fond", sign ? `Contreplaqué ou médium de 5 à 10 mm, environ ${boardSize()}.` : "Contreplaqué ou médium de 5 à 10 mm.", "×1 · ≈ 8 €"),
        item("tasseaux", "2 tasseaux et 2 crochets", "Derrière la planche, pour la place des fils et pour l'accrocher.", "≈ 4 €"),
        item("colle", "Bâtons de colle chaude, scotch double face", "Tu en as sûrement à la maison.", "lot")
      ]}
    ];
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
        const cb = li.querySelector("input"); cb.checked = !!shopDone[it.k];
        cb.addEventListener("change", () => { shopDone[it.k] = cb.checked; store.set("lili-r2-shop", shopDone); if (shopCount() === allBoxes().length) say("Tout est là ! On peut construire !"); });
        ul.appendChild(li);
      });
      div.appendChild(ul); box.appendChild(div);
    });
    shopCount();
  }
  const allBoxes = () => [...document.querySelectorAll("#shop input")];
  function shopCount() { const b = allBoxes(), n = b.filter(x => x.checked).length; $("shopCount").textContent = n + " / " + b.length + " trouvés"; $("shopBar").style.width = (b.length ? 100 * n / b.length : 0) + "%"; return n; }

  /* ---------- Tableau des pixels ---------- */
  function renderTable() {
    const tb = $("pixRows"); tb.textContent = "";
    table.forEach((r, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td class="l"></td><td><input type="number" min="1" max="500" aria-label="Premier pixel"></td><td><input type="number" min="0" max="100" aria-label="Nombre de pixels"></td>`;
      tr.querySelector(".l").textContent = r.ch;
      const [a, b] = tr.querySelectorAll("input"); a.value = r.start; b.value = r.count;
      a.id = "pixStart" + i; b.id = "pixCount" + i;
      a.addEventListener("input", () => { r.start = Math.max(1, parseInt(a.value) || 1); renderCode(); });
      b.addEventListener("input", () => { r.count = Math.max(0, parseInt(b.value) || 0); renderCode(); });
      tb.appendChild(tr);
    });
  }
  $("pixReset").addEventListener("click", () => { if (!sign) return; table = sign.letters.map(l => ({ ch: l.ch, start: l.start + 1, count: l.count })); renderTable(); renderCode(); say("Valeurs remises !"); });

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
    const nm = text() || "ton prénom";
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
    codeMainSrc =
`// L'enseigne lumineuse de ${nm}, préparée dans l'atelier de Lili
#include <FastLED.h>

#define PIN_PIXELS     6
#define PIN_BOUTON     3
#define PIN_PRESENCE   2
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
const byte NB_ANIMATIONS = 4;
unsigned long derniereVisite = 0;
const unsigned long VEILLE = 120000UL;   // 2 minutes sans personne : dodo

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

  if (millis() - derniereVisite > VEILLE) {
    fadeToBlackBy(pixels, NB_PIXELS, 8);   // personne : on s'endort
  } else if (animation == 0) arcEnCiel();
  else if (animation == 1) uneParUne();
  else if (animation == 2) etincelles();
  else maCouleur();

  FastLED.show();
  delay(20);
}`;
    $("codeCensus").innerHTML = highlight(codeCensusSrc);
    $("codeMain").innerHTML = highlight(codeMainSrc);
    $("codeFile").textContent = fileBase() + ".ino";
  }
  const fileBase = () => "enseigne_" + (text() || "lili").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9]+/g, "_").toLowerCase();

  document.querySelectorAll(".copy").forEach(b => b.addEventListener("click", () => {
    const pre = b.parentElement.querySelector("pre"), txt = pre.innerText;
    const ok = () => { b.textContent = "Copié !"; setTimeout(() => b.textContent = "Copier", 1500); };
    const sel = () => { const r = document.createRange(); r.selectNodeContents(pre); const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = "Ctrl+C"; };
    try { navigator.clipboard.writeText(txt).then(ok, sel); } catch (e) { sel(); }
  }));

  /* ---------- Téléchargement ---------- */
  let downloads; // undefined = pas encore su, null = indisponible
  if (window.claude && window.claude.use) window.claude.use("downloads").then(d => downloads = d).catch(() => downloads = null);
  $("dlBtn").addEventListener("click", async () => {
    if (!sign || !window.JSZip) return;
    const btn = $("dlBtn"); btn.disabled = true; btn.textContent = "Lili prépare ton ZIP…";
    try {
      const zip = new JSZip(), base = fileBase(), dir = zip.folder(base);
      EnseigneGeo.parts(sign).forEach(p => dir.file(p.name, p.mesh.toSTL(p.name)));
      dir.file(base + ".ino", codeMainSrc);
      dir.file("LISEZ-MOI.txt",
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
        if (!downloads) { say("Le téléchargement n'est pas disponible ici."); return; }
        try { await downloads.save({ filename: name, data: blob }); say("Tes pièces sont prêtes !"); }
        catch (e) { if (e && e.code !== "declined") say("Le téléchargement n'a pas marché, réessaie."); }
      } else {
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
        document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
        say("Tes pièces sont prêtes !");
      }
    } finally { btn.disabled = false; btn.textContent = "Télécharger mes pièces 3D"; }
  });

  /* ---------- Étapes ---------- */
  const done = store.get("lili-r2-steps") || {};
  const steps = [...document.querySelectorAll(".step")];
  const cheers = ["Bravo !", "Super travail !", "Continue comme ça !", "Tu es une vraie ingénieure !", "Encore une de faite !"];
  function stepUpd() { const n = steps.filter(s => s.classList.contains("is-done")).length; $("stepCount").textContent = n + " / " + steps.length + " étapes"; $("stepBar").style.width = (100 * n / steps.length) + "%"; return n; }
  steps.forEach(s => {
    const k = s.dataset.step, btn = s.querySelector(".done-btn");
    const set = on => { s.classList.toggle("is-done", on); btn.textContent = on ? "✓ Fait" : "C'est fait !"; btn.setAttribute("aria-pressed", String(on)); };
    set(!!done[k]);
    btn.addEventListener("click", () => { const on = !s.classList.contains("is-done"); set(on); done[k] = on; store.set("lili-r2-steps", done); const n = stepUpd(); if (on) say(n === steps.length ? "Mission accomplie !" : cheers[n % cheers.length]); });
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
  fetch("assets/fonts/baloo-2-latin-800-normal.woff").then(r => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
    .then(buf => { font = opentype.parse(buf); rebuild(); })
    .catch(e => { console.error(e); $("loading").hidden = false; $("loading").textContent = "Impossible de charger la police de Lili."; });
  if (!threeOk) $("loading").hidden = false;
})();

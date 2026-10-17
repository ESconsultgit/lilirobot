/* Le Rouleur : simulateur, liste de courses, programmes et suivi des étapes. */
(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const EN = document.documentElement.lang === "en";
  const tr = (fr, en) => EN ? en : fr;
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Menu, vidéo, toast ---------- */
  const pb = $("pickerBtn"), pm = $("pickerMenu");
  pb.addEventListener("click", e => { e.stopPropagation(); const o = pm.hidden; pm.hidden = !o; pb.setAttribute("aria-expanded", String(o)); });
  document.addEventListener("click", e => { if (!pm.contains(e.target)) { pm.hidden = true; pb.setAttribute("aria-expanded", "false"); } });
  const v = $("heroVideo"), vt = $("vidToggle");
  if (reduceMotion) { v.pause(); vt.textContent = tr("▶ Lecture", "▶ Play"); }
  vt.addEventListener("click", () => { if (v.paused) { v.play(); vt.textContent = "❚❚ Pause"; } else { v.pause(); vt.textContent = tr("▶ Lecture", "▶ Play"); } });
  const toast = $("toast"), tt = $("toastTxt"); let tid;
  function say(msg) { tt.textContent = msg; toast.classList.add("show"); clearTimeout(tid); tid = setTimeout(() => toast.classList.remove("show"), 2200); }

  /* ---------- Liste de courses ---------- */
  const CART = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2l2.4 11.2a2 2 0 002 1.6h7.7a2 2 0 002-1.5L21 8H6"/><circle cx="10" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/></svg>';
  const CHECK = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const AMZ = EN ? "https://www.amazon.com/s?k=" : "https://www.amazon.fr/s?k=";
  // [clé, titre, description, à vérifier, quantité/prix, recherche Amazon]
  const ELEC = EN ? [
    ["kit", "2-wheel robot chassis kit (2WD)", "The body: a plate, 2 yellow motors with wheels, a caster wheel and screws.", "2 TT motors with wires already soldered", "×1 · ≈ €12–18", "2WD robot car chassis kit TT motor"],
    ["uno", "Arduino Uno R3 board", "The brain. You can reuse the one from robot 1 if you've taken it apart.", "Uno R3 with a USB cable", "×1 · ≈ €15–25", "arduino uno r3 usb cable"],
    ["l298n", "L298N motor driver module", "It gives the batteries' power to the motors when the Arduino says so. The wires screw in, no soldering.", "L298N module with screw terminals and a heatsink", "×1 · ≈ €4–6", "L298N motor driver module"],
    ["hcsr04", "HC-SR04 ultrasonic sensor", "The eyes, just like robot 1.", "HC-SR04 with 4 pins", "×1 · ≈ €2–4", "HC-SR04 ultrasonic sensor"],
    ["servo", "SG90 servo + sensor bracket", "The neck: it turns the head to look left and right.", "HC-SR04 bracket that fits an SG90 (often sold together)", "×1 · ≈ €4–6", "HC-SR04 bracket SG90 servo"],
    ["piles", "6×AA battery holder with switch + 6 batteries", "The Roller's energy. The switch saves unplugging everything.", "6 × AA (9 V), with an ON/OFF switch", "×1 · ≈ €5 + batteries", "6 AA battery holder with switch"],
    ["fils", "Mini breadboard and jumper wires", "To connect the sensor, the servo and the motor driver.", "male-female AND male-male wires", "×1 · ≈ €6", "mini breadboard dupont jumper wires male female"]
  ] : [
    ["kit", "Kit châssis robot 2 roues (2WD)", "Le corps : une plaque, 2 moteurs jaunes avec leurs roues, une roue folle et des vis.", "2 moteurs TT avec fils déjà soudés", "×1 · ≈ 12–18 €", "kit chassis robot voiture 2WD moteur TT"],
    ["uno", "Carte Arduino Uno R3", "Le cerveau. Tu peux réutiliser celle du robot 1 si tu l'as démontée.", "Uno R3 avec câble USB", "×1 · ≈ 15–25 €", "arduino uno r3 câble usb"],
    ["l298n", "Module de commande moteurs L298N", "Il donne la force des piles aux moteurs quand l'Arduino le demande. Les fils se vissent, sans soudure.", "module L298N avec bornes à vis et radiateur", "×1 · ≈ 4–6 €", "module L298N driver moteur"],
    ["hcsr04", "Capteur à ultrasons HC-SR04", "Les yeux, comme pour le robot 1.", "HC-SR04, 4 broches", "×1 · ≈ 2–4 €", "HC-SR04 capteur ultrason"],
    ["servo", "Servomoteur SG90 + support de capteur", "Le cou : il fait tourner la tête pour regarder à gauche et à droite.", "support HC-SR04 compatible SG90 (souvent vendus ensemble)", "×1 · ≈ 4–6 €", "support HC-SR04 servo SG90"],
    ["piles", "Boîtier 6 piles AA avec interrupteur + 6 piles", "L'énergie du Rouleur. L'interrupteur évite de tout débrancher.", "6 × AA (9 V), avec interrupteur ON/OFF", "×1 · ≈ 5 € + piles", "boitier 6 piles AA interrupteur"],
    ["fils", "Mini plaque d'essai et fils de connexion", "Pour relier le capteur, le servo et le module moteurs.", "fils mâle-femelle ET mâle-mâle", "×1 · ≈ 6 €", "mini breadboard câbles dupont mâle femelle"]
  ];
  const OTHER = EN ? [
    ["vis", "Small screws, spacers and nuts", "Usually included with the chassis kit.", "in the kit", null],
    ["colle", "Double-sided tape, cable ties, hot glue", "You probably have these at home.", "set", null]
  ] : [
    ["vis", "Petites vis, entretoises et écrous", "Souvent fournis avec le kit châssis.", "dans le kit", null],
    ["colle", "Scotch double face, colliers de serrage, colle chaude", "Tu en as sûrement à la maison.", "lot", null]
  ];
  const esc = t => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  $("shopElec").innerHTML = ELEC.map(([k, t, d, c, q, s]) => `<li><label class="item"><input type="checkbox" data-k="${k}"><span><b>${esc(t)}</b><small>${esc(d)}</small><span class="spec">${CHECK}<span><b>${tr("Vérifie :", "Check:")}</b> ${esc(c)}</span></span></span><span class="qty"><span>${q}</span><a class="buy" href="${AMZ + encodeURIComponent(s)}" target="_blank" rel="noopener">${CART}Amazon</a></span></label></li>`).join("");
  $("shopOther").innerHTML = OTHER.map(([k, t, d, q]) => `<li><label class="item"><input type="checkbox" data-k="${k}"><span><b>${esc(t)}</b><small>${esc(d)}</small></span><span class="qty"><span>${q}</span></span></label></li>`).join("");
  const shop = store.get("lili-r3-shop") || {};
  const boxes = [...document.querySelectorAll(".items input")];
  function shopUpd() { const n = boxes.filter(b => b.checked).length; $("shopCount").textContent = n + " / " + boxes.length + tr(" trouvés", " found"); $("shopBar").style.width = (100 * n / boxes.length) + "%"; return n; }
  boxes.forEach(b => { b.checked = !!shop[b.dataset.k]; b.addEventListener("change", () => { shop[b.dataset.k] = b.checked; store.set("lili-r3-shop", shop); if (shopUpd() === boxes.length) say(tr("Tout est là ! On peut construire !", "Everything's here! Let's build!")); }); });
  shopUpd();

  /* ---------- Programmes Arduino ---------- */
  const CODE = EN ? {
    motors:
`// Motor test: forward, backward, turn
const int ENA = 5, IN1 = 2, IN2 = 4;   // left motor
const int ENB = 6, IN3 = 7, IN4 = 8;   // right motor

// Speed of each wheel: from -255 (full reverse) to 255 (full forward)
void motors(int left, int right) {
  digitalWrite(IN1, left > 0);   digitalWrite(IN2, left < 0);
  digitalWrite(IN3, right > 0);  digitalWrite(IN4, right < 0);
  analogWrite(ENA, abs(left));   analogWrite(ENB, abs(right));
}

void setup() {
  pinMode(ENA, OUTPUT); pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(ENB, OUTPUT); pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
}

void loop() {
  motors(150, 150);   delay(1000);   // straight ahead
  motors(0, 0);       delay(500);
  motors(-150, -150); delay(1000);   // backwards
  motors(0, 0);       delay(500);
  motors(-150, 150);  delay(800);    // turn left
  motors(0, 0);       delay(2000);
}`,
    head:
`// Head test: the neck turns and the eyes measure
#include <Servo.h>

const int PIN_TRIG = 12, PIN_ECHO = 11, PIN_HEAD = 10;
const bool CENTER_ONLY = true;   // true: the head stays straight so you can fix it

Servo head;

int measure() {
  digitalWrite(PIN_TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);
  long duration = pulseIn(PIN_ECHO, HIGH, 30000);
  if (duration == 0) return 300;   // no echo: the way is clear
  return duration * 0.0343 / 2;
}

void setup() {
  Serial.begin(9600);
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  head.attach(PIN_HEAD);
  head.write(90);                  // 90 = looking straight ahead
}

void loop() {
  if (CENTER_ONLY) return;         // nothing else to do for now
  int angles[3] = {160, 90, 20};   // left, straight, right
  for (int i = 0; i < 3; i++) {
    head.write(angles[i]);
    delay(600);
    Serial.print("Angle ");
    Serial.print(angles[i]);
    Serial.print(": ");
    Serial.print(measure());
    Serial.println(" cm");
  }
}`,
    main:
`// The Roller: it rolls, sees obstacles and goes around them
#include <Servo.h>

// ----- The wiring -----
const int ENA = 5, IN1 = 2, IN2 = 4;   // left motor
const int ENB = 6, IN3 = 7, IN4 = 8;   // right motor
const int PIN_TRIG = 12, PIN_ECHO = 11;
const int PIN_HEAD = 10;

// ----- Lili's settings (the same as in the simulator!) -----
int SPEED = 170;          // 0 = stopped, 255 = full speed
int STOP_DISTANCE = 20;   // in cm: closer than this, we stop
int BACKUP_TIME = 300;    // in milliseconds
int TURN_TIME = 400;      // in milliseconds: longer = turns more
int LOOK_LEFT = 160;      // head angle to look left
int LOOK_RIGHT = 20;      // head angle to look right

Servo head;

void motors(int left, int right) {
  digitalWrite(IN1, left > 0);   digitalWrite(IN2, left < 0);
  digitalWrite(IN3, right > 0);  digitalWrite(IN4, right < 0);
  analogWrite(ENA, abs(left));   analogWrite(ENB, abs(right));
}
void forward()   { motors(SPEED, SPEED); }
void backward()  { motors(-SPEED, -SPEED); }
void turnLeft()  { motors(-SPEED, SPEED); }
void turnRight() { motors(SPEED, -SPEED); }
void halt()      { motors(0, 0); }

int measure() {
  digitalWrite(PIN_TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);
  long duration = pulseIn(PIN_ECHO, HIGH, 30000);
  if (duration == 0) return 300;   // no echo: the way is clear
  return duration * 0.0343 / 2;
}

// Turn the head, wait, measure
int look(int angle) {
  head.write(angle);
  delay(350);
  return measure();
}

void setup() {
  pinMode(ENA, OUTPUT); pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(ENB, OUTPUT); pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
  pinMode(PIN_TRIG, OUTPUT); pinMode(PIN_ECHO, INPUT);
  head.attach(PIN_HEAD);
  head.write(90);
  delay(2000);   // 2 seconds to put the Roller on the floor
}

void loop() {
  int ahead = measure();

  if (ahead > STOP_DISTANCE) {
    forward();                          // IF the way is clear: go!
  } else {
    halt();                             // OTHERWISE: stop,
    backward(); delay(BACKUP_TIME);     // back up a little,
    halt();
    int left = look(LOOK_LEFT);         // look left,
    int right = look(LOOK_RIGHT);       // look right,
    head.write(90);
    if (left > right) turnLeft();       // and go to the clearest side
    else turnRight();
    delay(TURN_TIME);
    halt();
  }
  delay(30);
}`
  } : {
    motors:
`// Test des moteurs : tout droit, en arrière, virage
const int ENA = 5, IN1 = 2, IN2 = 4;   // moteur gauche
const int ENB = 6, IN3 = 7, IN4 = 8;   // moteur droit

// Vitesse de chaque roue : de -255 (marche arrière à fond) à 255 (à fond)
void moteurs(int gauche, int droite) {
  digitalWrite(IN1, gauche > 0);  digitalWrite(IN2, gauche < 0);
  digitalWrite(IN3, droite > 0);  digitalWrite(IN4, droite < 0);
  analogWrite(ENA, abs(gauche));  analogWrite(ENB, abs(droite));
}

void setup() {
  pinMode(ENA, OUTPUT); pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(ENB, OUTPUT); pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
}

void loop() {
  moteurs(150, 150);   delay(1000);   // tout droit
  moteurs(0, 0);       delay(500);
  moteurs(-150, -150); delay(1000);   // en arrière
  moteurs(0, 0);       delay(500);
  moteurs(-150, 150);  delay(800);    // virage à gauche
  moteurs(0, 0);       delay(2000);
}`,
    head:
`// Test de la tête : le cou tourne et les yeux mesurent
#include <Servo.h>

const int PIN_TRIG = 12, PIN_ECHO = 11, PIN_TETE = 10;
const bool JUSTE_CENTRER = true;   // true : la tête reste droite pour que tu la fixes

Servo tete;

int mesurer() {
  digitalWrite(PIN_TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);
  long duree = pulseIn(PIN_ECHO, HIGH, 30000);
  if (duree == 0) return 300;   // pas d'écho : la voie est libre
  return duree * 0.0343 / 2;
}

void setup() {
  Serial.begin(9600);
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  tete.attach(PIN_TETE);
  tete.write(90);                  // 90 = regarder tout droit
}

void loop() {
  if (JUSTE_CENTRER) return;       // rien d'autre à faire pour l'instant
  int angles[3] = {160, 90, 20};   // gauche, tout droit, droite
  for (int i = 0; i < 3; i++) {
    tete.write(angles[i]);
    delay(600);
    Serial.print("Angle ");
    Serial.print(angles[i]);
    Serial.print(" : ");
    Serial.print(mesurer());
    Serial.println(" cm");
  }
}`,
    main:
`// Le Rouleur : il roule, voit les obstacles et les contourne
#include <Servo.h>

// ----- Les branchements -----
const int ENA = 5, IN1 = 2, IN2 = 4;   // moteur gauche
const int ENB = 6, IN3 = 7, IN4 = 8;   // moteur droit
const int PIN_TRIG = 12, PIN_ECHO = 11;
const int PIN_TETE = 10;

// ----- Les réglages de Lili (les mêmes que dans le simulateur !) -----
int VITESSE = 170;         // 0 = arrêt, 255 = à fond
int DISTANCE_STOP = 20;    // en cm : plus près que ça, on s'arrête
int TEMPS_RECUL = 300;     // en millisecondes
int TEMPS_VIRAGE = 400;    // en millisecondes : plus c'est long, plus il tourne
int REGARD_GAUCHE = 160;   // angle de la tête pour regarder à gauche
int REGARD_DROITE = 20;    // angle de la tête pour regarder à droite

Servo tete;

void moteurs(int gauche, int droite) {
  digitalWrite(IN1, gauche > 0);  digitalWrite(IN2, gauche < 0);
  digitalWrite(IN3, droite > 0);  digitalWrite(IN4, droite < 0);
  analogWrite(ENA, abs(gauche));  analogWrite(ENB, abs(droite));
}
void avancer()       { moteurs(VITESSE, VITESSE); }
void reculer()       { moteurs(-VITESSE, -VITESSE); }
void tournerGauche() { moteurs(-VITESSE, VITESSE); }
void tournerDroite() { moteurs(VITESSE, -VITESSE); }
void arreter()       { moteurs(0, 0); }

int mesurer() {
  digitalWrite(PIN_TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);
  long duree = pulseIn(PIN_ECHO, HIGH, 30000);
  if (duree == 0) return 300;   // pas d'écho : la voie est libre
  return duree * 0.0343 / 2;
}

// Tourner la tête, attendre, mesurer
int regarder(int angle) {
  tete.write(angle);
  delay(350);
  return mesurer();
}

void setup() {
  pinMode(ENA, OUTPUT); pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(ENB, OUTPUT); pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
  pinMode(PIN_TRIG, OUTPUT); pinMode(PIN_ECHO, INPUT);
  tete.attach(PIN_TETE);
  tete.write(90);
  delay(2000);   // 2 secondes pour poser le Rouleur par terre
}

void loop() {
  int devant = mesurer();

  if (devant > DISTANCE_STOP) {
    avancer();                          // SI la route est libre : on fonce !
  } else {
    arreter();                          // SINON : on s'arrête,
    reculer(); delay(TEMPS_RECUL);      // on recule un peu,
    arreter();
    int gauche = regarder(REGARD_GAUCHE);   // on regarde à gauche,
    int droite = regarder(REGARD_DROITE);   // on regarde à droite,
    tete.write(90);
    if (gauche > droite) tournerGauche();   // et on part du côté le plus libre
    else tournerDroite();
    delay(TEMPS_VIRAGE);
    arreter();
  }
  delay(30);
}`
  };
  function highlight(src) {
    return esc(src).split("\n").map(line => {
      const ci = line.indexOf("//"); let code = ci >= 0 ? line.slice(0, ci) : line, com = ci >= 0 ? line.slice(ci) : "";
      code = code.replace(/("[^"]*")/g, '<span class="n">$1</span>')
        .replace(/\b(\d+)\b(?![^<]*>)/g, '<span class="n">$1</span>')
        .replace(/(#include|\b(?:void|const|bool|unsigned long|long|int|if|else|for|return|true|false)\b)(?![^<]*>)/g, '<span class="k">$1</span>');
      return code + (com ? '<span class="c">' + com + "</span>" : "");
    }).join("\n");
  }
  [["codeMotors", "motors"], ["codeHead", "head"], ["codeMain", "main"]].forEach(([id, k]) => { $(id).innerHTML = highlight(CODE[k]); });
  document.querySelectorAll(".copy").forEach(b => b.addEventListener("click", () => {
    const pre = b.parentElement.querySelector("pre"), txt = pre.innerText;
    const ok = () => { b.textContent = tr("Copié !", "Copied!"); setTimeout(() => b.textContent = tr("Copier", "Copy"), 1500); };
    const sel = () => { const r = document.createRange(); r.selectNodeContents(pre); const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = "Ctrl+C"; };
    try { navigator.clipboard.writeText(txt).then(ok, sel); } catch (e) { sel(); }
  }));

  /* ---------- Étapes ---------- */
  const done = store.get("lili-r3-steps") || {};
  const steps = [...document.querySelectorAll(".step")];
  const cheers = EN ? ["Well done!", "Great work!", "Keep it up!", "You're a real engineer!", "Another one done!"] : ["Bravo !", "Super travail !", "Continue comme ça !", "Tu es une vraie ingénieure !", "Encore une de faite !"];
  function stepUpd() { const n = steps.filter(s => s.classList.contains("is-done")).length; $("stepCount").textContent = n + " / " + steps.length + tr(" étapes", " steps"); $("stepBar").style.width = (100 * n / steps.length) + "%"; return n; }
  steps.forEach(s => {
    const k = s.dataset.step, btn = s.querySelector(".done-btn");
    const set = on => { s.classList.toggle("is-done", on); btn.textContent = on ? tr("✓ Fait", "✓ Done") : tr("C'est fait !", "Done!"); btn.setAttribute("aria-pressed", String(on)); };
    set(!!done[k]);
    btn.addEventListener("click", () => { const on = !s.classList.contains("is-done"); set(on); done[k] = on; store.set("lili-r3-steps", done); const n = stepUpd(); if (on) say(n === steps.length ? tr("Mission accomplie !", "Mission accomplished!") : cheers[n % cheers.length]); });
  });
  stepUpd();

  /* ---------- Menu actif ---------- */
  const links = [...document.querySelectorAll(".navlinks a")];
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
  ["comprendre", "courses", "montage"].forEach(id => io.observe($(id)));

  /* ---------- Simulateur : la chambre ---------- */
  // 1 pixel du canvas = 1 cm. La chambre fait 7 m × 4 m.
  const cv = $("simCanvas"), ctx = cv.getContext("2d");
  const W = cv.width, H = cv.height, WALL = 8, R = 14, CELL = 10;
  const DEFAULT_OBS = () => [
    { x: 40, y: 40, w: 200, h: 90, n: tr("lit", "bed") },
    { x: 480, y: 250, w: 120, h: 70, n: tr("bureau", "desk") },
    { x: 330, y: 120, w: 60, h: 60, n: tr("coffre", "toy box") },
    { x: 560, y: 40, w: 90, h: 50, n: tr("étagère", "shelf") }
  ];
  let obs = DEFAULT_OBS();
  const sl = { speed: $("simSpeed"), stop: $("simStop"), turn: $("simTurn") };
  const out = { speed: $("simSpeedOut"), stop: $("simStopOut"), turn: $("simTurnOut") };
  const P = () => ({ speed: +sl.speed.value, stop: +sl.stop.value, turn: +sl.turn.value });
  function showSl() { const p = P(); out.speed.textContent = p.speed; out.stop.textContent = p.stop + " cm"; out.turn.textContent = p.turn + " ms"; }
  Object.values(sl).forEach(s => s.addEventListener("input", showSl)); showSl();

  let bot, visited, freeCells, bumps, running = true, simTime = 0, fast = 1;
  function resetBot() {
    bot = { x: 300, y: 300, a: -Math.PI / 2, state: "go", t: 0, head: 0, dir: 1, lastL: 0, lastR: 0, seen: 300 };
    visited = new Uint8Array(Math.ceil(W / CELL) * Math.ceil(H / CELL)); bumps = 0; simTime = 0;
    countFree();
  }
  function countFree() {
    freeCells = 0;
    for (let gy = 0; gy < Math.ceil(H / CELL); gy++) for (let gx = 0; gx < Math.ceil(W / CELL); gx++) {
      const cx = gx * CELL + CELL / 2, cy = gy * CELL + CELL / 2;
      if (cx < WALL + R || cy < WALL + R || cx > W - WALL - R || cy > H - WALL - R) continue;
      if (obs.some(o => cx > o.x - R && cx < o.x + o.w + R && cy > o.y - R && cy < o.y + o.h + R)) continue;
      freeCells++;
    }
  }
  // Distance jusqu'au premier obstacle dans une direction (rayon)
  function ray(x, y, ang) {
    const dx = Math.cos(ang), dy = Math.sin(ang); let best = 300;
    const box = (x0, y0, x1, y1) => {
      let tmin = -Infinity, tmax = Infinity;
      for (const [p, d, lo, hi] of [[x, dx, x0, x1], [y, dy, y0, y1]]) {
        if (Math.abs(d) < 1e-9) { if (p < lo || p > hi) return; }
        else { let t1 = (lo - p) / d, t2 = (hi - p) / d; if (t1 > t2) [t1, t2] = [t2, t1]; tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2); }
      }
      if (tmax >= Math.max(0, tmin) && tmin >= 0 && tmin < best) best = tmin;
    };
    obs.forEach(o => box(o.x, o.y, o.x + o.w, o.y + o.h));
    // murs de la chambre
    if (dx > 0) best = Math.min(best, (W - WALL - x) / dx); if (dx < 0) best = Math.min(best, (WALL - x) / dx);
    if (dy > 0) best = Math.min(best, (H - WALL - y) / dy); if (dy < 0) best = Math.min(best, (WALL - y) / dy);
    return Math.max(0, best);
  }
  function hits(x, y) {
    if (x < WALL + R || y < WALL + R || x > W - WALL - R || y > H - WALL - R) return true;
    return obs.some(o => { const cx = Math.max(o.x, Math.min(x, o.x + o.w)), cy = Math.max(o.y, Math.min(y, o.y + o.h)); return Math.hypot(x - cx, y - cy) < R; });
  }
  const msgEl = $("simMsg"); let lastMsg = "";
  function msg(m) { if (m !== lastMsg) { msgEl.textContent = m; lastMsg = m; } }
  function sense(headAng) { const fx = bot.x + Math.cos(bot.a) * R, fy = bot.y + Math.sin(bot.a) * R; return Math.round(ray(fx, fy, bot.a + headAng)); }

  function step(dt) {
    const p = P(), v = p.speed / 255 * 90, w = p.speed / 255 * Math.PI * 1.2;
    bot.t += dt * 1000;
    const move = (sp) => {
      const nx = bot.x + Math.cos(bot.a) * sp * dt, ny = bot.y + Math.sin(bot.a) * sp * dt;
      if (hits(nx, ny)) { bumps++; bot.state = "back"; bot.t = 0; msg(tr("Boum ! L'obstacle était sur le côté : les yeux ne regardent que tout droit.", "Bump! The obstacle was off to the side: the eyes only look straight ahead.")); return; }
      bot.x = nx; bot.y = ny;
    };
    if (bot.state === "go") {
      bot.seen = sense(0);
      if (bot.seen > p.stop) { move(v); if (lastMsg.indexOf(tr("Boum", "Bump")) !== 0 || bot.t > 1500) msg(tr("Je roule… devant moi : ", "Rolling… ahead of me: ") + bot.seen + " cm"); }
      else { bot.state = "back"; bot.t = 0; msg(tr("Obstacle à ", "Obstacle at ") + bot.seen + tr(" cm ! Je m'arrête et je recule.", " cm! I stop and back up.")); }
    } else if (bot.state === "back") {
      const nx = bot.x - Math.cos(bot.a) * v * dt, ny = bot.y - Math.sin(bot.a) * v * dt;
      if (!hits(nx, ny)) { bot.x = nx; bot.y = ny; }
      if (bot.t > 300) { bot.state = "lookL"; bot.t = 0; }
    } else if (bot.state === "lookL") {
      bot.head = Math.min(1, bot.t / 250) * (-70 * Math.PI / 180);
      if (bot.t > 350) { bot.lastL = sense(-70 * Math.PI / 180); msg(tr("Je regarde à gauche : ", "Looking left: ") + bot.lastL + " cm"); bot.state = "lookR"; bot.t = 0; }
    } else if (bot.state === "lookR") {
      bot.head = (-70 + Math.min(1, bot.t / 250) * 140) * Math.PI / 180;
      if (bot.t > 350) {
        bot.lastR = sense(70 * Math.PI / 180); bot.head = 0;
        bot.dir = bot.lastL > bot.lastR ? -1 : 1; bot.state = "turn"; bot.t = 0;
        msg(tr("Gauche : ", "Left: ") + bot.lastL + tr(" cm, droite : ", " cm, right: ") + bot.lastR + tr(" cm. Je tourne à ", " cm. Turning ") + (bot.dir < 0 ? tr("gauche !", "left!") : tr("droite !", "right!")));
      }
    } else if (bot.state === "turn") {
      bot.a += bot.dir * w * dt;
      if (bot.t > p.turn) { bot.state = "go"; bot.t = 0; }
    }
    // la trace, comme la carte d'un robot aspirateur
    const gx = Math.floor(bot.x / CELL), gy = Math.floor(bot.y / CELL), cols = Math.ceil(W / CELL);
    for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) { const i = (gy + oy) * cols + gx + ox; if (i >= 0 && i < visited.length) visited[i] = 1; }
  }

  function css(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim() || "#2F6E2B"; }
  function draw() {
    const c = { floor: css("--surface-2"), wall: css("--green-deep"), trail: css("--lime"), obs: css("--surface"), obsLine: css("--line"), ink: css("--ink-soft"), green: css("--green"), warn: css("--warn") };
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = c.floor; ctx.fillRect(0, 0, W, H);
    // trace
    ctx.globalAlpha = 0.35; ctx.fillStyle = c.trail;
    const cols = Math.ceil(W / CELL);
    for (let i = 0; i < visited.length; i++) if (visited[i]) ctx.fillRect((i % cols) * CELL, Math.floor(i / cols) * CELL, CELL, CELL);
    ctx.globalAlpha = 1;
    // murs
    ctx.strokeStyle = c.wall; ctx.lineWidth = WALL * 2; ctx.strokeRect(0, 0, W, H);
    // meubles
    obs.forEach(o => {
      ctx.fillStyle = c.obs; ctx.strokeStyle = c.obsLine; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(o.x, o.y, o.w, o.h, 8) : ctx.rect(o.x, o.y, o.w, o.h); ctx.fill(); ctx.stroke();
      ctx.fillStyle = c.ink; ctx.font = "700 13px Nunito, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(o.n, o.x + o.w / 2, o.y + o.h / 2);
    });
    // rayon des yeux
    const p = P(), ha = bot.a + bot.head, fx = bot.x + Math.cos(bot.a) * R, fy = bot.y + Math.sin(bot.a) * R;
    const d = Math.min(ray(fx, fy, ha), 300), near = bot.state === "go" ? d <= p.stop : true;
    ctx.strokeStyle = near ? c.warn : c.green; ctx.lineWidth = 2; ctx.setLineDash([6, 5]);
    ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx + Math.cos(ha) * d, fy + Math.sin(ha) * d); ctx.stroke(); ctx.setLineDash([]);
    // zone d'arrêt
    ctx.globalAlpha = 0.18; ctx.fillStyle = c.warn; ctx.beginPath(); ctx.arc(fx, fy, p.stop, bot.a - 0.15, bot.a + 0.15); ctx.lineTo(fx, fy); ctx.fill(); ctx.globalAlpha = 1;
    // le Rouleur
    ctx.save(); ctx.translate(bot.x, bot.y); ctx.rotate(bot.a);
    ctx.fillStyle = "#1F4D1D"; ctx.fillRect(-9, -R - 3, 18, 5); ctx.fillRect(-9, R - 2, 18, 5);   // roues
    ctx.fillStyle = "#8CC63F"; ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#1F4D1D"; ctx.lineWidth = 2; ctx.stroke();
    ctx.rotate(bot.head); ctx.fillStyle = "#3D7DD8"; ctx.fillRect(R - 6, -6, 7, 12);   // tête
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(R - 1, -3, 2, 0, Math.PI * 2); ctx.arc(R - 1, 3, 2, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    // compteurs
    let n = 0; for (let i = 0; i < visited.length; i++) n += visited[i];
    $("simCover").textContent = Math.min(100, Math.round(100 * n / Math.max(1, freeCells))) + " %";
    $("simBumps").textContent = bumps;
    $("simTime").textContent = Math.floor(simTime) + " s";
  }
  let last = performance.now(), visible = true;
  new IntersectionObserver(es => visible = es[0].isIntersecting).observe(cv);
  function loop(now) {
    requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!visible) return;
    if (running) { const sub = 4 * fast; for (let i = 0; i < sub; i++) step(dt / 4); simTime += dt * fast; }
    draw();
  }
  // Ajouter ou enlever un meuble en cliquant
  cv.addEventListener("click", e => {
    const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) * W / r.width, y = (e.clientY - r.top) * H / r.height;
    const i = obs.findIndex(o => x > o.x && x < o.x + o.w && y > o.y && y < o.y + o.h);
    if (i >= 0) { obs.splice(i, 1); }
    else {
      const o = { x: x - 25, y: y - 25, w: 50, h: 50, n: tr("coussin", "cushion") };
      if (Math.hypot(bot.x - x, bot.y - y) < 50 || x < WALL + 30 || y < WALL + 30 || x > W - WALL - 30 || y > H - WALL - 30) return;
      obs.push(o);
    }
    countFree();
  });
  $("simPlay").addEventListener("click", () => { running = !running; $("simPlay").textContent = running ? "❚❚ Pause" : tr("▶ Reprendre", "▶ Resume"); });
  $("simFast").addEventListener("click", () => { fast = fast === 1 ? 4 : 1; $("simFast").textContent = fast === 1 ? "⏩ ×4" : "▶ ×1"; $("simFast").setAttribute("aria-pressed", String(fast > 1)); });
  $("simReset").addEventListener("click", () => { obs = DEFAULT_OBS(); resetBot(); msg(tr("Chambre rangée ! Le Rouleur repart du milieu.", "Room tidied! The Roller starts again from the middle.")); });
  resetBot();
  if (reduceMotion) { running = false; $("simPlay").textContent = tr("▶ Reprendre", "▶ Resume"); }
  requestAnimationFrame(loop);
})();

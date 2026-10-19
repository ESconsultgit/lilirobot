/* L'Enseigne lumineuse V2 : fabrique le programme Arduino à partir des réglages de la page. */
(function(root){
  function cstr(s){ return '"'+String(s).replace(/\\/g,"\\\\").replace(/"/g,'\\"')+'"'; }
  function make(c, lang){
    const FR = lang !== "en";
    const msgs = (c.messages||[]).filter(m=>m.trim()).slice(0,6);
    const list = msgs.length ? msgs.map(m=>"  "+cstr(m)).join(",\n") : "  "+cstr("");
    const n = msgs.length;
    if (FR) return `// ===========================================================
//  L'Enseigne lumineuse V2 · Le panneau défilant
//  Quand quelqu'un arrive, le panneau se réveille et dit bonjour !
// ===========================================================
#include <MD_Parola.h>
#include <MD_MAX72xx.h>
#include <SPI.h>

// ----- Les branchements -----
#define HARDWARE_TYPE MD_MAX72XX::FC16_HW  // lettres mélangées ? essaie GENERIC_HW
const int NB_MODULES   = 4;   // un panneau « 4 en 1 » = 4 carrés de 8 × 8
const int PIN_CS       = 10;  // DIN va sur D11 et CLK sur D13
const int PIN_PRESENCE = 2;   // la patte OUT du détecteur

// ----- Tes messages -----
const char *BIENVENUE = ${cstr(c.welcome)};
const char *MESSAGES[] = {
${list}
};
const int NB_MESSAGES = ${n};   // combien de messages il y a au-dessus

// ----- Les réglages de Lili -----
int  VITESSE      = ${c.speed};     // plus petit = plus rapide
int  LUMIERE      = ${c.light};      // de 0 (doux) à 15 (très fort)
long RESTE_ALLUME = ${c.stay};     // secondes allumé après le dernier passage
bool TOUJOURS_ALLUME = ${c.always ? "true" : "false"};  // true = ne s'éteint jamais

MD_Parola panneau = MD_Parola(HARDWARE_TYPE, PIN_CS, NB_MODULES);
char texte[160];                 // le message en train de défiler
int  numero = 0;                 // 0 = la bienvenue, puis les autres messages
bool allume = false;
unsigned long dernierPassage = 0;

// Le panneau connaît les lettres avec accents, mais il faut les « traduire » pour lui.
void preparer(const char *source) {
  int j = 0;
  for (int i = 0; source[i] != 0 && j < (int)sizeof(texte) - 1; i++) {
    unsigned char c = source[i];
    if (c < 0x80) texte[j++] = c;                                   // lettre normale
    else if (c == 0xC3 && source[i + 1]) texte[j++] = (unsigned char)source[++i] + 0x40;  // é, è, à, ç…
    else if (c == 0xC2 && source[i + 1]) texte[j++] = source[++i];         // °, «, »…
  }                                                                  // le reste (émojis) est ignoré
  texte[j] = 0;
}

// Lance le message suivant : d'abord la bienvenue, puis les autres, chacun son tour.
void messageSuivant() {
  if (numero == 0) preparer(BIENVENUE);
  else preparer(MESSAGES[numero - 1]);
  numero = (numero + 1) % (NB_MESSAGES + 1);
  panneau.displayText(texte, PA_CENTER, VITESSE, 0, PA_SCROLL_LEFT, PA_SCROLL_LEFT);
}

void reveiller() {
  allume = true;
  numero = 0;                    // on commence toujours par dire bonjour
  panneau.displayShutdown(false);
  messageSuivant();
}

void endormir() {
  allume = false;
  panneau.displayClear();
  panneau.displayShutdown(true); // le panneau s'éteint complètement
}

void setup() {
  pinMode(PIN_PRESENCE, INPUT);
  panneau.begin();
  panneau.setIntensity(LUMIERE);
  if (TOUJOURS_ALLUME) reveiller();
  else endormir();
}

void loop() {
  // 1. Les yeux : quelqu'un passe devant ?
  bool quelquun = (digitalRead(PIN_PRESENCE) == HIGH);
  if (quelquun) dernierPassage = millis();

  // 2. Le cerveau décide
  if (quelquun && !allume) reveiller();          // bonjour !

  // 3. Le panneau fait défiler. displayAnimate() dit « fini » à la fin d'un message.
  if (allume && panneau.displayAnimate()) {
    bool plusPersonne = (millis() - dernierPassage > RESTE_ALLUME * 1000UL);
    if (plusPersonne && !TOUJOURS_ALLUME) endormir();
    else messageSuivant();
  }
}
`;
    return `// ===========================================================
//  The Light-up Sign V2 · The scrolling sign
//  When someone comes by, the sign wakes up and says hello!
// ===========================================================
#include <MD_Parola.h>
#include <MD_MAX72xx.h>
#include <SPI.h>

// ----- The wiring -----
#define HARDWARE_TYPE MD_MAX72XX::FC16_HW  // jumbled letters? try GENERIC_HW
const int NUM_MODULES   = 4;   // a "4-in-1" panel = 4 squares of 8 × 8
const int PIN_CS        = 10;  // DIN goes to D11 and CLK to D13
const int PIN_PRESENCE  = 2;   // the sensor's OUT pin

// ----- Your messages -----
const char *WELCOME = ${cstr(c.welcome)};
const char *MESSAGES[] = {
${list}
};
const int NUM_MESSAGES = ${n};   // how many messages there are above

// ----- Lili's settings -----
int  SPEED       = ${c.speed};     // smaller = faster
int  BRIGHTNESS  = ${c.light};      // from 0 (soft) to 15 (very bright)
long STAY_ON     = ${c.stay};     // seconds it stays on after the last visitor
bool ALWAYS_ON   = ${c.always ? "true" : "false"};  // true = never switches off

MD_Parola sign = MD_Parola(HARDWARE_TYPE, PIN_CS, NUM_MODULES);
char text[160];                  // the message that is scrolling
int  number = 0;                 // 0 = the welcome, then the other messages
bool on = false;
unsigned long lastVisit = 0;

// The sign knows accented letters, but they need "translating" for it.
void prepare(const char *source) {
  int j = 0;
  for (int i = 0; source[i] != 0 && j < (int)sizeof(text) - 1; i++) {
    unsigned char c = source[i];
    if (c < 0x80) text[j++] = c;                                    // normal letter
    else if (c == 0xC3 && source[i + 1]) text[j++] = (unsigned char)source[++i] + 0x40;   // é, è, à, ç…
    else if (c == 0xC2 && source[i + 1]) text[j++] = source[++i];          // °, «, »…
  }                                                                  // anything else (emojis) is skipped
  text[j] = 0;
}

// Starts the next message: the welcome first, then the others, one at a time.
void nextMessage() {
  if (number == 0) prepare(WELCOME);
  else prepare(MESSAGES[number - 1]);
  number = (number + 1) % (NUM_MESSAGES + 1);
  sign.displayText(text, PA_CENTER, SPEED, 0, PA_SCROLL_LEFT, PA_SCROLL_LEFT);
}

void wakeUp() {
  on = true;
  number = 0;                    // always start by saying hello
  sign.displayShutdown(false);
  nextMessage();
}

void goToSleep() {
  on = false;
  sign.displayClear();
  sign.displayShutdown(true);    // the sign switches off completely
}

void setup() {
  pinMode(PIN_PRESENCE, INPUT);
  sign.begin();
  sign.setIntensity(BRIGHTNESS);
  if (ALWAYS_ON) wakeUp();
  else goToSleep();
}

void loop() {
  // 1. The eyes: is someone walking by?
  bool someone = (digitalRead(PIN_PRESENCE) == HIGH);
  if (someone) lastVisit = millis();

  // 2. The brain decides
  if (someone && !on) wakeUp();                  // hello!

  // 3. The sign scrolls. displayAnimate() says "done" at the end of a message.
  if (on && sign.displayAnimate()) {
    bool nobodyLeft = (millis() - lastVisit > STAY_ON * 1000UL);
    if (nobodyLeft && !ALWAYS_ON) goToSleep();
    else nextMessage();
  }
}
`;
  }
  function test(lang){
    if (lang === "en") return `// Test: does the LED sign work?
#include <MD_Parola.h>
#include <MD_MAX72xx.h>
#include <SPI.h>

#define HARDWARE_TYPE MD_MAX72XX::FC16_HW  // jumbled letters? try GENERIC_HW
MD_Parola sign = MD_Parola(HARDWARE_TYPE, 10, 4);   // CS on D10, 4 modules

void setup() {
  sign.begin();
  sign.setIntensity(2);          // soft light for the test
  sign.displayText("Hello!", PA_CENTER, 50, 1000, PA_SCROLL_LEFT, PA_SCROLL_LEFT);
}

void loop() {
  if (sign.displayAnimate()) sign.displayReset();   // start again, forever
}
`;
    return `// Test : est-ce que le panneau LED marche ?
#include <MD_Parola.h>
#include <MD_MAX72xx.h>
#include <SPI.h>

#define HARDWARE_TYPE MD_MAX72XX::FC16_HW  // lettres mélangées ? essaie GENERIC_HW
MD_Parola panneau = MD_Parola(HARDWARE_TYPE, 10, 4);   // CS sur D10, 4 modules

void setup() {
  panneau.begin();
  panneau.setIntensity(2);       // lumière douce pour le test
  panneau.displayText("Coucou !", PA_CENTER, 50, 1000, PA_SCROLL_LEFT, PA_SCROLL_LEFT);
}

void loop() {
  if (panneau.displayAnimate()) panneau.displayReset();   // on recommence, sans fin
}
`;
  }
  const api = { make, test };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.PanneauCode = api;
})(this);
